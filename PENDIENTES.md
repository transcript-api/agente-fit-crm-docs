# PENDIENTES — registro único de todo lo que está sin resolver

**Este archivo es la fuente de verdad de "qué falta".** Si algo está pendiente y no está acá, el sistema falló.

Nació el 2026-09-13 después de un error real: se armó el documento de preguntas para la reunión con soporte del CRM **olvidando el Copiloto de IA**, que estaba documentado hace días en [[09-copiloto-ia-partner]] con la frase literal "habría que preguntarles si/cuándo planean habilitarlo". El pendiente existía, estaba escrito, y aun así se pasó por alto — porque el trabajo se armó desde lo que estaba fresco en la conversación en vez de barrer lo documentado.

## Cómo se mantiene (leer antes de usarlo)
1. **Marcador único**: todo pendiente, en cualquier archivo del vault, se escribe con el prefijo `**PENDIENTE:**` al inicio de la línea. Eso lo hace recuperable con un solo grep:
   `grep -rn "\*\*PENDIENTE:" *.md`
2. **Doble registro**: el detalle vive en el archivo temático (ej. el Copiloto en el 09); acá va solo la fila del índice apuntando ahí. No duplicar contenido — se desincroniza.
3. **Cada fila dice quién lo desbloquea.** Sin eso, la lista se vuelve un cementerio de buenas intenciones.
4. **Al resolver algo**: marcarlo acá (✅ + fecha) Y en el archivo de origen. No borrar la fila — sirve saber que se cerró y cuándo.
5. **Revisión obligatoria**: antes de armar cualquier entregable que consolide estado (preparar una reunión, un plan, una priorización, un resumen de sesión), leer este archivo completo. Está escrito como regla en `CLAUDE.md`.

---

## 🔴 Bloqueado por: BLING (rompe cosas que ya construimos)

| # | Pendiente | Detalle en | Estado |
|---|---|---|---|
| B1 | Pegar los `access_token`/`refresh_token` nuevos en el contacto "Sistema - Bling Token" — sin esto, el flujo de renovación y el de alerta de stock fallan en silencio | [[18-integracion-bling]] | 🔴 Abierto — tokens en `window.__blingTokens2` del navegador (se pierden si se cierra la pestaña) |
| B2 | `GET /produtos` y `/contatos` ignoran TODOS los parámetros (`nome`, `pagina`, `limite`…) — la alerta de stock solo cubre 100 de ~1094 productos | [[18-integracion-bling]] | 🔴 Abierto — causa desconocida |
| B3 | Factura "Setembro/2026" impaga — hipótesis (no confirmada) de que causa B2, y riesgo de perder acceso a toda la cuenta | [[18-integracion-bling]] | 🔴 Abierto — depende del equipo/administración |
| B4 | Decidir si se borra la app vieja de Bling (id 398769, cuenta de Facundo) o se deja abandonada | [[18-integracion-bling]] | 🟡 Menor |

## 🟠 Bloqueado por: SOPORTE DEL CRM (reunión agendada)

| # | Pendiente | Detalle en | Estado |
|---|---|---|---|
| ~~S1~~ | ~~¿Las variables de "Salvar Variável" persisten por contacto o mueren al cerrar el ticket?~~ → **✅ 2026-09-14, respondida en la reunión: SÍ, persisten para siempre.** El modo Recompra es viable tal como está diseñado | [[26-respuestas-reunion-soporte-2026-09-14]] #1 | ✅ Cerrada |
| S2 | **Guardrails no persisten — bug del BACKEND, sin workaround posible.** Reproducido 4 veces (2 el 11/09, 2 el 14/09). Prueba concluyente: en el mismo guardado el nombre del agente sí persistió y el guardrail no → el servidor acepta el POST y descarta el guardrail. **2026-09-14: se le mostró la evidencia a soporte en vivo, dijeron que iban a verificar — sin causa ni plazo confirmado todavía.** Es el único mecanismo que impediría que el agente invente precios | [[26-respuestas-reunion-soporte-2026-09-14]] #2 | 🔴 Sigue abierto — reconocido por soporte, sin fix confirmado |
| S3 | ¿Existe API de rmsystemm? ¿Webhooks salientes? — base de toda la integración con n8n | [[26-respuestas-reunion-soporte-2026-09-14]] #3 | 🟠 **Parcial**: sí existe y es navegable (`Automatizaciones → API`, panel real con Webhooks de Leads y Webhooks). Falta leerlo entero (P5) |
| S4 | **Copiloto de IA**: disponibilidad, costo, y si obliga a migrar de BYOK a "IA Gerenciada" | [[26-respuestas-reunion-soporte-2026-09-14]] #5-7 | 🟠 **Parcial**: en desarrollo, no liberado salvo cuentas con "función súper" (no la tenemos). Precio: no lo dieron. Videos explicativos en unos días |
| ~~S5~~ | ~~¿El CRM captura de qué anuncio vino el lead?~~ → reemplazada por S18 el 14/09 | [[04-patrones-reales-de-venta]] | ✅ Ver S18 |
| ~~S6~~ | ~~Rollout controlado: al vincular el canal de WhatsApp, ¿responde a todos de una?~~ → **✅ 2026-09-14: NO hace falta vincular el canal para probar.** Existe asignación de agente **por conversación** ("Gerenciar Agente" dentro del chat) — se puede probar en columnas vacías sin tocar el canal real | [[26-respuestas-reunion-soporte-2026-09-14]] #4 | ✅ Cerrada — habilita el plan de testing |
| S7 | Comportamiento de las bases de conocimiento (¿elige cuál consultar? ¿cada cuánto sincroniza Sheets? ¿HTTP con parámetros?) | [[26-respuestas-reunion-soporte-2026-09-14]] #8-10 | 🟠 **Parcial**: busca en TODAS (no elige) → soporte recomienda un agente por función a futuro. Sheets actualiza en el momento (✅). HTTP: sin aclarar, el agente inventa si falla |
| S8 | ¿El agente transcribe notas de voz entrantes? | [[26-respuestas-reunion-soporte-2026-09-14]] #12 | 🔴 **CONTRADICCIÓN a resolver**: soporte dice que con BYOK ya transcribe solo; "Mi Plan" dice que es addon no incluido. Probar empíricamente (P2) antes de confiar en cualquiera de las dos fuentes |
| S9 | DS Voice: ¿existe el módulo en nuestra cuenta y el agente elige el audio por criterio propio? | [[26-respuestas-reunion-soporte-2026-09-14]] #13 | 🟠 **Parcial**: el módulo existe (carpeta "XTR" en Recursos→Criativos, sin abrir todavía). No se confirmó si el agente elige el funil por criterio propio |
| ~~S10~~ | ~~"Agendamento de mensagem": ¿la fecha puede salir del razonamiento del agente?~~ → **✅ 2026-09-14: no es nativo, se resuelve por afuera con n8n o Make** — confirma el camino que ya se venía armando | [[26-respuestas-reunion-soporte-2026-09-14]] #17 | ✅ Cerrada |
| S11 | Follow Up Generativo: ¿usa el mismo prompt? — define el diseño de Recompra | [[26-respuestas-reunion-soporte-2026-09-14]] #19 | 🟠 **Parcial**: se activa cuando el cliente deja de responder, revisa los últimos ~10 mensajes y arma un seguimiento. No se confirmó si respeta guardrails ni si puede ejecutar acciones |
| S12 | Export masivo de conversaciones (para revisar y mejorar el prompt con casos reales) | [[21-preguntas-para-soporte-rmsystemm]] #16 | 🟡 No se llegó a preguntar (la llamada terminó antes) |
| S13 | Costos y límites: caché de prompt, pestaña "Uso", conversaciones simultáneas | [[26-respuestas-reunion-soporte-2026-09-14]] Q23 | 🟠 **Parcial**: "Uso" sí muestra costo real (✅). Caché de prompt 90%, conversaciones simultáneas: no se tocaron |
| S14 | El filtro "Agente IA" del Hub excluye Google Sheets, pero el selector "Agregar conector" del agente sí lo ofrece. ¿Cuál manda? | [[23-conectores-hub-integraciones]] §6a | 🟡 No se llegó a preguntar |
| S15 | ¿Qué significa la etiqueta `AUTOMATIZACIÓN` en las acciones? Solo 12 de 226 la llevan (Google Sheets y Gmail). Hipótesis: usables como nodo en Flujos | [[23-conectores-hub-integraciones]] §6b | 🟡 No se llegó a preguntar (aunque el hallazgo del nodo "Apps" el 14/09 ya lo responde solo — ver [[24-sesion-2026-09-14-traspaso]] §1.6b) |
| ~~S16~~ | ~~Citar textual "OpenAI Key" (Copiloto) y preguntar por qué no coincide con BYOK~~ → **✅ 2026-09-14: aclarado (parcialmente) — es otra cosa, BYOK solo sirve para el agente, no habilita el Copiloto**, la descripción del conector parece estar mal redactada | [[26-respuestas-reunion-soporte-2026-09-14]] #6 | ✅ Cerrada (repreguntar con más tiempo si el Copiloto se vuelve prioridad) |
| S17 | Shopify: ¿qué sincroniza exactamente y los eventos de tienda ("nuevo pedido", "carrito abandonado") aparecen como gatillo en Flujos? | [[26-respuestas-reunion-soporte-2026-09-14]] | 🟡 **Sin resolver**: Shopify es una integración reciente de la plataforma, soporte ni sabía que tenía problemas reportados — estamos solos en esto, no vale la pena repreguntar, hay que probarlo directamente |
| S18 | El CRM **sí** captura campaña/conjunto/anuncio (confirmado solos). ¿Cómo lee el agente ese dato? | [[26-respuestas-reunion-soporte-2026-09-14]] #20 | ✅ **2026-09-14, respondida indirectamente: el agente NO tiene acceso a ese dato hoy.** En cambio Meta Ads sirve para mandar señales de conversión HACIA Meta (acción "Disparar Conversión") — abrió el pendiente nuevo P7 |
| S19 | **¿La pestaña "Prueba" ejecuta conectores y consulta el conocimiento, o solo prueba el prompt?** Y ¿por qué "Uso" queda en 0 tokens tras 7 respuestas? | [[26-respuestas-reunion-soporte-2026-09-14]] #21 | 🟠 **La causa más probable ya se corrigió (P1: el Sheet estaba privado, 2026-09-14)** — falta volver a probar con el catálogo ya accesible antes de saber si sigue habiendo un problema real de la pestaña Prueba o si esto lo resolvía todo |

## 🟡 Bloqueado por: EL EQUIPO / DATOS QUE NO TENEMOS

| # | Pendiente | Detalle en | Estado |
|---|---|---|---|
| E1 | Export CSV de productos de Shopify (nombre, descripción, precio, link) | [[20-catalogo-estructura-para-el-agente]] | 🟡 Pedido al usuario |
| E2 | Export de "Sales by product" de Shopify → llenar `ranking_ventas` (más vendidos) | [[20-catalogo-estructura-para-el-agente]] | 🟡 Pedido al usuario |
| E3 | Confirmar si el stock que muestra Shopify se actualiza de verdad (viene sincronizado de Bling, hereda sus problemas) | [[20-catalogo-estructura-para-el-agente]] | 🟡 El usuario lo habla con el equipo |
| E4 | Grabar los audios del call center por producto/situación | [[07-estrategias-pendientes-agente]] | 🟡 Sin empezar |
| E5 | Promos vigentes del mes para completar el placeholder `{{promos_vigentes}}` del prompt | [[13-prompt-agente-fit-v1]] | 🟡 Sin empezar — el prompt tiene el placeholder sin llenar |
| E6 | Mapeo producto/interés → cupón correspondiente | [[07-estrategias-pendientes-agente]] | 🟡 Sin definir |
| E7 | Base de anuncios activos (copy + producto + promo) para que el agente reconozca de dónde vino el lead | [[04-patrones-reales-de-venta]] | 🟡 Sin empezar |
| E9 | **El ranking de "más vendidos" de Shopify NO es oficial** — corrección del usuario, 2026-09-15: por Shopify prácticamente no venden, y hay productos cargados ahí que no corresponden al catálogo real. O sea que los 205 "ordenados por ventas reales" **no se pueden presentar como dato de ventas**. El orden real hay que sacarlo de **Bling**, que es donde está la venta de verdad. Hasta entonces el catálogo sirve para precio/link/categoría, no para recomendar "lo que más sale" | [[20-catalogo-estructura-para-el-agente]] | 🟡 Depende de organizar Bling |
| E8 | **Ticket promedio y margen por venta.** Sin estos dos números las "~200 ventas más por mes" de la presentación no se pueden convertir en plata — que es el número que cierra la reunión con la gerencia | [[27-reglas-diseno-presentaciones]], lámina "Impacto" | 🟡 Pedido al usuario, va en la reunión |

## 🟢 Depende solo de nosotros

| # | Pendiente | Detalle en | Estado |
|---|---|---|---|
| N1 | **Nunca se validó que el agente responda.** La pestaña "Prueba" jamás se corrió con éxito | [[01-agente-de-ia]] | 🟢 Se puede hacer ya (la Clave API ya está resuelta) |
| N2 | Autenticar el MCP de n8n (`/mcp` en una sesión nueva) | [[19-investigacion-externa-escalabilidad]] | 🟢 Pendiente de reiniciar Claude Code |
| N3 | Completar los prototipos de n8n con un token real y probarlos | [[19-investigacion-externa-escalabilidad]] | 🟢 Depende de B1 |
| N4 | Diseñar la detección temprana en Remarketing (cliente frío vs. ya listo para comprar) | [[07-estrategias-pendientes-agente]] | 🟢 Sin empezar |
| N5 | Definir el destino "Venta Sin Cerrar" (rechazo activo ≠ no respondió) | [[07-estrategias-pendientes-agente]], [[08-funil-remarketing-nuevo]] | 🟢 Sin definir |
| N6 | Limpiar: contacto "TEST Sistema Bling Token", flujo "Novo Fluxo", y decidir sobre "FV\|Consultar Producto Bling" (activo pero inofensivo, disparo manual) | [[17-registro-de-cambios]] | 🟢 Menor |
| N7 | Guardrails para las otras promesas del prompt (tag, variável, columna) | [[01-agente-de-ia]] | 🟢 Bloqueado de hecho por S2 (no persisten) |
| N8 | **Conectar Shopify en el Hub de Integraciones** y verificar qué sincroniza de verdad (productos, pedidos, eventos de tienda). Es la acción de mayor impacto de todo el Hub | [[23-conectores-hub-integraciones]] §4.1 | 🟢 Se puede hacer ya |
| N9 | Adjuntar Google Sheets al agente (`Herramientas → Conectores`) + línea en el prompt de cuándo consultarlo (búsqueda exacta para precio/link) | [[23-conectores-hub-integraciones]] §4.2 | 🟢 Depende de que exista la planilla (E1/E2) |
| N10 | Vincular la cuenta de Google en `Agente de IA → Herramientas → Agendamientos` — hoy dice "Nenhuma conta Google vinculada", es una vinculación distinta de la del Hub | [[23-conectores-hub-integraciones]] §4.4 | 🟢 Se puede hacer ya |
| N11 | Verificar si los 8 disparadores de Google Sheets aparecen como gatillo en Flujos de Automatización — de eso depende que sirvan | [[23-conectores-hub-integraciones]] §4.2 | 🟢 Se puede hacer ya |
| N12 | **Confirmar en una conversación REAL que el agente da el precio correcto** | [[24-sesion-2026-09-14-traspaso]] §1.1 | ✅ 2026-09-15 — **cerrado por el usuario**: lo probó desde su propio número y el agente responde consultando el catálogo. Causa original: la planilla de Google no era pública. Nota: la verificación la hizo él, no esta sesión — no hay captura en el repo |
| N13 | **Unificar nombres**: el prompt dice `FV\|CUALIFICACION` pero la columna es `FV \| CUALIFICACION` (con espacios), y las etiquetas de remarketing son `FVR \|`. Si el match es exacto, el agente falla en silencio | [[24-sesion-2026-09-14-traspaso]] §3 | 🟠 Abierto |
| N14 | Capturar a ojo el catálogo completo de disparadores/acciones/excepciones del constructor de automatizaciones (el DOM no lo expone) | [[24-sesion-2026-09-14-traspaso]] §3 | 🟢 2 minutos a mano |
| N15 | Ponerle la columna destino a la automatización **"Enviar a Remarketing" (ID 55317)** de `FV \| DERIVAR A REMARKETING`. *(Corrección: la de CUALIFICACION estaba bien, la marqué mal por un error de lectura)*. **Ojo: las 7 automatizaciones de FV\| están Inactivas** — cuando se decida encender el funnel, activarlas una por una | [[24-sesion-2026-09-14-traspaso]] §3 | 🟡 No urgente: está inactiva |
| N16 | Decidir si se paga n8n: **el trial vence en 14 días** (desde 2026-09-14) | [[24-sesion-2026-09-14-traspaso]] §2.6 | 🟠 Decisión del usuario |
| N17 | **Reintentar los guardrails con el workaround** de "hacer otro cambio en paralelo" — puede que ahora sí persistan. Es rápido y sería el arreglo más valioso | [[24-sesion-2026-09-14-traspaso]] §1.4 | 🟢 Se puede hacer ya |
| N18 | Decidir cada cuánto se regenera el catálogo (el script ya existe: `artefactos/build-catalogo.ps1`) y si se automatiza con n8n | [[25-estado-y-que-sigue]] | 🟢 Sin empezar |
| N19 | Revisar los 31 productos en categoría `otros` y los 136 sin marca detectada | [[25-estado-y-que-sigue]] | 🟢 Menor |
| N20 | **Publicar la presentación** | [[27-reglas-diseno-presentaciones]] | ✅ 2026-09-15 — publicada (versión 7). El bloqueo del clasificador (`Live-Shared Artifact Sensitive Delta`) **era la captura real del CRM**: sacándola, el publish pasó a la primera. Confirmado, no era hipótesis |
| N21 | **La versión "pinneada" del canvas**: quien entra por el link ve una versión vieja congelada, no la última. Se saca desde el menú de compartir del artifact — no lo puedo hacer yo. Mientras siga pinneada, publicar encima no cambia lo que ve el que recibe el link | [[27-reglas-diseno-presentaciones]] | 🟠 Lo destraba el usuario |
| ~~P1~~ | ~~Revisar permisos para compartir del Google Sheet `CATALOGO AGENTE FIT`~~ → **✅ 2026-09-14: CONFIRMADO Y CORREGIDO.** El Sheet estaba en "Restringido" (privado, solo el dueño `max.suplementos77@gmail.com` tenía acceso) — cambiado a "Cualquier persona con el enlace". Verificado antes/después con captura. Esto era casi seguro la causa real de por qué el agente nunca pudo leer el catálogo | [[26-respuestas-reunion-soporte-2026-09-14]] | ✅ Cerrada — hallazgo confirmado y corregido |
| P2 | Agregada al prompt (v6) la regla de responder en el idioma del cliente aunque la transcripción venga en portugués. **Pero sigue sin confirmarse empíricamente que el agente transcriba audio de verdad** (contradice "Mi Plan" vs. lo que dijo soporte) — falta mandarle un audio real de prueba | [[26-respuestas-reunion-soporte-2026-09-14]] #12, [[13-prompt-agente-fit-v1]] v6 | 🟠 Instrucción lista, falta el test empírico |
| ~~P3~~ | ~~Bajar el Delay de respuesta de 0s a 20-30s~~ → **✅ 2026-09-14: ajustado a 25s.** De paso también se subió Máx. mensajes en historial (12→30) y se bajó Máx. Tokens en respuesta (600→200), alineado con lo que recomiendan los archivos de los videos. Verificado guardado tras recargar | [[13-prompt-agente-fit-v1]] v6 | ✅ Cerrada |
| P4 | Confirmar qué hace exactamente el toggle "Responder tickets con asignado" (está ON) antes de asignar el agente a ninguna conversación con responsable humano — riesgo de doble respuesta | [[26-respuestas-reunion-soporte-2026-09-14]] #18 | 🟠 |
| P5 | Entrar a `Automatizaciones → API` y leer el panel de documentación completo (puede resolver S3 por completo) | [[26-respuestas-reunion-soporte-2026-09-14]] #3 | 🟢 |
| P6 | Entrar a la carpeta "XTR" en `Recursos → Criativos` | [[26-respuestas-reunion-soporte-2026-09-14]] #13 | 🟢 |
| P7 | Diseñar la automatización "Leads Descualificados → Disparar Conversión a Meta" (columna nueva + automatización con ventana de tiempo) | [[26-respuestas-reunion-soporte-2026-09-14]] #20 | 🟢 Oportunidad nueva |
| P8 | Confirmar cuándo dan el acceso "súper"/administrador que el usuario ya pidió | [[26-respuestas-reunion-soporte-2026-09-14]] | 🟡 Depende de soporte |
| **P10** | **Plan de testing destrabado**: usar "Gerenciar Agente" (por conversación) para asignar el Agente Fit solo a las columnas vacías de `FV\| FUNIL DE VENTAS`, sin vincular el canal real — prueba real sin riesgo | [[26-respuestas-reunion-soporte-2026-09-14]] | 🟢 Listo para ejecutar (después de P1, P3, P4) |
| Q1 | **Conectar el recurso "Métodos de pago"** (Recursos → Criativos → Mensagens) al prompt de Agente Fit - Cierre (id 9884): arrastrar el chip "Enviar funil de Criativos" al final del prompt y elegir ese mensaje. No se pudo automatizar (mismo problema de `z-index:-1` del editor Slate en el chip de origen) | [[17-registro-de-cambios]] 2026-09-15 (noche) | 🟢 2 minutos a mano |
| Q2 | **Decidir qué hacer con la planilla curada nueva** (`catalogo-agente-curado`, id `149V0iBVQ7Dn0I_WLW3G14s6DLacXrDYvwXQbwhudRAM` — reemplazó a un id anterior que quedó huérfano, ver nota abajo — 11 productos con descripciones reales, no genéricas): ¿se cambia el ID en el prompt de Conversión/Cierre reemplazando la planilla de 422 productos, se corre en paralelo, o se espera a cargar más productos? Hoy ningún agente la usa todavía | [[17-registro-de-cambios]] 2026-09-15 (noche) | 🟡 Decisión del usuario |
| Q3 | Renombrar la pestaña interna de `catalogo-agente-curado` (quedó "Untitled" por el mismo problema de clicks del editor) antes de configurar el conector — el prompt necesita el nombre real de la hoja | [[17-registro-de-cambios]] 2026-09-15 (noche) | 🟢 2 minutos a mano |
| Q4 | **Borrar el Google Sheet huérfano** id `17ShWFe5UVOEFmaY9JQNOC0H4fsrFChXfDe0t51mHbhk` (primera versión de `catalogo-agente-curado`, con solo 7 filas) — quedó reemplazado por el id nuevo de 11 filas, pero no se pudo papelerizar por permiso del clasificador. Sigue existiendo en Drive, inofensivo pero desprolijo | [[17-registro-de-cambios]] 2026-09-15 (noche) | 🟢 Papelera manual, 10 segundos |
| Q5 | **Completar los 3 precios pendientes** en `catalogo-agente-curado`: Hyper Whey 100% 900g (Dulce de Leche), Hyper Isolate Whey 900g Zero Lactose (Frutilla) y Hyper Creatine+ 300g Frutas Rojas (Decadrive) quedaron con `precio_uyu = PENDIENTE` — el usuario dijo que manda los valores reales después | [[17-registro-de-cambios]] 2026-09-15 (noche) | 🟡 Esperando al usuario |

---

## ✅ Cerrados (se dejan para saber que se resolvieron)

| # | Pendiente | Cerrado |
|---|---|---|
| — | Clave API del agente rota (`usersanti001`) | ✅ 2026-09-13 — clave real de OpenAI cargada |
| — | Regla de escalamiento cuando el agente no sabe la respuesta | ✅ 2026-09-13 — agregada al prompt y verificada guardada |
| — | Los 3 niveles de temperatura en Remarketing reflejados en el prompt | ✅ ya estaba hecho en el prompt v3 (Etapa 4) — el pendiente en [[07-estrategias-pendientes-agente]] quedó mal marcado como abierto |
| — | Confirmar que "Criar contato" no duplica contactos | ✅ 2026-09-13 — probado 4 veces, hace find-or-create |
| — | Construir el flujo de renovación de token de Bling | ✅ 2026-09-13 — construido y activo (aunque su primera corrida falló, ver B1) |
| E1 | Export CSV de productos de Shopify | ✅ 2026-09-14 — **resuelto solos**: `fitnessuplementos.com/products.json` es público. 422 productos, sin pedirle nada a nadie |
| E2 | Ranking de más vendidos | ✅ 2026-09-14 — **resuelto solos**: `collections/all?sort_by=best-selling` da el orden real. 205 productos rankeados |
| N1 | Nunca se validó que el agente responda | ✅ 2026-09-14 — **responde**. Pero destapó que inventa precios y que la pestaña Prueba no ejecuta herramientas (N12) |
| S8 | ¿El agente transcribe notas de voz? | ✅ 2026-09-14 — Mi Plan: *"Transcrição de áudios: não incluída"*. Es un addon no contratado. Queda preguntar solo el precio |
| S4 (parcial) | ¿El Copiloto está disponible? | ✅ 2026-09-14 — Mi Plan: *"Copiloto IA: não incluído"*. Es addon. Queda preguntar precio y si obliga a salir de BYOK |
| S5 | ¿El CRM captura de qué anuncio vino el lead? | ✅ 2026-09-14 — **sí**, campaña/conjunto/anuncio en cada tarjeta. Reemplazado por S18 (cómo leerlo desde el agente) |
| — | "Exceção: Troca de Mensagens" (pendiente desde [[10-ds-agente-ds-voice-manual]]) | ✅ 2026-09-14 — existe y está en uso en 5 automatizaciones FV\| con ventana de 2 h |
| N6 (corregido) | Borrar el flujo "Novo Fluxo" | ❌ **NO BORRAR** — 2026-09-14: está EN PRODUCCIÓN, dispara por "Mensaje Recibido" y manda el menú 1/2/3 a leads reales. El pendiente estaba mal |
