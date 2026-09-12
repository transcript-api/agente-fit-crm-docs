# Manual DS Agente + DS Voice — referencia técnica exhaustiva (DKW System)

**Fuente**: video tutorial oficial de DKW System (dueños/creadores de la plataforma que usa rmsystemm por debajo), analizado con Google AI Studio. Cubre "DS Agente" (el agente conversacional de IA) y "DS Voice" (embudos/creativos multimedia). **Es la documentación más rica que tenemos hasta ahora** — hay que usarla como base al escribir el prompt e instrucciones de "Agente fit" en rmsystemm.

**Aviso de alcance**: el análisis de Google AI Studio se cortó a mitad de la sección "Descripción Visual" (el mensaje excedió el límite de caracteres) — lo que está acá es la transcripción de audio completa (la parte con más contenido útil), no la descripción visual completa. Si hace falta la parte visual, pedirle al usuario que la vuelva a pasar en un mensaje aparte.

**Aclaración de nombres importante (para no confundir)**: "**DS Agente**" (este documento) es el agente conversacional de IA — el mismo concepto que "Agente de IA" en rmsystemm. Es DISTINTO de "**DS Bot**", que es el sistema legacy de Typebot (menú rígido viejo, ver [[05-infraestructura-tecnica]]) — no tienen relación, solo se parecen en el nombre.

## Índice de este documento
1. Creación y parámetros del agente (Temperatura, Delay, tokens, historial)
2. Vinculación agente → cola → canal (cómo se activa el auto-respondido)
3. Analisador de Ações — catálogo completo de gatillos/acciones con ejemplos reales
4. Conocimiento, Herramientas, Prueba, Uso (resto de pestañas)
5. DS Voice — qué son realmente "Enviar Embudo" y "Enviar Creativo"
6. Automatizar DS Voice en columnas del CRM (patrón de goteo/drip real)
7. Hallazgo importante: mecanismo de "Excepción" SÍ existe en esta familia de plataforma
8. DNS/White-label (bajo valor para nosotros, referencia nomás)

---

## 1. Creación y parámetros del agente

Ruta: Automações → DS Agente → "Adicionar Agente". Campos en la creación:
- **Nombre**, **Provedor** (OpenAI Padrão / OpenAI Assistente / Gemini — nota: "OpenAI Assistente" es cuando el prompt se arma AFUERA, directo en la plataforma de OpenAI, y acá solo se pega el ID del assistant; "OpenAI Padrão" es cuando el prompt se escribe DENTRO del editor de este CRM).
- **ID del Assistente** (solo si se usa OpenAI Assistente).
- **API Key** (hay que crearla en OpenAI con saldo cargado, $5-10 usd alcanza para arrancar) — **ADVERTENCIA del video**: la key se muestra completa solo en el momento de creación en OpenAI, después queda oculta — copiarla y guardarla en lugar seguro apenas se crea.
- **Modelo**: el video recomienda explícitamente **4.1, 4.1-mini, 4o, 4o-mini** como los que "funcionan mejor, sin delay, y ejecutan bien las acciones" — 4.1-mini como opción barata recomendada por defecto.
- **Instrucciones** (el prompt).
- **Base de Conocimiento** (se puede cargar acá o después).

### Parámetros avanzados (dentro de la edición, ícono de engranaje) — **verificar si existen estos campos en rmsystemm, no confirmados en la auditoría inicial de "Agente fit"**:
- **Temperatura**: grado de "humanidad" de la IA. Recomendado entre **0.5 y 1**. Más bajo (0.5-0.6) = respuestas más humanas/naturales; más alto (cerca de 1) = más robótico. **Diagnóstico útil**: si la temperatura está en 1 y el agente empieza a mandar mensajes con código/texto raro, es señal de que está muy alta para ese prompt — bajarla a 0.7-0.8 lo arregla.
- **Máximo de mensagens no histórico**: recomendado ~30. Es cuántos mensajes previos recuerda la IA para no repetir preguntas ya respondidas (ej. no volver a pedir el nombre).
- **Máximo de tokens na resposta**: recomendado 150-200, mínimo ~130. Si se deja muy bajo (ej. 50), las respuestas largas quedan CORTADAS a la mitad.
- **Delay antes de responder — MUY IMPORTANTE**: recomendado 20-30 segundos. **Razón concreta**: si un cliente manda 3 mensajes seguidos ("Hola", "¿cómo va?", "me interesa") y el delay está en 0, la IA intenta responder a cada uno por separado → 3 respuestas fragmentadas/duplicadas, desprolijo. Con delay de 20-30s, la IA espera, junta todos los mensajes, y responde UNA vez de forma coherente a todo el contexto. **Esto es directamente aplicable a "Agente fit" cuando configuremos el prompt.**
- **"Ignorar mensagens até X segundos que a conversa foi criada"**: el video recomienda dejarlo en 0/desactivado — puede generar problemas.
- **"Responder tickets com responsável"**: si un humano del equipo ya está atendiendo (está marcado como "responsável" del ticket), la IA deja de responder automáticamente para no duplicar/pisar mensajes.
- **"Dividir respostas em blocos"**: en vez de un solo mensaje gigante, lo divide en varios mensajes más cortos enviados en secuencia (más natural en WhatsApp).
- **"Processar imagens"**: la IA puede "ver" e interpretar imágenes que manda el cliente.
- **"Desabilitar agente quando responder fora da plataforma"**: si un humano responde desde el celular/fuera del CRM, la IA se desactiva para esa conversación.
- **Regras de Ativação**: grupos de condiciones (por tag o por cola, "Tem"/"Não tem") que determinan cuándo se activa el agente — con operador AND/OR entre reglas del grupo.

## 2. Vinculación agente → cola → canal (el paso que hace que responda solo)

Confirma exactamente el mecanismo (coincide con lo que ya sabíamos de rmsystemm, ahora con más detalle):
1. Crear el agente.
2. Ir a **Filas** (colas), editar la cola deseada, y en el campo "DS Agente" seleccionar el agente creado. Guardar.
3. Ir a **Canais de Atendimento** (ej. el WhatsApp conectado), y en su configuración, en "Filas", agregar esa misma cola.
4. Resultado: cuando llega un lead nuevo por ese canal, se enruta a esa cola → la cola tiene el agente vinculado → el agente empieza a atender solo, sin que nadie lo active a mano.

**Relevancia para nosotros**: "Agente fit" ya está vinculado a la cola "Atencion IA" (ver [[01-agente-de-ia]]) — falta confirmar que esa cola esté a su vez vinculada al canal de WhatsApp real para que el flujo esté completo.

## 3. Analisador de Ações — catálogo completo de gatillos/acciones (con ejemplos reales del video)

Hay una opción **"Ver regras padrão"** (ver reglas por defecto) para usar como base en vez de escribir todo desde cero — recomendado explícitamente por el video usarla como punto de partida.

El video muestra el patrón general: en las Instrucciones del prompt se describe una "Etapa" o "Pregunta", y qué **Acción** ejecutar según la respuesta del cliente. Lista completa de tipos de acción, cada una con el ejemplo real que se mostró:

| Acción | Ejemplo mostrado en el video |
|---|---|
| **Adicionar Tag** | "¿Compraste antes en la tienda?" → si dice "No" → tag `Lead Novo` |
| **Transferir Ticket** (a una cola) | "Si el cliente pide hablar con soporte" → transferir a cola "atendimento humano" |
| **Enviar horários disponíveis** | Requiere Google Calendar vinculado — el agente consulta la agenda real y manda los horarios libres |
| **Enviar funil do DS Voice** | Ej. tienda de decoración: cliente pide "ejemplo 1" → se manda el funil con fotos/precio de ese producto específico |
| **Criar Card no CRM** | "Si el cliente muestra interés" → crear negocio en pipeline "Teste", columna "Entrada" |
| **Transferir Coluna no CRM** | "Si el cliente pide presupuesto" → mover la tarjeta a columna "Orçamento" o "Qualificados" |
| **Salvar Variável** | "¿Cuál es tu CPF?" → guarda la respuesta como variable visible en la ficha del cliente (aplicable a nosotros: podríamos guardar objetivo/experiencia del cliente de Cualificación así) |
| **Fazer Requisição HTTP** | Llamar un webhook/API externa |
| **Randomizar Canal** | Rotar entre varios canales de atención para repartir carga |
| **Finalizar Atendimento** | Cierra el ticket cuando ya no hay más que resolver |

**Esto es directamente reutilizable** para escribir la sección de reglas del "Analisador de Ações" de "Agente fit" cuando armemos el prompt — ya tenemos el patrón "Etapa X: [pregunta/situación] → si [respuesta], ejecutar [acción]" con ejemplos concretos de cada tipo de acción.

## 4. Resto de pestañas del editor de agente

- **Conhecimento**: subir PDF, Google Docs, TXT. Además: **link de Google Sheets** (planilla online, se toma como base de conocimiento en vivo) y **HTTP Request** (consulta en tiempo real a un link externo). Coincide con lo ya documentado de rmsystemm.
- **Ferramentas**: activar/desactivar el agente para todos los tickets o solo los que no tienen responsable asignado; **Agendamentos** (vincular cuenta de Google Calendar); **Regras de Ativação** (grupos de condiciones por tag, operador de grupo "todas deben cumplirse" o "al menos una").
- **Teste**: chat de prueba en vivo. **Diagnóstico importante del video**: si el agente no responde nada en la prueba, lo primero a revisar es (1) la API Key es correcta, (2) hay saldo en la cuenta de OpenAI, (3) la configuración de activación — no siempre tira un error visible, simplemente no contesta.
- **Uso**: dashboard de costo estimado en USD, total de tokens gastados, cantidad de requests, promedio — para monitorear gasto.

## 5. DS Voice — qué son realmente "Enviar Embudo" y "Enviar Creativo"

**Esto resuelve una duda que teníamos pendiente**: en el dropdown de Acciones de las automatizaciones de columna de rmsystemm vimos "Enviar Embudo" y "Enviar Creativo" sin saber bien qué hacían — DS Voice es exactamente esa función.

- **Criativos** (4 tipos de contenido reusable, como "respuestas rápidas" turbo del WhatsApp):
  - **Mensagens**: texto con variables dinámicas: `Nome Completo`, `Primeiro Nome`, y **`Saudação`** (se auto-completa como "Bom dia"/"Boa tarde"/"Boa noite"/"Boa madrugada" según la hora real de envío — muy útil, deberíamos ver si rmsystemm tiene el mismo placeholder).
  - **Áudios**: se sube un audio de voz REAL grabado (ej. bajado del propio WhatsApp). **Detalle clave**: activar la opción "Enviar como gravado na hora" para que en el WhatsApp del cliente aparezca el indicador de "grabando audio..." — genera la sensación de que es una persona real grabando en el momento, no un bot.
  - **Mídias**: imágenes/videos, con leyenda opcional.
  - **Documentos**: PDFs, catálogos, propuestas comerciales ya armadas, listas para reenviar.
- **Funis**: una secuencia ordenada de varios criativos (ej. mensaje → espera 5s → audio → imagen → documento), con un delay configurable entre cada paso, reordenable. Se pueden enviar a mano desde la conversación (ícono de enviar → Funis/Mensagens/Áudio/Imagens/Documentos) o escribiendo un atajo de texto que coincide con el título del creativo.
- **Gatilhos** (triggers de DS Voice — DISTINTO del "Analisador de Ações" del agente, esto dispara SIN pasar por la IA, por matching de texto literal):
  - Campos: Nombre del gatillo, Funil a disparar, **Tags** (aplica una etiqueta al contacto cuando se dispara — útil para saber de qué campaña/anuncio vino el lead), Delay antes del disparo (ej. 10 segundos), checkboxes: "No enviar a contactos guardados (privado)", "No enviar a grupos", "Ignorar mayúsculas/minúsculas", y — **obligatorio, si no está tildado el gatillo NO dispara**: "**Disparar en WhatsApp**" (también existe "Disparar en Instagram").
  - **Condición de mensaje**: "si el mensaje es igual a / contiene / empieza con / no contiene" + lista de palabras clave (se pueden poner varias frases/keywords para el mismo gatillo).
  - **Caso de uso real mostrado**: un anuncio de Meta manda al cliente a WhatsApp con un mensaje pre-armado fijo (ej. "Hola, quiero saber más sobre la empresa XYZ") → el gatillo detecta esa frase exacta → manda automáticamente un funil de saludo humanizado (con delay, audio "grabándose", etc.) ANTES de que la IA/un humano intervenga — reduce muchísimo el tiempo de primera respuesta, que es donde más se pierden ventas.

## 6. Automatizar DS Voice en columnas del CRM — patrón de goteo (drip) real

Esto es un ejemplo MUY superior en estructura a lo que armamos en Funil De Ventas — vale la pena comparar/reconsiderar:

Ejemplo mostrado en la columna "Follow Up" (en la cuenta real de DKW, no la nuestra):
- **"Follow 1"**: Disparador "Entrada no Card" → Acción "Enviar Funil" (el funil de saludo completo, inmediato al entrar a la columna).
- **"Follow 2"**: Disparador "Tempo na Coluna" 2 horas → Acción "Enviar Criativo" (un mensaje de texto simple de recordatorio).
- **"Follow 3"**: Disparador "Tempo na Coluna" 1 día → Acción "Enviar Criativo" (un audio de recordatorio).

Es decir: **varias automatizaciones dentro de la MISMA columna, con distintos tiempos, formando una secuencia progresiva** (funil completo → mensaje → audio) en vez de un solo mensaje de texto plano como hicimos nosotros. Podríamos mejorar nuestras automatizaciones de "Recordatorio" en Funil De Ventas siguiendo este patrón más adelante (usando DS Voice/criativos si rmsystemm lo tiene).

**Argumento de negocio del video, fuerte y directo**: cada lead de anuncio pagado es dinero invertido — dejarlo enfriarse sin re-contactar es tirar ese dinero. Recomienda hasta **8 puntos de contacto** para lograr que un lead avance, y que se puede armar una secuencia de automatizaciones de hasta 60 días de follow-up sin esfuerzo humano.

## 7. Hallazgo importante: el mecanismo de "Excepción" SÍ existe en esta familia de plataforma

En la configuración de la automatización de columna, el video muestra una opción de **"Exceção: Troca de Mensagens"** — si el lead respondió dentro de una ventana configurada (ej. 1 hora), esa acción NO se ejecuta (se lo excluye).

**Esto contradice/corrige lo que habíamos documentado en [[02-pipeline-comercial-real]]**: *"No se confirmó la existencia de una sección de 'Excepciones' (tipo 'cancelar si hubo intercambio de mensajes') en esta plataforma — se buscó y no apareció en lo revisado."* Puede que exista en rmsystemm también y no la hayamos visto bien, o que sea una función que rmsystemm no habilitó en su versión white-label. **Pendiente: volver a revisar el modal de automatización en rmsystemm buscando específicamente una opción de "Excepción"/"Troca de Mensagens"** — si existe, resuelve de raíz el problema de que el temporizador "Tiempo en la Columna" no sepa si el cliente ya respondió (limitación que motivó buena parte del diseño manual de Funil De Ventas).

## 8. DNS / White-label (referencia, bajo valor directo para Fitness Suplementos)

Para quien administra la infraestructura del CRM (no nosotros como cliente final): apuntar el dominio propio vía registro DNS Tipo A — front-end en un subdominio libre (ej. `crm`, `dash`, `app`) apuntando a una IP, y back-end/API obligatoriamente en el subdominio literal `api` apuntando a otra IP, ambos con proxy desactivado ("DNS only"). Las IPs mostradas en el video son específicas de la infraestructura de ese partner/demo, no necesariamente las de rmsystemm — no aplicar sin confirmar con quien administra rmsystemm.

## Pendiente
- Conseguir/pedir la parte de "Descripción Visual" que se cortó, si hace falta más detalle de la interfaz.
- ~~Verificar si existen los campos Temperatura/Delay/Máximo tokens~~ — **confirmado con capturas reales en [[12-caso-real-rafael-prompt-produccion]]** (agente real "IA - BENDER": 120 tokens, 120s de delay). Sigue pendiente verificar específicamente en la cuenta de rmsystemm (no en el ejemplo de DKW).
- ¿Existe DS Voice (Criativos/Funis/Gatilhos) como sección separada en rmsystemm? ¿Existe la opción de Excepción "Troca de Mensagens" en las automatizaciones de columna?
- Usar el catálogo de gatillos/acciones (sección 3) como plantilla directa al escribir el prompt de "Agente fit" — ver también el prompt de producción real completo en [[12-caso-real-rafael-prompt-produccion]].
