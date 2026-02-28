"use client";

import Link from "next/link";
import { useCartStore } from "@/lib/store";
import { formatCurrency } from "@/lib/format";
import { useCartHydration } from "@/lib/use-cart-hydration";

export function CartView({ showCheckout = true }: { showCheckout?: boolean }) {
  const items = useCartStore((s) => s.items);
  const updateQty = useCartStore((s) => s.updateQty);
  const removeItem = useCartStore((s) => s.removeItem);
  const total = useCartStore((s) => s.total);
  const hydrated = useCartHydration();

  const safeItems = hydrated ? items : [];
  const safeTotal = hydrated ? total() : 0;

  if (safeItems.length === 0) {
    return (
      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-6 text-center shadow-card">
        <h2 className="text-xl font-semibold text-walnut">Your cart is empty</h2>
        <Link href="/" className="btn-primary mt-4 inline-block rounded-xl px-4 py-2 text-sm font-semibold">
          Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-4 lg:grid-cols-[2fr_1fr]">
      <div className="space-y-3">
        {safeItems.map((item) => (
          <div key={item.menu_item_id} className="rounded-2xl bg-white p-4 shadow-card">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-walnut">{item.name}</h3>
                <p className="text-sm text-stone-600">{formatCurrency(item.price)} each</p>
              </div>
              <button type="button" onClick={() => removeItem(item.menu_item_id)} className="text-sm font-semibold text-ember">
                Remove
              </button>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <button
                type="button"
                onClick={() => updateQty(item.menu_item_id, item.qty - 1)}
                className="h-10 w-10 rounded-lg border border-[#ccb69f] bg-sand text-lg"
              >
                -
              </button>
              <span className="w-8 text-center font-semibold">{item.qty}</span>
              <button
                type="button"
                onClick={() => updateQty(item.menu_item_id, item.qty + 1)}
                className="h-10 w-10 rounded-lg border border-[#ccb69f] bg-sand text-lg"
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>

      <aside className="h-fit rounded-2xl bg-white p-4 shadow-card lg:sticky lg:top-6">
        <h2 className="text-lg font-bold text-walnut">Summary</h2>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-stone-700">Total</span>
          <span className="text-xl font-bold text-walnut">{formatCurrency(safeTotal)}</span>
        </div>
        {showCheckout ? (
          <Link href="/checkout" className="btn-primary mt-4 block rounded-xl px-4 py-3 text-center text-sm font-semibold">
            Continue to Checkout
          </Link>
        ) : null}
      </aside>
    </div>
  );
}
