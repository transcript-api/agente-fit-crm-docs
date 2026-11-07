# 47 — Hermes atiende los leads nuevos: puente propio CRM ↔ Hermes (2026-11-07)

Informe de la sesión del 2026-11-07. Es la fuente narrativa de [[hermes-puente-crm]] y [[reglas-recepcion-hermes]] en `wiki/`. No hay claves, teléfonos ni nombres de clientes (el repo es público).

## 1. Por qué Hermes no respondía

- El controlador FIT-BRAIN que tenía que conectar Hermes con el CRM (`fitbrain-reception`, `fitbrain-versioned-reception` en el VPS) estaba **apagado y fallando**. Exigía una "lectura de runtime" de menos de 1 hora y salía con código 78 (`COMPOSITION_BLOCKED`) cada vez que se intentaba arrancar.
- No era un problema de Hermes ni de la API del CRM: la API pública responde bien con una clave nueva ("Agente Hermes 3"). Detalle de la API en [[api-rmsystemm]].
- Decisión: **no revivir ese controlador** (se dejó intacto y deshabilitado) y escribir un puente chico y simple, a prueba de duplicados.

## 2. Qué se construyó

Un servicio `systemd` en el VPS de Hostinger (`fitbrain-bridge`, `Restart=always`):

- **Código**: `/opt/fitbrain-bridge/bridge.py` (Python, sin dependencias).
- **Config**: `/etc/fitbrain-bridge/config.json` (permisos 600, tiene la clave del CRM).
- **Precios y ofertas por anuncio**: `/etc/fitbrain-bridge/facts.json` (26 precios del índice aprobado por el dueño, 7 anuncios con sus ofertas).
- **Base de datos**: `/var/lib/fitbrain-bridge/bridge.db` (SQLite).

Flujo de cada mensaje:
1. Cada 15 s lee los tickets del CRM.
2. Filtra.
3. Pasa por un filtro de seguridad (salud, pedir una persona, reclamos), que lo deriva directo a una persona.
4. A02 clasifica.
5. A05 redacta.
6. A06 revisa (una ronda de corrección si niega).
7. Antes de enviar vuelve a chequear.
8. Manda la respuesta en 1 o 2 mensajes, con 2,5 s entre ellos.

Los perfiles de Hermes se llaman por la API del contenedor `hermes-agent-v7dd-hermes-agent-1` (`127.0.0.1:8643/p/<perfil>/v1/chat/completions`).

Garantías:
- **A lo sumo una vez**: se reserva en SQLite antes de enviar; un envío con resultado incierto **nunca se reintenta**.
- Los errores antes de enviar se reintentan hasta 3 veces y después van a una persona.
- Un reinicio libera lo que quedó a medias.

## 3. Cronología (UTC)

- **17:12** — envío real activado (antes estuvo en modo sombra: redactaba sin enviar, para comparar con Maxi nativo). El usuario apagó el agente nativo de recepción.
- **Pruebas con el teléfono del dueño**: se confirmó que manda 2 mensajes.
  - Bug: la respuesta de una sola frase no se partía; se agregó la regla de formato.
  - Bug: los precios decían "uruguayos" porque la fuente tenía "(UYU)"; se limpió y se agregó la regla de moneda.
- **19:09** — se liberó para todos los leads.
  - Primer error de alcance: también contestaba chats que **ya habían aceptado los vendedores**. En este CRM todos los tickets tienen un responsable, así que el responsable no sirve como señal.
- **19:36** — **regla de alcance correcta: solo LEAD NUEVO.** Hermes atiende únicamente si:
  - el ticket está `pending`;
  - **no tiene `userId`** (nadie lo aceptó);
  - el negocio del contacto está en la columna `CL | LEAD NUEVO` (59083).
  - Si un vendedor acepta mientras Hermes piensa, no manda nada (`SUPERSEDED_ACCEPTED`).
  - La respuesta mala a un lead ("No te recomendaría sumar el BCAA…", 19:32) salió de la versión anterior a este cambio.
- **19:45** — **pase a vendedores.** Hermes mueve el negocio a `CL | EN CONVERSACION` (75213) con `POST /commercial-order/{id}/move {"commercialStep": "<nombre de la etapa>"}`:
  - cuando el lead responde la **segunda** pregunta (pedido explícito del usuario: "no quiero que responda demasiado");
  - con un comprador decidido, después de una respuesta;
  - o cuando lo deriva a una persona.
  - El primer movimiento real se verificó en el CRM a las 19:46.
- **19:56** — **reglas de venta nuevas** (sección 4), más:
  - el ticket pasa a la fila `comercial` cuando se mueve, igual que el `transfer_ticket` de Maxi;
  - el texto automático del anuncio ("Hola, quiero comprar X") ya no cuenta como comprador directo.

## 4. Correcciones del dueño en esta sesión (literales en lo esencial)

- **Solo en lead nuevo**: "Necesito que ese agente solo esté en la columna de lead nuevo… y si un vendedor acepta la conversación… que pare de responder".
- **Pasar rápido**: "le hace un par de preguntas… cuando ve que el lead ya es cualificado, agarra y ya lo pasa… Respondió el segundo mensaje, o a veces el cliente es directo".
- **No frenar la venta**: la respuesta "No te recomendaría sumar el BCAA solo por estar en volumen ni te aseguraría resultados" es mala. Una vendedora en el mismo chat recomendó proteína aislada y creatina, explicó cada una en palabras simples, y eso sí funciona.
- **No tirar el producto del anuncio**: el cliente preguntó por BCAA, o el dueño escribió "una crea", y Hermes contestó "La Creatina XTR 100% pura de 300g sale $850". "Eso no convierte… no tiene ningún tipo de sentido." Ahora: responder sobre lo que el cliente nombró, no elegirle marca ni presentación, no dar un precio que no pidió.

## 5. Lo que dice el diseño que había que respetar

Se leyeron completos FIT-BRAIN, FIT-BRAIN-CORPUS, este vault y el expediente del 2026-11-07. Resumen en [[reglas-recepcion-hermes]].

Lo más importante:
- La IA de recepción **solo actúa en LEAD NUEVO** y su única salida es `transfer_order` a `CL | EN CONVERSACION` más `transfer_ticket` a `comercial` ([[agente-recepcionista-comercial-10005]]).
- **Diferencia con lo pedido hoy**: el diseño transfiere en el **mismo turno** de la pregunta puente, sin esperar la respuesta. El dueño pidió esperar la respuesta a la segunda pregunta. Se aplicó lo del dueño; queda como decisión abierta (Q43).

## 6. Cómo desplegar y volver atrás

- **Desplegar**: no hay clave SSH (crearla fue bloqueado y no se forzó). Se usa la consola web de Hostinger: comandos de una línea, `set +H`, archivos en gzip+base64 pegados en partes y verificados con `sha256sum` antes de instalar. Siempre se deja una copia `.bakN` del código y la config.
- **Apagar Hermes sin borrar nada**: `send_enabled: false` en la config y reiniciar; después reactivar el agente nativo en el CRM.
- **Monitoreo**:
  - `python3 /opt/fitbrain-bridge/bridge.py report -n 6 --config /etc/fitbrain-bridge/config.json`
  - `journalctl -u fitbrain-bridge`
  - un script local de solo lectura que cuenta mensajes por tipo (clientes, Hermes, equipo, IA nativa).

## 7. Datos de la API confirmados en vivo

Ver [[api-rmsystemm]].

- **Límites**: `limit` ≤ 100 en tickets, contactos y negocios; ≤ 20 en mensajes (más da 400).
- **Envoltorios distintos** según el endpoint.
- **Negocios**: devuelven `commercialSalesStepId` en `/commercial-order` y `commercialStepId` en `/contact/{id}/commercial-orders`.
- **Mensajes del equipo**:
  - escritos en el CRM: llegan `sendBySystem=true` con la firma `*Nombre:*`;
  - de algunas vendedoras: llegan **sin firma**, así que no se puede depender de la firma;
  - enviados por la API: salen sin firma.
- **`adPreview`** del mensaje del cliente trae el ID del anuncio de Meta (`sourceId`), el texto y la URL.
- **Mover un negocio**: `POST /commercial-order/{id}/move`, body `{"commercialStep": "<nombre exacto>"}`, responde 200.

## 8. Pendientes que deja

- **Q43** — decidir el disparador del pase: después de la 2ª respuesta (hoy) o en el mismo turno de la pregunta puente (diseño).
- **Q44** — beneficios de productos aprobados por el dueño (BCAA no tiene ninguno; los de la planilla están sin verificar). Costo de envío sin confirmar.
- **Q45** — monitoreo: el script local todavía cuenta como "esperando a Hermes" chats que ya aceptó una vendedora (sus mensajes llegan sin firma).
