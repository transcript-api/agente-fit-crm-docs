# Escalar más allá del CRM — investigación externa (n8n y alternativas)

**Qué es**: investigación con fuentes externas (no específicas de rmsystemm) sobre cómo escalar el agente con automatización/agentes externos, hecha para tener opciones documentadas antes de decidir qué construir.
**Estado real**: n8n ya tiene un webhook real del CRM identificado y un prototipo de enriquecimiento de leads armado, sin activar. Nada en producción.
**Fuente primaria**: [[19-investigacion-externa-escalabilidad]] (todas las fuentes citadas ahí), [[24-sesion-2026-09-14-traspaso]] §2.5-2.6 (el webhook y el workflow reales).

## Por qué n8n
El usuario ya tiene cuenta paga de n8n.cloud, compatible nativo con MCP. Patrón A (usado hoy): el chip "Fazer requisição HTTP" del agente llama a un webhook de n8n en medio de la conversación — límite real de 1-2s de respuesta o se ve trabada. Patrón B: n8n escucha eventos del CRM sin bloquear la conversación (enriquecimiento, scoring, memoria) y escribe resultados de vuelta por la API del CRM — acá va todo lo que no necesita pasar en el mismo turno.

## Lo construido y probado
- Webhook de entrada real: `POST https://api.rmsystemm.com.br/webhook/leads/<TOKEN>` (ver [[api-rmsystemm]]), confirmado que acepta leads con campos adicionales personalizados.
- Workflow de n8n **"FV | Enriquecimiento y ruteo de leads"** (7 nodos): recibe un lead → consulta el catálogo público de Shopify → cruza el nombre del anuncio contra el catálogo (mínimo 2 coincidencias de palabras para no inventar un match) → clasifica caliente/tibio/frío → crea el negocio en el CRM ya enriquecido con producto/precio/link identificados. **Importado, nunca activado.**

## Memoria de largo plazo (patrón recomendado, no implementado)
Capas: corto plazo (ventana de turnos) → resumen por sesión → **perfil estructurado por cliente** (tabla: preferencias, historial, objeciones, último contacto) → capa semántica (RAG solo sobre el catálogo, nunca sobre el cliente). Para un catálogo de un solo rubro, una tabla Postgres/Airtable simple alcanza — un vector store es sobre-ingeniería a esta escala. Nodos nativos de n8n relevantes: Window Buffer Memory, Postgres/Redis Chat Memory, Zep Memory (extrae hechos/entidades solo, resume).

## Guardrails más allá del guardrail nativo (roto en su momento)
Patrón NeMo Guardrails como checklist mental: input (sanear/detectar inyección), dialog (qué temas permitidos), retrieval (filtrar qué llega del catálogo al prompt), execution (bloquear acciones de alto riesgo hasta confirmación humana — descuentos, marcar pagado), output (validar el mensaje final). **Humano-en-el-loop asíncrono, nunca bloqueante**: el patrón que funciona en producción es una cola de aprobación, no detener al agente esperando.

## Casos reales de referencia (para calibrar expectativas, no para copiar cifras de marketing)
Sierra AI y Decagon son casos con cobertura independiente real (Serie C, clientes citados) — Decagon usa "Agent Operating Procedures" (SOPs compilados a lógica ejecutable) en vez de un prompt libre único, concepto cercano a lo que [[fit-brain-vision]] propone. **No se encontró ningún caso público auditado de un bot de WhatsApp cerrando ventas de forma completamente autónoma a escala con números verificados** — tratar eso como aspiración, no como receta conocida. Casos de falla documentados (Air Canada, un concesionario Chevrolet con prompt injection a $1) confirman: la empresa responde por lo que promete el bot, y sin límites de alcance + gatillos de escalamiento, el riesgo es real y legal, no solo reputacional.

## Audio: qué es nativo de Meta y qué no
WhatsApp Business API **no transcribe notas de voz nativamente** — eso es una función de la app de consumo, no de integraciones por API. Patrón estándar en n8n: webhook recibe audio → resolver a archivo → transcribir (Whisper/Groq/otro) → entra al flujo como texto. Sin benchmark confiable de español rioplatense específico en ningún proveedor evaluado.

## Ruflo/"Claude Flow" — evaluado y descartado para este caso
Es real (72k+ estrellas, MIT), pero es un meta-harness para swarms de ingeniería de software dentro de Claude Code — no tiene historia de integración con CRMs/webhooks de negocio. Si se quiere la FORMA "orquestador + workers" (ver [[fit-brain-vision]]), conviene construirla nativa en n8n, no adoptar un framework pensado para otro trabajo.

## Pendientes relacionados
N16 (decidir si se paga n8n, cruza con si Fit Brain termina en Hermes), N3 (completar el prototipo con un token real de Bling y probarlo, depende de B1).
