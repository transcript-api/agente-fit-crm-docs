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

**⚠️ La sub-pregunta más importante, y es arquitectónica**: según la documentación de la plataforma base, el Copiloto **NO funciona en modo BYOK** ("Bring Your Own Key") — requiere "IA Gerenciada" (clave de IA centralizada del proveedor). **Nosotros hoy estamos en BYOK** (clave propia de OpenAI cargada en el agente). Entonces:
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

### 12. DS Voice / "Enviar funil de Criativos": ¿existe el módulo completo en nuestra cuenta, y el agente puede elegir CUÁL audio mandar según el contexto?
**Por qué importa**: la idea es que el call center grabe audios explicando cada producto/situación, y que el agente elija el correcto según lo que necesita el cliente (ej. detecta una intolerancia y manda el audio de ese producto). Pendiente anotado desde el 2026-09-11 en [[07-estrategias-pendientes-agente]]: el módulo DS Voice con Gatilhos está confirmado en la plataforma base (DKW) pero **nunca se confirmó que exista en nuestra cuenta** — solo vimos el chip de acción "Enviar funil de Criativos" en el editor del agente.
**Preguntar**: ¿tenemos DS Voice habilitado? ¿La selección del audio es por palabra clave fija o el agente puede decidirlo por criterio propio según el tema? ¿Cuántos criativos se pueden cargar y se pueden etiquetar/categorizar para que el agente los distinga?

### 13. "Agendamento de mensagem": ¿el agente puede programar un mensaje para una fecha que dedujo de la conversación?
**Por qué importa**: caso real y frecuente — el cliente dice "cobro el 3 de octubre". Queremos que el agente agende solo el seguimiento para el 4 o 5 (con margen, para no sonar desesperado). Pendiente anotado en [[07-estrategias-pendientes-agente]].
**Preguntar**: ¿la fecha puede salir de una variable/razonamiento del agente, o tiene que ser un delay fijo predefinido?

### 14. Cuando un humano del equipo responde manualmente en una conversación que está atendiendo el agente, ¿el agente se calla solo?
**Por qué importa**: si no, el cliente recibe dos respuestas encimadas y queda pésimo.
**Preguntar también**: ¿qué hace exactamente el toggle "Desactivar agente al responder fuera de la plataforma"? ¿Y "Responder tickets con asignado"?

### 15. "Follow Up → Generativo": ¿usa el mismo prompt del agente o hay que escribirle instrucciones aparte?
**Por qué importa**: queremos que el follow-up mantenga el mismo tono y las mismas reglas (no inventar precios, escalamiento, etc.), no que sea un segundo agente con criterio propio. Además, el plan de Recompra (ver [[14-funil-recompra]]) todavía no definió si el mensaje de reactivación lo manda una automatización fija o el Follow Up Generativo — la respuesta define ese diseño.

### 16. ¿Se puede exportar el historial de conversaciones en bloque?
**Por qué importa**: para revisar periódicamente qué respondió el agente y mejorar el prompt con casos reales (es la práctica que recomiendan todos los que hacen esto en serio). Sin export, hay que revisar chat por chat a mano.

---

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
- **Guardado en dos pasos**: en el editor del agente hay que guardar en el modal Y después "Guardar cambios" en la página. ¿Es el comportamiento esperado? Es fácil perder trabajo sin darse cuenta.
- **Aparece "Conexão ao vivo perdida"** cada tanto en el editor del agente. ¿Es normal? ¿Puede hacer que se pierdan cambios sin guardar?
- Pedirles: **un canal directo para reportar bugs** y si hay **changelog o roadmap público** que podamos seguir.

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
