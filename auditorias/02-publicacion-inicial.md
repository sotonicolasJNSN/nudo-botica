# Auditoría 02 — Primera publicación en GitHub Pages

**Fecha de referencia:** 4 y 5 de octubre de 2026. **Elaboración retrospectiva:** 16 de noviembre de 2026.

## Objetivo y alcance

Revisar la evidencia histórica de publicación de la interfaz estática y distinguir la disponibilidad del sitio de la ejecución completa del negocio.

## Componentes y funcionalidades examinados

Repositorio `sotonicolasJNSN/nudo-botica`, fuente de GitHub Pages, inicio, navegación por colecciones, carrito y checkout de la versión de octubre.

## Evidencias concretas

- El commit `549667f`, del 04-10-2026, registra la verificación de Pages en `AUDITORIA.md`.
- La revisión documentada del 05-10-2026 identifica el commit `70597e0`, compilación de Pages `built`, error `null` y HTTPS. También registra navegación, carrito y comprobaciones parciales del checkout público.
- La fuente histórica sitúa las pruebas más completas de tickets y validaciones en Chrome local, no en producción.

## Hallazgos y correcciones

La incertidumbre inicial sobre la publicación se cerró con el registro posterior de Pages. El informe histórico distingue verificaciones locales y públicas y acota su alcance; una respuesta del sitio no prueba por sí misma cobros, accesibilidad completa ni seguridad integral.

## Resultado y conclusiones

La documentación respalda que la interfaz estática se publicó en octubre. Esa evidencia corresponde a `70597e0`, no a los commits de noviembre. El checkout de la época era una simulación; el estado actual se trata en la auditoría 10.
