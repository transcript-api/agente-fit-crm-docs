# Prompt vivo del Recepcionista — capturado en vivo del CRM (2026-09-22)

**Resuelve A1.** Hasta hoy el vault no tenía la versión real que corre en producción — [[29-prompts-por-columna]] estaba desactualizado (el usuario lo siguió iterando con ChatGPT por fuera del vault). Este archivo es una **captura verbatim** del campo "Instrucciones" del agente **Agente Fit - Recepcionista (id 9882)**, leída en vivo por Playwright (solo lectura, no se guardó nada), el 2026-09-22.

## Hallazgo bueno: el prompt ya incorpora casi todo lo que documentamos en [[34-arquitectura-conversacional-aprendizajes-agentes]]

Ya tiene bloques para: identidad/continuidad de Santiago, regla maestra de "qué cambia según la respuesta", verdad comercial (hecho confirmado vs. dicho por el cliente vs. suposición), anuncios reales vs. link sin contenido, descubrimiento vs. puente, identificación suficiente según la consulta, responder primero, bienvenida, objetivos/kits, marcas, precio/promos, cliente directo (stop selling), pagos, mayorista, compras anteriores, producto ambiguo, respuestas ambiguas, seguridad como override, logística, urgencia, variables, transferencia, memoria silenciosa, estilo y un control final corto. Es mucho más chico y prolijo que las 2.751 líneas que mencionó ChatGPT en el documento del 21/09 — parece una reescritura posterior, más cercana al "prompt operativo" que se venía pidiendo.

## ⚠️ Hallazgo 1: el tag `<IDENTIFICACION_SUFICIENTE>` que ChatGPT quiso reemplazar NO EXISTE

El tag real es **`<IDENTIFICACION>`** (sin "_SUFICIENTE"), y dice algo **distinto, casi contrario**, a lo que ChatGPT propuso pegar en su lugar (mensaje del usuario, 2026-09-22):

**Lo que dice hoy, en vivo:**
> *"Quiero la proteína DUX que elegí y necesito precio" NO alcanza si no sabemos cuál proteína DUX es.*

**Lo que ChatGPT quería que dijera** (bloque `<IDENTIFICACION_SUFICIENTE>` propuesto):
> *"Busco proteína DUX" → suficiente para que se consulten las opciones reales de DUX.*

Son reglas opuestas para el mismo caso. ChatGPT estaba razonando sobre una versión del prompt que no es la que está pegada — probablemente una versión anterior que le pasó el usuario en otro momento, o una reconstrucción propia. **No se pegó el bloque de ChatGPT sin resolver esta contradicción primero con el usuario.**

## 🟡 Hallazgo 2 (revisado, ya no es alarma): texto suelto fuera de cualquier etiqueta, al final del prompt

Después de `</CONTROL_FINAL>`, sin ninguna etiqueta que lo contenga, aparece literalmente:

```
save_variable("interes_inicial",true,"TEXT","")
save_variable("anuncio_origen",true,"TEXT","")
transfer_order("FV| FUNIL DE VENTAS ","FV | CUALIFICACION")
```

**Verificado en vivo contra `CRM → Embudo de Ventas` (2026-09-22)**: los nombres SÍ coinciden con los reales — la pipeline se llama literal **"FV| FUNIL DE VENTAS"** (sin espacio después de la barra) y la columna **"FV | CUALIFICACION"** (con espacios alrededor de la barra), confirmando de paso que N13 (el problema de espaciado documentado el 2026-09-14) ya no aplica en esta parte del prompt — coincide bien. Queda una duda menor, no confirmable por accesibilidad/snapshot: si hay un espacio de más al final de `"FV| FUNIL DE VENTAS "` antes de la comilla de cierre (los espacios finales no siempre se ven en el árbol de accesibilidad). Baja prioridad.

Sigue sin resolverse **qué hace ahí esta llamada suelta, fuera de cualquier etiqueta**: en modo Avanzado el modelo decide con tool calling nativo guiado por todo el prompt, así que estas 3 líneas sueltas podrían ser simplemente inertes (texto que el modelo lee como contexto pero no ejecuta como código real) o podrían tener algún efecto no documentado. No es urgente, pero vale la pena preguntarlo si se habla con soporte de rmsystemm.

## 🟠 Hallazgo 3: corrección a lo explicado antes en esta misma sesión sobre Avanzado vs. Clásico

En [[34-arquitectura-conversacional-aprendizajes-agentes]] §29.9 se había explicado Avanzado como "2 llamadas, una analiza acciones y otra redacta" — **eso estaba mal**, basado en una nota vieja y contradictoria del propio vault ([[01-agente-de-ia]] línea 22 vs. línea 108, que se contradicen entre sí). **Verificado en vivo ahora, texto literal de la UI**:

- **Avanzado** (activo hoy, "Recomendado"): *"El modelo decide y ejecuta acciones en una sola llamada usando tool calling nativo. ~50% más rápido y caché de prompt ~90% (input cobrado al 50% del precio)."* **No tiene reglas personalizables.**
- **Clásico**: es el modo que sí tiene "Ver Predeterminado" → "Usar como Base" → el campo "Reglas personalizadas del analizador" que quiere usar ChatGPT. Es el mecanismo más viejo (analizador de texto separado por reglas), presumiblemente más lento y menos preciso que el tool calling nativo de Avanzado — no confirmado el costo/latencia real de Clásico en esta cuenta.

**Implicación real**: pasar a Clásico para poder usar el bloque de reglas de ChatGPT significa **salir del modo recomendado** (Avanzado), no es solo "activar una opción más". Es una decisión de arquitectura, no un detalle de configuración — hay que confirmarla con el usuario antes de tocar el toggle.

## Texto completo capturado (verbatim, para referencia y diff futuro)

> Ver el texto completo en la captura de Playwright de la sesión 2026-09-22 (guardado en el historial de la conversación). No se transcribe acá completo por su extensión — el resumen de bloques y los 3 hallazgos de arriba cubren lo accionable. Si hace falta el texto íntegro para copiar/pegar o diffear, releer directamente el campo Instrucciones en vivo (`Agente de IA → Agente Fit - Recepcionista → Entrenamiento`).

## Qué falta para poder aplicar el plan de ChatGPT con confianza
1. **Decidir con el usuario** si el bloque `<IDENTIFICACION>` se actualiza tal cual lo pidió ChatGPT (lo que cambiaría la regla real sobre DUX) o si se ajusta distinto, ya que la premisa de ChatGPT (el tag y su contenido) no coincidía con lo real.
2. ~~Confirmar el nombre exacto de pipeline/columna~~ — ✅ **2026-09-22: verificado, coincide** (ver Hallazgo 2 arriba).
3. **Confirmar con el usuario si de verdad quiere bajar a Clásico** (pierde el tool calling nativo más rápido/barato de Avanzado) para poder usar el campo de reglas del analizador, o si prefiere que el "Analizador de Acciones" de ChatGPT se redacte como parte del prompt de Instrucciones en Avanzado en cambio (el modelo igual decide qué función llamar vía tool calling, guiado por el prompt — no necesita un campo de reglas separado para eso).
4. Recién ahí, pegar — y siguiendo la regla de edición segura del proyecto: probar primero en una copia del agente, nunca directo en el Recepcionista de producción.
