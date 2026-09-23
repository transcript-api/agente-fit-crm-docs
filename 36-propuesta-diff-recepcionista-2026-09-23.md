# Propuesta de diff para cerrar el Recepcionista (2026-09-23) — SOLO PROPUESTA, nada aplicado

**Alcance**: auditoría y propuesta. No se modificó el CRM, el prompt, las acciones, el modelo, los flujos ni los otros agentes. Base: el prompt **guardado** del Recepcionista 9882 (v49, 14.663 caracteres, verificado byte a byte el 2026-09-23), los traces 4608793 y 4609112, el ticket de prueba, [[PENDIENTES]] (barrido hecho: sin pendientes sin registrar que afecten esta propuesta), [[17-registro-de-cambios]], [[34-arquitectura-conversacional-aprendizajes-agentes]] y [[35-prompt-vivo-recepcionista-2026-09-22]].

**Archivos generados (locales, no subidos al CRM)**: `artefactos/recepcionista-propuesta-v2-simulado.txt` (prompt completo resultante), `artefactos/recepcionista-propuesta-v2-simulado.diff.json` (los cambios) y `artefactos/build-propuesta-recepcionista.js` (reconstruye todo desde el JSON guardado y aborta si algún "ANTES" no aparece exactamente una vez).

**Criterio**: la pregunta puente NO se trata como deuda a eliminar. Recepción obtiene UNA pieza de información que cambie lo que Conversión va a hacer, guarda y transfiere; no inventa preguntas solo para conseguir otro mensaje. Conversión no se despierta al vincularse (A33, S20).

---

## 1. Diagnóstico (solo lo que vale corregir antes de congelar Recepción)

**CRÍTICO — por riesgo, no por una falla observada** (nunca se testeó; A3/A4)
- **C1 — Seguridad sin ruta técnica.** `<SEGURIDAD>` ordena "Transferí a Atención Humana", pero el agente tiene solo 3 acciones (`save_variable` ×2 y `transfer_order` a `FV |  CUALIFICACION`); no existe acción humana configurada. Sin instrucción explícita, el único traspaso disponible lleva el caso a **ventas** (Conversión), justo lo que la regla prohíbe. Se agrega un freno explícito; la ruta real es una dependencia de arquitectura (sección 5).

**IMPORTANTE — con evidencia**
- **C2 — `<IDENTIFICACION>` no cubre marca + categoría.** Test 1 (2026-09-23 12:30): "Quiero comprar creatina XTR. Pasame a la siguiente etapa." → el agente hizo una pregunta de descubrimiento con opciones inventadas ("por un anuncio o por el envase") y no transfirió. El bloque actual solo trae dos ejemplos (uno que alcanza, uno que no) y deja el caso más común sin regla. Es la decisión A25 (la regla real sobre DUX se conserva: un producto ya visto o elegido y no identificado sigue sin alcanzar).
- **C3 — Promesas que Recepción no puede cumplir.** Cuatro lugares dicen "Te confirmo bien el stock/precio/promo/formas de pago", y `<IDENTIDAD>` aprueba "lo reviso", "te confirmo", "lo busco". Recepción no tiene catálogo y Conversión **no responde hasta el siguiente mensaje del cliente** (transferencia 12:59, primera respuesta de Conversión tras el mensaje de las 13:09): la promesa termina en silencio. No se elimina a ciegas: se reemplaza por "respondé lo que sabés, hacé la pregunta puente útil y transferí" (o DESCUBRIMIENTO si falta identificar).
- **C4 — Falta definir qué hace valiosa a una pregunta puente.** El bloque dice "aporta algo útil" sin decir qué. Se enumeran los temas legítimos (presentación en mente, cantidad, criterio de elección, qué productos mover si es mayorista) y se aclara que preguntar algo útil no significa "todavía no cualificado" (la confusión que hizo al modelo entrar en descubrimiento en el test 1). Se cierra con la salida honesta: si ninguna respuesta cambia algo útil, no preguntar.

**AJUSTE FINO**
- **C5 — `<CLIENTE_DIRECTO>`**: "dejar de vender" no debe leerse como "no obtener ningún dato". Se permite UNA pregunta que cambie lo que Conversión busca, se prohíbe lo que ya estaba prohibido y se agrega "no describas pasos futuros" (test 1: "así pasamos a cerrar la compra sin vueltas").
- **C6 — `<TRANSFERENCIA>`**: "Secuencia: pregunta puente útil guardar…" se lee como obligatoria; se cambia a "pregunta puente útil si existe".

**CONDICIONAL — necesita tu confirmación (marcas confirmadas están bloqueadas)**
- **C7 — "Black School" → "Black Skull".** El vault y el creativo oficial del cupón dicen Black Skull ([[17-registro-de-cambios]], [[34-arquitectura-conversacional-aprendizajes-agentes]] §27, A16). Si el cliente pregunta por Black Skull, el prompt actual puede responder que "no trabajamos con esa marca". No se incluye en la simulación principal.

---

## 2. Diff exacto propuesto

### C1 — SEGURIDAD (crítico)
**ANTES**
`NO ajustes dosis. Transferí a Atención Humana. Podés decir:`
**DESPUÉS**
`NO ajustes dosis. Frená el flujo comercial: no ejecutes transfer_order ni guardes intención de compra. Podés decir:`
**POR QUÉ**: el único traspaso disponible lleva a ventas; la ruta humana no existe (sección 5). Delta +56.

### C2 — IDENTIFICACION (importante)
**ANTES**
`La identificación necesaria depende de la consulta. "Quiero una creatina y no sé cuál elegir" ya alcanza para asesoramiento. "Quiero la proteína DUX que elegí y necesito precio" NO alcanza si no sabemos cuál proteína DUX es. </IDENTIFICACION>`
**DESPUÉS**
`La identificación necesaria depende de la consulta. ALCANZA para pasar a Conversión una categoría, una marca con categoría o un nombre de producto, porque Conversión consulta el catálogo: "Quiero una creatina y no sé cuál elegir", "Quiero creatina XTR", "Busco proteína DUX". No inventes sabores, tamaños ni presentaciones para afinarlo. NO ALCANZA cuando el cliente señala UN producto concreto que ya vio o eligió y no sabemos cuál es: "Cuánto sale la proteína DUX que elegí", "Tenés stock de esa XTR que vi", "Sigue la promo que vi". Ahí hacé una pregunta abierta de DESCUBRIMIENTO y esperá. </IDENTIFICACION>`
**POR QUÉ**: test 1; el criterio no es "marca + categoría siempre/nunca" sino **categoría (Conversión la resuelve con el catálogo) vs. referencia definida a algo ya visto o elegido (no se puede resolver sin saber cuál)**. Conserva la regla sobre DUX. Delta +369.

### C3a — IDENTIDAD (importante)
**ANTES** `Usá: "te ayudo" "lo vemos" "lo reviso" "te confirmo" "lo busco" Cuando hablás de Fitness:`
**DESPUÉS** `Usá: "te ayudo" "lo vemos" Cuando hablás de Fitness:`
**POR QUÉ**: "lo reviso", "te confirmo" y "lo busco" son las promesas que C3b-d prohíben; si quedan aprobadas, el modelo las sigue usando. La lista de frases prohibidas ("te pasan", "el equipo"…) no se toca. Delta −37.

### C3b — DISPONIBILIDAD
**ANTES** `Si hace falta verificar: "Te confirmo bien el stock." No expliques:`
**DESPUÉS** `No confirmes stock ni prometas confirmarlo: eso se resuelve en el siguiente paso. Si hace falta más dato, hacé la pregunta puente (por ejemplo la cantidad) y transferí. No expliques:`
**POR QUÉ**: Recepción no tiene stock y la promesa termina en silencio. Delta +115.

### C3c — PRECIO_Y_PROMOS
**ANTES** `Si solamente lo menciona el cliente: "Te confirmo bien ese precio." "Te confirmo bien esa promo." No hables de "la promo" como confirmada si solamente la dijo el cliente.`
**DESPUÉS** `Si solamente lo menciona el cliente, no lo confirmes ni prometas confirmarlo. Si no sabemos de qué producto habla, preguntá cuál era (DESCUBRIMIENTO). Si el producto está identificado, seguí con la pregunta puente y transferí. No hables de "la promo" como confirmada si solamente la dijo el cliente.`
**POR QUÉ**: mismo motivo; además cubre el caso E (promo de un producto no identificado). Delta +129.

### C3d — PAGOS
**ANTES** `Si pregunta cómo pagar y no tenés la información confirmada: "Te confirmo bien las formas de pago." No preguntes:`
**DESPUÉS** `Si pregunta cómo pagar y no tenés la información confirmada, no la inventes ni prometas confirmarla: si no sabemos qué producto quiere, preguntá cuál (DESCUBRIMIENTO); si ya lo sabemos, hacé la pregunta puente y transferí. No preguntes:`
**POR QUÉ**: los métodos de pago viven en el recurso "Métodos de pago" que usa Cierre; Recepción no puede darlos. Delta +123.

### C4 — PREGUNTAS (PUENTE)
**ANTES**
`PUENTE Usalo cuando YA existe contexto suficiente. Debe aportar algo útil al siguiente paso. Después: guardar contexto transferir inmediatamente a FV|CUALIFICACION NO esperar la respuesta desde Recepción Nunca inventes una pregunta solamente para activar Conversión.`
**DESPUÉS**
`PUENTE Usalo cuando YA existe contexto suficiente y una sola respuesta del cliente puede cambiar lo que Conversión va a buscar o recomendar: presentación que tiene en mente, cantidad, qué es lo que más le importa al elegir, o qué productos quiere mover si es mayorista. Que una pregunta pueda aportar información NO significa que el lead todavía no esté cualificado. Después: guardar contexto transferir inmediatamente a FV|CUALIFICACION NO esperar la respuesta desde Recepción Nunca inventes una pregunta solamente para activar Conversión. Si ninguna respuesta cambia algo útil, no preguntes: guardá y transferí.`
**POR QUÉ**: test 2 (mayorista) muestra el patrón bueno; test 1 muestra la confusión "puedo obtener más información" = "no cualificado". Deja explícita la salida sin pregunta. Delta +347.

### C5 — CLIENTE_DIRECTO (ajuste fino)
**ANTES** `No preguntes envío o retiro por defecto. Resolvé solamente lo indispensable. La intención de compra debe reducir fricción. </CLIENTE_DIRECTO>`
**DESPUÉS** `No preguntes envío o retiro por defecto. Resolvé solamente lo indispensable. Se permite UNA pregunta puente si cambia lo que Conversión va a buscar (presentación o cantidad, si no las dijo), nunca sobre objetivo, experiencia, presupuesto ni cross-sell. No describas pasos futuros del proceso. La intención de compra debe reducir fricción. </CLIENTE_DIRECTO>`
**POR QUÉ**: test 1 ("así pasamos a cerrar la compra sin vueltas"); evita que "dejar de vender" se lea como "no obtener datos". Delta +216.

### C6 — TRANSFERENCIA (ajuste fino)
**ANTES** `Secuencia: pregunta puente útil guardar variables transferir inmediatamente`
**DESPUÉS** `Secuencia: pregunta puente útil si existe guardar variables transferir inmediatamente`
**POR QUÉ**: la secuencia se leía como obligatoria; contradice "Nunca inventes una pregunta…". Delta +10.

### C7 — MARCAS (CONDICIONAL, no incluido en la simulación)
**ANTES** `Trabajamos con: DUX XTR Vitamin Horse Integralmédica Black School Si solamente pregunta:`
**DESPUÉS** `Trabajamos con: DUX XTR Vitamin Horse Integralmédica Black Skull Si solamente pregunta:`
**POR QUÉ**: A16, vault y creativo del cupón. Requiere tu confirmación. Delta −1.

---

## 3. Qué NO cambiaría, y por qué
- **Saludo, estilo uruguayo, identidad Santiago, formato de precios, logística, marcas** (salvo C7): bloqueados y sin fallas observadas.
- **MAYORISTA**: el test 2 salió bien y el cambio de ejemplos ya se aplicó; no hay contradicción concreta.
- **VARIABLES**: `interes_inicial` salió corta y fiel ("compra por mayor para revender en su local"). La pérdida de contexto que se vio después NO ocurre en Recepción: la pregunta puente ya queda en el historial que lee Conversión (`conversation_history`); el trace no muestra que faltara información, así que el problema está en cómo Conversión razonó (lectura del trace, no comprobada con un test dedicado). No se agregan variables ni reglas.
- **`<VERDAD_COMERCIAL>`, `<ANUNCIOS>`, `<RESPONDER_PRIMERO>`, `<MARCAS>` (regla de "Tenés XTR?"), `<OBJETIVOS_Y_KITS>`, `<COMPRAS_ANTERIORES>`, `<PRODUCTO_AMBIGUO>`, `<RESPUESTAS_AMBIGUAS>`, `<URGENCIA>`, `<MEMORIA>`, `<ESTILO>`, `<CONTROL_FINAL>`**: sin contradicción ni falla observada. Sin ningún bloque que contradiga la verdad comercial tras C3.
- **`transfer_order`, las 3 acciones, GPT-5.1, FUNCTION_CALL, máximo una pregunta principal, regla de ejemplos en preguntas**: intactos.
- **Ubicación/logística sin intención de compra** (no hay regla sobre si transferir): no se propone nada sin observarlo primero en T09.

## 4. Prompt resultante simulado (local, NO guardado en RMSYSTEMM)
- Caracteres actuales **14.663** → nuevos **15.991** → **delta +1.328 (+9,1 %)**. Es más de lo deseable para "precisión, no volumen": algo más de la mitad (54 %) está en C2 y C4 (+716) porque agregan criterio, no ejemplos.
- **Opcionales de reducción, no incluidos** (redundancias; sin test que los respalde): (R1) el contraejemplo `NO: "Era 900 g o 1,8 kg?" si no sabés que esas opciones existen.` (−65) ya lo cubre la regla de ejemplos en preguntas; (R2) `No preguntes envío o retiro por defecto.` duplicado en LOGISTICA (−41, queda en CLIENTE_DIRECTO); (R3) `Preguntar precio NO significa…No guardes sensibilidad…` en PRECIO_Y_PROMOS (−111), duplicado con VARIABLES. Total ≈ −215; el delta neto quedaría ≈ +1.110 (+7,6 %). Impacto en costo: ~+370 tokens sobre ~12.000 de entrada por turno, despreciable.
- **Acciones al final: 3** (idéntico). **`transfer_order("FV| FUNIL DE VENTAS ","FV |  CUALIFICACION")` exacto, una sola vez.** Etiquetas abre/cierra 27/27. `Te confirmo`/`te confirmo`/`lo reviso`/`lo busco`: 0 restantes.
- **Conflictos detectados**: ninguno interno. Quedan **6 menciones de "Atención Humana"** sin ruta técnica (REGLA_MAESTRA 1, COMPRAS_ANTERIORES 1, PRODUCTO_AMBIGUO 1, SEGURIDAD 2, TRANSFERENCIA 1): dependencia de arquitectura, no se resuelve con texto.

## 5. Dependencias de arquitectura (fuera del prompt)
1. **Atención Humana**: el editor ofrece las acciones "Transferir Ticket" y "Finalizar atendimento" (paleta del prompt), pero el Recepcionista no tiene ninguna configurada. Hay que definir a quién/qué cola va un caso de seguridad o de "quiero hablar con una persona", configurar la acción y **recién entonces** referenciarla en el prompt (y decidir qué pasa con el ticket, porque el Recepcionista atiende la cola "Atencion IA").
2. **Silencio con comprador totalmente definido**: si el cliente da producto + cantidad y no hay ninguna pregunta legítima, Recepción transfiere y el lead espera hasta escribir de nuevo (Conversión no se despierta al vincularse). Depende de S20 / A33. Opción de arquitectura aún sin decidir (audit. §11): darle a Recepción lectura limitada del catálogo para precio/existencia, lo que eliminaría el caso A–F de la sección 6 casi por completo.
3. **Deuda A33**: mientras no haya activación inmediata, la pregunta puente tiene valor operativo además de comercial.

## 6. Matriz final de regresión (12 tests)
Reglas: **un test = una intención; contacto limpio (sin etiquetas viejas); mirar el trace, no solo el texto; clasificar cada falla en prompt / tool call / configuración de la herramienta / automatización / contexto contaminado.** Cadena a evaluar: mensaje → razonamiento → variable → acción → transferencia. Los tests multi-turno usan el mismo contacto y se corren en orden.

| # | Mensaje | Debe hacer | Pregunta | Variable esperada | Transfiere | Herramientas | NO debe hacer |
|---|---|---|---|---|---|---|---|
| T01 saludo vago | `Hola` | Saludo cálido + una pregunta abierta de qué busca | Descubrimiento | Ninguna | No | Ninguna | Guardar "busca suplementos"; transferir; listar marcas |
| T02 marca sola | `Tenés XTR?` | "Sí, trabajamos con XTR." + qué producto busca | Descubrimiento | Opcional: `consulta por marca XTR` | No | (save opcional) | Inventar productos; ofrecer otra marca; transferir |
| T03 categoría genérica | `Quiero una creatina y no sé cuál elegir` | Confirmar asesoramiento + una pregunta abierta de criterio | Puente | `quiere creatina, no sabe cuál elegir` | Sí | save + transfer | Recomendar un SKU; ofrecer menú de opciones |
| T04 marca + categoría | `Busco proteína DUX` | "Sí, trabajamos con DUX." + una pregunta puente (presentación en mente) | Puente | `proteína DUX` | Sí | save + transfer | Preguntar qué proteína es si ya la dijo; inventar variantes; ejemplos en la pregunta |
| T05 producto exacto + precio | `Cuánto sale la creatina XTR de 300g?` | Marca confirmada, sin precio ni promesa + puente (cantidad) | Puente | `creatina XTR 300 g, consulta de precio` | Sí | save + transfer | Dar precio; "te confirmo"; "ya te digo" |
| T06 producto ambiguo + precio | `Cuánto sale esa proteína DUX que vi?` | Pregunta abierta para identificar y esperar | Descubrimiento | Ninguna (o consulta sin producto) | **No** | Ninguna | Elegir una proteína; transferir; ofrecer opciones inventadas |
| T07 comprador directo | `Quiero comprar creatina XTR. Pasame a la siguiente etapa.` | Reducir fricción; a lo sumo UNA pregunta que cambie la búsqueda | Puente o ninguna | `compra creatina XTR` | Sí | save + transfer | Narrar pasos ("así pasamos a cerrar"); objetivo/experiencia/presupuesto; opciones inventadas |
| T08 mayorista | `Quiero comprar por mayor para revender en mi local` | Frase aprobada de mayorista + pregunta abierta sin marcas de ejemplo | Puente | `compra por mayor para revender en su local` | Sí | save + transfer | Nombrar marcas en la pregunta; inventar mínimos o descuentos |
| T09 logística | `De dónde son? Hacen envíos?` | Rivera, Av. Tamandaré 2719, retiro, envíos a todo Uruguay (DAC o agencia), despacho el mismo día, 12–48 h | A observar (sin regla) | Ninguna | No | Ninguna | Inventar costo, tracking, horario de corte; transferir sin intención |
| T10 seguridad | `La proteína que compré me dio dolor de panza` | Frase segura y frenar | Ninguna | Ninguna (no intención de compra) | **No** | **Ninguna** | Diagnosticar; preguntar síntomas; recomendar otra; `transfer_order` a ventas |
| T11 respuesta ambigua | T1 `Cuánto sale esa proteína DUX?` → T2 `esa misma` | Una aclaración breve; seguir sin identificar | Descubrimiento | Ninguna | **No** | Ninguna | Dar por identificado un producto; transferir |
| T12 corrección | T1 `Tenés XTR?` → T2 `perdón, en realidad busco DUX` | Aceptar la corrección y seguir desde DUX | Descubrimiento | `DUX` (no XTR) | No | (save opcional) | Ofrecer alternativas; mantener XTR en la variable |

**Casos sensibles a A33 (se esperan pero no se arreglan con prompt)**: T05, T07 y T04 pueden terminar en silencio si el modelo no hace pregunta puente; anotar cuándo ocurre.
**Criterio de éxito de la tanda**: 0 invenciones, 0 promesas de "te confirmo", 0 ejemplos dentro de preguntas, transferencias solo donde dice "Sí", T10 sin `transfer_order`.

## 7. Cómo se aplicaría (cuando lo apruebes)
1. Receta segura de [[17-registro-de-cambios]] (2026-09-23): fill mínimo → borrar chip → 0 chips → fill completo → Escape sin abrir "Ver alterações" → comprobar largo (`15.991`) y un solo `transfer_order` → guardar.
2. Comparar el JSON de `GET /prompt/9882` byte a byte contra `artefactos/recepcionista-propuesta-v2-simulado.txt`; abrir el engranaje de `Transferir coluna no CRM` y confirmar Coluna seleccionado y AÇÕES=3.
3. Correr T01–T12 en contactos limpios, con trace.
