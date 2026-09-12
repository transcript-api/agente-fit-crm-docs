# "FV|RECOMPRA" — pipeline de práctica de Recompra

**Estado: ✅ creada (2026-09-11)** — pipeline `FV|RECOMPRA`, tipo "Pós-venda" (se descubrió que existe un selector de "Tipo da pipeline": Padrão/Pré-venda/Pós-venda — no documentado antes, pendiente de investigar si afecta funcionalidad o es solo categorización). 3 columnas creadas: `RECOMPRA - 30 DIAS`, `RECOMPRA - 60 DIAS`, `RECOMPRA - 90 DIAS`. Sin automatizaciones todavía.

Pipeline nueva para clientes que ya compraron, decidida el 2026-09-11 junto con la v3 del prompt (ver [[13-prompt-agente-fit-v1]]). Mismo agente que el resto (no uno separado — decisión confirmada por el usuario, mismo criterio que [[08-funil-remarketing-nuevo]]: evitar duplicar mantenimiento de conocimiento/guardrails en varios prompts).

## Problema que resuelve
Los productos duran distinto (algunos ~30 días, otros hasta ~90) — un solo temporizador fijo de columna no sirve para todos. Un cliente real ya existente en la cuenta ("Pipeline Recompra") se maneja hoy con recordatorios manuales del vendedor (~cada 30 días aprox, visto en transcripciones reales, ver [[04-patrones-reales-de-venta]]) — la idea es automatizar esto respetando la duración real de cada producto.

## Estructura propuesta: 3 columnas por duración
1. `RECOMPRA - 30 DIAS`
2. `RECOMPRA - 60 DIAS`
3. `RECOMPRA - 90 DIAS`

El agente, al cerrar una venta (Etapa 3 del prompt), transfiere el negocio a la columna correspondiente según la duración estimada del producto vendido (dato que debe estar cargado en Productos Comerciales — pendiente).

## Automatizaciones — estado actual (2026-09-11)
✅ Creadas las 3 de tracking básico (Entrada en la Tarjeta → Asignar Etiqueta), todas Inativa:
- `Ad. [Tag Recompra 30 Dias]` → `FVR|Recompra 30 Dias`
- `Ad. [Tag Recompra 60 Dias]` → `FVR|Recompra 60 Dias`
- `Ad. [Tag Recompra 90 Dias]` → `FVR|Recompra 90 Dias`

Todavía SIN automatización de reactivación por tiempo — pendiente de decidir el mecanismo (ver más abajo).

## Automatizaciones planeadas por columna (mismo patrón que Funil De Ventas)
Para cada una de las 3 columnas:
- Disparador: Tiempo en la Columna · [duración de la columna + margen de unos días, no exacto — mismo principio de "no escribir justo el día que se termina" ya aplicado en el resto del proyecto]
- Acción: Asignar Etiqueta (`FVR|Recompra 30 Dias - Seguimiento` o equivalente por columna) + Cambiar de Columna → probablemente a una columna de "Recompra - Seguimiento" o directo reactivar vía Follow Up Generativo (a definir).
- Excepción: Intercambio de Mensajes (mismo patrón ya usado en Funil De Ventas) — aunque, como se charló, si el cliente escribe antes por su cuenta, lo más probable es que el AGENTE ya lo mueva de columna en tiempo real (ver Etapa Recompra del prompt), dejando la automatización sin efecto para ese caso, sin necesitar depender 100% de la excepción.

**Aclaración importante (2026-09-11)**: las 3 columnas de Recompra son solo una "sala de espera" por tiempo, NO un lugar de conversación activa — no existe una 4ª columna "recompra en curso". Cuando el cliente responde (desde cualquiera de las 3), el agente lo saca de `FV|RECOMPRA` y lo devuelve a la pipeline principal `FV|FUNIL DE VENTAS`, a `FV|PROPUESTA ENVIADA` (si va a decidir qué llevar) o directo a `FV|PAGO PENDIENTE` (si confirma que quiere repetir lo mismo).

**Pendiente de definir**: qué pasa exactamente cuando se cumple el tiempo — ¿el mensaje de reactivación lo manda una automatización fija, o el Follow Up Generativo del agente (mejor, ya que puede personalizar según lo que compró)? Por consistencia con el resto del proyecto (ver [[03-funil-de-ventas-nuevo]], sección de cupón dinámico), probablemente conviene que sea Follow Up Generativo, no un mensaje fijo.

## Memoria del cliente (variables guardadas por el agente al cerrar la venta)
- `ultimo_producto_comprado`
- `fecha_compra`

Estas persisten en la ficha del contacto independientemente del historial de chat (que tiene un tope de ~30 mensajes) — es la forma confiable de que el agente "recuerde" que ya es cliente, sin depender de que la conversación vieja siga visible.

## "Productos Comerciales" — estructura real confirmada (2026-09-11)
Hoy está **vacío** (0 productos cargados). Se abrió el modal "Novo Produto" para ver los campos disponibles: **solo tiene 2 campos — "Nombre" y "Valor"** (el campo Valor trae el prefijo **"R$" (reales brasileños)** precargado, a pesar de que el negocio factura en Uruguay — pendiente confirmar con el usuario en qué moneda cargar los precios, o si hay que poner el número igual y aclarar la moneda en el nombre).

**No hay campo de duración, categoría ni descripción.** Esto significa que "Productos Comerciales" solo puede resolver la parte de precio/nombre exacto (lo que el agente necesita para no inventar precio — ver [[06-seguridad-y-pendientes]]), pero NO alcanza para:
- La **duración por producto** (necesaria para el cálculo de Recompra vía el nodo Data & Hora, ver [[15-flujos-automatizacion-avanzados]]) — no tiene dónde vivir en este catálogo.
- Las **descripciones cualitativas** (para que el agente explique por qué sirve cada producto) — tampoco tienen dónde vivir acá.

Duración y descripciones van a necesitar otro lugar: lo más simple es una tabla aparte (hoja de cálculo o documento) que se le pase al agente como conocimiento/RAG, con Nombre, Valor (fuente de verdad = Productos Comerciales), Duración en días, y Descripción — evitando que el agente tenga que inventar cualquiera de los tres.

## ✅ Flujo de reactivación construido (2026-09-11)
Ver [[15-flujos-automatizacion-avanzados]] para el detalle completo — se construyó y publicó (en estado Off) "FV|Recompra - Reactivación": Negócio mudou de etapa (FV|VENTA GANADA) → Delay 30 días fijo → Tag `FVR|Recompra 30 Dias` → Buscar Conversa → Vincular Agente Fit. El diseño original con Data & Hora calculando la fecha exacta no fue viable (el Delay no acepta variables) — quedó con 30 días fijos como placeholder.

## Pendiente antes de que esto funcione con datos reales
1. Cargar Productos Comerciales con Nombre + Valor real (el catálogo del usuario vive en Bling, 1094 productos — ver [[06-seguridad-y-pendientes]]).
2. Definir dónde vive la duración y la descripción de cada producto (ver sección de arriba) — probablemente una tabla aparte, no el catálogo nativo.
3. Confirmar que `Transferir coluna no CRM` funciona como se espera dentro de "Agente fit" (pendiente de prueba real, ver [[13-prompt-agente-fit-v1]]) — bloqueado por la Clave API rota del agente.
4. Duplicar el flujo para 60 y 90 días (cada uno con su propio Delay fijo) una vez que se sepa qué producto va a cada bucket — o rediseñar cuando haya un campo de duración real por producto.

## Próximo paso inmediato
Crear la pipeline `FV|RECOMPRA` con las 3 columnas en el CRM (guiado paso a paso, mismo método que se usó para [[08-funil-remarketing-nuevo]]) — se puede hacer sin esperar el catálogo, igual que se hizo con Remarketing.
