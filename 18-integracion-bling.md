# Integración con Bling — guía completa (para que cualquier agente la retome sin repetir el descubrimiento)

Este archivo consolida todo lo aprendido sobre la integración con Bling (el ERP real de la empresa, ver [[06-seguridad-y-pendientes]]) en un solo lugar: cómo repetir el proceso de autorización, cómo evitar que el token se venza, gotchas reales ya pisados, y oportunidades de mejora. Los hallazgos de seguridad puntuales (claves expuestas, etc.) siguen viviendo en [[06-seguridad-y-pendientes]]; el diseño técnico del Flujo de renovación sigue en [[15-flujos-automatizacion-avanzados]]. Este archivo es el punto de entrada único para "quiero tocar Bling, ¿qué necesito saber?".

## Estado actual (2026-09-13)
- **App activa**: "Fitness Suplementos - Agente IA v2", id **398861**, tipo API/Privado, categoría "Soluções em IA", escopos **Produtos** + **Controle de Estoque**.
- **Cuenta a usar**: Santiago (`usersantifitness@gmail.com`) — **no la de Facundo**. Hallazgo clave: `Cadastro de aplicativos` en Bling (`Central de Extensões → Área do integrador`) es **privado por usuario, no compartido a nivel de cuenta de empresa**, aunque el catálogo/ERP subyacente sí es compartido entre todos los usuarios de la cuenta. La app vieja (id 398769, creada con el login de Facundo) sigue existiendo pero no se usa más y no es visible desde el login de Santiago.
- **Redirect URL registrada**: `https://www.bling.com.br/central.extensoes.php` (mismo dominio que Bling, evita problemas de CORS al leer el `code` de la URL de vuelta).
- **Client ID**: `5c4cdb73dc5148b34ee2a83a50c24d3273e2290b` (no es secreto, se puede ver siempre en `Cadastro de aplicativos`).
- **Client Secret**: nunca se guarda en esta documentación. Se revela solo en la UI de Bling (ícono de ojo junto al campo) cuando hace falta.

## Cómo repetir el proceso de autorización completo (paso a paso)

**Regla de oro que causó los dos primeros intentos fallidos de esta sesión: el `code` de autorización de Bling expira en segundos, no minutos.** Cualquier navegación, snapshot o pausa entre conseguir el código y canjearlo lo invalida (error `invalid_grant: The authorization code has expired`). La receta que sí funcionó:

1. Ir a `Central de Extensões → Área do integrador → Cadastro de aplicativos` (URL: `bling.com.br/cadastro.aplicativos.php`), abrir la app (id 398861), pestaña **"Informações do app"**.
2. Revelar el **Client Secret** clickeando el ícono de ojo junto al campo (queda visible en el DOM de esa pestaña mientras no se recargue la página).
3. **Sin recargar ni navegar esa pestaña**, abrir en una **pestaña nueva** el "Link de convite" (la URL de autorización, formato `bling.com.br/Api/v3/oauth/authorize?response_type=code&client_id=...&state=...`, disponible en esa misma pantalla de "Informações do app"). Si ya se autorizó antes, redirige solo, sin pantalla de consentimiento.
4. Copiar el parámetro `code` de la URL resultante en la pestaña nueva.
5. **Inmediatamente**, volver a la pestaña original (la que tiene el Client Secret ya revelado) y, en un solo paso, hacer `POST` a `https://www.bling.com.br/Api/v3/oauth/token` con:
   - Header `Authorization: Basic base64(client_id:client_secret)`
   - Body `grant_type=authorization_code&code=<code>`
   - Esto devuelve `access_token` (vence en 21600s = 6hs) y `refresh_token`.
6. Para renovar más adelante (antes de que venza), el mismo endpoint pero con `grant_type=refresh_token&refresh_token=<refresh_token vigente>` en vez de `authorization_code`.

### Cómo se hizo sin exponer nunca el secreto ni los tokens en el chat
Todo el paso 5 (y el 6) se ejecuta con `browser_evaluate` de Playwright **dentro del navegador**, leyendo el Client Secret directo del input del DOM (`input.value`) y haciendo el `fetch()` ahí mismo — el script solo devuelve resultados no sensibles (código de estado HTTP, cantidad de productos, nombre de un producto de prueba), nunca el token ni el secreto. Es el mismo criterio que se usó para las claves de OpenAI (ver [[06-seguridad-y-pendientes]]) y coincide con la skill `browser-automation` instalada este mismo día. **Cualquier agente que repita este proceso debe seguir el mismo patrón** — nunca pedirle al usuario que pegue el Client Secret o un token en el chat, y nunca usar `browser_type`/`browser_fill_form` con el valor real (Claude Code tiene un clasificador de seguridad que bloquea eso activamente, ya se probó en esta sesión).

## Mecanismo de renovación automática — ✅ construido y publicado (2026-09-13), falta activar
El diseño completo (nodo por nodo) vive en [[15-flujos-automatizacion-avanzados]], sección "Diseño de Recompra actualizado" / hallazgo de persistencia vía Contato fijo. **Ya está construido y publicado** como el flujo **"FV|Bling - Renovacion de Token"** (id 5117), en estado **Inativa** a propósito (mismo criterio que el resto del proyecto — nunca activar sin confirmar antes). Estructura real (5 nodos):
1. **Agendado**, cada 5 horas.
2. **Contato → Criar contato**: Nome `Sistema - Bling Token`, Telefone `5511900000000`. Confirmado en vivo que este sub-tipo hace *find-or-create* por teléfono (ver sección de abajo), no hace falta un sub-tipo "Buscar" aparte.
3. **Requisição HTTP** → `POST https://www.bling.com.br/Api/v3/oauth/token`, header `Content-Type: application/json`, body JSON:
   ```json
   {
     "grant_type": "refresh_token",
     "refresh_token": "{contact.extraInfo.Bling Refresh Token}",
     "client_id": "5c4cdb73dc5148b34ee2a83a50c24d3273e2290b",
     "client_secret": "<pegar a mano, nunca dejarlo commiteado en ningún lado>"
   }
   ```
   Con "Salvar resposta em variável" activado, nombre de variable `bling_token_response`.
4. **Contato → Campo do contato** ("Definir"): Chave `Bling Access Token`, Valor `{bling_token_response.access_token}`.
5. **Contato → Campo do contato** ("Definir"): Chave `Bling Refresh Token`, Valor `{bling_token_response.refresh_token}`.

### Hallazgos de UI para armar esto (para no repetir la exploración)
- El body del nodo "Requisição HTTP" es **JSON, no x-www-form-urlencoded** — aunque se ponga ese Content-Type como header, el campo de body solo acepta JSON válido.
- Para referenciar un campo personalizado del contacto: `{contact.extraInfo.Nombre Exacto Del Campo}` (el propio panel de variables lo indica: "Informações Adicionais (use .nome_do_campo)").
- Para referenciar la respuesta guardada de un nodo HTTP: `{nombre_de_la_variable.campo_de_la_respuesta}` (ej. `{bling_token_response.access_token}`).
- El sub-tipo de un nodo "Contato" (Criar / **Campo do contato** / Nota / Lista) **no se puede elegir desde el picker rápido "+"** en medio de una conexión — ese siempre inserta "Criar contato". Hay que ir al panel lateral de Componentes, clickear "Contato" (abre un submenú con las 4 variantes) y **arrastrar** la variante correcta hasta el conector — clickear no alcanza, hace falta drag and drop.

### ⚠️ Incidente de seguridad durante la construcción (2026-09-13)
Al usar el botón "Testar" (Modo Teste/simulación) del flujo con el `client_secret` ya escrito en el body, el panel de "O que o fluxo faria" lo mostró **completo en texto plano** — quedó expuesto en la conversación con Claude. El usuario decidió explícitamente no rotarlo. Recomendación que queda en pie para cualquiera que retome esto: **no usar "Testar" con el secret ya cargado en el body** — ir directo a "Executar agora" (no muestra el preview del body armado), o vaciar el campo `client_secret` antes de cualquier simulación y pegarlo recién al final.

### ⚠️ Riesgo no verificado todavía, importante para quien lo construya
OAuth2 estándar suele **rotar el `refresh_token`** en cada uso (el anterior deja de servir). Nunca se probó un `grant_type=refresh_token` real en esta cuenta todavía — hay que asumir que rota y **guardar siempre el `refresh_token` nuevo** que devuelva la respuesta, no solo el `access_token`. Si el Flujo de renovación solo actualiza el `access_token` y reutiliza un `refresh_token` viejo, se va a romper en la segunda corrida, no en la primera — un bug fácil de no notar hasta 5-10 horas después de publicarlo.

### ✅ RESUELTO (2026-09-13): "Criar contato" SÍ hace find-or-create por teléfono
Se probó en vivo con un flujo descartable ("TEST-borrar-semantica-contato", disparo manual): se ejecutó el nodo "Contato → Criar contato" con el mismo Nombre/Telefone fijos **4 veces seguidas** (execuções #476698 a #476700 y la inicial). Resultado verificado en `/business/contacts`: **un solo contacto**, con la fecha de creación de la primera corrida — ninguna ejecución posterior generó un duplicado. Confirma que el diseño de "Contato fijo" para guardar el token es seguro para correr cada 5hs sin ensuciar la base de contactos. No hace falta buscar un sub-tipo "Buscar" — "Criar contato" (el que aparece por defecto al insertar el nodo) ya alcanza.

## Límites reales de la API (confirmado contra developer.bling.com.br/limites)
- **3 requisições por segundo**, **120.000 requisições por día**.
- Bloqueo de 10 minutos si: 300 errores en 10s, o 600 requisições en 10s.
- Bloqueo de **60 minutos** si: **20 requisições a `/oauth/token` en 60 segundos**. Esto es relevante para el mecanismo de renovación (cada 5hs está lejos del límite, sin riesgo) y para cualquier debugging manual — reintentar el intercambio de token muchas veces seguidas en poco tiempo puede bloquear el endpoint de autenticación por una hora entera. En esta sesión se reintentó 3 veces por códigos vencidos, sin llegar a ese límite, pero vale la pena tenerlo presente.

## Por qué la prueba trajo 100 productos (y no es un problema)
La llamada de prueba (`GET /Api/v3/produtos?limite=3`) devolvió 100 resultados, no 3 — **confirmado contra la documentación oficial**: el parámetro `limite` tiene un valor por defecto de 100 (`pagina` default 1), y no hay evidencia de que acepte bajarlo por debajo de eso en la práctica. **Esto no es un límite del catálogo** — la empresa sigue teniendo 1094 productos reales cargados en Bling (ver [[06-seguridad-y-pendientes]]); simplemente esa llamada trajo la primera página de 100. Para traer el catálogo completo haría falta paginar con el parámetro `pagina` (ej. ~11 páginas de 100 para 1094 productos).

**Importante para el uso real del Agente de IA**: el agente **no debería paginar todo el catálogo** en cada conversación — eso sería lento e innecesario. La API documenta un filtro **`nome`** (nombre del producto) y otro por **`codigo`** (SKU), pensados exactamente para esto: cuando el cliente pregunta por un producto puntual, la llamada correcta es `GET /Api/v3/produtos?nome=<lo que preguntó el cliente>`, que devuelve solo los productos que matchean — rápido, liviano, y dentro de cualquier límite de rate imaginable a la escala de este negocio.

## Oportunidades de escalar/mejorar esto (ideas, no implementadas)
1. **Usar el filtro `nome`/`codigo` en la acción "Fazer requisição HTTP" del propio prompt del agente** (ya confirmado que existe ese chip real, ver [[01-agente-de-ia]]) en vez de un Flujo separado — consulta puntual por conversación, no una sincronización masiva.
2. **Fragilidad de un solo usuario**: hoy todo depende de la cuenta de Google de Santiago logueada en Bling. Si esa cuenta cambia de contraseña, pierde acceso, o se desactiva 2FA, la integración entera se corta sin aviso. Vale la pena preguntar si Bling ofrece algún tipo de cuenta de servicio/equipo para este caso (no investigado todavía).
3. **A mayor escala de ventas**, si algún día el volumen de conversaciones es muy alto, considerar sincronizar periódicamente el catálogo (precio/stock) hacia "Productos Comerciales" de rmsystemm en vez de depender de una llamada HTTP en vivo por conversación — hoy, con 3 req/s y 120.000/día de margen, no hace falta, pero es la primera palanca si algún día se vuelve cuello de botella.
4. **Factura de Bling pendiente**: se vio un aviso real de "fatura de Setembro/2026 ainda está em aberto" al crear la app nueva — si no se regulariza, se corre riesgo de perder acceso a toda la cuenta de Bling, no solo a la API. Vale la pena que alguien lo revise pronto (ver [[17-registro-de-cambios]]).

## Pendiente
- ✅ ~~Construir de verdad el Flujo de renovación automática~~ — hecho y publicado (id 5117), ver arriba.
- ✅ ~~Crear los 2 campos personalizados de Contacto~~ — hechos (`Bling Access Token`, `Bling Refresh Token`).
- **Antes de activar el Flujo** (falta, en este orden):
  1. Cargar a mano en el contacto "Sistema - Bling Token" (`/business/contacts`) un `refresh_token` inicial válido en el campo "Bling Refresh Token" — hoy está vacío, y sin esto la primera corrida real falla (refresh_token vacío).
  2. Pegar el `client_secret` real en el nodo "Requisição HTTP" del flujo (se vació a propósito por el incidente de seguridad de arriba).
  3. Probar con "Executar agora" una vez (no "Testar") y confirmar en el contacto que los dos campos personalizados se actualizaron con valores nuevos.
  4. Recién ahí, tildar el checkbox de Status del flujo en la lista de Flujos de Automação para activarlo de verdad.
- Decidir si se elimina la app vieja (id 398769, cuenta de Facundo) o se deja abandonada sin borrar.
- Agregar al prompt del Agente Fit la instrucción real de consultar Bling por `nome`/`codigo` antes de citar un precio (conecta con el guardrail "No inventar precios", ver [[01-agente-de-ia]]).
