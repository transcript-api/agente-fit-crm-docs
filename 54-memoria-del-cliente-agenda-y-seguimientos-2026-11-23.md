# 54 · Memoria del cliente, agenda, plantillas y seguimientos (2026-11-23)

**Estado:** estudio terminado. No se instaló nada y no se escribió nada en el CRM.

Este es el resumen público, sin datos del servidor, identificadores ni teléfonos. Sigue al [[17-registro-de-cambios]]. El detalle con números y rutas está en la bóveda privada.

## Qué pidió el dueño
- Que los agentes lean lo que el cliente ya habló antes.
- Que los seguimientos sean personalizados y no «sin sentido».
- Ver si el CRM deja guardar información del cliente, para armar fichas que el equipo pueda leer cuando el cliente visita el local.
- Saber si el agente puede usar el calendario para agendar, y si puede crear plantillas o automatizaciones por su cuenta.

## Qué deja hacer el CRM

**Lo que sí puede el agente**
- **Notas internas** en el contacto. El cliente no las ve. Hoy nadie las usa.
- **Campos del contacto.** Se puede crear un campo nuevo, como «objetivo» o «última compra», y llenarlo en cada cliente.
- **Agenda.** Crear una cita ligada al cliente, con un vendedor responsable, una descripción y, si se quiere, sincronizada con Google Calendar y con link de videollamada.
  - Hoy hay 46 citas, todas sin marcar como hechas, y ninguna usa Google Calendar.
- **Tareas y mensajes programados.** El equipo ya los usa para la recompra: unos cinco mensajes programados por día.
  - Hay 26 que quedaron con fecha pasada y nunca salieron.

**Lo que no puede**
- **Plantillas de WhatsApp.** Las carga una persona en la pantalla del CRM y las aprueba Meta. El agente puede escribir el texto para que el dueño la cargue.
- **Automatizaciones, flujos y secuencias.** Se arman solo en la pantalla.
  - El agente las puede disparar de forma indirecta, por ejemplo al mover un negocio de columna o al poner una etiqueta, pero no puede crearlas ni cambiarlas.

**Lo que puede, pero solo con permiso**
- La API deja crear pipelines, columnas, etiquetas, productos y campos.
- Es configuración permanente, así que el agente no la crea por su cuenta: va con el OK del dueño.

## Cuánto ve hoy el agente de cada cliente
- **Solo los últimos mensajes de la charla.** El CRM sí deja leer toda la historia, porque pagina, pero el puente lee una sola página.
  - En un tercio de las charlas recientes el agente no ve el principio.
- **No lee la charla anterior del mismo cliente.** Uno de cada cuatro tuvo otra antes.
- **Los audios y las fotos del cliente se entienden solo en el turno en que llegan.** En el mensaje siguiente el agente ya no los tiene.
  - Si el cliente contó su objetivo en un audio, el agente lo olvida.
  - Los audios del vendedor no se entienden nunca.
- **No hay memoria por cliente:** ni ficha, ni compras anteriores.

## Cómo salieron los seguimientos
Se revisaron los 35 enviados en los dos primeros días con envío real.

**Lo bueno**
- Varios usan el detalle del cliente: para quién es, dónde retira, el producto que no tenemos con una alternativa, cómo se toma.
- Los saltos funcionaron: no se le escribió a quien ya había comprado ni a quien pidió no recibir más.

**Lo flojo**
- **La escasez se gastó.** «Te lo dejé guardado porque quedan pocas unidades» salió en casi dos de cada tres seguimientos, y a algunos clientes se lo repitió en cada intento.
- **Algunos listan promos** sin partir de lo que pidió el cliente.
- **Uno salió genérico**, y ese caso ya quedó arreglado.
- **No miran los mensajes que el equipo dejó programados.** Al cliente le pueden llegar dos mensajes juntos.

## Qué se propone

**La ficha del cliente**
- Una nota interna por cliente que el agente va editando. Lleva:
  - qué busca y para quién;
  - qué se le ofreció y qué eligió;
  - sus dudas;
  - qué compró y cómo lo recibe;
  - qué quedó pendiente;
  - cuándo le toca recomprar.
- No lleva datos de salud, cuentas, teléfonos ni la dirección completa.
- La lee el agente antes de cada respuesta, y el vendedor la ve en el CRM.
- Si el cliente va a pasar por el local, el agente le agenda la visita al vendedor con la ficha en la descripción.

**El paquete 3, memoria**
- **Sin tocar el CRM:**
  - guardar lo que dijeron los audios y las fotos para todos los turnos;
  - leer la historia completa y la charla anterior;
  - usar la escasez una sola vez por cliente;
  - no pisar los mensajes que programó el equipo.
- **Con el OK del dueño:**
  - una nota de prueba;
  - después, las fichas y la agenda de visitas.

## Regla nueva
Antes de escribirle a un cliente, el agente mira todo lo que el negocio ya tiene en camino con él: lo que se le mandó, lo que está programado y las automatizaciones.

Todo recurso de presión (escasez, regalo, urgencia) lleva un tope por cliente en el código.
