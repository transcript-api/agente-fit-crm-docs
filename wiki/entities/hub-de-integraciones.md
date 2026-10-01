# Hub de Integraciones — los 25 conectores

**Qué es**: `Configuración → Cuentas Integradas` (`/settings/external-accounts`). 226 acciones y 45 disparadores repartidos en 20 conectores "de catálogo" (motor real: **Composio**, endpoint `copilot-tools/composio/connectors` — el catálogo crece solo, sin que rmsystemm lo toque) + 5 integraciones nativas.
**Fuente primaria**: [[23-conectores-hub-integraciones]] (análisis), [[23b-conectores-volcado-literal]] (texto literal sin resumir de los 25 paneles).

## Cómo se usa un conector de verdad (cadena de 3 pasos, no obvia)
1. Conectar la cuenta en el Hub.
2. Adjuntarla en `Agente de IA → Herramientas → Conectores → "Agregar conector"` (esto abre además un modal para elegir **cuáles** acciones del conector puede usar el agente — capa de permisos por herramienta).
3. Decirle en el prompt, en lenguaje natural, cuándo usarla. No hay configuración de parámetros por fuera del prompt.

Conectar en el Hub **no alcanza solo** — sin el paso 2 el agente dice literalmente "Ningún conector adjunto".

## Estado de los 5 nativos
| Conector | Estado |
|---|---|
| Google Calendar e Meet | 1 conectada (pero NO vinculada en `Agente → Agendamientos`, es otra vinculación distinta — N10) |
| Meta Ads | 2 conectadas, "Reconexión necesaria" |
| OpenAI Key | 1 conectada (`usersantifitness@gmail.com`) |
| Google Gemini Key | No conectado |
| Shopify | No conectado (N8, alto impacto pendiente) |

## Los 4 hallazgos que cambian planes ya escritos

1. **Shopify**: sincroniza productos/pedidos/clientes, detecta carrito abandonado como gatillo de Flujo, consulta estado de pedido en la atención. Resuelve 3 cosas bloqueadas hoy (catálogo sin depender del export manual, carrito abandonado — el caso de uso de [[pipelines-y-columnas]] Remarketing —, y estado de pedido). El stock hereda los problemas de [[integracion-bling]].
2. **Google Sheets** (conectado el 2026-09-14): 11 acciones, 8 disparadores. Tiene **búsqueda exacta** ("Buscar fila de la hoja de cálculo" — coincidencia exacta de celda, no similitud), lo que es estrictamente mejor que el RAG para precio/link (equivocarse de fila ahí es literalmente inventar un precio). También puede **escribir** (Agregar/Crear Fila) — el agente podría registrar objeciones o productos pedidos que no existen. Ver [[catalogo-productos]] para cómo se usa esto en la práctica.
3. **Meta Ads**: sirve para mandar señales de conversión HACIA Meta (acción "Disparar Conversión"), no para que el agente lea el anuncio de origen — eso lo confirmó soporte por otra vía (S18: "el agente no tiene acceso a ese dato hoy").
4. **OpenAI Key**: su descripción dice que sirve para "los Agentes de IA, el Copiloto y los Flujos" — pero soporte aclaró que el BYOK (clave propia) NO habilita el Copiloto, la descripción del conector está mal redactada. Ver [[copiloto-ia]].

## Dos cosas sin explicar (S14, S15 en `PENDIENTES.md`)
- El filtro "Agente IA" de arriba de la lista excluye Meta Ads y Google Sheets, pero el selector "Agregar conector" del agente SÍ ofrece Google Sheets. Contradicción sin resolver.
- La etiqueta `AUTOMATIZACIÓN` (solo 12 de 226 acciones, solo en Sheets y Gmail) — hipótesis no confirmada: marca las acciones usables como nodo dentro de un Flujo de Automatización vía el nodo "Apps" (ver [[flujos-de-automatizacion]]).

## Resto de conectores, en una línea (ninguno en uso hoy)
Gmail (11/2, único junto con Sheets con acciones de escritura), Telegram (6/0, vía más barata para notificaciones internas), Stripe (15/7, cobros — solo si algún día se cobra fuera de Shopify), Outlook/Zoho Mail/Agent Mail (correo alternativo), Cal/Calendly/Zoom (agendamiento, ya cubierto por Google Calendar), HubSpot/Salesforce/Pipedrive/Kommo/Zoho/Highlevel (otros CRMs, solo para migrar), Zendesk (soporte), DocuSign (firma electrónica), Googleforms/Formsite (formularios).

## Pendientes relacionados
N8 (conectar Shopify, mayor impacto/esfuerzo del Hub), N9 (adjuntar Sheets al agente con la planilla curada), N10 (vincular Google Calendar en Agendamientos), N11 (confirmar si los disparadores de Sheets sirven como gatillo de Flujo), S14, S15.
