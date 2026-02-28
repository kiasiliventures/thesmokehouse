"use client";

import { useEffect } from "react";
import { useCartStore } from "@/lib/store";

export function useCartHydration(): boolean {
  const hydrated = useCartStore((s) => s.hasHydrated);

  useEffect(() => {
    if (!useCartStore.persist.hasHydrated()) {
      void useCartStore.persist.rehydrate();
    }
  }, []);

  return hydrated;
}
