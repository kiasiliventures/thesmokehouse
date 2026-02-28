import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { CartItem } from "@/lib/types";

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "qty">) => void;
  updateQty: (menu_item_id: string, qty: number) => void;
  removeItem: (menu_item_id: string) => void;
  clear: () => void;
  total: () => number;
  count: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const existing = get().items.find((i) => i.menu_item_id === item.menu_item_id);
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.menu_item_id === item.menu_item_id ? { ...i, qty: Math.min(i.qty + 1, 20) } : i
            )
          });
          return;
        }
        set({ items: [...get().items, { ...item, qty: 1 }] });
      },
      updateQty: (menu_item_id, qty) => {
        if (qty <= 0) {
          set({ items: get().items.filter((i) => i.menu_item_id !== menu_item_id) });
          return;
        }
        set({
          items: get().items.map((i) => (i.menu_item_id === menu_item_id ? { ...i, qty: Math.min(qty, 20) } : i))
        });
      },
      removeItem: (menu_item_id) => set({ items: get().items.filter((i) => i.menu_item_id !== menu_item_id) }),
      clear: () => set({ items: [] }),
      total: () => get().items.reduce((acc, item) => acc + item.price * item.qty, 0),
      count: () => get().items.reduce((acc, item) => acc + item.qty, 0)
    }),
    {
      name: "smokehouse-cart",
      storage: createJSONStorage(() => localStorage)
    }
  )
);
