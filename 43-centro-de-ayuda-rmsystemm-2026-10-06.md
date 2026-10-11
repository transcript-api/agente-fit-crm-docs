# 43 — Centro de Ayuda de RM System: qué dice y qué sirve para escalar (2026-10-06)

## Fuente y alcance (leer primero)
- Se leyó el Centro de Ayuda de la propia plataforma (`/academy`, antes "Academy") desde la cuenta de Fitness Suplementos, solo lectura, el 2026-10-06. Es **documentación del proveedor**: describe lo que la plataforma dice que hace. **Nada de esto está verificado en nuestra cuenta**, salvo donde se indique.
- **Leído completo:** Agente de IA (11 artículos), Automaciones (7 de 8), Webhooks (2), API Externa (7), Agendamientos (5), Informes, Voip, FAQ (10 respuestas), 20 changelogs, y de Canales: WhatsApp API Oficial (primera mitad), Diferencia oficial vs no oficial y los resúmenes por palabra clave de WhatsApp No Oficial, Z-API e Instagram.
- **No leído o vacío:** "Integraciones de Fila" (solo muestra el título N8N, sin cuerpo en texto), "Introducción", la biblioteca de videos (0 videos cargados), la segunda mitad de WhatsApp API Oficial (errores y límites de tasa), el cuerpo completo de WhatsApp No Oficial, Z-API e Instagram, y los artículos viejos "(OLD)" que el FAQ enlaza (Modo Avanzado, JID→LID, Reglas de Visualización) — no aparecen en el menú.
- El texto crudo no se guarda en el repo (es contenido del proveedor). Este archivo es síntesis propia.
- El 2026-07-26 la plataforma se reorganizó: DS Agente pasó a "Agente de IA", DS Voice a "Criativos", DS Track a "Marketing", Academy a "Centro de Ayuda". Los nombres viejos siguen apareciendo en la documentación.

## 1. Agentes de IA
- **Capacidades declaradas:** conversar, consultar documentos, etiquetar, transferir, crear y mover negocios, disparar automatizaciones de Criativos, llamadas HTTP, agendar con Google Calendar, guardar variables, follow-ups, analizar imágenes.
- **Acciones (chips en el prompt):** Adicionar Tag, Transferir Atendimento, Enviar Horarios, Disparar Automação, Criar Negócio, Mover Negócio, Salvar Variável, Requisição HTTP, Randomizar Canal, Encerrar Atendimento. Silenciosas para el cliente. **Solo `Salvar Variável` se puede repetir**; el resto no se repite con los mismos datos (protección contra duplicados). Transferir **desactiva el agente en ese ticket**.
- **Delays:** "Delay para responder" agrupa mensajes (el timer se reinicia con cada mensaje nuevo); la doc recomienda 5-15 s en WhatsApp, y advierte que más de 20 s parece que no responde. Nosotros usamos 28 s. "Ignorar mensajes los primeros X segundos" **descarta** lo que llegue en esa ventana, no lo procesa después. Relevante para convivir con automatizaciones de bienvenida.
- **Pestañas del editor:** Treinamento (prompt, chips, follow-ups), Conhecimento, Ferramentas, Teste, Uso.
- **Base de conocimiento:** PDF, Word, Excel, CSV, JSON, TXT, Google Sheets por link público y **fuente "Requisição HTTP"** (el agente hace la llamada y usa la respuesta). Regla de la doc: pocos documentos bien escritos, uno por tema, sin contradicciones; actualizar borrando el viejo y subiendo el nuevo. El 22/03 mejoró la búsqueda para aceptar variaciones de descripción sin coincidencia exacta.
- **Ferramentas → Ativação:** tarjetas con total de tickets, con usuario y sin usuario; botones "Ativar em Todos", "Desativar em Todos", "Desativar em Tickets com Usuário"; **reglas de activación automática** por **etiqueta o cola** (tiene / no tiene, grupos con E/O); y **Randomizador de canal** (rodízio entre conexiones para repartir carga y no saturar un número).
- **Follow-ups:** modo manual o generativo (instrucciones + historial), frecuencia única / recurrente / diaria, tiempo en segundos a días. No retroactivos. Una corrección del 09/05 evita que el follow-up salga con el agente ya desactivado.
- **Prueba y logs:** el chat de prueba **simula** las acciones (marca `[SIMULADO]`), y el panel de detalle muestra hasta 10 etapas (base, caché, prompt, historial, análisis de acciones, respuesta), tokens, tiempos y fuentes. En producción los logs están en la timeline del ticket. **Caché de 30 minutos** para preguntas repetidas.
- **Costos y modelos:** dashboard de tokens por período, por categoría y por modelo, y por ticket. La clave es del cliente (BYOK) y se paga al proveedor. La tabla de precios incluye OpenAI, **Anthropic Claude** y Gemini. El changelog del 16/08 agrega los modelos GPT 5.6.
- **Pastas:** organizan agentes; **duplicar copia todo** (prompt, base, acciones, follow-ups, agendamientos), útil como respaldo antes de un cambio grande.
- **Nota de arquitectura:** el FAQ recomienda empezar en modo básico y pasar a avanzado solo si el agente "alucina" o no da abasto. Nuestro 10005 está en Clásico (equivale al básico) a propósito.

## 2. Automatizaciones
- **Dos sistemas distintos:** *Fluxos de Automação* (constructor visual, ramificaciones, variables, esperas, sin excepciones ni horario comercial) y *Automações de Coluna* (formulario lineal por columna, con excepciones, intervalo entre ejecuciones, horario de funcionamiento y ejecución retroactiva).
- **Flujos (beta, acceso liberado a todos desde el 26/07):** nuevos disparadores que no dependen de un mensaje — Disparo manual, Agendado, Contato criado, Contato inativo, Conversa encerrada, **Negócio mudou de etapa, Negócio ganho, Negócio perdido**, Lista de contatos. Bloques nuevos: Para cada item, Script, Data & Hora, búsqueda de contacto y de conversación, Google Sheets con 10 operaciones, **Modo Prueba** que simula con datos reales sin enviar nada. Desde el 02/05 hay acción **jump-to** para encadenar un flujo en otro.
- **Acciones de flujo documentadas:** Enviar Mensaje, Enviar Mídia (incluye voz PTT), Menú Interactivo (1-10 botones, salida "Senão"), Crear/Buscar Conversa, Transferir Fila, **Vincular Agente IA**, Buscar/Crear/Transferir Card, Atualizar Status del Card (ganho/perdido), Adicionar Tag, Salvar Variável (puede guardarse como campo personalizado del contacto), Aguardar Resposta, Requisição HTTP. Controles: Condicional (E / O / separadas), Randomizador (aleatorio o secuencial persistente), Atraso.
- **Automaciones de columna:** disparadores Entrada, Saída, Tempo na Coluna, Execução Recorrente, Tempo Recorrente, Mensagem Recebida. Acciones: Mensaje, Template (solo oficial y sin variables propias; desde 26/06 también con variables), Funil de Criativos, Criativo, Mudar de Coluna, Tags, **Adicionar/Remover Agente**, Vincular Responsável, Delay (desde 17/06), Transferir Fila (desde 13/07). Hay **30 s automáticos entre mensajes** de una misma automatización.
- **Monitoreo:** historial por flujo con visor paso a paso, y "Execuções de Automação" por columna. Los flujos con una esperada de respuesta quedan en "Aguardando".
- **Integraciones de fila (N8N, DSBOT):** existe el concepto, con botón para desactivarlas desde el ticket (20/02), pero el artículo no se pudo leer.

## 3. API, webhooks y llaves
- **Dos autenticaciones:** `api-key` (toda la empresa; contactos, tickets, negocios; límite **60 pedidos por minuto por endpoint y método**, respuesta 429 con `retryAfter`) y `connection-token` (uno por canal; solo para enviar mensajes). La api-key exige plan con "API Externa" y suscripción activa. Desde el 13/07 hay **API Keys múltiples con permisos por alcance**, y desde el 17/06 un límite configurable por cliente.
- **Endpoints documentados:** enviar texto, medios y plantilla (`/api/messages/send`, `/api/message-template/send`); contactos (crear, buscar, actualizar — **la actualización de tags y campos reemplaza todo**); tickets (crear, buscar, actualizar estado/cola/responsable, historial de 90 días); negocios (`GET` y `PUT /api/commercial-order` por id o por teléfono, con `step`, `amount`, `responsible`). Desde el 04/05 hay ruta para crear reuniones y desde el 02/08 se pueden agendar criativos, funnels y plantillas.
- **Webhooks de entrada:** `/webhook/leads/:uuid` (genérico), WordPress, Sellflux, Hotmart; con mapeo de campos, modo de escucha y bloqueo de duplicados por defecto (15/05).
- **Webhooks de salida:** `COMMERCIAL_ORDER_CREATED`, `COMMERCIAL_ORDER_STEP_CHANGED`, `COMMERCIAL_ORDER_CHANGED` (monto, responsable, observación…), 1 a 3 reintentos separados 10 s, éxito solo con HTTP 200, "best effort" (no se reenvía tras agotar intentos), logs con payload y respuesta, sin límite técnico por empresa. Hay evento de canal desconectado (22/03), de mensaje enviado desde el CRM (26/06) y avisos a n8n cuando el atendente toma o cierra una conversación (15/05, para pausar y reactivar al agente desde afuera).
- **Masivos:** la API es para envíos individuales; los masivos van por el módulo de Campañas con plantillas aprobadas.

## 4. Canales
- **Cómo se agrega:** Canales de atención → Crear canal → WhatsApp Business (META Oficial) → Conectar. Tres variantes: app + API con **coexistencia** (mismo número, el historial queda en el celular), **migración tradicional** (el número sale del app) o **número nuevo sin app**. Hace falta Business Manager con administrador, número sin restricciones y, para plantillas y conversaciones fuera de 24 h, **método de pago en Meta**. Error conocido "Error pairing cloud API": borrar el número y la cuenta de WhatsApp en el Business Manager y repetir.
- **Costos Meta (Brasil, vigente octubre 2025 según la doc):** marketing US$ 0,0625, utilidad US$ 0,0068, autenticación US$ 0,0068 por mensaje; las respuestas dentro de las 24 h son gratis; **72 h gratis para leads de anuncio**. Desde el 16/08 la plataforma respeta la ventana de 72 h para leads de Click-to-WhatsApp en lugar de 24 h fijas. Los precios cambian por país del cliente.
- **No oficial:** "Padrão" por QR incluido en el plan sin costo; **Z-API** se contrata aparte, se paga por instancia (un número = una mensualidad). La propia doc dice que viola los términos de WhatsApp, con riesgo de baneo, y solo la recomienda para pruebas. Desde el 09/05 simula "visto" y "escribiendo" para reducir el riesgo.
- **Instagram:** el agente funciona igual que en WhatsApp; los flujos de Instagram solo admiten un mensaje antes de esperar respuesta.
- **Límite de canales:** no figura en la ayuda; es del plan (ver Q35). El 17/06 se agregó la pestaña "Plano" (Mi Plan) con límites y uso.

## 5. Marketing y Meta
- **Módulo Marketing (desde el 26/06):** varios pixels, **eventos de conversión configurables (visita de anuncio, lead, venta) y eventos disparados por etapa comercial del CRM**; el 26/07 se agregaron variables dinámicas en el payload (escribir `{` abre la lista de datos del contacto, lead, card o venta).
- **Hallazgo que corrige Q34:** el changelog del **07/08** dice que el `ctwa_clid` de los anuncios Click-to-WhatsApp **se guardaba pero nunca viajaba en el payload de la Meta CAPI**, y que quedó corregido. Entonces la integración **sí manda el identificador de clic** desde esa fecha. Sigue sin probarse en nuestra cuenta.
- **Rastreo de anuncios (13/07):** la conversación muestra el preview del anuncio y la campaña de origen. El 16/08 se corrigió la atribución de leads que llegan por quiz → link de WhatsApp. El 06/10 llegan al embudo los leads de **Formulario Instantáneo** de Facebook e Instagram con campaña y anuncio de origen.
- **Métricas de campañas (22/03):** costo por lead, valor de venta, ticket medio, CPA y ROE por campaña, y ranking "¿qué campaña rinde más?".

## 6. Otras funciones útiles
- **Historial de versiones del agente (26/06):** borradores sin publicar, historial de versiones publicadas y **restaurar una versión anterior**. El 13/07 el editor de prompt suma registro de cambios línea por línea.
- **Grupo de Acciones (13/07):** encadenar varias acciones en orden dentro de una sola respuesta del agente.
- **Memoria entre tickets (09/05 y 16/08):** switch para que el agente lea el historial de tickets ya cerrados del mismo contacto.
- **Horario de envío del agente (09/05):** respetar el horario comercial o una franja propia; lo generado fuera de horario espera y sale en orden.
- **Distribución proporcional en colas (15/05):** por peso (3, 1, 1) o porcentaje (60, 25, 15).
- **Acciones en masa** en CRM (15/05) y en Conversas (02/08): mover, asignar, etiquetar, archivar, con proceso en segundo plano.
- **Error de IA detallado (16/08):** la timeline muestra la causa probable cuando falla el procesamiento.
- **Exportar una pipeline en JSON (26/06)** con automatizaciones y etiquetas, para reutilizar en otras cuentas.
- **Seguridad:** 2FA con app o correo (09/05), API keys con alcance, restricción de visibilidad de contactos por responsable (07/08).
- **Informes:** vistas de Ventas, Actividades, Conversas, Ligações, SDR y Closer; **solo cuenta lo marcado como "ganado"** dentro del período. Sin exportación todavía; no se actualizan en tiempo real.
- **Voip:** número Twilio (R$ 50 compra + R$ 50/mes + R$ 0,50/min) o ramal SIP (R$ 40 + R$ 0,40/min); solo Brasil. Probablemente irrelevante para Uruguay.

## 7. Correcciones del proveedor que tocan nuestros pendientes (a verificar, no confirmadas)
- **02/08:** "la transferencia de tickets por el Agente de IA enviaba el atendimiento a la fila y lo removía enseguida, impidiendo la distribución entre atendentes". Relacionado con nuestro `transfer_ticket` y el reparto entre vendedoras (Q24).
- **07/08:** "el agente no se activaba al vincular canal: la conexión aparecía inactiva aunque estuviera activa y el agente no respondía". Posible relación con Q26 (el agente a veces no es invocado) y con el mecanismo de fila (Q28).
- **07/08:** "leads no distribuidos a usuarios de la fila" corregido, con logs de cambios de cola.
- **22/03:** "el Agente de IA se desactivaba solo y el saludo se enviaba en bucle" — recuerda al re-saludo (Q29), aunque es otra fecha y otro mecanismo.
- **16/08:** "funnels con espacio al inicio o al final del nombre eran inalcanzables para el agente, sin error visible".

## 8. Oportunidades para escalar (mapeadas a pendientes)
1. **Probar Conversiones por etapa** con el código de prueba, ahora que el `ctwa_clid` viaja: ver Q34.
2. **Historial de versiones y borradores del agente**: probar si ofrece una vía de guardado distinta de la que hoy falla en el editor de Instrucciones (Q27). Sin verificar.
3. **Distribución proporcional y randomizador de canal** cuando haya más vendedoras o más canales (Q24, Q35).
4. **Memoria entre tickets cerrados** para que Maxi no vuelva a preguntar lo mismo a un lead que regresa (caso Whey Isolate XTR del tablero de Maxi).
5. **Horario de envío del agente** para no contestar de madrugada si el equipo lo quiere.
6. **Webhooks de salida de negocios** (`STEP_CHANGED`) hacia n8n o un endpoint propio como plan B si las conversiones nativas no mandan lo que Meta espera.
7. **Mensaje de respaldo del guardrail** y aviso a vendedora cuando el filtro bloquea (Q31): la doc no menciona cómo; consultar a soporte.
8. **Leer lo que falta:** "Modo Avançado (OLD)", "Integrações de Fila" y la segunda mitad de WhatsApp API Oficial.

Relacionados: [[PENDIENTES]] (Q24, Q26, Q27, Q28, Q31, Q34, Q35), [[15-flujos-automatizacion-avanzados]], [[01-agente-de-ia]], [[23-conectores-hub-integraciones]], [[31-envio-masivo-remarketing-cupon]].
