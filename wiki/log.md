# log.md — registro de cambios en la capa wiki/

Formato: `## [fecha] tipo | qué`. Append-only, no editar entradas viejas. Distinto de `17-registro-de-cambios.md` (ese es el log narrativo de sesiones de TODO el proyecto; este es específico de qué cambió en `wiki/`).

## [2026-10-06] ingest | Centro de Ayuda de RM System
Página nueva `entities/centro-de-ayuda-rmsystemm.md` (qué es, para qué sirve, límites de lo leído), enlazada desde `index.md`. La síntesis completa vive en `43-centro-de-ayuda-rmsystemm-2026-10-06.md` y los pendientes en `PENDIENTES.md` Q34, Q35 y Q36; no se duplicó. Fuente narrativa: [[17-registro-de-cambios]] 2026-10-06.

## [2026-10-05] update | Meta Ads: módulo Marketing del CRM y señales de conversión
Se actualizó `entities/hub-de-integraciones.md` (hallazgo 3 sobre Meta Ads: conexión activa, módulo `Marketing` con ranking de campañas y "Criativo Campeão", pantalla `Conversiones` vacía). El detalle y lo que falta viven en `PENDIENTES.md` Q34, no se duplicó acá. Fuente narrativa: [[17-registro-de-cambios]] 2026-10-05.

## [2026-10-02] update | Presentación de casos reales de Maxi y hallazgo del filtro de frases
Se actualizaron 2 páginas, sin crear ninguna nueva: `entities/agente-recepcionista-comercial-10005.md` (bug nuevo Q31 — un lead quedó sin respuesta porque el guardrail de frases bloqueó los dos borradores; referencias a Q29, Q31 y Q33; rango de pendientes Q18-Q33) y `concepts/reglas-diseno-presentaciones.md` (sección del tablero de Miro/Obsidian del 2026-10-02, con la regla de privacidad que aplicó esta vez y las trampas de Miro; "Pendientes relacionados" ya no dice "Ninguno abierto" porque quedó Q32). Fuente narrativa: [[17-registro-de-cambios]] 2026-10-02.

## [2026-09-30] ingest | Cierre de los 2 huecos anotados en la entrada anterior
A pedido explícito del usuario ("dejá todo completo"), se agregaron las 2 páginas que la entrada de abajo había marcado como pendientes: `entities/biblioteca-prompts-y-caso-rafael.md` (fusiona [[11-biblioteca-prompts-ejemplo]] y [[12-caso-real-rafael-prompt-produccion]] — están tan entrelazados en la práctica, el catálogo de funciones y el caso real de producción, que separarlos en 2 páginas hubiera sido fragmentación sin beneficio) y `concepts/reglas-diseno-presentaciones.md` ([[27-reglas-diseno-presentaciones]]). Se linkearon ambas desde `index.md` y desde `patrones-reales-de-venta.md`. Con esto, **los 44 archivos numerados del vault tienen ahora al menos una página de `wiki/` que los cubre o los cita como fuente** (excepto los que son volcado literal/traducción de otro ya cubierto: `22` es `21` en portugués, `23b` es el crudo de `23`) — ya no queda ningún archivo fuente "huérfano" de la wiki.

## [2026-09-30] ingest | Creación completa de la capa wiki/

Primera construcción de esta capa, a pedido explícito del usuario ("armemos un vault con el método Karpathy/LLM Wiki"). Se leyeron completos los 44 archivos del vault (`00-...md` a `42-...md`, sin contar los que son literalmente el volcado crudo que otro archivo ya resume: `22` en portugués es el mismo contenido que `21`, y `23b` es el volcado literal que `23` ya analiza) más `PENDIENTES.md` completo y el índice cronológico de headers de `17-registro-de-cambios.md` (172KB, se leyó por headers en vez de completo por tamaño — si hace falta el detalle narrativo de una sesión puntual, ese archivo sigue siendo la fuente, no esta wiki).

Se crearon 23 páginas:
- `WIKI.md` (el esquema de esta capa).
- `index.md` (catálogo maestro).
- 15 páginas en `entities/`: los 2 agentes reales, pipelines, flujos de automatización, Bling, Hub de integraciones, API de rmsystemm, catálogo de productos, remarketing masivo, el editor Slate y sus bugs, seguridad, Copiloto de IA, DS Voice, Meta Muse/Business Agent, infraestructura de acceso por navegador.
- 7 páginas en `concepts/`: arquitectura conversacional, guardrails/analizador, metodología de parche quirúrgico, Fit Brain, patrones reales de venta, escalabilidad externa, y una página nueva pensada específicamente para el objetivo de largo plazo del usuario ("construir-tu-propio-crm").

**No se borró ni se modificó ningún archivo del vault existente.** `PENDIENTES.md` sigue siendo el único registro de pendientes — las páginas de wiki citan IDs (Q26, A10, etc.) en vez de duplicar el texto.

**Lo que no se leyó completo, a propósito**: los ~55 archivos de `artefactos/` (borradores iterativos de prompts, JSON de diffs, scripts de build) no se leyeron uno por uno — son exactamente el tipo de "fuente cruda" que el patrón LLM Wiki dice mantener sin tocar y solo referenciar por nombre cuando una página de wiki los cita como evidencia exacta de un cambio aplicado. Los archivos numerados `35` a `40` (iteraciones intermedias del prompt del Recepcionista, superadas por `41`/`42`) se cubrieron a través de lo que `41` y `42` documentan que cambió, no leyendo cada iteración byte a byte — si hace falta el detalle exacto de una iteración intermedia puntual, esos archivos siguen ahí sin tocar.

**Qué falta para que esto quede más completo todavía** (no bloqueante, la wiki ya es usable): páginas de `entities/` para el "Caso real Rafael" / biblioteca de prompts de ejemplo ([[11-biblioteca-prompts-ejemplo]], [[12-caso-real-rafael-prompt-produccion]] — hoy solo referenciados desde `patrones-reales-de-venta.md`, podrían merecer su propia página si se vuelve a consultar la API de funciones ahí documentada); y una página dedicada a las reglas de diseño de presentaciones ([[27-reglas-diseno-presentaciones]]) si en el futuro se arma otro deck para la gerencia.
