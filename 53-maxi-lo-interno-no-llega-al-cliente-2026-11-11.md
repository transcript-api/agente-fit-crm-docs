# 53 · Maxi: lo que se le aclara al agente no se le explica al cliente (2026-11-11)

Estado: **preparado y probado sin enviar; a la espera del OK del dueño para instalar (producción sigue con la versión anterior)**. Resumen público, sin datos del servidor, identificadores ni teléfonos. Sigue al [[17-registro-de-cambios]] y a las reglas de [[reglas-recepcion-hermes]].

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
- Dos reglas se pisaban: «la compra explícita manda» contra «el texto del anuncio no es compra directa», y «nunca empezar con Perfecto» contra las muletillas del guion (esta queda para decidir con el dueño).

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
