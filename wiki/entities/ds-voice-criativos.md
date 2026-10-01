# DS Voice / Criativos — embudos y contenido multimedia reutilizable

**Qué es**: en rmsystemm se llama **"Recursos → Criativos"** (equivalente confirmado del "DS Voice" de la plataforma base DKW). Permite guardar mensajes/audios/imágenes/documentos reutilizables y armar "Funis" (secuencias con delay entre pasos) que el agente o una automatización puede disparar.
**Estado real (2026-09-14)**: el módulo existe en la cuenta (carpeta "XTR" vista, contenido sin abrir todavía — P6). No confirmado si el agente elige el audio por criterio propio o solo por gatillo de palabra clave fija.
**Fuente primaria**: [[10-ds-agente-ds-voice-manual]] (manual completo de la plataforma base), [[16-auditoria-completa-crm]], [[26-respuestas-reunion-soporte-2026-09-14]] #13-14.

## Los 4 tipos de Criativos
- **Mensagens**: texto con variables `Nome Completo`, `Primeiro Nome`, **`Saudação`** (auto-completa "Bom dia"/"Boa tarde"/"Boa noite" según la hora real — confirmado que existe en la cuenta real, visto en el editor).
- **Áudios**: audio real subido. La opción **"Enviar como gravado na hora"** (muestra "grabando audio..." al cliente) está documentada en la plataforma base — **no confirmada en la cuenta real todavía**.
- **Mídias**: imágenes/videos con leyenda.
- **Documentos**: PDFs, catálogos, propuestas ya armadas — incluye el recurso **"Métodos de pago"** (Itaú, Santander, PREX), que necesita conectarse al agente de Cierre (Q1).

## Gatilhos de DS Voice — distintos del "Analisador de Ações" del agente
Disparan por **coincidencia de texto literal**, sin pasar por la IA — un anuncio de Meta manda al cliente con un mensaje pre-armado fijo, el gatillo lo detecta y manda un funil humanizado (con delay, audio "grabándose") antes de que la IA o un humano intervengan. Distinto de la acción **"Enviar funil de Criativos"** que el agente SÍ puede invocar por su propio criterio en medio de la conversación (confirmado como chip real del editor de Instrucciones).

## Por qué le importa al proyecto (conecta con la idea de audios personalizados)
La idea original del usuario — audios pregrabados por producto/situación, presentados "como si fueran grabados en el momento" — es exactamente lo que permite este módulo, sin necesitar nada externo (Hermes, TTS, etc.). Es el primer paso más barato hacia esa idea (A23), y no depende de resolver primero la arquitectura de [[fit-brain-vision]].

## Pendientes relacionados
P6 (entrar a la carpeta "XTR" y ver qué hay), A23 (grabar 3-5 audios reales + agregar la regla al prompt de cuándo usar cada uno), Q1 (conectar "Métodos de pago" al prompt de Cierre), S9 (confirmar si el agente elige el funil por criterio propio).
