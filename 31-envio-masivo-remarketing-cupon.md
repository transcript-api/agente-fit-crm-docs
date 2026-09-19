# Envío masivo de remarketing con cupón — mecanismo nativo en rmsystemm (2026-09-19)

Reemplaza el plan anterior (API + n8n, ver [[17-registro-de-cambios]] 2026-09-17 y pendiente Q15 en [[PENDIENTES]]). El usuario encontró un camino más simple: mover las cards en bloque dentro del propio tablero, usando dos mecanismos nativos de rmsystemm (automatización de columna + Flujos de Automatización) en vez de la API. **Diseño probado de punta a punta en un sandbox de prueba, funcionando en vivo.** Falta escalarlo a las columnas reales.

## La idea central (validada)

En vez de que los leads lleguen naturalmente a la columna de Remarketing en momentos distintos (como pasaba antes), se **mueven en bloque** desde donde están hoy hacia una columna nueva de disparo. El disparador "Entrada en la Tarjeta" se activa para todos casi al mismo tiempo, sin importar cuándo habían entrado originalmente al embudo. El "envío masivo" no es una acción en sí — es un movimiento masivo de cards que dispara N automatizaciones individuales de una sola card cada una (el mecanismo más simple y ya probado del proyecto), en vez de necesitar un mecanismo de verdad masivo.

Escala real: **2400 leads en `PIPELINE MASIVO → AD MASIVOS`**, se van a mandar en tandas de ~400 (no todos juntos), seleccionando y moviendo cards a mano con el botón "Seleccionar" del tablero (soporta selección múltiple, confirmado).

## Segmentación por campaña/anuncio

`PIPELINE MASIVO` tiene una columna pulmón (`AD MASIVOS`, con los 2396/2400 leads) y columnas por campaña: `CAMPAÑA TESTO DILATED`, `CAMPAÑA HIPERCALORICO`, `CAMPAÑA ISOLADO`, `CAMPAÑA WOMAN`, `CAMPAÑA CREATINA`, y se van a sumar más (Black Skull Kit, etc.). Cada columna va a mandar el creativo/audio que corresponde al anuncio que originó ese lead — algunas van a ser audio (las principales: Testo Dilated, Black Skull Kit), otras foto.

**Decisión tomada**: no multiplicar automatizaciones/Flujos por columna de campaña. Un único mecanismo genérico sirve para todas — si en el futuro hace falta preservar de qué campaña vino cada uno en la pipeline de respuestas, la vía recomendada es una **tag dinámica por campaña** (leída con el nodo "Negócio → Buscar", que trae la etapa/columna actual), no una columna de destino por campaña (evita explosión combinatoria producto × etapa de venta). Todavía no implementado — es la próxima mejora, no bloqueante.

## Pipelines de prueba (sandbox, ya construidas)

- **`RESPUESTAS MASIVO`** (origen/envío): columnas `LEADS MASIVO` (pulmón imaginario) y `TEST CANJE CAMPAÑA` (donde vive el disparo).
- **`MASIVO - RESPUESTAS`** (destino tras responder): columna `LEAD REACTIVADO`.

⚠️ Los dos nombres son casi idénticos en orden de palabra invertido (`RESPUESTAS MASIVO` vs `MASIVO - RESPUESTAS`) — fácil de confundir en un desplegable, prestar atención doble al elegir pipeline en cualquier nodo nuevo.

Para producción falta construir las etapas reales de `MASIVO - RESPUESTAS` (hoy solo tiene una columna de prueba). Propuesta ya charlada con el usuario, pendiente de confirmar: `NUEVO - CANJEÓ` → `EN ATENCIÓN` → `PROPUESTA ENVIADA` → `PAGO PENDIENTE` → `VENTA GANADA` / `SIN RESPUESTA` / `NO INTERESADO` (mismo vocabulario que ya usa el equipo en `FV|FUNIL DE VENTAS`, para no enseñar etapas nuevas).

## Mecanismo construido y probado (2 Flujos de Automatización)

### Flujo 1 — "TEST - Envío Campaña" (el envío)
Dispara cuando el card entra a la columna de campaña, manda el creativo.

1. **Gatillo**: `Negócio mudou de etapa` → Pipeline `RESPUESTAS MASIVO`, Etapa `TEST CANJE CAMPAÑA`.
2. **Conversa → Buscar**: Canal `Fitness Suplementos`, Fila `Qualquer fila`, Status `Qualquer uma aberta`, **"Criar se não encontrar" MARCADO** (a diferencia del Flujo 2 — acá si no hay conversa abierta, hay que crear una para poder mandar el mensaje), Atendente `User Santi` (ajustar a quien corresponda en producción).
3. **Enviar Mensagem — nodo 1 (solo Mídia)**: la foto/creativo del cupón. Separado del texto+botón a propósito (ver hallazgo de orden más abajo).
4. **Delay**: 5 segundos.
5. **Enviar Mensagem — nodo 2 (Texto + Botão)**: texto "DISPONIBLE SOLO POR LAS SIGUIENTES 24hs!" + botón Resposta Rápida **"CANJEAR AHORA"** (ver nota de naming más abajo — el texto del botón real tiene que decir lo mismo que el botón dibujado en la imagen).

### Flujo 2 — "TEST - Reacción Canjear" (la reacción al click)
Dispara cuando el lead responde al botón (o escribe la frase a mano — el gatillo no distingue el origen).

1. **Gatillo**: `Mensagem contém...` → condición "contém" → texto exacto **"CANJEAR AHORA"** (recién cambiado, ver nota de naming).
2. **Enviar Mensagem** (confirmación, solo texto): *"Ahí va, tu 5% ya quedó activo 🙌 Tenés 24 horas para aprovecharlo y después vence, así que mejor no dejarlo para más tarde. En breve te escribe un asesor para armar tu pedido con el descuento aplicado y dejar todo encaminado."*
3. **Tags → Adicionar**: `TEST|Canjeado` (para producción, considerar tag dinámica por campaña — ver sección de segmentación arriba).
4. **Negócio → Buscar**: Pipeline `RESPUESTAS MASIVO`, Etapa `TEST CANJE CAMPAÑA`, Status `Aberto`, "Criar se não encontrar" **SIN marcar** (si no encuentra, mejor que se corte que crear un negocio duplicado por error) → salida `ENCONTRADO`.
5. **Negócio → Transferir**: Pipeline `MASIVO - RESPUESTAS`, Etapa `LEAD REACTIVADO`, Responsável `User Santi` (ajustar en producción — puede servir como el "aviso al vendedor" que no existe como acción nativa separada: asignar Responsável podría disparar notificación nativa, no confirmado todavía si realmente notifica).

**Probado en vivo el 2026-09-19, con el propio número del usuario, extremo a extremo**: mover el card → llega el cupón con foto + botón → click en el botón → llega la confirmación + se aplica la tag + el card salta solo a `MASIVO - RESPUESTAS → LEAD REACTIVADO`. Funcionó.

## ✅ Naming "CANJEAR CUPON" → "CANJEAR AHORA" — terminado de propagar (2026-09-19 noche)

El creativo real (compartido por el usuario) tiene el botón dibujado con el texto **"CANJEAR AHORA →"** y código **VOLVISTE5**, no "CANJEAR CUPON" que se había usado en las primeras pruebas. Se decidió unificar todo a "CANJEAR AHORA" para que el botón real coincida con lo que el cliente ve escrito en la imagen.

**Los 3 lugares quedaron confirmados, cada uno verificado con una recarga completa de la página (no solo estado del cliente) antes y después de guardar:**
- Botón de la plantilla `cupon_general`: ya decía "CANJEAR AHORA" (hecho en la sesión anterior). Además, la plantilla ya está **Aprovado** por Meta (Enviadas: 0 — aprobada pero sin usar todavía).
- Botón del nodo "Enviar Mensagem" en el Flujo "TEST - Envío Campaña" (id 5798): estaba en "CANJEAR CUPON" — corregido y publicado.
- Gatillo del Flujo "TEST - Reacción Canjear" (id 5797), condición "Quando a mensagem contiver": estaba en "CANJEAR CUPON" — corregido y publicado.

**No se revisó** la automatización de columna "TEST CUPON" (si tiene un botón propio configurado) — queda para la próxima sesión, no es de los 3 que se sabía que estaban desactualizados.

**Hallazgo suelto al revisar el Flujo 1**: el nodo de espera entre el envío de la imagen y el texto+botón dice **"Aguardar 2 segundos"** en el canvas real, no los 5 segundos que dice este documento más abajo (sección "Mecanismo construido y probado", paso 4). No se tocó — revisar cuál de los dos valores es el correcto antes de escalar, y corregir el que esté mal (el doc o el flujo).

## Hallazgos técnicos importantes (para no volver a pisarlos)

### 1. "Buscar Negócio" / "Buscar Conversa" — cuándo hace falta
Cualquier nodo de Flujo que necesite un objeto "Negócio" (Transferir, Atualizar) o "Conversa" (Enviar Mensagem) **necesita que ese objeto esté disponible en el flujo**. Los gatillos tipo `Negócio mudou de etapa` lo traen solo. Los gatillos basados en mensaje (`Mensagem contém...`) NO — hace falta un nodo `Negócio → Buscar` explícito antes. Ningún gatillo trae una `Conversa` automáticamente — siempre hace falta `Conversa → Buscar` (o `Criar`) antes de `Enviar Mensagem`. El editor avisa con un cartel claro: *"Esse passo não vai funcionar — precisa que esta informação esteja disponível no fluxo: [Negócio/Conversa]"*.

### 2. Gotcha de UI ya confirmado varias veces
Insertar un nodo desde el "+" en el medio de una conexión **siempre** agrega el sub-tipo "Criar" por defecto (para Negócio y para Conversa), sin ofrecer el submenú. Para cambiarlo a "Buscar"/"Transferir": dejar que se inserte, después clickear el **nombre del campo** (el título del nodo ya puesto, ej. "Criar Conversa") para que se abra el desplegable de sub-tipo ahí adentro. Mejor todavía: insertar los nodos en el orden correcto desde el principio (agregar primero "Buscar", no "Transferir"), así no hace falta corregir nada después.

### 3. Automatización de columna vs. Flujo — diferencia real de capacidad
Las automatizaciones de columna (`Config columna → Automatizaciones`) solo tienen 2 gatillos simples de siempre (`Entrada en la Tarjeta`, `Tiempo en la Columna` — hay más, ver [[17-registro-de-cambios]] 2026-09-17) y sus acciones de envío son limitadas:
- `Enviar Creativo`: manda una imagen/media ya subida a la biblioteca, sin texto propio ni botón.
- `Enviar Mensaje`: **solo texto plano**, sin media ni botón.
- `Enviar Plantilla de Mensaje`: manda una plantilla de WhatsApp aprobada (ver sección de plantillas).

Los **Flujos de Automatización** tienen un nodo `Enviar Mensagem` mucho más rico (pestañas Texto/Mídia/Botões/Criativo/Template) que sí permite combinar foto + texto + hasta 3 botones de Resposta Rápida (o 2 de Chamada para Ação, no se pueden mezclar tipos) en una sola configuración. Por esto el mecanismo real vive en Flujos, no en automatizaciones de columna.

### 4. El orden de envío no es el orden del editor
Aunque el bloque "Mídia" esté visualmente arriba del bloque "Texto" dentro de un mismo nodo `Enviar Mensagem`, **WhatsApp entrega la imagen y el texto+botón como dos mensajes separados**, y la imagen puede tardar más en llegar de verdad (probablemente por el tiempo de subida/procesamiento) — llegando DESPUÉS del texto aunque se haya disparado antes. Confirmado en una prueba real. **Fix aplicado**: separar en dos nodos `Enviar Mensagem` secuenciales (uno solo Mídia, después un Delay de 5s, después el segundo solo Texto+Botão) para forzar el orden real de entrega.

### 5. La ventana de 24 horas de WhatsApp — aplica sin importar la herramienta
**No es una limitación de rmsystemm ni de los Flujos — es una regla de Meta/WhatsApp Business Platform.** A un contacto sin conversación abierta hace más de 24hs, ningún sistema (ni RM System, ni n8n, ni nada) puede mandarle un mensaje libre armado a mano (con o sin botón). Confirmado en vivo con un contacto real ("Natalia", ventana cerrada): el Flujo se disparó bien, pero el envío falló con **"META API | Erro ao enviar mensagem"**. Migrar el mecanismo a n8n NO evita esta regla — la misma pared aparece ahí también.

**Único mensaje permitido a un contacto frío**: una plantilla de WhatsApp ya aprobada por Meta (`Enviar Plantilla de Mensaje`). Una vez que el contacto responde (lo que sea), la ventana se reabre y ahí sí se puede mandar mensaje libre con foto y botón.

**Dato externo sin verificar del todo (vía ChatGPT, plausible pero no confirmado con soporte de rmsystemm)**: los leads que vienen de un anuncio "Click to WhatsApp" tendrían una ventana extendida de ~72hs de mensajería gratuita (distinta de la ventana estándar de 24hs), si la respuesta de la empresa ocurrió dentro de las primeras 24hs del click. Aun si Meta no cobra en esa ventana extendida, **falta confirmar con soporte de rmsystemm si ellos (como intermediario) cobran algo propio igual** — el usuario está tranquilo con este punto pero no está verificado de forma independiente.

### 6. Diseño de 3 pasos para no depender de plantillas nuevas por creativo
Como el audio (que van a usar varias columnas de campaña) **no se puede meter en el header de una plantilla de WhatsApp** (los headers solo admiten Texto/Imagem/Vídeo/Documento — no hay opción de Áudio), no tiene sentido aprobar una plantilla con imagen distinta por cada campaña. El diseño elegido, uniforme para todas las campañas (audio o imagen):

1. Plantilla de texto genérica y ya aprobada (ej. `recontacto`, ver abajo) reabre la ventana.
2. El lead responde lo que sea → dispara un Flujo que recién ahí manda el creativo real (foto o audio) + botón, como mensaje libre (ya es legal porque la ventana está abierta).
3. Click en el botón → dispara el Flujo de reacción ya armado y probado.

**Todavía no construido** — el Flujo 1 actual ("TEST - Envío Campaña") asume ventana abierta; falta construir la versión que arranca con la plantilla genérica para leads fríos.

### 7. Plantillas de WhatsApp (`Recursos → Modelos de Mensajes`)
Ruta: `Recursos → Modelos de Mensajes` (`/resources/message-templates`). Cada plantilla tiene: Nome, Categoria (Utilidade/Marketing/Autenticação), Status (Aprovado/Pendente), Cabeçalho opcional (Texto/Imagem/Vídeo/Documento — **sin Áudio**), Texto do Corpo (hasta 1024 caracteres, admite `{{variavel}}` opcional), Texto do Rodapé (hasta 60 caracteres, sin variables), Botões opcionales (hasta 3 Resposta Rápida O hasta 2 Chamada para Ação, no se pueden mezclar tipos). **Crear una plantilla nueva tarda 24-48hs en aprobarse por Meta** (aviso explícito de la propia plataforma).

Plantillas ya aprobadas en la cuenta: `nombre`, `cuenta2`, `recontacto`, `rivera`, `listo`, `vitaminx2`, `compra`. Se revisó el contenido completo de **`recontacto`**: *"Hola! como estas? Te escribimos de Fitness Suplementos, tenemos una gran oferta para ti hoy!"* — sin variables, sin imagen, sin botón. Sirve para reabrir ventana (paso 1 del diseño de 3 pasos), no para mandar el cupón en sí.

**Nueva plantilla creada esta sesión**: `cupon_general` (categoría Marketing) — header Imagem (la foto real del cupón: "TE ESTÁBAMOS ESPERANDO", 5% OFF por 24hs, código VOLVISTE5), texto "DISPONIBLE SOLO POR LAS SIGUIENTES 24hs!", botón Resposta Rápida "CANJEAR AHORA". **Estado: Pendente, mandada a aprobar el 2026-09-19** — revisar en 24-48hs (≈2026-09-20/21). Cuando esté aprobada, da una alternativa de "un solo mensaje" (para campañas de imagen, no audio) en vez del diseño de 3 pasos.

Nota aparte: el desplegable "Enviar Plantilla de Mensaje" de las automatizaciones de columna mostraba una advertencia genérica ("Solo las plantillas aprobadas sin variables manuales se pueden usar en automatizaciones") para TODAS las plantillas por igual, incluidas las que no tienen variables — parece ser un aviso preventivo del sistema, no un bloqueo real específico por plantilla (a confirmar probando el envío real).

### 8. Ritmo de envío — dato nativo encontrado
Las automatizaciones de columna muestran un aviso propio de la plataforma: *"Los mensajes tienen un retraso de 30 segundos entre ellos para evitar bloqueos por spam."* Confirma que hay un espaciado nativo de 30s entre mensajes disparados por automatización de columna. **No confirmado todavía si el mismo espaciado aplica a los Flujos de Automatización** — repasar antes de mandar un lote real de 400.

### 9. Secciones descartadas como "herramienta de campaña masiva" (no son eso)
Se revisó `Marketing → Campañas` (`/advertisement/overview`, solo dashboard de métricas de anuncios: ROAS, CPL, clics — no manda nada) y `Marketing → Mensajes` (`/advertisement/messages`, "Mensagens de Campanhas de Anúncios" — auto-respondedor para la PRIMERA vez que alguien escribe desde un anuncio puntual, útil para leads nuevos entrantes, no para reactivar los 2400 que ya son contactos viejos). Ninguna de las dos es una herramienta de broadcast masivo escondida.

### 10. Dato suelto para revisar en otra sesión
El dashboard de Inicio tiene un widget "Salud de las automatizaciones" que mostró **"Flujos de Automatización: 7 activos, 120 errores esta semana"** — no investigado en detalle todavía. Probablemente incluye los mismos errores de plantilla/ventana cerrada que ya diagnosticamos, pero vale la pena revisarlo dedicado antes de escalar el envío real.

## Recetas técnicas reutilizables (para retomar rápido)

### Reconectar el Chrome de depuración (Playwright)
El perfil normal de Chrome (con sesión logueada) **rechaza** `--remote-debugging-port` aunque se le pase `--user-data-dir` apuntando a esa misma carpeta a propósito — es un endurecimiento de seguridad de Chrome, no se puede evitar. La solución que funcionó: lanzar Chrome con un perfil **nuevo y separado**, loguearse a mano en rmsystemm ahí:
```powershell
Start-Process "C:\Program Files\Google\Chrome\Application\chrome.exe" -ArgumentList "--remote-debugging-port=9222", "--user-data-dir=`"$env:TEMP\chrome-debug-profile`"", "https://rmsystemm.com.br"
```

### Subir un archivo pegado en el chat, vía Playwright
El tool `browser_file_upload` de Playwright solo acepta rutas dentro de las carpetas permitidas del proyecto (`c:\Users\Home\agente-fit-crm-docs` y su `.playwright-mcp`), no la carpeta temp de Claude donde se guardan las imágenes pegadas. Hay que copiar el archivo primero:
```bash
cp "<ruta temp de la imagen pegada>" "c:/Users/Home/agente-fit-crm-docs/.playwright-mcp/nombre.png"
```
y recién ahí pasarle esa segunda ruta a `browser_file_upload`.

## Qué falta para escalar a producción (resumen)

1. ~~Terminar de propagar "CANJEAR AHORA" en los 3 lugares que faltan~~ — ✅ **hecho el 2026-09-19 de noche**, ver sección de naming arriba.
2. ~~Esperar la aprobación de Meta de `cupon_general`~~ — ✅ **ya está Aprovado** (verificado 2026-09-19 de noche).
3. Construir el Flujo de "apertura con plantilla" (paso 1 del diseño de 3 pasos) para leads fríos — hoy el Flujo de envío asume ventana abierta.
4. Confirmar con soporte de rmsystemm el tema de facturación durante la ventana de 72hs de Meta.
5. Decidir tag dinámica por campaña (Opción A) antes de escalar a las 6 columnas reales de `PIPELINE MASIVO`.
6. Construir las etapas reales de `MASIVO - RESPUESTAS` (hoy solo la de prueba).
7. Replicar el mecanismo (2 Flujos + columna de disparo) en las columnas reales de campaña, probando de a una antes de activar todas.
8. Revisar los 121 errores semanales de Flujos en el dashboard antes de escalar (subió de 120 a 121 desde la sesión anterior).
9. **Nuevo**: confirmar el delay real entre imagen y texto+botón del Flujo "TEST - Envío Campaña" — el canvas dice 2s, este documento decía 5s (ver nota en la sección de naming).
