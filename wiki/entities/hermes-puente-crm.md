**Qué es**: el servicio propio que conecta el CRM con Hermes en el VPS. Hermes (persona "Maxi") atiende los leads nuevos de WhatsApp en lugar del agente nativo [[agente-recepcionista-comercial-10005]].
**Estado real (2026-11-07 19:56 UTC)**: aplicado y enviando. El agente nativo de recepción está apagado por el usuario.
**Fuente primaria**: [[47-hermes-puente-crm-2026-11-07]].

## Dónde vive

- **Servicio**: VPS Hostinger, unidad systemd `fitbrain-bridge` (`Restart=always`).
- **Código**: `/opt/fitbrain-bridge/bridge.py`.
- **Config**: `/etc/fitbrain-bridge/config.json` (600, tiene la clave del CRM).
- **Precios y ofertas**: `/etc/fitbrain-bridge/facts.json`.
- **Base**: `/var/lib/fitbrain-bridge/bridge.db`.
- **Perfiles de Hermes**: se llaman por la API del contenedor `hermes-agent-v7dd-hermes-agent-1` en `127.0.0.1:8643`.
  - A02: clasifica.
  - A05: redacta.
  - A06: revisa.
- **Lo que reemplaza**: el controlador FIT-BRAIN viejo (`fitbrain-reception`), que queda deshabilitado y sin tocar (ver [[fit-brain-vision]]).

## Cuándo habla y cuándo se calla

Responde solo si se cumplen las tres condiciones:
1. el ticket está `pending`;
2. el ticket no tiene `userId` (ningún vendedor lo aceptó);
3. el negocio del contacto está en `CL | LEAD NUEVO` (59083, ver [[pipelines-y-columnas]]).

Se calla o pasa el lead cuando:
- **Un vendedor acepta mientras redacta**: no envía (`SUPERSEDED_ACCEPTED`).
- **Lead calificado** (respondió la 2ª pregunta de Hermes): mueve el negocio a `CL | EN CONVERSACION` y pasa el ticket a la fila `comercial`, sin responder más (`QUALIFIED_MOVED`).
- **Comprador decidido**: una respuesta y lo mueve. Cuenta como decidido si dice cantidad, total, cuenta, pago o envío con sus palabras. El texto automático del anuncio no cuenta.
- **Salud, pedir una persona, reclamo, audio/imagen sin texto o revisión que niega dos veces**: deriva a `comercial` y mueve el negocio.
- **Tope**: 8 respuestas por hora por ticket.

## Cómo responde

- Usa el saludo fijo de Maxi una sola vez.
- Manda 1 o 2 mensajes cortos con una sola pregunta.
- Toma los precios de `facts.json` (índice aprobado) y de las ofertas del anuncio de origen (`adPreview.sourceId`).
- El anuncio es contexto: **no nombra el producto ni el precio del anuncio si el cliente no los pidió**.
- Las reglas completas están en [[reglas-recepcion-hermes]].

## Garantías técnicas

- **A lo sumo una vez**: reserva en SQLite antes de enviar.
- **Envío incierto**: no se reintenta nunca.
- **Errores antes del envío**: se reintentan 3 veces y después van a una persona.
- **Al reiniciar**: libera lo que quedó reservado.
- **Revisión previa al envío**: vuelve a mirar si alguien respondió, si llegó otro mensaje o si un vendedor aceptó.

## Operar

- **Ver estado**:
  - `systemctl is-active fitbrain-bridge`
  - `python3 /opt/fitbrain-bridge/bridge.py report -n 6 --config /etc/fitbrain-bridge/config.json`
  - `journalctl -u fitbrain-bridge --since '-15 min'`
- **Apagar sin borrar**: `send_enabled: false` y reiniciar; después reactivar el agente nativo en el CRM.
- **Desplegar**: por la consola web de Hostinger, con archivos en base64 verificados con `sha256sum` y copia `.bakN` antes de instalar. Detalle en [[47-hermes-puente-crm-2026-11-07]] §6.
- **API**: los datos usados están en [[api-rmsystemm]] (mover negocio, límites, firma de mensajes, `adPreview`).

## Pendientes relacionados

- **Q43**: disparador del pase (2ª respuesta vs. mismo turno de la pregunta puente).
- **Q44**: beneficios de productos aprobados y costo de envío.
- **Q45**: el monitoreo cuenta mal los chats que ya aceptó una vendedora.

## Conocimiento comercial (desde 2026-11-07 20:40 UTC)

Fuente narrativa: [[48-hermes-vendedor-y-conocimiento-2026-11-07]].

- **Precios**:
  - `facts.json` tiene el índice aprobado del 21 al 23/10 y las ofertas por ID de anuncio;
  - `/etc/fitbrain-bridge/catalogo/*.csv` tiene las planillas del 2/11. Entran solo las filas "Confirmado" y se descartan los montos calculados.
  - Se verificó que los precios de las dos fuentes coinciden.
- **Beneficios y criterio**: `/etc/fitbrain-bridge/knowledge.json` (11 categorías y qué recomendar por objetivo).
- **Recarga**: los tres se recargan solos cuando cambia un archivo, sin reiniciar. Un archivo roto no tira el servicio.
- **Perfiles de Hermes**: A05 y A06 tienen al final de su `SOUL.md` la corrección comercial del 2026-11-07 (vender, no derivar por reflejo, pregunta puente). Copias en `SOUL.md.bak20261107`.
- **Prueba sin enviar nada**: `python3 /opt/fitbrain-bridge/test_cases.py` corre los casos de la guía (BCAA para volumen y para bajar de peso, "una crea", precio, texto del anuncio, volumen sin producto) y muestra respuesta y revisión.
- **Otra empresa**: config propia más carpeta de planillas, `knowledge.json` y `company_policy` propios. El código es el mismo.
