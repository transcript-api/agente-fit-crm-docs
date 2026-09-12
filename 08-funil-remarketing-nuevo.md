# "FV | REMARKETING" — pipeline de práctica de Remarketing (en construcción)

Pipeline nueva, creada para que el Agente de IA también maneje remarketing (decisión del usuario, 2026-09-09, revierte la decisión anterior de dejar ese pase manual — ver [[06-seguridad-y-pendientes]], sección "Oportunidad futura", que ya avisaba que esto se podía reconsiderar).

Basada en la estructura real de la pipeline real **"RMKG - REMARKETING"** (547 negocios, ver abajo), mirada solo para copiar el patrón — no se tocó nada ahí.

## Estructura real (referencia, solo mirada)
| Columna real | Automatización | Qué hace |
|---|---|---|
| REMARKETING - POR CONTACTAR | Ninguna | Entrada, recién llegado |
| SEGUIMIENTOS - 1/2/3 CONTACTOS | Ninguna | Intentos de recontacto (agrupa varios intentos en una sola columna, no una por intento) |
| LEAD REACTIVADO | "LEAD REACTIVADO" (Ativa) | Respondió, vuelve a estar en juego |
| PAGO PENDIENTE | "AD. [TAG VENTAS REMARKETING]" (Ativa) | Dijo que sí de nuevo |
| VENTA GANADA | "RETENCION 1 [RMKG]" (Ativa) | Cerrado |
| CERRAR SIN VENTA | "RETENCION 2 [RMKG]" (Ativa) | Perdido definitivo |

## Nombre real de la pipeline y columnas (corregido tras verlo en vivo)
La pipeline se llama **`FV| RMKG - REMARKETING`** (así, con el prefijo pegado — renombrada por el usuario para no confundirla con la real "Pipeline RMKG - REMARKETING", ver abajo). Las columnas, a diferencia de "Funil De Ventas", se dejaron con el nombre real SIN prefijo `FV`, porque ya alcanza con el nombre de la pipeline para distinguirlas:
1. `REMARKETING - POR CONTACTAR`
2. `SEGUIMIENTOS - 1/2/3 CONTACTOS` (acá el agente hace los reintentos usando tags para contar intentos, en vez de columnas separadas por intento — simplificación respecto al patrón real)
3. `LEAD REACTIVADO`
4. `PAGO PENDIENTE`
5. `VENTA GANADA`
6. `CERRAR SIN VENTA`

## Corrección de seguridad: colisión de nombres con la pipeline real (2026-09-09)
Al crearla, quedó con el mismo nombre que la real ("RMKG - REMARKETING", sin la palabra "Pipeline" adelante que sí tiene la real: "Pipeline RMKG - REMARKETING") — en el selector de "Pipeline de Destino" de las automatizaciones eran casi indistinguibles, mismo riesgo que ya pasó una vez con la lead real "Ana Virginia" (ver [[06-seguridad-y-pendientes]]). **Se corrigió**: se renombró a `FV| RMKG - REMARKETING`.

## Convención de etiquetas
Prefijo **`FVR | `** (Funil De Ventas Remarketing, mayúsculas, con espacios — mismo estilo que `FV | ...`) — distinto del prefijo `FV | ` que usan las etiquetas de "Funil De Ventas" (ver [[03-funil-de-ventas-nuevo]]), para diferenciar de un vistazo si una etiqueta vino del funnel comercial normal o del de remarketing. Etiquetas creadas por el usuario: `FVR | REMARKETING - POR CONTACTAR`, `FVR | REMARKETING - SEGUIMIENTO`, `FVR | LEAD REACTIVADO`, `FVR | PAGO PENDIENTE`, `FVR | VENTA GANADA`, `FVR | CERRAR SIN VENTA`.

## Automatizaciones — plan (Entrada en la Tarjeta → Asignar Etiqueta, mismo patrón que la pipeline real)
Replica el patrón real (solo etiqueta, sin mensajes — ver [[02-pipeline-comercial-real]]):
- `REMARKETING - POR CONTACTAR` → sin automatización (como la real, es la entrada)
- `SEGUIMIENTOS - 1/2/3 CONTACTOS` → sin automatización (como la real, el agente maneja los reintentos)
- `LEAD REACTIVADO` → Entrada en la Tarjeta → Asignar Etiqueta `FVR | LEAD REACTIVADO`
- `PAGO PENDIENTE` → Entrada en la Tarjeta → Asignar Etiqueta `FVR | PAGO PENDIENTE`
- `VENTA GANADA` → Entrada en la Tarjeta → Asignar Etiqueta `FVR | VENTA GANADA`
- `CERRAR SIN VENTA` → Entrada en la Tarjeta → Asignar Etiqueta `FVR | CERRAR SIN VENTA`
Estado: ✅ las 4 creadas (2026-09-10), nombradas `Ad. [Tag Lead Reactivado]`, `Ad. [Tag Pago Pendiente]`, `Ad. [Tag Venta Ganada]`, `Ad. [Tag Cerrar Sin Venta]` — todas Inativa a propósito, igual que el resto del proyecto, hasta que el agente esté listo.

## Conexión con Funil De Ventas (✅ hecho)
La columna `FV | DERIVAR A REMARKETING` (en la pipeline Funil De Ventas) ya tiene la automatización **"Enviar a Remarketing"**, **Activa**: Disparador Entrada en la Tarjeta → Acción Cambiar de Columna → Pipeline `FV| RMKG - REMARKETING` → Columna `REMARKETING - POR CONTACTAR`. Es la única automatización activada de todo el proyecto hasta ahora (las demás siguen Inativa a propósito, hasta que el agente esté listo — ver [[06-seguridad-y-pendientes]]).

## Decisión de arquitectura del agente
Se evaluó un agente separado para Remarketing y se descartó — un solo Agente de IA maneja todo, con lógica condicional por etiqueta/etapa (ver [[01-agente-de-ia]], sección "Decisión de arquitectura").

## Pendiente
- Terminar de crear las 4 automatizaciones de etiqueta de arriba.
- Decidir qué mensaje/lógica usa el Agente de IA en remarketing (distinto de la venta original — acá el cliente ya fue contactado antes y no compró, o compró y se lo quiere reactivar).
- **Problema detectado (2026-09-10, ver [[07-estrategias-pendientes-agente]])**: no todos los que llegan a Remarketing están "fríos" — algunos compran de una. Falta lógica de detección temprana en la conversación para no tratar a todos igual.
- **Pendiente (2026-09-10, ver [[07-estrategias-pendientes-agente]])**: definir destino para clientes a los que se les hizo frente a todas las objeciones y aun así rechazan la compra — un "Venta Sin Cerrar" distinto de simplemente no responder.
