# Copiloto de IA — producto separado del Agente de IA

**Qué es**: función de la plataforma base (DKW System) para el **equipo humano** (no habla con clientes) — resumen de conversaciones + respuesta sugerida, reportes on-demand por chat, tareas de IA recurrentes, monitoreo de grupos de WhatsApp, y una función de alto valor potencial: **asistencia para crear/mejorar el prompt del Agente de IA**, con un modo de test en loop que simula conversaciones e itera el prompt solo.
**Estado real (2026-09-14, confirmado por soporte)**: en desarrollo, **no liberado** salvo cuentas con "función súper" (la cuenta de Fitness Suplementos no la tiene). Addon pago aparte (Essencial/Pro/Max, R$79-647/mes según la doc de la plataforma base) + créditos de IA prepagos.
**Fuente primaria**: [[09-copiloto-ia-partner]], [[26-respuestas-reunion-soporte-2026-09-14]] #5-7.

## La contradicción sobre BYOK (resuelta, con matiz)
La documentación de la plataforma base dice que el Copiloto requiere "IA Gerenciada" (clave centralizada del proveedor), no BYOK (clave propia, que es lo que usa el agente hoy). El conector "OpenAI Key" del Hub (ver [[hub-de-integraciones]]) dice literalmente que la clave sirve para "los Agentes de IA, el Copiloto y los Flujos" — **soporte aclaró que eso es incorrecto/desactualizado**: BYOK sirve solo para el agente, no habilita el Copiloto.

## Lo que dijo el proveedor en un webinar y un podcast (2026-10-29, sin verificar en nuestra cuenta)
Detalle y nivel de confianza por fuente en [[44-copiloto-webinar-y-podcast-dkw-2026-10-29]]. Lo más sólido, de las preguntas y respuestas literales del webinar:
- **Exige IA Gerenciada** y la activa el **partner**, no la cuenta (`Parceiros > Política de IA`). Sin eso no hay Copiloto ni prueba gratis. Dijeron que activarían la prueba gratis a todos los partners al terminar el webinar.
- **Prueba gratis**: 5 mensajes y 2 análisis por día, solo el administrador. **Asiento**: R$ 24,90 por mes de costo del partner (lo que cobre al cliente lo decide el partner).
- **Créditos**: los mismos del agente. Sussurro e insights consumen "irrisório"; R$ 0,25 por mensaje es solo una estimación.
- **Modelos**: los fija el proveedor, nadie los cambia. **Copiloto de soporte** gratis solo para partners.
- **Reescribe agentes**: en la demostración transformó un agente de recepción en uno de calificación y cambió el prompt al aprobar. La prueba en bucle no se mostró. Promesas, no existen aún: crear y probar flujos, acciones masivas con aprobación.
- **Sin respuesta**: permisos y privacidad (quién ve qué, memoria por persona). Es lo que más importa para el control de vendedores.

## Por qué importa igual, aunque no esté disponible
Si algún día se libera, la función de "generar/mejorar el prompt con test en loop automático" sería directamente relevante para todo el trabajo manual de iteración de prompts que se viene haciendo con ChatGPT (ver [[arquitectura-conversacional]] y [[metodologia-parche-quirurgico]]).

## Primera prueba en vivo (2026-11-01)
El usuario compró 1 asiento por fuera del flujo de soporte (vía Revenda, cuenta "súper" de P8) y empezó el setup guiado (`/ai/copilot`) logueado como Gian en Fitness Suplementos. No se encontró en la UI ninguna pantalla para elegir a qué usuario específico se le asigna el asiento (se revisó Usuários, Permissões, Cargos, Meu Plano y el wizard de Copiloto) — sigue sin respuesta, igual que "permisos y privacidad" en Q41. El pedido completo del usuario sobre qué debería hacer el Copiloto, cruzado contra lo confirmado/prometido por el proveedor, está en [[45-copiloto-vision-funciones-y-propuesta-presentacion-2026-11-01]] — incluye el riesgo más grande para la futura presentación: el CRM no registra ventas ganadas, así que ninguna métrica de "quién vendió más" es real todavía.

## Pendientes relacionados
Q41 (habilitarlo y las preguntas a soporte), S4 (precio y condiciones, sin confirmar), P8 (acceso "súper"/administrador pedido, sin confirmar cuándo llega).
