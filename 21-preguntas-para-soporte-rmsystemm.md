# Preguntas para la reunión con soporte de rmsystemm

Preparado el 2026-09-13 para una reunión online con soporte. Cada pregunta tiene **por qué importa** — sirve para saber dónde insistir si la respuesta es vaga. Las secciones están ordenadas por impacto: si la reunión se corta, las de arriba son las que no se pueden dejar pasar.

Dejar espacio para anotar la respuesta al lado de cada una y volcarla después a los archivos correspondientes del vault.

---

## 🔴 PRIORIDAD 1 — Cosas que si están mal, rompen todo lo que ya construimos

### 1. ¿Las variables guardadas con "Salvar Variável" persisten por contacto para siempre, o se borran al cerrar el ticket / la conversación?
**Por qué importa**: TODO el diseño de Recompra depende de que `ultimo_producto_comprado` y `fecha_compra` sigan ahí 30, 60 o 90 días después, cuando el cliente vuelve a escribir. Si esas variables mueren al cerrar el ticket, el modo Recompra del prompt no funciona nunca y hay que rediseñarlo (probablemente usando campos personalizados de contacto en vez de variables).
**Repregunta si contestan que sí**: ¿dónde se ven esas variables guardadas de un contacto puntual, para poder verificarlo a mano?

### 2. Los Guardrails no se guardan — ¿es un bug conocido?
**Por qué importa**: es la única protección automática contra que el agente invente precios o prometa cosas sin ejecutarlas. Hoy no funciona.
**Detalle exacto para darles** (para que no digan "lo estarás haciendo mal"): configuramos "Ancoragem de valores", clickeamos Guardar en el modal, después Guardar cambios en la página (que se habilita), recargamos la página y vuelve a decir "Ningún guardrail configurado". Reproducido dos veces, con días de diferencia (11/09 y 13/09), en el agente id 9816.
**Repregunta**: ¿cuál es la secuencia correcta de guardado? ¿Hay algún plan/feature que tenga que estar habilitado para que persistan?

### 3. ¿Existe una API de rmsystemm? ¿Qué se puede hacer con ella?
**Por qué importa**: es la base de todo lo que queremos construir por afuera (n8n). Vimos "API Keys" en Configuración pero no sabemos su alcance.
**Preguntar puntualmente**: ¿se pueden leer conversaciones/mensajes? ¿crear o actualizar contactos y sus campos personalizados? ¿disparar un flujo de automatización desde afuera? ¿hay webhooks salientes cuando entra un mensaje o cambia una etapa? ¿dónde está la documentación?

### 4. Copiloto de IA — ¿está disponible en rmsystemm? Y si no, ¿cuándo y a qué costo?
**Por qué importa**: es un producto distinto del Agente de IA (no habla con clientes, asiste al equipo humano). Ver [[09-copiloto-ia-partner]] para el detalle completo. Está documentado en la plataforma base (DKW System) pero nunca apareció en nuestra cuenta. Dos funciones son directamente valiosas para nosotros hoy: (a) **genera y mejora el prompt del Agente de IA, con un modo de test en loop que simula conversaciones cliente↔vendedor e itera el prompt solo** — es exactamente el trabajo que estamos haciendo a mano; (b) resúmenes de conversación + respuesta sugerida para el equipo.

**⚠️ La sub-pregunta más importante, y es arquitectónica**: según la documentación de la plataforma base, el Copiloto **NO funciona en modo BYOK** ("Bring Your Own Key") — requiere "IA Gerenciada" (clave de IA centralizada del proveedor). **Nosotros hoy estamos en BYOK** (clave propia de OpenAI cargada en el agente).

**Munición nueva (2026-09-14)**: el propio Hub de Integraciones dice lo contrario. El conector "OpenAI Key" describe, textual: *"Conecta tu clave de OpenAI para usar los modelos GPT (GPT-4o, GPT-5, serie o) y las acciones de OpenAI — texto, imagen, embeddings y moderación — en los Agentes de IA, **el Copiloto** y los Flujos de automatización."* Llevar esa frase a la reunión y preguntar cuál de las dos vale. Ver [[23-conectores-hub-integraciones]] §4.3.

Entonces:
- ¿Habría que migrar toda la cuenta a "IA Gerenciada" para poder usar el Copiloto?
- ¿Se puede tener el **Agente de IA en BYOK y el Copiloto en gerenciada** al mismo tiempo, o es todo o nada?
- Si hay que migrar: ¿cómo cambia el costo? Hoy pagamos OpenAI directo y vemos el gasto real; en gerenciada pasaríamos a comprar créditos a rmsystemm. ¿Qué margen tiene eso encima?

### 5. ¿El CRM captura de qué anuncio vino un lead de WhatsApp?
**Por qué importa**: el prompt ya tiene escrita una regla en la Etapa 1 — *"si el mensaje de entrada coincide con un anuncio conocido, saludá reconociendo eso"* — y hoy no hay forma de que el agente sepa eso. WhatsApp manda datos de referral cuando el lead llega desde un anuncio Click-to-WhatsApp de Meta. Pendiente relacionado en [[04-patrones-reales-de-venta]] (armar base de anuncios activos).
**Preguntar**: ¿el CRM guarda ese dato de origen (anuncio/campaña) en el contacto o en la conversación? ¿El agente puede leerlo como variable? ¿Se puede usar como condición en las Reglas de Activación o en un Flujo?
**De paso**: en el Hub de Integraciones, **Meta Ads figura como "Reconexión necesaria"** — preguntar qué se pierde mientras esté así y cómo se reconecta.

### 6. Si vinculamos un canal de WhatsApp al agente, ¿responde a TODO desde el primer segundo?
**Por qué importa**: no queremos que el día que lo activemos empiece a contestarle a los ~5000 clientes/mes de golpe sin haberlo probado en real. Necesitamos un rollout controlado.
**Preguntar**: ¿las "Reglas de Activación" permiten limitarlo, por ejemplo, solo a contactos con cierta etiqueta o de cierta cola? ¿Hay alguna forma de que atienda solo un porcentaje de las conversaciones, o solo en cierto horario, para probar de a poco?

---

## 🟠 PRIORIDAD 2 — Definen cómo cargamos el catálogo (decisión de esta semana)

### 7. En "Conocimiento": ¿el agente puede elegir QUÉ base de conocimiento consultar según el contexto, o siempre busca en todas las vinculadas?
**Por qué importa**: define si conviene un solo archivo de catálogo con columna de categoría, o varios archivos separados (creatina, proteína, etc.). Si puede elegir, separar mejora la precisión.

### 8. "Fuentes de conocimiento externas" con Google Sheets: ¿cada cuánto se actualiza?
**Por qué importa**: si cambiamos un precio en la planilla, queremos saber si el agente lo ve al toque o si hay que re-indexar/re-vincular a mano. Cambia totalmente el proceso de mantenimiento mensual de promos y precios.
**Repreguntar**: ¿hay límite de filas o de tamaño de la planilla? ¿Se puede forzar una re-sincronización manual?

### 9. La opción HTTP de "Fuentes de conocimiento externas": ¿cómo funciona exactamente?
**Por qué importa**: es la vía para consultar precio/stock en vivo (contra Bling o contra un webhook nuestro en n8n) en vez de tener datos estáticos.
**Preguntar**: ¿se le puede pasar como parámetro algo de la conversación (ej. el nombre del producto que mencionó el cliente)? ¿Soporta headers de autenticación (Bearer token)? ¿Cuál es el timeout? ¿Qué pasa si el endpoint falla o tarda — el agente avisa, se cuelga, o responde igual sin el dato?

### 10. ¿La similaridad mínima de RAG (hoy 0.5) se puede configurar por base de conocimiento, o es global del agente?
**Por qué importa**: la propia interfaz recomienda 0.35 para datos estructurados (catálogo) y 0.5 para texto corrido. Si tenemos las dos cosas, queremos valores distintos.

---

## 🟡 PRIORIDAD 3 — Capacidades que queremos usar y no sabemos si existen

### 11. ¿El agente puede escuchar/transcribir notas de voz que manda el cliente por WhatsApp?
**Por qué importa**: los clientes mandan audios constantemente. Hay un toggle "Procesar imágenes" pero no encontramos el equivalente para audio.
**Repreguntar si dicen que no**: ¿está en el roadmap? ¿hay alguna forma de resolverlo por afuera (webhook que reciba el audio, lo transcriba y lo devuelva como texto)?

### 12. DS Voice: ¿existe el módulo en nuestra cuenta, y el AGENTE puede elegir qué funil mandar por criterio propio?
**Ojo — parte de esto ya está respondido por el video** ([[10-ds-agente-ds-voice-manual]]): los **Gatilhos de DS Voice disparan por coincidencia de texto literal, SIN pasar por la IA**. Eso ya lo sabemos, no hay que preguntarlo. Lo que sigue abierto es distinto y hay que plantearlo bien para no perder la pregunta:
1. ¿El módulo DS Voice (Criativos/Funis/Gatilhos) existe como sección en NUESTRA cuenta? Solo vimos el chip de acción en el editor del agente, nunca la sección.
2. Cuando **el agente** llama a "Enviar funil de Criativos" (que es un camino distinto al Gatilho), ¿puede elegir cuál funil según el contexto, o también está atado a algo fijo?
**Por qué importa**: es la diferencia entre poder hacer la idea de los audios del call center por criterio del agente, o tener que amarrar cada audio a una palabra clave.

### 12b. Dos funciones del video a confirmar en nuestra cuenta
- **"Enviar como gravado na hora"** en los audios (hace aparecer el "grabando audio..." en el WhatsApp del cliente). Alto valor para que los audios del call center no se sientan robóticos.
- **Variable `Saudação`** (completa sola "Bom dia"/"Boa tarde"/"Boa noite" según la hora).
Ambas están documentadas en [[10-ds-agente-ds-voice-manual]] como funciones de la plataforma base, marcadas ahí mismo como "deberíamos ver si rmsystemm tiene lo mismo".

### 12c. ¿Existe la opción "Exceção: Troca de Mensagens" en las automatizaciones de columna?
**Por qué importa — esta es de las más valiosas y casi se nos pasa**: cancela una acción programada si el cliente respondió dentro de una ventana de tiempo. Resuelve de raíz el problema de que el temporizador "Tiempo en la Columna" no sabe si el cliente ya contestó — limitación que motivó buena parte del diseño manual del Funil de Ventas. El video muestra que existe en la plataforma base; [[10-ds-agente-ds-voice-manual]] lo dejó anotado como "pendiente: volver a revisar el modal de automatización en rmsystemm buscando específicamente esta opción".

### 12d. ¿Existen los campos Temperatura, Delay de respuesta y Máximo de tokens en el editor del agente?
**Por qué importa**: el prompt tiene valores recomendados (120 tokens, 120s de delay) sacados de un agente real de DKW, pero [[10-ds-agente-ds-voice-manual]] dejó anotado que **nunca se confirmó que esos campos existan en la cuenta de rmsystemm**.

### 13. "Agendamento de mensagem": ¿el agente puede programar un mensaje para una fecha que dedujo de la conversación?
**Por qué importa**: caso real y frecuente — el cliente dice "cobro el 3 de octubre". Queremos que el agente agende solo el seguimiento para el 4 o 5 (con margen, para no sonar desesperado). Pendiente anotado en [[07-estrategias-pendientes-agente]].
**Preguntar**: ¿la fecha puede salir de una variable/razonamiento del agente, o tiene que ser un delay fijo predefinido?

### 14. Cuando un humano del equipo responde manualmente en una conversación que está atendiendo el agente, ¿el agente se calla solo?
**Por qué importa**: si no, el cliente recibe dos respuestas encimadas y queda pésimo.
**Preguntar también**: ¿qué hace exactamente el toggle "Desactivar agente al responder fuera de la plataforma"? ¿Y "Responder tickets con asignado"?

### 15. Follow Up Generativo: ¿qué hereda del agente y qué no?
**Ojo — la pregunta obvia ya está respondida**: [[01-agente-de-ia]] documenta que el Follow Up Generativo **tiene su propio campo "Instrucciones para el Follow-Up"**, separado del prompt principal. O sea, no usa el mismo prompt. No preguntar eso.
**Lo que sigue abierto**: ¿respeta los guardrails del agente? ¿Puede leer las variables guardadas del contacto? ¿Puede ejecutar acciones (ej. transferir a humano) o solo escribe texto?
**Por qué importa**: el plan de Recompra ([[14-funil-recompra]]) todavía no definió si la reactivación la manda una automatización fija o el Follow Up Generativo — y si el Follow Up no respeta las reglas de no inventar precios, no sirve para eso.

### 16. ¿Se puede exportar el historial de conversaciones en bloque?
**Por qué importa**: para revisar periódicamente qué respondió el agente y mejorar el prompt con casos reales (es la práctica que recomiendan todos los que hacen esto en serio). Sin export, hay que revisar chat por chat a mano.

---

## 🟠 PRIORIDAD 2B — Hub de Integraciones (bloque nuevo, 2026-09-14)

*Agregado después de abrir los 25 conectores uno por uno. Análisis completo en [[23-conectores-hub-integraciones]]; el texto literal de cada panel, en [[23b-conectores-volcado-literal]]. En el guion en portugués son las preguntas 21a a 21e.*

### 21a. Confirmar la cadena de tres pasos para usar un conector
**Qué preguntar**: conectar la cuenta en el Hub → adjuntarla en `Agente de IA → Herramientas → Conectores` → escribir en el prompt cuándo usarla. ¿Es así o falta algo?

**Por qué importa**: hasta ahora dábamos por hecho que conectar en el Hub alcanzaba. No alcanza — el agente hoy dice "Ningún conector adjunto", o sea que no tiene acceso a ninguna integración externa. Si el mecanismo es el que creemos, la forma de controlar un conector es **escribiendo en el prompt**, y hay que agregarle esas líneas al prompt v4.

### 21b. Shopify — la pregunta más importante de toda la reunión
**Qué preguntar**: qué sincroniza exactamente (¿producto con precio, descripción y link? ¿cada cuánto?), si los eventos de tienda ("nuevo pedido", "carrito abandonado") aparecen como **gatillo en Flujos de Automatización**, y si el agente puede consultar el estado de un pedido en la conversación.

**Por qué importa**: la descripción del conector promete resolver tres cosas que hoy están trabadas — el catálogo (hoy depende de un export CSV manual porque la API de Bling ignora los parámetros, B2), la detección de carrito abandonado (que es exactamente el funil de [[08-funil-remarketing-nuevo]] y hoy no existe forma de detectar), y el estado del pedido (una de las consultas que hoy escala al humano). Es la acción de mayor impacto de todo el Hub.

**Cuidado que hay que mantener**: el stock de Shopify viene sincronizado de Bling, así que hereda sus problemas. Shopify resolvería catálogo, precios, links y pedidos; **no** garantiza que el número de unidades esté bien.

### 21c. Google Sheets — ¿base de conocimiento (RAG) o conector? ¿O los dos?
**Qué preguntar**: para el catálogo, cuál es el camino correcto, y si se pueden usar los dos a la vez.

**Por qué importa**: el conector tiene una acción de **búsqueda por coincidencia exacta** ("Buscar fila de la hoja de cálculo"). El RAG busca por similitud y puede traer la fila equivocada — y traer la fila equivocada de precio es literalmente inventar un precio, que es justo lo que el guardrail intenta impedir. Lo razonable es RAG para preguntas abiertas y conector para las puntuales, pero hay que confirmar que convivan. Esto define la decisión pendiente de [[20-catalogo-estructura-para-el-agente]].

### 21d. Los 8 disparadores de Google Sheets, ¿dónde viven?
**Qué preguntar**: si "Nuevas Filas" y "Valores del Rango Cambiados" pueden **iniciar un Flujo de Automatización**.

**Por qué importa**: si se puede, la alerta de stock se puede armar desde una planilla y **sale de encima el bloqueo de Bling** (B1/B2). No resuelve de dónde sale el dato de stock, pero saca a Bling del camino crítico de la notificación.

### 21e. Dos cosas del Hub que no se pudieron explicar mirando
**Qué preguntar**:
- El filtro "Agente IA" esconde Google Sheets, pero el selector "Agregar conector" del agente sí lo ofrece. ¿Cuál manda?
- La etiqueta `AUTOMATIZACIÓN`: solo la llevan 12 de las 226 acciones, y solo en Google Sheets y Gmail. ¿Qué significa?

**Por qué importa**: la hipótesis es que `AUTOMATIZACIÓN` marca las acciones usables como nodo dentro de Flujos, y las demás solo sirven para el agente/Copiloto. Si es así, cambia qué se puede automatizar y qué no. Es una hipótesis sin verificar.

## 🟢 PRIORIDAD 4 — Costos, límites y operativa

### 17. Con el "Modo de ejecución: Avanzado", ¿el caché de prompt del 90% que menciona la interfaz es automático?
**Por qué importa**: el prompt es largo (~11.800 caracteres) y se manda en cada mensaje. Si el caché funciona, el costo real por conversación baja muchísimo.

### 18. ¿La pestaña "Uso" muestra el costo real en dólares, o solo cantidad de mensajes?
**Por qué importa**: para poder proyectar cuánto cuesta escalar a todo el volumen de conversaciones.

### 19. ¿Hay límite de conversaciones simultáneas que el agente puede atender?
**Por qué importa**: en un pico de campaña pueden entrar muchos leads a la vez.

### 20. ¿Cuántos agentes de IA distintos se pueden tener en la cuenta, y comparten costo/límites?
**Por qué importa**: hoy la decisión es usar uno solo, pero si a futuro conviene separar (ej. uno de ventas y otro de post-venta), saber si eso tiene costo extra.

---

## ⚙️ Cosas menores para mencionar de paso (bugs/fricciones observadas)

- **Los flujos con gatillo "Agendado" no tienen "Executar agora"** — solo "Testar", que simula y no ejecuta las llamadas HTTP reales (dice "não executada no teste"). Preguntar: ¿hay alguna forma de forzar una ejecución real para probar, sin esperar al horario? Nos costó horas de espera para detectar un error.
- Pedirles: **un canal directo para reportar bugs** y si hay **changelog o roadmap público** que podamos seguir.

**Sacadas de la lista a propósito** (eran ruido para una reunión con tiempo limitado):
- *Guardado en dos pasos en el editor*: ya lo entendemos y lo manejamos, no vale gastar tiempo de reunión.
- *"Conexão ao vivo perdida"*: dejó de ser una pregunta suelta y se movió **dentro de la pregunta #2 (guardrails)** como posible causa del bug de persistencia — ahí sí aporta, como pista técnica para que la investiguen.

---

## Después de la reunión
Volcar las respuestas a los archivos que correspondan, y **actualizar el estado de cada ítem en [[PENDIENTES]]**:
- Variables / persistencia y Reglas de Activación → [[01-agente-de-ia]]
- Guardrails → [[01-agente-de-ia]] (sección del bug confirmado)
- Copiloto de IA (disponibilidad, costo, BYOK vs IA Gerenciada) → [[09-copiloto-ia-partner]]
- Anuncios/Meta Ads y origen del lead → [[04-patrones-reales-de-venta]]
- Base de conocimiento / catálogo → [[20-catalogo-estructura-para-el-agente]]
- API de rmsystemm y webhooks → [[19-investigacion-externa-escalabilidad]] (cambia el diseño de la integración con n8n)
- Audio y Criativos → [[07-estrategias-pendientes-agente]] y [[19-investigacion-externa-escalabilidad]]
- Y una entrada resumen en [[17-registro-de-cambios]].
