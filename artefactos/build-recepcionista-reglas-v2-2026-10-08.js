// Reglas nuevas para el Recepcionista Comercial, nacidas de 6 chats reales con fallas (2026-10-07/08) y de sus registros
// de procesamiento. Cada reemplazo se exige UNA sola vez (assertOnce). No se saca nada de lo que ya funciona.
//
//   node artefactos/build-recepcionista-reglas-v2-2026-10-08.js
//
// Entradas:
//   artefactos/recepcionista-comercial-vivo-2026-10-06.txt              Maxi (10005) hoy, sha 59051855 0d6e
//   artefactos/recepcionista-comercial-copia-copilot-2026-10-06.txt     copia con los cambios del asistente, sha b33651af c70b
//   artefactos/recepcionista-comercial-analizador-vivo-2026-10-06.txt   analizador de Maxi, sha d2b9d36d f630
// Salidas:
//   artefactos/recepcionista-comercial-copia-v2-2026-10-08.txt          copilot + reglas nuevas  (para la copia 10176)
//   artefactos/recepcionista-comercial-parche-reglas-2026-10-08.txt     Maxi vivo + SOLO las reglas nuevas (para Maxi)
//   artefactos/recepcionista-comercial-analizador-v2-2026-10-08.txt     analizador con las reglas nuevas (para ambos)
const fs = require('fs'), crypto = require('crypto');
const sha = (s) => crypto.createHash('sha256').update(s, 'utf8').digest('hex');
const rd = (f) => fs.readFileSync('artefactos/' + f, 'utf8');

const BASE_MAXI = rd('recepcionista-comercial-vivo-2026-10-06.txt');
const BASE_COPIA = rd('recepcionista-comercial-copia-copilot-2026-10-06.txt');
const BASE_ANALIZADOR = rd('recepcionista-comercial-analizador-vivo-2026-10-06.txt');
if (!sha(BASE_MAXI).startsWith('590518550d6e')) throw new Error('base Maxi inesperada');
if (!sha(BASE_COPIA).startsWith('b33651afc70b')) throw new Error('base copia inesperada');
if (!sha(BASE_ANALIZADOR).startsWith('d2b9d36df630')) throw new Error('base analizador inesperada');

function editor(base) {
  let t = base;
  const count = (a) => t.split(a).length - 1;
  const once = (name, a, b) => { const n = count(a); if (n !== 1) throw new Error('assertOnce falló en ' + name + ' (' + n + ')'); t = t.replace(a, () => b); };
  const onceAny = (name, cands, b) => {
    const hit = cands.filter((a) => count(a) === 1);
    if (hit.length !== 1) throw new Error('onceAny falló en ' + name + ' (' + hit.length + ' candidatos válidos)');
    t = t.replace(hit[0], () => b);
  };
  return { once, onceAny, get: () => t };
}

// ---------- Prompt ----------
const IDIOMA_VIVO = 'Si el cliente habla claramente en portugués, respondé en portugués brasileño natural.';
const IDIOMA_COPILOT = 'Si el cliente escribe claramente en portugués (frases enteras, no un saludo suelto ni una sola palabra), respondé en portugués brasileño natural.\n\n\nSi no entendés un mensaje (audio, imagen o formato ilegible), pedile en español que lo escriba de nuevo. Nunca mezcles portugués y español en el mismo mensaje.';
const IDIOMA_NUEVO = 'Respondé SIEMPRE en español rioplatense con "vos", nunca en portugués. Si el cliente escribe en portugués, entendelo y contestale en español simple.\n\n\nEl sistema a veces muestra los mensajes del cliente con etiquetas en portugués ("Publicação compartilhada", "Mensagem indisponível", "unsupported"). Aunque el texto llegue así, respondé en español.\n\n\nSi no entendés un mensaje (audio, imagen, publicación compartida o formato ilegible), pedile en español que te cuente por texto qué busca. Nunca mezcles idiomas en el mismo mensaje.';

const SECCION_NUEVA = '<CONFIRMAR_Y_DERIVAR>\n\n\nRecepción no tiene precios, stock, dosis ni condiciones de pago confirmados. Cuando el cliente pregunta algo de eso y no hay una fuente válida en la conversación:\n\n\n1. Decí en UNA frase que lo confirmás, sin prometer cuándo ni cómo.\n"Te confirmo bien ese precio."\n"Te confirmo bien esa dosis."\n\n\n2. Si hay una pregunta genuinamente útil y suave, cerrá con UNA sola, sin presionar.\n"Ya la tomaste antes o sería la primera vez?"\nNo es obligatoria: si no hay una pregunta útil, no la inventes.\n\n\n3. Guardá el contexto y TRANSFERÍ en ese mismo turno.\nNunca prometas confirmar algo y sigas en Recepción esperando.\n\n\nEsto aplica a: precio de un producto o de una categoría con presentación ("creatina de 1 kg"), stock, formas de pago, dosis o gramos por toma, mínimos mayoristas y contenido de kits.\n\n\nUna categoría clara ("creatina", "whey", "proteína") con una pregunta de precio o de dosis NO es DESCUBRIMIENTO: ya hay contexto suficiente para derivar.\n\n\nNUNCA pidas:\nfotos\ntabla nutricional\netiqueta o reverso del envase\ningredientes\ncapturas\n\n\nEl cliente no tiene por qué saber eso.\nSi necesitás identificar el producto, preguntá solamente el nombre o la marca que recuerde. Si no lo recuerda, derivá igual.\n\n\nDosis o gramos por toma:\nno inventes ni calcules.\n"Te confirmo bien esa dosis." y derivá.\n\n\nNo digas "te lo pasan", "te lo pasa", "en el próximo mensaje" ni nada que sugiera que otra persona va a escribir.\n\n\nNo repitas una frase o promesa que ya enviaste en esta conversación (por ejemplo "te confirmo bien el precio"). Si ya la dijiste y el cliente sigue, avanzá: derivá.\n\n\n</CONFIRMAR_Y_DERIVAR>';

function reglasNuevas(base) {
  const e = editor(base);
  // G1 idioma: nunca portugués (la base puede traer el texto original o el de la copia con los cambios del asistente)
  e.onceAny('G1 idioma', [IDIOMA_VIVO, IDIOMA_COPILOT], IDIOMA_NUEVO);
  // G2 sección nueva: confirmar y derivar en el mismo turno, sin fotos ni tablas, sin repetir promesas
  e.once('G2 seccion', '</TRANSFERENCIA>', '</TRANSFERENCIA>\n\n\n\n\n' + SECCION_NUEVA);
  // G3 la lista de cuándo transferir incluye las preguntas de precio, stock, dosis y pago
  e.once('G3 transferencia',
    'A CL|EN CONVERSACION (atención humana) cuando:\n\n\n- está cualificado para asesoramiento\n- es comprador directo suficientemente identificado\n- es mayorista',
    'A CL|EN CONVERSACION (atención humana) cuando:\n\n\n- está cualificado para asesoramiento\n- es comprador directo suficientemente identificado\n- es mayorista\n- pregunta precio, stock, dosis o forma de pago de un producto o categoría que ya nombró (ver CONFIRMAR_Y_DERIVAR)');
  // G4 memoria: no repetir lo ya dicho
  e.once('G4 memoria', 'Si ninguna: omitila.',
    'Si ninguna: omitila.\n\n\nAntes de responder, releé lo que ya dijiste en la conversación. No repitas frases, promesas ni preguntas que ya enviaste: si el cliente respondió, avanzá desde ahí.');
  // G5 publicaciones compartidas y mensajes ilegibles: sin narrar lo que ve el sistema
  e.once('G5 publicacion', 'No reconstruyas un anuncio de memoria.',
    'No reconstruyas un anuncio de memoria.\n\n\nSi el cliente comparte una publicación o manda algo que no podés leer, no cuentes lo que ves ni digas cómo llegó el mensaje. Preguntá en español qué producto le interesó ("Qué producto te llamó la atención?") y esperá.');
  // G6 nunca quedar en silencio: el control final no puede terminar en "no envíes"
  e.once('G6 silencio', 'NO envíes todavía.\nCorregí el mensaje primero.',
    'Corregí el mensaje y enviá la versión corregida.\nNunca dejes al cliente sin respuesta: si dudás, enviá la versión más simple y derivá.');
  // G7 (criterio propio, ticket 7968606): abría con "Buenas, decime." sin que el cliente hubiera saludado
  e.once('G7 saludo', 'Si el cliente vuelve a escribir "hola" después de horas o días, respondé "Buenas, decime" y seguí con lo concreto.',
    'Si el cliente vuelve a escribir "hola" después de horas o días, respondé "Buenas, decime" y seguí con lo concreto.\n\n\n"Buenas, decime" solo se usa cuando el cliente acaba de saludar. Si su último mensaje no trae un saludo, no abras con ningún saludo: respondé directo.');
  // G8 (criterio propio, ticket 7968606): ofrecía alternativas diciendo "calidad similar" aunque el prompt ya lo prohibía
  e.once('G8 marcas', 'No afirmes que es mejor ni equivalente, ni que tiene la misma presentación, ni stock.',
    'No afirmes que es mejor ni equivalente, ni que tiene la misma presentación, ni stock. No uses "calidad similar", "equivalente" ni "misma calidad".');
  return e.get();
}

const tags = (s) => s.match(/<\/?[A-Z_]+>/g) || [];
const cola = (s) => s.slice(s.indexOf('</CONTROL_FINAL>'));
function verificar(nombre, base, nuevo, seccionesEsperadas) {
  const abre = tags(nuevo).filter((x) => !x.startsWith('</')).length, cierra = tags(nuevo).filter((x) => x.startsWith('</')).length;
  if (abre !== seccionesEsperadas || cierra !== seccionesEsperadas) throw new Error(nombre + ': etiquetas ' + abre + '/' + cierra);
  if (cola(nuevo) !== cola(base)) throw new Error(nombre + ': la cola de acciones cambió');
  console.log('OK', nombre, base.length, '->', nuevo.length, '(+' + (nuevo.length - base.length) + ')', sha(nuevo).slice(0, 12), 'secciones', abre);
}

const copiaV2 = reglasNuevas(BASE_COPIA);
verificar('copia-v2', BASE_COPIA, copiaV2, 29);
fs.writeFileSync('artefactos/recepcionista-comercial-copia-v2-2026-10-08.txt', copiaV2, 'utf8');

const maxiParche = reglasNuevas(BASE_MAXI);
verificar('parche-maxi', BASE_MAXI, maxiParche, 29);
fs.writeFileSync('artefactos/recepcionista-comercial-parche-reglas-2026-10-08.txt', maxiParche, 'utf8');

// ---------- Analizador ----------
const a = editor(BASE_ANALIZADOR);
a.once('A1 idioma',
  'Usá {{INSTRUCOES_BOT}} solamente como fuente de criterios, no copies texto de respuesta dentro de variables.',
  'Usá {{INSTRUCOES_BOT}} solamente como fuente de criterios, no copies texto de respuesta dentro de variables.\nEscribí el contexto y los valores de las variables siempre en español.');
a.once('A2 transferir',
  '- producto nombrado suficientemente identificado, aunque falte precio o stock;',
  '- producto nombrado suficientemente identificado, aunque falte precio o stock;\n- el cliente pregunta precio, stock, dosis (gramos por toma), forma de pago o condiciones mayoristas de un producto o de una categoría que ya nombró (por ejemplo "creatina de 1 kg", "whey", "proteína"): guardar interes_inicial y transferir; eso NO es descubrimiento;\n- la respuesta de Recepción promete confirmar algo ("te confirmo bien..."): transferir en ese mismo turno, nunca dejarlo pendiente;');
a.once('A3 no transferir',
  '- pregunta que todavía requiere un dato indispensable del cliente;',
  '- pregunta de descubrimiento que todavía requiere un dato indispensable del cliente (qué producto busca, qué muestra un link); pedir foto, etiqueta, tabla nutricional, marca o presentación NO cuenta como dato indispensable;');
const analizadorV2 = a.get();
fs.writeFileSync('artefactos/recepcionista-comercial-analizador-v2-2026-10-08.txt', analizadorV2, 'utf8');
console.log('OK analizador-v2', BASE_ANALIZADOR.length, '->', analizadorV2.length, '(+' + (analizadorV2.length - BASE_ANALIZADOR.length) + ')', sha(analizadorV2).slice(0, 12));
