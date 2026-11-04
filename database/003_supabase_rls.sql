-- Ejecutar en Supabase después de crear public.products y revisar sus permisos existentes.
-- Esta política solo autoriza lectura a través de los roles públicos de la Data API.
BEGIN;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON public.products TO anon, authenticated;
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'products' AND policyname = 'nudo_public_read_products') THEN
    CREATE POLICY nudo_public_read_products ON public.products FOR SELECT TO anon, authenticated USING (true);
  END IF;
END $$;
COMMIT;
