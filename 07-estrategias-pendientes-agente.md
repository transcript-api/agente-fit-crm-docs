# Estrategias de Venta y Lógica del Agente — a definir más adelante

Ideas que el usuario fue anotando en un bloc de notas, para no perderlas. **No implementadas todavía** — son para cuando se diseñe el prompt del Agente de IA y/o automatizaciones más avanzadas. Cada vez que surja una idea nueva de este estilo, se agrega acá.

## Principio general: manejo de objeciones
Cuando el cliente da una objeción, el agente debería aplicar una **estrategia de venta específica según el tipo de objeción** (no una respuesta genérica). Todavía no se definieron las estrategias concretas por tipo de objeción — queda pendiente de diseñar junto con el prompt (ver [[04-patrones-reales-de-venta]] para el estilo base de Santiago, que ya muestra cómo maneja algunas objeciones reales de precio/confianza).

## Principio general: timing inteligente, no literal
Cuando una automatización o el agente programan algo en base a una fecha que dio el cliente, **no programar justo en esa fecha** — dejar un margen de 1-2 días. Programar exactamente el día que el cliente mencionó puede sonar desesperado por vender ("¿apenas cobré y ya me escribieron?"). Este principio aplica a cualquier automatización futura que dependa de una fecha mencionada por el cliente, no solo al caso de abajo.

### Caso concreto: objeción de "cobro tal día"
Cuando el cliente dice que no puede pagar ahora porque cobra en una fecha futura (ej. "cobro el 3 de octubre"), dos caminos posibles a evaluar:
1. **Agendar una reunión/recordatorio en el calendario** (la plataforma tiene integración de Agendamientos en el Agente de IA, ver [[01-agente-de-ia]] — vincular cuenta Google).
2. **Automatizar un mensaje programado** para ese cliente, con fecha ajustada con el margen de 1-2 días (ej. cliente cobra el 3 → mensaje programado para el 4 o 5, no el mismo 3).

**Pendiente de investigar**: si el Agente de IA puede reconocer esta fecha dentro de la conversación (razonamiento sobre lenguaje natural: "cobro el 3 de octubre") y agendar el mensaje/reunión por sí solo, aplicando el margen de 1-2 días automáticamente por lógica propia, en vez de que sea una regla fija predefinida. Esto se prueba una vez que el agente esté conectado y funcionando (después de escribir el prompt).

## Pregunta pendiente de investigar: ¿el agente puede sumar el total histórico comprado por un cliente y mostrarlo arriba de la conversación?
El usuario preguntó si es posible que el agente (o el sistema) calcule cuánto le compró un cliente en total (sumando sus negocios/pedidos anteriores) y lo muestre destacado, por ejemplo en el campo "Valor" del negocio o en la cabecera de la conversación. **No investigado todavía a pedido explícito del usuario** ("si no sabes ahora no vayas a revisar, después lo buscamos"). Pistas para cuando se retome: el campo "Valor" que aparece en cada tarjeta/negocio (visto como "R$ 0,00" con botón "+ Valor"), y el sistema de "Recompra" con tags por vendedor (RE COMPRA - FACUNDO, etc., ver [[02-pipeline-comercial-real]]) podrían estar relacionados.

## Cupones/promos dinámicos por interés del cliente (columna Seguimiento)
El usuario decidió (2026-09-09) que el mensaje de reactivación en la columna "Seguimiento" (ver [[03-funil-de-ventas-nuevo]]) no debe ser un texto fijo de automatización, sino que lo tiene que manejar el **Agente de IA**, para poder ofrecer un cupón relevante según lo que el cliente venía buscando (ej. no ofrecerle descuento de proteína a alguien que preguntó por creatina).

Requisitos para implementar esto (pendiente, se hace junto con el prompt del agente):
- Usar la herramienta "Follow Up → Generativo" del agente (ver [[01-agente-de-ia]]) en vez de una acción "Enviar Mensaje" de columna.
- Cargar las promociones vigentes del mes en las Instrucciones del agente (o Conocimiento/RAG) — **el usuario aclaró explícitamente que las promos se van a ir actualizando mes a mes**, y que cuando eso pase hay que borrar las promos viejas del prompt/base y dejar solo las nuevas (si no, el agente podría ofrecer una promo vencida). Esto es mantenimiento recurrente, no algo de una sola vez.
- Falta definir un mapeo producto/interés → cupón correspondiente (ej. interés en creatina → cupón de creatina), para que el agente sepa qué ofrecer según el tema de la conversación, no solo "una promo genérica".

## Tratamiento distinto según origen del lead en Seguimiento (3 niveles de temperatura)
Idea del usuario (2026-09-09), ampliada el mismo día: a la columna Seguimiento llegan leads de TRES orígenes distintos, cada uno con su propia etiqueta (ver [[03-funil-de-ventas-nuevo]]):
- `FV|Cualificacion - Sin Respuesta` = **más frío** — nunca llegó a recibir siquiera una propuesta de producto. Acá el agente NO debe ofrecer cupón/promo (no tiene sentido, todavía no se sabe bien qué quiere) — el objetivo es retomar la conversación de cualificación (qué busca, experiencia) y llevarlo hasta que reciba una propuesta.
- `FV|Propuesta Enviada - Sin Respuesta` = **frío medio** — recibió una propuesta pero nunca confirmó que quería comprar. El agente debe re-vender/resolver objeciones sobre lo que ya se le propuso.
- `FV|Pago Pendiente - Sin Respuesta` = **caliente** — ya había dicho que sí, se cortó en el pago/datos de envío. Acá sí tiene sentido más urgencia y el cupón dinámico (ver sección de cupones arriba).

Pendiente: reflejar esta distinción de 3 niveles en las Instrucciones del agente cuando se escriba el prompt — el agente necesita poder leer las etiquetas del negocio (o el historial) para saber en qué "modo" responder a cada lead.

## Problema grave pendiente: en Remarketing no todos son "fríos" (2026-09-10)
El usuario detectó un caso real importante: algunos clientes que se derivan a Remarketing en realidad **compran de una** — llegan y mandan el comprobante de pago directo, sin necesitar re-venta ni cupón. El diseño actual de [[08-funil-remarketing-nuevo]] asume que todo el que entra a Remarketing está "frío" y necesita reactivación, pero no es así en todos los casos.

**Pendiente de resolver**: la pregunta/apertura del agente en Remarketing no puede asumir "frío" para todos — necesita poder distinguir rápido entre alguien que ya está listo para comprar (tratarlo como si viniera de Pago Pendiente/cualificado) y alguien que realmente necesita reactivación (tratarlo frío). Falta diseñar esa lógica de detección temprana dentro de la conversación de Remarketing.

## Problema pendiente: clientes que rechazan la compra después de manejar todas las objeciones (2026-09-10)
Falta un destino distinto para el caso de "se le hizo frente a todas las objeciones posibles y el cliente sigue sin querer comprar" — esto es distinto de un lead que simplemente no respondió (que hoy va a `FV | CERRAR SIN VENTA`). Es un rechazo activo y definitivo, no un abandono por silencio.

**Pendiente de resolver**: el usuario habló de una etapa/pipeline tipo "Venta Sin Cerrar" para estos casos, a crear más adelante (todavía no se definió si es una columna nueva o una pipeline nueva, ni qué hace el agente con esos contactos después — ¿se los deja en paz definitivamente? ¿se los manda a una base fría distinta de la remarketing normal?).

## Idea del usuario: archivo aparte para promociones y cupones (2026-09-10)
Para poder editar las promos/cupones vigentes fácilmente (se actualizan mes a mes, ver sección de cupones dinámicos más arriba), armar un **archivo separado** solo con eso — no mezclado con el resto de la documentación. Pendiente de crear cuando tengamos las promos reales del mes.

## Idea del usuario: audios pregrabados por tema/situación, vía DS Voice (2026-09-10)
Idea: crear varios audios (Criativos de tipo Áudio, ver [[10-ds-agente-ds-voice-manual]]) para distintas situaciones/preguntas frecuentes, y que el agente elija cuál mandar según el tema — ej. un audio específico para quien pregunta por creatina con objetivo de bajar de peso, presentado como si se lo hubieran grabado a esa persona en particular ("Mirá Sofía, te explico" + audio). Da sensación de atención personalizada real, como ya se ve en el caso Rafael ([[12-caso-real-rafael-prompt-produccion]]).
**Pendiente**: verificar si rmsystemm tiene DS Voice con Gatilhos que el propio Agente de IA pueda disparar dinámicamente según el tema de la conversación (no solo por palabra clave fija en el primer mensaje, que es como lo vimos documentado) — no confirmado todavía en la cuenta real.

## Idea del usuario: detectar el ritmo/preferencia de seguimiento de cada cliente (2026-09-10)
Algunos clientes quieren acompañamiento/seguimiento más seguido, otros son rápidos y transaccionales (van directo a comprar). Por ahora es una observación cualitativa, no hay regla concreta de cómo detectarlo automáticamente — queda pendiente de definir (¿por velocidad de respuesta? ¿por longitud de sus mensajes? ¿por si hace muchas preguntas vs. va directo al pedido?).

**Ampliación (2026-09-11)**: se decidió NO guardar etiquetas despectivas del cliente (ej. "burro", "ignorante" — idea descartada por poco profesional y poco útil). En cambio, usar variables neutras y accionables: `nivel_experiencia` (novato/experimentado, ya cubierto por `experiencia_previa`), `estilo_comunicacion` (directo / necesita más guía), `ritmo` (rápido-transaccional / pausado-conversacional).

## Idea del usuario: usar Remarketing como terreno de prueba de distintos enfoques de venta (2026-09-11)
Probar tácticas distintas (humor, urgencia, prueba social, etc.) con leads de Remarketing para ver cuál convierte mejor, ya que son leads de bajo riesgo (se están por perder igual). **Importante**: esto no es auto-optimización — el agente no aprende solo. El mecanismo sería `save_variable("tactica_usada", ...)` al momento de intentar, y revisión manual periódica de qué tácticas terminaron en venta (mismo método del "laboratorio comercial" ya definido en [[06-seguridad-y-pendientes]]), ajustando el prompt a mano según lo que se observe.

## Confirmado: el Agente de IA puede disparar audios de DS Voice por su propio criterio (2026-09-11)
La herramienta "+ Enviar Funil DS Voice" está confirmada en la lista de herramientas del agente real "IA - BENDER" (ver [[12-caso-real-rafael-prompt-produccion]]) — significa que el agente puede decidir en medio de la conversación, por su propio criterio (no solo por palabra clave fija de un gatillo DS Voice), mandar un audio/funil específico según el tema (ej. audio explicativo de creatina para quien busca bajar de peso). Responde la idea del usuario de tener audios pre-grabados "como si fueran grabados en el momento para esa persona".
**Limitación real**: el audio grabado no puede decir el nombre de la persona dentro del audio (no hay `{{Nombre}}` en un archivo de audio ya grabado) — se compensa con el mensaje de texto previo ("Mirá, te explico 👇") + el delay realista, tal como se vio en el caso real de "Rafael".
**Pendiente**: verificar que "Enviar Funil DS Voice" exista como opción real dentro de "Agente fit" en rmsystemm (confirmado en DKW, no confirmado todavía en nuestra cuenta), y grabar los audios por tema/producto una vez que se defina qué temas necesitan uno.

## Pendiente: instrucción explícita de escalamiento cuando el agente no sabe/no tiene el dato (2026-09-11)
El prompt actual (ver [[13-prompt-agente-fit-v1]]) no tiene una regla explícita para el caso "el agente no tiene la información o no está seguro de la respuesta". Las piezas para resolverlo ya están confirmadas como reales en el panel de acciones del editor de Instrucciones (no son teóricas): **"Transferir Ticket"** (a una fila humana) y **"Finalizar atendimento"**. Falta agregar al prompt algo como: *"si no tenés la información necesaria o no estás seguro de cómo responder, no inventes — transferí el ticket a la fila de Atención Humana en vez de responder a ciegas."* Se decidió no agregarlo todavía a propósito (no implementado), queda anotado para cuando se retome el prompt.

## Cómo se usa este archivo
Es un archivo "vivo" de ideas — no un plan de ejecución. Cuando una idea de acá se implementa, se mueve la referencia al archivo correspondiente (ej. [[01-agente-de-ia]] o [[03-funil-de-ventas-nuevo]]) y se marca acá como hecha, en vez de duplicar contenido.
