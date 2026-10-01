# Fit Brain — la arquitectura futura (diseño, nada construido)

**Qué es**: una capa externa propuesta, compartida entre todos los agentes, que separaría el **razonamiento comercial** (qué está pasando, qué sabe del cliente, qué hacer) de la **redacción** (el mensaje de WhatsApp en sí). Hoy ambas cosas conviven forzadas dentro de un único prompt/modelo por agente.
**Estado real**: diseño conceptual maduro (nacido de la auditoría con ChatGPT), **una incertidumbre técnica crítica sin resolver bloquea todo lo demás** (A10). Nada construido.
**Fuente primaria**: [[34-arquitectura-conversacional-aprendizajes-agentes]] §20 y §29 (el detalle completo, incluida la investigación de Hermes Agent).

## La idea central
```
WhatsApp → rmsystemm → Fit Brain → herramientas/datos → estrategia → rmsystemm → mensaje
```
Fit Brain recibe el mensaje + contexto (historial, etapa, variables, origen), consulta memoria del cliente + memoria comercial + catálogo + reglas aprendidas, y devuelve un paquete estructurado (intención, estado, hechos confirmados vs. afirmados por el cliente, estrategia, siguiente acción) — **el modelo del agente en rmsystemm solo redacta**, no decide.

Esto resolvería de raíz varios problemas ya medidos: un prompt gigante que tiene que descubrir a la vez estado + memoria + herramienta + catálogo + routing + seguridad + estilo en una sola pasada es más frágil que una arquitectura donde cada regla entra al contexto **solo cuando aplica** (ej. la regla de "marca no trabajada" solo se inyecta si el cliente preguntó por una marca no trabajada, no en el 100% de las conversaciones).

## La incertidumbre crítica que bloquea todo (A10)
No está confirmado si rmsystemm puede inyectar el resultado de una llamada externa en el contexto del agente **antes** de que genere la respuesta. Tres caminos evaluados, ninguno probado:
1. Tool call HTTP del propio agente en medio de la generación — probablemente demasiado lento si Fit Brain tiene un orquestador + especialistas (varios segundos), contra el estándar de 1-2s para no ver la respuesta trabada.
2. Un Flujo de Automatización con "Requisição HTTP" + "Salvar Variável" que precalcula MIENTRAS el agente espera su delay de respuesta configurado (25-28s) — el agente leería la variable ya lista al generar. No probado, pero el margen de tiempo juega a favor.
3. Fit Brain contesta directo por la API (`POST /messages/send/v2`) y rmsystemm queda solo como canal + CRM — evita la duda de latencia por completo, pero se pierde el agente nativo (mover columna/taguear se haría por API, ver [[api-rmsystemm]]).

## Hermes Agent (Nous Research) — motor candidato, verificado como real pero no probado con datos del proyecto
Confirmado contra documentación oficial (no solo lo que dijo ChatGPT): open source, MIT, self-hosted, skills que se cargan en 3 niveles (metadata liviana siempre, contenido completo solo bajo demanda — resuelve justo el problema del prompt gigante), servidor propio compatible con la API de OpenAI, y **conector nativo de WhatsApp** (hallazgo propio, no lo había mencionado ChatGPT) — permitiría que Fit Brain le hable al cliente directo, sin pasar por el agente nativo de rmsystemm, sincronizando el pipeline aparte por API.

**Principio de diseño que conviene fijar si esto avanza**: Fit Brain es la arquitectura propia (memoria, reglas, catálogo, conexión con Bling/rmsystemm quedan bajo control propio); Hermes es solo el motor de agentes que la ejecuta — si aparece algo mejor en un año, se cambia el motor sin perder "el cerebro".

**Lo que NO se puede hacer**: apuntar el agente nativo de rmsystemm directo a un servidor Hermes propio — la configuración del agente solo tiene Proveedor/Clave/Modelo, sin campo de URL propia (confirmado, no hay forma salvo que soporte lo habilite).

## Diseño con especialistas (idea que le gustó al usuario, no implementada)
Un orquestador decide a quién consultar (Ventas, Nutrición, Memoria/Cliente) en vez de que todos respondan siempre — más rápido y barato. El especialista de Nutrición chocaría directo con la regla de seguridad (nunca dosis/diagnóstico, siempre a un humano) si no se le pone el mismo límite explícito (A24).

## Audios generados por Fit Brain
Un `generar_audio()` con un pequeño motor de decisión (no manda audio solo porque puede) — pero antes hace falta saber cómo llega un audio mandado por la API real (¿nota de voz con "grabando..." o archivo adjunto? A22, sin probar) y si el agente entiende audios entrantes (S8, contradicción sin resolver entre lo que dice "Mi Plan" y lo que dijo soporte). Sin esto, mandar audios generaría clientes contestando con audios que el sistema no procesa.

## Pendientes relacionados
A10 (🔴 crítico, probar primero de todo lo demás), A21 (prototipo mínimo con 1-2 skills, midiendo latencia real), A22 (probar cómo llega un audio por la API), A20 (confirmar empíricamente que las variables persisten, no solo palabra de soporte).
