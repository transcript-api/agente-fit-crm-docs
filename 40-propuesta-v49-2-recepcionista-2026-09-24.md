# 40 — Propuesta v49.2 del Recepcionista + 2 frases al guardrail (2026-09-24) — NADA aplicado

> ⛔ **No se tocó el CRM.** Es un diff para revisar. Vivo sigue la v49.1 (15.349 caracteres, `c753bc8a`) con los 6 guardrails.
> **Qué es.** Separar responsabilidades. Los guardrails se encargan de los errores mecánicos y léxicos, y el prompt se queda con razonamiento comercial, verdad y routing. **No agrega ninguna regla ni ejemplo ni bloque.** Solo saca lo que un guardrail ya garantiza, y suma dos frases al guardrail de lenguaje de bot.
> **Artefactos** `artefactos/build-recepcionista-v49-2.js` (constructor, aborta si la base no es la v49.1 exacta o si un ANTES no es único), `artefactos/recepcionista-v49-2-simulado.txt` (prompt), `…cambios.json` (ANTES/DESPUÉS y cobertura) y `…guardrails-propuestos.json` (los 6 guardrails con las 2 frases nuevas).

## 1. La base es la v49.1 viva

Leída del servidor hoy 18:32 UTC: **15.349 caracteres, hash `c753bc8a`, idéntica byte a byte a `recepcionista-v49-1-simulado.txt`**. Config sin cambios (gpt-5.1, FUNCTION_CALL, delay 28) y los 6 guardrails con el contenido de siempre. El agente figura guardado por última vez a las 18:16 UTC y los ids de guardrails van por 316-321, o sea que se guardó varias veces desde mi aplicación de las 15:42, pero sin alterar el prompt ni los guardrails.

## 2. Resumen

| | v49.1 (viva) | v49.2 propuesta |
|---|---:|---:|
| Caracteres | 15349 | **14868** (-481, -3.1 %) |
| Hash | `c753bc8a` | `7d3bd52b` |
| Bloques | 27 | 27, misma lista y orden |
| Etiquetas | 27/27 | 27/27, sin huérfanas |
| Acciones | 3 | 3, **idénticas** |
| `transfer_order` | 1 exacto | 1 exacto, cola byte a byte igual |

Solo cambian tres bloques.

| Bloque | Antes | Después | Δ |
|---|---:|---:|---:|
| `IDENTIDAD` | 1026 | 898 | -128 |
| `MEMORIA` | 218 | 137 | -81 |
| `ESTILO` | 791 | 519 | -272 |

Las 3 acciones, sin cambio.

```
save_variable("interes_inicial",true,"TEXT","")
save_variable("anuncio_origen",true,"TEXT","")
transfer_order("FV| FUNIL DE VENTAS ","FV |  CUALIFICACION")
```

## 3. Diff exacto del prompt (6 cambios)

### D1 — `<IDENTIDAD>`

**ANTES** (140 caracteres)

```
Nunca hagas parecer que otra persona continúa. NO digas: "te pasan" "te ayudan" "te confirman" "otro asesor" "el equipo" "un compañero" Usá:
```

**DESPUÉS** (76 caracteres)

```
Nunca hagas parecer que otra persona continúa ni menciones "el equipo". Usá:
```

**Por qué se puede sacar.** te pasan · te ayudan · te confirman · otro asesor · un compañero

### D2 — `<IDENTIDAD>`

**ANTES** (98 caracteres)

```
"trabajamos con creatina" "tengo" "tengo sí" "tenemos sí" "la manejamos" "manejamos ese producto"
```

**DESPUÉS** (33 caracteres)

```
"trabajamos con creatina" "tengo"
```

**Por qué se puede sacar.** (no delegado: son variantes del mismo error de voz; se compactan a las dos formas que el prompt debe distinguir)

### D3 — `<MEMORIA>`

**ANTES** (120 caracteres)

```
Usá contexto silenciosamente. NO digas: "quedó claro" "ya veo que querés" "entendí que" "anoté" "te recuerdo" No repitas
```

**DESPUÉS** (39 caracteres)

```
Usá el contexto en silencio. No repitas
```

**Por qué se puede sacar.** quedó claro · ya veo que · entendí que

### D4 — `<ESTILO>`

**ANTES** (169 caracteres)

```
No uses filler como: "Quedó claro que" "Ya veo que" "Mientras tanto" "Te dejo una pregunta cortita" "Te pregunto algo rápido" "Para afinar" "Así lo afinamos" "Afinemos"
```

**DESPUÉS** (0 caracteres)

```
(se elimina)
```

**Por qué se puede sacar.** Quedó claro que · Ya veo que · Te pregunto algo rápido · Para afinar · Así lo afinamos

### D5 — `<ESTILO>`

**ANTES** (68 caracteres)

```
No valides automáticamente con: Perfecto Genial Buenísimo Excelente
```

**DESPUÉS** (0 caracteres)

```
(se elimina)
```

**Por qué se puede sacar.** Perfecto · Genial · Buenísimo · Excelente (guardrail Fillers de apertura)

### D6 — `<ESTILO>`

**ANTES** (70 caracteres)

```
No repitas el mensaje del cliente. No expliques limitaciones internas.
```

**DESPUÉS** (35 caracteres)

```
No expliques limitaciones internas.
```

**Por qué se puede sacar.** (duplicado exacto: la regla de no repetir al cliente sigue en MEMORIA)

## 4. Guardrail, solo 2 frases nuevas

En `No sonar a bot ni prometer de mas` pasa de **28** a **30** frases. Se agregan exactamente estas dos, que aparecieron en el último test y son meta lenguaje inequívoco.

- `te hago una sola consulta`
- `para avanzar ya`

No se agrega `aprovechás la promo`, ni logística, ni marcas ni frases comerciales, como pediste. **Los otros 5 guardrails quedan idénticos** (verificado por contenido, ya que el backend regenera los ids en cada guardado). La acción sigue siendo regenerar 2 veces y corregir como último recurso.

## 5. Cobertura, frase por frase

Cada frase que sale del prompt, y qué guardrail la sigue impidiendo. Es el chequeo que hace que sacarla no sea perder la regla.

| Frase que sale | Quién la sigue impidiendo |
|---|---|
| te pasan | No sonar a bot ni prometer de mas → "te pasan" |
| te ayudan | No sonar a bot ni prometer de mas → "te ayudan" |
| te confirman | No sonar a bot ni prometer de mas → "te confirman" |
| otro asesor | No sonar a bot ni prometer de mas → "otro asesor" |
| un compañero | No sonar a bot ni prometer de mas → "un compañero" |
| quedó claro | **NADIE. Queda sin control** |
| ya veo que querés | No sonar a bot ni prometer de mas → "ya veo que" |
| entendí que | No sonar a bot ni prometer de mas → "entendi que" |
| anoté | **NADIE. Queda sin control** |
| te recuerdo | **NADIE. Queda sin control** |
| Quedó claro que | No sonar a bot ni prometer de mas → "quedo claro que" |
| Ya veo que | No sonar a bot ni prometer de mas → "ya veo que" |
| Mientras tanto | **NADIE. Queda sin control** |
| Te dejo una pregunta cortita | **NADIE. Queda sin control** |
| Te pregunto algo rápido | No sonar a bot ni prometer de mas → "te pregunto algo" |
| Para afinar | No sonar a bot ni prometer de mas → "para afinar" |
| Así lo afinamos | No sonar a bot ni prometer de mas → "asi lo afinamos" |
| Afinemos | **NADIE. Queda sin control** |
| Perfecto | Fillers de apertura (solo al inicio del mensaje) → "perfecto" |
| Genial | Fillers de apertura (solo al inicio del mensaje) → "genial" |
| Buenísimo | Fillers de apertura (solo al inicio del mensaje) → "buenisimo" |
| Excelente | Fillers de apertura (solo al inicio del mensaje) → "excelente" |

**Seis frases quedan sin guardrail** y hay que decidir qué hacer con ellas. Son `quedó claro` suelta (el guardrail solo frena `quedó claro que`), `anoté`, `te recuerdo`, `Mientras tanto`, `Te dejo una pregunta cortita` y `Afinemos`. Todas son muletillas de relleno, no errores de negocio, y las tres primeras siguen cubiertas en concepto por "Usá el contexto en silencio", que permanece. Tres caminos, y no elegí por vos. **(a)** Aceptarlo, si en los tests que corriste no aparecieron (no tengo evidencia propia de con qué frecuencia las dice). **(b)** Dejar una línea corta en `<ESTILO>` con esas seis. **(c)** Sumarlas al guardrail, cosa que excede las dos frases que autorizaste.

**Otra salvedad.** `Perfecto`, `Genial`, `Buenísimo` y `Excelente` solo se controlan **al inicio del mensaje**, que es como está configurado el guardrail de fillers. Si el modelo los mete a mitad de frase, ya no hay ninguna regla. Hoy el prompt sí los prohibía en cualquier lugar.

## 6. Qué se queda en el prompt (reglas conceptuales)

Intactos los bloques `REGLA_MAESTRA`, `VERDAD_COMERCIAL`, `ANUNCIOS`, `PREGUNTAS`, `IDENTIFICACION`, `CLIENTE_DIRECTO`, `VARIABLES`, `TRANSFERENCIA`, `SEGURIDAD`, `LOGISTICA`, `MARCAS`, `PRECIO_Y_PROMOS` y `BIENVENIDA`, más las 3 acciones. Dentro de los tres bloques tocados se conserva lo siguiente.

- Santiago como única identidad y "otra persona no continúa" (`IDENTIDAD`).
- `tenemos` para categoría o producto y `trabajamos con` para marca, con sus prohibiciones de gramática (`IDENTIDAD`).
- "Usá el contexto en silencio", no repetir lo que dijo el cliente, demostrar comprensión avanzando (`MEMORIA`).
- WhatsApp breve, una pregunta principal, sin Markdown ni listas ni signos de apertura ni emojis al inicio, y las jergas prohibidas (`ESTILO`).
- No agregar atributos positivos que el cliente no pidió y no explicar limitaciones internas (`ESTILO`).

## 7. Las 8 reglas que querés con más peso

Todas existen ya en la v49.1 y siguen exactamente igual. El peso relativo sube porque desaparece el texto que competía con ellas, no porque se les agregue nada.

| # | Regla | Dónde vive |
|---|---|---|
| 1 | El mensaje actual manda | `REGLA_MAESTRA` ("Qué quiere resolver ahora?") y `ANUNCIOS` ("el mensaje actual del cliente manda") |
| 2 | No introducir una dimensión que el cliente no abrió | `REGLA_MAESTRA` ("NO agregues una dimensión nueva… si no cambia una decisión real") |
| 3 | Comprador directo, mínima fricción | `CLIENTE_DIRECTO` ("DEJÁ DE VENDERLE… reducir fricción") |
| 4 | Anuncio es contexto, no intención | `ANUNCIOS` |
| 5 | `interes_inicial` solo hechos del cliente | `VARIABLES` |
| 6 | `anuncio_origen` es información del anuncio | `VARIABLES` |
| 7 | Pregunta puente solo si cambia el siguiente paso | `PREGUNTAS` ("Qué cambia según la respuesta?" antes de preguntar, y la puente "Debe aportar algo útil al siguiente paso") |
| 8 | Transferir inmediatamente | `PREGUNTAS` (puente) y `TRANSFERENCIA` |

El peso relativo de los 8 bloques que llevan esas reglas pasa de **36,8 %** a **38,0 %** del prompt, y el de los tres bloques mecánicos baja de **13,2 %** a **10,4 %**.

## 8. Lo que este diff NO resuelve, dicho sin adornos

- **El efecto es chico.** Son 481 caracteres, un 3,1 %, y el núcleo comercial sube 1,2 puntos. Es una limpieza sana y reversible, pero no espero que por sí sola cambie cómo decide GPT-5.1. Si el modelo ignora una regla que está escrita, sacar 481 caracteres de estilo probablemente no lo arregle.
- **No toca la contaminación de `interes_inicial`.** Según lo que describís del test del Hipercalórico, el modelo guardó `Quiere comprar… con promo del anuncio` **aunque la regla de C3 ya estaba escrita**. Eso confirma tu lectura de que ningún guardrail de respuesta lo arregla, porque no es texto para el cliente. Y confirma que el riesgo que declaré en C3 (sin ejemplos) se dio. Como pediste no tocar `VARIABLES`, queda **abierto**. Cuando quieras es una línea con un solo ejemplo, ahora con evidencia real de que la regla sola no alcanzó.
- **La regla 7 tiene una redacción más débil que lo que pedís.** El prompt dice "Debe aportar algo útil al siguiente paso", y vos querés "algo que cambie el siguiente paso". `PREGUNTAS` figura entre los bloques a mantener intactos, así que no lo toqué. Lo dejo señalado.
- **Que dijo `Despachamos por DAC…` sin que lo pidieran** ya lo cubre `REGLA_MAESTRA`, que incluye `envío` en su lista de dimensiones innecesarias. El prompt ya tiene la regla, que es distinto de que el modelo la aplique. Este diff no agrega nada ahí.
- **D6 va un paso más allá de lo pedido.** Sacar `No repitas el mensaje del cliente` de `ESTILO` no estaba en tu lista. Es un duplicado exacto de la frase que sigue en `MEMORIA`, y lo marqué aparte para que lo puedas rechazar solo.
- **D2 compacta y no elimina.** Las cuatro prohibiciones originales del v49 (`trabajamos XTR`, `XTR se maneja`, etc.) se quedan. Solo salen las variantes que agregué en la v49.1 (`tengo sí`, `tenemos sí`, `la manejamos`, `manejamos ese producto`), que son el mismo error de voz que `tengo`.

## 9. Si se autoriza, cómo se aplica

1. Capturar el estado vivo y confirmar que sigue la v49.1 (`c753bc8a`) con sus 6 guardrails.
2. Editar el guardrail `No sonar a bot ni prometer de mas`, sumar las 2 frases y guardar.
3. Vaciar el editor con Ctrl+A y **Backspace** (Delete deja vivo el chip de `transfer_order`), pegar `recepcionista-v49-2-simulado.txt` y comprobar en el formulario largo y hash antes de guardar.
4. "Guardar cambios", recargar y comparar **byte a byte**. Verificar AÇÕES = 3, las dos `save_variable` y el binding del `transfer_order` (Pipeline 23843, Coluna 111195).
5. Verificar que los otros 5 guardrails, gpt-5.1, FUNCTION_CALL y delay 28 no cambiaron, comparando por contenido y no por id.
6. No correr tests.
