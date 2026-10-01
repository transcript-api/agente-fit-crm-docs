# Flujos de Automatización — el motor avanzado (distinto de la automatización de columna)

**Qué es**: constructor visual tipo diagrama (React Flow, nodos conectados) en `Automatizaciones → Flujos de Automatización`, mucho más potente que las "Automatizaciones y webhooks" de columna (que solo tienen 2 gatillos y acciones de envío limitadas). Es donde vive toda la lógica real de vinculación de agentes, renovación de tokens y remarketing masivo.
**Fuente primaria**: [[15-flujos-automatizacion-avanzados]], [[18-integracion-bling]], [[31-envio-masivo-remarketing-cupon]], [[30-traspaso-2026-09-15-noche-3-agentes]].

## Catálogo de gatillos disponibles
Webhook, Evento de app, Instagram, **(agente de IA)** — el agente puede disparar un Flujo completo por su cuenta vía "Disparar fluxo de automação" —, **Primeira mensagem**, Quando mensagem for..., **Tag Atribuída**, Fila Atribuída, Disparo manual, Agendamento, Contato criado, **Contato inativo**, Conversa encerrada, **Negócio mudou de etapa**, Negócio ganho, Negócio perdido.

## Catálogo de acciones/nodos
**Ações**: Conversa (Criar/Transferir/Buscar), Apps (conectores del Hub, ver [[hub-de-integraciones]]), Contato, Negócio, Enviar Mensagem (texto/mídia/botões, mucho más rico que la acción de columna), Pergunta (11 tipos de validación: texto libre, email, teléfono, CPF, dirección, archivo...), Reagir à Mensagem, Salvar Variável, Tags, **Agente de IA** (Vincular/Remover), Requisição HTTP, **Data & Hora** (Somar/Subtrair tempo — resuelve con precisión el cálculo de fechas de recompra), Script (JS puro, sin `fetch`, sandbox sin red), Criar/Atualizar Caso de Suporte.
**Controle de Fluxo**: Condicional (if/else real), Randomizador, Delay (pestañas Tempo y **Data Específica** — la ideal para "dormir hasta una fecha exacta"), Ir Para (GOTO real), Para cada item (loop, tope 100 ítems).

Gotchas de UI recurrentes: insertar un nodo desde el "+" en medio de una conexión SIEMPRE agrega el sub-tipo "Criar" por defecto — para "Buscar"/"Transferir" hay que clickear el nombre del campo ya insertado. "Testar" simula sin llamar HTTP real (dice `(não executada no teste)`); "Executar passo" dentro de un nodo individual sí ejecuta GETs reales. Un flujo con gatillo "Agendado" no tiene "Executar agora", solo "Testar".

## Flujos reales construidos y su estado

| Flujo | id | Gatillo → Acción | Estado |
|---|---|---|---|
| `CL\|Asignar Recepcionista` | 6052 | Primeira mensagem (conexión Fitness Suplementos) → Buscar Conversa → Vincular [[agente-recepcionista-comercial-10005]] | Publicado, verificado sin errores. Diagnóstico de por qué "un lead nuevo no dispara nada" resuelto (ver [[agente-recepcionista-comercial-10005]] — el problema real está después, en el worker de invocación del modelo, no en este flujo) |
| `FV\|Asignar Conversión.` | 5523 | Negócio mudou de etapa (`FV\|CUALIFICACION`) → Buscar Conversa → Vincular Conversión (9883) | Activo, funcionando |
| `FV\|Asignar Cierre` | — | Negócio mudou de etapa (`FV\|PROPUESTA ENVIADA`/`PAGO PENDIENTE`) → Vincular Cierre (9884) | Activo |
| `FV\|Bling - Renovacion de Token` | 5117 | Agendado, cada 5h → renueva `access_token`/`refresh_token` de Bling en el contacto fijo "Sistema - Bling Token" | Publicado y activado, pero su primera corrida real falló (`invalid_grant`) — ver [[integracion-bling]] |
| `FV\|Bling - Alerta de Stock Bajo` | 5118 | Agendado 1x/día (10:05) → recorre el catálogo, filtra stock bajo, manda WhatsApp al admin | Construido, cobertura limitada a 100 de ~1094 productos por el bug de Bling (B2) |
| `FV\|Recompra - Reactivación` | — | Negócio mudou de etapa (`FV|VENTA GANADA`) → Delay 30 días fijo → Tag → Buscar Conversa → Vincular Agente Fit | Publicado en estado **Off**. Apareció apagado también en una revisión posterior (N24) — no confirmado si es intencional |
| `Novo Fluxo` | 1107 | Primeira mensagem → Menú de opciones (Masa Muscular/Perder Peso/Energía) → Bye | **Estuvo en producción real** (confirmado en una conversación real de junio 2026) — NO BORRAR nunca sin confirmar. Apareció con el Status apagado el 2026-09-19 y de nuevo confirmado apagado el 2026-09-24 — **urgente sin resolver (N24)**: si es un apagado no intencional, leads reales pueden no estar recibiendo el menú de bienvenida |
| `TEST - Envío Campaña` / `TEST - Reacción Canjear` | 5798 / 5797 | Ver [[remarketing-masivo]] | Probados de punta a punta con éxito, en fase de pulido antes de escalar |

## Hallazgo de arquitectura importante para Fit Brain
El nodo **Apps** conecta con los conectores ya vinculados en el Hub (Google Sheets, Gmail...) **desde un Flujo**, no solo desde el agente — permite que un Flujo consulte el catálogo *por fuera* del agente y le deje el dato servido en una variable, sin depender de que el modelo decida llamar la herramienta. Es la vía más determinística que se encontró para evitar que el agente invente un dato porque no llamó la herramienta a tiempo. Ver [[fit-brain-vision]].

## Pendientes relacionados
N24 (🔴 urgente, confirmar si `Novo Fluxo` y `FV|Recompra - Reactivación` siguen apagados y por qué), Q9 (faltan 6 de 8 flujos de vinculación agente↔columna, bloqueados por Q7), B1 (tokens de Bling sin persistir en el contacto tras la última renovación fallida).
