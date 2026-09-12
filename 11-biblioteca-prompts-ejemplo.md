# Biblioteca de Prompts de Ejemplo (plantillas del CRM) — referencia para escribir el de "Agente fit"

20 agentes de ejemplo disponibles para copiar en la plataforma (pasados por el usuario, 2026-09-10). **No son para usar literal** — son inspiración/patrones a robar y adaptar, el enfoque sigue siendo Fitness Suplementos, pero el patrón de estructura sirve para cualquier negocio futuro (ver nota del usuario: "aplicarlo a cualquier negocio... el funil debe ser increíble que venda como una locura en automático").

## 🔑 Hallazgo más importante: la API real de funciones del Analisador de Ações
Estos 20 prompts, en conjunto, revelan el **catálogo completo y los nombres exactos** de las funciones que el agente puede invocar (confirma y amplía lo que ya sabíamos de forma genérica en [[01-agente-de-ia]] y [[10-ds-agente-ds-voice-manual]]):

| Función | Qué hace | Ejemplo de uso visto |
|---|---|---|
| `save_variable("nombre_var", esPII)` | Guarda un dato de la conversación como variable en la ficha del contacto. El segundo parámetro (true/false) marca si es dato sensible/personal (PII) — ej. nombre, teléfono, responsable menor = `true`; contexto de negocio, dolor principal = `false`. | `save_variable("nome_lead",true)` |
| `add_contact_tag("tag")` | Aplica una etiqueta al contacto. Es el mecanismo central de scoring/clasificación (budget_ok, lead_quente, decisor, etc.) | `add_contact_tag("lead_quente")` |
| `transfer_ticket("Nombre de Cola")` | Transfiere la conversación a una cola humana específica. | `transfer_ticket("Vendas")` |
| `create_order("Pipeline","Columna")` | **Crea un negocio nuevo** en una pipeline/columna específica del CRM. | `create_order("Pipeline Fitness","Lead novo")` |
| `transfer_order("Pipeline","Columna")` | **Mueve un negocio existente** a otra pipeline/columna — es probablemente la función real detrás de la acción "Cambiar de Columna" que ya usamos en las automatizaciones, ahora confirmado que el AGENTE también puede invocarla directamente en medio de la conversación, no solo las automatizaciones de columna por tiempo. | `transfer_order("Vendas B2B","Em fechamento")` |
| `send_schedules()` | Envía los horarios disponibles de la agenda (Google Calendar vinculado) — igual a lo documentado en [[10-ds-agente-ds-voice-manual]]. | tras confirmar interés en agendar |
| `http_request("METODO","url","headers","body")` | Llamada a webhook/API externa, con variables interpolables tipo `{contactName}`. | abrir ticket interno de soporte |
| `close_ticket()` | Cierra el ticket cuando ya no hay nada más que resolver. | tras confirmar que el cliente quedó satisfecho |

**Relevancia directa**: cuando escribamos el prompt de "Agente fit", el `transfer_order()` es la pieza que nos faltaba para que el agente mueva la tarjeta dinámicamente según la conversación (ej. de Cualificación a Propuesta Enviada cuando termina de diagnosticar), en vez de depender solo de automatizaciones de tiempo por columna.

## 🔑 Patrón de estructura universal (los 20 ejemplos lo repiten)
```
# Persona
[quién es el agente, tono general, una frase]

# Regras / Princípios (absolutas)
[lista corta de cosas que NUNCA debe hacer — precio/descuento sin aprobación, inventar info, saltar etapas]

# Fluxo
## Etapa 1 — [nombre]
[qué preguntar, UNA pregunta por vez]
[qué guardar/etiquetar según la respuesta]

## Etapa 2 — ...
(y así, en orden, sin saltar etapas)

## Etapa N — Encerramento
[resumen, y transfer_ticket / create_order / transfer_order condicional según el resultado de las etapas anteriores]

# Tom de voz
[nunca markdown/bullets en la respuesta real — texto en párrafo corrido, como se escribe en WhatsApp]
```

Reglas universales que se repiten en TODOS los ejemplos (candidatas fuertes a incluir tal cual en el prompt de Agente fit):
- **"UMA pergunta por mensagem. Espere a resposta antes de avançar."** — nunca bombardear con varias preguntas juntas.
- **"NUNCA prometa preço/prazo/desconto sem aprovação."** — coincide con nuestro guardrail ya planeado (ver [[06-seguridad-y-pendientes]]).
- **"NUNCA invente informação que não foi confirmada."**
- **Tono sin markdown, párrafo corrido** — nada de viñetas/negrita en el mensaje real, porque no se ve bien en WhatsApp.

## Los 3 ejemplos más relevantes para Fitness Suplementos (texto completo guardado)

### 1. "Personal Trainer / Academia – Captação" — el más cercano a nuestro rubro
```
# Persona
Consultor(a) da {{academia_estudio}}. Tom motivador, profissional, próximo.

# Objetivo
Qualificar o lead e propor um plano aderente.

# Regras absolutas
- UMA pergunta por vez.
- NUNCA dar avaliação física pelo chat.
- NUNCA prometer "X kg em Y dias".

# Fluxo

## Etapa 1 — Objetivo principal
Pergunte o objetivo principal (emagrecer, hipertrofia, condicionamento, reabilitação, performance).
- Emagrecer: add_contact_tag("obj_emagrecer")
- Hipertrofia: add_contact_tag("obj_hipertrofia")
- Condicionamento: add_contact_tag("obj_condicionamento")
- Reabilitação: add_contact_tag("obj_reabilitacao"), depois transfer_ticket("Fisioterapia").
- Performance: add_contact_tag("obj_performance")

## Etapa 2 — Histórico de atividade
Pergunte há quanto tempo está parado e se já treinava antes. Registre:
save_variable("historico_atividade",false)

## Etapa 3 — Restrições
Pergunte se tem restrição médica, lesão ou condição relevante. Registre:
save_variable("restricoes",false)
- Se mencionar restrição: add_contact_tag("tem_restricao") e recomende avaliação médica antes de qualquer plano.

## Etapa 4 — Disponibilidade
Pergunte os dias e horários disponíveis na semana e registre:
save_variable("disponibilidade",false)

## Etapa 5 — Modalidade
Pergunte se prefere online, presencial ou híbrido.

## Etapa 6 — Investimento
Pergunte a faixa de investimento e registre:
save_variable("faixa_investimento",false)

## Etapa 7 — Encerramento
create_order("Pipeline Fitness","Lead novo")
Ofereça uma avaliação gratuita.
- Se aceitar: add_contact_tag("avaliacao_agendada"), depois send_schedules() e transfer_ticket("Personal Trainer").
- Se não aceitar: transfer_ticket("Atendimento Academia").

# Tom
Motivador, profissional, sem markdown.
```
**Nota de adaptación**: es para servicio presencial con evaluación/agenda — nuestro negocio es venta de producto por chat, no servicio con cita. La ETAPA 1 (objetivo: emagrecer/hipertrofia/etc.) es oro puro y coincide con lo que ya documentamos que hace Santiago en la vida real (ver [[04-patrones-reales-de-venta]]) — usarla tal cual como base de la etapa de Cualificación.

### 2. "Reativador de Base Inativa" — mapea directo a nuestra columna Seguimiento/Remarketing más fría
```
# Persona
Atendente da {{empresa}} reaproximando contatos que não interagem há 90+ dias. Tom curioso, não-invasivo, oferecendo valor.

# Objetivo
Descobrir POR QUE o contato parou de interagir e ofertar um incentivo personalizado conforme o motivo.

# Regras absolutas
- NUNCA pressione. Se a pessoa disser "não quero mais", encerre educado.
- NUNCA invente cupom — use APENAS {{cupom_autorizado}}.

# Fluxo

## Etapa 1 — Abertura leve
"Oi {{nome}}, faz um tempo que a gente não conversa! Tudo bem por aí?"

## Etapa 2 — Entender o motivo
Pergunte: "O que aconteceu? Ainda faz sentido a {{empresa}} pra você?"
save_variable("motivo_inativo",false)

## Etapa 3 — Diagnóstico e ação
- "Achei caro": add_contact_tag("inativo_preco") e ofereça {{cupom_autorizado}} (apenas se autorizado).
- "Não preciso mais": add_contact_tag("perdido"), agradeça e pergunte se pode retirar das próximas mensagens.
- "Esqueci/sumi": add_contact_tag("retomada"), envie 1 novidade e {{cupom_autorizado}} (se houver).
- "Tive problema": add_contact_tag("teve_problema"), depois transfer_ticket("Customer Success").
- Outro: add_contact_tag("inativo_outro").

## Etapa 4 — Encerramento
- Se demonstrou interesse: create_order("Reativação","Lead quente"), depois transfer_ticket("Vendas").
- Se aceitou o cupom: add_contact_tag("cupom_enviado").

# Tom
Curioso, não-invasivo, sem markdown.
```
**Nota de adaptación**: esto es EXACTAMENTE el mecanismo que necesitamos para el nivel más frío de Seguimiento/Remarketing (`FV|Cualificacion - Sin Respuesta`, ver [[07-estrategias-pendientes-agente]]) — pregunta el motivo antes de ofrecer nada, y usa `{{cupom_autorizado}}` como variable (nunca inventado) en vez de un texto fijo — resuelve directamente el problema de "no ofrecer promo de proteína a quien preguntó por creatina" con una variable dinámica en vez de un mensaje hardcodeado.

### 3. "Gestor de Cupons e Promoções" — resuelve el problema pendiente del cupón dinámico
```
# Persona
Atendente promocional da {{empresa}}. Tom animado, direto.

# Objetivo
Verificar a elegibilidade do contato pra {{promo_ativa}} e entregar o cupom quando aplicável.

# Regras
- NUNCA dê cupom fora das regras (validade vencida, tag duplicada, fora do público).
- Registre cada entrega com tag.

# Fluxo

## Etapa 1 — Abertura
"Oi {{nome}}! Saiu uma promo nova: {{descricao_promo}}. Posso te enviar o cupom?"

## Etapa 2 — Verificar elegibilidade
Pra ser elegível, o contato precisa ter TODAS as tags: {{tags_requeridas}}.
- Se já tem a tag "cupom-{{cupom_codigo}}-enviado": add_contact_tag("cupom_duplicado") e diga que já tem esse cupom.
- Se não-elegível por tag: add_contact_tag("nao_elegivel") e ofereça a alternativa {{alternativa}}.
- Se elegível: entregue o cupom e add_contact_tag("cupom_{{cupom_codigo}}_enviado").

## Etapa 3 — Regras do cupom
Sempre informe: validade, valor mínimo, como aplicar.
```
**Nota de adaptación — esto es la pieza que nos faltaba**: usa **tags como filtro de elegibilidad** (`{{tags_requeridas}}`) para decidir qué cupón corresponde a qué contacto — exactamente lo que necesitábamos para el sistema de "cupón según interés del producto" (ej. tag `interes_creatina` → solo elegible para cupón de creatina). Y previene reenviar el mismo cupón dos veces marcando `cupom_X_enviado`. **Este patrón queda como la plantilla a usar cuando implementemos los cupones dinámicos** (ver sección correspondiente en [[07-estrategias-pendientes-agente]]).

## Resto de la biblioteca (17 ejemplos, referencia rápida — no copiados completos por no ser prioritarios para este negocio)

| Nombre | Categoría | Modelo | Patrón clave a rescatar |
|---|---|---|---|
| Qualificador de Leads BANT | Ventas | — | Budget/Authority/Need/Timeline clásico, tagueo por cada eje |
| Captação Imobiliária | Inmobiliaria | — | Filtra por decisor antes de asignar a consultor senior vs. junior |
| Suporte N1 com Base de Conhecimento | Soporte | — | Máximo 2 intentos con la base de conocimiento antes de escalar — límite explícito de reintentos |
| Onboarding de Cliente SaaS | Onboarding | — | Checklist de activación con tags de progreso, "no saltar a valor sin 3 items confirmados" |
| Concierge VIP | Servicio premium | — | Nunca decir "no" sin alternativa; siempre confirmar detalles antes de cerrar |
| NPS Conversacional | Marketing | gpt-4o-mini | Clasificación por rango de nota (detractor/neutro/promotor) con acción distinta cada una |
| Vendedor B2B Consultivo | Ventas | gpt-4o | Metodología SPIN, no habla de producto hasta entender el dolor primero |
| Captação para Escola/Curso | Educación | gpt-4o-mini | Detecta menor de edad → pide datos del responsable en vez del alumno |
| Concessionária – Captação | Automotriz | gpt-4o-mini | Pregunta si hay vehículo en parte de pago antes de precio final |
| Suporte SaaS com Tickets | Soporte técnico | gpt-4o | Diagnóstico técnico estructurado + `http_request` real para abrir ticket interno |
| Boas-vindas + Segmentação | Marketing | gpt-4o-mini | Límite duro de 5 mensajes máximo — segmentación ultra rápida |
| Cobrança & Negociação Amigável | Financiero | gpt-4o-mini | Tono nunca amenazante, ofrece hasta 3 opciones de pago |
| Pós-venda + NPS | Marketing | gpt-4o-mini | Tiene un **Follow-up automático nativo configurado**: "Pesquisa NPS 7 dias após fechamento" — confirma que el Follow Up (ver [[10-ds-agente-ds-voice-manual]]) se puede disparar días después del cierre de venta, no solo horas |
| Captação Plano de Saúde | Salud/seguros | gpt-4o-mini | Detecta condición preexistente → escala a corredor senior |
| Onboarding de Comunidade | Comunidad | gpt-4o-mini | Segmentación por interés con tags, dirige a canales específicos |
| Tradutor Multi-Idioma | Utilidad | gpt-4o-mini | Detecta idioma en el primer mensaje y responde siempre en ese idioma |
| Assistente Financeiro – Consulta | Interno | gpt-4o | Agente de SOLO LECTURA, enmascara datos sensibles (CPF, cuenta) — nunca ejecuta transacciones |
| Pet Shop / Veterinária | Salud animal | gpt-4o-mini | **Triaje de urgencia SIEMPRE primero**, antes de cualquier otra pregunta — patrón de "detectar emergencia y escalar antes que nada" |

## Ideas para aplicar al prompt de "Agente fit" (Fitness Suplementos) — anotadas, no implementadas todavía
1. Usar la Etapa 1 de "Personal Trainer" (objetivo: emagrecer/hipertrofia/condicionamiento/performance) como base de la etapa de Cualificación — ya coincide con cómo diagnostica Santiago en la vida real.
2. Usar el patrón de "Gestor de Cupons" (tags de elegibilidad + tag anti-duplicado) para resolver el problema pendiente del cupón dinámico por interés (ver [[07-estrategias-pendientes-agente]]).
3. Usar el patrón de "Reativador de Base Inativa" (preguntar el motivo antes de ofrecer algo) para el nivel más frío de Seguimiento (`FV|Cualificacion - Sin Respuesta`).
4. Usar `transfer_order()` (confirmado que existe) para que el agente mueva la tarjeta de columna dinámicamente según el avance real de la conversación, no solo depender de las automatizaciones por tiempo que ya armamos.
5. Adoptar como reglas universales del prompt: "una pregunta por mensaje", "nunca prometer precio/descuento sin aprobación", "nunca inventar info", "nunca markdown en la respuesta, párrafo corrido natural de WhatsApp".
6. El patrón de "Pet Shop" (triaje de urgencia primero) podría adaptarse como "si el cliente menciona una reacción adversa/alergia al producto, escalar a un humano de inmediato, antes que cualquier otra lógica de venta" — relevante tratándose de suplementos (tema de salud).

## Cómo se usa este archivo
Es una biblioteca de referencia — no un plan de ejecución. Cuando se escriba el prompt real de "Agente fit", volver acá a buscar el patrón/función que corresponda en vez de inventar de cero.
