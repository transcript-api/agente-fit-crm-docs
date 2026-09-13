# Estructura del catálogo para que el agente recomiende bien (y priorice los más vendidos)

## Para qué es este archivo
El prompt de producción ya le dice al agente *"priorizá siempre las de mayor rotación/stock"* (ver [[13-prompt-agente-fit-v1]], Etapa 2) — **pero hoy el agente no tiene ningún dato que le diga cuáles son esas**. Esta instrucción está escrita y no se puede cumplir. Este archivo define cómo cargar el catálogo real para que esa regla (y las recomendaciones por categoría) funcionen de verdad.

Estado: **estructura definida, sin datos cargados todavía** — falta el export de Shopify (ver [[19-investigacion-externa-escalabilidad]] y la sesión del 2026-09-13 en [[17-registro-de-cambios]]).

## Decisión: ¿un archivo por categoría, o uno solo con columna de categoría?
La idea original era separar en varios archivos (creatina, proteína, etc.) para que el agente "no gaste tokens buscando entre todo mezclado". Matiz técnico importante:

- Si el catálogo se carga como **"Fuente de conocimiento externa" / base de conocimiento (RAG)** — que es el camino recomendado, ver la pestaña "Conocimiento" del editor del agente — **el agente NO carga todo el catálogo en contexto**. El RAG busca por similitud y solo le llegan las filas relevantes. O sea: el costo en tokens no crece con el tamaño del catálogo de la forma que preocupaba.
- Donde SÍ importa separar es en **precisión de recuperación**: con todo mezclado, una consulta de "creatina" puede traer filas de proteína con palabras parecidas.

**Recomendación: un solo archivo/planilla con una columna `categoria`, no varios archivos.** Motivos: se mantiene en un solo lugar (un export de Shopify actualiza todo de una), y el filtro por categoría se resuelve igual con la columna + el umbral de similitud en 0.35 (valor que la propia plataforma recomienda para datos estructurados).

**Cuándo sí conviene separar en varios**: si se confirma que el CRM permite elegir *qué base de conocimiento consultar* según el contexto de la conversación (no verificado todavía). Si eso existe, separar da una mejora real de precisión. Queda como pendiente de verificar en la pestaña "Conocimiento".

## Esquema de columnas propuesto
| Columna | Para qué sirve | Ejemplo |
|---|---|---|
| `nombre` | Lo que el cliente va a nombrar | ON CREATINA 300G - OPTIMUM NUTRITION |
| `categoria` | Filtro principal de recomendación | creatina |
| `marca` | Para ofrecer alternativas de otra marca (ya está en el prompt como táctica) | Optimum Nutrition |
| `precio` | Para no inventar precios (conecta con el guardrail y la regla del prompt) | — |
| `link_shopify` | El agente manda el link directo al producto | fitnessuplementos.com/products/{handle} |
| `descripcion_base` | **Material de referencia, NO para copiar textual** — el agente lo reformula persuasivo y corto | — |
| `objetivo` | Mapea directo con la variable `objetivo_lead` que el prompt ya guarda | ganar masa muscular |
| `ranking_ventas` | Lo que hace cumplible la regla "priorizá los de mayor rotación" | A / B / C (o 1-N) |
| `id_bling` | Para consultas puntuales por API (el único endpoint de Bling que hoy funciona bien) | 16700918516 |

Dos columnas que valen especialmente:
- **`objetivo`** — el prompt ya guarda `objetivo_lead` (bajar de peso / masa muscular / rendimiento / salud general) en la Etapa 1. Si el catálogo tiene la misma clasificación, el agente puede cruzar las dos cosas directamente en vez de adivinar qué producto sirve para qué.
- **`ranking_ventas`** — sin esto, la instrucción de priorizar más vendidos es letra muerta. No hace falta un número exacto de ventas: alcanza con 3 niveles (A = los que más salen, B = normales, C = los que casi no rotan).

## Categorías detectadas en el catálogo real
Derivadas de los ~100 productos reales que se pudieron leer de la API de Bling el 2026-09-13 (no del catálogo completo de ~1094 — falta el export de Shopify para confirmar y completar):

- **proteínas** — WHEY GOLD STANDARD/ISOLATE, DARK WHEY, CARNIBOL, ISO 100, WHEY PROTEIN CONCENTRADO/ISOLADO, MASTODON
- **creatina** — ON CREATINA 300G (y varios KITs que la incluyen)
- **termogénicos / quemadores** — THERMA PROHARDCORE, PRO ABDOMEN HERS, THERMO FLAME
- **pre-entreno / energía** — ENERGY KICK, ENERGY GEL, BT NITRATO GEL, V9 DRINK, AGENT ORANGE ENERGY
- **hidratación / isotónicos** — HYDROLITE, RECHARGE, SALT RELOAD, LIQUIDZ, ITTS SERO
- **vitaminas y salud** — VITAMINA D3, VITAMINA B12, FISH OIL, MAG-3 COMPLEX
- **barras y snacks proteicos** — BOLD, PROTEIN CRISP, FLOWBAR, PACOCA/SUBLIME (BENDU)
- **pasta de maní** — DR. PEANUT
- **fibras** — FIBERLIFT, NATURAL FIBER, PURA FIBER
- **carbohidratos** — MALTO DEXTRINA
- **accesorios** — STRAP, MOCHILA, COQUETELEIRA, CANECA, Vaso Shaker
- **combos / kits** — todos los que arrancan con "KIT ..." (ver [[18-integracion-bling]]: en Bling son productos normales, se distinguen solo por el nombre)

## De dónde sale el dato de "más vendido"
No lo tenemos hoy. Opciones, de más a menos confiable:
1. **Shopify Admin → Analytics → Reports → "Sales by product"** — dato real de ventas, exportable. Es el camino más directo y no depende de la API rota de Bling.
2. **Reportes de ventas de Bling** (por interfaz, no por API) — sirve si hay ventas fuera de Shopify (mostrador/POS) que Shopify no ve.
3. **El criterio del equipo** — los vendedores saben cuáles salen más; sirve como arranque rápido y como control de sanidad de lo que digan los reportes.

Lo ideal es cruzar 1 y 2 (para no ignorar las ventas presenciales) y validar con 3.

## Qué falta (en orden)
1. Exportar el CSV de productos de Shopify (ver pasos en [[17-registro-de-cambios]], sesión 2026-09-13).
2. Exportar el reporte de ventas por producto de Shopify para llenar `ranking_ventas`.
3. Armar la planilla única con el esquema de arriba y subirla a Google Sheets.
4. Vincularla en el editor del Agente Fit → pestaña **Conocimiento** → "Agregar fuente externa", y bajar **Similaridade mínima para busca (RAG) a 0.35** (la propia plataforma lo recomienda para datos estructurados; hoy está en 0.5).
5. Agregar al prompt dos líneas: que use el catálogo como material de referencia y **nunca copie la descripción textual** (reformular corto y persuasivo), y que al recomendar dentro de una categoría priorice los `ranking_ventas` = A salvo que el cliente pida otra cosa.
