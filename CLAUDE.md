# Contexto del proyecto

Esta carpeta es la documentación viva del proyecto "Agente Fit" — un agente de IA de ventas para Fitness Suplementos, construido sobre el CRM white-label rmsystemm.com.br. Cuando trabajes en este proyecto, leé estos archivos primero para tener el contexto real (decisiones ya tomadas, estado actual, pendientes) en vez de asumir o repetir exploración ya hecha.

## ⚠️ Antes de consolidar cualquier cosa: leer PENDIENTES.md
`PENDIENTES.md` es el registro único de todo lo que está sin resolver. **Es obligatorio leerlo completo antes de producir cualquier entregable que consolide estado**: preparar una reunión, armar un plan, priorizar, decidir qué construir, o cerrar una sesión con un resumen.

Motivo (error real del 2026-09-13): se armó el documento de preguntas para soporte del CRM olvidando el Copiloto de IA, que estaba documentado hacía días con la frase literal "habría que preguntarles si/cuándo planean habilitarlo". El pendiente existía y estaba escrito — se pasó por alto porque el trabajo se armó desde lo que estaba fresco en la conversación, no desde lo documentado. **No alcanza con lo que esté en el contexto de la charla: hay que ir a buscar.**

Reglas asociadas:
1. **Marcador único**: todo pendiente, en cualquier archivo, se escribe con el prefijo `**PENDIENTE:**` al inicio de la línea, para que un solo grep los recupere todos: `grep -rn "\*\*PENDIENTE:" *.md`. Antes de consolidar, correr ese grep **además** de leer `PENDIENTES.md`, y comparar: si aparece algo en el grep que no está en el registro, agregarlo.
2. **Registrar en el momento**: cuando se descubre algo sin resolver, se agrega a `PENDIENTES.md` en ese mismo momento — no se deja solo enterrado en la prosa de un archivo temático.
3. **Cerrar explícitamente**: al resolver algo, marcarlo ✅ con fecha en `PENDIENTES.md` Y en el archivo de origen. No borrar la fila.
4. **Cada pendiente dice quién lo desbloquea** (nosotros / soporte del CRM / Bling / el equipo / el usuario). Sin eso la lista se vuelve inútil.

## Orden de lectura recomendado
- `PENDIENTES.md` — **empezar acá**: qué está sin resolver, quién lo desbloquea, y dónde está el detalle.
- `00-resumen-general.md` — visión general del proyecto y objetivos.
- `01-agente-de-ia.md` — cómo está armado el editor de Agente de IA en rmsystemm (pestañas, guardrails, herramientas).
- `02-pipeline-comercial-real.md` / `03-funil-de-ventas-nuevo.md` — pipelines del CRM.
- `04-patrones-reales-de-venta.md` — cómo vende el equipo humano hoy (base del prompt).
- `05-infraestructura-tecnica.md` — infraestructura técnica general de la cuenta.
- `06-seguridad-y-pendientes.md` — hallazgos de seguridad y checklist de pendientes (revisar siempre antes de tocar credenciales).
- `07` a `12` — estrategias, remarketing, copiloto IA, DS Voice, biblioteca de prompts, caso real de referencia.
- `13-prompt-agente-fit-v1.md` — el prompt de producción real del agente.
- `14-funil-recompra.md` — pipeline de recompra.
- `15-flujos-automatizacion-avanzados.md` — motor de Flujos de Automatización (nodos, triggers, hallazgos técnicos).
- `16-auditoria-completa-crm.md` — auditoría completa de la cuenta.
- `17-registro-de-cambios.md` — registro cronológico de sesiones de trabajo y decisiones, para retomar el contexto rápido desde otra PC.
- `18-integracion-bling.md` — guía completa de la integración con Bling: cómo repetir la autorización OAuth2, cómo evitar que el token se venza, límites reales de la API, y oportunidades de escalar.
- `19` a `22` — investigación de escalabilidad (n8n, agentes externos, audio), estructura del catálogo, y las preguntas para la reunión con soporte (versión interna y guion en portugués).
- `23-conectores-hub-integraciones.md` — los 25 conectores del Hub leídos uno por uno: qué hace cada uno, cómo se adjuntan al agente, y los hallazgos que cambian planes. Su anexo literal es `23b-conectores-volcado-literal.md`.
- `PENDIENTES.md` — **registro único de todo lo que está sin resolver.** Ver la regla de barrido obligatorio más abajo.
- `19-investigacion-externa-escalabilidad.md` — investigación externa (con fuentes) sobre cómo escalar el agente más allá del CRM: arquitecturas n8n, memoria de largo plazo, guardrails, audio/STT, selección dinámica de audios pre-grabados. Son hallazgos para decidir, no un plan ya aprobado.
- `20-catalogo-estructura-para-el-agente.md` — cómo hay que estructurar el catálogo (categorías, ranking de más vendidos, links) para que el agente recomiende bien. Estructura definida, datos pendientes del export de Shopify.
- `21-preguntas-para-soporte-rmsystemm.md` — preguntas priorizadas para la reunión con soporte del CRM, con el "por qué importa" de cada una (versión interna, para entender qué se busca con cada pregunta).
- `22-guion-reunion-soporte-portugues.md` — la misma reunión pero en portugués, redactada para leer en voz alta durante la llamada. Es el archivo que se usa en vivo; el 21 es el de referencia.

## Nota técnica: MCP de n8n registrado (2026-09-13)
Este proyecto tiene un servidor MCP de n8n registrado (`claude mcp add --transport http n8n https://fitnessuplementos.app.n8n.cloud/mcp-server/http`) pero **sin autenticar todavía**. Al abrir una sesión nueva de Claude Code en este proyecto, correr `/mcp` y elegir "n8n" para autenticar (OAuth, abre una pestaña) — recién ahí aparecen herramientas nativas `mcp__n8n__*` para crear/editar workflows sin pasar por el navegador.

## Reglas importantes al continuar este trabajo
- Al cierre de cada sesión de trabajo con cambios relevantes, agregar una entrada en `17-registro-de-cambios.md` (qué se pidió, qué se hizo/verificó, qué queda pendiente) y hacer commit + push a GitHub antes de cerrar, para poder continuar desde otra PC.
- Nunca pegar API keys, client secrets, access tokens ni refresh tokens completos en estos archivos — si un valor real quedó expuesto en una sesión, documentar el incidente y la mitigación, no el valor.
- Antes de clickear en el CRM real, confirmar con screenshot/snapshot el estado antes y después de cualquier acción que cambie datos.
- No navegar de menús que el usuario ya conoce — ir directo a ubicación + campos/valores.
- Actualizar el archivo correspondiente a medida que se resuelven pendientes, en vez de dejar la información desactualizada.
