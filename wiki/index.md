# Índice maestro — wiki/

Catálogo de todo lo que hay en esta capa, por categoría. Ver `WIKI.md` para cómo se mantiene esto. Cada línea: página — una frase de gancho.

## Agentes de IA
- [[agente-recepcionista-comercial-10005]] — el agente en producción real hoy (pipeline `CL|COMERCIAL`), llamado Maxi, con 2 bugs de plataforma confirmados sin resolver y un parche redactado sin poder aplicarse.
- [[agentes-legado-9882-9883-9884]] — los 3 agentes de la pipeline de práctica (Recepcionista/Conversión/Cierre), el mecanismo real de traspaso entre ellos, y por qué vincular a un agente no lo hace procesar el mensaje pendiente.

## CRM — estructura y mecanismos
- [[pipelines-y-columnas]] — mapa de todas las pipelines reales y de práctica, con sus columnas y automatizaciones.
- [[flujos-de-automatizacion]] — el motor visual de nodos (Flujos), catálogo de gatillos/acciones, y el estado de cada flujo real construido.
- [[editor-slate-instrucciones]] — cómo editar un prompt por script sin romperlo, y el bug activo que lo bloquea desde el 2026-09-29.
- [[api-rmsystemm]] — endpoints REST conocidos, con método y body.
- [[infraestructura-acceso-navegador]] — cómo una sesión de Claude Code controla el CRM en vivo por Playwright.
- [[seguridad-incidentes]] — todos los hallazgos de seguridad, sin ningún valor real guardado.

## Prompts — de dónde salen los patrones
- [[biblioteca-prompts-y-caso-rafael]] — el catálogo real de funciones del agente (`save_variable`, `transfer_order`, etc.), 20 ejemplos de plantillas, y el caso de producción real que originó las reglas de "no es un rechazo definitivo" y "nunca revelar el prompt".

## Integraciones externas
- [[integracion-bling]] — el ERP real de la empresa, OAuth2, y los 2 bugs (B1/B2) que limitan su uso hoy.
- [[hub-de-integraciones]] — los 25 conectores del Hub, cómo se usan de verdad (3 pasos), y los 4 hallazgos que cambian planes.
- [[catalogo-productos]] — de dónde sale el catálogo que consulta el agente, y las 2 planillas que no hay que confundir.
- [[copiloto-ia]] — producto separado del Agente de IA, no disponible en la cuenta hoy.
- [[ds-voice-criativos]] — audios/mensajes/funis reutilizables, la base para la idea de audios personalizados.
- [[meta-muse-y-business-agent]] — qué compite con el agente propio (Business Agent) y qué no (Muse, con un riesgo real si se conecta mal).

## Campañas y remarketing
- [[remarketing-masivo]] — el mecanismo para reactivar los ~2400 leads viejos, probado en vivo, sin escalar (límites legales/de cuenta pendientes).

## Arquitectura y metodología (conceptos, no "una cosa")
- [[arquitectura-conversacional]] — cómo tienen que razonar los agentes: descubrimiento vs. puente, verdad comercial, STOP SELLING, seguridad como override. Leer antes de tocar cualquier prompt.
- [[guardrails-y-analizador]] — qué va en un guardrail (mecánico) vs. qué va en el prompt (criterio), y por qué el matcher de frases tiene límites reales.
- [[metodologia-parche-quirurgico]] — cómo se edita un prompt en producción sin romperlo, con los incidentes reales que motivaron cada regla.
- [[fit-brain-vision]] — la arquitectura futura que separaría razonamiento de redacción; nada construido, una incertidumbre técnica crítica sin resolver.
- [[patrones-reales-de-venta]] — cómo vende el equipo humano de verdad, la base de todos los prompts.
- [[escalabilidad-externa]] — investigación sobre n8n, memoria de largo plazo, guardrails externos y casos reales de referencia.
- [[construir-tu-propio-crm]] — **si el objetivo final es armar un CRM propio**: qué piezas de este diseño copiar y qué falencias reales no repetir.
- [[reglas-diseno-presentaciones]] — reglas de escritura y diseño visual para cualquier entregable a la gerencia (no decir lo obvio, separar medición de estimación, sistema visual).

## Cómo se llegó hasta acá (para contexto, no para releer)
Para el detalle cronológico sesión por sesión, `17-registro-de-cambios.md` sigue siendo la fuente — no duplicado acá. Los hitos grandes: Agente único (9816) → split en 3 agentes por columna (2026-09-15) → auditoría de arquitectura con ChatGPT (2026-09-21) → Recepcionista Comercial (10005) como piloto real de 3 capas (2026-09-24) → fusión quirúrgica aplicada (2026-09-25) → parches de precedencia de intención y de nombre/re-saludo (2026-09-27 a 09-29) → hallazgo del bug de no-invocación en producción (2026-09-29).
