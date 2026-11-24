CREATE TABLE "admin_users" (
  "username" TEXT NOT NULL,
  "password_hash" TEXT NOT NULL,
  CONSTRAINT "admin_users_pkey" PRIMARY KEY ("username")
);
-- No exponer credenciales derivadas a los roles de la API pública de Supabase.
ALTER TABLE "admin_users" ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON "admin_users" FROM PUBLIC;
