# Copiloto de IA — visión del usuario + lluvia de ideas para la futura presentación (2026-11-01)

**Qué es este archivo**: material crudo para cuando se arme la presentación de "por qué conviene contratar el Copiloto". Es la primera prueba en vivo: el usuario compró 1 asiento (ver [[PENDIENTES]] Q41) y está completando el wizard de `/ai/copilot` logueado como Gian, en la cuenta de Fitness Suplementos. **No es la presentación**, es el insumo — separa lo que pidió el usuario, lo que el proveedor dice que existe (confirmado/prometido/sin respuesta) y las ideas nuevas que todavía no se probaron.

**Fuentes usadas**: dictado del usuario en esta sesión (2026-11-01), [[44-copiloto-webinar-y-podcast-dkw-2026-10-29]] y `wiki/entities/copiloto-ia.md`.

## 1. Lo que pidió el usuario, organizado

Dicho en una sola tanda (ver `17-registro-de-cambios.md` de hoy para el texto original). Lo reorganizo en bloques, sin agregar nada que no haya dicho:

**Para el gerente / líder de equipo** (aclaración del usuario: en esta cuenta el líder también vende, así que necesita las dos vistas)
- Informes de rendimiento por vendedor, por día/semana/mes.
- Poder preguntarle al Copiloto "¿cuáles fueron los errores de tal persona esta semana/hoy?".
- Saber cuántos negocios llegaron a "ganado".
- Si los vendedores ofrecen variedad de productos / intentan vender más (upsell).
- Organización de llamadas de venta.
- Analizar la cantidad de mensajes que manda cada vendedor.
- "Sacar todas las métricas" para que el líder pueda hacer crítica constructiva al equipo.

**Para el vendedor** (asistencia en la conversación)
- Sugerencia de respuestas.
- Ayuda con ruptura de objeciones.
- Automatizar follow-ups.
- Mejorar la conversión.

**Automatización operativa concreta**
- Envío del código de rastreo de DAC: a partir de una planilla con los contactos a avisar después de que sale un envío, que el Copiloto mande el mensaje con el código de rastreo y el link.

**Mejora continua**
- Que el Copiloto se vaya auto-mejorando siempre (pedido explícito del usuario).

**Alcance para esta prueba**
- "Como es una cuenta de test quiero que tenga todo en una" — activar todo lo que se pueda en un solo Copiloto de prueba, sin fragmentar por función.

## 2. Cruce contra lo que dice el proveedor (confirmado / prometido / sin respuesta)

Ninguna fila de esta tabla está verificada en nuestra cuenta — es lo que el proveedor mostró o dijo en el webinar/podcast (fuente [[44-copiloto-webinar-y-podcast-dkw-2026-10-29]]). Hay que probar cada una en vivo antes de usarla como prueba en la presentación.

| Pedido del usuario | Estado según el proveedor | Detalle |
|---|---|---|
| Sugerir respuestas | 🟢 Confirmado (fuente B) | "Resumen y respuesta sugerida, con botón Enviar", en el chat |
| Insights del lead | 🟢 Confirmado (fuente B) | — |
| Acciones ejecutables con un clic | 🟢 Confirmado (fuente B) | No dice el catálogo completo de acciones |
| Sacar métricas / planillas y gráficos a pedido | 🟢 Confirmado (fuente B) | Esto es lo que cubriría el pedido de "sacar todas las métricas" |
| Monitoreo de grupos de WhatsApp | 🟢 Confirmado (fuente A y B) | — |
| Copiloto personalizado por miembro del equipo | 🟢 Confirmado (fuente B) | Relevante para separar vista vendedor / vista gerente |
| Conexión con Gmail / Google Sheets | 🟢 Confirmado (fuente B) | Relevante para la planilla de contactos del DAC |
| Mejorar/reescribir el agente de ventas | 🟢 Confirmado con demo (fuente A) | El Copiloto propone cambios y los aplica **con aprobación humana paso a paso**, no solo |
| Envío masivo del código DAC (acción en lote sobre una planilla) | 🟢 **Confirmado en cuenta real, 2026-11-01** | El Copiloto ya armó 2 flujos de automatización reales ("Recontacto \| Recompra" y "Recontacto \| Remarketing") sobre una planilla de 60 contactos reales que él mismo generó leyendo los pipelines de Recompra/Remarketing — quedaron como tarjetas **pendientes de aprobación**, no se mandó nada solo. Mismo mecanismo serviría para el DAC. Detalle en `wiki/entities/copiloto-ia.md` |
| Crear flujos/pipelines nuevos | 🟢 Confirmado en cuenta real, 2026-11-01 | Mismo hallazgo de arriba |
| Auto-mejora continua y **autónoma** | 🟢 **Aclarado por el propio Copiloto, 2026-11-01 — no es autónoma** | En una conversación real explicó su modelo: no guarda memoria infinita sola; persiste por (1) instrucciones permanentes, (2) notas que graba en la ficha de cada contacto, (3) patrones repetidos que se promueven a un manual compartido. Todo con aprobación humana, "no mando mensagem sozinho" |
| "Quién vendió más" / ranking por ventas ganadas | 🔴 **Bloqueado hoy, no es problema del Copiloto** | El CRM de Fitness Suplementos no registra negocios como ganados (0 negocios ganados a la fecha). Sin ese dato cargado, ninguna IA puede sacarlo — ver punto 4 |

## 3. Ideas nuevas — lluvia de ideas, todavía no pedidas ni probadas

Esto es brainstorming mío a partir de lo que el proveedor dice que el Copiloto hace. **Ninguna de estas está confirmada ni probada** — son candidatas a testear en la cuenta de prueba antes de meterlas en la presentación.

**Para el gerente**
- IDEA: ranking semanal automático por tiempo de primera respuesta y tasa de respuesta a leads nuevos (no depende de "ganado", se puede medir hoy con los mensajes).
- IDEA: alerta de "lead frío" (sin respuesta hace X horas) para que el líder intervenga a tiempo.
- IDEA: resumen semanal de las objeciones más repetidas, para ajustar el guion de ventas.
- IDEA: detectar si un vendedor se está salteando pasos del guion (ej. no ofrece el combo, no menciona la garantía) — depende de que el Copiloto pueda leer las conversaciones completas, a confirmar.

**Para el vendedor**
- IDEA: un "brief" automático antes de cada conversación con el resumen del historial del cliente.
- IDEA: sugerencia de producto complementario según lo que el cliente ya compró (cross-sell), ligado al pedido de "ofrecer variedad de productos".
- IDEA: plantillas de respuesta a objeciones típicas (precio, envío, "lo voy a pensar") ajustadas al tono de la marca.

**Automatización operativa, más allá del DAC**
- IDEA: aviso automático de recompra a clientes recurrentes, ligado al funil de recompra ya documentado ([[14-funil-recompra]]).
- IDEA: encuesta corta de satisfacción post-entrega.

**Mejora continua**
- IDEA: pedirle al Copiloto, al cierre de cada semana, que proponga 1-2 ajustes al prompt del agente de ventas a partir de conversaciones reales — hoy esto se hace a mano con ChatGPT (ver [[34-arquitectura-conversacional-aprendizajes-agentes]]).
- IDEA: que arme el resumen ejecutivo mensual para gerencia, en vez de armarlo a mano como se hizo en [[28-traspaso-2026-09-15-deck-e-informe]].

## 4. Lo que hay que resolver antes de poder prometer esto en una presentación

- **✅ Resuelto 2026-11-01**: dónde se asigna el asiento a un usuario puntual — es adentro del propio Copiloto (`Copiloto → Equipe → Adicionar membros`), no en Usuários ni en Revenda. Detalle en `wiki/entities/copiloto-ia.md` y Q41.
- **El CRM no registra ventas ganadas** (0 negocios ganados hoy). Sin esto, cualquier métrica de conversión o "quién vendió más" es ficticia por más que el Copiloto exista. Esto ya estaba anotado en Q41 de `PENDIENTES.md`; lo repito acá porque es el riesgo más grande de prometer algo que no se puede mostrar.
- **Permisos y privacidad entre dueño/admin/vendedor siguen sin respuesta del proveedor** (Q41, punto 4). Importa en particular porque el pedido "que el líder vea los errores de tal vendedor" asume que eso es técnicamente posible y no genera un problema de privacidad con el equipo.
- **Acciones en masa / crear flujos** (el mecanismo real detrás del envío automático del DAC) sigue siendo una promesa del proveedor, no algo mostrado funcionando. Probarlo en la cuenta de test antes de prometerlo en la presentación.
- **Hoy hay 1 solo asiento comprado** (para Gian). Para probar en simultáneo la vista "vendedor" y la vista "gerente" hacen falta más asientos, o alternar las pruebas con el mismo usuario.

## 5. Próximo paso

No armar la presentación todavía — este archivo es el insumo. Cuando se arme, cruzar esta lista con `wiki/entities/copiloto-ia.md`, [[44-copiloto-webinar-y-podcast-dkw-2026-10-29]], y los resultados reales de la prueba con Gian, respetando la regla del proyecto de no decir lo obvio ([[27-reglas-diseno-presentaciones]]) y de no inventar cifras ni resultados que no se probaron.
