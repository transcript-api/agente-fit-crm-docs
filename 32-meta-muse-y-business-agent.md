# Meta: Muse AI y Business Agent — qué son, y cuál importa

**Actualizado: 2026-09-15.** Archivo de referencia. Acá entra todo el material crudo; a la auditoría del cliente solo llega la conclusión.

---

## ⚠️ Primero: son DOS productos distintos de Meta

Se confundieron durante varios días de trabajo. Conviene tenerlo claro:

| | **Muse AI** | **Meta Business Agent** |
|---|---|---|
| Qué es | Asistente personal multimodal de propósito general | Agente de IA para atención comercial |
| Para quién | Personas, cuenta personal de Meta | Negocios, WhatsApp Business |
| Cómo se conecta a WhatsApp | **Código QR** (sesión multidispositivo, como WhatsApp Web) | Integrado en WhatsApp Business |
| Qué hace | Genera imágenes, video, audio, mini-apps, código; lee correo; automatiza tareas personales | Responde clientes, recomienda del catálogo, califica leads, deriva a humano |
| Disponibilidad | Solo EE.UU. (requiere VPN desde fuera) | Global desde junio 2026 |
| Precio | Gratis, 100M tokens/semana | Gratis hoy, planes pagos anunciados |
| **¿Compite con nuestro agente?** | **No. Es otra categoría.** | **Sí, parcialmente.** |

**El que importa para la propuesta comercial es Business Agent.** Muse es otra cosa — pero tiene un riesgo concreto que sí hay que conocer (ver §2).

---

## 1. Muse AI — informe del video (2026-09-15)

> Fuente: análisis de video procesado en Google AI Studio. Video 1 de una serie; los demás se agregan abajo a medida que se transcriban.

### Qué es
Asistente personal de Meta con entorno de ejecución propio: una **máquina virtual Linux en la nube** donde el agente instala paquetes (`pip`) y corre código para resolver lo que se le pide. Se accede en `muse.ai` con cuenta Meta o email + código de 6 dígitos.

### Qué se DEMOSTRÓ funcionando en pantalla
- Creación y ejecución en vivo de código web interactivo: una app de tareas en HTML/JS, y un videojuego 3D navegable ("Bahía Neón", estilo GTA, con ciudad procedural, tráfico y policía, controles WASD)
- Generación e **iteración** de imágenes incorporando la foto del usuario
- Generación de video con voz sincronizada en español
- Ensamblado automático de un corto animado de 40 s (4 clips unidos con voz en off)
- **Podcast de audio en español de +4 minutos con dos voces sintéticas** ("Lucía y Marco")
- Conexión a WhatsApp personal por QR, con contacto propio ("Alvi") y avatar animado
- **Transcripción de notas de voz** recibidas por WhatsApp: instala `faster-whisper` en su sandbox y responde en texto
- Panel de consumo de tokens (10% consumido tras todas las pruebas de la demo)
- Sección "Feed" con noticias personalizadas, "Ideas" con recetas de automatización, y "Objetivos" con seguimiento de metas personales

### Qué se AFIRMA pero NO se demuestra
- Compra y pago autónomo en tiendas de terceros (solo se vio un mockup)
- Reprogramación autónoma de vuelos tras demoras
- Gestión operativa bidireccional de Instagram DMs, Messenger o Threads

### Conectores que ofrece
Outlook · Calendly · Google · Meta / Instagram / Threads / WhatsApp · Spotify · Printify

### Límites duros
- **Solo Estados Unidos.** Desde fuera exige VPN residencial USA, y a veces cambio de red porque bloquea la IP
- Cuenta **personal** de Meta. No usa WhatsApp Business App ni Cloud API
- 100M tokens gratis por semana, se reinician semanalmente
- Aviso visible en WhatsApp: *"La IA genera los mensajes; algunos pueden ser imprecisos o inapropiados"*
- Aviso de acceso: *"Muse isn't available to you yet — Access is currently limited"*

### Precio
Gratis en despliegue. Cita de Mark Zuckerberg: *"Muse está diseñado para ayudar a entregar superinteligencia personal a todos con el tiempo, por lo que lo estamos haciendo gratuito para usar hasta 100M de tokens por semana. Hay planes de suscripción para aquellos usuarios que usan aún más cómputo."*

### Las 12 preguntas — resultado
De las preguntas sobre uso comercial (leer catálogo externo, escribir en un CRM, derivar a vendedor, memoria por cliente, seguimiento automático, control del guion de venta, evitar precios inventados, exportar datos, convivencia con CRM, cambios de precio de Meta): **el video no responde ninguna**. No porque falte información en el video, sino porque **Muse no está diseñado para eso**.

---

## 2. 🔴 El riesgo que sí importa: Muse toma el número por QR

Este es el hallazgo más relevante del análisis, y es técnico pero tiene consecuencia directa.

Muse se vincula a WhatsApp **escaneando un código QR**, igual que WhatsApp Web. Eso significa que se conecta como **una sesión multidispositivo más del número**, no a través de la API oficial.

Dos consecuencias:

1. **Conflicto con el CRM.** El número comercial ya está vinculado al CRM. Sumar Muse por QR mete una segunda sesión sobre el mismo número. En el mejor caso compiten por responder; en el peor, se desconecta el CRM.
2. **Riesgo de bloqueo.** Usar una sesión QR para tráfico comercial masivo (~5.000 mensajes/mes) va contra las políticas de uso de WhatsApp. El riesgo de bloqueo del número es real, y el número es el activo comercial de la empresa.

**Conclusión: Muse no debe enchufarse al número comercial. Punto.**

---

## 3. Dónde sí podría servir Muse

No para atención. Pero el video demuestra capacidades de **producción de contenido** que hoy se pagan aparte:

- Video con voz sincronizada en español
- Podcast de audio con dos voces (+4 min, español)
- Imágenes iteradas sobre fotos propias
- Cortos animados ensamblados solos

Eso conecta con una línea que ya estaba anotada: **contenido para vender a mayoristas** (ver [[19-investigacion-externa-escalabilidad]]). Y con los **audios pregrabados por producto** que el equipo quería grabar a mano (pendiente E4).

**Pero está bloqueado por el límite geográfico:** solo EE.UU., con VPN. Para uso serio de producción eso es frágil.

**Veredicto:** herramienta interesante para explorar en contenido, con una cuenta personal y separada del número comercial. **No entra en la propuesta comercial actual.**

---

## 4. Meta Business Agent — lo que sí compite

> ⚠️ Esta sección se basa en la **comunicación pública de Meta**, no en videos analizados. Cuando haya material en video, se verifica.

Lanzado globalmente el **3 de junio de 2026**. Corre sobre Llama. Según Meta:
- Responde preguntas específicas del negocio
- **Recomienda productos desde el catálogo del negocio**
- Agenda citas y califica leads entrantes
- Deriva a una persona del equipo cuando corresponde
- "Cierra ventas"
- Da al dueño un resumen matutino de las conversaciones de la noche
- Se activa en minutos; funciona en WhatsApp, Messenger e Instagram
- Aprende de lo que se sube al perfil de WhatsApp Business, no de una base genérica
- **Gratis hoy**, con suscripciones pagas anunciadas "en los próximos meses"
- La versión **Business Agent Platform** (empresas grandes) conecta con cientos de sistemas, **Shopify incluido**

### Lo que hay que verificar con videos
1. Si convive con un CRM externo ya vinculado al mismo número, o hay conflicto (la pregunta decisiva)
2. Si puede escribir en un sistema externo: mover una tarjeta, poner una etiqueta
3. Si guarda memoria por cliente entre conversaciones
4. Si puede iniciar contacto días después sin que el cliente escriba (recompra)
5. Cuánto control real hay sobre el guion de venta
6. Qué implica exactamente la integración con Shopify de la versión Platform

---

## 5. Qué va a la auditoría del cliente

**Casi nada de todo lo anterior.** El gerente no quiere entender estos productos: quiere saber si tiene que preocuparse. La sección 07 de la auditoría dice tres cosas y nada más:

1. Muse es otra categoría de producto, y enchufarlo al número comercial es riesgoso
2. Business Agent sí se parece, pero resuelve *responder*, no *vender dentro de un proceso*
3. No son excluyentes con el sistema propio

Todo el detalle vive acá.

---

## Pendiente
**PENDIENTE:** agregar los análisis de los videos 2 a 5 cuando estén transcritos, y verificar las 6 preguntas abiertas de §4 sobre Business Agent.
