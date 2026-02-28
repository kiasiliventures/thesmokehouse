import { NextRequest, NextResponse } from "next/server";
import { getMockAdminOrders } from "@/lib/mock-db";
import { getSupabaseAdmin, hasSupabaseConfig } from "@/lib/supabase";

export const dynamic = "force-dynamic";

function isAdmin(req: NextRequest): boolean {
  const supplied = req.headers.get("x-admin-password");
  return Boolean(process.env.ADMIN_PASSWORD && supplied === process.env.ADMIN_PASSWORD);
}

export async function GET(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!hasSupabaseConfig()) {
    return NextResponse.json(getMockAdminOrders());
  }

  const { data, error } = await getSupabaseAdmin()
    .from("orders")
    .select("id,order_number,name,phone,status,pickup_time,total_amount,created_at,pickup_code")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }

  return NextResponse.json(data);
}
