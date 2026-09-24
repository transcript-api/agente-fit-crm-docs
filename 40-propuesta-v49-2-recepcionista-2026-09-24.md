# 40 — v49.2 del Recepcionista + 8 frases al guardrail (2026-09-24), REVISIÓN 3 — NADA aplicado

> ⛔ **No se tocó el CRM.** Es un diff para revisar. Vivo sigue la v49.1 (15.349 caracteres, `c753bc8a`) con los 6 guardrails.
> **Revisión 3.** Reemplaza a la revisión 2 (commit `51c1f62`) y a la primera versión (`0a7f196`). **Respecto de la revisión 2 cambian únicamente P1 (pregunta puente) y C1 (`CLIENTE_DIRECTO`)**, según el pedido del usuario. Todo lo demás es idéntico, y está comprobado reemplazando solo esos dos textos en la revisión 2 y comparando con esta. La base es la misma limpieza de duplicaciones más tres correcciones semánticas con evidencia, y las 6 frases sin cobertura pasan al guardrail (opción C).
> **Artefactos** `artefactos/build-recepcionista-v49-2.js` (aborta si la base no es la v49.1 exacta o si un ANTES no es único), `recepcionista-v49-2-simulado.txt`, `…cambios.json` y `…guardrails-propuestos.json`.

## 1. La base es la v49.1 viva

Releída del servidor hoy 19:01 UTC. **15.349 caracteres, `c753bc8a`, idéntica byte a byte** a `recepcionista-v49-1-simulado.txt`. Los 6 guardrails con contenido idéntico al de siempre, gpt-5.1, FUNCTION_CALL y delay 28.

## 2. Resumen

| | v49.1 (viva) | v49.2 rev. 3 |
|---|---:|---:|
| Caracteres | 15349 | **15854** (+505, +3.3 %) |
| Hash | `c753bc8a` | `606fb3bf` |
| Bloques | 27 | 27, **ninguno nuevo**, misma lista y orden |
| Etiquetas | 27/27 | 27/27, sin huérfanas |
| Acciones | 3 | 3, **idénticas** |
| `transfer_order` | 1 exacto | 1 exacto, cola byte a byte igual |
| **Núcleo comercial** (8 bloques) | 36.9 % | **41.5 %** |
| Bloques mecánicos (`IDENTIDAD`, `MEMORIA`, `ESTILO`) | 13.3 % | 10.2 % |

Para ubicarlo, el v49 original tenía 14.663 caracteres, así que esta versión queda **+1191** (+8.1 %) sobre él. El núcleo comercial son `REGLA_MAESTRA`, `VERDAD_COMERCIAL`, `ANUNCIOS`, `PREGUNTAS`, `IDENTIFICACION`, `CLIENTE_DIRECTO`, `VARIABLES` y `TRANSFERENCIA`.

Cambio por bloque.

| Bloque | Antes | Después | Δ |
|---|---:|---:|---:|
| `IDENTIDAD` | 1026 | 962 | -64 |
| `PREGUNTAS` | 1055 | 1291 | +236 |
| `CLIENTE_DIRECTO` | 451 | 836 | +385 |
| `VARIABLES` | 855 | 1156 | +301 |
| `MEMORIA` | 218 | 137 | -81 |
| `ESTILO` | 791 | 519 | -272 |

Las 3 acciones, sin cambio.

```
save_variable("interes_inicial",true,"TEXT","")
save_variable("anuncio_origen",true,"TEXT","")
transfer_order("FV| FUNIL DE VENTAS ","FV |  CUALIFICACION")
```

## 3. Qué pediste y cómo quedó

| Tu punto | Resultado |
|---|---|
| 1 Las 6 frases sin cobertura pasan al guardrail | Hecho. Se suman las 6 más las 2 anteriores, **8 frases**. Cobertura de lo que sale del prompt, 22 de 22 |
| 2 Aceptar D6 | Hecho (D5 en esta numeración) |
| 3 No aceptar D2 | **Hecho, ese cambio se descarta.** La línea `Nunca: … "trabajamos con creatina" "tengo" "tengo sí" "tenemos sí" "la manejamos" "manejamos ese producto"` queda exactamente como en la v49.1 |
| 4 `VARIABLES`, un solo contraejemplo | Hecho (V1) |
| 5 Pregunta puente (P1) | **Reescrita con tu redacción**, sin duplicar lo que `PREGUNTAS` ya trae. Ver la sección 7 |
| 6 Precedencia en `CLIENTE_DIRECTO` (C1) | **Reescrita con tu redacción**. Ya no excluye el precio ni la promo del anuncio |
| 7 Fillers sin ampliar | Sin cambio, siguen solo al inicio del mensaje |
| 8 Lo demás | Sin bloques nuevos, sin reorganizar, 3 acciones y `transfer_order` idénticos |

## 3b. Qué cambió respecto de la revisión 2

**P1, `PREGUNTAS`, la definición de la puente**

Revisión 2

```
La pregunta debe cambiar una decisión real del siguiente paso, es decir qué hay que buscar, recomendar o ejecutar.
```

Revisión 3

```
La pregunta puente debe aportar contexto útil para el siguiente paso. Priorizá una pregunta cuya respuesta cambie qué hay que buscar, recomendar o ejecutar. Si no existe una decisión inmediata que cambiar, hacé una pregunta breve que mejore el contexto sin abrir un tema nuevo.
```

**C1, `CLIENTE_DIRECTO`, la precedencia**

Revisión 2

```
Cuando ya quiere comprar un producto suficientemente identificado, este bloque tiene prioridad sobre MARCAS, LOGISTICA, OBJETIVOS_Y_KITS y el contenido promocional de ANUNCIOS. No abras esos temas salvo que el cliente los pregunte o sean indispensables para ejecutar lo que pidió.
```

Revisión 3

```
Cuando ya quiere comprar un producto suficientemente identificado, CLIENTE_DIRECTO tiene prioridad para decidir qué información mostrar. De MARCAS, LOGISTICA, OBJETIVOS_Y_KITS y ANUNCIOS usá solamente lo necesario para resolver la compra actual. No desarrolles esos temas como dimensiones adicionales salvo que el cliente los pregunte o sean indispensables para ejecutar lo que pidió.
```

La revisión 3 tiene **15854 caracteres** contra 15.587 de la revisión 2 (+267), hash `606fb3bf`.

## 4. Diff exacto contra la v49.1 (8 cambios)

### D1 — `<IDENTIDAD>` — delegado a guardrail

**ANTES** (140 caracteres)

```
Nunca hagas parecer que otra persona continúa. NO digas: "te pasan" "te ayudan" "te confirman" "otro asesor" "el equipo" "un compañero" Usá:
```

**DESPUÉS** (76 caracteres)

```
Nunca hagas parecer que otra persona continúa ni menciones "el equipo". Usá:
```

te pasan, te ayudan, te confirman, otro asesor, un compañero. Se conserva "el equipo" porque no se puede bloquear como frase sin falsos positivos.

### D2 — `<MEMORIA>` — delegado a guardrail

**ANTES** (120 caracteres)

```
Usá contexto silenciosamente. NO digas: "quedó claro" "ya veo que querés" "entendí que" "anoté" "te recuerdo" No repitas
```

**DESPUÉS** (39 caracteres)

```
Usá el contexto en silencio. No repitas
```

quedó claro, ya veo que, entendí que, anoté, te recuerdo. La regla conceptual "usá el contexto en silencio" permanece.

### D3 — `<ESTILO>` — delegado a guardrail

**ANTES** (169 caracteres)

```
No uses filler como: "Quedó claro que" "Ya veo que" "Mientras tanto" "Te dejo una pregunta cortita" "Te pregunto algo rápido" "Para afinar" "Así lo afinamos" "Afinemos"
```

**DESPUÉS** (0 caracteres)

```
(se elimina)
```

Las 8 frases de la oración quedan cubiertas por el guardrail de lenguaje de bot. 5 ya estaban (Quedó claro que, Ya veo que, Te pregunto algo rápido, Para afinar, Así lo afinamos) y 3 se suman (Mientras tanto, Te dejo una pregunta cortita, Afinemos).

### D4 — `<ESTILO>` — delegado a guardrail

**ANTES** (68 caracteres)

```
No valides automáticamente con: Perfecto Genial Buenísimo Excelente
```

**DESPUÉS** (0 caracteres)

```
(se elimina)
```

Lo cubre el guardrail Fillers de apertura, que solo actúa al inicio del mensaje (decisión del usuario, no se amplía).

### D5 — `<ESTILO>` — duplicado

**ANTES** (70 caracteres)

```
No repitas el mensaje del cliente. No expliques limitaciones internas.
```

**DESPUÉS** (35 caracteres)

```
No expliques limitaciones internas.
```

Duplicado exacto de la frase que sigue en MEMORIA.

### V1 — `<VARIABLES>` — corrección semántica

**ANTES** (43 caracteres)

```
No guardes opciones que todavía no eligió.
```

**DESPUÉS** (343 caracteres)

```
No guardes opciones que todavía no eligió. Si dice que quiere comprar un producto y llega desde un anuncio con promo, guardá solamente esa intención sobre el producto, sin "con promo del anuncio" ni el precio, la cantidad promocional o las condiciones del anuncio, hasta que el cliente las mencione, elija o confirme. Eso va en anuncio_origen.
```

Evidencia: en el test del Hipercalórico guardó "Quiere comprar Hipercalórico Vitamin Horse 3KG con promo del anuncio de Instagram" con la regla abstracta ya escrita. Es el único contraejemplo, el del fallo real.

### P1 — `<PREGUNTAS>` — corrección semántica

**ANTES** (41 caracteres)

```
Debe aportar algo útil al siguiente paso.
```

**DESPUÉS** (277 caracteres)

```
La pregunta puente debe aportar contexto útil para el siguiente paso. Priorizá una pregunta cuya respuesta cambie qué hay que buscar, recomendar o ejecutar. Si no existe una decisión inmediata que cambiar, hacé una pregunta breve que mejore el contexto sin abrir un tema nuevo.
```

Decisión real primero, contexto útil como alternativa, y la puente sigue siendo obligatoria. La cuarta oración pedida ("nunca preguntes algo irrelevante solamente para activar Conversión") NO se repite porque PREGUNTAS ya la trae textual al final de la puente: "Nunca inventes una pregunta solamente para activar Conversión."

### C1 — `<CLIENTE_DIRECTO>` — corrección semántica

**ANTES** (36 caracteres)

```
Resolvé solamente lo indispensable.
```

**DESPUÉS** (420 caracteres)

```
Resolvé solamente lo indispensable. Cuando ya quiere comprar un producto suficientemente identificado, CLIENTE_DIRECTO tiene prioridad para decidir qué información mostrar. De MARCAS, LOGISTICA, OBJETIVOS_Y_KITS y ANUNCIOS usá solamente lo necesario para resolver la compra actual. No desarrolles esos temas como dimensiones adicionales salvo que el cliente los pregunte o sean indispensables para ejecutar lo que pidió.
```

Evidencia: el test del Hipercalórico abrió "Trabajamos con Vitamin Horse" y "Despachamos por DAC" sin que nadie lo pidiera. Ahora la precedencia no excluye el precio ni la promo del anuncio cuando hacen falta para decidir la compra actual, como la cantidad.

## 5. Guardrails, frases finales

### `No sonar a bot ni prometer de mas` — 28 → 36 frases (acción sin cambio: regenerar 2 veces y corregir como último recurso)

- te asesoramos
- te ayudamos
- te asesoremos
- te pasan
- te ayudan
- te confirman
- otro asesor
- un compañero
- te paso con
- te reservo
- te lo reservo
- ya te digo
- enseguida te paso
- ahora mismo te confirmo
- dame un segundo
- te paso una pregunta
- te pregunto algo
- para afinar
- asi lo seguimos
- asi lo afinamos
- quedo claro que
- ya veo que
- entendi que
- para avanzarlo bien
- como ya queres comprar
- te separo
- te lo separo
- para orientarte bien
- te hago una sola consulta  ← **NUEVA**
- para avanzar ya  ← **NUEVA**
- quedó claro  ← **NUEVA**
- anoté  ← **NUEVA**
- te recuerdo  ← **NUEVA**
- mientras tanto  ← **NUEVA**
- te dejo una pregunta cortita  ← **NUEVA**
- afinemos  ← **NUEVA**

### `Fillers de apertura` — sin cambio (solo al inicio del mensaje, corregir automáticamente)

perfecto, genial, buenisimo, excelente, dale perfecto

Los otros **4 guardrails** (`No mandar mensajes vacios`, `No volver a presentarse`, `No filtrar placeholders ni texto interno`, `No filtrar etiquetas de media`) **quedan idénticos**. En total, 5 de los 6 sin ninguna modificación. Verificado por contenido, ya que el backend regenera los ids en cada guardado.

La frase `quedo claro que`, que ya estaba, queda **redundante** con la nueva `quedó claro` (la contiene). No la toqué para no modificar frases existentes, y no molesta.

## 6. Falsos positivos de las frases nuevas

El matcher ignora mayúsculas y acentos pero **no respeta límites de palabra**, así que evalué cada frase contra vocabulario real. **Corpus** 1.785 mensajes de texto de las 82 conversaciones de la auditoría (1.010 del equipo y 775 de clientes, sin audios ni imágenes) más el propio prompt. Como control, el mismo análisis encuentra cientos de coincidencias con frases comunes (`gracias` 106, `promo` 69, `envío` 60), o sea que el corpus y el método detectan cuando hay algo.

| Frase (como la ve el matcher) | Coincidencias en el corpus | Dentro de una palabra más larga |
|---|---:|---|
| `te hago una sola consulta` | 0 | ninguna |
| `para avanzar ya` | 0 | ninguna |
| `quedo claro` | 0 | ninguna |
| `anote` | 0 | ninguna |
| `te recuerdo` | 0 | ninguna |
| `mientras tanto` | 0 | ninguna |
| `te dejo una pregunta cortita` | 0 | ninguna |
| `afinemos` | 0 | ninguna |

**Cero falsos positivos medidos.** Quedan tres riesgos teóricos que el corpus no puede descartar del todo.

- **`anote`** aparece dentro de `manotear`, palabra rara en una venta. El resto de sus formas (`anotes`, `anoten`, `anotemos`) son del mismo verbo que el agente tampoco debe decir.
- **`te recuerdo`** también bloquearía un recordatorio legítimo como "te recuerdo que retirás en Av. Tamandaré". Ya estaba prohibido en el v49, así que no es un comportamiento nuevo, pero ahora lo hace cumplir una máquina.
- **`mientras tanto`** es una locución normal del español. Se bloquea igual que antes en el prompt, y en una venta por WhatsApp casi nunca hace falta.

**Efecto de fondo a tener en cuenta.** Con 36 frases y acción "regenerar 2 veces", cada disparo cuesta una llamada más al modelo y suma latencia. En los traces el envío ya tarda entre 15 y 21 segundos. Y si tras los 2 intentos el modelo insiste, "corregir" borra solo la frase, lo que a mitad de oración puede dejar un texto raro. Es un caso límite, no algo esperable.

## 7. P1 y C1, cómo quedaron

**P1.** Integré tu redacción en la definición de la puente, y **omití solo la última oración** ("nunca preguntes algo irrelevante solamente para activar Conversión"), porque `PREGUNTAS` ya la trae textual al final de la puente ("Nunca inventes una pregunta solamente para activar Conversión."). Repetirla era duplicar. El resultado en contexto.

```
PUENTE Usalo cuando YA existe contexto suficiente. La pregunta puente debe aportar contexto útil para el siguiente paso. Priorizá una pregunta cuya respuesta cambie qué hay que buscar, recomendar o ejecutar. Si no existe una decisión inmediata que cambiar, hacé una pregunta breve que mejore el contexto sin abrir un tema nuevo. Después: guardar contexto transferir inmediatamente a FV|CUALIFICACION NO esperar la respuesta desde Recepción Nunca inventes una pregunta solamente para activar Conversión.
```

Queda la puente obligatoria (sigue seguida de "guardar contexto, transferir inmediatamente"), con decisión real primero, contexto útil como alternativa y nunca una pregunta arbitraria.

**Una tensión que queda y que no toqué.** La primera línea de `PREGUNTAS` sigue diciendo "Antes de preguntar: Qué cambia según la respuesta? Si no cambia nada importante, no preguntes." Convive con la nueva alternativa de la puente ("si no existe una decisión inmediata, hacé una pregunta breve"). Las dos hablan de casos distintos, una en general y la otra en la puente, y la específica debería ganar. Pero un modelo puede leer la primera y omitir la puente. **No hay evidencia de que pase**, porque en todos los tests de la v49.1 preguntó la puente. Si aparece, la corrección es agregar "salvo la pregunta puente" a esa primera línea. No lo hice porque pediste no cambiar nada más.

**C1.** Tu redacción, palabra por palabra. Ahora no excluye el precio ni la promo del anuncio. Con el Hipercalórico permite "Está a $1.290 una unidad o $1.990 llevando dos. Cuántas querés llevar?", porque eso hace falta para decidir la compra actual, y sigue frenando "Trabajamos con Vitamin Horse" y "Despachamos por DAC", que son dimensiones que nadie abrió.

## 8. Lo que este diff sigue sin resolver

- **V1 es un solo caso probado.** Sale de un único test. La regla es concreta y usa el fallo real, pero no hay forma de saber sin probarla si el modelo la respeta. Es lo primero que hay que mirar tras aplicar.
- **La tensión de `PREGUNTAS`** que se describe arriba.
- **C1 depende de un juicio del modelo.** "Lo necesario para resolver la compra actual" y "dimensión adicional" no son reglas mecánicas. Es la formulación más precisa que permite usar la promo, pero deja un margen de interpretación.
- **El efecto sigue siendo una apuesta.** El núcleo pesa 41.5 % y las reglas que fallaron tienen texto propio, pero que el modelo las priorice depende de él.

## 9. Si se autoriza, cómo se aplica

1. Capturar el estado vivo y confirmar que sigue la v49.1 (`c753bc8a`) con sus 6 guardrails.
2. Editar el guardrail `No sonar a bot ni prometer de mas`, sumar las 8 frases y guardar.
3. Vaciar el editor con Ctrl+A y **Backspace**, pegar `recepcionista-v49-2-simulado.txt` y comprobar en el formulario largo y hash antes de guardar. Si el formulario no toma el texto, abrir "Ver alterações".
4. "Guardar cambios", recargar y comparar **byte a byte**. Verificar AÇÕES = 3, las dos `save_variable` y el binding del `transfer_order` (Pipeline 23843, Coluna 111195).
5. Verificar que los otros 5 guardrails, gpt-5.1, FUNCTION_CALL y delay 28 no cambiaron, comparando por contenido y no por id.
6. No correr tests.
