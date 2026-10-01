# Catálogo de productos — cómo llega al agente

**Qué es**: el mecanismo real por el que un agente consulta precio/stock/descripción sin inventar. El catálogo real de la empresa vive en Bling (1094 productos), pero el camino que realmente usa el agente hoy es una planilla de Google Sheets, no Bling directo (ver por qué en [[integracion-bling]]).
**Fuente primaria**: [[20-catalogo-estructura-para-el-agente]], [[24-sesion-2026-09-14-traspaso]] §2.1, [[29-prompts-por-columna]].

## De dónde salen los datos reales (repetible sin pedirle nada a nadie)
- Productos, precios, links, SKU: `https://fitnessuplementos.com/products.json?limit=250&page=N` — endpoint **público** de Shopify, no requiere Bling ni credenciales.
- Ranking de más vendidos: `https://fitnessuplementos.com/collections/all?sort_by=best-selling&page=N` — **⚠️ corregido el 2026-09-15 (E9): este ranking NO es un dato de ventas real.** Por Shopify la empresa prácticamente no vende; el orden real de ventas hay que sacarlo de Bling. Hasta que eso se resuelva, la columna `ranking_ventas` sirve solo de desempate silencioso, nunca como argumento de venta ("es el más vendido").
- Script que regenera el CSV: `artefactos/build-catalogo.ps1`.

## Dos planillas distintas — no confundir
1. **`catalogo-agente`** (id `1NR9cthzyLKfKKRHjy2gGwfuHMH19sAHwyP92m2xuEtY`, cuenta `max.suplementos77@gmail.com`) — el catálogo completo, 421-422 productos, descripciones genéricas de Shopify. La usan hoy los agentes Seguimiento/Recompra (cuando se creen).
2. **`catalogo-agente-curado`** (id `149V0iBVQ7Dn0I_WLW3G14s6DLacXrDYvwXQbwhudRAM`) — selección curada de **10 productos** con descripciones reales y `frase_venta` propia. La usan Conversión y Cierre desde el 2026-09-16 (Q2).

Columnas del curado: `nombre | categoria | marca | precio_uyu | link | ranking_ventas | posicion_ventas | objetivo | sku | disponible_web | descripcion_base | sabores_disponibles | frase_venta`.

## Cómo se consulta (dos caminos, se usan los dos)
- **RAG (base de conocimiento)**: bueno para preguntas abiertas ("¿qué me sirve para ganar masa?"). Similaridad bajada de 0.5 a 0.35 (recomendado por la plataforma para datos estructurados). Sincroniza **en tiempo real** (confirmado por soporte) si se edita la planilla.
- **Conector de Google Sheets** ("Buscar fila de la hoja de cálculo", coincidencia exacta): mejor para preguntas puntuales de precio/link, donde el RAG podría traer la fila equivocada — que es literalmente inventar un precio. Este es el camino que usan Conversión/Cierre hoy vía `Obtener Hoja por Lote` (para elegir entre varios) y `Buscar fila` (para un producto exacto).

## Reglas de uso ya validadas en el prompt (ver [[agentes-legado-9882-9883-9884]] y [[agente-recepcionista-comercial-10005]])
- `descripcion_base` y `frase_venta` son material de referencia — nunca se copian textual, se reformulan.
- `ranking_ventas` es desempate, nunca criterio de recomendación principal ni argumento de venta.
- Si el producto pedido no está en el catálogo curado (10 productos, no todo el catálogo de la tienda), no se inventa un sustituto — se transfiere a Atención Humana.

## Lo que falta para que el catálogo soporte kits y recompra con precisión (A12)
Campos que probablemente faltan: `tipo_producto`, `es_kit`, `productos_del_kit`, `objetivos_compatibles`, `precio_actual` con timestamp, stock real, fuente del precio/stock. Sin esto, la duración estimada de un producto (necesaria para elegir la columna de Recompra correcta) se sigue infiriendo, no consultando.

## Pendientes relacionados
E9 (el ranking de Shopify no es dato de ventas real, hay que sacarlo de Bling), A12 (ampliar esquema para kits), A5 (auditar una contradicción real de stock que dio Conversión — dijo "no disponible" y después "sí hay" para el mismo producto), N19 (revisar 31 productos sin categoría y 136 sin marca detectada).
