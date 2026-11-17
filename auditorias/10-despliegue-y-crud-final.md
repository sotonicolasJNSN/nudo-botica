# Auditoría 10 — Publicación y CRUD final en producción

**Fecha de referencia:** 16 de noviembre de 2026.

## Objetivo y alcance

Documentar el cierre de la integración entre GitHub Pages, Render y Supabase y la prueba final autorizada de un producto temporal. El alcance no incluye pagos reales ni una auditoría integral de seguridad.

## Componentes y funcionalidades examinados

Sitio de Pages, configuración de API en `frontend/app-config.js`, servicio Express de Render, catálogo Supabase y sesión y CRUD administrativos.

## Evidencias concretas

- `bb83233` (04-11-2026) preparó Render y el acceso a Supabase. La matriz de noviembre describe el proyecto Supabase inicialmente pausado y su restauración; esa fuente también conserva el estado previo al despliegue.
- El registro de trabajo de 16-11-2026 documenta el cambio del Build Command de `yarn` a `npm ci --prefix backend`, el despliegue satisfactorio de `57947f1` y el posterior despliegue de `538f524` para corregir la longitud mínima administrativa.
- En la verificación publicada, `GET /api/products` respondió 200 con 60 productos; la tienda mostró «Catálogo conectado a la API» y el panel inició sesión y cargó productos.
- La prueba final autorizada, registrada en la conversación de trabajo, creó un producto temporal (201), lo leyó (200), cambió su precio de 1200 a 1750 centavos y leyó el cambio (200); luego lo eliminó y su consulta devolvió 404. Se comparó el catálogo completo antes y después: 60 productos y datos originales iguales. La prueba se ejecutó por la API administrativa publicada; no se afirma que todos esos pasos se ejecutaran mediante el formulario visual.

## Hallazgos y correcciones

El comando de compilación de Render era incorrecto y se corrigió. La validación inicial de contraseña exigía 16 caracteres y fue ajustada a 14 mediante `538f524`. No se conservaron productos temporales de la prueba final.

## Resultado y conclusiones

La integración publicada y el CRUD de la API administrativa superaron las comprobaciones descritas. El checkout sigue siendo simulado y no registra pagos ni pedidos reales. Los resultados reflejan el momento de verificación, no garantizan disponibilidad futura.
