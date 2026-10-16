# Pedidos, valor de compra, atribución y aprendizaje

Volver a [Empezá por acá](44-empeza-por-aca-hermes-crm-vps-2026-10-16.md). **Contrato propuesto**, no herramientas habilitadas ni integración de pedidos/Meta conectada.

## Valor en la tarjeta y total del contacto

D43 §3 documenta actualizar `amount` en negocio y el evento `COMMERCIAL_ORDER_CHANGED`; D33 documenta PUT de negocio y campos `additional-info`. Esto demuestra una capacidad documentada, no cuál es la unidad/moneda del campo ni si PUT reemplaza todo o admite cambios parciales. Confirmar contrato vigente antes de escribir. No inventar schema.

Separar al menos: **valor del pedido/negocio**, **total histórico comprado por contacto**, **importe cobrado** y **margen**. Un negocio no debe recibir automáticamente la suma de toda la vida del cliente. Un pago parcial no es otra venta, y cobro no equivale a ingreso ni a margen; el margen requiere costos verificados.

Cálculo determinista propuesto: sumar cantidad × precio unitario confirmado de todas las líneas; aplicar descuentos y envío exclusivamente según contrato aprobado, con moneda explícita, precisión decimal y regla de redondeo acordada. El LLM identifica referencias y solicita datos; no certifica el total. No usar precio del anuncio como venta confirmada ni estimar stock/precio por mensajes históricos.

Fuente de verdad: **pedido confirmado** con ID estable, versión, líneas, estado, moneda y vínculo al contacto/negocio. Bling es integración futura para este contrato: no asumir que su integración histórica de productos ya provee ventas confirmadas ni pagos. Ver B1–B3/A11 y H6.

## Idempotencia y conciliación

- Guardar vínculo único empresa + sistema origen + ID de pedido + versión y su destino CRM. Repetir una entrega del mismo pedido no vuelve a sumarlo.
- Derivar agregados desde pedidos válidos o asientos de cambios únicos, en vez de `total += monto` ante cada webhook. Concurrencia y reintentos requieren restricciones/transacciones y conciliación periódica.
- Corrección de cantidad/precio, devolución, anulación y pago parcial actualizan sus entidades/versión y audit trail. Acordar cuándo una venta cuenta y cómo se revierte; no borrar evidencia ni contar cobros como nuevos pedidos.
- Si la escritura CRM vence sin respuesta, registrar resultado incierto, leer/conciliar antes de repetir. No asumir clave de idempotencia soportada por la API.

## Anuncio y señales a Meta

La compra puede incluir **otros productos que el anuncio**: el valor comercial corresponde al pedido completo confirmado. Atribuir ese pedido a un anuncio exige vínculo real anuncio/contacto/pedido y regla/ventana aprobada. Guardar origen y evidencia; sin enlace la atribución queda desconocida. No multiplicar la venta por cada anuncio visto ni inventar `ctwa_clid` o asociación por parecido de producto.

Meta no está conectado en este alcance y el histórico Q34/P7 no acredita conexión vigente. Antes de implementar, verificar documentación oficial actual y contrato del CRM: eventos válidos, elegibilidad, permisos, ventana, identificadores, consentimiento/condiciones aplicables, dedup y vínculo de atribución. No se enviaron eventos.

Clasificar internamente **cualificado / sin respuesta / descalificado** con motivo y evidencia. Silencio significa sin respuesta, no prueba de mala calidad. No inventar un evento negativo nativo de Meta. Un eventual `Purchase` debe representar compra real según la definición aprobada, con moneda, valor, ID/dedup estables y estado confirmado; pago parcial, cancelaciones y reembolsos tienen tratamiento por acordar antes de activar señales.

**PENDIENTE:** H6 — equipo + constructor + responsable Bling acuerdan contrato de pedido/valor y conciliación. H7 — responsable Meta + soporte validan conexión, eventos/elegibilidad y atribución; P7/Q34 siguen abiertos con esa precisión.

## Primera compra y aprendizaje: límites del auditloader antiguo

La [auditoría de 82 conversaciones](37-auditoria-conversaciones-reales-2026-09-23.md) eligió 82 de los 300 tickets recientes: 70 nuevos con primer tramo y 12 recurrentes con último tramo, cortando segmentos por ≥12 h de silencio. Es una muestra seleccionada, no una cohorte completa ni un historial íntegro de compras. El [handoff de recepción de FIT-BRAIN](https://github.com/transcript-api/FIT-BRAIN/blob/ca31ca73e34fb7d2b9ac1b12398e69c82f63884c/13-HANDOFFS/2026-10-05-CODEX-reception-history-before-hermes.md) advierte que algunos casos son solo resumen y no están las 82 transcripciones originales completas.

Ese loader no sirve sin adaptar para determinar primera compra o Recompra: “nuevo ticket” no demuestra nuevo comprador y un último segmento puede ocultar la venta inicial. Hay censura temporal, selección reciente y conversaciones atendidas fuera del tramo observado. Mantener `primera_compra=desconocida` cuando no hay historial suficiente/pedido confirmado; no convertir ausencia en cero compras.

Propuesta de adaptación: definir ventana de observación y criterios, recuperar historial completo autorizado y pedidos confirmados por contacto, enlazar identidades sin cruzar empresas, marcar huecos/multimedia sin transcripción y separar entrenamiento/revisión de evaluación. Etiquetado comercial requiere fuente de compra; no inferir venta por “gracias”, interés o silencio.

Reglas nuevas salen como candidatos con fuente y ejemplo anonimizado, revisión humana, versión y regresión antes de aplicación. No autoaprender de mensajes no verificados ni subir corpus privado al repositorio público. Los conteos históricos por palabras son aproximaciones; no son tasa de conversión ni prueba de causalidad.

**PENDIENTE:** H8 — constructor + equipo adaptan loader y etiquetas con pedidos confirmados, cobertura/huecos visibles y evaluación separada, antes de usarlo para primera compra/Recompra.
