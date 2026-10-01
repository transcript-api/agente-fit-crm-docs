# Cómo vende el equipo humano — la base de todos los prompts

**Qué es**: patrones extraídos de conversaciones REALES del vendedor humano Santiago (y de otros vendedores: Valentina, Federico) en el pipeline `CL | COMERCIAL`, leídos sin responder nada, como base para que el agente venda así en vez de como un quiz rígido.
**Fuente primaria**: [[04-patrones-reales-de-venta]] (el análisis completo con la conversación de referencia completa).

## La estructura del guion real
`Presentación personal → refuerzo de info del producto/anuncio → pregunta de objetivo → ESCUCHAR contexto no pedido (trabajo, edad, experiencia) → validar ese contexto específico → recomendar atando el producto a lo que dijo → cierre preguntando por logística de entrega, no por un sí/no directo`.

El detalle que más se repite en las conversaciones buenas: cuando el cliente da contexto que nadie le pidió (edad, trabajo, rutina), un vendedor real lo usa para la recomendación en vez de ignorarlo — es la señal más fuerte de "escucha real" que se puede reproducir en un prompt.

## Reglas de tono confirmadas (no teóricas — vistas repetidas en múltiples vendedores)
- Tuteo rioplatense/uruguayo ("vos"), nunca "che" (corrección explícita del usuario, lo marcó como ridículo para el agente).
- Signo de pregunta solo de cierre ("?"), nunca de apertura ("¿") — así escribe realmente el equipo.
- Nunca guiones bajos/blancos para completar, ni nada que un humano no tipearía a mano.
- Cierre con preguntas operativas ("¿te lo mando a domicilio?"), no un sí/no directo.

## Reglas de recomendación del dueño de la empresa (dichas directamente, no inferidas)
- Nunca más de 2-3 opciones.
- Priorizar los best-sellers entre esas 2-3.
- Orden sugerido de más caro a más barato cuando se comparan productos DISTINTOS (ancla la percepción de valor) — no necesariamente aplica al comparar tamaños del mismo producto.
- No esconder las demás opciones aunque se lidere con la más cara.
- Cliente objetivo (ya sabe qué quiere, ya compró antes): saltar el diagnóstico largo, ir directo a confirmar + ofrecer algo más.
- Cliente que necesita guía (la mayoría): sí aplica el diagnóstico completo de objetivo.

## Plantillas casi fijas (texto reusado palabra por palabra por distintos vendedores — van directo al prompt)
- Apertura de anuncio: *"Buenas! como estás [Nombre]? Por aca te habla [vendedor], asesor de Fitness Suplementos, un placer comunicarme contigo!"*
- Pregunta que distingue objetivo vs. necesita guía, en una sola pregunta elegante: *"has probado alguna proteína o creatina antes, o estás buscando asesoramiento desde cero para elegir tu primer combo?"*
- Confirmación de venta cerrada (vista casi textual en 5+ conversaciones): el mensaje largo de "Todo listo y confirmado!" que reaparece en [[agentes-legado-9882-9883-9884]] como plantilla del agente de Cierre.
- Pregunta de sabor (SOLO proteína, antes de cerrar): *"que sabor te envio, chocolate, frutilla, vainilla?"*

## Datos logísticos y de contexto que salen de acá
Costo de envío por DAC ronda $250-280 UYU cuando no está incluido. Formato real de captura de datos de envío: `Nombre y apellido / Celular / Departamento / Dirección y Barrio (sucursal DAC/Turil si aplica)`. Confirmado que compartir contenido de Instagram (reels reales) como prueba social ya es práctica real del equipo, no solo una idea teórica.

## Relación con lo que vino después
Estos patrones son la base de la Etapa 1/2 de los primeros prompts (ver [[agentes-legado-9882-9883-9884]]) y siguen citados como referencia en la auditoría de arquitectura ([[arquitectura-conversacional]]) — por ejemplo, la regla de "identificación antes que diagnóstico" es una formalización de cómo Santiago ya responde primero lo concreto antes de profundizar. Se complementan con [[biblioteca-prompts-y-caso-rafael]], que aportó la estructura formal de bloques y el catálogo de funciones que faltaba para pasar de "cómo vende Santiago" a "cómo se escribe eso en un prompt ejecutable".
