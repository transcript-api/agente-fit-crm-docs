# Planillas de precios para el Copiloto (2026-11-02)

Cuatro planillas separadas, como pidió el usuario, con el formato que recomendó el propio Copiloto: una fila por variante, las mismas 17 columnas en las cuatro, cada fila completa por sí sola (el Copiloto no lee la planilla entera, recibe pedazos sueltos). CSV separado por punto y coma, UTF-8 con BOM: abre bien en Excel en español.

| Archivo | Qué va |
|---|---|
| `1-precios-unitarios.csv` | Precio normal de cada producto y variante. Las promos de 2 unidades del mismo producto van acá, en "Precio 2 unidades" |
| `2-kits-y-combos.csv` | Kits de productos distintos y combos con regalo |
| `3-promociones-de-anuncios.csv` | Lo que ofrece cada anuncio. La columna clave es "Campaña o anuncio (nombre exacto en el CRM)": el Copiloto ve ese nombre, no el ID |
| `4-precios-mayoristas.csv` | Vacía, para ir completando |

## Reglas para completarlas
- Celda vacía = dato que no tenemos. Nunca poner "completar" ni corchetes dentro de una celda: el Copiloto puede copiarlo a un mensaje.
- "Estado del dato": el Copiloto usa solo lo marcado "Confirmado". Lo que diga "Sin confirmar" o "falta..." no lo ofrece.
- Nombres de producto tal como se escriben en los chats. En "Cómo lo piden los clientes", las formas en que los clientes lo nombran.
- Nombre de campaña exacto como aparece en el CRM, y en "Alias del anuncio" variantes simples, sin emojis ni mayúsculas.
- No usar ";" dentro de un texto: corre las columnas.

## Origen de los datos
- El CSV que pasó el usuario (`Fitness_precios_anuncios.csv`, generado el 2026-11-01): 10 productos de catálogo y 17 ofertas de anuncios. La dosis de Testo Dilated se corrigió de 2 a 3 cápsulas por día, a pedido del usuario, en ese archivo y acá.
- La lista que pegó el usuario el 2026-11-02 (agregó Testo 2 por $1.650 con sachets).
- Anuncios vistos en capturas de chats (Creatina XTR 650 g $1.490, Testo con 30 cápsulas extra $990).
- Dos precios que vendedores pasaron a clientes, marcados "Sin confirmar" (creatina DUX 300 g $990, Vasculor $1.450).

## Falta
- Nombres exactos de varias campañas (columna vacía en promociones).
- Proteína isolada de Integralmédica, tamaños de My Whey, Whey 100% y Beef Protein, sabores.
- Pre entrenos, colágenos, magnesio, multivitamínicos: el análisis de precios del Copiloto encontró precios distintos en los chats para el mismo producto; hay que definir cuál vale.
- Costo de envío.

## Dónde se cargan
Según el Copiloto: `Agente de IA → Base de Conhecimento` (no como tabla en la Rede neural). **Todavía no están cargadas.**
