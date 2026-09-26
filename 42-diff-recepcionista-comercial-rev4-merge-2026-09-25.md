# 42 — Rev4 (FUSIÓN) del Recepcionista Comercial 10005: candidato y diff (2026-09-25) — NADA aplicado

> ⚠️ **SUPERADO POR LA FUSIÓN QUIRÚRGICA (2026-09-25).** Este candidato "Rev4" era una fusión **aditiva** (pegaba bloques encima del vivo). El usuario pidió una fusión quirúrgica, con un único árbol de decisión, sin duplicar reglas y con los tests fuera del prompt. Ver `artefactos/recepcionista-comercial-release-candidato-2026-09-25.txt` y `artefactos/recepcionista-comercial-tests-regresion-2026-09-25.md`. Este archivo queda como antecedente y su matriz de casos dorados se reutilizó en la suite.
>
> ⛔ **No se escribió nada en RM System.** Este documento y el artefacto `artefactos/recepcionista-comercial-propuesta-rev4-merge-2026-09-25.txt` son un candidato para revisar. El prompt vivo del 10005 sigue siendo el de las 16:30 UTC del 2026-09-25.
> **Por qué existe.** Al sincronizar el repo y auditar el 10005 apareció que el CRM vivo tenía una **cuarta versión del prompt**, posterior al último commit, que no coincide ni con la Rev3 de git ni con el prompt canónico del handoff maestro. Se decidió **fusionar** en vez de reemplazar (Opción A): el vivo pasa a ser la base y solo se incorpora lo que le falta del handoff. Ver [[41-propuesta-recepcionista-comercial-clasico-2026-09-24]] (Rev3, superada).

## 1. Fuente base y resultado

| | Prompt vivo (base) | Rev4 candidato |
|---|---:|---:|
| Caracteres | 21656 | **23641** (+1985, +9.2 %) |
| SHA256 | `27583800fce2f232c84f09cc4995fe0daecec0af5eea61db5429e66386e9748b` | `999ad5d4906841598ddac63b0a7049db000a4c96b8ea3bb216f728ac877d1bfa` |
| Bloques (backreference) | 29 | 29, **ninguno nuevo ni quitado** |
| Acciones serializadas al final | 3 | 3, **sin cambio** |
| Referencias obsoletas a `FV|CUALIFICACION` / `Conversión` | 7 apariciones en 6 lugares | **0** |
| Núcleo comercial (bloques críticos + reglas) | 51.6 % | 52.3 % |

Normalización de hash usada en este documento y en los artefactos nuevos: **UTF-8, saltos de línea tal cual quedan en el CRM (LF, sin CRLF), sin BOM, sin newline extra**. Es la misma que arrojó el servidor, así que el SHA256 del archivo local se puede comparar directo contra el prompt persistido.

**Ojo con los saltos de línea al comparar.** En Windows, Git puede convertir los archivos a CRLF al hacer checkout (aparece el aviso "LF will be replaced by CRLF"). El servidor guarda LF. Para comparar contra el CRM hay que normalizar CRLF a LF antes de calcular el SHA256, si no dan hashes distintos con contenido idéntico. Esto puede explicar parte de la discrepancia de hash de la Rev3, pero no toda: tras normalizar, su hash tampoco coincidía con el declarado.

Las 3 acciones, sin ningún cambio (cola del prompt idéntica a la viva).

```
save_variable("interes_inicial",true,"TEXT","")
save_variable("anuncio_origen",true,"TEXT","")
transfer_order("Pipeline CL |  COMERCIAL","CL | EN CONVERSACION")
```

## 2. Método

Constructor `artefactos/build-recepcionista-comercial-rev4.js`. Parte del prompt vivo, **aborta si su SHA256 no es el capturado**, y aplica solo ediciones exactas donde cada texto a reemplazar debe aparecer **una y solo una vez**. Nunca reescribe un bloque entero. Generó 12 cambios, todos dentro de bloques ya existentes.

## 3. CHANGED — referencias obsoletas corregidas (6)

El prompt vivo venía de una copia literal del Recepcionista de test 9882 y todavía nombraba su pipeline y a un agente de Conversión que **no existe en la rama CL**. La acción técnica ya apuntaba bien a `CL`, pero el texto decía otra cosa. Encontré 4 en el barrido inicial y **2 más que se me habían pasado**, detectadas por una verificación automática sobre el texto final, no a ojo.

### F1 — `<PREGUNTAS>`

**ANTES**

```
Después:
guardar contexto
transferir inmediatamente a FV|CUALIFICACION
NO esperar la respuesta desde Recepción

Nunca inventes una pregunta solamente para activar Conversión.
```

**DESPUÉS**

```
Después:
guardar contexto
transferir inmediatamente a CL|EN CONVERSACION
NO esperar la respuesta desde Recepción

Nunca inventes una pregunta solamente para activar la atención comercial humana.
```

**Fuente** el barrido de referencias obsoletas pedido en el punto 3 de la decisión. **Motivo** El texto decía "FV|CUALIFICACION" y "activar Conversión" — restos de cuando este prompt era una copia literal del Recepcionista de test (9882). El destino real de este agente es CL|EN CONVERSACION y no existe ningún agente de Conversión en esta rama. **Riesgo** Bajo. El chip de transfer_order ya apunta técnicamente a CL, así que esto corrige lo que el modelo LEE, no lo que el CRM ejecuta.

### F2 — `<MAYORISTA>`

**ANTES**

```
Después guardá contexto y transferí a FV|CUALIFICACION.
```

**DESPUÉS**

```
Después guardá contexto y transferí a CL|EN CONVERSACION.
```

**Fuente** el barrido de referencias obsoletas pedido en el punto 3 de la decisión. **Motivo** Mismo residuo de la copia original del 9882. **Riesgo** Bajo, mismo caso que F1.

### F3 — `<COMPRAS_ANTERIORES>`

**ANTES**

```
Si acepta algo parecido:
puede avanzar a Conversión.
```

**DESPUÉS**

```
Si acepta algo parecido:
puede avanzar a atención comercial humana.
```

**Fuente** el barrido de referencias obsoletas pedido en el punto 3 de la decisión. **Motivo** No existe "Conversión" en la rama CL; la continuidad después de Recepción es siempre humana en CL|EN CONVERSACION. **Riesgo** Bajo.

### F4 — `<TRANSFERENCIA>`

**ANTES**

```
<TRANSFERENCIA>

A FV|CUALIFICACION cuando:
```

**DESPUÉS**

```
<TRANSFERENCIA>

A CL|EN CONVERSACION cuando:
```

**Fuente** el barrido de referencias obsoletas pedido en el punto 3 de la decisión. **Motivo** El encabezado del bloque completo seguía nombrando la pipeline de test. **Riesgo** Bajo.

### F5 — `<CLIENTE_DIRECTO>`

**ANTES**

```
actualizá interes_inicial con la cantidad confirmada
conservá anuncio_origen
transferí a FV|CUALIFICACION
```

**DESPUÉS**

```
actualizá interes_inicial con la cantidad confirmada
conservá anuncio_origen
transferí a CL|EN CONVERSACION
```

**Fuente** el barrido de referencias obsoletas pedido en el punto 3 de la decisión. **Motivo** Faltaba en el barrido inicial: el ejemplo trabajado del Hipercalórico (el mismo que corrigió INTEGRIDAD_DE_PRECIOS) todavía cerraba con la pipeline de test. **Riesgo** Bajo.

### F6 — `<OBJETIVOS_Y_KITS>`

**ANTES**

```
Recepción no elige un producto concreto.
Conversión lo hace.
```

**DESPUÉS**

```
Recepción no elige un producto concreto exacto: eso lo resuelve la atención comercial humana en CL|EN CONVERSACION.
```

**Fuente** el barrido de referencias obsoletas pedido en el punto 3 de la decisión. **Motivo** Mismo residuo: no existe un agente de "Conversión" en la rama CL. **Riesgo** Bajo.

## 4. ADDED — incorporado del handoff maestro (6)

Solo se agregó lo que el vivo **realmente no tenía**. Cada cambio es aditivo (no reemplaza una regla existente que ya funcione).

### A1 — `<IDENTIFICACION>`

**ANTES**

```
"Quiero la proteína DUX que elegí y necesito precio"

no alcanza si todavía no sabés cuál proteína DUX es.

</IDENTIFICACION>
```

**DESPUÉS**

```
"Quiero la proteína DUX que elegí y necesito precio"

no alcanza si todavía no sabés cuál proteína DUX es.

Antes de preguntar, distinguí si la incertidumbre es del PRODUCTO (no sabemos cuál es) o de un ATRIBUTO del producto (sabemos cuál es, pero falta precio, stock, sabor u otro dato). Si el producto ya está identificado, no vuelvas a preguntar cuál es solamente porque falta un atributo — resolvé ese atributo con lo que tengas confirmado, o decí que lo confirmás.

Ejemplo:
"Cuánto sale Testo Dilated?"
Testo Dilated ya identifica el producto. Falta el precio, no el producto. No preguntes de qué marca es ni qué producto buscaba.

</IDENTIFICACION>
```

**Fuente** handoff maestro. **Motivo** El vivo no distingue "no sabemos qué producto es" de "sabemos el producto pero falta un dato". El handoff trae esta distinción con Testo Dilated como caso demostrado; no existía nada equivalente en el vivo. **Riesgo** Bajo. Es aditivo, no reemplaza ninguna regla existente.

### A2 — `<MARCAS>`

**ANTES**

```
Si pide una marca que no trabajamos:
decí brevemente que por el momento no estamos trabajando con esa marca.

Podés ofrecer UNA marca trabajada como alternativa.
```

**DESPUÉS**

```
Si pide una marca que no trabajamos (por ejemplo Growth):
decí brevemente que por el momento no estamos trabajando con esa marca. Ejemplo: "Con Growth por el momento no estamos trabajando."

Si todavía no sabés qué producto buscaba, preguntá eso antes de ofrecer una alternativa.

Podés ofrecer UNA marca trabajada como alternativa, solamente si ya sabés qué producto/categoría buscaba.
```

**Fuente** handoff maestro. **Motivo** El vivo ya tenía la regla general de marca no trabajada, pero sin ejemplo concreto ni el orden correcto (primero saber qué buscaba, después ofrecer alternativa). El handoff trae Growth como ejemplo demostrado y ese orden explícito. **Riesgo** Bajo. No contradice la regla existente, la precisa.

### A3 — `<LOGISTICA>`

**ANTES**

```
Si pregunta ubicación:
respondé ubicación.
```

**DESPUÉS**

```
Si pregunta ubicación (de dónde son / dónde están):
"Somos de Rivera, estamos en Av. Tamandaré 2719 y hacemos envíos a todo el país."
No agregues automáticamente retiro en tienda, DAC o demora si no las preguntó. Ubicación sola no significa que quiere comprar: si todavía no sabés qué necesita, podés seguir con "Qué estabas buscando?" y esperar.
```

**Fuente** handoff maestro. **Motivo** El vivo decía "respondé ubicación" sin el guion aprobado. El handoff recupera la frase exacta ya validada en otra sesión y agrega que no hay que descargar toda la logística de una vez. **Riesgo** Bajo. Reemplaza una instrucción genérica por la respuesta ya aprobada.

### A4 — `<OBJETIVOS_Y_KITS>`

**ANTES**

```
Para aumento de masa podés usar:
"Contame qué es lo que más te está costando hoy para subir masa?"
```

**DESPUÉS**

```
Para bajar de peso podés usar:
"Sí, para bajar de peso tenemos buenas opciones y también trabajamos con kits pensados para ese objetivo. Qué es lo que más te está costando ahora para conseguirlo?"

Para aumento de masa podés usar:
"Contame qué es lo que más te está costando hoy para subir masa?"
```

**Fuente** handoff maestro. **Motivo** El vivo solo tenía el patrón de "aumentar masa". El handoff trae el mismo patrón para "bajar de peso", ya aprobado en otra sesión, sin agregar un menú de opciones. **Riesgo** Bajo. Mismo patrón que el que ya existe, aplicado a otro objetivo.

### A5 — `<ANUNCIOS>`

**ANTES**

```
No hace falta volver a dudar de esos datos dentro de esa conversación.
```

**DESPUÉS**

```
No hace falta volver a dudar de esos datos dentro de esa conversación.

El anuncio se usa en silencio. No digas "vi que venís del anuncio", "veo que estás buscando", "según el anuncio que viste" ni nada que narre que sabés de dónde vino, salvo que el cliente pregunte explícitamente por eso. Usar el dato del anuncio para responder bien no es lo mismo que anunciar que lo usaste.
```

**Fuente** handoff maestro. **Motivo** El vivo usa el anuncio como fuente pero no dice explícitamente que no hay que narrar su origen. Es una regla semántica, no léxica: por eso va en el prompt como política y NO se agrega como guardrail global (una frase como "veo que estás buscando" puede ser válida si surge del mensaje actual, no del anuncio). **Riesgo** Medio-bajo. Es una regla de criterio, no mecánica, así que su cumplimiento depende del modelo. Por eso queda en el prompt y no en un guardrail léxico, tal como se decidió.

### A6 — `<CLIENTE_DIRECTO>`

**ANTES**

```
No repitas toda la descripción del producto.
```

**DESPUÉS**

```
No repitas toda la descripción del producto. Si el producto y la marca ya quedaron claros por lo que dijo el cliente, no abras diciendo "Trabajamos con [marca]" — eso ya es obvio y no aporta nada. Responder un precio o un dato que el cliente pregunta directamente NO es esta clase de repetición, aunque ese dato ya estuviera en el anuncio: eso sí hay que responderlo.
```

**Fuente** handoff maestro. **Motivo** El vivo ya decía "no expliques beneficios si no los pidió" pero no cubría el caso específico de repetir la marca obvia (el error real visto con "Trabajamos con Vitamin Horse"), ni la excepción de que preguntar un precio sí hay que responderlo aunque sea repetido. **Riesgo** Bajo. Es una aclaración, no cambia el comportamiento ya correcto de INTEGRIDAD_DE_PRECIOS.

## 5. REMOVED

**Nada.** No se eliminó ni una línea del vivo salvo el texto puntual reemplazado en F1 a F6. Esto responde al punto 7 de la decisión (no simplificar por gusto).

## 6. PRESERVED — lo vivo que se conserva íntegro

- `<REGLAS_CRITICAS>` completo (saludo obligatorio, dinero inmutable, combo explícito sin calcular, comprador directo con menos fricción).
- `<ORDEN_DE_DECISION>` completo (9 pasos).
- `<INTEGRIDAD_DE_PRECIOS>` completo, incluido el ejemplo trabajado de "los dos a $1.990".
- `<PRUEBAS_CRITICAS>` completo (3 casos incrustados). Se conserva porque hoy protege una regresión real de precio, con la salvedad de deuda técnica de la sección 9.
- `<BIENVENIDA>`, `<VERDAD_COMERCIAL>`, `<RESPONDER_PRIMERO>`, `<DISPONIBILIDAD>`, `<PAGOS>`, `<PRODUCTO_AMBIGUO>`, `<RESPUESTAS_AMBIGUAS>`, `<SEGURIDAD>`, `<URGENCIA>`, `<VARIABLES>`, `<MEMORIA>`, `<ESTILO>`, `<CONTROL_FINAL>`.
- La acción técnica `transfer_order` ya configurada a `CL | COMERCIAL` → `CL | EN CONVERSACION`.
- El **analizador Clásico de 3.393 caracteres, sin tocar** (decisión explícita, para aislar el cambio del prompt principal).
- Los **6 guardrails, sin tocar**.

## 7. Reglas del handoff que NO se incorporaron y por qué

| Regla del handoff | Decisión | Motivo |
|---|---|---|
| `<DECISION_DE_RESPUESTA>` y `<PRIORIDAD>` | No se agregan | Las cubre `ORDEN_DE_DECISION` + `REGLAS_CRITICAS` del vivo. Duplicarlas sería pisar reglas que ya funcionan de otra forma |
| `<ANUNCIO_SILENCIOSO>` como bloque nuevo | Solo se incorporó su regla clave dentro de `<ANUNCIOS>` (A5) | El vivo ya trata el anuncio como contexto. Faltaba solo la prohibición de narrar el origen |
| `<NO_REPETIR>` como bloque nuevo | Solo su regla de marca obvia y su excepción de precio, dentro de `<CLIENTE_DIRECTO>` (A6) | El resto ya está en `MEMORIA`, `CLIENTE_DIRECTO` y `REGLAS_CRITICAS` |
| `<COMBOS>`, `<LINKS>`, `<PRECIO>` | No se agregan | Combo y precio los resuelve `INTEGRIDAD_DE_PRECIOS`, y links ya está en `ANUNCIOS` |
| `<SALIDA>` | No se agrega | Su contenido ya está en `<TRANSFERENCIA>` corregido (F4) |
| Las 3 frases `venís del anuncio`, `vi que querés`, `veo que estás buscando` como guardrail | **No se agregan** | Decisión explícita. El guardrail es léxico y "veo que estás buscando una proteína" puede ser válido si surge del mensaje actual. Por eso la regla vive como política en el prompt (A5) |

## 8. CONFLICT RESOLUTION e inconsistencias encontradas

| # | Hallazgo | Resolución |
|---|---|---|
| 1 | 7 apariciones (en 6 lugares) de `FV|CUALIFICACION` / `Conversión` en un prompt que transfiere a `CL` | **Corregidas** (F1 a F6) |
| 2 | **Duplicación observada, NO eliminada.** `REGLAS_CRITICAS` puntos 1 a 4 se solapan con `BIENVENIDA`, `INTEGRIDAD_DE_PRECIOS` y `CLIENTE_DIRECTO` | Es redundancia en capas (resumen crítico arriba y detalle abajo), un patrón habitual para que el modelo no lo pierda. No hay evidencia de que sacarla sea seguro, así que se deja como **deuda técnica** para evaluar con tests |
| 3 | El ejemplo de `<BIENVENIDA>` repite el producto ("El Hipercalórico Vitamin Horse de 3 kg está a…") y el de `<CLIENTE_DIRECTO>` lo omite ("Está a $1.290…") | **Sin tocar.** No es contradicción con A6, que solo habla de repetir la *marca*. Se deja como caso para observar en los tests |
| 4 | `<SEGURIDAD>` y `<TRANSFERENCIA>` dicen "Atención Humana" como si fuera un destino aparte, mientras el analizador manda todo a `CL|EN CONVERSACION` | **Sin tocar.** En la rama CL la atención humana *es* esa etapa, así que el sentido coincide aunque el nombre no |
| 5 | `<ESTILO>` y `<MEMORIA>` repiten frases que ya cubre el guardrail de lenguaje de bot (31 frases) | **Sin tocar.** Se aprobó delegar esto en otra rama (9882), pero acá se pidió no simplificar por gusto |
| 6 | El nombre del pipeline en la acción serializada es `"Pipeline CL |  COMERCIAL"`, con la palabra "Pipeline" dentro del nombre y doble espacio | **Observación, fuera de alcance.** Lo determina el binding real del selector, no el texto. No se toca |
| 7 | Los 3 hashes de 10005 que circulaban (`ae41f1e0` baseline, `6de1b171` declarado para Rev3, `c07c680b` real de Rev3) no coinciden con el vivo (`27583800`) | **Registrado como histórico.** El vivo es la nueva base |

## 9. Deuda técnica registrada (no se actúa ahora)

- **`PRUEBAS_CRITICAS` dentro del prompt.** Los casos de prueba idealmente viven fuera, en tests dorados. Más adelante se puede comprobar si sacarlos del runtime ahorra tokens sin perder el comportamiento. **No se mueven ahora** porque hoy protegen una regresión de precio real.
- **Drift detector.** El CRM vivo divergió de git sin que nadie lo notara hasta que se auditó a mano. Propuesta, sin implementar: un script que lea el prompt, el analizador y los guardrails del CRM, calcule SHA256 con la normalización de la sección 1 y los compare contra los artefactos canónicos committeados. Resultado `MATCH` o `DRIFT DETECTED`, corrido al inicio de cada sesión.

## 10. Casos de regresión dorados (propuestos, no ejecutados)

Comprueban que la fusión no rompe nada. Cada uno debe correrse contra la Rev4 aplicada, en ese orden.

| # | Entrada y contexto | Comportamiento esperado | `interes_inicial` / transferencia | Errores prohibidos |
|---|---|---|---|---|
| 1 | Primer mensaje "Hola, quiero comprar el Hipercalorico Vitamin Horse de 3KG", anuncio real con 1 u $1.290 y 2 u $1.990. Luego "quiero llevar los dos" | Saludo obligatorio + "$1.290 la unidad o $1.990 llevando dos. Cuántos querés llevar?". Después "Los dos te quedan en $1.990 en total." | Producto sin "con promo del anuncio". Tras la cantidad, actualiza la cantidad y transfiere | `$990`, `$2.580`, `$1.900`, "Trabajamos con Vitamin Horse", preguntar envío o pago |
| 2 | "Cuánto sale Testo Dilated?" con y sin anuncio | Con anuncio responde el precio del anuncio. Sin fuente, "Te confirmo bien ese precio." | Producto Testo Dilated. Puede transferir | "Qué producto buscabas?", "de qué marca?", inventar un precio |
| 3 | "Tienen Growth?" y luego "creatina" | "Con Growth por el momento no estamos trabajando." y pregunta qué producto buscaba. Con la categoría, ofrece UNA marca trabajada | No transfiere hasta saber el producto | Ofrecer marcas sin saber la categoría, decir que otra es equivalente o mejor, insistir |
| 4 | "Cuánto sale la creatina XTR?" sin fuente de precio | "Te confirmo bien ese precio." | Marca más categoría. Transfiere | Inventar un precio, preguntar la marca o el producto |
| 5 | "Dónde están?" | "Somos de Rivera, estamos en Av. Tamandaré 2719 y hacemos envíos a todo el país." y puede seguir "Qué estabas buscando?" | **No** guarda interés. **No** transfiere | Agregar retiro, DAC o demora sin que lo pidan, transferir por la sola ubicación |
| 6 | "Quiero comprar por mayor para revender en mi local" | Confirma que trabajamos por mayor sin inventar mínimos ni descuentos, una pregunta abierta sin nombrar marcas | Intención mayorista. Transfiere a `CL|EN CONVERSACION` | Nombrar `FV|CUALIFICACION`, inventar condiciones, diagnóstico deportivo |
| 7 | "Quiero lo mismo que compré la otra vez" | Revisa el historial en silencio. Si no aparece, pide un detalle mínimo | Recompra | Reiniciar el diagnóstico, mencionar "Conversión" |
| 8 | "Quiero comprar la creatina XTR" | Mínima fricción. Una pregunta operativa solo si hay cantidad u opción real de promo | Producto más intención de compra. Transfiere | Objetivo, experiencia, beneficios, cross-sell, envío por defecto |
| 9 | "Tomé la proteína y me dio mareo" | Respuesta breve, no vende, no diagnostica, no ajusta dosis | Sin variables comerciales nuevas. Transfiere a `CL|EN CONVERSACION` | Decir que es normal, recomendar otro suplemento, seguir vendiendo |
| 10 | Anuncio de Creatina XTR y el cliente escribe "En realidad quiero proteína" | Sigue con proteína | `interes_inicial` es proteína. `anuncio_origen` conserva la creatina | Seguir con la promo XTR |
| 11 | "Quiero comprar el Hipercalórico" con anuncio de promo | Responde sin volcar la promo en la variable | `interes_inicial` sin precio ni "con promo del anuncio" (eso va en `anuncio_origen`) | Mezclar anuncio y cliente |
| 12 | Cualquier caso que transfiera | La acción va a `CL | COMERCIAL` → `CL | EN CONVERSACION` y el texto de la respuesta nunca nombra `FV|CUALIFICACION` ni un agente de Conversión | Transferencia correcta | Cualquier mención de la pipeline de test |
| 13 | Cualquier respuesta | No aparecen "el equipo", "un compañero", "te pasan", "otro asesor" | — | Hacer parecer que otra persona continúa |
| 14 | "Tenés la de 1,8 kg sabor chocolate?" sin evidencia | "Sí, tenemos proteínas." como categoría, y para la variante "Te confirmo bien el stock." | Consulta por esa variante | Afirmar sabor, gramaje o stock exacto |
| 15 (extra) | Cualquier entrada con anuncio y mensaje prellenado | No narra el origen | — | "Vi que venís del anuncio", "veo que estás buscando", "según el anuncio" |

## 11. Regresiones potenciales

- **A5 depende del criterio del modelo.** Prohibir narrar el origen es una regla semántica y no hay red de seguridad léxica. Es el cambio con más riesgo de no cumplirse, y por eso los casos 10 y 15 lo miran directo.
- **A6 y la excepción de precio.** Si el modelo lee "no repitas" con demasiada amplitud, podría dejar de responder un precio que sí se preguntó. Lo cubre la excepción explícita, y el caso 2 lo prueba.
- **+9,2 % de tamaño.** Sobre un prompt ya largo (21.656 caracteres). No es un problema medido, pero es la tendencia contraria a la que se buscaba en el 9882.

## 12. Snapshot histórico del vivo (propuesta, sin commit)

La captura del prompt vivo antes de la Rev4 existe hoy solo como copia local en `artefactos/_backup-vivo-20260925/`. Propuesta para dejarla como registro permanente, **a committear solo con aprobación**.

```
artefactos/10005-live-before-rev4-20260925/
  prompt.txt        prompt principal, sha256 27583800fce2f232c84f09cc4995fe0daecec0af5eea61db5429e66386e9748b
  analyzer.txt      reglas del analizador, 3.393 caracteres
  guardrails.json   los 6 guardrails con su configuración
  config.json       modelo, delay, modo, estrategia
  MANIFEST.json     timestamp 2026-09-25T18:08:26Z + los sha256 de cada archivo
```

Verificado que ninguno de esos archivos contiene la API key: solo se guardaron los campos de configuración, nunca el campo `apiKey` del agente.

## 13. Qué falta antes de poder aplicar

1. Tu revisión de este diff.
2. Aprobar o ajustar A1 a A6 y F1 a F6.
3. Decidir si se compromete el snapshot histórico.
4. Correr los 15 casos dorados contra la Rev4 aplicada, no antes.
5. Recién ahí el orden de ejecución del pedido original: aplicar el prompt, recargar y comparar byte a byte, verificar las 3 acciones y el binding, y pasar a la automatización 6052 (entrada por `CL|LEAD NUEVO`) y a la prueba de que el agente deja de responder tras `EN CONVERSACION`.

## PARA CHATGPT

**Estado.** Candidato Rev4 listo, **nada escrito en RM System**. Base = prompt vivo del 10005 (16:30 UTC de hoy, SHA256 `27583800…`), no la Rev3 ni el handoff.

**Números.** 21656 → 23641 caracteres (+1985, +9.2 %). 29 bloques, ninguno nuevo. 3 acciones y analizador y 6 guardrails **sin tocar**. SHA256 candidato `999ad5d4906841598ddac63b0a7049db000a4c96b8ea3bb216f728ac877d1bfa`.

**Preservado del vivo.** `REGLAS_CRITICAS`, `ORDEN_DE_DECISION`, `INTEGRIDAD_DE_PRECIOS`, `PRUEBAS_CRITICAS`, saludo obligatorio, combo sin recalcular, comprador directo con menos fricción, la transferencia técnica a CL.

**Incorporado del handoff (6).** A1 entidad vs atributo con Testo Dilated como producto. A2 Growth como marca no trabajada, con el orden correcto. A3 guion de ubicación exacto. A4 objetivo "bajar de peso". A5 no narrar el origen publicitario, como política del prompt y **no** como guardrail. A6 no repetir la marca obvia, con excepción de precio.

**Corregido (6 lugares, 7 apariciones).** Referencias a `FV|CUALIFICACION` y "Conversión" que contradecían el destino real `CL|EN CONVERSACION`. Cuatro lugares los vi al principio y **dos se me pasaron**, detectadas por verificación automática sobre el texto final.

**Decisiones respetadas.** No se tocó el analizador. No se agregaron las 3 frases de anuncio al guardrail. `PRUEBAS_CRITICAS` se conserva con la deuda técnica anotada. No se eliminó nada por gusto.

**Riesgos que pido que mires.** A5 es semántica, sin red léxica. La redundancia entre `REGLAS_CRITICAS` y los bloques que la elaboran quedó como deuda, sin eliminar. Y el ejemplo de `BIENVENIDA` repite el producto mientras el de `CLIENTE_DIRECTO` no.

**Pendiente de tu decisión.** Aprobar A1-A6 y F1-F6, decidir si se commitea el snapshot histórico `10005-live-before-rev4-20260925`, y confirmar que los 15 casos dorados de la sección 10 son los que querés antes de aplicar.
