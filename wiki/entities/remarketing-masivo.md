# Remarketing masivo a los ~2400 leads acumulados

**Qué es**: mecanismo para reactivar en bloque los leads viejos acumulados en `PIPELINE MASIVO → LEAD MASIVOS` (2396-2408 negocios), mandándoles un cupón segmentado por el producto/anuncio de origen. Reemplaza un plan anterior de API+n8n.
**Estado real (2026-09-19)**: mecanismo nativo diseñado, construido y **probado de punta a punta en vivo con éxito**. NO escalado a los 2396 reales — faltan confirmaciones legales/de cuenta antes de eso.
**Fuente primaria**: [[31-envio-masivo-remarketing-cupon]] (el mecanismo, probado), [[33-pipeline-masivo-y-api-negocios-2026-09-19]] (la investigación de API y los límites legales, complementario — leer los dos juntos).

## La idea central
No hace falta un mecanismo de "envío masivo" de verdad — mover las cards en bloque (selección múltiple del tablero, tandas de ~400) hacia una columna de disparo activa el gatillo simple "Entrada en la Tarjeta"/"Negócio mudou de etapa" una vez por card, que dispara N automatizaciones individuales ya probadas.

## Mecanismo (2 Flujos de Automatización, probados en vivo)
1. **"TEST - Envío Campaña"**: Negócio mudou de etapa → Buscar Conversa (crea si no existe) → Enviar Mensagem (solo Mídia, la imagen del cupón) → Delay ~2-5s (discrepancia sin resolver entre el canvas y la documentación, Q17i) → Enviar Mensagem (Texto + botón "CANJEAR AHORA").
2. **"TEST - Reacción Canjear"**: Mensagem contém "CANJEAR AHORA" → confirmación + Tag `TEST|Canjeado` → Negócio Buscar → Transferir a `MASIVO - RESPUESTAS / LEAD REACTIVADO`.

**Hallazgo técnico real**: aunque el bloque Mídia esté arriba del Texto en el mismo nodo, WhatsApp entrega la imagen DESPUÉS del texto (tarda más en procesarse) — por eso están separados en dos nodos secuenciales con un Delay entre medio.

## La pared dura: ventana de 24 horas de WhatsApp (confirmada, no es un límite de rmsystemm ni de n8n)
A un contacto sin conversación abierta hace más de 24h, **ningún sistema** puede mandarle un mensaje libre — confirmado en vivo con un contacto real ("Natalia"): `"META API | Erro ao enviar mensagem"`. El único mensaje permitido a un contacto frío es una **plantilla de WhatsApp ya aprobada por Meta**. Diseño de 3 pasos para no depender de una plantilla nueva por campaña (el audio no puede ir en el header de una plantilla — solo admite Texto/Imagem/Vídeo/Documento):
1. Plantilla genérica aprobada (`recontacto`) reabre la ventana.
2. El lead responde algo → dispara el Flujo que manda el creativo real (foto o audio) como mensaje libre, ya legal.
3. Click en el botón → dispara la reacción ya armada.

`cupon_general` (categoría Marketing, header Imagen, 5% OFF código VOLVISTE5) está **Aprovado** por Meta desde el 2026-09-19. El paso 1 del diseño de 3 pasos (la plantilla genérica reabriendo ventana) **todavía no está construido**.

## Lo que falta confirmar antes de escalar a los 2396 reales (no es solo técnico)
- **Tier de mensajería diario de la cuenta** (250/1.000/10.000/100.000/ilimitado según verificación de Meta) — si está en un tier bajo, ni se puede intentar mandar a los 2396 en una tanda.
- **Business Verification de Meta** + URL de política de privacidad cargada — requisito para mandar cualquier plantilla.
- **Opt-in válido**: un mensaje a leads fríos cae en categoría "Marketing" de Meta, que exige opt-in documentable. No confirmado si haber interactuado con un anuncio hace meses cuenta como opt-in válido hoy.
- Confirmar si soporte de rmsystemm cobra algo propio durante la ventana extendida de 72hs de Meta para leads de Click-to-WhatsApp.

## Segmentación por API (camino alternativo, diseñado, no ejecutado)
`POST /commercial-order/{id}/move` con `{"commercialStep": "CAMPAÑA CREATINA"}` puede mover cada negocio de `LEAD MASIVOS` a su columna de campaña según el nombre del anuncio de origen (visible en la tarjeta, campo exacto no confirmado). Blueprint de n8n listo sin ejecutar: `artefactos/n8n-pipeline-masivo-segmentar.json`. **Nunca se movió ni un solo negocio real** — toda esta fase requiere al usuario presente mirando, por ser una mutación real de 2396 registros de producción.

## Segundo camino, 2026-10-29: envío manual por WhatsApp Business Web
Con una promo que vencía el mismo día se probó otro camino, sin plantillas ni flujos: leads sacados de la API (3.743 en remarketing, 2.868 con WhatsApp), 50 mensajes personalizados y envío desde la app de WhatsApp Business de a pocos con pausas. Se mandaron 29 de 50; ninguno de los chats tenía historial previo, hubo respuestas en minutos y llegan a la app, no a Maxi ni al CRM. Detalle y aprendizajes técnicos (la pestaña oculta no envía, cómo evitarlo) en [[17-registro-de-cambios]] 2026-10-29 (tarde); pendientes en Q42. Los datos reales viven en `privado/`, fuera de git.

## Pendientes relacionados
Q17c (construir el paso 1 del diseño de 3 pasos), Q17d (confirmar cobro de rmsystemm en ventana 72h), Q17h (🟠 cruzar con los límites legales de Q16 antes de escalar), Q17j (5 plantillas por campaña, esperando copy), N24 (verificar `Novo Fluxo` antes de tocar más automatizaciones, por las dudas de que compartan infraestructura).
