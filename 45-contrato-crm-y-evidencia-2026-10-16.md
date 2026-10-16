# Contrato del CRM y matriz de evidencia — 16/10/2026

Volver a [Empezá por acá](44-empeza-por-aca-hermes-crm-vps-2026-10-16.md).

## Fuentes y alcance

**S16:** respuestas del soporte comunicadas por el usuario el 16/10 en el hilo que autorizó esta documentación. No se contactó a soporte en esta revisión y no se guarda el chat completo. Son confirmaciones de capacidad, no resultados de pruebas propias.

**D43:** [Centro de Ayuda, §3](43-centro-de-ayuda-rmsystemm-2026-10-06.md#3-api-webhooks-y-llaves), síntesis de documentación del proveedor leída el 06/10; no prueba actual en la cuenta. **D33:** [API de negocios, §2](33-pipeline-masivo-y-api-negocios-2026-09-19.md), lectura histórica. **F16:** código/handoff de FIT-BRAIN en `ca31ca73e34fb7d2b9ac1b12398e69c82f63884c`; fuentes exactas en [diagnóstico](47-diagnostico-hermes-local-2026-10-16.md#fuentes-reproducibles).

La referencia oficial navegable está en **Automações → API** del CRM. Antes de implementar, confirmar allí rutas, autenticación, campos y permisos del contrato elegido. No crear claves en esta etapa. La API pública y la API autenticada usada por el frontend/piloto son contratos distintos; no mezclar sus payloads.

## Matriz para el constructor

| Capacidad | Evidencia | Límite/contrato por fijar | Implementación observada | Prueba / siguiente validación |
|---|---|---|---|---|
| Enviar WhatsApp texto y archivos | S16; D33; D43 | Canal, permisos, ventana y formato de medios | Piloto F16 habilita solo respuesta propia por API autenticada | Modelo/smoke técnicos PASS históricos; entrega actual no verificada |
| Crear, consultar, editar y eliminar mensajes agendados como en panel | S16 | Semántica tras handoff, cancelación, zona, carreras, claves de dedup | Deshabilitado en launcher actual | No probado por esta revisión |
| Editar contacto, etiquetas y notas | S16; D43 | D43 advierte reemplazo completo de tags/campos; no asumir merge | No habilitado por el piloto de respuesta | Verificar lectura/escritura/readback en prueba aprobada |
| Mover negocio de etapa y disparar automatizaciones | S16; D33 | Resolver por nombre; revisar efectos de columna antes de mover | Columnas deshabilitadas en launcher actual | Capacidad documentada, no prueba actual de Hermes |
| Transferir vendedor o sector | S16 | Tras asumir vendedor, nuevas entradas solo a él; respuestas en curso y agendados sin aclarar | Sin transferencia general habilitada | Probar carreras antes de habilitar |
| Consultar/actualizar valor de negocio | D43 §3: GET/PUT `/api/commercial-order` por ID/teléfono, `step`, `amount`, `responsible`; evento `COMMERCIAL_ORDER_CHANGED` | D33 usa PUT `/commercial-order/{identifier}` y rutas `additional-info`; no inferir equivalencia de versiones, unidad, moneda ni semántica parcial | No habilitado en piloto | Schema vigente, cálculo y conciliación pendientes |
| Recibir mensajes nuevos | S16: integración específica en sector de atención | Webhook de eventos no contiene mensajes; parámetros de integración pendientes | F16 hace polling de API autenticada del CRM, limitado a ticket propio | Último receptor esperando canario; no E2E actual |
| Recuperar mensajes tras caída | S16 | No reentregan aviso al receptor caído; historial sigue en CRM | Hay paginación/recovery propios del piloto; no equivalen a recuperador general | Contrato público y reconciliación concurrente pendientes |
| Agrupar mensajes consecutivos | S16: responsabilidad externa | Ventana/tamaño por definir, no separar respuesta de su lote | No verificado como batching general en F16 | Propuesta en 46; medir con ráfagas |
| Transcribir audio / interpretar imagen desde enlaces | S16: responsabilidad externa | URLs, expiración, formatos, costos y seguridad | Relay Codex actual valida texto; no asumir multimedia habilitada | Sin prueba actual; requiere adaptadores específicos |
| Conocimiento comercial propio | S16; arquitectura FIT-BRAIN | Fuente por atributo, vigencia, aislamiento por empresa | r12/estado/skills presentes; catálogo vivo no certificado aquí | Fuentes vigentes y casos comerciales pendientes |
| Señales de venta a Meta | D43; antecedentes P7/Q34 | Conexión no operativa confirmada por este encargo; elegibilidad/eventos vigentes sin validar | No conectado en este alcance | Propuesta de 49, no enviar eventos |

## Límites, nombres y responsabilidades

S16 establece **60 llamadas/minuto por tipo de acción**; cada respuesta informa remanente/reset. Implementar presupuestos independientes por acción, respetar encabezados reales una vez confirmados y reservar margen para recuperación. No tratarlo como 60 globales ni asumir nombres de encabezados. El límite histórico genérico de D43 no sustituye esta aclaración.

Etapas y sectores se localizan **por nombre**. Renombrar exige actualizar el mapeo y revalidarlo. Aunque algunas rutas usan identificadores de recursos, S16 no confirma soporte de IDs para resolver etapas/sectores. No extrapolarlo.

Mover etapa puede enviar creativos, asignar agentes u otras acciones nativas. Inventariar esos efectos y bloquear doble emisor antes de habilitar herramientas. Transferir implica releer ownership antes de cualquier salida y suspender seguimientos del emisor anterior hasta aclarar su contrato.

## Recuperación después de una caída

Procedimiento propuesto a partir de S16, sin ejecutarlo:

1. Conservar checkpoint de última reconciliación completa y una franja de solapamiento; registrar hora de inicio de recuperación.
2. Recorrer conversaciones por **última actividad descendente**, hasta 100 por página, hasta cubrir actividad previa a la caída. **El filtro de fecha de conversaciones filtra APERTURA:** dejaría afuera conversaciones antiguas que volvieron a hablar. No usarlo para este objetivo.
3. Para cada conversación candidata, leer mensajes con inicio/fin, hasta 20 por página y dirección cliente/atención. Recuperar ambos lados necesarios para saber si ya hubo atención.
4. Deduplicar por identidad de empresa/conversación/mensaje y conciliar contra ledger, salidas, respuestas humanas y ownership actual. Un inbound recuperado no autoriza responder si ya fue atendido, transferido, comprado o perdió vigencia.
5. Confirmar persistencia de cada página y resultado antes de avanzar checkpoint. Repetir franja de solapamiento para detectar actividad concurrente; no dar por completa una pasada con huecos.

**PENDIENTE:** H3 — soporte + constructor deben confirmar nombres y valores de parámetros, orden de mensajes, paginación/cursor, límites efectivos, inclusividad de fechas, zona horaria, consistencia ante actividad concurrente y retención. No hay query ejecutable de producción aprobada todavía.

## Eventos, mensajes y privacidad

Según S16, los webhooks de contacto, atención, status, asignación, negocio, agendamiento y etiqueta **no contienen mensajes**. La integración de mensajes se configura aparte en el sector de atención. D43 describe reintentos de ciertos eventos; no generalizar eso a mensajes ni prometer redelivery si el receptor está caído. La recuperación se apoya en historial.

La [referencia API histórica](wiki/entities/api-rmsystemm.md) advierte que `dataJson` puede contener `metaToken`. Aplicar allowlist de campos **antes** de logs, colas de diagnóstico y exportaciones. No volcar payloads ni SSE completo, cookies, URL de medios firmada, tokens o contenido del cliente. Registrar códigos de error y correlaciones mínimas con acceso restringido.
