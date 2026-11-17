# Auditoría 01 — Tienda inicial y alcance del prototipo

**Fecha de referencia:** 4 de octubre de 2026. **Elaboración retrospectiva:** 16 de noviembre de 2026.

## Objetivo y alcance

Reconstruir la primera versión conservada de NUDO y delimitar lo que aquella evidencia permite afirmar. Se examinan catálogo, navegación, carrito y checkout de la primera entrega; no se presume una fase de diseño anterior a ella.

## Componentes y funcionalidades examinados

En el commit `3b8c590`, `index.html`, `styles.css` y `script.js` formaban una tienda estática en HTML, CSS y JavaScript. El README de esa revisión describe 22 productos, tres categorías, rutas hash, carrito persistente y pago simulado. No había backend ni API en esa versión.

## Evidencias concretas

- Commit `3b8c590`, de 04-10-2026: incorpora tienda, README y `AUDITORIA.md`.
- El README histórico registra `node --check script.js` correcto y una revisión visual y funcional en móvil y escritorio. Es evidencia documental histórica, no una prueba repetida para este informe.
- `AUDITORIA.md` documenta una revisión original de lógica, privacidad y accesibilidad; no afirma certificación de seguridad.

## Hallazgos y correcciones

La auditoría original señaló, entre otros puntos, posibles sobrescrituras del carrito entre pestañas, persistencia sin caducidad y textos pequeños. Se trata de hallazgos de aquella revisión, cuyo estado actual no debe suponerse cerrado solo porque el proyecto evolucionó. El historial inicial ya contiene implementación y no documenta reuniones o prototipos anteriores.

## Resultado y conclusiones

La evidencia demuestra una base funcional de demostración y su revisión inicial. La etapa no acredita cobros, pedidos reales ni una metodología de diseño previa. Las comprobaciones posteriores pertenecen a otras versiones.
