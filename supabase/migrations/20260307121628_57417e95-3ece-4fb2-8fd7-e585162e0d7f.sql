
-- Drop overly permissive policies and replace with more specific ones
-- (only run if the tables already exist)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'orders') THEN
    DROP POLICY IF EXISTS "Anyone can create orders" ON public.orders;
  END IF;

  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'order_items') THEN
    DROP POLICY IF EXISTS "Anyone can create order items" ON public.order_items;
  END IF;
END $$;

-- More specific insert policies (still public but with basic validation)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'orders') THEN
    CREATE POLICY "Public can create orders" ON public.orders FOR INSERT WITH CHECK (
      customer_name IS NOT NULL AND customer_phone IS NOT NULL AND total_price > 0
    );
  END IF;

  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'order_items') THEN
    CREATE POLICY "Public can create order items" ON public.order_items FOR INSERT WITH CHECK (
      order_id IS NOT NULL AND product_name IS NOT NULL AND quantity > 0 AND price > 0
    );
  END IF;
END $$;
