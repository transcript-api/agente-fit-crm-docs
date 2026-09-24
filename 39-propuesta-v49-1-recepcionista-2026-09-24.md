# 39 — v49.1 del Recepcionista (2026-09-24) — ✅ APLICADA EN PRODUCCIÓN

> ✅ **APLICADA el 2026-09-24 15:42 UTC y verificada.** El prompt vivo del agente 9882 es ahora la v49.1 (15.349 caracteres, hash `c753bc8a`), **idéntico byte a byte** a `artefactos/recepcionista-v49-1-simulado.txt`. Verificaciones en la §7. Los 6 guardrails y la configuración no cambiaron.
> **Estrategia (decisión del usuario, 2026-09-24):** abandonar las reescrituras (v3 de 19.683 y v4 de 16.790) y volver al **v49 histórico** con solo correcciones ya confirmadas. Sin bloques nuevos, sin ejemplos nuevos, sin duplicar lo que ya cubren los guardrails.
> **Artefactos** `artefactos/build-recepcionista-v49-1.js` (constructor, aborta si la base no es el v49 exacto o si un ANTES no es único), `artefactos/recepcionista-v49-1-simulado.txt` (prompt propuesto), `artefactos/recepcionista-prompt-v49-2026-09-23.txt` (el v49 limpio, solo texto).

## 1. La base es el v49 correcto

| Fuente | Caracteres | Hash |
|---|---:|---|
| Snapshot **versión 49 del servidor** (id 17482, guardado 2026-09-23 17:05 UTC) | 14.663 | `4a66ec38` |
| Captura local `prompt-9882-now.json` | 14.663 | `4a66ec38` |
| Comparación estricta servidor === local | idénticos | — |

El servidor conserva ese snapshot entre sus 10 versiones de historial (hoy van de la 47 a la 56), así que también se puede volver a él desde la propia interfaz del CRM.

## 2. Qué del pedido el v49 ya cumplía (sin cambio)

| Punto | Estado | Evidencia en el v49 |
|---|---|---|
| 1 SALUDO | **Ya está literal** | `Primer contacto en español: "Buenas Santi, cómo estás? Santiago de Fitness Suplementos por acá, un gusto saludarte."` y `Si no sabés el nombre: "Buenas, cómo estás? Santiago de Fitness Suplementos por acá, un gusto saludarte."`. Las cadenas `cómo va?` y `Soy Santiago` no aparecen en el prompt. |
| 7 NO CONTAMINAR PREGUNTAS | **Ya está** | `No nombres marcas, productos ni ejemplos dentro de una pregunta para ayudar a responder`, `Si la pregunta funciona sin ejemplos, hacela sin ejemplos.`, la variante en `<MAYORISTA>` y `NO le des automáticamente un menú` en `<OBJETIVOS_Y_KITS>` |

Sobre el punto 1, el pedido decía "puede variar naturalmente en casos excepcionales". **No lo agregué**, porque el v49 hoy no da permiso de variar y agregarlo aflojaría una regla que ya se cumple. Si querés esa frase, es una línea más y se suma aparte.

## 3. Resumen

| | v49 | v49.1 propuesta |
|---|---:|---:|
| Caracteres | 14663 | **15349** |
| Delta | — | +686 (+4.7 %) |
| Hash | `4a66ec38` | `c753bc8a` |
| Bloques | 27 | 27 (ninguno nuevo ni quitado) |
| Etiquetas | 27/27 | 27/27, sin huérfanas |
| Acciones | 3 | 3, **idénticas** |
| `transfer_order` | 1 exacto | 1 exacto, **idéntico** |

Las 3 acciones exactas, sin cambio alguno respecto del v49.

```
save_variable("interes_inicial",true,"TEXT","")
save_variable("anuncio_origen",true,"TEXT","")
transfer_order("FV| FUNIL DE VENTAS ","FV |  CUALIFICACION")
```

La cola completa del prompt, desde `transfer_order(` hasta el final, es **byte a byte igual** a la del v49.

## 4. Diff exacto (6 cambios)

### C1 — punto 2 VOZ DE EMPRESA — `<IDENTIDAD>`

**ANTES** (196 caracteres)

```
Cuando hablás de Fitness: "trabajamos con XTR" "trabajamos con DUX" "trabajamos por mayor" "trabajamos con kits" Nunca: "trabajamos XTR" "XTR se maneja" "se trabaja con XTR" "se trabaja con kits"
```

**DESPUÉS** (392 caracteres, +196)

```
Cuando hablás de Fitness usá "trabajamos con XTR" "trabajamos con DUX" para una marca y "tenemos creatina" "tenemos proteínas" para una categoría o producto. También "trabajamos por mayor" "trabajamos con kits" Nunca: "trabajamos XTR" "XTR se maneja" "se trabaja con XTR" "se trabaja con kits" "trabajamos con creatina" "tengo" "tengo sí" "tenemos sí" "la manejamos" "manejamos ese producto"
```

### C2 — punto 3 MARCA CORRECTA — `<MARCAS>`

**ANTES** (12 caracteres)

```
Black School
```

**DESPUÉS** (11 caracteres, -1)

```
Black Skull
```

### C3 — punto 4 VARIABLES (interes_inicial) — `<VARIABLES>`

**ANTES** (65 caracteres)

```
Solamente con información expresada por el cliente o confirmada.
```

**DESPUÉS** (174 caracteres, +109)

```
Solamente con lo que el CLIENTE expresó, eligió, aceptó o confirmó. El anuncio no se copia acá y nunca escribas "posible interés". No guardes opciones que todavía no eligió.
```

### C4 — punto 4 VARIABLES (anuncio_origen) — `<VARIABLES>`

**ANTES** (95 caracteres)

```
Guardar: anuncio_origen solamente cuando exista una referencia real del sistema o del cliente.
```

**DESPUÉS** (164 caracteres, +69)

```
Guardar: anuncio_origen el contexto real del anuncio (producto, presentación, precio, promo) solamente cuando exista una referencia real del sistema o del cliente.
```

### C5 — punto 5 MENSAJE ACTUAL SOBRE ANUNCIO — `<ANUNCIOS>`

**ANTES** (91 caracteres)

```
Si el sistema muestra el contenido REAL de un anuncio, sus datos explícitos pueden usarse.
```

**DESPUÉS** (258 caracteres, +167)

```
El anuncio es contexto, no la intención: el mensaje actual del cliente manda. Si pregunta por otra cosa, respondé eso y no desarrolles la promo del anuncio porque sí. Si el sistema muestra el contenido REAL de un anuncio, sus datos explícitos pueden usarse.
```

### C6 — punto 6 COMPRADOR DIRECTO — `<CLIENTE_DIRECTO>`

**ANTES** (151 caracteres)

```
No repitas su pedido. No hagas cross-sell. No preguntes cómo suele pagar. No preguntes envío o retiro por defecto. Resolvé solamente lo indispensable.
```

**DESPUÉS** (297 caracteres, +146)

```
No repitas su pedido ni expliques beneficios o composición. No hagas cross-sell. No preguntes cómo suele pagar. No preguntes envío o retiro por defecto. Si hay una decisión operativa inmediata (cantidad, opción de la promo del anuncio), preguntá solamente eso. Resolvé solamente lo indispensable.
```

## 5. Cosas que conviene saber antes de autorizar

- **Sin ejemplos en las variables, como pediste.** El v49 no tenía ejemplos y aun así el anuncio se filtró a `interes_inicial` en dos tests de hoy. C3 endurece la **regla** ("no se copia acá", "nunca posible interés", "no guardes opciones que no eligió") pero no agrega ejemplos. Es el punto con más riesgo de repetirse. Si el test lo muestra, la corrección es de una línea con un solo ejemplo, y se decide con evidencia.
- **Los `tenemos` de C1 son formas de la lista de voz**, no ejemplos nuevos, y van en el mismo bloque `<IDENTIDAD>` que ya listaba `trabajamos con`.
- **`manejamos` en `<MAYORISTA>` se queda.** "manejamos precios muy competitivos para reventa" es una frase válida distinta de los `manejamos ese producto` que C1 prohíbe.
- **Los 6 guardrails no se tocan.** Ninguno de los 6 cambios los duplica ni los contradice. Una frase de la lista de bot como `te confirman` sigue prohibida y el v49 ya dice `NO digas: "te confirman"`.
- **La regla de no abusar de los dos puntos no está en el v49** (la traía la v4). No la agregué porque pediste no duplicar estilo. Es lo único de la v4 que quizás quieras rescatar, y son dos líneas.

## 6. Cómo se aplicó (receta ejecutada)

1. Capturar el prompt vivo y confirmar que sigue siendo la v4 (`50c079a8`, 16.790).
2. Vaciar el editor con Ctrl+A y Delete (el `fill()` deja vivo el chip de `transfer_order`) y pegar `recepcionista-v49-1-simulado.txt`.
3. Guardar, recargar y comparar **byte a byte** contra el simulado.
4. Verificar AÇÕES = 3, las dos `save_variable`, y abrir el engranaje del `transfer_order` para confirmar Pipeline id 23843 y Coluna id 111195.
5. Verificar que los 6 guardrails y la configuración (gpt-5.1, FUNCTION_CALL, delay 28) no cambiaron.

## 7. Verificación post-aplicación (2026-09-24, 15:38 a 15:44 UTC)

| Verificación | Resultado |
|---|---|
| Estado previo, antes de escribir | v4 de 16.790 caracteres (`50c079a8`), config y 6 guardrails idénticos al baseline |
| Artefacto antes de guardar | 15.349 caracteres, hash `c753bc8a` (el esperado) |
| Formulario justo antes de guardar | 15.349 y `c753bc8a`. El guardado tenía una guarda que abortaba si no coincidía |
| Prompt guardado, releído del servidor | 15.349 caracteres, hash `c753bc8a` |
| **Comparación byte a byte** contra el simulado | **Idénticos** (`===`) |
| Etiquetas | 27/27, sin huérfanas |
| Acciones al reabrir el editor | **3** (chips y engranajes) |
| `save_variable("interes_inicial")` | TEXT, texto libre, auto |
| `save_variable("anuncio_origen")` | TEXT, texto libre, auto |
| `transfer_order` exacto con doble espacio | 1 sola vez |
| Cola desde `transfer_order(` | Byte a byte igual a la del v49 |
| **Binding real del `transfer_order`** | Pipeline id **23843**, Coluna `FV |  CUALIFICACION` id **111195**, ejecución auto |
| Configuración | Sin cambios: gpt-5.1, mode basic, FUNCTION_CALL, delay **28**, splitMessages, maxTokens 216 |
| 6 guardrails | Contenido **idéntico en los 6** (nombre, tipo, config, acción, fallback). **Los ids cambiaron de 274-279 a 280-285**, ver nota |
| Otros agentes y automatizaciones | No se tocaron |
| Después de verificar | El `updatedAt` del agente sigue en 15:42:11, o sea que las verificaciones no modificaron nada |

**Nota sobre los ids de guardrails.** Cada vez que se pulsa "Guardar cambios" en el agente, el backend recrea los guardrails con ids nuevos y el mismo contenido. Ya había pasado al borrar los dos de prueba (272 y 273 pasaron a 274 en adelante). No es un problema, pero significa que **comparar guardrails por id no sirve**, hay que comparar por nombre y contenido.

**Nota de método.** Esta vez el editor no propagó el texto pegado al formulario por sí solo (la vez anterior sí). Se resolvió abriendo "Ver alterações" (solo un visor de diferencias), tras lo cual el formulario quedó con el valor exacto. Se guardó únicamente después de comprobar en el propio formulario el largo y el hash. Además, esta vez Ctrl+A y Delete dejó vivo el chip de `transfer_order`, y hizo falta Ctrl+A y **Backspace** para eliminarlo.

## 8. Estado, listo para probar

La v49.1 está viva. **No se ejecutaron conversaciones de prueba.** Casos acordados para comparar contra la v4: 1) Integralmédica, 2) Hipercalórico Vitamin Horse, 3) `Proteínas tenes?` desde el anuncio del combo, 4) `Dónde están?` y luego `quiero una creatina`.
