# Traspaso 2026-09-15 (noche) — Los 3 agentes reales, auditoría con ChatGPT, prompts v2

> **Empezar por acá si venís de otra PC y el tema es "los agentes de venta".** Esto reemplaza como punto de entrada a `28-traspaso-2026-09-15-deck-e-informe.md`, que era sobre la presentación para la gerencia (otro tema, sigue vigente para eso). Si necesitás el traspaso anterior a este (todo lo de antes de dividir en 3 agentes), está en `24-sesion-2026-09-14-traspaso.md`.

## Qué cambió de fondo esta sesión

El "Agente Fit" único (id 9816) se dividió en **3 agentes reales**, uno por etapa del embudo. El 9816 queda **de referencia, sin tocar más**. Los 3 nuevos:

| Agente | id | Columna que atiende |
|---|---|---|
| Agente Fit - Recepcionista | **9882** | `FV \| ENTRADA DE LEAD` |
| Agente Fit - Conversión | **9883** | `FV \| CUALIFICACION` |
| Agente Fit - Cierre | **9884** | `FV \| PROPUESTA ENVIADA` + `FV \| PAGO PENDIENTE` |

Los tres se pasan la conversación entre sí de forma invisible para el cliente (`transfer_order` sin avisarle nada).

## El prompt de cada uno pasó por una auditoría real con ChatGPT

El usuario le dio a ChatGPT el contexto completo del proyecto (objetivo de conversión, reglas fijas de la plataforma, y el prompt de cada agente uno por uno) y pidió crítica constructiva. Esto **no fue teórico**: incluyó una segunda ronda con conversaciones reales del agente, donde salieron fallas concretas:

- El agente escribía `¡` además de `¿` (bug de plataforma, rompe el mensaje).
- Decía "890 pesos uruguayos" en vez de "$890" — suena a robot.
- Encadenaba varios "querés que...?" seguidos, la charla se sentía un interrogatorio.
- Afirmó con seguridad el origen de una marca que no tenía confirmado, y tuvo que retractarse cuando le repreguntaron.
- Tomó un "Si" ambiguo del cliente como intención de compra y le pidió datos de envío sin que correspondiera.
- Usaba `ranking_ventas = A` como argumento de venta ("es de los más vendidos") en vez de como desempate silencioso.

Todo esto se combinó con el criterio del proyecto (tono, reglas de formato, arquitectura de columnas) en **[[29-prompts-por-columna]]**, que tiene los 5 prompts completos (los 3 reales + 2 nuevos para agentes que todavía no existen) y el detalle de qué cambió y por qué en cada uno.

## Estado real de cada agente en rmsystemm, verificado hoy

**Recepcionista (9882)**: prompt v2 pegado completo, sin cortes. Acciones: `transfer_order` a `FV|CUALIFICACION` + `save_variable("anuncio_origen")` + `save_variable("interes_inicial")` — **3 acciones, verificado en pantalla "Ações: 3"**. No usa catálogo (no tiene conector de Google Sheets, no lo necesita).

**Conversión (9883)**: prompt v2 pegado completo. Acciones: `transfer_order` a `FV|PROPUESTA ENVIADA` + `save_variable` de `objetivo_lead`, `estilo_comunicacion`, `ritmo` — **4 acciones**, ya estaban de antes, no hizo falta agregar nada. Conector de Google Sheets adjunto (6 herramientas). Modo Avanzado, "Dividir respuestas en bloques" ON.

**Cierre (9884)**: prompt v2 pegado completo. Acciones: los 4 `transfer_order` de siempre (`PAGO PENDIENTE`, `RECOMPRA - 30/60/90 DIAS`) + 2 `save_variable` (`ultimo_producto_comprado`, `fecha_compra`) + **2 acciones nuevas** agregadas hoy (`transfer_order` a `FV|SEGUIMIENTO` y a `FV|CERRAR SIN VENTA`) — **8 acciones, verificado en pantalla "Ações: 8"**. Conector de Google Sheets adjunto. Modo Avanzado, "Dividir respuestas en bloques" ON.

Las 4 acciones nuevas (2 en Recepcionista, 2 en Cierre) se agregaron **a mano por el usuario**, arrastrando los chips reales — no por automatización. Un intento de hacerlo por Playwright corrompió el texto dos veces (ver hallazgo técnico abajo) y se descartó sin guardar las dos veces; el agente nunca quedó en mal estado. Pegar a mano funcionó a la primera.

## Hallazgo técnico para cualquier sesión futura que edite estos prompts

En el editor modal de Instrucciones de rmsystemm (Slate.js), **`Ctrl+End` no mueve el cursor real** — solo hace scroll visual del contenedor. Si hay que posicionar el cursor al final del documento por script, usar `Ctrl+A` seguido de `ArrowRight` (colapsa la selección al final), nunca `Ctrl+End`. Se suma a los hallazgos ya documentados en `01-agente-de-ia.md` y en la sesión de 2026-09-15 (tarde/noche): el `contenteditable` real vive en `z-index:-1` (por eso `.click()` falla sistemáticamente y hay que usar `pressSequentially()` sobre `[data-slate-editor="true"]:visible`), y el botón "Guardar cambios" solo queda habilitado después de que el editor pierde el foco (blur) — hay que hacer clic afuera antes de guardar.

**Recomendación para la próxima vez que haya que tocar un prompt en vivo**: si el cambio es agregar una acción (`transfer_order`, `save_variable`), es más simple y más seguro pedirle al usuario que arrastre el chip a mano — toma 30 segundos y no tiene el riesgo de la edición por script. Reservar la automatización para lectura/verificación, no para escritura de acciones.

## Lo que falta (ver `PENDIENTES.md`, prefijo Q)

- **Q7**: crear los agentes **Seguimiento** (columna `FV|SEGUIMIENTO`) y **Recompra** (columnas `RECOMPRA - 30/60/90 DIAS`) en rmsystemm. Los prompts ya están escritos en `29-prompts-por-columna.md`, listos para pegar apenas se crea el agente. **Todavía no pasaron por la auditoría de ChatGPT** como los otros 3 — están escritos aplicando el mismo criterio aprendido, pero no revisados por separado. Si se quiere el mismo nivel de rigor, el mensaje para mandarle a ChatGPT está más abajo en este mismo archivo.
- **Q8**: probar la cadena completa de traspaso en una conversación real (Recepcionista → Conversión → Cierre) — es la pregunta original del usuario sobre si el agente sabe a dónde mandar al cliente. La mecánica está verificada (acciones registradas correctamente), falta el test de punta a punta.
- **Q1**: conectar el recurso "Métodos de pago" (ya creado en Recursos → Criativos → Mensagens) al prompt de Cierre, arrastrando el chip "Enviar funil de Criativos".
- **Q2**: decidir si los agentes pasan a usar la planilla curada nueva (`catalogo-agente-curado`, 11 productos con descripciones reales) en vez de la vieja de 422 productos con descripciones genéricas. Hoy ningún agente usa la nueva.
- **Q3/Q4/Q5**: detalles menores de la planilla nueva (renombrar la pestaña, borrar el Sheet huérfano viejo, completar 3 precios que quedaron pendientes).

## Mensaje listo para mandarle a ChatGPT — auditoría de Seguimiento y Recompra

Para que estos dos agentes nuevos pasen por la misma revisión que los otros 3, en la misma conversación de ChatGPT (ya tiene todo el contexto del proyecto y las reglas fijas), pegar esto:

> Dale, ahora quiero que audites los últimos dos agentes de la cadena, con el mismo criterio que usaste en los anteriores. Son dos etapas que hoy no existen todavía como agentes reales, las estoy por crear:
>
> **Seguimiento** — atiende a un cliente que quedó sin cerrar (dijo "lo voy a pensar", quedó en avisar, o dejó de responder). No es un lead nuevo ni uno activo: necesita UN toque bien puesto, no insistencia.
>
> **Recompra** — atiende a un cliente que YA compró antes y se le está por terminar el producto (lo sabemos por fecha de compra + duración estimada). Es el lead más caliente que hay: no hay que convencerlo de nada, hay que hacérsela fácil.
>
> Te paso los dos prompts que armé aplicando todo lo que ya charlamos (mismo bloque de reglas de escritura, mismo criterio de objeciones y de no interrogar). Decime dónde le falta profundidad, dónde puede sonar a bot, y qué le agregarías pensando en que estos dos son justo los que menos atención reciben hoy — literalmente no existen, entonces cualquier mejora acá es una oportunidad completamente nueva.
>
> [PEGAR ACÁ el prompt de Seguimiento y el de Recompra, completos, desde `29-prompts-por-columna.md`]
