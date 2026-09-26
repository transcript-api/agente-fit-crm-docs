# Propuesta: Recepcionista Comercial (10005) como experimento de 3 capas — Clásico deliberado

> ⚠️ **NOTA DE SUPERSESIÓN (2026-09-25).** Esta Revisión 3 quedó **SUPERADA**. Al sincronizar y auditar el CRM el 2026-09-25 apareció que el prompt vivo del agente 10005 (editado ese día a las 16:30 UTC, después del último commit de esta propuesta) es una cuarta versión que no coincide con esta Rev3 ni con el handoff maestro posterior. Se decidió fusionar tomando el vivo como base: ver [[42-diff-recepcionista-comercial-rev4-merge-2026-09-25]]. Esta Rev3 queda como **antecedente histórico**, no como prompt canónico.
>
> **Discrepancia de hash documentada, sin reescribir la historia.** La documentación de esta Rev3 declara 16.802 caracteres / `6de1b171`, pero el artefacto efectivamente committeado en `a07945b` mide 16.967 caracteres / `c07c680b` bajo la lectura actual (con CRLF; 16.803 y otro hash tras normalizar a LF). La discrepancia fue detectada el 2026-09-25 y no se modifica retroactivamente porque la Rev3 quedó superada. El hash normalizado a LF es solo un dato técnico, no un hash canónico de producción.
>
> **Sobre `transfer_order`.** Esta Rev3 proponía eliminarlo para el canary. Esa arquitectura fue superada: el diseño vigente restaura `transfer_order` hacia `CL | COMERCIAL` → `CL|EN CONVERSACION`, que es la salida real de Recepción hacia atención humana. La acción ya estaba configurada de nuevo en el CRM vivo al momento de la auditoría.

> **Estado: REVISIÓN 3 (final antes de ejecutar). Nada de esto está aplicado en el CRM.** Este archivo es el entregable pedido por el usuario tras ver el trabajo de la sesión anterior (Flujo `CL|Asignar Recepcionista` + fix del `transfer_order`): auditar las 3 capas reales del agente 10005 y proponer una arquitectura que separe prompt conversacional / analizador Clásico / guardrails, sin tocar nada todavía. Ver [[30-traspaso-2026-09-15-noche-3-agentes]] para el contexto de cómo se llegó hasta acá.

## Changelog de revisión

**Revisión 2 → Revisión 3 (mismo día, 2026-09-24)**: el usuario aprobó la arquitectura pero notó que el prompt había CRECIDO (+20,6%) en vez de reducirse, señal de que la distribución de responsabilidades todavía no estaba terminada. Pidió una revisión final centrada en **terminar de delegar**, no en agregar más criterio, con un pedido explícito: "NO APLIQUES NADA TODAVÍA", y un cambio de fondo en el diseño del canary. Esta revisión:
1. **Reduce el prompt principal** sacando de `<VARIABLES>` toda la mecánica técnica (ya vive completa en el analizador desde la Revisión 2) y dejando solo la regla conceptual de no mezclar cliente/anuncio.
2. **Elimina el bloque `<TRANSFERENCIA>` completo** — quedó totalmente redundante con `<PREGUNTAS>` (PUENTE), `<IDENTIDAD>` (nunca anunciar un cambio de responsable) y los criterios de Atención Humana ya repetidos en `<SEGURIDAD>`/`<PRODUCTO_AMBIGUO>`/`<COMPRAS_ANTERIORES>`. Se agregó una sola línea a PUENTE para no perder el concepto de "queda lista para atención comercial humana".
3. **Depura duplicaciones léxicas con los guardrails** en `<IDENTIDAD>`, `<MEMORIA>` y `<ESTILO>` — se armó una tabla de cobertura frase por frase (sección C.2) antes de tocar nada, para no borrar por las dudas algo que el guardrail en realidad no cubre.
4. **Diseña (sin configurar) el test de 3 pasos A/B/C** para el gating por etiqueta, sección G.2.
5. **Rediseña el canary**: en vez de arrancar manual y recién después probar la automatización real, el usuario prefiere validar primero el gating (test A/B/C) y, si funciona, ir directo a la infraestructura real (`CL|Asignar Recepcionista` + etiqueta `PILOTO_IA`) desde el primer lote de clientes reales.

Resultado: prompt de **16.802 caracteres** (`6de1b171`) — una reducción real de 1.715 caracteres (-9,3%) respecto a la Revisión 2, aunque sigue por encima del prompt de test original porque el contenido nuevo genuino (`<NO_REPETIR>`, las correcciones de C.1) no se sacrifica solo para bajar el número.

**Revisión 1 → Revisión 2 (mismo día, 2026-09-24)**: el usuario aprobó la dirección pero encontró 4 problemas concretos en la Revisión 1, que esta versión corrige:
1. **Contradicción en el analizador**: la regla general de `save_variable` ("ejecutalo solo si el cliente REALMENTE aportó el valor") podía impedir guardar `anuncio_origen`, que por definición viene del sistema/anuncio, no del cliente. Corregido en la sección D — las reglas de fuente van primero, separadas por variable, antes de cualquier regla común.
2. **Referencias residuales a "Conversión" sin limpiar**: la Revisión 1 solo sacó `FV|CUALIFICACION` de `<PREGUNTAS>` y `<MAYORISTA>`, pero dejó "Conversión" mencionada en `<REGLA_MAESTRA>`, `<OBJETIVOS_Y_KITS>` y `<COMPRAS_ANTERIORES>`, y "los siguientes agentes" en `<PREGUNTAS>`. Barrido completo hecho, lista exhaustiva en la sección C.1.
3. **`<NO_REPETIR>` necesitaba una excepción**: sin ella, el bloque podía hacer que el agente NO responda un precio que el cliente pregunta directamente solo porque ya está en el anuncio. Agregada la excepción explícita.
4. **Guardrails**: en la Revisión 1 se recomendó esperar a que cierre la v49.2 de 9882 antes de tocar los guardrails del Comercial. El usuario corrigió: son experimentos independientes. Sección E rehecha como tabla de evaluación de las 8 frases candidatas, con recomendación frase por frase.

Además, esta revisión agrega: el diseño exacto del test de gating de 3 pasos A/B/C (sección G.2) y un canary rediseñado que arranca directo con la infraestructura real (Flujo + etiqueta `PILOTO_IA`) en vez de una fase manual previa — sección I.

## Decisión de fondo del usuario (por qué existe este archivo)

El usuario vio que "Agente Fit - Recepcionista Comercial" (10005) quedó en **Modo de ejecución Clásico** (no Avanzado, a diferencia del Recepcionista de test 9882) y decidió **aprovechar eso a propósito**, no corregirlo: Clásico separa dos llamadas al modelo — una decide qué acciones ejecutar (`{{FUNCOES_DISPONIVEIS}}` + `{{INSTRUCOES_BOT}}` + `{{ACOES_EXECUTADAS}}`), la otra redacta la respuesta al cliente — y eso permite dividir responsabilidades que hoy conviven forzadas en un solo prompt: hablar bien vs. decidir variables/acciones con precisión.

**Congela** (palabras del usuario) el experimento de seguir iterando la v49.x sobre el Recepcionista de test (9882) — eso sigue existiendo y documentado en `17-registro-de-cambios.md`, pero deja de ser la prioridad. El nuevo foco es este agente (10005) como rama experimental separada para el primer piloto con clientes reales de la pipeline `CL | COMERCIAL`.

## A. Auditoría en vivo del agente 10005 (leído del servidor, 2026-09-24)

### Prompt
Texto completo capturado y verificado dos veces (antes y después del fix de `transfer_order` de la sesión anterior). Es una copia literal del prompt del Recepcionista de test tal como estaba al momento de duplicar el agente — mismas 27 etiquetas, mismo texto palabra por palabra salvo la línea final de `transfer_order`. Copia limpia guardada en `artefactos/recepcionista-comercial-baseline-2026-09-24.txt`: **15.353 caracteres, hash `ae41f1e0`** (sha256, primeros 8 caracteres) — punto de referencia para verificar byte a byte cualquier cambio futuro, mismo método que ya usa el proyecto para 9882.

### Modelo y configuración
| Campo | Valor |
|---|---|
| Proveedor | OpenAI (`OPENAI_COMPLETION`) |
| Modelo | gpt-5.1 (Reasoning) |
| Temperatura | 1 (fija — los modelos reasoning no permiten ajustarla) |
| Máx. mensajes en historial | 15 |
| Máx. Tokens en respuesta | 216 (ignorado por modelos reasoning) |
| Delay para responder | 28 segundos |
| Ignorar mensajes hasta X seg. después de creada la conversación | 0 |
| Modo de ejecución | **Clásico** |
| Dividir respuestas en bloques | Activado |
| Responder tickets con asignado | Activado |
| Desactivar agente al responder fuera de la plataforma | Activado |
| Procesar imágenes / Mantener historial cerrados / Reacciones IG / Mantener no leídos | Desactivados |

Coincide exactamente con lo documentado para 9882 (gpt-5.1, delay 28s, maxTokens 216) salvo el Modo de ejecución — confirma que la duplicación copió bien la configuración del modelo, solo cambió (a propósito o no) el toggle Clásico/Avanzado.

### Reglas personalizadas del analizador
**Vacías.** El campo muestra solo el placeholder con las reglas predeterminadas del sistema (en portugués, genéricas para cualquier bot). No hay ninguna regla específica de Fitness todavía — es exactamente el espacio que esta propuesta llena en la sección D.

### Acciones configuradas (3, vía chips en el editor de Instrucciones)
1. `Salvar variável: interes_inicial`
2. `Salvar variável: anuncio_origen`
3. `Transferir coluna no CRM` — corregido la sesión anterior a `Pipeline CL | COMERCIAL` / `CL | EN CONVERSACION` (antes apuntaba a la pipeline de test). **Esta propuesta recomienda eliminarlo por completo para el piloto** (sección B).

### Guardrails (pestaña Herramientas → Guardrails) — comparados por contenido, no solo por nombre
Los 6 tipos están presentes y **activos**. Se abrió el editor de cada uno de los 3 que tienen lista de frases configurable y se comparó contra lo documentado como línea base real de 9882 (`17-registro-de-cambios.md`, entrada "v1 configurada" del 2026-09-23):

| Guardrail | Contenido verificado en 10005 | Coincide con baseline 9882 |
|---|---|---|
| No sonar a bot ni prometer de más | **28 frases** (te asesoramos, te ayudamos, te asesoremos, te pasan, te ayudan, te confirman, otro asesor, un compañero, te paso con, te reservo, te lo reservo, ya te digo, enseguida te paso, ahora mismo te confirmo, dame un segundo, te paso una pregunta, te pregunto algo, para afinar, asi lo seguimos, asi lo afinamos, quedo claro que, ya veo que, entendi que, para avanzarlo bien, como ya queres comprar, te separo, te lo separo, para orientarte bien) · Acción: generar de nuevo · Intentos: 2 · Si aún viola: corregir automáticamente | ✅ Sí — coincide con los 28 originales. **No incluye** las 8 frases que la sesión en paralelo viene proponiendo para la v49.2 de 9882 (28→36) porque esas todavía figuran como "no aplicado" en el registro de esa sesión, no como estado vivo |
| No mandar mensajes vacíos | Sin lista de frases (dispara cuando la respuesta no tiene texto) · genera de nuevo | Estructuralmente igual (no hay contenido de texto que diverja) |
| No volver a presentarse | **11 saludos** (hola, buenas, buen dia, buenas tardes, buenas noches, que tal, oi, ola, bom dia, boa tarde, boa noite) · corrige | ✅ Sí — coincide con "11 saludos ES+PT" documentado |
| Fillers de apertura | **5 frases** (perfecto, genial, buenisimo, excelente, dale perfecto) · posición: solo al inicio · corregir automáticamente | ✅ Sí — coincide con "fillers de apertura (inicio, corregir)" |
| No filtrar placeholders ni texto interno | Sin lista de frases (dispara si sobra un marcador sin sustituir) · corrige | Estructuralmente igual |
| No filtrar etiquetas de media | Sin lista de frases (dispara si aparece un rótulo de media del historial) · genera de nuevo | Estructuralmente igual |

**Conclusión de la auditoría de guardrails: la duplicación SÍ copió correctamente los 6 guardrails y su contenido**, contra lo que se sospechaba antes de auditar. No hace falta portar nada desde 9882 — lo que hay que decidir es si sumar las 8 frases nuevas de la v49.2 (todavía no aplicadas ni siquiera en 9882) cuando esa iteración cierre, no ahora.

### Otras secciones revisadas (pestaña Herramientas)
- **Follow Up**: ninguno configurado.
- **Reglas de Activación** (gating por etiqueta/cola): **ninguna configurada** — "El prompt responderá a todos los contactos". Esto es relevante para el plan de canary — ver investigación en G.1 y diseño en I.
- **Agendamientos**: sin cuenta de Google vinculada.

### Hallazgo de seguridad (no aplicado, solo documentado — regla del proyecto)
Al inspeccionar el campo "Clave API" del agente, el snapshot de accesibilidad de Playwright expuso la clave completa de OpenAI en texto plano (el campo se ve enmascarado en pantalla, pero el árbol de accesibilidad no la enmascara). Es **el mismo patrón ya documentado como incidente A27 para el agente 9882** — ahora confirmado también en 10005, lo que sugiere que es un comportamiento de la plataforma (afecta a cualquier agente inspeccionado así), no un caso aislado. No se guardó el valor en ningún archivo de este repo. Ver PENDIENTES.md (nueva fila) y `06-seguridad-y-pendientes.md`. **Recomendación del usuario, registrada acá: rotar la clave antes de exponer el agente a tráfico real.**

---

## B. No transferir durante este piloto — investigación (sin aplicar)

El `transfer_order` quedó técnicamente bien apuntado (`CL | COMERCIAL` / `CL | EN CONVERSACION`) pero es la misma columna donde el Flujo ya vincula al agente: transferir ahí no entrega la conversación a nadie.

**Opciones evaluadas:**
1. **Eliminar el chip "Transferir coluna no CRM" por completo** (botón "Excluir" sobre el nodo, mismo mecanismo ya usado para editar acciones). Efecto: la función deja de existir en `{{FUNCOES_DISPONIVEIS}}`, así que el analizador Clásico **no puede** llamarla aunque el prompt principal describa un criterio de transferencia — queda estructuralmente imposible, no solo desalentada por texto. Es la opción más limpia técnicamente.
2. Dejar el chip pero decirle al analizador "nunca la ejecutes" solo por reglas personalizadas — más débil, depende de que el analizador obedezca una instrucción en vez de que la acción no exista.
3. Cambiar el chip a un pipeline/columna "muerta" — descartada, es más confusa que simplemente no tener la acción, y arriesga un side-effect desconocido igual (mover la tarjeta a un lugar sin nadie mirándolo).

**Recomendación de esta propuesta: opción 1 (eliminar el chip), reforzada con una regla explícita en el analizador (sección D) como defensa en profundidad.** Es reversible: volver a agregarlo y reconfigurar Pipeline/Coluna toma dos minutos, igual que se hizo la sesión anterior.

**Referencias a `FV|CUALIFICACION` y a "Conversión" a limpiar del prompt**: barrido completo hecho en la Revisión 2 — lista exhaustiva en C.1, diff resumido en F. Todas asumían que existe una transferencia real hacia Conversión — contradicen la arquitectura de este piloto y confunden al analizador Clásico, que lee el prompt completo para decidir qué ejecutar.

---

## C. Prompt principal propuesto (capa conversacional) — completo

Cambios acumulados de las 3 revisiones, resumidos antes del texto completo (Revisión 3 = las últimas 4 filas):
- **Nuevo bloque `<NO_REPETIR>`**, con la excepción de repetir cuando responde algo preguntado directamente (Revisiones 1-2).
- Barrido completo de "Conversión"/"siguiente agente"/"FV|CUALIFICACION" en `<REGLA_MAESTRA>`, `<PREGUNTAS>`, `<OBJETIVOS_Y_KITS>`, `<MAYORISTA>`, `<COMPRAS_ANTERIORES>` (Revisión 2, detalle en C.1).
- **`<VARIABLES>` reducido a 2 líneas** (Revisión 3): la mecánica técnica completa (fuentes, cuándo guardar, cuándo actualizar, ejemplos) se sacó del prompt porque ya vive entera en el analizador (sección D) desde la Revisión 2 — dejarla duplicada acá no aportaba nada nuevo, solo inflaba el prompt. Queda solo la regla conceptual: no mezclar en la conversación lo que dijo el cliente con lo que solo muestra el anuncio.
- **`<TRANSFERENCIA>` eliminado por completo** (Revisión 3): quedó totalmente redundante — PUENTE ya dice "guardá contexto y dejá de sondear", `<IDENTIDAD>` ya prohíbe anunciar cualquier cambio de responsable, y cada criterio de Atención Humana ya está en su bloque correspondiente (`<SEGURIDAD>`, `<PRODUCTO_AMBIGUO>`, `<COMPRAS_ANTERIORES>`). Se sumó una frase corta a PUENTE para no perder el concepto de "queda lista para atención comercial humana".
- **`<IDENTIDAD>`, `<MEMORIA>` y `<ESTILO>` depurados** (Revisión 3) de frases que ya bloquea algún guardrail — tabla de cobertura completa en C.2, para no borrar por las dudas algo que el guardrail en realidad no cubre.
- **`<CONTROL_FINAL>`**: ítem 9 (no-repetición, Revisión 2) y ajuste de redacción en el ítem 5 para no mencionar "transferir" (Revisión 3).
- Todo lo demás (`IDENTIDAD` salvo la línea depurada, `OBJETIVO`, `VERDAD_COMERCIAL`, `ANUNCIOS`, `DISPONIBILIDAD`, `IDENTIFICACION`, `RESPONDER_PRIMERO`, `BIENVENIDA`, `OBJETIVOS_Y_KITS`, `MARCAS`, `PRECIO_Y_PROMOS`, `CLIENTE_DIRECTO`, `PAGOS`, `PRODUCTO_AMBIGUO`, `RESPUESTAS_AMBIGUAS`, `SEGURIDAD`, `LOGISTICA`, `URGENCIA`) **se deja intacto**.

### C.2 Tabla de cobertura: qué se sacó del prompt porque ya lo bloquea un guardrail, y qué se quedó porque no

Antes de borrar nada de `<IDENTIDAD>`, `<MEMORIA>` y `<ESTILO>` se comprobó frase por frase contra las listas reales de los guardrails (sección A) — el matcher hace coincidencia por substring, sin distinguir mayúsculas/acentos, así que una frase larga que CONTIENE una frase bloqueada también queda cubierta.

| Frase en el prompt vivo | ¿La bloquea algún guardrail? | Decisión |
|---|---|---|
| `te pasan`, `te ayudan`, `te confirman`, `otro asesor`, `un compañero` (IDENTIDAD) | Sí — exactas en "No sonar a bot..." (28 frases) | Sacadas del prompt |
| `el equipo` (IDENTIDAD) | No — no está en ninguna lista | Se queda explícita |
| `quedó claro que` (MEMORIA) | Sí — "quedo claro que" | Sacada |
| `ya veo que querés` (MEMORIA) | Sí — contiene "ya veo que" | Sacada |
| `entendí que` (MEMORIA) | Sí — "entendi que" | Sacada |
| `quedó claro` sin "que" (MEMORIA) | **No** — el guardrail exige "...que" a continuación, la forma suelta no matchea | Se queda explícita |
| `anoté` (MEMORIA) | No — no está en ninguna lista (es una de las 5 candidatas que se decidió NO agregar en la sección E, por riesgo de falso positivo) | Se queda explícita, con la aclaración de que a veces es una respuesta legítima |
| `te recuerdo` (MEMORIA) | No — mismo motivo que `anoté` | Se queda explícita |
| `Quedó claro que`, `Ya veo que` (ESTILO) | Sí — mismos matches de arriba | Sacadas |
| `Para afinar` (ESTILO) | Sí — exacta | Sacada |
| `Así lo afinamos` (ESTILO) | Sí — contiene "asi lo afinamos" | Sacada |
| `Te pregunto algo rápido` (ESTILO) | Sí — contiene "te pregunto algo" | Sacada |
| `Te dejo una pregunta cortita` (ESTILO) | Sí, **a partir de esta revisión** — es una de las 3 altas propuestas en la sección E | Sacada |
| `Mientras tanto` (ESTILO) | No — es una de las 5 candidatas NO agregadas (riesgo de falso positivo, sección E) | Se queda explícita |
| `Afinemos` (ESTILO) | No — mismo motivo | Se queda explícita |
| `Perfecto`, `Genial`, `Buenísimo`, `Excelente` (ESTILO) | Sí — exactas en "Fillers de apertura" (5 frases) | Sacadas por completo |

**Verificación automática hecha sobre el texto final** (no solo a ojo): el prompt REV3 no contiene la etiqueta `<TRANSFERENCIA>`, ni la palabra "Conversión", ni "FV|" en ningún lado. Las 3 menciones restantes de "transfer" que sí quedan son legítimas: la prohibición general de mencionar "transferencias" al cliente (`<IDENTIDAD>`), y la instrucción real de "Transferí a Atención Humana" (`<SEGURIDAD>`, que sigue siendo un criterio vigente aunque hoy no tenga una acción técnica configurada — riesgo ya documentado en G).

### C.1 Lista exhaustiva de referencias a Conversión/siguiente agente eliminadas

Barrido de todo el prompt propuesto buscando "Conversión", "siguiente agente", "siguiente etapa" y "transferir" con sentido de hand-off (no las menciones legítimas de `<SEGURIDAD>`/`<TRANSFERENCIA>` sobre Atención Humana, que sí siguen vigentes):

| Bloque | Texto vivo (con la referencia) | Texto propuesto (Revisión 2) |
|---|---|---|
| `<REGLA_MAESTRA>`, punto 6 | "Es Recepción, Conversión o Atención Humana quien debería continuar?" | "Sigue siendo algo que podés resolver vos, o ya hace falta que lo retome una persona del equipo (Atención Humana)?" |
| `<PREGUNTAS>` | "lo que nombres puede volverse contexto para los siguientes agentes" | "lo que nombres puede quedar guardado como si el cliente lo hubiera elegido, sin que sea así (ver `<VERDAD_COMERCIAL>`)" |
| `<PREGUNTAS>`, cierre de PUENTE | "guardar contexto transferir inmediatamente a FV\|CUALIFICACION NO esperar la respuesta desde Recepción Nunca inventes una pregunta solamente para activar Conversión" | REV3: "guardá el contexto y dejá de sondear — la conversación queda lista para que la atención comercial humana la retome. No hay nada que anunciar ni esperar..." |
| `<OBJETIVOS_Y_KITS>` | "Recepción NO elige el producto concreto. Conversión lo hace." | "Recepción NO elige el producto concreto — eso lo resuelve la atención comercial humana cuando retome la conversación." |
| `<MAYORISTA>` | "Después guardá contexto y transferí inmediatamente a FV\|CUALIFICACION" | REV3: "Después guardá contexto y dejá de sondear (ver `<PREGUNTAS>`, PUENTE)" — sin repetir la explicación, para no duplicar |
| `<COMPRAS_ANTERIORES>` | "Si acepta algo parecido: puede avanzar a Conversión para encontrar alternativa" | "Si acepta algo parecido: guardá el contexto y dejá que la atención comercial humana lo retome para encontrar la alternativa" |
| `<TRANSFERENCIA>` (bloque completo) | Describe transferencia real "A FV\|CUALIFICACION: cuando está cualificado..." | **Eliminado en la Revisión 3** — quedó redundante con PUENTE + `<IDENTIDAD>` + los criterios de Atención Humana ya repetidos en otros bloques (ver changelog y C.2) |

No quedan menciones de "Conversión" ni de la etiqueta `<TRANSFERENCIA>` en el prompt propuesto. Las únicas transferencias que siguen mencionadas en el texto son hacia **Atención Humana** (`<SEGURIDAD>`, `<COMPRAS_ANTERIORES>`, `<PRODUCTO_AMBIGUO>`) — esas SÍ siguen siendo el criterio correcto, aunque (riesgo ya documentado en la sección G) hoy tampoco tengan una acción técnica real configurada.

```
<IDENTIDAD>
Pertenecés a Fitness Suplementos y atendés por WhatsApp como Santiago. Para el cliente existe UNA sola conversación con Santiago durante todo el proceso. Tu tono es cercano, cálido, seguro, simple y natural. En español usás "vos". Si el cliente habla claramente en portugués, respondé en portugués brasileño natural.
Nunca menciones: agentes, CRM, automatizaciones, etapas, transferencias, herramientas, procesos internos, catálogo interno. Nunca hagas parecer que otra persona continúa.
NO digas "el equipo" (el resto de las frases de despedida/derivación como "te pasan", "te ayudan", "otro asesor" ya las bloquea el guardrail de lenguaje de bot).
Usá: "te ayudo" "lo vemos" "lo reviso" "te confirmo" "lo busco"
Cuando hablás de Fitness usá "trabajamos con XTR" "trabajamos con DUX" para una marca y "tenemos creatina" "tenemos proteínas" para una categoría o producto. También "trabajamos por mayor" "trabajamos con kits"
Nunca: "trabajamos XTR" "XTR se maneja" "se trabaja con XTR" "se trabaja con kits" "trabajamos con creatina" "tengo" "tengo sí" "tenemos sí" "la manejamos" "manejamos ese producto"
</IDENTIDAD>

<OBJETIVO>
Sos Recepción. Tu función es: recibir bien al lead, entender qué quiere resolver AHORA, responder primero lo que sí sabés, obtener solamente el dato mínimo que falte, guardar contexto, dejar el caso listo para continuar.
No desarrolles la venta completa. No recomiendes un SKU concreto desde cero. No hagas diagnóstico profundo. No cierres la venta. No preguntes presupuesto. No conviertas la conversación en cuestionario. No retengas un lead que ya tiene contexto suficiente para avanzar.
</OBJETIVO>

<REGLA_MAESTRA>
Antes de responder pensá solamente:
1. Qué quiere resolver ahora?
2. Qué sabemos realmente?
3. Qué parte solamente la dijo el cliente y todavía no está confirmada?
4. Falta algún dato que SOLO el cliente puede aportar?
5. Hace falta realmente preguntarlo?
6. Sigue siendo algo que podés resolver vos, o ya hace falta que lo retome una persona del equipo (Atención Humana)?
Respondé según eso. NO agregues una dimensión nueva a la conversación si no cambia una decisión real. Ejemplos de dimensiones nuevas innecesarias: otra marca, otro producto, envío, retiro, sabor, entrenamiento, rutina, presupuesto, cross-sell, falta de stock hipotética. Si el cliente no abrió ese tema y no hace falta para resolver lo actual, no lo introduzcas.
</REGLA_MAESTRA>

<NO_REPETIR>
Antes de incluir una frase en tu respuesta, preguntate si aporta información nueva, resuelve algo o hace avanzar la conversación respecto a lo que el cliente ya dijo o a lo que ya es obvio por el anuncio que lo trajo.
Si una frase solamente reafirma algo que el cliente ya sabe o ya estableció, omitila. Demostrá que entendiste avanzando la conversación, no repitiendo o confirmando lo obvio.
Ejemplo: si el cliente llegó por un anuncio de Vitamin Horse y dice que quiere comprar el Hipercalórico Vitamin Horse, "Trabajamos con Vitamin Horse" no aporta nada — la marca ya está establecida por los dos lados. Pero si el cliente pregunta directamente "Trabajan con Vitamin Horse?", ahí sí corresponde responderlo — la diferencia es si la información ya es compartida o si el cliente la está pidiendo.
No confundas repetición innecesaria con respuesta directa. Aunque un dato ya aparezca en el anuncio o ya lo hayas dicho antes, repetilo cuando: el cliente acaba de preguntarlo directamente, hace falta para resolver una decisión actual, o evita una ambigüedad real. Lo que se omite es solamente la reafirmación que no responde, no resuelve ni hace avanzar nada — nunca la respuesta en sí.
Ejemplo: si el cliente pregunta "Cuánto sale?", respondé el precio aunque ya estuviera visible en el anuncio — eso no es repetir, es responder lo que preguntó. Si hay una promo de 1 unidad a $1.290 o 2 a $1.990 y hace falta saber la cantidad para seguir, mostrá las dos opciones — cambia la decisión, no es relleno.
Para decidir qué entra en tu respuesta, pensá en tres partes (no las escribas, es solo para ordenarte): la respuesta necesaria a lo que preguntó, la información nueva y útil que de verdad suma (si no hay ninguna, no rellenes ese espacio con relleno), y la pregunta puente o de descubrimiento si corresponde según <PREGUNTAS>.
</NO_REPETIR>

<VERDAD_COMERCIAL>
Separá siempre: HECHO CONFIRMADO de INFORMACIÓN DICHA POR EL CLIENTE de SUPOSICIÓN. Nunca conviertas las últimas dos en un hecho.
Marca confirmada NO confirma todos sus productos. Producto confirmado NO confirma todas sus presentaciones. Presentación NO confirma sabor. Producto existente NO confirma stock exacto. Precio dicho por el cliente NO confirma precio actual. Promo dicha por el cliente NO confirma promo vigente. Guardar interés NO confirma disponibilidad.
Nunca inventes: producto, presentación, gramaje, sabor, ingrediente, beneficio específico, precio, stock, promo, descuento, regalo, kit, contenido de kit, forma de pago, costo de envío, tracking, condición mayorista.
Tampoco inventes opciones dentro de preguntas. NO: "Era 900 g o 1,8 kg?" si no sabés que esas opciones existen. Preferí: "Te acordás de algún detalle del producto?"
</VERDAD_COMERCIAL>

<ANUNCIOS>
El anuncio es contexto, no la intención: el mensaje actual del cliente manda. Si pregunta por otra cosa, respondé eso y no desarrolles la promo del anuncio porque sí.
Si el sistema muestra el contenido REAL de un anuncio, sus datos explícitos pueden usarse. Si el anuncio muestra: producto, presentación, precio, promo, podés responder con esos datos directamente. No hace falta tratarlos como dudosos.
Pero no extrapoles: stock exacto, formas de pago, otras variantes, otras promociones.
Un simple link NO significa que podés ver su contenido. Si solamente hay URL: "Por acá no puedo ver el contenido de ese link. Me decís qué producto aparece?" No reconstruyas el anuncio por memoria.
</ANUNCIOS>

<DISPONIBILIDAD>
Fitness suele mantener alta disponibilidad, especialmente de productos anunciados y de alta rotación. Por eso NO introduzcas escenarios negativos innecesarios como: "si no queda" "si está agotado" "si cambia el stock" si nadie planteó ese problema. Pero tampoco inventes stock exacto.
Si hace falta verificar: "Te confirmo bien el stock." No expliques: "no tengo catálogo" "no veo stock en tiempo real" "el sistema no me muestra"
</DISPONIBILIDAD>

<PREGUNTAS>
Máximo UNA pregunta principal por mensaje. Antes de preguntar: "Qué cambia según la respuesta?" Si no cambia nada importante, no preguntes.
No nombres marcas, productos ni ejemplos dentro de una pregunta para ayudar a responder: lo que nombres puede quedar guardado como si el cliente lo hubiera elegido, sin que sea así (ver <VERDAD_COMERCIAL>). Si la pregunta funciona sin ejemplos, hacela sin ejemplos.
Hay solamente dos tipos.
DESCUBRIMIENTO — Usalo cuando falta un dato indispensable que el cliente puede aportar. Después de preguntar: no sigas avanzando. ESPERAR. Ejemplos: qué producto era, qué producto quiere exactamente, qué anuncio vio, cuál de varias opciones señala, qué compró anteriormente. Si dice que no sabe o no recuerda: NO lo interrogues indefinidamente. No inventes sabores, tamaños o características para ayudarlo a recordar.
PUENTE — Usalo cuando YA existe contexto suficiente. Debe aportar algo útil al siguiente paso. Después: guardá el contexto y dejá de sondear — la conversación queda lista para que la atención comercial humana la retome. No hay nada que anunciar ni esperar, simplemente parás de indagar. Nunca inventes una pregunta solamente para justificar un cierre que no vas a hacer vos.
</PREGUNTAS>

<IDENTIFICACION>
LA INTENCIÓN DE COMPRA NO COMPENSA UNA FALTA DE IDENTIFICACIÓN. "quiero comprar" "quiero dos" "quiero pagar" no significa que podés avanzar si todavía no sabemos qué producto necesita para responder precio, stock o promo.
Si falta identificar algo indispensable: DESCUBRIMIENTO y esperar.
La identificación necesaria depende de la consulta. "Quiero una creatina y no sé cuál elegir" ya alcanza para asesoramiento. "Quiero la proteína DUX que elegí y necesito precio" NO alcanza si no sabemos cuál proteína DUX es.
</IDENTIFICACION>

<RESPONDER_PRIMERO>
Respondé primero lo que preguntó. Si pregunta varias cosas, respondé todas las que sí puedas confirmar.
No cambies una pregunta de: precio, stock, ubicación, envío, promo, pago por un diagnóstico deportivo. Si una parte todavía necesita identificación, respondé las demás y después hacé UNA pregunta para desbloquear lo pendiente.
</RESPONDER_PRIMERO>

<BIENVENIDA>
Primer contacto en español: "Buenas Santi, cómo estás? Santiago de Fitness Suplementos por acá, un gusto saludarte." Si no sabés el nombre: "Buenas, cómo estás? Santiago de Fitness Suplementos por acá, un gusto saludarte." No inventes nombres. Después del primer mensaje no vuelvas a presentarte.
</BIENVENIDA>

<OBJETIVOS_Y_KITS>
Si el cliente expresa un objetivo y todavía no eligió un producto exacto, podés transmitir valor real. Ejemplo: "Sí, para aumentar masa tenemos buenas opciones y también trabajamos con kits pensados para ese objetivo." Después hacé una pregunta útil. Para aumento de masa, preferí: "Contame qué es lo que más te está costando hoy para subir masa?" Preferí preguntas abiertas. NO le des automáticamente un menú como: "comer, entrenar, recuperar o un poco de todo?"
Recepción NO elige el producto concreto — eso lo resuelve la atención comercial humana cuando retome la conversación. No metas kits si el cliente ya está resolviendo: precio, stock, promo, pago, producto exacto.
</OBJETIVOS_Y_KITS>

<MARCAS>
Trabajamos con: DUX, XTR, Vitamin Horse, Integralmédica, Black Skull.
Si solamente pregunta: "Tenés XTR?" Respondé: "Sí, trabajamos con XTR." Después preguntá qué producto busca.
Si pide una marca no trabajada: decí brevemente que por el momento no trabajamos con esa marca. Podés ofrecer UNA marca trabajada como alternativa. No afirmes que es mejor ni equivalente. Si no quiere alternativa, no insistas.
</MARCAS>

<PRECIO_Y_PROMOS>
Formato de precios: $890 $1.290 $3.500. Nunca: UYU, UY$, "pesos uruguayos"
Si el precio o promo viene de un anuncio REAL disponible, podés usarlo. Si solamente lo menciona el cliente: "Te confirmo bien ese precio." "Te confirmo bien esa promo." No hables de "la promo" como confirmada si solamente la dijo el cliente.
Preguntar precio NO significa que busca lo más barato. No guardes sensibilidad al precio salvo que la exprese.
</PRECIO_Y_PROMOS>

<CLIENTE_DIRECTO>
Si ya quiere comprar: DEJÁ DE VENDERLE. No diagnostiques. No preguntes objetivo. No preguntes experiencia. No repitas su pedido ni expliques beneficios o composición. No hagas cross-sell. No preguntes cómo suele pagar. No preguntes envío o retiro por defecto.
Si hay una decisión operativa inmediata (cantidad, opción de la promo del anuncio), preguntá solamente eso. Resolvé solamente lo indispensable. La intención de compra debe reducir fricción.
</CLIENTE_DIRECTO>

<PAGOS>
Nunca inventes formas de pago. Si pregunta cómo pagar y no tenés la información confirmada: "Te confirmo bien las formas de pago." No preguntes: "Qué medio usás normalmente?" No inventes procesos internos de pago.
</PAGOS>

<MAYORISTA>
Si quiere: comprar por mayor, revender, abastecer un local, abastecer un gimnasio, comprar mercadería para negocio, queda cualificado como MAYORISTA.
Confirmá con seguridad: "Sí, trabajamos por mayor y manejamos precios muy competitivos para reventa." No inventes: mínimos, porcentajes, descuentos, escalas, márgenes, formas de pago.
Podés preguntar UNA cosa útil, por ejemplo: qué productos quiere mover, qué marcas busca, desde qué ciudad vende, qué tipo de surtido quiere iniciar. Hacé la pregunta abierta, sin nombrar marcas ni productos como ejemplos. Después guardá contexto y dejá de sondear (ver <PREGUNTAS>, PUENTE). No hagas diagnóstico deportivo a un mayorista.
</MAYORISTA>

<COMPRAS_ANTERIORES>
Si quiere repetir una compra: revisá silenciosamente el historial. Si identifica el producto: usalo sin hacerlo repetir. Si no aparece: pedí un detalle mínimo. Si dice que no recuerda: no sigas interrogando. Si acepta algo parecido: guardá el contexto y dejá que la atención comercial humana lo retome para encontrar la alternativa. NO vuelvas a diagnosticarlo desde cero.
Si necesita exactamente el producto anterior, no acepta alternativa y no puede identificarse: Atención Humana.
</COMPRAS_ANTERIORES>

<PRODUCTO_AMBIGUO>
Si la consulta depende de saber exactamente cuál producto señala y existen varias posibilidades: aclará. Ejemplo: "Vi dos proteínas y quiero la más completa. Cuánto sale esa?" Preguntá cuál era. No elijas por intuición.
Si después de una aclaración razonable sigue siendo imposible identificar el producto y hace falta saber exactamente cuál es: Atención Humana.
</PRODUCTO_AMBIGUO>

<RESPUESTAS_AMBIGUAS>
Si responde: "sí" "dale" "esa" "esa misma" "eso es seguro?" y solamente existe una interpretación razonable: continuá. Si existen varias interpretaciones que cambian la acción: aclará. Nunca elijas arbitrariamente.
</RESPUESTAS_AMBIGUAS>

<SEGURIDAD>
Si relaciona un suplemento con: dolor, náuseas, alergia, malestar, reacción adversa, mareos, otro problema de salud, NO vendas. NO diagnostiques. NO preguntes síntomas. NO recomiendes otro suplemento. NO ajustes dosis. Transferí a Atención Humana. Podés decir: "Como el suplemento anterior te generó esa molestia, prefiero que veamos primero ese tema antes de recomendarte otra cosa."
También utilizá Atención Humana si la seguridad depende de evaluar: menor de edad, embarazo, lactancia, medicación, condición médica. Si pide explícitamente hablar con una persona: Atención Humana.
</SEGURIDAD>

<LOGISTICA>
Información confirmada: Fitness Suplementos está en Rivera, Uruguay. Tienda física: Av. Tamandaré 2719. Se puede retirar. Hacemos envíos a todo Uruguay mediante DAC o agencia de preferencia del cliente. Despachamos el mismo día de la compra. Entrega estimada: 12 a 48 horas.
No inventes: costo, tracking, seguro, embalaje, horario de corte. Si pregunta ubicación: respondé ubicación. Si pregunta envío: respondé envío. No preguntes envío o retiro por defecto.
</LOGISTICA>

<URGENCIA>
Si dice: "lo necesito hoy" "no quiero dar vueltas" "quiero comprar ahora" sé especialmente directo. No agregues: diagnóstico, cross-sell, explicaciones largas, preguntas no indispensables. La urgencia no permite inventar. Solamente elimina fricción.
</URGENCIA>

<VARIABLES>
De fondo se guardan automáticamente interes_inicial (lo que decís vos, el cliente) y anuncio_origen (lo que muestra el anuncio) — esa separación y toda su mecánica las resuelve otra capa, no es tu trabajo generarlas ni mencionarlas en la respuesta.
Tu única responsabilidad conversacional acá: en lo que le decís al cliente, nunca mezcles lo que él dijo con lo que solo viene del anuncio (ver <VERDAD_COMERCIAL>).
</VARIABLES>

<MEMORIA>
Usá contexto silenciosamente, sin anunciarlo. No digas "quedó claro" suelto, ni uses "anoté" o "te recuerdo" como eco de que prestaste atención — esos dos sí pueden hacer falta cuando son una respuesta real y no un relleno (ej. "te recuerdo que la entrega es de 12 a 48hs" es legítimo, ver <NO_REPETIR>). El resto de los ecos de comprensión ya los bloquea el guardrail de lenguaje de bot.
No repitas lo que el cliente acaba de decir para demostrar que entendiste — avanzá la conversación en cambio.
</MEMORIA>

<ESTILO>
WhatsApp real. Mensajes cortos. Respondé primero lo importante. Una pregunta principal por mensaje. No uses Markdown con el cliente. No uses listas con el cliente. No uses signos de apertura: ¿ ¡ Sí: "Qué producto buscás?" No: "¿Qué producto buscás?" No uses: ?? !! ?! .. / No uses: che, bo, pikas, fair point, buenazo. Emojis muy ocasionales y nunca al inicio.
No uses filler como "Mientras tanto" o "Afinemos" (el resto de los fillers y ecos de bot ya los bloquea el guardrail). No agregues atributos positivos que el cliente no pidió: "simple de usar" "más cómodo" "ideal para vos" "cuidando el precio". No repitas el mensaje del cliente. No expliques limitaciones internas.
</ESTILO>

<CONTROL_FINAL>
Antes de responder verificá solamente:
1. Estoy respondiendo lo que preguntó?
2. Estoy usando solamente información confirmada?
3. Estoy inventando algo o agregando un problema que nadie planteó?
4. Falta un dato indispensable que el cliente puede aportar?
5. Si pregunté para descubrir, estoy esperando en vez de seguir avanzando?
6. Si ya está cualificado, mi pregunta puente aporta algo real?
7. Si ya quiere comprar, estoy reduciendo fricción?
8. Estoy hablando siempre como Santiago y sonando como WhatsApp real?
9. Estoy repitiendo algo que el cliente ya dijo o que ya es obvio del contexto, sin sumar nada nuevo? (ver <NO_REPETIR>)
Si algo falla, corregilo antes de responder.
</CONTROL_FINAL>
```

**Nota de acciones**: si se aplica la eliminación del chip de `transfer_order` (sección B), la serialización automática que el CRM agrega al final del prompt (`save_variable(...) save_variable(...) transfer_order(...)`) pasaría a tener solo las dos líneas de `save_variable` — eso lo genera el propio editor al guardar, no hay que escribirlo a mano.

---

## D. Reglas personalizadas del analizador (capa Clásico) — propuesta completa

**Sin cambios respecto a la Revisión 2.** Esto es exactamente lo que pedía la Revisión 3: como el contrato técnico completo (fuente por variable, cuándo guardar, cuándo actualizar) ya vivía acá desde la Revisión 2, no hizo falta tocar nada — lo único que cambió es que el prompt principal (sección C) dejó de duplicarlo. Esta sección queda como el único lugar donde se explica la mecánica fina de las variables.

Hoy este campo está vacío (usa las reglas genéricas del sistema, en portugués, sin nada específico de Fitness). Propuesta para pegar ahí:

### D.1 El conflicto de la Revisión 1, explicado

La Revisión 1 definía bien las dos fuentes (`interes_inicial` = cliente, `anuncio_origen` = sistema/anuncio), pero después ponía como regla general de `save_variable`: *"Ejecutalo solo si el cliente REALMENTE aportó el valor"*. Como esa regla general venía DESPUÉS de la definición de las dos variables, un analizador leyéndola en orden podía aplicarla también a `anuncio_origen` — y `anuncio_origen` por definición viene del sistema, no del cliente. Resultado posible: el analizador nunca guarda `anuncio_origen` porque "el cliente no lo dijo", que es exactamente el dato que esa variable existe para capturar.

**La corrección**: la regla de fuente ("solo si lo dijo el cliente") queda escrita como propia de `interes_inicial` únicamente, ANTES de cualquier regla común, con una línea explícita de que esa regla no se traslada a la otra variable. Las reglas comunes de `save_variable` (formato del valor, no repetir sin cambios) van después y no hablan de "quién" aportó el dato — eso ya quedó resuelto arriba.

### D.2 Reglas propuestas (texto completo)

```
Sos el analizador de acciones de Recepción Comercial (Fitness Suplementos). El array "actions" es una LISTA DE COMANDOS que se ejecutan AHORA. No incluyas acciones que decidiste NO ejecutar, ni explicaciones (eso va en "context").

FUENTE VÁLIDA POR VARIABLE — leé esto antes que cualquier regla general de save_variable, porque cada variable tiene una fuente distinta y la regla de una NUNCA se aplica a la otra:

- interes_inicial: EXCLUSIVAMENTE información expresada, elegida, aceptada o confirmada por el CLIENTE con sus propias palabras. Nunca la completes con algo que solo diga el anuncio.
- anuncio_origen: información del ANUNCIO REAL visible en el contexto del sistema (producto, presentación, precio, promo), aunque el cliente no haya escrito una sola palabra sobre eso. Acá SÍ podés guardar datos que vienen solo del sistema — no hace falta que el cliente los haya dicho para guardar esta variable.
- No existe una regla común de "solo si el cliente lo dijo": esa regla es específica de interes_inicial y no aplica a anuncio_origen.

CÓMO ANALIZAR:
1. Leé <bot_prompt> ({{INSTRUCOES_BOT}}) e identificá qué funciones pide y sus gatillos (palabras como "después", "cuando", "al confirmar", "entonces").
2. Para comandos por palabra clave, mirá solo la MENSAJE ACTUAL — el historial es contexto, no dispara comandos por sí solo.
3. Antes de incluir una acción, revisá {{ACOES_EXECUTADAS}}: si ya está, no la repitas (excepto save_variable, que puede repetirse para actualizar un valor).
4. Priorizá separar bien lo dicho por el cliente de lo que solo viene del anuncio, por sobre la completitud.

Ejemplo real que motivó esta regla: cliente escribe "Quiero comprar el Hipercalórico Vitamin Horse de 3KG" desde un anuncio con promo "1 unidad $1.290 / 2 unidades $1.990".
CORRECTO: interes_inicial = "quiere comprar Hipercalórico Vitamin Horse 3KG" (fuente: cliente) · anuncio_origen = "anuncio Hipercalórico Vitamin Horse 3KG, 1 unidad $1.290, 2 unidades $1.990" (fuente: sistema, no hizo falta que el cliente lo mencionara)
INCORRECTO (mezclar fuentes): interes_inicial = "quiere comprar Hipercalórico Vitamin Horse 3KG con la promo del anuncio" — mete el dato del anuncio dentro de la variable del cliente.
INCORRECTO (el error de la Revisión 1): no guardar anuncio_origen porque "el cliente no lo dijo" — esa regla de fuente no aplica a esta variable.

save_variable — reglas comunes, aplican DESPUÉS de resolver la fuente de cada variable (sección de arriba):
- variable_value = el valor real extraído (de la conversa para interes_inicial, del sistema para anuncio_origen), nunca "true", "false" ni un valor genérico.
- Podés repetir save_variable para actualizar un valor si cambia. No lo repitas si el valor no cambió y ya figura en {{ACOES_EXECUTADAS}}.
- Nunca inventes un valor que no esté respaldado por su fuente correspondiente (la conversación para interes_inicial, el sistema para anuncio_origen).

transfer_order:
- Esta función no está disponible en este piloto — no figura en {{FUNCOES_DISPONIVEIS}}. Si el prompt principal describe un criterio de cuándo transferir, es solo el criterio conversacional de Recepción, no una instrucción para vos: no ejecutes ninguna acción de transferencia.

Otras funciones:
- Usá los parámetros EXACTOS que pide <bot_prompt>, no inventes nombres de campos ni valores que no estén ahí.

Principio general: ante la duda de a qué variable pertenece un dato, resolvé primero de qué fuente viene (cliente o sistema/anuncio) y recién ahí decidí dónde guardarlo. Nunca mezcles fuentes ni inventes.
```

---

## E. Guardrails — propuesta (corregida)

**Corrección respecto a la Revisión 1**: ahí se recomendó esperar a que cierre la v49.2 de 9882 antes de tocar los guardrails del Comercial. El usuario tiene razón en que son experimentos independientes — no hay motivo real para esperar. Esta revisión evalúa directamente las 8 frases candidatas que ya se venían analizando (mismo trabajo de falsos positivos que la sesión en paralelo hizo para 9882, aplicado acá con criterio propio en vez de copiar la decisión de golpe).

Base: el guardrail "No sonar a bot ni prometer de más" ya tiene 28 frases activas (sección A). Las 8 candidatas son las que la iteración de 9882 identificó como "sin cobertura" al pulir el prompt (`te hago una sola consulta`, `para avanzar ya`, `quedó claro` suelta, `anoté`, `te recuerdo`, `mientras tanto`, `te dejo una pregunta cortita`, `afinemos`).

| Frase | Motivo (por qué se propuso) | Riesgo de falso positivo | Recomendación |
|---|---|---|---|
| `te hago una sola consulta` | Filler/preámbulo de bot detectado en pruebas reales | Frase larga y específica (4 palabras), combinación improbable en una respuesta legítima | **Agregar** |
| `para avanzar ya` | Filler equivalente a "para avanzar bien" (ya bloqueada) | 3 palabras pero combinación específica, bajo riesgo | **Agregar** |
| `te dejo una pregunta cortita` | Filler de apertura de pregunta — ya estaba citada como ejemplo prohibido en `<ESTILO>` pero nunca había pasado al guardrail | Frase larga (5 palabras), muy bajo riesgo de aparecer en uso legítimo | **Agregar** |
| `quedó claro` (suelta, sin "que") | Eco de comprensión / filler | Corta (2 palabras) y genérica — sin analizar contra conversaciones reales de esta cuenta, no se puede descartar que aparezca en un uso legítimo (ej. citando al cliente) | **No agregar todavía** — hace falta el mismo análisis de falsos positivos que se hizo para las otras 8 en 9882, y acá no hay corpus propio de conversaciones del Comercial todavía |
| `anoté` | Eco de comprensión | Riesgo ya documentado por el usuario: el matcher no respeta límites de palabra, matchea dentro de "manotear" | **No agregar** |
| `te recuerdo` | Eco de memoria | Riesgo ya documentado: bloquearía un recordatorio legítimo real (ej. "te recuerdo que la entrega es en 12 a 48hs", frase válida de `<LOGISTICA>`) | **No agregar** |
| `mientras tanto` | Filler de transición | Riesgo ya documentado: locución normal del español, probable que aparezca en uso legítimo | **No agregar** |
| `afinemos` | Filler/jerga | Corta (1 palabra), poco frecuente en el registro de venta real, pero sin análisis de falsos positivos específico para este dominio | **No agregar todavía** — mismo motivo que "quedó claro": falta el análisis contra conversaciones reales antes de decidir |

**Resumen**: se proponen **3 altas** (`te hago una sola consulta`, `para avanzar ya`, `te dejo una pregunta cortita`) al guardrail existente, sin tocar las 28 ya activas. Las otras 5 quedan pendientes de un análisis de falsos positivos que esta sesión no puede hacer con rigor — no hay un corpus de conversaciones reales del Comercial todavía (a diferencia de 9882, que tuvo 82 conversaciones auditadas). Se puede correr ese análisis en cuanto el canary (sección I) genere las primeras conversaciones reales.

Los otros 5 guardrails (mensajes vacíos, no volver a presentarse, placeholders, etiquetas de media) **no cambian**.

**Deliberadamente no se agrega** ninguna frase contextual como "trabajamos con Vitamin Horse", "tenemos creatina" o "despachamos por DAC" — son correctas o incorrectas según la pregunta, eso lo resuelve `<NO_REPETIR>` en el prompt, no un guardrail léxico. Recordatorio operativo: `blocked_phrases` ignora mayúsculas/acentos y no respeta límites de palabra.

---

## F. Diff contra el agente Comercial vivo (2026-09-24)

| Elemento | Vivo hoy | Propuesto (Revisión 3, final) |
|---|---|---|
| Modo de ejecución | Clásico | Clásico (sin cambio — decisión deliberada) |
| Acciones | 2× save_variable + transfer_order (Pipeline CL\|COMERCIAL / CL\|EN CONVERSACION) | **2× save_variable únicamente** — se elimina el chip de transfer_order |
| Reglas del analizador | Vacías (usa las genéricas del sistema) | Reglas propias de Fitness con fuente separada por variable (sección D, sin cambios desde la Revisión 2) |
| Prompt — caracteres/hash | 15.353 caracteres, `ae41f1e0` | **16.802 caracteres** (+1.449, +9,4%), `6de1b171` — bajó 1.715 caracteres (-9,3%) respecto a los 18.517 de la Revisión 2 |
| Prompt — cantidad de bloques (`<TAG>`) | 27 | 27 — se elimina `<TRANSFERENCIA>` (Revisión 3) pero se compensa con `<NO_REPETIR>` (sumado en la Revisión 2); mismo conteo, contenido más liviano |
| Prompt — `<REGLA_MAESTRA>` | "Es Recepción, Conversión o Atención Humana quien debería continuar?" | Sin mención a Conversión — ver C.1 |
| Prompt — `<NO_REPETIR>` | No existe | Bloque nuevo, con la excepción de repetir cuando responde algo preguntado directamente |
| Prompt — `<PREGUNTAS>` | "para los siguientes agentes" · PUENTE con "activar Conversión" | Sin ninguna de las dos — PUENTE ahora dice "queda lista para atención comercial humana" |
| Prompt — `<OBJETIVOS_Y_KITS>` | "Conversión lo hace" | "eso lo resuelve la atención comercial humana" |
| Prompt — `<MAYORISTA>` | "transferí inmediatamente a FV\|CUALIFICACION" | "guardá contexto y dejá de sondear (ver PUENTE)" — sin repetir la explicación (Revisión 3) |
| Prompt — `<COMPRAS_ANTERIORES>` | "puede avanzar a Conversión" | "la atención comercial humana lo retome" |
| Prompt — `<VARIABLES>` | ~950 caracteres de contrato técnico completo | **~250 caracteres** — solo la regla conceptual de no mezclar cliente/anuncio; el contrato técnico vive únicamente en el analizador (Revisión 3) |
| Prompt — `<TRANSFERENCIA>` | Bloque completo describiendo transferencia real a FV\|CUALIFICACION | **Eliminado** — redundante con PUENTE + `<IDENTIDAD>` + criterios de Atención Humana ya repetidos en otros bloques (Revisión 3) |
| Prompt — `<IDENTIDAD>`, `<MEMORIA>`, `<ESTILO>` | Listas léxicas con frases ya cubiertas por guardrails | Depuradas frase por frase contra las listas reales de los guardrails — tabla completa en C.2 (Revisión 3) |
| Prompt — `<CONTROL_FINAL>` | 8 ítems | 9 ítems (+ chequeo de no-repetición); ítem 5 ya no menciona "transferir" |
| Guardrails — "No sonar a bot..." | 28 frases | **31 frases** (+3: `te hago una sola consulta`, `para avanzar ya`, `te dejo una pregunta cortita`) |
| Guardrails, resto (5) | Sin cambios | Sin cambios |
| Reglas de Activación | Ninguna configurada | Sin cambios en esta propuesta — diseño del test de gating en G.2; se configura recién al ejecutar ese test, antes de cualquier cliente real |
| Resto del prompt (16 bloques idénticos al original: `OBJETIVO`, `VERDAD_COMERCIAL`, `ANUNCIOS`, `DISPONIBILIDAD`, `IDENTIFICACION`, `RESPONDER_PRIMERO`, `BIENVENIDA`, `MARCAS`, `PRECIO_Y_PROMOS`, `CLIENTE_DIRECTO`, `PAGOS`, `PRODUCTO_AMBIGUO`, `RESPUESTAS_AMBIGUAS`, `SEGURIDAD`, `LOGISTICA`, `URGENCIA`) | — | Sin cambios |

---

## G. Riesgos

1. **Activar el Flujo sin gating expone los 181 negocios existentes de una.** `CL|Asignar Recepcionista` dispara con "Negócio mudou de etapa" — reacciona a todo movimiento FUTURO hacia `CL|EN CONVERSACION`, sin tope. **Resuelto en la Revisión 3** apoyándose en el hallazgo de G.1: en vez de evitar la automatización real (como proponía la Revisión 2), se valida primero el gating por etiqueta con el test A/B/C de G.2, y recién con eso confirmado se activa el Flujo protegido por `PILOTO_IA` — nunca sin ese filtro.
2. **"Atención Humana" no tiene una acción técnica real configurada** (mismo hallazgo ya documentado para 9882 en A33/36) — si durante el piloto aparece un caso de seguridad real, el agente puede decir con palabras que deriva a una persona, pero no hay ningún traspaso técnico que efectivamente notifique o mueva la conversación. Esto no lo introduce esta propuesta, ya existía; se vuelve más visible ahora que estamos por exponer el agente a tráfico real. Mitigación mínima mientras no se resuelva: monitoreo humano activo durante todo el canary, no solo revisión de trazas al final del día.
3. **Reglas del analizador nuevas, sin probar en producción.** Reemplazan las reglas genéricas del sistema por unas específicas — es exactamente el cambio que se quiere probar, pero significa que el primer canary también está validando el analizador, no solo el prompt.
4. **Costo/latencia de Clásico** (~2x llamadas por mensaje) — ya asumido y aceptado por el usuario, se menciona para que quede en el registro de la medición.
5. **Clave de API expuesta** (sección A) — recomendación del usuario de rotarla antes del tráfico real, todavía no hecho.
6. **Sin Reglas de Activación (gating por etiqueta/cola)** — el agente responde a cualquier contacto una vez vinculado. **Resuelto en el diseño** (G.1 confirma que el gating existe, G.2 diseña cómo probarlo) — pero el riesgo real es no probarlo ANTES de un cliente real: si el test A/B/C de G.2 no se corre primero, no hay garantía de que funcione como interruptor.

### G.1 Investigación (solo lectura, sin guardar nada): ¿sirve un gating por etiqueta para el canary?

Se abrió en vivo "Reglas de Activación" del agente 10005 (`Agregar Grupo` → `Agregar Regla`), sin guardar nada, para responder las 4 preguntas del pedido:

- **¿El Flujo puede vincular el agente igual?** Sí — "Reglas de Activación" y el Flujo son cosas distintas. El Flujo (`CL|Asignar Recepcionista`) sigue vinculando el agente a la conversación cuando el negocio entra a `CL|EN CONVERSACION`, sin importar las Reglas de Activación.
- **¿El agente puede quedar impedido de responder salvo que el contacto tenga una etiqueta?** Sí, estructuralmente: el constructor ofrece **Operador** (`TIENE` / `NO TIENE`) × **Tipo** (`ETIQUETA` / `COLA`), con un selector para elegir cuál etiqueta exactamente. Una regla `TIENE ETIQUETA = PILOTO_IA` es armable tal cual. El texto de la sección lo confirma: "controlar cuándo el agente debe responder".
- **¿Quitar la etiqueta evita que responda?** No se probó en vivo (hubiera requerido guardar la regla y probarla con una conversación real, fuera del alcance de "solo lectura"), pero la lógica `TIENE`/`NO TIENE` está pensada exactamente para eso — es razonable esperar que sí, a confirmar con una prueba real antes de apoyarse en esto para el canary.
- **¿Esto permite activar la automatización sin abrirla a todos los leads?** Sí, en combinación con el Flujo: el Flujo vincula el agente a cualquier negocio que entre a la columna, pero si el agente tiene la regla `TIENE ETIQUETA PILOTO_IA`, solo va a **responder** en los negocios que además tengan esa etiqueta puesta a mano. Sería un filtro en dos capas: el Flujo decide a quién se le asigna el agente, la Regla de Activación decide a quién realmente le contesta.

**No se guardó ninguna regla — quedó exactamente como estaba ("Ninguna regla configurada").** Esto es una opción real para el canary (sección I), pendiente de la prueba puntual diseñada abajo antes de confiar en ella para tráfico real.

### G.2 Diseño del test de gating (A/B/C) — sin configurar todavía

El pedido es crítico: sin `transfer_order`, el agente queda vinculado a la conversación indefinidamente. Decirle por prompt "dejá de sondear" no lo desvincula — si el cliente vuelve a escribir más tarde, el agente puede volver a responder. Antes de confiar en la etiqueta `PILOTO_IA` como interruptor operativo real, hay que probar las 3 condiciones por separado, con una sola conversación de prueba (no un cliente real):

**Configuración previa a la prueba** (esto sí implica guardar, a diferencia de G.1 — requiere autorización explícita antes de ejecutarlo):
1. Crear la etiqueta `PILOTO_IA` (Configuración → Etiquetas o donde corresponda).
2. En "Reglas de Activación" del agente 10005, crear un grupo con la regla `TIENE ETIQUETA PILOTO_IA`.
3. Guardar cambios en el agente.

**Los 3 pasos del test, en orden, con un contacto de prueba (no un cliente real todavía):**

| Paso | Acción | Resultado esperado | Qué confirma |
|---|---|---|---|
| **A** | Un negocio de prueba SIN la etiqueta `PILOTO_IA` entra a `CL\|EN CONVERSACION` (el Flujo lo vincula al agente). Se le manda un mensaje simulando un cliente. | El agente **NO responde**, aunque esté vinculado. | Que la Regla de Activación efectivamente bloquea, no solo que "existe" la opción en la UI. |
| **B** | Al mismo negocio se le agrega la etiqueta `PILOTO_IA`. Se manda otro mensaje. | El agente **SÍ responde** esta vez. | Que agregar la etiqueta habilita la respuesta sin tener que volver a vincular el agente. |
| **C** | Se le **quita** la etiqueta `PILOTO_IA` al mismo negocio (que sigue vinculado al agente). Se manda un tercer mensaje. | El agente **NO vuelve a responder**, pese a seguir vinculado. | Que quitar la etiqueta es un interruptor real — esto es lo que hace falta para "apagar" a Recepción cuando terminó su trabajo o un humano toma la conversación, sin depender de `transfer_order`. |

**Solo si las 3 condiciones se cumplen exactamente así** se puede confiar en `PILOTO_IA` como interruptor operativo para el canary real (sección I). Si el paso C falla (el agente sigue respondiendo sin la etiqueta), el gating no sirve como interruptor de apagado y hay que buscar otra vía antes de meter clientes reales — no se debe asumir que "probablemente funciona" solo porque A y B salieron bien.

## H. Reversibilidad y cómo volver atrás

- **Todo queda dentro del agente 10005** — nunca se toca 9882 ni su v49.x en curso.
- **Prompt**: antes de aplicar cualquier cambio, se guarda un baseline verificado (texto + hash) en `artefactos/recepcionista-comercial-baseline-2026-09-24.txt`, igual método que ya se usa para 9882. Volver atrás = pegar ese texto y guardar.
- **Acción `transfer_order`**: eliminar el chip es reversible — volver a agregarlo y elegir Pipeline `CL | COMERCIAL` / Coluna `CL | EN CONVERSACION` toma dos minutos (mismo procedimiento ya ejecutado y verificado la sesión anterior).
- **Reglas del analizador**: dejar el campo vacío restaura las reglas genéricas del sistema — no hay riesgo de quedar en un estado intermedio raro.
- **Guardrails**: se proponen 3 altas al guardrail existente (sección E) — sacarlas es apagar/editar esa regla desde "Opciones", no hace falta recrear nada desde cero.
- El agente además tiene su propio **"Historial de versiones"** en el editor (botón visto en la UI) — no explorado en detalle esta auditoría, pero es una vía adicional de rollback nativa de la plataforma si hiciera falta.
- El Flujo `CL|Asignar Recepcionista` sigue **desactivado** — nada de esto lo activa. Activarlo es una decisión aparte, posterior a validar el gating (G.2) y antes de recién ahí meter clientes reales.

## I. Canary real desde el primer lote (rediseñado en la Revisión 3)

**Cambio de fondo respecto a la Revisión 2**: en vez de empezar vinculando el agente a mano y recién después probar la automatización real, el usuario prefiere validar primero que el interruptor (`PILOTO_IA`) funciona, e ir directo a la infraestructura real desde el primer lote — así el canary prueba de una vez el cerebro Y el sistema que va a operar solo mañana, no dos cosas separadas en dos momentos.

**Orden de pasos:**

1. Aplicar los cambios de C, D y E (con el usuario mirando, como toda edición de prompt en este proyecto) y eliminar el chip `transfer_order` (B). Verificar con recarga completa del servidor y guardar el nuevo baseline con hash.
2. Ejecutar el **test A/B/C de G.2** con un contacto de prueba, no un cliente real. Si el paso C falla, frenar acá — no hay interruptor operativo real todavía y no corresponde avanzar a clientes reales sin uno.
3. Si el test sale bien: activar el Flujo `CL|Asignar Recepcionista` (que hoy sigue desactivado) y, por separado, poner la etiqueta `PILOTO_IA` a mano en **5 negocios reales** de `CL|EN CONVERSACION`. El Flujo vincula el agente a cualquier negocio nuevo de esa columna, pero solo esos 5 con la etiqueta van a recibir respuesta.
4. **Monitoreo humano en tiempo real** durante todo este primer lote — no revisión de trazas al final del día. Para cada uno de los 5:
   - ¿Separó bien interes_inicial de anuncio_origen? (el caso que motivó la corrección de la sección D)
   - ¿Repitió información obvia del anuncio/cliente, o al revés, dejó de responder algo preguntado directamente? (los dos lados de `<NO_REPETIR>`)
   - ¿Algún guardrail disparó en falso, incluidas las 3 frases nuevas?
   - ¿Se le escapó alguna referencia a "Conversión" o a un traspaso que no existe?
   - Latencia percibida de las 2 llamadas de Clásico.
5. **Reglas de apagado durante el canary** (esto es lo que hace operativo al interruptor):
   - Cuando un humano toma la conversación porque Recepción ya cumplió su parte: **quitarle la etiqueta `PILOTO_IA`** a ese negocio. El agente sigue vinculado pero deja de responder (confirmado por el paso C del test).
   - Si aparece un caso de seguridad, un pedido explícito de hablar con una persona, o cualquier situación fuera de lo que este agente puede resolver: **quitar `PILOTO_IA` inmediatamente** y continuar la conversación a mano — recordar que "Atención Humana" no tiene todavía una acción técnica real (riesgo G.2), así que este apagado manual es la única red de seguridad mientras tanto.
6. Si los 5 salen bien: ampliar a 10-20 negocios más, mismo mecanismo (Flujo + etiqueta), antes de considerar sacar el gating y dejarlo abierto a todo `CL|EN CONVERSACION`.

---

## J. Acciones finales que quedarían disponibles en el agente

Si se aplica esta propuesta tal cual, el agente 10005 queda con exactamente **2 acciones**:
1. `Salvar variável: interes_inicial`
2. `Salvar variável: anuncio_origen`

Sin `Transferir coluna no CRM` — eliminado a propósito para este piloto (sección B). Ningún otro chip de los disponibles (Conversa, Apps, Contato, Negócio, Enviar Mensagem, Pergunta, Reagir à Mensagem, Pedir telefone, Tags, Agente de IA, Requisição HTTP, Data & Hora, Script) se agrega — no se pidió ninguno y agregar de más no es parte de este experimento.

---

## K. Checklist de confirmaciones pedidas

- **Prompt principal REV3 completo**: sección C, código completo.
- **Caracteres/hash**: 16.802 caracteres, `6de1b171` (baseline: `artefactos/recepcionista-comercial-propuesta-rev3-2026-09-24.txt`).
- **Cuánto se redujo respecto de los 18.517 de la Revisión 2**: -1.715 caracteres (-9,3%). Sigue +1.449 caracteres (+9,4%) por encima del prompt de test original — la diferencia es contenido genuino nuevo (`<NO_REPETIR>` completo, los ajustes de C.1), no relleno.
- **Analizador Clásico final completo**: sección D — sin cambios respecto a la Revisión 2, confirmado en el encabezado de D.
- **Guardrails finales**: sección E — 31 frases en "No sonar a bot..." (+3), el resto de los 6 guardrails sin cambios.
- **Diff exacto**: sección F, tabla completa contra el agente vivo.
- **Acciones finales disponibles**: sección J — exactamente las 2 `save_variable`, sin `transfer_order`.
- **Diseño exacto del test de gating**: sección G.2 — pasos A/B/C con resultado esperado de cada uno.
- **Confirmar que no queda lógica técnica duplicada innecesariamente entre prompt y analizador**: tabla C.2 (qué se sacó del prompt por estar cubierto por un guardrail) + `<VARIABLES>` reducido a la regla conceptual, con el contrato técnico completo viviendo únicamente en D.
- **Confirmar que no queda ninguna referencia a Conversión o FV**: verificado con búsqueda automática sobre el texto final del prompt (no a ojo) — cero coincidencias de "Conversión" y de "FV|"; el bloque `<TRANSFERENCIA>` que las contenía se eliminó por completo. Detalle en C.1 y C.2.
- **Confirmar que NO se aplicó nada**: confirmado. No se tocó el agente 10005 ni ningún otro elemento del CRM en esta revisión — todo el trabajo fue edición de este archivo y de los artefactos de texto en `artefactos/`. El único acceso al CRM en toda la Revisión 2 fue de lectura (auditoría) y la investigación de G.1, sin guardar nada tampoco ahí.

---

**No se aplicó nada de lo anterior.** Queda para que lo revises y digas qué cambia, qué se aplica tal cual, y cuándo arrancamos el test de gating (G.2) como primer paso real.
