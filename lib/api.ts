import { MenuItem, Order, OrderStatus } from "@/lib/types";

export interface CreateOrderPayload {
  items: { menu_item_id: string; qty: number }[];
  pickup_time: string;
  name: string;
  phone: string;
  notes?: string;
}

export async function getMenu(): Promise<MenuItem[]> {
  const res = await fetch("/api/menu", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch menu");
  return res.json();
}

export async function createOrder(payload: CreateOrderPayload): Promise<{
  public_token: string;
  order_number: number;
  pickup_code: string;
}> {
  const res = await fetch("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Failed to place order" }));
    throw new Error(err.error ?? "Failed to place order");
  }

  return res.json();
}

export async function getOrderByPublicToken(publicToken: string): Promise<Order> {
  const res = await fetch(`/api/orders/${publicToken}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Order not found");
  return res.json();
}

export async function updateAdminOrderStatus(id: string, status: OrderStatus, adminPassword: string): Promise<Order> {
  const res = await fetch(`/api/admin/orders/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "x-admin-password": adminPassword
    },
    body: JSON.stringify({ status })
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Failed to update status" }));
    throw new Error(err.error ?? "Failed to update status");
  }

  return res.json();
}
