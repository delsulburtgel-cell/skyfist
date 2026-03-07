-- add_questions_requests_and_seed.sql

-- create missing tables for home screen questions and contact page requests

create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  created_at timestamp with time zone not null default now()
);

create table if not exists public.requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamp with time zone not null default now()
);

-- basic seed data for development / demo purposes
-- categories referenced by products and pages
insert into public.categories (id, name, slug, created_at)
values
  ('cat-fiber','Fiber Internet','fiber-internet', now()),
  ('cat-security','Security Services','security-services', now()),
  ('cat-tech','Tech Supply','tech-supply', now()),
  ('cat-training','Training & Consulting','training-consulting', now())
on conflict (id) do nothing;

-- a couple of products under the fiber category
insert into public.products (id, category_id, name, price, price_formatted, is_active, created_at)
values
  ('prod-1','cat-fiber','100 Mbps Plan',49.99,'$49.99',true,now()),
  ('prod-2','cat-fiber','1 Gbps Plan',99.99,'$99.99',true,now())
on conflict (id) do nothing;

-- some sample questions displayed on home page
insert into public.questions (question)
values
  ('What payment methods do you accept?'),
  ('Do you offer professional installation?'),
  ('Can I upgrade my plan later?')
on conflict do nothing;

-- sample requests to populate contact page (these would normally come from users)
insert into public.requests (name, email, message)
values
  ('Jane Doe','jane@example.com','I would like more information about your services.'),
  ('Bob Smith','bob@example.com','Can you provide a quote for fibre installation?')
on conflict do nothing;

-- default member records
insert into public.members (id, name, email, phone, notes, created_at)
values
  ('member-1','Alice Admin','alice@domain.com','555-1234','first staff member',now())
on conflict (id) do nothing;

-- user roles table: one admin placeholder (actual user should exist in auth schema)
insert into public.user_roles (id, user_id, role)
values
  ('role-admin','00000000-0000-0000-0000-000000000000','admin')
on conflict (id) do nothing;

-- NOTE: password-protected auth.users record should be created using the client SDK or
-- the Supabase dashboard; the seed script (supabase/seed.ts) shows how to do that.
