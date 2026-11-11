# 51 · Hermes 0.23, plugins y aprendizaje: qué conviene y qué no (2026-11-11)

Estado: **estudio terminado; no se instaló ni se cambió nada en producción.** El informe completo, las ocho notas crudas y el registro de capacidades (cada ítem con su estado y su evidencia) están en la bóveda privada, carpeta `11-hermes-capacidades/`. Esta página es el resumen público, sin datos del servidor.

## Por qué
El dueño pidió estudiar a fondo la actualización 0.23 de Hermes y los «más de mil plugins», ver cuáles podrían ayudar a Maxi (el agente de recepción y ventas por WhatsApp), cómo instalarlos sin riesgo y si el modelo aprende de verdad con el uso. También pidió que todo lo que salga de los videos que va a mandar quede anotado con un estado y que nada se descarte.

## Veredicto
- **No actualizar producción por la 0.23.** No trae ninguna función nueva para perfiles que son generadores de texto de una sola vuelta; el beneficio es de higiene. Se prueba primero en un contenedor aparte con copia de los datos y se espera a que se asienten los parches, salvo una razón de seguridad.
- **No instalar plugins ni skills de terceros por ahora.** Ninguno hace falta para Maxi y el riesgo es real.
- **El modelo no aprende solo.** Lo que mejora es lo que se corrige a mano; lo que falta es una señal de qué respuesta terminó en venta.
- **Lo que más ayuda está en el puente y en los datos**, no en un catálogo: datos de envío y promos, medición, repetición de casos y, más adelante, seguimiento.

## Qué trae la 0.23
La 0.22.2 (la que corre) es del 15 de octubre. Después hubo cinco parches (v0.22.3 a v0.22.7, unos 1.664 cambios), la v0.23.0 «The Hearth Release» del 5 de noviembre y la v0.23.1 (notas del 9). «Parche» no significa chico y no existe un camino mínimo de actualización. Las novedades principales son para quien usa Hermes con pantalla (escritorio en el navegador, grupos de bots, delegación, límites de gasto en herramientas): casi nada toca a perfiles de una vuelta.

Rozan al sistema cuatro cosas: la «central» única por perfil por la que pasa cada llamada, la forma en que la API informa cómo terminó cada respuesta (`finish_reason`), valores de configuración que cambian (la poda automática del historial pasa de sí a no y la migración de configuración de la versión 50 a la 53) y algunos reportes de reinicios trabados. Además, la imagen que ofrece el proveedor del servidor se etiqueta con códigos propios y no con versiones de Hermes: volver a bajarla o recrear el contenedor sube de versión sin avisar.

## Los plugins: un catálogo, no un menú
- Los «más de mil» son ciertos: **1.733 entradas** el 11/11 (el número cambia varias veces por día). Pero el **98 %** es de la comunidad (21 oficiales, 12 «verified» y unas 1.700 de terceros) y «catalogado» no es «auditado».
- Alrededor del 86 % tiene menos de 10 estrellas (extrapolado de las 718 más populares), y las estrellas son del repositorio, no del plugin.
- Cinco palabras que se mezclan: **plugin** (código que corre dentro del proceso de Hermes y se habilita aparte), **skill** (un manual de texto que el agente lee), **servidor MCP** (un servicio externo que presta herramientas), **toolset** (las herramientas habilitadas) y **hook** (código que el gateway importa solo por estar en una carpeta).
- Con perfiles sin herramientas ni skills, casi todo el catálogo queda inerte. En las 718 fichas más populares hay 4 de WhatsApp, 4 de CRM, 3 de Meta Ads y 2 de lectura de comprobantes, ninguna hecha para el CRM del negocio.
- Los incidentes de 2026 son del ecosistema vecino (OpenClaw y su registro ClawHub: una campaña de skills falsas que instalaban un robador de claves, y una auditoría de Snyk que confirmó 76 skills maliciosas entre 3.984). Del catálogo de Hermes no se encontró ningún incidente público; eso es ausencia de evidencia, no evidencia de ausencia.

## Instalar de terceros: leer y aislar
- Hermes dice con franqueza que, frente a un modelo hostil, **el único límite real es el sistema operativo** (el contenedor). Las aprobaciones de comandos, el enmascarado de claves y los escáneres son heurísticas, y la inyección de instrucciones queda fuera de su alcance.
- **Un escáner limpio no prueba nada.** En junio de 2026 Trail of Bits evadió los detectores de ClawHub, de Cisco y de skills.sh; en tres de cuatro casos le bastó menos de una hora de trabajo por skill. Air Security publicó una skill de prueba que llegó a más de 26.000 agentes con todos los escáneres en verde porque su carga se bajaba de una URL externa. Lo que sí funcionó: la revisión humana, fijar la versión exacta, aislar y mirar el tráfico saliente.
- Si algún día se instala algo, el proceso tiene **once pasos**: necesidad, procedencia, fijar la versión (el commit exacto), leer todo el código, revisar permisos, usar los escáneres solo como ayuda, instalar apagado en un entorno de prueba, prueba hostil con claves señuelo, salida gradual, apagado y vuelta atrás ensayados, y mantenimiento sin auto-actualización.
- **Dos planos.** Los perfiles que hablan con clientes no reciben nunca herramientas, plugins ni skills, y su única salida es texto que el puente valida. Cualquier herramienta potente vive en otro contenedor, con sus propios datos y claves, y nunca ve texto crudo de clientes. Es la «regla de dos» de Meta: una sesión no debería combinar entrada no confiable, acceso a datos sensibles y capacidad de actuar hacia afuera. El revisor (A06) no es una frontera de seguridad; la barrera real son los validadores del puente (largo, enlaces permitidos, precios contra el catálogo, filtro de promesas de salud y pase a una persona ante la duda).
- La línea base de seguridad del servidor se lleva en la bóveda privada y va antes que cualquier plugin.

## ¿Aprende el modelo?
- «Aprender» en Hermes **no cambia los pesos del modelo**: es escribir texto que vuelve a entrar al prompt (una memoria de dos archivos chicos, skills que crea el propio agente, un historial buscable y proveedores externos de memoria). Con una sola vuelta por mensaje casi no hay un «fin de sesión» donde ese mecanismo actúe.
- En los perfiles de Fitness todo eso está apagado y se verificó leyendo el contenedor: **cero memorias, cero skills creadas por el agente y cero revisiones en segundo plano**.
- Activar la memoria nativa en perfiles que hablan con clientes sería un error de diseño: es un único archivo compartido por todos los leads y reinyectado en cada sesión, y existe un ataque documentado (MINJA) para envenenar la memoria de un agente solo conversando con él. No hay evidencia independiente de que el aprendizaje nativo mejore ventas por mensajería.
- Lo que **sí mejoró** entre el 7 y el 11/11 fue por correcciones manuales: la pregunta de cantidad en el primer mensaje pasó de 27 y 21 segundas vueltas por día a 3, 7 y 0, y «retiro o envío antes de tiempo» de 21 a 4, 4 y 3. Lo que **no mejora solo** son los errores por datos que faltan (fuente de hechos, precio o promo que el cliente no pidió, pregunta final genérica).
- Falta la señal que cierra el ciclo: **qué respuesta terminó en venta**. La base del puente no tiene un campo de «venta ganada».
- Medir tiene ruido: con unas 85 conversaciones por día, el azar mueve cada porcentaje unos ±10 puntos, así que el rango de 22 a 41 % de segundas vueltas no prueba mejora ni empeoramiento. La salida es la **repetición pareada** (los mismos casos con el manual actual y con el nuevo, calificados por una persona): con 155 a 312 pares detecta mejoras de 10 puntos, mientras que detectar por ventas que la conversión sube de 5 % a 7 % pediría unos 52 días (con tasas hipotéticas).

## Qué ayuda a Maxi hoy
1. **Datos del lado del puente:** envío y ubicación como hechos certificados, promos y fichas en el catálogo, «¿de cuál producto?» y el cierre «quiero la de dos». Es donde caen las segundas vueltas, sobre todo en la primera respuesta, la que sigue al texto automático del anuncio.
2. **Cerrar el ciclo con resultados:** un script de solo lectura que cruce cada conversación con la etapa, el comprobante y la respuesta del vendedor.
3. **Medir** uso, latencia y errores por perfil, con un corta-circuito si el proveedor de modelos falla.
4. **Banco de repetición** en el contenedor de pruebas, con un juez de otra familia de modelo.
5. **Seguimiento** de quien deja de contestar (el mayor potencial de ingresos): el CRM decide a quién, Hermes redacta el borrador y el CRM lo envía, libre dentro de la ventana de 24 horas y con plantilla aprobada fuera, con una regla fija de baja antes del modelo. Según la página de precios de Meta, en chats que nacen de anuncios «Click-to-WhatsApp» responder dentro de las 24 horas abre una ventana de hasta 7 días sin cargo por mensajes; falta confirmarlo con una factura real.
6. **Un solo plugin oficial con sentido:** `langfuse` (trazas con costo por turno), solo como experimento acotado en el contenedor de pruebas; se descarta si sus ganchos no se disparan en turnos que entran por la API.

## Plan en cuatro estados (nada se tira)
Cada ítem está en el registro de capacidades de la bóveda con su estado y la condición para retomarlo.

| Estado | Qué |
|---|---|
| **Ahora** | Línea base de seguridad del servidor, respaldo y versión fijada · no instalar plugins ni skills de terceros · pruebas de aceptación de seguridad · arreglos de datos de Maxi · cerrar el ciclo con resultados · medir uso por perfil · regla de baja · banco de repetición |
| **Después** | Probar la v0.23.1 en el contenedor de pruebas con copia de datos · fijar poda y retención del historial · credenciales propias para el contenedor de pruebas · seguimiento con plantillas · curador diario con aprobación del dueño · privacidad (seudonimizar antes de trazas o voz en la nube; consulta legal en Uruguay) · endurecer el entorno · plano interno separado |
| **Guardar** | Plataforma propia para el CRM y adaptador oficial de WhatsApp Cloud · autoevolución · guardarraíles y delegación · memoria y skills nativas solo en un perfil analista aislado · plugins de Meta Ads · telemetría · lector de comprobantes de catálogo y voz nativa · afinar el modelo |
| **Descartar hoy** | Adaptadores no oficiales de WhatsApp (arriesgan el número) · skills de ClawHub, skills.sh o URLs sueltas · memoria y aprendizaje automáticos en perfiles de clientes · ruteadores que mandan texto a terceros · atajos como `--force` o apagar las aprobaciones · actualizar producción sin pasar por el contenedor de pruebas |

## Correcciones y límites
- El informe recomendaba «transcribir audios en el puente», pero **eso ya existe desde el 9/11** ([[50-hermes-noche-2026-11-09]]: lectura de audios e imágenes y acuse del comprobante legible). Falta medir el acierto con audios en rioplatense y ver qué mensajes que no son texto siguen pasando a una persona.
- Los precios, los tamaños de muestra y los costos son **reportados o cálculos propios con tasas hipotéticas**; no son mediciones del negocio.
- Preguntas abiertas que más pesan: si la migración de configuración recorre también los perfiles; si los ganchos de plugins se disparan en turnos por la API; si el modelo acepta imágenes directamente; si el CRM usa la API oficial de WhatsApp y cómo factura la ventana de 7 días; qué datos deja leer la API del CRM; qué exige la ley uruguaya; y si siguen abiertos los reportes de límites de uso del proveedor de modelos.
