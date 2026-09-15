# Reglas de diseño para las presentaciones de Fitness Suplementos

**Por qué existe este archivo.** Las primeras dos versiones del deck salieron genéricas: cajas rectangulares con borde de color, grillas ordenadas, cero fotografía. El usuario lo rechazó dos veces con razón. Estas son las reglas para no repetirlo.

## La referencia
El estilo objetivo es el de **Mobile Editing Club** y los carruseles de Instagram que pasó el usuario: fotografía real a sangre, tipografía blanca enorme encima, mezcla de sans bold con itálica serif, pastillas de acción abajo, objetos flotando en perspectiva.

---

## 🚫 La regla que manda sobre todas: no decir lo obvio

**Si el que lee ya lo sabe, no va.** Corrección del usuario, 2026-09-15, textual:
*"un líder, un profesional sabe, no son burros... si no vas a andar siempre poniendo algo que
nadie quiere saber porque es obvio."*

Cada línea obvia ocupa el lugar de una que sí aporta. Y además suena condescendiente: se lo estás
explicando a alguien que dirige el negocio.

Ejemplos reales de esta misma presentación:

| Salió así | Por qué está mal | Quedó así |
|---|---|---|
| *"El equipo no falla por falta de ganas… Es capacidad, no actitud."* | Nadie pensó que el equipo no tiene ganas | **"De seis operadores a tres o cuatro. El volumen no bajó."** |
| *"tu catálogo real"* (nota en la portada) | Que el catálogo es de ellos es obvio | Se borró |
| *"No son visitas anónimas."* | Nadie pensó que eran visitas | Pendiente de reemplazo |

**Test antes de escribir cualquier línea:** ¿esto se lo estoy contando o se lo estoy recordando?
Si es lo segundo, se borra.

### Los otros cuatro filtros (se aplican a cada línea, junto con el de arriba)

2. **¿Le estoy diciendo qué hacer con su negocio?** → se saca. Nada sobre su tráfico pago, sus precios ni su estrategia. Se aporta el hecho; la conclusión la sacan ellos.
3. **¿Este número es medido o me lo contaron?** → si me lo contaron, hay que decirlo donde aparece.
4. **¿Esto suena más grande de lo que es?** → bajarlo.
5. **¿Esto lo lee él en voz alta o lo leen ellos?** → las bajadas son su apunte para hablar: una o dos líneas secas, no un párrafo.

### El tono

Que suene a él, no a un consultor. Lo que **no** tiene que parecer, textual suyo:
*"una persona que se siente llevando, que es muy entrometida y solo quiere forzar que sabe."*

| No va | Va |
|---|---|
| Demostrar que sabemos | Poner una observación sobre la mesa |
| Sacar pecho por los hallazgos | Decir el estado y seguir |
| Explicar el negocio de ellos | Explicar lo que hace el agente |
| Párrafos elaborados | Frases cortas |

**Si una frase se puede leer como "mirá todo lo que descubrí", está mal escrita.**

### Contar el estado, no la historia

No narrar "esto estaba roto y lo arreglamos" — ocupa lugar para no decir nada.

- ❌ *"Inventaba precios. La causa era la planilla. Corregido."*
- ✅ *"Responde con el catálogo real. El precio y el link salen de ahí."*

Y los bugs del proveedor: **Santiago no es su soporte.** Solo va lo que efectivamente le impide
avanzar. Textual: *"a mí no se me pidió que integrara Bling… tenés que usar ese tiempo para
poner cosas interesantes."*

Corolario que viene del mismo lugar: **no inflar**. El usuario bajó "siete días" a "cinco" por su
cuenta, para no parecer que estaba agrandando el trabajo. Los números van para abajo, nunca para
arriba.

## ❌ Prohibido (los errores que ya cometí)

1. **Nada de cajas con borde izquierdo de color.** Es el cliché más reconocible de diseño generado por IA.
2. **Nada de grillas simétricas de tarjetas iguales.** Si hay tres cosas, no van en tres columnas idénticas.
3. **Nada de láminas sin fotografía.** Cada lámina lleva una foto real, una captura real o un render con volumen. Texto sobre fondo plano = lámina muerta.
4. **Nada de una sola familia tipográfica.** Mínimo tres roles visibles: display condensada, itálica de acento, y texto.
5. **Nada de todo contenido dentro del marco.** Al menos un elemento por lámina se sale del borde o lo cruza.
6. **Nada de íconos SVG genéricos** (el check, el círculo con "i"). Si hace falta un símbolo, que sea un objeto real.
7. **Nada de gradientes de dos colores como fondo principal.**

## ✅ Obligatorio en cada lámina

1. **Un objeto real anclando la composición**: producto recortado, captura del CRM, mockup de teléfono, o render 3D.
2. **Jerarquía tipográfica en tres niveles como mínimo**, con al menos una palabra en itálica de acento dentro del titular.
3. **Una anotación manuscrita** (Caveat) con flecha dibujada, apuntando a lo que importa.
4. **Profundidad real**: rotaciones de 1-8°, sombras largas, elementos superpuestos, desenfoque en las capas de atrás.
5. **Una pastilla de acción o etiqueta** al estilo de las referencias (`VER EL DETALLE →`).
6. **Grano o textura** sobre el fondo, nunca color plano puro.

## Sistema de marca

| Elemento | Valor |
|---|---|
| Fondo | `#070F16` azul marino casi negro |
| Acento | `#A8E831` verde lima (del logo) |
| Alerta | `#E8321E` rojo — **solo** para lo que se pierde |
| Texto | `#FFFFFF` / `#9FB2C0` secundario |
| Display | Archivo Black |
| Itálica de acento | DM Serif Display *italic* |
| Manuscrita | Caveat |
| Texto | Jost (300 / 400 / 500 / 600) |

> Las dos últimas cambiaron el 2026-09-15. Se probó con Barlow + Instrument Serif y quedaba plano:
> Barlow es demasiado neutra al lado de Archivo Black, y la itálica de Instrument Serif no tiene
> suficiente contraste de grosor para funcionar como acento a 80px. **Jost + DM Serif Display** es la
> combinación que está en producción en las 10 láminas.

## Sobre el logotipo
**No se redibuja nunca con IA.** Se recrea tipográficamente con su estructura original (condensada, itálica, `®` arriba, `SUPLEMENTOS` con tracking amplio) y se le da volumen con capas de sombra. La IA deforma logos conocidos.

## Sobre marcas de terceros
Meta, WhatsApp y DKW se muestran **tal cual**, con tratamiento de profundidad por CSS. Nunca generadas ni alteradas: en una comparación, la marca ajena tiene que verse exacta.

## Fotografía de producto
Las fotos salen del catálogo real (`fitnessuplementos.com`), se les quita el fondo con Higgsfield (`image_background_remover`) y se usan recortadas, flotando, con sombra proyectada. Para escenas lifestyle se usa la skill `higgsfield-product-photoshoot`.

## El sistema que quedó (2026-09-15)
Cada lámina se arma con esta receta, que es la de las referencias de Mobile Editing Club:

1. **Foto a sangre** ocupando las 1440×810, con un degradado direccional encima que abre espacio para el texto de un solo lado.
2. **Grano SVG** (`feTurbulence`, `mix-blend-mode: overlay`, opacidad ~0.45) sobre todo.
3. **Logo centrado arriba**, siempre en el mismo lugar — es lo que hace que se lea como una serie.
4. **Titular partido en dos**: Archivo Black en mayúsculas + DM Serif Display itálica en verde o rojo.
5. **Un objeto rompiendo el borde**: producto recortado, la captura del CRM en perspectiva, o las monedas 3D.
6. **Nota manuscrita + flecha** apuntando al dato que importa.
7. **Pastilla** abajo con la idea que se tiene que llevar.

### Cómo verificar antes de publicar
Se arma una hoja de contacto: un HTML con las 10 láminas en `<iframe>` escalados a 0.5, servido por
un servidor estático local (Playwright bloquea `file://`), y se saca **una** captura de página completa.
En esa sola imagen se ven los choques de elementos — que fue exactamente lo que apareció en la primera
pasada: la nota manuscrita del embudo encima del "~30%", las monedas tapando el pie de "Costo", y la
fecha de portada detrás del bote de producto. Sin esa verificación se publican rotas.

### Qué se puede publicar y qué no (comprobado, 2026-09-15)
El `publish` del canvas se **denegó** con el motivo `Live-Shared Artifact Sensitive Delta` mientras la
lámina "Lo construido" llevaba embebida la **captura real del pipeline del CRM**. Los nombres y teléfonos
estaban desenfocados y aun así no pasó. Sacando esa imagen, el publish entró a la primera.

**Regla:** en un artifact compartido por link no van capturas de pantalla con datos de clientes,
ni siquiera desenfocadas. Las cifras agregadas sí (`2.535 negocios en el pipeline` quedó, y es
lo que realmente importa en la lámina). Para reemplazar la captura se usó `chat3d.jpg`, un render
3D sin ningún dato.

### Archivos
Los `.dc.html` de las láminas, las imágenes y `canvas.json` viven en el scratchpad de la sesión
(`scratchpad/deck/`), no en el repo: pesan ~500 KB de fotos y se regeneran con `seed-canvas.mjs`.
Lo que se conserva acá son las reglas, no los binarios.
