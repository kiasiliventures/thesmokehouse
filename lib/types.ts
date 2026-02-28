export type MenuCategory = "roasted_meat" | "sides" | "drinks";

export type OrderStatus = "received" | "preparing" | "ready" | "picked_up";

export interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  category: MenuCategory;
  price: number;
  image_url: string | null;
  is_available: boolean;
}

export interface CartItem {
  menu_item_id: string;
  name: string;
  price: number;
  qty: number;
  image_url?: string | null;
}

export interface OrderItem {
  id: string;
  menu_item_id: string;
  quantity: number;
  price_at_time: number;
  menu_items?: Pick<MenuItem, "name" | "image_url">;
}

export interface Order {
  id: string;
  order_number: number;
  public_token: string;
  pickup_code: string;
  name: string;
  phone: string;
  status: OrderStatus;
  pickup_time: string;
  notes?: string | null;
  total_amount: number;
  created_at: string;
  items?: OrderItem[];
}
