# Traspaso 2026-09-15 — La presentación y el informe para la gerencia

> **Si venís de la otra PC y no sabés nada de esto: este archivo es el punto de entrada.**
> Acá está todo lo que pasó, qué quedó publicado, qué reglas puso el usuario, qué datos
> se cayeron, y qué falta. No hace falta leer el historial de la conversación.

---

## 0. Lo que hay que saber en 30 segundos

Santiago tiene una reunión con **el gerente y el dueño de Fitness Suplementos**. Para eso
hay **dos entregables publicados y editables**:

| Qué | Link | Formato |
|---|---|---|
| **La presentación** (10 láminas, tipo carrusel) | `https://claude.ai/artifact/HRrwo9NAPYA5TFroatPPua` | Canvas de Claude Design |
| **El informe escrito** (8 secciones) | `https://claude.ai/artifact/7WJucUKznyxL9annxsq22W` | Página HTML |

Los dos dicen lo mismo, con distinto nivel de detalle. **Él presenta hablando con las láminas
y deja el informe como respaldo.**

---

## 1. Las reglas que puso el usuario (esto es lo más importante del archivo)

Son suyas, dichas explícitamente, y valen para todo lo que se escriba de acá en más.
Detalle largo en [[27-reglas-diseno-presentaciones]].

### 1.1 No decir lo obvio
> *"un líder, un profesional sabe, no son burros… si no vas a andar siempre poniendo algo
> que nadie quiere saber porque es obvio."*

Cada línea obvia ocupa el lugar de una que aporta, y suena condescendiente con alguien que
dirige el negocio. **Test: ¿se lo estoy contando o se lo estoy recordando?** Si es lo
segundo, se borra.

Ejemplos reales que se sacaron por esta regla:
- *"El equipo no falla por falta de ganas… Es capacidad, no actitud"* → **"De seis operadores a tres o cuatro, con el mismo volumen entrando."**
- *"tu catálogo real"* (nota en la portada) → borrada, que el catálogo es de ellos es obvio.
- *"No son visitas anónimas"* → borrada.
- *"y por eso no se resuelve pidiendo que respondan más rápido"* → borrada.

### 1.2 No dar sugerencias sobre su negocio
No decirles qué hacer con su inversión, su tráfico pago o su estrategia de recompra.
**Ellos saben más que nosotros de eso.** Se aportan hechos y lo que puede hacer el agente;
la conclusión la sacan ellos.

Por esto se eliminó todo el bloque *"El giro hacia la recompra"*: era explicarles su propia
decisión comercial.

### 1.3 Los números son una simulación, no una medición
Las cifras del negocio (~5.000 contactos/mes, ~70% atendido, ~30% de conversión, R$10.000 de
tráfico pago) **las dio la empresa de memoria, en una conversación**. No son exactas y no
salieron de ningún sistema.

Hay que decirlo explícitamente en cada lugar donde aparecen. Fórmula que quedó:
> *"Datos que me pasó el equipo. Con eso armé el orden de magnitud, para tener un número sobre la mesa."*

### 1.4 No inflar
Él mismo bajó **"siete días de trabajo" a "cinco"** para no parecer que agrandaba.
**Ante la duda, el número va para abajo.**

### 1.5 Las descripciones de las láminas son su apunte para hablar, no un texto para leer
Esto cambió todo el tono del deck. Las bajadas tienen que ser **una o dos líneas cortas y secas**
que le den el pie; él explica en vivo. Un párrafo explicativo en la lámina se lee como si les
estuviera enseñando.

> *"la cosa es tener una descripción ahí básica para que justamente yo me guíe… pero si yo les
> digo a ellos para que ellos lean eso, va a quedar ridículo."*

### 1.6 Tono
Que suene a **una opinión que observó y pone sobre la mesa**, no a alguien demostrando que sabe
más. Sin forzar. Lo más parecido a cómo habla él.

---

## 2. Datos que se cayeron (NO volver a usarlos)

### 2.1 ❌ "6 de 6 usuarios y 2 de 2 canales" — ANULADO
Estaba documentado como verificado en **cuatro archivos** y puesto en la lámina 4 como
*"verificado en el sistema"*. **Está mal.** Esa pantalla se leyó **sin el rol de administrador
activo**, así que muestra lo que ve un usuario común, no la capacidad real de la cuenta.

Corregido en [[24-sesion-2026-09-14-traspaso]] §1.7, [[25-estado-y-que-sigue]] y
[[22-guion-reunion-soporte-portugues]] (ahí era peor: el guion le hacía **afirmar el número en
voz alta** en la reunión con soporte).

**Para reponerlo:** releer `Configuración → Mi Plan` con el rol de administrador.

### 2.2 ❌ El ranking de "más vendidos" de Shopify no es un dato de ventas
Por Shopify **prácticamente no venden**, y hay productos cargados ahí que no corresponden al
catálogo real. Los 205 productos "ordenados por ventas reales" **no se pueden presentar como
ranking de ventas**.

El orden real tiene que salir de **Bling**, que es donde está la venta de verdad.
Mientras tanto el catálogo sirve para **precio, link y categoría**, no para recomendar
"lo que más sale". Registrado como **E9** en [[PENDIENTES]].

### 2.3 ✅ El agente YA funciona con el catálogo
**Cerrado por el usuario el 2026-09-15**: lo probó desde su propio número y el agente responde
consultando el catálogo. La causa original de que inventara precios era que **la planilla de
Google no era pública**.

**Importante para el tono:** él NO quiere que se cuente la historia de "estaba roto y lo
arreglamos". Quiere que se diga **el estado actual: funciona**. Explicar lo que fallaba
desperdicia espacio.

---

## 3. Qué dice hoy cada lámina (y por qué)

| # | Lámina | Qué dice ahora | Qué se sacó y por qué |
|---|---|---|---|
| 1 | Portada | "Dónde se escapan LAS VENTAS" · Cinco días de trabajo | La nota *"tu catálogo real"*: obvia |
| 2 | El número | ~1.500 + **planilla** con 5.000 → 70% → 1.500 | El párrafo que explicaba la cuenta; "no son visitas anónimas" |
| 3 | El embudo | "SIMULACIÓN SOBRE SUS PROPIAS CIFRAS" · escalera de magnitudes | El sermón de "capacidad, no actitud" |
| 4 | Por qué ahora | Primavera · Ya responde con el catálogo · Situación actual | El giro a recompra (obvio) y la capacidad topeada (dato malo) |
| 5 | Lo construido | La tarjeta se mueve sola · Entran sin cargarlos · 25 herramientas | Los 421 productos y el ranking: no son logro y el ranking no es válido |
| 6 | Dónde está parado | Responde con el catálogo · El anti-errores no se guarda · Columna de no-contestan · De qué anuncio vino | *"nadie las había detectado"*, "inventaba precios", "el modo de prueba engaña", "Bling no responde" |
| 7 | El costo | **Él dijo que quedó excelente. No tocar la estructura.** | Se agregó: el costo real puede ser mayor + falta acceso de administrador |
| 8 | El impacto | Escenarios ~+150 / ~200 sumadas | — |
| 9 | Meta | **Él dijo que quedó muy bien.** Muse vs Business Agent + DKW | — |
| 10 | El plan | 4 fases + qué necesita de ellos | Ticket promedio y margen: los sacó él |

### 3.1 Por qué se vació la lámina 6
Era *"CUATRO FALLAS DEL PROVEEDOR"* con cuatro bugs. El usuario lo frenó en seco:

> *"yo no soy el soporte de la plataforma… a mí no se me pidió que integrara Bling ni nada de
> eso, entonces es algo que es inútil… tenés que usar ese tiempo para poner cosas interesantes."*

Una auditoría comercial no es un reporte de bugs para el proveedor. Quedó **solo el bloqueo
real** (el control anti-errores no persiste, y eso sí le impide concluir tareas) y el espacio
liberado se usó para **lo que viene**, que es lo que a un gerente le interesa.

---

## 4. Trampas técnicas del canvas (esto te va a pasar a vos también)

### 4.1 El editor destruye el grano SVG en cada guardado
Las láminas tenían una capa de grano hecha con un `data:image/svg+xml` inline
(`feTurbulence`). **Cada vez que el usuario arrastra un elemento y guarda, el editor
re-serializa la lámina y deja `url("data:image/svg+xml")` vacío**, o borra el div entero.

Pasó en 6 de 10 láminas.

**Arreglado de raíz el 2026-09-15:** el grano ahora es un archivo de imagen real,
`grain.png` (160×160, ruido gris centrado en 128, `mix-blend-mode: overlay`, opacidad 0.40).
Las imágenes sí sobreviven al guardado. **No volver al SVG inline.**

### 4.2 Pegar texto del chat arrastra el formato del chat
Cuando él copia un texto que le paso y lo pega en el editor, se va con
`color: rgb(204,204,204); font-family: -apple-system…; font-size: 13px; background-color: rgb(43,43,43)`
metido adentro del HTML. Se ve como un parche gris sobre gris.

Pasó dos veces (lámina 2 y lámina 3). Una vez también dejó `line-height: 2.OO` — con la
**letra O** en vez de cero, o sea CSS inválido.

**Decirle siempre que pegue con `Ctrl+Shift+V`.** Y antes de publicar, barrer:
```bash
grep -l "rgb(204, 204, 204)" *.dc.html
```

### 4.3 Arrastrar una nota la mete adentro del div de fondo
Al mover una anotación manuscrita, el editor la anida dentro del degradado. Visualmente
funciona, pero conviene sacarla como hermana del root para que el grano no le pase por encima.

### 4.4 SIEMPRE leer el canvas antes de publicar
Él edita en el navegador mientras vos trabajás. Si publicás sin leer, le borrás el trabajo.
**El flujo correcto, siempre:**

```bash
# 1. leer
Artifact action:"read" url:"https://claude.ai/artifact/HRrwo9NAPYA5TFroatPPua"
# 2. extraer a una carpeta nueva
node "<skill>/seed-canvas.mjs" --extract "<el .html que guardó el read>" --to scratchpad/work
# 3. editar los .dc.html DE ESA CARPETA (no una copia vieja)
# 4. re-sembrar y publicar
```

Si el publish se rechaza por conflicto, **no forzar**: volver a leer, re-extraer, rehacer el
cambio encima y publicar de nuevo.

### 4.5 Lo que se rescató de la V1 cuando casi lo piso
Él había editado el canvas por su cuenta y había subido **un logo "F" en 3D** (`logoF.webp`,
tiene canal alfa). Estaba en dos láminas. Ahora está en las diez, al lado del wordmark.
**El logo no se redibuja nunca con IA** — se respeta el formato y las fuentes originales.

También encontré tres arrastres accidentales suyos que rompían láminas (degradado corrido
351px, el logo metido de fondo tapando una tarjeta, una lámina encima de otra). Esos se
descartaron. **Conviene revisar eso cada vez que él estuvo editando.**

---

## 5. Lo que NO se puede publicar

El `publish` estuvo bloqueado un rato por el clasificador de permisos con el motivo
`Live-Shared Artifact Sensitive Delta`. **La causa era la captura real del pipeline del CRM**
embebida en la lámina 5 — con nombres y teléfonos de clientes desenfocados con Gaussian blur,
y aun así no pasó.

**Regla:** en un artifact compartido por link no van capturas de pantalla con datos de
clientes, ni siquiera desenfocadas. Las cifras agregadas sí (quedó "2.535 negocios en el
pipeline"). La captura se reemplazó por `chat3d.jpg`, un render sin datos.

---

## 6. Qué falta — y quién lo desbloquea

### 6.1 Lo que necesita de la empresa (está en la lámina 10 y en el informe)
- **Los audios del equipo** para el embudo de creativos, y para que el agente mande la voz correcta según producto y situación.
- **Las promociones y los cupones del mes** — el prompt tiene el placeholder `{{promos_vigentes}}` sin llenar.
- **Cómo queda el stock cuando se ordene en Bling** — de ahí sale el ranking real.
- **El acceso de administrador del CRM** — sin eso no puede confirmar límites ni tocar cierta configuración.
- **Luz verde para medir la línea de base.**

### 6.2 **PENDIENTE:** lo que él iba a pasar y todavía no llegó
- Las **transcripciones de los videos de Meta** que estuvo mirando (mencionó cinco).
- Las respuestas de la reunión con soporte del CRM, que se perdieron cuando la otra PC no
  consiguió subir a GitHub.

### 6.3 **PENDIENTE:** decisiones abiertas
- **n8n**: el trial vence ~14 días desde 2026-09-14. Hay un workflow de 7 nodos armado y sin activar.
- **La versión pinneada del canvas**: quien entra por el link ve una versión vieja congelada.
  Se saca desde el menú de compartir del artifact. **Yo no puedo tocarlo.**

---

## 7. Preguntas abiertas para vos (el Claude de la otra PC)

Él pidió expresamente que te deje esto para que lo completes con la información que tenés allá.

1. **¿Qué respondió soporte del CRM?** Las preguntas están en [[21-preguntas-para-soporte-rmsystemm]] y [[22-guion-reunion-soporte-portugues]]. Si tenés las respuestas, cerralas ahí con ✅ y fecha, y avisá cuáles cambian lo que dice el deck.
2. **¿El control anti-errores sigue sin guardarse?** Es el único bloqueo que queda en la lámina 6. Si soporte lo arregló, esa lámina cambia entera.
3. **¿Se consiguió el rol de administrador?** De eso dependen dos cosas: el dato de capacidad del plan (§2.1) y la línea del costo sobre escalar.
4. **¿Cuántos usuarios y canales tiene realmente el plan?** Releer `Configuración → Mi Plan` con el rol correcto.
5. **¿Ticket promedio y margen?** Él los sacó del deck a propósito, pero si aparecen, el informe puede volver a cerrar el número en pesos.
6. **¿Hay forma de separar qué contacto atiende el agente y cuál una persona?** De eso depende que la estimación de costo sea firme. Hoy el informe dice que el costo real puede ser mayor justamente por esto.
7. **Mirando el deck con ojos frescos: ¿qué línea sigue sonando obvia?** Es el criterio que más le importa. Si ves una que sobra, sacala.

---

## 8. Dónde está cada cosa

| Qué | Dónde |
|---|---|
| Los `.dc.html` de las 10 láminas + imágenes | `scratchpad/work/` de la sesión (efímero) — **se regeneran extrayendo del canvas publicado** |
| El HTML del informe | `scratchpad/informe/donde-se-escapan-las-ventas.html` (efímero, idem) |
| Las reglas de diseño | [[27-reglas-diseno-presentaciones]] ← en el repo |
| Los pendientes | [[PENDIENTES]] ← en el repo |
| El estado del proyecto | [[25-estado-y-que-sigue]] |
| El traspaso anterior | [[24-sesion-2026-09-14-traspaso]] |

> ⚠️ **Los archivos del deck NO están en el repo** — son ~1 MB de fotos y se regeneran con
> `--extract` desde el canvas publicado. Lo que se versiona son las reglas y las decisiones,
> no los binarios. Si necesitás editar el deck, el paso 1 es siempre extraer del canvas.

---

## 9. Cómo seguir

1. Leé §1 (las reglas) antes de escribir una sola línea del deck. Es donde más se equivocó esta sesión.
2. Extraé el canvas antes de tocarlo (§4.4).
3. Contestá lo que puedas de §7 con la información que tengas en esa PC.
4. Cerrá en [[PENDIENTES]] lo que se resuelva, con ✅ y fecha, sin borrar la fila.
5. Al terminar, agregá la entrada en [[17-registro-de-cambios]] y hacé commit + push.
