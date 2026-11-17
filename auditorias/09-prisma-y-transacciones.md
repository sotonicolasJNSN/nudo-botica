# Auditoría 09 — PostgreSQL, Prisma y transacciones

**Fecha de referencia:** 16 de noviembre de 2026.

## Objetivo y alcance

Examinar la adaptación de las prácticas de persistencia, migración y atomicidad a una base PostgreSQL aislada y distinguirla del laboratorio original de SQL Server.

## Componentes y funcionalidades examinados

Tabla `products`, modelo `backend/prisma/schema.prisma`, migración de línea base, laboratorio relacional `backend/prisma-lab/`, repositorios de PostgreSQL y Supabase y pruebas de integración.

## Evidencias concretas

- `57947f1` incorpora los esquemas, migraciones y `tests/prisma-lab.test.js` y `tests/postgres-real.test.js`.
- `GUIA_PRACTICAS_NUDO.md` registra migraciones en una base local aislada, CRUD relacional y rollback de un cambio de stock ante un error.
- La ejecución registrada en la guía el 16-11-2026 indica 22 pruebas aprobadas sin omisiones en la configuración entonces utilizada. Una ejecución posterior, con la suite ampliada, registró 26 aprobadas y una omitida; no son la misma ejecución.

## Hallazgos y correcciones

La práctica original de profundización usaba SQL Server; se implementó y probó una adaptación a PostgreSQL. La API de NUDO usa repositorios `pg` o Data API de Supabase y no convierte sus rutas en consultas Prisma. La migración de línea base se preparó para una base vacía y no debe aplicarse indiscriminadamente sobre la tabla existente.

## Resultado y conclusiones

Existe evidencia de persistencia y rollback en PostgreSQL de práctica. No se afirma ejecución del laboratorio original en SQL Server ni registro persistente de pedidos desde checkout.
