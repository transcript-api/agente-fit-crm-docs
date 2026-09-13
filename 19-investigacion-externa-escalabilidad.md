# Investigación externa: cómo escalar el Agente Fit más allá del CRM (2026-09-13, madrugada)

Este archivo consolida investigación **externa pura** (búsqueda web, sin tocar el CRM real) hecha durante una sesión de trabajo autónomo nocturno, a pedido explícito del usuario ("quiero que investigues lo maximo de ideas para crear agentes por afuera que sean escalables"). No es un plan decidido — son hallazgos con fuentes reales, para que una futura sesión (con el usuario presente) decida qué construir primero. Todo lo marcado como "no verificado" es exactamente eso — no inventar que algo funciona porque suena razonable.

## Por qué n8n (y no otra cosa)
El usuario ya tiene una cuenta paga de n8n.cloud (`fitnessuplementos.app.n8n.cloud`) y dejó un workspace abierto para probar. n8n es compatible de forma nativa con Model Context Protocol (MCP) — se registró como servidor MCP de este proyecto (`claude mcp add --transport http n8n https://fitnessuplementos.app.n8n.cloud/mcp-server/http`), pero **hace falta reiniciar Claude Code y correr `/mcp` para autenticar** antes de que las herramientas nativas de n8n aparezcan en una sesión (no se pudo recargar en caliente en esta sesión).

## 1. Patrones de "agente que orquesta a otro agente" (CRM ↔ n8n)
No hay un estándar único con nombre propio para este caso concreto (chat-agent de un SaaS vertical + automatización no-code externa), pero se mapea a patrones ya documentados:

- **Patrón A — n8n como "tool server" síncrono**: el chip "Fazer requisição HTTP" que YA tiene el Agente Fit llama a un Webhook de n8n en medio de la conversación; n8n hace el trabajo real (consulta a Bling, validación) y devuelve JSON. No requiere ninguna capacidad nueva del CRM. Límite real: tiene que responder en 1-2 segundos o el cliente ve la respuesta trabada — no es el lugar para razonamiento pesado.
- **Patrón B — n8n escuchando eventos del CRM, sin bloquear la conversación**: n8n se suscribe a webhooks del CRM (mensaje nuevo, ticket transferido), corre su propio nodo "AI Agent" (con memoria, vector store, más herramientas de las que tiene el CRM) y escribe resultados de vuelta vía la API del CRM. Acá va todo lo que no necesita pasar en el mismo turno: enriquecimiento, scoring, decisiones de escalamiento, actualización de perfil.
- **Patrón C — orquestador/workers** (el mismo patrón que usa Anthropic para investigación multiagente): un agente líder reparte tareas a sub-agentes especializados en paralelo. Reportado ~90% mejor que un solo agente en tareas de investigación, pero a ~15x el costo en tokens — tiene sentido como FORMA (sub-flujos de n8n especializados en precio/objeciones/estado de pedido), no como un swarm literal de múltiples LLMs por cada respuesta de WhatsApp (no se justifica el costo a esta escala).
- **Patrón D — MCP en vez de HTTP crudo**: n8n tiene tanto MCP Server Trigger (expone flujos de n8n como herramientas MCP) como MCP Client. Como la única superficie real de integración del CRM hoy es HTTP genérico, el camino realista de corto plazo es webhook/HTTP, no MCP — MCP importa más si en algún momento n8n se conecta directo a Claude/Claude Code.

Fuentes: [Hatchworks – Multi-Agent Solutions in n8n](https://hatchworks.com/blog/ai-agents/multi-agent-solutions-in-n8n/), [n8n docs – HTTP Request node](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.httprequest), [n8n docs – Tools Agent](https://docs.n8n.io/integrations/builtin/cluster-nodes/root-nodes/n8n-nodes-langchain.agent/tools-agent), [ByteByteGo – How Anthropic Built a Multi-Agent Research System](https://blog.bytebytego.com/p/how-anthropic-built-a-multi-agent).

## 2. Nodos concretos de n8n para una capa de enriquecimiento del agente de ventas
- **AI Agent node** (LangChain, modo "Tools Agent") — el orquestador.
- **HTTP Request** — llamar a Bling, a la API del CRM, o cualquier REST como herramienta del agente.
- **Vector Store nodes** (Pinecone, Supabase/pgvector, Qdrant) + Document Loader/Embeddings — RAG sobre el catálogo.
- **Memory nodes**: Window Buffer Memory (últimos N turnos, buen default), Postgres/Redis Chat Memory (para reliability multi-worker), **Zep Memory** (extrae hechos/entidades automáticamente y resume — lo más cercano a "memoria inteligente" sin construirlo a mano).
- **Sentiment Analysis node** — clasifica el mensaje (Interesado / Objeción / Frustrado) y ramifica el flujo.
- **Text Classifier / Information Extractor** — extraen campos estructurados (producto mencionado, tipo de objeción) de texto libre.
- ⚠️ **Evolution API** (integración WhatsApp no oficial popular en Brasil/LatAm): **solo funciona en n8n self-hosted, no en n8n.cloud** (lo que este negocio tiene) — no es una opción usable tal cual, y además tiene riesgo real de ToS/ban de WhatsApp. Se marca para que nadie la persiga por error.

Fuentes: [n8n Blog – AI Agent Memory](https://blog.n8n.io/ai-agent-memory/), [Aiven – Agentic RAG with PostgreSQL and n8n](https://aiven.io/blog/building-agentic-rag-with-postgresql-and-n8n), [GrowwStacks – Evolution API + n8n](https://growwstacks.com/blog/connect-whatsapp-n8n-evolution-api).

## 3. Memoria de largo plazo/personalización más allá del system prompt
Patrón que se repite en todas las fuentes: memoria en capas — corto plazo (ventana de turnos) → resumen por sesión → **perfil estructurado por cliente** (una fila en base de datos: preferencias, historial de compra, objeciones, último contacto) → capa semántica/vectorial (RAG sobre el catálogo/FAQ, NO sobre el cliente).

- **La resolución de identidad entre canales** (número de WhatsApp ↔ contacto del CRM ↔ cliente de Bling) es la parte realmente difícil de "memoria" — ya está medio resuelta porque Bling está integrado; falta una tabla de memoria-por-cliente separada del historial de chat crudo.
- **El RAG va en el catálogo, no en el cliente.** Precios/stock/promos en un vector store (o directamente una tabla Postgres/Airtable si el catálogo es chico) consultado como herramienta, no en el prompt — así una actualización de precio en Bling no requiere tocar el prompt.
- Para un catálogo de un solo rubro (suplementos), **una base vectorial puede ser sobre-ingeniería todavía**: una tabla Postgres simple con lookup por SKU/palabra clave hace el mismo trabajo con mucha menos infraestructura.
- Herramientas nombradas: **Zep** (nodo nativo de n8n) y **mem0.ai** (producto dedicado a memoria persistente de clientes, encontrado en la búsqueda pero no evaluado en profundidad).

Fuentes: [n8n Blog – AI Agent Memory](https://blog.n8n.io/ai-agent-memory/), [Mem0 – Customer Service Chatbots with Persistent Memory](https://mem0.ai/blog/customer-service-chatbots-with-persistent-memory-2).

## 4. Casos reales de agentes de venta por WhatsApp/IG: qué funciona y qué falla
**Cifras de vendedores de herramientas de WhatsApp AI** (15-30% recuperación de carrito, "$18K recuperados en 30 días", 76-92% resolución autónoma, etc.) — **no verificadas de forma independiente**, tratarlas como marketing, no como evidencia.

**Empresas reales con cobertura independiente** (más de soporte que de cierre de venta, pero arquitectónicamente análogas):
- **Sierra AI** — ronda Serie C de ~$950M a valuación ~$15.8B (mayo 2026, según cobertura de la industria); clientes citados: ADT, SiriusXM, Rocket Mortgage, Brex. Combina agentes que ejecutan acciones con **"guardrails supervisores"** y cobra por resultado (no por asiento) — un mecanismo de confianza que vale la pena copiar conceptualmente aunque sea a chica escala.
- **Decagon** — construido sobre **"Agent Operating Procedures" (AOPs)**: SOPs escritos y compilados a lógica ejecutable del agente, en vez de un único system prompt libre. Resultados citados: Chime ~70% resolución combinada chat+voz, Duolingo 80% de desvío de chat al mes de lanzar.
- **Artisan (Ava)** — se vende como SDR de IA "totalmente autónomo". **No se pudo verificar** ninguna cifra auditada de tasa de cierre independiente de la propia empresa.

**No se encontró ningún caso público auditado de un bot de WhatsApp/IG cerrando ventas de forma completamente autónoma a escala con números verificados** — tratar "cerrar ventas solo" como una aspiración sin receta pública establecida todavía, no como un objetivo con camino conocido.

**Casos de falla bien documentados (alta confianza, útiles como advertencia concreta)**:
- **Air Canada** — su chatbot inventó una política de reembolso por duelo que no existía; un tribunal responsabilizó a la aerolínea por lo que prometió el bot (feb. 2024). Precedente directo: la empresa responde por promesas alucinadas, incluidas de reembolso/precio/política.
- **Concesionaria Chevrolet (Watsonville, dic. 2023)** — un chatbot con GPT fue manipulado (prompt injection) para "aceptar" vender un auto a $1; se viralizó (20M+ vistas) aunque no lo cumplieron.

Causas raíz citadas en varias fuentes: generación sin anclaje a datos reales, sin límites de alcance, sin gatillos duros de escalamiento para pedidos de alto riesgo, y sin revisión periódica de transcripciones para detectar fallas nuevas antes de que escalen.

Fuentes: [Cresta – Decagon vs Sierra vs Cresta](https://cresta.com/guides/decagon-vs-sierra), [Envive – Chevy dealership $1 case study](https://www.envive.ai/post/case-study-chevy-dealerships-ai-chatbot), [Uptail – WhatsApp AI Hallucinations in Sales](https://www.uptail.ai/blog/whatsapp-ai-hallucinations-how-to-stop-them-in-sales).

## 5. ¿Qué es `github.com/ruvnet/ruflo`? (el usuario pidió instalarlo)
**Es real** — confirmado bajando el repo directo, no solo por búsqueda: ~72.3k estrellas, ~8.6k forks, ~7.466 commits, licencia MIT, TypeScript/Rust, mantenido activamente. El propio README dice **"Claude Flow is now Ruflo"** — es el sucesor renombrado del proyecto anterior "Claude Flow" del mismo autor (ruvnet / Reuven Cohen).

**Qué hace**: un "meta-harness" que envuelve Claude Code (y Codex/otros) para hacer correr y coordinar muchos sub-agentes especializados ("100+ agentes") en tareas de ingeniería de software — código, tests, seguridad, docs — con memoria vectorial persistente ("AgentDB"), memoria adaptativa, "federación" entre máquinas, integración MCP nativa, CLI (`npx ruflo init`) y una UI web.

**¿Sirve para orquestar agentes alrededor de este CRM? No.** Su superficie de integración está pensada para swarms de ingeniería de software dentro de Claude Code/Codex, no para flujos conversacionales de negocio dirigidos por webhook/HTTP que un dueño no técnico pueda mantener. No tiene ninguna historia documentada de integración con WhatsApp/webhooks de CRM. n8n está hecho justo para esta forma de integración (builder visual, nativo en HTTP/webhook, ya pago) — si se quiere la FORMA "orquestador + workers" que Ruflo representa, conviene construirla nativa en n8n (sub-flujos) en vez de adoptar un framework grande pensado para otro trabajo.

Fuente: [github.com/ruvnet/ruflo](https://github.com/ruvnet/ruflo) (leído directo).

## 6. Arquitecturas de guardrails más allá del (roto) tab "Guardrails" del CRM
Dado que se confirmó esta misma madrugada que los guardrails nativos del CRM no persisten (ver [[01-agente-de-ia]]), esto cobra urgencia real:

- **Structured outputs / esquema estricto**: forzar cualquier respuesta con precio/stock a pasar por un JSON validado — el modelo solo puede *repetir* un número que vino de una herramienta, nunca componerlo libre. Rechazar y reintentar si falla la validación.
- **Segunda pasada de verificación anclada a la evidencia** (patrón de NeMo Guardrails): un segundo LLM barato pregunta "¿esta respuesta está respaldada por lo que se recuperó?" — si no, el agente se abstiene o escala en vez de responder.
- **Listas de permitidos**: cualquier valor elegido de un conjunto conocido (nombre de producto, código de cupón, método de pago) se valida server-side contra ese conjunto.
- **Las 5 categorías de NeMo Guardrails** (útil como checklist mental aunque no se adopte la librería): *input* (sanea mensajes entrantes/detecta inyección), *dialog* (qué temas/flujos están permitidos), *retrieval* (filtra qué fragmentos del catálogo llegan al prompt), *execution* (bloquea acciones de alto riesgo — aplicar un descuento, marcar un pedido como pagado — hasta confirmación), *output* (valida el mensaje final antes de mandarlo).
- **Humano-en-el-loop asíncrono, nunca bloqueante**: bloquear al agente esperando una aprobación humana en medio de la conversación falla en producción. El patrón que funciona es una **cola de aprobación**: el agente redacta la acción riesgosa (descuento a medida, reembolso), un humano la aprueba desde una cola/notificación, la conversación sigue con un mensaje de espera mientras tanto.
- **Gatillos de escalamiento**: pedido explícito ("quiero hablar con una persona"), por sentimiento (frustración detectada), por sensibilidad del tema (promesas contractuales, y — relevante acá — afirmaciones de salud sobre suplementos), y por baja confianza de la recuperación (escalar en vez de adivinar).
- **Revisión periódica de transcripciones** aparece como un cuarto pilar junto a los técnicos — mapea directo con lo que el usuario ya quiere ("un humano revisa periódicamente qué funcionó"): tratarlo como un guardrail formal, no como algo informal.

Fuentes: [NVIDIA – NeMo Guardrails overview](https://developer.nvidia.com/nemo-guardrails), [Digital Applied – Human-in-the-Loop Escalation Design 2026](https://www.digitalapplied.com/blog/human-in-the-loop-escalation-design-ai-agents-2026).

## 7. Audio — el agente "escuchando" notas de voz
- **WhatsApp Business (API) no transcribe notas de voz de forma nativa** — la transcripción on-device de la app de consumo (nov. 2024) no aplica a integraciones por API. Lo único nativo de Meta es transcripción de **llamadas** de la WhatsApp Business Calling API (jun. 2026), que es un caso de uso distinto (llamadas, no notas de voz de chat).
- **Conclusión**: si rmsystemm no tiene un toggle de audio (solo "Procesar imágenes"), lo más probable es que **todavía no lo implementaron**, no que no haga falta.
- **Patrón estándar ya empaquetado en n8n**: webhook recibe el mensaje → nodo Switch detecta "es audio" → se resuelve el media ID a URL/archivo → se transcribe (Whisper/Groq, u otro proveedor) → el texto entra al mismo flujo/agente como si el cliente lo hubiera tecleado. Hay plantillas públicas y funcionales: [Transcribe WhatsApp audio con Whisper vía Groq](https://n8n.io/workflows/6077-transcribe-whatsapp-audio-messages-with-whisper-ai-via-groq/), [WhatsApp voice notes + auto-reply con Whisper y GPT-4o](https://n8n.io/workflows/16897-transcribe-whatsapp-voice-notes-and-auto-reply-with-openai-whisper-and-gpt-4o/).
- **Proveedores de STT 2026 y español** (sin benchmark específico rioplatense confirmado en ninguna fuente — hueco real de la industria, no solo de esta búsqueda):
  - **OpenAI** `gpt-4o-transcribe`/`gpt-4o-mini-transcribe` — sucesores de Whisper, mejor WER, sin cifra de español citada.
  - **Deepgram Nova-3** — agregó español/portugués con "diversidad de dialecto (LatAm, Brasil, Europa)", pero una fuente general advierte que el rioplatense específicamente "puede causar más errores que el español mexicano o castellano estándar en modelos generales".
  - **ElevenLabs Scribe/Scribe v2** — única con cifra propia de WER en español (3.1% FLEURS, 5.5% Common Voice), dice superar a Whisper/Deepgram/Gemini en sus propios benchmarks (no auditado externamente).
- **Recomendación práctica**: probar en paralelo con ~15-20 notas de voz reales de clientes uruguayos antes de elegir proveedor — no confiar en el marketing.

Fuentes: [Transcribbit – WhatsApp Business transcription guide](https://transcribbit.io/blog/whatsapp-business-transcription-guide), [Deepgram – Nova-3 Spanish/French/Portuguese](https://deepgram.com/learn/deepgram-expands-nova-3-with-spanish-french-and-portuguese-support), [ElevenLabs – Meet Scribe](https://elevenlabs.io/blog/meet-scribe).

## 8. Selección dinámica de audios pre-grabados del call center (idea del usuario, ver [[07-estrategias-pendientes-agente]])
La idea: el call center graba clips explicando productos/situaciones puntuales; el agente detecta en la conversación cuál aplica y lo manda con una intro corta ("mirá, te explico"), eligiendo de una librería que va a ir creciendo — no un disparador fijo por palabra clave.

- **No hay un nombre único de industria para esta técnica exacta.** Lo más cercano es "RAG multimodal" (usado para *buscar/consultar* contenido, no tanto para "elegir qué asset mandar en una venta") y "Semantic Router" (enruta la consulta a la herramienta/prompt correcto, concepto hermano, no el mismo caso). En la práctica, lo que describe el usuario es simplemente **tool calling con un catálogo como contexto** — una aplicación de RAG, pero más simple de implementar que un pipeline de ML.
- **Cómo implementarlo barato, con evidencia real (no solo intuición)**: mientras la librería de clips sea chica, **saltarse la base vectorial por completo** — una tabla (Google Sheets/Airtable/un campo del CRM) con `{clip_id, producto, situación/tags, resumen de 1-2 líneas, referencia al asset ya cargado en "Enviar funil de Criativos"}` pasada completa como contexto de una herramienta nueva del agente (ej. `elegir_audio_precargado`); el LLM devuelve el `clip_id` elegido. Es literalmente el patrón que n8n ya empaqueta para casos análogos (Google Sheets + embeddings + GPT resolviendo, con plantillas oficiales). Recién si la tabla crece mucho, agregar una capa de embeddings/vector store sobre la misma fuente.
- **No se encontró ningún caso público documentado** de un bot de WhatsApp/IG de e-commerce que ya haga esto exacto (selección dinámica de audio pre-grabado en medio de una venta) — el paralelo real más cercano y sí documentado en producción es el **catálogo de productos de Meta Business Agent**, que resuelve el mismo problema estructural (elegir el ítem correcto de una lista creciente según lo que dice el cliente) pero aplicado a productos, no a audios.
- **Recomendación de seguridad**: dado el riesgo reputacional de mandar el audio equivocado (ej. una intolerancia mal identificada), arrancar con un paso de confirmación humana ("el bot quiere mandar el clip X, ¿confirmás?") las primeras semanas, y automatizar el envío directo recién cuando el catálogo y el criterio estén validados con casos reales.

Fuentes: [Ragie – How We Built Multimodal RAG for Audio and Video](https://www.ragie.ai/blog/how-we-built-multimodal-rag-for-audio-and-video), [n8n – AI-Powered RAG Q&A Chatbot with Google Sheets](https://n8n.io/workflows/4071-ai-powered-rag-qanda-chatbot-with-openai-google-sheets-glide-and-supabase/), [Meta Business Agent (catálogo de productos)](https://whatsappbusiness.com/products/business-app-ai-agent/).

## Prototipo construido esta noche en n8n (guardado, NO publicado/activo)
Siguiendo la recomendación #1 de más abajo, se construyó un prototipo real (no solo diseño en papel) en la cuenta de n8n del usuario: **"PROTOTIPO - Bling precio-stock por ID (webhook)"** (`fitnessuplementos.app.n8n.cloud`, proyecto Personal). Estructura: nodo **Webhook** (GET, path `/webhook-test/bling-produto`, responde con "When Last Node Finishes") → nodo **HTTP Request** (`GET https://www.bling.com.br/Api/v3/produtos/{{ $json.query.id }}`, header `Authorization: Bearer PEGAR_ACCESS_TOKEN_VIGENTE_ACA`).

**Deliberadamente incompleto en 2 puntos, a propósito**:
1. El header de Authorization tiene un placeholder literal (`PEGAR_ACCESS_TOKEN_VIGENTE_ACA`) en vez de un token real — no se tipeó un secreto real en una herramienta externa nueva sin supervisión humana, mismo criterio de cautela que con el CRM.
2. Está guardado como borrador, **sin publicar/activar** — el webhook no responde todavía a nadie.

**Para que alguien lo complete y lo pruebe**: pegar un `access_token` de Bling vigente en el header, click "Listen for test event", y visitar la Test URL agregando `?id=<un id real de producto>` (ej. `16700918516`, uno de los IDs ya confirmados hoy). Publicar recién cuando se decida usarlo de verdad — hoy es solo la prueba de concepto de la Recomendación #1.

## Top 3 recomendaciones concretas (no implementadas, para decidir con el usuario)
1. **Cerrar primero el hueco de alucinación/riesgo legal, antes de sumar más "inteligencia".** El guardrail nativo del CRM no persiste, y Bling ya está conectado a n8n. Construir UN flujo webhook en n8n que el Agente Fit llame de forma síncrona (con "Fazer requisição HTTP") para cualquier pregunta de precio/stock: n8n consulta el dato real y devuelve JSON estructurado; el prompt se reescribe para que el modelo solo pueda citar un número que vino de ese JSON, nunca uno compuesto. Reutiliza infraestructura ya construida — no requiere plataforma nueva. (Bloqueado hoy por el bug de filtros de Bling, ver [[18-integracion-bling]] — hay que resolver eso primero.)
2. **Reemplazar "memoria vía system prompt" por una tabla real de perfil por cliente** (Postgres o Airtable, no vector DB todavía), poblada por un flujo de n8n suscripto a webhooks de conversación del CRM, con hechos estructurados (productos discutidos, objeciones, historial de compra sincronizado de Bling). El RAG vectorial recién se justifica cuando el catálogo/FAQ crezca más allá de lo que entra en una tabla de consulta simple.
3. **No adoptar Ruflo ni perseguir "cierre 100% autónomo" como próximo hito — construir orquestador/workers nativo en n8n.** Usar los nodos de Sentiment Analysis + Text Classifier de n8n como router hacia sub-flujos especializados (precio, objeciones, estado de pedido), mantener toda acción de alto riesgo (descuentos, reembolsos) detrás de una cola de aprobación asíncrona, y formalizar la revisión periódica de conversaciones que el usuario ya quiere hacer como un guardrail más, no como algo informal.
