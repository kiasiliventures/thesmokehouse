"use client";

import { FormEvent, useEffect, useState } from "react";
import { Order, OrderStatus } from "@/lib/types";
import { formatCurrency, formatStatus } from "@/lib/format";
import { updateAdminOrderStatus } from "@/lib/api";

const ORDER_FLOW: OrderStatus[] = ["received", "preparing", "ready", "picked_up"];

export function AdminDashboard() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function loadOrders(pass: string) {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/orders", {
        headers: { "x-admin-password": pass },
        cache: "no-store"
      });

      if (!res.ok) throw new Error("Invalid password or failed to load orders");
      const data = (await res.json()) as Order[];
      setOrders(data);
      setAuthed(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
      setAuthed(false);
    } finally {
      setLoading(false);
    }
  }

  async function onLogin(e: FormEvent) {
    e.preventDefault();
    await loadOrders(password);
  }

  async function onStatusChange(orderId: string, status: OrderStatus) {
    try {
      const updated = await updateAdminOrderStatus(orderId, status, password);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: updated.status } : o)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    }
  }

  useEffect(() => {
    if (!authed) return;
    const timer = setInterval(() => {
      void loadOrders(password);
    }, 15000);
    return () => clearInterval(timer);
  }, [authed, password]);

  if (!authed) {
    return (
      <form onSubmit={onLogin} className="mx-auto max-w-md rounded-2xl bg-white p-6 shadow-card">
        <h1 className="text-xl font-bold text-walnut">Kitchen Dashboard Login</h1>
        <p className="mt-1 text-sm text-stone-600">Enter admin password to manage orders.</p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-4 w-full rounded-xl px-3 py-2"
          placeholder="Admin password"
          required
        />
        {error ? <p className="mt-3 text-sm text-red-700">{error}</p> : null}
        <button type="submit" className="btn-primary mt-4 w-full rounded-xl px-4 py-2 font-semibold">
          {loading ? "Checking..." : "Login"}
        </button>
      </form>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-walnut">Live Orders</h1>
      {error ? <p className="rounded-lg bg-red-100 px-3 py-2 text-sm text-red-700">{error}</p> : null}
      <div className="grid gap-3">
        {orders.map((order) => (
          <article key={order.id} className="rounded-2xl bg-white p-4 shadow-card">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-lg font-bold text-walnut">#{order.order_number}</p>
                <p className="text-sm text-stone-600">
                  {order.name} • {order.phone}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-ember">Pickup code: {order.pickup_code}</p>
                <p className="text-sm text-stone-700">{formatCurrency(order.total_amount)}</p>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="rounded-full bg-sand px-3 py-1 text-sm font-semibold text-walnut">{formatStatus(order.status)}</span>
              <select
                value={order.status}
                onChange={(e) => onStatusChange(order.id, e.target.value as OrderStatus)}
                className="rounded-lg px-3 py-2"
              >
                {ORDER_FLOW.map((status) => (
                  <option key={status} value={status}>
                    {formatStatus(status)}
                  </option>
                ))}
              </select>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
