-- add_brands_and_brand_to_products.sql

-- create brands table
create table if not exists public.brands (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  image_url text,
  created_at timestamp with time zone not null default now()
);

-- add brand_id to products table
alter table public.products
  add column if not exists brand_id uuid references public.brands(id);

-- create index for performance
create index if not exists idx_products_brand_id on public.products(brand_id);

-- insert some sample brands
insert into public.brands (id, name)
values
  ('brand-dell', 'DELL'),
  ('brand-lenovo', 'LENOVO'),
  ('brand-xerox', 'XEROX'),
  ('brand-hikvision', 'HIKVISION'),
  ('brand-cisco', 'CISCO'),
  ('brand-hp', 'HP')
on conflict (id) do nothing;