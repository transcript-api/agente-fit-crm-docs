# Metodología de parche quirúrgico — cómo se edita un prompt en producción sin romperlo

**Qué es**: el método de trabajo que se volvió estándar del proyecto para cualquier cambio a un prompt ya en producción, después de varios incidentes reales de corrupción y de ediciones que "sonaban bien" pero rompían algo que ya funcionaba.
**Fuente primaria**: `17-registro-de-cambios.md` (múltiples sesiones, especialmente 2026-09-23, 09-25, 09-27), [[42-diff-recepcionista-comercial-rev4-merge-2026-09-25]] (el ejemplo más documentado del método completo).

## El método, paso a paso
1. **Fetch fresco del prompt vivo por API antes de tocar nada** — nunca asumir que el vault o un commit anterior refleja lo que está pegado en el CRM ahora. Pasó más de una vez que el CRM vivo divergió de git sin que nadie lo notara hasta auditar a mano.
2. **Calcular el SHA256 del prompt vivo y abortar el script si no coincide** con el que se capturó al empezar a diseñar el cambio — evita aplicar un diff calculado contra una versión que ya cambió.
3. **Cada reemplazo de texto se hace con un anchor verificado por `assertOnce()`**: el texto exacto a reemplazar debe aparecer **una y solo una vez** en el prompt entero, si no el script aborta con error en vez de reemplazar la ocurrencia equivocada. Nunca reescribir un bloque entero cuando un cambio quirúrgico alcanza.
4. **Nunca duplicar información en el pegado.** El endpoint `GET /prompt/{id}` devuelve un texto de serialización de acciones pegado al final del campo `prompt` que NO es parte del prompt editable — copiarlo produce texto duplicado visible al cliente. Verificar esto antes de guardar, no después.
5. **Verificar después de aplicar, contra el servidor, en frío (recarga completa)**: longitud en caracteres, cantidad de etiquetas abiertas/cerradas balanceadas, las acciones (`save_variable`/`transfer_order`/`transfer_ticket`) presentes e intactas, y — si se puede — el SHA256 del texto final contra lo que se pretendía aplicar. "Guardar cambios" deshabilitado NO es prueba de que se guardó bien; hay que releer.
6. **Documentar el diff completo**: qué se agregó (ADDED), qué se corrigió (CHANGED), qué se sacó (REMOVED, idealmente nada salvo que sea el objetivo explícito), qué se dejó igual a propósito (PRESERVED) y por qué, y qué del pedido original NO se incorporó y el motivo. Un diff sin esto no se puede auditar después.
7. **Si aparece una contradicción real fuera del alcance pedido**, corregirla igual (citando el permiso explícito si el pedido lo daba, ej. "salvo que haya una contradicción directa"), mencionándolo explícitamente como una desviación del alcance — nunca silenciarla ni expandir el alcance sin decirlo.
8. **Correr los casos de regresión ANTES de dar por cerrado el cambio**, nunca asumir que el diff está bien porque el texto se ve razonable. Ver [[agente-recepcionista-comercial-10005]] para los casos REC-LIVE reales corridos así.
9. **Preservar los artefactos con nombres explícitos**, incluidos los que salieron mal (ej. `...-CON-BUG-texto-duplicado-no-usar.txt`) — nunca borrar evidencia de un incidente, por regla del proyecto.

## Incidentes reales que motivaron cada regla (para no repetirlos)
- Un prompt quedó con una etiqueta huérfana `</CONTROL_FINAL>` seguida de ~2150 líneas de un prompt histórico completo usado como baseline de comparación — nadie lo editó a propósito, quedó de un pegado anterior mal hecho. Motivó la regla de verificar SHA256/longitud antes de asumir qué versión está viva.
- Un patch se pegó incluyendo, sin querer, el texto de serialización de acciones del propio endpoint de la API, duplicando visualmente las acciones como texto plano al cliente. Se detectó antes de guardar, comparando contra el patrón esperado. Motivó la regla 4.
- Un cambio de columna quedó con el campo "Coluna" vacío en el engranaje de la acción `transfer_order` pese a que el chip visible y el contador de acciones se veían correctos — un `transfer_order` "verde" en pantalla no prueba que la columna esté resuelta. Ver [[agentes-legado-9882-9883-9884]] para el detalle completo de este caso (A28).
- El editor de Slate dejó de sincronizar el pegado con el campo real del formulario (2026-09-29) — ver [[editor-slate-instrucciones]] para el bug completo, que bloqueó por primera vez la aplicación de un parche pese a seguir el método al pie de la letra.

## Cuándo NO usar este método
Para agregar una sola acción (un chip de `save_variable`/`transfer_order` nuevo), es más simple y más seguro pedirle al usuario que arrastre el chip a mano (30 segundos) que editarlo por script — reservar la automatización para lectura/verificación, no para escritura de acciones nuevas, según lo aprendido en [[agentes-legado-9882-9883-9884]].
