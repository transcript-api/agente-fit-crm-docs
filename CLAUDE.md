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

**Para ponerse al día rápido, en este orden:**
1. `PENDIENTES.md` — el registro único: qué está sin resolver, quién lo desbloquea, y dónde está el detalle. **Si alguien pregunta "¿qué hay que hacer?", se responde desde acá.** Ver la regla de barrido obligatorio arriba.
2. `17-registro-de-cambios.md` — registro cronológico de sesiones, empezando por la más reciente arriba. La forma más rápida de entender "qué pasó última vez".
3. `31-pipeline-masivo-y-api-negocios-2026-09-19.md` y `30-traspaso-2026-09-15-noche-3-agentes.md` — el estado real más reciente del proyecto (remarketing masivo y los 3 agentes de venta, respectivamente).

**Según el tema puntual:**
- `31-pipeline-masivo-y-api-negocios-2026-09-19.md` — remarketing masivo. La pipeline "PIPELINE MASIVO" (2396 leads reales esperando), el endpoint de la API para segmentar (`/commercial-order/{id}/move`), y por qué el plan anterior de mandar el mensaje libre probablemente esté equivocado (hace falta un template pre-aprobado). Todo investigado y diseñado, nada ejecutado sobre datos reales.
- `30-traspaso-2026-09-15-noche-3-agentes.md` — los agentes de venta. Los 3 agentes reales (Recepcionista/Conversión/Cierre), la auditoría colaborativa con ChatGPT que reescribió los 5 prompts (los 3 reales + 2 nuevos), el estado verificado de cada uno en rmsystemm, y un hallazgo técnico sobre el editor de prompts a conocer antes de tocarlo por script.
- `29-prompts-por-columna.md` — el prompt de producción de cada agente, uno por columna del embudo (incluye los 2 que todavía no existen como agente real).
- `26-respuestas-reunion-soporte-2026-09-14.md` — **las respuestas reales de la reunión con soporte**, pregunta por pregunta (mapeadas a los archivos 21/22), más los hallazgos de las capturas que compartieron en vivo. Incluye el hallazgo más accionable del proyecto hasta ahora: la causa probable (no un bug irreparable) de por qué el agente nunca consultó el catálogo.
- `28-traspaso-2026-09-15-deck-e-informe.md` — la presentación y el informe para la gerencia: qué quedó publicado, las reglas de escritura que puso el usuario (la más importante: **no decir lo obvio**), los datos que se cayeron y no hay que volver a usar, las trampas del editor del canvas.
- `32-meta-muse-y-business-agent.md` — Muse AI vs. Meta Business Agent: qué compite con el agente propio y qué no. *(Renombrado el 2026-09-19 desde `26-meta-muse-y-business-agent.md` — había dos archivos "26-" distintos por un merge de dos sesiones en paralelo; se resolvió la colisión moviendo este, que tenía menos enlaces entrantes, al primer número libre.)*
- `24-sesion-2026-09-14-traspaso.md` — el traspaso de esa sesión: los bugs medidos, lo construido y lo que faltaba en ese momento.
- `18-integracion-bling.md` — integración con Bling: cómo repetir la autorización OAuth2, evitar que el token se venza, límites reales de la API, oportunidades de escalar.
- `23-conectores-hub-integraciones.md` — los 25 conectores del Hub leídos uno por uno: qué hace cada uno, cómo se adjuntan al agente, hallazgos que cambian planes. Anexo literal: `23b-conectores-volcado-literal.md`.
- `21-preguntas-para-soporte-rmsystemm.md` / `22-guion-reunion-soporte-portugues.md` — lo que se preguntó originalmente y por qué (21, referencia interna) y el guion en portugués para leer en vivo (22). **Las respuestas están en el 26**, no acá.
- `20-catalogo-estructura-para-el-agente.md` — cómo estructurar el catálogo (categorías, ranking de más vendidos, links) para que el agente recomiende bien.
- `19-investigacion-externa-escalabilidad.md` — investigación externa (con fuentes) sobre escalar el agente más allá del CRM: arquitecturas n8n, memoria de largo plazo, guardrails, audio/STT.

**Fundamentos del proyecto (rara vez hace falta releerlos enteros, pero son la base):**
- `00-resumen-general.md` — visión general del proyecto y objetivos.
- `01-agente-de-ia.md` — cómo está armado el editor de Agente de IA en rmsystemm (pestañas, guardrails, herramientas).
- `02-pipeline-comercial-real.md` / `03-funil-de-ventas-nuevo.md` — pipelines del CRM.
- `04-patrones-reales-de-venta.md` — cómo vende el equipo humano hoy (base del prompt).
- `05-infraestructura-tecnica.md` — infraestructura técnica general de la cuenta.
- `06-seguridad-y-pendientes.md` — hallazgos de seguridad y checklist de pendientes (revisar siempre antes de tocar credenciales).
- `07` a `12` — estrategias, remarketing, copiloto IA, DS Voice, biblioteca de prompts, caso real de referencia.
- `13-prompt-agente-fit-v1.md` — el prompt de producción real del agente (versión histórica; los prompts vivos están en el 29 y en `30`).
- `14-funil-recompra.md` — pipeline de recompra.
- `15-flujos-automatizacion-avanzados.md` — motor de Flujos de Automatización (nodos, triggers, hallazgos técnicos).
- `16-auditoria-completa-crm.md` — auditoría completa de la cuenta.

## Nota técnica: MCP de n8n registrado (2026-09-13)
Este proyecto tiene un servidor MCP de n8n registrado (`claude mcp add --transport http n8n https://fitnessuplementos.app.n8n.cloud/mcp-server/http`) pero **sin autenticar todavía**. Al abrir una sesión nueva de Claude Code en este proyecto, correr `/mcp` y elegir "n8n" para autenticar (OAuth, abre una pestaña) — recién ahí aparecen herramientas nativas `mcp__n8n__*` para crear/editar workflows sin pasar por el navegador.

## Reglas importantes al continuar este trabajo
- Al cierre de cada sesión de trabajo con cambios relevantes, agregar una entrada en `17-registro-de-cambios.md` (qué se pidió, qué se hizo/verificó, qué queda pendiente) y hacer commit + push a GitHub antes de cerrar, para poder continuar desde otra PC.
- Nunca pegar API keys, client secrets, access tokens ni refresh tokens completos en estos archivos — si un valor real quedó expuesto en una sesión, documentar el incidente y la mitigación, no el valor.
- Antes de clickear en el CRM real, confirmar con screenshot/snapshot el estado antes y después de cualquier acción que cambie datos.
- No navegar de menús que el usuario ya conoce — ir directo a ubicación + campos/valores.
- Actualizar el archivo correspondiente a medida que se resuelven pendientes, en vez de dejar la información desactualizada.
