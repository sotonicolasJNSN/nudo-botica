CREATE TABLE "suppliers" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  CONSTRAINT "suppliers_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "suppliers_name_key" UNIQUE ("name")
);
CREATE TABLE "product_suppliers" (
  "product_id" TEXT NOT NULL,
  "supplier_id" TEXT NOT NULL,
  CONSTRAINT "product_suppliers_pkey" PRIMARY KEY ("product_id"),
  CONSTRAINT "product_suppliers_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "product_suppliers_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "suppliers"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
ALTER TABLE "suppliers" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "product_suppliers" ENABLE ROW LEVEL SECURITY;
