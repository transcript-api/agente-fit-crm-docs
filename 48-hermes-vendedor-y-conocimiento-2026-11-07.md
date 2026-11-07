# 48 — Hermes vendedor: fuera las derivaciones por reflejo, precios desde la planilla, beneficios con criterio (2026-11-07, noche)

Fuente narrativa de la segunda tanda de cambios del 2026-11-07. Sigue a [[47-hermes-puente-crm-2026-11-07]]. Páginas de wiki: [[hermes-puente-crm]] y [[reglas-recepcion-hermes]].

## Pedido del dueño

- **Vender, no frenar.** Es un agente vendedor. Hay que sacar los protocolos que mandan al cliente a consultar ("no recomendar que vaya al doctor"): la empresa tiene profesionales.
- **Criterio de equipo.** Hablar como alguien que sabe, porque después siguen los vendedores. Dar a entender que es una persona y nunca decir que lo va a pasar con otro vendedor.
- **Pregunta puente.** Dejar siempre una.
- **Escalable**: "mil veces escalable".
- **Precios**: revisar si toma los precios "de la base de datos".
- **Material entregado**:
  - `Hermes_guia_operativa_completa_para_Claude_2026-11-07` (2.560 líneas), leído completo por un agente; las partes de salud y BCAA las leí yo.
  - `Criterio_Santi_completo_para_Claude_2026-11-07` (2.807 líneas). Su módulo comercial es el mismo que el anexo 08 de la guía. Se leyeron además el flujo multiagente y el escalado a varias empresas.

## Qué se encontró

### 1. Por qué Hermes contestaba a la defensiva

No es el puente: son los perfiles A05 y A06 en el contenedor de Hermes (`/opt/data/profiles/<perfil>/SOUL.md`). Se escribieron para un experimento controlado y dicen, entre otras cosas:
- A05: "No hagas diagnóstico profundo, cierres, upsell"; "No confirmes disponibilidad, eficacia, dosis o resultados"; "Nada de… beneficios… inventados".
- A06: solo `commercial_facts` certifican "beneficios ni eficacia".

Como nadie les daba beneficios aprobados, cualquier explicación de un producto quedaba sin fuente. La salida "segura" era desaconsejar. La guía (anexo 04) llega a la misma conclusión y propone el criterio contextual que se aplicó.

### 2. Precios

- **De dónde salen**: Hermes usa `facts.json`, copia del índice aprobado del 21 al 23/10.
- **Comparación** con la planilla de precios del 2/11 (`artefactos/catalogo-copiloto/*.csv`): **todos los precios coinciden** (creatinas, proteínas, kits, Testo, VORA).
- **No hay base de datos viva conectada**:
  - `/product` del CRM está vacío;
  - la guía nombra "Supabase/planilla", pero no hay acceso ni credenciales en este proyecto.
- **Lo que no tenía**:
  - Testo 2 por $1.650;
  - la creatina XTR 650 g ($1.490, del anuncio, sin precio normal confirmado);
  - el modo de uso.

## Qué se cambió (en vivo desde las 20:40 UTC)

1. **Precios leídos directo de la planilla.**
   - El puente carga las 4 planillas CSV desde `/etc/fitbrain-bridge/catalogo/` (28 filas), solo las marcadas "Confirmado" o "Precio confirmado".
   - Descarta los montos "calculados" o "a confirmar".
   - **Recarga sola** cuando cambia un archivo: para actualizar un precio alcanza con reemplazar el CSV, sin reiniciar.
   - Si un archivo viene roto, sigue con la última versión buena.
2. **Beneficios con criterio de vendedor.** `/etc/fitbrain-bridge/knowledge.json`:
   - beneficios generales de 11 categorías y qué recomendar por objetivo (volumen, definir, fuerza, recién empieza);
   - se dicen en positivo, sin garantizar resultados ni plazos;
   - BCAA: "no son un producto para adelgazar".
   - Es criterio de la empresa a confirmar por el dueño (Q44).
3. **Perfiles A05 y A06 de Hermes.** Se agregó al final de cada `SOUL.md` una "CORRECCIÓN COMERCIAL APROBADA POR EL OPERADOR, 2026-11-07", con el mismo método de correcciones versionadas que ya usaban (la del 21/10). Copias en `SOUL.md.bak20261107`. Dice:
   - **A05 vende y recomienda** una opción principal con su motivo.
   - **Nunca sugiere** médico, nutricionista ni profesional, y no pregunta por salud si el cliente no la mencionó.
   - **A06 marca como error** (DENY): derivar sin riesgo real, desaconsejar sin motivo, dar un precio no pedido, mencionar bots u otro vendedor, o no terminar con una pregunta.
4. **Filtro de salud más fino.** Sigue derivando al equipo cuando hay un riesgo real escrito (reacción, alergia, embarazo, medicación, enfermedad renal o cardíaca) o un pedido de persona. Ya no deriva por:
   - "dolor" muscular común;
   - "urgente" (urgencia de compra);
   - "estafa": la desconfianza es una objeción y se contesta con el local físico.
5. **Pregunta puente obligatoria.** Si la respuesta no tiene "?", el puente pide una corrección con una pregunta útil y la revisa. Si falla, manda la original igual (no bloquea).
6. **Reglas de venta** en `company_policy` (rol + 14 reglas).

## Identidad

Hermes habla como Maxi, una persona del equipo, y nunca menciona bots, agentes ni pases a otro vendedor. Se mantuvo una sola excepción: **si el cliente pregunta en serio y directo si habla con un bot, no miente**. La guía (T07) pide lo mismo.

## Escalable

Lo que hace falta para sumar otra empresa (MAX, FrontPet) es una config propia, que hoy está en `/etc/fitbrain-bridge/config.json`. Lleva:
- su `company_policy` (voz, marcas, reglas);
- su carpeta de planillas;
- su `knowledge.json`;
- sus columnas y filas del CRM.

El código no cambia. Cada empresa corre como su propio servicio, sin compartir clientes, precios ni claves (guía: capas A–F del flujo multiagente). Las garantías que no dependen del modelo están en código, no en el prompt: no repetir envíos, revisar antes de enviar, recarga segura.

## Pendientes

- **Q44**: que el dueño confirme o corrija `knowledge.json`, el costo de envío y los productos sin precio (XTR 650 g, isolada Integralmédica).
- **Q46**: la guía desaconseja mover columnas "por cantidad de turnos" (red flag 18). Hoy se mueve tras la 2ª respuesta porque el dueño lo pidió (ver Q43).
