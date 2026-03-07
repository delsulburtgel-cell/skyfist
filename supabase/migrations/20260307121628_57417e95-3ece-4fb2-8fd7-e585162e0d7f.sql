
-- Drop overly permissive policies and replace with more specific ones
DROP POLICY "Anyone can create orders" ON public.orders;
DROP POLICY "Anyone can create order items" ON public.order_items;

-- More specific insert policies (still public but with basic validation)
CREATE POLICY "Public can create orders" ON public.orders FOR INSERT WITH CHECK (
  customer_name IS NOT NULL AND customer_phone IS NOT NULL AND total_price > 0
);

CREATE POLICY "Public can create order items" ON public.order_items FOR INSERT WITH CHECK (
  order_id IS NOT NULL AND product_name IS NOT NULL AND quantity > 0 AND price > 0
);
