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

## Hallazgo grande: cómo se conecta de verdad una columna con un agente

Esto estaba pendiente de confirmar desde que se armó el primer agente ("¿el agente consigue saber a dónde tiene que enviar los clientes?"). La respuesta completa: `transfer_order` mueve el **negocio** de columna, pero eso solo no hace que otro agente empiece a responder — falta el segundo paso, que es **vincular el agente correcto a la conversación**.

**Lo que NO es**: la pantalla Configuración → Colas tiene un campo "Agente de IA" por cola — se probó en vivo (sin guardar nada) y ninguna de las 3 colas que existen (`DS bot`, `comercial`, `Atencion IA`) lo tiene configurado, ni siquiera la del Agente Fit original. No es el mecanismo que se está usando.

**Lo que SÍ es**: un **Flujo de Automatización** por columna, con disparador **"Negócio mudou de etapa"** (se configura por Pipeline + Etapa) y acción **"Agente de IA"** (vincula o remueve el agente de esa conversación). Confirmado en vivo abriendo el constructor de flujos (Automatizaciones → Flujos de Automatización → Adicionar) y viendo ambos componentes reales en el catálogo, sin guardar nada.

Hacen falta 8 flujos (uno por columna que necesita agente):

| Pipeline | Etapa | Agente |
|---|---|---|
| `FV\| FUNIL DE VENTAS ` | `FV \| ENTRADA DE LEAD` | Recepcionista (9882) |
| `FV\| FUNIL DE VENTAS ` | `FV \| CUALIFICACION` | Conversión (9883) |
| `FV\| FUNIL DE VENTAS ` | `FV \| PROPUESTA ENVIADA` | Cierre (9884) |
| `FV\| FUNIL DE VENTAS ` | `FV \| PAGO PENDIENTE` | Cierre (9884) |
| `FV\| FUNIL DE VENTAS ` | `FV \| SEGUIMIENTO` | Seguimiento (no existe todavía) |
| `FV\|RECOMPRA` | `RECOMPRA - 30 DIAS` | Recompra (no existe todavía) |
| `FV\|RECOMPRA` | `RECOMPRA - 60 DIAS` | Recompra (no existe todavía) |
| `FV\|RECOMPRA` | `RECOMPRA - 90 DIAS` | Recompra (no existe todavía) |

Ninguno de estos 8 flujos existía a esta fecha (2026-09-15) — es la pieza que faltaba para que la cadena de traspaso funcione sola, sin depender de "Gerenciar Agente" manual por conversación (que era el único mecanismo probado hasta entonces, usado para el testing seguro del Agente Fit original).

## Actualización 2026-09-24 — el mecanismo ya se construyó para `FV|FUNIL DE VENTAS` y se replicó a la pipeline real

Desde el 2026-09-15 se construyeron y probaron en vivo dos de los 8 flujos de la tabla de arriba, con nombres reales `FV|Asignar Conversión.` (etapa `FV|CUALIFICACION` → agente Conversión) y `FV|Asignar Cierre` (etapa `FV|PROPUESTA ENVIADA`/`FV|PAGO PENDIENTE` → agente Cierre). Estructura confirmada en vivo de `FV|Asignar Conversión.`: trigger "Negócio mudou de etapa" (Pipeline + Etapa) → acción "Buscar Conversa" (Canal, sin fila/status, "Usar a mais recente", "Criar se não encontrar") → acción "Vincular Agente IA" (Vincular/Remover + selector de agente).

**Hallazgo nuevo, no documentado hasta hoy: existe un agente `Agente Fit - Recepcionista Comercial`**, distinto del `Agente Fit - Recepcionista` (9882) de test — visible en el selector de agentes del editor de Flujos. Por el nombre, es la variante pensada para la pipeline real `CL | COMERCIAL`. No se investigó su prompt/configuración interna esta sesión, solo se confirmó que existe y se lo vinculó al flujo nuevo (ver abajo). **PENDIENTE:** revisar su prompt/acciones y confirmar que esté igual de sólido que el 9882 antes de activar nada en producción.

**Se construyó `CL|Asignar Recepcionista`** (id 6052), duplicando `FV|Asignar Conversión.` y reconfigurando:
- Trigger: Pipeline `CL | COMERCIAL` (no `FV|FUNIL DE VENTAS`) → Etapa `CL | EN CONVERSACION` (verificada en vivo como la **2ª columna real** de esa pipeline: `CL|LEAD NUEVO` → `CL|EN CONVERSACION` → `CL|SEGUIMIENTO` → `CL|PAGO PENDIENTE` → `CL|VENTA GANADA` → `CL|DERIVAR A REMARKETING` → `CL|CERRAR SIN VENTA`).
- Acción "Vincular Agente IA" → agente `Agente Fit - Recepcionista Comercial` (no el 9882 de test).
- **A propósito no se incluyó ningún hand-off al agente de Conversión** — indicación explícita del usuario: el agente de Conversión "no está ajustado" para uso real todavía. Se puede agregar más adelante replicando `FV|Asignar Cierre`/`FV|Asignar Conversión.` de la misma forma.
- Publicado por el usuario (el clic en "Publicar" quedó bloqueado para mí por el clasificador de auto-mode, categoría "Production Deploy") y **dejado desactivado** (Status Off) a pedido explícito — verificado con recarga completa del listado de Flujos: checkbox destildado, "Última Execução: Nunca". Ver Q18 en `PENDIENTES.md` para la prueba en vivo pendiente.

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
