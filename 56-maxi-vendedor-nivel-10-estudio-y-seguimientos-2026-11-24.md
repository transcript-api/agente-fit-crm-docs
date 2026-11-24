# Maxi: estudio para un vendedor nivel 10 y los seguimientos corregidos (2026-11-24)

Pedido del dueño, 24/11 a la madrugada:
- Estudiar a fondo cómo se comunica el agente que programa, cómo interpreta las cosas y cómo las interpreta Maxi, con referentes reales.
- La meta es un vendedor nivel 10, que se mejore solo sin parar y sin romper nada. Dinámico, que genere intimidad y buen ping-pong, que sepa cuándo hacer un chiste, que suba el ticket con criterio y que el cliente sienta que paga poco por la solución.
- Sin cambios bruscos. Revisar todos los agentes. Buscar referentes en video con Lince.

## 1. Qué se estudió

Cuatro líneas en paralelo, con fuentes citadas:

| Tema | Referentes |
|---|---|
| Cómo leen las instrucciones los modelos | Guías oficiales de Anthropic y OpenAI, el Model Spec, 12-factor-agents y papers medidos (contexto largo, ejemplos, adulación, humor de los modelos) |
| Cómo mejorar un agente sin romperlo | Hamel Husain, Shreya Shankar, Eugene Yan, DSPy, GEPA y equipos que corren agentes para muchos negocios |
| Cómo venden los mejores en una charla | Datos de Gong Labs, Chris Voss, SPIN, Challenger, NEPQ, Alex Hormozi, Cialdini y estudios de psicología sobre intimidad por texto, humor y precio |
| Videos con Lince | Voss, Jeremy Miner, Hormozi, la charla de Anthropic sobre prompts, Hamel y Shreya, Aaker y Bagdonas (humor), un referente en español de venta por WhatsApp |

## 2. Lo más útil

- **El modelo lee literal.** Si dos partes del sistema dicen cosas distintas, elige una. Hay que decirle qué hacer y por qué, con el largo en números y pocos ejemplos variados, porque los ejemplos se copian.
- **Lo más típico gana.** El modelo repite la frase más común. Lo que tiene un tope, como el poco stock, se cuenta en el código.
- **Una palabra cambia la conducta.** Por eso cada cambio se prueba de a pares: la versión nueva contra la instalada, con los mismos clientes.
- **Un vendedor nivel 10 en chat:**
  - turnos cortos al ritmo del cliente;
  - reconocer antes de responder;
  - que el cliente diga con sus palabras por qué lo quiere;
  - intimidad con cosas verdaderas del negocio, nunca una vida inventada;
  - que el precio pese menos subiendo la seguridad y bajando la espera y el esfuerzo;
  - siempre un siguiente paso, y un último mensaje cálido compre o no.
- **Humor.** Suma si sale bien y resta si sale mal. Va solo si el cliente abrió el tono, sobre la situación, nunca sobre el cuerpo, la salud o el precio. Queda como prueba a decidir con el dueño.
- **Más humano pide más.** Un bot que parece más humano vende más, pero el cliente se fija más en si el precio es justo. Calidez y precios claros van juntos.
- **Para mejorar sin romper:**
  - leer charlas reales todos los días y contar los errores por tipo;
  - cada error se vuelve una prueba;
  - un cambio por vez, probado de a pares y que salga bien en todas las repeticiones;
  - lo que dice un cliente nunca se vuelve regla.

## 3. La revisión de los agentes

- El clasificador, el redactor, el revisor y el manual están en línea con las reglas del dueño.
- El agente de **seguimientos** había quedado atrás. En los 11 seguimientos del 23/11:
  - 8 decían «te lo dejé guardado porque quedan pocas unidades»;
  - 6 llevaban un precio que el cliente no había preguntado o que ya se le había dicho;
  - 3 preguntaban «cuál de esas promos te sirve», una pregunta que el dueño había descartado. Su propio prompt lo pedía, y la nota del código decía lo contrario.

## 4. El arreglo de los seguimientos (bak132)

- El precio va solo si el cliente preguntó precios.
- El pedido guardado va si se interesó y no paga el mes que viene, y el poco stock una vez por cliente.
- Si no se sabe qué busca, se le pregunta qué busca.
- La pregunta lleva a cerrar con nosotros.
- Lo que el cliente dijo en un audio ahora cuenta para decidir el seguimiento.

**Probado de a pares, sin envíos, con clientes reales de esa noche:**

| | Versión instalada | Versión nueva |
|---|---|---|
| Borradores | 16 | 16 |
| Rechazados por el revisor | 5 | 1 |
| Con precio que nadie pidió o ya dicho | 8 | 0 |

El primer intento de la versión nueva cambió de conducta por una sola palabra. Dejó de cerrar y le preguntó a un cliente apurado si ya había conseguido el producto. Las pruebas automáticas no lo veían. La prueba de a pares sí, y se corrigió antes de instalar.

## 5. Qué sigue (propuestas, de a una)

1. Reconocer antes de responder y cuidar el último mensaje.
2. Humor de reacción y un emoji en espejo del cliente, si el dueño lo aprueba.
3. Reglas firmes cuando el cliente insiste o dice que alguien le prometió otra cosa.
4. Medir las repeticiones de Maxi sin reescribir todavía.
5. Pasar los niveles de persuasión a chequeos de sí o no, con una lectura diaria de charlas al azar.
6. Pedirle al dueño material real que dé seguridad: reseñas, fotos de pedidos, videos de uso.
