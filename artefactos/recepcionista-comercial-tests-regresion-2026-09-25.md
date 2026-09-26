# Suite de regresión — Recepcionista Comercial 10005 (2026-09-25)

> Esta suite reemplaza al bloque `PRUEBAS_CRITICAS` que vivía dentro del prompt. **Ningún caso se perdió**: los 3 originales están copiados literalmente en la sección 1 y los ejemplos mínimos que enseñan una regla difícil siguen en el prompt, dentro del bloque de cada regla.
> No se ejecutó ninguno todavía. Se corren contra el prompt ya aplicado.

## 1. Casos originales de `PRUEBAS_CRITICAS` (texto literal del prompt vivo del 2026-09-25 16:30 UTC)

```
CASO 1 — PRIMER MENSAJE DIRECTO

Cliente:
"Hola, quiero comprar el Hipercalorico Vitamin Horse de 3KG"

Anuncio real:
1 unidad → $1.290
2 unidades → $1.990

CORRECTO:
"Buenas, cómo estás? Santiago de Fitness Suplementos por acá, un gusto saludarte. Está a $1.290 la unidad o $1.990 llevando dos. Cuántos querés llevar?"

INCORRECTO:
"Está bien, el Hipercalórico..."
"El Hipercalórico está..."
"$1.290 la unidad..."

Motivo:
faltó la bienvenida obligatoria.


CASO 2 — CLIENTE ELIGE DOS

Contexto confirmado:
1 unidad → $1.290
2 unidades → $1.990

Cliente:
"quiero llevar los dos"

CORRECTO:
"Los dos te quedan en $1.990 en total."

Luego:
actualizar interes_inicial
transferir

INCORRECTO:
"990 en total."
"$2.580."
"Preferís retirar o que lo enviemos?"
"Cómo querés pagar?"

Motivo:
el precio total ya estaba explícito y la cantidad ya quedó resuelta.


CASO 3 — PRECIO DICHO SOLO POR CLIENTE

Cliente:
"Vi que estaba a $1.990, sigue?"

Sin anuncio ni fuente confirmada disponible:

CORRECTO:
"Te confirmo bien ese precio."

INCORRECTO:
"Sí, sigue a $1.990."
```

Dónde sigue enseñándose cada regla dentro del prompt, para que la salida del bloque no debilite nada:

| Caso original | Regla | Sigue en el prompt dentro de |
|---|---|---|
| 1 Primer mensaje directo | saludo obligatorio más precio y cantidad | `BIENVENIDA` y `CLIENTE_DIRECTO` (mismo ejemplo del Hipercalórico) |
| 2 Cliente elige dos | copiar el total explícito de $1.990 | `INTEGRIDAD_DE_PRECIOS` (ejemplo trabajado) y `CLIENTE_DIRECTO` |
| 3 Precio dicho solo por el cliente | "Te confirmo bien ese precio." | `INTEGRIDAD_DE_PRECIOS` y `VERDAD_COMERCIAL` |

## 2. Casos dorados de la fusión

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

## 3. Casos nuevos de la fusión quirúrgica

| # | Entrada y contexto | Comportamiento esperado | Errores prohibidos |
|---|---|---|---|
| 16 | "Quiero bajar de peso" | Exactamente el patrón aprobado: "Sí, para bajar de peso tenemos buenas opciones y también trabajamos con kits pensados para ese objetivo. Qué es lo que más te está costando ahora para conseguirlo?" Guarda interés y mueve a `CL|EN CONVERSACION` | "Perfecto, querés bajar de peso", "Entiendo, tu objetivo es…", sembrar hambre, ansiedad, energía o quemar grasa |
| 17 | "Quiero Growth" sin más contexto | "Con Growth por el momento no estamos trabajando." y pregunta qué producto quería | Preguntar si lo vio en un anuncio, si ya lo usó o si quiere repetir. Transferir |
| 18 | "Quiero creatina Growth" | "Con Growth por el momento no estamos trabajando." y ofrece UNA sola marca trabajada | Decir que es equivalente o mejor, inventar stock o presentación, ofrecer varias |
| 19 | "Tienen XTR?" | "Sí, trabajamos con XTR. Estás buscando algún producto puntual de la marca?" No transfiere | Transferir con solo la marca |
| 20 | "Quiero creatina XTR" | Avanza sin decir "trabajamos con XTR". Guarda y mueve a `CL|EN CONVERSACION` | Repetir la marca |
| 21 | "De dónde son?" | Exactamente "Somos de Rivera, estamos en Av. Tamandaré 2719 y hacemos envíos a todo el país." | Sumar retiro en tienda, DAC o 12 a 48 horas sin que lo pregunten. Transferir por ubicación sola |
| 22 | "Cuánto sale?" con precio en el anuncio | Responde el precio | No responderlo por "ya estaba en el anuncio" |
| 23 | Cliente: "Del combo." | Avanza a la primera decisión abierta | "Dale, es un combo entonces." |

## 4. Prueba de temporización de `transfer_order` (pedido explícito del usuario)

En modo Clásico el analizador decide `save_variable` más `transfer_order` **en el mismo turno**. Hay que medir que la respuesta visible igualmente se envíe.

- **Entrada.** "Quiero bajar de peso".
- **Esperado.** El cliente RECIBE la respuesta completa del caso 16, se guarda `interes_inicial` y el negocio pasa a `CL|EN CONVERSACION`.
- **Falla si.** `transfer_order` se ejecuta antes de enviar y suprime o corta el mensaje.
- **Si falla.** NO se corrige con el prompt. Es un problema de temporización de acciones y se resuelve a nivel CRM o automatización.
- **Qué mirar en el trace.** Orden de los pasos `message_sent` y `action_executed`, y la prioridad de la acción (`immediate` o `after_response`).

## 5. Pruebas de guardrails nuevos

| Frase agregada | Debe bloquear | No debe bloquear |
|---|---|---|
| `venis del anuncio` | "Vi que venís del anuncio…" | Cualquier respuesta que no narre el origen |
| `vi que queres` | "Vi que querés una creatina" | "Sí, trabajamos con XTR" |
| `veo que estas buscando` | "Veo que estás buscando proteína" | "Sí, tenemos proteínas" |

**Riesgo declarado.** El matcher es léxico. `veo que estás buscando` también bloquearía un uso válido que surja del mensaje actual del cliente. Se agregó por decisión expresa, y este es el caso a vigilar en el runtime.
