# 49 · Hermes: recepción v2 (2026-11-08)

Estado: **instalado en producción el 2026-11-08 a las 20:22 UTC** (17:22 en Uruguay; lo anterior a esa hora es la versión vieja), sin verificar todavía con clientes reales. Versión "se va a ir mejorando".

## Por qué

En el monitoreo del 08/11 se repitieron siempre los mismos fallos:

- **Preguntas que no venden:** "Ya venís tomando o sería tu primera vez?" en casi todas las primeras respuestas, también con compradores decididos.
- **"Te confirmo bien ese precio":** frase vacía cuando el precio no estaba. Estaba permitida a propósito en 4 lugares (config, estilo y las instrucciones de A05 y A06).
- **Pase a vendedor apresurado:** el lead pasaba por una regla fija de 2 turnos mientras el cliente seguía preguntando cosas que Hermes sabía responder, como la promo de 2 o "están en Rivera?".
- **Salud:** cualquier mención de una condición (hormonas, alergia, hipertensión) pasaba el lead a vendedores en silencio.
- **Señales de IA:** "¿" de apertura, comillas «», punto y coma, el mismo saludo siempre.

## Pedidos del dueño (08/11)

- **Precio solo si lo preguntan.** El texto del anuncio ("Quiero comprar X por $Y") no cuenta como pregunta.
- **Promos como pregunta:** "vas a llevar una o aprovechás la promo de 2?". Si pregunta el precio: el de una y enseguida el de la promo.
- **Firmeza:** ser firme cuando el cliente duda o pone excusas (arrepentimiento de dejarlo para después, compromiso consigo mismo), sin presión falsa. Si da muchas vueltas, la conversación sigue con un vendedor de conversión.
- **Ticket:** subirlo sugiriendo un complemento o la promo o el kit, sin quedarse solo en el producto del anuncio y sin vender lo más barato de entrada.
- **Salud:** seguir vendiendo con información general, sin decir que es profesional, y después pasa a un vendedor.
- **Principios, no ejemplos:** que Hermes lea a la persona y actúe con criterio propio.

## Qué cambió

| Pieza | Cambio |
|---|---|
| `/etc/fitbrain-bridge/recepcion.json` (nuevo) | Manual de recepción: ficha del cliente, leer a la persona (7 señales con su modo), precios y promos, subir el ticket, estilo WhatsApp, lo que ya falló, verdad. Se recarga solo al editarlo. Va al redactor como `playbook_venta`. |
| `bridge.py` | `humanize()` saca ¿ ¡ « » “ ” — ; y signos repetidos antes de enviar. `HEALTH_CTX_RE`: la condición de salud se responde y después pasa. `SAFETY_RE` queda solo para reacción adversa, emergencia, reclamo o pedido de una persona. El texto del anuncio ya no fuerza "ya venís tomando" ni da precio. El pase inmediato tras responder solo ocurre si el cliente dio cantidad, pago, envío o retiro. Se le pasa al redactor `preguntas_que_ya_hiciste`. El saludo varía. |
| `config.json` | `playbook_path`, 4 saludos, `max_parts` 3 (burbujas), `max_bot_turns` 3 (antes 2), regla PLAYBOOK primera, estructura "dos o tres mensajes cortos". |
| SOUL A05 y A06 | Sección "Recepción v2". A06 acepta las jugadas del playbook (reflexión, complemento, burbujas) y marca DENY si se repite una pregunta. |
| Reglas de precio (21) | "Te confirmo bien ese precio" prohibido. Si falta un precio: valor u opción más cercana con precio. |

Respaldos en el VPS: `bridge.py.bak22`, `config.json.bak22`, `/root/a05.SOUL.bak22`, `/root/a06.SOUL.bak22` (y `.bak21`/`.bak20` de los pasos anteriores del día).

## De dónde salió

- **Conversaciones de vendedores del CRM** (18 con 3 o más mensajes firmados):
  - los que escriben como humanos usan mensajes de 2 a 12 palabras en ráfagas, nunca "¿" ni punto y coma, precio directo ("te sale"), muletillas (dale, perfecto, si claro);
  - suman la promo de 2 o un complemento y cierran preguntando el medio de pago;
  - algunos vendedores pegan texto de IA, así que no todos sirven de modelo.
- **Corpus** (agente-fit-crm-docs, FIT-BRAIN-CORPUS): fallas ya registradas, como ofrecer una 3.ª unidad a quien pidió dos, tomar una corrección como excusa para vender, mandar menús de objetivos, volver a asesorar a un comprador decidido, escasez inventada o decir el costo del envío. "Lo voy a pensar": una sola pregunta sobre qué lo frena.
- **Skill de humanización** (lista anti-IA y test de WhatsApp).

## Pendiente o a confirmar

- Verificar con los próximos leads reales: precio no ofrecido, promo como pregunta, sin "¿", burbujas, pase a vendedor.
- Hay instrucciones contradictorias en el corpus que el dueño tiene que resolver: pregunta puente obligatoria contra "callarse"; aceptar el "no me interesa" contra "un no no es definitivo".
- Algunos vendedores dicen que "abonando antes de las 18 sale hoy". No está en las fuentes, así que Hermes no lo usa hasta que se confirme.
- Precio del BCAA XTR (promo 2+1) sin cargar.
- Audios (pedido del 08/11): sin empezar. Hace falta ver si la API del CRM permite enviar audio y elegir un proveedor de voz.
- Nota interna para el vendedor con la ficha del cliente: falta ver si la API lo permite.
