# Agente de IA — rmsystemm

Ruta en la app: `Agente de IA` (sidebar) → lista de agentes → `/ai-agent/<id>`.

## Historial de agentes vistos
- **"Assistente Fitness"** (id 9347, cuenta Santiago) — visto en la primera auditoría. Provider OpenAI, modelo `gpt-4o-mini`, Clave API real (`sk-proj-...`, **expuesta en el DOM**, ver [[06-seguridad-y-pendientes]]). Instrucciones vacías. Ya no aparece en la lista de agentes (probablemente reemplazado por "Agente fit").
- **"Agente fit"** (id **9816** — cambió de 9756 a 9816, probablemente se recreó en algún momento; actualizar cualquier referencia vieja al id 9756). Provider **OpenAI**, modelo `gpt-4o-mini`. **Clave API sigue rota**: el campo todavía tiene literalmente `usersanti001` (confirmado visualmente de nuevo el 2026-09-11, con el campo revelado vía el ícono de ojo). **Instrucciones (el prompt) sigue completamente vacío** — el prompt v3 (ver [[13-prompt-agente-fit-v1]]) todavía NO se pegó en el agente real. Todos los checkboxes de comportamiento (Responder tickets con asignado, Dividir respuestas en bloques, Procesar imágenes, etc.) están en OFF.
- Ya está vinculado a una cola: **"Atencion IA"** (no existía en la primera auditoría — se creó después) — aunque ver [[16-auditoria-completa-crm]], que documentó que esa cola no tiene Agente de IA vinculado en `Configuración → Colas`; puede que haya sido corregido desde entonces o que sean dos indicadores distintos, pendiente re-confirmar.

## Hallazgo (2026-09-11): existe una capa de integraciones separada, el "Hub de Integraciones"
En `Configuración → Cuentas Integradas` (`/settings/external-accounts`) hay un **Hub de Integraciones** con conectores nativos a: Google Calendar (1 conectada), **Meta Ads (dice "Reconexión necesaria" — confirma que ya estuvo conectado antes)**, **OpenAI Key (1 conectada, cuenta `usersantifitness@gmail.com`, status "Ativo")**, Google Gemini, Shopify, Agent Mail, Cal, Calendly, DocuSign, Formsite, Gmail, Google Sheets, Googleforms, Highlevel, HubSpot, Kommo, Outlook, Pipedrive, Salesforce, Stripe, Telegram, Zendesk, Zoho, Zoho Mail, Zoom — y más (lista con scroll). **No hay conector nativo para Bling** (el ERP real que usa la empresa, ver [[06-seguridad-y-pendientes]]).

**Contradicción importante a resolver**: el Hub dice que hay una cuenta OpenAI conectada y activa, pero el campo "Clave API" propio del editor del Agente Fit sigue con el dato inválido `usersanti001` — son dos sistemas separados. No quedó claro en esta sesión si seleccionar "OpenAI" como Proveedor en el agente debería usar automáticamente la cuenta del Hub, o si el campo de texto del agente necesita sí o sí que le pegues la clave real a mano ahí también. Pendiente de probar: pegar una key real en el campo del agente y ver si al fin funciona en la pestaña "Prueba".

## Estructura del editor de agente (pestañas)
`Entrenamiento` | `Conocimiento` | `Herramientas` | `Prueba` | `Uso` | `Canales`

### Entrenamiento
- Nombre, Proveedor (combobox — opciones confirmadas: **OpenAI, Claude (Anthropic), Gemini, Groq, DeepSeek, Mistral, Grok (xAI)**), Clave API, Modelo.
- Checkboxes de comportamiento: responder tickets con asignado, dividir respuestas en bloques, procesar imágenes, desactivar agente fuera de plataforma, mantener historial de tickets cerrados, responder reacciones IG, mantener como no leídos.
- Campo **Instrucciones** (el prompt principal) — el campo más importante, estaba vacío en ambos agentes vistos.
- **Procesamiento de Acciones**: modo Clásico (default) vs **Avanzado** (recomendado por la plataforma). ⚠️ **Corregido 2026-09-22** (esta línea decía lo contrario, contradecía la nota correcta de más abajo en este mismo archivo): **Avanzado = UNA sola llamada** al modelo con tool calling nativo, decide y ejecuta acciones mientras redacta — ~50% más rápido, caché de prompt ~90%, sin reglas personalizables. **Clásico** es el que tiene "Ver Predeterminado"/"Reglas personalizadas del analizador" (un "Analisador de Ações" separado, con reglas de sistema en portugués) — más lento, no usado hoy. Detalle completo en [[34-arquitectura-conversacional-aprendizajes-agentes]] §29.9.
- **Reglas personalizadas del analizador**: por defecto vacío, usa reglas del sistema (en portugués) que buscan `save_variable`, `http_request`, etc. en el prompt. El texto default del sistema menciona explícitamente funciones como **agregar etiquetas, guardar variables, transferir cola, crear negocios** — confirma que el agente puede mover una tarjeta de columna/cola por sí mismo (vía "transferir cola") como parte de la conversación, además de las automatizaciones fijas de columna (ver [[02-pipeline-comercial-real]]). Esto es lo que responde si "el agente va a poder mover cosas": sí, dinámicamente, no solo por regla de tiempo fija.

### Conocimiento
- Base de conocimiento (RAG) vinculable — vacía en ambos agentes.
- Fuentes externas: Google Sheets o HTTP request en tiempo real — ninguna configurada.
- Umbral de similaridad RAG: default 0.5 (recomendado 0.35 para datos estructurados).

### Herramientas
- **Conectores** (documentado el 2026-09-14 — es la **primera** sección de la pestaña, antes de Follow Up). Texto literal de la interfaz:
  > *"Integraciones conectadas que este agente puede usar. Indica en el texto del prompt, en lenguaje natural, cuándo usar cada una — ej.: «cuando el cliente pida la copia de la factura, envíala por correo usando el conector de Gmail»."*

  Botón "Agregar conector" → modal "Elige la cuenta conectada", que lista **solo las cuentas ya vinculadas en el Hub de Integraciones**. Estado actual: *"Ningún conector adjunto"* — **el agente no tiene acceso a ninguna integración externa hoy.**

  Esto define la cadena real de tres pasos: (1) conectar la cuenta en `Configuración → Cuentas Integradas`, (2) adjuntarla acá, (3) instruir en el prompt cuándo usarla. No hay configuración de parámetros por fuera del prompt. El catálogo completo de los 25 conectores está en [[23-conectores-hub-integraciones]].
- **Agendamientos**: *"Gestiona las cuentas vinculadas y los horarios de agendamiento del agente."* Botón "Vincular cuenta". Hoy dice *"Nenhuma conta Google vinculada ainda"* — **ojo: es una vinculación distinta de la del Hub.** La cuenta de Google Calendar está conectada en el Hub pero no vinculada acá. Incluye el toggle "Respetar horario de envío" (encola los mensajes fuera de la ventana permitida en vez de descartarlos).
- **Follow Up**: botón "Adicionar Follow Up" → modal con 2 modos:
  - **Manual**: mensaje fijo tras tiempo configurado (Nombre, Mensaje, Tipo: Único/Recurrente/[¿Diario?], Tiempo de Espera).
  - **Generativo**: la IA lee el historial (campo "Mensajes del Historial", default 10) y redacta un mensaje según "Instrucciones para el Follow-Up". **Esto confirma que el agente SÍ puede generar mensajes dinámicos, no reciclar el mismo texto siempre.**
  - Ninguno configurado todavía en "Agente fit".
- **Guardrails**: verificaciones automáticas sobre la respuesta antes de llegar al cliente. **Catálogo completo de plantillas confirmado (2026-09-11)**, agrupado en 4 categorías:
  - **Veracidade** (impiden afirmar dato inexistente): Ancoragem de valores (verifica que precios/horarios/fechas citados existan de verdad en los datos consultados).
  - **Consistência** (garantizan que lo prometido pase): Rótulo de mídia na resposta, Resposta vazia, Ferramenta obrigatória (detecta cuando el agente promete algo — "vou transferir" — sin haber ejecutado la función correspondiente).
  - **Estilo**: Vazamento de placeholder (detecta `{{variable}}` sin reemplazar), Saudação repetida, Emojis permitidos, Frases proibidas.
  - **Segurança**: Dado sensível na resposta (enmascara CPF/CNPJ/tarjeta — formato brasileño, no directamente aplicable a Uruguay).
  
  Cada guardrail define: qué revisa, "Qué hacer al violar" (Acción: reprocesar/no enviar/corregir automático + Intentos + "Si aun así viola": transferir a cola / texto fijo / bloqueo silencioso).

  **4 guardrails ya configurados y guardados en "Agente Fit" (2026-09-11)**:
  1. **"No inventar precios"** (Ancoragem de valores) — Verificar preços/horários/datas todos ON, fuente confiable = herramientas+consultas+conocimiento (nunca el propio prompt ni respuestas previas del agente), acepta totales sumados. Al violar: regenera 1 vez, si persiste → transferir a una cola.
  2. **"No mandar mensajes vacías"** (Resposta vazia) — evita mensajes en blanco cuando el modelo se queda sin tokens. Al violar: no envía nada (default).
  3. **"No filtrar placeholders sin completar"** (Vazamento de placeholder) — detecta `{{promos_vigentes}}` u otro placeholder sin reemplazar en la respuesta (relevante porque el prompt v3 todavía tiene ese placeholder sin completar). Al violar: corrige automáticamente (elimina/enmascara el fragmento, envía el resto).
  4. **"No prometer sin ejecutar"** (Ferramenta obrigatória) — gatillo en la RESPUESTA del agente (no en el mensaje del cliente), frases: "te transfiero" / "te paso con" / "te conecto con", exige que haya corrido con éxito la función "Transferir para fila". Al violar: regenera 1 vez (el campo "si aun así viola" quedó sin poder configurarse por un problema de UI — default es bloqueo silencioso, que sigue siendo seguro).

  **Pendiente**: agregar guardrails equivalentes para otras promesas del prompt (agregar tag, guardar variável, transferir coluna no CRM) si se detectan fallos reales en producción — no se armaron todos de entrada para no sobre-configurar antes de tener datos reales de uso.

  **🔴 BUG CONFIRMADO (2026-09-13 madrugada): los guardrails NO persisten.** Se entró de nuevo a revisar los 4 guardrails de arriba (documentados como "guardados" el 2026-09-11) y la pantalla mostraba **"Ningún guardrail configurado"** — se habían perdido. Se intentó recrear "Ancoragem de valores" (No inventar precios) desde cero, siguiendo el flujo completo: configurar en el modal → click "Guardar" (del modal) → click "Guardar cambios" (de la página, arriba a la derecha, que quedó habilitado tras cerrar el modal). Se recargó la página para confirmar y **el guardrail seguía sin aparecer** — "Ningún guardrail configurado" de nuevo, reproducido dos veces (11/09 y 13/09). Conclusión: **la sección "Guardrails" del editor tiene un bug de persistencia real, no es un error de uso** — cualquiera que la use debe verificar SIEMPRE con una recarga de página después de guardar, nunca asumir que "Guardar" alcanzó. Hasta que esto se arregle (reportar a soporte de rmsystemm), **la única protección real contra precios/stock inventados es la regla del propio prompt** (ver [[13-prompt-agente-fit-v1]], regla de escalamiento agregada el 2026-09-13), que depende de que el modelo la respete — no hay red de seguridad automática independiente del modelo hoy.
- **Agendamientos**: vincular cuenta Google Calendar/similar — no vinculado.
- **Respetar horario de envío**: toggle, no confirmado si está activo.
- **Reglas de Activación**: condiciones por etiqueta/cola para cuándo responde el agente — ninguna, "el prompt responderá a todos los contactos" si no hay reglas.

### Canales
- Muestra: Activación general (activos/con responsable/sin responsable), **Colas** vinculadas, **Canales de atención** vinculados.
- En la primera auditoría ("Assistente Fitness"): 0 en todo, sin cola ni canal — estructuralmente no podía atender nada.
- "Agente fit" ya tiene la cola "Atencion IA" vinculada (mejora respecto a la primera auditoría).
- **Confirmado (2026-09-11, sesión en la otra PC)**: "Ningún canal de atención vinculado todavía" — pero en el diálogo real "Vincular canales de atención" ya existen 2 números de WhatsApp reales conectados a la cuenta para elegir: **"Fitness Suplementos"** y **"SUPLEMENTOS ®"**. No hace falta dar de alta ningún número nuevo — vincular uno de estos dos al agente es un solo click en "Vincular" cuando se decida activarlo en producción (paso todavía no hecho a propósito, para no activar nada sin confirmar).

## Panel lateral "Ayuda con IA - Gratis"
Aparece en casi todas las pantallas del editor de agente. Es un copiloto de la propia plataforma para *configurar* cosas por lenguaje natural (no es el agente de venta). Incluido gratis con el plan de rmsystemm — distinto de la facturación de la API del modelo (esa la paga la empresa aparte, ver conversación sobre OpenAI vs Gemini billing).

## Decisión de arquitectura: un solo agente, no uno por pipeline (2026-09-09, ampliada 2026-09-11)
El agente no se conecta a una pipeline — se conecta a una **Cola**/**Canal**, con **Reglas de Activación** que pueden filtrar por etiqueta. No existe "un agente por pipeline" nativo. Se evaluó crear un segundo agente dedicado a Remarketing (ver [[08-funil-remarketing-nuevo]]) y luego también uno dedicado a Recompra (ver [[14-funil-recompra]]), pero **se confirmó dos veces usar un solo agente** con un prompt que tenga secciones/modo según la etiqueta o etapa del contacto (Cualificación, Propuesta, Pago Pendiente, los 3 niveles de temperatura en Seguimiento, Remarketing, y ahora también Recompra — ver [[13-prompt-agente-fit-v1]] para el prompt completo con todos los modos). Motivo: separar agentes duplicaría mantenimiento de conocimiento (RAG), guardrails y tono de marca en varios prompts en vez de uno — y no hay ninguna ventaja de capacidad/concurrencia en separarlos (el agente atiende conversaciones en simultáneo sin importar cuántos "modos" tenga el prompt, cada mensaje dispara una consulta independiente al modelo).


## ✅ Guardrails: S2 resuelto y v1 configurada en el Recepcionista (2026-09-23)

**El bug de persistencia (S2) está arreglado.** Se verificó guardando 6 guardrails y releyéndolos del servidor tras recargar: persisten todos. El catálogo ahora tiene **9 plantillas** y el editor permite **varias reglas del mismo tipo**, cada una con nombre propio.

**Criterio que se siguió** (definido por el usuario con ChatGPT): los guardrails son **restricciones deterministas posteriores a la generación**, no el cerebro del agente. Cubren errores inequívocos de forma. Las decisiones comerciales (qué preguntar, si está cualificado) siguen siendo del prompt.

### Los 6 activos en el Recepcionista (9882)

| id | Nombre | Tipo | Config | Al violar |
|---|---|---|---|---|
| 274 | No sonar a bot ni prometer de mas | `blocked_phrases` | 28 frases, posición `qualquer` | regenerar (2 intentos) → si insiste, corregir |
| 275 | No mandar mensajes vacios | `empty_response` | mínimo 0, `somenteComFerramenta: false` | regenerar (1) → si sigue vacío, no enviar |
| 276 | No volver a presentarse | `duplicate_greeting` | 11 saludos ES + PT | corregir automáticamente |
| 277 | Fillers de apertura | `blocked_phrases` | perfecto, genial, buenisimo, excelente, dale perfecto — posición `inicio` | corregir automáticamente |
| 278 | No filtrar placeholders ni texto interno | `placeholder_leak` | defaults | corregir automáticamente |
| 279 | No filtrar etiquetas de media | `media_label_echo` | rótulos por defecto | regenerar |

**Por qué dos reglas de frases y no una:** borrar automáticamente funciona bien al inicio ("Perfecto, tenemos creatina" → "Tenemos creatina") pero amputa mal en el medio ("Para orientarte bien con el mix, qué..."). Por eso los fillers de apertura se corrigen y el lenguaje de bot se regenera.

**Las 28 frases** salen de errores reales medidos en los tests del 2026-09-23 y del bloque `<ESTILO>` del prompt: plural de atención (te asesoramos, te ayudamos), promesas de otra persona (te pasan, otro asesor, un compañero), promesas de reserva (te reservo, te separo), promesas de inmediatez (ya te digo, enseguida te paso, dame un segundo) y lenguaje meta (te paso una pregunta, para orientarte bien, así lo seguimos).

**Ojo con las listas de frases cortas:** el matcher ignora mayúsculas y acentos pero **no respeta límites de palabra**, así que no se incluyeron "che", "bo" ni "pikas" (matchearían dentro de noche, trabajo, etc.). Solo frases distintivas de dos palabras o más.

### Los 3 que NO se activaron, con el motivo verificado en la UI

**`Ancoragem de valores` — no, por dos razones independientes.** (1) El campo dice literal "Verificar preços — **Valores em R$** citados na resposta", y en Uruguay se escribe `$1.290`, no `R# Agente de IA — rmsystemm

Ruta en la app: `Agente de IA` (sidebar) → lista de agentes → `/ai-agent/<id>`.

## Historial de agentes vistos
- **"Assistente Fitness"** (id 9347, cuenta Santiago) — visto en la primera auditoría. Provider OpenAI, modelo `gpt-4o-mini`, Clave API real (`sk-proj-...`, **expuesta en el DOM**, ver [[06-seguridad-y-pendientes]]). Instrucciones vacías. Ya no aparece en la lista de agentes (probablemente reemplazado por "Agente fit").
- **"Agente fit"** (id **9816** — cambió de 9756 a 9816, probablemente se recreó en algún momento; actualizar cualquier referencia vieja al id 9756). Provider **OpenAI**, modelo `gpt-4o-mini`. **Clave API sigue rota**: el campo todavía tiene literalmente `usersanti001` (confirmado visualmente de nuevo el 2026-09-11, con el campo revelado vía el ícono de ojo). **Instrucciones (el prompt) sigue completamente vacío** — el prompt v3 (ver [[13-prompt-agente-fit-v1]]) todavía NO se pegó en el agente real. Todos los checkboxes de comportamiento (Responder tickets con asignado, Dividir respuestas en bloques, Procesar imágenes, etc.) están en OFF.
- Ya está vinculado a una cola: **"Atencion IA"** (no existía en la primera auditoría — se creó después) — aunque ver [[16-auditoria-completa-crm]], que documentó que esa cola no tiene Agente de IA vinculado en `Configuración → Colas`; puede que haya sido corregido desde entonces o que sean dos indicadores distintos, pendiente re-confirmar.

## Hallazgo (2026-09-11): existe una capa de integraciones separada, el "Hub de Integraciones"
En `Configuración → Cuentas Integradas` (`/settings/external-accounts`) hay un **Hub de Integraciones** con conectores nativos a: Google Calendar (1 conectada), **Meta Ads (dice "Reconexión necesaria" — confirma que ya estuvo conectado antes)**, **OpenAI Key (1 conectada, cuenta `usersantifitness@gmail.com`, status "Ativo")**, Google Gemini, Shopify, Agent Mail, Cal, Calendly, DocuSign, Formsite, Gmail, Google Sheets, Googleforms, Highlevel, HubSpot, Kommo, Outlook, Pipedrive, Salesforce, Stripe, Telegram, Zendesk, Zoho, Zoho Mail, Zoom — y más (lista con scroll). **No hay conector nativo para Bling** (el ERP real que usa la empresa, ver [[06-seguridad-y-pendientes]]).

**Contradicción importante a resolver**: el Hub dice que hay una cuenta OpenAI conectada y activa, pero el campo "Clave API" propio del editor del Agente Fit sigue con el dato inválido `usersanti001` — son dos sistemas separados. No quedó claro en esta sesión si seleccionar "OpenAI" como Proveedor en el agente debería usar automáticamente la cuenta del Hub, o si el campo de texto del agente necesita sí o sí que le pegues la clave real a mano ahí también. Pendiente de probar: pegar una key real en el campo del agente y ver si al fin funciona en la pestaña "Prueba".

## Estructura del editor de agente (pestañas)
`Entrenamiento` | `Conocimiento` | `Herramientas` | `Prueba` | `Uso` | `Canales`

### Entrenamiento
- Nombre, Proveedor (combobox — opciones confirmadas: **OpenAI, Claude (Anthropic), Gemini, Groq, DeepSeek, Mistral, Grok (xAI)**), Clave API, Modelo.
- Checkboxes de comportamiento: responder tickets con asignado, dividir respuestas en bloques, procesar imágenes, desactivar agente fuera de plataforma, mantener historial de tickets cerrados, responder reacciones IG, mantener como no leídos.
- Campo **Instrucciones** (el prompt principal) — el campo más importante, estaba vacío en ambos agentes vistos.
- **Procesamiento de Acciones**: modo Clásico (default) vs **Avanzado** (recomendado por la plataforma). ⚠️ **Corregido 2026-09-22** (esta línea decía lo contrario, contradecía la nota correcta de más abajo en este mismo archivo): **Avanzado = UNA sola llamada** al modelo con tool calling nativo, decide y ejecuta acciones mientras redacta — ~50% más rápido, caché de prompt ~90%, sin reglas personalizables. **Clásico** es el que tiene "Ver Predeterminado"/"Reglas personalizadas del analizador" (un "Analisador de Ações" separado, con reglas de sistema en portugués) — más lento, no usado hoy. Detalle completo en [[34-arquitectura-conversacional-aprendizajes-agentes]] §29.9.
- **Reglas personalizadas del analizador**: por defecto vacío, usa reglas del sistema (en portugués) que buscan `save_variable`, `http_request`, etc. en el prompt. El texto default del sistema menciona explícitamente funciones como **agregar etiquetas, guardar variables, transferir cola, crear negocios** — confirma que el agente puede mover una tarjeta de columna/cola por sí mismo (vía "transferir cola") como parte de la conversación, además de las automatizaciones fijas de columna (ver [[02-pipeline-comercial-real]]). Esto es lo que responde si "el agente va a poder mover cosas": sí, dinámicamente, no solo por regla de tiempo fija.

### Conocimiento
- Base de conocimiento (RAG) vinculable — vacía en ambos agentes.
- Fuentes externas: Google Sheets o HTTP request en tiempo real — ninguna configurada.
- Umbral de similaridad RAG: default 0.5 (recomendado 0.35 para datos estructurados).

### Herramientas
- **Conectores** (documentado el 2026-09-14 — es la **primera** sección de la pestaña, antes de Follow Up). Texto literal de la interfaz:
  > *"Integraciones conectadas que este agente puede usar. Indica en el texto del prompt, en lenguaje natural, cuándo usar cada una — ej.: «cuando el cliente pida la copia de la factura, envíala por correo usando el conector de Gmail»."*

  Botón "Agregar conector" → modal "Elige la cuenta conectada", que lista **solo las cuentas ya vinculadas en el Hub de Integraciones**. Estado actual: *"Ningún conector adjunto"* — **el agente no tiene acceso a ninguna integración externa hoy.**

  Esto define la cadena real de tres pasos: (1) conectar la cuenta en `Configuración → Cuentas Integradas`, (2) adjuntarla acá, (3) instruir en el prompt cuándo usarla. No hay configuración de parámetros por fuera del prompt. El catálogo completo de los 25 conectores está en [[23-conectores-hub-integraciones]].
- **Agendamientos**: *"Gestiona las cuentas vinculadas y los horarios de agendamiento del agente."* Botón "Vincular cuenta". Hoy dice *"Nenhuma conta Google vinculada ainda"* — **ojo: es una vinculación distinta de la del Hub.** La cuenta de Google Calendar está conectada en el Hub pero no vinculada acá. Incluye el toggle "Respetar horario de envío" (encola los mensajes fuera de la ventana permitida en vez de descartarlos).
- **Follow Up**: botón "Adicionar Follow Up" → modal con 2 modos:
  - **Manual**: mensaje fijo tras tiempo configurado (Nombre, Mensaje, Tipo: Único/Recurrente/[¿Diario?], Tiempo de Espera).
  - **Generativo**: la IA lee el historial (campo "Mensajes del Historial", default 10) y redacta un mensaje según "Instrucciones para el Follow-Up". **Esto confirma que el agente SÍ puede generar mensajes dinámicos, no reciclar el mismo texto siempre.**
  - Ninguno configurado todavía en "Agente fit".
- **Guardrails**: verificaciones automáticas sobre la respuesta antes de llegar al cliente. **Catálogo completo de plantillas confirmado (2026-09-11)**, agrupado en 4 categorías:
  - **Veracidade** (impiden afirmar dato inexistente): Ancoragem de valores (verifica que precios/horarios/fechas citados existan de verdad en los datos consultados).
  - **Consistência** (garantizan que lo prometido pase): Rótulo de mídia na resposta, Resposta vazia, Ferramenta obrigatória (detecta cuando el agente promete algo — "vou transferir" — sin haber ejecutado la función correspondiente).
  - **Estilo**: Vazamento de placeholder (detecta `{{variable}}` sin reemplazar), Saudação repetida, Emojis permitidos, Frases proibidas.
  - **Segurança**: Dado sensível na resposta (enmascara CPF/CNPJ/tarjeta — formato brasileño, no directamente aplicable a Uruguay).
  
  Cada guardrail define: qué revisa, "Qué hacer al violar" (Acción: reprocesar/no enviar/corregir automático + Intentos + "Si aun así viola": transferir a cola / texto fijo / bloqueo silencioso).

  **4 guardrails ya configurados y guardados en "Agente Fit" (2026-09-11)**:
  1. **"No inventar precios"** (Ancoragem de valores) — Verificar preços/horários/datas todos ON, fuente confiable = herramientas+consultas+conocimiento (nunca el propio prompt ni respuestas previas del agente), acepta totales sumados. Al violar: regenera 1 vez, si persiste → transferir a una cola.
  2. **"No mandar mensajes vacías"** (Resposta vazia) — evita mensajes en blanco cuando el modelo se queda sin tokens. Al violar: no envía nada (default).
  3. **"No filtrar placeholders sin completar"** (Vazamento de placeholder) — detecta `{{promos_vigentes}}` u otro placeholder sin reemplazar en la respuesta (relevante porque el prompt v3 todavía tiene ese placeholder sin completar). Al violar: corrige automáticamente (elimina/enmascara el fragmento, envía el resto).
  4. **"No prometer sin ejecutar"** (Ferramenta obrigatória) — gatillo en la RESPUESTA del agente (no en el mensaje del cliente), frases: "te transfiero" / "te paso con" / "te conecto con", exige que haya corrido con éxito la función "Transferir para fila". Al violar: regenera 1 vez (el campo "si aun así viola" quedó sin poder configurarse por un problema de UI — default es bloqueo silencioso, que sigue siendo seguro).

  **Pendiente**: agregar guardrails equivalentes para otras promesas del prompt (agregar tag, guardar variável, transferir coluna no CRM) si se detectan fallos reales en producción — no se armaron todos de entrada para no sobre-configurar antes de tener datos reales de uso.

  **🔴 BUG CONFIRMADO (2026-09-13 madrugada): los guardrails NO persisten.** Se entró de nuevo a revisar los 4 guardrails de arriba (documentados como "guardados" el 2026-09-11) y la pantalla mostraba **"Ningún guardrail configurado"** — se habían perdido. Se intentó recrear "Ancoragem de valores" (No inventar precios) desde cero, siguiendo el flujo completo: configurar en el modal → click "Guardar" (del modal) → click "Guardar cambios" (de la página, arriba a la derecha, que quedó habilitado tras cerrar el modal). Se recargó la página para confirmar y **el guardrail seguía sin aparecer** — "Ningún guardrail configurado" de nuevo, reproducido dos veces (11/09 y 13/09). Conclusión: **la sección "Guardrails" del editor tiene un bug de persistencia real, no es un error de uso** — cualquiera que la use debe verificar SIEMPRE con una recarga de página después de guardar, nunca asumir que "Guardar" alcanzó. Hasta que esto se arregle (reportar a soporte de rmsystemm), **la única protección real contra precios/stock inventados es la regla del propio prompt** (ver [[13-prompt-agente-fit-v1]], regla de escalamiento agregada el 2026-09-13), que depende de que el modelo la respete — no hay red de seguridad automática independiente del modelo hoy.
- **Agendamientos**: vincular cuenta Google Calendar/similar — no vinculado.
- **Respetar horario de envío**: toggle, no confirmado si está activo.
- **Reglas de Activación**: condiciones por etiqueta/cola para cuándo responde el agente — ninguna, "el prompt responderá a todos los contactos" si no hay reglas.

### Canales
- Muestra: Activación general (activos/con responsable/sin responsable), **Colas** vinculadas, **Canales de atención** vinculados.
- En la primera auditoría ("Assistente Fitness"): 0 en todo, sin cola ni canal — estructuralmente no podía atender nada.
- "Agente fit" ya tiene la cola "Atencion IA" vinculada (mejora respecto a la primera auditoría).
- **Confirmado (2026-09-11, sesión en la otra PC)**: "Ningún canal de atención vinculado todavía" — pero en el diálogo real "Vincular canales de atención" ya existen 2 números de WhatsApp reales conectados a la cuenta para elegir: **"Fitness Suplementos"** y **"SUPLEMENTOS ®"**. No hace falta dar de alta ningún número nuevo — vincular uno de estos dos al agente es un solo click en "Vincular" cuando se decida activarlo en producción (paso todavía no hecho a propósito, para no activar nada sin confirmar).

## Panel lateral "Ayuda con IA - Gratis"
Aparece en casi todas las pantallas del editor de agente. Es un copiloto de la propia plataforma para *configurar* cosas por lenguaje natural (no es el agente de venta). Incluido gratis con el plan de rmsystemm — distinto de la facturación de la API del modelo (esa la paga la empresa aparte, ver conversación sobre OpenAI vs Gemini billing).

## Decisión de arquitectura: un solo agente, no uno por pipeline (2026-09-09, ampliada 2026-09-11)
El agente no se conecta a una pipeline — se conecta a una **Cola**/**Canal**, con **Reglas de Activación** que pueden filtrar por etiqueta. No existe "un agente por pipeline" nativo. Se evaluó crear un segundo agente dedicado a Remarketing (ver [[08-funil-remarketing-nuevo]]) y luego también uno dedicado a Recompra (ver [[14-funil-recompra]]), pero **se confirmó dos veces usar un solo agente** con un prompt que tenga secciones/modo según la etiqueta o etapa del contacto (Cualificación, Propuesta, Pago Pendiente, los 3 niveles de temperatura en Seguimiento, Remarketing, y ahora también Recompra — ver [[13-prompt-agente-fit-v1]] para el prompt completo con todos los modos). Motivo: separar agentes duplicaría mantenimiento de conocimiento (RAG), guardrails y tono de marca en varios prompts en vez de uno — y no hay ninguna ventaja de capacidad/concurrencia en separarlos (el agente atiende conversaciones en simultáneo sin importar cuántos "modos" tenga el prompt, cada mensaje dispara una consulta independiente al modelo).

. (2) Las fuentes confiables que ofrece son *retorno de herramientas del turno, consultas anteriores del atendimiento y base de conocimiento*: **el contenido del anuncio no cuenta**. El prompt vivo permite explícitamente citar el precio del anuncio, y eso se validó como correcto en el test del Hipercalórico — así que este guardrail bloquearía justo el comportamiento que queremos. Reevaluarlo cuando haya catálogo consultable.

**`Ferramenta obrigatória` — no, y ahora hay evidencia de por qué.** En el trace del test del Hipercalórico, `transfer_order` se ejecuta con `priority: after_response` y queda `Pendente - será executada após resposta`: el `message_sent` fue 18:25:00 y la acción corrió 18:25:23. El guardrail evalúa la respuesta **antes** de enviarla, o sea antes de que la acción haya corrido. Exigir que `transfer_order` haya "rodado com sucesso" fallaría siempre en conversaciones correctas.

**`Dado sensível na resposta` — no aplica.** Enmascara CPF, CNPJ y tarjetas, validando dígito verificador brasileño. No toca direcciones ni datos de envío (no interfiere con la logística), pero tampoco cubre la cédula uruguaya. Inofensivo, inútil acá.

**`Emojis permitidos` — no por ahora.** No es un problema medido y limitar de más vuelve artificial la conversación.

### Consecuencia para el prompt (pendiente, no hecho)

Con el estilo mecánico ya forzado por guardrails, el prompt puede soltar buena parte del bloque `<ESTILO>` (no digas Perfecto, no vuelvas a saludar, no filtres placeholders) y quedarse con lo que sí requiere criterio. **Esa poda no se hizo todavía**: primero hay que verificar los guardrails con 3 o 4 tests reales.

## Hub de Integraciones (Configuración → Cuentas Integradas) — conector nativo de Shopify (2026-09-13)
Además de la integración de Shopify que vive DENTRO de Bling (sincroniza stock/pedidos hacia Bling, ver [[18-integracion-bling]]), rmsystemm tiene su **propio conector de Shopify**, separado, en `Configuración → Cuentas Integradas` (Hub de Integraciones), etiquetado para "Agente de IA" + "Flujo de automatización". Estado: **"No conectado"**. Su descripción real: *"Conecta tu tienda Shopify para sincronizar productos, pedidos y clientes — consultar el estado del pedido en la atención, disparar flujos por eventos de la tienda (nuevo pedido, carrito abandonado) y enriquecer el CRM con los datos de compra."* — es decir, es un canal potencial más rico que Bling para lo que el agente puede hacer (carritos abandonados, eventos de tienda), no un duplicado.

**Diagnóstico del problema reportado** ("no me deja conectar usando esa URL", con `fitnessuplementos.com`): no se pudo completar el flujo de conexión real (el click para iniciar quedó bloqueado por el clasificador de seguridad de Claude Code al ser una integración de producción — correcto no forzarlo sin supervisión). **Hipótesis fundamentada mas no confirmada en la propia UI de rmsystemm**: las conexiones OAuth de Shopify casi siempre piden el handle `tu-tienda.myshopify.com` (el dominio técnico de la tienda), no el dominio personalizado/de marca (`fitnessuplementos.com`) — es el motivo más común de este tipo de fallo en cualquier integración Shopify de terceros. El handle `.myshopify.com` real se consulta desde el propio panel de administración de Shopify (Configuración → Dominios) cuando alguien lo intente de nuevo.

**Ampliación 2026-09-14 — se leyeron los 25 conectores del Hub, uno por uno.** Shopify resultó ser **nativo** (sin catálogo de acciones/disparadores, a diferencia de los 20 que vienen de Composio), y su descripción promete bastante más de lo que decía esta sección: sincronizar productos, pedidos y clientes, **disparar flujos por eventos de tienda (nuevo pedido, carrito abandonado)** y consultar el estado del pedido en la atención. Sigue sin conectar. Detalle, texto literal y las preguntas que quedaron abiertas en [[23-conectores-hub-integraciones]] §4.1.

## Parámetros técnicos confirmados en rmsystemm (2026-09-14, reunión con soporte) — ✅ ajustados el mismo día
Pendiente viejo (de [[10-ds-agente-ds-voice-manual]] y [[12-caso-real-rafael-prompt-produccion]]) **cerrado**: sí existen, en un panel de engranaje junto al selector de Modelo, dentro de Entrenamiento. Se encontraron con el Delay en 0s (riesgo real de respuestas fragmentadas) y se ajustaron en vivo, alineados con lo que recomiendan los archivos de los videos — ver el detalle completo y el "antes/después" en [[13-prompt-agente-fit-v1]] (sección v6):

| Campo | Valor actual (ajustado 2026-09-14) |
|---|---|
| Temperatura | 0,7 (sin cambios, ya estaba en rango) |
| Máx. mensajes en historial | **30** (antes 12) |
| Máx. Tokens en respuesta | **200** (antes 600) |
| Retraso para responder mensajes (segundos) | **25** (antes 0) |
| Ignorar mensagens até X segundos após criação da conversa | 0 (sin cambios, el video recomienda dejarlo así) |

Verificado guardado tras recargar la página.

Toggles confirmados con su estado real (pestaña Entrenamiento, captura de la reunión):
- Responder tickets con asignado: **ON** — ⚠️ confirmar qué significa exactamente antes de asignar el agente a una conversación con responsable humano (riesgo de doble respuesta), ver P4.
- Dividir respuestas en bloques: ON.
- Procesar imágenes: OFF.
- Desactivar agente al responder fuera de la plataforma: ON.
- Mantener historial de tickets cerrados / Responder reacciones de Instagram / Mantener como no leídos: OFF.

## Asignación de agente por conversación (hallazgo 2026-09-14 — mecanismo de rollout controlado)
Dentro de una conversación real, el menú de opciones (junto a "Cerrar", arriba a la derecha) abre **"Gerenciar Agente" → "Selecionar Agente"** — un dropdown que permite asignar (o quitar) el Agente de IA a esa conversación puntual, **sin necesidad de vincular el canal completo**. Esto resuelve S6 (rollout controlado): en vez de conectar el WhatsApp real y que el agente le responda a los ~5000 contactos/mes de una, se lo puede asignar solo a conversaciones/negocios puntuales — por ejemplo, a los que caigan en las columnas vacías de `FV| FUNIL DE VENTAS`, como prueba real sin riesgo. Detalle completo en [[26-respuestas-reunion-soporte-2026-09-14]] #4.

## Pendiente clave
~~El campo "Instrucciones" sigue vacío~~ — **RESUELTO 2026-09-11: el prompt v3 completo ya está pegado y guardado** en el campo "Instrucciones" del Agente Fit (id 9816), ver [[13-prompt-agente-fit-v1]] para el detalle de los ajustes de nombres de función hechos al pegarlo. Se descubrió además que el editor real de "Instrucciones" es un modal grande con un panel lateral "Arraste para adicionar" con chips de acción reales — el catálogo completo de nombres de función quedó documentado en el archivo 13.

~~Clave API rota~~ — **RESUELTO 2026-09-13**: clave real de OpenAI cargada (empieza con `sk-proj-`, 164 caracteres, confirmado en vivo). El modo de ejecución del agente está en **"Avanzado"** (tool calling nativo, recomendado por la plataforma — "~50% más rápido y caché de prompt ~90%").
