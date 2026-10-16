# Empezá por acá — Hermes, CRM y ejecución en VPS

Actualización: **16/10/2026**. Entrada para quien construye Fit Brain. Este paquete registra evidencia y requisitos; no instala ni activa nada.

## Lo que necesitás saber en un minuto

- **Codex funciona en las pruebas técnicas registradas del piloto.** Eso no demuestra que un mensaje nuevo llegue, active Hermes y salga al CRM.
- El último checkpoint disponible del receptor, **03:53:17 UTC del 16/10**, es `WAITING_FOR_FRESH_CANARY`, no `ACTIVE_OWN_CONTACT`. El canario anterior llegó antes del arranque y quedó excluido. No hay prueba actual de respuesta completa de punta a punta ni observación posterior del proceso desde este entorno.
- El piloto está limitado al contacto propio y a responder texto. Capacidades documentadas de la API **no equivalen a herramientas habilitadas** en Hermes.
- Soporte confirmó capacidades y recuperación de mensajes, pero hay contratos por precisar. Webhooks de eventos y entrada de mensajes son integraciones diferentes.
- El VPS aporta continuidad y un destino HTTPS si se elige recepción pública. Requiere adaptar dependencias locales y verificar recuperación, aislamiento y entrega; no cura bugs de aplicación.

## Orden de lectura

| Necesitás | Leé |
|---|---|
| Qué permite el CRM y qué está realmente probado | [45 — Contrato y matriz de capacidades](45-contrato-crm-y-evidencia-2026-10-16.md) |
| Instrucciones para Hermes u otro motor y flujos operativos | [46 — Contrato del agente comercial](46-contrato-agente-y-flujos-2026-10-16.md) |
| Por qué puede no responder hoy y cómo localizar el corte | [47 — Diagnóstico estático y traza segura](47-diagnostico-hermes-local-2026-10-16.md) |
| Cómo se ejecutaría cuando haya servidor | [48 — Plan VPS, aceptación y rollback](48-plan-ejecucion-vps-2026-10-16.md) |
| Valor de compra, atribución y límites del aprendizaje histórico | [49 — Pedidos, Meta y aprendizaje](49-pedidos-atribucion-y-aprendizaje-2026-10-16.md) |
| Quién desbloquea cada punto abierto | [PENDIENTES, H1–H8](PENDIENTES.md#actualización-hermes-y-vps--2026-10-16) |

## Cómo usar el paquete

El constructor debe conservar las etiquetas **CONFIRMADO POR SOPORTE / DOCUMENTADO / IMPLEMENTADO EN PILOTO / VERIFICADO TÉCNICAMENTE / PROPUESTO / NO VERIFICADO**. No convertir una propuesta en capacidad existente ni un test offline en aprobación comercial. Antes de cambiar el runtime, obtener estado fresco y revisar sus instrucciones canónicas en FIT-BRAIN.

La fuente de implementación es **FIT-BRAIN**; este repositorio conserva documentación del CRM. No copiar credenciales, ledgers, mensajes ni configuraciones locales de uno al otro. Los enlaces a evidencia privada requieren acceso a FIT-BRAIN; no se trasladan sus artefactos crudos al repositorio público.

Alcance de esta actualización: revisión de código y documentos, publicación documental en rama/PR. Sin llamadas a modelos, mensajes, cambios CRM, creación de claves ni despliegue. La aprobación de publicación no aprueba el piloto ni producción.

[Control documental de enlaces y alcance](artefactos/verificacion-documental-hermes-vps-2026-10-16.json): verifica archivos/anclas locales y rutas de fuentes privadas, sin pruebas de runtime.
