-- Inventory decrement is serialized and idempotent by order reference.
BEGIN;

CREATE TABLE IF NOT EXISTS public.nudo_inventory_orders (
  order_id text PRIMARY KEY,
  items jsonb NOT NULL,
  result jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.nudo_inventory_orders ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.nudo_inventory_orders FROM PUBLIC;
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
    EXECUTE 'REVOKE ALL ON public.nudo_inventory_orders FROM anon';
  END IF;
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
    EXECUTE 'REVOKE ALL ON public.nudo_inventory_orders FROM authenticated';
  END IF;
END $$;

CREATE OR REPLACE FUNCTION public.nudo_place_order(p_order_id text, p_items jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
DECLARE
  item record;
  product_data jsonb;
  available bigint;
  remaining bigint;
  changes jsonb := '[]'::jsonb;
  normalized_items jsonb;
  saved_items jsonb;
  saved_result jsonb;
  inserted_rows integer;
BEGIN
  IF p_order_id IS NULL OR p_order_id !~ '^NUDO-[0-9A-F]{4}(-[0-9A-F]{4}){3}$' THEN
    RAISE EXCEPTION USING ERRCODE = '22023', MESSAGE = 'INVALID_ORDER';
  END IF;
  IF jsonb_typeof(p_items) IS DISTINCT FROM 'array' THEN
    RAISE EXCEPTION USING ERRCODE = '22023', MESSAGE = 'INVALID_ORDER_ITEMS';
  END IF;
  IF jsonb_array_length(p_items) < 1 OR jsonb_array_length(p_items) > 60 THEN
    RAISE EXCEPTION USING ERRCODE = '22023', MESSAGE = 'INVALID_ORDER';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM jsonb_array_elements(p_items) AS entry(value)
    WHERE jsonb_typeof(value) IS DISTINCT FROM 'object'
       OR coalesce(value->>'id', '') !~ '^[a-z0-9]+(-[a-z0-9]+)*$'
       OR length(value->>'id') > 80
       OR coalesce(value->>'quantity', '') !~ '^[1-9][0-9]?$'
  ) OR EXISTS (
    SELECT value->>'id'
    FROM jsonb_array_elements(p_items) AS entry(value)
    GROUP BY value->>'id'
    HAVING count(*) > 1
  ) THEN
    RAISE EXCEPTION USING ERRCODE = '22023', MESSAGE = 'INVALID_ORDER_ITEMS';
  END IF;

  SELECT jsonb_agg(jsonb_build_object('id', value->>'id', 'quantity', (value->>'quantity')::integer) ORDER BY value->>'id')
  INTO normalized_items
  FROM jsonb_array_elements(p_items) AS entry(value);

  INSERT INTO public.nudo_inventory_orders(order_id, items)
  VALUES (p_order_id, normalized_items)
  ON CONFLICT (order_id) DO NOTHING;
  GET DIAGNOSTICS inserted_rows = ROW_COUNT;
  IF inserted_rows = 0 THEN
    SELECT items, result INTO saved_items, saved_result
    FROM public.nudo_inventory_orders WHERE order_id = p_order_id FOR UPDATE;
    IF saved_items IS DISTINCT FROM normalized_items THEN
      RAISE EXCEPTION USING ERRCODE = '22023', MESSAGE = 'ORDER_REFERENCE_REUSED';
    END IF;
    RETURN saved_result;
  END IF;

  FOR item IN
    SELECT value->>'id' AS id, (value->>'quantity')::bigint AS quantity
    FROM jsonb_array_elements(normalized_items) AS entry(value)
    ORDER BY value->>'id'
  LOOP
    SELECT data INTO product_data FROM public.products WHERE id = item.id FOR UPDATE;
    IF NOT FOUND THEN
      RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'INSUFFICIENT_STOCK';
    END IF;
    IF coalesce(product_data->>'stock', '0') !~ '^(0|[1-9][0-9]*)$' THEN
      RAISE EXCEPTION USING ERRCODE = '22023', MESSAGE = 'INVALID_PRODUCT_STOCK';
    END IF;
    available := coalesce((product_data->>'stock')::bigint, 0);
    IF available < item.quantity THEN
      RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'INSUFFICIENT_STOCK';
    END IF;
    remaining := available - item.quantity;
    UPDATE public.products
    SET data = jsonb_set(data, '{stock}', to_jsonb(remaining), true)
    WHERE id = item.id;
    changes := changes || jsonb_build_array(jsonb_build_object('id', item.id, 'stock', remaining));
  END LOOP;

  saved_result := jsonb_build_object('reference', p_order_id, 'stock', changes);
  UPDATE public.nudo_inventory_orders SET result = saved_result WHERE order_id = p_order_id;
  RETURN saved_result;
END;
$$;

REVOKE ALL ON FUNCTION public.nudo_place_order(text, jsonb) FROM PUBLIC;
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
    EXECUTE 'REVOKE ALL ON FUNCTION public.nudo_place_order(text, jsonb) FROM anon';
  END IF;
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
    EXECUTE 'REVOKE ALL ON FUNCTION public.nudo_place_order(text, jsonb) FROM authenticated';
  END IF;
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'service_role') THEN
    EXECUTE 'GRANT EXECUTE ON FUNCTION public.nudo_place_order(text, jsonb) TO service_role';
  END IF;
END $$;

COMMIT;
