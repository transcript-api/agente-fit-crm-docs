// Construye localmente la v49.1 del Recepcionista (9882) sobre el v49 EXACTO. NO toca el CRM.
// Base exigida: 14663 caracteres, hash 4a66ec38. Cada ANTES debe aparecer exactamente una vez o aborta.
// Uso: node build-recepcionista-v49-1.js <v49.txt> <salida.txt>
const fs = require('fs');
const [, , src, out] = process.argv;
const base = fs.readFileSync(src, 'utf8');

const H = (p) => { let h = 0; for (let i = 0; i < p.length; i++) h = (h * 31 + p.charCodeAt(i)) >>> 0; return h.toString(16); };
if (base.length !== 14663 || H(base) !== '4a66ec38') throw new Error('La base NO es el v49 esperado: ' + base.length + ' / ' + H(base));

const changes = [
  { id: 'C1', punto: '2 VOZ DE EMPRESA', bloque: 'IDENTIDAD',
    antes: 'Cuando hablás de Fitness: "trabajamos con XTR" "trabajamos con DUX" "trabajamos por mayor" "trabajamos con kits" Nunca: "trabajamos XTR" "XTR se maneja" "se trabaja con XTR" "se trabaja con kits" ',
    despues: 'Cuando hablás de Fitness usá "trabajamos con XTR" "trabajamos con DUX" para una marca y "tenemos creatina" "tenemos proteínas" para una categoría o producto. También "trabajamos por mayor" "trabajamos con kits" Nunca: "trabajamos XTR" "XTR se maneja" "se trabaja con XTR" "se trabaja con kits" "trabajamos con creatina" "tengo" "tengo sí" "tenemos sí" "la manejamos" "manejamos ese producto" ' },

  { id: 'C2', punto: '3 MARCA CORRECTA', bloque: 'MARCAS',
    antes: 'Black School',
    despues: 'Black Skull' },

  { id: 'C3', punto: '4 VARIABLES (interes_inicial)', bloque: 'VARIABLES',
    antes: 'Solamente con información expresada por el cliente o confirmada. ',
    despues: 'Solamente con lo que el CLIENTE expresó, eligió, aceptó o confirmó. El anuncio no se copia acá y nunca escribas "posible interés". No guardes opciones que todavía no eligió. ' },

  { id: 'C4', punto: '4 VARIABLES (anuncio_origen)', bloque: 'VARIABLES',
    antes: 'Guardar: anuncio_origen solamente cuando exista una referencia real del sistema o del cliente. ',
    despues: 'Guardar: anuncio_origen el contexto real del anuncio (producto, presentación, precio, promo) solamente cuando exista una referencia real del sistema o del cliente. ' },

  { id: 'C5', punto: '5 MENSAJE ACTUAL SOBRE ANUNCIO', bloque: 'ANUNCIOS',
    antes: 'Si el sistema muestra el contenido REAL de un anuncio, sus datos explícitos pueden usarse. ',
    despues: 'El anuncio es contexto, no la intención: el mensaje actual del cliente manda. Si pregunta por otra cosa, respondé eso y no desarrolles la promo del anuncio porque sí. Si el sistema muestra el contenido REAL de un anuncio, sus datos explícitos pueden usarse. ' },

  { id: 'C6', punto: '6 COMPRADOR DIRECTO', bloque: 'CLIENTE_DIRECTO',
    antes: 'No repitas su pedido. No hagas cross-sell. No preguntes cómo suele pagar. No preguntes envío o retiro por defecto. Resolvé solamente lo indispensable. ',
    despues: 'No repitas su pedido ni expliques beneficios o composición. No hagas cross-sell. No preguntes cómo suele pagar. No preguntes envío o retiro por defecto. Si hay una decisión operativa inmediata (cantidad, opción de la promo del anuncio), preguntá solamente eso. Resolvé solamente lo indispensable. ' },
];

let p = base;
for (const c of changes) {
  const n = p.split(c.antes).length - 1;
  if (n !== 1) throw new Error(c.id + ': el ANTES aparece ' + n + ' veces (debe ser 1)');
  p = p.replace(c.antes, c.despues);
}

// verificaciones estructurales
const ab = (s) => (s.match(/<[A-Z_]+>/g) || []).map((t) => t.slice(1, -1));
const ce = (s) => (s.match(/<\/[A-Z_]+>/g) || []).map((t) => t.slice(2, -1));
const acc = (s) => s.match(/(save_variable|transfer_order)\([^)]*\)/g) || [];
const TO = 'transfer_order("FV| FUNIL DE VENTAS ","FV |  CUALIFICACION")';
const bloquesA = ab(base), bloquesB = ab(p);
const huerf = bloquesB.filter((t) => !ce(p).includes(t)).concat(ce(p).filter((t) => !bloquesB.includes(t)));

const v = {
  base: { chars: base.length, hash: H(base), bloques: bloquesA.length },
  final: { chars: p.length, hash: H(p), bloques: bloquesB.length, delta: p.length - base.length, deltaPct: +(100 * (p.length - base.length) / base.length).toFixed(1) },
  etiquetas: { abiertas: bloquesB.length, cerradas: ce(p).length, huerfanas: huerf },
  bloquesNuevos: bloquesB.filter((b) => !bloquesA.includes(b)),
  bloquesQuitados: bloquesA.filter((b) => !bloquesB.includes(b)),
  acciones: acc(p),
  accionesIdenticasAlV49: JSON.stringify(acc(p)) === JSON.stringify(acc(base)),
  transferOrderExacto: p.split(TO).length - 1,
  transferOrderIdentico: p.slice(p.indexOf('transfer_order(')) === base.slice(base.indexOf('transfer_order(')),
};
if (huerf.length) throw new Error('etiquetas huérfanas');
if (v.acciones.length !== 3 || !v.accionesIdenticasAlV49 || v.transferOrderExacto !== 1 || !v.transferOrderIdentico) throw new Error('las acciones o el transfer_order cambiaron');
if (v.bloquesNuevos.length || v.bloquesQuitados.length) throw new Error('cambió la lista de bloques');

fs.writeFileSync(out, p, 'utf8');
fs.writeFileSync(out.replace(/\.txt$/, '') + '.cambios.json', JSON.stringify({ verificaciones: v, cambios: changes }, null, 2), 'utf8');
console.log(JSON.stringify(v, null, 2));
console.log('\nescrito', out, '(NADA se tocó en el CRM)');
