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
| S1 | ¿Las variables de "Salvar Variável" persisten por contacto o mueren al cerrar el ticket? — **de esto depende todo el modo Recompra** | [[21-preguntas-para-soporte-rmsystemm]] #1 | 🟠 A preguntar |
| S2 | **Guardrails no persisten — bug del BACKEND, sin workaround posible.** Reproducido 4 veces (2 el 11/09, 2 el 14/09). Prueba concluyente: en el mismo guardado el nombre del agente sí persistió y el guardrail no → el servidor acepta el POST y descarta el guardrail. Es el único mecanismo que impediría que el agente invente precios | [[24-sesion-2026-09-14-traspaso]] §1.4 | 🔴 **2ª más importante de la reunión** |
| S3 | ¿Existe API de rmsystemm? ¿Webhooks salientes? — base de toda la integración con n8n | [[21-preguntas-para-soporte-rmsystemm]] #3 | 🟠 A preguntar |
| S4 | **Copiloto de IA**: disponibilidad, costo, y si obliga a migrar de BYOK a "IA Gerenciada" | [[09-copiloto-ia-partner]] | 🟠 A preguntar |
| S5 | ¿El CRM captura de qué anuncio vino el lead? + Meta Ads figura "Reconexión necesaria" | [[04-patrones-reales-de-venta]] | 🟠 A preguntar |
| S6 | Rollout controlado: al vincular el canal de WhatsApp, ¿responde a todos de una? | [[21-preguntas-para-soporte-rmsystemm]] #6 | 🟠 A preguntar |
| S7 | Comportamiento de las bases de conocimiento (¿elige cuál consultar? ¿cada cuánto sincroniza Sheets? ¿HTTP con parámetros?) | [[20-catalogo-estructura-para-el-agente]] | 🟠 A preguntar |
| S8 | ¿El agente transcribe notas de voz entrantes? | [[19-investigacion-externa-escalabilidad]] | 🟠 A preguntar |
| S9 | DS Voice: ¿existe el módulo en nuestra cuenta y el agente elige el audio por criterio propio? | [[07-estrategias-pendientes-agente]] | 🟠 A preguntar (pendiente desde 2026-09-11) |
| S10 | "Agendamento de mensagem": ¿la fecha puede salir del razonamiento del agente? | [[07-estrategias-pendientes-agente]] | 🟠 A preguntar (pendiente desde 2026-09-10) |
| S11 | Follow Up Generativo: ¿usa el mismo prompt? — define el diseño de Recompra | [[14-funil-recompra]] | 🟠 A preguntar |
| S12 | Export masivo de conversaciones (para revisar y mejorar el prompt con casos reales) | [[21-preguntas-para-soporte-rmsystemm]] #16 | 🟠 A preguntar |
| S13 | Costos y límites: caché de prompt, pestaña "Uso", conversaciones simultáneas | [[21-preguntas-para-soporte-rmsystemm]] #17-20 | 🟠 A preguntar |
| S14 | El filtro "Agente IA" del Hub excluye Google Sheets, pero el selector "Agregar conector" del agente sí lo ofrece. ¿Cuál manda? | [[23-conectores-hub-integraciones]] §6a | 🟠 A preguntar |
| S15 | ¿Qué significa la etiqueta `AUTOMATIZACIÓN` en las acciones? Solo 12 de 226 la llevan (Google Sheets y Gmail). Hipótesis: usables como nodo en Flujos | [[23-conectores-hub-integraciones]] §6b | 🟠 A preguntar |
| S16 | Citar textual la descripción de "OpenAI Key" (dice que la clave propia sirve para **el Copiloto**) y preguntar por qué no coincide con lo observado en modo BYOK | [[23-conectores-hub-integraciones]] §4.3, [[09-copiloto-ia-partner]] | 🟠 A preguntar (refuerza S4) |
| S17 | Shopify: ¿qué sincroniza exactamente y los eventos de tienda ("nuevo pedido", "carrito abandonado") aparecen como gatillo en Flujos? | [[23-conectores-hub-integraciones]] §4.1 | 🟠 A preguntar |
| S18 | El CRM **sí** captura campaña/conjunto/anuncio (confirmado solos). Falta: **¿cómo lee el agente ese dato?** No aparece en la ficha del negocio | [[24-sesion-2026-09-14-traspaso]] §1.5 | 🟠 A preguntar (reemplaza a S5) |
| S19 | **¿La pestaña "Prueba" ejecuta conectores y consulta el conocimiento, o solo prueba el prompt?** Y ¿por qué "Uso" queda en 0 tokens tras 7 respuestas? | [[24-sesion-2026-09-14-traspaso]] §1.2 | 🔴 **La más importante de la reunión** |

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
| N12 | **Confirmar en una conversación REAL que el agente da el precio correcto** (990, no 1.200). ✅ 2026-09-15: se encontró la causa de que inventara — la planilla de Google **no era pública** y el CRM no podía leerla; ya corregido. Y quedó confirmado que **la pestaña "Prueba" no ejecuta conectores ni RAG**, así que la validación va por conversación real | [[24-sesion-2026-09-14-traspaso]] §1.1 | 🟡 Causa resuelta — falta la verificación final |
| N13 | **Unificar nombres**: el prompt dice `FV\|CUALIFICACION` pero la columna es `FV \| CUALIFICACION` (con espacios), y las etiquetas de remarketing son `FVR \|`. Si el match es exacto, el agente falla en silencio | [[24-sesion-2026-09-14-traspaso]] §3 | 🟠 Abierto |
| N14 | Capturar a ojo el catálogo completo de disparadores/acciones/excepciones del constructor de automatizaciones (el DOM no lo expone) | [[24-sesion-2026-09-14-traspaso]] §3 | 🟢 2 minutos a mano |
| N15 | Ponerle la columna destino a la automatización **"Enviar a Remarketing" (ID 55317)** de `FV \| DERIVAR A REMARKETING`. *(Corrección: la de CUALIFICACION estaba bien, la marqué mal por un error de lectura)*. **Ojo: las 7 automatizaciones de FV\| están Inactivas** — cuando se decida encender el funnel, activarlas una por una | [[24-sesion-2026-09-14-traspaso]] §3 | 🟡 No urgente: está inactiva |
| N16 | Decidir si se paga n8n: **el trial vence en 14 días** (desde 2026-09-14) | [[24-sesion-2026-09-14-traspaso]] §2.6 | 🟠 Decisión del usuario |
| N17 | **Reintentar los guardrails con el workaround** de "hacer otro cambio en paralelo" — puede que ahora sí persistan. Es rápido y sería el arreglo más valioso | [[24-sesion-2026-09-14-traspaso]] §1.4 | 🟢 Se puede hacer ya |
| N18 | Decidir cada cuánto se regenera el catálogo (el script ya existe: `artefactos/build-catalogo.ps1`) y si se automatiza con n8n | [[25-estado-y-que-sigue]] | 🟢 Sin empezar |
| N19 | Revisar los 31 productos en categoría `otros` y los 136 sin marca detectada | [[25-estado-y-que-sigue]] | 🟢 Menor |

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
