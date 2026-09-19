# Pipeline Masivo + API de Negócios — investigación nocturna 2026-09-19

**Pedido real, textual del usuario, de madrugada:** *"la idea es hacer un remarketing masivo en la pipeline de masivos nueva"*, con instrucción explícita de **no mandar ningún mensaje real** y trabajar solo, sin preguntar.

**Qué es este archivo y qué NO es.** Es investigación y diseño verificado contra el CRM real y la documentación real de la API. **No se movió, tagueó ni envió nada a ninguno de los 2396 negocios reales** — cero mutaciones. Todo lo de acá es: (a) estructura observada tal cual está hoy, (b) endpoints de API leídos de la documentación oficial de rmsystemm (no probados en vivo — no tengo `api-key` ni `Connection-Token`, y no fui a buscarlos: el clasificador de permisos bloqueó por buena razón la navegación a la pantalla de credenciales, y aunque no la hubiera bloqueado, no correspondía ir a buscarlas sin decírselo al usuario primero), y (c) un diseño de flujo para ejecutar mañana, con el usuario presente.

---

## 1. Hallazgo: existe una pipeline nueva, "PIPELINE MASIVO" (id 24326)

No estaba documentada en el vault. Estructura real, vista en pantalla (captura tomada, ver §5):

| Columna | Negocios (visto en pantalla) |
|---|---|
| **LEAD MASIVOS** | **2396** |
| CAMPAÑA TESTO DILATED | 0 |
| CAMPAÑA HIPERCALORICO | 0 |
| CAMPAÑA ISOLADO | 0 |
| CAMPAÑA WOMAN | 0 |
| CAMPAÑA CREATINA | 0 |

**Lectura de esto:** alguien (el usuario, en otra sesión no documentada) armó el esqueleto de la pipeline — una columna de entrada con los 2396 leads acumulados, y 5 columnas de destino, una por producto/campaña — pero **todavía no existe ningún mecanismo que mueva un solo negocio de "LEAD MASIVOS" a su columna de campaña**. Las 5 columnas de campaña están vacías.

### 1.1 Dato observado en cada tarjeta de "LEAD MASIVOS" (no verificado en profundidad, ver más abajo)
Cada negocio trae, visible en la tarjeta:
- El **nombre del anuncio/creativo** de origen, ej. `CREATINA VITAMIN HORSE [VIDEO]`, `WHEY ISOLATE XTR [VIDEO]`, `MIX INTEGRAL MÉDICA [VIDEO]`.
- Una etiqueta de segmento, ej. `P. Segm Intereses (Mensajes WP)`, `P. Abierto (Mensajes WP)`.
- Pills de colores con nombres como `DISPARO MASIVO`, `PROPUESTA ENVIADA`, `PAGO PENDIENTE`, `RE COMPRA - LUCÍA`, `VENTAS`, `CL | CONVERSACION`.

**Inferencia, no confirmada:** el nombre del anuncio de origen (`CREATINA VITAMIN HORSE [VIDEO]`, etc.) es casi seguro el campo que hay que usar para decidir a qué columna de campaña mandar a cada lead (ej. todo lo que diga "CREATINA" → columna `CAMPAÑA CREATINA`). **Falta confirmar** en qué campo exacto de la respuesta de `GET /commercial-order` aparece ese dato (hipótesis: `Business.name`/`ad_name` o un campo adicional — no se llegó a pedir el detalle de un negocio real por API esta noche, cero llamadas hechas).

**Sobre las pills de colores — corregido un supuesto propio de esta misma sesión:** al principio interpreté "DISPARO MASIVO" como si fuera otra columna/etapa de esta pipeline. **No lo es** — las 6 columnas reales son las de la tabla de arriba. Esas pills son, con más probabilidad, **Etiquetas (Tags)** ya aplicadas al contacto de sesiones anteriores (el sistema de "Etiquetas" ya documentado en [[17-registro-de-cambios]]), o nombres de etapas de OTRAS pipelines por las que ese mismo contacto ya pasó. Casi todas las tarjetas revisadas ya traen la pill `DISPARO MASIVO` — sugiere que **esto no es la primera vez que se intenta un envío masivo a esta base**, pero no se confirmó qué la puso ahí ni cuándo.

### 1.2 Confirmado: no hay ninguna automatización construida todavía para esta pipeline
Se revisó `Automatizaciones → Flujos de Automatización` completo (7 flujos existentes, ninguno nuevo desde el 17/09) — cero resultados para "masivo" o "campaña". Los flujos que existen son los ya documentados: `FV|Asignar Cierre`, `FV|Asignar Conversión.`, `FV|Bling - Alerta de Stock Bajo`, `FV|Bling - Renovacion de Token`, `FV|Consultar Producto Bling`, `FV|Recompra - Reactivación` (este último **no estaba documentado en el vault** — pendiente de revisar qué hace), `Novo Fluxo`.

### 1.3 🔴 Hallazgo confirmado con captura real, no solo snapshot — posible impacto operativo
Se volvió a entrar a `Automatizaciones → Flujos de Automatización` y se sacó una captura de pantalla real (no solo el árbol de accesibilidad). **Confirmado con los ojos:** el toggle de Status de **`Novo Fluxo` y `FV|Recompra - Reactivación` está apagado (gris)** — los otros 5 flujos (`FV|Asignar Cierre`, `FV|Asignar Conversión.`, `FV|Bling - Alerta de Stock Bajo`, `FV|Bling - Renovacion de Token`, `FV|Consultar Producto Bling`) están prendidos (azul).

**Por qué esto puede importar de verdad:** `Novo Fluxo` estaba documentado en el vault como **"EN PRODUCCIÓN"**, disparando por "Mensaje Recibido" y mandando el menú 1/2/3 a leads reales — con la advertencia explícita "NO BORRAR" (ver [[PENDIENTES]] N6, cerrado el 14/09 con esa corrección). Si de verdad está apagado ahora, **los mensajes entrantes de clientes reales pueden no estar recibiendo ese menú automático** desde quién sabe cuándo. No se investigó la causa (¿lo apagó el usuario a propósito? ¿se apagó solo? ¿es normal que estos dos convivan apagados con el resto prendido?) — **no se tocó el toggle, ni para confirmar ni para corregir, sin el usuario mirando.**

**No se abrió el editor de ninguno de los dos flujos reales esta noche** — a diferencia de sesiones anteriores que usaban un flujo descartable ("Novo Fluxo" de prueba, sin guardar) para explorar el catálogo de nodos, entrar al editor de un flujo real que ya existe en producción tiene más riesgo de guardar un cambio por error sin querer, y esta noche no correspondía correr ese riesgo sin supervisión.

---

## 2. Hallazgo nuevo: la API tiene el endpoint que faltaba — mover un negocio de etapa

Leída completa la sección `Pipeline / Funil → Negócios` de `Automatizaciones → API` (no estaba en el vault; lo que había en [[PENDIENTES]] P5 solo cubría Mensagens, Tags y la consulta general). Endpoints confirmados, leídos directo de la documentación oficial (no ejecutados):

| Acción | Método | Endpoint |
|---|---|---|
| Consultar negocios (paginado) | GET | `/commercial-order` |
| Crear negocio | POST | `/commercial-order` |
| Detalle de un negocio | GET | `/commercial-order/{identifier}` |
| Actualizar negocio | PUT | `/commercial-order/{identifier}` |
| **Mover negocio de etapa** | **POST** | **`/commercial-order/{identifier}/move`** |
| Agregar/actualizar/quitar campo adicional | POST/PUT/DELETE | `/commercial-order/{identifier}/additional-info[/{id}]` |
| Agregar/quitar tag | POST/DELETE | `/commercial-order/{identifier}/tags[/{tagId}]` |

### 2.1 El endpoint clave para segmentar: `POST /commercial-order/{identifier}/move`
```
POST https://api.rmsystemm.com.br/api/commercial-order/{identifier}/move
Headers:
  api-key: <clave de la empresa>          (required)
Body:
  { "commercialStep": "<nombre exacto de la etapa destino>" }   (required, string)
```
**Esto es exactamente lo que faltaba.** Con este endpoint, un script (n8n) puede: leer cada negocio de `LEAD MASIVOS` vía `GET /commercial-order` (filtrando por `Pipeline.name = "PIPELINE MASIVO"` y `CommercialSalesStep.name = "LEAD MASIVOS"` del lado de n8n, como ya se documentó en Q15), decidir a qué campaña corresponde por el nombre del anuncio, y moverlo con un `POST .../move` a `{ "commercialStep": "CAMPAÑA CREATINA" }` (por ejemplo). **Un solo `api-key`, sin necesitar `Connection-Token`** (ese header solo lo pide el envío de mensajes, no el movimiento de etapa).

También existe API completa de Pipelines (`GET/POST /pipeline`, `GET/PUT/DELETE /pipeline/{id}`, `POST/PUT /pipeline/{pipelineId}/commercial-steps[/{id}]`) — no fue necesario usarla, pero confirma que hasta la propia pipeline se podría administrar por API si hiciera falta a futuro.

### 2.2 Hallazgo importante que cambia el diseño de Q15: existe un endpoint de Templates, separado del envío libre
```
POST https://api.rmsystemm.com.br/api/message-template/send/v2
Headers:
  api-key: <clave de la empresa>          (required)
  Connection-Token: <token del canal>     (required)
Body:
  number: string required            — ej. "5551999999999"
  templateName: string required      — nombre del template ya aprobado/cargado en el sistema
  processedText: string required     — el texto con placeholders {{1}}, {{2}}...
  manualVariables: object opcional   — ej. { "{{1}}": "João Silva" }
```
Más `GET /message-template` para listar los templates ya registrados (no se llegó a consultar en vivo — pide `api-key`, no disponible esta noche).

**Por qué importa, y esto es una corrección al diseño que dejó Q15 el 17/09, no solo un dato más:** el diseño anterior de Q15 apuntaba a `POST /messages/send/v2` (envío libre de texto/media) para el disparo masivo. **Este es probablemente el endpoint equivocado para este caso.** Es una regla general y pública de la API de WhatsApp Business (no algo que diga la documentación de rmsystemm, es una inferencia mía a partir de que existe un endpoint de Templates separado): un negocio solo puede escribirle primero a un cliente, fuera de una ventana de 24 horas desde su último mensaje, usando un **template pre-aprobado por Meta** — un mensaje libre en ese caso se rechaza o arriesga el número. Los 2396 leads de "LEAD MASIVOS" llevan, en varios casos vistos, semanas o meses sin actividad — case de libro de "fuera de la ventana de 24 h". **Esto hay que confirmarlo antes de mandar nada real**: si ya existe un template aprobado y cargado (`GET /message-template` lo diría), el camino correcto es `POST /message-template/send/v2`, no el de envío libre. Si no existe ningún template, hay que crear y esperar la aprobación de Meta antes de poder hacer este envío — lo cual cambia el plazo de "esto se puede hacer ya" a "hay un paso de aprobación externo por delante".

---

## 3. Lo que se puede hacer con esto, y en qué orden

**Fase 1 — Segmentar (de menor riesgo, pero sigue siendo sobre 2396 negocios reales):**
Leer `LEAD MASIVOS` vía `GET /commercial-order`, clasificar cada negocio por su anuncio de origen, y moverlo a su columna de campaña con `POST .../move`. No manda ningún mensaje — solo reordena tarjetas. **Aun así, es una mutación real y masiva de datos de producción: no se ejecuta sin que el usuario esté mirando**, siguiendo la regla ya escrita en `CLAUDE.md` de confirmar con captura antes/después cualquier acción que cambie datos reales, multiplicada acá por 2396.

**Fase 2 — Confirmar el camino de envío (bloqueada por datos que no tengo):**
1. Conseguir la `api-key` de la empresa y el `Connection-Token` del canal "Fitness Suplementos" (ninguno de los dos está disponible en esta sesión — ver [[PENDIENTES]] Q15).
2. Con la `api-key`, listar `GET /message-template` y ver si ya hay un template aprobado utilizable para este mensaje. Si no hay, hay que crear uno y esperar la aprobación de Meta (plazo fuera de nuestro control).
3. Recién ahí decidir el mensaje/creativo real por campaña con el equipo (esto sigue sin decidirse, es de ellos, no nuestro).

**Fase 3 — Enviar:** con template aprobado + credenciales + mensaje decidido, recién ahí un workflow de n8n dispara `POST /message-template/send/v2` por cada negocio de cada columna de campaña, con ritmo controlado (no todos de golpe). **Esta fase no se ejecuta sin luz verde explícita del usuario en el momento**, por instrucción suya de esta misma noche.

## 4. Blueprint de n8n dejado listo (diseño, no importado ni corrido)
Ver `artefactos/n8n-pipeline-masivo-segmentar.json` — un esqueleto de workflow que implementa la Fase 1 (segmentar), pensado para importarse en n8n y revisarse antes de activar: Trigger manual → HTTP Request `GET /commercial-order` paginado filtrando por pipeline → Function que mapea nombre de anuncio → columna destino → SplitInBatches → HTTP Request `POST .../move` → Wait (para no golpear la API de golpe). **No tiene credenciales cargadas, no está importado a la cuenta de n8n real, y no se ejecutó.**

## 5. Evidencia
Screenshot tomado en vivo del estado real de la pipeline: `.playwright-mcp/masivo-header.png` — **no versionado a propósito** (esa carpeta está en `.gitignore` porque son capturas del CRM en vivo, con datos de clientes reales, no documentación). Efímero como el resto de `.playwright-mcp/`: si hace falta más adelante, se vuelve a sacar navegando a `selectedPipeline=24326`.

## 6. Qué falta y quién lo desbloquea
- **Confirmar el campo exacto donde vive el "anuncio de origen" en la respuesta de `GET /commercial-order`** — nosotros, con una llamada real de prueba (necesita `api-key`).
- **Conseguir `api-key` + `Connection-Token`** — el usuario (son credenciales, no las busco yo sin que él lo pida explícitamente).
- **Confirmar si existe ya un template de WhatsApp aprobado para este mensaje** — nosotros, en cuanto haya `api-key` (`GET /message-template`).
- **Decidir el mensaje/creativo real por campaña** — el equipo/usuario, no nosotros.
- **Revisar qué hace `FV|Recompra - Reactivación`** (flujo encontrado esta noche, no documentado antes) — nosotros, próxima sesión con navegador.
- **Confirmar visualmente (captura, no snapshot de accesibilidad) si `Novo Fluxo` sigue activo** — nosotros, antes de asumir cualquier cambio de estado.

**PENDIENTE:** ejecutar la Fase 1 (segmentar los 2396 negocios) con el usuario presente y mirando, siguiendo el blueprint de n8n de §4 — no antes.
**PENDIENTE:** confirmar si existe un template de WhatsApp aprobado para el mensaje de remarketing masivo antes de asumir que `POST /message-template/send/v2` está listo para usarse.
