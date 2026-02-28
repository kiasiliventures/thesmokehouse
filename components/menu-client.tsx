"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import { MenuItem, MenuCategory } from "@/lib/types";
import { useCartStore } from "@/lib/store";
import { formatCurrency } from "@/lib/format";

const CATEGORIES: { key: MenuCategory; label: string }[] = [
  { key: "roasted_meat", label: "Roasted Meat" },
  { key: "sides", label: "Sides" },
  { key: "drinks", label: "Drinks" }
];

export function MenuClient({ items }: { items: MenuItem[] }) {
  const [active, setActive] = useState<MenuCategory>("roasted_meat");
  const addItem = useCartStore((s) => s.addItem);
  const cartItems = useCartStore((s) => s.items);
  const total = useCartStore((s) => s.total);
  const count = useCartStore((s) => s.count);

  const filtered = useMemo(() => items.filter((item) => item.category === active), [active, items]);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-28 pt-4 md:px-8 md:pb-10">
      <div className="mb-4 flex gap-2 overflow-auto pb-1">
        {CATEGORIES.map((cat) => {
          const activeCls = active === cat.key ? "bg-ember text-white" : "bg-sand text-walnut";
          return (
            <button
              type="button"
              key={cat.key}
              onClick={() => setActive(cat.key)}
              className={`min-w-fit rounded-full px-4 py-2 text-sm font-semibold transition ${activeCls}`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {filtered.map((item) => (
          <article key={item.id} className="overflow-hidden rounded-2xl bg-white shadow-card">
            <div className="relative h-40 w-full bg-sand">
              {item.image_url ? (
                <Image src={item.image_url} alt={item.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 25vw" />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-wood">Smoked to perfection</div>
              )}
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-walnut">{item.name}</h3>
              <p className="mt-1 min-h-10 text-sm text-stone-600">{item.description ?? "House-smoked favorite"}</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-base font-bold text-walnut">{formatCurrency(item.price)}</span>
                <button
                  type="button"
                  onClick={() => addItem({ menu_item_id: item.id, name: item.name, price: item.price, image_url: item.image_url })}
                  className="btn-primary rounded-xl px-4 py-2 text-sm font-semibold"
                >
                  Add
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      <aside className="sticky top-6 mt-6 hidden self-start rounded-2xl border border-[#d8c5b0] bg-[#fff8ef] p-4 md:block">
        <h2 className="text-lg font-bold text-walnut">Cart</h2>
        <p className="mt-1 text-sm text-stone-700">{count()} items</p>
        <p className="mt-2 text-xl font-bold text-walnut">{formatCurrency(total())}</p>
        <Link href="/cart" className="btn-primary mt-4 inline-block rounded-xl px-4 py-2 text-sm font-semibold">
          View Cart
        </Link>
      </aside>

      <Link
        href="/cart"
        className="fixed bottom-4 left-4 right-4 z-40 flex items-center justify-between rounded-2xl bg-walnut px-4 py-3 text-cream shadow-xl md:hidden"
      >
        <span className="text-sm font-semibold">{count()} items</span>
        <span className="text-base font-bold">{formatCurrency(total())}</span>
        <span className="rounded-lg bg-ember px-3 py-1 text-sm font-semibold text-white">View Cart</span>
      </Link>

      {cartItems.length === 0 ? null : <div className="h-20 md:hidden" />}
    </div>
  );
}
