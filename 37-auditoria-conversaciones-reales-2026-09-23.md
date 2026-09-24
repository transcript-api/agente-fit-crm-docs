# 37 — Auditoría de conversaciones reales del CRM (2026-09-23, solo lectura)

> **Para qué sirve:** antes de cerrar la v3 del Recepcionista ([[36-propuesta-diff-recepcionista-2026-09-23]]), ver cómo escriben de verdad los clientes y cómo responde de verdad el equipo humano. **No se modificó nada** (ni el CRM ni el prompt). Este archivo es la evidencia; los cambios a la v3 que salen de acá están en §7 como *propuesta*, sin aplicar.
> **Anonimizado:** sin nombres, teléfonos, mails ni links. Los datos crudos están solo en `.playwright-mcp/` (ignorado por git).

## 0. Método y límites (leer antes de citar un número)

- **Solo lectura.** Se usaron únicamente `GET` (`/tickets`, `/messages/{id}`). No se respondió nada, no se movió ningún negocio, no se marcó ningún mensaje como leído (esa es otra llamada, no se hizo), no se tocó ningún agente ni variable.
- **Muestra:** de los 300 tickets más recientes se eligieron 82 buscando variedad: **70 leads nuevos** (creados desde 2026-09-13) y **12 recurrentes** (hilos largos de seguimiento/recompra). Para cada nuevo se analizó el **primer tramo** de la conversación (corte al haber ≥12 h de silencio); para cada recurrente, el último tramo.
- **Lo que se ve son respuestas humanas, no de IA.** 0 mensajes de IA en toda la muestra: el Recepcionista no está conectado a ningún canal (`usage.socialConnections = []`). Sirve para saber **qué pregunta el cliente y qué haría un buen humano**, no para medir al agente.
- **Conteos por palabra clave** (precio, envíos, pago, ubicación, frases del equipo): se hicieron con expresiones regulares sobre las 82 conversaciones; son aproximados (pueden contar de más una mención casual). Los conteos por *tipo de entrada* (§2) son manuales y exactos.
- **Ojo con los porcentajes:** n=70 leads nuevos (66 abren con el cliente). Son órdenes de magnitud, no estadística fina. Las clasificaciones de "intención" y "qué haría un buen recepcionista" son **juicio mío** sobre la evidencia; lo que dijo el equipo humano está citado tal cual.
- **Lo que NO se ve:** el contenido de las *stories* de Instagram (en la extracción compacta no aparece la imagen ni el producto; falta mirar la respuesta completa, ver D-3), ni el audio de los clientes (solo hay transcripción en 7 de 72 audios — ver §4-9).

## 1. Lo esencial en 12 líneas

1. **3 de cada 10 leads nuevos** (21/70) entran con el mensaje **pre-cargado del anuncio** ("Hola, quiero comprar la X"); es **1 de cada 2** entre los que vienen de anuncio (21/42). Ahí el producto ya está dicho.
2. **1 de cada 3 leads** (22/66) manda **dos o más mensajes** en la primera ráfaga, y **el mensaje real suele ser el segundo**: 6 de los 21 pre-cargados agregan texto propio en la primera ráfaga, y los 6 suman otra pregunta o pedido (local, vigencia de la promo, otro producto, ubicación, destino de envío, otra categoría).
3. **17 % abre con un saludo suelto** (11/66); en 9 de 11 la intención llega en el mensaje siguiente (mediana 13 s, rango 3–79 s).
4. **Pregunta de ubicación** como primera cosa: 9 % (6/70) y aparece en 20 de 82 conversaciones en algún momento. **Pagos:** 15/82. **Envíos:** 17/82. **Precio:** 24/82.
5. **La pregunta "¿ya compraste alguna vez con nosotros?" no aparece en ninguna de las 82 conversaciones.** El equipo pregunta por **consumo** ("¿ya venís consumiendo creatina o sería la primera vez?" / "¿ya consumís alguna suplementación?").
6. **El equipo casi no descubre:** preguntó objetivo en 3/82, consumo en 2/82. Empuja al cierre: promo/unidad (12), cantidad (13), sabor (10), forma de pago (18), datos de envío (14), "últimas unidades" (17). Cuando probó un menú de objetivos (T59) el cliente contestó "Bienn" y no avanzó.
7. **Errores humanos que el prompt quiere evitar aparecen en la vida real:** asumir producto ("¿estás interesado en nuestras proteínas?" a quien pidió creatina — T01, T33), asumir la oferta (T36: el cliente corrige "no quería esa, la de 300"), empujar la promo sin dar el precio que se pidió (T30).
8. **~1 de cada 6 entradas (11/70) no es un lead legible:** avisos automáticos de envío que el cliente contesta, comprobantes de pago, oferta de servicios de un tercero, audios/`[unsupported]` sin texto, hilos sin contexto.
9. **Audios:** 16/82 conversaciones tienen audios del cliente (13/70 de los leads nuevos). Cuando hay transcripción sale **en portugués** (el cliente habla español rioplatense: "Olá, como estão… eu vivo aqui em Tacuarembô") y solo 7/72 audios la traen.
10. **El equipo humano tarda:** mediana 13 min hasta la primera respuesta, p75 64 min, p90 ~8 h; 17/64 esperaron más de 1 h. **43 % de las primeras respuestas del equipo son audios** (28/65).
11. **Los precios/promos cambian según el anuncio** (Testo Dilated: $990 la unidad / 2 por $1650 + 60 cáps; Creatina: 2 por $850 / $1290 / $1350…). El cliente se confunde (T64: "me pareció que decías un frasco 950"). El agente no debe citar números de memoria.
12. **Delay de respuesta actual = 25 s** (documentado en el [[34-arquitectura-conversacional-aprendizajes-agentes]]): de 33 pausas entre mensajes de una misma ráfaga, **14 duran más de 25 s** (mediana 14 s, p75 45 s, p90 115 s). Cubre ~la mitad.

## 2. Tipos de entrada — leads nuevos (n=70), partición exacta

| Tipo de entrada | n | % | Con anuncio | Conversaciones (ref) |
|---|---:|---:|---:|---|
| **A. Pre-cargado del anuncio** ("Hola, quiero comprar X") | 21 | 30 % | 21 | T01 T10 T11 T18 T21 T22 T23 T24 T31 T33 T39 T43 T45 T50 T55 T63 T64 T66 T67 T69 T70 |
| **E. Respuesta a story de Instagram** ("Precio", "Info??") | 7 | 10 % | 0 | T15 T16 T20 T28 T29 T37 T57 |
| **F. Producto/categoría** sin comprar-explícito ("Estoy precisando creatina", "¿Es monohidratada?") | 6 | 9 % | 4 | T04 T13 T27 T30 T53 T54 |
| **D. Ubicación primero** ("¿dónde queda el local?", "de donde sos") | 6 | 9 % | 5 | T02 T07 T12 T40 T42 T44 |
| **C. Precio / pago primero** | 5 | 7 % | 2 | T03 T14 T56 T59 T65 |
| **I. Promo / oferta** ("Vi una promo 2x1…", "¿hacen envíos de las creatinas en promoción?") | 4 | 6 % | 1 | T06 T34 T36 T61 |
| **G. Media / `[unsupported]` / sin texto** | 4 | 6 % | 2 | T08 T19 T41 T60 |
| **Z. Abre el equipo** (aviso automático de envío / hilo ya en curso) | 4 | 6 % | 1 | T47 T48 T51 T68 |
| **W. Mayorista / reventa** | 3 | 4 % | 1 | T26 T32 T52 |
| **H. "Info" genérico** ("Me pasan más información") | 2 | 3 % | 1 | T09 T49 |
| **Y. Continuación sin contexto** ("Nos hablamos entonces", "Todo eso jeje") | 2 | 3 % | 1 | T17 T58 |
| Saludo suelto sin más (T35) · saludo+consulta (T38) · pregunta técnica (T05) | 3 | 4 % | 3 | T35 T38 T05 |
| **X. Pide asesor explícitamente** | 1 | 1 % | 0 | T25 |
| **No-lead:** comprobante de pago (T62) · oferta de servicios de un tercero (T46) | 2 | 3 % | 0 | T62 T46 |
| **Total** | **70** | | 42 | |

*Transversal:* 11/66 abren con un **saludo suelto** (T04 T13 T14 T28 T34 T35 T52 T54 T56 T59 T61) — se solapa con las categorías de arriba porque la intención llega después.

## 3. Tabla por conversación (casos representativos; grupos = varias conversaciones con el mismo comportamiento)

Códigos — **Estado:** NC = no cualificado, A = asesoramiento, D = directo. **Tipo:** Desc = pregunta de descubrimiento; Puente = pregunta puente; — = ninguna. **Transf.:** ¿se transfiere después de la puente? "Tras 1 turno" = solo cuando el cliente exprese qué quiere (decisión abierta D-1 en §8).
Las celdas "Pregunta natural" y "Responder primero" son la **propuesta** (juicio mío); lo que hizo el humano está en §5.

| # | Ref · mensaje inicial (literal) | Contexto | Intención aparente (sin inventar) | Estado | Responder primero | Pregunta natural de un buen humano | Tipo | `interes_inicial` | `anuncio_origen` | Transf. |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | **T21/T22** · "Hola, quiero comprar la Creatina XTR" (+ "¿Sigue la promoción?") | Anuncio "Creatina XTR en promo" | Comprar esa creatina; en T22 pregunta si la promo sigue | D | Saludo; lo que el anuncio dice de la promo, sin inventar vigencia ni stock | "¿Te llevás una o aprovechás la promo de 2?" (solo si el anuncio muestra esa promo) | Puente (opción real) | Creatina XTR | Creatina XTR en promo (2 unidades) | Sí, inmediato |
| 2 | **T55** · "Hola, quiero comprar el Hipercalórico Vitamin Horse de 3KG" | Anuncio hipercalórico | Comprar ese producto | D | Saludo + confirmar producto | "¿Te gustaría la unidad o la promo?" | Puente (opción real) | Hipercalórico Vitamin Horse 3 kg | Hipercalórico Vitamin Horse (anuncio) | Sí |
| 3 | **T70** · "Hola, quiero comprar el Testo Dilated" | Anuncio "Testo Dilated 120 cáps, $990" (sin promo de 2) | Comprar ese producto | D | Saludo + confirmar | "¿Cuántas unidades querés?" (no hay promo real que ofrecer) | Puente (cantidad) | Testo Dilated | Testo Dilated 120 cáps $990 (anuncio) | Sí |
| 4 | **T67** · "Hola, quiero comprar el Kit Kimera Woman" | Anuncio kit para mujeres | Comprar el kit | D (kit cerrado) | Saludo + confirmar kit | "¿Querés llevar el kit así o contarme un poco tu objetivo y te paso opciones?" (dos caminos = la misma decisión) | Puente | Kit Kimera Woman | Kit Kimera Woman (anuncio) | Sí |
| 5 | **T50** · "Hola, quiero comprar el Testo Dilated" + "Me mandas a Tacuarembó" | Anuncio Testo | Comprar + ya dio el destino | D, listo para cerrar | Sí, enviamos a todo el país por DAC | "¿Cuántas querés?" | Puente (cantidad) | Testo Dilated | Testo Dilated (anuncio) | Sí, inmediato |
| 6 | **T45** · "Hola, quiero comprar el Whey Isolate XTR" + "Son de montevidoe" | Anuncio Whey Isolate XTR | Comprar + le importa si son de Montevideo | D + logística | Somos de Rivera, enviamos a todo el país por DAC | "¿Cuántos querés?" (ya dijo que es de Montevideo en el turno siguiente) | Puente | Whey Isolate XTR | Whey Isolate XTR (anuncio) | Sí |
| 7 | **T69** · "Hola, quiero comprar la Creatina de Integral Médica" + "estoy interesado en comprar alguna creatina y proteínas, cuál me recomiendan calidad-precio" | Anuncio reposición Integral Médica | **Lo que manda es el 2º mensaje:** creatina + proteínas y quiere recomendación | A | Reconocer las dos categorías; no recomendar aún | "¿Ya venís consumiendo alguna o sería la primera vez?" | Puente/Desc | "creatina y proteínas (pide recomendación calidad-precio)" — no solo "creatina Integral Médica" | Creatina Integral Médica (reposición) | Sí (asesoramiento declarado) |
| 8 | **T36** · "Hola quería saber más de la oferta de queratina" | Anuncio creatina Vitamin Horse (con 2 ofertas) | Consulta por "la oferta" de creatina (escribió *queratina*, el anuncio es de creatina). **No sabemos cuál oferta** | NC | Saludo; **no asumir** cuál | "¿Cuál de las ofertas viste?" | Desc | "oferta de creatina (escribió 'queratina')" | Creatina Vitamin Horse (2 ofertas) | Tras 1 turno |
| 9 | **T09** · "Me pasan mas información" | Origen anuncio, anuncio no visible | Pide info; sin producto | NC | Saludo | "¿Qué promo te llamó la atención?" | Desc | *(vacío)* | Anuncio de Meta, no visible | No hasta que diga qué busca (respondió: whey + creatina, morango/frutilla) |
| 10 | **T49** · "Hola, me podrían enviar información? Gracias" | Orgánico | Pide info; sin producto | NC | Saludo | "¿Sobre qué producto?" | Desc | *(vacío)* | *(vacío)* | No |
| 11 | **T56** · "Hola" · "Precio del whey" · "De integral medica" · "Son de Montevideo?" | Orgánico, 4 mensajes | Whey Integral Médica + precio + ubicación | D (categoría + marca) | Trabajamos con Integral Médica; somos de Rivera, enviamos por DAC | "¿La de 900 g o la de 1,8 kg?" (presentaciones reales del catálogo) — o cantidad | Puente | Whey Integral Médica | *(vacío)* | Sí |
| 12 | **T40** (+ T02 T12 T42 T44 T07) · "Dónde están ubicados?" | Anuncio Creatina XTR promo | Solo ubica; sin producto dicho | NC (con anuncio) | Rivera; enviamos a todo el país por DAC | "¿De dónde sos?" (ciudad/departamento) | Puente operativo | *(vacío)* — el anuncio no es interés expresado | Creatina XTR promo | Tras 1 turno (T44 dijo "sí, estoy interesado" al siguiente mensaje) |
| 13 | **T15/T16/T20/T37** · "Precio" · "Cuanto está esta y la anterior bro!" · "Info??" | **Story IG**, producto **no visible** para el agente | Precio/info de un producto que **no vemos** | NC | Saludo; **no inventar precio ni producto** | "¿De cuál de las historias?" | Desc | *(vacío)* | "Respuesta a story de IG (producto no visible)" | No hasta identificar |
| 14 | **T03** · "estaba buscando proteina isolate pro fit… aprox 900… qué precio tiene?" | Orgánico | Isolate, tipo Pro Fit (marca que ya no trabajamos), ~900 | D con marca no disponible | Decir con claridad que esa marca no está + ofrecer isoladas | "¿La querés de 900 g?" (opcional, ya lo dijo) | Puente/— | "proteína isolate (busca tipo Pro Fit, ~900)" | *(vacío)* | Sí |
| 15 | **T14** · "Hola buenas tardes" · "precio de las creatina" · "¿aceptan tarjetas o solo efectivo?" · "Decime cuál es la promo q tenés" | Orgánico, 4 mensajes | Precio + pago + promo de creatina | D (categoría) | Responder lo de pago (dato aprobado) y qué creatinas hay | UNA pregunta: qué presentación mira | Puente | Creatina (consulta precio/promo) | *(vacío)* | Sí |
| 16 | **T65** · "aceptan tarjeta de crédito OCA y hasta cuántos pagos?" | Anuncio Testo Dilated | Pregunta por pagos; el producto lo da el anuncio | D-débil | Pagos: según la lista aprobada (hoy sin fuente: ver Q1 en PENDIENTES) | "¿Qué producto/cuántos querés llevar?" | Puente | *(vacío hasta que confirme)* | Testo Dilated (anuncio) | Tras 1 turno |
| 17 | **T13** · "Buen día" · "Quisiera saber sobre el hipercalórico xtr de 3 k" | Anuncio reposición | Consulta por ese producto | D | "Sí, lo tenemos" (disponibilidad general) | Cantidad / promo real | Puente | Hipercalórico XTR 3 kg | Reposición (anuncio) | Sí |
| 18 | **T53** · "Hola! Es Creatina monohidratada?" | Anuncio Creatina XTR | Pregunta un dato técnico | D | **Contestar exactamente eso** (sí, monohidratada y 100 % pura, si el anuncio lo dice) | "¿La querés de 1 o aprovechás la promo de 2?" | Puente | Creatina XTR | Creatina XTR (anuncio) | Sí |
| 19 | **T38** · "Hola consulta te da masa muscular" | Anuncio creatina Vitamin Horse | Duda si el producto sirve para masa | A | Respuesta neutra y breve (sin promesas de resultado) | "¿Ya tomás creatina o sería la primera vez?" | Desc | "creatina (consulta si aporta masa muscular)" | Creatina Vitamin Horse | Sí (asesoramiento) |
| 20 | **T27** · "Que combos tendría de proteína y creatina monohidratada!" | Orgánico | Combo proteína + creatina | A/D | "Sí, armamos combos de proteína + creatina" | "¿Qué proteína tenías en mente?" abierta (sin listar marcas) | Desc | "combo de proteína + creatina monohidratada" | *(vacío)* | Sí |
| 21 | **T30** · "Hola pues pasarme de Beef Protein" | Anuncio Beef Protein | Quiere info/precio de Beef Protein | D | **Dar el precio/promo que muestra el anuncio primero** | "¿Cuántas?" | Puente | Beef Protein | Beef Protein (anuncio) | Sí |
| 22 | **T63** · "¡Hola! Quiero comprar un mix completo de Integral Médica Precio Creatina" (**T01** = mismo pre-cargado + lista de 5 productos) | Anuncio "TODO INTEGRALMÉDICA" (genérico) | T63: creatina + precio. T01: pregunta por varias marcas/productos | T63 D (categoría); T01 A | No asumir proteína (T01) | T63: "¿La de 300, 500 o kilo?" (presentaciones reales). T01: "¿Cuáles de esos querés?" | Puente / Desc | T63 "creatina Integral Médica (pide precio)"; T01 lo que listó | Mix Integral Médica (anuncio genérico) | Sí |
| 23 | **T59** · "Quisiera saber precios de whey protein" | Anuncio Integral Médica | Precio de whey | D (categoría) | Trabajamos con whey; qué presentaciones | Una pregunta operativa; **no** menú de objetivos | Puente | Whey protein (consulta precios) | Integral Médica (anuncio) | Sí |
| 24 | **T52** (+ T26 T32) · "necesito varias y quería saber si me hacen precio al por mayor" | Anuncio creatina Vitamin Horse | Comprar creatina en cantidad; pregunta por precio mayorista | D + mayorista posible | No prometer precio; entender cuánto | "¿Cuántas unidades?" | Puente | Creatina (varias, consulta por mayor) | Creatina Vitamin Horse | Sí (a Conversión/humano según cantidad) |
| 25 | **T25** · "Acabo de entrar a la tienda y me gustaría recibir atención de un asesor" | Orgánico (tienda web) | Quiere hablar con alguien | NC | Saludo: "Soy el asistente de Fitness Suplementos, decime qué buscás" | "¿Qué producto te interesa?" | Desc | *(vacío)* | *(vacío)* | No |
| 26 | **T47/T48/T51** (+T79) · "Hola…, ¡muchas gracias por la confianza! Tu paquete ya fue enviado" → cliente: "¿por qué agencia es?" | Aviso automático de posventa | **No es un lead**: consulta posventa | — | Responder solo lo que el sistema sabe; sino a humano | — | — | *(no guardar)* | *(no guardar)* | **No** (no es venta) |
| 27 | **T62** · "Comprobante… 2 Hipercalórico 1 Magnesio 1 termogénico + dirección" | Cliente que ya compró/paga | **No es un lead nuevo**: confirma un pedido | — | Frenar: humano | — | — | *(no guardar)* | *(no guardar)* | No — a humano |
| 28 | **T46** · "Soy… Me dedico a atender las ventas por Instagram y WhatsApp de tiendas online…" | Orgánico | **Solicitud comercial de un tercero** | — | No entrar en el flujo de venta | — | — | *(no guardar)* | *(no guardar)* | No |
| 29 | **T08/T19/T41/T60** · `[unsupported]`, `[order]`, "Áudio", "Imagem", "Mídia" | Media sin texto o tipo no soportado | Sin señal | NC | Saludo; pedir que lo escriba | "¿Me contás qué necesitás?" | Desc | *(vacío)* | *(según origen)* | No |

## 4. Patrones agregados (las ocho preguntas de ChatGPT + lo no previsto)

**4-1. Tipos de entrada frecuentes.** Ver §2. Ordenados: pre-cargado del anuncio 30 % · story 10 % · producto/categoría 9 % · ubicación 9 % · precio/pago 7 % · promo 6 % · media/no soportado 6 % · abre el equipo 6 % · mayorista 4 % · info genérica 3 % · el resto ≤3 % c/u. Los que no son un lead legible (avisos, comprobante, solicitud de tercero, media sin texto, sin contexto): **11/70 = 16 %**.

**4-2. Qué informa el cliente solo / qué falta** (n=66, primera ráfaga): producto o categoría 55 % · marca 27 % · precio 21 % · ubicación/envío 20 % · promo 9 % · pago 9 % · presentación/tamaño 8 % · mayorista 5 % · **objetivo explícito 2 %** · **cantidad: nunca** · **ninguna señal: 13 (20 %)**. Lo que casi siempre falta al inicio: **cantidad**, ciudad, sabor y objetivo. El objetivo aparece más tarde y solo cuando el equipo le da lugar (T43 "necesito algo para subir de peso", T69 "bajar de peso, masa muscular y energía", T80 "voy al gimnasio").

**4-3. Preguntas humanas reutilizables sin sonar plantilla** — funcionan porque **cambian con el caso**, no porque sean un texto fijo:
- Anuncio vago → "¿qué promo te llamó la atención?" (T09)
- Categoría sin marca/tamaño → "¿de cuántos gramos estabas buscando?" (T54)
- Ubicación → responder + "contame de dónde sos" (T40)
- Producto del anuncio con promo → "¿la unidad o la promo?" (T55) / "¿llevás las 2?" (T22)
- Kit → "¿llevar el kit o contarme tu objetivo?" (T67)
- Después de mandar opciones → "¿buscabas alguna en especial?" (T08)
- Consumo → "¿ya venís consumiendo creatina o sería la primera vez?" (T29)
- Envío → "¿a domicilio o a una sucursal de DAC cerca tuyo?" (T05)
- Sabor → "¿de qué sabor te mando?" (T68)

Lo que **sí suena a plantilla** (idéntico entre conversaciones): "Por acá te habla X, asesora de fitness" (25/82) · "me quedan unidades limitadas / últimas unidades" (17/82) · "¿te gustaría aprovechar/adquirir la promo?" (12/82) · "comentame si preferís avanzar sobre lo que viste en la publicidad **o agregarle otro suplemento**" (T23/T24/T66: idéntico literal).

**4-4. Cuándo el anuncio ayuda y cuándo ignorarlo.**
- **Ayuda:** identifica el producto cuando el mensaje está pre-cargado ("quiero comprar la X" = X); da el contexto de una consulta vaga ("Me pasan más información" ← ¿de qué campaña?); aporta la promo real para ofrecer una opción concreta (T55).
- **Se ignora / pasa a segundo plano:** cuando el mensaje propio dice otra cosa — T69 (creatina **y proteínas**, recomendación), T31 (pregunta por Mutant Mass estando en el anuncio del kit), T36 (la oferta de 300 g, no la que asumió el equipo), T05 (duda del kilo), T63/T01 (pre-cargado *genérico* "mix completo" + pedido específico), T43 (después pide "algo para subir de peso"), T10/T22/T45/T50 (pre-cargado + pregunta de local/promo/ubicación/destino). **Cuando el anuncio muestra más de una oferta → no asumir cuál.** En stories/orgánicos el agente no ve anuncio.

**4-5. Cuándo preguntar el objetivo es innecesario.** Pre-cargado con producto (30 %), producto+marca, precio de un producto nombrado, ubicación, pago, mayorista, kit cerrado, "es monohidratada". Objetivo solo tiene sentido si el cliente **pide asesoramiento** ("cuál me recomiendan", "algo para subir de peso", "combos"). Evidencia contraria: T59 (menú de objetivos → "Bienn", sin avance).

**4-6. Cuándo la pregunta correcta es operativa (cantidad).** Producto identificado + promo real en el anuncio (T55, T22); precio pedido de un producto nombrado; mayorista ("¿cuántas?"). El equipo preguntó cantidad/opción en 13/82, sabor en 10/82, forma de pago en 18/82, datos de envío en 14/82.

**4-7. "¿Ya compraste alguna vez con nosotros?"**: **0/82**. Los recurrentes (12/82) ya son clientes conocidos y tienen hilos de seguimiento/recompra. Para el cliente nuevo la versión natural es de **consumo** ("ya venís consumiendo… o sería la primera vez"), 2/82 + T80. Como Conversión ya distingue recurrentes por la variable de contacto `ultimo_producto_comprado`, preguntarlo en Recepción **duplica algo que el sistema sabe** y suena a formulario.

**4-8. Expresiones reales** (literal, incluidos errores): "Me pasan más información" · "Quisiera saber precios de whey protein" · "Estoy precisando creatina" · "Vi una promo de 2x1 en creatina… La quiero" · "Hola pues pasarme de Beef Protein" · "Que combos tendría de proteína y creatina monohidratada" · "Sigue la promoción?" · "Es Creatina monohidratada?" · "La de 1k es.MONOHIDRATADA??" · "hacen envíos por mayor?" · "necesito varias y queria saber si me hacen precio al por mayor" · "te da masa muscular" · "Necesito algo para subir de peso" · "Dónde venden esto, me interesó lo de las gomitas, voy al gimnasio, x eso pregunto" · "Cuanto esta esta y la anterior bro!" · "Precio" · "Info??" · "donde eatan" · "De donde sos" · "Son de montevidoe" · "aceptan tarjeta de crédito OCA y hasta cuantos pagos?" · "Se puede pagar con débito" · "Acabo de entrar a la tienda y me gustaría recibir atención de un asesor". Errores tipográficos que el agente tiene que tolerar: *queratina* (creatina), *montevidoe*, *eatan*, *Tacurembo*. Influencia del portugués/brasilero: "Áudio", "Mídia", "morango".

**4-9. Patrones no previstos.**
- **Ráfagas y timing.** 22/66 leads mandan ≥2 mensajes en la primera ráfaga; 11/66 abren con saludo suelto y en 9/11 la intención llega enseguida (mediana 13 s). Pausas dentro de una ráfaga: mediana 14 s, p75 45 s, p90 115 s; 14 de 33 pasan de los 25 s del delay actual → habrá casos en que el agente conteste el "Hola" y luego reciba el pedido real.
- **Latencia humana** (mediana 13 min, p75 64 min, p90 ~8 h; 17/64 > 1 h): un agente que contesta en ~30 s es un cambio grande en la experiencia; también significa que **un delay de 45–60 s sale barato** frente a lo que hoy espera el cliente.
- **Audios.** 16/82 conversaciones (13/70 nuevas) tienen audios del cliente; 72 audios en el tramo analizado, **solo 7 con transcripción**, y esa transcripción sale **en portugués** aunque el cliente hable español. El equipo humano responde con audio en el 43 % de las primeras respuestas (28/65).
- **No-leads (16 %)**: respuestas a avisos automáticos de envío ("¿por qué agencia es?"), comprobantes de pago, oferta de servicios de terceros, mensajes sin contexto. Si el Recepcionista atiende todo lo entrante, **esto le llega**.
- **Duplicados entre canales** (T25: "ya hablé por Instagram, muchas gracias").
- **Precios que cambian por anuncio** (ver §1-11) → riesgo de contradicción con la promo que vio el cliente.
- **Pedido de teléfono al cliente** (T27: "dejame tu celular escrito así lo ingreso al sistema") — es un artefacto interno del equipo; el agente no debe pedirlo (el CRM ya lo tiene).
- **Recurrentes (12/82):** hilos de seguimiento/recompra iniciados por el equipo ("¿cómo van esos resultados con los suplementos, cómo venís de stock?"). No son para el Recepcionista.

## 5. Respuestas humanas particularmente buenas (qué hicieron bien — **no copiar literal**)

| Ref | Qué dijo (parafraseado/literal corto) | Qué hizo bien |
|---|---|---|
| **T40** | "Somos de Rivera, pero hacemos envíos a todo el Uruguay por DAC. Contame de dónde sos" | **Respondió primero** exacto lo que preguntó + **una** pregunta operativa que cambia lo que sigue. |
| **T53** | "Sii es monohidratada y 100 % pura" → promo → "¿te gustaría adquirir la promo?" | Contestó la duda técnica **antes** de vender; no diagnosticó. |
| **T09** | "¿Decime qué promo te llamó la atención?" | Usa el contexto del anuncio **sin asumir** cuál; pregunta abierta. |
| **T54** | "Estoy precisando creatina" → "¿de cuántos gramos estabas buscando?" | **Una** pregunta específica del producto, sin menú ni objetivo. |
| **T63** | "Tenés varias propuestas de creatina, depende la que busques: 300 g, 500 g y kilo. ¿Cuál sería tu interés?" | Opciones **reales del catálogo**, no inventadas; no enumeró marcas. |
| **T67** | "¿Te gustaría llevar el kit o comentarme un poco sobre tus objetivos así te paso opciones que de verdad te ayuden?" | Dos caminos que son **la misma decisión**, y **explica para qué** pregunta. |
| **T55** | "¿Te gustaría adquirir la unidad o la promo?" | Pregunta con **opciones reales** del anuncio; concreta. |
| **T03** | "Con Profit no estamos trabajando más de momento, pero te paso opciones de proteína isolada…" | Honesto sobre lo que no hay + alternativa inmediata (ojo con "igual o mejor": es una promesa comparativa que el agente no debería hacer). |
| **T13** | "Sii tenemos la promo de 2 por $2190, en sabores frutilla, chocolate o vainilla" | Confirmó disponibilidad general y dio datos reales. |
| **T29** | "¿Ya venís consumiendo creatina o sería la primera vez?" | Pregunta **relacional natural** (consumo), no de compra. |
| **T05** | "¿A dónde te queda mejor que enviemos, a domicilio o a una sucursal de DAC que tengas cerca?" | Pregunta operativa **concreta** de logística. |
| **T65** | "Perfecto, me agendo y te hablo el sábado, ¿te parece?" | Ante "todavía no puedo pagar", **no presionó**; dejó agendado. |
| **T08** | Mandó opciones y cerró con "¿buscabas alguna en especial?" | Mostró antes de preguntar; pregunta abierta. |

**Respuestas humanas débiles (lo que el prompt debe evitar):** T30 (empujó la promo y **no dio el precio** pedido; el cliente tuvo que repetirlo) · T36 (asumió "las dos unidades por $1350"; el cliente: "no quería esa") · T01/T33 ("¿estás interesado en nuestras proteínas?" a quien pidió creatina / un mix) · T59 (menú de objetivos → sin respuesta útil) · T23/T24/T66 (misma frase de cross-sell en el primer mensaje, antes de saber qué quiere).

## 6. Casos de regresión nuevos, sacados de conversaciones reales (para sumar a la matriz de la v3)

| Id | Entrada | Debe hacer | No debe hacer |
|---|---|---|---|
| R1 | Pre-cargado "Hola, quiero comprar la Creatina XTR" (anuncio con promo de 2) | Saludo + puente: unidad o promo (opción real) → guardar → transferir | Preguntar objetivo; listar marcas; prometer stock |
| R2 | Pre-cargado + "hola tienen local físico?" (T10) | Contestar ubicación primero (Rivera / DAC) y **después** una sola pregunta | Ignorar la ubicación; dos preguntas |
| R3 | Pre-cargado "Creatina Integral Médica" + "creatina y proteínas, cuál me recomiendan" (T69) | El 2º mensaje manda: guardar creatina **y** proteínas / pide recomendación | Guardar solo "creatina Integral Médica" |
| R4 | "Hola quería saber más de la oferta de queratina" con anuncio de 2 ofertas (T36) | Preguntar cuál oferta; tolerar el typo | Asumir "las dos por $1350"; corregir al cliente |
| R5 | "Me pasan más información" (T09) | Pregunta abierta tipo "¿qué promo te llamó la atención?" | Asumir producto; menú de objetivos |
| R6 | Story: "Precio" (T16) sin producto visible | Saludo + "¿de cuál de las historias?" | Inventar producto o precio; guardar interés |
| R7 | "Hola" solo, y a los 10 s "Precio del whey" | No transferir tras el saludo; retomar con lo que llegó | Puente + transferir sobre un "Hola" |
| R8 | "¿Dónde queda el local?" con anuncio (T40) | Rivera + DAC + "¿de dónde sos?" | Transferir sin interés; describir pasos |
| R9 | "Precio del whey / de Integral Médica / ¿son de Montevideo?" (T56) | Trabajamos con Integral Médica; Rivera/DAC; una pregunta de presentación/cantidad | Listar marcas; promesa de precio |
| R10 | "Es Creatina monohidratada?" (T53) | Responder eso primero | Empezar por la promo |
| R11 | "aceptan tarjeta OCA y hasta cuántos pagos" (T65) | Lo aprobado en PAGOS; si no hay dato, **no inventar** ni prometer | Inventar cuotas |
| R12 | Aviso de envío contestado "¿por qué agencia es?" (T48) | No tratarlo como lead; no guardar interés; no transferir a Conversión | Ofrecer productos |
| R13 | Comprobante + pedido + dirección (T62) | Frenar (humano) | Vender / transferir a Conversión |
| R14 | Oferta de servicios de un tercero (T46) | No entrar al flujo de venta | Guardar interés / transferir |
| R15 | "Áudio"/`[unsupported]`/imagen sola (T41 T08) | Pedir que lo escriba, una línea | Adivinar el contenido |
| R16 | "necesito varias… precio al por mayor" (T52) | Mayorista: una pregunta útil (cantidad); no prometer precio | Precio mayorista inventado |
| R17 | "Sigue la promoción?" (T22) | Solo lo que dice el anuncio; no prometer vigencia | "Sí, te lo confirmo" |

## 7. Qué implica para la v3 (**propuesta, NO aplicada**)

**Confirma lo ya propuesto:** V4 (el anuncio es contexto; manda el mensaje actual: T69/T36/T31/T63) · V6 (preguntas abiertas, sin opciones que el cliente no dijo: T59 vs T54/T63) · V7 primera parte (cantidad/opción real para el producto identificado: T55/T22) · V9 (no enumerar marcas) · V12/V13 (mayorista) · V14 (`interes_inicial` = solo lo que el cliente expresó: T69/T36/T12) · V15 (sin menús de objetivos).

**Lo que la auditoría corrige o agrega:**
1. **V7, dato relacional:** hoy el ejemplo es "si ya compró antes". Evidencia: 0/82. Cambiarlo a **experiencia de consumo** ("¿ya venís consumiendo… o sería la primera vez?") y **solo cuando aporte** (asesoramiento), no como puente por defecto. Sacar "salvo que el historial lo muestre" porque Conversión ya usa `ultimo_producto_comprado`.
2. **Saludo suelto:** regla explícita — saludo cálido + una pregunta abierta; **no** ejecutar puente/guardar/transferir sobre un "Hola". (11/66 casos; 9 traen la intención en segundos.)
3. **Story sin producto visible:** preguntar de cuál; no guardar interés; el `anuncio_origen` es "respuesta a story".
4. **Ubicación primero:** responder Rivera/DAC y preguntar ciudad; **decisión D-1** sobre si se transfiere ahí.
5. **Entradas no comerciales** (posventa, comprobante, tercero, sin contexto): no vender, no guardar interés, no transferir a Conversión → cae en "Atención Humana" (misma dependencia que la de A34: aún no existe la ruta real).
6. **Audio / `[unsupported]`:** una línea pidiendo que lo escriba. Además: la transcripción, cuando existe, viene en portugués — **el agente no debe apoyarse en ella para guardar variables**.
7. **Tolerancia a errores de tipeo** ("queratina", "montevidoe") sin corregir al cliente — pero **interpretar solo si el contexto lo confirma** (anuncio de creatina).
8. **No citar precios** (varían por anuncio): ya está en V10; reforzar que la promo/precio válido es el **del anuncio**, no de memoria.
9. **Ráfagas:** una regla de "responder al estado actual, una pregunta" y evaluar subir el delay de 25 s a ~45–60 s (**decisión D-2**, cambio de configuración, no de prompt; el cliente hoy espera mediana 13 min).
10. **No pedir el teléfono** al cliente (artefacto interno).

**Lo que la auditoría NO cambia** (sigue congelado): `transfer_order`, la secuencia puente → guardar → transferir, `interes_inicial`/`anuncio_origen`, GPT-5.1 + FUNCTION_CALL, un solo interrogante principal, formato WhatsApp, saludo, "Recepción debe interpretar poco y escuchar mucho".

## 8. Decisiones y pendientes que salen de esta auditoría

- **PENDIENTE:** **D-1** (desbloquea: ChatGPT + usuario): en "ubicación primero" con anuncio (9 %): ¿transferir tras responder + 1 turno, o esperar a que diga qué quiere? Evidencia: T44 dijo "sí, estoy interesado" al siguiente mensaje; T40/T12/T02 no.
- **PENDIENTE:** **D-2** (desbloquea: el usuario): delay 25 s → 45–60 s.
- **PENDIENTE:** **D-3** (desbloquea: nosotros, verificable en solo lectura): ¿el payload de una *story reply* trae la imagen/producto? En la extracción compacta no; falta mirar la respuesta completa de `/messages/{id}` para un caso story.
- **PENDIENTE:** **D-4** (desbloquea: soporte del CRM): transcripción de audios en portugués y solo 7/72 con texto — ¿se puede configurar el idioma o el modelo de STT? Sumar a la consulta S20 o a una nueva.
- **PENDIENTE:** **D-5** (desbloquea: el usuario): ¿el Recepcionista atenderá **todo** lo entrante (incluye posventa y avisos)? Si sí, las entradas no comerciales necesitan la ruta real de "Atención Humana".
- **Sin cambio de estado:** medios de pago (Q1: sin fuente de medios de pago aprobados; 15/82 conversaciones preguntan por pago), S20/A33 (Conversión no despierta al vincularse), A25 (identificación).

## 9. Reproducir / dónde están los datos

- Extracción (solo `GET`): `.playwright-mcp/audit-tickets-index.json` (300 tickets, metadatos), `audit-selected-ids.json` (82 ids), `audit-messages-raw.json` (mensajes compactos), `audit-process.js` (carga anonimizando teléfonos/mails/links). **Nada de eso se sube a GitHub** (carpeta ignorada).
- Criterio de "nuevo": `createdAt ≥ 2026-09-13`. Tramo = mensajes contiguos sin hueco ≥12 h. Los tiempos usan `createdAt` de cada mensaje (UTC).
