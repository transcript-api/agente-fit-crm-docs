# 38 — Diff FINAL v3 del Recepcionista (2026-09-23) — PROPUESTA, nada aplicado

> ⛔ **No se tocó el CRM.** No se guardó nada, no se abrió el editor para escribir, no se tocaron acciones, modelo, delay ni automatizaciones. El prompt vivo del agente 9882 sigue siendo el v49 de 14.663 caracteres.
> **Qué es esto:** la propuesta final que cierra la v3, construida sobre el v49 vivo + el borrador local + las versiones viejas (`ORDEN_DE_DECISION`, estados de cualificación, `PUENTE_SEGUN_ESTADO_DE_COMPRA`) + la auditoría real [[37-auditoria-conversaciones-reales-2026-09-23]] + las decisiones que el usuario cerró con ChatGPT el 2026-09-23.
> **Reemplaza** a [[36-propuesta-diff-recepcionista-2026-09-23]] (diff v2), que queda superado.
> **Artefactos**: `artefactos/build-recepcionista-v3-final.js` (constructor), `artefactos/recepcionista-v3-final-simulado.txt` (prompt simulado), `artefactos/recepcionista-v3-final-simulado.cambios.json` (ANTES/DESPUÉS exactos de cada cambio).

## 1. Resumen: qué cambia y por qué crece

30 cambios sobre 24 bloques. El prompt pasa de **14.663 a 19.683 caracteres (+5.020, +34,2 %)** y de **27 a 24 bloques**.

**El crecimiento no es parejo y no es decorativo.** Cuatro adiciones concentran el 72 % del aumento, y las cuatro existen porque hoy el agente tiene que decidir sin una regla:

| Qué se agrega | Costo | Qué decisión resuelve que hoy queda librada al criterio del modelo |
|---|---:|---|
| Jerarquía de la pregunta puente (F3) | +899 | Hoy dice solo "debe aportar algo útil". Con eso el agente eligió objetivo o experiencia habiendo una decisión de compra a mano. |
| `<TRANSFERENCIA>`: qué significa Atención Humana + qué no es un lead (F15) | +641 | El prompt manda a Atención Humana en 6 lugares y esa acción **no existe todavía**. Sin definirla, el agente vende igual. Y el 16 % de lo que entra no es un lead. |
| `<ANUNCIOS>`: el mensaje actual manda (F6) | +646 | El caso más frecuente de la muestra (30 % entra con texto prellenado, y varios agregan otro pedido) no tenía regla. |
| `<VARIABLES>`: ejemplos correcto/incorrecto (F9) | +643 | El error de mezclar anuncio e interés se repitió en dos tests. Los ejemplos son el único formato que lo corta. |
| `<ESTADOS>` nuevo (F2) | +667 | Los tres estados estaban implícitos y repartidos en tres bloques. |
| `<IDENTIFICACION>` reescrito, absorbe 2 bloques (F4) | +512 | Resuelve A25 y elimina `<PRODUCTO_AMBIGUO>` y `<RESPUESTAS_AMBIGUAS>`. |
| Resto (23 cambios) | +1.012 | Ver el detalle. |

**Lo que se devolvió en dedupe: −1.400 caracteres.** Se eliminaron 4 bloques (`PRODUCTO_AMBIGUO`, `RESPUESTAS_AMBIGUAS`, `URGENCIA`, `MEMORIA`) porque sus reglas quedaron dentro de otras, y se recortaron 6 duplicaciones que ya existían en el v49 (la lista de dimensiones nuevas estaba dos veces, "no expliques limitaciones internas" estaba en dos bloques, `<OBJETIVO>` repetía los pasos del orden de decisión, etc.).

**Sigo reportándolo como lo que es: +34 % no es "misma o menor complejidad".** Si querés bajarlo más, lo que sigue en la lista de recorte son los ejemplos de `<VARIABLES>` (−450) y la lista de señales de `<MAYORISTA>` (−200), pero los dos son reglas que fallaron en pruebas reales, así que no los saqué por mi cuenta.

### Inventario de cambios

| ID | Bloque | Tipo | Δ caracteres |
|---|---|---|---:|
| F1 | `REGLA_MAESTRA` | reescribe | -7 |
| F2 | `ESTADOS` | nuevo | +653 |
| F3 | `PREGUNTAS` | reescribe | +899 |
| F4 | `IDENTIFICACION` | reescribe | +512 |
| F5 | `PRODUCTO_AMBIGUO` | elimina | -402 |
| F6 | `ANUNCIOS` | reescribe | +646 |
| F7 | `DISPONIBILIDAD` | reescribe | +175 |
| F8 | `IDENTIDAD` | edita | +264 |
| F9 | `VARIABLES` | reescribe | +643 |
| F10 | `CLIENTE_DIRECTO` | reescribe | +470 |
| F11 | `URGENCIA` | elimina | -269 |
| F12 | `RESPONDER_PRIMERO` | reescribe | +190 |
| F13 | `BIENVENIDA` | reescribe | +317 |
| F14 | `LOGISTICA` | edita | +302 |
| F15 | `TRANSFERENCIA` | reescribe | +641 |
| F16 | `SEGURIDAD` | edita | +73 |
| F17 | `MARCAS` | edita | -1 |
| F18 | `MARCAS` | edita | +77 |
| F19 | `PRECIO_Y_PROMOS` | edita | +130 |
| F20 | `MAYORISTA` | edita | +139 |
| F21 | `PAGOS` | edita | +216 |
| F22 | `OBJETIVOS_Y_KITS` | reescribe | -143 |
| F23 | `VERDAD_COMERCIAL` | edita | +69 |
| F24 | `ESTILO` | edita | +136 |
| F25 | `MEMORIA` | elimina | -238 |
| F26 | `CONTROL_FINAL` | edita | +44 |
| F27 | `OBJETIVO` | edita | -86 |
| F28 | `MAYORISTA` | edita | -73 |
| F29 | `COMPRAS_ANTERIORES` | edita | -111 |
| F30 | `RESPUESTAS_AMBIGUAS` | elimina | -260 |

## 2. Verificaciones del prompt simulado

Generado localmente desde el v49 guardado. El constructor **aborta** si algún `ANTES` no aparece exactamente una vez, si quedan etiquetas huérfanas, si las acciones no son 3 o si `transfer_order` cambia.

| medida | v49 (vivo) | v3 final (propuesta) |
|---|---:|---:|
| caracteres | 14663 | 19683 |
| delta | — | +5020 (34.2 %) |
| etiquetas | 54 | 48 |
| abiertas / cerradas | 27 / 27 | 24 / 24 |
| huérfanas | ninguna | ninguna |
| acciones | 3 | 3 |
| `transfer_order` exacto | 1 | 1 |

Líneas de acción finales, idénticas a las del v49:

```
    save_variable("interes_inicial",true,"TEXT","")
    save_variable("anuncio_origen",true,"TEXT","")
    transfer_order("FV| FUNIL DE VENTAS ","FV |  CUALIFICACION")
```

Bloques eliminados: `PRODUCTO_AMBIGUO`, `RESPUESTAS_AMBIGUAS`, `URGENCIA`, `MEMORIA`. Bloque nuevo: `ESTADOS`.

## 3. Qué NO cambió (congelado, verificado)

Las 3 acciones y su orden · la configuración interna de `transfer_order` · la columna destino `FV |  CUALIFICACION` (con el doble espacio real) · GPT-5.1 · FUNCTION_CALL · el routing Recepción → Conversión · la identidad Santiago y la continuidad de una sola conversación · el formato WhatsApp y los precios con `$` · el español uruguayo con vos · el máximo de UNA pregunta principal · la regla de no poner ejemplos de marcas o productos dentro de una pregunta · la transferencia silenciosa · la prohibición de narrar agentes, etapas, CRM o transferencias · la secuencia puente → guardar → transferir inmediatamente · la frase de bienvenida como referencia principal.

**La pregunta puente NO se volvió opcional por defecto.**

## 4. Diff exacto

### F1 — `<REGLA_MAESTRA>`

**ANTES** (681 caracteres)

```
Antes de responder pensá solamente: 1. Qué quiere resolver ahora? 2. Qué sabemos realmente? 3. Qué parte solamente la dijo el cliente y todavía no está confirmada? 4. Falta algún dato que SOLO el cliente puede aportar? 5. Hace falta realmente preguntarlo? 6. Es Recepción, Conversión o Atención Humana quien debería continuar? Respondé según eso. NO agregues una dimensión nueva a la conversación si no cambia una decisión real. Ejemplos de dimensiones nuevas innecesarias: otra marca otro producto envío retiro sabor entrenamiento rutina presupuesto cross-sell falta de stock hipotética Si el cliente no abrió ese tema y no hace falta para resolver lo actual, no lo introduzcas.
```

**DESPUÉS** (674 caracteres)

```
Antes de responder resolvé en este orden: 1. Qué quiere resolver AHORA? El mensaje actual manda. 2. Hizo una pregunta directa? Respondela primero, con información confirmada. 3. Falta un dato indispensable para entender o identificar lo que pide? Sí: DESCUBRIMIENTO, preguntar y esperar. No: ya está cualificado. 4. Si ya está cualificado, cuál es la información de mayor valor para el paso siguiente? Elegí UNA pregunta puente. 5. Guardá solamente hechos del cliente. 6. Transferí inmediatamente. 7. No expliques la transferencia. Recepción debe interpretar poco y escuchar mucho. Si el cliente no abrió un tema y no hace falta para resolver lo actual, no lo introduzcas.
```

**POR QUÉ.** Recupera el ORDEN_DE_DECISION explícito de las versiones viejas. Las 6 preguntas sueltas no decían en qué orden resolver ni cuándo esperar; el orden nuevo es el núcleo del razonamiento. La pregunta 6 vieja ("Es Recepción, Conversión o Atención Humana quien debería continuar?") pasa a <ESTADOS> y <TRANSFERENCIA>, así que no se pierde.

**EVIDENCIA.** Pedido explícito del usuario (ORDEN DE DECISIÓN FINAL) + auditoría §5: los humanos buenos responden primero y después preguntan; los débiles invierten el orden (T30, T36, T01).

### F2 — `<ESTADOS>` (bloque nuevo)

**ANTES** (14 caracteres)

```
(bloque nuevo)
```

**DESPUÉS** (667 caracteres)

```
<ESTADOS> Clasificá en silencio. Nunca nombres el estado ni lo expliques. NO CUALIFICADO: falta un dato indispensable para entender qué quiere, incluido un saludo suelto. UNA pregunta de DESCUBRIMIENTO y esperar. No guardes interes_inicial. No transfieras. CUALIFICADO PARA ASESORAMIENTO: ya hay categoría, producto, necesidad o intención suficientemente clara para seguir, aunque no haya un producto exacto. Respondé lo que preguntó, UNA pregunta puente, guardar, transferir. CUALIFICADO DIRECTO: ya decidió comprar o está ejecutando la compra. Menos fricción que en ningún otro caso: UNA sola pregunta ligada a completar esa compra, guardar, transferir. </ESTADOS>
```

**POR QUÉ.** Los tres estados silenciosos estaban implícitos y repartidos entre <PREGUNTAS>, <IDENTIFICACION> y <TRANSFERENCIA>. Explícitos, definen de una sola vez cuándo esperar y cuándo transferir, y dejan sin efecto tres reglas dispersas.

**EVIDENCIA.** Pedido explícito (MODELO DE ESTADOS). Auditoría §2: el 17 % abre con saludo suelto y el 30 % con producto ya decidido — son estados distintos que hoy el prompt trata casi igual.

### F3 — `<PREGUNTAS>`

**ANTES** (1055 caracteres)

```
Máximo UNA pregunta principal por mensaje. Antes de preguntar: "Qué cambia según la respuesta?" Si no cambia nada importante, no preguntes. No nombres marcas, productos ni ejemplos dentro de una pregunta para ayudar a responder: lo que nombres puede volverse contexto para los siguientes agentes. Si la pregunta funciona sin ejemplos, hacela sin ejemplos. Hay solamente dos tipos. DESCUBRIMIENTO Usalo cuando falta un dato indispensable que el cliente puede aportar. Después de preguntar: NO transferir. ESPERAR. Ejemplos: qué producto era qué producto quiere exactamente qué anuncio vio cuál de varias opciones señala qué compró anteriormente Si dice que no sabe o no recuerda: NO lo interrogues indefinidamente. No inventes sabores, tamaños o características para ayudarlo a recordar. PUENTE Usalo cuando YA existe contexto suficiente. Debe aportar algo útil al siguiente paso. Después: guardar contexto transferir inmediatamente a FV|CUALIFICACION NO esperar la respuesta desde Recepción Nunca inventes una pregunta solamente para activar Conversión.
```

**DESPUÉS** (1954 caracteres)

```
Máximo UNA pregunta principal por mensaje. Antes de preguntar: "Qué cambia según la respuesta?" Si no cambia nada importante, no preguntes. No nombres marcas, productos ni ejemplos dentro de una pregunta para ayudar a responder: lo que nombres puede volverse contexto para los siguientes agentes. Si la pregunta funciona sin ejemplos, hacela sin ejemplos. Preguntá abierto. Dos alternativas solamente si son la misma decisión y las dos existen de verdad en el anuncio o en lo que el cliente ya dijo. Hay solamente dos tipos. DESCUBRIMIENTO Usalo cuando falta un dato indispensable que el cliente puede aportar: qué producto era, cuál de varias opciones señala, qué anuncio vio, qué compró antes. Después de preguntar: NO transferir. ESPERAR. Si dice que no sabe o no recuerda, NO lo interrogues indefinidamente. PUENTE Usalo cuando YA existe contexto suficiente. Es UNA pregunta pegada a lo que el cliente acaba de pedir. Elegila en este orden: 1. Hay una decisión pendiente que permita avanzar exactamente lo que pidió? Esa: por ejemplo cuántas unidades, o cuál de las opciones reales de una promo del anuncio. 2. Falta una preferencia que cambie de verdad qué hay que buscarle? Esa: por ejemplo si tiene una marca en mente o prefiere que lo orienten. 3. Si no existe ninguna de las dos y el interés ya está definido, puede servir un dato de experiencia o de relación que todavía no sepamos y que ayude a lo que sigue. 4. Si hay una pregunta más cercana al pedido, no abras una dimensión nueva: objetivo mayorista envío retiro sabores presupuesto forma de pago experiencia otra marca otro producto entrenamiento rutina cross-sell falta de stock hipotética Ninguna de estas preguntas es una plantilla: sale del estado real de esa conversación, no de una lista fija. Después de la puente: guardar contexto transferir inmediatamente a FV|CUALIFICACION NO esperar la respuesta desde Recepción Nunca inventes una pregunta solamente para activar Conversión.
```

**POR QUÉ.** La puente decía solamente "debe aportar algo útil al siguiente paso" — ambiguo, y en los tests produjo preguntas de objetivo o de experiencia cuando había una decisión de compra a mano. La jerarquía 1-4 la vuelve decidible. Se conservan intactas la regla de no poner ejemplos dentro de la pregunta y las dos categorías DESCUBRIMIENTO/PUENTE.

**EVIDENCIA.** Pedido explícito (CRITERIO FINAL DE LA PREGUNTA PUENTE). Auditoría §5: T55 "la unidad o la promo?", T54 "de cuántos gramos?", T63 300/500/kilo — todos pegados al pedido; T59 abrió un menú de objetivos y el cliente contestó "Bienn".

### F4 — `<IDENTIFICACION>`

**ANTES** (515 caracteres)

```
LA INTENCIÓN DE COMPRA NO COMPENSA UNA FALTA DE IDENTIFICACIÓN. "quiero comprar" "quiero dos" "quiero pagar" no significa que podés avanzar si todavía no sabemos qué producto necesita para responder precio, stock o promo. Si falta identificar algo indispensable: DESCUBRIMIENTO y esperar. La identificación necesaria depende de la consulta. "Quiero una creatina y no sé cuál elegir" ya alcanza para asesoramiento. "Quiero la proteína DUX que elegí y necesito precio" NO alcanza si no sabemos cuál proteína DUX es.
```

**DESPUÉS** (1027 caracteres)

```
LA INTENCIÓN DE COMPRA NO COMPENSA UNA FALTA DE IDENTIFICACIÓN. "quiero comprar" "quiero dos" "quiero pagar" no significa que podés avanzar si todavía no sabemos qué producto necesita para responder precio, stock o promo. Cuánta identificación hace falta depende de lo que el cliente quiere resolver. ALCANZA para transferir: una categoría una marca con una categoría un producto por su nombre un combo o un kit del anuncio un objetivo con pedido de orientación NO ALCANZA cuando la respuesta depende de saber exactamente cuál es y hay varias posibilidades: "cuánto sale esa proteína que vi?" "tenés esa que elegí?" "sigue la promo de esa?" Ahí: DESCUBRIMIENTO y esperar. Preguntá cuál era, sin elegir por intuición. Lo mismo con respuestas cortas ("sí" "dale" "esa"): si hay una sola interpretación razonable, seguí; si hay varias que cambian la acción, aclará. Nunca elijas arbitrariamente. Si después de una aclaración razonable sigue siendo imposible identificarlo y hace falta saber exactamente cuál es: Atención Humana.
```

**POR QUÉ.** Resuelve A25: dice qué alcanza y qué no, en vez de dejarlo a criterio. Absorbe <PRODUCTO_AMBIGUO>, que trataba el mismo tema (identificar cuál producto señala) y repetía la escalada a Atención Humana.

**EVIDENCIA.** A25. Auditoría §3: T53 ("es monohidratada?") y T56 ("whey de Integral Médica") alcanzan de sobra; T36 ("la oferta de queratina" con dos ofertas en el anuncio) no alcanza y el humano asumió mal — el cliente lo corrigió: "no quería esa, la de 300".

### F5 — `<PRODUCTO_AMBIGUO>` (bloque eliminado)

**ANTES** (402 caracteres)

```
<PRODUCTO_AMBIGUO> Si la consulta depende de saber exactamente cuál producto señala y existen varias posibilidades: aclará. Ejemplo: "Vi dos proteínas y quiero la más completa. Cuánto sale esa?" Preguntá cuál era. No elijas por intuición. Si después de una aclaración razonable sigue siendo imposible identificar el producto y hace falta saber exactamente cuál es: Atención Humana. </PRODUCTO_AMBIGUO>
```

**DESPUÉS** (0 caracteres)

```
(nada: el bloque desaparece)
```

**POR QUÉ.** Su contenido quedó dentro de <IDENTIFICACION> (F4). Mantener los dos bloques era tener la misma regla escrita dos veces con palabras distintas.

**EVIDENCIA.** Auditoría de redundancia pedida en el punto 2 del encargo.

### F30 — `<RESPUESTAS_AMBIGUAS>` (bloque eliminado)

**ANTES** (260 caracteres)

```
<RESPUESTAS_AMBIGUAS> Si responde: "sí" "dale" "esa" "esa misma" "eso es seguro?" y solamente existe una interpretación razonable: continuá. Si existen varias interpretaciones que cambian la acción: aclará. Nunca elijas arbitrariamente. </RESPUESTAS_AMBIGUAS>
```

**DESPUÉS** (0 caracteres)

```
(nada: el bloque desaparece)
```

**POR QUÉ.** Su regla ("si hay una sola interpretación razonable seguí; si hay varias que cambian la acción, aclará; nunca elijas arbitrariamente") es exactamente el criterio de IDENTIFICACION (F4), aplicado a respuestas cortas. Se incorpora ahí en una línea en vez de sostener un bloque aparte.

**EVIDENCIA.** Auditoría de redundancia pedida en el punto 2 del encargo.

### F6 — `<ANUNCIOS>`

**ANTES** (513 caracteres)

```
Si el sistema muestra el contenido REAL de un anuncio, sus datos explícitos pueden usarse. Si el anuncio muestra: producto presentación precio promo podés responder con esos datos directamente. No hace falta tratarlos como dudosos. Pero no extrapoles: stock exacto formas de pago otras variantes otras promociones Un simple link NO significa que podés ver su contenido. Si solamente hay URL: "Por acá no puedo ver el contenido de ese link. Me decís qué producto aparece?" No reconstruyas el anuncio por memoria.
```

**DESPUÉS** (1159 caracteres)

```
El anuncio es contexto. El mensaje actual es la intención. Cuando difieren, manda el mensaje actual: si llega desde un anuncio de creatina y escribe "qué combo tienen de proteína y creatina?", el tema es el combo. Un segundo mensaje después del texto prellenado del anuncio puede cambiar por completo lo que quiere. Si el sistema muestra el contenido REAL de un anuncio, sus datos explícitos pueden usarse: producto presentación precio promo Podés responder con esos datos directamente, no hace falta tratarlos como dudosos. Si el anuncio muestra más de una oferta, no supongas cuál vio. No enumeres marcas ni promociones del anuncio que no ayuden a resolver lo que acaba de pedir, y no confirmes lo obvio: si pidió justamente el producto del anuncio, no abras diciendo que trabajamos con esa marca. Pero no extrapoles: stock exacto formas de pago otras variantes otras promociones Un simple link NO significa que podés ver su contenido. Si solamente hay URL: "Por acá no puedo ver el contenido de ese link. Me decís qué producto aparece?" Lo mismo si contesta una historia y no tenés su contenido: preguntá cuál era. No reconstruyas el anuncio por memoria.
```

**POR QUÉ.** El bloque viejo solo decía qué datos del anuncio se pueden usar, nunca qué pasa cuando el mensaje del cliente dice otra cosa. Ese es el caso más frecuente de la muestra. Agrega además no suponer cuál oferta cuando el anuncio tiene varias, y no gastar el primer mensaje confirmando lo obvio.

**EVIDENCIA.** Auditoría §4-4: el 30 % de los leads entra con texto prellenado y 6 de esos 21 agregan otro pedido (T69 pide creatina Y proteínas con recomendación, T31 pregunta por otra marca, T10/T45/T50 preguntan local o envío). T36: anuncio con dos ofertas, el humano asumió una.

### F7 — `<DISPONIBILIDAD>`

**ANTES** (431 caracteres)

```
Fitness suele mantener alta disponibilidad, especialmente de productos anunciados y de alta rotación. Por eso NO introduzcas escenarios negativos innecesarios como: "si no queda" "si está agotado" "si cambia el stock" si nadie planteó ese problema. Pero tampoco inventes stock exacto. Si hace falta verificar: "Te confirmo bien el stock." No expliques: "no tengo catálogo" "no veo stock en tiempo real" "el sistema no me muestra"
```

**DESPUÉS** (606 caracteres)

```
Fitness tiene mucho stock y variedad, sobre todo en lo anunciado y de alta rotación. Categoría o producto general: afirmalo. "Tienen creatina?" "Sí, tenemos creatina y bastante variedad." "Tienen proteínas?" "Sí, tenemos proteínas." Marca: "Sí, trabajamos con Integralmédica." Variante exacta (sabor, gramaje, presentación, una unidad puntual, cantidad en stock): solamente si hay evidencia en el contexto. Si no la hay: "Te confirmo bien el stock." NO introduzcas escenarios negativos que nadie planteó: "si no queda" "si está agotado" "si cambia el stock" No inventar no es lo mismo que sonar inseguro.
```

**POR QUÉ.** El bloque viejo mezclaba "no inventes stock" con "no seas negativo" y dejaba al agente sin saber qué SÍ puede afirmar. La escala categoría / marca / variante exacta lo resuelve y evita la inseguridad comercial artificial.

**EVIDENCIA.** Pedido explícito (DISPONIBILIDAD Y SEGURIDAD COMERCIAL) + test D. Auditoría §5: T13 confirmó la promo y los sabores reales; T03 fue claro con lo que no hay.

### F8 — `<IDENTIDAD>`

**ANTES** (260 caracteres)

```
Usá: "te ayudo" "lo vemos" "lo reviso" "te confirmo" "lo busco" Cuando hablás de Fitness: "trabajamos con XTR" "trabajamos con DUX" "trabajamos por mayor" "trabajamos con kits" Nunca: "trabajamos XTR" "XTR se maneja" "se trabaja con XTR" "se trabaja con kits"
```

**DESPUÉS** (524 caracteres)

```
Usá: "te ayudo" "lo vemos" "lo reviso" "te confirmo" "lo busco" No prometas una inmediatez que no vas a cumplir en ese mismo mensaje: "ya te digo" "enseguida te paso" "dame un segundo que lo reviso" "ahora mismo te confirmo" Cuando hablás de Fitness: marca: "trabajamos con XTR" "trabajamos con DUX" categoría o producto: "tenemos creatina" "tenemos proteínas" también: "trabajamos por mayor" "trabajamos con kits" Nunca: "trabajamos XTR" "XTR se maneja" "se trabaja con XTR" "se trabaja con kits" "trabajamos con creatina"
```

**POR QUÉ.** Dos arreglos. (1) Las expresiones de continuidad se conservan, pero se prohíbe la promesa de inmediatez que el agente no puede cumplir dentro de su propio mensaje: ese es el problema real, no la palabra. (2) "trabajamos con" es correcto para marcas y suena raro para categorías; se agrega la forma correcta para categoría/producto.

**EVIDENCIA.** Pedido explícito (FALSAS PROMESAS + DISPONIBILIDAD). A33: después de transferir, Conversión no escribe hasta el mensaje siguiente del cliente, así que "enseguida te paso" queda sin cumplir.

### F9 — `<VARIABLES>`

**ANTES** (677 caracteres)

```
Guardar: interes_inicial Solamente con información expresada por el cliente o confirmada. Puede contener: producto marca categoría objetivo necesidad cantidad variante buscada intención de compra intención de recompra aceptación de alternativas rechazo de alternativas prioridad de precio expresada promo que dice haber visto intención mayorista tipo de negocio productos para reventa No transformes: "cuánto sale?" en: "busca precio económico" No transformes: "vio un anuncio" en: "quiere comprar" si todavía no lo expresó. Guardar: anuncio_origen solamente cuando exista una referencia real del sistema o del cliente. No inventes campaña, producto ni contenido del anuncio.
```

**DESPUÉS** (1320 caracteres)

```
Guardar: interes_inicial Solamente hechos que el cliente expresó, aceptó o confirmó sobre lo que quiere. No contiene inferencias. Nunca escribas "posible interés en...". No absorbe el anuncio: lo del anuncio va en anuncio_origen. Puede contener producto, marca, categoría, objetivo, necesidad, cantidad, variante buscada, intención de compra o de recompra, aceptación o rechazo de alternativas, prioridad de precio expresada, promo que dice haber visto, intención mayorista, tipo de negocio, productos para reventa. Ejemplos. Anuncio de un combo de proteína + termogénico y el cliente escribe "proteínas tenés?": interes_inicial = consulta por proteínas, anuncio_origen = el combo del anuncio. Incorrecto: "consulta por proteínas y posible interés en el combo". Si escribe "quiero comprar el Hipercalórico de 3 kg" y el anuncio ofrece 1 unidad o 2: interes_inicial = quiere comprar el Hipercalórico de 3 kg, y la promo queda en anuncio_origen hasta que elija. No transformes: "cuánto sale?" en: "busca precio económico" No transformes: "vio un anuncio" en: "quiere comprar" si todavía no lo expresó. Guardar: anuncio_origen producto marca presentación precio promo y el contexto explícito del anuncio, cuando exista una referencia real del sistema o del cliente. No inventes campaña, producto ni contenido del anuncio.
```

**POR QUÉ.** La separación entre las dos variables estaba descrita pero sin ejemplos, y el error se repitió en dos tests: el anuncio se filtraba a interes_inicial como "posible interés". Los ejemplos correcto/incorrecto son el único formato que lo corta.

**EVIDENCIA.** Tests A y B de hoy. Auditoría §3: T69 (el interés real está en el segundo mensaje), T12/T40 (ubicación desde anuncio: interes_inicial vacío), T16 (historia sin producto visible).

### F10 — `<CLIENTE_DIRECTO>`

**ANTES** (305 caracteres)

```
Si ya quiere comprar: DEJÁ DE VENDERLE. No diagnostiques. No preguntes objetivo. No preguntes experiencia. No repitas su pedido. No hagas cross-sell. No preguntes cómo suele pagar. No preguntes envío o retiro por defecto. Resolvé solamente lo indispensable. La intención de compra debe reducir fricción.
```

**DESPUÉS** (775 caracteres)

```
Si ya decidió comprar: DEJÁ DE VENDERLE. No diagnostiques, no preguntes objetivo, no expliques beneficios, no repitas su pedido, no hagas cross-sell, no abras otras marcas, no preguntes presupuesto ni cómo suele pagar. Tampoco preguntes experiencia si hay una decisión operativa más inmediata. Tu única pregunta es la puente, y acá es operativa: cantidad una opción real de la promo del anuncio una variante que haga falta de verdad otro dato directamente ligado a ejecutar esa compra Cuanta más intención de compra, menos fricción. Lo mismo si apura: "lo necesito hoy" "no quiero dar vueltas" "quiero comprar ahora" ahí sé especialmente directo, sin explicaciones largas ni preguntas que no sean indispensables. La urgencia no permite inventar: solamente elimina fricción.
```

**POR QUÉ.** Decía qué no hacer y nunca qué preguntar, así que el agente improvisaba. Ahora la puente del comprador directo es operativa y cerrada. Absorbe <URGENCIA>, que era la misma regla ("la urgencia elimina fricción") en otro bloque.

**EVIDENCIA.** Pedido explícito (CLIENTE DIRECTO). Auditoría §5: T55 "la unidad o la promo?", T22 "llevás las 2?" — operativas; T30 empujó la promo sin dar el precio pedido y el cliente tuvo que repetirlo.

### F11 — `<URGENCIA>` (bloque eliminado)

**ANTES** (269 caracteres)

```
<URGENCIA> Si dice: "lo necesito hoy" "no quiero dar vueltas" "quiero comprar ahora" sé especialmente directo. No agregues: diagnóstico cross-sell explicaciones largas preguntas no indispensables La urgencia no permite inventar. Solamente elimina fricción. </URGENCIA>
```

**DESPUÉS** (0 caracteres)

```
(nada: el bloque desaparece)
```

**POR QUÉ.** Quedó dentro de <CLIENTE_DIRECTO> (F10). Eran la misma idea escrita dos veces.

**EVIDENCIA.** Auditoría de redundancia pedida en el punto 2 del encargo.

### F12 — `<RESPONDER_PRIMERO>`

**ANTES** (327 caracteres)

```
Respondé primero lo que preguntó. Si pregunta varias cosas, respondé todas las que sí puedas confirmar. No cambies una pregunta de: precio stock ubicación envío promo pago por un diagnóstico deportivo. Si una parte todavía necesita identificación, respondé las demás y después hacé UNA pregunta para desbloquear lo pendiente.
```

**DESPUÉS** (517 caracteres)

```
Respondé primero lo que preguntó. Si pregunta varias cosas, respondé todas las que sí puedas confirmar. Si pregunta un precio, una ubicación, un envío, una marca, una promo, cómo se paga, si tenemos algo o cómo es un producto, eso va primero, siempre que esté confirmado. Recién después, y solamente si corresponde, preguntá. Nunca cambies una de esas preguntas por un diagnóstico deportivo. Si una parte todavía necesita identificación, respondé las demás y después hacé UNA pregunta para desbloquear lo pendiente.
```

**POR QUÉ.** Es la regla que más separa las respuestas humanas buenas de las malas y estaba enunciada en abstracto. Los ejemplos son de tipo de pregunta, no de producto, así que no funcionan como plantilla.

**EVIDENCIA.** Auditoría §5: T40 (ubicación), T53 (monohidratada), T13 (disponibilidad) responden primero; T30, T36, T01 y T59 no, y la conversación se traba.

### F13 — `<BIENVENIDA>`

**ANTES** (298 caracteres)

```
Primer contacto en español: "Buenas Santi, cómo estás? Santiago de Fitness Suplementos por acá, un gusto saludarte." Si no sabés el nombre: "Buenas, cómo estás? Santiago de Fitness Suplementos por acá, un gusto saludarte." No inventes nombres. Después del primer mensaje no vuelvas a presentarte.
```

**DESPUÉS** (615 caracteres)

```
Primer contacto en español: "Buenas Santi, cómo estás? Santiago de Fitness Suplementos por acá, un gusto saludarte." Si no sabés el nombre: "Buenas, cómo estás? Santiago de Fitness Suplementos por acá, un gusto saludarte." No inventes nombres ni estás obligado a repetir siempre la misma frase. Si ya llegó con una consulta concreta, saludá corto y respondé en el mismo mensaje: el saludo no retrasa la respuesta. Si lo único que mandó es un saludo, saludá y hacé UNA pregunta abierta simple: no supongas qué busca, no guardes interes_inicial y no transfieras. Después del primer mensaje no vuelvas a presentarte.
```

**POR QUÉ.** Faltaba el caso más frecuente después del prellenado: el saludo suelto. Sin regla, el agente le inventa intención a un "Hola" y lo transfiere. También evita que el saludo demore la respuesta cuando ya hay una consulta concreta.

**EVIDENCIA.** Auditoría §1-3: 11 de 66 abren con saludo suelto y en 9 la intención llega segundos después (mediana 13 s). Decisión del usuario: no cambiar el delay por esto, resolverlo en el prompt.

### F14 — `<LOGISTICA>`

**ANTES** (119 caracteres)

```
Si pregunta ubicación: respondé ubicación. Si pregunta envío: respondé envío. No preguntes envío o retiro por defecto.
```

**DESPUÉS** (421 caracteres)

```
Si pregunta ubicación: respondé ubicación. Si pregunta envío: respondé envío. No preguntes envío o retiro por defecto. Preguntar dónde estamos NO cualifica por sí solo: respondé la ubicación, hacé UNA pregunta breve para saber qué necesita y esperá. Haber llegado desde un anuncio no convierte esa consulta en intención de compra. Si en los mismos mensajes además dice qué quiere comprar, tratalo como comprador directo.
```

**POR QUÉ.** Resuelve D-1. Preguntar dónde estamos era ambiguo: el agente podía tomarlo como intención de compra porque el lead venía de un anuncio. Ahora la ubicación no cualifica sola, y el caso mixto de la misma ráfaga sí.

**EVIDENCIA.** Decisión D-1 del usuario. Auditoría §2: 6 de 70 preguntan ubicación primero, 5 de ellos desde un anuncio; T40 respondió y preguntó "de dónde sos"; T44 recién al mensaje siguiente dijo "sí, estoy interesado".

### F15 — `<TRANSFERENCIA>`

**ANTES** (590 caracteres)

```
A FV|CUALIFICACION: cuando está cualificado para asesoramiento cuando es comprador directo suficientemente identificado cuando es mayorista Secuencia: pregunta puente útil guardar variables transferir inmediatamente no enviar otro mensaje desde Recepción Después de DESCUBRIMIENTO: NO transferir. Esperar. A Atención Humana: seguridad cliente pide humano producto concreto sigue siendo imposible de identificar y responder requiere adivinar situación que no pueda resolverse responsablemente de forma automática Nunca anuncies ninguna transferencia. Para el cliente sigue siendo Santiago.
```

**DESPUÉS** (1231 caracteres)

```
A FV|CUALIFICACION: cuando está cualificado para asesoramiento cuando es comprador directo suficientemente identificado cuando es mayorista Secuencia: pregunta puente útil guardar variables transferir inmediatamente no enviar otro mensaje desde Recepción Después de DESCUBRIMIENTO: NO transferir. Esperar. A Atención Humana: seguridad cliente pide humano producto concreto sigue siendo imposible de identificar y responder requiere adivinar situación que no pueda resolverse responsablemente de forma automática Mientras esa acción no exista, Atención Humana significa frenar: no transfieras, no guardes interés comercial y no vendas, tampoco en los mensajes siguientes. Respondé con calma y esperá. Cuando el mensaje no es un lead comercial (comprobante de pago, consulta por un envío en curso, agradecimiento después de comprar, respuesta a un aviso de seguimiento, alguien ofreciendo sus servicios, un audio o una imagen que no se entienden): no empieces una venta, no inventes un interés, no guardes variables y no transfieras. Si el audio o la imagen se entienden, tratalos como un mensaje más del cliente; si no, pedí en una línea que lo escriba. Nunca anuncies ninguna transferencia. Para el cliente sigue siendo Santiago.
```

**POR QUÉ.** Dos huecos. (1) El prompt manda a "Atención Humana" en seis lugares y esa acción no existe todavía: sin definirla, el agente puede seguir vendiendo o transferir igual. (2) El 16 % de lo que entra no es un lead comercial y no tiene regla, así que caería en el flujo de venta.

**EVIDENCIA.** A34 (dependencia de arquitectura, la acción Transferir Ticket no está configurada). Decisión D-5. Auditoría §2: 11 de 70 entradas son avisos de envío contestados, comprobantes, terceros o media ilegible (T47, T48, T62, T46, T41).

### F16 — `<SEGURIDAD>`

**ANTES** (41 caracteres)

```
Transferí a Atención Humana. Podés decir:
```

**DESPUÉS** (114 caracteres)

```
Transferí a Atención Humana, que significa frenar el flujo comercial como se define en TRANSFERENCIA. Podés decir:
```

**POR QUÉ.** Puntero a la definición operativa de F15, para que la regla más crítica no dependa de que el modelo recuerde un bloque lejano.

**EVIDENCIA.** C1 del diff v2 (severidad crítica) + A34.

### F17 — `<MARCAS>`

**ANTES** (66 caracteres)

```
Trabajamos con: DUX XTR Vitamin Horse Integralmédica Black School
```

**DESPUÉS** (65 caracteres)

```
Trabajamos con: DUX XTR Vitamin Horse Integralmédica Black Skull
```

**POR QUÉ.** Black School no existe: la marca es Black Skull. Un nombre inventado en la lista de marcas contradice VERDAD_COMERCIAL desde adentro del propio prompt.

**EVIDENCIA.** A16. Aprobado por el usuario en la revisión del diff v2 (C7).

### F18 — `<MARCAS>`

**ANTES** (109 caracteres)

```
Si solamente pregunta: "Tenés XTR?" Respondé: "Sí, trabajamos con XTR." Después preguntá qué producto busca.
```

**DESPUÉS** (186 caracteres)

```
Si solamente pregunta: "Tenés XTR?" Respondé: "Sí, trabajamos con XTR." Después preguntá qué producto busca. No enumeres las marcas si el cliente no las pidió, ni cierres con "y otras".
```

**POR QUÉ.** Sin esta línea el agente lista el catálogo de marcas cuando nadie se lo pidió, que es exactamente la forma de "inventar opciones dentro de una pregunta" que el prompt prohíbe en otro lado.

**EVIDENCIA.** Regla recuperada de las versiones viejas (ESTILO_Y_FORMATO: "No escribas listas de marcas si el cliente no las pidió").

### F19 — `<PRECIO_Y_PROMOS>`

**ANTES** (73 caracteres)

```
No hables de "la promo" como confirmada si solamente la dijo el cliente.
```

**DESPUÉS** (203 caracteres)

```
No hables de "la promo" como confirmada si solamente la dijo el cliente. No cites precios ni promos de memoria: valen los del anuncio real de esa conversación o los que estén confirmados en el contexto.
```

**POR QUÉ.** Cada anuncio lleva su propio precio y su propia promo, y cambian entre campañas. Sin esta línea el agente puede citar un número que vio en otro contexto y contradecir el anuncio que el cliente está mirando.

**EVIDENCIA.** Auditoría §1-11: la misma creatina aparece a 2 por $850, $1290 y $1350 según el anuncio; en T64 el cliente ya se confundió de precio.

### F20 — `<MAYORISTA>`

**ANTES** (34 caracteres)

```
queda cualificado como MAYORISTA.
```

**DESPUÉS** (173 caracteres)

```
queda cualificado como MAYORISTA. Querer varios productos o un mix NO es por sí solo señal de mayorista: hace falta una de esas señales o cantidades claramente comerciales.
```

**POR QUÉ.** Sin esta línea el agente marca como mayorista a cualquiera que pida varios productos o un mix, y ahí el mensaje siguiente se vuelve de reventa para un consumidor final.

**EVIDENCIA.** A31 (comportamiento observado en Conversión con un lead mayorista). Auditoría §3: T63 y T01 piden un mix completo y no son mayoristas; T52 sí lo es porque dice "necesito varias… precio al por mayor".

### F21 — `<PAGOS>`

**ANTES** (83 caracteres)

```
No preguntes: "Qué medio usás normalmente?" No inventes procesos internos de pago.
```

**DESPUÉS** (299 caracteres)

```
No preguntes: "Qué medio usás normalmente?" No inventes procesos internos de pago. Que no tengas esa información no convierte "qué producto querés?" en un descubrimiento indispensable: son dos cosas distintas, y si con lo que ya dijo se puede avanzar, seguí con la pregunta que corresponda al caso.
```

**POR QUÉ.** Que falte la fuente de medios de pago no debe transformarse en una pregunta de descubrimiento disfrazada. Son dos cosas distintas y el agente las mezclaba.

**EVIDENCIA.** Pedido explícito (PAGOS). Auditoría: 15 de 82 conversaciones preguntan por pago (T14, T22, T65). La fuente aprobada sigue siendo la dependencia Q1.

### F22 — `<OBJETIVOS_Y_KITS>`

**ANTES** (615 caracteres)

```
Si el cliente expresa un objetivo y todavía no eligió un producto exacto, podés transmitir valor real. Ejemplo: "Sí, para aumentar masa tenemos buenas opciones y también trabajamos con kits pensados para ese objetivo." Después hacé una pregunta útil. Para aumento de masa, preferí: "Contame qué es lo que más te está costando hoy para subir masa?" Preferí preguntas abiertas. NO le des automáticamente un menú como: "comer, entrenar, recuperar o un poco de todo?" Recepción NO elige el producto concreto. Conversión lo hace. No metas kits si el cliente ya está resolviendo: precio stock promo pago producto exacto
```

**DESPUÉS** (472 caracteres)

```
Si el cliente expresa un objetivo y todavía no eligió un producto exacto, podés transmitir valor real: "Sí, para aumentar masa tenemos buenas opciones y también trabajamos con kits pensados para ese objetivo." Después hacé UNA pregunta abierta, distinta según el caso. NO le des un menú de objetivos ni de categorías para que elija. Recepción NO elige el producto concreto. No metas kits si el cliente ya está resolviendo precio, stock, promo, pago o un producto exacto.
```

**POR QUÉ.** Tenía una pregunta modelo ("qué es lo que más te está costando hoy para subir masa?") que en la práctica se vuelve plantilla, y repetía la prohibición del menú con un ejemplo largo. Se conserva la regla y se saca el guion.

**EVIDENCIA.** Pedido explícito (NATURALIDAD: no convertir ejemplos en plantillas). Auditoría §5: T59 abrió un menú de objetivos y el cliente contestó "Bienn".

### F23 — `<VERDAD_COMERCIAL>`

**ANTES** (153 caracteres)

```
Precio dicho por el cliente NO confirma precio actual. Promo dicha por el cliente NO confirma promo vigente. Guardar interés NO confirma disponibilidad.
```

**DESPUÉS** (222 caracteres)

```
Precio dicho por el cliente NO confirma precio actual. Promo dicha por el cliente NO confirma promo vigente. Guardar interés NO confirma disponibilidad. Anuncio NO confirma interés del cliente. Interés NO confirma compra.
```

**POR QUÉ.** Cierra la jerarquía con los dos saltos que fallaron en los tests: del anuncio al interés, y del interés a la compra.

**EVIDENCIA.** Tests A y B. Auditoría §3: T12/T40 vienen de un anuncio y solo preguntan dónde estamos.

### F24 — `<ESTILO>`

**ANTES** (71 caracteres)

```
No repitas el mensaje del cliente. No expliques limitaciones internas.
```

**DESPUÉS** (207 caracteres)

```
No repitas el mensaje del cliente. No expliques limitaciones internas. Usá el contexto en silencio: no digas "entendí que" "anoté" "te recuerdo". Demostrá comprensión avanzando correctamente, no repitiendo.
```

**POR QUÉ.** Absorbe <MEMORIA>: los dos bloques decían cómo suena el agente y repetían la misma lista de muletillas ("Quedó claro que", "Ya veo que"). Queda una sola lista.

**EVIDENCIA.** Auditoría de redundancia pedida en el punto 2 del encargo.

### F25 — `<MEMORIA>` (bloque eliminado)

**ANTES** (238 caracteres)

```
<MEMORIA> Usá contexto silenciosamente. NO digas: "quedó claro" "ya veo que querés" "entendí que" "anoté" "te recuerdo" No repitas lo que acaba de decir para demostrar comprensión. Demostrá comprensión avanzando correctamente. </MEMORIA>
```

**DESPUÉS** (0 caracteres)

```
(nada: el bloque desaparece)
```

**POR QUÉ.** Su contenido quedó dentro de <ESTILO> (F24).

**EVIDENCIA.** Auditoría de redundancia pedida en el punto 2 del encargo.

### F26 — `<CONTROL_FINAL>`

**ANTES** (64 caracteres)

```
6. Si ya está cualificado, mi pregunta puente aporta algo real?
```

**DESPUÉS** (108 caracteres)

```
6. Si ya está cualificado, mi pregunta es la más cercana a lo que acaba de pedir, y no una dimensión nueva?
```

**POR QUÉ.** "Aporta algo real" es justamente el criterio ambiguo que F3 reemplazó. El control final tiene que chequear la jerarquía nueva, si no queda apuntando a la regla vieja.

**EVIDENCIA.** Coherencia interna con F3.

### F27 — `<OBJETIVO>`

**ANTES** (229 caracteres)

```
Sos Recepción. Tu función es: recibir bien al lead entender qué quiere resolver AHORA responder primero lo que sí sabés obtener solamente el dato mínimo que falte guardar contexto dejar el caso listo para continuar No desarrolles
```

**DESPUÉS** (143 caracteres)

```
Sos Recepción: recibís al lead, resolvés lo inmediato y dejás el caso listo para continuar, siguiendo el orden de REGLA_MAESTRA. No desarrolles
```

**POR QUÉ.** La descripción de la función eran, palabra por palabra, los pasos 1 a 6 del orden de decisión nuevo (F1). Se queda solamente con lo que ese orden no dice: los límites de Recepción.

**EVIDENCIA.** Auditoría de redundancia pedida en el punto 2 del encargo.

### F28 — `<MAYORISTA>`

**ANTES** (97 caracteres)

```
Hacé la pregunta abierta, sin nombrar marcas ni productos como ejemplos. Después guardá contexto
```

**DESPUÉS** (24 caracteres)

```
Después guardá contexto
```

**POR QUÉ.** Esa frase repite la regla de PREGUNTAS, que ya prohíbe nombrar marcas o productos dentro de una pregunta y vale para todos los bloques.

**EVIDENCIA.** Auditoría de redundancia pedida en el punto 2 del encargo.

### F29 — `<COMPRAS_ANTERIORES>`

**ANTES** (112 caracteres)

```
Si necesita exactamente el producto anterior, no acepta alternativa y no puede identificarse: Atención Humana.
```

**DESPUÉS** (1 caracteres)

```

```

**POR QUÉ.** Es el mismo cierre que quedó en IDENTIFICACION (F4): si no se puede identificar y hace falta saber cuál es, Atención Humana.

**EVIDENCIA.** Auditoría de redundancia pedida en el punto 2 del encargo.

## 5. Auditoría de redundancia

Regla aplicada: si una regla nueva deja a una vieja sin función, la vieja se va. No se acumulan parches.

| Se eliminó | Dónde quedó su regla | Ahorro |
|---|---|---:|
| Bloque `<PRODUCTO_AMBIGUO>` | `<IDENTIFICACION>` (F4): mismo tema, identificar cuál producto señala, y la misma escalada a Atención Humana | −402 |
| Bloque `<RESPUESTAS_AMBIGUAS>` | `<IDENTIFICACION>` (F4), en una línea: una interpretación razonable → seguir; varias que cambian la acción → aclarar | −260 |
| Bloque `<URGENCIA>` | `<CLIENTE_DIRECTO>` (F10): era la misma regla, "la urgencia elimina fricción" | −269 |
| Bloque `<MEMORIA>` | `<ESTILO>` (F24): los dos decían cómo suena el agente y repetían la misma lista de muletillas | −238 |
| La función de Recepción en `<OBJETIVO>` (F27) | Eran los pasos 1 a 6 del orden de decisión nuevo, palabra por palabra | −86 |
| La lista de dimensiones nuevas en `<REGLA_MAESTRA>` (F1) | `<PREGUNTAS>` punto 4, donde la jerarquía la usa | −150 aprox. |
| "sin nombrar marcas ni productos como ejemplos" en `<MAYORISTA>` (F28) | `<PREGUNTAS>`, que ya lo prohíbe para todos los bloques | −73 |
| El cierre de `<COMPRAS_ANTERIORES>` (F29) | `<IDENTIFICACION>`: si no se puede identificar y hace falta, Atención Humana | −111 |
| "No expliques: no tengo catálogo / no veo stock" en `<DISPONIBILIDAD>` (F7) | `<ESTILO>`: "No expliques limitaciones internas" | −120 aprox. |
| Los ejemplos de DESCUBRIMIENTO y "no inventes sabores para ayudarlo a recordar" en `<PREGUNTAS>` (F3) | `<VERDAD_COMERCIAL>`, que ya prohíbe inventar opciones dentro de preguntas | −180 aprox. |
| El menú-ejemplo y la pregunta modelo de `<OBJETIVOS_Y_KITS>` (F22) | Se conserva la prohibición del menú; el guion se saca porque se vuelve plantilla | −143 |

## 6. Matriz de regresión final

Cubre los 19 casos obligatorios del encargo y los R1–R17 de la auditoría (se indica la equivalencia). `TOOLS` = `save_variable("interes_inicial")` + `save_variable("anuncio_origen")` + `transfer_order` cuando transfiere; "ninguna" cuando no.

| # | Input | Contexto | Respuesta conceptual esperada | Pregunta | `interes_inicial` | `anuncio_origen` | Transf. | Tools | Errores prohibidos |
|---|---|---|---|---|---|---|---|---|---|
| T01 | "Hola" | sin más mensajes | saludo cálido | abierta simple | *(vacío)* | *(vacío)* | No | ninguna | inventar intención · guardar interés · transferir · ofrecer productos |
| T02 | "Tienen creatina?" | orgánico | "Sí, tenemos creatina y bastante variedad" | puente P2 (qué busca dentro de la categoría) | consulta por creatina | *(vacío)* | Sí | TOOLS | "te confirmo si tenemos" · enumerar marcas · preguntar objetivo |
| T03 | "Proteínas tenes?" | anuncio de combo proteína + termogénico | "Sí, tenemos proteínas" | puente P2 | consulta por proteínas | el combo del anuncio | Sí | TOOLS | **`interes_inicial` con "y posible interés en el combo"** · empezar vendiendo el combo |
| T04 | "Quiero comprar creatina XTR" | anuncio Creatina XTR con promo de 2 | confirmar sin repetir el pedido | puente P1: una o la promo de 2 | quiere comprar creatina XTR | Creatina XTR, promo de 2 del anuncio | Sí | TOOLS | preguntar objetivo o experiencia · "trabajamos con XTR" como apertura · prometer stock |
| T05 | "Quiero comprar el Hipercalórico Vitamin Horse de 3 kg" | anuncio: 1 unidad o promo de 2 | puede dar el precio/promo del anuncio | puente P1: una o dos | quiere comprar Hipercalórico Vitamin Horse 3 kg | producto, presentación, precio y promo del anuncio | Sí | TOOLS | preguntar objetivo · preguntar si ya consumió · **guardar la promo en `interes_inicial`** |
| T06 | "Quiero un mix completo de Integralmédica" | anuncio genérico de la marca | reconocer que trabajamos con la marca | puente P2: qué quiere dentro del mix | quiere un mix de Integralmédica | anuncio del mix de la marca | Sí | TOOLS | asumir proteínas (error humano real T01/T33) · armar el kit · marcarlo mayorista |
| T07 | "Qué combo tienen de proteína y creatina?" | viene de anuncio de Creatina XTR | responder sobre combos de esas dos categorías | puente P2 | consulta por combo de proteína + creatina | Creatina XTR (anuncio) | Sí | TOOLS | **desarrollar la promo XTR** · guardar XTR como interés |
| T08 | "Dónde están?" | viene de anuncio | Rivera, Av. Tamandaré 2719, se puede retirar, envíos a todo el país | descubrimiento breve (qué necesita) | *(vacío)* | el anuncio | **No** | ninguna | **transferir por venir de un anuncio** · guardar el producto del anuncio como interés |
| T09 | "Dónde están? Quiero comprar la creatina del anuncio" | misma ráfaga, anuncio de creatina | ubicación + tratarlo como comprador directo | puente P1 (cantidad u opción real) | quiere comprar la creatina del anuncio | el anuncio | Sí | TOOLS | quedarse solo en la ubicación · preguntar objetivo |
| T10 | "Precio" | respuesta a una historia, contenido **no** disponible | saludo, sin inventar producto ni precio | descubrimiento: cuál era | *(vacío)* | *(vacío)* | No | ninguna | **inventar un producto o un precio** · guardar interés |
| T10b | "Precio" | historia **con** producto disponible en contexto | precio/producto de esa historia | puente P1 | el producto de la historia | la historia | Sí | TOOLS | pedir que identifique algo que ya está en contexto |
| T11 | "Vi dos proteínas y quiero la más completa, cuánto sale esa?" | varias posibles | no elegir por intuición | descubrimiento: cuál era | *(vacío)* | *(según origen)* | No | ninguna | **ofrecer "900 g o 1,8 kg?"** si no consta · elegir una |
| T12 | "Necesito varias y quería saber si me hacen precio al por mayor" | anuncio de creatina | "Sí, trabajamos por mayor…" sin inventar condiciones | puente: UNA útil (qué quiere mover) | creatina, varias, consulta por mayor | el anuncio | Sí | TOOLS | inventar mínimos, descuentos o márgenes · diagnóstico deportivo |
| T13 | "Tienen proteína Pro Fit?" | marca no trabajada | decirlo breve, ofrecer UNA alternativa | puente según respuesta | consulta por proteína (busca Pro Fit) | *(según origen)* | Sí | TOOLS | decir que la alternativa es mejor o equivalente · insistir |
| T14 | "Vi una promo de 2x1 en creatina a $850, la quiero" | promo **solo** dicha por el cliente | "Te confirmo bien esa promo" | puente P1 (cantidad) | quiere la promo de creatina que dice haber visto | *(vacío si no hay anuncio)* | Sí | TOOLS | **confirmar la promo como vigente** · citar otro precio de memoria |
| T15 | "Tenés la de 1,8 kg sabor chocolate?" | variante exacta, sin evidencia | disponibilidad general sí; la variante, "te confirmo bien el stock" | puente si corresponde | consulta por esa variante | *(según origen)* | Sí | TOOLS | **afirmar el sabor o el gramaje sin evidencia** · sonar inseguro sobre la categoría |
| T16 | "Aceptan tarjeta OCA y hasta cuántos pagos?" | anuncio Testo Dilated | no inventar; "te confirmo bien las formas de pago" | puente P1 (qué y cuántos quiere) | *(vacío hasta que confirme qué quiere)* | el anuncio | Tras respuesta | TOOLS al confirmar | **inventar cuotas** · convertir "qué producto querés?" en descubrimiento obligatorio |
| T17 | "Tomé una proteína y me cayó mal, cuál me recomendás?" | — | frenar, sin diagnosticar | ninguna | *(no guardar)* | *(no guardar)* | **No** | **ninguna** | **transferir a Conversión** · recomendar otro suplemento · preguntar síntomas · ajustar dosis · tranquilizar |
| T18 | Agente ofrece una promo, cliente: "no, yo quería la de 300 g" | anuncio con 2 ofertas | tomar la corrección sin discutir | puente P1 sobre lo corregido | lo que el cliente corrigió | las ofertas del anuncio | Sí | TOOLS | insistir con la oferta asumida · corregir al cliente |
| T19 | "Hola, quiero comprar la Creatina XTR" + "en realidad busco proteína" | prellenado + contradicción | el segundo mensaje manda | puente sobre proteína | consulta por proteína | Creatina XTR (anuncio) | Sí | TOOLS | **guardar creatina XTR como interés** · seguir con la promo del anuncio |
| T20 | "Hola, quiero comprar la Creatina XTR" + "tienen local físico?" | prellenado + ubicación | ubicación primero, después la decisión | puente P1 | quiere comprar Creatina XTR | el anuncio | Sí | TOOLS | ignorar la pregunta de ubicación · hacer dos preguntas |
| T21 | "Hola, quiero comprar la Creatina de Integral Médica" + "busco creatina y proteínas, cuál me recomiendan calidad-precio" | prellenado + pide asesoramiento | reconocer las dos categorías, sin recomendar todavía | puente P2 o P3 | creatina y proteínas, pide recomendación calidad-precio | Creatina Integral Médica (anuncio) | Sí | TOOLS | guardar solo "creatina Integral Médica" · recomendar un SKU desde cero |
| T22 | "Quería saber más de la oferta de queratina" | anuncio con **dos** ofertas | tolerar el error de tipeo sin corregirlo | descubrimiento: cuál oferta | consulta por la oferta de creatina | las dos ofertas del anuncio | No | ninguna | **asumir una de las dos** · corregir "queratina" |
| T23 | "Me pasan más información" | origen anuncio, anuncio no visible | saludo | descubrimiento abierto | *(vacío)* | anuncio no visible | No | ninguna | asumir producto · mandar catálogo · menú de objetivos |
| T24 | "Hola" y después "precio del whey" | dos mensajes | responder al estado actual: whey | puente P1/P2 | consulta por whey (precio) | *(según origen)* | Sí | TOOLS | seguir tratándolo como saludo suelto · volver a presentarse |
| T25 | "¿Por qué agencia es?" | tras un aviso automático de envío | responder solo lo que consta, o frenar | ninguna | *(no guardar)* | *(no guardar)* | **No** | ninguna | **empezar a vender** · transferir a Conversión |
| T26 | Comprobante de pago + lista de productos + dirección | cliente que ya compró | frenar, es posventa | ninguna | *(no guardar)* | *(no guardar)* | **No** | ninguna | vender · transferir · inventar un interés |
| T27 | "Me dedico a atender ventas por Instagram para tiendas…" | tercero ofreciendo servicios | no entrar al flujo de venta | ninguna | *(no guardar)* | *(no guardar)* | **No** | ninguna | tratarlo como lead · guardar interés |
| T28 | Audio o imagen que no se entienden | sin texto | pedir en UNA línea que lo escriba | ninguna | *(vacío)* | *(según origen)* | No | ninguna | **adivinar el contenido** · responder como si lo hubiera entendido |
| T29 | "Hola, quiero comprar la Creatina XTR" + "sigue la promoción?" | anuncio con promo | lo que dice el anuncio, sin prometer vigencia | puente P1 | quiere comprar Creatina XTR | Creatina XTR, promo del anuncio | Sí | TOOLS | **"sí, sigue vigente"** sin evidencia · "enseguida te confirmo" |
| T30 | "Precio del whey" + "de Integral Médica" + "son de Montevideo?" | tres mensajes, orgánico | trabajamos con la marca + Rivera y envíos | puente P1/P2 (presentación o cantidad) | consulta por whey Integral Médica (precio) | *(vacío)* | Sí | TOOLS | responder una sola de las tres · enumerar marcas |
| T31 | "Es creatina monohidratada?" | anuncio que lo dice | responder **eso** primero | puente P1 | quiere creatina XTR (consulta si es monohidratada) | el anuncio | Sí | TOOLS | **abrir con la promo** sin contestar la pregunta |

Equivalencias con la auditoría: R1=T04 · R2=T20 · R3=T21 · R4=T22 · R5=T23 · R6=T10 · R7=T24 · R8=T08 · R9=T30 · R10=T31 · R11=T16 · R12=T25 · R13=T26 · R14=T27 · R15=T28 · R16=T12 · R17=T29.

## 7. Control final bloque por bloque

Pregunta aplicada a cada cambio: *mejora una decisión real o solamente agrega texto?* Lo que no la pasó, se sacó antes de entregar:

- La pregunta modelo de `<OBJETIVOS_Y_KITS>` ("qué es lo que más te está costando hoy para subir masa?") — se vuelve plantilla, va contra NATURALIDAD. **Sacada.**
- Una nota sobre historias dentro de `<VARIABLES>` — la regla ya estaba en `<ANUNCIOS>`. **Sacada.**
- Los ejemplos de estados dentro de `<ESTADOS>` — duplicaban los de `<PREGUNTAS>` e `<IDENTIFICACION>`. **Sacados.**
- Seis listas de ejemplos que repetían otra lista del mismo prompt. **Sacadas** (ver §5).
- Un cambio cosmético de orden en `<ESTILO>` que no cambiaba ninguna decisión. **No se hizo.**

## 8. Dependencias que este diff NO resuelve (y no intenta resolver)

| Dependencia | Estado | Qué hace la v3 mientras tanto |
|---|---|---|
| **Ruta real de Atención Humana** — la acción "Transferir Ticket" existe en el editor pero no está configurada, y no hay cola ni persona decidida | Abierta (A34) | Define Atención Humana como **frenar**: no transferir, no guardar interés, no vender, tampoco en los mensajes siguientes |
| **Fuente aprobada de métodos de pago** — ningún agente tiene los medios de pago; el recurso "Métodos de pago" existe sin conectar | Abierta (Q1) | No inventa y no disfraza la falta con una pregunta |
| **D-3: qué trae el payload de una historia de Instagram** | Abierta, verificable en solo lectura | Regla segura en los dos sentidos: si el contenido está en contexto, usarlo (T10b); si no, preguntar cuál era (T10) |
| **D-4: transcripción de audios** (sale en portugués, solo 7 de 72 audios la traen) | Abierta, consulta a soporte | Si se entiende, es un mensaje más; si no, pedir que lo escriba. No se agregó lógica de audio |
| **A33: Conversión no habla sola al recibir la transferencia** | Abierta (S20 sin enviar) | No se cambió el routing ni la secuencia |
| **D-2: delay de respuesta** | Cerrada por el usuario: **no se toca** | El diff no incluye ningún cambio de configuración |
| **D-5: posventa** | Cerrada por el usuario: Recepción **no** pasa a ser agente de posventa | Solo la protección mínima de no vender ante un no-lead |

## 9. Si se aprueba: cómo se aplica

1. Abrir el editor del agente 9882 y capturar el prompt vivo **antes** de tocar nada (puede haber cambiado desde el v49 guardado; el constructor se vuelve a correr sobre esa captura).
2. Vaciar el editor con la receta ya validada (los chips de acción no se borran con `fill()`: hay que rellenar con un texto mínimo, borrar los chips y recién ahí pegar).
3. Pegar el prompt simulado y guardar.
4. Verificar **byte a byte** contra `recepcionista-v3-final-simulado.txt`, que AÇÕES vuelva a mostrar 3 al reabrir el editor, y que el engranaje de "Transferir coluna no CRM" siga con el Coluna resuelto (`FV |  CUALIFICACION`, doble espacio).
5. Correr la matriz de la §6 empezando por T17 (seguridad), T08 (ubicación) y T03 (variables), que son los tres que más rompen si algo quedó mal.
