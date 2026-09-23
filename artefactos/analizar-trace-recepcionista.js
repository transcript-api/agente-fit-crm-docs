// Analiza (solo lectura) los logs de procesamiento de IA de un ticket del Recepcionista.
// Uso: node analizar-trace-recepcionista.js <processing-logs-ticket-N.json> [mensajes-ticket-N.json]
// Entradas: la respuesta de GET /processing-logs/ticket/{id} y, opcional, GET /messages/{id}.
// No toca el CRM. Cualquier valor que parezca una API key se enmascara.
const fs = require('fs');
const load = (f) => {
  const r = fs.readFileSync(f, 'utf8');
  const o = JSON.parse(r.slice(r.search(/[\[{]/)));
  return o.result || o;
};
const mask = (s) => String(s).replace(/sk-[A-Za-z0-9_-]{10,}/g, 'sk-***');

const [, , fLogs, fMsgs] = process.argv;
const logs = (load(fLogs).logs || []).slice().sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

// busca recursivamente cualquier rastro de guardrails en el log
const GR = /guardrail|reprocess|autofix|block_silent|blocked_phrase|violat|regenerat|duplicate_greeting|empty_response|placeholder_leak|media_label/i;
const rastros = (obj, ruta = '', out = []) => {
  if (obj == null) return out;
  if (typeof obj === 'object') {
    for (const [k, v] of Object.entries(obj)) {
      if (GR.test(k)) out.push({ ruta: ruta + '.' + k, valor: JSON.stringify(v).slice(0, 220) });
      rastros(v, ruta + '.' + k, out);
    }
  } else if (typeof obj === 'string' && GR.test(obj)) {
    out.push({ ruta, valor: obj.slice(0, 220) });
  }
  return out;
};

console.log('logs de IA en el ticket:', logs.length, '\n');
logs.forEach((l, idx) => {
  const pd = l.processingData || {};
  console.log('==================== LOG ' + (idx + 1) + ' (id ' + l.id + ') ====================');
  console.log('cliente dijo :', JSON.stringify(mask(l.messageText || '').slice(0, 300)));
  console.log('estado       :', l.status, '| total', l.processingTimeMs, 'ms | modelo', pd.model, '| modo', pd.mode);
  console.log('warnings     :', JSON.stringify(l.warnings), '| error:', JSON.stringify(l.error));

  console.log('pasos        :');
  (l.processingSteps || []).forEach((s) => {
    console.log('   -', s.step.padEnd(26), s.duration === undefined ? '     -' : String(s.duration).padStart(6) + ' ms');
  });

  const acciones = (pd.actionsAnalysis && pd.actionsAnalysis.actions) || [];
  console.log('acciones que el analizador decidió (' + acciones.length + '):');
  if (!acciones.length) console.log('   (ninguna)');
  acciones.forEach((a) => {
    const p = a.parameters || {};
    const valor = p.variable_value !== undefined ? ' = ' + JSON.stringify(mask(p.variable_value)) : '';
    const dest = p.step_name ? ' -> ' + p.step_name : '';
    console.log('   -', a.functionName, (p.variable_name || '') + valor + dest, '| prioridad', a.priority, '| estado', a.status, '| ok', a.success);
  });
  const tok = pd.actionsAnalysis && pd.actionsAnalysis.tokenUsage;
  if (tok) console.log('   tokens del análisis de acciones:', tok.promptTokens, 'prompt +', tok.completionTokens, 'completion');

  const ms = (l.processingSteps || []).find((s) => s.step === 'message_sent');
  if (ms) console.log('mensajes enviados:', JSON.stringify(ms.data && ms.data.metadata));

  console.log('respuesta registrada (processingData.response):');
  console.log('   ' + JSON.stringify(mask(pd.response == null ? '(no viene)' : typeof pd.response === 'string' ? pd.response : JSON.stringify(pd.response)).slice(0, 700)));

  const rs = rastros(l);
  console.log('RASTROS DE GUARDRAILS en este log (' + rs.length + '):');
  if (!rs.length) console.log('   (ninguno: o no intervino, o este log no lo registra)');
  rs.slice(0, 15).forEach((r) => console.log('   -', r.ruta, '=>', r.valor));
  console.log('');
});

if (fMsgs) {
  const m = load(fMsgs);
  const arr = m.messages || m.data || (Array.isArray(m) ? m : []);
  console.log('==================== MENSAJES VISIBLES EN EL CHAT ====================');
  arr.slice().sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)).forEach((x) => {
    const quien = x.fromMe ? (x.generatedByAi ? 'IA ' : 'HUM') : 'CLI';
    console.log(quien, (x.createdAt || '').slice(11, 19), JSON.stringify(mask(x.body || '').slice(0, 300)));
  });
}
