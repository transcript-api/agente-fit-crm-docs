// Construye localmente la v49.2 del Recepcionista (9882) sobre la v49.1 VIVA. NO toca el CRM.
// Objetivo: sacar del prompt lo mecanico que los guardrails ya garantizan. No agrega reglas.
// Base exigida: 15349 caracteres, hash c753bc8a. Cada ANTES debe aparecer exactamente una vez o aborta.
// Uso: node build-recepcionista-v49-2.js <v49-1.txt> <guardrails-v1.json> <salida.txt>
const fs = require('fs');
const [, , src, fGr, out] = process.argv;
const base = fs.readFileSync(src, 'utf8');
const H = (p) => { let h = 0; for (let i = 0; i < p.length; i++) h = (h * 31 + p.charCodeAt(i)) >>> 0; return h.toString(16); };
if (base.length !== 15349 || H(base) !== 'c753bc8a') throw new Error('La base NO es la v49.1 esperada: ' + base.length + ' / ' + H(base));

const changes = [
  { id: 'D1', bloque: 'IDENTIDAD',
    antes: 'Nunca hagas parecer que otra persona continúa. NO digas: "te pasan" "te ayudan" "te confirman" "otro asesor" "el equipo" "un compañero" Usá:',
    despues: 'Nunca hagas parecer que otra persona continúa ni menciones "el equipo". Usá:',
    delegado: 'te pasan · te ayudan · te confirman · otro asesor · un compañero' },

  { id: 'D2', bloque: 'IDENTIDAD',
    antes: '"trabajamos con creatina" "tengo" "tengo sí" "tenemos sí" "la manejamos" "manejamos ese producto" ',
    despues: '"trabajamos con creatina" "tengo" ',
    delegado: '(no delegado: son variantes del mismo error de voz; se compactan a las dos formas que el prompt debe distinguir)' },

  { id: 'D3', bloque: 'MEMORIA',
    antes: 'Usá contexto silenciosamente. NO digas: "quedó claro" "ya veo que querés" "entendí que" "anoté" "te recuerdo" No repitas',
    despues: 'Usá el contexto en silencio. No repitas',
    delegado: 'quedó claro · ya veo que · entendí que' },

  { id: 'D4', bloque: 'ESTILO',
    antes: 'No uses filler como: "Quedó claro que" "Ya veo que" "Mientras tanto" "Te dejo una pregunta cortita" "Te pregunto algo rápido" "Para afinar" "Así lo afinamos" "Afinemos" ',
    despues: '',
    delegado: 'Quedó claro que · Ya veo que · Te pregunto algo rápido · Para afinar · Así lo afinamos' },

  { id: 'D5', bloque: 'ESTILO',
    antes: 'No valides automáticamente con: Perfecto Genial Buenísimo Excelente ',
    despues: '',
    delegado: 'Perfecto · Genial · Buenísimo · Excelente (guardrail Fillers de apertura)' },

  { id: 'D6', bloque: 'ESTILO',
    antes: 'No repitas el mensaje del cliente. No expliques limitaciones internas.',
    despues: 'No expliques limitaciones internas.',
    delegado: '(duplicado exacto: la regla de no repetir al cliente sigue en MEMORIA)' },
];

let p = base;
for (const c of changes) {
  const n = p.split(c.antes).length - 1;
  if (n !== 1) throw new Error(c.id + ': el ANTES aparece ' + n + ' veces (debe ser 1)');
  p = p.replace(c.antes, c.despues);
}

// ---- guardrail propuesto (solo 2 frases agregadas al de lenguaje de bot) ----
const gr = JSON.parse(fs.readFileSync(fGr, 'utf8'));
const bot = gr.find((g) => g.name.startsWith('No sonar a bot'));
const nuevas = ['te hago una sola consulta', 'para avanzar ya'];
const propuesto = gr.map((g) => (g.name === bot.name ? { ...g, config: { ...g.config, frases: [...g.config.frases, ...nuevas] } } : g));

// ---- cobertura: cada frase que sale del prompt, ¿la cubre un guardrail? ----
const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const listaBot = propuesto.find((g) => g.name === bot.name).config.frases.map(norm);
const listaFill = gr.find((g) => g.name === 'Fillers de apertura').config.frases.map(norm);
const cubre = (frase, lista) => lista.some((f) => norm(frase).includes(f));
const quitadas = [
  ['te pasan', 'bot'], ['te ayudan', 'bot'], ['te confirman', 'bot'], ['otro asesor', 'bot'], ['un compañero', 'bot'],
  ['quedó claro', 'bot'], ['ya veo que querés', 'bot'], ['entendí que', 'bot'], ['anoté', 'bot'], ['te recuerdo', 'bot'],
  ['Quedó claro que', 'bot'], ['Ya veo que', 'bot'], ['Mientras tanto', 'bot'], ['Te dejo una pregunta cortita', 'bot'],
  ['Te pregunto algo rápido', 'bot'], ['Para afinar', 'bot'], ['Así lo afinamos', 'bot'], ['Afinemos', 'bot'],
  ['Perfecto', 'fill'], ['Genial', 'fill'], ['Buenísimo', 'fill'], ['Excelente', 'fill'],
];
const cobertura = quitadas.map(([f]) => ({
  frase: f,
  bot: cubre(f, listaBot) ? 'sí' : 'no',
  fillers: cubre(f, listaFill) ? 'sí' : 'no',
  cubierta: cubre(f, listaBot) || cubre(f, listaFill),
}));

// ---- verificaciones ----
const ab = (s) => (s.match(/<[A-Z_]+>/g) || []).map((t) => t.slice(1, -1));
const ce = (s) => (s.match(/<\/[A-Z_]+>/g) || []).map((t) => t.slice(2, -1));
const acc = (s) => s.match(/(save_variable|transfer_order)\([^)]*\)/g) || [];
const TO = 'transfer_order("FV| FUNIL DE VENTAS ","FV |  CUALIFICACION")';
const bloques = (s) => Object.fromEntries([...s.matchAll(/<([A-Z_]+)>([\s\S]*?)<\/\1>/g)].map((m) => [m[1], m[2].length]));
const bA = bloques(base), bB = bloques(p);
const huerf = ab(p).filter((t) => !ce(p).includes(t)).concat(ce(p).filter((t) => !ab(p).includes(t)));
const v = {
  base: { chars: base.length, hash: H(base) },
  final: { chars: p.length, hash: H(p), delta: p.length - base.length, deltaPct: +(100 * (p.length - base.length) / base.length).toFixed(1) },
  bloques: { antes: ab(base).length, despues: ab(p).length, iguales: JSON.stringify(ab(base)) === JSON.stringify(ab(p)) },
  etiquetasHuerfanas: huerf,
  porBloque: Object.keys(bA).map((k) => ({ bloque: k, antes: bA[k], despues: bB[k], delta: bB[k] - bA[k] })).filter((x) => x.delta !== 0),
  acciones: acc(p),
  accionesIdenticas: JSON.stringify(acc(p)) === JSON.stringify(acc(base)),
  transferOrderExacto: p.split(TO).length - 1,
  colaIdentica: p.slice(p.indexOf('transfer_order(')) === base.slice(base.indexOf('transfer_order(')),
  guardrails: {
    total: propuesto.length,
    identicosSalvoUno: propuesto.filter((g, i) => JSON.stringify(g) === JSON.stringify(gr[i])).length,
    modificado: bot.name,
    frasesAntes: bot.config.frases.length,
    frasesDespues: propuesto.find((g) => g.name === bot.name).config.frases.length,
    agregadas: nuevas,
  },
  coberturaSinGuardrail: cobertura.filter((c) => !c.cubierta).map((c) => c.frase),
};
if (huerf.length) throw new Error('etiquetas huérfanas');
if (!v.accionesIdenticas || v.acciones.length !== 3 || v.transferOrderExacto !== 1 || !v.colaIdentica) throw new Error('las acciones o el transfer_order cambiaron');
if (!v.bloques.iguales) throw new Error('cambió la lista de bloques');
if (v.guardrails.identicosSalvoUno !== 5) throw new Error('los otros guardrails no quedaron intactos');

fs.writeFileSync(out, p, 'utf8');
const stem = out.replace(/\.txt$/, '');
fs.writeFileSync(stem + '.cambios.json', JSON.stringify({ verificaciones: v, cambios: changes, cobertura }, null, 2), 'utf8');
fs.writeFileSync(stem + '.guardrails-propuestos.json', JSON.stringify(propuesto, null, 2), 'utf8');
console.log(JSON.stringify(v, null, 2));
console.log('\nCOBERTURA de lo que sale del prompt:');
cobertura.forEach((c) => console.log('  ' + (c.cubierta ? 'cubierta' : 'SIN COBERTURA').padEnd(14), c.frase));
console.log('\nescrito', out, '(NADA se tocó en el CRM)');
