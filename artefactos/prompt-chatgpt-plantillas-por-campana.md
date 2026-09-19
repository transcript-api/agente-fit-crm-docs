# Prompt para ChatGPT — copy de las 5 plantillas de WhatsApp por campaña

> Uso: pegar todo lo que sigue en una conversación nueva de ChatGPT. Guardado acá para no perderlo
> y para que quede junto al resto de la documentación del remarketing masivo
> ([[31-envio-masivo-remarketing-cupon]]).

---

## PROMPT (pegar desde acá)

Estoy armando una campaña de remarketing por WhatsApp para una tienda de suplementos deportivos
(Fitness Suplementos, Uruguay). Tengo ~2.400 leads viejos, sin actividad hace semanas o meses,
repartidos por el anuncio que originó cada uno. La idea es reactivarlos con un cupón de descuento,
uno por cada línea de producto.

**Contexto técnico que tenés que respetar** (no es negociable, son reglas reales de WhatsApp Business):

- Cada mensaje va como una **plantilla de WhatsApp** (Meta la tiene que aprobar antes, tarda de horas
  a 48hs). Una plantilla tiene: Nombre, Categoría (uso "Marketing"), un Encabezado opcional
  (**solo puede ser Texto, Imagen, Video o Documento — NUNCA Audio**), un Cuerpo de texto (hasta
  1024 caracteres, sin variables por ahora), un Pie opcional (hasta 60 caracteres), y hasta 3
  botones de "Respuesta Rápida" (hasta 25 caracteres cada uno).
- **Ya tengo una plantilla aprobada y funcionando** que sirve de modelo (se llama `cupon_general`):
  - Encabezado: Imagen (una foto con el texto "TE ESTÁBAMOS ESPERANDO", 5% OFF por 24hs, código VOLVISTE5)
  - Cuerpo: "DISPONIBLE SOLO POR LAS SIGUIENTES 24hs!"
  - Botón: "CANJEAR AHORA"
- **El descuento es el mismo para las 5 campañas: 5% OFF, código VOLVISTE5.** No inventes otro
  porcentaje ni otro código — lo que quiero que mejores es el copy y la idea de la imagen para
  que cada campaña se sienta relevante a SU producto, no genérica como quedó `cupon_general`.

**Las 5 campañas, una plantilla por cada una:**

1. **Testo Dilated** (potenciador de testosterona / ganancia muscular) — ⚠️ **esta es una campaña
   de audio**: el anuncio original y el creativo real son un audio, pero como dije arriba **el
   encabezado de la plantilla no puede ser audio**. Solución ya construida y probada: la plantilla
   lleva encabezado de Imagen (foto del producto o algo relacionado a la promesa del producto),
   y cuando el lead responde lo que sea, un sistema automático (ya armado, no es parte de tu
   tarea) le manda el audio real como mensaje libre. Vos solo pensá el copy e imagen de la
   plantilla que lo haga responder.
2. **Hipercalórico** (ganancia de peso/masa)
3. **Isolado** (proteína aislada, definición/recuperación)
4. **Woman** (línea para mujeres)
5. **Creatina** (rendimiento/fuerza)

**Lo que necesito que me entregues, para cada una de las 5:**

- `Nombre del template`: en minúsculas, sin espacios ni acentos, solo letras/números/guión bajo
  (ej. `cupon_testodilated`).
- `Descripción de la imagen de encabezado`: qué debería mostrar (no la generes vos, solo describila
  para que yo se la encargue a un diseñador o la arme en Higgsfield).
- `Texto del cuerpo` (máx. 1024 caracteres, pero cortito funciona mejor en WhatsApp — apuntá a
  1-2 líneas): el gancho de la campaña. Tiene que mencionar el 5% OFF y el código VOLVISTE5, pero
  con una entrada distinta para cada producto — no repitas la misma frase de `cupon_general` en
  las 5.
- `Pie` (opcional, máx. 60 caracteres): usalo solo si suma, si no dejalo vacío.
- `Texto del botón` (máx. 25 caracteres): puede ser "CANJEAR AHORA" en las 5 para mantener
  consistencia con el mecanismo ya armado (el sistema busca ese texto exacto para reaccionar),
  o proponeme una alternativa corta si creés que mejora la conversión — pero avisame si cambiás
  el texto del botón, porque hay que actualizarlo también del lado técnico.

**Formato de respuesta**: una sección por campaña, con esos 5 campos bien separados y fáciles de
copiar directo a un formulario.

---

## Fin del prompt

## Qué hacer con la respuesta
1. Traer las 5 respuestas de vuelta a esta conversación.
2. Revisamos juntos si el texto del botón cambia (si cambia, hay que actualizar el Flujo
   "TEST - Reacción Canjear" para que busque el texto nuevo — ver [[31-envio-masivo-remarketing-cupon]]).
3. Conseguir o generar las 5 imágenes descriptas.
4. Crear las 5 plantillas en `Recursos → Modelos de Mensajes`, con el usuario mirando.
5. Mandarlas a aprobar y anotar la fecha — la última tardó menos de 24hs, pero no asumir que
   siempre es así.
