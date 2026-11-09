# 50 · Hermes: anuncios por ID, medios, comprobantes y seguridad al vender (2026-11-09)

Estado: **instalado en producción** entre las 00:50 y las 05:35 UTC del 2026-11-09 (versión final `bak49`, hash `674fa104cf2d7305`). Todo probado sin enviar con el contexto real (`t41.py`); falta verlo con leads reales de la mañana.

## Por qué
El monitoreo de la noche mostró fallas puntuales en leads reales y el dueño pidió cambios de fondo:
- Primer mensaje con "Preferís envío o retiro?" (la instrucción de primer mensaje solo corría si el clasificador se equivocaba).
- "Prefiero retirar en el local" disparaba la dirección; "son de rivera" sin signo no la disparaba.
- Ante "Eso es igual que la creatina?" desde el anuncio de Testo Dilated, Hermes preguntó "qué producto querés comparar": una regla le prohibía nombrar el producto del anuncio y el registro por ID tenía 7 de 19 anuncios.
- "No sería correcto asegurarte que es original…": no había un dato del negocio que lo afirmara.
- Descargos tipo "no es para prometerte resultados mágicos", salidos de instrucciones internas "sin garantizar resultados".
- Audios e imágenes de clientes: el puente los pasaba a un vendedor sin leerlos.

## Qué cambió (en orden)
| Versión | Cambio |
|---|---|
| bak39 | Instrucción de primer mensaje para todo primer contacto sin pregunta logística; ubicación solo en forma de pregunta; "gracias por aclarar" prohibida |
| bak40 | Si el cliente habla del anuncio sin nombrar el producto ("eso"), se refiere al producto del anuncio |
| bak41 | **Registro de anuncios por ID** en `facts.json` (19 anuncios) + `producto_del_anuncio` en el contexto + aviso `ad_sin_registrar`. Copia en Supabase (`meta_ads`) |
| bak42 | "son de rivera/acá/Montevideo" sin signo cuenta como pregunta; el control mira la dirección y no la palabra "Rivera" |
| datos | Productos originales; 2x1 de frutos rojos vencido; horario 9-18 solo si preguntan; promo de 2 de Testo con 60 cápsulas de regalo |
| bak44-45 | Regla general de regalos (nombrarlos siempre, como beneficio para la persona); variante pedida (con sabor → alternativa del catálogo); **revendedores**: frase de precios competitivos + ciudad y tamaño, y pase |
| bak46-47 | **Seguridad al vender**: afirmar originalidad y buenas reseñas; sin descargos; sin cifras ni plazos garantizados en el cuerpo; revisor A06 avisado |
| bak48 | **Lectura de medios** con la clave de OpenAI del dueño, solo para leer: audios (whisper-1, en español) e imágenes (gpt-4o-mini). La descarga sigue el redireccionamiento del CRM sin mandar la clave del CRM al CDN |
| bak49 | **Comprobante legible**: "Perfecto, recibimos el comprobante. Lo confirmamos y te avisamos por acá." y pase; documento o algo ilegible: pase silencioso. **Falta de dato**: pase silencioso a un vendedor |

Monitoreo: `crm-monitor.ps1` ahora separa "esperando a Hermes" de "esperando a un vendedor" (antes contaba como de Hermes tickets asignados a vendedores). Frecuencia: cada 30 minutos.

## Decisiones
- **No prometer resultados concretos** (cifras o plazos en el cuerpo o la salud) aunque el dueño lo pidió: seguridad total y prueba social sí; el resultado garantizado trae reclamos y riesgo de bloqueo de WhatsApp/Meta. Explicado al dueño.
- **No conectar WhatsApp en paralelo al CRM**: riesgo de bloqueo del número y respuestas duplicadas. La transcripción de audios es propia (en español), no la del CRM (en portugués). Los envíos fallidos ("erro na API") se van a vigilar desde el monitoreo.
- Los movimientos de columna funcionan (verificado: el negocio quedó en EN CONVERSACION). Los leads que el dueño ve en LEAD NUEVO son los que no llegan al umbral de 3 turnos (ver Q46).

## Memoria completa
Todo lo aprendido (sistema, reglas del dueño, errores y lecciones, datos de la empresa, mapa del embudo, plan de los próximos agentes y estudios) quedó en el vault privado `cerebro-negocios`, carpeta `segundo-cerebro/`.

## Pendientes
Q47 (parcial: ya **lee** audios; enviar audios sigue pendiente), Q48 (nota interna), Q46 (movimiento por turnos), Q49-Q53 (abajo en [[PENDIENTES]]).
