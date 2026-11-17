-- Línea base para una base NUEVA. En una base existente, consulte el README antes de marcarla aplicada.
CREATE TABLE "products" (
  "id" TEXT NOT NULL,
  "position" INTEGER NOT NULL CHECK ("position" >= 0),
  "data" JSONB NOT NULL CHECK (jsonb_typeof("data") = 'object' AND "data"->>'id' = "id"),
  CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);
