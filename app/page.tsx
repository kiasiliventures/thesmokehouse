import Image from "next/image";
import { MenuClient } from "@/components/menu-client";
import { getMockMenuItems } from "@/lib/mock-db";
import { getSupabaseAdmin, hasSupabaseConfig } from "@/lib/supabase";
import { MenuItem } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let menuItems: MenuItem[] = [];

  if (!hasSupabaseConfig()) {
    menuItems = getMockMenuItems();
  } else {
    const { data: items } = await getSupabaseAdmin()
      .from("menu_items")
      .select("id,name,description,category,price,image_url,is_available")
      .eq("is_available", true)
      .order("category")
      .order("name");

    menuItems = (items ?? []) as unknown as MenuItem[];
  }

  return (
    <main className="min-h-screen bg-cream">
      <div className="header-wood-strip h-3 w-full" />

      <section className="mx-auto grid max-w-7xl gap-4 px-4 pb-4 pt-5 md:grid-cols-[1.4fr_1fr] md:px-8 md:pt-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-ember">Takeaway Smokehouse</p>
          <h1 className="mt-2 text-4xl font-extrabold text-walnut md:text-5xl">The Smoke House</h1>
          <p className="mt-3 max-w-xl text-stone-700">
            Family-friendly premium smoked meats, comfort sides, and fresh drinks. Order as a guest and track in real time.
          </p>
        </div>
        <div className="relative h-48 overflow-hidden rounded-3xl md:h-56">
          <Image
            src="https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&w=1400&q=80"
            alt="Smoked brisket platter"
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 30vw"
          />
        </div>
      </section>

      <MenuClient items={menuItems} />
    </main>
  );
}
