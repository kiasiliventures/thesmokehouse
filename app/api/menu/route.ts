import { NextResponse } from "next/server";
import { getMockMenuItems } from "@/lib/mock-db";
import { getSupabaseAdmin, hasSupabaseConfig } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!hasSupabaseConfig()) {
    return NextResponse.json(getMockMenuItems());
  }

  const { data, error } = await getSupabaseAdmin()
    .from("menu_items")
    .select("id,name,description,category,price,image_url,is_available")
    .eq("is_available", true)
    .order("category")
    .order("name");

  if (error) {
    return NextResponse.json({ error: "Failed to fetch menu" }, { status: 500 });
  }

  return NextResponse.json(data);
}
