create extension if not exists pgcrypto;

create sequence if not exists order_number_seq start 1001;

create table if not exists menu_items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  category text not null check (category in ('roasted_meat', 'sides', 'drinks')),
  price integer not null check (price > 0),
  image_url text,
  is_available boolean default true,
  created_at timestamptz default now()
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  order_number bigint not null unique default nextval('order_number_seq'),
  public_token text unique not null,
  pickup_code text not null check (pickup_code ~ '^[0-9]{4}$'),
  name text not null,
  phone text not null,
  notes text,
  status text not null check (status in ('received', 'preparing', 'ready', 'picked_up')),
  pickup_time text not null,
  total_amount integer not null check (total_amount > 0),
  created_at timestamptz default now()
);

create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  menu_item_id uuid not null references menu_items(id),
  quantity integer not null check (quantity > 0),
  price_at_time integer not null check (price_at_time > 0)
);

create index if not exists idx_orders_public_token on orders(public_token);
create index if not exists idx_orders_created_at on orders(created_at desc);
create index if not exists idx_order_items_order_id on order_items(order_id);

-- Optional defense-in-depth RLS (recommended even with service-role server writes)
alter table menu_items enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;

-- Public read-only menu policy if you later expose anon client reads directly.
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'menu_items' and policyname = 'menu_public_read'
  ) then
    create policy menu_public_read on menu_items
      for select
      using (is_available = true);
  end if;
end $$;
