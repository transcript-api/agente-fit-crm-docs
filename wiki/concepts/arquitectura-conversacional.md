# Cómo tienen que razonar los agentes — arquitectura conversacional

**Qué es**: el conjunto de reglas de diseño aprendidas probando el Recepcionista en vivo (auditoría con ChatGPT, 2026-09-19 a 09-21). Es la referencia más completa que existe sobre lógica de agentes en este proyecto — **leer esto antes de tocar cualquier prompt**.
**Fuente primaria**: [[34-arquitectura-conversacional-aprendizajes-agentes]] (documento completo, 29 secciones — esta página es la destilación, no el reemplazo).

## La conclusión central
El problema ya no es "escribir un prompt que venda bien" — es una arquitectura conversacional donde cada agente sabe exactamente qué puede afirmar, qué tiene que obtener, cuándo dejar de preguntar, y cómo mantener la ilusión de una sola conversación coherente. El salto de calidad viene de la lógica, no de frases "más persuasivas".

## Las reglas que más rompieron cosas, y su corrección

**Descubrimiento vs. puente** (la más importante). Descubrimiento = falta un dato indispensable → preguntar y **esperar** la respuesta, nunca transferir todavía. Puente = ya hay contexto suficiente, pero el CRM necesita una pregunta nueva entrando para activar al siguiente agente (restricción técnica real, ver [[agentes-legado-9882-9883-9884]]) → hacer la pregunta y transferir en el mismo turno, sin esperar. Confundir los dos hace que el agente **fabrique preguntas** solo para satisfacer al CRM (envío/retiro, sabores, rutina — nada que el cliente haya pedido). Regla: antes de preguntar algo, preguntarse qué decisión cambia según la respuesta; si no cambia nada, la pregunta sobra.

**No inventar, ni siquiera dentro de una pregunta.** "¿Era de 900g o 1.8kg?" contamina la conversación con posibilidades que no se sabe si existen, y puede inducir al cliente a "recordar" algo mal. Mejor: "Te acordás de algún detalle del producto?". Los ejemplos concretos DENTRO del prompt (productos, precios, gramajes de ejemplo) también contaminan — el modelo los puede tratar como conocimiento comercial real. Por eso los prompts recientes prefieren ejemplos de comportamiento abstracto sobre ejemplos de catálogo concreto.

**Identificación antes que diagnóstico, y la suficiencia depende de la consulta.** No existe "producto identificado" en abstracto — existe "identificado lo suficiente para ESTA pregunta". "Quiero proteína DUX, no sé cuál" alcanza para pasar a asesoramiento. "Quiero la proteína DUX que ya elegí, necesito precio" NO alcanza sin saber cuál. Niveles: marca → categoría → producto → variante → SKU.

**Lo que el cliente afirma ≠ la verdad comercial.** "Vi que está a $1.290" es una afirmación del cliente sobre haber visto ese número, no un precio confirmado. Aplica a precio, promo, stock, presentación — nunca se convierten en hecho solo porque el cliente los dijo. Incluso una frase que no afirma nada directamente puede presuponer algo sin querer ("para avanzar bien con la promo..." ya asume que existe).

**Responder primero lo que preguntaron.** Violado constantemente: "¿cómo pago?" respondido con "¿vas a retirar o querés envío?" es un error grave de routing, no de estilo — aumenta muchísimo la sensación de inteligencia cuando se corrige.

**Ambigüedad: aclarar antes de asumir.** "Eso es seguro o qué?" tras hablar de envío llevó a que el agente inventara "paquetes cerrados y tracking" asumiendo que hablaba de seguridad física. Si una frase corta tiene varias interpretaciones que llevan a acciones distintas, aclarar, nunca elegir.

**Seguridad como override total, no un detalle de una etapa.** Dolor/alergia/malestar vinculado a un producto → corta el flujo comercial entero, va a Atención Humana, sin diagnóstico ni recomendación alternativa. Tiene que existir en TODOS los agentes (Recepción, Conversión, Cierre, Seguimiento, Recompra), no solo donde se probó primero. Sin resolver todavía: la política exacta para menores, embarazo, lactancia, medicación (A3).

**STOP SELLING.** Cuando el cliente demuestra intención inequívoca de comprar algo ya identificado, dejar de recomendar/comparar/persuadir de inmediato. Un agente puede perder la venta por seguir vendiendo después de que el cliente ya cerró la venta en su cabeza — es el error real más caro visto en Conversión.

**El agente no narra su memoria.** "Ya tenés decidido que querés X y que no se vaya de precio, perfecto" no agrega nada — el cliente lo acaba de decir. Usar el contexto en silencio; se demuestra por no repetir preguntas, no por decir "recuerdo que...".

## Orden de prioridad al diseñar/corregir un prompt
`correctitud → routing → relevancia → fluidez → persuasión → estética lingüística`. No optimizar estilo antes que lógica — una respuesta que "suena linda" pero desvía la conversación sigue siendo una mala respuesta.

## Fases del proyecto, en orden (no al revés)
1. Eliminar errores de lógica. 2. Eliminar alucinaciones. 3. Reducir fricción. 4. Mejorar persuasión. 5. Aprender a escala. Hacer más persuasivo un agente que todavía puede inventar stock solo aumenta el impacto del error.

## Lo que sigue sin resolverse (ver también `PENDIENTES.md`, prefijo A)
Jerarquía de fuentes de verdad entre Sheets/Bling/Shopify/anuncio/cliente (A11); suite de regresión permanente con 12 casos T01-T12 (A13, parcialmente reemplazada por los casos REC-LIVE de [[agente-recepcionista-comercial-10005]]); versionado de prompts con IDs de regla tipo `R-014` (A14); routing de compra directa cuando el pedido ya está definido — ¿directo a Cierre, vía Conversión breve, o híbrido? (A8, depende de A7: qué herramientas tiene Cierre hoy).

Ver [[fit-brain-vision]] para la arquitectura futura que resolvería de raíz varios de estos puntos (separar razonamiento comercial de redacción).
