# Flujos de Automatización (motor avanzado) — hallazgo importante, 2026-09-11

**Esto es mucho más potente que las "Automatizaciones y webhooks" por columna que usamos en todo el proyecto hasta ahora.** Es un constructor visual de flujos tipo diagrama (nodos conectados, drag-and-drop, motor "React Flow"), separado de la mini-automatización de columna. Ruta: `Automatizaciones` (sidebar) → `Flujos de Automatización`. Coincide con lo que se vio en el demo de dkwsystem.com (ver [[00-resumen-general]]), pero acá es la versión REAL de nuestra cuenta, no un mockup.

**Regla de investigación seguida**: se exploró el editor de un flujo real ya existente ("Venta Comercial", ID 4481) sin guardar cambios (el botón "Publicar" quedó deshabilitado todo el tiempo, confirmando que no se modificó nada real). No se activó ni publicó nada.

## Flujos ya existentes en la cuenta (histórico)
| Nombre | Gatillos | Ações | Status | Última Execução |
|---|---|---|---|---|
| Novo Fluxo | 1 | 1 | Off | Nunca |
| **Venta Comercial** | 1 | 1 | Off | Nunca |
| Novo Fluxo | 1 | 2 | Off | Nunca |

Ninguno estaba activo ni se ejecutó nunca — eran pruebas iniciales de configuración de la cuenta. **El usuario los borró el 2026-09-11** (confirmado explícitamente: "borre yo esas otras que no servian eran de prueba de ellos nomas") al notar que solo quedaban 2 flujos en el listado tras publicar el nuevo — no fue un error nuestro, fue una limpieza deliberada del usuario en su propia cuenta.

## ✅ Flujo real construido: "FV|Recompra - Reactivación" (2026-09-11)
Primer Flujo de Automatización real de este proyecto, construido paso a paso junto con el usuario (usándolo como ejercicio de aprendizaje) y **publicado en estado Off**, tal como está permitido ("dale todo y podes crear y guardar automatizaciones, lo único que tenés que hacer es dejarla desactivada").

**Estructura final**:
1. **Gatillo**: Negócio mudou de etapa → Pipeline `FV|FUNIL DE VENTAS`, Etapa `FV|VENTA GANADA`.
2. **Delay** (pestaña "Tempo"): Duração `30`, Unidade `Dias` — placeholder fijo, no dinámico (ver limitación abajo).
3. **Tags**: Adicionar `FVR|Recompra 30 Dias`.
4. **Conversa → Buscar**: Canal `Fitness Suplementos`, Fila `Atencion IA`, "Criar se não encontrar" sin marcar (la salida "NÃO ENCONTRADO" queda sin usar — no rompe nada, simplemente no hace nada en ese caso borde).
5. **Agente de IA → Vincular**: Agente `Agente Fit`.

**Hallazgo técnico importante que obligó a rediseñar sobre la marcha**: los campos de tiempo del nodo **Delay** (tanto "Data e Hora" de la pestaña Data Específica, como "Duração" de la pestaña Tempo) son inputs nativos del navegador (`type="datetime-local"` y `type="number"` respectivamente) — **confirmado que NO aceptan variables** (`{fecha_reactivacion}` tira error "Malformed value" al intentar tipearlo). Esto invalida el diseño original de "Data & Hora calcula la fecha exacta → Delay la usa" — no es posible tal cual en esta versión de la plataforma. Por eso el nodo Data & Hora se sacó del flujo final y el Delay quedó con un valor fijo de 30 días (mismo placeholder que ya veníamos usando). Pendiente para cuando haya datos reales de duración por producto: evaluar separar en 3 flujos (uno por bucket 30/60/90, cada uno con su Delay fijo) en vez de uno solo dinámico — vuelve, en la práctica, al diseño original de 3 columnas por duración.

**Hallazgo adicional**: la acción "Conversa" tiene sub-tipos (Criar/Transferir/Buscar/Atualizar) que solo se pueden elegir correctamente desde el panel lateral izquierdo (clickeando el nombre del campo abre ese panel) — insertar el nodo directo desde el picker "Adicionar nó entre conexão" en el medio de una conexión siempre agrega "Criar Conversa" por defecto, sin ofrecer el submenú. Para cambiarlo a otro sub-tipo hay que editar el campo correspondiente dentro del nodo ya insertado (no borrar y reinsertar esperando un submenú que no aparece ahí).

**"Buscar Conversa" — campos confirmados**: Canal, Fila, Status, "Quando achar várias" (default "Usar a mais recente"), checkbox "Criar se não encontrar", con dos salidas de rama: **ENCONTRADO** / **NÃO ENCONTRADO**. La descripción oficial de "Buscar" es *"Encontra uma conversa do contato — e pode criar se não existir"* — confirma semántica find-or-create real cuando se marca el checkbox.

**"Venta Comercial" (inspeccionado)**: Gatillo "Negócio mudou de etapa" → Pipeline `CL | COMERCIAL`, Etapa `CL | VENTA GANADA`. Acción: "Atualizar Negócio" → Status: `Ganho`, Motivo: opcional. O sea, este flujo marca el negocio como "Ganho" (campo de status propio del sistema, distinto de nuestras etiquetas manuales) cuando entra a la columna de venta ganada.

## Catálogo completo de GATILLOS (triggers) disponibles
Mucho más rico que el disparador de columna (que solo tenía "Entrada en la Tarjeta" y "Tiempo en la Columna"):

| Gatillo | Descripción |
|---|---|
| Webhook | Dispara quando um webhook recebe um evento |
| Evento de app | Dispara quando algo acontece num app conectado |
| Instagram | Dispara em eventos do Instagram (comentários, menções) |
| **(agente de IA)** | **Disparado pelo agente de IA via ação "Disparar fluxo de automação"** — confirma una función NUEVA del agente no documentada antes: el agente puede iniciar uno de estos flujos completos por su cuenta |
| Primeira mensagem | Dispara quando uma mensagem é recebida pela primeira vez |
| Quando mensagem for... | Dispara quando uma mensagem atende a uma condição específica (por palabra clave, similar a los gatillos de DS Voice) |
| **Tag Atribuída** | **Dispara quando uma tag é atribuída a um contato** — resuelve directo el problema de "Follow Up por columna" que no pudimos resolver dentro del editor del agente (ver [[14-funil-recompra]]) |
| Fila Atribuída | Dispara quando uma fila é atribuída ou alterada no ticket |
| Disparo manual | Dispara quando você clica em "Executar agora" |
| Agendamento | Dispara em horários programados (diário, semanal, cron...) |
| Contato criado | Dispara quando um contato novo é criado na plataforma |
| **Contato inativo** | **Dispara quando um contato fica X tempo sem interação** — mecanismo ideal para reactivación de Recompra, más flexible que "Tiempo en la Columna" |
| Conversa encerrada | Dispara quando uma conversa é encerrada (ideal pra CSAT) |
| Negócio mudou de etapa | (ya visto, usado en "Venta Comercial") |
| Negócio ganho | Dispara quando um negócio é marcado como ganho |
| Negócio perdido | Dispara quando um negócio é marcado como perdido |

## Catálogo completo de ACCIONES (componentes arrastrables)
### Categoría "Ações"
- **Conversa**: Criar, transferir ou buscar uma conversa
- **Apps**: Ações de apps conectados (Google Sheets, Gmail, Jira...) — integraciones externas listas
- **Contato**: Criar, anotar, alterar campos ou listar contatos
- **Negócio**: Criar, buscar, transferir ou atualizar um negócio (incluye el campo "Status: Ganho/Perdido" que vimos, distinto de solo cambiar de columna)
- **Enviar Mensagem**: Monte a mensagem com blocos de texto, mídia e botões direto no card
- **Pergunta**: Envia uma pergunta e valida a resposta do contato — permite lógica de branching interactiva SIN el agente de IA
- **Reagir à Mensagem**: Reage com um emoji à última mensagem do contato
- **Salvar Variável**: Salva uma variável no fluxo
- **Tags**: Adiciona ou remove tags do contato
- **Agente de IA**: Vincula ou remove o agente de IA da conversa
- **Requisição HTTP**: Faz uma requisição HTTP externa
- **Data & Hora**: Pega a data atual, soma/subtrai, formata e calcula diferenças — **esto resuelve con precisión real el cálculo de "cuánto falta para que se termine el producto" que estábamos por delegarle al criterio del agente**
- **Script**: Roda JavaScript seguro pra transformar listas e variáveis — **responde directo la pregunta de si se puede meter "algo más algorítmico"; la respuesta es sí, pero acá, no dentro del prompt del agente**

### Categoría "Controle de Fluxo"
- **Condicional**: Divide o fluxo baseado em condições (if/else real)
- **Randomizador**: Escolhe um caminho aleatório ou sequencial — **esto es lo que resuelve la idea de "a veces ofrecer otra marca" y "probar distintos enfoques" de forma real, no solo delegada al criterio difuso del LLM**
- **Delay**: Aguarda um período antes de continuar
- **Ir Para**: Pula a execução para outro passo do fluxo
- **Para cada item**: Roda um pedaço do fluxo pra cada item de uma lista (contatos, planilha...)

## Implicación grande para el diseño de Recompra
Con este motor, el mecanismo ideal para la reactivación de Recompra (ver [[14-funil-recompra]]) probablemente NO es ni la automatización de columna simple, ni el Follow Up Generativo del agente solo — es un **Flujo de Automatización dedicado**:
1. Gatillo: "Tag Atribuída" (`FVR|Recompra 30/60/90 Dias`) o "Negócio mudou de etapa" (entra a esa columna).
2. Nodo "Data & Hora": calcula la fecha exacta de reactivación (fecha de compra + duración + margen de días).
3. Nodo "Delay" o "Agendamento" hasta esa fecha.
4. Nodo "Condicional": ¿el contacto respondió mientras tanto? (evita la misma lógica que ya resolvimos con "Intercambio de Mensajes" en las automatizaciones de columna).
5. Acción final: "Agente de IA" (vincula el agente para que redacte, aprovechando que puede leer el historial) o "Enviar Mensagem".

**No implementado todavía** — es el próximo diseño a construir, reemplaza parcialmente el plan anterior de usar Follow Up Generativo solo.

## Detalles adicionales confirmados (2026-09-11, segunda pasada — se creó un flujo de prueba "Novo Fluxo" temporal, nunca publicado, descartado al final con "Sair sem salvar" — no quedó nada guardado en la cuenta)

- **Dos acciones nuevas no vistas antes**: "**Criar Caso de Suporte**" (Cria um novo caso de suporte vinculado ao contato) y "**Atualizar Caso de Suporte**" (Atualiza título, descrição, prioridade, etapa ou responsável de um caso) — confirma que existe una entidad "Caso de Suporte" separada de "Negócio" (deal) y "Conversa" (ticket) dentro de la plataforma. No se investigó a fondo, pero es una tercera categoría de objeto rastreable.
- **Acción "Negócio" → sub-tipo "Criar Negócio"** (el que aparece por defecto): campos `Pipeline` (selector), `Etapa` (selector), `Valor (R$)` (numérico) — confirma que se puede definir el valor monetario de un negocio directo desde el flujo. Relevante para la pregunta pendiente del total histórico gastado (ver [[07-estrategias-pendientes-agente]]): si el campo Valor se completa bien en cada venta, ahí está la fuente de datos real para sumar después (vía Script o Requisição HTTP a la API).
- **"Testar" y "Executar agora" están deshabilitados hasta publicar el flujo** — dice literalmente "Publique o fluxo primeiro para testar/executar". O sea, no hay forma de probar un flujo en modo borrador sin publicarlo primero (a diferencia de la pestaña "Prueba" del Agente de IA, que sí permite probar sin publicar cambios permanentes).
- **El gatillo "Tag Atribuída" permite seleccionar varias etiquetas a la vez** (checkboxes + botón "Selecionar Todas") — un mismo flujo puede dispararse por cualquiera de varias tags, no una sola.
- Crear un flujo nuevo y salir sin guardar ("Sair sem salvar") **no deja rastro** en la cuenta — confirmado que no aparece en el listado después.

## Otras secciones de "Automatizaciones" revisadas
- **DS Bot**: ya documentado (Typebot legacy, ver [[05-infraestructura-tecnica]]).
- **Integraciones**: solo integraciones de DS Bot con colas (`Teste 01`, ya documentado antes). Nada nuevo.
- **API**: documentación REST completa de la plataforma (`Documentación de la API 1.0`). Categorías: Mensagens (Envio de texto/mídia, Templates, DS Voice, Mídia), Dashboard, Contatos, Conversas, Filas, Tags, Pipeline/Funil, Produtos, Agenda, Atividades/Tarefas, Configuração, Webhooks de Leads. Es infraestructura para desarrollo externo/integraciones custom — por ejemplo, acá se podría construir el cálculo confiable de "total histórico gastado por cliente" que investigamos antes (ver [[07-estrategias-pendientes-agente]]), consultando Pipeline/Funil + Contatos vía API en vez de que el agente sume a mano.
- **Webhooks**: Webhooks de Entrada y de Salida. Hay uno de entrada ya creado ("rfrerg", 0 eventos, 0 leads, creado hace ~3hs) — parece de prueba, no se tocó.

## Nodo "Data & Hora" — confirmado en detalle (2026-09-11, tercera pasada — permiso ampliado: "dale todo y podes crear y guardar automatizaciones, lo único que tenés que hacer es dejarla desactivada")

Este es el nodo clave para Recompra. Tiene un selector "Operação" con 7 modos:

| Operação | Qué hace |
|---|---|
| Nenhum | vacío / no configurado |
| **Data/hora atual** | trae la fecha/hora de ahora. Campos: Formato de saída, Fuso horário, Salvar resultado em |
| **Somar tempo** | **la pieza que resuelve Recompra**: campos `Data base` (vacío = ahora, o `{variável}` — ej. la fecha real de compra guardada en el negocio), `Quantidade` (ej. 3, o duración del producto), `Unidade` (dropdown: **Anos / Meses / Semanas / Dias / Horas / Minutos / Segundos**), Formato de saída, Fuso horário, Salvar resultado em |
| Subtrair tempo | igual que Somar pero resta (mismos campos, no se abrió pero el patrón es idéntico) |
| Formatar data | probablemente re-formatea una fecha/variable ya existente a otro formato de salida (no explorado en profundidad) |
| Diferença entre datas | probablemente calcula cuántos días/horas faltan entre dos fechas — útil para el nodo "Condicional" que decide si ya toca reactivar (no explorado en profundidad) |
| Extrair parte da data | probablemente saca un componente (día, mes, año, hora) de una fecha (no explorado en profundidad) |

Formato de saída visto: "Objeto com todos os formatos" — guarda un objeto con `iso, date, time, day, month, year, weekday, monthName, unix, timestamp` accesible como `{agora.date}`, etc. Fuso horário por defecto: `America/Sao_Paulo`.

**Confirma el diseño de Recompra con precisión total**: en vez de 3 columnas fijas (30/60/90 días) como proxy, se puede tener UN solo nodo "Data & Hora" → Somar tempo, con `Data base = {fecha_de_compra}` (guardada al cerrar la venta) y `Quantidade/Unidade` tomados de una variable por producto (ej. `{duracion_producto_dias}` Días) — la fecha de reactivación queda exacta por cliente y por producto, sin necesitar bucketear en columnas. Después un nodo `Delay → Data Específica` (ver abajo) pausa el flujo hasta esa fecha exacta.

## Nodo "Delay" — confirmado en detalle
Dos pestañas:
- **"Tempo"**: `Duração` (numérico) + `Unidade` (dropdown, default Segundos) + toggle opcional "Data/Hora Limite" (si el delay vence después de esa fecha, el contacto NO avanza).
- **"Data Específica"**: un campo único `Data e Hora` (datetime absoluto) + opcional `Data/Hora Limite`. Info del sistema: *"O fluxo ficará pausado até a data e hora especificadas. Se a data já tiver passado, o fluxo continuará imediatamente."* — **esta es la pestaña ideal para Recompra**: se le pasa la variable calculada por el nodo Data & Hora (`{dataResultado}` o similar) y el flujo queda dormido hasta ese instante exacto por cliente.

Ambas pestañas tienen además dos toggles colapsables: "Dias e Horários" (probablemente para restringir a franjas horarias, ej. no mandar de madrugada — relevante porque el toggle maestro de horario de atención está desactivado, ver [[16-auditoria-completa-crm]]) e "Intervalo entre Execuções" (no explorados en profundidad).

## Diseño de Recompra actualizado (reemplaza el de la sección "Implicación grande" de arriba, ahora con piezas confirmadas)
1. Gatillo: "Tag Atribuída" (`FVR|Recompra 30/60/90 Dias`) — o mejor, "Negócio ganho" directo desde `FV|VENTA GANADA`, así no depende de que exista la tag.
2. Nodo "Contato" o "Negócio" → guardar `{fecha_compra}` = ahora, si no se guarda ya en otro punto.
3. Nodo "Data & Hora" → Somar tempo: `Data base = {fecha_compra}`, `Quantidade = {duracion_producto}`, `Unidade = Dias` → guarda en `{fecha_reactivacion}`.
4. Nodo "Delay" → pestaña "Data Específica" → `Data e Hora = {fecha_reactivacion}`.
5. Nodo "Condicional": ¿hubo intercambio de mensajes mientras tanto? (misma lógica que la excepción "Intercambio de Mensajes" de las automatizaciones de columna, ver [[03-funil-de-ventas-nuevo]]) — si respondió, cortar acá.
6. Acción final: "Agente de IA" → Vincular Agente IA (para que redacte el mensaje de recompra usando el prompt v3, modo Recompra) o "Enviar Mensagem" con Criativo/Funil de DS Voice.

**Sigue sin construirse** — el diseño está completo y todas las piezas confirmadas, pero antes de construirlo hace falta: (a) decidir si el disparador es "Tag Atribuída" o "Negócio ganho", (b) definir dónde vive `{duracion_producto}` por producto (campo custom en Productos Comerciales, no explorado todavía), y (c) investigar el origen de las 6033 actividades "recompra actividad" ya existentes (ver [[16-auditoria-completa-crm]]) para no duplicar un sistema que ya funciona manualmente.

## Nodo "Pergunta" — confirmado en detalle
Envía una pregunta al contacto y espera/valida la respuesta antes de seguir — permite branching interactivo sin usar el Agente de IA.

- **"Tipo" (validación de la respuesta)** — catálogo completo: **Texto livre, E-mail, Telefone, Número, Data, Link (URL), CPF/CNPJ, Endereço (CEP), Avaliação, Arquivo, Escolha com imagens**. O sea, se puede pedir y validar automáticamente cosas como el email, un número de teléfono, un CPF, una dirección, subir un archivo (ej. comprobante de pago), o pedir una calificación (CSAT) — todo con validación de formato incorporada, sin que el Agente de IA tenga que interpretar texto libre.
- Campo "Pergunta" (opcional — si se deja vacío, el nodo solo espera la respuesta sin mandar texto).
- "Salvar em": nombre de variable donde se guarda la respuesta.
- **Config. da pergunta → Timeout (minutos)**: vacío = espera indefinida; con timeout configurado, el nodo gana una segunda salida de rama: **"Timeout"** (además de la salida normal "Respondeu"). Esto es una alternativa más simple al combo Delay+Condicional para casos de "¿respondió o no respondió en X tiempo?" — un solo nodo Pergunta con Timeout ya resuelve la bifurcación.
- Nota importante encontrada como advertencia real del sistema: **"Texto livre" precisa de Conversa pra funcionar"** (aviso rojo) — o sea, el nodo "Pergunta" necesita que el flujo tenga un nodo "Conversa" (Criar/abrir conversa) antes, si no, no puede mandar ni esperar la respuesta. Relevante para el diseño de Recompra: si el flujo arranca por gatillo automático (Tag Atribuída, Negócio ganho) sin una conversa abierta, probablemente hay que agregar un nodo "Conversa → Criar" antes de cualquier "Pergunta" o "Enviar Mensagem".

## Nodo "Tags" (acción) — confirmado
Simple: toggle **Adicionar / Remover** + selector multi-tag "Selecionar tags". Igual de directo que la acción de columna equivalente, sin sorpresas.

## Nodo "Apps" — confirmado (parcial)
Al agregarlo pide **"Escolha a conta"** — requiere una cuenta externa ya conectada (Google Sheets, Gmail o Jira) antes de poder configurar nada más. **Ninguna cuenta está conectada todavía** en este workspace, así que no se pudo ver el detalle de qué acciones ofrece cada app (ej. "agregar fila en Sheets"). Pendiente si en algún momento se conecta alguna.

## Nodo "Criar Caso de Suporte" — confirmado en detalle (entidad nueva confirmada)
Abre un **modal** (no un panel inline como los demás): "Esta ação cria um novo caso de suporte na pipeline selecionada." Campos:
- **Pipeline*** (obligatorio, dropdown) — **al abrir el dropdown salió vacío: no hay ninguna pipeline de tipo "Caso de Suporte" creada todavía en la cuenta.** Confirma que esta es una función real y separada pero 100% sin usar hoy.
- Título (opcional) — soporta variables `{contact.name}`, `{conversation.id}`, etc.
- Descrição (opcional)
- Prioridade (dropdown, default "Média")
- Responsável (opcional, dropdown)
- Variáveis fornecidas tras crearse: `supportCase` (objeto del caso), `supportCaseId`, `supportCaseStatus` (status inicial "OPEN").

**Conclusión**: "Caso de Suporte" es un sistema de tickets/casos completamente separado de "Negócio" (venta) y "Conversa" (chat) — tiene sus propias pipelines (a crear en algún lado de Configuración/CRM, no localizado todavía) y su propio status. Podría servir a futuro para trackear reclamos/devoluciones sin mezclarlos con el pipeline de ventas, pero **hoy no está configurado ni en uso**.

## Nodo "Ir Para" — confirmado
Modal "Ir Para — escolha o destino": lista todos los pasos/nodos ya existentes en el flujo (ej. "Node: Disparo manual", "Script", "Data & Hora", "Tags") y al elegir uno, el flujo salta ahí cuando este paso se ejecuta. Texto del sistema: *"Quando este passo executar, o fluxo continua a partir do passo escolhido abaixo. Útil pra voltar a um menu, repetir uma etapa ou re-rotear."* — o sea, es un GOTO real: sirve para menús que se repiten (ej. "no entendí, elegí de nuevo") o loops de reintento. Si se cancela el modal sin elegir destino, el nodo no queda agregado (confirmado, no dejó rastro).

## Nodo "Para cada item" — confirmado en detalle
Itera sobre una lista y corre una parte del flujo por cada elemento. Campos:
- **Lista (variável)** — ej. `{contatos}`
- **Chamar cada item de** — nombre de variable para el ítem actual dentro del loop, ej. `item`
- **Máximo de itens** — tope de seguridad, default **100**
- Nota del sistema: *"Item de contato vira o contato do ramo — dentro do loop use {item} e {item.number}."*
- **Dos salidas**: **"CADA ITEM"** (rama que se ejecuta una vez por elemento — acá van los nodos que actúan sobre cada contacto/fila) y **"CONCLUÍDO"** (rama que sigue después de que el loop terminó todos los elementos).

Confirma que se pueden hacer operaciones masivas reales (ej. recorrer una lista de contactos pendientes de recompra y mandarle un mensaje a cada uno, o procesar filas de una planilha de Google Sheets vía la integración de Apps) sin salir del editor visual.

## Nodo "Script" — límite real confirmado: NO hace peticiones de red (2026-09-13)
Construyendo el flujo "FV|Bling - Alerta de Stock Bajo" (ver [[18-integracion-bling]]) se confirmó que **"Script" es JS puro en un sandbox sin `fetch`/red** — solo transforma datos que ya están en variables del flujo (`data.miVariable`, `contact`, `ticket`, `now`, `console.log`). Para traer datos externos (ej. páginas de una API) sigue haciendo falta un nodo "Requisição HTTP" real; "Script" sirve para el filtrado/transformación posterior, no para reemplazar el HTTP.

**Patrón confirmado para acumular resultados a través de las iteraciones de "Para cada item"**: no existe un modo "agregar a lista" en "Salvar Variável" — el truco real es que una variable de flujo persiste entre iteraciones del loop, así que un nodo "Script" dentro de la rama **CADA ITEM** puede leer su propio valor anterior y reescribirlo extendido (`let texto = data.alerta; texto += "..."; return texto;`, guardado de nuevo en `{alerta}`). Inicializar esa variable en vacío ANTES del loop (con "Salvar Variável") es necesario — dejar el campo "Valor" completamente en blanco hace que la primera lectura sea la cadena literal `"undefined"`, no `""`; el Script que la usa debe blindarse explícitamente (`if (!texto || texto === "undefined") texto = "";`) en vez de confiar en `data.alerta || ""` (que NO detecta el caso `"undefined"` como string).

**"Enviar Mensagem" no tiene campo de destinatario propio** — actúa siempre sobre el "contato ativo" del flujo (el último seteado por un nodo "Criar contato"/"Buscar contato"). Para mandarle un mensaje a alguien distinto del contacto usado para leer/guardar datos (ej. un admin), hace falta un nodo "Contato → Criar contato" adicional inmediatamente antes, apuntando al número real de destino. Además, **"Enviar Mensagem" exige una "Conversa" activa, no alcanza con el contacto** — el flujo marca el paso como "precisa de ajuste: Conversa" hasta que se agrega un nodo "Conversa → Criar Conversa" (con Canal/Fila/Atendente) antes del envío.

**Diferencia real entre "Testar" (global) y "Executar passo" (por nodo)**: el botón "Testar" del flujo completo es una simulación pura — el log muestra explícitamente `(não executada no teste)` en cada "Requisição HTTP", es decir NUNCA llama a la API real, solo predice el camino. En cambio "Executar passo" (dentro del editor de un nodo individual) sí avisa *"nada é enviado de verdade; planilhas e buscas rodam de verdade"* — o sea, ESE botón puntual sí ejecuta GETs/búsquedas reales (pero no envíos). Para depurar por qué una condición dio distinto de lo esperado, conviene usar "Executar passo" nodo por nodo, no confiar en el resultado de "Testar".

**Bug real detectado gracias a esto**: el flujo de alerta de stock corrió de verdad (ejecución no-"Teste" en el Histórico) pero el `Requisição HTTP` devolvió vacío porque el `access_token` de Bling todavía no había sido sembrado por el flujo de renovación (su primera corrida real todavía no había ocurrido) — no fue un bug del diseño del flujo, sino una dependencia entre dos flujos que hay que tener en cuenta al activar cualquiera de los dos por separado.

## Auditoría "click por click" de Flujos de Automatização — cierre (2026-09-11)
A pedido explícito del usuario ("hace todos los clicks... todo pero todo todo... dale todo y podes crear y guardar automatizaciones, lo único que tenés que hacer es dejarla desactivada"), se abrieron y documentaron en detalle TODOS los nodos del catálogo de "Ações" y "Controle de Fluxo", usando un flujo de prueba temporal ("Novo Fluxo") nunca publicado ni guardado. Se salió siempre con "Sair sem salvar" y se verificó después en el listado que no quedó ningún flujo nuevo — cero cambios reales en la cuenta.

**Nodos abiertos y documentados en detalle esta pasada**: Data & Hora (las 7 operaciones, especialmente Somar tempo), Delay (las 2 pestañas, especialmente Data Específica), Pergunta (los 11 tipos de validación + timeout/branching), Tags (acción), Apps (parcial, requiere cuenta conectada), Criar Caso de Suporte (modal completo, entidad nueva), Ir Para (GOTO real), Para cada item (loop con máximo 100 ítems).

**Nodos vistos solo por nombre/descripción en la barra lateral, no abiertos por ser autoexplicativos o de bajo valor para el proyecto actual**: Reagir à Mensagem ("Reage com um emoji à última mensagem do contato"), Salvar Variável ("Salva uma variável no fluxo"), Atualizar Caso de Suporte (mismo patrón que Criar, ya documentado), Condicional en su modo "Saídas separadas" específico (ya se documentó el resto del nodo en la sección de arriba), sub-tipos de Conversa (Transferir/Buscar) y de Negócio (Buscar/Transferir/Atualizar) más allá del default "Criar".

Con esto se considera cubierto el pedido de "todo pero todo todo" sobre Flujos de Automatización — quedan solo los ítems abajo, que dependen de decisiones o de recursos externos, no de exploración pendiente.

## ✅ RESUELTO (2026-09-11): sí se puede persistir datos "globales" (token de Bling) vía un Contato fijo desde un flujo Agendado
Pregunta abierta que quedó pendiente en [[06-seguridad-y-pendientes]] tras probar la conexión OAuth2 a Bling: dónde guardar el `access_token`/`refresh_token` vigente para que lo lean otros flujos/el agente, dado que "Salvar Variável" no persiste entre ejecuciones. Se armó un flujo descartable (`/automation-flows/new`, nunca publicado) para probarlo:

1. **Gatillo "Agendado"** → modo "Cada X tiempo", campo "A cada (horas)" = `5` (mínimo permitido es 5 minutos). No tiene contato disparador (a diferencia de gatillos como "Tag Atribuída"), lo cual es justo el problema a resolver.
2. Se agregó un nodo **Contato** desde el conector "+" — por defecto siempre inserta el sub-tipo **"Criar contato"** (mismo comportamiento ya documentado arriba para "Conversa": el picker del medio no ofrece submenú, hay que editar el nodo ya insertado si se quiere otro sub-tipo). Campos: Nombre y Teléfono (obligatorios, aceptan variables), Email (opcional).
3. **Confirmado con el propio texto de ayuda del nodo**: *"A partir daqui, os próximos nós (tags, campos, nota…) agem NESTE contato — não no que disparou o fluxo."* Es decir: cualquier nodo posterior (Tags, Contato→Alterar campos, Nota, etc.) actúa sobre ESTE contacto específico, no sobre uno implícito del disparador. Esto confirma que el patrón funciona con un disparador Agendado (que no tiene contacto propio) tanto como con cualquier otro.

**Arquitectura resultante para el refresh automático de Bling** (falta construir, no solo probar):
1. Agendado, cada 5 horas.
2. Contato → Criar (Nombre fijo `Sistema - Bling Token`, Teléfono fijo no real ej. `000000000000` — mismo criterio ya usado con Bling, ver [[06-seguridad-y-pendientes]]). Al repetirse el mismo Teléfono en cada corrida, de encontrar semántica find-or-create (confirmar) actuaría como "obtener el mismo contacto siempre" en vez de crear uno nuevo cada 5 horas — **pendiente confirmar este punto exacto antes de dejarlo corriendo de verdad** (si no hace find-or-create, se acumularían contactos duplicados cada 5hs).
3. **Requisição HTTP** → `POST https://www.bling.com.br/Api/v3/oauth/token`, `grant_type=refresh_token` con el refresh_token vigente (leído del propio Contato, ver paso 5) + Basic Auth con Client ID/Secret de la app "Fitness Suplementos - Agente IA" (id 398769).
4. **Salvar Variável** (o extracción directa del cuerpo de la respuesta) para capturar el nuevo `access_token`/`refresh_token`.
5. **Contato → Alterar campos** sobre el mismo contacto fijo del paso 2, escribiendo el nuevo `access_token`/`refresh_token` en dos **Campos de Contacto personalizados nuevos** (hoy en `Configuración → Campos de Contacto` solo existe "Endereço" — hay que crear "Bling Access Token" y "Bling Refresh Token" ahí primero).

Cualquier otro flujo (o la acción "Requisição HTTP" propia del agente) que necesite el token vigente haría un **Contato → Buscar** por ese mismo Nombre/Teléfono fijo y leería esos dos campos — sin depender de variables locales de un flujo que ya terminó de correr.

**Pendiente para dejarlo funcionando de verdad** (no solo probado en un flujo descartable):
1. Confirmar semántica exacta de "Criar contato" ante un Teléfono repetido (find-or-create vs. duplicado) — crítico antes de publicar, evita ensuciar la base de contactos reales.
2. Crear los 2 campos personalizados de Contacto (`Bling Access Token`, `Bling Refresh Token`) en `Configuración → Campos de Contacto`.
3. Armar el flujo real (no descartable) con los 5 nodos de arriba, probar una corrida real con "Executar agora" (el refresh_token se consume/rota en cada uso según OAuth2 estándar — no confirmado empíricamente todavía para Bling, así que la primera prueba real debe hacerse con cuidado, una sola vez).
4. Publicarlo en estado **Off** primero (mismo criterio que el resto de flujos de este proyecto) hasta confirmar que corre bien, y recién ahí activarlo.
5. Una vez confirmado, recién entonces conectar el token vigente al prompt del agente (acción "Requisição HTTP" propia del agente) o a un flujo de consulta de stock — **explícitamente decidido por el usuario que este orden va primero** (renovación automática antes que cualquier uso en producción).

## Pendiente
- **Construir** el flujo real de reactivación de Recompra usando este motor (diseño ya completo, ver sección arriba) — requiere antes decidir el disparador exacto y dónde vive `{duracion_producto}`.
- Investigar el origen de las 6033 actividades "recompra actividad" ya existentes (ver [[16-auditoria-completa-crm]]) antes de construir, para no duplicar lo que ya funciona.
- Revisar si conviene migrar alguna de las automatizaciones de columna que ya armamos en Funil De Ventas a este motor más potente (no urgente, las actuales funcionan).
- Confirmar cómo el agente invoca "Disparar fluxo de automação" exactamente (no se vio el botón/función todavía dentro del editor del agente, solo se confirmó su existencia por aparecer como una opción de gatillo).
- Si en algún momento se conecta Google Sheets/Gmail/Jira, volver a "Apps" para ver el detalle real de esas acciones.
