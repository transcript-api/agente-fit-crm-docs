# 53 · Maxi: lo que se le aclara al agente no se le explica al cliente (2026-11-11)

Estado: **instalado el 2026-11-12 con el OK del dueño (primera tanda y segunda tanda juntas)**. Resumen público, sin datos del servidor, identificadores ni teléfonos. Sigue al [[17-registro-de-cambios]] y a las reglas de [[reglas-recepcion-hermes]].

## Qué pasó
Un cliente escribió con el texto automático del anuncio, que ya traía el producto y el precio. Maxi le contestó explicándole que ese precio «ya es el de la promo». El cliente no había dudado de nada. El dueño lo vio en una captura y sospechó que el guion decía eso: tenía razón. Después pidió revisar **todos** los prompts, no solo ese, y evitar las respuestas genéricas («por ahora va bastante bien, vamos a mejorar todo esto»).

## Por qué pasó
Una aclaración **interna** del dueño al equipo («ese precio ya es la promo, no hay promo por dos» sirve para no ofrecer una segunda unidad con descuento) viajó al cliente por cinco lados: la instrucción del primer mensaje, el guion de recepción, el texto de la oferta en los hechos, la nota de las planillas y las atribuciones «confirmado por el dueño» pegadas a frases de los hechos. El revisor automático lo aprobó porque el dato era cierto y cumplía la instrucción: ninguna de sus reglas decía «no expliques lo que el cliente no preguntó».

## Qué se revisó (ocho lugares)
La instrucción del primer mensaje y los motivos de reescritura en el código del puente; el guion de recepción; los hechos por anuncio; el conocimiento de productos; las planillas del catálogo; **la política general de la empresa** (se encontró al final y resultó la fuente principal de frases copiadas, porque el redactor la recibe entera en cada respuesta y tenía ejemplos entre comillas y dos entradas basura); los perfiles del redactor y del revisor (solo lectura) y las 626 respuestas ya enviadas como evidencia.

## Qué se midió (626 respuestas enviadas a 362 clientes)
- La explicación «ya es promo» salió en 33 respuestas a 32 clientes desde el 9/11.
- 54 respuestas (52 clientes) repitieron el mismo beneficio de la creatina palabra por palabra: el conocimiento estaba escrito como frases listas y decía «usar con estas palabras». Con las variantes («acompañar la recuperación», «acompañar la ganancia») la nueva guardia marca hasta 113 respuestas en el peor caso, sin mirar lo que preguntó el cliente.
- Doce más repitieron una pregunta de objetivo copiada de ejemplos entre comillas del guion, de la instrucción de reescritura, del revisor y de la política general.
- Preguntas de relleno («tenés alguna duda», «qué te gustaría saber»): doce.
- Ninguna respuesta dijo «dueño» ni «confirmado»: las marcas de procedencia como dato suelto no se filtraron; sí las que estaban dentro de frases.
- Dos reglas se pisaban: «la compra explícita manda» contra «el texto del anuncio no es compra directa», y «nunca empezar con Perfecto» contra las muletillas del guion (decidido el 2026-11-12: ver la segunda tanda, más abajo).

## Qué cambia (paquete bak67)
1. **Instrucción del primer mensaje por casos** (con promo, con precio sin promo, sin precio, producto no claro), sin frases de ejemplo y con el producto dentro de la pregunta.
2. **Datos como datos, no como guion:** los beneficios de producto pasan a listas (sirve para, uso, rinde); las atribuciones y explicaciones salen de los textos que se pueden copiar; la restricción «no ofrecer promo por dos» queda aparte de la oferta.
3. **Guion y política general:** sección nueva «lo interno no se dice»; los ejemplos entre comillas pasan a descripción; la política deja de traer frases de arranque y preguntas fijas, pierde las entradas basura y suma dos reglas (no explicar lo que el cliente no preguntó; los ejemplos son de tono, no para copiar). Se conservan los textos fijos aprobados (ubicación, datos de envío, audio ilegible, mayoristas).
4. **Guardia mecánica en el código:** si una respuesta explica una aclaración interna, copia un beneficio genérico o cierra con una pregunta de relleno, y el cliente no preguntó por ese tema, se reescribe una vez; si sigue, se saca solo esa oración cuando queda una pregunta; si no, sale igual (nunca silencio) y queda anotado. Si el cliente sí preguntó (por la promo, por el anuncio, para qué sirve), se le contesta normal. El filtro de frases que el dueño ya había prohibido («ya venís tomando», «sería tu primera vez»…) ahora frena también sus variantes («ya estás tomando…?», «ya tomaste… alguna vez?»), que se le escapaban.
5. **Chequeador previo:** antes de instalar cualquier cambio de prompt o dato se busca el mismo patrón en los ocho lugares (en vivo 27 hallazgos, en el paquete 0).

## Pruebas sin envíos
Todo sin enviar nada: el cliente simulado habla con el redactor y el revisor reales, con el CRM bloqueado.
- **Chequeador de prompts:** en vivo 27 hallazgos (19 en datos y 8 en la política general); en el paquete 0.
- **Guardia:** 75 verificaciones automáticas (50 de frases, 17 de frases prohibidas y sus variantes, y 8 del flujo completo con un redactor simulado que filtra a propósito), todas bien. Detecta la aclaración interna, el beneficio copiado y la pregunta de relleno; si el cliente sí preguntó por ese tema, contesta normal; si la reescritura falla, saca la oración y, si no queda nada más, sale igual y queda anotado (nunca silencio).
- **Historial:** sobre las 635 respuestas ya enviadas, la guardia (en el peor caso, sin mirar qué preguntó el cliente) habría frenado 119, de 112 clientes.
- **13 escenarios** (primer mensaje con precio, con promo, sin producto claro, pregunta por promo o descuento, regalo de 100 g, «para qué sirve»…): con lo instalado hoy, 14 frases genéricas en 44 mensajes (el beneficio de la creatina repetido, «fuerza o recuperación»); con el paquete, 0 en 36.
- **Ejemplo:** primer mensaje con producto y precio: antes «saludo + beneficio genérico + ¿fuerza o recuperación?»; ahora «saludo + ¿sería solo la creatina o querés sumar algo más al pedido?». Si pregunta por la promo, se le responde eso; si pregunta «para qué sirve», recién ahí se explica el beneficio; si dice que el regalo es de 100 g, se aclara que son 150 g y se sigue con una pregunta concreta.
- **Encontrado y arreglado en las pruebas:** dos preguntas de relleno que la guardia no detectaba, un reintento del código viejo que podía traer de vuelta la aclaración si la reescritura fallaba, y una variante de «ya venís tomando» («ya estás tomando alguno de los dos?») que el filtro de frases prohibidas no conocía.
- **Tres conversaciones largas**, repetidas (promo → precio → «quiero la de dos»; promo → «para ganar masa» → sabores → gramos de la creatina; promo → precio → «la quiero» → datos de envío): con lo instalado hoy, las cuatro corridas traen el beneficio genérico en el primer mensaje o en la recomendación (5 mensajes); con el paquete, 0 en siete corridas (51 mensajes). El primer mensaje pregunta por la promo con los datos concretos (150 g de creatina con una proteína, 300 g con dos), el precio se contesta sin explicar de más y, cuando el cliente pide la de dos, se pasa a los datos de envío (en las tres corridas de la versión final; una corrida anterior pidió solo la localidad antes de la plantilla). El cierre con la plantilla fija es igual al de hoy.
- **Falta probar:** los audios y los casos de envío con datos reales; se vigilan con el monitoreo después de instalar.

## Regla de trabajo
Lo que el dueño aclara es interno: se escribe como dato o restricción, nunca como «decilo» para el cliente; se dice solo si el cliente lo pregunta. Cualquier cambio de prompt pasa por: clasificar lo aclarado, buscar en todos los lugares (la política general incluida), probar sin enviar contra lo vivo y correr el chequeador.

## Lo que no se toca sin OK del dueño
Los perfiles del redactor y del revisor (propuesta preparada: la pregunta puente deja de exigir una redacción, y el revisor pasa a rechazar explicaciones que el cliente no pidió) y cualquier instalación en producción.


## Segunda tanda (2026-11-12): estilo, venta dinámica y un límite oculto de tamaño
Estado: **instalado el 2026-11-12 con el OK del dueño**; se vigila en los cortes de monitoreo. Se amplió a pedido del dueño después de ver conversaciones reales.

**Lo que pidió el dueño y cómo quedó**
- «Perfecto» y «Dale» **no están prohibidos**: se usan según la ocasión (al cerrar con el nombre pidiendo los datos de envío; al confirmar el pedido exacto cuando el cliente dice que es eso), no como reflejo. Esto resuelve la regla que se pisaba con las muletillas del guion.
- **Explicar como dato:** la información correcta queda como dato; no se explica la promo si no preguntan. El dueño va a cargar descripciones de anuncios y videos.
- **Nombres con criterio:** si el nombre del perfil no parece de persona (apodos, «gym», «mamá», saludos), no se usa. Una lista de palabras que no son nombre lo asegura en el código.
- **Mensaje automático del anuncio:** si el producto y el precio coinciden con las fuentes, no se le pide al cliente que los confirme; se corrige solo si algo está mal.
- **No repetir:** una guardia nueva en el código marca una oración larga que dice casi lo mismo que algo ya enviado en la charla (por ejemplo, el nombre del producto tres veces) y pide una reescritura que sume algo nuevo; si no se logra, se saca solo esa oración o sale igual y queda anotado (nunca silencio). Los mensajes fijos aprobados (pedido de datos, plantilla) pueden repetirse.
- **Venta más dinámica:** complementos, kits y versiones superiores siempre con su razón, de a uno por mensaje y antes de que el cliente fije la cantidad; el kit femenino para una mujer que quiere bajar de peso se muestra de a poco. Promesas buenas y firmes, sin garantizar resultados. Si el cliente pide «algo más para sumar», se contesta con un producto concreto y la razón, sin preguntarle a qué se refiere.
- **Descuentos:** solo lo que está cargado en la planilla. Un porcentaje solo con un precio de lista real; sin precio «anterior» inventado y sin decir que «lo autorizó el dueño». La táctica de subir un precio para después «descontar» no se implementa: sería publicidad engañosa. El camino es cargar promos y precios de combo reales.
- **Guía para dar aclaraciones:** una página en la bóveda privada explica cómo pasarle los casos al equipo para no volver a contagiar frases al cliente (decir el caso, no la frase; dato o regla; siempre, nunca o según la ocasión; marcar los ejemplos).

**Hallazgo técnico: la API lee solo unos 65 mil caracteres de un mensaje.** Lo que pasa de ese tope se descarta sin dar error. El revisor recibe el candidato al final del pedido: si se corta, contesta «desconocido» y la respuesta pasa a una persona; al redactor se le corta el final de la política. Lo instalado hoy, en el peor turno (precio de una promo), está a unos 2,5 mil caracteres del tope; nunca falló, pero cualquier texto nuevo lo puede romper sin aviso.
- La primera versión de esta tanda lo pasó y los turnos de precio se iban a una persona. Se resolvió con una dieta de datos (descripciones más cortas, campos que sobraban, textos sin repetir) y una **red de seguridad en el código**: tope de 60 mil caracteres que recorta, en orden, el historial, las descripciones y, solo para el revisor, el guion de venta y el conocimiento. Al redactor nunca se le quita el guion y el candidato queda entero. Cada recorte queda registrado para vigilarlo.

**Pruebas sin envíos:** 113 verificaciones automáticas en cero fallas (guardia, frases prohibidas, repetición y nombres, tope de tamaño, flujo completo con redactor simulado); chequeador de prompts en cero hallazgos; y una batería de 20 conversaciones con el redactor y el revisor reales sin derivaciones nuevas (la única pasa a una persona cuando preguntan por un descuento extra que no existe, igual que hoy). Se vio al cerrar «Dale, [nombre], una de cookies y una de chocolate» seguido de los datos de envío, el kit femenino recomendado con su motivo, y un complemento concreto cuando lo piden.

**Queda anotado, sin bloquear:** un arranque suave repetido («yo iría con…»); al ofrecer un complemento no siempre nombra el precio en el mismo mensaje; cuando el cliente confirma «quiero la de dos», a veces pide solo la localidad en vez de la plantilla completa (pasa igual hoy). Después de instalar se vigilan los recortes de tamaño, las derivaciones nuevas y las muletillas repetidas.

**Seguridad:** al revisar este wiki se encontró un dato de acceso a una cuenta escrito en texto en informes viejos. Se retiró del texto actual; el historial del repositorio lo conserva, así que ese dato hay que cambiarlo en la cuenta.

## Tercera tanda (2026-11-12, tarde): paquete liviano y notas de la reunión
Estado: **instalado el 2026-11-12 con el OK del dueño**; se vigilan en los cortes de monitoreo los recortes de tamaño, las derivaciones nuevas y las preguntas de a una.

**Paquete liviano.** La red de seguridad de tamaño de la tanda anterior recortaba casi todos los turnos reales: funcionaba, pero perdía contexto sin necesidad. Se midió el pedido real, se quitaron datos repetidos entre fuentes (sin sacar ninguna regla) y se corrigió el tope, que contaba bytes con un margen más estricto que el necesario. El pedido queda del mismo tamaño que lo instalado una vez sumadas las notas de la reunión, pero con el tope corregido se recorta mucho menos.

**Notas de la reunión del dueño (tomadas como criterio, no como guion para el cliente):**
- Cuando el cliente llega contando un problema, nacen otras preguntas: una por mensaje, la primera abierta y general, las siguientes según lo que responde y solo si cambian la recomendación; todo natural. Los ejemplos del dueño (sueño, edad, horas de trabajo, energía, articulaciones) son ideas, no una lista.
- Darle confianza al cliente: que sienta que lo escuchan y lo orientan, sin prometer que algo cura.
- Kit más caro con salida: si el presupuesto no alcanza, una sola alternativa más económica con productos y precios reales, sin descuentos inventados.
- Cliente calificado (ya viene tomando, p. ej. solo creatina): se le nombra un complemento concreto con su motivo.

**Pruebas sin envíos:** verificaciones automáticas en cero fallas; 28 conversaciones con el redactor y el revisor reales, sin derivaciones nuevas y sin errores. Cada caso sensible se comparó contra lo instalado.

**Hallazgos honestos:**
- Si el cliente cuenta algo de salud («duermo mal», «me duelen las articulaciones»), el sistema lo pasa a un vendedor, igual que hoy. No se tocó esa seguridad; permitir que el agente pregunte igual es una decisión del dueño.
- El complemento para el cliente calificado funciona a medias: a veces nombra el producto y a veces pregunta en general. Se probó una redacción más firme y no mejoró de forma clara; se dejó la que pasó toda la batería y se vigilará con conversaciones reales.
- Dos detalles viejos, confirmados también en lo instalado: una promo de dos unidades que la planilla trae como «calculada, a confirmar» a veces se menciona; y cuando el cliente confirma «quiero la de dos», el pedido de datos de envío a veces sale por partes en vez de la plantilla completa.
- No hay ningún producto cargado para sueño ni articulaciones; el agente no inventa uno y deja que siga un vendedor.
