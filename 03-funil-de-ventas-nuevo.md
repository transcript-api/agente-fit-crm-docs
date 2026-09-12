# "Funil De Ventas" — pipeline de práctica (en construcción)

Pipeline nuevo, vacío (0 negocios), creado por el usuario copiando la idea de un video tutorial de otro CRM ("DKW System") pero adaptado a venta de suplementos por chat (no a una agencia con reuniones agendadas). `selectedPipeline=23843` en la URL de `/business/funnel`.

**Estado: en construcción activa, guiado paso a paso en el chat, el usuario hace los clics, Claude no edita directamente salvo pedido explícito puntual.**

## REDISEÑO (v2) — a partir de info real del call center
El usuario averiguó con el call center real el flujo verdadero de qué pasa cuando un pago queda pendiente sin respuesta. Es mejor que el plan original (v1, más abajo por historial) y lo reemplaza:

`[Propuesta Enviada / Pago Pendiente, sin respuesta] → Seguimiento (72hs) → Derivar a Remarketing (columna) → [a mano, un encargado lo pasa a la pipeline real de Remarketing] → si tampoco cierra → Cerrar Sin Venta`

**Corrección importante del usuario**: "Seguimiento" **no es exclusivo de los que llegaron a Pago Pendiente** — también entran ahí los que nunca llegaron a confirmar el pago (se enfriaron antes, ej. en Propuesta Enviada). Por eso, en el orden visual de columnas, **"Seguimiento" va ANTES que "Pago Pendiente"**, no después — es un estadio más general de "se enfrió, hay que reactivarlo", alimentado por varias etapas anteriores, no solo por una. El orden visual de las columnas no afecta el funcionamiento de las automatizaciones (una tarjeta puede saltar a cualquier columna vía "Cambiar de Columna" sin importar el orden), pero conviene que el layout represente bien el concepto.

Nota técnica clave: la "ventana de 24 horas" que mencionó el call center es probablemente la **ventana oficial de mensajería de WhatsApp Business** (pasadas 24hs sin mensaje del cliente, solo se pueden mandar plantillas aprobadas, no texto libre — de ahí la acción "Enviar Plantilla de Mensaje" que vimos en el dropdown). Se reabre si el cliente responde.

**Corrección/precisión del usuario (2026-09-10)**: el cambio de política de Meta es más matizado de lo que se pensaba:
- **0-24hs desde el último mensaje del cliente**: ventana abierta, se puede chatear libremente (texto libre).
- **24-72hs**: la ventana de chat libre está cerrada, PERO todavía se pueden mandar **mensajes automatizados** (no charla libre) intentando reactivar al cliente — si el cliente responde en esa franja, la ventana de 24hs se reabre.
- **Pasadas 72hs**: se cierra del todo, ya no se puede ni automatizar mensajes (antes esto — la gracia de 72hs post-anuncio de Meta — aplicaba distinto; el call center confirmó que ya no es así, ahora las 72hs son el límite duro para intentos automatizados de reactivación, no una ventana de chat libre extendida).

Esto es relevante para el timing de las automatizaciones de este pipeline: los recordatorios/mensajes automatizados en Pago Pendiente (1h) y el paso a Seguimiento (15h) caen dentro de la ventana donde probablemente todavía se puede mandar algo (aunque ojo, el temporizador mide tiempo en la columna, no tiempo desde el último mensaje del cliente — ver limitación ya documentada). El paso de Seguimiento a Derivar a Remarketing a las 72hs coincide justo con el límite duro de Meta — tiene sentido como corte.

**Decisión tomada con el usuario**: el salto de la columna "Derivar a Remarketing" hacia la pipeline real de Remarketing se mantiene **manual** (como lo hace hoy el equipo), aunque técnicamente ya confirmamos que se podría automatizar (ver hallazgo técnico abajo). Se puede reconsiderar más adelante.

## Estructura de columnas (objetivo: 8 columnas, orden corregido)
1. **Entrada de Lead** — ya existía. ✅
2. **Cualificación** — ya existía. ✅ Acá el agente pregunta objetivo/experiencia (como hace Santiago en la vida real).
3. **Propuesta Enviada** — creada. ✅ Se recomendó producto, se espera respuesta. Si se enfría acá, también puede ir a Seguimiento (no solo desde Pago Pendiente).
4. **Seguimiento** — ⏳ pendiente de crear (v2). **Va ANTES que Pago Pendiente** (corrección del usuario) — es un estadio general de "se enfrió", alimentado por Propuesta Enviada Y por Pago Pendiente, no solo por uno.
5. **Pago Pendiente** — creada. ✅ Cliente dijo que sí, falta cerrar pago/datos de envío.
6. **Derivar a Remarketing** — ⏳ pendiente de crear (v2, mismo nombre que la columna real de CL|COMERCIAL).
7. **Cerrar Sin Venta** — ⏳ pendiente de crear.
8. **Venta Ganada** — creada. ✅ Cerrado.

Nota: como las columnas ya existentes se crearon en otro orden, puede que en la práctica el orden visual real termine siendo distinto a esta lista numerada — no es grave, ver nota de "el orden visual no afecta el funcionamiento" arriba.

## Convención de nombres (decidida con el usuario)
Igual que la cuenta real usa el prefijo `CL | ` (Comercial), acá se usa `FV | ` (Funil De Ventas), todo en mayúsculas, sin tildes — mismo estilo que `CL | LEAD NUEVO`, `CL | SEGUIMIENTO`, etc.

```
FV | ENTRADA DE LEAD
FV | CUALIFICACION
FV | PROPUESTA ENVIADA
FV | SEGUIMIENTO
FV | PAGO PENDIENTE
FV | DERIVAR A REMARKETING
FV | CERRAR SIN VENTA
FV | VENTA GANADA
```

Se dejó afuera "Reunión agendada/realizada" del video original porque acá no hay llamadas, todo es por chat.

## Hallazgo técnico importante: "Cambiar de Columna" puede apuntar a OTRO pipeline
Al configurar una acción tipo "Cambiar de Columna" aparecen DOS selectores: **"Pipeline de Destino"** (lista TODOS los pipelines del workspace: CL|COMERCIAL, RMKG-REMARKETING, Recompra, Follow-Up, BASE FRIA, RE MARKETING-SPRINT AGOSTO, Funil De Ventas...) y **"Columna de Destino"** (las columnas de ese pipeline elegido). Confirma que el motor de automatización SÍ puede mover un negocio entre pipelines distintos de forma 100% automática — la empresa real no lo usa así hoy (lo hace un encargado a mano), pero la capacidad existe. Ver [[06-seguridad-y-pendientes]] como oportunidad futura.

## Excepción "Intercambio de Mensajes" agregada a todas las automatizaciones de tiempo (2026-09-10)
Se descubrió que rmsystemm sí tiene mecanismo de excepción (antes se creía que no, ver [[02-pipeline-comercial-real]]) — sección "EXCEPCIONES" dentro del modal de cada automatización, tipo "Intercambio de Mensajes" + tiempo/unidad. Si el cliente intercambió mensajes dentro de esa ventana, la acción NO se ejecuta (protege de mover/recordarle algo a alguien que sigue activo).

Se agregó **"Intercambio de Mensajes · 2 horas"** a las 6 automatizaciones que usan "Tiempo en la Columna" (todas menos "Enviar a Remarketing", que dispara inmediato y no la necesita):
- ✅ Cualificación → Derivar a Seguimiento
- ✅ Propuesta Enviada → Derivar a Seguimiento
- ✅ Propuesta Enviada → Recordatorio Propuesta
- ✅ Pago Pendiente → Derivar a Seguimiento
- ✅ Pago Pendiente → Recordatorio Pago Pendiente
- ✅ Seguimiento → Derivar a Remarketing tras 72hs

**Decisión sobre activación**: por ahora se decidió NO activar ninguna automatización todavía (ni siquiera "Enviar a Remarketing", que se había activado y luego se desactivó de nuevo) — todo queda Inativa hasta que el agente esté listo.

## Solucionado: se sacó `{Nombre}` de los mensajes automáticos fijos (2026-09-10)
Problema: si el contacto no tiene un nombre de persona cargado (o WhatsApp le puso un nombre de negocio, ej. "benja marketing digital"), el mensaje salía con ese texto raro en vez de un nombre real, o directamente con el número de teléfono. Como "Recordatorio Propuesta" y "Recordatorio Pago Pendiente" son mensajes fijos sin criterio (nadie los revisa antes de mandar), se les sacó el `{Nombre}`:
- **Recordatorio Propuesta**: `¡Hola! 👋 Quería saber qué te pareció lo que te pasé recién, ¿te quedó alguna duda o ya te lo mando?`
- **Recordatorio Pago Pendiente**: `¡Hola! 📦 Quedé esperando tus datos para mandarte el pedido: nombre, dirección y con qué forma de pago preferís cerrarlo?`

El Agente de IA, cuando esté armado, sí puede manejar el nombre con criterio (pedirlo en Cualificación y decidir si usarlo) — este arreglo aplica solo a los mensajes fijos de automatización de columna.

## Automatizaciones — plan completo (v2)

### Columna "Propuesta Enviada" → dos automatizaciones
1. "Recordatorio Propuesta": Disparador Tiempo en la Columna · 2 horas → Acción Enviar Mensaje: `Hola {Nombre}! 👋 Quería saber qué te pareció lo que te pasé recién, te quedó alguna duda o ya te lo mando?` (recreada en el rediseño v2, ✅ hecha).
2. "Derivar a Seguimiento" (nueva, decidida 2026-09-09): Disparador Tiempo en la Columna · 15 horas → Acción 1: Asignar Etiqueta `FV|Propuesta Enviada - Sin Respuesta` + Acción 2: Cambiar de Columna → Seguimiento (mismo pipeline). Idea del usuario: así un lead que nunca confirmó la compra ("frío") llega a Seguimiento con una etiqueta distinta al que sí confirmó y se cortó en el pago ("caliente", `FV|Pago Pendiente - Sin Respuesta`) — el Agente de IA podrá leer esta diferencia y tratarlos distinto (ver [[07-estrategias-pendientes-agente]]).

**Colores de etiquetas** (para diferenciar visualmente en el tablero):
- `FV|Pago Pendiente - Sin Respuesta` → amarillo/naranja claro (alerta, "caliente, se enfrió")
- `FV|Seguimiento - Sin Respuesta` → naranja oscuro (segunda alerta, viene de Seguimiento sin responder tampoco)
- `FV|Propuesta Enviada - Sin Respuesta` → azul/gris (frío, nunca confirmó)
- `FV|Cualificacion - Sin Respuesta` → gris claro (el más frío de los tres, ni siquiera llegó a recibir una propuesta)

### Columna "Cualificación" → "Derivar a Seguimiento" (decidida 2026-09-09)
En Cualificación atiende el **Agente de IA** en conversación real (no hay automatización de mensaje fijo acá, a diferencia de Propuesta Enviada/Pago Pendiente). La única automatización de esta columna es el rescate por inactividad:
- Disparador: Tiempo en la Columna · 20 horas (más margen que las otras columnas — acá no hubo compromiso ni propuesta todavía, no hay apuro comercial extra, solo se cuida la ventana de 24hs de WhatsApp).
- Acción 1: Asignar Etiqueta → `FV|Cualificacion - Sin Respuesta`
- Acción 2: Cambiar de Columna → Seguimiento

### Sistema de 3 niveles de temperatura en "Seguimiento"
La columna Seguimiento ahora recibe leads de tres orígenes distintos, cada uno con su propia etiqueta, para que el Agente de IA los trate diferente (ver [[07-estrategias-pendientes-agente]] para el detalle de la estrategia):

| Etiqueta | Temperatura | Qué debería hacer el agente |
|---|---|---|
| `FV\|Cualificacion - Sin Respuesta` | Más frío | Nada de cupón/promo — retomar la conversación de cualificación y llevarlo hasta que reciba una propuesta |
| `FV\|Propuesta Enviada - Sin Respuesta` | Frío medio | Re-vender/resolver dudas sobre lo que ya se le propuso |
| `FV\|Pago Pendiente - Sin Respuesta` | Caliente | Destrabar el pago, con más urgencia/posible cupón |

### Columna "Pago Pendiente" → dos automatizaciones
1. "Recordatorio Pago Pendiente": Disparador Tiempo en la Columna · 1 hora → Enviar Mensaje: `Hola {Nombre}! 📦 Quedé esperando tus datos para mandarte el pedido, nombre, dirección y con qué forma de pago preferís cerrarlo?` (creada por el usuario, también quedó Inativa, se recrea).
2. "Derivar a Seguimiento" (nueva, reemplaza el plan v1 de ir directo a Cerrar Sin Venta): Disparador Tiempo en la Columna · **15 horas** (decidido con el usuario) → Asignar Etiqueta `FDV|Pago Pendiente - Sin Respuesta` + Cambiar de Columna → Seguimiento (mismo pipeline). **Sin mensaje fijo en esta automatización** — ver nota de rediseño abajo, el mensaje de reactivación lo da el Agente de IA, no la automatización de columna.

### Columna "Seguimiento" → nueva
"Derivar a Remarketing tras 72hs": Disparador Tiempo en la Columna · 72 horas → Cambiar de Columna → Derivar a Remarketing (mismo pipeline). Ojo: si el cliente responde y alguien mueve la tarjeta, el timer no aplica (mismo comportamiento que las demás).

**Rediseño (decidido con el usuario, 2026-09-09): el cupón/promo de reactivación NO va en una automatización de columna con mensaje fijo.** Motivo: un mensaje fijo no puede saber qué le interesaba al cliente (ej. no tiene sentido ofrecerle cupón de proteína a alguien que preguntó por creatina). En cambio:
- La automatización de columna en Seguimiento se limita a mover/etiquetar (ver arriba), sin acción "Enviar Mensaje".
- El **Agente de IA** es el que atiende y decide qué cupón ofrecer según el contexto real de la conversación — usando la herramienta **Follow Up → Generativo** (lee el historial y redacta el mensaje, ver [[01-agente-de-ia]]) en vez de un texto reciclado.
- Las promociones vigentes del mes se cargan en el campo "Instrucciones" del agente (o en la base de Conocimiento/RAG) — cuando cambian las promos, se edita ese texto y listo, no hay que tocar ninguna automatización de columna. Ver [[07-estrategias-pendientes-agente]] para el detalle de esta idea.
- Pendiente de definir: catálogo de qué cupón corresponde a qué interés/producto (mapeo producto→promo), para dárselo al agente como parte de sus instrucciones.

### Columna "Derivar a Remarketing" → sin automatización (a propósito)
El salto a la pipeline real de Remarketing queda manual por decisión del usuario. No configurar "Cambiar de Columna" cross-pipeline acá todavía.

### Columna "Cerrar Sin Venta"
Sin automatización propia — es un destino final, no un origen.

## Etiquetas nuevas a usar (evitar reusar las de la cuenta real)
Prefijo `FDV|` para no mezclar con las etiquetas reales (`PAGO PENDIENTE`: 3454 contactos reales, etc. — ver [[02-pipeline-comercial-real]]). Ej: `FDV|Pago Pendiente - Sin Respuesta`.

## Próximos pasos discutidos (orden acordado con el usuario)
1. ~~Terminar estructura de columnas v1 (5)~~ ✅ — superado por v2 (8 columnas)
2. Agregar columnas "Seguimiento", "Derivar a Remarketing", "Cerrar Sin Venta" ⏳ EN CURSO
3. Recrear todas las automatizaciones más estructuradas (v2, ver arriba) ⏳ EN CURSO
4. Cargar Productos Comerciales (catálogo real, nombre/precio)
5. Escribir el prompt de "Instrucciones" del Agente de IA, basado en los patrones reales documentados en [[04-patrones-reales-de-venta]]
6. Conectar el agente a este pipeline/cola y probar

---
### Historial — plan v1 (superado, se deja como referencia)
v1 tenía solo 5 columnas y mandaba "Pago Pendiente" directo a "Cerrar Sin Venta" a las 24hs sin pasar por Seguimiento ni Remarketing. Se reemplazó por v2 al conseguir info real del proceso del call center.
