// Construye localmente el candidato Rev4 (FUSIÓN) del Recepcionista Comercial (10005).
// Base: el prompt VIVO capturado el 2026-09-25 (NO la Rev3 de git, superada).
// NO toca el CRM. Cada ANTES debe aparecer exactamente una vez o aborta.
// Uso: node build-recepcionista-comercial-rev4.js <vivo.txt> <salida.txt>
const fs = require('fs');
const crypto = require('crypto');
const [, , src, out] = process.argv;
const base = fs.readFileSync(src, 'utf8');
const sha8 = (s) => crypto.createHash('sha256').update(s).digest('hex');
if (sha8(base) !== '27583800fce2f232c84f09cc4995fe0daecec0af5eea61db5429e66386e9748b') {
  throw new Error('La base NO es el prompt vivo capturado el 2026-09-25 (sha256 no coincide)');
}

const changes = [
  // ---------------------------------------------------------------------
  // 3. CORREGIR REFERENCIAS OBSOLETAS (FV|CUALIFICACION / Conversión)
  // ---------------------------------------------------------------------
  { id: 'F1', bloque: 'PREGUNTAS', tipo: 'corrige referencia obsoleta',
    antes: 'Después:\nguardar contexto\ntransferir inmediatamente a FV|CUALIFICACION\nNO esperar la respuesta desde Recepción\n\nNunca inventes una pregunta solamente para activar Conversión.',
    despues: 'Después:\nguardar contexto\ntransferir inmediatamente a CL|EN CONVERSACION\nNO esperar la respuesta desde Recepción\n\nNunca inventes una pregunta solamente para activar la atención comercial humana.',
    motivo: 'El texto decía "FV|CUALIFICACION" y "activar Conversión" — restos de cuando este prompt era una copia literal del Recepcionista de test (9882). El destino real de este agente es CL|EN CONVERSACION y no existe ningún agente de Conversión en esta rama.',
    riesgo: 'Bajo. El chip de transfer_order ya apunta técnicamente a CL, así que esto corrige lo que el modelo LEE, no lo que el CRM ejecuta.' },

  { id: 'F2', bloque: 'MAYORISTA', tipo: 'corrige referencia obsoleta',
    antes: 'Después guardá contexto y transferí a FV|CUALIFICACION.',
    despues: 'Después guardá contexto y transferí a CL|EN CONVERSACION.',
    motivo: 'Mismo residuo de la copia original del 9882.', riesgo: 'Bajo, mismo caso que F1.' },

  { id: 'F3', bloque: 'COMPRAS_ANTERIORES', tipo: 'corrige referencia obsoleta',
    antes: 'Si acepta algo parecido:\npuede avanzar a Conversión.',
    despues: 'Si acepta algo parecido:\npuede avanzar a atención comercial humana.',
    motivo: 'No existe "Conversión" en la rama CL; la continuidad después de Recepción es siempre humana en CL|EN CONVERSACION.', riesgo: 'Bajo.' },

  { id: 'F4', bloque: 'TRANSFERENCIA', tipo: 'corrige referencia obsoleta',
    antes: '<TRANSFERENCIA>\n\nA FV|CUALIFICACION cuando:',
    despues: '<TRANSFERENCIA>\n\nA CL|EN CONVERSACION cuando:',
    motivo: 'El encabezado del bloque completo seguía nombrando la pipeline de test.', riesgo: 'Bajo.' },

  { id: 'F5', bloque: 'CLIENTE_DIRECTO', tipo: 'corrige referencia obsoleta',
    antes: 'actualizá interes_inicial con la cantidad confirmada\nconservá anuncio_origen\ntransferí a FV|CUALIFICACION',
    despues: 'actualizá interes_inicial con la cantidad confirmada\nconservá anuncio_origen\ntransferí a CL|EN CONVERSACION',
    motivo: 'Faltaba en el barrido inicial: el ejemplo trabajado del Hipercalórico (el mismo que corrigió INTEGRIDAD_DE_PRECIOS) todavía cerraba con la pipeline de test.', riesgo: 'Bajo.' },

  { id: 'F6', bloque: 'OBJETIVOS_Y_KITS', tipo: 'corrige referencia obsoleta',
    antes: 'Recepción no elige un producto concreto.\nConversión lo hace.',
    despues: 'Recepción no elige un producto concreto exacto: eso lo resuelve la atención comercial humana en CL|EN CONVERSACION.',
    motivo: 'Mismo residuo: no existe un agente de "Conversión" en la rama CL.', riesgo: 'Bajo.' },

  // ---------------------------------------------------------------------
  // 8-9. ENTIDAD VS ATRIBUTO + TESTO DILATED (agregado, no existía en el vivo)
  // ---------------------------------------------------------------------
  { id: 'A1', bloque: 'IDENTIFICACION', tipo: 'incorporado del handoff (faltaba en el vivo)',
    antes: '"Quiero la proteína DUX que elegí y necesito precio"\n\nno alcanza si todavía no sabés cuál proteína DUX es.\n\n</IDENTIFICACION>',
    despues: '"Quiero la proteína DUX que elegí y necesito precio"\n\nno alcanza si todavía no sabés cuál proteína DUX es.\n\nAntes de preguntar, distinguí si la incertidumbre es del PRODUCTO (no sabemos cuál es) o de un ATRIBUTO del producto (sabemos cuál es, pero falta precio, stock, sabor u otro dato). Si el producto ya está identificado, no vuelvas a preguntar cuál es solamente porque falta un atributo — resolvé ese atributo con lo que tengas confirmado, o decí que lo confirmás.\n\nEjemplo:\n"Cuánto sale Testo Dilated?"\nTesto Dilated ya identifica el producto. Falta el precio, no el producto. No preguntes de qué marca es ni qué producto buscaba.\n\n</IDENTIFICACION>',
    motivo: 'El vivo no distingue "no sabemos qué producto es" de "sabemos el producto pero falta un dato". El handoff trae esta distinción con Testo Dilated como caso demostrado; no existía nada equivalente en el vivo.',
    riesgo: 'Bajo. Es aditivo, no reemplaza ninguna regla existente.' },

  // ---------------------------------------------------------------------
  // 10. GROWTH como marca no trabajada (ejemplo concreto, faltaba)
  // ---------------------------------------------------------------------
  { id: 'A2', bloque: 'MARCAS', tipo: 'incorporado del handoff (faltaba en el vivo)',
    antes: 'Si pide una marca que no trabajamos:\ndecí brevemente que por el momento no estamos trabajando con esa marca.\n\nPodés ofrecer UNA marca trabajada como alternativa.',
    despues: 'Si pide una marca que no trabajamos (por ejemplo Growth):\ndecí brevemente que por el momento no estamos trabajando con esa marca. Ejemplo: "Con Growth por el momento no estamos trabajando."\n\nSi todavía no sabés qué producto buscaba, preguntá eso antes de ofrecer una alternativa.\n\nPodés ofrecer UNA marca trabajada como alternativa, solamente si ya sabés qué producto/categoría buscaba.',
    motivo: 'El vivo ya tenía la regla general de marca no trabajada, pero sin ejemplo concreto ni el orden correcto (primero saber qué buscaba, después ofrecer alternativa). El handoff trae Growth como ejemplo demostrado y ese orden explícito.',
    riesgo: 'Bajo. No contradice la regla existente, la precisa.' },

  // ---------------------------------------------------------------------
  // 11 (parcial). UBICACIÓN — guion recuperado, no existía como respuesta unificada
  // ---------------------------------------------------------------------
  { id: 'A3', bloque: 'LOGISTICA', tipo: 'incorporado del handoff (faltaba en el vivo)',
    antes: 'Si pregunta ubicación:\nrespondé ubicación.',
    despues: 'Si pregunta ubicación (de dónde son / dónde están):\n"Somos de Rivera, estamos en Av. Tamandaré 2719 y hacemos envíos a todo el país."\nNo agregues automáticamente retiro en tienda, DAC o demora si no las preguntó. Ubicación sola no significa que quiere comprar: si todavía no sabés qué necesita, podés seguir con "Qué estabas buscando?" y esperar.',
    motivo: 'El vivo decía "respondé ubicación" sin el guion aprobado. El handoff recupera la frase exacta ya validada en otra sesión y agrega que no hay que descargar toda la logística de una vez.',
    riesgo: 'Bajo. Reemplaza una instrucción genérica por la respuesta ya aprobada.' },

  // ---------------------------------------------------------------------
  // 11 (parcial). OBJETIVO "bajar de peso" — faltaba el guion, solo estaba "aumentar masa"
  // ---------------------------------------------------------------------
  { id: 'A4', bloque: 'OBJETIVOS_Y_KITS', tipo: 'incorporado del handoff (faltaba en el vivo)',
    antes: 'Para aumento de masa podés usar:\n"Contame qué es lo que más te está costando hoy para subir masa?"',
    despues: 'Para bajar de peso podés usar:\n"Sí, para bajar de peso tenemos buenas opciones y también trabajamos con kits pensados para ese objetivo. Qué es lo que más te está costando ahora para conseguirlo?"\n\nPara aumento de masa podés usar:\n"Contame qué es lo que más te está costando hoy para subir masa?"',
    motivo: 'El vivo solo tenía el patrón de "aumentar masa". El handoff trae el mismo patrón para "bajar de peso", ya aprobado en otra sesión, sin agregar un menú de opciones.',
    riesgo: 'Bajo. Mismo patrón que el que ya existe, aplicado a otro objetivo.' },

  // ---------------------------------------------------------------------
  // E + 7 (parcial). ANUNCIO SILENCIOSO — no narrar el origen publicitario (política, no guardrail)
  // ---------------------------------------------------------------------
  { id: 'A5', bloque: 'ANUNCIOS', tipo: 'incorporado del handoff (faltaba en el vivo)',
    antes: 'No hace falta volver a dudar de esos datos dentro de esa conversación.',
    despues: 'No hace falta volver a dudar de esos datos dentro de esa conversación.\n\nEl anuncio se usa en silencio. No digas "vi que venís del anuncio", "veo que estás buscando", "según el anuncio que viste" ni nada que narre que sabés de dónde vino, salvo que el cliente pregunte explícitamente por eso. Usar el dato del anuncio para responder bien no es lo mismo que anunciar que lo usaste.',
    motivo: 'El vivo usa el anuncio como fuente pero no dice explícitamente que no hay que narrar su origen. Es una regla semántica, no léxica: por eso va en el prompt como política y NO se agrega como guardrail global (una frase como "veo que estás buscando" puede ser válida si surge del mensaje actual, no del anuncio).',
    riesgo: 'Medio-bajo. Es una regla de criterio, no mecánica, así que su cumplimiento depende del modelo. Por eso queda en el prompt y no en un guardrail léxico, tal como se decidió.' },

  // ---------------------------------------------------------------------
  // 7 (parcial). CLIENTE_DIRECTO — no repetir marca ya resuelta + excepción de precio
  // ---------------------------------------------------------------------
  { id: 'A6', bloque: 'CLIENTE_DIRECTO', tipo: 'incorporado del handoff (faltaba en el vivo)',
    antes: 'No repitas toda la descripción del producto.',
    despues: 'No repitas toda la descripción del producto. Si el producto y la marca ya quedaron claros por lo que dijo el cliente, no abras diciendo "Trabajamos con [marca]" — eso ya es obvio y no aporta nada. Responder un precio o un dato que el cliente pregunta directamente NO es esta clase de repetición, aunque ese dato ya estuviera en el anuncio: eso sí hay que responderlo.',
    motivo: 'El vivo ya decía "no expliques beneficios si no los pidió" pero no cubría el caso específico de repetir la marca obvia (el error real visto con "Trabajamos con Vitamin Horse"), ni la excepción de que preguntar un precio sí hay que responderlo aunque sea repetido.',
    riesgo: 'Bajo. Es una aclaración, no cambia el comportamiento ya correcto de INTEGRIDAD_DE_PRECIOS.' },
];

let p = base;
const aplicados = [];
for (const c of changes) {
  const n = p.split(c.antes).length - 1;
  if (n !== 1) throw new Error(c.id + ': el ANTES aparece ' + n + ' veces (debe ser 1). Bloque: ' + c.bloque);
  p = p.replace(c.antes, c.despues);
  aplicados.push({ ...c, deltaChars: c.despues.length - c.antes.length });
}

// ---- verificaciones estructurales ----
const backrefBlocks = (s) => [...s.matchAll(/<([A-Z_]+)>([\s\S]*?)<\/\1>/g)].map((m) => m[1]);
const bAntes = backrefBlocks(base), bDespues = backrefBlocks(p);
const acc = (s) => s.match(/(save_variable|transfer_order)\([^)]*\)/g) || [];
const contieneObsoletas = (s) => (s.match(/FV\|CUALIFICACION|(?<!atención comercial )\bConversión\b/g) || []);

const reporte = {
  base: { chars: base.length, sha256: sha8(base) },
  final: { chars: p.length, sha256: sha8(p), delta: p.length - base.length, deltaPct: +(100 * (p.length - base.length) / base.length).toFixed(1) },
  bloques: { antes: bAntes.length, despues: bDespues.length, lista: bDespues },
  acciones_texto_serializado: acc(p),
  referenciasObsoletasRestantes: contieneObsoletas(p),
  cambiosAplicados: aplicados.map((c) => ({ id: c.id, bloque: c.bloque, tipo: c.tipo, deltaChars: c.deltaChars })),
};

if (reporte.referenciasObsoletasRestantes.length) {
  console.log('ADVERTENCIA: quedan referencias obsoletas sin corregir:', reporte.referenciasObsoletasRestantes);
}
if (bAntes.length !== bDespues.length) {
  console.log('AVISO: cambió la cantidad de bloques top-level:', bAntes.length, '->', bDespues.length, '(esperado: ninguna alta, solo ediciones dentro de bloques existentes)');
}

fs.writeFileSync(out, p, 'utf8');
fs.writeFileSync(out.replace(/\.txt$/, '') + '.cambios.json', JSON.stringify({ reporte, cambios: changes }, null, 2), 'utf8');
console.log(JSON.stringify(reporte, null, 2));
console.log('\nescrito', out, '(NADA se tocó en el CRM)');
