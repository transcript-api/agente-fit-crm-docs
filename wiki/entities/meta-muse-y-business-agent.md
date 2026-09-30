# Meta: Muse AI vs. Meta Business Agent — qué compite con el agente propio

**Qué es**: dos productos DISTINTOS de Meta, fáciles de confundir. Solo uno compite de verdad con lo que este proyecto construye.
**Fuente primaria**: [[32-meta-muse-y-business-agent]].

## Muse AI — no compite, pero tiene un riesgo real
Asistente personal multimodal de Meta (VM Linux propia, genera video/audio/código), se conecta a WhatsApp por **código QR** (sesión multidispositivo, como WhatsApp Web) — no por la API de negocio. Solo EE.UU. (requiere VPN desde fuera), gratis hasta 100M tokens/semana.

**El riesgo concreto**: conectar Muse al número comercial metería una segunda sesión sobre el mismo número que ya usa el CRM — en el mejor caso compiten por responder, en el peor se desconecta el CRM, y usar una sesión QR para tráfico comercial masivo va contra las políticas de uso de WhatsApp (riesgo real de bloqueo del número). **Conclusión: Muse no debe enchufarse al número comercial, bajo ninguna circunstancia.** Sí podría servir, en una cuenta personal separada, para producción de contenido (video/audio/podcast) — no evaluado en profundidad, bloqueado por el límite geográfico.

## Meta Business Agent — el que sí compite (parcialmente)
Lanzado globalmente el 3 de junio de 2026, corre sobre Llama, integrado nativo en WhatsApp Business (no QR). Según la comunicación pública de Meta: responde preguntas del negocio, recomienda del catálogo, califica leads, deriva a una persona, resumen matutino de conversaciones. Gratis hoy, planes pagos anunciados.

**Diferencia clave con lo que se está construyendo**: Business Agent resuelve *responder*, no necesariamente *vender dentro de un proceso estructurado por etapas* como hace la arquitectura de 3-5 agentes de este proyecto (ver [[arquitectura-conversacional]]). No son necesariamente excluyentes.

**Sin verificar todavía** (requiere videos, no solo comunicación pública): si convive con un CRM externo ya vinculado al mismo número o hay conflicto (la pregunta decisiva, análoga al riesgo de Muse), si puede escribir en un sistema externo (mover tarjeta, taguear), si guarda memoria por cliente, si inicia contacto para recompra sin que el cliente escriba primero, y qué implica su integración con Shopify (versión "Platform", empresas grandes).

## Pendientes relacionados
E11 (transcripciones de videos 2-5 sobre Muse/Business Agent pendientes de pasar; 6 preguntas abiertas sobre Business Agent sin verificar).
