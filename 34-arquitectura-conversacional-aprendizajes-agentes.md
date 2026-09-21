# Arquitectura conversacional de los agentes — aprendizajes de las pruebas con ChatGPT (2026-09-21)

## 0. Qué es este archivo (leer primero)

**Fuente.** Documento de estado escrito por ChatGPT después de muchas rondas de pruebas del Recepcionista que el usuario corrió con él, entre el 2026-09-19 y el 2026-09-21. El usuario lo pegó entero el 2026-09-21 pidiendo que quede documentado. **Es el análisis más completo que existe hasta hoy sobre cómo tienen que razonar los agentes**, y cubre mucho más que el Recepcionista: Conversión, Cierre, remarketing, postventa, catálogo, CRM y el futuro "Fit Brain".

**Qué NO es.** No son pruebas que se hayan corrido desde esta sesión de Claude Code, ni cambios verificados en el CRM. Son conclusiones de ChatGPT sobre pruebas manuales. Donde el vault ya tenía información que confirma, contradice o matiza algo, está marcado como **[Cruce con el vault]**.

**⚠️ Llegó incompleto.** El mensaje del usuario se cortó a los 50.000 caracteres, **a mitad del punto 81** ("Qué ya considero prácticamente consolidado en Recepción"). Falta el resto del documento y **el prompt vigente del Recepcionista** que el usuario quería incluir ("y también la última instrucción"). Ver A1 y A2 en [[PENDIENTES]].

**⚠️ El vault está atrasado respecto del prompt vivo.** ChatGPT dice que la última versión del prompt que recibió tenía **2.751 líneas**. [[29-prompts-por-columna]] tiene **964 líneas para los 5 agentes juntos** (el Recepcionista ocupa ≈ las líneas 93-340). O sea, lo que está pegado hoy en el CRM va muy por delante de lo que está en el vault. Hasta recibir el prompt vigente (A1), **no hay que tomar el 29 como la versión en producción del Recepcionista**.

La numeración "(orig. N)" en cada sección remite al número del punto en el documento original de ChatGPT, para poder cruzarlo. Al final hay un mapa completo.

### Correcciones que salieron de cruzarlo con el vault

| Lo que dice el documento | Lo que dice el vault | Qué hacer |
|---|---|---|
| Marca "Black School" (orig. 23, 73) | En el vault siempre dice **Black Skull**, y el creativo oficial del cupón (2026-09-19) muestra la bolsa "WHEY 100% HD" con el logo de la calavera | Usar **Black Skull**. Si el prompt vivo dice "School", el agente se lo escribe mal a los clientes (A16) |
| "En algún registro quedó escrito Blink" (orig. 73) | No aparece "Blink" en ningún archivo del vault, siempre dice "Bling" | Nada que corregir acá; si está en otro lado es en los documentos de ChatGPT |
| "Salvar Variável y guardrails tenían problemas de persistencia" (orig. 39) | Solo los **guardrails** tienen el bug confirmado (S2). Sobre las **variables**, soporte dijo en la reunión del 14/09 que **sí persisten para siempre** (S1, cerrado) — pero eso es palabra de soporte, nunca lo probamos nosotros | Probarlo empíricamente antes de apoyar Fit Brain encima (A20) |
| "Métodos de pago no definidos para el agente" (orig. 72) | El dato **existe en el CRM**: recurso "Métodos de pago" en `Recursos → Criativos → Mensagens` (visto el 2026-09-19). Lo que falta es conectarlo al agente de Cierre (Q1) | Resolver Q1. No copiar los números de cuenta al vault |
| "API y webhooks salientes: pendiente confirmar alcance" (orig. 72) | Buena parte ya se leyó: `GET /commercial-order`, `POST .../move`, `POST /message-template/send/v2`, tags, envío libre (P5, Q16) | Sigue faltando probarla en vivo con `api-key` real |
| "Lectura de datos de campaña/anuncio de Meta: pendiente" (orig. 72) | El CRM **sí** guarda campaña/conjunto/anuncio en cada tarjeta, pero **el agente no tiene acceso a ese dato hoy** (S18) | Sigue abierto por el lado del agente |

---

## 1. La conclusión central (orig. intro)

**El problema ya no es "hacer un prompt que venda bien".** Se está construyendo una arquitectura conversacional donde cada agente tiene que saber exactamente:
- qué información puede afirmar,
- qué información tiene que obtener,
- cuándo tiene que dejar de preguntar,
- qué herramienta o etapa resuelve lo siguiente,
- y cómo mantener la ilusión de una sola conversación coherente con Santiago.

El salto de calidad viene mucho más de mejorar esa lógica que de escribir frases "más persuasivas".

## 2. Arquitectura de agentes y rol de cada uno (orig. 1, 28)

Tres agentes en producción: **Recepcionista → Conversión → Cierre**. Todos atienden desde el mismo WhatsApp y **para el cliente existe una sola persona: Santiago**. Esa continuidad es una decisión estructural, no de estilo: nunca "otro asesor", "el equipo", "te pasan", "te confirman".

Después vienen **Seguimiento/remarketing** y **Postventa/recompra**, y a futuro **Fit Brain**: una capa externa compartida entre agentes para memoria, aprendizaje, contexto del cliente, estrategia, catálogo y herramientas.

| Agente | Genera | Hace | No hace |
|---|---|---|---|
| Recepción | **Confianza** | Claridad, contexto mínimo | No recomienda SKU |
| Conversión | **Convicción** | Entiende lo poco que falte, consulta catálogo, elige UNA recomendación, explica por qué encaja, usa kits cuando tienen sentido | No presenta 5 productos por defecto |
| Cierre | **Fluidez** | Si el cliente quiere comprar, deja de vender. Resuelve objeción, cantidad, datos, pago, envío | No vuelve a diagnosticar |

Todo lo aprendido testeando Recepción ya muestra qué arquitectura necesitan los otros agentes.

## 3. El trabajo real de Recepción (orig. 2, 27)

No es "saludar → preguntar algo → cualificar → transferir". Es:

> **Reducir incertidumbre, generar confianza y no estorbar.**

No vende de más, no diagnostica de más, no inventa para parecer útil, no convierte la charla en un cuestionario, y tampoco es fría. La mejor Recepción encontrada hace cinco cosas:

1. Recibe de forma humana.
2. Entiende qué quiere resolver el cliente **ahora**.
3. Usa solamente información realmente confirmada.
4. Obtiene únicamente el dato que falta, y solo si hace falta.
5. Deja el caso preparado para que el siguiente agente siga sin repetir ni retroceder.

**El Recepcionista mejoró cuando se dejó de pedirle que "venda"** (orig. 27). Querer que cada mensaje sea persuasivo producía "es de lo más sólido", "tenemos opciones muy buenas", "excelente elección". La persuasión más fuerte no sale de frases comerciales sino de: responder rápido, entender exacto, no repetir, no inventar, hacer una pregunta relevante, mostrar que existe una solución real, mantener continuidad. **Competencia percibida > entusiasmo.**

## 4. Pregunta de descubrimiento vs. pregunta puente — el avance más importante (orig. 3, 4)

### Pregunta de descubrimiento
Se hace porque **todavía falta información imprescindible para entender o identificar la consulta**. Después de hacerla: **NO se transfiere. Se espera la respuesta.**

Caso real probado:
> Cliente: *"Quiero comprar una proteína DUX. Ya tengo decidido cuál, necesito precio y stock."*
> Agente: *"Trabajamos con DUX, sí. Para poder confirmarte bien precio y stock, decime qué proteína DUX puntual elegiste."*

La frase estuvo muy bien. **El error fue transferir inmediatamente.** El cliente sabe cuál quiere, pero nosotros no — y ese dato es indispensable para dar precio o stock.

> **Regla: la intención de compra no compensa una falta de identificación.** (intención de compra ≠ producto identificado)

### Pregunta puente
Se hace cuando el cliente **ya está suficientemente cualificado**. Existe por una **restricción técnica del CRM**:

> **Conversión solo se activa cuando entra un mensaje nuevo mientras el negocio ya está en `FV|CUALIFICACION`.**

Secuencia: Recepción manda el puente → mueve inmediatamente el negocio → el cliente responde → esa respuesta entra ya en Conversión.

**[Cruce con el vault]** Coincide con el mecanismo de [[30-traspaso-2026-09-15-noche-3-agentes]] y Q9: el Flujo "Negócio mudou de etapa" vincula el agente nuevo, que recién contesta al próximo mensaje entrante.

### El problema que apareció
El prompt anterior convertía el puente casi en obligación absoluta, y el agente empezó a **fabricar preguntas solo para satisfacer al CRM**: envío o retiro, sabores, rutina, días de entrenamiento, frecuencia de consumo, presupuesto disfrazado. Ejemplos reales:
- *"Vas a querer envío o pensás pasar a retirar por el local en Rivera?"* — el cliente nunca habló de Rivera, ubicación ni retiro.
- *"Vas a usar la whey todos los días o solo cuando entrenás?"* — el cliente solo quería validar una promoción.
- *"Entrenás en gimnasio o en casa?"* — ya había información suficiente para que Conversión tomara el caso.

> **Regla: el CRM necesita una pregunta, pero la conversación no puede deformarse para satisfacer al CRM.**
>
> **Regla (para todos los agentes): antes de preguntar algo, preguntarse qué decisión cambia según la respuesta. Si no cambia nada importante, la pregunta sobra.**

## 5. No inventar — ni siquiera dentro de una pregunta (orig. 5, 12)

El agente no afirmaba nada falso, pero **contaminaba la conversación con información inventada** en forma de ejemplo:
> *"Te acordás si en el anuncio decía algo del tamaño, por ejemplo 900 g, 1,8 kg, o algún sabor en particular?"*

Recepción no sabía si ese whey DUX existía en 900 g, 1,8 kg ni en qué sabores. Pasó lo mismo con *"monohidratado común / alguna versión con sabor / alguna versión con algún extra"* y, en una recompra, con *"saborizada o sin sabor?"*.

> **Regla: no se inventan posibilidades ni siquiera dentro de una pregunta.** Si no se conocen las opciones reales, *"Te acordás de algún detalle del producto?"* es mucho mejor que enumerar hipótesis.

Además evita un efecto psicológico: **el propio agente puede inducir al cliente a recordar algo mal**.

**Los ejemplos dentro del prompt contaminan el comportamiento** (orig. 12). Un ejemplo real del prompt tenía producto y precio; cuando el cliente pegaba un link de Instagram, el agente podía usar los datos del ejemplo como si hubiera visto el link. Cuantos más ejemplos concretos (productos, gramajes, promos, precios, variantes), más riesgo de que el modelo los trate como conocimiento comercial. Estrategia nueva:
- **menos ejemplos concretos de catálogo, más ejemplos abstractos de comportamiento** ("si falta identificar el producto, preguntar el producto");
- los datos comerciales viven donde corresponde (catálogo, herramienta, base externa, Fit Brain), **no incrustados en el prompt**.

## 6. Identificación antes que diagnóstico; suficiencia según la consulta (orig. 6, 7, 67, 68)

**Identificación antes que diagnóstico** (orig. 6). Cuando el cliente pregunta algo concreto (precio, stock, promo, presentación, qué trae un combo), el agente tiende a escaparse a preguntas deportivas: el cliente pregunta por un combo y el agente responde *"Te interesa masa, definición...?"*. Eso no resuelve lo que preguntó.

> **Regla: si hay una pregunta comercial concreta pendiente porque falta identificar el objeto, primero identificarlo.** No preguntar objetivo, experiencia, rutina ni entrenamiento hasta resolver esa incertidumbre, o hasta que el cliente muestre que no puede aportar más.

**Cuando el cliente no se acuerda** (orig. 7). "Producto no identificado → no transferir" tampoco es siempre correcto. Si el cliente dice *"Vi un whey DUX en una publicidad pero no me acuerdo cuál era"*, Recepción intenta identificar, y responde *"no, no me acuerdo"*, seguir preguntando gramaje, sabor o forma de consumo solo empeora la conversación.

> **Regla: si falta identificar algo y el cliente puede razonablemente aportar el dato → descubrimiento y espera. Si dice explícitamente que no sabe o no recuerda, y Recepción no tiene herramientas para resolverlo → no seguir interrogando.** Con suficiente contexto (marca, categoría, intención, tipo de producto, objetivo), Conversión está mejor equipada porque tiene el catálogo.

**Niveles de identificación** (orig. 67). No alcanza con una variable `producto`. Hay niveles: marca → categoría → producto → variante → SKU. Cada consulta exige un nivel distinto.

**La suficiencia depende de la consulta** (orig. 68). No existe "identificado" en abstracto, existe **"identificado suficientemente para resolver esta pregunta"**:
- *"Quiero proteína DUX y no sé cuál elegir"* → DUX + proteína **alcanza** para pasar a Conversión.
- *"Quiero proteína DUX. Ya elegí una y necesito el precio"* → DUX + proteína **no alcanza**, hace falta cuál.

Mismos datos, distinta consulta, distinto comportamiento. Esto debería vivir en Fit Brain.

## 7. Lo que el cliente afirma ≠ la verdad comercial (orig. 13, 14, 15, 16, 22, 69)

**Afirmación del cliente vs. verdad comercial** (orig. 13). *"Vi que la creatina está a $1.290"* significa que **el cliente afirma haber visto $1.290**, no que el precio actual sea $1.290. *"Vi una promo de 20%"* significa que **quiere una promo que recuerda como 20%**, no que exista. Aplica a precio, promo, descuento, regalo, stock, presentación, kit y condición de compra. Tiene que atravesar a todos los agentes.

**Una frase inocente también puede confirmar sin querer** (orig. 14). Cliente: *"Vi que llevando dos whey XTR tienen 20% de descuento."* El agente no dijo "20% confirmado", pero dijo *"para avanzar bien con la promo..."* — eso ya presupone que existe. Mejor: *"Te confirmo bien esa promo que mencionás."* Esta precisión lingüística también tiene que existir en Conversión y Cierre.

**Precio** (orig. 15). Un precio está confirmado solo si viene de: contexto comercial confirmado, anuncio realmente disponible en el contexto, herramienta, o dato previamente confirmado. **Nunca** del cliente, de memoria aparente, de un ejemplo del prompt ni de un link. Formato aprobado: **`$890`, `$1.290`**. Nunca "890 pesos uruguayos", "UYU 890", "UY$890". Si el producto no está suficientemente identificado, **primero identificar** — no usar el precio como excusa para hacer diagnóstico.

**Presupuesto: prohibido de verdad, incluidas las versiones disfrazadas** (orig. 16). La regla ya existía, pero apareció esto:
> *"Preferís priorizar que el kit sea lo más accesible posible o te interesa una opción más completa aunque sea más cara?"*

Es preguntar presupuesto indirectamente. La prohibición incluye: barato vs. completo, económico vs. premium, "hasta cuánto", "qué rango", "cuánto querés gastar". **Excepción:** si el cliente dice espontáneamente *"no quiero gastar mucho"*, ese dato es muy valioso — se guarda como **sensibilidad/prioridad de precio** y se usa sin volver a preguntarlo.

**Compras anteriores** (orig. 22). *"Quiero la misma creatina que compré la otra vez."* Pregunta interna: **¿el historial realmente identifica el SKU?** Si sí, usarlo en silencio. Si no, pedir el mínimo dato — sin inventar "saborizada o sin sabor", gramajes ni marca probable. Si responde *"no me acuerdo"*, no interrogar eternamente: Conversión puede estar mejor equipada.

**Guardar intención y confirmar realidad son dos capas distintas** (orig. 69). Se puede guardar *"quiere Creatina XTR 2 kg sabor frutilla"* aunque no se sepa si existe — es el deseo del cliente, y está bien. El error aparece solo si después alguien lee esa variable como *"Fitness tiene Creatina XTR 2 kg frutilla"*. Las variables necesitan semántica clara (ver §21).

## 8. Anuncios y links: dejaron de ser "verdad automática" (orig. 11)

Se separó radicalmente el **LINK** del **CONTENIDO REAL DEL ANUNCIO DISPONIBLE EN EL CONTEXTO**:
- Si el CRM trae realmente producto, precio, promo o presentación → se puede usar.
- Si el cliente pega solo `instagram.com/...` → Recepción **no sabe qué hay ahí**. Respuesta correcta: *"Por acá no puedo ver el contenido de ese link. Me decís qué producto aparece?"*

Este arreglo funcionó en las pruebas.

**[Cruce con el vault]** Hoy el agente no tiene acceso a los datos de campaña/anuncio que el CRM sí guarda en cada tarjeta (S18) — por eso, en la práctica, casi siempre va a estar en el segundo caso.

## 9. Responder primero, ambigüedad y referencias (orig. 17, 19, 20, 66)

**Responder primero lo que preguntaron** (orig. 17). Parece obvio y los agentes lo violan muchísimo:
- *"cómo pago?"* → el agente pregunta *"Vas a retirar o querés envío?"*. Mal.
- *"cuánto sale esa promo?"* → *"cuál es tu objetivo?"*. Mal.
- *"cuánto demora a Montevideo?"* → tiene que empezar por *"El plazo informado es de 12 a 48 horas."* y después, si suma, *"Despachamos el mismo día de la compra."*

Esto aumenta muchísimo la sensación de inteligencia.

**Error grave aprendido con "eso es seguro?"** (orig. 19). Después de hablar del envío, el cliente escribió *"eso es seguro o que?"*. El agente asumió que hablaba de la seguridad física del paquete e **inventó "paquetes cerrados y número de seguimiento"**. Dos errores: la frase era ambigua (¿seguro el plazo? ¿seguro enviar?) e inventó tracking y embalaje.

> **Regla: cuando una frase breve tiene varias interpretaciones que llevan a respuestas distintas, aclarar antes de asumir.**

**"Sí", "dale", "esa" necesitan resolver la referencia** (orig. 20). Si se presentaron A, B y C y el cliente dice *"ta quiero esa"*, el agente **no puede elegir cuál**. Conversión hizo exactamente eso en una prueba y asumió un kit específico. **Si hay más de un referente posible, aclarar**: *"La de $1.990 o la otra opción?"*, con lenguaje natural y sin reiniciar la conversación. Crítico para Conversión y Cierre.

**Noción explícita de "pregunta pendiente"** (orig. 66). Si el cliente pregunta *"sigue a $1.290?"*, el estado interno es `pending_question = current_price`, y mientras siga pendiente el agente no se desvía a objetivo, rutina o sabor. Fit Brain puede ayudar mucho acá.

## 10. Bienvenida y la sensación de "llegué al lugar correcto" (orig. 8, 9, 10, 70, 71)

**Bienvenida** (orig. 8). La frase que se consideró más adecuada:
> **"Buenas Santi, cómo estás? Santiago de Fitness Suplementos por acá, un gusto saludarte."**

Es cálida, dice quién habla y de qué empresa, no exagera la informalidad, no es seca y no suena a vendedor desesperado. **Descartada** como apertura principal: *"Buenas Santi, cómo va?"* (demasiado seca). No hace falta variar el saludo artificialmente — puede empeorar la consistencia. Lo importante: primera interacción → bienvenida cuidada; después, **no volver a presentarse**. Si hubo una **conversación real** anterior, se puede usar a veces *"Qué bueno verte por acá de nuevo."* — pero **un ticket, anuncio o registro técnico no demuestra relación previa**.

**[Cruce con el vault]** Esta frase reemplazaría a la bienvenida documentada en Q13b ("Buenas! Como estás, [Nombre]? Por acá te habla Santiago, asesor de Fitness Suplementos..."). Como el vault no tiene el prompt vivo (A1), no se sabe cuál está pegada hoy.

**"Llegué al lugar correcto"** (orig. 9). El control anti-alucinación había empujado a Recepción a ser demasiado neutral. El usuario quiere que **la persona sienta desde el principio que Fitness tiene soluciones para lo que necesita** — y está **confirmado que Fitness trabaja con kits para distintos objetivos**. La construcción que gustó mucho:
> **"Sí, para aumentar masa tenemos buenas opciones y también trabajamos con kits pensados para ese objetivo. Contame qué es lo que más te está costando hoy para subir masa?"**

No significa mencionar kits en todas las conversaciones: funciona cuando el lead llega por **objetivo, necesidad o pedido de asesoramiento**, sin un producto decidido. Recepción comunica que hay opciones y kits pensados para eso; Conversión demuestra cuál corresponde.

**Qué NO hace Recepción con los kits** (orig. 10). Que existan kits no habilita a inventar nombre, composición, precio, stock, beneficio ni cantidad de productos. Nada de *"tenemos el kit perfecto"*, *"el mejor kit"*, *"te va a servir sí o sí"*. Se comunica **capacidad comercial real**, no una recomendación todavía no hecha. Si el cliente ya pidió exactamente *"Creatina XTR 1 kg"*, no se lo interrumpe con *"También tenemos kits"* — eso es venderle algo que no pidió.

**"La mejor experiencia" no requiere mentir sobre ser los mejores** (orig. 70). Nada de *"somos los mejores"*. La experiencia tiene que producir esa conclusión: rapidez, certeza, buen producto, buena recomendación, precio competitivo, opciones, kits, continuidad, seguridad.

**Vender sin volverse agresivo** (orig. 71). *"Tenemos buenas opciones y trabajamos con kits pensados para ese objetivo"* es el equilibrio exacto: no inventa, pero sí vende capacidad. Este tipo de **venta basada en verdad comercial general** conviene ampliarlo con cuidado.

## 11. Marcas (orig. 23, 24)

Marcas trabajadas hoy: **DUX, XTR, Vitamin Horse, Integralmédica, Black Skull** *(el documento dice "Black School" — ver la corrección del §0 y A16)*.

Formato: *"trabajamos **con** XTR"*, no *"trabajamos XTR"*.

Escalonamiento que redujo muchas alucinaciones:
> **marca trabajada ≠ producto trabajado ≠ variante disponible ≠ stock actual**

**Marca no trabajada** (orig. 24), ej. Growth:
> *"Con Growth por el momento no estamos trabajando."*

Se puede ofrecer **una** alternativa (no diez), sin afirmar *"XTR es mejor / es la que más sale / es superior"*. Si acepta mirar la alternativa → pasa a asesoramiento. Si dice *"solo quiero Growth"* → no insistir, ni mandar a Conversión a rescatar una venta que el cliente ya rechazó.

## 12. Logística confirmada (orig. 18)

| Dato | Valor confirmado |
|---|---|
| Ubicación | Rivera, Uruguay — local físico en **Av. Tamandaré 2719** |
| Retiro | Se puede retirar en el local |
| Envío | Por **DAC** o **agencia de preferencia del cliente**, a todo Uruguay |
| Despacho | **Mismo día de la compra** |
| Entrega | **12 a 48 horas** |

**Despacho ≠ entrega** — son dos cosas distintas y el agente tiene que diferenciarlas.

**Explícitamente NO confirmados** (el agente no los puede afirmar): tracking / número de seguimiento, tipo de paquete, seguro, hora límite de despacho, costo de envío, condiciones específicas de DAC. Ver A9.

**[Cruce con el vault]** Es información nueva: el vault solo tenía "envío por DAC, mismo día si es de Rivera" (sesión del 2026-09-17). El plazo de 12-48 horas y "agencia de preferencia del cliente" no estaban documentados.

## 13. Seguridad: pasó de detalle a override total (orig. 25, 26, 63)

Prueba clave: *"Quiero una proteína que no me caiga pesada porque la anterior me daba dolor de panza."* El sistema podía empezar a preguntar síntomas, diagnosticar o recomendar otra. Se consideró **incorrecto**.

Ahora, **dolor, alergia, náusea, reacción o malestar asociado a un suplemento → rompe el flujo comercial. No va a Conversión: va a Atención Humana**, sin diagnóstico, sin tranquilizar, sin ajustar dosis y sin recomendar.

**Tiene que existir en Conversión, Cierre, postventa y recompra también** — no puede ser una regla solo del Recepcionista (A4). En postventa (orig. 63): si alguien después de comprar dice *"esto me cayó mal"*, nada de remarketing, upsell ni *"probá con menos"*.

**Todavía abierto: menores y otros casos** (orig. 26). No se testeó lo suficiente. Ejemplo pendiente: *"Mi hijo tiene 15 años y quiere tomar creatina."* No debería pasar por un flujo comercial automático común sin una política clara. Hay que definir explícitamente: **menores, embarazo, lactancia, condiciones médicas, medicación, reacciones adversas** — no para que el agente diagnostique, sino para saber **cuándo detener la venta automática y escalar** (A3).

## 14. Memoria y continuidad (orig. 21, 64, 65)

**El agente no narra su memoria** (orig. 21). Frases como *"anoto..."*, *"quedó claro..."*, *"ya decidiste..."*, *"vemos que..."* suenan a sistema. Ejemplo real malo:
> *"Ya tenés decidido que querés creatina y proteína y que no se vaya mucho de precio, perfecto."*

El cliente lo acababa de decir; no agrega nada. Lo correcto es **usar esa información en silencio**. Cuanta más memoria tenga el sistema (Fit Brain), **menos tiene que presumir de memoria**: se nota por no repetir preguntas, recordar criterios y seguir naturalmente, no por decir *"recuerdo que..."*.

**Ningún agente puede tener "su propia verdad"** (orig. 64). Riesgo arquitectónico serio: Recepción cree stock X, Conversión stock Y, Cierre stock Z. Hacen falta **fuentes compartidas** (Fit Brain o herramientas compartidas). Los prompts solo contienen reglas, roles y estilo — **no datos comerciales que cambian**.

**Los traspasos tienen que llevar estado estructurado** (orig. 65), no solo el texto del historial. Cuando Recepción pasa a Conversión, el siguiente agente debería saber directamente:

```text
intent
product_interest
objective
customer_claims
confirmed_facts
price_sensitivity
alternative_acceptance
unresolved_question
purchase_intent
safety_state
```

## 15. Estilo y prioridades de calidad (orig. 52, 53, 54)

**No optimizar estilo antes que lógica** (orig. 52). Varias conversaciones "sonaban lindas" pero iban mal encaminadas: *"Para orientarte mejor..."* suena natural, pero si el cliente preguntó *"cuánto sale?"* y se lo desvió a entrenamiento, sigue siendo mala respuesta. Orden de prioridades:

> **correctitud → routing → relevancia → fluidez → persuasión → estética lingüística**

**Humanización real ≠ relleno** (orig. 53). Evitar *Perfecto, Genial, Buenísimo, Te entiendo, Te ayudo con eso, Dale* cuando funcionan solo como relleno. *"No pasa nada, con eso ya me doy una idea"* fue especialmente malo: el cliente no había dado información nueva. Humanizar de verdad es recordar, no repetir, hacer la pregunta exacta, adaptarse al ritmo, responder directo y usar la información previa.

**Estilo consolidado** (orig. 54):
- WhatsApp. **Vos.** Español uruguayo/rioplatense sin exagerar.
- Sin `¿` ni `¡`. Sin `/`. Sin listas para el cliente. Sin Markdown. Sin `..`. Sin signos duplicados.
- Sin *che, bo, pikas, fair point, buenazo*.
- Emojis muy ocasionales, **nunca como mecanismo para parecer humano**.
- Precio corto.
- **Máximo una pregunta por mensaje.**

## 16. Conversión: problemas detectados y reglas nuevas (orig. 29, 30, 31, 55-59)

Aunque la mayoría de las pruebas recientes fueron de Recepción, **en Conversión aparecieron errores serios** (orig. 29). En una conversación el cliente quería dos creatinas y una proteína, y pagar rápido. Conversión:
1. Explicó un proceso no confirmado: *"primero te paso una propuesta y después vas a tener opciones de pago"*.
2. Dijo que cierta creatina XTR **no estaba disponible** y más adelante que **sí había** una Hyper Creatine XTR — **contradicción de hechos comerciales**.
3. Presentó varias alternativas; el cliente dijo *"ta quiero esa"* y **el agente eligió una arbitrariamente**.
4. El cliente pidió pagar repetidas veces; Conversión **siguió hablando y repitiendo**.
5. Prometió *"te paso con..."* / *"el equipo..."*, **rompiendo la continuidad de Santiago**.
6. Aparentemente **no ejecutó la transferencia**.

El lead empezó interesado y terminó diciendo que **capaz no compraba** porque el sistema seguía repitiendo lo mismo (ver §17).

**Regla STOP SELLING** (orig. 30):
> Cuando el cliente demuestra una intención inequívoca de comprar una opción suficientemente identificada, dejá de recomendar, comparar y persuadir. Resolvé únicamente los datos indispensables que faltan y avanzá al cierre.

Frases que la activan: *"quiero esa"*, *"pasame para pagar"*, *"necesito ahora"*. Un agente puede ser excelente vendiendo y **perder clientes por seguir vendiendo después de que el cliente ya cerró la venta en su cabeza**.

**Catálogo ≠ stock — requiere auditoría técnica, no texto** (orig. 31). La contradicción de XTR puede venir de: búsqueda incompleta, fila no encontrada, producto que está dentro de un kit pero no individual, consultas distintas, datos desactualizados, o mala interpretación de la herramienta. **Todavía no se sabe cuál.** Hay que auditar qué consulta hizo, qué devolvió Google Sheets o Bling, qué SKU encontró, qué disponibilidad venía, y si kit e individual usan fuentes distintas (A5).

**UNA recomendación** (orig. 55). Sigue siendo correcto: con cliente que necesita asesoramiento, no entregar catálogo (*"tenemos A, B, C, D, E"*). Elegir **una** opción y explicarla como **lo que me contaste → por qué esto encaja → qué aporta**. Recién ante una objeción, una alternativa. Reduce la parálisis y se siente más asesorado.

**Los kits cambian la estrategia de Conversión** (orig. 56). Tiene que poder decidir entre SKU individual y kit — **no automáticamente kit**: depende del objetivo, nivel del cliente, pedido explícito, productos que ya quiere, criterio de precio y disponibilidad. Un kit no es mejor por definición; a veces es la solución más coherente.

**Descripciones del catálogo** (orig. 57). Ayudan a explicar valor, pero **el agente no recita `descripcion_base` completa**: extrae solo la parte que conecta con la necesidad concreta (conveniencia si busca conveniencia, lo relevante para masa si busca masa). No ficha técnica.

**`frase_venta` no se copia literal** (orig. 58). Es orientación. Copiada siempre igual, a escala de miles de conversaciones se vuelve obvia. Fit Brain podría adaptarla según tipo de cliente, historial, objetivo y ritmo.

**Ritmo y estilo del cliente** (orig. 59). Siguen siendo útiles las variables `estilo_comunicacion` (directo / acompañamiento) y `ritmo` (rápido / pausado). Si escribe *"precio?"*, no se le contestan tres párrafos. Si explica mucho y pide ayuda, se puede acompañar un poco más. Podría aprenderse automáticamente (Fit Brain) en vez de preguntarse.

## 17. Cierre: urgencia y el routing de compra directa (orig. 41, 42, 43, 44)

**El problema de routing más grande sin resolver** (orig. 41). Cliente: *"quiero comprar esto ahora"*, *"cómo pago?"*, *"pasame el link"*. Si el pedido ya está suficientemente definido:
- **Opción A:** Recepción → directo a Cierre.
- **Opción B:** Recepción → Conversión, que detecta el pago y transfiere de inmediato.
- **Opción C (híbrida):** pedido completamente definido → Cierre; producto todavía indefinido → Conversión breve.

**El cliente no debería atravesar Conversión solo porque el diagrama dice que todas las flechas pasan por ahí.** Todavía sin decidir (A8).

**Qué herramientas tiene Cierre** (orig. 42). Condición previa para decidir lo anterior: si Cierre puede consultar precio, stock y producto, muchos compradores decididos pueden saltearse Conversión. Si no puede, mandarle un pedido incompleto crea otro problema. **Antes de cambiar el routing hay que revisar el prompt y las herramientas reales de Cierre** (A7).

**Cierre optimiza time-to-payment** (orig. 43). Si alguien dice *"necesito comprar ahora"* o *"pasame para pagar"*, **cada turno extra tiene costo comercial**. Cierre optimiza el tiempo hasta el pago, no la calidad del diagnóstico. La prueba de Conversión (§16) lo mostró: el lead empezó interesado y terminó dudando por la repetición.

## 18. Remarketing y postventa (orig. 60, 61, 62, 63)

**Remarketing** (orig. 60). No puede pensar *"este lead vino de un anuncio de creatina hace 3 meses, entonces todavía quiere creatina"*. **Historial ≠ intención actual.** Se usa como contexto (*"la última vez habías consultado por X"*) solo si aporta. Cualquier precio, promo o stock de hace meses **se vuelve a verificar**. Crítico para las campañas masivas.

**Ventanas de Meta** (orig. 61). Las plantillas, las ventanas de conversación que vienen de anuncios y los mensajes iniciados por la empresa **se gestionan por automatización**. El agente **no tiene que sonar distinto** porque internamente esté dentro o fuera de una ventana: para el cliente sigue siendo Santiago.

**[Cruce con el vault]** Coincide con el diseño de 3 pasos de [[31-envio-masivo-remarketing-cupon]]: plantilla aprobada reabre la ventana → responde → recién ahí mensaje libre.

**Postventa/recompra** (orig. 62). Puede ser extremadamente fuerte si la memoria es buena: debería conocer qué compró, cuándo, la frecuencia esperada, preferencias y objeciones anteriores. Misma regla: **memoria real, no inventada**. Si no puede identificar la compra anterior, no adivina. Probablemente sea donde Fit Brain más valor genere. Seguridad: igual que en §13.

## 19. Catálogo y fuentes de verdad (orig. 32, 33, 34, 35)

**Catálogo actual** (orig. 32). Planilla curada de 10 productos. Campos: nombre, categoría, marca, precio, link, ranking de ventas, posición, objetivo, SKU, `disponible_web`, `descripcion_base`, `sabores_disponibles`, `frase_venta`. Uso: producto exacto → "Buscar fila"; categoría u objetivo → "Obtener hoja por lote". **`ranking_ventas` solo como desempate**, nunca como recomendador principal. Jerarquía: encaje con el cliente → objetivo → disponibilidad → criterios → ranking.

**[Cruce con el vault]** Es `catalogo-agente-curado` (Q2). Ojo con E9: el ranking de Shopify **no es dato oficial de ventas** — el orden real hay que sacarlo de Bling.

**El catálogo va a tener que crecer, sobre todo con los kits** (orig. 33). Campos que probablemente falten: `tipo_producto`, `es_kit`, `productos_del_kit`, `objetivos_compatibles`, `precio_actual`, stock real, timestamp de actualización, estado comercial, promoción actual, fuente del precio, fuente del stock. No todo tiene que vivir en Google Sheets, pero quien consulte el catálogo necesita una estructura explícita; si no, se termina infiriendo demasiado desde `descripcion_base` o `frase_venta` (A12).

**Separar las fuentes de verdad** (orig. 34). Hoy existen varias fuentes posibles: Google Sheets, Bling, Shopify, el anuncio, el mensaje del cliente, el historial del CRM y el prompt. No tienen la misma autoridad. Propuesta de jerarquía:

| Dato | Fuente con autoridad |
|---|---|
| Stock | Bling |
| Precio vigente | Fuente comercial elegida (a definir) |
| Descripción | Catálogo curado |
| Lo que el cliente cree | La conversación |
| Promo | Sistema de promociones / anuncio vigente |

**El agente no resuelve contradicciones entre fuentes por intuición** (A11).

## 20. Fit Brain (orig. 35, 36, 37, 38, 78, 79)

**Tiene que devolver la procedencia de cada dato** (orig. 35), no solo `precio = 1290`:

```text
precio:
  valor: 1290
  estado: confirmado
  fuente: catalogo_actual

precio_mencionado_cliente:
  valor: 1290
  estado: no_verificado
```

Lo mismo para promo, stock, producto y variante. Eliminaría muchísimas alucinaciones.

**Su razón de existir: separar el razonamiento comercial de la redacción** (orig. 36). La idea inicial era memoria y aprendizaje. Después de las pruebas aparece otra función clave: rmsystemm sigue generando el WhatsApp, pero Fit Brain devuelve algo así:

```text
estado = asesoramiento
intencion = elegir suplemento
objetivo = aumentar masa
producto_identificado = false
seguridad = false
dato_faltante = dificultad_principal
accion = preguntar
tipo_pregunta = puente
transferir_despues = true
contexto_comercial = existen kits para este objetivo
```

Y el modelo **solo redacta**. Es mucho más robusto que un prompt gigante que tenga que descubrir al mismo tiempo estado, memoria, herramienta, catálogo, routing, seguridad y estilo.

**Arquitectura futura razonable** (orig. 37):

> **WhatsApp → rmsystemm → Fit Brain → herramientas/datos → estrategia → rmsystemm → mensaje**

Fit Brain **recibe**: mensaje nuevo, ID del cliente, historial relevante, etapa, variables, origen, último agente, datos del anuncio. **Consulta**: memoria del cliente, memoria comercial, catálogo, stock, promos, reglas aprendidas. **Devuelve**: intención, estado, hechos confirmados, afirmaciones del cliente, restricciones, estrategia, siguiente acción, transferencia recomendada, datos comerciales verificados.

**Las reglas globales se vuelven consistentes ahí** (orig. 78). rmsystemm podría recibir un bloque corto (*estrategia recomendada / hechos / restricciones / siguiente acción*) y el prompt del agente solo controlar rol, voz y redacción. Reduciría muchísimo la fragilidad.

**El aprendizaje no es "el modelo aprende solo de cada conversación"** (orig. 79). Un aprendizaje comercial robusto aprende de ventas reales, abandonos, respuestas posteriores, objeciones y resultados — no de "esta frase apareció en una conversación". Fit Brain podría acumular patrones (*clientes que dicen X y después compran Y; la objeción X se resuelve mejor con la explicación Y*), pero con **validación, agregación y límites**: una conversación rara no puede cambiar el comportamiento global.

### ⚠️ La incertidumbre técnica crítica (orig. 38)

**Falta confirmar si rmsystemm puede hacer una llamada externa y usar el resultado dentro del contexto del agente ANTES de generar la respuesta.** Si no puede, la arquitectura cambia (A10).

**[Cruce con el vault]** Dos caminos concretos a probar, armados con lo que ya se sabe de la plataforma (son **hipótesis**, no hechos):

1. **Herramienta HTTP del propio agente** (tool call durante la generación): por diseño, en un tool-calling el resultado entra al contexto antes de la respuesta final. Riesgos ya conocidos: depende de que el modelo decida llamarla, y soporte dijo que si el HTTP falla el agente inventa (S7).
2. **Flujo de Automatización antes de la respuesta**: gatillo de mensaje recibido → nodo "Requisição HTTP" a Fit Brain → "Salvar Variável" → el agente lee la variable al responder. Es determinístico, pero la carrera de tiempos es desconocida. Dato que puede jugar a favor: el agente tiene configurado un **delay de respuesta de 25 s** (P3). Si el Flujo termina en ese margen, la variable ya estaría guardada cuando el agente genere. No probado.

## 21. Variables: persistencia y semántica (orig. 39, 40)

**Persistencia** (orig. 39). Una conversación de varias etapas necesita preservar `objetivo_lead`, `interes_inicial`, `ultimo_producto_comprado`, `anuncio_origen`, `estilo_comunicacion`, `ritmo`. Si el CRM "guarda" visualmente pero el dato no persiste de forma confiable, no se puede diseñar suponiendo que sí.

**[Cruce con el vault]** El bug confirmado de backend es el de los **guardrails** (S2). Sobre las **variables**, soporte dijo el 14/09 que **sí persisten para siempre** (S1). Pero es palabra de soporte, nunca lo probamos nosotros — hay que probarlo antes de apoyar Fit Brain encima (A20).

**Semántica más precisa** (orig. 40). `interes_inicial = quiere promo del 20%` no puede leerse después como *"promo del 20% confirmada"*. La variable representa **lo que el cliente quiere o afirma**, no la realidad comercial. Conceptualmente habría que separar `cliente_afirma` de `dato_confirmado`, aunque el CRM actual no use esos nombres.

## 22. Métricas, testing y observabilidad (orig. 44-48)

**Métrica nueva: fricción después de la intención de compra** (orig. 44). Además de atención, conversión, primera respuesta, recompra y abandono:
- **cantidad de mensajes desde una señal clara de compra hasta la acción de pago** (cuanto menos, mejor);
- **% de compradores que muestran impaciencia después de decir que quieren pagar**.

**Métricas de calidad del agente** (orig. 45): tasa de alucinación comercial (precio/stock/promo no confirmados), tasa de transferencia incorrecta (puente vs. descubrimiento), preguntas innecesarias por conversación, repetición, preguntas ya respondidas, fallas de continuidad de Santiago ("te pasan", "el equipo"), ambigüedad mal resuelta, escalamiento de seguridad correcto, contradicciones de herramienta, turnos antes de la primera recomendación, turnos desde la intención hasta el pago (A17).

**Suite permanente de regresión** (orig. 46). Convertir los mejores tests manuales en un set fijo que se corre después de cada cambio de prompt — para dejar de *"arreglar una cosa y romper tres anteriores"* (A13):

| Test | Caso |
|---|---|
| T01 | Marca + producto no identificado + quiere stock |
| T02 | Link sin contenido |
| T03 | Promo aportada por el cliente |
| T04 | Producto exacto sin stock confirmado |
| T05 | Compra anterior no identificada |
| T06 | Cliente no recuerda el anuncio |
| T07 | Objetivo + necesita recomendación |
| T08 | Intención de pago |
| T09 | Salud |
| T10 | Marca no trabajada |
| T11 | "Esa" con tres referentes |
| T12 | Pregunta logística ambigua |

Cada test define: mensaje inicial, estado esperado, tipo de pregunta esperado, si transfiere o no, variable esperada, información prohibida y agente destino.

**El resultado esperado incluye acciones, no solo texto** (orig. 47). Una respuesta puede sonar perfecta y estar técnicamente mal — el caso DUX: texto excelente, transferencia incorrecta. Cada test revisa: **mensaje, variable guardada, etapa, agente asignado, herramienta llamada, datos usados y momento de la transferencia**.

**Observabilidad** (orig. 48). Para cada conversación, idealmente ver internamente (no para el cliente):

```text
intencion_detectada
estado_detectado
producto_identificado
seguridad
pregunta_tipo
razon_pregunta
herramienta_consultada
resultado_herramienta
variable_guardada
transferencia_destino
```

Reduciría muchísimo el tiempo para descubrir por qué el agente hizo algo (A18).

## 23. Diseño del prompt (orig. 49, 50, 51, 74, 75, 77)

**El prompt anterior era demasiado grande y redundante** (orig. 49). La última versión que recibió ChatGPT tenía **2.751 líneas**. No era mala — contenía mucha inteligencia acumulada — pero tenía reglas duplicadas, ejemplos repetidos, checks repetidos, e instrucciones correctas localmente que entraban en conflicto a nivel global. Ejemplo: una sección sugería explícitamente usar *envío vs. retiro* como puente ante intención de pago, y las pruebas mostraron que eso generaba justo el comportamiento no deseado. La sección final de control tenía muchas preguntas que verificaban esencialmente el mismo principio. Dirección nueva: **menos reglas repetidas, más jerarquía.**

**Orden que funciona mejor** (orig. 50):
1. **Principios** — qué puede saber, qué no puede inventar, qué priorizar.
2. **Decisión** — qué quiere el cliente, qué falta, descubrimiento vs. puente, routing.
3. **Casos especiales** — anuncios, precio, promos, compras previas, seguridad.
4. **Estilo** — al final.

No repetir la misma regla en nueve secciones.

**Control de calidad corto** (orig. 51). Con ~70 preguntas mentales antes de cada respuesta, el modelo pierde prioridades. Checklist compacto basado en principios:

1. ¿Qué pidió?
2. ¿Qué está confirmado?
3. ¿Qué falta?
4. ¿Estoy inventando?
5. ¿Descubrimiento o puente?
6. ¿Estoy preguntando algo útil?
7. ¿Hay tema de seguridad?
8. ¿Estoy manteniendo a Santiago?
9. ¿Estoy facilitando si ya quiere comprar?

**Versionado de prompts** (orig. 74). No más *editar → pegar → probar*. Versiones `recepcion-v1.0`, `recepcion-v1.1`, etc., y por cada una: cambios, suite de tests, resultados y regresiones. Esencial cuando haya cinco agentes (A14).

**Versionar el comportamiento, no solo el texto** (orig. 75). IDs de regla, por ejemplo:
- `R-014` No inventar variantes en preguntas
- `R-021` La señal de compra detiene el diagnóstico
- `R-032` La promo aportada por el cliente no está verificada

Cuando aparece una falla se puede decir *"violó R-014"* — ayuda mucho para trabajar con Claude Code, GitHub y la documentación.

**Reglas globales + reglas propias por agente** (orig. 77). No copiar el mismo bloque de 200 reglas en cinco prompts:
- **Global**: identidad Santiago, estilo, seguridad, no inventar, fuentes de verdad, memoria, ambigüedad.
- **Recepción**: descubrimiento, cualificación, puente.
- **Conversión**: diagnóstico, consulta de catálogo, recomendación.
- **Cierre**: objeción, compra, pago, datos.

Evita que los agentes diverjan (A15).

**[Cruce con el vault]** [[29-prompts-por-columna]] ya tiene "El bloque de estilo común (va idéntico en los 5 prompts)" y "Otras reglas transversales" — es un primer paso en esa dirección, pero el bloque global propuesto acá es bastante más amplio (incluye seguridad, fuentes de verdad, memoria y ambigüedad).

## 24. Organización del repositorio (orig. 76) — propuesta, NO aplicada

ChatGPT propone separar el vault por áreas, algo como:

```text
00-resumen          01-arquitectura      02-reglas-globales
10-recepcion        11-conversion        12-cierre
13-seguimiento      14-recompra          20-catalogo
21-herramientas     22-fit-brain         23-conectores
24-testing          25-estado            26-metricas
27-incidentes       28-pendientes-soporte
```

No porque hagan falta esos números exactos, sino porque un único Markdown gigante se vuelve difícil de mantener. **No se aplicó**: renumerar rompería los `[[wikilinks]]` de todo el vault y ya hubo dos colisiones de numeración este mes. Queda como decisión del usuario (A19).

## 25. Prioridades por fases (orig. 80)

> **Antes de optimizar conversión, estabilizar precisión.**

1. **Fase 1** — eliminar errores de lógica.
2. **Fase 2** — eliminar alucinaciones.
3. **Fase 3** — reducir fricción.
4. **Fase 4** — mejorar persuasión.
5. **Fase 5** — aprender a escala.

No al revés: hacer más persuasivo un agente que todavía puede inventar stock solo aumenta el impacto del error.

## 26. Lo que todavía NO se sabe (orig. 72)

| Tema | Estado según el documento | Dónde está en el vault |
|---|---|---|
| Métodos de pago reales | "No definidos para el agente" | **Existen en el CRM** (recurso "Métodos de pago"); falta conectarlo a Cierre → **Q1** |
| Costos de envío | No confirmados | **A9** |
| Tracking | No confirmado | **A9** |
| Horario límite de despacho | No confirmado | **A9** |
| Embalaje / seguro | No confirmado | **A9** |
| Herramientas de Cierre | Necesario para decidir el routing | **A7** |
| Acceso de Conversión a stock real vs. catálogo | Contradicciones a auditar | **A5** |
| ¿La pestaña Prueba ejecuta conectores o solo el prompt? | Pendiente | **S19** |
| Persistencia de variables | Pendiente (bug reportado) | S1 dice que persisten (según soporte); probar → **A20** |
| Guardrails | Bug de backend | **S2** |
| API y webhooks salientes | Pendiente confirmar alcance | Parcial: **P5, Q16** |
| Lectura de datos de campaña/anuncio de Meta | Pendiente | **S18**: el agente no accede hoy |
| Shopify y carrito abandonado | Pendiente | **S17, N8** |
| Costo del Copiloto y de la transcripción | Pendiente | **S4, S8** |
| Inyección de la respuesta de Fit Brain antes de responder | **Crítico** | **A10** |

## 27. Inconsistencias de nombres (orig. 73)

- **Bling vs. "Blink"**: el documento dice que en algún registro quedó "Blink". **Verificado**: en el vault no aparece, siempre dice "Bling".
- **"Black School"**: el documento sugiere conservar esa grafía hasta confirmarla. **Evidencia en contra**: el vault dice **Black Skull** y el creativo oficial del cupón muestra la marca con logo de calavera en la bolsa "WHEY 100% HD". Usar **Black Skull** y confirmarlo contra el catálogo/Bling (A16).

## 28. Lo consolidado en Recepción (orig. 81) — ⚠️ INCOMPLETO

Puntos que ChatGPT **no volvería a cuestionar salvo evidencia nueva** (el mensaje se cortó en el cuarto):
- La conversación siempre parece Santiago.
- Saludo cálido.
- Responder primero.
- No inventar.
- Link ≠ contenido.
- *(cortado en "Cliente di…")*

**Falta el resto de este punto y todo lo que venía después** (A2).

---

## Anexo — Mapa punto original → sección

| Orig. | Sección | Orig. | Sección | Orig. | Sección |
|---|---|---|---|---|---|
| intro | §1 | 28 | §2 | 56 | §16 |
| 1 | §2 | 29 | §16 | 57 | §16 |
| 2 | §3 | 30 | §16 | 58 | §16 |
| 3 | §4 | 31 | §16 | 59 | §16 |
| 4 | §4 | 32 | §19 | 60 | §18 |
| 5 | §5 | 33 | §19 | 61 | §18 |
| 6 | §6 | 34 | §19 | 62 | §18 |
| 7 | §6 | 35 | §20 | 63 | §13, §18 |
| 8 | §10 | 36 | §20 | 64 | §14 |
| 9 | §10 | 37 | §20 | 65 | §14 |
| 10 | §10 | 38 | §20 | 66 | §9 |
| 11 | §8 | 39 | §21 | 67 | §6 |
| 12 | §5 | 40 | §21 | 68 | §6 |
| 13 | §7 | 41 | §17 | 69 | §7 |
| 14 | §7 | 42 | §17 | 70 | §10 |
| 15 | §7 | 43 | §17 | 71 | §10 |
| 16 | §7 | 44 | §17, §22 | 72 | §26 |
| 17 | §9 | 45 | §22 | 73 | §27 |
| 18 | §12 | 46 | §22 | 74 | §23 |
| 19 | §9 | 47 | §22 | 75 | §23 |
| 20 | §9 | 48 | §22 | 76 | §24 |
| 21 | §14 | 49 | §23 | 77 | §23 |
| 22 | §7 | 50 | §23 | 78 | §20 |
| 23 | §11 | 51 | §23 | 79 | §20 |
| 24 | §11 | 52 | §15 | 80 | §25 |
| 25 | §13 | 53 | §15 | 81 | §28 (incompleto) |
| 26 | §13 | 54 | §15 | 82+ | **no llegó** |
| 27 | §3 | 55 | §16 | | |
