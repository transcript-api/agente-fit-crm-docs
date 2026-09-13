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
- **Procesamiento de Acciones**: modo Clásico (default) vs **Avanzado** (recomendado por la plataforma) — Avanzado usa 2 llamadas al modelo (una analiza acciones, otra genera respuesta), ~2x costo/latencia pero más preciso para ejecutar funciones (guardar variable, etiquetar, transferir cola, crear negocio).
- **Reglas personalizadas del analizador**: por defecto vacío, usa reglas del sistema (en portugués) que buscan `save_variable`, `http_request`, etc. en el prompt. El texto default del sistema menciona explícitamente funciones como **agregar etiquetas, guardar variables, transferir cola, crear negocios** — confirma que el agente puede mover una tarjeta de columna/cola por sí mismo (vía "transferir cola") como parte de la conversación, además de las automatizaciones fijas de columna (ver [[02-pipeline-comercial-real]]). Esto es lo que responde si "el agente va a poder mover cosas": sí, dinámicamente, no solo por regla de tiempo fija.

### Conocimiento
- Base de conocimiento (RAG) vinculable — vacía en ambos agentes.
- Fuentes externas: Google Sheets o HTTP request en tiempo real — ninguna configurada.
- Umbral de similaridad RAG: default 0.5 (recomendado 0.35 para datos estructurados).

### Herramientas
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

## Pendiente clave
~~El campo "Instrucciones" sigue vacío~~ — **RESUELTO 2026-09-11: el prompt v3 completo ya está pegado y guardado** en el campo "Instrucciones" del Agente Fit (id 9816), ver [[13-prompt-agente-fit-v1]] para el detalle de los ajustes de nombres de función hechos al pegarlo. Se descubrió además que el editor real de "Instrucciones" es un modal grande con un panel lateral "Arraste para adicionar" con chips de acción reales — el catálogo completo de nombres de función quedó documentado en el archivo 13.

**Nuevo bloqueante central**: la "Clave API" del agente sigue con el dato inválido `usersanti001`. Sin resolver esto (pegar una key real de OpenAI ahí, o confirmar que el Hub de Integraciones la alimenta automáticamente), la pestaña "Prueba" no va a poder correr — es el siguiente paso pendiente antes de poder validar que el prompt funciona de verdad.
