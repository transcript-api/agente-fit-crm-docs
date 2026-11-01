# Copiloto de IA en Fitness Suplementos — informe completo (estado al 2026-11-01)

**Para qué existe este archivo.** Es el punto de entrada único sobre el Copiloto. Si sos un agente que entra a este proyecto, leé esto y vas a saber todo lo que pasó con el Copiloto entre la noche del 31/10 y el 1 de noviembre de 2026: cómo se compró, cómo se configura, qué hace, qué se le corrigió y por qué, qué falta, y las trampas en las que ya caímos. El detalle sesión por sesión está en `17-registro-de-cambios.md` (entradas del 2026-11-01) y los pendientes en `PENDIENTES.md` (Q41, E7). La wiki resume en `wiki/entities/copiloto-ia.md`. La presentación para la gerencia está en https://claude.ai/artifact/JvaDopbhHKD4e79Qn7Brko (privada; se comparte desde su menú Share).

**Nota de fechas (corregida el 2026-11-01).** Varias entradas del vault decían "2026-11-02" o "02/11". Los commits muestran que todo ese trabajo fue el 1 de noviembre (de 02:18 a 11:00, hora de Uruguay). Se corrigió a 01/11 en este archivo, en el 17, en PENDIENTES, en la wiki y en los artefactos del Copiloto. La columna "Actualizado" de los CSV de `artefactos/catalogo-copiloto/` sigue diciendo 2026-11-02 porque esos archivos son los que están cargados en el CRM; la fecha real es 2026-11-01.

Antecedentes (antes de esta prueba, solo hearsay): [[44-copiloto-webinar-y-podcast-dkw-2026-10-29]] (webinar y podcast del proveedor) y [[45-copiloto-vision-funciones-y-propuesta-presentacion-2026-11-01]] (lo que el usuario quiere que haga).

---

## 1. Qué es y qué no es

- Función de la plataforma base del CRM (DKW System; RM System la revende) para el **equipo humano**. No conversa con clientes.
- Tres superficies:
  1. **Conversas**: al abrir un chat, aparece "Maldito Talento preparou uma resposta" con el texto sugerido y botones Enviar / editar / descartar. Un solo texto por sugerencia.
  2. **Chat propio** (`/ai/copilot/chat/<id>`): preguntas, análisis, planillas, documentos, y acciones sobre el CRM.
  3. **Home** (`/ai/copilot/home`), botón "Buscar novidades": propone acciones solas (mensajes, tareas, notas) como "Aprovações pendentes", más "Insights" y "Minhas metas" (hay una meta "META 100K, Receita (vendas)" agendada por semana desde el 1/11; no la creamos nosotros).
- **No es el Agente de IA.** Maxi (`Agente Fit - Recepcionista Comercial`, id 10005) atiende solo en WhatsApp; el Copiloto trabaja al lado del vendedor.
- Nombre del Copiloto en la cuenta: **"Maldito Talento"** (lo puso el usuario en el setup).

## 2. Requisitos, compra y costo

| Dato | Valor | Confianza |
|---|---|---|
| Requisito | IA Gerenciada (modelos de la plataforma). Cuentas BYOK no tienen Copiloto. Lo habilita el partner en `Parceiros > Política de IA` | Dicho por el proveedor y el copiloto de soporte |
| Compra | El usuario compró **1 asiento** desde la cuenta de **Revenda** ("súper", ver P8) el 2026-11-01. Hubo un error "Saldo insuficiente" con R$ 50 en la cartera; el usuario lo resolvió por su cuenta | Visto |
| Precio | **R$ 24,90 por asiento por mes** ("1 usuário do Copiloto — R$24,90/mês", próxima cobranza 30/11/2026, en `Configurações > Meu Plano`) | Visto |
| Créditos | Usa los créditos de IA de la empresa. Franquicia del mes: 3,3% tras el análisis de precios, 4,1% al terminar las pruebas del 01/11 | Visto |
| Degustação | 5 mensajes/día, solo admin; no es un asiento; se corta al día siguiente | Dicho por el soporte |
| Planes al cliente final | Essencial R$ 79 / Pro R$ 247 / Max R$ 647 por mes (los fija el partner) | Webinar, sin verificar |

## 3. Asientos

- Se asigna **dentro del Copiloto**: `Copiloto → Equipe → Adicionar membros` (logueado como admin en la cuenta de la empresa). No en Usuários, no en Revenda. Ser admin no da asiento. Hoy: 1 asiento, **Gian**.
- Por encima de los asientos comprados, cada persona es un asiento adicional con costo. Sacar a alguien libera el asiento al instante y su memoria queda guardada.
- Ojo: todos los usuarios de Fitness son "admin" (el soporte lo marcó como riesgo).

## 4. Dónde está cada cosa (pantallas)

- `Agente de IA → Copiloto` = `/ai/copilot`. Columna izquierda: Home, Notificações, Documentos, Agendamentos, Grupos, Equipe, Recentes, y **Configurações** abajo de todo (no confundir con las Configurações del CRM).
- `Copiloto → Configurações` = `/ai/copilot/config`, pestañas **Rede neural**, **Memória** (`/ai/copilot/config/memory`), Canais, Assinatura.
- **Rede neural** tiene cuatro partes: "Configuração do copiloto" (texto base del setup guiado de 5 pasos: Empresa, Ramo, Objetivo, Processos, Revisão), **Habilidades**, **Fontes de conhecimento** y **Playbook · Regras & Processos**.
- Base de conocimiento: `Agente de IA → Base de Conhecimento` = `/ai/conhecimento`; la base "Santi" es `/ai-knowledge/2954`.
- El modo **Manual / Auto** está abajo del chat del Copiloto (radio o botón "Auto"). Auto = "O copiloto executa as ações sem confirmação".

## 5. Qué lee y qué pesa más (según el propio Copiloto, 2026-11-01)

- En cada turno recibe: el Playbook, su memoria y el historial completo de la conversación.
- Las fuentes de conocimiento llegan **en fragmentos** por consulta; si el dato no se recupera, no existe. Por eso las planillas tienen una fila por variante y cada fila completa.
- Precedencia si algo choca: **seguridad > Playbook > dato confirmado de la fuente > memoria y estilo**.
- Del anuncio de cada lead ve el **nombre de la campaña/anuncio** y a veces el **texto del creativo** (con producto y precio). **No ve el ID.** La búsqueda en la planilla de promociones es por nombre exacto + alias.
- Mientras Maxi estuvo como habilidad, recibía el prompt entero de Maxi en cada turno y se mezclaban sus reglas (ver §9).

## 6. Qué puede hacer (catálogo de acciones)

Dado por el copiloto de soporte del partner el 01/11, confirmado en parte por el uso:

- **Lectura sin aprobación**: conversaciones, mensajes, historial, contactos, notas y campos; negocios, embudos, etapas, valores, estado; productos; etiquetas; filas, usuarios, conexiones; flujos, automatizaciones de columna, webhooks; configuración y ejecuciones de agentes de IA (incluido por qué falló una ejecución); plantillas de Meta, agenda, comisiones, cartera, anuncios y origen de leads. Genera planilla, documento, presentación, página e imagen; corre consultas analíticas.
- **Escritura** (Manual: tarjeta de aprobación; Auto: directo): mandar y agendar mensajes; crear/editar contacto, etiquetas, campos, notas; unir duplicados; crear conversación, cambiar estado/fila/atendente; crear y disparar flujos; crear/editar automatización de etapa; crear/editar agente de IA; ajustar canal; crear etiqueta, usuario, aviso. El alcance real depende de las habilidades habilitadas.
- **No hace**: borrar registros; tocar plan o asientos.
- Una tarjeta de aprobación es una **propuesta**: si no se aprueba, el flujo no existe (los "2 flujos de recontacto" del 01/11 nunca se crearon).

## 7. Configuración actual (2026-11-01)

| Parte | Estado |
|---|---|
| Configuração do copiloto | Nombre "Maldito Talento". Empresa escrita **"Fitnes Suplementos"** (con una s) en el nombre y la descripción. No se corrigió: editarlo obliga a recorrer los 5 pasos y guardar, y no se sabe si regenera las instrucciones base |
| Habilidades | **Ninguna.** El 01/11 apareció "Agente Fit - Recepcionista Comercial" (a la mañana estaba vacío; no se sabe si lo agregó el usuario o el Copiloto en Auto). Se quitó con confirmación; el agente Maxi no se tocó |
| Fontes de conhecimento | Base **"Santi"** ("Produtos e Serviços"), con 3 planillas: `1-precios-unitarios.csv`, `2-kits-y-combos.csv`, `3-promociones-de-anuncios.csv`. Hereda: todos los copilotos. La base también está conectada al agente viejo "Agente Fit - Conversión" (parado desde el 30/09), no a Maxi |
| Playbook | **14 reglas activas**, todas con herencia "Todos os copilotos" (Gian figura "Sem cargo"; por cargo quedaría afuera) |
| Memória | La llena el Copiloto solo ("Ele decide sozinho o que guardar das conversas"). Tenía 39 fragmentos; se borraron 11 que contradecían las reglas; quedan 28 |
| Modo | **Auto.** Pendiente pasar a Manual (el sistema de permisos de Claude Code bloqueó ese clic; lo hace el usuario) |

### Las 14 reglas
Texto exacto en `artefactos/copiloto-rede-neural-instrucciones-y-fuentes-2026-11-01.md` (los cambios del 01/11 al mediodía están listados arriba de ese archivo; la regla de datos de cuenta tiene números bancarios y **no se copia al repo**, que es público).

1. Quién habla, idioma y nombre del cliente
2. Estilo de los mensajes
3. Cómo vendemos
4. Mensajes automáticos del anuncio
5. Objeciones
6. No inventar
7. Seguridad (corta la venta)
8. Cierre y seguimiento
9. Mejora continua
10. Logística y formas de pago (datos confirmados)
11. Marcas y kits
12. Recontacto y recompra (incluye Buscar novidades)
13. No negociables: revisar antes de proponer cualquier mensaje
14. Datos de cuenta para transferencia (pasar solo al cerrar)

Cómo se edita una regla: en la tarjeta de la regla, lápiz → título, texto y "Quem herda" → Salvar. Crear: "Adicionar regra" → título y texto → Avançar → herencia → Adicionar. El campo acepta saltos de línea, sin límite de caracteres.

### Las planillas (`artefactos/catalogo-copiloto/`)
- 17 columnas iguales en las cuatro: Producto; Cómo lo piden los clientes; Marca; Presentación; Sabor; Qué incluye; Regalo; Precio 1/2/3 unidades; Campaña o anuncio (nombre exacto en el CRM); Alias del anuncio; Vigencia; Modo de uso; Estado del dato; Fuente; Actualizado.
- CSV separado por punto y coma, UTF-8 con BOM (abre bien en Excel en español). **Nunca** un ";" dentro de un texto (corre las columnas: pasó dos veces).
- Celda vacía = dato que no tenemos. Nada de "completar" ni corchetes dentro de una celda.
- Para actualizar: editar el CSV, en la base "Santi" quitar la fuente vieja (tres puntos → Remover → Confirmar) y subir la nueva con "Adicionar fonte" (el selector acepta **un archivo por vez**). Se indexa en el primer uso ("sob demanda").
- Dosis de Testo Dilated: **3 cápsulas por día** (corrección del usuario; el CSV original decía 2).
- Ver `artefactos/catalogo-copiloto/LEEME.md` para el origen de cada dato y lo que falta.

## 8. Lo que hizo con datos reales

- **Bandeja (01/11)**: 21 pendientes en "Atencion IA"; 12 empezaron con texto automático de anuncio (9 creatina XTR 650 g "¡Hola! 👋 Quiero comprar la Creatina XTR de 650 gramos por $1490.", 3 Testo "Hola, quiero comprar el Testo Dilated"). Horas después, el mismo día, 4 de las 6 pendientes más recientes eran del mismo anuncio.
- **Análisis de precios (01/11, conversación "Análise de preços e inconsistências", chat 5032)**: 78 precios del 12/09 al 01/11; informe CSV de 500 registros; planilla "Fitness Suplementos — Precios dados a clientes (12/09 a 01/11/2026)". Contradicciones: pre entreno $990/$1.390/$1.450/$1.490 en 8 días; whey 100% $1.650/$1.790/$2.190; colágeno 5 precios $890–$1.790; magnesio 5 precios $890–$1.690; multivitamínico DUX $890/$990/$1.390; kit Black Skull a $1.650 (posible error); Thermo Flame $490/$550; kit 2 hipercalóricos $3.040 vs $4.250; Gold Horse y Carne Horse con precios distintos. **"Creatina Black Skull a 10 pesos" en 3 chats el 29/10** (el caso más grave: el cliente puede reclamarlo). Marcas que aparecen en chats y no están en la lista declarada: Max Titanium, Nutrify, Biotrimag, Omega3 Essentiall. El usuario aclaró que el "solo por hoy" es estrategia de urgencia, no contradicción. En la misma conversación, al revisar la planilla, el Copiloto dijo que en ningún mensaje aparecen el costo de envío por DAC, el precio del shaker suelto ni el del kit Kimera por separado. Ojo: agrupa por categoría ("pre entreno", "whey 100%"), así que parte de las "contradicciones" pueden ser productos o tamaños distintos.
- **Métricas de la semana (01/11, chat del Copiloto; leído de una captura del usuario)**: 522 conversaciones creadas del 26/10 al 01/11; **227 (43,4%) empezaron con el texto automático de un anuncio** ("Hola, quiero comprar…" + producto). Por día, lo legible: 26/10: 99 · 29/10: 106 · 30/10: 99 · 01/11: 8 (el 25/10, fuera de la ventana, sumó 43). Mediana del tiempo de primera respuesta humana: **sin dato**; según el Copiloto, los reportes de la plataforma solo dan contadores generales y la consulta analítica no permite calcularlo. Ese pedido se creyó fallido y sí tuvo respuesta.
- **Recontacto (01/11, vía copiloto de soporte)**: lista de 60 contactos (32 recompra, 28 remarketing) revisando cada chat; propuso dos flujos que no se crearon. Tamaño de los embudos según el Copiloto: recompra 823 + 432 + 360 + 197 + 149 tarjetas; remarketing 129 + 38.
- **Agentes (01/11)**: 8 agentes; Maxi atiende (cola "Atencion IA", 11 conversaciones activas en ese momento); los otros 7 son copias o versiones paradas (dijo "desde el 30/09", pero la "(Cópia)" de Maxi es del 06/10, ver Q38). Citó "No cierres la venta. No preguntes presupuesto." Sin base de conocimiento ni catálogo.
- **Formas de pago (leídas del prompt de Maxi)**: transferencia, depósito, tarjeta por Mercado Pago (sin link ni alias cargado); cuentas Itaú y Santander. Un vendedor además pasó una cuenta PREX en un chat, que no está en Maxi: no se cargó.
- **En Auto, sin aprobación**: dejó una nota en un negocio parado 23 días en CL | SEGUIMIENTO; propuso mover un negocio de VENTA GANADA a "REVENTAS" (no se ejecutó) y una tarea para corregir un negocio en VENTA GANADA sin valor desde hace 184 días.
- **Buscar novidades (01/11)**: 2 recontactos en portugués a clientes con 136 y 54 días sin hablar (fuera de la ventana de Meta) prometiendo "condições especiais". Se le dijo al usuario que no los aprobara.

## 9. Cómo se entrenó (cronología)

| Fecha | Qué hacía mal (caso real) | Qué se cambió |
|---|---|---|
| 01/11 | Prompt pegado en el chat: no se guardaba (lo que se dice en un chat vale solo ahí) | Se pasó a reglas en el Playbook (9, después 12, hoy 14) |
| 01/11 | Usaba [usuario de Instagram del cliente] como nombre, en minúscula; escribía "Fitnes"; no se presentaba como Gian; "¡"; dos preguntas en un mensaje | Reglas de nombre, marca, estilo |
| 01/11 | Tomaba "quiero comprar" (texto del anuncio) como compra | Regla "Mensajes automáticos del anuncio" (corrección del usuario) |
| 01/11 | "Buscar novidades" en portugués y fuera de 24 h | Regla de idioma + "Recontacto y recompra" |
| 01/11 | Se presentaba de nuevo con un cliente de hace 2 días; "Perfecto"; pedía confirmar lo ya dicho | 30 días para volver a presentarse; "no le pidas que confirme"; prohibido arrancar con "Perfecto" |
| 01/11 | "La tenemos disponible"; "retirarla en el local de Rivera"; saltaba al envío sin que eligiera tamaño | No decir lo obvio; ubicación solo si preguntan (la calle sin el departamento, a pedido del usuario); elegir opción antes de la logística |
| 01/11 | Saltaba al envío tras "Información" + "Tengo 60 años" (lo empujaba una regla nuestra: "llevalo a la logística") | Lo que el cliente escribe aparte decide el paso siguiente |
| 01/11 | Dejaba "$[precio confirmado en catálogo]" en el mensaje; todo en un mensaje | Prohibidos los corchetes; las plantillas de saludo de nuestras reglas tenían corchetes ("Buenas [nombre]") y se sacaron; "un paso por vez" |
| 01/11 | Memoria con versiones viejas de las reglas | Se borraron 11 fragmentos |
| 01/11 | Mezclaba reglas de Maxi (habilidad) | Habilidad quitada; datos de cuenta en regla propia; "No negociables" con ejemplos exactos |

Las recomendaciones del propio Copiloto para obedecer mejor (aplicadas): bloque de no negociables al principio y al final, una regla por ítem con ejemplo mal/bien, máximo dos líneas por mensaje, prohibición explícita de corchetes, precedencia escrita una vez, chequeo antes de mostrar, corrección inmediata, fuente única por tema, quitar a Maxi de su contexto.

## 10. Pruebas

- **1ª (01/11)**, 6 pendientes reales, solo texto: 3 bien ("quiero creatina", "dónde se encuentran", "Información" de Testo), 3 mal (texto automático → salto al envío, "se lo mandamos", precio repetido).
- **2ª (01/11)**, tras quitar a Maxi y reforzar: 4 de 4 bien. Ejemplo: al texto automático de la XTR 650 g → presentación + "Ya venís tomando creatina o sería la primera vez?".
- Esas dos pruebas fueron en el chat del Copiloto.
- **3ª, en Conversas (01/11, ~08:00, capturas del usuario)**: primera propuesta real vista en la pantalla de Conversas, con un cliente que llegó por el anuncio de Testo Dilated. Gian ya lo había saludado a las 07:47 ("Buenas …, cómo estás? Gian de Fitness Suplementos por acá…" + "Ya venís tomando Testo Dilated o sería la primera vez?"); el cliente contestó que entrena 2 a 3 horas (correr y calistenia con lastre). Propuesta: "Hola [nombre], todo bien? Para alguien que entrena 2 a 3 horas entre correr y calistenia con lastre, Testo Dilated te puede servir como apoyo para la recuperación y el rendimiento. Qué querés lograr con el producto?". **Bien**: responde a lo que dijo, no salta al envío, una sola pregunta. Gian la mandó **sacándole el saludo**. Siguiente mensaje del cliente: "Mi fin sería aumento de testo, recuperación muscular y generar más masa". Propuesta: "Buenas [nombre], para lo que buscás, Testo Dilated apunta justo a eso: apoyo para la testosterona y recuperación muscular. Ya lo querés encargar o querés que te cuente cómo se toma?". **Mal**: vuelve a saludar ("Hola…, todo bien?" y después "Buenas…") en una charla en curso, con mensajes nuestros de minutos antes. La regla "Quién habla" dice cuándo presentarse, pero no prohíbe saludar en cada respuesta. **Para revisar**: "apunta justo a eso" se acerca a una promesa de efecto (regla de Seguridad / No inventar).

## 11. Riesgos y trampas conocidas

- **Modo Auto**: ejecuta sin preguntar. Antes de hablarle por chat, avisarle "no ejecutes ninguna acción, solo respondé por texto" (lo respetó siempre).
- **El Copiloto se corrige a sí mismo**: dijo que no podía guardar memoria (sí guarda, en la pestaña Memória); dio por creados dos flujos que eran propuestas; el copiloto de soporte dijo "límite de 3 usuarios" y el plan muestra 6 de 6. Verificar en pantalla.
- **Privacidad**: la memoria de cada vendedor es privada (ni el gerente la ve). El copiloto de soporte del partner puede operar sobre la cuenta.
- **Capturas con datos de clientes** no van en artifacts compartidos (bloquea el publish; ver `27-reglas-diseno-presentaciones.md`).
- **Datos bancarios**: solo en la regla del Playbook; nunca en el repo.
- **Ventana de Meta**: fuera de 24 h, solo plantilla aprobada.
- **CRM sin ventas ganadas**: el informe del líder no puede medir conversión real hasta que se marquen.
- **Herramientas de Claude Code**: el sistema de permisos bloqueó (a) borrar fragmentos de memoria hasta que el usuario lo autorizó explícitamente, (b) cambiar el modo a Manual (lo hace el usuario). El MCP de Playwright se colgó dos veces 30 minutos el 01/11.

## 12. Pendientes (también en PENDIENTES.md Q41 y E7)

1. Pasar a Manual. → el usuario
2. ~~Confirmar con una sugerencia real en Conversas~~ ✅ 2026-11-01: confirmado con el caso de la §10 (sigue las reglas en lo demás). Nuevo: **regla para no saludar en una conversación en curso** (si hay mensajes nuestros recientes, responder directo) y revisar "apunta justo a eso". → nosotros
2b. Volver a probar "Buscar novidades": si propone en portugués, el Playbook no le llega. → nosotros
3. Completar planillas: pre entrenos, colágeno, magnesio, multivitamínico, isolada y tamaños de Integralmédica, DUX, Black Skull suelto, costo de envío, nombres exactos de campañas y alias con errores de tipeo ("tosterona", "creatina 650"). → el usuario pasa los datos
4. Definir el precio bueno de cada producto con precios contradictorios. → el usuario / el dueño
5. Activar el informe semanal del líder (prompt en `artefactos/prompt-copiloto-informes-lider-2026-11-01.md`) y marcar ventas ganadas en el CRM. → el usuario
6. Asientos para el equipo, si se decide. → el usuario
7. Corregir "Fitnes" en el setup. → el usuario o nosotros con cuidado
8. Ideas del Copiloto sin decidir: respuestas fijas para 6 casos frecuentes; respuesta automática al texto del anuncio; aviso cuando un chat queda X minutos sin asignar.

**PENDIENTE:** regla para no saludar en una conversación en curso, visto en Conversas el 01/11 (§10). → nosotros. Registrado en `PENDIENTES.md` Q41.

## 13. La presentación (2026-11-01)

- **URL: https://claude.ai/artifact/JvaDopbhHKD4e79Qn7Brko** (privada; para que la vea la gerencia hay que compartirla desde Share). Deck de 14 láminas + informe completo al final: qué hace el Copiloto, cómo se lo entrenó y por qué escala. Fuente en `presentacion/copiloto-2026-11/index.html` (carpeta **ignorada por git**: imágenes y videos pesados; `index.v1.html` es la primera versión, antes de las críticas).
- **Versión 2 (vigente), 17 láminas, ordenada por quién lo usa** a pedido del usuario ("que se muestren las funciones", "copiloto para vendedores… cómo el líder o el dueño puede usarlo"; nada de estado interno como "falta definir" o "sin probar", que queda solo en el informe): 1 portada ("El mismo Copiloto, tres trabajos") · 2 el problema (522 chats en una semana, 227 escritos por un anuncio) · 3 qué es (propuesta real de Conversas) · 4 setup guiado (captura real) · **Vendedor**: 5 la respuesta en el chat · 6 precios de la planilla · 7 a quién escribir · 8 acciones en cada negocio (disponible / propuesto / ya lo hizo) · **Líder**: 9 informe del lunes · 10 Playbook · 11 hoja corregida · 12 revisa la configuración (8 agentes) · **Dueño**: 13 lo que detectó en los chats (78 precios) · 14 preguntas sobre el negocio (522/227 y "sin dato") · 15 escala y costo (captura real de la compra) · 16 quién decide (Manual/Auto) · 17 cierre.
- **Capturas reales usadas** (de las que mandó el usuario, recortadas sin datos de clientes ni de otras empresas de la Revenda): setup guiado (etapa 3), chat del Copiloto consultando su base, compra del asiento ("1 usuário do Copiloto R$ 24,90/mês, cobranças a partir de 31/10/2026"). Capturas nuevas del CRM no se pudieron sacar: el MCP de Playwright se colgó por tercera vez (30 min).
- Versión 1 (14 láminas, con "lo que falta"): `presentacion/copiloto-2026-11/index.v1.html`.
- Imágenes: 10 generadas con Higgsfield (GPT Image 2.5, 2K, alta calidad, 2,75 créditos c/u) sin texto ni logos. Videos: 3 clips de 5 s con Kling 3.0 (10 créditos c/u), porque el navegador (Flow / AI Studio) estaba colgado. No hay foto real de producto: la Creatina XTR 650 g no está en la tienda online (solo la Hyper Creatine 100 g de XTR).
- Pasó por dos agentes críticos (diseño y contenido). Lo que cambió por ellos: datos sin respaldo sacados (una bajada de la lámina de recontacto, un "Olá! Faz um tempo…" reconstruido, "en una sola consulta"), "aprende de las correcciones de todos" cambiado por "las reglas se escriben una vez" (la memoria es privada), la grilla de tarjetas iguales reemplazada por una hoja corregida, láminas con estructuras distintas, flechas que apuntan a lo que nombran, fechas relativas fijadas.
- Reglas de diseño seguidas: `27-reglas-diseno-presentaciones.md` (paleta #070F16 / #A8E831 / #E8321E, Archivo Black + DM Serif Display itálica + Caveat + Jost, objeto real, nota manuscrita con flecha, pastilla, grano, nada obvio, nada inflado, fuente en cada número, nombres de clientes cambiados).

## 14. Fuentes de este informe
- Visto en la cuenta (alta): Meu Plano, Rede neural, Memória, Base de Conhecimento, Equipe, Home.
- Dicho por el Copiloto de la cuenta (media): bandeja, análisis de precios, cómo lee, recomendaciones.
- Dicho por el copiloto de soporte (media): catálogo de acciones, asientos, degustação.
- Webinar/podcast (media-baja): planes, modelos, promesas.
