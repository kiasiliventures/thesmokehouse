import Link from "next/link";
import { CartView } from "@/components/cart-view";

export default function CartPage() {
  return (
    <main className="min-h-screen bg-cream px-4 py-6 md:px-8">
      <div className="mx-auto mb-4 flex max-w-5xl items-center justify-between">
        <h1 className="text-3xl font-bold text-walnut">Your Cart</h1>
        <Link href="/" className="text-sm font-semibold text-ember">
          Continue Shopping
        </Link>
      </div>
      <CartView />
    </main>
  );
}
