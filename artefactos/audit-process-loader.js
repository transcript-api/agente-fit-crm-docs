// Procesa localmente las conversaciones extraídas. Anonimiza: teléfonos, correos, ctwaClid. No sube nada.
const fs = require('fs');
const raw = fs.readFileSync(__dirname + '/audit-messages-raw.json', 'utf8');
const data = JSON.parse(raw.slice(raw.search(/[\[{]/)));
const body = typeof data.body === 'string' ? JSON.parse(data.body) : (data.out ? data : data);
const tickets = (body.out || data.out);
const idx = JSON.parse(fs.readFileSync(__dirname + '/audit-tickets-index.json', 'utf8').replace(/^[^{]*/, '')).rows;
const meta = Object.fromEntries(idx.map(r => [r.id, r]));

const redact = (s) => (s || '').replace(/https?:\/\/\S+/g, '[url]').replace(/[\w.+-]+@[\w-]+\.[\w.]+/g, '[mail]').replace(/\+?\d[\d\s().-]{6,}\d/g, '[n°]').replace(/\s+/g, ' ').trim();
const GAP = 12 * 3600 * 1000;

function segments(msgs) {
  const segs = []; let cur = [];
  msgs.forEach((m, i) => {
    if (i > 0 && new Date(m.t) - new Date(msgs[i - 1].t) >= GAP) { segs.push(cur); cur = []; }
    cur.push(m);
  });
  if (cur.length) segs.push(cur);
  return segs;
}

const rows = tickets.map((t, i) => {
  const mt = meta[t.id] || {};
  const isNew = (mt.createdAt || '') >= '2026-09-13';
  const segs = segments(t.msgs);
  const seg = isNew ? segs[0] : segs[segs.length - 1];
  const first = seg[0];
  const firstC = seg.find(m => m.who === 'C');
  const ad = seg.find(m => m.ad) || t.msgs.find(m => m.ad);
  return { ref: 'T' + String(i + 1).padStart(2, '0'), id: t.id, isNew, origin: mt.origin || 'org', nMsgs: t.n, nSegs: segs.length, seg, starter: first.who, firstType: first.type, firstC, ad: ad ? ad.ad : null };
});

module.exports = { rows, redact };

if (require.main === module) {
  const cnt = (f) => rows.reduce((a, r) => { const k = f(r); a[k] = (a[k] || 0) + 1; return a; }, {});
  console.log('tickets:', rows.length, '| nuevos:', rows.filter(r => r.isNew).length, '| antiguos:', rows.filter(r => !r.isNew).length);
  console.log('quién inicia el tramo:', JSON.stringify(cnt(r => r.starter)));
  console.log('tipo del primer mensaje:', JSON.stringify(cnt(r => r.firstType)));
  console.log('origen:', JSON.stringify(cnt(r => r.origin)));
  console.log('con anuncio visible en el tramo:', rows.filter(r => r.ad).length);
  const newC = rows.filter(r => r.isNew && r.starter === 'C');
  console.log('nuevos que inician con cliente:', newC.length, '| con audio:', newC.filter(r => /audio/i.test(r.firstType)).length, '| con imagen/sticker:', newC.filter(r => /image|sticker/i.test(r.firstType)).length);
  const hist = {}; rows.forEach(r => r.seg.forEach(m => { if (m.who === 'A') hist.A = 1; })); console.log('tramos con mensajes de IA:', Object.keys(hist).length ? 'sí' : 'ninguno');
  const humanFirst = rows.filter(r => { const c = r.seg.findIndex(m => m.who === 'C'); const h = r.seg.findIndex((m, k) => k > c && (m.who === 'H' || m.who === 'S')); return c >= 0 && h >= 0; });
  console.log('tramos con primera respuesta a cliente (humano/sistema):', humanFirst.length);
}
