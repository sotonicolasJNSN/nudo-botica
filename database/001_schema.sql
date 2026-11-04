-- Ejecutar en una base de datos dedicada a NUDO.
CREATE TABLE IF NOT EXISTS products (
  id text PRIMARY KEY,
  position integer NOT NULL CHECK (position >= 0),
  data jsonb NOT NULL CHECK (jsonb_typeof(data) = 'object' AND data->>'id' = id)
);
