-- Solo para un esquema de laboratorio aislado: no modifica public.products.
CREATE TABLE "Categoria" ("id" SERIAL PRIMARY KEY, "nombre" TEXT NOT NULL UNIQUE);
CREATE TABLE "Producto" (
  "id" SERIAL PRIMARY KEY,
  "nombre" TEXT NOT NULL CHECK (length(trim("nombre")) >= 3),
  "precio" INTEGER NOT NULL CHECK ("precio" >= 0),
  "stock" INTEGER NOT NULL CHECK ("stock" >= 0),
  "categoriaId" INTEGER NOT NULL REFERENCES "Categoria"("id") ON DELETE RESTRICT
);
