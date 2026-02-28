import { NextResponse } from "next/server";
import { getMockOrderByPublicToken } from "@/lib/mock-db";
import { getSupabaseAdmin, hasSupabaseConfig } from "@/lib/supabase";

export const dynamic = "force-dynamic";

interface Params {
  params: Promise<{ public_token: string }>;
}

interface CustomerOrderRow {
  id: string;
  order_number: number;
  public_token: string;
  pickup_code: string;
  name: string;
  phone: string;
  status: string;
  pickup_time: string;
  notes: string | null;
  total_amount: number;
  created_at: string;
  order_items: Array<{
    id: string;
    menu_item_id: string;
    quantity: number;
    price_at_time: number;
    menu_items: { name: string; image_url: string | null } | null;
  }>;
}

export async function GET(_req: Request, { params }: Params) {
  const { public_token } = await params;

  if (!hasSupabaseConfig()) {
    const order = getMockOrderByPublicToken(public_token);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    return NextResponse.json(order);
  }

  const { data, error } = await getSupabaseAdmin()
    .from("orders")
    .select(
      "id,order_number,public_token,pickup_code,name,phone,status,pickup_time,notes,total_amount,created_at,order_items(id,menu_item_id,quantity,price_at_time,menu_items(name,image_url))"
    )
    .eq("public_token", public_token)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const order = data as unknown as CustomerOrderRow;

  return NextResponse.json({
    id: order.id,
    order_number: order.order_number,
    public_token: order.public_token,
    pickup_code: order.pickup_code,
    name: order.name,
    phone: order.phone,
    status: order.status,
    pickup_time: order.pickup_time,
    notes: order.notes,
    total_amount: order.total_amount,
    created_at: order.created_at,
    items: order.order_items
  });
}
