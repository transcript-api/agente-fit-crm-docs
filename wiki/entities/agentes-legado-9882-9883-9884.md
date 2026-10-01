# Los 3 agentes de la pipeline de test: Recepcionista (9882), Conversión (9883), Cierre (9884)

**Qué es**: el primer split de "Agente fit" (id 9816, un solo agente para todo) en 3 agentes especializados por etapa, hecho el 2026-09-15 sobre la pipeline de **práctica** `FV|FUNIL DE VENTAS`. Es el antecesor directo de [[agente-recepcionista-comercial-10005]] (que es una copia de 9882 adaptada a la pipeline real).
**Estado real (2026-09-23/24)**: aplicados y probados en la pipeline de test, con handoff funcionando de punta a punta. La iteración sobre estos 3 quedó **congelada** el 2026-09-24 a favor del experimento de 3 capas sobre 10005 — siguen existiendo pero no son la prioridad activa.
**Fuente primaria**: [[30-traspaso-2026-09-15-noche-3-agentes]], [[29-prompts-por-columna]] (el texto completo de los 5 prompts, incluidos los 2 que faltan crear).

## Mapa columna → agente (pipeline `FV|FUNIL DE VENTAS`, id 23843)

| Agente | id | Columna que atiende | Genera |
|---|---|---|---|
| Recepcionista | 9882 | `FV \| ENTRADA DE LEAD` | Confianza — no vende, no diagnostica, saca el dato mínimo |
| Conversión | 9883 | `FV \| CUALIFICACION` | Convicción — UNA recomendación de catálogo, explicada |
| Cierre | 9884 | `FV \| PROPUESTA ENVIADA` + `FV \| PAGO PENDIENTE` | Fluidez — si quiere comprar, deja de vender y opera |

Todos se pasan la conversación entre sí de forma **invisible** para el cliente (`transfer_order`, nunca "te paso con"). Para el cliente existe una sola persona: Santiago (en estos 3 agentes el nombre sigue siendo Santiago — es 10005 el que pasó a llamarse Maxi).

**Faltan crear** (prompts ya escritos en [[29-prompts-por-columna]], columnas `FV | SEGUIMIENTO` y `RECOMPRA - 30/60/90 DIAS`): agente **Seguimiento** (reabre la charla con un cliente que quedó sin cerrar, sin sonar a recordatorio) y agente **Recompra** (cliente que ya compró y se le termina el producto — el lead más caliente que hay, y hoy no lo atiende nadie). Ver Q7 en `PENDIENTES.md`.

## El mecanismo real de traspaso (lo que costó descubrir)

`transfer_order` mueve el **negocio** de columna, pero eso solo NO hace que el siguiente agente empiece a responder. Hace falta un segundo paso: un **Flujo de Automatización** por columna, disparador "Negócio mudou de etapa" (Pipeline + Etapa exactos) → acción "Agente de IA" (Vincular). La pantalla `Configuración → Colas` con un campo "Agente de IA" por cola **no es** el mecanismo real (se probó, ninguna cola lo tiene configurado).

Flujos construidos: `FV|Asignar Conversión.` (etapa `FV|CUALIFICACION` → Conversión) y `FV|Asignar Cierre` (etapa `FV|PROPUESTA ENVIADA`/`FV|PAGO PENDIENTE` → Cierre). Faltan 6 más (Seguimiento, Recompra × 3 columnas) — bloqueados por Q7 (esos agentes no existen todavía).

**Hallazgo crítico de timing (A33, con evidencia empírica del ticket real de "Santi", 2026-09-23)**: vincular un agente a una conversación **no lo hace procesar el último mensaje ya existente en el ticket** — solo responde al *siguiente* mensaje que llegue. `GET /processing-logs/ticket/{id}` lo confirma: cada registro de procesamiento tiene su propio `messageText`, y la vinculación en sí no genera ningún registro. Por eso la "pregunta puente" de Recepción (que reactiva al cliente y hace que responda algo nuevo) es hoy el mecanismo real que despierta al siguiente agente — no un detalle de estilo, es una necesidad técnica del CRM. No hay endpoint ni acción documentada para forzar que un agente recién vinculado procese el mensaje pendiente (S20, pregunta enviada a soporte).

## Estado técnico verificado (2026-09-24)

- **Recepcionista (9882)**: prompt restaurado tras un incidente de corrupción (ver [[metodologia-parche-quirurgico]] para el detalle del incidente y cómo se restauró), 3 acciones (`transfer_order` a `FV|CUALIFICACION` + 2 `save_variable`). Modo Avanzado, gpt-5.1.
- **Conversión (9883)**: modelo cambiado de `gpt-5-mini` (Reasoning, ignoraba el límite de tokens y a veces no llegaba a escribir respuesta) a `gpt-4.1-mini`. 4 acciones. Conector de Google Sheets adjunto (catálogo curado).
- **Cierre (9884)**: 8 acciones (4 `transfer_order` + 2 `save_variable` + 2 agregados a mano el 2026-09-24). Conector de Google Sheets adjunto. **Pendiente sin verificar (Q14)**: confirmar que no quedó en `gpt-5-mini` como le pasó a Conversión.

## Hallazgos de nombres que rompen `transfer_order` en silencio (N13, A28, A30)

El prompt y el CRM real no siempre coinciden carácter por carácter en nombres de columna (`FV\|CUALIFICACION` en el texto vs. `FV |  CUALIFICACION` real, con espacios y a veces doble espacio). La causa raíz confirmada en al menos un caso no fue el espaciado en sí, sino que la acción `transfer_order` quedaba con el campo "Coluna" vacío en su propio engranaje de configuración (desincronizado del chip visible) — reseleccionar la columna en el editor lo resuelve. **Regla práctica que queda de esto**: después de cualquier pegado/restauración de un prompt con `transfer_order`, abrir el engranaje de esa acción y confirmar que "Coluna" aparece seleccionado — el chip correcto y el contador de acciones (`AÇÕES: N`) no alcanzan como verificación.

## Pendientes relacionados
Q7 (crear Seguimiento y Recompra), Q8 (probar la cadena completa Recepcionista→Conversión→Cierre de punta a punta en un caso real, parcial), Q13/Q13b (fragmentos del prompt v3 posiblemente sin pegar, estado incierto porque el usuario siguió iterando por fuera del vault), Q14 (confirmar modelo de Cierre), A30 (mismo defecto de columna vacía a verificar en Cierre/Conversión), S20 (pregunta a soporte sobre el timing de vinculación, enviada).
