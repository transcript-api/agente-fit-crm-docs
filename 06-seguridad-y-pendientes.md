# Seguridad y Checklist de Pendientes

## Hallazgos de seguridad
- **Clave API de OpenAI expuesta en el DOM** en el agente "Assistente Fitness" (id 9347): el campo se muestra enmascarado visualmente pero el valor real completo está en el HTML subyacente, legible por cualquier herramienta de automatización sin hacer clic en el ojito. **No se guarda el valor real en esta documentación a propósito.** Recomendación pendiente: rotarla en platform.openai.com.
- El campo Clave API de "Agente fit" (id 9756) no es una key real, dice literalmente `usersanti001` — no es una fuga, es un dato inválido puesto por error.
- Se compartió por chat una clave con formato `AQ.Ab8...` que **no** tiene el formato de una API key de Gemini real (esas empiezan con `AIzaSy`) — probablemente se copió el dato equivocado desde Google. Pendiente: el usuario debe conseguir la key correcta en `aistudio.google.com/apikey`.
- Recomendación general: evitar pegar claves API completas en el chat; si hay que hacerlo, rotarlas después.

## Hallazgo (2026-09-11): catálogo real vive en Bling (ERP), no en el CRM
El catálogo de productos NO hay que armarlo a mano — ya existe completo y real en **Bling** (bling.com.br, el ERP que usa la empresa, accedido por el usuario logueado como "FACUNDO"): **1094 productos** reales con nombre, código, precio y stock. "Productos Comerciales" del CRM (rmsystemm) está vacío y solo tiene 2 campos (Nombre, Valor) — insuficiente y no es la fuente de verdad.

**Decisión tomada con el usuario**: conectar el Agente de IA a la **API de Bling** (vía nodo "Requisição HTTP" de los Flujos de Automatización, ver [[15-flujos-automatizacion-avanzados]]) para consultar precio/stock en tiempo real, en vez de duplicar 1094 productos a mano en el CRM (que quedaría desactualizado). Investigado: Bling tiene un portal de desarrollador en `Central de Extensões → Área do integrador` (`cadastro.aplicativos.php`) donde se crean "aplicativos" con OAuth2 (Client ID + Client Secret). Esto es más complejo que una API key simple: requiere un flujo de autorización OAuth2 (código → token) y el token expira, necesitando refresh — no es un simple "pegar la key y listo".

### ✅ RESUELTO (2026-09-11): app creada, autorizada y probada con éxito
- App creada en Bling: **"Fitness Suplementos - Agente IA"** (id 398769), tipo API/Privado, categoría "Soluções em IA", escopos **Produtos** + **Controle de Estoque**, aprobada automáticamente. **Se decidió mantenerla siempre activa** (el usuario confirmó explícitamente no eliminarla).
- Contacto registrado: FACUNDO / adilsonhernandez66@gmail.com / celular con formato válido genérico (no real, ya que el campo exige formato brasileño y no acepta número uruguayo — decisión del usuario: usar un número sintácticamente válido no real, sin impacto funcional).
- Link de redirecionamento configurado en `https://www.bling.com.br/central.extensoes.php` (mismo dominio que Bling, para evitar problemas de CORS al hacer el intercambio del código OAuth vía JavaScript — el valor original `oauth.pstmn.io` funcionaba para ver el código a simple vista pero no para automatizar el intercambio).
- **Flujo completo de autorización OAuth2 ejecutado con éxito**: autorización → código → intercambio por `access_token` (Bearer, expira en 21600s = 6hs) + `refresh_token`. Confirmado con una consulta real a `GET /Api/v3/produtos` → **200 OK con datos reales** (nombres y precios reales del catálogo).
- **Client Secret y access_token/refresh_token se manejaron mayormente directo en el navegador para no exponerlos, PERO hubo una excepción real**: al diagnosticar por qué el pegado del token no se guardaba, se pidió al usuario correr `sessionStorage.getItem(...)` en su consola sin copiar, y eso imprimió el JSON completo (con `access_token` y `refresh_token` reales) en pantalla — el usuario lo compartió por screenshot, quedando expuesto en esta conversación. Se avisó explícitamente en el momento. **Mitigación**: el access_token ya venció solo (dura 6hs); el refresh_token asociado a ese intercambio debería rotarse (usarlo una vez vía `grant_type=refresh_token` u obtener uno nuevo autorizando de nuevo) antes de dejar cualquier automatización real corriendo con él — ver mecanismo de renovación abajo, que además resuelve esto de forma natural en su primera corrida.
- **Pendiente para dejarlo funcionando en producción dentro del CRM**:
  1. Llevar el `access_token`/`refresh_token` al nodo "Requisição HTTP" de un Flujo de Automatización en rmsystemm (ver [[15-flujos-automatizacion-avanzados]]) — ya se probó una vez de forma manual/descartable, falta la versión definitiva (punto 2).
  2. ✅ **Diseño confirmado (2026-09-11)** del mecanismo de renovación automática y de dónde vive el token — ver sección "RESUELTO: sí se puede persistir datos globales..." en [[15-flujos-automatizacion-avanzados]]: un Flujo "Agendado" cada 5hs, con un Contato fijo (`Sistema - Bling Token`) como "base de datos" del token vigente vía 2 Campos de Contacto personalizados nuevos (`Bling Access Token`, `Bling Refresh Token`). Falta construirlo y probarlo de verdad (no solo diseñarlo) — ver pendientes detallados en el archivo 15.

**Nota de moneda**: en `Configuración → General` del CRM, el campo "Moeda" está en **BRL (R$)** a nivel de toda la cuenta — no es solo un detalle visual del formulario de "Productos Comerciales", es la configuración real de la empresa. El usuario confirmó cargar los precios en **UYU** de todas formas donde haga falta cargar algo manual; pendiente evaluar si conviene cambiar el selector de Moeda o dejarlo así y aclarar la moneda en otro lado (ej. en el nombre del producto o en el prompt del agente).

## Checklist de próximos pasos (actualizar a medida que se avanza)
- [x] Auditoría inicial completa de la infraestructura (Agente de IA, CRM, Automatizaciones, Colas, Canales, Equipo).
- [x] Confirmar que el motor de automatización por columna funciona en la cuenta real (solo para tags, no mensajes).
- [x] Crear estructura de 5 columnas en "Funil De Ventas" (pipeline de práctica).
- [x] Crear primera automatización real: "Recordatorio Propuesta" en columna "Propuesta Enviada" (2hs, mensaje generativo simple).
- [ ] Crear automatización en columna "Pago Pendiente" (1h, mensaje acordado, ver [[03-funil-de-ventas-nuevo]]).
- [ ] Decidir y resolver la clave API del Agente de IA (OpenAI con facturación real, o cambiar Proveedor a Gemini con key válida) — **pendiente, el usuario lo dejó para después explícitamente el 2026-09-11.**
- [ ] Cargar catálogo real en "Productos Comerciales" — decidido conectar vía API de Bling en cambio, ver hallazgo arriba. Pendiente terminar la integración OAuth.
- [x] Escribir el prompt de "Instrucciones" del Agente de IA basado en [[04-patrones-reales-de-venta]] — **hecho y pegado en el agente real el 2026-09-11**, ver [[13-prompt-agente-fit-v1]].
- [x] Configurar al menos un Guardrail (evitar que el agente invente precio/stock) — **hecho el 2026-09-11: 4 guardrails configurados** (No inventar precios, No mandar mensajes vacías, No filtrar placeholders sin completar, No prometer sin ejecutar), ver [[01-agente-de-ia]].
- [ ] Conectar el agente a una cola/canal real y probar en la pestaña "Prueba" — bloqueado por la Clave API rota.
- [ ] Decidir destino del sistema legacy DS Bot/Typebot (apagarlo o integrarlo como filtro previo).
- [ ] Revisar por qué 4 de 7 usuarios están pausados (Santiago, Laura, Facundo, User Santi) — capacidad humana real hoy, aparte del proyecto de IA.
- [ ] Reportar a soporte de RM System el bug de `/crm` (error 500 en wallet/company/9651).

## Oportunidad futura (no decidida, solo anotada)
El motor de "Cambiar de Columna" puede mover negocios entre pipelines distintos automáticamente (confirmado, ver [[03-funil-de-ventas-nuevo]]). Hoy el pase de la columna "Derivar a Remarketing" hacia la pipeline real de Remarketing lo hace un encargado a mano. Se decidió con el usuario mantenerlo manual por ahora — no automatizar sin volver a discutirlo primero, ya que es un cambio de proceso real del equipo, no solo de la carpeta de práctica.

## Decisiones de producto ya tomadas con el usuario
- Prioridad: Agente de IA (LLM) para la conversación de venta en sí — la automatización clásica (Flujos/Colas) es solo para la mecánica alrededor (routing, recordatorios simples, tags), no para vender.
- El presupuesto no es la limitante — se puede invertir en el mejor modelo disponible una vez que el prompt esté listo.
- Catálogo de 500+ productos: arquitectura acordada = RAG/Conocimiento para descripciones cualitativas + HTTP request en tiempo real (o Productos Comerciales) para precio/stock exacto — nunca precio/stock desde RAG puro, por riesgo de dato viejo o alucinado.
- Metodología de mejora continua: no hay auto-optimización mágica en las automatizaciones de columna — se define un mensaje, se lo prueba, y en 2-3 semanas se revisan resultados reales y se ajusta a mano ("laboratorio comercial").
