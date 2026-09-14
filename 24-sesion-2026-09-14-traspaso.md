# Traspaso completo — sesión del 2026-09-14

**Para quién es este archivo:** para el Claude (o la persona) que retome este proyecto desde otra PC. Está escrito para que puedas responder "¿qué hay que hacer?" sin abrir nada más. Si solo vas a leer un archivo, leé este y después [[25-estado-y-que-sigue]].

**Qué pasó en esta sesión, en una línea:** se conectó el catálogo real de 421 productos al agente por dos vías distintas, **se probó el agente por primera vez en la historia del proyecto**, y esa prueba destapó que el agente inventa precios y que la pestaña "Prueba" no ejecuta herramientas. Además apareció la puerta de entrada real para n8n (webhooks por columna).

---

## 1. Lo más importante que aprendimos (leer sí o sí)

### 1.1 El agente inventa precios. Está medido, no es una sospecha.
Se le preguntó tres veces por datos del catálogo y **las tres veces inventó**:

| Pregunta | Respondió | Realidad |
|---|---|---|
| "¿cuánto sale la creatina de 300g?" | "1.200 pesos uruguayos" | 990 (Integralmedica) / 890 (Vitamin Horse) |
| "¿cuánto sale la CREATINA 300G - INTEGRALMEDICA?" | "1.200 pesos uruguayos" | 990 |
| "¿cuál es el producto más vendido?" | "Whey Protein 900g - Integralmedica" | BN TESTO DILATED - POTE 120 CAPS |

Lo dice con total seguridad, en buen tono, sin dudar. **Un cliente real le creería.** Esto es exactamente lo que el guardrail "no inventar precios" debía impedir — y los guardrails no están configurados porque se borran solos (ver 1.4).

**Conclusión operativa: el agente NO se puede conectar a un canal real hasta resolver esto.**

### 1.2 La pestaña "Prueba" no ejecuta herramientas ni consulta el conocimiento
Evidencia acumulada:
- Con el conector de Google Sheets adjunto, nunca lo llamó — ni siquiera pidiéndoselo explícitamente ("buscá en la planilla la fila de CREATINA 300G"), donde respondió "voy a confirmar eso y te cuento".
- Con la fuente de conocimiento (RAG) cargada, siguió inventando.
- La pestaña "Uso" se mantuvo en **0 tokens / 0 solicitudes / US$ 0,00** después de 7 respuestas.
- El endpoint que usa es `POST https://api.integrador-crm.com/prompt-user-chat/49785/send-message` con body `{"body":"texto"}`. El nombre **prompt-user-chat** encaja con "esto prueba el prompt", no el agente completo.

**Para qué sirve entonces la pestaña Prueba:** para validar tono, estructura, longitud y que el prompt no se contradiga. **No sirve** para validar precios, catálogo, herramientas ni nada que dependa de datos.

**Cómo validar de verdad (pendiente):** hace falta una conversación real por un canal, o que soporte confirme el comportamiento. Está anotado como N12.

### 1.3 El agente desobedece reglas explícitas del prompt
El prompt dice textualmente *"Usá el signo de pregunta SOLO al final ("?"), nunca el de apertura ("¿")"*. En las 7 respuestas usó "¿" **siempre** ("¿cómo estás?", "¿Te gustaría saber más...?").

Esto importa más de lo que parece: si ignora una regla tan simple y literal, no hay que asumir que cumple las otras (no inventar precios, una pregunta por mensaje, no usar markdown). **Con `gpt-4o-mini` hay que asumir que el prompt es una sugerencia, no una garantía.** Lo que tiene que ser garantía va en guardrails o en el flujo, no en el prompt.

### 1.4 Bug de guardado, y el workaround que lo resuelve
**El bug:** las secciones que son *listas de items* (Guardrails, Fuentes de conocimiento externas) no se guardan. Reproducido de dos formas distintas:
- Llenando los campos con teclado real → el botón "Guardar cambios" **nunca se habilita** (queda `disabled`).
- Llenando con eventos sintéticos → el botón se habilita, el guardado responde OK, pero **la fuente desaparece al recargar**.

**El workaround (idea del usuario, funcionó):** completar la fuente externa **y además hacer cualquier otro cambio** en el formulario (por ejemplo tocar el prompt o un toggle). El botón se habilita por ese otro cambio y **arrastra la fuente**, que entonces sí persiste. Verificado: la fuente sobrevivió a la recarga.

Qué persiste sin problema: prompt, slider de RAG, conectores, toggles.

### 1.5 Meta Ads: el CRM SÍ captura de qué anuncio vino el lead
Se confirmó mirando el pipeline real. Cada tarjeta trae tres niveles:

| Campaña | Conjunto de anuncios | Anuncio |
|---|---|---|
| NUEVO STOCK 12/08 [MENSAJES] | P. Segm Intereses (Mensajes WP) | HIPERCALORICO VITAMIN HORSE 3KG [VIDEO] |
| [TESTO] Mensajes - Septiembre | P. Segmentado [TESTO] | TESTO DILATED [VIDEO] / [IMG] |
| STOCK FUERTE 10/09 [MENSAJES] | P. Segm Intereses (Mensajes WP) | MIX INTEGRAL MÉDICA [VIDEO] |

En el DOM el contenedor se llama `campaignTagsContainer` — son datos de campaña del negocio, **no etiquetas normales**.

Además, el mensaje de entrada del cliente ya nombra el producto: *"Hola, quiero comprar el Hipercalorico Vitamin Horse de 3KG"* (visto en 3 contactos distintos). Otros entran con el genérico *"Hola quiero comprar un suplemento."*

**Lo que queda sin saber:** ese dato no aparece en la ficha del negocio (solo se ven Telefone, Endereço y los 2 campos de Bling). Así que **no sabemos si el agente puede leerlo**. La pregunta a soporte cambió de "¿lo captura?" (sí) a "¿cómo lo leo desde el agente?".

### 1.6 Casi borramos un flujo que está en producción
En [[PENDIENTES]] el ítem N6 decía que "Novo Fluxo" era basura para limpiar. **Es mentira: está corriendo en producción.** En una conversación real de hace 3 meses se lee: *"Automatización 'Novo Fluxo' iniciada (disparador: Mensaje Recibido)"*, y manda un menú de botones 1/2/3 (Masa Muscular / Perder Peso / Energía), seguido de un mensaje con horario 09-20hs, sorteo de iPhone 17 pro max y link a la web.

**Regla que sale de esto: antes de borrar cualquier flujo o automatización, buscar su nombre en el historial de una conversación real.** El listado de flujos no alcanza.

### 1.7 El plan del CRM responde dos preguntas que le íbamos a hacer a soporte
`Configuración → Mi Plan` dice, textual:
- Plan: **"Administrador RM System" · Assinatura trial · R$ 0,00/mês · Ativo**, validez "Sin plazo".
- **Usuarios: 6 de 6 usados (0 disponibles)**. **Canales de atención: 2 de 2 usados (0 disponibles)**. Filas: 3 de 999.
- ADDONS: **"Transcrição de áudios: não incluída"** y **"Copiloto IA: não incluído"**.
- Módulos: 20 de 20 (incluye API Externa, Webhooks, Fluxo de Automação, Agentes, DS Bot, Criativos, Carteira...).

O sea: **el Copiloto no aparece porque es un addon no contratado**, y **el agente no transcribe audios por lo mismo**. No hacía falta preguntarlo.

Ojo con el límite: **están al tope de usuarios y de canales**. Sumar un canal para el agente requiere subir de plan.

---

## 2. Lo que se construyó y quedó funcionando

### 2.1 Catálogo real de 421 productos (Google Sheets)
- **Sheet:** `CATALOGO AGENTE FIT - Fitness Suplementos`
- **ID:** `1NR9cthzyLKfKKRHjy2gGwfuHMH19sAHwyP92m2xuEtY`
- **Hoja interna:** `catalogo-agente`
- **Cuenta de Google:** `max.suplementos77@gmail.com` (es la que está logueada en el navegador y la que se conectó al Hub — **ojo, no es la del CRM ni la personal**)
- Copia en el repo: [`artefactos/catalogo-agente.csv`](artefactos/catalogo-agente.csv)

**De dónde salieron los datos (esto es lo importante, porque se puede repetir cuando quieras):**
- Productos, precios, links y SKU: `https://fitnessuplementos.com/products.json?limit=250&page=N` — **endpoint público de Shopify**, no hace falta pedirle el export a nadie ni pasar por Bling. Esto **cierra los pendientes E1/E2**.
- Ranking real de más vendidos: `https://fitnessuplementos.com/collections/all?sort_by=best-selling&page=N` — el orden de esa página **es** el ranking de ventas de Shopify. 205 productos tienen ventas registradas.
- El script que arma el CSV: [`artefactos/build-catalogo.ps1`](artefactos/build-catalogo.ps1). Correlo de nuevo y el catálogo se regenera.

**Columnas:** `nombre, categoria, marca, precio_uyu, link, ranking_ventas, posicion_ventas, objetivo, sku, disponible_web, descripcion_base`

**Ranking:** A = top 40 · B = 41-120 · C = 121-205 · `sin_ventas_registradas` = los otros 216. Los cortes A/B/C los elegí yo; **las posiciones son reales**, salen de Shopify.

**Distribución:** proteinas 143 · pre-entreno 58 · creatina 38 · otros 31 · kits y combos 30 · vitaminas y salud 28 · barras y snacks 24 · aminoacidos 24 · termogenicos 15 · colageno 14 · pasta de mani 10 · hidratacion 4 · accesorios 1 · fibras 1.

**Los 5 más vendidos de verdad:** 1) BN TESTO DILATED 120 CAPS ($990) · 2) CREATINA 100% PURA 1KG VITAMIN HORSE ($1890) · 3) Kit Nutry whey refil 900g + creatina 150g ($1450) · 4) KIT WHEY PRO + TESTO DILATED + CREATINA ($1990) · 5) CREATINA 300G INTEGRALMEDICA ($990). **Creatina y kits dominan el ranking** — dato de negocio que no teníamos.

**Limitaciones honestas:** 31 productos quedaron en `otros` (7%, son de línea clínica/nicho) y 136 sin marca detectada. Las `descripcion_base` de Shopify son todas la misma plantilla genérica ("es un combo ideal para quienes buscan mejorar el rendimiento físico...") — sirven de poco, por eso el prompt dice que no se copien.

### 2.2 Conector de Google Sheets adjunto al agente
`Agente de IA → Herramientas → Conectores`. Persiste tras recargar. Con **6 de las 11** herramientas habilitadas:

✅ Obtener Hoja por Lote · Agregar Valores a la Hoja de Cálculo · Buscar fila de la hoja de cálculo · Buscar Hojas de Cálculo · Obtener información de la hoja de cálculo · Obtener nombres de hojas

❌ Dejadas fuera a propósito (escriben o destruyen): Actualizar valores · Crear Fila · **Limpiar Valores** · Crear una Hoja · Agregar Hoja

**Hallazgo no documentado antes:** al adjuntar un conector, el CRM abre un modal *"Herramientas de <conector>"* donde elegís **cuáles** de sus acciones puede usar el agente. Es una capa de permisos por herramienta que no sabíamos que existía.

### 2.3 Fuente de conocimiento externa (RAG)
Misma hoja cargada en `Conocimiento → Fuentes de conocimiento externas`, tipo "Enlace (Google Sheets)", nombre "Catalogo Fitness Suplementos". **Similaridad RAG bajada de 0.5 a 0.35** (lo que la propia plataforma recomienda para datos estructurados). Persistió usando el workaround de 1.4.

### 2.4 Prompt v5 (11.844 → 14.461 caracteres)
Backup del anterior: [`artefactos/prompt-v4-backup-antes-de-v5.txt`](artefactos/prompt-v4-backup-antes-de-v5.txt). Cuatro cambios, los cuatro verificados tras recargar:

1. **Bloque `<inicio_sin_mensaje>` (nuevo).** Resuelve el caso real de los clientes que entran del anuncio y no escriben, o mandan solo el texto prellenado. Le dice que arranque él, que tome el producto del anuncio como interés ya declarado, que no pregunte "en qué te puedo ayudar", y que busque el producto antes de hablar de él.
2. **Bloque `CATALOGO DE PRODUCTOS` (nuevo).** Le da el ID de la planilla, la hoja, las columnas, qué herramienta usar en cada caso (Buscar fila para producto puntual, Obtener Hoja por Lote `catalogo-agente!A1:K120` para recomendar), y las reglas: el precio sale de `precio_uyu`, si no encuentra el producto **no inventa** y transfiere, prioriza `ranking_ventas = A`, no copia `descripcion_base` textual, pasa el link cuando hay interés real.
3. **Regla de rotación, ahora cumplible.** Antes decía "priorizá las de mayor rotación/stock" sin que existiera el dato. Ahora dice "priorizá las que tienen `ranking_ventas = A`".
4. **Se sacó "RESTRICCIONES TÉCNICAS".** Eran parámetros de plataforma (modelo recomendado, delay, tokens, dividir en bloques) metidos dentro del prompt: el modelo no los controla y solo gastaban contexto. Se reemplazó por un bloque `FORMA DE ESCRIBIR` con lo único que sí le sirve (respuestas de 2-4 líneas, y que su memoria confiable son las variables guardadas, no el historial).

### 2.5 Webhook de entrada al CRM (la puerta para n8n)
**Hallazgo grande.** Cada columna del pipeline tiene una pestaña **Integraciones** con webhooks. Se creó uno: **"FV n8n - prueba"** en `FV| FUNIL DE VENTAS → FV | ENTRADA DE LEAD`.

Formato documentado por el propio CRM:
```
POST https://api.rmsystemm.com.br/webhook/leads/<TOKEN>
Content-Type: application/json   (también acepta FormData)

{
  "name": "João Silva",        // obligatorio
  "email": "joao@gmail.com",
  "phone": "5551999999999",    // obligatorio
  "adicional1": "campo opcional personalizado"
  // ... otros campos adicionales que quieras mandar
}
```
Opciones del webhook: Responsables, Tags, y **"Bloquear creación de negocios duplicados"** (no crea negocio nuevo si el contacto ya tiene uno). Trae plantillas para **Predeterminado, WordPress, Sellflux y Hotmart**.

**Esto responde buena parte de S3**: sí hay forma de meter datos al CRM desde afuera. Falta confirmar la dirección contraria (CRM → externo).

> **El token NO está en estos archivos a propósito.** Para copiarlo: `CRM → Embudo de Ventas → pipeline FV| FUNIL DE VENTAS → columna FV | ENTRADA DE LEAD → menú ⋮ → Editar columna → Integraciones → el webhook → "Haz clic aquí para copiar el enlace"`.

### 2.6 Workflow de n8n armado (falta pegarle la URL y probar)
Creado e importado en n8n: **"FV | Enriquecimiento y ruteo de leads (Agente Fit)"**. JSON en [`artefactos/n8n-workflow-lead-enriquecido.json`](artefactos/n8n-workflow-lead-enriquecido.json).

Los 7 nodos:
1. **Entrada de Lead** — Webhook POST `/lead-fitness`. Recibe `name`, `phone`, `ad_name`, `message`.
2. **Catalogo Shopify** — GET a `products.json` (catálogo fresco en cada ejecución, sin base de datos intermedia).
3. **Enriquecer Lead** — nodo Code. Normaliza el teléfono a formato uruguayo, y **cruza el nombre del anuncio contra el catálogo real** contando cuántas palabras coinciden. Exige **mínimo 2 coincidencias** para no inventar un match. Si lo encuentra: saca precio, link, SKU, categoría y objetivo, y arma 3 alternativas de la misma categoría.
4. **Es lead caliente?** — IF. `caliente` = se identificó el producto · `tibio` = hay pista pero no producto · `frio` = no hay nada.
5. **CRM - Crear lead CALIENTE** — POST al webhook con 8 campos adicionales (prioridad, producto, precio, categoría, objetivo, link, anuncio, alternativas).
6. **CRM - Crear lead A DIAGNOSTICAR** — POST con menos campos, marcado para diagnóstico.
7. **Responder** — devuelve el JSON enriquecido.

**Por qué sirve:** hoy el lead entra al CRM crudo. Con esto entra ya clasificado, con el producto del anuncio identificado y su precio real. El vendedor (o el agente) abre la conversación sabiendo exactamente qué vio el cliente.

**Lo que falta para probarlo** (10 minutos): reemplazar `PEGAR_AQUI_LA_URL_DEL_WEBHOOK_DEL_CRM` en los nodos 5 y 6 por la URL real (ver 2.5), activar el workflow, y mandarle un POST de prueba.

⚠️ **n8n está en trial: quedan 14 días y 0/1000 ejecuciones usadas.** Hay que decidir si se paga antes de apoyar nada serio ahí.

---

## 3. Mapa completo de las automatizaciones de columna FV| (leídas una por una)

### FV| FUNIL DE VENTAS (id 23843) — 8 columnas
| Columna | Automatización | CUÁNDO | HACE | EXCEPTO |
|---|---|---|---|---|
| FV \| ENTRADA DE LEAD | — | — | — | — |
| FV \| CUALIFICACION | Derivar a Seguimiento | Tiempo en la Columna · 20 h | Cambiar de Columna **(sin destino)** + Etiqueta `FV\|Cualificacion - Sin Respuesta` | Intercambio de Mensajes · 2 h |
| FV \| PROPUESTA ENVIADA | Derivar a Seguimiento | Tiempo en la Columna · 15 h | Cambiar de Columna → FV \| SEGUIMIENTO + Etiqueta `FV\|Propuesta Enviada - Sin Respuesta` | Intercambio de Mensajes · 2 h |
| FV \| PROPUESTA ENVIADA | Recordatorio Propuesta. | Tiempo en la Columna · 2 h | Enviar Mensaje *"Hola! Quería saber qué te par…"* | Intercambio de Mensajes · 2 h |
| FV \| SEGUIMIENTO | Derivar a Remarketing tras 72hs | Tiempo en la Columna · 72 h | Etiqueta `FV\|Seguimiento - Sin Respuesta` + Cambiar de Columna → FV \| DERIVAR A REMARKETING | Intercambio de Mensajes · 2 h |
| FV \| PAGO PENDIENTE | Derivar a Seguimiento | Tiempo en la Columna · 15 h | Cambiar de Columna → FV \| SEGUIMIENTO + Etiqueta `FV\|Pago Pendiente - Sin Respuesta` | Intercambio de Mensajes · 2 h |
| FV \| PAGO PENDIENTE | Recordatorio Pago Pendiente | Tiempo en la Columna · 2 h | Enviar Mensaje *"Hola! Te dejo apartado tu ped…"* | Intercambio de Mensajes · 2 h |
| FV\| VENTA GANADA | — | — | — | — |
| FV \| DERIVAR A REMARKETING | Enviar a Remarketing | Entrada en la Tarjeta | Cambiar de Columna **(sin destino)** | — |
| FV \| CERRAR SIN VENTA | — | — | — | — |

🔴 **Dos automatizaciones están rotas: "Cambiar de Columna" sin columna destino** (FV | CUALIFICACION y FV | DERIVAR A REMARKETING). Las otras sí nombran el destino. El circuito del funnel está cortado en esos dos puntos: el lead se queda quieto. **Esto hay que arreglarlo, y es de lo más rápido de arreglar que hay en la lista.**

### FV| RMKG - REMARKETING (id 23865) — 6 columnas
REMARKETING - POR CONTACTAR *(sin automatizaciones)* · SEGUIMIENTOS - 1/2/3 CONTACTOS *(sin automatizaciones)* · LEAD REACTIVADO · PAGO PENDIENTE · VENTA GANADA · CERRAR SIN VENTA.

Las últimas cuatro tienen todas el mismo patrón: **Entrada en la Tarjeta → Asignar Etiqueta `FVR | <NOMBRE>`**. Nada más: solo etiquetan.

⚠️ Las dos primeras columnas no tienen nada, así que **el remarketing no arranca solo**: alguien tiene que mover las tarjetas a mano.

### FV|RECOMPRA (id 23965) — 3 columnas
RECOMPRA - 30 DIAS · RECOMPRA - 60 DIAS · RECOMPRA - 90 DIAS. Sin automatizaciones propias. 0 negocios.

### 🔴 Problema de nombres entre el prompt y la realidad
| El prompt dice | La columna/etiqueta se llama |
|---|---|
| `FV\|CUALIFICACION` | `FV \| CUALIFICACION` (con espacios alrededor del `\|`) |
| `FV\|FUNIL DE VENTAS/FV\|PROPUESTA ENVIADA` | `FV \| PROPUESTA ENVIADA` |
| `FV\|Venta Ganada` | la columna es `FV\| VENTA GANADA` (sin espacio antes del `\|`, con espacio después) |
| etiquetas `FV\|...` en remarketing | las etiquetas reales son `FVR \| LEAD REACTIVADO`, `FVR \| PAGO PENDIENTE`, etc. |

El propio CRM es inconsistente consigo mismo (`FV |` vs `FV|`). Si el agente hace match por texto exacto, **las transferencias de columna y las etiquetas van a fallar**. Hay que verificar cómo compara el CRM y, si es exacto, unificar. Queda como N13.

### Lo que trae el formulario de automatización (no estaba documentado)
Además de DISPARADORES / ACCIONES / EXCEPCIONES:
- **Ejecutar Retroactivamente** — *"Aplica la automatización también a las tarjetas que ya están en la columna, y no solo a las que entren después."* Muy útil y peligroso a la vez: si lo activás en una columna con 244 tarjetas, les dispara a todas.
- **Intervalo entre Ejecuciones** — pausa entre ejecuciones para no saturar.
- **Respetar Horario de Atención** — la ejecuta solo dentro del horario configurado.
- Aviso fijo: *"Los mensajes tienen un retraso de 30 segundos entre ellos para evitar bloqueos por spam."*
- Toggle **Activo** por automatización.
- 🐛 Bug de traducción a reportar: el subtítulo del diálogo muestra la clave sin traducir `automation.dialog.columnSubtitle`.

Disparadores/acciones/excepciones **vistos en uso**: CUÁNDO → `Entrada en la Tarjeta`, `Tiempo en la Columna · N horas`. HACE → `Cambiar de Columna`, `Asignar Etiqueta`, `Enviar Mensaje`. EXCEPTO → `Intercambio de Mensajes · N horas` (esto confirma que **sí existe** la "Exceção: Troca de Mensagens" que estaba pendiente en [[10-ds-agente-ds-voice-manual]]).

**No se pudo capturar el catálogo completo de opciones**: los selectores no exponen la lista por DOM (hay un menú residual que contamina la lectura). Se hace a ojo en 2 minutos abriendo el desplegable. Queda como N14.

---

## 4. ¿Se puede revender este CRM con marca propia?

**Respuesta corta: sí, pero no con la suscripción actual.**

La cadena es: **DKW System** (dueño de la plataforma) → **RM System** (revendedor, `rmsystemm.com.br`) → **nosotros** (cliente de RM System). Por eso el plan se llama *"Administrador RM System"*.

[DKW System](https://dkwsystem.com/) vende explícitamente un programa de **partner white-label** ("+1.000 parceiros ativos"). Lo que incluye, según su propia web:
- Logo, colores y favicon propios; **dominio propio** (`crm.tuempresa.com`) con SSL incluido; el cliente final nunca ve la marca DKW.
- **"Monte seus planos"**: armás tus propios planes y precios, activás/desactivás módulos por paquete, y ponés límites de conexiones, usuarios y filas.
- Panel de gestión de clientes, soporte por grupo de WhatsApp, actualizaciones automáticas, acceso a API, y material de venta.
- Sin fidelidad, cancelás cuando querés.
- Integraciones que menciona: Hotmart, Shopify, **n8n**, Make, HubSpot, Google Sheets, webhooks.

**Los precios del programa no son públicos** (los que muestra la web son placeholders tipo R$001/002/003) — hay que pedir cotización.

**Lo que hay que decidir:** ¿ser partner de DKW directamente, o preguntarle a RM System si permiten sub-reventa? Ir directo a DKW es más limpio y más barato en el margen, pero implica migrar la cuenta y perder la relación con RM System (que es quien da el soporte hoy).

⚠️ **Dato a tener en cuenta antes de apostar fuerte:** hay una [reclamación pública en Reclame Aqui contra Wsystem Saas Ltda por "Plataforma DKW System com problemas e falta de suporte"](https://www.reclameaqui.com.br/wsystem-saas-ltda/plataforma-dkw-system-com-problemas-e-falta-de-suporte_xTfx66ZYQJJwWxr1/). Coherente con los bugs que venimos encontrando nosotros.

**Fuentes:** [DKW System](https://dkwsystem.com/) · [Reclame Aqui — Wsystem Saas Ltda](https://www.reclameaqui.com.br/wsystem-saas-ltda/plataforma-dkw-system-com-problemas-e-falta-de-suporte_xTfx66ZYQJJwWxr1/)

---

## 5. Hermes Agent en un VPS: ¿tiene sentido?

**Qué es, verificado:** agente autónomo open source de Nous Research, licencia MIT, self-hosted. Memoria persistente, razonamiento multi-paso, uso de herramientas, **scheduler con sintaxis cron** (`/api/jobs`) y un gateway de mensajería que habla Telegram, Discord, Slack, WhatsApp, Signal, Email y CLI. Corre en un VPS de US$5.

**Mi recomendación: hoy no. Más adelante puede que sí.**

Por qué hoy no:
- **Se pisa con n8n**, que ya está contratado, ya tiene el webhook del CRM identificado y ya resuelve el caso concreto (enriquecer y rutear leads). Meter Hermes ahora es un segundo sistema que mantener para el mismo problema.
- **El WhatsApp del negocio ya vive en el CRM.** Para que Hermes atienda habría que sacar el canal del CRM o duplicarlo, y ahí se rompen las automatizaciones de columna, el pipeline y el trabajo del equipo humano. El costo es enorme comparado con el beneficio.
- Es un servidor más que administrar, actualizar y monitorear.

Cuándo sí tendría sentido, concretamente: **si se confirma que las variables de "Salvar Variável" no persisten** (pendiente S1). Ahí el modo Recompra se queda sin memoria y Hermes en un VPS sería la memoria de largo plazo real — un servicio propio que guarda "qué compró cada cliente y cuándo", que el CRM consulta por HTTP. Ese es el escenario donde vale la pena, y no antes.

**Fuentes:** [Hermes Agent — guía self-hosted](https://www.bluehost.com/blog/hermes-agent-self-hosted/) · [Correrlo 24/7 en un VPS](https://www.bluehost.com/blog/run-hermes-agent-vps/) · [GitHub de Hermes Agent](https://github.com/hermesagent)

---

## 6. Todo lo que se tocó en el CRM (para que no haya sorpresas)

| Qué | Dónde | Estado |
|---|---|---|
| Conector Google Sheets adjunto (6 herramientas) | Agente → Herramientas → Conectores | ✅ Guardado y verificado |
| Fuente de conocimiento externa (el catálogo) | Agente → Conocimiento | ✅ Guardado y verificado |
| Similaridad RAG 0.5 → **0.35** | Agente → Conocimiento | ✅ Guardado |
| Prompt v4 → **v5** (14.461 chars) | Agente → Entrenamiento | ✅ Guardado y verificado |
| Webhook **"FV n8n - prueba"** | FV\| FUNIL DE VENTAS → FV \| ENTRADA DE LEAD → Integraciones | ✅ Creado, 0 eventos |
| Workflow **"FV \| Enriquecimiento y ruteo de leads"** | n8n | ✅ Importado, **sin activar** |
| Sheet **CATALOGO AGENTE FIT** | Google Drive de `max.suplementos77@gmail.com` | ✅ Creado, 421 filas |
| 7 mensajes de prueba al agente | Agente → Prueba | Solo prueba, no toca clientes |

**Lo que NO se tocó:** ninguna conversación real (solo se abrió una, de lectura, sin responder), ninguna columna ajena a FV|, ningún flujo activo, ninguna automatización existente. No se creó ninguna automatización nueva (el formulario que se abrió para explorarlo se cerró con Cancelar).

**Lo que hizo el usuario, no yo:** conectó Google Sheets en el Hub de Integraciones, y activó un toggle en Configuraciones del agente durante la sesión.

---

## 7. Para el que retoma: el orden que yo seguiría

1. **Arreglar las 2 automatizaciones sin columna destino** (sección 3). Es media hora y destraba el funnel.
2. **Resolver el problema de nombres `FV |` vs `FV|`** (sección 3). Si no, las transferencias del agente fallan en silencio.
3. **Terminar el n8n**: pegar la URL del webhook (sección 2.5), activar, mandar un POST de prueba. 10 minutos.
4. **Encontrar cómo validar el agente de verdad** (sección 1.2). Sin esto no se puede medir nada.
5. **Recién después**, pensar en conectarlo a un canal. Nunca antes de resolver 1.1.

El detalle de todo lo pendiente, con quién lo desbloquea, está en [[25-estado-y-que-sigue]] y en [[PENDIENTES]].
