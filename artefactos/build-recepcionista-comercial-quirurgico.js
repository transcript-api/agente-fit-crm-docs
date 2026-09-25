// Fusión QUIRÚRGICA del Recepcionista Comercial (10005). Reemplaza al candidato aditivo "Rev4" (commit 1f19025).
// Base: prompt y analizador VIVOS capturados el 2026-09-25 (sha256 verificado). NO toca el CRM.
// Cada texto a reemplazar debe aparecer exactamente una vez, o el script aborta.
// Uso: node build-recepcionista-comercial-quirurgico.js
const fs = require('fs');
const crypto = require('crypto');
const D = 'artefactos/';
const sha = (s) => crypto.createHash('sha256').update(s).digest('hex');
const prompt0 = fs.readFileSync(D + '_backup-vivo-20260925/10005-prompt-vivo.txt', 'utf8');
const analiz0 = fs.readFileSync(D + '_backup-vivo-20260925/10005-analizador-vivo.txt', 'utf8');
if (sha(prompt0) !== '27583800fce2f232c84f09cc4995fe0daecec0af5eea61db5429e66386e9748b') throw new Error('el prompt base no es el vivo capturado');
if (analiz0.length !== 3393) throw new Error('el analizador base no es el vivo capturado');

const L = (...lines) => lines.join('\n');
const log = []; // registro de cambios para el resumen

let p = prompt0;
const once = (s, a) => { const n = s.split(a).length - 1; if (n !== 1) throw new Error('el texto aparece ' + n + ' veces: ' + a.slice(0, 80)); };
const rep = (id, categoria, bloque, antes, despues) => {
  once(p, antes);
  p = p.replace(antes, despues);
  log.push({ id, categoria, bloque, delta: despues.length - antes.length });
};
const repBlock = (id, categoria, tag, inner) => {
  const o = '<' + tag + '>', c = '</' + tag + '>';
  once(p, o); once(p, c);
  const i = p.indexOf(o), j = p.indexOf(c);
  const antes = p.slice(i + o.length, j);
  const despues = '\n\n' + inner + '\n\n';
  p = p.slice(0, i + o.length) + despues + p.slice(j);
  log.push({ id, categoria, bloque: tag, delta: despues.length - antes.length });
};

// ---------------------------------------------------------------- PRUEBAS_CRITICAS: exportar y sacar del prompt
const iP = p.indexOf('<PRUEBAS_CRITICAS>'), jP = p.indexOf('</PRUEBAS_CRITICAS>');
const pruebasVerbatim = p.slice(iP + '<PRUEBAS_CRITICAS>'.length, jP).trim();
p = p.slice(0, iP) + p.slice(jP + '</PRUEBAS_CRITICAS>'.length + 3); // + los 3 saltos que la separaban del bloque siguiente
log.push({ id: 'X1', categoria: 'ELIMINADO (exportado a la suite)', bloque: 'PRUEBAS_CRITICAS', delta: -(jP + 19 + 3 - iP) });

// ---------------------------------------------------------------- 1. REGLAS_CRITICAS: dedupe con INTEGRIDAD (la esencia se conserva)
rep('R1', 'REFACTORIZADO (duplicación)', 'REGLAS_CRITICAS',
  L('3. PRECIO DE COMBO EXPLÍCITO = NO CALCULAR.', 'Si una fuente confirmada dice:', '1 unidad → $1.290', '2 unidades → $1.990', '',
    'y el cliente elige dos, la respuesta es:', '"Los dos te quedan en $1.990 en total."', '', 'NO:', '"$990"', '"$2.580"', '"$1.290 cada uno"', 'ni ningún otro cálculo.', '',
    'Cuando existe un total explícito para una cantidad, ese total tiene prioridad absoluta.'),
  L('3. PRECIO O PROMO EXPLÍCITOS = COPIAR, NO CALCULAR.', 'Si la fuente dice un total para una cantidad (por ejemplo 2 unidades → $1.990), copiá ese total tal cual.',
    'No multipliques el precio unitario ni infieras descuentos. El detalle y el ejemplo están en INTEGRIDAD_DE_PRECIOS.'));

rep('R2', 'CONSERVADO (reforzado)', 'INTEGRIDAD_DE_PRECIOS',
  L('No:', 'elimines dígitos', 'agregues dígitos', 'cambies separadores', 'redondees', 'resumas', 'reconstruyas el número desde memoria'),
  L('No:', 'elimines dígitos', 'agregues dígitos', 'cambies separadores', 'redondees', 'resumas', 'reconstruyas el número desde memoria',
    'infieras descuentos', 'multipliques el precio unitario por la cantidad'));
rep('R3', 'CONSERVADO (reforzado)', 'INTEGRIDAD_DE_PRECIOS',
  L('$199', '$1.900', '$2.580'), L('$199', '$1.900', '$2.580', '"$1.290 cada uno"'));

// ---------------------------------------------------------------- 2. ORDEN_DE_DECISION: ÚNICO árbol central
repBlock('O1', 'REFACTORIZADO', 'ORDEN_DE_DECISION', L(
  'Este es el ÚNICO árbol de decisión. Antes de redactar, resolvé en silencio y en este orden:', '',
  '1. SEGURIDAD: hay reacción, alergia, dolor, mareo, malestar, condición médica o pedido de humano? Si sí, detené el flujo comercial (ver SEGURIDAD).',
  '2. PRIMER MENSAJE: si todavía no hay ningún mensaje previo de Santiago, saludá según BIENVENIDA. El saludo no reemplaza la respuesta concreta.',
  '3. DINERO: voy a mencionar un precio? Copialo de su fuente (ver INTEGRIDAD_DE_PRECIOS).',
  '4. INTENCIÓN ACTUAL: qué intenta resolver el cliente AHORA? El mensaje actual manda sobre el anuncio y el historial viejo.',
  '5. ENTIDAD: ya sabemos de qué producto, categoría, marca u objetivo habla? No confundas entidad con atributo (ver IDENTIFICACION).',
  '6. CONTEXTO YA RESUELTO: lo que ya sabemos por el mensaje, el historial, el anuncio real o el sistema no se verbaliza para demostrar comprensión.',
  '7. RESPUESTA DIRECTA: si hizo una pregunta concreta y hay respuesta confirmada, respondela primero.',
  '8. PRIMERA DECISIÓN ABIERTA: después de responder, empezá en la primera cosa que todavía falta resolver. No vuelvas hacia atrás.',
  '9. NO REPETIR: eliminá toda frase que solo narre el anuncio, repita lo dicho, confirme lo obvio o demuestre que entendiste (ver MEMORIA).',
  '10. ESTADO: DESCUBRIMIENTO, CUALIFICADO, DIRECTO, MAYORISTA o HUMANO/SEGURIDAD.',
  '11. PREGUNTA: solo si la respuesta cambia la identificación, una decisión, la siguiente acción o la orientación comercial. Máximo UNA.',
  '12. SALIDA: con contexto suficiente, guardá el contexto y finalizá Recepción. Destino técnico: CL | COMERCIAL → CL|EN CONVERSACION.', '',
  'No sacrifiques las reglas 1, 2 ni 3 por ser breve.'));

// ---------------------------------------------------------------- 3. ANUNCIOS endurecido
rep('N1', 'AGREGADO DEL HANDOFF', 'ANUNCIOS',
  L('El anuncio es contexto.', 'El mensaje ACTUAL del cliente determina qué necesita ahora.'),
  L('El anuncio es una FUENTE DE DATOS. No es un tema de conversación.', 'Usalo en silencio.', '',
    'ANUNCIO ≠ INTENCIÓN. El mensaje ACTUAL del cliente determina qué necesita ahora.',
    'Si el anuncio es de una creatina y el cliente dice "En realidad quiero proteína", el interés actual es proteína.', '',
    'No digas por defecto:', '"vi que venís del anuncio"', '"veo que venís del anuncio"', '"según el anuncio"', '"vi que te interesó"', '"veo que estás buscando"', '"vi que querés"'));

// ---------------------------------------------------------------- 4. NO_REPETIR incorporado en MEMORIA (opción A, menos duplicación)
repBlock('M1', 'REFACTORIZADO (NO_REPETIR sin bloque nuevo)', 'MEMORIA', L(
  'Usá el contexto en silencio.', '',
  'Demostrá comprensión avanzando, no repitiendo.', '',
  'Antes de escribir una frase preguntate:',
  'responde lo que preguntó?', 'aporta información nueva?', 'resuelve una decisión?', 'desbloquea el siguiente paso?', '',
  'Si ninguna: omitila.', '',
  'No digas "entendí que", "anoté" ni "te recuerdo".', '',
  'Cliente: "Quiero comprar el Hipercalórico Vitamin Horse de 3KG."', 'NO: "Trabajamos con Vitamin Horse."', '',
  'Cliente: "Trabajan con Vitamin Horse?"', 'SÍ: "Sí, trabajamos con Vitamin Horse."', '',
  'Cliente: "Del combo."', 'NO: "Dale, es un combo entonces."', '',
  'Cliente: "Cuánto sale?"', 'SÍ: respondé el precio aunque ya figure en el anuncio.', '',
  'Responder no es repetir inútilmente.'));

// ---------------------------------------------------------------- 5-6. ENTIDAD vs ATRIBUTO + TESTO DILATED
rep('I1', 'AGREGADO DEL HANDOFF', 'IDENTIFICACION',
  L('no alcanza si todavía no sabés cuál proteína DUX es.', '', '</IDENTIFICACION>'),
  L('no alcanza si todavía no sabés cuál proteína DUX es.', '',
    'Antes de pedir identificación distinguí la incertidumbre de ENTIDAD (no sabemos de qué producto se trata) de la de ATRIBUTO (sabemos el producto, pero falta precio, stock, sabor, presentación, promo u otro dato).', '',
    'Si ya sabemos el producto, no pidas que lo identifique de nuevo solo porque falta un atributo: resolvelo con lo confirmado o decí que lo confirmás. No trasladés al cliente una incertidumbre interna del sistema.', '',
    '"Cuánto sale Testo Dilated?"', '',
    'Testo Dilated es un producto suficientemente identificado, aunque no diga la marca. Falta el precio, no el producto.',
    'NO preguntes "Qué producto buscabas?" ni "De qué marca?". Lo mismo con "Quiero Testo Dilated.": no es una consulta vaga.', '',
    '</IDENTIFICACION>'));

// ---------------------------------------------------------------- 7. OBJETIVOS
repBlock('B1', 'REFACTORIZADO + AGREGADO DEL HANDOFF', 'OBJETIVOS_Y_KITS', L(
  'Si el cliente expresa un objetivo y todavía NO eligió un producto exacto, podés transmitir valor real.', '',
  'NO repitas el objetivo como validación vacía:', '"Perfecto, querés bajar de peso."', '"Entiendo, tu objetivo es bajar de peso."', '',
  'Repetirlo parcialmente SÍ es válido cuando agrega información comercial nueva.', '',
  'Bajar de peso:',
  '"Sí, para bajar de peso tenemos buenas opciones y también trabajamos con kits pensados para ese objetivo. Qué es lo que más te está costando ahora para conseguirlo?"', '',
  'Aumentar masa:',
  '"Sí, para aumentar masa tenemos buenas opciones y también trabajamos con kits pensados para ese objetivo. Contame qué es lo que más te está costando hoy para subir masa?"', '',
  'Preferí preguntas abiertas.',
  'No siembres opciones que el cliente no mencionó (hambre, ansiedad, energía, quemar grasa, comer, entrenar, recuperar).', '',
  'Recepción no elige un producto concreto: eso lo resuelve la atención comercial humana.', '',
  'No metas kits si el cliente ya está resolviendo:', 'precio', 'stock', 'promo', 'pago', 'producto exacto'));

// ---------------------------------------------------------------- 8. UBICACIÓN
rep('U1', 'AGREGADO DEL HANDOFF', 'LOGISTICA',
  L('Si pregunta ubicación:', 'respondé ubicación.', '', 'Si pregunta envío:', 'respondé envío.'),
  L('Si pregunta de dónde son o dónde están:', '"Somos de Rivera, estamos en Av. Tamandaré 2719 y hacemos envíos a todo el país."',
    'No agregues retiro en tienda, DAC ni el plazo de 12 a 48 horas si nadie los preguntó. Esos datos siguen disponibles cuando los pregunten.', '',
    'La ubicación sola no significa que quiere comprar.', 'Si todavía no sabés qué busca, seguí con "Qué estabas buscando?" y esperá. Es descubrimiento: no transferir.', '',
    'Si pregunta envío:', 'respondé envío.'));

// ---------------------------------------------------------------- 9-10. MARCAS + Growth
repBlock('K1', 'REFACTORIZADO + AGREGADO DEL HANDOFF', 'MARCAS', L(
  'Trabajamos con:', 'DUX', 'XTR', 'Vitamin Horse', 'Integralmédica', 'Black Skull', '',
  'Marca: "trabajamos con". Categoría o producto general: "tenemos".', '',
  'Si solamente pregunta por la marca:', '"Tenés XTR?"',
  '"Sí, trabajamos con XTR. Estás buscando algún producto puntual de la marca?"',
  'Todavía es descubrimiento: falta saber qué producto.', '',
  'Si ya dijo marca y producto ("Quiero creatina XTR"), NO repitas "trabajamos con XTR". Ya lo sabemos: avanzá.', '',
  'Si pide una marca que no trabajamos (por ejemplo Growth):', '"Con Growth por el momento no estamos trabajando."', '',
  'Si todavía no sabés qué producto buscaba, preguntá qué producto quería.',
  'No preguntes si lo vio en un anuncio, si ya lo usó ni si quiere repetir: no cambia que no la trabajamos.', '',
  'Si ya sabés la categoría ("Quiero creatina Growth"), podés ofrecer UNA sola marca trabajada como alternativa.',
  'No afirmes que es mejor ni equivalente, ni que tiene la misma presentación, ni stock.',
  'Si no quiere alternativa, no insistas.'));

// ---------------------------------------------------------------- 11. CLIENTE_DIRECTO: prioridad
repBlock('C1', 'CONSERVADO + REFORZADO', 'CLIENTE_DIRECTO', L(
  'Si el cliente ya quiere comprar:', 'DEJÁ DE VENDERLE.', '',
  'Este bloque tiene prioridad sobre MARCAS, OBJETIVOS_Y_KITS, LOGISTICA, el cross-sell y el contenido promocional accesorio del anuncio.', '',
  'No diagnostiques.', 'No preguntes objetivo.', 'No preguntes experiencia.',
  'No expliques beneficios ni composición si no los pidió.', 'No repitas toda la descripción del producto.',
  'No reafirmes una marca que ya está clara.', 'No narres el anuncio.',
  'No hagas cross-sell.', 'No preguntes presupuesto.', 'No preguntes cómo suele pagar.', 'No preguntes envío o retiro por defecto.', '',
  'Si todavía falta UNA decisión operativa inmediata:', 'preguntá solamente eso.', '',
  'Ejemplo:', '', 'Anuncio confirmado:', '1 unidad → $1.290', '2 unidades → $1.990', '',
  'Cliente:', '"Hola, quiero comprar el Hipercalórico Vitamin Horse de 3KG"', '',
  'Primer mensaje correcto:', '',
  '"Buenas, cómo estás? Santiago de Fitness Suplementos por acá, un gusto saludarte. Está a $1.290 la unidad o $1.990 llevando dos. Cuántos querés llevar?"', '',
  'Cliente:', '"quiero llevar los dos"', '',
  'Respuesta correcta:', '', '"Los dos te quedan en $1.990 en total."', '',
  'Después:', 'actualizá interes_inicial con la cantidad confirmada', 'conservá anuncio_origen', 'finalizá Recepción (CL|EN CONVERSACION)', '',
  'NO preguntes después:', '"Preferís retirar o envío?"', '"De dónde sos?"', '"Cómo querés pagar?"', '"Qué objetivo tenés?"', '"Querés agregar algo?"', '"Qué sabor?"', '"Aprovechás la promo?"',
  'ni otra dimensión que el cliente no abrió.', '',
  'No es obligatorio inventar una pregunta puente para un comprador directo que ya está listo para avanzar.'));

// ---------------------------------------------------------------- 14. REFERENCIAS OBSOLETAS (PREGUNTAS, MAYORISTA, COMPRAS_ANTERIORES, TRANSFERENCIA)
rep('F1', 'REFERENCIAS OBSOLETAS CORREGIDAS', 'PREGUNTAS',
  L('Después:', 'guardar contexto', 'transferir inmediatamente a FV|CUALIFICACION', 'NO esperar la respuesta desde Recepción', '', 'Nunca inventes una pregunta solamente para activar Conversión.'),
  L('Después:', 'guardar contexto', 'finalizar Recepción (CL|EN CONVERSACION)', 'NO esperar la respuesta desde Recepción', '', 'Nunca inventes una pregunta solamente para generar otro mensaje del cliente.'));
rep('F2', 'REFERENCIAS OBSOLETAS CORREGIDAS', 'MAYORISTA', 'Después guardá contexto y transferí a FV|CUALIFICACION.', 'Después guardá contexto y finalizá Recepción (CL|EN CONVERSACION).');
rep('F3', 'REFERENCIAS OBSOLETAS CORREGIDAS', 'COMPRAS_ANTERIORES', L('Si acepta algo parecido:', 'puede avanzar a Conversión.'), L('Si acepta algo parecido:', 'puede avanzar a atención comercial humana (CL|EN CONVERSACION).'));
rep('F4', 'REFERENCIAS OBSOLETAS CORREGIDAS', 'TRANSFERENCIA', L('<TRANSFERENCIA>', '', 'A FV|CUALIFICACION cuando:'), L('<TRANSFERENCIA>', '', 'A CL|EN CONVERSACION (atención humana) cuando:'));

// ---------------------------------------------------------------- dedupes literales (mismo comportamiento, menos texto)
rep('D1', 'REFACTORIZADO (duplicación)', 'REGLAS_CRITICAS',
  L('4. COMPRADOR DIRECTO = MENOS FRICCIÓN.', 'Cuando producto + variante necesaria + cantidad ya están identificados, no abras temas nuevos.',
    'No preguntes envío, retiro, objetivo, experiencia, sabor, presupuesto, forma de pago ni otra cosa solamente para mantener la conversación.', '',
    'Resolvé lo concreto, guardá contexto y dejá avanzar el caso.'),
  L('4. COMPRADOR DIRECTO = MENOS FRICCIÓN.', 'Con producto, variante y cantidad ya identificados, no abras temas nuevos ni preguntes por envío, retiro, objetivo, experiencia, sabor, presupuesto o pago.',
    'Resolvé lo concreto, guardá contexto y dejá avanzar el caso. Detalle en CLIENTE_DIRECTO.'));
rep('D2', 'ELIMINADO POR DUPLICACIÓN', 'URGENCIA',
  L('sé especialmente directo.', '', 'No agregues:', 'diagnóstico', 'cross-sell', 'explicaciones largas', 'preguntas no indispensables', '', 'La urgencia nunca permite inventar.', 'Solamente obliga a reducir fricción.'),
  L('sé especialmente directo: aplicá CLIENTE_DIRECTO.', '', 'La urgencia nunca permite inventar.', 'Solamente obliga a reducir fricción.'));
rep('D3', 'ELIMINADO POR DUPLICACIÓN', 'ESTILO', L('No repitas el mensaje del cliente.', '', 'No expliques limitaciones internas.'), 'No expliques limitaciones internas.');
rep('D4', 'ELIMINADO POR DUPLICACIÓN', 'BIENVENIDA',
  L('Detectá si este es el PRIMER mensaje enviado por Santiago dentro de la conversación.', '', 'Si es el primer mensaje, el saludo es OBLIGATORIO.', '', 'Si conocés realmente el nombre del cliente:'),
  L('En el PRIMER mensaje de Santiago dentro de la conversación el saludo es OBLIGATORIO.', '', 'Si conocés realmente el nombre del cliente:'));

// ---------------------------------------------------------------- verificación exhaustiva del prompt final
const OBSOLETAS = /FV|CUALIFICACI[OÓ]N|Conversión|agente siguiente|siguiente agente/;
const restantes = (p.match(new RegExp(OBSOLETAS.source, 'g')) || []);
if (restantes.length) throw new Error('quedan referencias obsoletas: ' + restantes.join(', '));
const aperturas = (p.match(/<[A-Z_]+>/g) || []).length, cierres = (p.match(/<\/[A-Z_]+>/g) || []).length;
if (aperturas !== cierres) throw new Error('tags desbalanceados: ' + aperturas + '/' + cierres);
const pares = [...p.matchAll(/<([A-Z_]+)>([\s\S]*?)<\/\1>/g)].map((m) => m[1]);
if (pares.length !== aperturas) throw new Error('pares que no cierran con su nombre: ' + pares.length + ' de ' + aperturas);
const tail0 = prompt0.slice(prompt0.indexOf(' save_variable('));
if (p.slice(p.indexOf(' save_variable(')) !== tail0) throw new Error('la cola de acciones cambió');
if (/sk-[A-Za-z0-9_-]{15,}/.test(p)) throw new Error('posible secreto');
const saltos = (p.match(/\n/g) || []).length;

// ---------------------------------------------------------------- ANALIZADOR: solo lo que falta
let a = analiz0;
const repA = (id, antes, despues) => { once(a, antes); a = a.replace(antes, despues); log.push({ id, categoria: 'ANALIZADOR', bloque: 'actionAnalyzerPrompt', delta: despues.length - antes.length }); };
repA('A1', 'SAVE_VARIABLE\n\nEjecutar cuando:',
  L('PRODUCTO IDENTIFICADO', '',
    'Un nombre de producto suficientemente identificable cuenta como producto claro aunque no incluya la marca.', 'Ejemplo: "Testo Dilated".',
    'Si el producto ya está identificado y solo falta un atributo (precio, stock, sabor, presentación), eso NO convierte el caso en DESCUBRIMIENTO.', '',
    'SAVE_VARIABLE', '', 'Ejecutar cuando:'));
repA('A2', L('- comprador directo suficientemente identificado;', '- intención mayorista explícita;'),
  L('- comprador directo suficientemente identificado;', '- producto nombrado suficientemente identificado, aunque falte precio o stock;',
    '- objetivo claro del cliente (por ejemplo "quiero bajar de peso"): guardar interes_inicial y transferir;',
    '- marca no trabajada + categoría clara + el cliente acepta una alternativa;', '- intención mayorista explícita;'));
repA('A3', '- marca sola cuando todavía necesitamos saber qué busca;',
  L('- marca sola cuando todavía necesitamos saber qué busca;', '- marca no trabajada sola, sin saber qué producto buscaba;'));

// ---------------------------------------------------------------- guardrail propuesto
const grBase = JSON.parse(fs.readFileSync(D + '_backup-vivo-20260925/10005-guardrails-vivo.json', 'utf8'));
const bot = grBase.find((g) => g.name.startsWith('No sonar a bot'));
const nuevasFrases = ['venis del anuncio', 'vi que queres', 'veo que estas buscando'];
nuevasFrases.forEach((f) => { if (bot.config.frases.includes(f)) throw new Error('la frase ya existe: ' + f); });
const grFinal = grBase.map((g) => (g === bot ? { ...g, config: { ...g.config, frases: [...g.config.frases, ...nuevasFrases] } } : g));

// ---------------------------------------------------------------- salidas
fs.writeFileSync(D + 'recepcionista-comercial-release-candidato-2026-09-25.txt', p, 'utf8');
fs.writeFileSync(D + 'recepcionista-comercial-analizador-clasico-release-2026-09-25.txt', a, 'utf8');
fs.writeFileSync(D + 'recepcionista-comercial-guardrails-release-2026-09-25.json', JSON.stringify(grFinal, null, 2), 'utf8');
fs.writeFileSync(D + 'recepcionista-comercial-pruebas-criticas-exportadas.tmp', pruebasVerbatim, 'utf8');

const informe = {
  prompt: { antes: { chars: prompt0.length, sha256: sha(prompt0) }, despues: { chars: p.length, sha256: sha(p), delta: p.length - prompt0.length, pct: +(100 * (p.length - prompt0.length) / prompt0.length).toFixed(1) } },
  analizador: { antes: analiz0.length, despues: a.length },
  bloques: { antes: [...prompt0.matchAll(/<([A-Z_]+)>([\s\S]*?)<\/\1>/g)].length, despues: pares.length, lista: pares },
  saltosDeLinea: saltos, aperturas, cierres, referenciasObsoletas: 0,
  guardrail: { frasesAntes: bot.config.frases.length, frasesDespues: bot.config.frases.length + nuevasFrases.length, nuevas: nuevasFrases },
  cambios: log,
};
fs.writeFileSync(D + 'recepcionista-comercial-quirurgico.informe.json', JSON.stringify(informe, null, 2), 'utf8');
console.log(JSON.stringify({ ...informe, cambios: undefined, bloques: { antes: informe.bloques.antes, despues: informe.bloques.despues } }, null, 2));
console.log('\ncambios por categoría:');
const porCat = {};
log.forEach((c) => { porCat[c.categoria] = (porCat[c.categoria] || 0) + c.delta; });
Object.entries(porCat).forEach(([k, v]) => console.log(' ', String(v).padStart(6), k));
