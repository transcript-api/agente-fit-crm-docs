# Hub de Integraciones — los 25 conectores, leídos uno por uno

**Fecha de lectura: 2026-09-14.** Ubicación: `Configuración → Cuentas Integradas` (URL `/settings/external-accounts`).

Se abrió el panel de **cada uno de los 25 conectores** y se leyeron sus **dos pestañas** ("QUÉ PUEDES HACER" y "DISPARADORES (EVENTOS)") completas, no solo lo visible en pantalla. El texto literal de los 25 paneles está en [[23b-conectores-volcado-literal]] — este archivo es el análisis; ese otro es la fuente sin tocar.

Total catalogado: **226 acciones y 45 disparadores** repartidos en 20 conectores de catálogo, más 5 integraciones nativas.

> **Por qué existe este archivo:** nunca se había abierto ningún conector. Se sabía que el Hub existía, no lo que contenía. Google Sheets con 8 disparadores y Shopify con "carrito abandonado" no estaban documentados en ninguna parte, y los dos tocan planes que ya estaban escritos.

---

## 1. Lo primero: hay dos familias de conectores, y funcionan distinto

### Nativos de la plataforma (5)
No tienen pestañas ni catálogo de acciones. Son integraciones que el CRM implementó él mismo; su panel es solo una descripción y el botón de conectar.

| Conector | Estado hoy |
|---|---|
| Google Calendar e Meet | 1 conectada |
| Meta Ads | 2 conectadas |
| OpenAI Key | 1 conectada |
| Google Gemini Key | No conectado |
| **Shopify** | **No conectado** |

### De catálogo (20)
Cada uno trae una lista de acciones y disparadores traducidos al español. El endpoint interno que los sirve es `api.integrador-crm.com/copilot-tools/composio/connectors` — o sea, **el motor detrás es Composio**, no algo que rmsystemm haya construido. Eso importa por dos razones: el catálogo va a crecer solo (sin que nadie del CRM lo toque), y los límites/errores van a ser los de Composio, no los del CRM.

---

## 2. Cómo se usan de verdad (esto es lo que no sabíamos)

Los conectores **no se activan solos**. La cadena completa es de tres pasos:

1. **Conectar la cuenta** en el Hub (`Configuración → Cuentas Integradas`).
2. **Adjuntarla al agente** en `Agente de IA → Herramientas → Conectores → "Agregar conector"`.
3. **Decirle en el prompt, en lenguaje natural, cuándo usarla.**

Texto literal de esa sección en la pestaña Herramientas:

> *"Integraciones conectadas que este agente puede usar. Indica en el texto del prompt, en lenguaje natural, cuándo usar cada una — ej.: «cuando el cliente pida la copia de la factura, envíala por correo usando el conector de Gmail»."*

Y el estado actual, verificado el 2026-09-14:

> *"Ningún conector adjunto. Conecta cuentas en Configuración → Cuentas Externas y adjúntalas aquí."*

**Consecuencia directa:** el agente hoy no tiene acceso a ninguna integración externa. Y cuando se le adjunte una, la forma de controlarla es escribiendo la instrucción en el prompt — no hay configuración de parámetros por fuera. Eso encaja con cómo ya está escrito el prompt v4 y no obliga a rehacerlo, pero sí hay que agregarle las líneas de "cuándo usar cada conector".

---

## 3. Tabla completa de los 25

| Conector | Estado | Acciones | Disparadores |
|---|---|---|---|
| Google Calendar e Meet | 1 conectada | nativo | nativo |
| Meta Ads | 2 conectadas | nativo | nativo |
| OpenAI Key | 1 conectada | nativo | nativo |
| **Google Sheets** | **1 conectada (hoy)** | **11** | **8** |
| Google Gemini Key | No conectado | nativo | nativo |
| **Shopify** | No conectado | nativo | nativo |
| Agent Mail | No conectado | 5 | 1 |
| Cal | No conectado | 10 | 0 |
| Calendly | No conectado | 4 | 0 |
| DocuSign | No conectado | 15 | 0 |
| Formsite | No conectado | 4 | 0 |
| **Gmail** | No conectado | **11** | **2** |
| Googleforms | No conectado | 9 | 0 |
| Highlevel | No conectado | 12 | 0 |
| HubSpot | No conectado | 9 | 2 |
| Kommo | No conectado | 13 | 0 |
| Outlook | No conectado | 16 | 5 |
| Pipedrive | No conectado | 17 | 3 |
| Salesforce | No conectado | 17 | 7 |
| **Stripe** | No conectado | **15** | **7** |
| **Telegram** | No conectado | **6** | 0 |
| Zendesk | No conectado | 13 | 2 |
| Zoho | No conectado | 14 | 0 |
| Zoho Mail | No conectado | 15 | 0 |
| Zoom | No conectado | 10 | 8 |

Detalle: **Google Sheets lo conectó el usuario el 2026-09-14**, mientras se hacía este barrido. El panel dice "Conectada el 14/9/2026".

Sobre el "31" que se ve arriba de la lista: **no es un contador de integraciones.** Es el logo de Google Calendar (el ícono lleva el número 31 dibujado) que se cuela como texto en la primera tarjeta. Los conectores son 25, no 31.

---

## 4. Los cuatro hallazgos que cambian planes ya escritos

### 4.1 Shopify — puede reemplazar buena parte de lo que Bling no hace

Descripción literal del panel:

> *"Conecta tu tienda Shopify para sincronizar productos, pedidos y clientes — consultar el estado del pedido en la atención, disparar flujos por eventos de la tienda (nuevo pedido, carrito abandonado) y enriquecer el CRM con los datos de compra."*

Esto toca tres cosas que están bloqueadas hoy:

- **Productos.** Hoy el catálogo depende de un export CSV manual de Shopify (E1/E2 en [[PENDIENTES]]) porque la API de Bling ignora los parámetros (B2). Si Shopify sincroniza productos hacia el CRM, el export manual deja de ser el único camino.
- **Carrito abandonado como disparador de flujo.** Es exactamente el caso de uso de [[08-funil-remarketing-nuevo]], y hoy no existe forma de detectarlo. Esto lo resolvería sin escribir una línea de código.
- **Estado del pedido en la atención.** Es una de las consultas que hoy escala al humano.

**Precaución que hay que mantener:** el stock que muestra Shopify viene sincronizado de Bling, así que **hereda los problemas de stock de Bling** (esto ya se corrigió una vez en [[20-catalogo-estructura-para-el-agente]] y sigue valiendo). Shopify resuelve *catálogo, precios, links y pedidos*; **no** garantiza que el número de unidades esté bien.

**PENDIENTE:** conectar Shopify al Hub y verificar qué sincroniza realmente (¿productos completos? ¿con qué frecuencia? ¿los eventos de tienda aparecen como gatillo en Flujos de Automatización?). Es la acción de mayor impacto/esfuerzo de toda la lista.

### 4.2 Google Sheets — 8 disparadores, y eso cambia el diseño del catálogo

[[20-catalogo-estructura-para-el-agente]] asume que la planilla del catálogo se carga como **base de conocimiento (RAG)** en la pestaña Conocimiento: lectura por similitud, pasiva, sin escritura. Ese camino sigue siendo válido, pero ahora hay un **segundo camino que no conocíamos**, y para algunas cosas es mejor.

Las 11 acciones (las 6 marcadas `AUTOMATIZACIÓN` van en **negrita**):

1. Obtener Hoja por Lote
2. **Actualizar valores de la hoja de cálculo**
3. **Agregar Valores a la Hoja de Cálculo**
4. **Buscar fila de la hoja de cálculo** — *"Encuentra la primera fila donde el contenido completo de una celda coincide exactamente con la cadena de consulta"*
5. **Crear Fila en la Hoja**
6. **Limpiar Valores de la Hoja**
7. Buscar Hojas de Cálculo
8. Obtener información de la hoja de cálculo
9. **Crear una Hoja de Google**
10. Agregar Hoja a Hoja Existente
11. Obtener nombres de hojas

Los 8 disparadores:

1. Valores del Rango de Celdas Cambiados
2. Valores del Rango Filtrado Cambiados
3. **Nuevas Filas en Google Sheet**
4. Nueva Hoja Agregada en Google Spreadsheet
5. Nueva Hoja de Cálculo Creada
6. Propiedades de la Hoja de Cálculo Cambiadas
7. Fila de la Hoja de Cálculo Cambiada
8. Coincidencia de Búsqueda en la Hoja de Cálculo

**Lo que esto habilita, concretamente:**

- **RAG vs. búsqueda exacta.** El RAG busca por similitud y puede traer la fila equivocada (el riesgo de precisión que ya estaba anotado en el 20). "Buscar fila de la hoja de cálculo" busca por **coincidencia exacta**. Para precio y link de producto — donde equivocarse es inventar un precio, justo lo que el guardrail quiere evitar — la búsqueda exacta es estrictamente mejor que la similitud. **Lo razonable es usar las dos: RAG para "¿qué me recomendás para ganar masa muscular?" y búsqueda exacta para "¿cuánto sale la creatina ON de 300g?".**
- **El agente puede escribir, no solo leer.** "Agregar Valores" / "Crear Fila" significa que el agente puede registrar en una planilla lo que hoy no tiene dónde guardar: objeciones que aparecen, productos que le piden y no existen, leads que se perdieron y por qué. Eso alimenta N4 y la mejora del prompt con casos reales (S12) sin depender del export de conversaciones.
- **Alerta de stock sin depender de Bling.** El disparador "Nuevas Filas" / "Valores del Rango Cambiados" permite armar la alerta desde una planilla, que es justo lo que B1+B2 tienen bloqueado. No resuelve *de dónde sale el dato de stock*, pero saca a Bling del camino crítico de la notificación.

**PENDIENTE:** confirmar si estos disparadores aparecen como gatillo dentro de **Flujos de Automatización**, o si viven en otro lado. De eso depende que sean usables.

### 4.3 Meta Ads y OpenAI Key — dos descripciones que tocan preguntas de la reunión

**Meta Ads**, literal:

> *"Conecta tu cuenta de Meta Business para gestionar las cuentas publicitarias de Facebook e Instagram — seguir campañas, públicos y métricas de rendimiento — y usar esos datos en el Copiloto y los Flujos (p. ej. reaccionar a leads de anuncios)."*

Toca **S5** (¿el CRM captura de qué anuncio vino el lead?). No lo responde — "reaccionar a leads de anuncios" no dice si el anuncio de origen queda registrado en el contacto — pero acota la pregunta: hay que preguntar por el **campo**, no por la capacidad. Y confirma que la conexión sirve para Flujos, no solo para reportes. Recordar que Meta Ads está en **"Reconexión necesaria"**.

**OpenAI Key**, literal:

> *"Conecta tu clave de OpenAI para usar los modelos GPT (GPT-4o, GPT-5, serie o) y las acciones de OpenAI — texto, imagen, embeddings y moderación — en los Agentes de IA, **el Copiloto** y los Flujos de automatización."*

Esto es relevante para **S4**. En [[09-copiloto-ia-partner]] quedó anotado que el Copiloto no funcionaba en modo BYOK. Acá la plataforma dice explícitamente que la clave propia sirve para el Copiloto. Las dos cosas pueden ser ciertas (el texto describe la intención, el comportamiento observado fue otro), pero **hay que llevar esta frase a la reunión** y preguntar por qué no coincide con lo que se vio. Es mucho más fuerte preguntar con la cita en la mano.

También sirve como confirmación de que la plataforma soporta **GPT-5**, mientras el agente hoy corre en `gpt-4o-mini`.

### 4.4 Google Calendar — el agendamiento ya está descripto

Literal:

> *"Sincroniza los eventos del Calendario de Google con las citas de la plataforma (y viceversa), crea reuniones de Google Meet desde las conversaciones y **activa el módulo de agendamiento en la IA para reservar horarios directo en el chat**. Son los dos únicos permisos que la app solicita: Calendario y Meet."*

Toca **S10** ("Agendamento de mensagem"). Ojo: no es lo mismo. Esto es *reservar una cita*, S10 pregunta por *programar un mensaje para más adelante*. Vale confirmarlo en la reunión para no mezclarlos.

En la pestaña Herramientas del agente existe una sección **Agendamientos** que hoy dice *"Nenhuma conta Google vinculada ainda"* — o sea, la cuenta de Google Calendar está conectada en el Hub pero **no vinculada al agente**. Son dos vinculaciones distintas.

---

## 5. Lo demás, en una línea cada uno

Ninguno tiene un uso obvio hoy, pero quedan catalogados para no volver a mirarlos desde cero:

- **Gmail** (11/2) — el único además de Sheets con acciones `AUTOMATIZACIÓN`. Enviar correo, responder hilo, crear borrador, etiquetar. Útil si alguna vez se atiende por mail.
- **Telegram** (6/0) — enviar mensaje/foto/documento vía bot. Es la vía más barata para **notificaciones internas al equipo** (la alerta de stock hoy va por WhatsApp al admin). Sin disparadores: no sirve para *recibir*.
- **Stripe** (15/7) — cobros, links de pago, facturas, suscripciones. Disparadores de checkout completado y pago fallido. Solo aplica si algún día se cobra fuera de Shopify.
- **Outlook** (16/5), **Zoho Mail** (15/0), **Agent Mail** (5/1) — alternativas de correo.
- **Cal** (10/0), **Calendly** (4/0), **Zoom** (10/8) — agendamiento y reuniones; el CRM ya tiene lo suyo con Google Calendar.
- **HubSpot** (9/2), **Salesforce** (17/7), **Pipedrive** (17/3), **Kommo** (13/0), **Zoho** (14/0), **Highlevel** (12/0) — otros CRMs. Sirven para migrar hacia/desde, no para operar.
- **Zendesk** (13/2) — tickets de soporte.
- **DocuSign** (15/0) — firma electrónica. El más grande del catálogo y el menos aplicable.
- **Googleforms** (9/0), **Formsite** (4/0) — formularios; podrían alimentar leads.

---

## 6. Dos cosas que quedaron sin explicar

**a) El filtro "Agente IA" se contradice con lo que ofrece el agente.** Arriba de la lista hay tres botones: `Todos` (25), `Agente IA` (23), `Flujo` (25). El filtro "Agente IA" **excluye Meta Ads y Google Sheets**. Pero al abrir `Agente de IA → Herramientas → Agregar conector`, el selector **sí ofrece Google Sheets**. Las dos cosas no pueden ser ciertas a la vez. O el filtro está mal, o significa algo distinto de "disponible para el agente". No se tocó nada para resolverlo.

**b) Qué significa exactamente la etiqueta `AUTOMATIZACIÓN`.** Solo 12 de las 226 acciones la llevan, y solo en dos conectores: Google Sheets (6) y Gmail (6). En los dos casos son las acciones que **escriben** (crear, actualizar, agregar, limpiar, enviar) más "Buscar fila" y "Obtener contactos". La hipótesis razonable es que marca las acciones usables como nodo dentro de **Flujos de Automatización**, mientras que las demás solo están disponibles para el agente/Copiloto — pero **es una hipótesis, no está verificado**.

Las dos van a [[PENDIENTES]] y al guion de la reunión.

---

## 7. Qué hacer con esto, en orden

1. **Conectar Shopify** y ver qué sincroniza de verdad. Es lo de mayor impacto y no depende de nadie externo.
2. **Adjuntar Google Sheets al agente** (`Herramientas → Conectores`) una vez que exista la planilla del catálogo, y agregar al prompt la instrucción de cuándo consultarla — usando búsqueda exacta para precio y link.
3. **Vincular la cuenta de Google en la sección Agendamientos** del agente, que está aparte de la conexión del Hub.
4. Llevar a la reunión las citas literales de OpenAI Key (Copiloto + BYOK) y de Meta Ads (origen del lead), y las dos dudas de la sección 6.

## Archivos que hay que revisar a la luz de esto
- [[20-catalogo-estructura-para-el-agente]] — la sección "Decisión: ¿un archivo por categoría...?" se escribió asumiendo que Sheets solo servía como RAG. Sigue valiendo, pero ahora hay búsqueda exacta y escritura.
- [[21-preguntas-para-soporte-rmsystemm]] y [[22-guion-reunion-soporte-portugues]] — agregar las preguntas nuevas.
- [[18-integracion-bling]] — Shopify aparece como alternativa parcial a lo que Bling tiene roto.
- [[01-agente-de-ia]] — documentar la sección Conectores de la pestaña Herramientas.
