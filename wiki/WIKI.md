# WIKI.md — cómo funciona esta capa (leer primero, siempre)

## Qué es `wiki/` y qué NO es

Este directorio es una capa **nueva**, agregada el 2026-09-30, sobre el vault ya existente. Sigue el patrón "LLM Wiki" (Karpathy): en vez de que cada sesión relea 44 archivos crudos para entender el proyecto, esta capa mantiene un **resumen curado, interlinkeado y actualizado** de las entidades y conceptos reales del proyecto. El resto del vault (`00-...md` a `42-...md`, `PENDIENTES.md`, `17-registro-de-cambios.md`, `artefactos/`) **no se tocó, no se borró, no se renombró** — sigue siendo la fuente de verdad narrativa/cronológica. `wiki/` es un índice de alto nivel que apunta ahí para el detalle y la evidencia exacta.

**Regla de oro: `wiki/` resume y linkea, nunca reemplaza.** Si un dato tiene matices, excepciones o el detalle exacto de cómo se verificó, la página de wiki dice lo esencial y linkea al archivo numerado o a `PENDIENTES.md` para el resto. No copiar prompts completos, logs de sesión ni transcripciones acá — eso vive en los archivos fuente.

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
