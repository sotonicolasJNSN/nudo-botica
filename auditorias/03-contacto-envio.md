# Auditoría 03 — Contacto y datos de envío

**Fecha de referencia:** 5 de octubre de 2026. **Elaboración retrospectiva:** 16 de noviembre de 2026.

## Objetivo y alcance

Documentar la evolución de los datos de contacto y envío del checkout de demostración, sin atribuir procesamiento de pedidos reales.

## Componentes y funcionalidades examinados

Formulario de contacto, datos de destino, validaciones de ciudad y código postal y mensajes para el usuario en `script.js` y `styles.css` históricos.

## Evidencias concretas

- `80f38be` (05-10-2026): «Validate Ecuador shipping details», con cambios en `script.js`, estilos, README y auditoría.
- `19031b1` (05-10-2026): «Simplify Ecuador checkout contact fields».
- La versión documentada en `70597e0` describe código postal de seis dígitos solo para entrega a domicilio y campos de contacto diferenciados. `AUDITORIA.md` atribuye las comprobaciones de validación detalladas a Chrome local.

## Hallazgos y correcciones

El historial registra una evolución desde validación de envío hacia campos de contacto más simples y condiciones dependientes de la entrega. La evidencia histórica no demuestra validación de identidad, existencia de direcciones ni recepción de un pedido en un servidor.

## Resultado y conclusiones

La etapa proporciona evidencia de formularios y reglas de demostración contextualizadas para Ecuador. La presencia de validaciones de formato no equivale a una compra ni a una entrega real. Para examinar la versión de una fecha concreta deben consultarse los archivos de su commit.
