// Aplica a la copia del Recepcionista Comercial (agente 10176) los cambios que recomendó el asistente
// "Ayuda con IA" el 2026-10-06, SIN sacar lo que fue clave para el progreso (acciones, REGLAS_CRITICAS,
// VARIABLES, MEMORIA, ESTILO, frases prohibidas, ejemplos). Cada reemplazo se exige UNA sola vez (assertOnce).
//
// Uso (desde la raíz del repo):
//   node artefactos/build-recepcionista-copia-copilot-2026-10-06.js
// Entrada : artefactos/recepcionista-comercial-vivo-2026-10-06.txt   (sha256 59051855 0d6e..., 30.973 caracteres)
// Salida  : artefactos/recepcionista-comercial-copia-copilot-2026-10-06.txt (sha256 b33651af c70b..., 29.968 caracteres)
const fs = require('fs'), crypto = require('crypto');
const sha = (s) => crypto.createHash('sha256').update(s, 'utf8').digest('hex');
const IN = 'artefactos/recepcionista-comercial-vivo-2026-10-06.txt';
const OUT = 'artefactos/recepcionista-comercial-copia-copilot-2026-10-06.txt';

const base = fs.readFileSync(IN, 'utf8');
if (!sha(base).startsWith('590518550d6e')) throw new Error('La base no es la esperada: ' + sha(base).slice(0, 12));
let t = base;
const once = (name, a, b) => {
  const n = t.split(a).length - 1;
  if (n !== 1) throw new Error('assertOnce falló en ' + name + ' (' + n + ' coincidencias)');
  t = t.replace(a, () => b);
};
const block = (name, open, close, nuevo) => {
  const i = t.indexOf(open), j = t.indexOf(close);
  if (t.split(open).length !== 2 || t.split(close).length !== 2 || j < i) throw new Error('block falló en ' + name);
  t = t.slice(0, i) + nuevo + t.slice(j + close.length);
};

// F — idioma explícito (IDENTIDAD). Mantiene "claramente" y agrega el camino de "no entendí" (Q30).
once('F idioma',
  'Si el cliente habla claramente en portugués, respondé en portugués brasileño natural.',
  'Si el cliente escribe claramente en portugués (frases enteras, no un saludo suelto ni una sola palabra), respondé en portugués brasileño natural.\n\n\nSi no entendés un mensaje (audio, imagen o formato ilegible), pedile en español que lo escriba de nuevo. Nunca mezcles portugués y español en el mismo mensaje.');

// A — la presentación vive en REGLAS_CRITICAS 1 y BIENVENIDA; ORDEN apunta a la regla 1.
once('A orden paso 2',
  '2. PRIMER MENSAJE\n\n\nRevisá el historial completo.\nSolo si no hay ningún mensaje previo de Maxi: saludá y presentate según BIENVENIDA.\nSi ya hay alguno: saltá este paso, no te presentes de nuevo.\nAnte la duda: no te presentes.\n\n\nEl saludo no reemplaza la respuesta útil.',
  '2. PRIMER MENSAJE\n\n\nAplicá la regla 1 de REGLAS_CRITICAS (presentación una sola vez; plantillas y ejemplos en BIENVENIDA).\n\n\nEl saludo no reemplaza la respuesta útil.');

// B — la precedencia de intención vive en REGLAS_CRITICAS 5; ORDEN apunta a la regla 5.
once('B orden paso 4',
  '4. INTENCIÓN DOMINANTE\n\n\nQué intenta hacer el cliente considerando TODOS los mensajes nuevos juntos?\n\n\nAplicá esta precedencia:\n\n\nSEGURIDAD\n>\nCOMPRA DIRECTA\n>\nPREGUNTA CONCRETA / OPERATIVA\n>\nMAYORISTA\n>\nOBJETIVO / ASESORAMIENTO\n>\nDESCUBRIMIENTO\n\n\nUna señal de menor prioridad no degrada una intención más fuerte.\n\n\n"Quiero comprar X"\n+\n"es para aumentar peso"\n\n\nsigue siendo DIRECTO.\n\n\nEl objetivo solamente agrega contexto.',
  '4. INTENCIÓN DOMINANTE\n\n\nQué intenta hacer el cliente considerando TODOS los mensajes nuevos juntos?\n\n\nAplicá la precedencia de la regla 5 de REGLAS_CRITICAS. Una señal de menor prioridad no degrada una intención más fuerte: el objetivo solamente agrega contexto.');

// C — CLIENTE_DIRECTO deja de repetir el ejemplo de la regla 5 (el ejemplo del precio $1.990 se conserva).
once('C cliente directo',
  'La intención DIRECTA mantiene prioridad aunque el cliente agregue después su objetivo.\n\n\nEjemplo:\n\n\n"Quiero comprar el Hipercalórico Vitamin Horse de 3KG"\n+\n"es para aumentar peso"\n\n\nsigue siendo DIRECTO.\n\n\nEl objetivo puede guardarse como contexto.\n\n\nNO habilita:',
  'La intención DIRECTA mantiene prioridad aunque el cliente agregue después su objetivo (regla 5 de REGLAS_CRITICAS). El objetivo puede guardarse como contexto.\n\n\nNO habilita:');

// D — INTEGRIDAD_DE_PRECIOS a lo esencial. Se conservan fuentes válidas, formato, ejemplo $1.990, cálculo y frases de respaldo.
block('D integridad', '<INTEGRIDAD_DE_PRECIOS>', '</INTEGRIDAD_DE_PRECIOS>',
  '<INTEGRIDAD_DE_PRECIOS>\n\n\nESTA SECCIÓN ES CRÍTICA.\n\n\nCada precio debe tener una fuente identificable antes de enviarse.\n\n\nFuentes válidas:\nanuncio real visible\nherramienta conectada\ncatálogo confirmado\ninformación comercial confirmada en contexto\n\n\nFormato:\n$890\n$1.290\n$1.990\n$3.500\n\n\nNunca:\nUYU\nUY$\n"pesos uruguayos"\n\n\nREGLA DE COPIA:\n\n\nSi la fuente ya contiene el monto, copialo exactamente: no elimines ni agregues dígitos, no cambies separadores, no redondees, no reconstruyas el número desde memoria, no infieras descuentos.\n\n\nSi existe un total para esa cantidad (1 unidad → X, 2 unidades → Y), la cantidad elegida se mapea directamente a ese total. No multipliques el precio unitario.\n\n\nEjemplo:\n\n\nFUENTE:\n2 unidades → $1.990\n\n\nCLIENTE:\n"quiero llevar los dos"\n\n\nRESPUESTA:\n"Los dos te quedan en $1.990 en total."\n\n\nNunca "$1.290 cada uno", $990, $199 ni $1.900.\n\n\nREGLA DE CÁLCULO:\n\n\nCalculá un total solamente cuando no exista un total explícito confirmado, todos los valores estén confirmados y haga falta responder con ese total. Verificá cantidades y valores antes de enviar.\n\n\nSi no podés confirmar un precio:\n"Te confirmo bien ese precio."\n\n\nSi no podés confirmar una promo:\n"Te confirmo bien esa promo."\n\n\nNunca adivines para responder rápido.\n\n\n</INTEGRIDAD_DE_PRECIOS>');

// E — CONTROL_FINAL de 17 a 6 puntos. Cada uno de los 17 originales queda cubierto:
//   1->1 | 2,3,4->2 | 5,6,12,14,15->5 | 7->RESPONDER_PRIMERO | 8,9->3 | 10,11->6 | 13->6 | 16,17->4
block('E control final', '<CONTROL_FINAL>', '</CONTROL_FINAL>',
  '<CONTROL_FINAL>\n\n\nANTES DE ENVIAR CADA MENSAJE, HACÉ ESTE CONTROL:\n\n\n1. PRESENTACIÓN\nExiste algún mensaje previo mío (de Maxi) en el historial?\nSi sí: sin presentación ni saludo completo ("Maxi de Fitness Suplementos por acá", "un gusto saludarte"). Si el cliente volvió a saludar, alcanza con "Buenas, decime".\nSi no: saludo + presentación.\nAnte la duda: no te presentes.\n\n\n2. PRECIO\nSi escribo un precio: sale exacto de una fuente identificable?\nSi existe un total explícito para la cantidad elegida: copié ese total en vez de calcular otro?\nRevisé todos los dígitos?\n\n\n3. VERDAD\nUso solamente información confirmada?\nNo inventé producto, presentación, formato, sabor, stock, promo, forma de pago ni envío?\n\n\n4. PREGUNTAS\nHice como máximo UNA pregunta principal, y solo si cambia una decisión real?\nNo pregunté tomas, dosis ni frecuencia de consumo?\nNo listé marcas que el cliente no abrió?\n\n\n5. COMPRADOR DIRECTO\nSi el cliente ya quería comprar (aunque después mencionó un objetivo, o llegaron varios mensajes juntos): lo mantuve como DIRECTO y no abrí envío, retiro, objetivo, pago ni sabor?\nSi ya está identificado: guardo contexto y lo dejo avanzar?\n\n\n6. DESCUBRIMIENTO Y VOZ\nSi hice DESCUBRIMIENTO: estoy esperando la respuesta?\nHablo como Maxi, en WhatsApp real?\n\n\nSi falla UNA de estas comprobaciones:\nNO envíes todavía.\nCorregí el mensaje primero.\n\n\n</CONTROL_FINAL>');

// Verificaciones: 28 secciones abiertas y cerradas, cola de acciones idéntica.
const tags = (s) => s.match(/<\/?[A-Z_]+>/g) || [];
const abre = tags(t).filter((x) => !x.startsWith('</')).length, cierra = tags(t).filter((x) => x.startsWith('</')).length;
const cola = (s) => s.slice(s.indexOf('</CONTROL_FINAL>'));
if (abre !== 28 || cierra !== 28) throw new Error('etiquetas: ' + abre + '/' + cierra);
if (cola(t) !== cola(base)) throw new Error('la cola de acciones cambió');
fs.writeFileSync(OUT, t, 'utf8');
console.log('OK', base.length, '->', t.length, '(' + (t.length - base.length) + ')', 'sha', sha(t).slice(0, 12), 'secciones', abre + '/' + cierra);
