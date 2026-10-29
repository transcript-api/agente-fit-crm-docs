# API de rmsystemm — referencia técnica de endpoints conocidos

**Qué es**: rmsystemm es una capa white-label sobre **DKW System** (confirmado con 3 evidencias independientes: favicon en `storage.integrador-crm.com` bajo un UUID de partner, IDs de CSS `dkw-liquid-glass-filter` en el HTML, y que la API real es `api.integrador-crm.com`, no un dominio propio de RM System — solo los webhooks salen por `api.rmsystemm.com.br`). Esto importa: el soporte con el que se habla es el revendedor, no el fabricante — no pueden arreglar un bug de la plataforma en sí, solo escalarlo a DKW.
**Fuente primaria**: [[33-pipeline-masivo-y-api-negocios-2026-09-19]], [[24-sesion-2026-09-14-traspaso]] §4.0, `Automatizaciones → API` dentro del propio CRM (panel de documentación interactivo real).

## Endpoints confirmados (leídos de la documentación oficial o usados en vivo esta sesión)

Autenticación: header `api-key` (de la empresa) para la mayoría; `Connection-Token` (del canal) adicional para envío de mensajes.

| Acción | Método | Endpoint |
|---|---|---|
| Consultar negocios (paginado) | GET | `/commercial-order` — trae `CommercialSalesStep.name`, `Pipeline.name` y el `Contact` completo ya incluidos |
| Crear negocio | POST | `/commercial-order` |
| Detalle de un negocio | GET | `/commercial-order/{identifier}` |
| Actualizar negocio | PUT | `/commercial-order/{identifier}` |
| **Mover negocio de etapa** | POST | `/commercial-order/{identifier}/move` — body `{"commercialStep": "<nombre exacto>"}` |
| Tags de un negocio | POST/DELETE | `/commercial-order/{identifier}/tags[/{tagId}]` |
| Enviar mensaje libre (texto/media) | POST | `/messages/send/v2` — body `number` + `medias`, requiere `Connection-Token` |
| Enviar plantilla aprobada | POST | `/message-template/send/v2` — body `number`, `templateName`, `processedText`, `manualVariables` |
| Listar plantillas | GET | `/message-template` |
| Detalle completo de un ticket | GET | `/messages/{ticketId}` — incluye `dataJson` con metadata de WhatsApp/Meta, **⚠️ el `metaToken` viaja en texto claro acá** (Q23, sin resolver) |
| Logs de procesamiento de IA de un ticket | GET | `/processing-logs/ticket/{id}` — de solo lectura, no hay endpoint para forzar/reintentar un procesamiento |
| Timeline de un log | GET | `/processing-logs/{id}/timeline` |
| Pipelines | GET/POST/PUT/DELETE | `/pipeline`, `/pipeline/{id}`, `/pipeline/{pipelineId}/commercial-steps[/{id}]` |
| Mapeo de etapas por pipeline | GET | `/commercial-sales-step/all-with-pipelines` |
| Automation flows | GET | `/automation-flows`, `/automation-flow-executions/{id}` |
| Versiones de un prompt | GET | `/prompt/{id}/versions` |
| Prompt actual de un agente | GET | `/prompt/{id}` |

## Webhook de entrada al CRM (la puerta para n8n)
Cada columna del pipeline tiene una pestaña Integraciones con webhooks propios:
```
POST https://api.rmsystemm.com.br/webhook/leads/<TOKEN>
{ "name": "...", "phone": "...", "email": "...", "adicional1": "..." }
```
Opciones: Responsables, Tags, "Bloquear creación de negocios duplicados". El token vive en la UI, nunca en estos archivos.

## Lo que NO existe / no se confirmó
- No hay campo de "URL propia" en la config del agente (Proveedor/Clave/Modelo nada más) — no se puede apuntar un agente nativo a un servidor propio (ej. Hermes, ver [[fit-brain-vision]]) sin que soporte lo habilite.
- No hay endpoint para forzar que un agente recién vinculado procese el último mensaje pendiente del ticket (ver A33 en `PENDIENTES.md`, pregunta S20 enviada a soporte).
- Webhooks **salientes** (CRM → afuera, cuando cambia una etapa) — parcialmente confirmado que existen (panel `Automatizaciones → API` los lista), no leído entero (S3/P5).

## Gotchas de autenticación encontrados en esta sesión (2026-09-29)
El token de sesión (`localStorage.token` + `tenantId`) puede devolver `400 {"error":"Não é possível consultar registros de outra empresa"}` para el mismo ticket/endpoint que minutos antes funcionaba bien con los mismos headers — no confirmado si es expiración parcial de sesión o un problema de scoping puntual de algunos endpoints (`/messages/{id}`, `/tickets/{id}` singular) mientras `/tickets` (lista) seguía funcionando normal. Si esto se repite, recargar la página del CRM (fuerza refresh del token) antes de asumir que el dato no es accesible.

## Lectura de leads en bloque (2026-10-29, solo lectura)
- `/commercial-order?pageNumber=N`: 40 por página, **paginación inestable** (repite y salta; sin filtro ni orden que funcione). Con 8 pasadas se juntaron 15.397 negocios únicos de ~16.900.
- `/tickets?status=open|closed|pending&pageNumber=N`: 20 por página; trae nombre, número, `variables.interes_inicial` y último mensaje (el filtro `contactId` se ignora).
- `/messages/{ticketId}`: 15 por página, la primera es la más nueva.
- `interes_inicial` solo existe en leads atendidos desde que Maxi arrancó. Los contactos de Instagram tienen números de 15 dígitos o más.
Detalle en [[17-registro-de-cambios]] 2026-10-29 (tarde).

## Pendientes relacionados
S3 (leer el panel completo de la API), Q16 (uso de `/commercial-order/.../move` para segmentar remarketing masivo), Q23 (token de Meta expuesto en `/messages/{ticketId}`), S20 (pregunta a soporte sobre timing de vinculación de agente).
