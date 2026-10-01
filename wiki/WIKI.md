# WIKI.md — cómo funciona esta capa (leer primero, siempre)

## Qué es `wiki/` y qué NO es

Este directorio es una capa **nueva**, agregada el 2026-09-30, sobre el vault ya existente. Sigue el patrón "LLM Wiki" (Karpathy): en vez de que cada sesión relea 44 archivos crudos para entender el proyecto, esta capa mantiene un **resumen curado, interlinkeado y actualizado** de las entidades y conceptos reales del proyecto. El resto del vault (`00-...md` a `42-...md`, `PENDIENTES.md`, `17-registro-de-cambios.md`, `artefactos/`) **no se tocó, no se borró, no se renombró** — sigue siendo la fuente de verdad narrativa/cronológica. `wiki/` es un índice de alto nivel que apunta ahí para el detalle y la evidencia exacta.

**Regla de oro: `wiki/` resume y linkea, nunca reemplaza.** Si un dato tiene matices, excepciones o el detalle exacto de cómo se verificó, la página de wiki dice lo esencial y linkea al archivo numerado o a `PENDIENTES.md` para el resto. No copiar prompts completos, logs de sesión ni transcripciones acá — eso vive en los archivos fuente.

## Cómo reproducir esto exactamente (runbook literal, para otra PC o una sesión nueva)

Esta sección existe para que, en cualquier momento, alcance con decirle a una sesión nueva de Claude Code algo como *"seguí el método de `wiki/WIKI.md` para actualizar/reconstruir la wiki"* y el resultado sea el mismo proceso, con el mismo nivel de rigor, sin tener que reexplicar nada. Es el paso a paso literal que se siguió para construir esta capa el 2026-09-30 — no una descripción general, los pasos exactos.

**Paso 0 — Cuándo correr esto entero (reconstrucción) vs. solo un pedazo (actualización).** Reconstrucción completa: nunca hace falta salvo que la carpeta `wiki/` se haya perdido o se decida rehacerla desde cero. Lo normal es una **actualización incremental**: cuando un archivo numerado nuevo aparece, o uno existente cambia sustancialmente (no un typo — un cambio de arquitectura, un bug nuevo, un pendiente cerrado), se relee ESE archivo completo y se actualiza SOLO la(s) página(s) de `wiki/` que lo citan como fuente (buscarlas con `grep -l "nombre-del-archivo" wiki/entities/*.md wiki/concepts/*.md`). El resto de este runbook aplica igual para ambos casos, ajustando el alcance.

**Paso 1 — Inventario, sin ruido.** Listar los archivos `.md` de la raíz del proyecto (NO recursivo sobre todo el repo: hay carpetas de skills instaladas — `.claude/skills/`, `.agents/skills/` — que no son parte de este vault y ensucian cualquier glob genérico). En bash: `ls -la *.md` desde la raíz del proyecto. Confirmar tamaños — algunos archivos son enormes (`17-registro-de-cambios.md` puede superar 150KB) y necesitan una estrategia distinta (ver Paso 3).

**Paso 2 — Leer `PENDIENTES.md` completo, entero, sin resumir.** Es la única fuente de qué está sin resolver — cualquier página de wiki que se escriba sin haber leído esto primero va a citar pendientes viejos o inventar el estado de algo que ya se cerró. Si el archivo es muy largo para una sola llamada de lectura, leerlo en tramos consecutivos con `offset`/`limit` hasta el final — nunca saltear el final asumiendo que "ya se entendió el patrón".

**Paso 3 — Leer TODOS los demás archivos numerados completos, en el orden que indica `CLAUDE.md` del proyecto** (el que dice "Orden de lectura recomendado"). Para archivos grandes (30KB+), leerlos igual completos, en tramos si hace falta — no hay atajo acá, la fidelidad de la wiki depende de haber leído la fuente real, no un resumen de un resumen. **Única excepción real**: un archivo que se auto-declara como "volcado literal sin resumir de otro archivo" (ejemplo real de este vault: `23b-conectores-volcado-literal.md` es el crudo detrás de `23-conectores-hub-integraciones.md`, y `22-guion-reunion-soporte-portugues.md` es el mismo contenido que `21` traducido para leer en voz alta) — ahí alcanza con leer el que ya analiza/resume, y la página de wiki cita a los dos como fuente. Para un archivo cronológico gigante tipo `17-registro-de-cambios.md`, si releerlo completo no es viable en una sola sesión, como mínimo indexar sus encabezados de sesión (`grep -n "^### " archivo.md`) para tener el mapa temporal completo, y leer completas las secciones puntuales que hagan falta para una página específica.

**Paso 4 — Diseñar (o confirmar, si ya existe) la lista de páginas.** Cada objeto real y concreto del proyecto (un agente, una integración, un mecanismo, un archivo técnico recurrente) es una página en `entities/`. Cada idea/arquitectura/principio de diseño que no es "una cosa" sino un criterio (cómo razona un agente, cómo se guarda pegado un prompt sin romperlo, la visión de una arquitectura futura) es una página en `concepts/`. Regla de tamaño: si algo se puede cubrir bien en 2-4 párrafos dentro de la página de otro tema relacionado, no merece página propia — evitar la fragmentación en páginas de una sola línea. Regla de cobertura: al terminar, cada archivo numerado del vault debería estar citado como fuente en al menos una página (salvo las excepciones de volcado literal del Paso 3) — si alguno quedó sin citar, o falta una página, o falta agregarlo como fuente de una ya existente.

**Paso 5 — Escribir cada página siguiendo la convención exacta** (ver la sección de abajo, "Convención de cada página") — el bloque de encabezado **Qué es / Estado real / Fuente primaria** siempre primero, cuerpo denso sin relleno, sección final **Pendientes relacionados** citando IDs reales de `PENDIENTES.md` (nunca inventando un ID nuevo acá). Cross-linkear con `[[nombre-de-archivo-sin-extensión]]` cada vez que una página menciona algo que ya tiene su propia página — es lo que hace que el grafo de Obsidian quede realmente conectado, no una lista de páginas sueltas.

**Paso 6 — Actualizar `wiki/index.md`** agregando cada página nueva a la categoría que le corresponda (o creando una categoría nueva si ninguna encaja), con una línea de gancho de no más de 1-2 frases.

**Paso 7 — Agregar una entrada a `wiki/log.md`** (nunca editar entradas viejas, solo append arriba de la lista o al final según el orden que ya tenga el archivo) describiendo qué se hizo, qué se leyó, y — siendo honesto — qué quedó sin cubrir a propósito y por qué.

**Paso 8 — Verificar que `CLAUDE.md` de la raíz del proyecto sigue apuntando acá** (una sección cerca del principio que dice "existe una capa wiki/, empezar por wiki/WIKI.md"). Si esta es la primera vez que se corre este proceso en un proyecto que todavía no tiene esa sección, agregarla.

**Paso 9 — Agregar una entrada a `17-registro-de-cambios.md`** (o el registro cronológico equivalente del proyecto) siguiendo su propio formato de siempre — esto NO es opcional ni un duplicado de `wiki/log.md`: uno es el log de sesiones de TODO el proyecto, el otro es específico de cambios en `wiki/`.

**Paso 10 — `git add` de los archivos tocados (nunca `git add -A`/`.` a ciegas), commit con mensaje descriptivo, y push.** Confirmar con `git status` después del commit que no quedó nada suelto ni se subió algo que no correspondía.

## Estructura

```
wiki/
  WIKI.md              este archivo — el esquema
  index.md             catálogo maestro de todo lo que hay en wiki/, por categoría
  log.md               registro cronológico de cuándo se creó/actualizó cada página de wiki/
  entities/            objetos concretos y reales del CRM (un agente, una integración, un mecanismo)
  concepts/            ideas/arquitectura/metodología que no son "una cosa" sino un principio de diseño
```

No hay carpeta `sources/`: el mapeo página-de-wiki → archivo-fuente se hace con links `[[archivo-numerado]]` inline, dentro de cada página de entidad/concepto, en vez de un directorio de punteros aparte — con 44 archivos fuente, un directorio de punteros 1:1 sería ruido sin agregar nada que el link inline no dé ya.

## Convención de cada página

Toda página de `entities/` o `concepts/` empieza con un bloque así:

```
**Qué es**: una frase.
**Estado real (fecha)**: aplicado / propuesto sin aplicar / diagnosticado sin resolver / histórico-superado.
**Fuente primaria**: [[archivo-numerado]] (y el artefacto exacto si aplica, ej. `artefactos/xxx.txt`).
```

Después, el cuerpo. Al final, si corresponde: **Pendientes relacionados** con el ID exacto de `PENDIENTES.md` (ej. Q26, A10) — nunca reescribir el pendiente acá, solo citar el ID y una frase, e ir a `PENDIENTES.md` para el texto completo y actualizado.

## Regla dura: los IDs de pendientes son de `PENDIENTES.md`, no de acá

`PENDIENTES.md` sigue siendo, sin ningún cambio, **el registro único de lo que falta resolver** (regla ya escrita en `CLAUDE.md` del proyecto). Esta wiki no crea un segundo sistema de pendientes. Cuando una página de wiki menciona algo sin resolver, cita el ID real (A10, Q26, B2, etc.) y listo — si ese ID no existe todavía, se agrega primero a `PENDIENTES.md` (siguiendo su propio método: prefijo `**PENDIENTE:**`, quién lo desbloquea) y recién después se referencia desde acá.

## Cómo mantener esto al día (para cualquier agente futuro, incluido el que lea esto en la próxima sesión)

1. **Antes de escribir código o tocar el CRM real**, para entender el estado de una pieza (un agente, una integración, un mecanismo), leer primero su página en `wiki/entities/` — más rápido que releer los archivos numerados de punta a punta. Si la página dice "Estado real: verificar" o su fecha es vieja, sí hay que ir a la fuente antes de asumir que sigue así (mismo principio que ya rige para memoria en `CLAUDE.md`: una página de wiki es un snapshot, no una promesa de que sigue siendo cierto hoy).
2. **Después de una sesión que cambia algo real** (aplicar un prompt, encontrar un bug, resolver un pendiente, construir un flujo), antes de cerrar:
   - Actualizar la página de `entities/`/`concepts/` afectada (no dejarla vieja — un dato desactualizado en la wiki es peor que no tener wiki).
   - Agregar una línea a `wiki/log.md` con la fecha y qué cambió.
   - Seguir hecho lo que ya pedía `CLAUDE.md` del proyecto: entrada en `17-registro-de-cambios.md`, actualizar `PENDIENTES.md`, commit + push.
3. **Si aparece una entidad nueva** que no tiene página todavía (un agente nuevo, una integración nueva, un mecanismo nuevo), crear la página en `entities/` o `concepts/` según corresponda, y agregarla a `wiki/index.md` en la categoría que le toque.
4. **Nunca dar por hecho que una página de wiki refleja el prompt/config vivo en rmsystemm.** El CRM se edita fuera de este repo (por el usuario, por otras sesiones) más seguido de lo que se documenta. Antes de recomendar un cambio basado en "la wiki dice que el prompt tiene tal regla", verificar contra el servidor (`GET /prompt/{id}` u otro endpoint real) si la acción que se va a tomar depende de que ese dato sea exacto.

## Para quien pregunte "¿por dónde empiezo?"

- **¿Qué hay que hacer ahora mismo?** → `PENDIENTES.md` (sigue siendo la única fuente de eso, no wiki/).
- **¿Qué pasó la sesión pasada?** → `17-registro-de-cambios.md` (cronológico, no resumido).
- **¿Cómo funciona [tal cosa] del CRM, en general, sin necesitar la última sesión?** → acá, `wiki/index.md`.
- **¿Cuál es el prompt vivo de un agente ahora mismo?** → ningún archivo lo garantiza al 100%; la wiki apunta al último artefacto conocido, pero hay que confirmar contra el servidor antes de asumirlo si se va a actuar sobre eso (ver punto 4 arriba).
