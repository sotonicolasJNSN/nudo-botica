# Auditoría 04 — Separación de retiro y entrega

**Fecha de referencia:** 5 de octubre de 2026. **Elaboración retrospectiva:** 16 de noviembre de 2026.

## Objetivo y alcance

Examinar la separación histórica de modalidades de retiro y domicilio y su efecto sobre el flujo de checkout simulado.

## Componentes y funcionalidades examinados

Selección de pago local o en línea, retiro, envío a domicilio, campos condicionales y resumen del pedido en el frontend de octubre.

## Evidencias concretas

- `281a7e0` (05-10-2026), «Separate local pickup and online delivery», modifica `script.js`, `styles.css`, README y `AUDITORIA.md`.
- La documentación del commit posterior `70597e0` enumera tres casos: retiro con pago pendiente, pago simulado con retiro y pago simulado con domicilio.
- `AUDITORIA.md` registra en la versión pública histórica la aparición o desaparición de campos según modalidad; las verificaciones detalladas de tickets corresponden a entorno local.

## Hallazgos y correcciones

El flujo separó la información requerida para retiro de la requerida para domicilio, evitando presentar el destino como requisito universal. La evidencia no describe una integración de transportista ni un mecanismo de cobro.

## Resultado y conclusiones

La separación está respaldada por commits y documentación de la época. Las pruebas públicas históricas cubrieron cambios de modalidad, pero no el procesamiento de pagos reales. Los resultados de una etapa no se extrapolan a todas las versiones posteriores.
