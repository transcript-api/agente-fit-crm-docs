# ANEXO — Volcado literal de los paneles del Hub de Integraciones

**Qué es esto:** el texto exacto que muestra cada conector al hacerle click en
Configuración → Cuentas Integradas → Hub de Integraciones, capturado el **2026-09-14**
leyendo el DOM del panel lateral (las dos pestañas: "QUÉ PUEDES HACER" y "DISPARADORES (EVENTOS)").
Nada está resumido ni reescrito: es copia literal, incluidos los errores de traducción de la propia plataforma.

El análisis y las conclusiones están en [[23-conectores-hub-integraciones]]. Este archivo es solo la fuente.

**Nota sobre el orden:** los conectores con cuenta vinculada aparecen primero. Al momento de la captura
había 4 conectados (Google Calendar e Meet, Meta Ads, OpenAI Key, Google Sheets).

**Nota sobre "31":** la primera tarjeta arranca con el texto "31" — no es un contador de integraciones,
es el logo de Google Calendar (el ícono del calendario lleva el número 31 dibujado) renderizado como texto.
Conectores reales: **25**.

---


## Google Calendar e Meet

### Panel — pestana ACCIONES (literal)

```
31

Google Calendar e Meet

1 conectada

Sincroniza los eventos del Calendario de Google con las citas de la plataforma (y viceversa), crea reuniones de Google Meet desde las conversaciones y activa el módulo de agendamiento en la IA para reservar horarios directo en el chat. Son los dos únicos permisos que la app solicita: Calendario y Meet.

Gestionar cuentas
```

### Panel — pestana DISPARADORES

(no existe esa pestana: conector nativo, sin catalogo de acciones/disparadores)


## Meta Ads

### Panel — pestana ACCIONES (literal)

```
Meta Ads

2 conectadas

Conecta tu cuenta de Meta Business para gestionar las cuentas publicitarias de Facebook e Instagram — seguir campañas, públicos y métricas de rendimiento — y usar esos datos en el Copiloto y los Flujos (p. ej. reaccionar a leads de anuncios).

Gestionar cuentas
```

### Panel — pestana DISPARADORES

(no existe esa pestana: conector nativo, sin catalogo de acciones/disparadores)


## OpenAI Key

### Panel — pestana ACCIONES (literal)

```
OpenAI Key

1 conectada

Conecta tu clave de OpenAI para usar los modelos GPT (GPT-4o, GPT-5, serie o) y las acciones de OpenAI — texto, imagen, embeddings y moderación — en los Agentes de IA, el Copiloto y los Flujos de automatización.

Gestionar cuentas
```

### Panel — pestana DISPARADORES

(no existe esa pestana: conector nativo, sin catalogo de acciones/disparadores)


## Google Sheets

### Panel — pestana ACCIONES (literal)

```
Google Sheets

1 conectada

Google Sheets es una herramienta de hoja de cálculo basada en la nube que permite la colaboración en tiempo real, el análisis de datos y la integración con otras aplicaciones de Google Workspace.

CUENTAS CONECTADAS
Añadir
Google Sheets
Conectada el 14/9/2026
QUÉ PUEDES HACER (11)
DISPARADORES (EVENTOS) (8)
Obtener Hoja por Lote
Recupera datos de rangos de celdas especificados en una Hoja de Google.
Actualizar valores de la hoja de cálculo
AUTOMATIZACIÓN
Herramienta para establecer valores en un rango de una hoja de cálculo de Google. Úselo cuando necesite actualizar o sobrescribir valores de celdas existentes en un rango específico.
Agregar Valores a la Hoja de Cálculo
AUTOMATIZACIÓN
Herramienta para agregar valores a una hoja de cálculo. Utiliza cuando necesites añadir nuevos datos al final de una tabla existente en una hoja de cálculo de Google.
Buscar fila de la hoja de cálculo
AUTOMATIZACIÓN
Encuentra la primera fila en una hoja de cálculo de Google donde el contenido completo de una celda coincide exactamente con la cadena de consulta, buscando dentro de un rango de notación A1 especificado o en la primera hoja por defecto.
Crear Fila en la Hoja
AUTOMATIZACIÓN
Inserta una nueva fila vacía en una hoja específica de una Hoja de Google en un índice dado, heredando opcionalmente el formato de la fila anterior.
Limpiar Valores de la Hoja
AUTOMATIZACIÓN
Limpia el contenido de las celdas (preservando formato y notas) de un rango especificado en notación A1 en una Hoja de Google; el rango debe corresponder a una hoja y celdas existentes.
Buscar Hojas de Cálculo
Busca hojas de cálculo de Google utilizando varios filtros que incluyen nombre, contenido, rangos de fechas y más.
Obtener información de la hoja de cálculo
Recupera metadatos para una hoja de cálculo de Google usando su ID. Por defecto, devuelve información esencial (ID, título, propiedades de la hoja) para evitar problemas de tamaño de carga. Utiliza el parámetro fields para metadatos completos o campos específicos.
Crear una Hoja de Google
AUTOMATIZACIÓN
Crea una nueva Hoja de Google en Google Drive. Si se proporciona un título, la hoja se creará con ese nombre. Si no se proporciona ningún título, Google creará una hoja con un nombre predeterminado como 'Hoja sin título'. Opcionalmente, cree la hoja en una carpeta específica proporcionando: - folder_id: El ID de la carpeta de Google Drive (preferido, inequívoco) - folder_name: El nombre de la carpeta (busca coincidencia exacta; si hay varias carpetas que coinciden, devuelve opciones) Si no se proporciona ni folder_id ni folder_name, la hoja se crea en la carpeta raíz de Drive.
Agregar Hoja a Hoja Existente
Agrega una nueva hoja a una hoja. Soporta tres tipos de hojas: GRID, OBJECT y DATA_SOURCE. TIPOS DE HOJA: - GRID (predeterminado): Hoja estándar con filas/columnas. Usa propiedades para establecer dimensiones, color de pestaña, etc. - OBJECT: Hoja que contiene un gráfico. Requiere objectSheetConfig con chartSpec (basicChart o pieChart). - DATA_SOURCE: Hoja conectada a BigQuery. Requiere dataSourceConfig con especificación de BigQuery y el ámbito OAuth bigquery.readonly. OTRAS NOTAS: - Los nombres de las hojas deben ser únicos; usa forceUnique=true para agregar automáticamente un sufijo (_2, _3) si el nombre existe - Para colores de pestañas, usa O rgbColor O themeColor, no ambos - Evita 'index' al crear hojas en paralelo (causa errores) - Las hojas OBJECT se crean a través de addChart con position.newSheet=true - Las hojas DATA_SOURCE requieren el ámbito OAuth bigquery.readonly Casos de uso: Agregar hoja de cuadrícula estándar, crear gráfico en hoja dedicada, conectar a fuente de datos de BigQuery.
Obtener nombres de hojas
Lista todos los nombres de las hojas de una hoja de cálculo de Google especificada (que debe existir), útil para descubrir hojas antes de otras operaciones.
```

### Panel — pestana DISPARADORES (literal)

```
Google Sheets

1 conectada

Google Sheets es una herramienta de hoja de cálculo basada en la nube que permite la colaboración en tiempo real, el análisis de datos y la integración con otras aplicaciones de Google Workspace.

CUENTAS CONECTADAS
Añadir
Google Sheets
Conectada el 14/9/2026
QUÉ PUEDES HACER (11)
DISPARADORES (EVENTOS) (8)
Valores del Rango de Celdas Cambiados
Se activa cuando los valores en un rango A1 especificado cambian en Google Sheets. Este disparador monitorea una celda específica o un rango de celdas y se activa cuando cambian los valores.
Valores del Rango Filtrado Cambiados
Disparador de sondeo que monitorea los rangos filtrados de Google Sheets en busca de cambios de valor. Utiliza la diferenciación basada en instantáneas para detectar cuándo cambian los valores que coinciden con un filtro de datos. Emite los valores coincidentes cuando se detectan cambios.
Nuevas Filas en Google Sheet
Disparador de sondeo simple que monitorea Google Sheets en busca de nuevas filas. Detecta cuando se agregan nuevas filas y devuelve los datos completos de la fila. Perfecto para activar cualquier flujo de trabajo basado en nuevas entradas de la hoja.
Nueva Hoja Agregada en Google Spreadsheet
Disparador de sondeo que detecta cuando se agrega una nueva hoja a un Google Spreadsheet.
Nueva Hoja de Cálculo Creada
Se activa cuando se crea una nueva hoja de cálculo de Google. Este disparador monitorea hojas de cálculo de Google y se activa cuando se detectan nuevas hojas de cálculo. Utiliza filtrado por timestamp para detectar de manera eficiente las hojas de cálculo recién creadas.
Propiedades de la Hoja de Cálculo Cambiadas
Disparador de sondeo que detecta cuando cambian las propiedades de nivel superior de una hoja de cálculo de Google. Monitorea propiedades como título, localidad, zona horaria y configuraciones de recálculo automático.
Fila de la Hoja de Cálculo Cambiada
Se activa cuando cambia una fila de hoja de cálculo buscada. Este disparador monitorea una fila específica (ubicada buscando un valor de consulta dentro de un rango especificado por el usuario) y se activa cuando cambian los valores de la fila, cuando la fila aparece o cuando la fila desaparece.
Coincidencia de Búsqueda en la Hoja de Cálculo
Se activa cuando aparece una nueva hoja de cálculo que coincide con una búsqueda guardada. Este disparador utiliza la diferenciación basada en instantáneas para detectar cuándo se crean nuevas hojas de cálculo que coinciden con los criterios de búsqueda o se vuelven visibles para el usuario.
```


## Google Gemini Key

### Panel — pestana ACCIONES (literal)

```
Google Gemini Key

No conectado

Conecta tu clave de Google Gemini para usar los modelos Gemini (2.5 y 1.5) y las acciones de Gemini — texto, visión y embeddings — en los Agentes de IA, el Copiloto y los Flujos de automatización.

Conectar
```

### Panel — pestana DISPARADORES

(no existe esa pestana: conector nativo, sin catalogo de acciones/disparadores)


## Shopify

### Panel — pestana ACCIONES (literal)

```
Shopify

No conectado

Conecta tu tienda Shopify para sincronizar productos, pedidos y clientes — consultar el estado del pedido en la atención, disparar flujos por eventos de la tienda (nuevo pedido, carrito abandonado) y enriquecer el CRM con los datos de compra.

Conectar
```

### Panel — pestana DISPARADORES

(no existe esa pestana: conector nativo, sin catalogo de acciones/disparadores)


## Agent Mail

### Panel — pestana ACCIONES (literal)

```
Agent Mail

No conectado

AgentMail proporciona a los agentes de IA sus propios buzones de correo electrónico, lo que les permite enviar, recibir y actuar sobre correos electrónicos para comunicarse con servicios, personas y otros agentes.

Conectar
QUÉ PUEDES HACER (5)
DISPARADORES (EVENTOS) (1)
Obtener Mensaje
Recupere los detalles completos de un mensaje de correo electrónico específico de un buzón de AgentMail. Esta acción devuelve el contenido completo del mensaje, incluidos el remitente, los destinatarios, el asunto, el cuerpo (tanto texto como HTML), los archivos adjuntos, las etiquetas y los metadatos. Úselo para leer mensajes individuales después de descubrirlos a través de LIST_MESSAGES o webhooks.
Listar Mensajes
Liste mensajes de un buzón de AgentMail. Devuelve un array de `messages`; cada mensaje utiliza los campos `message_id` y `timestamp` (no `id`, `date` o `items`).
Enviar Correo Electrónico
Envía un correo electrónico utilizando la API de AgentMail.
Crear Buzón
Crea un nuevo buzón de AgentMail a través de la API. Devuelve el inbox_id y la dirección de correo electrónico para enviar/recibir mensajes. Úselo al aprovisionar nuevos buzones para agentes o flujos de trabajo.
Listar Buzones
Liste todos los buzones disponibles para la cuenta autenticada de AgentMail. Úselo para descubrir valores válidos de inbox_id para operaciones de mensajes.
```

### Panel — pestana DISPARADORES (literal)

```
Agent Mail

No conectado

AgentMail proporciona a los agentes de IA sus propios buzones de correo electrónico, lo que les permite enviar, recibir y actuar sobre correos electrónicos para comunicarse con servicios, personas y otros agentes.

Conectar
QUÉ PUEDES HACER (5)
DISPARADORES (EVENTOS) (1)
Nuevo Correo Recibido
Disparador para nuevos correos en una bandeja de entrada de AgentMail
```


## Cal

### Panel — pestana ACCIONES (literal)

```
Cal

No conectado

Cal simplifica la coordinación de reuniones al proporcionar páginas de reserva compartibles, sincronización de calendarios y gestión de disponibilidad para agilizar el proceso de programación.

Conectar
QUÉ PUEDES HACER (10)
DISPARADORES (EVENTOS) (0)
Crear una nueva reserva
Crea una nueva reserva para un tipo de evento a una hora de inicio especificada. Utilice esta acción para programar una reunión con un usuario de Cal.com. Requisitos previos: 1. Obtenga un ID de tipo de evento válido de list_event_types 2. Encuentre un horario disponible utilizando get_available_slots_info 3. Proporcione el nombre y el correo electrónico del asistente en el objeto 'responses' 4. Especifique las preferencias de zona horaria e idioma La reserva se creará con el estado 'ACEPTADO' si no se requiere confirmación, o 'PENDIENTE' si el tipo de evento requiere confirmación del anfitrión.
Obtener todas las reservas
Busca una lista de reservas, opcionalmente filtradas por estado, asistente, rango de fechas o por IDs de evento/equipo (que deben pertenecer/incluir al usuario autenticado, respectivamente), con soporte para paginación y ordenación.
Recuperar detalles de la reserva por uid
Busca detalles completos para una reserva existente, identificada por su `bookingUid`.
Cancelar reserva por uid
Cancela una reserva existente y activa de Cal.com utilizando su identificador único (UID).
Reprogramar reserva por uid
Reprograma una reserva existente (identificada por `bookingUid`) a un nuevo horario. Requiere el UID de la reserva y el nuevo horario de inicio en formato ISO 8601. Opcionalmente, puedes proporcionar un motivo para la reprogramación y el correo electrónico de la persona que está reprogramando.
Confirmar reserva por uid
Confirma una reserva existente por `bookingUid` si la reserva existe y está en un estado que permite la confirmación (por ejemplo, no cancelada o ya confirmada); esto finaliza la reserva, no modifica sus detalles y debe realizarse normalmente una vez.
Obtener información sobre slots disponibles
Recupera slots de tiempo disponibles para la programación considerando reservas existentes y disponibilidad, basándose en criterios como un rango de tiempo especificado y tipo de evento.
Listar tipos de eventos
Recupera tipos de eventos de Cal, filtrables por `username` (requerido si se proporciona `eventSlug`), múltiples `usernames` o detalles de la organización (`orgSlug` o `orgId`).
Obtener detalles del tipo de evento
Busca todas las configuraciones y características para un solo tipo de evento (identificado por orgId, teamId y eventTypeId), que debe existir y ser accesible; esta acción de solo lectura no puede listar, crear o modificar tipos de eventos.
Obtener lista de equipos
Recupera todas las equipos a las que pertenece el usuario, incluidos sus nombres y miembros.
```

### Panel — pestana DISPARADORES (literal)

```
Cal

No conectado

Cal simplifica la coordinación de reuniones al proporcionar páginas de reserva compartibles, sincronización de calendarios y gestión de disponibilidad para agilizar el proceso de programación.

Conectar
QUÉ PUEDES HACER (10)
DISPARADORES (EVENTOS) (0)

Sin disparadores disponibles.
```


## Calendly

### Panel — pestana ACCIONES (literal)

```
Calendly

No conectado

Calendly es una herramienta de programación de citas que automatiza las invitaciones a reuniones, las verificaciones de disponibilidad y los recordatorios, ayudando a individuos y equipos a evitar el intercambio de correos electrónicos.

Conectar
QUÉ PUEDES HACER (4)
DISPARADORES (EVENTOS) (0)
Crear enlace de programación
Crea un enlace de programación de un solo uso. Crea un enlace de programación que se puede usar para reservar un evento. El enlace permite a los invitados programar hasta el número máximo especificado de eventos. Una vez alcanzado el límite, el enlace se vuelve inactivo.
Obtener evento
Úselo para recuperar un evento programado específico de Calendly por su UUID, siempre que el evento exista en la cuenta del usuario de Calendly.
Obtener tipo de evento
Recupera detalles de un tipo de evento específico de Calendly, identificado por su UUID, que debe ser válido y corresponder a un tipo de evento existente.
Crear enlace de programación de un solo uso
Crea un enlace de programación de un solo uso para un tipo de evento activo de Calendly, que expira después de una reserva.
```

### Panel — pestana DISPARADORES (literal)

```
Calendly

No conectado

Calendly es una herramienta de programación de citas que automatiza las invitaciones a reuniones, las verificaciones de disponibilidad y los recordatorios, ayudando a individuos y equipos a evitar el intercambio de correos electrónicos.

Conectar
QUÉ PUEDES HACER (4)
DISPARADORES (EVENTOS) (0)

Sin disparadores disponibles.
```


## DocuSign

### Panel — pestana ACCIONES (literal)

```
DocuSign

No conectado

DocuSign proporciona soluciones de firma electrónica y acuerdos digitales, permitiendo a las empresas enviar, firmar, rastrear y gestionar documentos electrónicamente.

Conectar
QUÉ PUEDES HACER (15)
DISPARADORES (EVENTOS) (0)
Eliminar lista de envío masivo
Este endpoint elimina una lista de envío masivo específica de una cuenta de DocuSign. Se utiliza para eliminar permanentemente una lista de envío masivo que ya no es necesaria o que fue creada por error. La operación requiere tanto el identificador de la cuenta como el ID específico de la lista de envío masivo para garantizar la segmentación precisa de la lista a eliminar. Tras la eliminación exitosa, devuelve un resumen de las listas de envío masivo restantes asociadas con la cuenta. Este endpoint debe usarse con precaución, ya que la eliminación es irreversible. Es particularmente útil para mantener un conjunto limpio y organizado de listas de envío masivo, especialmente en entornos donde la gestión de listas es crucial para el cumplimiento o la eficiencia. Ten en cuenta que esta operación no afecta a ningún sobre que ya haya sido enviado utilizando la lista eliminada.
Agregar contactos a la lista de contactos
Agrega múltiples contactos a la lista de contactos de un usuario en DocuSign. Este endpoint permite la adición masiva de contactos con información detallada, incluidos los detalles del proveedor de la nube, números de teléfono, direcciones de correo electrónico e información específica del notario. Es particularmente útil para llenar el libro de direcciones de un usuario de manera eficiente o sincronizar contactos de fuentes externas. El endpoint admite varios tipos de contactos, incluidos contactos regulares, contactos compartidos y grupos de firma. Úselo cuando necesite agregar o actualizar múltiples contactos simultáneamente en una cuenta de DocuSign. Tenga en cuenta que, aunque puede manejar una variedad de información de contacto, no proporciona funcionalidad para eliminar o desactivar contactos.
Agregar o actualizar la firma del usuario
Este endpoint permite agregar o actualizar la firma de un usuario en DocuSign. Proporciona una gestión integral de las propiedades de la firma, incluida la imagen de la firma, la fuente, las iniciales y los detalles del sello. Utilice este endpoint cuando necesite crear una nueva firma para un usuario o modificar una existente. El endpoint admite varios tipos de firma (firmas estándar, iniciales y sellos) y permite una personalización detallada de la apariencia y el comportamiento de la firma. Es particularmente útil para mantener actualizada y personalizada la información de firma para los usuarios de DocuSign. Tenga en cuenta que los usuarios solo pueden gestionar sus propias firmas; incluso los usuarios con derechos de administrador no pueden modificar la configuración de firma de otro usuario.
Eliminar imagen de perfil del usuario
Elimina la imagen de perfil de un usuario específico dentro de una cuenta de DocuSign. Este endpoint debe utilizarse cuando un usuario desea eliminar su foto de perfil actual de su cuenta de DocuSign. Es importante señalar que esta operación solo puede ser realizada por el usuario en su propio perfil; incluso los usuarios con derechos de administrador no pueden eliminar la imagen de perfil de otro usuario. El endpoint requiere tanto el ID de la cuenta como el ID del usuario a especificar, asegurando que la operación se realice en el usuario correcto dentro de la cuenta correcta. Después de la eliminación exitosa, el perfil del usuario ya no tendrá una imagen asociada. Este endpoint no proporciona la capacidad de cargar una nueva imagen; solo elimina la existente.
Registrar pago en la factura
Registra un pago en facturas vencidas para una cuenta de DocuSign. Esta acción aplica un monto de pago para liquidar saldos de facturas pendientes y crea un registro de transacción de pago. Antes de usar esta acción, recupera información de facturas vencidas utilizando la acción 'Listar Facturas Vencidas' para obtener el saldo total adeudado y verificar que 'paymentAllowed' sea verdadero. El monto del pago debe coincidir exactamente con el valor 'pastDueBalance' de esa respuesta. Esta acción requiere privilegios de administrador de cuenta y el alcance OAuth 'billing:write'. Solo está disponible para cuentas de producción con funciones de facturación habilitadas; las cuentas de demostración devolverán un error 400 Bad Request con 'BILLING_PLAN_ERROR' indicando que el administrador de pagos está bloqueado. Utiliza esto cuando necesites liquidar programáticamente las facturas vencidas de la cuenta de DocuSign a través de la API REST.
Actualizar imagen de perfil del usuario
Actualiza la imagen de perfil del usuario en DocuSign subiendo un nuevo archivo de imagen. Esta acción permite a los usuarios personalizar su cuenta de DocuSign subiendo una foto de perfil. Los formatos admitidos incluyen GIF, PNG, JPEG y BMP. El archivo de imagen debe tener menos de 200KB y, para una visualización óptima, DocuSign recomienda dimensiones de no más de 79x79 píxeles. Nota: Los usuarios solo pueden actualizar su propia imagen de perfil. El userId se establece automáticamente como el usuario autenticado.
Obtener información sobre listas de envío masivo
Recupera una lista de Listas de Envío Masivo pertenecientes al usuario actual en una cuenta DocuSign especificada. Este endpoint proporciona información básica sobre cada Lista de Envío Masivo, incluyendo su identificador único, creador, fecha de creación y nombre. Es particularmente útil para gestionar y rastrear operaciones de envío masivo, permitiendo a los usuarios obtener una visión general de sus Listas de Envío Masivo disponibles. Esta herramienta debe ser utilizada cuando necesite inventariar o gestionar Listas de Envío Masivo para distribución de documentos de alto volumen. No proporciona información detallada sobre el contenido de cada lista ni permite la modificación de las listas. La respuesta se limita a información básica resumida y no incluye los destinatarios reales o documentos asociados con cada lista.
Obtener lista de tipos de archivos no soportados
Recupera la lista de tipos de archivos (extensiones y tipos MIME) que DocuSign no admite para carga. Úselo para validar tipos de archivos antes de la carga o para mostrar formatos admitidos a los usuarios. La lista puede cambiar a medida que DocuSign actualiza sus tipos de archivos admitidos.
Actualizar información del perfil del usuario
Actualiza el perfil de un usuario en DocuSign, incluidos detalles personales, configuraciones de privacidad e información de la tarjeta de identificación del usuario. Permite modificaciones en el nombre, dirección, preferencias de localidad y varias configuraciones de la cuenta. Los usuarios solo pueden actualizar su propia información. Algunas configuraciones pueden requerir derechos administrativos para su modificación. Utilice para mantener actualizados los perfiles de los usuarios y ajustar preferencias.
Eliminar archivos o carpetas del espacio de trabajo
Este endpoint permite la eliminación de uno o más archivos o subcarpetas de una carpeta o raíz del espacio de trabajo de DocuSign. Se utiliza para eliminar elementos no deseados u obsoletos de un espacio de trabajo, ayudando a mantener la organización y gestionar el almacenamiento. La operación puede manejar eliminaciones masivas, lo que la hace eficiente para limpiar varios elementos a la vez. Es importante señalar que esta acción es irreversible, por lo que los usuarios deben tener cuidado al seleccionar elementos para eliminar. El espacio de trabajo debe tener un estado 'activo' para que esta operación tenga éxito. Este endpoint no debe utilizarse para la gestión de archivos temporales o como medio de archivo, ya que los elementos eliminados no pueden recuperarse a través de la API.
Eliminar información de firma del usuario
Elimina la información de firma de un usuario específico en DocuSign. Este endpoint debe utilizarse cuando un usuario desea eliminar su firma existente de su cuenta de DocuSign. Es particularmente útil para actualizar o renovar información de firma. La operación está restringida a las propias firmas del usuario autenticado y no puede utilizarse para modificar datos de otros usuarios, incluso con derechos de administrador. Es importante tener en cuenta que esta acción es irreversible, por lo que debe utilizarse con precaución. El endpoint acepta un ID de firma o un nombre de firma, pero se recomienda utilizar el ID de firma para evitar problemas de codificación de URL.
Agregar archivo al espacio de trabajo
Este endpoint agrega un archivo a una carpeta específica dentro de un espacio de trabajo de DocuSign. Permite a los usuarios cargar y organizar archivos en su cuenta de DocuSign, lo que permite una mejor gestión de documentos y colaboración. El método debe usarse al integrar la funcionalidad de carga de archivos con espacios de trabajo de DocuSign, como al agregar nuevos documentos a un proyecto o compartir archivos con miembros del equipo. Es importante tener en cuenta que este endpoint solo maneja el proceso de adición de archivos y no proporciona funciones para modificar o eliminar archivos.
Agregar o actualizar sellos de cuenta
Agregue o actualice sellos a nivel de cuenta (sellos estilo Hanko japonés) en DocuSign. Los sellos son imágenes de firma preconfiguradas que se pueden aplicar a documentos. Esta acción admite la creación de nuevos sellos o la actualización de los existentes, incluyendo el signatureId. **Casos de uso comunes:** - Crear sellos de nombre (formato NameHanko) para la firma rápida de documentos - Crear sellos de nombre+fecha (formato NameDateHanko) para firmas con fecha - Actualizar propiedades del sello, como tamaño, formato o permisos de redimensionamiento - Administrar múltiples sellos en operaciones masivas **Campos requeridos para crear sellos:** - signatureName: Nombre que se mostrará para el sello - stampType: Debe ser 'stamp' (no 'signature') - stampFormat: Puede ser 'NameHanko' o 'NameDateHanko' **Para actualizar sellos existentes:** Incluya el signatureId junto con los campos actualizados. Nota: Esto solo gestiona definiciones de sellos, no la firma real de documentos.
Agregar parte a la carga en partes
Agrega un fragmento o parte a una carga en partes existente en DocuSign. Este endpoint se utiliza para cargar archivos grandes en piezas más pequeñas, permitiendo documentos que superan los límites de tamaño de archivo estándar. Debe usarse después de iniciar una nueva carga en partes y cargar la primera parte. El método es particularmente útil para manejar grandes PDFs y otros documentos. Es importante tener en cuenta que las partes deben cargarse idealmente en orden secuencial, y toda la carga en partes debe completarse y utilizarse dentro de los 20 minutos posteriores a la inicialización. Este endpoint no puede reemplazar partes ya recibidas ni agregar a cargas comprometidas.
Agregar usuarios a grupo existente
Agrega uno o más usuarios existentes de DocuSign a un grupo existente dentro de una cuenta específica. Este endpoint se utiliza para gestionar la membresía de grupos al agregar usuarios a un grupo predefinido. Requiere el ID de la cuenta y el ID del grupo como parámetros de ruta y acepta una lista de información del usuario en el cuerpo de la solicitud. La operación devuelve información detallada sobre los usuarios agregados y el conjunto de resultados. Utilice este endpoint cuando necesite actualizar la membresía de grupos u organizar usuarios en grupos específicos para control de acceso o fines administrativos. Tenga en cuenta que este endpoint solo agrega usuarios existentes a un grupo; no crea nuevos usuarios ni grupos.
```

### Panel — pestana DISPARADORES (literal)

```
DocuSign

No conectado

DocuSign proporciona soluciones de firma electrónica y acuerdos digitales, permitiendo a las empresas enviar, firmar, rastrear y gestionar documentos electrónicamente.

Conectar
QUÉ PUEDES HACER (15)
DISPARADORES (EVENTOS) (0)

Sin disparadores disponibles.
```


## Formsite

### Panel — pestana ACCIONES (literal)

```
Formsite

No conectado

Formsite ayuda a los usuarios a crear formularios y encuestas en línea con herramientas de arrastrar y soltar, captura de datos segura e integraciones para simplificar flujos de trabajo.

Conectar
QUÉ PUEDES HACER (4)
DISPARADORES (EVENTOS)
Obtener Detalles del Formulario
Esta herramienta recupera información detallada sobre un formulario específico en Formsite. Proporciona detalles completos, incluyendo la descripción interna del formulario, identificador del directorio, nombre, información de publicación (código de inserción y enlace del formulario), estado actual (por ejemplo, "abierto") y estadísticas (tamaño del archivo y número de resultados). **Importante**: Si la base_url de la conexión no incluye el directorio del usuario, debe proporcionar el parámetro 'user_dir'. Encuentre esto en las URL de sus formularios de Formsite (por ejemplo, si la URL es https://fs8.formsite.com/user123/forms/abc, user_dir es 'user123') o en Configuración -> Integraciones -> API de Formsite.
Obtener Elementos del Formulario
Recupera todos los elementos (preguntas) de un formulario específico utilizando la API de Formsite. Esta acción devuelve información detallada sobre cada elemento del formulario, incluyendo: - ID del elemento (identificador único para la pregunta del formulario) - Posición (orden secuencial en el formulario) - Etiqueta (el texto de la pregunta) - Hijos (opcional, para elementos de Matriz y Multi Escala con sub-elementos) Los datos del elemento pueden ser utilizados para etiquetar los datos de resultados al hacer coincidir los IDs de los elementos de esta acción con los IDs de los elementos de la acción Obtener Resultados del Formulario. **Importante**: Si la base_url de la conexión no incluye el directorio del usuario, debe proporcionar el parámetro 'user_dir'. Encuentre esto en las URL de sus formularios de Formsite (por ejemplo, si la URL es https://fs8.formsite.com/user123/forms/abc, user_dir es 'user123') o en Configuración -> Integraciones -> API de Formsite.
Obtener Resultados del Formulario
Esta herramienta recupera resultados de formularios de un formulario específico de FormSite. Utiliza el endpoint GET https://{server}.formsite.com/api/v2/{user_dir}/forms/{form_id}/results para obtener resultados, manejando parámetros requeridos como form_id, user_dir, límite, página y dirección de ordenación. **Importante**: Si la base_url de la conexión no incluye el directorio del usuario, debe proporcionar el parámetro 'user_dir'. Encuentre esto en las URL de sus formularios de Formsite (por ejemplo, si la URL es https://fs8.formsite.com/user123/forms/abc, user_dir es 'user123') o en Configuración -> Integraciones -> API de Formsite.
Listar Todos los Formularios
Recupera una lista de todos los formularios en la cuenta del usuario de Formsite. Esta acción devuelve información detallada sobre cada formulario, incluyendo: - Directorio del formulario (identificador para acceder al formulario a través de la API) - Nombre del formulario (el nombre mostrado del formulario) - Descripción (descripción interna opcional) - Información de publicación (código de inserción y enlace público) - Estado (estado abierto/cerrado) - Estadísticas (tamaño de almacenamiento de archivo y conteo de resultados) El directorio del formulario devuelto por esta acción puede ser utilizado con otras acciones de Formsite, como Obtener Detalles del Formulario, Obtener Elementos del Formulario y Obtener Resultados del Formulario. **Importante**: Si la base_url de la conexión no incluye el directorio del usuario, debe proporcionar el parámetro 'user_dir'. Encuentre esto en las URL de sus formularios de Formsite (por ejemplo, si la URL es https://fs8.formsite.com/user123/forms/abc, user_dir es 'user123') o en Configuración -> Integraciones -> API de Formsite.
```

### Panel — pestana DISPARADORES (literal)

```
Formsite

No conectado

Formsite ayuda a los usuarios a crear formularios y encuestas en línea con herramientas de arrastrar y soltar, captura de datos segura e integraciones para simplificar flujos de trabajo.

Conectar
QUÉ PUEDES HACER (4)
DISPARADORES (EVENTOS) (0)

Sin disparadores disponibles.
```


## Gmail

### Panel — pestana ACCIONES (literal)

```
Gmail

No conectado

Gmail es el servicio de correo electrónico de Google, que cuenta con protección contra spam, funciones de búsqueda e integración fluida con otras aplicaciones de G Suite para la productividad.

Conectar
QUÉ PUEDES HACER (11)
DISPARADORES (EVENTOS) (2)
Enviar Correo Electrónico
AUTOMATIZACIÓN
Envía un correo electrónico a través de la API de Gmail utilizando el nombre para mostrar del perfil de Google del usuario autenticado. Envía inmediatamente y es irreversible — confirma destinatarios, asunto, cuerpo y archivos adjuntos antes de llamar. Al menos uno de los parámetros 'to' (o 'recipient_email'), 'cc' o 'bcc' debe ser proporcionado. Al menos uno de los parámetros de asunto o cuerpo debe ser proporcionado. Requiere `is_html=True` si el cuerpo contiene HTML. Todos los tipos de archivos comunes, incluidos PNG, JPG, PDF, MP4, etc., son compatibles como archivos adjuntos. La API de Gmail limita el tamaño total del mensaje a ~25 MB después de la codificación base64. Para responder en un hilo existente, usa GMAIL_REPLY_TO_THREAD en su lugar. Sin soporte para envío programado; aplica el tiempo externamente.
Crear borrador de correo electrónico
AUTOMATIZACIÓN
Crea un borrador de correo electrónico en Gmail. Aunque todos los campos son opcionales según la API de Gmail, la validación práctica requiere al menos uno de los campos recipient_email, cc o bcc y al menos uno de los campos subject o body. Soporta destinatarios To/Cc/Bcc, asunto, cuerpo en texto plano/HTML (asegúrate de que `is_html=True` para HTML), archivos adjuntos y encadenamiento. Devuelve un draft_id que debe usarse tal cual con GMAIL_SEND_DRAFT — IDs sintéticos o obsoletos fallarán. Al crear una respuesta de borrador para un hilo existente (thread_id proporcionado), deja el asunto vacío para permanecer en el mismo hilo; establecer un asunto creará un NUEVO hilo. HTTP 429 puede ocurrir en secuencias rápidas de creación/envío; aplique retroceso exponencial.
Responder al Hilo de Correo Electrónico
AUTOMATIZACIÓN
Envía una respuesta dentro de un hilo específico de Gmail usando el asunto del hilo original; no proporciones un asunto personalizado, ya que esto iniciará una nueva conversación en lugar de responder en el hilo. Requiere un `thread_id` válido y al menos uno de los parámetros `recipient_email`, `cc` o `bcc`. Soporta archivos adjuntos opcionales.
Buscar correos electrónicos
Busca una lista de mensajes de correo electrónico de una cuenta de Gmail, admitiendo filtrado, paginación y recuperación opcional de contenido completo. Los resultados NO están ordenados por recencia; ordena por internalDate del lado del cliente. El campo messages puede estar ausente o vacío (estado válido sin resultados); siempre verifica nulo antes de acceder a messageId o threadId. Verifica nulo en los campos de asunto y encabezado antes de operaciones de cadena. Para conjuntos de resultados grandes, prefiere ids_only=true o listado solo de metadatos, luego hidrata a través de GMAIL_FETCH_MESSAGE_BY_MESSAGE_ID.
Buscar mensaje por ID de mensaje
Busca un mensaje de correo electrónico específico por su ID, siempre que el `message_id` exista y sea accesible para el `user_id` autenticado. Los mensajes de spam/papelera se excluyen a menos que las llamadas de lista/búsqueda anteriores hayan utilizado `include_spam_trash=true`. Usa `internalDate` (milisegundos desde la época) en lugar del encabezado `Date` para verificaciones de recencia.
Listar Hilos
Recupera una lista de hilos de correo electrónico de una cuenta de Gmail, identificados por `user_id` (dirección de correo electrónico o 'me'), soportando filtrado y paginación. El spam y la papelera están excluidos por defecto a menos que se dirijan explícitamente a través de `label:spam` o `label:trash` en la consulta.
Modificar etiquetas de correo electrónico
AUTOMATIZACIÓN
Agrega y/o elimina etiquetas de Gmail especificadas para un mensaje; asegúrate de que `message_id` y todos los `label_ids` sean válidos (usa 'listLabels' para IDs de etiquetas personalizadas).
Crear etiqueta
AUTOMATIZACIÓN
Crea una nueva etiqueta con un nombre único en la cuenta de Gmail del usuario especificado. Devuelve un labelId (por ejemplo, 'Label_123') necesario para herramientas posteriores como GMAIL_ADD_LABEL_TO_EMAIL, GMAIL_BATCH_MODIFY_MESSAGES y GMAIL_MODIFY_THREAD_LABELS — esas herramientas no aceptan nombres de visualización.
Obtener archivo adjunto de Gmail
Recupera un archivo adjunto específico por ID de un mensaje en la bandeja de entrada de Gmail de un usuario, requiriendo IDs de mensaje y archivo adjunto válidos. Devuelve el archivo descargado con su tipo MIME y nombre de archivo. Los archivos adjuntos que superan ~25 MB pueden exponerse como enlaces de Google Drive — usa GOOGLEDRIVE_DOWNLOAD_FILE cuando un file_id de Drive esté presente.
Obtener contactos
AUTOMATIZACIÓN
Busca contactos (conexiones) para la cuenta de Google autenticada, permitiendo la selección de campos de datos específicos y paginación. Solo cubre contactos guardados y 'Otros Contactos'; remitentes solo con encabezado de correo electrónico están fuera del alcance. Los registros de contactos pueden tener datos escasos; maneja campos faltantes de manera adecuada. La API de Personas comparte una cuota de QPS por usuario; HTTP 429 requiere retroceso exponencial (1s, 2s, 4s).
Eliminar mensaje
Elimina permanentemente un mensaje de correo electrónico específico por su ID de un buzón de Gmail; para `user_id`, usa 'me' para el usuario autenticado o una dirección de correo electrónico a la que el usuario autenticado haya delegado acceso.
```

### Panel — pestana DISPARADORES (literal)

```
Gmail

No conectado

Gmail es el servicio de correo electrónico de Google, que cuenta con protección contra spam, funciones de búsqueda e integración fluida con otras aplicaciones de G Suite para la productividad.

Conectar
QUÉ PUEDES HACER (11)
DISPARADORES (EVENTOS) (2)
Correo Electrónico Enviado
Se activa cuando un mensaje de Gmail es enviado por el usuario autenticado. Consulta la etiqueta 'ENVIADOS' y emite metadatos que incluyen el remitente, los destinatarios, el asunto, la marca de tiempo y el ID del hilo.
Nuevo Correo Electrónico Recibido
Se activa cuando se recibe un nuevo mensaje en Gmail.
```


## Googleforms

### Panel — pestana ACCIONES (literal)

```
Googleforms

No conectado

Google Forms es un software de administración de encuestas que permite a los usuarios crear y compartir formularios y encuestas en línea.

Conectar
QUÉ PUEDES HACER (9)
DISPARADORES (EVENTOS) (0)
Crear un Google Form
Crea un nuevo Google Form con el título especificado. Esta acción inicializa un formulario vacío que puede ser posteriormente completado con elementos (preguntas, secciones, imágenes, videos) utilizando el endpoint batchUpdate. Cuando se crea un formulario, se le asigna un formId único que es necesario para todas las operaciones posteriores en ese formulario. A partir del 30 de junio de 2026, los formularios creados a través de la API tendrán como estado predeterminado no publicado, dando a los creadores control sobre el acceso de los encuestados antes de hacer el formulario disponible públicamente. Usa esta acción cuando necesites crear un nuevo formulario para recopilar información, encuestas, cuestionarios o comentarios. Después de la creación, usa la acción batchUpdate para agregar preguntas y otros elementos al formulario.
Crear Monitoreo de Formulario
Crea un monitoreo en un Google Form para recibir notificaciones push a través de Cloud Pub/Sub cuando ocurren eventos específicos. Los monitoreos notifican a través de Cloud Pub/Sub cuando el formulario o sus respuestas son cambiados. Cada monitoreo tiene una duración de una semana, después de la cual expira automáticamente y debe ser renovado. El proyecto que realiza la llamada puede tener un máximo de 2 monitoreos por formulario (uno para SCHEMA y uno para RESPONSES). Usa esta acción cuando necesites configurar notificaciones en tiempo real para cambios en el formulario o nuevas presentaciones. El tema de Pub/Sub debe estar en el mismo proyecto donde se encuentra el formulario, y el tema debe tener permisos configurados para permitir que la API de Formularios publique mensajes.
Eliminar Monitoreo de Formulario
Elimina un monitoreo de un Google Form, deteniendo las notificaciones push para ese monitoreo. Úsalo cuando ya no desees recibir notificaciones para un monitoreo específico en un formulario. Esta acción es irreversible: una vez eliminado, el monitoreo no puede ser recuperado y las notificaciones se detendrán inmediatamente. Si necesitas reanudar las notificaciones, debes crear uno nuevo usando la acción CreateWatch.
Obtener Google Form
Recupera la estructura completa y los metadatos de un Google Form. Devuelve la definición completa del formulario, incluyendo su título, descripción, todos los elementos (preguntas, secciones, saltos de página, imágenes, videos y texto de visualización), configuraciones del formulario (modo de cuestionario, recopilación de correos electrónicos), estado de publicación y campos solo de salida, como la URL de envío del encuestado y el ID de revisión. Esta acción es de solo lectura y no modifica el formulario. Usa esta acción cuando necesites leer la configuración actual de un formulario, mostrar su estructura a los usuarios, inspeccionar sus configuraciones o verificar su estado de publicación antes de realizar actualizaciones.
Obtener Respuesta del Formulario
Recupera una única respuesta del formulario por su ID de respuesta único. Devuelve los datos completos de la respuesta, incluyendo todas las respuestas proporcionadas por el encuestado, su correo electrónico (si se recopiló), marcas de tiempo y puntajes de cuestionario (si corresponde). Usa esta acción cuando necesites obtener información detallada sobre una presentación específica, como ver presentaciones individuales, verificar datos de respuesta o construir vistas de detalles de respuesta.
Listar Respuestas del Google Form
Lista todas las respuestas enviadas a un Google Form con filtrado y paginación opcionales. Usa esta acción para recuperar múltiples presentaciones de formularios a la vez, exportar datos de respuestas o monitorear nuevas presentaciones. Soporta filtrado por marca de tiempo para obtener solo respuestas enviadas después de un tiempo específico, lo que es útil para la sincronización incremental de datos.
Listar Monitoreos de Formulario
Lista todos los monitoreos pertenecientes al proyecto que realiza la llamada para un Google Form específico. Usa esta acción para descubrir monitoreos existentes, verificar su estado y tiempos de expiración, o auditar qué notificaciones están configuradas para un formulario. Cada proyecto puede tener un máximo de 2 monitoreos por formulario (uno para cada tipo de evento: SCHEMA y RESPONSES). El tipo de evento SCHEMA monitorea cambios en el contenido o configuraciones del formulario, mientras que RESPONSES monitorea nuevas presentaciones de formularios.
Renovar Monitoreo de Formulario
Renueva un monitoreo en un Google Form, extendiendo su expiración por una semana a partir del momento de la renovación. Los monitoreos de Google Forms expiran automáticamente después de una semana. Usa esta acción para extender un monitoreo antes de que expire, manteniendo notificaciones push continuas. Si un monitoreo ya ha expirado, debes crear uno nuevo en su lugar. El monitoreo renovado mantiene el mismo ID, tipo de evento y configuración de tema Pub/Sub. Solo se actualiza el tiempo de expiración.
Establecer Configuraciones de Publicación del Formulario
Actualiza las configuraciones de publicación de un Google Form, controlando si el formulario está publicado (visible para otros) y si acepta respuestas. Usa esta acción para publicar un formulario en borrador, despublicar un formulario para evitar el acceso o alternar la recopilación de respuestas sin cambiar la visibilidad del formulario. Ten en cuenta que los formularios heredados creados antes de la introducción de la función de configuraciones de publicación no pueden usar este endpoint y devolverán un error.
```

### Panel — pestana DISPARADORES (literal)

```
Googleforms

No conectado

Google Forms es un software de administración de encuestas que permite a los usuarios crear y compartir formularios y encuestas en línea.

Conectar
QUÉ PUEDES HACER (9)
DISPARADORES (EVENTOS) (0)

Sin disparadores disponibles.
```


## Highlevel

### Panel — pestana ACCIONES (literal)

```
Highlevel

No conectado

HighLevel proporciona una plataforma de automatización de marketing y CRM para agencias, con embudos, programación de citas, mensajes de texto bidireccionales y otras herramientas para impulsar el éxito del cliente.

Conectar
QUÉ PUEDES HACER (12)
DISPARADORES (EVENTOS) (0)
Crear Contacto
Crea un nuevo contacto en una subcuenta de GoHighLevel. Usa esta acción para agregar a una persona (lead o cliente) con su nombre, detalles de contacto, etiquetas y campos personalizados. El locationId es obligatorio e identifica la subcuenta a la que pertenece el contacto. Encabezados requeridos (manejados automáticamente): Version: 2021-07-28.
Actualizar Contacto
Actualiza un contacto existente en una subcuenta de GoHighLevel. Utiliza esta acción para modificar el nombre, detalles de contacto, etiquetas y campos personalizados de un contacto. El contactId identifica el contacto a actualizar; solo se cambiarán los campos que proporciones. Encabezados requeridos (manejados automáticamente): Versión: 2021-07-28
Obtener Contacto
Recupera un único contacto de una subcuenta de GoHighLevel por su identificador único. Utiliza esta acción para obtener los detalles completos de un contacto, incluyendo su nombre, información de contacto, etiquetas y campos personalizados. Encabezados requeridos (manejados automáticamente): Versión: 2021-07-28
Buscar Contactos
Busca contactos en una subcuenta de GoHighLevel utilizando filtros avanzados, ordenación y paginación. Utiliza esta acción para encontrar contactos que coincidan con criterios específicos dentro de una ubicación. El locationId es necesario e identifica la subcuenta a buscar. Encabezados requeridos (manejados automáticamente): Versión: 2021-07-28
Agregar Etiquetas de Contacto
Agrega una o más etiquetas a un contacto existente en una subcuenta de GoHighLevel. Usa esta acción para etiquetar o segmentar un contacto adjuntando etiquetas a él. El contactId identifica el contacto, y tags es la lista de etiquetas a agregar. Encabezados requeridos (manejados automáticamente): Version: 2021-07-28.
Eliminar Etiquetas de Contacto
Elimina una o más etiquetas de un contacto en una subcuenta de GoHighLevel. Utiliza esta acción para desanexar etiquetas existentes de un contacto identificado por su contactId. Las etiquetas a eliminar se proporcionan en el cuerpo de la solicitud. Encabezados requeridos (manejados automáticamente): Versión: 2021-07-28
Crear Nota de Contacto
Crea una nueva nota para un contacto específico en GoHighLevel. Usa esta acción para adjuntar una nota de texto a un contacto, atribuyéndola opcionalmente a un usuario y estableciendo un título, color o estado fijado. El contactId identifica el contacto al que pertenece la nota. Encabezados requeridos (manejados automáticamente): Version: 2021-07-28.
Crear Tarea de Contacto
Crea una nueva tarea para un contacto específico en GoHighLevel. Usa esta acción para agregar una tarea (como un seguimiento o recordatorio) vinculada a un contacto, con un título, fecha de vencimiento, estado de finalización, texto opcional y un responsable opcional. Encabezados requeridos (manejados automáticamente): Version: 2021-07-28.
Crear Oportunidad
Crea una nueva oportunidad en una subcuenta de GoHighLevel. Usa esta acción para agregar una oportunidad a un pipeline, asociándola con un contacto y una etapa del pipeline, y opcionalmente estableciendo su valor monetario, asignado y campos personalizados. Encabezados requeridos (manejados automáticamente): Versión: 2021-07-28
Actualizar Oportunidad
Actualiza una oportunidad existente en una subcuenta de GoHighLevel. Utiliza esta acción para modificar el nombre, pipeline, etapa, estado, valor monetario, asignado y campos personalizados de una oportunidad. El opportunityId identifica la oportunidad a actualizar; solo se cambiarán los campos que proporciones. Encabezados requeridos (manejados automáticamente): Versión: 2021-07-28
Enviar Mensaje
Envía un mensaje a un contacto en una subcuenta de GoHighLevel a través de un canal (SMS, RCS, Email, WhatsApp, Instagram o Facebook). Utiliza esta acción para enviar mensajes salientes, programarlos o responder dentro de un hilo de conversación existente. El tipo de mensaje y contactId son obligatorios. Encabezados requeridos (manejados automáticamente): Versión: 2021-04-15
Crear Cita
Crea una nueva cita (evento de calendario) en una subcuenta de GoHighLevel. Usa esta acción para reservar un contacto en un calendario con una hora de inicio, hora de finalización opcional, ubicación de la reunión y estado. Se requieren calendarId, locationId, contactId y startTime. Encabezados requeridos (manejados automáticamente): Version: 2021-04-15.
```

### Panel — pestana DISPARADORES (literal)

```
Highlevel

No conectado

HighLevel proporciona una plataforma de automatización de marketing y CRM para agencias, con embudos, programación de citas, mensajes de texto bidireccionales y otras herramientas para impulsar el éxito del cliente.

Conectar
QUÉ PUEDES HACER (12)
DISPARADORES (EVENTOS) (0)

Sin disparadores disponibles.
```


## HubSpot

### Panel — pestana ACCIONES (literal)

```
HubSpot

No conectado

HubSpot es una plataforma de marketing, ventas y servicio al cliente que integra CRM, automatización de correos electrónicos y análisis para facilitar el cultivo de leads y experiencias de clientes sin interrupciones.

Conectar
QUÉ PUEDES HACER (9)
DISPARADORES (EVENTOS) (2)
Crear contacto
Crea un nuevo contacto en HubSpot.
Listar contactos
Recupera una lista paginada de contactos de HubSpot.
Buscar contactos por criterios
Busca contactos de HubSpot utilizando una consulta de texto, criterios de filtro específicos (los filtros en un grupo se combinan con AND, los grupos se combinan con OR), ordenación y paginación para recuperar propiedades seleccionadas.
Crear negocio
Crea un nuevo negocio en HubSpot.
Buscar negocios
Busca negocios de HubSpot utilizando criterios y filtros flexibles.
Crear empresa
Crea una nueva empresa en HubSpot.
Buscar empresas
Busca empresas de HubSpot utilizando criterios y filtros flexibles.
Crear un nuevo correo electrónico de marketing
Crea un nuevo correo electrónico de marketing en HubSpot, permitiendo una configuración completa de contenido, destinatarios, detalles del remitente, pruebas A/B, programación, versión web y otras configuraciones; el `name` interno para el correo electrónico es obligatorio.
Listar tareas de contacto
Lista todas las tareas asociadas a un contacto específico. Devuelve los IDs de las tareas y los metadatos de asociación para tareas vinculadas al contacto dado. Usa esta acción cuando necesites recuperar todas las tareas relacionadas con un contacto, como ver elementos de acción pendientes o hacer seguimiento de tareas relacionadas con el contacto.
```

### Panel — pestana DISPARADORES (literal)

```
HubSpot

No conectado

HubSpot es una plataforma de marketing, ventas y servicio al cliente que integra CRM, automatización de correos electrónicos y análisis para facilitar el cultivo de leads y experiencias de clientes sin interrupciones.

Conectar
QUÉ PUEDES HACER (9)
DISPARADORES (EVENTOS) (2)
Gatillo de Contacto Creado
Gatillo de Contacto Creado
Gatillo de Etapa de Negocio Actualizada
Gatillo de Etapa de Negocio Actualizada
```


## Kommo

### Panel — pestana ACCIONES (literal)

```
Kommo

No conectado

Kommo CRM es una plataforma para gestionar relaciones con clientes, embudos de ventas y procesos comerciales.

Conectar
QUÉ PUEDES HACER (13)
DISPARADORES (EVENTOS) (0)
Crear Lead en Kommo
Acción para crear un lead en Kommo CRM.
Actualizar Lead Kommo
Acción para actualizar un lead existente en Kommo CRM. Permite modificar propiedades del lead, incluyendo nombre, precio, etapa del pipeline, usuario responsable, etiquetas y campos personalizados. Se requiere especificar el ID del lead.
Obtener Lead de Kommo
Herramienta para obtener un lead por su ID de Kommo CRM. Úselo cuando necesite recuperar información detallada sobre un lead específico, incluidos su estado, precio, usuario responsable y, opcionalmente, datos incrustados como contactos, elementos de catálogo o razones de pérdida.
Listar Leads de Kommo
Acción para listar leads en Kommo CRM.
Crear Contacto en Kommo
Acción para crear uno o más contactos en Kommo CRM.
Actualizar Contacto Kommo
Acción para actualizar la información de contacto en Kommo CRM por ID de contacto.
Obtener Contacto de Kommo
Herramienta para obtener un contacto específico por su ID de Kommo CRM. Úselo cuando necesite recuperar información detallada sobre un contacto en particular.
Listar Contactos de Kommo
Acción para listar contactos en Kommo CRM.
Crear Tarea en Kommo
Acción para crear una tarea en Kommo CRM.
Listar Tareas de Kommo
Acción para listar tareas en Kommo CRM.
Listar Pipelines de Leads de Kommo
Acción para listar pipelines de leads en Kommo CRM.
Listar Eventos de Kommo
Herramienta para obtener una lista de eventos de Kommo CRM con opciones de filtrado. Úselo cuando necesite recuperar el historial de eventos, rastrear cambios en entidades (leads, contactos, empresas) o monitorear tipos de eventos específicos, como cambios de estado, actualizaciones de campos o cambios de asignación.
Obtener Resumen de Leads Entrantes
Herramienta para recuperar estadísticas resumidas de leads entrantes (no clasificados) en Kommo CRM. Úselo cuando necesite métricas agregadas como el conteo total, tasas de aceptación/rechazo, tiempo promedio de procesamiento y desglose por categoría de origen de lead.
```

### Panel — pestana DISPARADORES (literal)

```
Kommo

No conectado

Kommo CRM es una plataforma para gestionar relaciones con clientes, embudos de ventas y procesos comerciales.

Conectar
QUÉ PUEDES HACER (13)
DISPARADORES (EVENTOS) (0)

Sin disparadores disponibles.
```


## Outlook

### Panel — pestana ACCIONES (literal)

```
Outlook

No conectado

Outlook es la plataforma de correo electrónico y calendario de Microsoft que integra contactos y programación, permitiendo a los usuarios gestionar comunicaciones y eventos en un espacio de trabajo unificado.

Conectar
QUÉ PUEDES HACER (16)
DISPARADORES (EVENTOS) (5)
Enviar correo electrónico
Envía un correo electrónico con asunto, cuerpo, destinatarios y archivos adjuntos opcionales a través de la API de Microsoft Graph. Soporta direcciones de correo electrónico separadas por comas en el campo to_email para múltiples destinatarios. Acepta un solo archivo o una lista de archivos como adjuntos. Los adjuntos requieren un archivo no vacío con un nombre y tipo MIME válidos.
Responder al correo electrónico
Envía una respuesta a un mensaje de correo electrónico de Outlook con formato HTML opcional, adjuntos, y destinatarios en CC y BCC.
Enviar borrador
Herramienta para enviar un mensaje de borrador existente. Úselo después de crear un borrador cuando desee entregarlo a los destinatarios de inmediato. Ejemplo: Enviar un mensaje de borrador con ID 'AAMkAG…'.
Crear borrador de correo electrónico
Crea un nuevo borrador de correo electrónico de Outlook con asunto, cuerpo, destinatarios y un archivo adjunto opcional. Esta acción crea un borrador independiente para nuevas conversaciones. Para crear una respuesta en borrador a una conversación/mensaje existente, use la acción OUTLOOK_CREATE_DRAFT_REPLY.
Listar Mensajes
Recupera una lista de mensajes de correo electrónico de una carpeta de correo especificada en un buzón de Outlook, con opciones para filtrar (incluyendo por conversationId para obtener todos los mensajes en un hilo), paginación y ordenación; asegúrese de que 'user_id' y 'folder' sean válidos, y que todas las cadenas de fecha/hora estén en formato ISO 8601.
Buscar mensajes de Outlook
Busque mensajes de Outlook utilizando una poderosa sintaxis KQL. Soporta remitente (from:), destinatario (to:, cc:), asunto, filtros de fecha (received:, sent:), adjuntos y lógica booleana. Solo funciona con cuentas de Microsoft 365/Enterprise (sin @hotmail.com/@outlook.com). Ejemplos: 'from:user@example.com AND received>=2025-10-01', 'to:info@jcdn.nl AND subject:invoice', 'received>today-30 AND hasattachment:yes'.
Obtener mensaje de correo electrónico
Recupera un mensaje de correo electrónico específico por su ID de la bandeja de entrada de Outlook del usuario especificado. Use el parámetro 'select' para incluir campos específicos como 'internetMessageHeaders' para filtrar correos electrónicos automatizados. Reintenta respuestas 404 transitorias de Microsoft Graph con retroceso exponencial durante hasta 7.5 segundos, ya que los mensajes recién surgidos pueden ser eventualmente consistentes.
Mover mensaje a carpeta
Mueve un mensaje a otra carpeta dentro del buzón del usuario especificado. Crea una nueva copia en la carpeta de destino y elimina la original. El message_id cambia después de un movimiento exitoso; use el ID devuelto en la respuesta para cualquier operación posterior en el mensaje movido. Reintenta respuestas 404 transitorias de Microsoft Graph con retroceso exponencial durante hasta 7.5 segundos, ya que los mensajes recién surgidos pueden ser eventualmente consistentes. Los movimientos paralelos de alto volumen pueden activar la limitación HTTP 429 (MailboxConcurrency); respete el encabezado Retry-After.
Listar carpetas de correo
Herramienta para listar las carpetas de correo de nivel superior de un usuario. Úselo cuando necesite carpetas como Bandeja de entrada, Borradores, Elementos enviados; establezca include_hidden_folders=True para incluir carpetas ocultas.
Listar eventos
Recupera eventos del calendario de Outlook de un usuario a través de la API de Microsoft Graph. Soporta calendarios primarios/secundarios/compartidos, paginación, filtrado, selección de propiedades, ordenación y especificación de zona horaria. Utilice calendar_id para acceder a calendarios no primarios.
Buscar eventos de calendario
Busca eventos de calendario en el calendario principal del usuario autenticado utilizando la API de Búsqueda de Microsoft Graph. Esta acción realiza una búsqueda de texto completo en el asunto del evento, cuerpo, ubicación e información de los asistentes. Utilice esta acción cuando necesite encontrar eventos por palabra clave o frase en lugar de filtrar por campos específicos. Para filtrar por rango de fechas o propiedades específicas, utilice la acción de listar eventos en su lugar.
Crear Evento en el Calendario
Crea un nuevo evento de calendario de Outlook, asegurando que `start_datetime` sea cronológicamente anterior a `end_datetime`.
Cancelar evento de calendario del usuario
Herramienta para cancelar un evento de calendario para un usuario especificado y enviar notificaciones de cancelación a todos los asistentes. Utiliza cuando necesites cancelar una reunión o evento en nombre de un usuario específico.
Obtener agenda
Recupera información de agenda libre/ocupada para direcciones de correo electrónico especificadas dentro de una ventana de tiempo definida. Solo lectura; no reserva tiempo ni previene conflictos: verifique la disponibilidad antes de crear eventos.
Listar contactos del usuario
Herramienta para recuperar contactos de la bandeja de entrada de un usuario específico. Úselo cuando necesite listar o navegar por los contactos de un usuario determinado.
Crear contacto
Crea un nuevo contacto en la carpeta de contactos de un usuario de Microsoft Outlook.
```

### Panel — pestana DISPARADORES (literal)

```
Outlook

No conectado

Outlook es la plataforma de correo electrónico y calendario de Microsoft que integra contactos y programación, permitiendo a los usuarios gestionar comunicaciones y eventos en un espacio de trabajo unificado.

Conectar
QUÉ PUEDES HACER (16)
DISPARADORES (EVENTOS) (5)
Nuevo Contacto Agregado
Activado cuando se agrega un nuevo contacto en los contactos de Outlook.
Cambios en Evento de Calendario
Activado cuando ocurre un nuevo evento de calendario (creado, actualizado o eliminado) en el calendario de Outlook.
Nuevo Evento de Calendario
Activado cuando se crea un nuevo evento de calendario en el calendario de Outlook.
Nuevo Mensaje de Outlook
Activado cuando se recibe un nuevo mensaje en la bandeja de entrada de Outlook.
Nuevo Mensaje Enviado
Activado cuando se envía un nuevo mensaje desde la bandeja de entrada de Outlook.
```


## Pipedrive

### Panel — pestana ACCIONES (literal)

```
Pipedrive

No conectado

Pipedrive es una herramienta de gestión de ventas construida en torno a la visualización de pipeline, seguimiento de leads, recordatorios de actividades y automatización para mantener los acuerdos en progreso.

Conectar
QUÉ PUEDES HACER (17)
DISPARADORES (EVENTOS) (3)
Agregar un trato
Agrega un nuevo trato a Pipedrive con cualquier campo personalizado, que varía según la cuenta y se identifica mediante long hash keys. Consulta dealFields para los campos personalizados existentes. Para más detalles, visita el tutorial sobre cómo agregar un trato.
Actualizar un negocio
Actualiza las propiedades de un negocio. Para más información, consulte el tutorial sobre <a href="https://pipedrive.readme.io/docs/updating-a-deal" target="_blank" rel="noopener noreferrer">actualización de un negocio</a>.
Obtener todos los negocios
Devuelve todos los negocios. Para más información, consulte el tutorial sobre <a href="https://pipedrive.readme.io/docs/getting-all-deals" target="_blank" rel="noopener noreferrer">cómo obtener todos los negocios</a>.
Buscar negocios
Este endpoint de la API busca negocios por título, notas y campos personalizados, filtra resultados por ID de persona u organización, y es un caso de uso específico de /v1/itemSearch con un alcance OAuth limitado.
Agregar una persona
Agrega un nuevo contacto en Pipedrive con campos personalizados opcionales únicos para cada cuenta que se encuentran utilizando el endpoint `personFields`. El endpoint también maneja `data.marketing_status` para usuarios del producto Campaigns.
Buscar personas
Este endpoint busca individuos por varios identificadores y es un caso de uso específico de /v1/itemSearch con un alcance OAuth limitado, permitiendo filtrar resultados por ID de organización.
Obtener todas las personas
Devuelve todas las personas.
Agregar un lead
La API de Pipedrive te permite agregar leads vinculados a personas u organizaciones y etiquetarlos con la fuente 'API'. Los campos personalizados de tratos se aplican a los leads y aparecen en las respuestas si están configurados. Los detalles están en los tutoriales para agregar y actualizar leads.
Obtener todos los leads
La API devuelve leads ordenados por tiempo de creación, admitiendo paginación a través de `limit` y `start`. Los valores de campos personalizados se incluyen si están establecidos, imitando la estructura del endpoint `Deals`; los campos no establecidos se omiten. Los leads comparten campos personalizados con los negocios.
Convertir Lead en Trato
Herramienta para convertir un lead de Pipedrive en un trato de forma asíncrona. Úselo cuando necesite convertir un lead existente en un trato. La conversión transfiere todas las entidades relacionadas (notas, archivos, correos electrónicos, actividades) al nuevo trato. Tras una conversión exitosa, el lead se marca como eliminado. Use el `conversion_id` devuelto para verificar el estado de la conversión.
Agregar una actividad
Nueva actividad agregada. La respuesta incluye `more_activities_scheduled_in_context` para mostrar si hay más planeadas con la misma entidad. Consulta el tutorial sobre cómo agregar actividades [aquí](https://pipedrive.readme.io/docs/adding-an-activity).
Obtener detalles de una actividad
Devuelve los detalles de una actividad específica.
Agregar Nota
Herramienta para agregar una nota a un trato, persona, organización, lead o proyecto en Pipedrive. Úsalo cuando necesites crear una nota adjunta a una entidad. Debe proporcionarse al menos un ID de entidad (lead_id, deal_id, person_id, org_id o project_id).
Obtener todos los pipelines
Devuelve datos sobre todos los pipelines. Esta acción recupera todos los pipelines de la instancia de Pipedrive del usuario utilizando su URL específica de la instancia (por ejemplo, https://empresa.pipedrive.com/api/v2/pipelines).
Obtener todas las etapas
Devuelve datos sobre todas las etapas.
Agregar una organización
Crea una nueva organización en Pipedrive. El parámetro 'name' es obligatorio y representa el nombre de la organización (por ejemplo, 'Acme Corp'). Opcionalmente, especifique 'owner_id' para asignar un propietario y 'visible_to' para configuraciones de visibilidad. También se pueden agregar campos personalizados utilizando claves de campo de organizationFields.
Buscar organizaciones
Busca todas las organizaciones por nombre, dirección, notas y/o campos personalizados. Este endpoint es un wrapper de <a href="https://developers.pipedrive.com/docs/api/v1/ItemSearch#searchItem">/v1/itemSearch</a> con un alcance OAuth más restringido.
```

### Panel — pestana DISPARADORES (literal)

```
Pipedrive

No conectado

Pipedrive es una herramienta de gestión de ventas construida en torno a la visualización de pipeline, seguimiento de leads, recordatorios de actividades y automatización para mantener los acuerdos en progreso.

Conectar
QUÉ PUEDES HACER (17)
DISPARADORES (EVENTOS) (3)
Nuevo Negocio Recibido
Activado cuando se crea un nuevo negocio en Pipedrive
Nueva Nota Recibida
Activado cuando se crea una nueva nota en Pipedrive
Nueva Organización Recibida
Activado cuando se crea una nueva organización en Pipedrive
```


## Salesforce

### Panel — pestana ACCIONES (literal)

```
Salesforce

No conectado

Salesforce es una plataforma de CRM líder que integra ventas, servicio, marketing y análisis para construir relaciones con los clientes y impulsar el crecimiento empresarial.

Conectar
QUÉ PUEDES HACER (17)
DISPARADORES (EVENTOS) (7)
Crear lead
Crea un nuevo lead en Salesforce. `LastName` y `Company` son obligatorios. Las reglas de validación a nivel de organización (por ejemplo, formato de correo electrónico, campos obligatorios personalizados) pueden rechazar solicitudes más allá de estos; inspecciona el cuerpo de la respuesta de error para el campo que falló. El `id` del lead creado se devuelve en un envoltorio de respuesta, no en el nivel superior.
Crear contacto
Crea un nuevo contacto en Salesforce con la información especificada. Escribe en datos de CRM en vivo; obtén confirmación explícita del usuario antes de ejecutar. Los fallos pueden reflejar reglas de validación específicas de la organización, restricciones de permisos o reglas de duplicación en lugar de entradas inválidas.
Crear registro de oportunidad
Crea un nuevo registro de Oportunidad en Salesforce; `Name`, `StageName` y `CloseDate` son obligatorios, y asegúrate de que cualquier ID referenciado (por ejemplo, `AccountId`, `CampaignId`) sea válido y que las características correspondientes de Salesforce estén habilitadas si se utilizan.
Crear tarea
Crea una nueva tarea en Salesforce para rastrear actividades, tareas pendientes y seguimientos relacionados con contactos, leads u otros registros. Asegúrate de que who_id, what_id y owner_id hagan referencia a registros existentes antes de llamar; IDs inválidos causan fallos silenciosos de vinculación o errores de validación.
Obtener contacto
Recupera un contacto específico por ID de Salesforce, devolviendo todos los campos disponibles.
Ejecutar consulta SOQL
Ejecuta una consulta SOQL contra los datos de Salesforce. Devuelve registros que coinciden con la consulta con soporte de paginación.
Ejecutar búsqueda SOSL
Ejecuta una búsqueda SOSL para buscar en múltiples objetos de Salesforce. Úsalo cuando necesites buscar texto en múltiples tipos de objetos simultáneamente.
Buscar contactos
Busca registros de Contacto de Salesforce (no Leads — utiliza SALESFORCE_SEARCH_LEADS para esos) usando nombre, correo electrónico, teléfono, cuenta o título. Todos los parámetros admiten coincidencias parciales/fuzzy, por lo que los resultados pueden incluir registros no relacionados; filtra del lado del cliente para coincidencias exactas. Las coincidencias parciales y los nombres comunes pueden devolver múltiples contactos; siempre confirma el contacto correcto por su Id de 18 caracteres antes de pasarlo a operaciones de escritura como SALESFORCE_LOG_CALL o SALESFORCE_CREATE_TASK. Una respuesta con totalSize=0 es un resultado válido de 'no encontrado'. Proporciona al menos un criterio de búsqueda; omitir todos devuelve un conjunto de resultados amplio y lento. Los Ids devueltos son cadenas de 18 caracteres y deben usarse tal cual en herramientas posteriores.
Buscar cuentas
Busca cuentas de Salesforce utilizando criterios como nombre, industria, tipo, ubicación o información de contacto. Siempre proporciona al menos un parámetro de filtro; omitir todos los filtros devuelve una lista amplia y lenta. La filtración por propietario/territorio no es compatible; utiliza SALESFORCE_RUN_SOQL_QUERY para filtros basados en propiedad. Usa SALESFORCE_GET_ACCOUNT para obtener datos completos de campo para un registro específico. Los campos de filtro no compatibles pueden ser ignorados silenciosamente; verifica que los resultados reflejen los criterios deseados.
Consultar contactos por nombre
Encuentra registros de Contacto de Salesforce por nombre utilizando una búsqueda sin distinción de mayúsculas y minúsculas.
Actualizar un registro
Herramienta para actualizar los datos de un registro en Salesforce a través de la API UI. Úselo cuando necesite modificar los valores de campo en un registro existente. Se aplican las reglas de validación de Salesforce. Pase el encabezado If-Unmodified-Since para evitar conflictos.
Actualizar lead
Actualiza un lead existente en Salesforce con los cambios especificados. Solo se actualizarán los campos proporcionados.
Actualizar contacto
Actualiza un contacto existente en Salesforce con los cambios especificados. Solo se actualizarán los campos proporcionados. Devuelve HTTP 204 sin cuerpo en caso de éxito; use SALESFORCE_GET_CONTACT para verificar los cambios aplicados. Las reglas de validación a nivel de organización, las reglas de duplicación o los permisos a nivel de campo pueden rechazar solicitudes correctamente formateadas con HTTP 400; inspeccione la respuesta de error para identificar la restricción.
Obtener Oportunidad
Recupera una oportunidad específica por ID de Salesforce, devolviendo todos los campos disponibles.
Crear un registro
Herramienta para crear un registro de Salesforce utilizando la API de UI. Úsalo cuando necesites crear cualquier tipo de registro de Salesforce con metadatos de diseño y valores de campo formateados.
Agregar lead a la campaña
Agrega un lead a una campaña creando un registro CampaignMember, lo que te permite rastrear el compromiso de la campaña. Tanto `campaign_id` como `lead_id` deben ser IDs válidos de Salesforce de registros activos y existentes; no se pueden sustituir nombres o correos electrónicos, y los registros eliminados o inactivos harán que la llamada falle. Esta es una escritura persistente de CRM; confirma el lead y la campaña correctos antes de llamar.
Agregar contacto a la campaña
Agrega un contacto a una campaña creando un registro CampaignMember para rastrear el compromiso de la campaña. Falla si el contacto ya es miembro de la campaña; verifique la membresía a través de SOQL antes de llamar.
```

### Panel — pestana DISPARADORES (literal)

```
Salesforce

No conectado

Salesforce es una plataforma de CRM líder que integra ventas, servicio, marketing y análisis para construir relaciones con los clientes y impulsar el crecimiento empresarial.

Conectar
QUÉ PUEDES HACER (17)
DISPARADORES (EVENTOS) (7)
Cuenta Creada o Actualizada
Se activa cuando se crea o actualiza una Cuenta en Salesforce. Utiliza LastModifiedDate como referencia para capturar tanto creaciones como actualizaciones.
Contacto Actualizado
Se activa cuando se modifica un registro de Contacto existente en Salesforce. Emite campos cambiados junto con las marcas de tiempo relevantes.
Registro Actualizado (SObject Genérico)
Se activa cuando cambian los campos monitoreados en cualquier SObject de Salesforce. Especificas el tipo de SObject y qué valores de campo deben ser devueltos en la carga útil. El disparador utiliza SystemModstamp para detectar cambios sin importar qué campo específico cambió.
Disparador de Nuevo Contacto
Se activa cuando se crea un nuevo Contacto en Salesforce.
Disparador de Nuevo Lead
Se activa cuando se crea un nuevo Lead en Salesforce.
Nueva o Actualizada Oportunidad
Se activa cuando se crea o actualiza una Oportunidad en Salesforce.
Tarea Creada o Completada
Se activa cuando se crea una Tarea o cuando su estado cambia a Completada en Salesforce. Soporta filtrado opcional por el estado o asunto de la tarea.
```


## Stripe

### Panel — pestana ACCIONES (literal)

```
Stripe

No conectado

Stripe ofrece infraestructura de pago en línea, prevención de fraudes y APIs que permiten a las empresas aceptar y gestionar pagos a nivel global.

Conectar
QUÉ PUEDES HACER (15)
DISPARADORES (EVENTOS) (7)
Crear Cliente
Crea un nuevo cliente en Stripe, necesario para crear cargos o suscripciones; se recomienda encarecidamente un correo electrónico para las comunicaciones con el cliente.
Listar clientes
Recupera una lista de clientes de Stripe, con opciones para filtrar por correo electrónico, fecha de creación o reloj de prueba, y soporte para paginación.
Buscar clientes de Stripe
Recupera una lista de clientes de Stripe que coinciden con una consulta de búsqueda que se adhiere al Lenguaje de Consulta de Búsqueda de Stripe.
Crear una factura
Crea un nuevo borrador de factura en Stripe para un cliente; utilícelo para revisar una factura existente, cobrar por una suscripción específica (que debe pertenecer al cliente) o aplicar personalizaciones detalladas. Nota: La API de Stripe impone un valor máximo de 99,999,999 (en la unidad monetaria más pequeña) para los campos de monto, incluidos `unit_amount` en los elementos de la factura, `application_fee_amount` y `transfer_data.amount`. Los valores que superen este límite serán rechazados.
Listar Facturas
Recupera una lista de facturas de Stripe, filtrable por varios criterios y paginable utilizando cursores de ID de factura obtenidos de respuestas anteriores.
Enviar factura para pago manual
Herramienta para enviar manualmente una factura finalizada de Stripe al cliente fuera del cronograma de facturación automático. Úselo cuando necesite entregar una factura para pago manual. Nota: En modo de prueba, no se envían correos electrónicos, pero los eventos de webhook (invoice.sent) aún se generan.
Crear Enlace de Pago
Herramienta para crear un Enlace de Pago de Stripe. Úselo cuando necesite generar una URL de página de pago alojada que se pueda compartir con los clientes para recopilar pagos sin construir una infraestructura de pago personalizada. Admite hasta 20 elementos de línea por enlace de pago.
Listar intenciones de pago
Herramienta para listar PaymentIntents de Stripe. Úselo cuando necesite recuperar una lista de intenciones de pago con filtrado opcional por cliente, fecha de creación o parámetros de paginación.
Crear Reembolso
Crea un reembolso total o parcial en Stripe, dirigiéndose a un ID de cargo específico o a un ID de intención de pago.
Listar Cargos
Recupera una lista de cargos de Stripe con filtrado y paginación; use IDs de cursor válidos de respuestas anteriores para la paginación y tenga en cuenta que los cargos se devuelven normalmente en orden cronológico inverso.
Listar Suscripciones
Recupera una lista de suscripciones de Stripe, opcionalmente filtradas por varios criterios como cliente, precio, estado, método de cobro y rangos de fechas, con soporte para paginación.
Cancelar suscripción
Cancela la suscripción activa de un cliente en Stripe al final del período de facturación actual, con opciones para facturar inmediatamente por el uso medido y prorratear cargos por tiempo no utilizado.
Crear producto
Crea un nuevo producto en Stripe, codificando la solicitud como `application/x-www-form-urlencoded` al aplanar estructuras anidadas.
Listar productos
Recupera una lista de productos de Stripe, con filtrado y paginación opcionales; los cursores `starting_after`/`ending_before` deben ser IDs de productos válidos de una respuesta anterior.
Listar Transacciones de Saldo
Lista todas las transacciones de saldo para la cuenta Stripe conectada. Utilice esta acción cuando necesite recuperar el historial de transacciones de fondos que entran o salen del saldo de su cuenta Stripe. Las transacciones de saldo se crean para cada tipo de transacción que entra o sale del saldo de su cuenta Stripe. Soporta filtrado por rango de fechas, moneda, tipo, pago o fuente, así como paginación basada en cursor.
```

### Panel — pestana DISPARADORES (literal)

```
Stripe

No conectado

Stripe ofrece infraestructura de pago en línea, prevención de fraudes y APIs que permiten a las empresas aceptar y gestionar pagos a nivel global.

Conectar
QUÉ PUEDES HACER (15)
DISPARADORES (EVENTOS) (7)
Gatillo de Fallo en la Carga
Activado cuando una carga directa falla en la API de Cargas heredada de Stripe
Gatillo de Sesión de Checkout Completada
Activado cuando una sesión de checkout se completa en Stripe
Gatillo de Pago de Factura Exitoso
Activado cuando un pago de factura es exitoso en Stripe
Gatillo de Fallo en la Intención de Pago
Activado cuando una intención de pago falla en Stripe
Gatillo de Producto Creado
Activado cuando un producto es creado en Stripe
Gatillo de Suscripción Agregada
Activado cuando una suscripción es agregada en Stripe
Gatillo de Suscripción Eliminada
Activado cuando una suscripción es eliminada en Stripe
```


## Telegram

### Panel — pestana ACCIONES (literal)

```
Telegram

No conectado

Telegram es una aplicación de mensajería basada en la nube con un enfoque en la seguridad y la velocidad. Crea bots para enviar mensajes, gestionar chats e interactuar con los usuarios.

Conectar
QUÉ PUEDES HACER (6)
DISPARADORES (EVENTOS) (0)
Enviar Mensaje
Envía un mensaje de texto a un chat de Telegram utilizando la Bot API. Los bots deben ser miembros de grupos/canales de destino con derechos de publicación. Límite de tasa: ~1 msg/segundo por chat, ~30 msg/segundo globalmente; exceder devuelve 429 con segundos retry_after que deben ser respetados.
Enviar Foto
Envía fotos a un chat de Telegram utilizando la Bot API. Telegram comprime y re-encode imágenes; utiliza TELEGRAM_SEND_DOCUMENT para preservar la resolución/formato original. Cada llamada produce una publicación separada; sin soporte para grupos de medios/álbumes. Devuelve HTTP 429 con `retry_after` segundos al enviar demasiado rápido.
Enviar Documento
Envía archivos generales (documentos) a un chat de Telegram utilizando la Bot API. Prefiere sobre TELEGRAM_SEND_PHOTO cuando el formato del archivo original o la resolución de la imagen deben ser preservados. Los envíos rápidos activan el control de inundación (HTTP 429 con `retry_after` segundos); limita a ~1 mensaje/segundo por chat y espera la duración especificada de `retry_after` antes de volver a intentar.
Obtener Información del Chat
Obtén información actualizada sobre el chat (nombre actual del usuario para conversaciones uno a uno, nombre de usuario actual de un usuario, grupo o canal, etc.). El bot debe ser miembro o tener acceso al chat de destino; las llamadas fallan si el bot nunca fue agregado, fue eliminado o está bloqueado.
Obtener Historial del Chat
Obtén mensajes del historial del chat a través del método de polling getUpdates, filtrados por chat_id. Devuelve solo actualizaciones del chat especificado. El bot solo puede recuperar mensajes enviados después de unirse al chat; la falta de mensajes más antiguos es esperada. No requiere un webhook activo: un webhook causa un conflicto HTTP 409; elimínalo antes de usar esta herramienta. Los arreglos de resultados vacíos (ok=true) indican que no hay mensajes accesibles, no un fallo. Las fechas de los mensajes devueltos son timestamps Unix en segundos UTC.
Eliminar Mensaje
Elimina un mensaje, incluidas las mensajes de servicio. Limitaciones: no se pueden eliminar mensajes de más de 48 horas en grupos, mensajes reenviados o contenido en chats protegidos (devuelve 400 'el mensaje no se puede eliminar'). El bot debe tener derechos de eliminación/gestión en el chat de destino; funciona de manera confiable solo en mensajes creados por el bot en grupos. Verifica los permisos a través de TELEGRAM_GET_CHAT o TELEGRAM_GET_CHAT_ADMINISTRATORS antes de llamar. En el control de inundación, Telegram devuelve HTTP 429 con un campo retry_after; respeta ese valor de retroceso.
```

### Panel — pestana DISPARADORES (literal)

```
Telegram

No conectado

Telegram es una aplicación de mensajería basada en la nube con un enfoque en la seguridad y la velocidad. Crea bots para enviar mensajes, gestionar chats e interactuar con los usuarios.

Conectar
QUÉ PUEDES HACER (6)
DISPARADORES (EVENTOS) (0)

Sin disparadores disponibles.
```


## Zendesk

### Panel — pestana ACCIONES (literal)

```
Zendesk

No conectado

Zendesk proporciona software de soporte al cliente con funciones de ticketing, chat en vivo y base de conocimientos, lo que permite operaciones de helpdesk eficientes y compromiso del cliente.

Conectar
QUÉ PUEDES HACER (13)
DISPARADORES (EVENTOS) (2)
Crear Ticket de Zendesk
Cree un ticket en Zendesk con soporte completo para todos los campos de ticket. Devuelve `ticket_id` y `ticket_url`; use ZENDESK_GET_ZENDESK_TICKET_BY_ID para el objeto completo del ticket.
Actualizar Ticket de Zendesk
Herramienta para actualizar un ticket en Zendesk. Utilice cuando necesite modificar campos de ticket como estado, prioridad o asunto después de confirmar el ID del ticket.
Eliminar Ticket de Zendesk
Elimina permanentemente un ticket en Zendesk, incluyendo todo su historial de conversaciones. Esta acción es irreversible: siempre confirma el ticket_id correcto antes de ejecutar.
Obtener Ticket de Zendesk
Obtener detalles del ticket de Zendesk. Devuelve el registro completo del ticket (estado, requester_id, assignee_id, organization_id, etiquetas, campos personalizados, created_at/updated_at, etc.) junto con sus comentarios. La respuesta envuelve todos los datos bajo una clave de nivel superior `data`; acceda a `data['comments']` para comentarios y `data['comments'][i]['attachments']` para archivos adjuntos (archivos adjuntos no disponibles desde los puntos finales de lista). Cada comentario tiene campos `html_body` y `body` en texto plano; elija adecuadamente. Campos como `subject`, `organization_id`, `author_id` y `body` pueden ser nulos; maneje defensivamente. El primer comentario en `data.comments` no es necesariamente del solicitante; compare `author_id` con `ticket requester_id` para identificar mensajes del solicitante. Para llamadas masivas, respete los encabezados `Retry-After` en HTTP 429.
Obtener Tickets Recientes
Liste tickets vistos recientemente en Zendesk. Devuelve tickets ordenados por el tiempo que fueron vistos por última vez, del más reciente al más antiguo. Útil para que los agentes accedan rápidamente a los tickets en los que han estado trabajando. El endpoint devuelve tickets visibles para el agente según sus restricciones de permiso. La paginación está limitada a 10,000 registros (100 páginas * 100 por página). Use esta acción para recuperar los tickets que un agente ha accedido recientemente en la interfaz de Zendesk.
Obtener Tickets de la Organización
Obtenga tickets para una organización específica en Zendesk. Devuelve tickets donde organization_id coincide con la organización especificada. Úselo cuando necesite recuperar todos los tickets asociados con una organización en particular, como para fines de informes o revisión. La paginación está disponible para grandes conjuntos de resultados; siga los enlaces next_page hasta null para recuperar todos los tickets. Nota: Este endpoint devuelve tickets de organización que pueden incluir tickets de varios solicitantes dentro de la organización.
Obtener Comentarios del Ticket
Liste los comentarios en un ticket de Zendesk. Devuelve los comentarios añadidos al ticket en orden cronológico (el más antiguo primero por defecto). Cada comentario tiene campos `html_body` y `plain_body`: use `plain_body` para texto limpio sin HTML. Los comentarios públicos son visibles para los usuarios finales, mientras que los comentarios internos son visibles solo para los agentes. Use el parámetro `include_inline_images` para incluir imágenes en línea como adjuntos. Para operaciones masivas, respete los encabezados `Retry-After` en las respuestas de límite de tasa HTTP 429.
Crear o Actualizar Usuario
Cree o actualice un usuario en Zendesk. Si existe un usuario con el mismo correo electrónico o external_id, se actualizará. De lo contrario, se creará un nuevo usuario. Úselo cuando necesite insertar o actualizar registros de usuarios: idempotente basado en la coincidencia de correo electrónico o external_id. Devuelve 200 para usuarios existentes, 201 para usuarios recién creados.
Obtener Usuario
Herramienta para obtener un solo usuario de Zendesk por su user_id numérico. Úselo cuando tenga un ID de usuario de los payloads de tickets (requester_id, submitter_id, assignee_id, author_id) y necesite enriquecer con detalles completos del usuario (nombre, correo electrónico, rol, organization_id, etc.).
Buscar en Zendesk
Herramienta para buscar tickets, usuarios, organizaciones y grupos en Zendesk utilizando sintaxis de consulta. Úselo cuando necesite encontrar recursos en Zendesk utilizando criterios de búsqueda flexibles.
Buscar Usuarios de Zendesk
Busque usuarios de Zendesk por consulta o ID externo. Úselo cuando necesite encontrar usuarios utilizando criterios de búsqueda flexibles con la sintaxis de búsqueda de Zendesk (por ejemplo, coincidencias de nombre parcial, patrones de correo electrónico, notas, números de teléfono). Para búsquedas exactas de correo electrónico, considere usar la acción 'Buscar Usuarios de Zendesk' en su lugar.
Obtener Conteo de Resultados de Búsqueda
Cuente el número de elementos que coinciden con una consulta de búsqueda en Zendesk. Úselo cuando necesite saber cuántos resultados devolvería una búsqueda sin recuperar todos los resultados reales. Esto es útil para mostrar conteos de resultados antes de ejecutar una búsqueda completa.
Actualizar Muchos Tickets
Actualice múltiples tickets en Zendesk en una sola solicitud. Úselo cuando necesite actualizar en masa campos de tickets, como estado, prioridad, etiquetas, asignado o grupo para múltiples tickets a la vez. La API acepta hasta 100 objetos de ticket por solicitud. Los cambios se procesan de forma asíncrona y devuelven un objeto job_status para rastrear el progreso.
```

### Panel — pestana DISPARADORES (literal)

```
Zendesk

No conectado

Zendesk proporciona software de soporte al cliente con funciones de ticketing, chat en vivo y base de conocimientos, lo que permite operaciones de helpdesk eficientes y compromiso del cliente.

Conectar
QUÉ PUEDES HACER (13)
DISPARADORES (EVENTOS) (2)
Nuevo Usuario Creado
Se activa cuando se crea un nuevo usuario en Zendesk.
Nuevo Ticket de Zendesk
Se activa cuando se crea un nuevo ticket en una vista específica de Zendesk.
```


## Zoho

### Panel — pestana ACCIONES (literal)

```
Zoho

No conectado

Zoho es un conjunto de aplicaciones en la nube que incluye CRM, marketing por correo electrónico y herramientas de colaboración, permitiendo a las empresas automatizar y escalar operaciones.

Conectar
QUÉ PUEDES HACER (14)
DISPARADORES (EVENTOS) (0)
Crear Lead en Zoho CRM
Crea un nuevo registro de lead en Zoho CRM con los detalles especificados. El único campo obligatorio es Apellido; todos los demás campos son opcionales. Usa esta acción cuando necesites agregar un nuevo lead a Zoho CRM, típicamente después de capturar información del lead de un formulario web, correo electrónico u otra fuente de generación de leads. La acción devuelve el ID del lead recién creado y metadatos que incluyen marcas de tiempo de creación e información del usuario.
Crear Contacto en Zoho CRM
Crea un nuevo registro de contacto en Zoho CRM. Usa esta acción cuando necesites agregar un nuevo contacto al sistema CRM. El campo Apellido es obligatorio y debe proporcionarse con un valor no vacío.
Crear Trato en Zoho CRM
Crea un nuevo trato en Zoho CRM que representa una oportunidad de venta con nombre del trato, etapa, monto y fecha de cierre. Usa esta acción cuando necesites crear un trato u oportunidad de venta en Zoho CRM. Los campos requeridos son Nombre_del_Trato y Etapa; todos los demás campos son opcionales. El trato se asignará al usuario autenticado a menos que se especifique explícitamente un Propietario.
Crear Evento en Zoho CRM
Crea un nuevo registro de Evento en Zoho CRM. Los eventos representan actividades programadas como reuniones, llamadas o citas. Usa esta acción cuando necesites programar un nuevo evento o reunión en el sistema CRM. Todos los eventos requieren un título de evento, hora de inicio y hora de finalización como mínimo.
Listar Leads de Zoho CRM
Recupera registros de leads del módulo de Leads de Zoho CRM con soporte para paginación. Utiliza esta acción cuando necesites listar, filtrar o paginar leads en el CRM. Soporta tanto paginación discreta (hasta 2,000 leads) como paginación basada en tokens para conjuntos de datos más grandes.
Listar Contactos
Recupera registros de contactos de Zoho CRM con soporte para paginación, filtrado y ordenación. Utiliza esta acción cuando necesites obtener una lista de contactos de Zoho CRM. Esta es una acción especializada centrada en el módulo de Contactos con valores predeterminados de campo específicos de contacto y optimizaciones. Para recuperar registros de otros módulos, utiliza la acción genérica get_records.
Listar Negocios
Recupera una lista de negocios de Zoho CRM con soporte para filtrado, ordenación y paginación. Utiliza esta acción cuando necesites obtener registros de negocios de Zoho CRM, ya sea todos los negocios o filtrados por criterios específicos. La acción soporta tanto paginación discreta (page/per_page) para los primeros 2,000 negocios como paginación basada en tokens para conjuntos de datos más grandes.
Listar Tareas de Zoho CRM
Recupera tareas del módulo de Tareas en Zoho CRM con soporte para filtrado, paginación y ordenación. Utiliza esta acción cuando necesites obtener una lista de tareas, ya sea todas las tareas o tareas específicas por IDs. Soporta tanto paginación discreta (hasta 2,000 tareas) como paginación basada en tokens para conjuntos de datos más grandes. Notas: - La paginación discreta (page/per_page) está limitada a las primeras 2,000 tareas. Para recuperar tareas más allá de esto, utiliza la paginación basada en tokens a través de page_token de la info.next_page_token de la respuesta anterior. - No utilices page junto con page_token. - No puedes usar cvid junto con sort_by.
Buscar Tareas en Zoho CRM
Busca tareas en Zoho CRM utilizando criterios flexibles que incluyen asunto, estado, prioridad o fecha de vencimiento. Utiliza esta acción cuando necesites encontrar registros de tareas específicos por criterios, correo electrónico, teléfono o palabra clave en lugar de listar todas las tareas. Esto evita límites de paginación y realiza un filtrado eficiente del lado del servidor en el módulo de Tareas.
Listar Eventos de Zoho CRM
Lista eventos (reuniones) de Zoho CRM con soporte para paginación y filtrado. Utiliza esta acción cuando necesites recuperar eventos programados, reuniones o citas de Zoho CRM para la gestión del calendario, informes o fines de sincronización. Nota: En la interfaz de Zoho CRM, los Eventos se muestran como 'Reuniones'. La paginación discreta (page/per_page) está limitada a los primeros 2,000 registros. Para recuperar eventos más allá de este límite, utiliza la paginación basada en tokens a través de page_token de la info.next_page_token de la respuesta anterior.
Obtener Contacto de Zoho CRM
Recupera un único registro de contacto por ID de Zoho CRM. Devuelve los detalles completos del contacto, incluida la información del propietario, asociaciones de cuenta, campos de dirección y todos los campos personalizados. Usa esta acción cuando necesites obtener información detallada sobre un contacto específico utilizando su ID de registro.
Obtener Registros de Zoho CRM
Recupera registros de un módulo especificado en Zoho CRM. Notas: - La paginación discreta (page/per_page) está limitada a los primeros 2,000 registros. Para recuperar registros más allá de esto, utiliza la paginación basada en tokens a través de page_token de la info.next_page_token de la respuesta anterior. - No utilices page junto con page_token. - No puedes usar cvid junto con sort_by.
Crear Registro en Zoho CRM
Crea nuevos registros en un módulo especificado en Zoho CRM. Las operaciones en masa pueden tener éxito parcial: inspecciona el campo de estado de cada elemento en la respuesta, ya que algunos registros pueden ser creados mientras que otros fallan.
Actualizar Registro de Zoho CRM
Actualiza registros existentes en un módulo especificado en Zoho CRM. Soporta la actualización de hasta 100 registros por llamada a la API. Utiliza nombres de API de campo (no nombres de visualización) para todas las actualizaciones de campo. El campo 'id' es obligatorio para cada registro.
```

### Panel — pestana DISPARADORES (literal)

```
Zoho

No conectado

Zoho es un conjunto de aplicaciones en la nube que incluye CRM, marketing por correo electrónico y herramientas de colaboración, permitiendo a las empresas automatizar y escalar operaciones.

Conectar
QUÉ PUEDES HACER (14)
DISPARADORES (EVENTOS) (0)

Sin disparadores disponibles.
```


## Zoho Mail

### Panel — pestana ACCIONES (literal)

```
Zoho Mail

No conectado

Zoho Mail es una plataforma de alojamiento de correo electrónico segura y sin anuncios, con herramientas de colaboración, integración de calendario y amplios controles administrativos.

Conectar
QUÉ PUEDES HACER (15)
DISPARADORES (EVENTOS) (0)
Crear Borrador de Correo
Herramienta para crear y guardar un borrador de correo en Zoho Mail sin enviarlo. Úselo al redactar correos que necesitan ser guardados para edición o envío posterior.
Listar Correos
Herramienta para recuperar una lista de correos de una carpeta de la cuenta de Zoho Mail. Úselo cuando necesite obtener correos de la bandeja de entrada o de una carpeta específica, con soporte para filtrado por estado de lectura, archivos adjuntos, banderas y paginación.
Responder al Correo
Herramienta para responder a un correo electrónico existente a través de la API de Zoho Mail. Úselo cuando necesite enviar una respuesta a un mensaje de correo electrónico recibido, manteniendo el hilo del correo.
Enviar Correo
Herramienta para enviar un correo electrónico a través de la API de Zoho Mail. Úselo cuando necesite enviar correos de inmediato a los destinatarios.
Obtener Contenido del Mensaje
Herramienta para recuperar el contenido/cuerpo completo de un correo electrónico específico de Zoho Mail. Úselo cuando necesite obtener el contenido completo del correo después de listar o buscar mensajes, ya que los puntos finales de lista/búsqueda normalmente devuelven solo metadatos/resumen.
Buscar Mensajes
Herramienta para buscar correos electrónicos en una cuenta de Zoho Mail utilizando la sintaxis searchKey de Zoho. Úselo cuando necesite encontrar correos electrónicos específicos por remitente, asunto, palabras clave, estado (por ejemplo, no leído), archivos adjuntos o banderas. Devuelve messageId y folderId necesarios para obtener el contenido completo del mensaje.
Actualizar Almacenamiento del Usuario
Actualiza la asignación de almacenamiento de un usuario dentro de una organización de Zoho Mail. Puede modificar tanto el plan de almacenamiento base como los complementos de almacenamiento extra. Úselo cuando necesite: - Cambiar el plan de almacenamiento base de un usuario (por ejemplo, de básico a mailPremium) - Agregar o modificar complementos de almacenamiento extra para un usuario Requisitos previos: Debe tener un zoid válido (ID de organización) y un zuid (ID de usuario) antes de llamar a esta acción.
Listar Cuentas de Zoho Mail
Recupera todas las cuentas de Zoho Mail asociadas con el usuario autenticado. Devuelve detalles de la cuenta, incluyendo accountId (necesario para otras operaciones de correo), direcciones de correo electrónico, información de almacenamiento, estado de la cuenta, preferencias de usuario y configuraciones de seguridad. Usa esta acción primero para obtener el accountId necesario para operaciones posteriores de buzón, mensaje, carpeta y correo. El accountId es un identificador único para cada cuenta de correo. Flujo de trabajo típico: Listar cuentas → Obtener accountId → Usar accountId en otras operaciones de correo.
Obtener Todos los Marcadores
Herramienta para recuperar todos los marcadores personales de una cuenta de Zoho Mail. Úselo cuando necesite obtener marcadores/enlaces guardados con soporte para paginación y filtrado de campos.
Eliminar Grupos en Masa
Elimina múltiples grupos en una sola llamada a la API. Esta acción elimina permanentemente los grupos especificados de su organización de Zoho Mail. Úselo cuando necesite: - Eliminar varios grupos obsoletos o no utilizados a la vez - Limpiar grupos después de una reestructuración organizativa - Eliminar grupos por lotes para fines administrativos Nota: Los grupos eliminados no se pueden recuperar. Asegúrese de tener los IDs de grupo correctos antes de la eliminación.
Eliminar Grupo
Herramienta para eliminar un grupo de correo específico por su zgid. Úselo cuando necesite eliminar un grupo de su organización después de confirmar los IDs.
Obtener Detalles de Almacenamiento del Usuario de la Organización
Herramienta para recuperar detalles de almacenamiento para un usuario específico en la organización. Úselo cuando necesite conocer las cuotas totales y utilizadas de almacenamiento de un usuario.
Operaciones de Dominio
Herramienta para realizar operaciones de dominio como verificar, establecer dominio principal, alojamiento, alias, verificaciones MX/SPF, gestión de DKIM y notificaciones. Úselo después de crear o recuperar un dominio.
Actualizar Tipo de Procesamiento de Spam de la Organización
Herramienta para actualizar el tipo de procesamiento de spam de la organización. Úselo al cambiar la estrategia de filtrado de spam para una organización.
Actualizar Configuraciones del Grupo
Herramienta para actualizar la configuración del grupo. Úselo después de la creación del grupo para ajustar configuraciones generales o de texto.
```

### Panel — pestana DISPARADORES (literal)

```
Zoho Mail

No conectado

Zoho Mail es una plataforma de alojamiento de correo electrónico segura y sin anuncios, con herramientas de colaboración, integración de calendario y amplios controles administrativos.

Conectar
QUÉ PUEDES HACER (15)
DISPARADORES (EVENTOS) (0)

Sin disparadores disponibles.
```


## Zoom

### Panel — pestana ACCIONES (literal)

```
Zoom

No conectado

Zoom es una plataforma de videoconferencia y reuniones en línea que cuenta con salas de grupo, compartición de pantalla e integraciones con varias herramientas empresariales.

Conectar
QUÉ PUEDES HACER (10)
DISPARADORES (EVENTOS) (8)
Crear una reunión
Habilita la creación de reuniones de Zoom a través de aplicaciones a nivel de usuario con "me". "Start_url" para anfitriones expira en 2 horas, o 90 días para usuarios "custCreate". Renueve a través de la API, limitado a 100 solicitudes/día. Requiere el permiso "meeting:write", sujeto a un límite de tasa medio.
Obtener una reunión
Recupera información detallada sobre una reunión de Zoom por su ID. Devuelve datos completos de la reunión, incluidos el tema, la agenda, las URL, las contraseñas, la configuración y, para reuniones recurrentes, detalles de ocurrencia y patrones de recurrencia. Para reuniones recurrentes, el valor predeterminado es la última ocurrencia, a menos que se especifique occurrence_id o show_previous_occurrences. El campo start_time devuelto debe interpretarse utilizando el campo de zona horaria de la reunión. Requiere el alcance meeting:read. Límite de tasa: LIGERO.
Actualizar una reunión
Para actualizar una reunión a través de la API, asegúrese de que `start_time` esté programado para el futuro; se necesita `recurrence`. Límite: 100 solicitudes/día, 100 actualizaciones/reunión en 24 horas. Requiere los ámbitos `meeting:write` y `meeting:write:admin`, con un límite de tasa `LIGERO`.
Eliminar una reunión
Elimina o cancela una reunión programada de Zoom. Utiliza occurrence_id para eliminar una ocurrencia específica de una reunión recurrente. Soporta opciones de notificación para anfitriones y registrantes. Devuelve HTTP 204 en caso de éxito. Límite de tasa: Ligero. Alcances requeridos: meeting:write o meeting:write:admin.
Listar reuniones
Esta API de Zoom lista las reuniones programadas de un usuario utilizando el valor `me` para aplicaciones de nivel de usuario, excluyendo reuniones instantáneas y mostrando solo las que no han expirado. Requiere alcances específicos y tiene un límite de tasa `MEDIO`. No hay filtrado del lado del servidor por tema, agenda o campos de texto; todo el filtrado debe hacerse del lado del cliente. Los valores `meetingId` exceden el rango de enteros de 32 bits; trátelo como identificadores numéricos o de cadena de longitud completa.
Obtener grabaciones de reuniones
Para descargar grabaciones de reuniones, use `download_url`. Incluya el token OAuth en el encabezado para aquellas protegidas por contraseña. Soporta los alcances `recording:read` y `phone_recording:read:admin`, con un límite de tasa `LIGHT`. Requiere un plan de pago de Zoom con grabación en la nube habilitada; los derechos faltantes devuelven resultados vacíos o errores de derechos, no fallos del sistema. El código de error 3301 significa que no existe grabación en la nube para la reunión: un caso de resultado vacío esperado.
Agregar un registrante a la reunión
Registra un participante para un seminario web de Zoom que tiene registro habilitado. **Requisitos previos:** - El anfitrión del seminario web debe tener una **cuenta de Zoom licenciada (de pago)** - esto NO funcionará con cuentas gratuitas/básicas - El seminario web debe tener registro habilitado (approval_type = 0 para aprobación automática o 1 para aprobación manual) - Máximo de 4,999 registrantes por seminario web **Campos requeridos:** meeting_id, first_name, last_name, email **Campos opcionales:** address, city, state, zip, country, phone, comments, industry, job_title, org, language, auto_approve **Errores comunes:** - "Solo disponible para usuarios de pago" - El anfitrión del seminario web necesita una cuenta de Zoom licenciada - "El registro no ha sido habilitado" - Habilite el registro a través de update_a_meeting con approval_type = 0 o 1 - "Reunión no encontrada" - ID de reunión inválido o la reunión ha terminado.
Obtener participantes de reuniones pasadas
Recupera la lista de participantes que asistieron a una reunión pasada (finalizada) de Zoom. Requiere una cuenta de Zoom paga (Pro o superior). La reunión debe haber terminado con al menos un participante (excluyendo reuniones en solitario). Use el ID de la reunión para la instancia más reciente o el UUID de la instancia para una ocurrencia específica.
Obtener un resumen de la reunión (solo cuentas pagadas)
IMPORTANTE: Esta acción requiere una cuenta de Zoom PAGADA (plan Pro, Business o Enterprise). Las cuentas gratuitas de Zoom no pueden utilizar esta función y recibirán un error 400. Además, requiere: - Función AI Companion habilitada en la configuración de la cuenta - La reunión no debe estar encriptada de extremo a extremo (E2EE) - El resumen de la reunión debe estar habilitado y generado para la reunión Límite de tasa: LIGERO. Los campos de respuesta como `summary_details` y `next_steps` son opcionales y pueden estar ausentes o ser arreglos vacíos.
Obtener un usuario
Recupera información detallada sobre un usuario específico de Zoom por ID, correo electrónico o 'me'. Devuelve el tipo de usuario, rol, información de licencia y metadatos de la cuenta. Úselo cuando necesite verificar el tipo/licencia del usuario o recuperar detalles del perfil del usuario.
```

### Panel — pestana DISPARADORES (literal)

```
Zoom

No conectado

Zoom es una plataforma de videoconferencia y reuniones en línea que cuenta con salas de grupo, compartición de pantalla e integraciones con varias herramientas empresariales.

Conectar
QUÉ PUEDES HACER (10)
DISPARADORES (EVENTOS) (8)
Informe de Uso Diario Cambiado
Se activa cuando el informe diario de uso de Zoom cambia para un año/mes seleccionado. Este desencadenador monitorea estadísticas diarias de uso, incluyendo: - Nuevos usuarios añadidos - Número de reuniones realizadas - Conteo de participantes - Minutos de reunión consumidos
Detalles de la Reunión Cambiados
Se activa cuando los detalles de una reunión específica cambian. Detecta cambios como: - Cambios en el tema de la reunión - Actualizaciones de la agenda - Cambios en el horario (zona horaria, duración) - Modificaciones en la configuración (sala de espera, grabación, video, etc.) - Cambios de contraseña - Actualizaciones del patrón de recurrencia
Grabación de la Reunión Cambiada
Se activa cuando las grabaciones en la nube de una reunión específica cambian. Detecta cambios como: - Nuevos archivos de grabación que aparecen - Finalización del procesamiento de la grabación (cambios de estado) - Cambios en los metadatos de la grabación (conteo, tamaño, etc.) - Nuevos archivos de audio de participantes
Resumen de la Reunión Creado o Actualizado
Se activa cuando se crea o actualiza un resumen de reunión para una reunión específica. IMPORTANTE: Este desencadenador requiere una cuenta de Zoom PAGADA (plan Pro, Business o Enterprise). Las cuentas de Zoom gratuitas no pueden usar esta función. Además, requiere: - Función de Compañero de IA habilitada en la configuración de la cuenta - La reunión no debe estar encriptada de extremo a extremo (E2EE) - El resumen de la reunión debe estar habilitado y generado para la reunión
Nueva Grabación en la Nube
Se activa cuando aparece una nueva instancia de reunión grabada en la nube para un usuario.
Nueva Reunión Creada
Se activa cuando se crea una nueva reunión de Zoom para un usuario.
Nuevo Participante en la Reunión
Se activa cuando aparece un nuevo participante en el informe de participantes de una reunión pasada.
Nuevo Webinar Creado
Se activa cuando se crea un nuevo webinar para un usuario.
```
