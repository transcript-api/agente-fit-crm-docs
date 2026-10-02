# Reglas de diseño para presentaciones a la gerencia

**Qué es**: las reglas de escritura y diseño visual que el usuario fijó después de rechazar dos versiones genéricas de un deck para el gerente/dueño de Fitness Suplementos. Aplican a cualquier entregable futuro para gerencia (deck, informe), no son específicas de ese deck puntual.
**Fuente primaria**: [[27-reglas-diseno-presentaciones]] (las reglas completas), [[28-traspaso-2026-09-15-deck-e-informe]] (el caso real donde se aplicaron, con ejemplos de qué se sacó y por qué).

## La regla que manda sobre todas: no decir lo obvio
Si el que lee ya lo sabe, no va — ocupa el lugar de una línea que sí aporta, y suena condescendiente con alguien que dirige el negocio. Test antes de escribir cualquier línea: **¿esto se lo estoy contando o se lo estoy recordando?** Si es lo segundo, se borra.

Ejemplos reales de líneas que se sacaron por esta regla: *"El equipo no falla por falta de ganas... Es capacidad, no actitud"* (nadie pensó que el equipo no tenía ganas) → quedó solo el hecho: *"De seis operadores a tres o cuatro. El volumen no bajó."*

## Los otros 4 filtros (aplicar a cada línea, junto con el de arriba)
1. ¿Le estoy diciendo qué hacer con su negocio? → se saca. Se aporta el hecho, la conclusión la sacan ellos.
2. ¿Este número es medido o me lo contaron? → si me lo contaron, decirlo donde aparece (ver la regla de los números-simulación abajo).
3. ¿Esto suena más grande de lo que es? → bajarlo. El usuario bajó "siete días de trabajo" a "cinco" por su cuenta, para no parecer que agrandaba.
4. ¿Esto lo lee él en voz alta o lo leen ellos? → las bajadas de lámina son su apunte para hablar, una o dos líneas secas — un párrafo se lee como si les estuviera enseñando.

## Contar el estado, no la historia
No narrar "esto estaba roto y lo arreglamos" — desperdicia espacio. *"Inventaba precios. La causa era la planilla. Corregido."* → mejor: *"Responde con el catálogo real."* Y los bugs del proveedor (rmsystemm/DKW) no van salvo que le impidan avanzar de verdad a él — palabras del usuario: *"a mí no se me pidió que integrara Bling... tenés que usar ese tiempo para poner cosas interesantes."*

## Números: separar medición de estimación, siempre
Las cifras del negocio (contactos/mes, % atendido, % conversión) que da la empresa de memoria en una charla **no son una medición** — hay que decirlo explícito cada vez que aparecen: *"Datos que me pasó el equipo. Con eso armé el orden de magnitud, para tener un número sobre la mesa."* Mismo principio que ya rige en `CLAUDE.md` global del usuario para cualquier proyecto (no inventar cifras, separar dato observado de inferencia).

## Sistema visual (para no repetir el error de "diseño genérico de IA")
Prohibido: cajas con borde izquierdo de color, grillas simétricas de tarjetas iguales, láminas sin fotografía real, una sola familia tipográfica, íconos SVG genéricos, gradientes de dos colores como fondo principal. Obligatorio por lámina: un objeto real anclando la composición (producto recortado, captura real, mockup), jerarquía tipográfica de 3 niveles mínimo, una anotación manuscrita con flecha, profundidad real (rotación, sombra, superposición), una pastilla de acción, grano/textura sobre el fondo.

Paleta: fondo `#070F16`, acento `#A8E831` (verde lima del logo), alerta `#E8321E` (solo para lo que se pierde). Tipografías: Archivo Black (display), DM Serif Display itálica (acento), Caveat (manuscrita), Jost (texto).

## Regla dura de privacidad al publicar
Un artifact compartido por link **nunca** lleva capturas de pantalla con datos de clientes reales, ni siquiera desenfocadas — se confirmó en la práctica: el clasificador de publish rechazó una lámina con una captura real del pipeline (nombres/teléfonos con Gaussian blur) hasta sacarla. Las cifras agregadas sí van (ej. "2.535 negocios en el pipeline").

## Caso 2026-10-02: tablero de respuestas reales de Maxi (Obsidian + Miro)
Segundo entregable para la gerencia, distinto del deck: 5 respuestas buenas y 3 con errores de Maxi con leads reales, en formato pizarra/flujo (el usuario rechazó explícitamente que quedara en una sola columna hacia abajo: pidió una pizarra con flujo). Cada caso lleva: lo que escribió el lead, lo que hizo bien o dónde falló Maxi, la reacción del lead o qué se propone corregir, y una captura real del CRM. Se aplicaron los mismos filtros de arriba (no decir lo obvio, separar lo medido de lo supuesto: la portada dice que es una **selección ilustrativa, no una estadística**; las hipótesis sin confirmar se rotulan así, ej. el portugués).

- **Privacidad**: esta vez sí llevan capturas de conversaciones reales, a propósito, porque el tablero es para una persona concreta y no un artifact público: los nombres se reemplazan por `[nombre]` y el material (`presentacion/`) **no se sube a git** (el repo es público). Antes de compartir el link de Miro fuera del equipo hay que revisar que no se vean teléfonos ni otros datos personales.
- **Herramientas**: se armó primero como `.canvas` de Obsidian (formato JSON Canvas, skill de kepano/obsidian-skills) y se pasó a Miro (MCP `miro-mcp`) porque ahí se acerca y se mueve más fácil. Trampas de Miro: la posición x,y de una imagen al crearla es el **centro**; el alto de un panel hay que calcularlo con el alto renderizado del texto + 48 px, no estimarlo; la verificación es por `data-rendered-bounds`, no visual.
- Fuente: [[17-registro-de-cambios]] 2026-10-02.

## Pendientes relacionados
Q32 en `PENDIENTES.md` (cierre del tablero de Miro: captura del Error 2, imagen duplicada, pasada visual, revisión de privacidad). El deck y el informe de la sesión de 2026-09-15 ya se publicaron. Consultar si se arma otro entregable para gerencia en el futuro.
