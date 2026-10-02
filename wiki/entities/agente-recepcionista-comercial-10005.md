# Agente Fit - Recepcionista Comercial (id 10005)

**Qué es**: el agente de IA que atiende la primera etapa de la pipeline REAL de la empresa (`CL | COMERCIAL`), en producción, atendiendo clientes de verdad. Es el experimento activo del proyecto — no confundir con el Recepcionista de test (9882, ver [[agentes-legado-9882-9883-9884]]).
**Estado real (2026-09-29)**: aplicado y respondiendo en vivo, con bugs de infraestructura confirmados sin resolver (ver abajo) y un parche de contenido redactado sin poder aplicarse (bloqueo técnico del editor).
**Fuente primaria**: [[30-traspaso-2026-09-15-noche-3-agentes]], [[41-propuesta-recepcionista-comercial-clasico-2026-09-24]], [[42-diff-recepcionista-comercial-rev4-merge-2026-09-25]], `PENDIENTES.md` Q18-Q33.

## Por qué existe como rama separada

El agente se creó duplicando el Recepcionista de test (9882) para la pipeline real (`CL | COMERCIAL`), y quedó por casualidad en **Modo de ejecución Clásico** (no Avanzado, que es el recomendado y el que usa 9882). El usuario decidió **aprovechar eso a propósito** en vez de corregirlo: Clásico separa dos llamadas al modelo — un "Analisador de Ações" decide qué función ejecutar (lee `{{FUNCOES_DISPONIVEIS}}` + `{{INSTRUCOES_BOT}}` + `{{ACOES_EXECUTADAS}}`), y otra llamada redacta la respuesta al cliente. Esto separa dos responsabilidades que en Avanzado conviven forzadas en un solo prompt. Ver [[arquitectura-conversacional]] para el porqué completo de esta decisión (congela la iteración v49.x del 9882 y usa 10005 como piloto real de 3 capas: prompt / analizador / guardrails).

## Configuración técnica (confirmada en vivo, 2026-09-24)

| Campo | Valor |
|---|---|
| Proveedor | OpenAI |
| Modelo | gpt-5.1 (Reasoning) |
| Temperatura | 1 (fija, los modelos reasoning no la permiten ajustar) |
| Máx. mensajes en historial | 15 |
| Máx. Tokens en respuesta | 216 (ignorado por modelos reasoning) |
| Delay para responder | 28 segundos |
| Modo de ejecución | **Clásico** (deliberado, ver arriba) |
| Dividir respuestas en bloques | ON |
| Responder tickets con asignado | ON |
| Desactivar agente al responder fuera de la plataforma | ON |

## Las 3 capas actuales

### 1. Prompt conversacional (Instrucciones)
28945 caracteres al 2026-09-28 (última versión confirmada en vivo). Estructura en bloques con etiquetas: `REGLAS_CRITICAS`, `IDENTIDAD`, `OBJETIVO`, `ORDEN_DE_DECISION` (el árbol central de decisión, evalúa TODOS los mensajes nuevos de una ráfaga como conjunto antes de responder), `VERDAD_COMERCIAL`, `ANUNCIOS`, `INTEGRIDAD_DE_PRECIOS`, `BIENVENIDA`, `RESPONDER_PRIMERO`, `PREGUNTAS` (descubrimiento/operativa/puente), `IDENTIFICACION`, `CLIENTE_DIRECTO`, `DISPONIBILIDAD`, `OBJETIVOS_Y_KITS`, `MARCAS`, `PAGOS`, `MAYORISTA`, `COMPRAS_ANTERIORES`, `PRODUCTO_AMBIGUO`, `RESPUESTAS_AMBIGUAS`, `SEGURIDAD`, `LOGISTICA`, `URGENCIA`, `VARIABLES`, `TRANSFERENCIA`, `MEMORIA`, `ESTILO`, `CONTROL_FINAL` (checklist de 17 puntos antes de enviar cada mensaje).

El nombre del agente es **Maxi** (no "Santiago" — corregido y unificado el 2026-09-25, ver Q25 en `PENDIENTES.md`; sin embargo hay evidencia real en producción de que el modelo dice "Santiago" en algunos primeros mensajes pese a que el texto del prompt no lo contiene en ningún lado — ver el parche Q27 más abajo).

Las 4 acciones configuradas (chips reales, no texto): `save_variable("interes_inicial",...)`, `save_variable("anuncio_origen",...)`, `transfer_order("Pipeline CL |  COMERCIAL","CL | EN CONVERSACION")`, `transfer_ticket("comercial",{"priority":"after_response"})`.

### 2. Analizador Clásico (Reglas personalizadas del analizador)
4869 caracteres al 2026-09-27. Define, en portugués/español mixto, la precedencia de intención (seguridad > compra directa > consulta concreta > mayorista > objetivo/asesoramiento > descubrimiento) y la fuente válida de cada variable (`interes_inicial` = exclusivamente el cliente; `anuncio_origen` = el sistema/anuncio, nunca al revés). Texto completo en `artefactos/recepcionista-comercial-10005-analizador-patch-2026-09-27.txt`.

### 3. Guardrails
6 tipos activos: "No sonar a bot ni prometer de más" (41 frases al 2026-09-25 21:04 UTC, subiendo desde 28 el 2026-09-24), "No mandar mensajes vacíos", "No volver a presentarse", "Fillers de apertura", "No filtrar placeholders", "No filtrar etiquetas de media". Ver [[guardrails-y-analizador]] para el detalle de qué cubre cada uno y por qué el matcher de frases tiene límites reales (no respeta límites de palabra ni acentos).

## Bugs y hallazgos confirmados en producción (los que importan para no repetir el diagnóstico)

- **No-invocación silenciosa (Q26, 2026-09-29, sin resolver, no es culpa del prompt).** El agente queda vinculado (`promptId: 10005`, `disableAgent: false`) pero en algunos tickets nunca se invoca al modelo — `GET /processing-logs/ticket/{id}` devuelve `logs: []` indefinidamente, no es que tarda. Confirmado en 3+ tickets reales. Activar manualmente por "Gerenciar Agente" a veces coincide con que arranque a responder, pero se probó que **no es causal ni confiable** (un ticket activado a mano siguió sin responder 2.5 min después). Es un fallo de la plataforma (worker/cola), no del prompt ni del flujo de automatización — el flujo de vinculación (`CL|Asignar Recepcionista`, id 6052) se verificó corriendo perfecto, sin errores.
- **Re-saludo tras una pausa (confirmado en vivo, sin resolver).** El agente vuelve a presentarse ("Buenas, cómo estás? Maxi de Fitness Suplementos...") en medio de una conversación ya activa después de un gap de tiempo, pese a que `REGLAS_CRITICAS` regla 1 y `CONTROL_FINAL` check 1 dicen explícitamente que solo hay que saludar si "todavía no existe ningún mensaje previo de Maxi".
- **Mención ocasional de "Santiago" (confirmado en vivo, sin resolver).** El modelo dice "Santiago" en el primer mensaje de algunos tickets, pese a que el prompt vivo tiene **cero** ocurrencias de esa palabra (verificado leyendo el texto completo). Hipótesis no confirmada: sesgo del modelo hacia el nombre usado en meses de documentación/entrenamiento implícito del proyecto, más fuerte al generar un saludo "desde cero" sin mensajes previos de Maxi como ancla.
- **Lead sin respuesta cuando el guardrail de frases bloquea (Q31, 2026-10-01, sin resolver).** Ticket 7734800: Maxi redactó dos borradores ("Creatina XTR trabajamos sí", "Trabajamos con creatina XTR sí") y el guardrail "No sonar a bot" los bloqueó a los dos (choque con `xtr trabajamos` y `trabajamos con creatina`); tras los reintentos no se envió nada y el lead que quería comprar quedó sin respuesta (log `enviado: false`, evento `guardrail_violation`). Es el costo de ampliar la lista de frases el 2026-09-25: corrige un defecto de estilo pero puede dejar a un lead mudo. Ver [[guardrails-y-analizador]].
- **Vendedor humano responde antes que el agente (no es un bug, es esperado).** Si un vendedor contesta manualmente desde el WhatsApp conectado antes de que el delay de 28s del agente corra, el CRM detecta la respuesta humana (`sendBySystem: false` en esos mensajes) y pone `disableAgent: true` — comportamiento correcto, evita duplicar respuesta. El problema real detrás de esto es de coordinación de equipo (el equipo sigue atendiendo manual desde el celular), no técnico.
- **Editor de Instrucciones (Slate.js) roto para cualquier edición, sesión 2026-09-29.** Ver [[editor-slate-instrucciones]] para el detalle técnico completo — es la causa de que el parche Q27 (ver abajo) no se haya podido aplicar todavía.

## Parche redactado y verificado, NO aplicado (Q27, 2026-09-29)

Corrige "Santiago"→exclusivamente Maxi y el re-saludo, con la misma metodología de anclas de sesiones anteriores (fetch fresco del prompt vivo, script con `assertOnce()` por cada reemplazo). Texto final: 30026 caracteres, 28/28 etiquetas, 4 acciones intactas. Archivo: `artefactos/recepcionista-comercial-10005-patch-2026-09-29.txt`. Bloqueado por el bug del editor — ver [[editor-slate-instrucciones]].

## Pendientes relacionados
Q26 (no-invocación, crítico, bloqueado por rmsystemm), Q27 (parche Maxi/re-saludo, bloqueado por el editor), Q29 (el guardrail `duplicate_greeting` no atrapó un re-saludo), Q31 (lead mudo por el filtro de frases), Q33 (dos detalles de redacción en respuestas buenas), Q22 (pruebas de handoff completo pendientes), Q23 (el token de Meta viaja en texto claro en `GET /messages/{ticketId}`, decidir rotación), A27 (clave API de OpenAI expuesta en el árbol de accesibilidad — rotar antes de más tráfico real).
