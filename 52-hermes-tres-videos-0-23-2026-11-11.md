# 52 · Tres videos sobre Hermes 0.23: qué dicen, qué se verificó y qué se guardó (2026-11-11)

Estado: **ingesta terminada; no se instaló ni se cambió nada en producción.** Los textos literales, la nota de análisis y las 35 filas nuevas del registro de capacidades (C-58 a C-92, con estado y evidencia) están en la bóveda privada, carpeta `11-hermes-capacidades/`. Esta página es el resumen público, sin datos del servidor ni nombres de creadores. Sigue al [[51-hermes-0-23-plugins-y-aprendizaje-2026-11-11]], del que confirma el veredicto.

## Qué llegó
Tres videos sobre la 0.23 (de 29, 8 y 14 minutos; dos en español y uno en inglés), pasados a texto con Google AI Studio: lo que se dice, lo que se ve en pantalla y dos listas finales. Dos de los tres salen del mismo embudo comercial (una comunidad paga con grupo de WhatsApp), así que cuentan como **una** fuente; el tercero es independiente.

## Veredicto
- **Casi nada sirve hoy para Maxi.** Los perfiles que hablan con clientes no tienen herramientas, skills ni plugins; casi todo lo que muestran quedaría inerte. Es la misma conclusión del informe anterior.
- **No se instaló nada.** Los 16 complementos que recomiendan (10 skills de terceros y 6 plugins) quedaron en el registro con su estado y la condición para retomarlos: casi todos en «Guardar», para el agente personal del dueño o para contenido (diseño, video, notas, investigación). Uno quedó en «Descartado hoy»: `phone-harness`, que maneja un teléfono real con código escrito por el modelo.
- **Lo aprovechable:** la lista de cambios de la actualización como lista de chequeo (nombres de herramientas, comando del servidor MCP, escritorio en el navegador apagado por defecto), una prueba de aceptación nueva y una regla de procedencia (más abajo).

## Fiabilidad de las transcripciones
- Un error de marca de tiempo en el video 1 (un párrafo figura en el minuto 9:54 cuando le correspondía el 20:54). Es de formato, no de contenido.
- Las listas finales de AI Studio agregaron datos que **no están** en el habla ni en la pantalla (videos 2 y 3): no se cuentan como evidencia.
- Un tramo patrocinado de unos 55 segundos en el video 1 y promoción de la comunidad paga en los videos 1 y 3. «Yo lo probé» es testimonio comercial: queda como REPORTADO.
- Los datos duros (versión, titulares de la actualización, cifras del catálogo, estrellas de GitHub) coinciden con las fuentes primarias.

## Qué se verificó y qué no
- **Verificado el 11/11:** la versión y las novedades principales; el catálogo (1.744 entradas: 1.711 de la comunidad, 21 oficiales y 12 «verified», unas 680 de la comunidad más que cuando se grabó el video, cinco días antes); la existencia de los diez repositorios (estrellas dentro de un 3 % de lo que dicen los videos) y las fichas del catálogo de los plugins nombrados. Las estrellas son popularidad, no auditoría.
- **Con matices:** «se actualizan solos y nunca rompen nada» (viene apagado por defecto y lo que pide consentimiento o falla los chequeos se retiene, pero el chequeo es heurístico); «si es peligroso no te deja instalarlo» (el escáner frena lo que etiqueta como peligroso, pero sus veredictos son heurísticos y un escáner limpio no prueba nada); «se activa al instalar» (la línea de comandos pregunta y por defecto no activa; lo que hace la interfaz gráfica queda por comprobar).
- **Sin verificar:** el conector de 54 aplicaciones, el gestor de contraseñas, el contenido de cada skill de terceros (se lee solo al preparar un entorno de prueba) y los términos de uso de manejar un agente automático con un plan de suscripción.

## Dos advertencias nuevas
1. **Un comando o un nombre de repositorio sacado de una transcripción no se copia.** En un video, el nombre de la cuenta de un repositorio, leído de la pantalla, no existe en GitHub: el real difiere en una letra (un «1» donde iba una «l»). Instalar por ese nombre sería instalar una copia, si alguien la registraba. El nombre se resuelve desde la ficha oficial o la búsqueda de GitHub y se compara letra por letra. Ya está en el protocolo de ingesta.
2. **Un plugin se activa también en los canales de mensajería** (lo dice un orador; no se verificó en el código). De ahí una prueba nueva: tras instalar cualquier plugin en el entorno de pruebas, listar las herramientas de cada perfil y confirmar que los de recepción siguen en cero.

## Cómo quedó el registro (35 ítems, nada se tira)
| Estado | Ítems |
|---|---|
| **Después** (8) | Lista de chequeo de la actualización · medir el ahorro de tokens por llamada · bloquear skills propias del curador · nivel de esfuerzo de razonamiento por perfil · qué hace la interfaz gráfica al instalar · prueba de aceptación tras instalar un plugin · `hermes-security` y `snyk` para revisar código · `bubblewrap` para el plano interno |
| **Guardar** (25) | Escritorio en el navegador · rebobinar conversaciones · salas de bots y delegación · límites de gasto y cancelar tareas · gestor de contraseñas · conectores · proveedor por suscripción · importador de otros agentes · wiki de memoria · grabar un flujo del navegador · ingeniería inversa · diez skills de terceros (estilo de respuesta, planes en archivos, segundo cerebro, lectura de redes, ciencia, diagramas, video, diseño web, código mínimo, seguridad) · plugins creativos (3D, música, efectos) · Orkas, Herdr y Ovis · modelos gratis |
| **Descartado hoy** (1) | `phone-harness` (reabrible con un teléfono de pruebas, sin cuentas del negocio) |
| **Ya aplicado** (1) | La regla de no copiar nombres de una transcripción |

## Siguiente paso
Nada se instala hasta cerrar la línea base de seguridad del servidor (la lleva la bóveda privada) y separar las credenciales del entorno de pruebas. Si el dueño quiere probar algo, el orden propuesto es: la v0.23.1 sola con los chequeos de este resumen; después una herramienta de trazas; después `hermes-security` para leer el código de cualquier cosa que se quiera instalar; al final, algo de contenido para el agente personal. Pendiente: el enlace y la fecha de cada video para completar la ficha de fuente.
