# Patrones Reales de Venta (leídos de conversaciones reales, sin responder nada)

Fuente: conversaciones reales dentro del pipeline "CL | COMERCIAL" (ver [[02-pipeline-comercial-real]]), vendedor humano **Santiago**. Esto es la base para escribir el prompt del Agente de IA — el objetivo es que el agente venda así, no como el quiz rígido viejo (ver [[05-infraestructura-tecnica]] sección DS Bot/Typebot).

## Conversación completa de referencia (cliente "Chebis", lead de Facebook Ads)
Anuncio: "Vitamin Horse Hipercalórico 3KG" — promo 1 unidad $1.290 / 2 unidades $1.990.

1. Cliente: *"Buenos días. Info por favor"*
2. (2h de demora en responder) Santiago se presenta: *"Buenas! como estás? Por aca te habla Santiago, asesor de fitness, un placer comunicarme contigo."*
3. Envía imagen del producto.
4. Refuerza info: *"Como viste en la imagen, viene súper completo con 35g de proteína, creatina, glutamina y arginina por toma, ideal para subir de peso y ganar masa muscular."*
5. **Pregunta diagnóstica de objetivo**: *"Estás buscando actualmente aumentar tu masa y volumen muscular actualmente?"*
6. Cliente responde con contexto NO pedido explícitamente: *"No.. Solamente complementar un poco de ayuda... Nunca tomé nada de eso y tengo actualmente 42 años"* + *"Trabajo todo el día en construcción y realizo algunas rutinas diarias..."*
7. (~2h después) Santiago **valida el contexto específico del cliente**: *"¡Buenísimo Chebis, clarísimo! Entiendo perfecto. Trabajar en construcción todo el día ya es un desgaste físico enorme y un entrenamiento en sí mismo."*
8. **Reencuadra la necesidad y recomienda**: *"Para lo que buscas (recuperación muscular, fuerza y mantenerte bien, sin ganar peso graso ni volumen pesado), este combo te viene como anillo al dedo"*
9. Envía imagen del combo.
10. Lista productos con **un beneficio por línea, atado a lo que el cliente dijo**: *"->Nutri Whey 900g: Proteína excelente para reparar los músculos... ->Creatina 100% Pura 300g: Te va a dar más resistencia y energía en el trabajo diario **sin acumular grasa**. ->Vaso Mezclador de regalo."* (el "sin acumular grasa" responde directo a la preocupación implícita del cliente).
11. **Cierre suave, no binario**: *"Es la forma más económica y completa de arrancar al mínimo y seguro. ¿Te gustaría que te lo enviemos a domicilio?"* (pregunta por logística, no "¿lo querés?").
12. Cliente: *"Genial. De donde son ustedes? Qué costo tiene el envío?"* (señal de compra + pregunta de confianza/logística).

## Estructura del guion (para el prompt del agente)
`Presentación personal → refuerzo de info del producto/anuncio → pregunta de objetivo → ESCUCHAR contexto no pedido (trabajo, edad, experiencia) → validar ese contexto específico → recomendar atando el producto a lo que dijo → cierre preguntando por logística de entrega, no por un sí/no directo.`

## Otras preguntas/objeciones reales vistas (muestreo amplio de distintos leads, previews de tarjetas)
- Logística/confianza: *"¿De dónde son ustedes? ¿Costo de envío?"*, *"¿Dónde se ubican?"*
- Intención directa de compra: *"Hola, quiero comprar el Hipercalorico Vitamin Horse de 3KG"*
- Preguntas de especificación/dosis: *"¿150 gramos tenés?"*, *"Decime, en los 2 formatos cuánto trae el producto y de cuánto es la dosis para saber cuántas tomas rinde"*, *"¿Tienes glicinato de magnesio que aporte 250mg de magnesio?"*
- Objeción de calidad/confianza: *"¿La creatina Creapure está aprobada por un laboratorio alemán?"*
- Necesidad expresada espontáneamente (sin que se la pidan): *"Buen día yo quería algo para ganar masa muscular y energía para mi trabajo ya que camino mucho y me canso"*
- Precio como filtro: *"El que está de promo"*
- Cierre simple: *"Gracias"*

## Flujo de captura de datos de envío (visto en mensajes de Santiago)
Formato usado para cerrar el pedido:
`Nombre y apellido: / Celular: / Departamento: / Dirección y Barrio: (En caso de que sea a alguna sucursal DAC/Turil nos indicás a cuál)`
— DAC y Turil son empresas de encomiendas/logística reales usadas en Uruguay (confirma que la operación es en Uruguay — números +598).

## Tono general de Santiago
- Tuteo rioplatense/uruguayo ("vos", "tenés").
- **Corrección del usuario (2026-09-10): NUNCA usar "che"** — lo marcó como ridículo para el agente, aunque sí se pueden usar otras expresiones rioplatenses.
- **Signos de pregunta: solo el de cierre ("?"), nunca el de apertura ("¿")** — así escribe realmente el equipo por WhatsApp (ver ejemplos reales abajo), es más natural/casual.
- **Nunca mandar guiones bajos/blancos para completar ("___") ni nada que un humano no tipearía.**
- Cercano pero profesional, se presenta por nombre y rol la primera vez.
- Usa emojis con moderación (👋 💙 🙌 💪).
- No presiona con precio de entrada — el precio aparece recién después del diagnóstico.
- Cierra con preguntas operativas ("¿te lo mando a domicilio?", "¿te gustaría avanzar con una no más?") en vez de pedir un sí/no directo.
- Tono puede volverse más juguetón/informal con clientes que ya tienen rapport (repetición de letras para énfasis: "Dale Maidaaa!", "Maidaaa vamoo!") — no todo es siempre formal.

## Plantillas reales casi fijas (encontradas repetidas, palabra por palabra, en múltiples conversaciones distintas — 2026-09-10)
Estas NO son ejemplos sueltos, son textos que el equipo reusa consistentemente entre distintos vendedores y distintos clientes. Van directo al prompt.

**Apertura para lead de anuncio**:
> "Buenas! como estás [Nombre]? Por aca te habla [Santiago/Valentina/Federico], asesor de Fitness Suplementos, un placer comunicarme contigo!"

Variante más corta (Valentina):
> "Buenas aca te habla [Nombre del vendedor], como puedo asistirte? Comentame si preferis avanzar sobre lo que viste en la publicidad o agregarle otro suplemento?"

**Apertura de recompra/seguimiento a cliente que ya compró antes**:
> "[Nombre]! como estas? Santiago por acá, Como venis con la suplementación?"

**Pregunta que distingue cliente objetivo vs. que necesita asesoramiento** (una sola pregunta, elegante, cubre los dos casos):
> "has probado alguna proteína o creatina antes, o estás buscando asesoramiento desde cero para elegir tu primer combo?"

**Confirmación final de compra (visto casi textual en al menos 5 conversaciones distintas de venta cerrada)**:
> "¡Todo listo y confirmado! ✅ Te cuento cómo seguimos, esta misma tarde despachamos tu pedido por DAC, mañana a primera hora te comparto el código de seguimiento por acá en cuanto lo tengamos cargado en el sistema. 📦 Muchísimas gracias por la confianza y por elegirnos para acompañarte en tu suplementación!. Acordate que cuando te llegue el kit podés escribirme para ajustar cualquier duda con las tomas. ¡Un saludo grande, buena jornada y a darle con todo! 🚀💪🏻"

**Mensaje de código de rastreo** (lo manda otro miembro del equipo, no siempre el mismo vendedor — probablemente un mensaje separado/semi-automatizado post-despacho):
> "Hola, cómo estás? Te compartimos el número de rastreo de tu pedido enviado por DAC: 📦 Código de seguimiento: [XXX] Gracias por tu confianza. Cualquier duda, estamos a las órdenes. 😊"

**Reactivación sin presión (cliente que ya compró, para cuando se le está por terminar el producto)**:
> "Avisame cuando te quede poco de este segundo tarro y te dejo la reposición prontas sin compromiso"

**Pregunta de sabor (SOLO para proteína, antes de cerrar el pedido)**:
> "que sabor te envio, chocolate, frutilla, vainilla?"

## Reglas del dueño de la empresa sobre cómo recomendar productos (2026-09-10, dichas directamente al usuario)
- **Nunca mandar 10 opciones** — máximo 2 o 3.
- Entre esas 2-3, priorizar los productos más vendidos (best-sellers).
- **Orden sugerido: de más caro a más barato** cuando se presentan opciones de productos distintos entre sí (ej. 3 creatinas de marcas/tamaños distintos) — razón psicológica: empezar alto ancla la percepción de valor y hace más probable la compra que empezar bajo. *(Nota: en las conversaciones reales revisadas no siempre se ve este orden aplicado — es la mejora que pidió el dueño para ir aplicando de acá en adelante, no necesariamente lo que ya se hacía. Distinto de listar tamaños de UN mismo producto, ahí no aplica necesariamente el mismo criterio.)*
- No hay que "esconder" las demás opciones aunque se lidere con la más cara — se las sigue mencionando.
- **Cliente objetivo/calificado** (ya sabe lo que quiere, ya compró antes, es directo): no hace falta la explicación larga de diagnóstico — ir directo a confirmar lo que pide + ofrecer algo más ("además de esa creatina, te interesa algo más? tenemos esta proteína que nos llegó" / "esta coctelera de tal marca").
- **Cliente que necesita guía** (la mayoría): sí aplica el flujo completo de diagnóstico de objetivo.
- **Detectar el ritmo que prefiere cada cliente**: algunos quieren seguimiento/acompañamiento, otros son rápidos y transaccionales — hay que adaptarse, no es un patrón fijo todavía (pendiente de definir cómo detectarlo con reglas concretas, por ahora es una observación cualitativa).

## Detalle logístico adicional
El costo de envío por DAC (cuando no está incluido) ronda los **$250-280 pesos uruguayos**, y en algunos casos lo abona el cliente aparte/en el momento de la entrega, no incluido en el precio del producto.

## Anuncios reales (para que el agente pueda reconocer de qué anuncio viene un lead)
Ejemplo real de copy de anuncio de Facebook/Instagram:
> "🔥 Potencia tu rendimiento de forma natural 🔥
> 💪 TESTO DILATED BODY NUTRY – Pre hormonal natural
> ✅ 120 cápsulas por solo $990
> 🔥 PROMO ESPECIAL: Llevá 2 frascos por $1650 y te regalamos 2 sachets extra de 30 cápsulas cada uno.
> ⚡ Más energía, más rendimiento y más actitud para tus entrenamientos.
> 🚨 ¡Unidades limitadas! Aprovechá antes de que se agoten.
> 📩 Enviános un mensaje y reservá el tuyo."

**Pendiente**: armar una base de conocimiento con los anuncios activos (copy + producto + promo) para que el agente pueda identificar de cuál vino el lead y arrancar la conversación ya sabiendo qué le interesa, en vez de preguntar todo de cero.

## Práctica real confirmada: compartir contenido de Instagram como prueba social
En al menos una conversación real, Santiago compartió un link de Reel de Instagram en medio de la charla de venta (`instagram.com/reel/...`) — confirma que la idea de generar rapport con contenido real de la marca (mencionada como hipótesis en [[12-caso-real-rafael-prompt-produccion]]) ya es una práctica real del equipo, no solo una idea teórica.
