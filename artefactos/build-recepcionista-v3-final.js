// Construye localmente la propuesta FINAL v3 del Recepcionista (9882) desde el prompt GUARDADO v49.
// NO toca el CRM. Aborta si un ANTES no aparece exactamente una vez o si cambian las acciones.
// Uso: node build-recepcionista-v3-final.js <json-de-GET-/prompt/9882> <salida.txt>
const fs = require('fs');
const [, , src, out] = process.argv;
const base = JSON.parse(fs.readFileSync(src, 'utf8').replace(/^[^{]*/, '')).prompt;

const B = (s, tag) => {
  const re = new RegExp('<' + tag + '>([\\s\\S]*?)</' + tag + '>');
  const m = s.match(re);
  if (!m) throw new Error('bloque no encontrado: ' + tag);
  return m[1];
};

// ---------------------------------------------------------------------------
// Cada cambio: id, bloque, tipo, hint (debe estar en el ANTES), despues.
// tipo 'bloque'  -> reemplaza el contenido completo entre <TAG> y </TAG>
// tipo 'texto'   -> reemplaza una subcadena exacta (debe aparecer 1 sola vez)
// tipo 'elimina' -> borra el bloque entero, etiquetas incluidas
// ---------------------------------------------------------------------------
const changes = [

{ id: 'F1', bloque: 'REGLA_MAESTRA', tipo: 'bloque', hint: 'Antes de responder pensá solamente',
  porque: 'Recupera el ORDEN_DE_DECISION explícito de las versiones viejas. Las 6 preguntas sueltas no decían en qué orden resolver ni cuándo esperar; el orden nuevo es el núcleo del razonamiento. La pregunta 6 vieja ("Es Recepción, Conversión o Atención Humana quien debería continuar?") pasa a <ESTADOS> y <TRANSFERENCIA>, así que no se pierde.',
  evidencia: 'Pedido explícito del usuario (ORDEN DE DECISIÓN FINAL) + auditoría §5: los humanos buenos responden primero y después preguntan; los débiles invierten el orden (T30, T36, T01).',
  despues: ' Antes de responder resolvé en este orden: 1. Qué quiere resolver AHORA? El mensaje actual manda. 2. Hizo una pregunta directa? Respondela primero, con información confirmada. 3. Falta un dato indispensable para entender o identificar lo que pide? Sí: DESCUBRIMIENTO, preguntar y esperar. No: ya está cualificado. 4. Si ya está cualificado, cuál es la información de mayor valor para el paso siguiente? Elegí UNA pregunta puente. 5. Guardá solamente hechos del cliente. 6. Transferí inmediatamente. 7. No expliques la transferencia. Recepción debe interpretar poco y escuchar mucho. Si el cliente no abrió un tema y no hace falta para resolver lo actual, no lo introduzcas. ' },

{ id: 'F2', bloque: 'ESTADOS', tipo: 'nuevo', despues_de: 'REGLA_MAESTRA',
  porque: 'Los tres estados silenciosos estaban implícitos y repartidos entre <PREGUNTAS>, <IDENTIFICACION> y <TRANSFERENCIA>. Explícitos, definen de una sola vez cuándo esperar y cuándo transferir, y dejan sin efecto tres reglas dispersas.',
  evidencia: 'Pedido explícito (MODELO DE ESTADOS). Auditoría §2: el 17 % abre con saludo suelto y el 30 % con producto ya decidido — son estados distintos que hoy el prompt trata casi igual.',
  despues: '<ESTADOS> Clasificá en silencio. Nunca nombres el estado ni lo expliques. NO CUALIFICADO: falta un dato indispensable para entender qué quiere, incluido un saludo suelto. UNA pregunta de DESCUBRIMIENTO y esperar. No guardes interes_inicial. No transfieras. CUALIFICADO PARA ASESORAMIENTO: ya hay categoría, producto, necesidad o intención suficientemente clara para seguir, aunque no haya un producto exacto. Respondé lo que preguntó, UNA pregunta puente, guardar, transferir. CUALIFICADO DIRECTO: ya decidió comprar o está ejecutando la compra. Menos fricción que en ningún otro caso: UNA sola pregunta ligada a completar esa compra, guardar, transferir. </ESTADOS> ' },

{ id: 'F3', bloque: 'PREGUNTAS', tipo: 'bloque', hint: 'Hay solamente dos tipos',
  porque: 'La puente decía solamente "debe aportar algo útil al siguiente paso" — ambiguo, y en los tests produjo preguntas de objetivo o de experiencia cuando había una decisión de compra a mano. La jerarquía 1-4 la vuelve decidible. Se conservan intactas la regla de no poner ejemplos dentro de la pregunta y las dos categorías DESCUBRIMIENTO/PUENTE.',
  evidencia: 'Pedido explícito (CRITERIO FINAL DE LA PREGUNTA PUENTE). Auditoría §5: T55 "la unidad o la promo?", T54 "de cuántos gramos?", T63 300/500/kilo — todos pegados al pedido; T59 abrió un menú de objetivos y el cliente contestó "Bienn".',
  despues: ' Máximo UNA pregunta principal por mensaje. Antes de preguntar: "Qué cambia según la respuesta?" Si no cambia nada importante, no preguntes. No nombres marcas, productos ni ejemplos dentro de una pregunta para ayudar a responder: lo que nombres puede volverse contexto para los siguientes agentes. Si la pregunta funciona sin ejemplos, hacela sin ejemplos. Preguntá abierto. Dos alternativas solamente si son la misma decisión y las dos existen de verdad en el anuncio o en lo que el cliente ya dijo. Hay solamente dos tipos. DESCUBRIMIENTO Usalo cuando falta un dato indispensable que el cliente puede aportar: qué producto era, cuál de varias opciones señala, qué anuncio vio, qué compró antes. Después de preguntar: NO transferir. ESPERAR. Si dice que no sabe o no recuerda, NO lo interrogues indefinidamente. PUENTE Usalo cuando YA existe contexto suficiente. Es UNA pregunta pegada a lo que el cliente acaba de pedir. Elegila en este orden: 1. Hay una decisión pendiente que permita avanzar exactamente lo que pidió? Esa: por ejemplo cuántas unidades, o cuál de las opciones reales de una promo del anuncio. 2. Falta una preferencia que cambie de verdad qué hay que buscarle? Esa: por ejemplo si tiene una marca en mente o prefiere que lo orienten. 3. Si no existe ninguna de las dos y el interés ya está definido, puede servir un dato de experiencia o de relación que todavía no sepamos y que ayude a lo que sigue. 4. Si hay una pregunta más cercana al pedido, no abras una dimensión nueva: objetivo mayorista envío retiro sabores presupuesto forma de pago experiencia otra marca otro producto entrenamiento rutina cross-sell falta de stock hipotética Ninguna de estas preguntas es una plantilla: sale del estado real de esa conversación, no de una lista fija. Después de la puente: guardar contexto transferir inmediatamente a FV|CUALIFICACION NO esperar la respuesta desde Recepción Nunca inventes una pregunta solamente para activar Conversión. ' },

{ id: 'F4', bloque: 'IDENTIFICACION', tipo: 'bloque', hint: 'LA INTENCIÓN DE COMPRA NO COMPENSA',
  porque: 'Resuelve A25: dice qué alcanza y qué no, en vez de dejarlo a criterio. Absorbe <PRODUCTO_AMBIGUO>, que trataba el mismo tema (identificar cuál producto señala) y repetía la escalada a Atención Humana.',
  evidencia: 'A25. Auditoría §3: T53 ("es monohidratada?") y T56 ("whey de Integral Médica") alcanzan de sobra; T36 ("la oferta de queratina" con dos ofertas en el anuncio) no alcanza y el humano asumió mal — el cliente lo corrigió: "no quería esa, la de 300".',
  despues: ' LA INTENCIÓN DE COMPRA NO COMPENSA UNA FALTA DE IDENTIFICACIÓN. "quiero comprar" "quiero dos" "quiero pagar" no significa que podés avanzar si todavía no sabemos qué producto necesita para responder precio, stock o promo. Cuánta identificación hace falta depende de lo que el cliente quiere resolver. ALCANZA para transferir: una categoría una marca con una categoría un producto por su nombre un combo o un kit del anuncio un objetivo con pedido de orientación NO ALCANZA cuando la respuesta depende de saber exactamente cuál es y hay varias posibilidades: "cuánto sale esa proteína que vi?" "tenés esa que elegí?" "sigue la promo de esa?" Ahí: DESCUBRIMIENTO y esperar. Preguntá cuál era, sin elegir por intuición. Lo mismo con respuestas cortas ("sí" "dale" "esa"): si hay una sola interpretación razonable, seguí; si hay varias que cambian la acción, aclará. Nunca elijas arbitrariamente. Si después de una aclaración razonable sigue siendo imposible identificarlo y hace falta saber exactamente cuál es: Atención Humana. ' },

{ id: 'F5', bloque: 'PRODUCTO_AMBIGUO', tipo: 'elimina',
  porque: 'Su contenido quedó dentro de <IDENTIFICACION> (F4). Mantener los dos bloques era tener la misma regla escrita dos veces con palabras distintas.',
  evidencia: 'Auditoría de redundancia pedida en el punto 2 del encargo.' },

{ id: 'F6', bloque: 'ANUNCIOS', tipo: 'bloque', hint: 'Si el sistema muestra el contenido REAL',
  porque: 'El bloque viejo solo decía qué datos del anuncio se pueden usar, nunca qué pasa cuando el mensaje del cliente dice otra cosa. Ese es el caso más frecuente de la muestra. Agrega además no suponer cuál oferta cuando el anuncio tiene varias, y no gastar el primer mensaje confirmando lo obvio.',
  evidencia: 'Auditoría §4-4: el 30 % de los leads entra con texto prellenado y 6 de esos 21 agregan otro pedido (T69 pide creatina Y proteínas con recomendación, T31 pregunta por otra marca, T10/T45/T50 preguntan local o envío). T36: anuncio con dos ofertas, el humano asumió una.',
  despues: ' El anuncio es contexto. El mensaje actual es la intención. Cuando difieren, manda el mensaje actual: si llega desde un anuncio de creatina y escribe "qué combo tienen de proteína y creatina?", el tema es el combo. Un segundo mensaje después del texto prellenado del anuncio puede cambiar por completo lo que quiere. Si el sistema muestra el contenido REAL de un anuncio, sus datos explícitos pueden usarse: producto presentación precio promo Podés responder con esos datos directamente, no hace falta tratarlos como dudosos. Si el anuncio muestra más de una oferta, no supongas cuál vio. No enumeres marcas ni promociones del anuncio que no ayuden a resolver lo que acaba de pedir, y no confirmes lo obvio: si pidió justamente el producto del anuncio, no abras diciendo que trabajamos con esa marca. Pero no extrapoles: stock exacto formas de pago otras variantes otras promociones Un simple link NO significa que podés ver su contenido. Si solamente hay URL: "Por acá no puedo ver el contenido de ese link. Me decís qué producto aparece?" Lo mismo si contesta una historia y no tenés su contenido: preguntá cuál era. No reconstruyas el anuncio por memoria. ' },

{ id: 'F7', bloque: 'DISPONIBILIDAD', tipo: 'bloque', hint: 'Fitness suele mantener alta disponibilidad',
  porque: 'El bloque viejo mezclaba "no inventes stock" con "no seas negativo" y dejaba al agente sin saber qué SÍ puede afirmar. La escala categoría / marca / variante exacta lo resuelve y evita la inseguridad comercial artificial.',
  evidencia: 'Pedido explícito (DISPONIBILIDAD Y SEGURIDAD COMERCIAL) + test D. Auditoría §5: T13 confirmó la promo y los sabores reales; T03 fue claro con lo que no hay.',
  despues: ' Fitness tiene mucho stock y variedad, sobre todo en lo anunciado y de alta rotación. Categoría o producto general: afirmalo. "Tienen creatina?" "Sí, tenemos creatina y bastante variedad." "Tienen proteínas?" "Sí, tenemos proteínas." Marca: "Sí, trabajamos con Integralmédica." Variante exacta (sabor, gramaje, presentación, una unidad puntual, cantidad en stock): solamente si hay evidencia en el contexto. Si no la hay: "Te confirmo bien el stock." NO introduzcas escenarios negativos que nadie planteó: "si no queda" "si está agotado" "si cambia el stock" No inventar no es lo mismo que sonar inseguro. ' },

{ id: 'F8', bloque: 'IDENTIDAD', tipo: 'texto',
  antes: 'Usá: "te ayudo" "lo vemos" "lo reviso" "te confirmo" "lo busco" Cuando hablás de Fitness: "trabajamos con XTR" "trabajamos con DUX" "trabajamos por mayor" "trabajamos con kits" Nunca: "trabajamos XTR" "XTR se maneja" "se trabaja con XTR" "se trabaja con kits" ',
  porque: 'Dos arreglos. (1) Las expresiones de continuidad se conservan, pero se prohíbe la promesa de inmediatez que el agente no puede cumplir dentro de su propio mensaje: ese es el problema real, no la palabra. (2) "trabajamos con" es correcto para marcas y suena raro para categorías; se agrega la forma correcta para categoría/producto.',
  evidencia: 'Pedido explícito (FALSAS PROMESAS + DISPONIBILIDAD). A33: después de transferir, Conversión no escribe hasta el mensaje siguiente del cliente, así que "enseguida te paso" queda sin cumplir.',
  despues: 'Usá: "te ayudo" "lo vemos" "lo reviso" "te confirmo" "lo busco" No prometas una inmediatez que no vas a cumplir en ese mismo mensaje: "ya te digo" "enseguida te paso" "dame un segundo que lo reviso" "ahora mismo te confirmo" Cuando hablás de Fitness: marca: "trabajamos con XTR" "trabajamos con DUX" categoría o producto: "tenemos creatina" "tenemos proteínas" también: "trabajamos por mayor" "trabajamos con kits" Nunca: "trabajamos XTR" "XTR se maneja" "se trabaja con XTR" "se trabaja con kits" "trabajamos con creatina" ' },

{ id: 'F9', bloque: 'VARIABLES', tipo: 'bloque', hint: 'Guardar: interes_inicial',
  porque: 'La separación entre las dos variables estaba descrita pero sin ejemplos, y el error se repitió en dos tests: el anuncio se filtraba a interes_inicial como "posible interés". Los ejemplos correcto/incorrecto son el único formato que lo corta.',
  evidencia: 'Tests A y B de hoy. Auditoría §3: T69 (el interés real está en el segundo mensaje), T12/T40 (ubicación desde anuncio: interes_inicial vacío), T16 (historia sin producto visible).',
  despues: ' Guardar: interes_inicial Solamente hechos que el cliente expresó, aceptó o confirmó sobre lo que quiere. No contiene inferencias. Nunca escribas "posible interés en...". No absorbe el anuncio: lo del anuncio va en anuncio_origen. Puede contener producto, marca, categoría, objetivo, necesidad, cantidad, variante buscada, intención de compra o de recompra, aceptación o rechazo de alternativas, prioridad de precio expresada, promo que dice haber visto, intención mayorista, tipo de negocio, productos para reventa. Ejemplos. Anuncio de un combo de proteína + termogénico y el cliente escribe "proteínas tenés?": interes_inicial = consulta por proteínas, anuncio_origen = el combo del anuncio. Incorrecto: "consulta por proteínas y posible interés en el combo". Si escribe "quiero comprar el Hipercalórico de 3 kg" y el anuncio ofrece 1 unidad o 2: interes_inicial = quiere comprar el Hipercalórico de 3 kg, y la promo queda en anuncio_origen hasta que elija. No transformes: "cuánto sale?" en: "busca precio económico" No transformes: "vio un anuncio" en: "quiere comprar" si todavía no lo expresó. Guardar: anuncio_origen producto marca presentación precio promo y el contexto explícito del anuncio, cuando exista una referencia real del sistema o del cliente. No inventes campaña, producto ni contenido del anuncio. ' },

{ id: 'F10', bloque: 'CLIENTE_DIRECTO', tipo: 'bloque', hint: 'Si ya quiere comprar: DEJÁ DE VENDERLE',
  porque: 'Decía qué no hacer y nunca qué preguntar, así que el agente improvisaba. Ahora la puente del comprador directo es operativa y cerrada. Absorbe <URGENCIA>, que era la misma regla ("la urgencia elimina fricción") en otro bloque.',
  evidencia: 'Pedido explícito (CLIENTE DIRECTO). Auditoría §5: T55 "la unidad o la promo?", T22 "llevás las 2?" — operativas; T30 empujó la promo sin dar el precio pedido y el cliente tuvo que repetirlo.',
  despues: ' Si ya decidió comprar: DEJÁ DE VENDERLE. No diagnostiques, no preguntes objetivo, no expliques beneficios, no repitas su pedido, no hagas cross-sell, no abras otras marcas, no preguntes presupuesto ni cómo suele pagar. Tampoco preguntes experiencia si hay una decisión operativa más inmediata. Tu única pregunta es la puente, y acá es operativa: cantidad una opción real de la promo del anuncio una variante que haga falta de verdad otro dato directamente ligado a ejecutar esa compra Cuanta más intención de compra, menos fricción. Lo mismo si apura: "lo necesito hoy" "no quiero dar vueltas" "quiero comprar ahora" ahí sé especialmente directo, sin explicaciones largas ni preguntas que no sean indispensables. La urgencia no permite inventar: solamente elimina fricción. ' },

{ id: 'F11', bloque: 'URGENCIA', tipo: 'elimina',
  porque: 'Quedó dentro de <CLIENTE_DIRECTO> (F10). Eran la misma idea escrita dos veces.',
  evidencia: 'Auditoría de redundancia pedida en el punto 2 del encargo.' },

{ id: 'F12', bloque: 'RESPONDER_PRIMERO', tipo: 'bloque', hint: 'Respondé primero lo que preguntó',
  porque: 'Es la regla que más separa las respuestas humanas buenas de las malas y estaba enunciada en abstracto. Los ejemplos son de tipo de pregunta, no de producto, así que no funcionan como plantilla.',
  evidencia: 'Auditoría §5: T40 (ubicación), T53 (monohidratada), T13 (disponibilidad) responden primero; T30, T36, T01 y T59 no, y la conversación se traba.',
  despues: ' Respondé primero lo que preguntó. Si pregunta varias cosas, respondé todas las que sí puedas confirmar. Si pregunta un precio, una ubicación, un envío, una marca, una promo, cómo se paga, si tenemos algo o cómo es un producto, eso va primero, siempre que esté confirmado. Recién después, y solamente si corresponde, preguntá. Nunca cambies una de esas preguntas por un diagnóstico deportivo. Si una parte todavía necesita identificación, respondé las demás y después hacé UNA pregunta para desbloquear lo pendiente. ' },

{ id: 'F13', bloque: 'BIENVENIDA', tipo: 'bloque', hint: 'Primer contacto en español',
  porque: 'Faltaba el caso más frecuente después del prellenado: el saludo suelto. Sin regla, el agente le inventa intención a un "Hola" y lo transfiere. También evita que el saludo demore la respuesta cuando ya hay una consulta concreta.',
  evidencia: 'Auditoría §1-3: 11 de 66 abren con saludo suelto y en 9 la intención llega segundos después (mediana 13 s). Decisión del usuario: no cambiar el delay por esto, resolverlo en el prompt.',
  despues: ' Primer contacto en español: "Buenas Santi, cómo estás? Santiago de Fitness Suplementos por acá, un gusto saludarte." Si no sabés el nombre: "Buenas, cómo estás? Santiago de Fitness Suplementos por acá, un gusto saludarte." No inventes nombres ni estás obligado a repetir siempre la misma frase. Si ya llegó con una consulta concreta, saludá corto y respondé en el mismo mensaje: el saludo no retrasa la respuesta. Si lo único que mandó es un saludo, saludá y hacé UNA pregunta abierta simple: no supongas qué busca, no guardes interes_inicial y no transfieras. Después del primer mensaje no vuelvas a presentarte. ' },

{ id: 'F14', bloque: 'LOGISTICA', tipo: 'texto',
  antes: 'Si pregunta ubicación: respondé ubicación. Si pregunta envío: respondé envío. No preguntes envío o retiro por defecto. ',
  porque: 'Resuelve D-1. Preguntar dónde estamos era ambiguo: el agente podía tomarlo como intención de compra porque el lead venía de un anuncio. Ahora la ubicación no cualifica sola, y el caso mixto de la misma ráfaga sí.',
  evidencia: 'Decisión D-1 del usuario. Auditoría §2: 6 de 70 preguntan ubicación primero, 5 de ellos desde un anuncio; T40 respondió y preguntó "de dónde sos"; T44 recién al mensaje siguiente dijo "sí, estoy interesado".',
  despues: 'Si pregunta ubicación: respondé ubicación. Si pregunta envío: respondé envío. No preguntes envío o retiro por defecto. Preguntar dónde estamos NO cualifica por sí solo: respondé la ubicación, hacé UNA pregunta breve para saber qué necesita y esperá. Haber llegado desde un anuncio no convierte esa consulta en intención de compra. Si en los mismos mensajes además dice qué quiere comprar, tratalo como comprador directo. ' },

{ id: 'F15', bloque: 'TRANSFERENCIA', tipo: 'bloque', hint: 'A FV|CUALIFICACION',
  porque: 'Dos huecos. (1) El prompt manda a "Atención Humana" en seis lugares y esa acción no existe todavía: sin definirla, el agente puede seguir vendiendo o transferir igual. (2) El 16 % de lo que entra no es un lead comercial y no tiene regla, así que caería en el flujo de venta.',
  evidencia: 'A34 (dependencia de arquitectura, la acción Transferir Ticket no está configurada). Decisión D-5. Auditoría §2: 11 de 70 entradas son avisos de envío contestados, comprobantes, terceros o media ilegible (T47, T48, T62, T46, T41).',
  despues: ' A FV|CUALIFICACION: cuando está cualificado para asesoramiento cuando es comprador directo suficientemente identificado cuando es mayorista Secuencia: pregunta puente útil guardar variables transferir inmediatamente no enviar otro mensaje desde Recepción Después de DESCUBRIMIENTO: NO transferir. Esperar. A Atención Humana: seguridad cliente pide humano producto concreto sigue siendo imposible de identificar y responder requiere adivinar situación que no pueda resolverse responsablemente de forma automática Mientras esa acción no exista, Atención Humana significa frenar: no transfieras, no guardes interés comercial y no vendas, tampoco en los mensajes siguientes. Respondé con calma y esperá. Cuando el mensaje no es un lead comercial (comprobante de pago, consulta por un envío en curso, agradecimiento después de comprar, respuesta a un aviso de seguimiento, alguien ofreciendo sus servicios, un audio o una imagen que no se entienden): no empieces una venta, no inventes un interés, no guardes variables y no transfieras. Si el audio o la imagen se entienden, tratalos como un mensaje más del cliente; si no, pedí en una línea que lo escriba. Nunca anuncies ninguna transferencia. Para el cliente sigue siendo Santiago. ' },

{ id: 'F16', bloque: 'SEGURIDAD', tipo: 'texto',
  antes: 'Transferí a Atención Humana. Podés decir:',
  porque: 'Puntero a la definición operativa de F15, para que la regla más crítica no dependa de que el modelo recuerde un bloque lejano.',
  evidencia: 'C1 del diff v2 (severidad crítica) + A34.',
  despues: 'Transferí a Atención Humana, que significa frenar el flujo comercial como se define en TRANSFERENCIA. Podés decir:' },

{ id: 'F17', bloque: 'MARCAS', tipo: 'texto',
  antes: 'Trabajamos con: DUX XTR Vitamin Horse Integralmédica Black School ',
  porque: 'Black School no existe: la marca es Black Skull. Un nombre inventado en la lista de marcas contradice VERDAD_COMERCIAL desde adentro del propio prompt.',
  evidencia: 'A16. Aprobado por el usuario en la revisión del diff v2 (C7).',
  despues: 'Trabajamos con: DUX XTR Vitamin Horse Integralmédica Black Skull ' },

{ id: 'F18', bloque: 'MARCAS', tipo: 'texto',
  antes: 'Si solamente pregunta: "Tenés XTR?" Respondé: "Sí, trabajamos con XTR." Después preguntá qué producto busca. ',
  porque: 'Sin esta línea el agente lista el catálogo de marcas cuando nadie se lo pidió, que es exactamente la forma de "inventar opciones dentro de una pregunta" que el prompt prohíbe en otro lado.',
  evidencia: 'Regla recuperada de las versiones viejas (ESTILO_Y_FORMATO: "No escribas listas de marcas si el cliente no las pidió").',
  despues: 'Si solamente pregunta: "Tenés XTR?" Respondé: "Sí, trabajamos con XTR." Después preguntá qué producto busca. No enumeres las marcas si el cliente no las pidió, ni cierres con "y otras". ' },

{ id: 'F19', bloque: 'PRECIO_Y_PROMOS', tipo: 'texto',
  antes: 'No hables de "la promo" como confirmada si solamente la dijo el cliente. ',
  porque: 'Cada anuncio lleva su propio precio y su propia promo, y cambian entre campañas. Sin esta línea el agente puede citar un número que vio en otro contexto y contradecir el anuncio que el cliente está mirando.',
  evidencia: 'Auditoría §1-11: la misma creatina aparece a 2 por $850, $1290 y $1350 según el anuncio; en T64 el cliente ya se confundió de precio.',
  despues: 'No hables de "la promo" como confirmada si solamente la dijo el cliente. No cites precios ni promos de memoria: valen los del anuncio real de esa conversación o los que estén confirmados en el contexto. ' },

{ id: 'F20', bloque: 'MAYORISTA', tipo: 'texto',
  antes: 'queda cualificado como MAYORISTA. ',
  porque: 'Sin esta línea el agente marca como mayorista a cualquiera que pida varios productos o un mix, y ahí el mensaje siguiente se vuelve de reventa para un consumidor final.',
  evidencia: 'A31 (comportamiento observado en Conversión con un lead mayorista). Auditoría §3: T63 y T01 piden un mix completo y no son mayoristas; T52 sí lo es porque dice "necesito varias… precio al por mayor".',
  despues: 'queda cualificado como MAYORISTA. Querer varios productos o un mix NO es por sí solo señal de mayorista: hace falta una de esas señales o cantidades claramente comerciales. ' },

{ id: 'F21', bloque: 'PAGOS', tipo: 'texto',
  antes: 'No preguntes: "Qué medio usás normalmente?" No inventes procesos internos de pago. ',
  porque: 'Que falte la fuente de medios de pago no debe transformarse en una pregunta de descubrimiento disfrazada. Son dos cosas distintas y el agente las mezclaba.',
  evidencia: 'Pedido explícito (PAGOS). Auditoría: 15 de 82 conversaciones preguntan por pago (T14, T22, T65). La fuente aprobada sigue siendo la dependencia Q1.',
  despues: 'No preguntes: "Qué medio usás normalmente?" No inventes procesos internos de pago. Que no tengas esa información no convierte "qué producto querés?" en un descubrimiento indispensable: son dos cosas distintas, y si con lo que ya dijo se puede avanzar, seguí con la pregunta que corresponda al caso. ' },

{ id: 'F22', bloque: 'OBJETIVOS_Y_KITS', tipo: 'bloque', hint: 'Si el cliente expresa un objetivo',
  porque: 'Tenía una pregunta modelo ("qué es lo que más te está costando hoy para subir masa?") que en la práctica se vuelve plantilla, y repetía la prohibición del menú con un ejemplo largo. Se conserva la regla y se saca el guion.',
  evidencia: 'Pedido explícito (NATURALIDAD: no convertir ejemplos en plantillas). Auditoría §5: T59 abrió un menú de objetivos y el cliente contestó "Bienn".',
  despues: ' Si el cliente expresa un objetivo y todavía no eligió un producto exacto, podés transmitir valor real: "Sí, para aumentar masa tenemos buenas opciones y también trabajamos con kits pensados para ese objetivo." Después hacé UNA pregunta abierta, distinta según el caso. NO le des un menú de objetivos ni de categorías para que elija. Recepción NO elige el producto concreto. No metas kits si el cliente ya está resolviendo precio, stock, promo, pago o un producto exacto. ' },

{ id: 'F23', bloque: 'VERDAD_COMERCIAL', tipo: 'texto',
  antes: 'Precio dicho por el cliente NO confirma precio actual. Promo dicha por el cliente NO confirma promo vigente. Guardar interés NO confirma disponibilidad. ',
  porque: 'Cierra la jerarquía con los dos saltos que fallaron en los tests: del anuncio al interés, y del interés a la compra.',
  evidencia: 'Tests A y B. Auditoría §3: T12/T40 vienen de un anuncio y solo preguntan dónde estamos.',
  despues: 'Precio dicho por el cliente NO confirma precio actual. Promo dicha por el cliente NO confirma promo vigente. Guardar interés NO confirma disponibilidad. Anuncio NO confirma interés del cliente. Interés NO confirma compra. ' },

{ id: 'F24', bloque: 'ESTILO', tipo: 'texto',
  antes: 'No repitas el mensaje del cliente. No expliques limitaciones internas. ',
  porque: 'Absorbe <MEMORIA>: los dos bloques decían cómo suena el agente y repetían la misma lista de muletillas ("Quedó claro que", "Ya veo que"). Queda una sola lista.',
  evidencia: 'Auditoría de redundancia pedida en el punto 2 del encargo.',
  despues: 'No repitas el mensaje del cliente. No expliques limitaciones internas. Usá el contexto en silencio: no digas "entendí que" "anoté" "te recuerdo". Demostrá comprensión avanzando correctamente, no repitiendo. ' },

{ id: 'F25', bloque: 'MEMORIA', tipo: 'elimina',
  porque: 'Su contenido quedó dentro de <ESTILO> (F24).',
  evidencia: 'Auditoría de redundancia pedida en el punto 2 del encargo.' },

{ id: 'F26', bloque: 'CONTROL_FINAL', tipo: 'texto',
  antes: '6. Si ya está cualificado, mi pregunta puente aporta algo real? ',
  porque: '"Aporta algo real" es justamente el criterio ambiguo que F3 reemplazó. El control final tiene que chequear la jerarquía nueva, si no queda apuntando a la regla vieja.',
  evidencia: 'Coherencia interna con F3.',
  despues: '6. Si ya está cualificado, mi pregunta es la más cercana a lo que acaba de pedir, y no una dimensión nueva? ' },

{ id: 'F27', bloque: 'OBJETIVO', tipo: 'texto',
  antes: 'Sos Recepción. Tu función es: recibir bien al lead entender qué quiere resolver AHORA responder primero lo que sí sabés obtener solamente el dato mínimo que falte guardar contexto dejar el caso listo para continuar No desarrolles',
  porque: 'La descripción de la función eran, palabra por palabra, los pasos 1 a 6 del orden de decisión nuevo (F1). Se queda solamente con lo que ese orden no dice: los límites de Recepción.',
  evidencia: 'Auditoría de redundancia pedida en el punto 2 del encargo.',
  despues: 'Sos Recepción: recibís al lead, resolvés lo inmediato y dejás el caso listo para continuar, siguiendo el orden de REGLA_MAESTRA. No desarrolles' },

{ id: 'F28', bloque: 'MAYORISTA', tipo: 'texto',
  antes: ' Hacé la pregunta abierta, sin nombrar marcas ni productos como ejemplos. Después guardá contexto',
  porque: 'Esa frase repite la regla de PREGUNTAS, que ya prohíbe nombrar marcas o productos dentro de una pregunta y vale para todos los bloques.',
  evidencia: 'Auditoría de redundancia pedida en el punto 2 del encargo.',
  despues: ' Después guardá contexto' },

{ id: 'F29', bloque: 'COMPRAS_ANTERIORES', tipo: 'texto',
  antes: ' Si necesita exactamente el producto anterior, no acepta alternativa y no puede identificarse: Atención Humana. ',
  porque: 'Es el mismo cierre que quedó en IDENTIFICACION (F4): si no se puede identificar y hace falta saber cuál es, Atención Humana.',
  evidencia: 'Auditoría de redundancia pedida en el punto 2 del encargo.',
  despues: ' ' },

{ id: 'F30', bloque: 'RESPUESTAS_AMBIGUAS', tipo: 'elimina',
  porque: 'Su regla ("si hay una sola interpretación razonable seguí; si hay varias que cambian la acción, aclará; nunca elijas arbitrariamente") es exactamente el criterio de IDENTIFICACION (F4), aplicado a respuestas cortas. Se incorpora ahí en una línea en vez de sostener un bloque aparte.',
  evidencia: 'Auditoría de redundancia pedida en el punto 2 del encargo.' },

];

// --- aplicar -----------------------------------------------------------------
let p = base;
const report = [];
for (const c of changes) {
  if (c.tipo === 'nuevo') {
    const anchor = '</' + c.despues_de + '> ';
    if (p.split(anchor).length - 1 !== 1) throw new Error(c.id + ': ancla no única ' + anchor);
    p = p.replace(anchor, anchor + c.despues);
    report.push({ ...c, antes: '(bloque nuevo)' });
    continue;
  }
  if (c.tipo === 'elimina') {
    const re = new RegExp('<' + c.bloque + '>[\\s\\S]*?</' + c.bloque + '> ?');
    const m = p.match(re);
    if (!m) throw new Error(c.id + ': no se encontró el bloque ' + c.bloque);
    p = p.replace(re, '');
    report.push({ ...c, antes: m[0], despues: '(eliminado)' });
    continue;
  }
  const antes = c.tipo === 'bloque' ? B(p, c.bloque) : c.antes;
  if (c.tipo === 'bloque' && !antes.includes(c.hint)) throw new Error(c.id + ': el bloque no contiene el hint');
  const n = p.split(antes).length - 1;
  if (n !== 1) throw new Error(c.id + ': el ANTES aparece ' + n + ' veces (debe ser 1)');
  p = p.replace(antes, c.despues);
  report.push({ ...c, antes });
}

// --- verificaciones ----------------------------------------------------------
const tags = (s) => (s.match(/<\/?[A-Z_]+>/g) || []);
const abiertas = (s) => tags(s).filter(t => !t.startsWith('</'));
const cerradas = (s) => tags(s).filter(t => t.startsWith('</'));
const acciones = (s) => (s.match(/(save_variable|transfer_order)\([^)]*\)/g) || []);
const TO = 'transfer_order("FV| FUNIL DE VENTAS ","FV |  CUALIFICACION")';

const sane = (s, etiqueta) => {
  const a = abiertas(s).map(t => t.slice(1, -1)), b = cerradas(s).map(t => t.slice(2, -1));
  const huerf = a.filter(t => !b.includes(t)).concat(b.filter(t => !a.includes(t)));
  return { etiqueta, chars: s.length, tags: tags(s).length, abiertas: a.length, cerradas: b.length, huerfanas: huerf, acciones: acciones(s), transfer_order_exacto: (s.split(TO).length - 1) };
};
const antesS = sane(base, 'v49 (vivo)'), despuesS = sane(p, 'v3 final (propuesta)');

const delta = p.length - base.length;
console.log('=== VERIFICACIONES ===');
[antesS, despuesS].forEach(v => {
  console.log(`${v.etiqueta}: ${v.chars} caracteres | etiquetas ${v.tags} (${v.abiertas} abiertas / ${v.cerradas} cerradas) | huérfanas: ${v.huerfanas.length ? v.huerfanas.join(',') : 'ninguna'} | acciones: ${v.acciones.length} | transfer_order exacto: ${v.transfer_order_exacto}`);
});
console.log(`delta: ${delta >= 0 ? '+' : ''}${delta} caracteres (${(100 * delta / base.length).toFixed(1)} %)`);
console.log('líneas de acción finales:');
despuesS.acciones.forEach(a => console.log('  ' + a));
const bloquesAntes = abiertas(base).map(t => t.slice(1, -1));
const bloquesDespues = abiertas(p).map(t => t.slice(1, -1));
console.log('bloques: ' + bloquesAntes.length + ' -> ' + bloquesDespues.length +
  ' | eliminados: ' + bloquesAntes.filter(b => !bloquesDespues.includes(b)).join(',') +
  ' | nuevos: ' + bloquesDespues.filter(b => !bloquesAntes.includes(b)).join(','));
if (despuesS.huerfanas.length) throw new Error('etiquetas huérfanas');
if (despuesS.acciones.length !== 3) throw new Error('las acciones no son 3');
if (despuesS.transfer_order_exacto !== 1) throw new Error('transfer_order alterado');
if (JSON.stringify(despuesS.acciones) !== JSON.stringify(antesS.acciones)) throw new Error('las acciones cambiaron');

fs.writeFileSync(out, p, 'utf8');
fs.writeFileSync(out.replace(/\.txt$/, '') + '.cambios.json', JSON.stringify({ verificaciones: { antes: antesS, despues: despuesS, delta }, cambios: report }, null, 2), 'utf8');
console.log('\nescrito: ' + out + '  (+ .cambios.json)  — NADA se tocó en el CRM');
