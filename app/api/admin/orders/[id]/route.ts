import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin, hasSupabaseConfig } from "@/lib/supabase";
import { updateMockOrderStatus } from "@/lib/mock-db";
import { statusSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

interface Params {
  params: Promise<{ id: string }>;
}

function isAdmin(req: NextRequest): boolean {
  const supplied = req.headers.get("x-admin-password");
  return Boolean(process.env.ADMIN_PASSWORD && supplied === process.env.ADMIN_PASSWORD);
}

export async function PATCH(req: NextRequest, { params }: Params) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parseStatus = statusSchema.safeParse(body?.status);

  if (!parseStatus.success) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  if (!hasSupabaseConfig()) {
    const updated = updateMockOrderStatus(id, parseStatus.data);
    if (!updated) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    return NextResponse.json(updated);
  }

  const { data, error } = await getSupabaseAdmin()
    .from("orders")
    .update({ status: parseStatus.data })
    .eq("id", id)
    .select("id,order_number,public_token,status,pickup_code,total_amount,created_at")
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json(data);
}
