// Construye localmente la v49.2 (REVISION 2) del Recepcionista (9882) sobre la v49.1 VIVA. NO toca el CRM.
// Rev 1 (commit 0a7f196) solo limpiaba duplicaciones. Rev 2 suma 3 correcciones semanticas con evidencia
// (VARIABLES, PREGUNTAS, CLIENTE_DIRECTO) y delega 8 frases al guardrail de lenguaje de bot.
// Base exigida: 15349 caracteres, hash c753bc8a. Cada ANTES debe aparecer exactamente una vez o aborta.
// Uso: node build-recepcionista-v49-2.js <v49-1.txt> <guardrails-v1.json> <salida.txt>
const fs = require('fs');
const [, , src, fGr, out] = process.argv;
const base = fs.readFileSync(src, 'utf8');
const H = (p) => { let h = 0; for (let i = 0; i < p.length; i++) h = (h * 31 + p.charCodeAt(i)) >>> 0; return h.toString(16); };
if (base.length !== 15349 || H(base) !== 'c753bc8a') throw new Error('La base NO es la v49.1 esperada: ' + base.length + ' / ' + H(base));

const changes = [
  // ---- A. sacar lo mecanico que ya cubren los guardrails ----
  { id: 'D1', tipo: 'delegado a guardrail', bloque: 'IDENTIDAD',
    antes: 'Nunca hagas parecer que otra persona continúa. NO digas: "te pasan" "te ayudan" "te confirman" "otro asesor" "el equipo" "un compañero" Usá:',
    despues: 'Nunca hagas parecer que otra persona continúa ni menciones "el equipo". Usá:',
    nota: 'te pasan, te ayudan, te confirman, otro asesor, un compañero. Se conserva "el equipo" porque no se puede bloquear como frase sin falsos positivos.' },
  { id: 'D2', tipo: 'delegado a guardrail', bloque: 'MEMORIA',
    antes: 'Usá contexto silenciosamente. NO digas: "quedó claro" "ya veo que querés" "entendí que" "anoté" "te recuerdo" No repitas',
    despues: 'Usá el contexto en silencio. No repitas',
    nota: 'quedó claro, ya veo que, entendí que, anoté, te recuerdo. La regla conceptual "usá el contexto en silencio" permanece.' },
  { id: 'D3', tipo: 'delegado a guardrail', bloque: 'ESTILO',
    antes: 'No uses filler como: "Quedó claro que" "Ya veo que" "Mientras tanto" "Te dejo una pregunta cortita" "Te pregunto algo rápido" "Para afinar" "Así lo afinamos" "Afinemos" ',
    despues: '',
    nota: 'Las 8 frases de la oración quedan cubiertas por el guardrail de lenguaje de bot. 5 ya estaban (Quedó claro que, Ya veo que, Te pregunto algo rápido, Para afinar, Así lo afinamos) y 3 se suman (Mientras tanto, Te dejo una pregunta cortita, Afinemos).' },
  { id: 'D4', tipo: 'delegado a guardrail', bloque: 'ESTILO',
    antes: 'No valides automáticamente con: Perfecto Genial Buenísimo Excelente ',
    despues: '',
    nota: 'Lo cubre el guardrail Fillers de apertura, que solo actúa al inicio del mensaje (decisión del usuario, no se amplía).' },
  { id: 'D5', tipo: 'duplicado', bloque: 'ESTILO',
    antes: 'No repitas el mensaje del cliente. No expliques limitaciones internas.',
    despues: 'No expliques limitaciones internas.',
    nota: 'Duplicado exacto de la frase que sigue en MEMORIA.' },

  // ---- B. correcciones semanticas con evidencia ----
  { id: 'V1', tipo: 'corrección semántica', bloque: 'VARIABLES',
    antes: 'No guardes opciones que todavía no eligió. ',
    despues: 'No guardes opciones que todavía no eligió. Si dice que quiere comprar un producto y llega desde un anuncio con promo, guardá solamente esa intención sobre el producto, sin "con promo del anuncio" ni el precio, la cantidad promocional o las condiciones del anuncio, hasta que el cliente las mencione, elija o confirme. Eso va en anuncio_origen. ',
    nota: 'Evidencia: en el test del Hipercalórico guardó "Quiere comprar Hipercalórico Vitamin Horse 3KG con promo del anuncio de Instagram" con la regla abstracta ya escrita. Es el único contraejemplo, el del fallo real.' },
  { id: 'P1', tipo: 'corrección semántica', bloque: 'PREGUNTAS',
    antes: 'Debe aportar algo útil al siguiente paso.',
    despues: 'La pregunta debe cambiar una decisión real del siguiente paso, es decir qué hay que buscar, recomendar o ejecutar.',
    nota: 'Reemplaza "algo útil", demasiado abierto. Redactada para NO hacer la puente opcional (ver la sección de decisiones).' },
  { id: 'C1', tipo: 'corrección semántica', bloque: 'CLIENTE_DIRECTO',
    antes: 'Resolvé solamente lo indispensable. ',
    despues: 'Resolvé solamente lo indispensable. Cuando ya quiere comprar un producto suficientemente identificado, este bloque tiene prioridad sobre MARCAS, LOGISTICA, OBJETIVOS_Y_KITS y el contenido promocional de ANUNCIOS. No abras esos temas salvo que el cliente los pregunte o sean indispensables para ejecutar lo que pidió. ',
    nota: 'Evidencia: el mismo test abrió "Trabajamos con Vitamin Horse" y "Despachamos por DAC" sin que nadie lo pidiera. No prohíbe esas respuestas, solo fija su precedencia.' },
];

let p = base;
for (const c of changes) {
  const n = p.split(c.antes).length - 1;
  if (n !== 1) throw new Error(c.id + ': el ANTES aparece ' + n + ' veces (debe ser 1)');
  p = p.replace(c.antes, c.despues);
}

// ---- guardrail propuesto: solo el de lenguaje de bot, +8 frases ----
const gr = JSON.parse(fs.readFileSync(fGr, 'utf8'));
const bot = gr.find((g) => g.name.startsWith('No sonar a bot'));
const nuevas = ['te hago una sola consulta', 'para avanzar ya', 'quedó claro', 'anoté', 'te recuerdo', 'mientras tanto', 'te dejo una pregunta cortita', 'afinemos'];
const propuesto = gr.map((g) => (g.name === bot.name ? { ...g, config: { ...g.config, frases: [...g.config.frases, ...nuevas] } } : g));

// ---- cobertura ----
const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const listaBot = propuesto.find((g) => g.name === bot.name).config.frases.map(norm);
const listaFill = gr.find((g) => g.name === 'Fillers de apertura').config.frases.map(norm);
const cubre = (f, l) => l.some((x) => norm(f).includes(x));
const quitadas = ['te pasan', 'te ayudan', 'te confirman', 'otro asesor', 'un compañero', 'quedó claro', 'ya veo que querés', 'entendí que', 'anoté', 'te recuerdo',
  'Quedó claro que', 'Ya veo que', 'Mientras tanto', 'Te dejo una pregunta cortita', 'Te pregunto algo rápido', 'Para afinar', 'Así lo afinamos', 'Afinemos',
  'Perfecto', 'Genial', 'Buenísimo', 'Excelente'];
const cobertura = quitadas.map((f) => ({ frase: f, cubierta: cubre(f, listaBot) || cubre(f, listaFill) }));

// ---- verificaciones ----
const ab = (s) => (s.match(/<[A-Z_]+>/g) || []).map((t) => t.slice(1, -1));
const ce = (s) => (s.match(/<\/[A-Z_]+>/g) || []).map((t) => t.slice(2, -1));
const acc = (s) => s.match(/(save_variable|transfer_order)\([^)]*\)/g) || [];
const TO = 'transfer_order("FV| FUNIL DE VENTAS ","FV |  CUALIFICACION")';
const bloques = (s) => Object.fromEntries([...s.matchAll(/<([A-Z_]+)>([\s\S]*?)<\/\1>/g)].map((m) => [m[1], m[2].length]));
const bA = bloques(base), bB = bloques(p);
const NUCLEO = ['REGLA_MAESTRA', 'VERDAD_COMERCIAL', 'ANUNCIOS', 'PREGUNTAS', 'IDENTIFICACION', 'CLIENTE_DIRECTO', 'VARIABLES', 'TRANSFERENCIA'];
const MEC = ['IDENTIDAD', 'MEMORIA', 'ESTILO'];
const suma = (o, l) => l.reduce((s, k) => s + o[k], 0);
const pct = (x, t) => +(100 * x / t).toFixed(1);
const huerf = ab(p).filter((t) => !ce(p).includes(t)).concat(ce(p).filter((t) => !ab(p).includes(t)));
const v = {
  base: { chars: base.length, hash: H(base) },
  final: { chars: p.length, hash: H(p), delta: p.length - base.length, deltaPct: pct(p.length - base.length, base.length) },
  bloques: { antes: ab(base).length, despues: ab(p).length, iguales: JSON.stringify(ab(base)) === JSON.stringify(ab(p)) },
  etiquetasHuerfanas: huerf,
  porBloque: Object.keys(bA).map((k) => ({ bloque: k, antes: bA[k], despues: bB[k], delta: bB[k] - bA[k] })).filter((x) => x.delta !== 0),
  peso: {
    nucleoAntes: { chars: suma(bA, NUCLEO), pct: pct(suma(bA, NUCLEO), base.length) },
    nucleoDespues: { chars: suma(bB, NUCLEO), pct: pct(suma(bB, NUCLEO), p.length) },
    mecanicosAntes: { chars: suma(bA, MEC), pct: pct(suma(bA, MEC), base.length) },
    mecanicosDespues: { chars: suma(bB, MEC), pct: pct(suma(bB, MEC), p.length) },
  },
  acciones: acc(p),
  accionesIdenticas: JSON.stringify(acc(p)) === JSON.stringify(acc(base)),
  transferOrderExacto: p.split(TO).length - 1,
  colaIdentica: p.slice(p.indexOf('transfer_order(')) === base.slice(base.indexOf('transfer_order(')),
  guardrails: {
    total: propuesto.length,
    identicos: propuesto.filter((g, i) => JSON.stringify(g) === JSON.stringify(gr[i])).length,
    modificado: bot.name, frasesAntes: bot.config.frases.length, frasesDespues: propuesto.find((g) => g.name === bot.name).config.frases.length, agregadas: nuevas,
  },
  coberturaSinGuardrail: cobertura.filter((c) => !c.cubierta).map((c) => c.frase),
};
if (huerf.length) throw new Error('etiquetas huérfanas');
if (!v.accionesIdenticas || v.acciones.length !== 3 || v.transferOrderExacto !== 1 || !v.colaIdentica) throw new Error('las acciones o el transfer_order cambiaron');
if (!v.bloques.iguales) throw new Error('cambió la lista de bloques');
if (v.guardrails.identicos !== 5) throw new Error('los otros guardrails no quedaron intactos');
if (v.coberturaSinGuardrail.length) throw new Error('quedan frases sin cobertura: ' + v.coberturaSinGuardrail.join(', '));

fs.writeFileSync(out, p, 'utf8');
const stem = out.replace(/\.txt$/, '');
fs.writeFileSync(stem + '.cambios.json', JSON.stringify({ verificaciones: v, cambios: changes, cobertura }, null, 2), 'utf8');
fs.writeFileSync(stem + '.guardrails-propuestos.json', JSON.stringify(propuesto, null, 2), 'utf8');
console.log(JSON.stringify(v, null, 2));
console.log('\nescrito', out, '(NADA se tocó en el CRM)');
