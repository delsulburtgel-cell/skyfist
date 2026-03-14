-- add_brands_and_brand_to_products.sql

-- create brands table
create table if not exists public.brands (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  image_url text,
  created_at timestamp with time zone not null default now()
);

-- add brand_id to products table
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'products') THEN
    ALTER TABLE public.products
      ADD COLUMN IF NOT EXISTS brand_id uuid REFERENCES public.brands(id);

    -- create index for performance
    CREATE INDEX IF NOT EXISTS idx_products_brand_id ON public.products(brand_id);
  END IF;
END $$;

-- insert some sample brands
insert into public.brands (id, name)
values
  ('00000000-0000-0000-0000-000000000001', 'DELL'),
  ('00000000-0000-0000-0000-000000000002', 'LENOVO'),
  ('00000000-0000-0000-0000-000000000003', 'XEROX'),
  ('00000000-0000-0000-0000-000000000004', 'HIKVISION'),
  ('00000000-0000-0000-0000-000000000005', 'CISCO'),
  ('00000000-0000-0000-0000-000000000006', 'HP')
on conflict (id) do nothing;