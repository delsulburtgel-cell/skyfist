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
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'categories') THEN
    INSERT INTO public.categories (id, name, slug, created_at)
    VALUES
      ('cat-fiber','Fiber Internet','fiber-internet', now()),
      ('cat-security','Security Services','security-services', now()),
      ('cat-tech','Tech Supply','tech-supply', now()),
      ('cat-training','Training & Consulting','training-consulting', now())
    ON CONFLICT (id) DO NOTHING;
  END IF;
END $$;

-- a couple of products under the fiber category
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'products') THEN
    INSERT INTO public.products (id, category_id, name, price, price_formatted, is_active, created_at)
    VALUES
      ('prod-1','cat-fiber','100 Mbps Plan',49.99,'$49.99',true,now()),
      ('prod-2','cat-fiber','1 Gbps Plan',99.99,'$99.99',true,now())
    ON CONFLICT (id) DO NOTHING;
  END IF;
END $$;

-- some sample questions displayed on home page
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'questions') THEN
    INSERT INTO public.questions (question)
    VALUES
      ('What payment methods do you accept?'),
      ('Do you offer professional installation?'),
      ('Can I upgrade my plan later?')
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- sample requests to populate contact page (these would normally come from users)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'requests') THEN
    INSERT INTO public.requests (name, email, message)
    VALUES
      ('Jane Doe','jane@example.com','I would like more information about your services.'),
      ('Bob Smith','bob@example.com','Can you provide a quote for fibre installation?')
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- default member records
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'members') THEN
    INSERT INTO public.members (id, name, email, phone, notes, created_at)
    VALUES
      ('member-1','Alice Admin','alice@domain.com','555-1234','first staff member',now())
    ON CONFLICT (id) DO NOTHING;
  END IF;
END $$;

-- user roles table: one admin placeholder (actual user should exist in auth schema)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'user_roles') THEN
    INSERT INTO public.user_roles (id, user_id, role)
    VALUES
      ('role-admin','00000000-0000-0000-0000-000000000000','admin')
    ON CONFLICT (id) DO NOTHING;
  END IF;
END $$;

-- NOTE: password-protected auth.users record should be created using the client SDK or
-- the Supabase dashboard; the seed script (supabase/seed.ts) shows how to do that.
