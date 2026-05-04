
-- 1. Roles
CREATE TYPE public.app_role AS ENUM ('admin', 'customer');

CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'customer',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "user_roles_select_self_or_admin" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "user_roles_admin_insert" ON public.user_roles
  FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "user_roles_admin_update" ON public.user_roles
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "user_roles_admin_delete" ON public.user_roles
  FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- 2. Inventory
CREATE TABLE public.inventory (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id TEXT NOT NULL,
  size TEXT,
  color TEXT,
  stock INTEGER NOT NULL DEFAULT 0,
  low_stock_threshold INTEGER NOT NULL DEFAULT 5,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (product_id, size, color)
);

ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "inventory_public_read" ON public.inventory
  FOR SELECT USING (true);

CREATE POLICY "inventory_admin_insert" ON public.inventory
  FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "inventory_admin_update" ON public.inventory
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "inventory_admin_delete" ON public.inventory
  FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_inventory_updated_at
BEFORE UPDATE ON public.inventory
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 3. Coupons
CREATE TYPE public.coupon_type AS ENUM ('percentage', 'fixed', 'free_shipping', 'bogo');

CREATE TABLE public.coupons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  type coupon_type NOT NULL,
  value NUMERIC NOT NULL DEFAULT 0,
  min_order_value NUMERIC NOT NULL DEFAULT 0,
  max_discount NUMERIC,
  usage_limit INTEGER,
  used_count INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  starts_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "coupons_public_read_active" ON public.coupons
  FOR SELECT USING (active = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "coupons_admin_insert" ON public.coupons
  FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "coupons_admin_update" ON public.coupons
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "coupons_admin_delete" ON public.coupons
  FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_coupons_updated_at
BEFORE UPDATE ON public.coupons
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 4. Order enhancements
ALTER TABLE public.orders
  ADD COLUMN tracking_carrier TEXT,
  ADD COLUMN tracking_number TEXT,
  ADD COLUMN tracking_url TEXT,
  ADD COLUMN shipped_at TIMESTAMPTZ,
  ADD COLUMN delivered_at TIMESTAMPTZ,
  ADD COLUMN admin_notes TEXT,
  ADD COLUMN coupon_code TEXT,
  ADD COLUMN discount_amount NUMERIC NOT NULL DEFAULT 0;

-- Admin policies on orders
CREATE POLICY "orders_admin_select_all" ON public.orders
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "orders_admin_update" ON public.orders
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "order_items_admin_select_all" ON public.order_items
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- Admin can read all profiles (for order customer info)
CREATE POLICY "profiles_admin_select_all" ON public.profiles
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
