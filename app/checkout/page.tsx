import Link from "next/link";
import { CheckoutForm } from "@/components/checkout-form";

export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-cream px-4 py-6 md:px-8">
      <div className="mx-auto mb-4 flex max-w-6xl items-center justify-between">
        <h1 className="text-3xl font-bold text-walnut">Checkout</h1>
        <Link href="/cart" className="text-sm font-semibold text-ember">
          Back to Cart
        </Link>
      </div>
      <CheckoutForm />
    </main>
  );
}
