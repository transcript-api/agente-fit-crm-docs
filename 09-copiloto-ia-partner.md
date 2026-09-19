# Copiloto de IA — función de la plataforma base (DKW System), NO disponible todavía en rmsystemm

**Estado: función de referencia, no confirmada en la cuenta real.** El usuario ya buscó en el CRM real y no encontró nada — se guarda esta documentación para el día que esté disponible (rmsystemm corre sobre el mismo motor que DKW System, ver [[00-resumen-general]]). Fuente: video oficial de DKW System presentando el "Copiloto de IA" a sus partners/revendedores (Mateus Berlitz, CPO), analizado con Google AI Studio (transcripción completa + descripción visual).

## Qué es (distinción clave con el Agente de IA)
Son **dos productos separados** dentro de la misma plataforma:
- **Agente de IA** (lo que ya tenemos y estamos construyendo, ver [[01-agente-de-ia]]): atiende directamente las conversaciones con clientes. Tiene su propio prompt/Instrucciones, ejecuta acciones dentro de la conversación (etiquetar, mover columna, etc.).
- **Copiloto de IA**: NO habla con clientes. Es un asistente para el **equipo humano** (vendedores, atención, gestores) que opera en toda la plataforma, no solo en el chat. Sirve para que el equipo trabaje más rápido, no para vender directamente. Es un producto opcional, separado, con su propia suscripción.

**Importante para este proyecto**: el Copiloto NO reemplaza ni compite con el Agente de IA que estamos armando para vender — son complementarios. El Copiloto sería, en el futuro, una herramienta de productividad interna para Santiago/Laura/Facundo/etc., no para el cliente final.

## Funciones principales demostradas (no solo marketing — confirmado en pantalla)
1. **Resumen de conversación + "sussurro" (whisper)**: al abrir una conversación larga o de otro vendedor, el Copiloto da un resumen ejecutivo y **redacta una respuesta sugerida** (en gris, tipo fantasma) que el vendedor solo tiene que revisar y enviar. Detecta intención de compra ("Alto"/riesgo de cancelación, etc.).
2. **Reportes/planillas on-demand por chat**: se le pide en lenguaje natural (ej. "Monte uma planilha de negócios parados a mais de 15 dias") y genera tablas, documentos HTML, slides — quedan guardados en una sección "Documentos" (exportables, con permisos por rol).
3. **Agendamientos (tareas recurrentes de IA)**: se le puede decir "todos los miércoles generame un reporte de X" y lo hace solo, sin que nadie tenga que acordarse — con botón "Rodar agora" para forzar ejecución inmediata.
4. **Monitoreo de grupos de WhatsApp**: activable por grupo, mide tasa de respuesta, riesgo de churn, sentimiento (positivo/neutro/negativo), resume qué pasó — para no perderse acuerdos importantes en grupos con mucho volumen de mensajes.
5. **Métricas de metas**: se le carga una meta (objetivo + período) y el Copiloto evalúa si la operación va encaminada, sugiere qué hacer para llegar (ej. reactivar clientes viejos).
6. **Asistencia para crear/mejorar el Agente de IA**: en vez de escribir el prompt a mano, se le describe el objetivo/tono/reglas en un formulario y el Copiloto genera un borrador de prompt, y además puede correr un **modo de test en loop** (simula conversaciones cliente↔vendedor automáticamente, itera el prompt hasta mejorarlo) — esto es MUY relevante para cuando escribamos el prompt de "Agente fit", si esta función llega a estar disponible.

## Los 3 pilares de configuración del Copiloto (separados del Agente de IA)
- **Habilidades**: qué acciones puede ejecutar dentro de la plataforma (puede heredar acciones ya definidas en un Agente de IA existente).
- **Fuentes de Conocimiento**: documentos/bases que el Copiloto puede consultar (para no inventar info del negocio).
- **Instrucción/Playbook**: reglas de negocio en texto plano (ej. "nunca prometer plazo menor a X sin aprobación"), asignables solo a admins o a roles específicos.

## Modo Manual vs. Automático
- **Manual** (recomendado para empezar): el Copiloto sugiere, un humano aprueba y envía/ejecuta.
- **Automático**: el Copiloto ejecuta solo (enviar mensaje, mover columna/cola, etc.) sin esperar aprobación — la recomendación explícita del video es usar Automático solo en tareas ya probadas y de bajo riesgo.

## Requisitos técnicos/comerciales para habilitarlo (relevante si rmsystemm lo lanza)
- El partner (en este caso, quien administra rmsystemm, no nosotros directamente) debe tener activada la **"IA Gerenciada"** (clave de IA centralizada del proveedor de la plataforma) en vez de BYOK ("Bring Your Own Key" — traer tu propia clave de OpenAI/Gemini). El Copiloto NO funciona en modo BYOK.
- El **plan** de la cuenta debe tener el módulo "IA Copiloto" activado (separado del módulo "Agente de IA").
- Es un **add-on pago con suscripción propia** (visto: Essencial R$79/mes, Pro R$247/mes, Max R$647/mes — según cantidad de usuarios), y ADEMÁS consume **créditos de IA prepagos** (tokens), separados de la suscripción.
- Existe un modo de prueba gratuito: 5 operaciones manuales por día sin suscripción, pero sin sugerencias proactivas automáticas.
- **Conclusión práctica**: esto depende de decisiones comerciales de quien administra rmsystemm (no de Fitness Suplementos directamente) — habría que preguntarles si/cuándo planean habilitarlo, y cuánto costaría.

## Modelo de negocio (mayormente NO aplica a nosotros — somos el cliente final, no el revendedor)
DKW le vende tokens al por mayor a los partners (como quien administra rmsystemm), el partner le pone margen y se lo revende a sus clientes finales (como Fitness Suplementos). Esto explica por qué, si algún día aparece en rmsystemm, probablemente venga con un costo adicional sobre el uso de tokens, no sea gratis. No hay acción nuestra que tomar acá, solo entender que si se activa, probablemente tenga un costo extra facturado por rmsystemm.

## Confirmado por soporte (reunión 2026-09-14)
- El Copiloto está **en desarrollo** dentro de rmsystemm — no liberado para todas las cuentas, solo para las que tienen **"función súper"** (nivel de administración de la cuenta). La cuenta de Fitness Suplementos no la tiene hoy — el usuario ya pidió que se la den (ver [[26-respuestas-reunion-soporte-2026-09-14]]).
- Anunciaron que en unos días van a sacar **videos explicando el Copiloto en profundidad**.
- Sobre la contradicción de si la clave BYOK sirve para el Copiloto (la descripción del conector "OpenAI Key" decía que sí, ver [[23-conectores-hub-integraciones]] §4.3): según soporte, **no** — esa clave sirve solo para el agente y algunas funciones del agente. La descripción del conector parece estar mal redactada. No se profundizó más — repreguntar con la cita en mano si el Copiloto se vuelve prioridad.
- El precio no lo pudieron dar en esta llamada.

## Pendiente
- Esperando transcripción/análisis de un segundo video (~1 hora) con más detalle — se agrega a este mismo archivo cuando llegue.
- Revisar periódicamente si esta función aparece en la cuenta real de rmsystemm (buscar en `Agente de IA` un submenú "Copiloto") — sobre todo una vez que llegue el acceso "súper".
- Cuando salgan los videos anunciados, volver a este archivo y actualizar.
