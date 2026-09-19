# Respuestas de la reunión con soporte de rmsystemm — 2026-09-14

**Qué es esto:** el usuario tuvo la llamada con soporte y volcó las respuestas por chat en vivo, numeradas siguiendo el guion de [[22-guion-reunion-soporte-portugues]] (que a su vez tiene el "por qué importa" de cada una en [[21-preguntas-para-soporte-rmsystemm]]), más 7 capturas de pantalla que soporte compartió en la llamada.

**Nivel de fiabilidad — leer antes de usar esto:** esto es un resumen tomado de memoria por el usuario durante/después de la llamada, **no es la transcripción textual**. El usuario va a intentar conseguir la grabación/transcripción real más adelante — cuando la consiga, contrastar contra este archivo y corregir lo que no coincida (marcado abajo dónde hay dudas explícitas del propio usuario).

**Qué se hizo con las preguntas ya respondidas:** se marcaron ✅ en [[21-preguntas-para-soporte-rmsystemm]] y en [[PENDIENTES]] con la fecha de hoy, sin borrar la fila (regla del proyecto) — así queda el rastro de qué se preguntó y cuándo se resolvió. Las que no se preguntaron o quedaron poco claras se dejan abiertas, marcadas para repreguntar.

---

## ✅ ACTUALIZACIÓN (2026-09-14, misma noche): el hallazgo de abajo se confirmó y se corrigió
Se entró al Google Sheet real (el usuario lo dejó abierto en el navegador) y se verificó: el botón "Compartir" decía literalmente **"Privado, solo para mí"**, con "Acceso general: Restringido — Solo las personas que tengan acceso podrán abrir el documento con el vínculo." Solo `max.suplementos77@gmail.com` (el dueño) tenía acceso. Se cambió a "Cualquier persona con el enlace" y se confirmó el cambio ("Compartir. Público en la Web..."). Detalle completo del ajuste, más los cambios de prompt y configuración técnica que se hicieron en la misma sesión, en [[17-registro-de-cambios]] (entrada "2026-09-14 (noche, continuación)") y [[13-prompt-agente-fit-v1]] (sección v6). **Falta re-probar la pestaña Prueba (o el mecanismo de "Gerenciar Agente") con el catálogo ya accesible antes de dar por resuelto el problema de precios inventados.**

## 🔥 El hallazgo más accionable de toda la reunión (leer primero)

Sobre por qué el agente inventó precios (el problema que bloquea todo, ver [[24-sesion-2026-09-14-traspaso]] §1.1): el usuario preguntó al pasar (no era la pregunta 21 planeada, pero surgió) y soporte dio **una pista concreta que no habíamos considerado**:

> Una de las posibles causas de que el agente no haya respondido bien es que **no tenía acceso a la planilla porque se compartió en modo privado**. Además, puede que la pestaña "Prueba"/modo de prueba no acceda a fuentes externas de todas formas.

**Esto es importante porque abre una hipótesis nueva y barata de descartar, antes de asumir que todo es un bug irreparable del backend**: si el Google Sheet `CATALOGO AGENTE FIT` (`1NR9cthzyLKfKKRHjy2gGwfuHMH19sAHwyP92m2xuEtY`, cuenta `max.suplementos77@gmail.com`) está compartido como "Restringido" en vez de "Cualquier persona con el enlace", ni el conector ni la fuente de conocimiento podrían haberlo leído nunca — no haría falta que sea un bug de la plataforma.

**Acción concreta, antes de cualquier otra cosa**: revisar el nivel de acceso para compartir de ese Sheet. Si está restringido, cambiarlo a "Cualquier persona con el enlace puede ver" (o compartir explícitamente con la cuenta/servicio que usa el conector) y volver a probar. Esto no descarta el bug de guardrails (que es un problema aparte, confirmado con evidencia sólida — ver abajo), pero **sí podría explicar por completo por qué la pestaña Prueba nunca llamó al conector ni a la fuente RAG**.

Soporte también confirmó, sin ambigüedad, que **inventar precios es grave** y que van a revisar si pueden arreglar el bug de guardrails.

---

## Respuestas por pregunta

Cada fila cita el número de [[22-guion-reunion-soporte-portugues]] (que es el mismo que [[21-preguntas-para-soporte-rmsystemm]] salvo la 15, ya eliminada de antes).

### 1. ¿"Salvar Variável" persiste para siempre?
**✅ Respondida: SÍ, persiste.** La variable queda guardada en el contacto para siempre, no se borra al cerrar el ticket.

**Impacto**: esto era el pendiente S1, el más importante para el diseño de Recompra — **el modo Recompra del prompt es viable tal como está diseñado**. Ya no depende de campos personalizados de contacto como alternativa; `ultimo_producto_comprado`/`fecha_compra` guardados con `save_variable` sobreviven meses.

### 2. Guardrails no se guardan
**Sigue abierto, pero ahora con reconocimiento de soporte.** El usuario le mostró en vivo la evidencia (se guarda el resto del formulario, el guardrail no). Soporte dijo que **iba a verificar** — no dio una causa ni un plazo. No hay novedad técnica todavía, pero ya no es "creemos que está el bug" — **soporte lo vio con sus propios ojos**.

**Sigue siendo la protección que falta.** No cambiar el plan de fondo (regla de escalamiento en el prompt como única red hoy) hasta tener confirmación de que se arregló — y volver a probarlo activamente (crear guardrail → recargar) cuando el usuario avise que lo revisaron.

### 3. ¿Existe una API de rmsystemm?
**✅ Respondida: sí, y es real y navegable.** Soporte confirmó que sirve para conectar con el exterior. La captura 1 (ver abajo, "Hallazgos de las capturas") muestra el panel real: `Automatizaciones → API` → "Documentación de la API 1.0", con categorías Mensagens (Envio de Texto/Mídia, Templates, DS Voice, Mídia), Dashboard, Contatos, Conversas, Filas, Tags, Pipeline/Funil, Produtos, Agenda, Atividades/Tarefas, Configuração, **Webhooks de Leads**, **Webhooks**.

**Esto ya estaba mencionado de pasada en [[16-auditoria-completa-crm]]** (sección "Otras secciones de Automatizaciones") pero nunca se exploró el contenido real. Ahora que se confirmó que es un panel de documentación interactivo con endpoints reales, **vale la pena entrar y leerlo entero** — puede responder por sí solo la pregunta de si hay webhooks salientes (parte de S3 que quedó sin cerrar del todo: no se preguntó explícitamente "¿hay webhooks salientes cuando cambia una etapa?", pero la sección "Webhooks" del panel probablemente lo dice).

### 4. Si vinculamos un canal, ¿responde a todo de una?
**✅ Respondida, y con un mecanismo concreto que resuelve el rollout controlado.** Soporte recomendó **asignar el agente a columnas específicas** (las que se quiera que atienda), y sugirió **probar primero solo en columnas vacías**.

**Hallazgo de la captura 2**: dentro de una conversación real, el ícono de opciones (arriba a la derecha, junto a "Cerrar") abre **"Gerenciar Agente" → "Selecionar Agente"**, un dropdown que hoy lista "Agente Fit" — es decir, **el agente se puede asignar (o no) conversación por conversación**, no es todo-o-nada por canal. Esto es exactamente el mecanismo que hacía falta para S6.

**Esto es lo que destraba el plan de testing que el usuario quiere hacer ahora**: en vez de vincular el canal real (que dispararía el agente para los ~5000 contactos/mes), se puede:
1. Dejar el canal de WhatsApp vinculado a la cola normal (como está hoy, atendida por el equipo).
2. Usar "Gerenciar Agente" para asignar el Agente Fit **solo** en conversaciones/negocios que caigan en las columnas vacías de `FV| FUNIL DE VENTAS` (que hoy tienen 0 negocios reales).
3. Probar con datos de prueba (o el propio usuario escribiéndose) sin ningún riesgo de que el agente le conteste a un cliente real.

### 5. Copiloto de IA — ¿disponible?
**✅ Respondida: todavía no, está en desarrollo.** No liberado para todas las cuentas — solo para las que tienen **"función súper"** (el nivel que administra todo). Nuestra cuenta no la tiene hoy (ver punto de facturación/plan más abajo — el usuario ya pidió que se la den).

### 6. Copiloto — contradicción con la descripción de "OpenAI Key"
**✅ Aclarada (parcialmente).** En unos días van a lanzar videos explicando el Copiloto en profundidad. Sobre la frase literal del conector "OpenAI Key" que decía que la clave sirve para "los Agentes de IA, **el Copiloto** y los Flujos" (ver [[23-conectores-hub-integraciones]] §4.3): según soporte, **eso es otra cosa** — la clave propia (BYOK) sirve solo para el agente y algunas funciones del agente, **no** habilita el Copiloto. La descripción del conector parece estar mal redactada o desactualizada. No se profundizó más, es una respuesta un poco al pasar — si el Copiloto se vuelve prioridad, vale la pena repreguntar con la cita en mano otra vez, más despacio.

### 7. Copiloto — precios
**Sin respuesta.** Soporte dijo que no podía darle esa información. Queda para otra instancia (probablemente cuando se libere para más cuentas o cuando salgan los videos anunciados).

### 8. Conocimiento — ¿el agente elige qué base consultar?
**✅ Respondida, y es un hallazgo que cambia el criterio de diseño.** **Busca en TODAS** las bases de conocimiento vinculadas, no elige selectivamente. Por eso soporte **recomienda tener un agente separado por función** (ej. uno para promociones) — así cada agente busca entre menos contenido y es más preciso/rápido.

**Tensión con una decisión ya tomada**: el proyecto decidió expresamente usar **un solo agente** con lógica condicional por etapa (ver [[01-agente-de-ia]], "Decisión de arquitectura"), para no duplicar mantenimiento de prompt/guardrails/RAG. Esta respuesta no invalida esa decisión — el catálogo sigue siendo una sola fuente con columna `categoria` (ver [[20-catalogo-estructura-para-el-agente]]) y hoy es la única base de conocimiento cargada, así que "busca en todas" no es un problema todavía. Pero si en el futuro se agregan más fuentes (FAQ, políticas de envío, etc.), esto es una razón real para reconsiderar separar agentes por función en vez de mantenerlo como una única "sesión larga" de conocimiento. **Anotado como consideración a futuro, no una decisión tomada.**

### 9. Fuentes externas de Google Sheets — ¿cada cuánto actualiza?
**✅ Respondida: en el momento (tiempo real).** No hay demora de re-indexado — si se cambia un precio en la planilla, el agente lo debería ver de inmediato. Esto simplifica el mantenimiento mensual de precios/promos tal como se esperaba.

### 10. Opción HTTP de fuentes de conocimiento externas
**Sin resolver bien — el usuario no se acuerda del detalle.** Lo único que quedó claro: si falla o no tiene el dato, **el agente inventa una respuesta** (no escala, no avisa) — y la sugerencia de soporte fue que eso se ajustaría desde la instrucción del prompt (reforzar la regla de "si no tenés el dato, no inventes, transferí"), no desde una configuración de la plataforma. Repreguntar en otra instancia si se llega a usar HTTP en vez de Google Sheets.

### 11. Similaridad mínima de RAG — ¿global o por base?
**Parcialmente respondida.** Soporte recomendó **0.5 o menos**, y dijo que **0.35 funcionaría igual**. No aclaró si es configurable por base de conocimiento o es un valor global del agente — la pregunta original queda sin responder del todo, pero en la práctica no cambia nada: seguimos en 0.35 y funciona según lo que dijeron.

### 12. Transcripción de audio
**✅ Respondida, pero con una contradicción real a resolver, y un hallazgo operativo nuevo e importante.**

Soporte dijo que **con solo tener la clave de OpenAI (BYOK) ya transcribe** — no hace falta ningún addon. Esto **contradice directamente** lo que decía `Configuración → Mi Plan`: *"Transcrição de áudios: não incluída"* (documentado como cerrado ✅ el 2026-09-14 en [[PENDIENTES]] con esa fuente). También mencionaron que tienen un servicio propio aparte de transcripción, pero que la vía BYOK también sirve.

**No confiar en ninguna de las dos fuentes a ciegas — hay que probarlo empíricamente**: mandarle un audio de prueba al agente (por WhatsApp real o donde se pueda) y ver si lo transcribe. Es rápido de confirmar y resuelve la contradicción de una vez.

**Hallazgo operativo nuevo, para agregar al prompt apenas se confirme que transcribe**: la transcripción sale **en portugués**, sin importar el idioma del audio original. Si el cliente venía hablando en español, el agente tiene que **seguir respondiendo en español** aunque la transcripción que recibe esté en portugués — hoy el prompt no tiene esa instrucción explícita. Agregarla es barato y evita un bug de idioma real si el audio termina funcionando.

### 13. DS Voice — ¿el módulo existe? ¿el agente elige el funil por criterio propio?
**Parcialmente respondida, con un hallazgo confirmado.** La captura 3 muestra `Recursos → Criativos`, con una carpeta llamada **"XTR"** — confirma que el módulo SÍ existe en la cuenta (esto ya se había visto de pasada en [[16-auditoria-completa-crm]], nunca se entró a ver el contenido). **Sigue pendiente entrar a la carpeta XTR y ver qué hay adentro** — es un pendiente viejo (de la auditoría del 11/09) que vuelve a ser relevante ahora.

**Recomendación de soporte sobre el alcance del proyecto de audios**: no armar un audio pregrabado para todos los productos — hacerlo solo para los que necesitan mucho detalle. El usuario aclaró su propia idea con precisión: **no** que el agente le pregunte proactivamente al cliente si tiene alguna alergia — sino que **si el cliente pregunta** (ej. por un alérgeno de un producto puntual), el agente tenga ahí un audio detallado preparado para responder eso. Es una función de "respuesta profunda bajo demanda", no un interrogatorio activo del agente.

**No se confirmó explícitamente** si el agente puede elegir el funil por su propio criterio (la sub-pregunta más importante de este bloque) — quedó implícito en que el módulo existe, pero no hay confirmación textual de soporte sobre eso. Repreguntar si se retoma esta idea.

### 14. "Enviar como gravado na hora" / variable "Saudação"
**✅ Parcialmente confirmada por la captura 4**, no por una respuesta textual de soporte. El panel "Novo Item" de Criativos (dentro de la misma sección de Recursos) muestra un editor de mensaje con variables para arrastrar: **"Nome Completo"**, **"Primeiro Nome"**, **"Saudação"** — confirma que la variable `Saudação` (auto-completa "Bom dia"/"Boa tarde"/"Boa noite" según la hora) **sí existe** en rmsystemm, tal como se documentó como pendiente de verificar en [[10-ds-agente-ds-voice-manual]].

No se vio en la captura si existe el toggle "Enviar como gravado na hora" específicamente para audios (esa pantalla mostraba el editor de un Criativo de texto, no de audio) — queda sin confirmar.

### 16. ¿Existen los campos Temperatura, Delay, Máximo de tokens?
**✅ CONFIRMADO CON VALORES REALES — cierra un pendiente viejo (de [[10-ds-agente-ds-voice-manual]] y [[12-caso-real-rafael-prompt-produccion]]).** La captura 6 muestra el panel de configuración (ícono de engranaje junto al selector de Modelo, dentro de "Agente Fit"):

| Campo | Valor actual en Agente Fit |
|---|---|
| Modelo | `gpt-4o-mini` |
| Temperatura | **0,7** |
| Máx. mensajes en historial | **12** |
| Máx. Tokens en respuesta | **600** |
| Retraso para responder mensajes (segundos) | **0** |
| Ignorar mensagens até X segundos após criação da conversa | **0** |

**Esto ya estaba configurado así en la cuenta real, no es una propuesta** — hay que decidir si se ajusta. El prompt v5 (ver [[13-prompt-agente-fit-v1]]) ya no incluye estos valores como texto (se sacó la sección "RESTRICCIONES TÉCNICAS" justamente porque el modelo no las controla, ver [[24-sesion-2026-09-14-traspaso]] §2.4) — son de configuración de plataforma, no de prompt, y ahora se confirma dónde se editan.

**A revisar antes de activar cualquier prueba real**: el **Delay de respuesta está en 0 segundos**. Toda la documentación (ver [[10-ds-agente-ds-voice-manual]], [[12-caso-real-rafael-prompt-produccion]]) insiste en que un delay de al menos 20-30s evita que el agente responda fragmentado cuando el cliente manda varios mensajes seguidos. Con 0s, es probable que se repita el problema de respuestas partidas. **Candidato a ajustar antes de la prueba en columnas vacías.**

### 17. Agendamento de mensagem con fecha deducida por el agente
**✅ Respondida: no es nativo.** Hay que resolverlo por afuera, con **n8n o Make**. El usuario va a pedir una explicación más detallada de soporte en otra instancia, pero de fondo esto **confirma el camino que ya se venía armando con n8n** (ver [[19-investigacion-externa-escalabilidad]]) — no hace falta rediseñar nada, esto se suma como un caso de uso más para el workflow externo.

### 18. Cuando un humano responde manualmente, ¿el agente se calla solo?
**✅ Parcialmente respondida, con la configuración real confirmada por la captura 5.** El mecanismo vive en la pestaña Entrenamiento, como ya se sabía — soporte confirmó que hay opciones separadas para "cuando se le habla desde adentro del CRM" y "cuando se responde por afuera". Estado real hoy en Agente Fit (captura 5):

| Toggle | Estado |
|---|---|
| Responder tickets con asignado | **ON** |
| Dividir respuestas en bloques | **ON** |
| Procesar imágenes | OFF |
| **Desactivar agente al responder fuera de la plataforma** | **ON** |
| Mantener historial de tickets cerrados | OFF |
| Responder reacciones de Instagram | OFF |
| Mantener como no leídos los mensajes respondidos por el agente | OFF |

**⚠️ Revisar antes de la prueba controlada**: "Responder tickets con asignado" está **ON** — hay que confirmar qué significa exactamente (¿el agente responde igual aunque el ticket tenga un responsable humano asignado?). Si es lo que el nombre sugiere, **podría hacer que el agente responda encima de un vendedor humano** en una conversación que ya tiene responsable — el riesgo exacto que preocupaba en la pregunta original. Aclarar esto antes de asignar el agente a ninguna columna con conversaciones reales.

### 19. Follow Up Generativo — ¿qué hereda del agente?
**Parcialmente respondida.** El mecanismo real: se activa cuando el cliente **deja de responder**, revisa los **últimos mensajes** (ej. los últimos 10) y arma un intento de seguimiento en base a eso. **No se confirmó** si respeta los guardrails ni si puede ejecutar acciones (transferir, etc.) — la pregunta original sigue parcialmente abierta en eso.

### 20. Datos de campaña/anuncio de Meta — ¿cómo los lee el agente?
**Respondida de forma indirecta — cambia el enfoque de la pregunta.** Según soporte, **el agente no tiene poder/acceso sobre esos datos**. En cambio, la integración de Meta Ads sirve para lo opuesto: **enviarle señales de conversión a Meta** (para mejorar la puntería de los anuncios), típicamente marcando leads no cualificados.

**Mecanismo concreto, confirmado por la captura 7**: dentro de una automatización de columna, existe un tipo de acción **"Disparar Conversión"**, con campos "Evento de conversión", "Píxeles de destino", "Datos personalizados (JSON)" y variables dinámicas del contacto. El usuario armó un ejemplo en la llamada: crear una columna "Leads Descualificados"; en la columna de entrada, una automatización que — si el lead no responde en cierto tiempo (mandándole antes algún mensaje automatizado dentro de la ventana de 24-72hs) — lo mueve a esa columna Y dispara la conversión hacia Meta marcándolo como descalificado. Si el lead responde en el medio, no se lo manda.

**Conclusión práctica**: la pregunta original (S18, "¿cómo lee el agente el anuncio de origen?") queda respondida como **"no puede, hoy no hay ese acceso"** — pero se descubrió una automatización nueva y valiosa (retroalimentar a Meta con la calidad real de los leads) que no estaba en ningún plan anterior. Ver más abajo, en Pendientes Nuevos.

### 21. (No se llegó a preguntar formalmente — la llamada estaba terminando)
Ver el hallazgo destacado arriba (permisos del Sheet / modo de prueba). Queda pendiente para otra instancia: exportar historial de conversaciones en bloque.

---

## Preguntas del bloque "Hub de Integraciones" (21a-21e) — cubiertas solo parcialmente, al pasar

- **Shopify y HighLevel son integraciones recientes de la plataforma** — soporte ni sabía que Shopify tenía problemas reportados. Conclusión práctica: en estos dos conectores, **estamos bastante solos** — soporte no tiene el conocimiento acumulado todavía. No preguntar "¿por qué falla X?" esperando una respuesta útil; mejor probarlo y reportar lo que se encuentre.
- **21c (Google Sheets: RAG vs. conector, ¿usar los dos?)**: soporte indicó **los dos**, pero avisó que **hay que verificar que funcione en la práctica** — no fue una confirmación sólida, más bien "en teoría sí, pruébenlo".
- **21d (¿los 8 disparadores de Sheets sirven como gatillo de Flujo?)**: soporte **no supo responder**. Sigue siendo un pendiente 100% nuestro (N11 en [[PENDIENTES]]).
- **21a y 21e no se tocaron.**

---

## El tema de "¿pagamos o no pagamos?" — resuelto, no era lo que parecía

No fue un problema de facturación ni un malentendido de trial. La explicación real: **el equipo de soporte configuró toda la cuenta por el usuario y se olvidó de darle el acceso "súper" (de administrador)** al panel — por eso no se veían ciertas cosas (el plan real, el Copiloto, probablemente otras secciones de administración). El usuario **ya pidió que se lo den**. Pendiente: confirmar cuándo lo activan y volver a mirar `Configuración → Mi Plan` / `Financeiro` con ese acceso para ver si cambia lo que se ve.

## Pregunta 23 (costo real en "Uso")
**✅ Respondida: sí, "Uso" muestra el costo real**, según lo que entendió el usuario — ahí se va a poder proyectar el gasto de escalar. La pregunta 22 (si el caché de prompt del 90% es automático) no se llegó a tocar.

---

## Hallazgos nuevos que no eran preguntas (aparecieron en las capturas)

1. **Panel de documentación de la API real y navegable** (`Automatizaciones → API`, captura 1) — pendiente entrarlo a leer entero, puede resolver varias dudas de webhooks salientes sin necesidad de preguntarle a nadie más.
2. **Asignación de agente por conversación** ("Gerenciar Agente" dentro del chat, captura 2) — el mecanismo que habilita el rollout controlado sin tocar el canal real.
3. **Carpeta "XTR" en Recursos → Criativos** (captura 3) — sigue sin abrirse, pendiente viejo que reaparece con más urgencia (es la base para la idea de audios por producto/alergia).
4. **Variables `Saudação`, `Nome Completo`, `Primeiro Nome` confirmadas** en el editor de Criativos (captura 4).
5. **Configuración real de toggles del agente** (captura 5) — ver tabla arriba, con la alerta de "Responder tickets con asignado" en ON.
6. **Valores reales de Temperatura/Delay/Tokens** (captura 6) — ver tabla arriba, con la alerta del Delay en 0s.
7. **Acción "Disparar Conversión" hacia Meta Ads** (captura 7) — abre una automatización nueva de retroalimentación de calidad de leads.

## Pendientes nuevos que abrió esta reunión

| # | Qué | Prioridad |
|---|---|---|
| **P1** | **Revisar permisos para compartir del Google Sheet `CATALOGO AGENTE FIT`** — si está en modo privado, puede ser la causa real de que el agente nunca haya consultado el catálogo. Probar antes de asumir que es 100% un bug de plataforma. | 🔴 Máxima — hacer primero |
| P2 | Probar empíricamente si el agente transcribe audio hoy (contradice "Mi Plan"). Si transcribe: agregar al prompt la regla de responder en el idioma del cliente aunque la transcripción venga en portugués. | 🟠 |
| P3 | Bajar el Delay de respuesta de 0s a 20-30s antes de la prueba en columnas vacías (todos los ejemplos documentados coinciden en que 0s fragmenta las respuestas). | 🟠 |
| P4 | Confirmar qué hace exactamente "Responder tickets con asignado" (está ON) antes de asignar el agente a ninguna conversación con responsable humano. | 🟠 |
| P5 | Entrar a `Automatizaciones → API` y leer el panel de documentación completo. | 🟢 |
| P6 | Entrar a la carpeta "XTR" en `Recursos → Criativos`. | 🟢 |
| P7 | Diseñar la automatización "Leads Descualificados → Disparar Conversión a Meta" (columna nueva + automatización con ventana de tiempo, ver ejemplo de soporte en la respuesta 20). | 🟢 |
| P8 | Confirmar cuándo dan el acceso "súper"/administrador que el usuario pidió. | 🟡 externo |
| P9 | Repreguntar en otra instancia: precio del Copiloto, si el Follow Up Generativo respeta guardrails, si "Enviar como gravado na hora" existe, exportar conversaciones en bloque, caché de prompt 90%, gatillos de Sheets como disparador de Flujo. | 🟡 |

## El plan de testing que sigue (una vez resuelto P1, idealmente también P3/P4)
Usar el mecanismo de la respuesta 4 (asignación de agente por conversación) para poner al Agente Fit a atender **solo** en las columnas vacías de `FV| FUNIL DE VENTAS` que ya existen — sin vincular el canal real, sin riesgo de contestarle a un cliente de verdad. Esto es lo que destraba N12 (poder validar el agente con herramientas reales) sin esperar a que rmsystemm arregle la pestaña Prueba.
