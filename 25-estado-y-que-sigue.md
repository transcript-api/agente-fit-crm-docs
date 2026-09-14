# Estado real y qué sigue — actualizado 2026-09-14

**Para qué es este archivo:** si alguien pregunta *"¿qué hay que hacer?"*, se responde desde acá. Todo está clasificado en cuatro cajones: **probado y funciona**, **probado y NO funciona**, **construido pero sin probar**, y **bloqueado (y por quién)**.

Regla: nada entra acá como "funciona" sin que se haya verificado. Si dice "sin probar", es porque literalmente no se probó.

---

## ✅ Probado y funciona

| Qué | Cómo se verificó |
|---|---|
| El agente responde | 7 mensajes en la pestaña Prueba, respondió los 7 |
| El prompt v5 se guarda y persiste | Recarga completa: 14.461 chars, con los 4 bloques nuevos |
| El conector de Google Sheets queda adjunto | Recarga completa: sigue con las 6 herramientas |
| La fuente de conocimiento (RAG) se guarda **con el workaround** | Recarga completa: la URL sigue ahí |
| Similaridad RAG en 0.35 | Recarga completa |
| El catálogo de Shopify se puede bajar sin permisos | 422 productos vía `products.json`, 205 rankeados vía `sort_by=best-selling` |
| El CRM captura campaña/conjunto/anuncio de cada lead | Visto en el pipeline real, contenedor `campaignTagsContainer` |
| El CRM acepta leads por HTTP POST | El propio CRM documenta el formato (ver [[24-sesion-2026-09-14-traspaso]] §2.5) |
| Existe "Exceção: Troca de Mensagens" | En uso real en 5 automatizaciones FV\| |
| El Copiloto y la transcripción de audios son addons no contratados | `Configuración → Mi Plan`, textual |

---

## ❌ Probado y NO funciona (o funciona mal)

| Problema | Evidencia | Gravedad |
|---|---|---|
| ~~**El agente inventa precios**~~ | 3 de 3 preguntas respondidas con datos falsos y tono seguro. **CAUSA ENCONTRADA (2026-09-15): la planilla de Google no era pública**, así que el CRM no podía leerla. Corregido por el usuario | 🟡 Causa resuelta — **falta confirmar en conversación real que ahora da el precio correcto** |
| **La pestaña "Prueba" no ejecuta herramientas ni RAG** | Nunca llamó al conector ni con pedido explícito; "Uso" quedó en 0 tokens tras 7 respuestas. **CONFIRMADO por el usuario el 2026-09-15: "en el modo test no agarra"** | 🟠 Ya no es incógnita: es así. **La validación se hace en conversación real, no en Prueba** |
| **El agente ignora reglas literales del prompt** | Usó "¿" en las 7 respuestas, estando prohibido textualmente | 🟠 El prompt no es garantía |
| **Guardrails no persisten — es el backend, y NO hay workaround** | Se intentó 2 veces el 14/09 (con y sin cambiar de pestaña). En el mismo guardado el nombre del agente **sí** se guardó y el guardrail **no** → el servidor acepta el POST y descarta el guardrail | 🔴 **Sin red de seguridad, y sin forma de arreglarlo de nuestro lado** |
| **Fuentes externas no se guardan solas** | Botón "Guardar cambios" queda deshabilitado | 🟠 Hay workaround (§1.4 del traspaso) |
| **1 automatización con "Cambiar de Columna" sin destino** | Solo `FV \| DERIVAR A REMARKETING` (ID 55317). *(La de CUALIFICACION la había marcado mal: está bien, fue error de lectura)* | 🟡 Está **inactiva**, no rompe nada hoy |
| **Las 7 automatizaciones de FV\| FUNIL DE VENTAS están inactivas** | Verificado abriendo el detalle de cada una (IDs 55258, 55287, 55288, 55290, 55294, 55301, 55317) | 🟡 Correcto para un pipeline de práctica, pero hay que saberlo |
| **Nombres desalineados prompt vs CRM** | `FV\|CUALIFICACION` vs `FV \| CUALIFICACION`; `FVR \|` en remarketing | 🟠 Falla en silencio |
| **Remarketing no arranca solo** | Las 2 primeras columnas no tienen automatizaciones | 🟡 Requiere mover a mano |
| **Bug de traducción** | `automation.dialog.columnSubtitle` sin traducir | 🟢 Cosmético, reportar |
| **Cuenta al límite** | Usuarios 6/6 y Canales 2/2, 0 disponibles | 🟠 Sumar canal exige subir de plan |

---

## 🔧 Construido pero SIN probar (lo que hay que probar primero)

### 1. Workflow de n8n "FV | Enriquecimiento y ruteo de leads"
**Estado:** importado en n8n, 7 nodos, **sin activar**.
**Qué falta, paso a paso:**
1. Copiar la URL del webhook: `CRM → Embudo de Ventas → FV| FUNIL DE VENTAS → columna FV | ENTRADA DE LEAD → ⋮ Editar columna → Integraciones → webhook "FV n8n - prueba" → "Haz clic aquí para copiar el enlace"`.
2. En n8n, pegarla en los nodos **"CRM - Crear lead CALIENTE"** y **"CRM - Crear lead A DIAGNOSTICAR"**, reemplazando `PEGAR_AQUI_LA_URL_DEL_WEBHOOK_DEL_CRM`.
3. Activar el workflow y copiar la URL del webhook de n8n (nodo "Entrada de Lead").
4. Mandar este POST de prueba:
```json
{
  "name": "Prueba Claude",
  "phone": "59899000000",
  "ad_name": "HIPERCALORICO VITAMIN HORSE 3KG [VIDEO]",
  "message": "Hola, quiero comprar el Hipercalorico Vitamin Horse de 3KG"
}
```
5. **Qué tiene que pasar si está bien:** n8n responde con `producto_interes` = el hipercalórico real, con su precio y link; y en el CRM aparece un negocio nuevo en `FV | ENTRADA DE LEAD` con los campos adicionales cargados.
6. **Si falla:** mirar Executions en n8n; lo más probable es que el CRM rechace el formato del body o que falte algún campo obligatorio (`name` y `phone` lo son).

⚠️ **n8n está en trial: 14 días, 0/1000 ejecuciones.** Decidir si se paga antes de construir más encima.

### 2. El catálogo conectado al agente
**Estado:** conector adjunto + fuente RAG cargada + prompt que los explica. **Nunca se confirmó que el agente los use**, porque la pestaña Prueba no los ejecuta.
**Qué falta:** una forma de probarlo de verdad (ver bloqueo N12 abajo).

### 3. El bloque `<inicio_sin_mensaje>` del prompt
**Estado:** escrito y guardado. **Sin probar** — la pestaña Prueba no simula "conversación que se abre sin mensaje".

### 4. Propagación de cambios del Sheet al agente
**Estado:** no se pudo medir. Era una de las pruebas pedidas (cambiar el Sheet → preguntar → ver si se actualiza), pero **no tiene sentido medirla hasta que el agente consulte el Sheet**, porque hoy inventa la respuesta igual.
**Cómo medirla cuando se destrabe:** agregar una fila con un producto inventado y un precio muy distintivo (ej. `PRODUCTO TEST CLAUDE`, precio `7777`), preguntar por él, y cronometrar cuántos minutos pasan hasta que lo reconoce. Repetir tras recargar el CRM para separar "caché del navegador" de "sincronización del servidor".

---

## 🚧 Bloqueado — y por quién

### Depende solo de nosotros (se puede hacer ya)
| # | Qué | Por qué importa |
|---|---|---|
| N8 | **Conectar Shopify en el Hub** | Promete pedidos + carrito abandonado; es lo de mayor impacto del Hub |
| N10 | Vincular cuenta de Google en `Agente → Herramientas → Agendamientos` | Hoy dice "Nenhuma conta Google vinculada"; es distinto del Hub |
| N11 | Ver si los 8 disparadores de Google Sheets sirven como gatillo de Flujo | Destrabaría la alerta de stock sin Bling |
| N13 | **Unificar nombres `FV \|` vs `FV\|` y `FVR \|`** | Si el match es exacto, el agente falla en silencio |
| N14 | Capturar a ojo el catálogo completo de disparadores/acciones/excepciones | El DOM no lo expone; son 2 minutos a mano |
| N15 | **Arreglar las 2 automatizaciones sin columna destino** | Funnel cortado en 2 puntos |
| N16 | Decidir si se paga n8n antes de que venza el trial | Todo lo de n8n depende de esto |

### Depende de soporte del CRM (reunión)
| # | Qué |
|---|---|
| S1 | ¿Las variables de "Salvar Variável" persisten por contacto? — de esto depende Recompra **y** si hace falta Hermes |
| S2 | Guardrails no persisten (bug a reportar, ahora con el patrón identificado) |
| S3 | ¿Hay webhooks **salientes** (CRM → afuera)? Los entrantes ya los confirmamos solos |
| S6 | Rollout controlado al vincular el canal |
| S11 | Follow Up Generativo: ¿usa el mismo prompt? |
| S12 | Export masivo de conversaciones |
| S13 | Costos y límites |
| S14 | Filtro "Agente IA" del Hub se contradice con el selector del agente |
| ~~S15~~ | ~~Qué significa la etiqueta `AUTOMATIZACIÓN`~~ → **respondida sola el 14/09**: el editor de Flujos tiene un nodo **"Apps" — "Ações de apps conectados (Google Sheets, Gmail, Jira...)"**. La etiqueta marca las acciones usables desde ese nodo. Confirmarlo solo si sobra tiempo |
| S17 | Shopify: qué sincroniza y si los eventos de tienda son gatillo de Flujo |
| S18 | **¿Cómo lee el agente los datos de campaña/anuncio?** (que el CRM sí captura) |
| S19 | **¿Por qué la pestaña "Prueba" no ejecuta conectores?** ¿Y por qué "Uso" no cuenta esas pruebas? |

### Depende del equipo / de datos que no tenemos
| # | Qué |
|---|---|
| E3 | Confirmar si el stock de Shopify se actualiza de verdad |
| E4 | Grabar los audios del call center |
| E5 | Promos vigentes del mes (`{{promos_vigentes}}` sigue sin llenar en el prompt) |
| E6 | Mapeo producto/interés → cupón |
| E8 | **Decidir si se paga el plan del CRM** (hoy es trial R$0 y están al límite de usuarios/canales) |
| E9 | **Decidir sobre revender el CRM con marca propia** (ver §4 del traspaso) |

### ✅ Cerrados en esta sesión
- **E1 / E2** (export de productos y ranking de ventas de Shopify) → resueltos solos con el endpoint público. Ya no hay que pedírselo a nadie.
- **N1** (nunca se validó que el agente responda) → validado: responde. Pero abrió N12.
- **S4 parcial / S8** → el plan dice que Copiloto y transcripción son addons no contratados.
- **S5 parcial** → el CRM sí captura el anuncio; queda S18 (cómo leerlo).
- **Pendiente del archivo 10** sobre "Exceção: Troca de Mensagens" → existe y está en uso.
- **N6 corregido** → "Novo Fluxo" NO se borra, está en producción.

---

## 🆕 Pendientes nuevos que abrió esta sesión

| # | Qué | Quién lo desbloquea |
|---|---|---|
| N12 | **Encontrar cómo validar el agente con herramientas de verdad** (la pestaña Prueba no sirve) | Nosotros + soporte |
| ~~N17~~ | ~~Reconfigurar los guardrails con el workaround~~ → **❌ PROBADO EL 2026-09-14, NO FUNCIONA.** Se intentó de las dos formas (cambiando de pestaña y sin cambiar). En el mismo guardado el nombre del agente sí se guardó y el guardrail no → **es el backend**. Ya no depende de nosotros: pasa a S2 | Soporte del CRM |
| N18 | Bajar el catálogo de nuevo cada X tiempo (el script ya está: `artefactos/build-catalogo.ps1`) y decidir si se automatiza con n8n | Nosotros |
| N19 | Revisar los 31 productos que quedaron en categoría `otros` y los 136 sin marca | Nosotros |
| **N20** | **🔥 Probar el nodo "Apps" de los Flujos de Automatización para consultar el Google Sheet por fuera del agente.** Es la vía más prometedora que quedó abierta: no depende de que el modelo decida llamar la herramienta, así que esquiva el problema de los precios inventados. Combinable con el nodo "Agente de IA", que vincula/desvincula el agente de una conversación | Nosotros — **empezar por acá** |

---

## Datos que hay que tener a mano

| Cosa | Valor |
|---|---|
| Agente | `Agente fit`, id **9816**, `gpt-4o-mini`, modo Avanzado |
| Sheet del catálogo | ID `1NR9cthzyLKfKKRHjy2gGwfuHMH19sAHwyP92m2xuEtY`, hoja `catalogo-agente` |
| Cuenta Google del Sheet | `max.suplementos77@gmail.com` |
| Pipelines nuestros | FV\| FUNIL DE VENTAS **23843** · FV\| RMKG - REMARKETING **23865** · FV\|RECOMPRA **23965** |
| Webhook de entrada al CRM | `POST https://api.rmsystemm.com.br/webhook/leads/<TOKEN>` — token en la UI, no en estos archivos |
| Endpoint de la pestaña Prueba | `POST https://api.integrador-crm.com/prompt-user-chat/49785/send-message` |
| Catálogo Shopify (público) | `https://fitnessuplementos.com/products.json?limit=250&page=N` |
| Ranking de ventas (público) | `https://fitnessuplementos.com/collections/all?sort_by=best-selling&page=N` |
| n8n | `fitnessuplementos.app.n8n.cloud` — **trial, 14 días** |
| Plan del CRM | "Administrador RM System", trial R$ 0,00/mes, usuarios 6/6, canales 2/2 |
