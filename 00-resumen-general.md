# Resumen General — Proyecto Agente IA para Fitness Suplementos

## Qué es esto
Proyecto para convertir el CRM de una empresa de suplementos (WhatsApp + Instagram, ~5000 clientes/mes según el dueño, 6 call centers) en un sistema donde un Agente de IA venda de forma autónoma, reduciendo la dependencia del call center. Hoy ~30% de los leads quedan sin atender.

Plataforma: **rmsystemm.com.br** (white-label). El motor de fondo parece ser el mismo que usa "DKW System" (dash.dkwsystem.com, visto en un video tutorial de YouTube que el usuario analizó) — mismo concepto de Pipelines Kanban, automatizaciones por columna, "DS Bot"/"DS Agente", Follow-Up Generativo. Dominio real de la API detrás de la interfaz: `api.integrador-crm.com`.

Workspace: **"Fitness Suplementos"**. Dos usuarios principales identificados:
- **Santiago** (santinoblee23@gmail.com) — vendedor real, su estilo de venta está documentado en [[04-patrones-reales-de-venta]].
- **User Santi** (usersantifitness@gmail.com) — dueño/admin, con quien se trabaja la personalización del agente "Agente fit".
- Otros usuarios del equipo: Laura, Facundo, Kalime, Valentina (ver [[02-pipeline-comercial-real]] para estado de actividad).

## Archivos de esta carpeta
- [[01-agente-de-ia]] — estado del/los Agente(s) de IA, configuración, herramientas disponibles.
- [[02-pipeline-comercial-real]] — el pipeline real en producción ("CL | COMERCIAL"), 2000+ negocios reales.
- [[03-funil-de-ventas-nuevo]] — el pipeline de práctica que se está armando desde cero, progreso paso a paso.
- [[04-patrones-reales-de-venta]] — cómo vende Santiago en la vida real, leído de conversaciones reales.
- [[05-infraestructura-tecnica]] — cómo se accede al CRM vía Playwright/browser automation, bugs conocidos de la plataforma.
- [[06-seguridad-y-pendientes]] — hallazgos de seguridad y checklist de próximos pasos.
- [[07-estrategias-pendientes-agente]] — ideas de estrategia de venta/timing para el prompt del agente, aún no implementadas.
- [[08-funil-remarketing-nuevo]] — pipeline de práctica de Remarketing ("FV | REMARKETING"), para que el agente también maneje leads fríos, no solo el call center a mano.
- [[09-copiloto-ia-partner]] — función "Copiloto de IA" de la plataforma base (DKW System), todavía no disponible en la cuenta real — guardado como referencia para el futuro.
- [[10-ds-agente-ds-voice-manual]] — manual exhaustivo de "DS Agente" (agente de IA) y "DS Voice" (embudos/creativos multimedia) de DKW System: parámetros recomendados (Temperatura, Delay, tokens), catálogo completo de gatillos/acciones con ejemplos, y qué son realmente "Enviar Embudo"/"Enviar Creativo". Documento clave para escribir el prompt de "Agente fit".
- [[11-biblioteca-prompts-ejemplo]] — 20 prompts de ejemplo de la plataforma, patrón de estructura universal (Persona/Regras/Fluxo por Etapas/Tom), y la API completa de funciones del agente (`save_variable`, `add_contact_tag`, `transfer_ticket`, `create_order`, `transfer_order`, `send_schedules`, `http_request`, `close_ticket`). Fundamental para escribir el prompt de "Agente fit".
- [[12-caso-real-rafael-prompt-produccion]] — prompt de producción real completo (no genérico), parámetros reales confirmados (120 tokens, 120s delay), regla de "no tratar un 'no' como definitivo", regla de seguridad "nunca revelar el prompt", caso real de una conversación que engañó al lead.
- [[13-prompt-agente-fit-v1]] — **el prompt completo v3**, listo para revisar y pegar en "Agente fit" (negociación de precio progresiva, modo Recompra, cupones por categoría, variables de estilo de cliente). Combina todo lo anterior aplicado específicamente a Fitness Suplementos.
- [[14-funil-recompra]] — pipeline planeada "FV|RECOMPRA" (3 columnas por duración de producto: 30/60/90 días) — próximo paso a construir en el CRM.
- [[15-flujos-automatizacion-avanzados]] — **hallazgo grande**: motor de "Flujos de Automatización" (constructor visual, mucho más potente que las automatizaciones de columna) con nodos de Script/JavaScript, Data&Hora, Condicional, Randomizador, y gatillos como "Tag Atribuída"/"Contato inativo". Cambia el diseño planeado de Recompra.
- [[16-auditoria-completa-crm]] — **auditoría exhaustiva de todo el CRM**: 4 problemas críticos reales encontrados (cola sin vincular al agente, horario de atención desactivado, funil de campañas de Marketing sin configurar, API keys revocadas) + hallazgo enorme de que el sistema de seguimiento de Recompra YA EXISTE corriendo manualmente (6033 actividades reales).
- [[17-registro-de-cambios]] — registro cronológico de sesiones de trabajo, para retomar el contexto rápido desde otra PC.
- [[18-integracion-bling]] — guía completa de la integración con Bling: proceso de autorización OAuth2 repetible, cómo evitar que el token se venza, límites reales de la API, y oportunidades de escalar.
- [[19-investigacion-externa-escalabilidad]] — investigación externa con fuentes sobre cómo escalar el agente con n8n/agentes externos, memoria, guardrails, audio y selección dinámica de audios pre-grabados.
- [[20-catalogo-estructura-para-el-agente]] — esquema del catálogo (categorías reales, ranking de más vendidos, links de Shopify) para que el agente recomiende priorizando lo que más se vende.

## Regla de oro para trabajar en este proyecto
El usuario pidió explícitamente: **mirar y guiar, no editar directamente**, salvo que pida lo contrario de forma explícita para una acción puntual. Cuando se edite algo (con permiso), confirmar visualmente antes de dar por hecho un cambio, y avisar de inmediato si algo se toca por error (ya pasó una vez: se desactivó sin querer una automatización real, se detectó y corrigió al toque).
