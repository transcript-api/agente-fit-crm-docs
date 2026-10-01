# El editor de "Instrucciones" (Slate.js) — comportamiento real y bugs técnicos

**Qué es**: el campo de texto enriquecido donde vive el prompt de cada agente, en `Agente de IA → Entrenamiento → Instrucciones`. Está construido con **Slate.js**, con elementos "void" inline (chips no editables que representan las acciones reales: `save_variable`, `transfer_order`, etc.). Este archivo documenta cómo editarlo por script sin romper nada — es la pieza técnica más repetida y más frágil de todo el proyecto.
**Fuente primaria**: `17-registro-de-cambios.md` (varias sesiones), `PENDIENTES.md` A26/A28/Q27.

## Estructura real del DOM
- El contenedor real es `[data-slate-editor="true"]`, `contentEditable="true"`. Coexiste con un `<textarea readonly>` oculto (mismo texto, es el que realmente lee el formulario/React Hook Form para saber si hay cambios) — **son dos nodos distintos**, y el bug documentado abajo (2026-09-29) es justo que dejaron de estar sincronizados.
- Las acciones (`save_variable`, `transfer_order`, `transfer_ticket`) son elementos **void** (`data-slate-void="true"`) — atómicos, no se pueden editar carácter por carácter, solo reemplazar enteros o dejarlos intactos.
- El endpoint `GET /prompt/{id}` devuelve el campo `prompt` con el texto editable MÁS una serialización de texto plano de los chips pegada al final (`save_variable(...) transfer_order(...)`) — **ese texto final no es parte del prompt editable real**, es un artefacto de la API. Copiarlo dentro de una edición produce texto duplicado visible al cliente (bug real ya cometido y corregido una vez).

## La técnica que SÍ funcionó repetidas veces (hasta el 2026-09-27)
1. Fetch fresco del prompt vivo por API (nunca confiar en una copia vieja).
2. Clipboard real del sistema operativo (`navigator.clipboard.writeText`, nunca `readText` — cuelga indefinidamente esperando un permiso que nadie va a responder).
3. Seleccionar el texto a reemplazar con un `Range` de JavaScript que termina **un carácter antes** del límite real de un chip void (técnica del "buffer character") — evita que Slate borre el chip atómicamente al tocar su borde.
4. Pegar con un **`Control+v` real** (evento de teclado genuino, nunca `execCommand`, que Slate rechaza).
5. Verificar con una recarga completa del servidor después de guardar — nunca asumir que "Guardar cambios" habilitado significa que se guardó.

## El bug nuevo, confirmado el 2026-09-29 (Q27, sin resolver)
La técnica de arriba dejó de sincronizar el `<textarea>` oculto con el DOM visible: el texto pegado se ve bien (chips intactos, contenido nuevo presente), pero el botón "Guardar cambios" queda deshabilitado porque el campo que React realmente lee no cambió. **Se aisló la causa**: escribir una sola letra real con el teclado (sin pegar nada) tampoco sincroniza — pero la misma prueba en un campo simple de texto (ej. "Nombre") sí funciona. Conclusión: no es un problema de técnica de pegado, es el editor de Instrucciones específicamente el que está roto para cualquier edición en ese momento (posible regresión del sitio o estado corrupto de esa sesión de navegador puntual — no confirmado cuál).

Se probaron 6 variantes distintas de selección/pegado y todas fallaron igual. Se probó además escribir el prompt directo por API (`PATCH /prompt/{id}`) saltando el editor — bloqueado por el clasificador de seguridad del entorno de Claude Code (categoría "Production Deploy"), no se insistió por otra vía.

**Investigación externa (repo `ianstormtaylor/slate`) aportó una pista parcial, no la causa completa**: Slate usa `ReactEditor.toSlateRange(editor, range, {suppressThrow: true})` al procesar un paste — si la conversión del DOM Range a un Slate Range falla, devuelve `null` **sin lanzar error ni loguear nada**, y el paste no llega al modelo aunque el navegador igual pegue el texto de forma nativa en el DOM. Un Range armado por JavaScript (en vez de un gesto real de mouse) es más propenso a esta falla, especialmente cerca de un elemento void. Esto explica el síntoma general, pero **no explica** por qué falló incluso un keystroke real lejos de cualquier chip — esa parte queda sin causa confirmada.

## Otros hallazgos de la misma familia de bugs (sesiones anteriores)
- `Ctrl+End` no mueve el cursor real, solo hace scroll visual — usar `Ctrl+A` + `ArrowRight` para colapsar al final.
- El `contentEditable` real puede vivir en `z-index:-1` en ciertos estados — `.click()` normal falla, hace falta `pressSequentially()` sobre el selector visible.
- "Guardar cambios" a veces solo se habilita después de que el editor pierde el foco (blur) — hacer clic afuera antes de intentar guardar.
- Un prompt puede quedar en un tercer estado corrupto (mezcla de dos versiones, etiqueta huérfana) sin que nadie lo edite a propósito — siempre verificar el conteo de caracteres/etiquetas contra un baseline conocido antes de asumir que el prompt vivo es el que se cree que es.

## Recomendación para la próxima sesión que necesite editar un prompt
Si el bug del 2026-09-29 persiste: probar en una sesión nueva del navegador (podría ser transitorio), o pedirle al usuario que pegue el texto a mano una vez (30 segundos, sin el riesgo de la edición por script) usando el archivo ya preparado — mismo criterio que ya se usó otras veces para agregar acciones nuevas por chip.

## Pendientes relacionados
Q27 (parche de Maxi/re-saludo bloqueado por este bug), A26 (incidente histórico de prompt corrupto por un fallo similar de pegado).
