# Copiloto de IA: webinar del proveedor y podcast DKW Cast (2026-10-29)

Qué es este archivo: síntesis de tres transcripciones hechas con Google AI Studio (Gemini) a partir de videos del proveedor de la plataforma base (DKW System) sobre el Copiloto de IA. Las pasó el usuario el 2026-10-28 y 2026-10-29. Los prompts usados están en `artefactos/prompt-ai-studio-transcripcion-copiloto-2026-10-28.md` y `artefactos/prompt-ai-studio-transcripcion-podcast-crm-2026-10-28.md`.

**Nada de esto está verificado contra el video ni en nuestra cuenta.** Es lo que dice el proveedor en un webinar y en un podcast comercial. Complementa a [[43-centro-de-ayuda-rmsystemm-2026-10-06]] y a `wiki/entities/copiloto-ia.md`.

## Las tres fuentes y cuánto confiar en cada una

| Fuente | Qué es | Confianza |
|---|---|---|
| **A. Preguntas y respuestas del webinar, tramo 64:01-91:08** | Re-transcripción literal pedida aparte, con quién pregunta, quién responde y citas en portugués | **Alta**: tiene muletillas y dudas reales de habla; la respuesta sobre créditos por sussurro ya no trae las cifras inventadas de la primera versión |
| **B. Webinar (91 min) + video demostrativo de Mateus (24 min)**, primera transcripción | Línea de tiempo, métodos de carga, inventario de funciones | **Media-baja**: la pegaron cortada en la sección 9; se detectaron invenciones (ver "Errores detectados") |
| **C. Podcast DKW Cast, dos episodios (58 min), sin pantalla** | Conversación de marketing con un dueño de agencia | **Baja para el producto**: todo es "afirmado", nada mostrado; la pegaron cortada en la sección 6 |

Fecha del webinar: no confirmada. Un slide muestra "15 de setembro de 2026" (dato visto por el transcriptor, sin verificar). Preguntarle al usuario de dónde salió el video.

## Lo que dicen, por tema

### 1. Requisito: IA Gerenciada (fuente A, literal)
- El Copiloto y su prueba gratis **no funcionan sin IA Gerenciada**. Cita de Nicolas (CTO): *"sem a IA Gerenciada ativa, não tem como vocês fazerem a degustação e nem o uso do copiloto"*.
- Lo activa el **partner** (el revendedor), no la cuenta del cliente: `Parceiros > Política de IA > Personalizado por empresa`, y poner "IA Gerenciada" en la empresa elegida.
- Dijeron que, al terminar el webinar, harían una actualización en masa para activar la prueba gratis a todos los partners.
- Qué significa para nosotros: la cuenta de Fitness tiene `copilotAvailable: false`, `companySubscribed: false` y `copilotSeats: 0` (leído el 2026-10-08). El paso es de quien nos provee la plataforma. **Suposición a confirmar**: que ese partner sea el soporte de RM System.

### 2. Prueba gratis y asientos
- Prueba gratis ("degustação"): 5 mensajes y 2 análisis por día por empresa, solo el administrador, sin costo de créditos (fuente B, de un slide; el Q&A no lo contradice).
- Asiento extra: `Configurações > Meu Plano > Adicionar Extra`, **R$ 24,90 por asiento por mes** para el partner, sin margen cuando lo compra para su propia empresa, cobrado de la "carteira de licenças" (fuente A, literal). Lo que el partner le cobre a su cliente final lo decide el partner (fuente B).
- Planes sugeridos al cliente: Essencial R$ 79, Pro R$ 247, Max R$ 647 por mes (fuente B; coincide con el rango que ya figuraba en la wiki).

### 3. Créditos y consumo
- El Copiloto gasta los **mismos créditos de IA que el agente**. Hay dos carteras separadas: saldo en reales (voz y otros servicios) y créditos de IA. 1 crédito = R$ 0,01 (fuente B, de un slide).
- Sussurro (respuesta sugerida) e insights **sí consumen**, pero *"um consumo irrisório"* (fuente A). No dan cifra. Las cifras R$ 0,01-0,05 de la primera transcripción no aparecen en la versión literal: descartarlas.
- R$ 0,25 por mensaje es **una estimación** que *"vai variar bastante"*; generar un documento gasta más (fuente A).
- Sin saldo de créditos el Copiloto no responde (fuente B).
- Posponer el pago: *"para alguns parceiros"* y *"depois que a gente fizer um levantamento"* de costos. Es una promesa, no existe todavía (fuente A).

### 4. Modelos
- Los modelos del Copiloto los elige y controla DKW; **nadie puede cambiarlos**. Ejemplo dado: Gemini para generar imágenes (fuente A). El agente sí permite elegir modelo cuando se usa IA Gerenciada (fuente B).

### 5. Copiloto de soporte (fuente A)
- Existe un "copiloto de suporte" **gratis para los partners**, que aparece al personificar a un cliente. Sirve para pedir optimización del CRM y de los agentes del cliente. Los clientes finales **no** lo ven.
- Implicancia: el soporte de la plataforma ya podría usarlo sobre nuestra cuenta. Eso incluye editar agentes, así que sobre Maxi (10005) solo con autorización explícita del usuario.

### 6. Demostración final: el Copiloto reescribe un agente (fuente A)
- Nicolas abre un agente de recepción, le pide al Copiloto que lo convierta en uno de calificación, el Copiloto propone pasos, él los va aprobando y al final **cambia el prompt directamente**: agrega etiquetas, acciones (por ejemplo "Chamar Fila Comercial") y una regla de negocio (cobrar 50% de seña) que ya le habían cargado antes como proceso de la empresa.
- Nicolas: *"ele vai perguntando se vocês confirmam... e ele vai alterar na hora"*.
- **No se mostró ni se mencionó** en la versión literal la prueba en bucle que simula conversaciones. La primera transcripción decía "probar en bucle"; sin respaldo hasta ahora.
- El texto del prompt que la transcripción dice haber leído en pantalla **no es confiable** (trae frases incoherentes para una clínica, como "troca de tubulação"). No copiar.

### 7. Funciones del Copiloto citadas en la fuente B (sin verificar)
Resumen y respuesta sugerida (con botón Enviar) en el chat, insights del lead, acciones sugeridas ejecutables con un clic, planillas y páginas con gráficos que genera a pedido, tareas programadas ("Agendamentos"), monitoreo de grupos de WhatsApp, un Copiloto personalizable por miembro del equipo (instrucciones, fuentes de conocimiento y conectores propios), y conexión de cuentas externas como Gmail o Google Sheets. La fuente A confirma de pasada que existen documentos generados, grupos ("insights de grupos") y personalización por miembro.

### 8. Promesas del proveedor (marcadas [PROMESA])
- El Copiloto podrá **crear y probar flujos de automatización** y ejecutar **acciones en masa** (mover todos los contactos con una etiqueta a una misma columna), siempre con aprobación (fuente A, 78:00).
- Google Ads dentro de la pestaña Marketing: "em breve" (fuente A).
- Videoaulas y más lives: sin fecha (fuente A).

### 9. Podcast: lo poco que aporta sobre el Copiloto (fuente C)
- Sin pantalla ni demostración. Hablan solo dos bloques (39:20-44:40 y 53:31-55:10).
- Lo que se atribuye al Copiloto de forma razonable: preguntarle al CRM qué oportunidades quedaron sin seguimiento, pedirle que redacte un prompt y cree un agente con aprobación humana, y crear plantillas por rubro. Un dueño de agencia dice que lo va a regalar a sus mejores clientes.
- **Mezcla errónea en la transcripción**: lo que el invitado llama "Salvatore" (un alter ego con horas de llamadas de venta) es **un GPT o una skill de Claude suya**, no el Copiloto de la plataforma. La transcripción lo usó como ejemplo de cómo cargar el Copiloto y de manejo de objeciones; no corresponde. La regla de 12 horas sin movimiento es una automatización del CRM, no del Copiloto.
- Habla un socio de DKW haciendo publicidad ("merchan"); todo es afirmación comercial.
- Cosas no-Copiloto que anotamos para el futuro: se dice que el CRM puede devolver a Meta solo los eventos de "reunión agendada" o "ganado" (conexión con la API de conversiones; ver Q34), que existen agentes de IA para llamadas de voz, y que un cliente bajó su pauta de R$ 200.000 a R$ 70.000 con un agente que atiende 24 horas.

## Errores detectados en las transcripciones (para no repetirlos)
- La primera corrida **coló datos de nuestro negocio** en pasos que el video no muestra: "suplementos", "creatina y whey", "4 vendedores".
- Describe la cuenta de ejemplo de dos formas incompatibles: clínica de exámenes por imagen en una parte y clínica dental en otra.
- Un dato con timestamp 59:14 en un video de 58:06 (imposible).
- Cifras de costo a centavo que la versión literal no respalda.
- Una afirmación de "modo automático que manda WhatsApp solo" sin respaldo.
- Corridas con varios videos juntos mezclan fuentes; hacer una corrida por video.

## Lo que sigue sin respuesta
- **Permisos y privacidad** (quién ve qué entre dueño, administrador y vendedor; si la memoria del Copiloto es por persona; qué pasa con lo acumulado cuando se va un vendedor): en las preguntas y respuestas literales **nadie lo preguntó**. Es la pieza clave para el control de vendedores. Hay que preguntar a soporte.
- **Cómo cargar de verdad**: formatos, límites y pantallas literales no están confirmados; solo la fuente B lo describe.
- **Efecto sobre Maxi** de pasar la cuenta a IA Gerenciada: el agente pasaría a gastar créditos y a depender de la lista de modelos de la plataforma. Confirmar con soporte antes de aceptar.
- **Precio al cliente final en nuestro proveedor**: depende de lo que cobre el partner.
- **Fecha real del webinar** y si ya ejecutaron la activación masiva.
- **Control de vendedores con datos reales**: el CRM de Fitness no registra ventas (0 negocios ganados), así que las preguntas del tipo "¿quién cerró más ventas hoy?" no tendrían respuesta.

Pendiente asociado: Q41 en `PENDIENTES.md` (habilitar el Copiloto para probarlo) y S4 (disponibilidad y costo).
