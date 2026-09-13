# Registro de Cambios y Evolución del Proyecto

## Qué es este archivo
Registro cronológico de las sesiones de trabajo sobre este vault y sobre el proyecto "Agente Fit". Sirve para que, al retomar el trabajo desde otra PC, se pueda entender rápido qué se hizo, qué se decidió y qué quedó pendiente, sin tener que reconstruir todo desde el historial de commits. Se actualiza al cierre de cada sesión con cambios relevantes, y se sube a GitHub (`origin/main`) para que quede disponible en cualquier máquina.

## Cómo usarlo
- Cada sesión nueva se agrega **arriba de todo** (orden cronológico inverso), con fecha real en formato `AAAA-MM-DD`.
- Cada entrada resume: qué se pidió, qué se verificó/hizo, qué se decidió, qué queda pendiente.
- Los pendientes de fondo del proyecto (no de este registro) siguen viviendo en [[06-seguridad-y-pendientes]].

## Sesiones

### 2026-09-13 — se suma `@playwright/cli` (convive con el MCP)
- **Pedido**: el usuario compartió la transcripción de un video de terceros (mismo creador de la skill `browser-automation`) que recomendaba usar "Playwright CLI" en vez de MCP por ser más eficiente en tokens. Pidió sumarlo ya que pueden convivir, y confirmar que toda esta info queda en el repo para no tener que reinstalar nada manualmente en la otra PC.
- **Verificado antes de actuar**: las cifras concretas del video (114.000 vs 27.000 tokens) no aparecen en la documentación oficial de Playwright — se trataron como una cifra del propio creador (que además promociona una comunidad paga en el mismo video), no un dato confirmado por Microsoft. Sí se confirmó contra `playwright.dev/docs/getting-started-cli` y `playwright.dev/agent-cli/skills` que `@playwright/cli` es un paquete oficial real, y que la documentación oficial recomienda **MCP para automatización exploratoria** (nuestro caso de uso principal con el CRM) y **CLI para tareas puntuales/repetibles y tests** — no es que uno reemplace al otro.
- **Hecho**: `@playwright/cli` instalado globalmente; skill oficial `playwright-cli` instalada tanto a nivel de proyecto (`.claude/skills/playwright-cli/`, con sus archivos de referencia) como global. El propio instalador agregó `.playwright-cli/` a `.gitignore` (avisa que puede contener credenciales). Se confirmó con `git log`/`git ls-files` que la skill `browser-automation` de la sesión anterior ya estaba trackeada y pusheada — no hace falta bajar de nuevo el zip en la otra PC. Detalle técnico completo en [[05-infraestructura-tecnica]].
- **Pendiente**: nada bloqueante — MCP y CLI quedan disponibles los dos, se usa uno u otro según si la tarea es exploratoria (MCP) o puntual/repetible (CLI).

### 2026-09-13 (continuación) — Clave API del Agente Fit resuelta + sincronización con sesión de la otra PC
- **Hecho, en vivo con Playwright**: se creó una clave real de OpenAI (proyecto propio, permisos Restricted) y se pegó en dos lugares distintos que resultaron ser sistemas separados — confirmando la vieja duda de [[01-agente-de-ia]]: (1) la conexión "OpenAI Key" del Hub de Integraciones (`Configuración → Cuentas Integradas`), y (2) el campo "Clave API" del propio editor del Agente Fit (`Entrenamiento`), que seguía con el valor inválido `usersanti001`. Ambos quedaron guardados con la clave real. Nota de seguridad: al intentar pegar la clave yo mismo en el segundo campo, **el clasificador de seguridad de Claude Code bloqueó la acción** ("Credential Leakage") — no se intentó esquivarlo, lo hizo el usuario directamente en el navegador.
- **Pendiente de confirmar**: probar la pestaña "Prueba" del agente para validar que responde de verdad (quedó interrumpido antes de completarse esta sesión).
- **Sincronización de contexto**: el usuario pegó la transcripción completa de la última sesión de Claude Code en la otra PC (la que generó este mismo repositorio). Confirma casi todo lo ya documentado; dos datos nuevos se sumaron a la documentación: (1) ya existen 2 canales de WhatsApp reales conectados a la cuenta ("Fitness Suplementos" y "SUPLEMENTOS ®") listos para vincular al agente, ver [[01-agente-de-ia]]; (2) falta agregar al prompt una instrucción explícita de escalamiento cuando el agente no sabe la respuesta, ver [[07-estrategias-pendientes-agente]].
- **Pendiente inmediato, a pedido del usuario**: reconectar la integración de Bling — el `access_token` obtenido en la sesión del 2026-09-11 dura 6hs y ya venció; el mecanismo de renovación automática quedó diseñado pero nunca se construyó (ver [[15-flujos-automatizacion-avanzados]]). Falta rehacer la autorización OAuth2 y, esta vez, construir el Flujo de renovación antes de conectarlo a producción.

### 2026-09-13 (continuación) — Bling reconectado bajo la cuenta de Santiago (app nueva)
- **Hallazgo**: "Cadastro de aplicativos" de Bling es privado por usuario, no compartido a nivel de cuenta de empresa — la app vieja (id 398769) creada con el login de Facundo no era visible ni usable desde el login de Santiago, aunque es la misma cuenta de empresa.
- **Decisión del usuario**: dejar de usar la cuenta de Facundo para esto; todo Bling se maneja de ahora en más con la cuenta de Santiago.
- **Hecho**: se creó una app nueva ("Fitness Suplementos - Agente IA v2", id 398861, mismos escopos Produtos + Controle de Estoque) bajo la cuenta de Santiago, y se repitió con éxito el flujo OAuth2 completo — confirmado con una llamada real a Bling (200 OK, 100 productos). El Client Secret y los tokens nunca pasaron por el chat: todo el intercambio se hizo con `browser_evaluate` dentro del navegador, devolviendo solo resultados no sensibles. Detalle completo en [[06-seguridad-y-pendientes]].
- **Pendiente**: los tokens obtenidos quedaron solo en memoria de esa pestaña (se pierden al cerrarla) — falta construir de verdad el Flujo de renovación automática (diseño ya completo en [[15-flujos-automatizacion-avanzados]]) para persistirlos.

### 2026-09-12
- **Pedido**: instalar "todas las bibliotecas" de este repositorio para poder trabajar en él, y dejar un registro de cada cambio en un archivo nuevo en GitHub para poder continuar el trabajo desde otra PC entendiendo la evolución.
- **Verificado**: este repositorio (`agente-fit-crm-docs`) contiene únicamente archivos Markdown de documentación (00 a 16) más `CLAUDE.md` y `.vscode/settings.json` — no tiene `package.json`, `requirements.txt` ni ningún manifiesto de dependencias. Se revisó también la carpeta padre (`CRM Fitnes Suplementos/`) y no existe otra carpeta con código fuente. Conclusión: no hay "bibliotecas" instalables en este repo tal como existe hoy — es un vault de documentación, no un proyecto de software con dependencias.
- **Hecho**: se creó este archivo de registro (`17-registro-de-cambios.md`) y se lo agregó al índice de [[00-resumen-general]] y de `CLAUDE.md`.
- **Pendiente**: confirmar con el usuario a qué se refería con "bibliotecas" (¿un repo de código separado que todavía no existe localmente? ¿extensiones de VSCode para editar este vault? ¿otra cosa?) — preguntado en el chat, respuesta pendiente al momento de este commit.

### 2026-09-12 (continuación — Playwright MCP conectado al CRM real)
- **Pedido**: usar Playwright para que Claude controle el navegador real del usuario desde este proyecto (en vez de depender de que el usuario haga cada clic y reporte capturas), más instalar una skill de Claude Code (`browser-automation.zip`, bajada a Descargas) para automatización de navegador.
- **Hecho** (plan formal armado y aprobado por el usuario antes de ejecutar nada):
  - `@playwright/mcp` instalado globalmente; `.mcp.json` creado en la raíz del proyecto (gitignorado — rutas específicas de esta PC) apuntando a Chrome real (no Chromium de testing) con un perfil nuevo y dedicado en `C:\Users\USUARIO\.claude-playwright-profile\rmsystemm\` — se descartó copiar el perfil personal del usuario por seguridad.
  - Skill `browser-automation` instalada global y a nivel de proyecto (inspeccionada sin extraer antes de instalar — contenido benigno, protocolo de disciplina para automatización de navegador).
  - **Primer login real exitoso**: el usuario inició sesión a mano (con verificación en dos pasos) en la ventana de Chrome controlada por Playwright — nunca se le pidió ni se manejó la contraseña por chat. Sesión persistida confirmada con `browser_snapshot`/captura mostrando el dashboard real de rmsystemm ("Bienvenido, User Santi a Fitness Suplementos"). Receta completa documentada en [[05-infraestructura-tecnica]].
  - **Corrección de un hallazgo de seguridad viejo**: el valor `usersanti001` del campo "Clave API" del Agente Fit no era un dato inválido al azar como se pensaba — es la contraseña real de la cuenta de Google `usersantifitness@gmail.com`, cargada ahí por error. Documentado sin el valor real en [[06-seguridad-y-pendientes]].
- **Pendiente**: el usuario pidió explícitamente dejar para después la clave API rota del agente y la rotación de esa contraseña de Google. Con el navegador ya conectado y logueado, el próximo paso natural es usarlo para resolver en vivo los bloqueantes ya identificados (ej. confirmar si la cola "Atencion IA" tiene el agente vinculado).

## Convención hacia adelante
- Al cierre de cada sesión de trabajo con cambios relevantes (no por cada mensaje suelto), agregar una entrada nueva acá y hacer commit + push a `origin/main` antes de cerrar.
