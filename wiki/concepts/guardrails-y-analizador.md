# Guardrails y el Analizador de Acciones — dos capas de protección mecánica, distintas del prompt

**Qué es**: dos mecanismos de la plataforma que corren AFUERA del texto libre del modelo, para atrapar errores mecánicos/de forma que un prompt no puede garantizar por sí solo.
**Fuente primaria**: [[01-agente-de-ia]] (guardrails, catálogo completo), [[34-arquitectura-conversacional-aprendizajes-agentes]] §29.9 (Procesamiento de Acciones), [[41-propuesta-recepcionista-comercial-clasico-2026-09-24]] (criterio de qué va en guardrail vs. qué va en prompt).

## Guardrails
Verificaciones automáticas sobre la respuesta YA REDACTADA, antes de que llegue al cliente. 4 categorías de catálogo: Veracidade, Consistência, Estilo, Segurança — 9 plantillas en total, y el editor permite varias reglas del mismo tipo con nombre propio.

**Bug de persistencia (S2), confirmado por el backend y reconocido por soporte, resuelto el 2026-09-23** — reproducido 4 veces entre el 11 y el 14 de setiembre (el guardrail no se guardaba aunque el resto del formulario sí, prueba concluyente de que el problema era del servidor, no del usuario). Antes de esto, la única protección real contra precios inventados era la regla del propio prompt.

**Criterio de qué va en guardrail y qué va en prompt** (definido con el usuario): los guardrails son **restricciones deterministas posteriores a la generación** — cubren errores inequívocos de forma (una frase de bot, un saludo repetido, un placeholder sin reemplazar). Las decisiones comerciales (qué preguntar, si está cualificado) siguen siendo del prompt. Antes de sacar una regla del prompt hacia un guardrail, hay que verificar frase por frase que el guardrail REALMENTE la cubre — el matcher hace coincidencia por substring sin distinguir mayúsculas/acentos, así que:
- Una frase larga y específica (4+ palabras) es de bajo riesgo de falso positivo.
- Una frase corta y genérica ("quedó claro" sin "que") puede matchear un uso legítimo — no se agrega sin analizar corpus real.
- El matcher **no respeta límites de palabra**: "anoté" matchearía dentro de "manotear"; "che"/"bo"/"pikas" matchearían dentro de "noche"/"trabajo" — por eso esas nunca entraron como frases de guardrail, quedan como regla explícita del prompt.
- Una regla **semántica** (no narrar de dónde vino el anuncio) nunca va como guardrail léxico — bloquear por texto rompería respuestas legítimas ("veo que estás buscando una proteína" puede ser válido si surge del mensaje actual, no del anuncio).

El guardrail de lenguaje de bot en [[agente-recepcionista-comercial-10005]] pasó de 28 a 41 frases entre el 2026-09-24 y el 09-25, cada alta justificada por una falla real medida, nunca "por las dudas".

## Analizador de Acciones (solo existe en Modo Clásico)
Un subagente de IA separado que lee el prompt completo + `{{ACOES_EXECUTADAS}}` para decidir qué función ejecutar (`save_variable`, `transfer_order`, etc.), en vez de que el mismo modelo que redacta la respuesta decida y ejecute en la misma llamada (eso es lo que hace **Avanzado**, el modo recomendado y más rápido, vía tool calling nativo).

**Por qué [[agente-recepcionista-comercial-10005]] usa Clásico a propósito**: separa "hablar bien" de "decidir variables/acciones con precisión" — dos responsabilidades que en un solo prompt de Avanzado compiten por la misma llamada. El campo "Reglas personalizadas del analizador" solo existe en Clásico.

**El error más caro que corrigió una regla del analizador**: la regla general de `save_variable` ("solo si el cliente REALMENTE lo dijo") escrita DESPUÉS de definir dos variables con fuentes distintas (`interes_inicial` = cliente, `anuncio_origen` = sistema/anuncio) hacía que el analizador nunca guardara `anuncio_origen`, porque "el cliente no lo dijo" — exactamente el dato que esa variable existe para capturar. Corrección: la regla de fuente va ANTES de cualquier regla común, escrita explícitamente por variable, con una línea aclarando que no se traslada a la otra.

## Pendientes relacionados
Ver [[agente-recepcionista-comercial-10005]] para el estado actual exacto de guardrails y analizador de 10005. A25 (decisión de fondo: si conviene escribir el Analizador de Acciones también dentro de un prompt en modo Avanzado, sin bajar de modo, para no perder el tool calling nativo).
