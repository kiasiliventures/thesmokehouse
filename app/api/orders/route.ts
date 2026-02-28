import { NextRequest, NextResponse } from "next/server";
import { createMockOrder } from "@/lib/mock-db";
import { generatePickupCode, generatePublicToken } from "@/lib/order-utils";
import { allowOrder } from "@/lib/rate-limit";
import { getSupabaseAdmin, hasSupabaseConfig } from "@/lib/supabase";
import { createOrderSchema, getClientIp } from "@/lib/validation";

export const dynamic = "force-dynamic";

interface MenuPriceRow {
  id: string;
  price: number;
  is_available: boolean;
}

interface CreatedOrderRow {
  id: string;
  order_number: number;
  public_token: string;
  pickup_code: string;
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = createOrderSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid order payload" }, { status: 400 });
  }

  const input = parsed.data;
  const ip = getClientIp(req.headers.get("x-forwarded-for"));
  const rateCheck = allowOrder(ip, input.phone);

  if (!rateCheck.ok) {
    return NextResponse.json({ error: rateCheck.reason }, { status: 429 });
  }

  if (!hasSupabaseConfig()) {
    try {
      const order = createMockOrder(input);
      return NextResponse.json(order);
    } catch (error) {
      return NextResponse.json(
        { error: error instanceof Error ? error.message : "Failed to create mock order" },
        { status: 400 }
      );
    }
  }

  const ids = Array.from(new Set(input.items.map((i) => i.menu_item_id)));

  const { data: menuItems, error: menuError } = await getSupabaseAdmin()
    .from("menu_items")
    .select("id,price,is_available")
    .in("id", ids);

  if (menuError || !menuItems) {
    return NextResponse.json({ error: "Could not validate menu items" }, { status: 500 });
  }

  const safeMenuItems = menuItems as unknown as MenuPriceRow[];
  const menuMap = new Map(safeMenuItems.map((item: MenuPriceRow) => [item.id, item]));

  let total = 0;
  const orderItemsToInsert: { menu_item_id: string; quantity: number; price_at_time: number }[] = [];

  for (const item of input.items) {
    const dbItem = menuMap.get(item.menu_item_id);
    if (!dbItem || !dbItem.is_available) {
      return NextResponse.json({ error: "One or more menu items are unavailable" }, { status: 400 });
    }

    total += dbItem.price * item.qty;

    orderItemsToInsert.push({
      menu_item_id: item.menu_item_id,
      quantity: item.qty,
      price_at_time: dbItem.price
    });
  }

  if (total <= 0) {
    return NextResponse.json({ error: "Invalid order total" }, { status: 400 });
  }

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const { data: createdOrder, error: orderError } = await getSupabaseAdmin()
      .from("orders")
      .insert({
        public_token: generatePublicToken(),
        pickup_code: generatePickupCode(),
        name: input.name,
        phone: input.phone,
        notes: input.notes || null,
        status: "received",
        pickup_time: input.pickup_time,
        total_amount: total
      })
      .select("id,order_number,public_token,pickup_code")
      .single();

    if (orderError || !createdOrder) {
      const isUniqueConflict = orderError?.code === "23505";
      if (isUniqueConflict) continue;
      return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
    }

    const orderRow = createdOrder as unknown as CreatedOrderRow;

    const rows = orderItemsToInsert.map((row) => ({
      order_id: orderRow.id,
      ...row
    }));

    const { error: itemsError } = await getSupabaseAdmin().from("order_items").insert(rows);

    if (itemsError) {
      await getSupabaseAdmin().from("orders").delete().eq("id", orderRow.id);
      return NextResponse.json({ error: "Failed to save order items" }, { status: 500 });
    }

    return NextResponse.json({
      public_token: orderRow.public_token,
      order_number: orderRow.order_number,
      pickup_code: orderRow.pickup_code
    });
  }

  return NextResponse.json({ error: "Could not generate secure order token" }, { status: 500 });
}
