# Copiloto de IA — producto separado del Agente de IA

**Qué es**: función de la plataforma base (DKW System) para el **equipo humano** (no habla con clientes) — resumen de conversaciones + respuesta sugerida, reportes on-demand por chat, tareas de IA recurrentes, monitoreo de grupos de WhatsApp, y una función de alto valor potencial: **asistencia para crear/mejorar el prompt del Agente de IA**, con un modo de test en loop que simula conversaciones e itera el prompt solo.
**Estado real (2026-09-14, confirmado por soporte)**: en desarrollo, **no liberado** salvo cuentas con "función súper" (la cuenta de Fitness Suplementos no la tiene). Addon pago aparte (Essencial/Pro/Max, R$79-647/mes según la doc de la plataforma base) + créditos de IA prepagos.
**Fuente primaria**: [[09-copiloto-ia-partner]], [[26-respuestas-reunion-soporte-2026-09-14]] #5-7.

## La contradicción sobre BYOK (resuelta, con matiz)
La documentación de la plataforma base dice que el Copiloto requiere "IA Gerenciada" (clave centralizada del proveedor), no BYOK (clave propia, que es lo que usa el agente hoy). El conector "OpenAI Key" del Hub (ver [[hub-de-integraciones]]) dice literalmente que la clave sirve para "los Agentes de IA, el Copiloto y los Flujos" — **soporte aclaró que eso es incorrecto/desactualizado**: BYOK sirve solo para el agente, no habilita el Copiloto.

## Por qué importa igual, aunque no esté disponible
Si algún día se libera, la función de "generar/mejorar el prompt con test en loop automático" sería directamente relevante para todo el trabajo manual de iteración de prompts que se viene haciendo con ChatGPT (ver [[arquitectura-conversacional]] y [[metodologia-parche-quirurgico]]).

## Pendientes relacionados
S4 (precio y condiciones, sin confirmar), P8 (acceso "súper"/administrador pedido, sin confirmar cuándo llega).
