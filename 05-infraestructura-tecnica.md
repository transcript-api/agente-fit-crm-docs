# Infraestructura Técnica — acceso al CRM vía navegador + bugs conocidos

## Cómo se ve el CRM (Playwright + Chrome con depuración remota)
Este entorno (Windows, PowerShell, sin Node preinstalado, sin `claude` CLI en PATH) requirió armar acceso a navegador desde cero. **El entorno se resetea entre sesiones** (Node portátil, `.mcp.json`, perfil de Chrome copiado — todo desapareció una vez), así que esto es más una receta a repetir que una config permanente.

### ✅ Node.js instalado de forma permanente en esta PC ("Home"), 2026-09-14
Antes solo existía la variante portátil (`C:\Users\Home\AppData\Local\nodejs-portable`, que sí sobrevive entre sesiones en disco pero no queda en el PATH del sistema). Esta sesión instaló Node.js LTS **de forma permanente vía `winget install --id OpenJS.NodeJS.LTS -e`** (requiere aprobar un diálogo de UAC en pantalla — no se puede automatizar sin un humano presente). Quedó en `C:\Program Files\nodejs`, con `node`/`npm` ya en el PATH del sistema (Machine) — a diferencia de sesiones anteriores, una terminal nueva en esta PC ya debería tener `node`/`npm` disponibles sin ningún paso extra.

Con eso instalado: `npm install -g @playwright/mcp@latest @playwright/cli@latest` funcionó directo, sin el truco de apuntar a `node.exe`+`cli.js` a mano (ya no hace falta, era un workaround específico de la variante portátil).

El `.mcp.json` global (`C:\Users\Home\.mcp.json`) y el perfil de Chrome de depuración (`C:\ChromeRemoteDebuggingUserData`) de una sesión anterior **seguían en disco y funcionaron tal cual** — no fue necesario recrearlos, solo relanzar Chrome (paso 4 de la receta original) porque el puerto 9222 no respondía al empezar la sesión.

### Receta que funcionó (repetible)
1. **Node portátil** (no hay Node preinstalado): descargar el zip de la última LTS desde `https://nodejs.org/dist/index.json` (buscar el de mayor versión con `lts != false`), extraer a `C:\Users\Home\AppData\Local\nodejs-portable`.
2. **Cachear el paquete de Playwright MCP**: con Node portátil en PATH temporalmente, correr `node node_modules/npm/bin/npx-cli.js -y @playwright/mcp@latest --version`. Esto descarga el paquete a `%LOCALAPPDATA%\npm-cache\_npx\<hash>\node_modules\@playwright\mcp\` (el hash suele ser el mismo entre sesiones: `9833c18b2d85bc59`, pero verificar).
3. **Copiar un perfil de Chrome real y logueado** a una carpeta de depuración aparte (para no tocar el Chrome normal del usuario ni pedirle contraseña):
   - Identificar el perfil correcto vía `%LOCALAPPDATA%\Google\Chrome\User Data\Local State` → `profile.last_active_profiles` / `info_cache[].active_time` (el más reciente = el que se estaba usando).
   - `robocopy "<perfil origen>" "C:\ChromeRemoteDebuggingUserData\Default" /E /XD Cache "Code Cache" GPUCache "Service Worker" "GrShaderCache" "ShaderCache" blob_storage "Media Cache" "Crash Reports"` — el archivo `Network\Cookies` casi siempre falla por estar bloqueado (Chrome lo tiene abierto) — **no importa**, la sesión de rmsystemm igual sobrevive vía localStorage/IndexedDB en los casos vistos.
4. **Lanzar Chrome con depuración remota** sobre esa copia: `chrome.exe --remote-debugging-port=9222 --user-data-dir="C:\ChromeRemoteDebuggingUserData" --profile-directory=Default --no-first-run`.
5. **Crear `.mcp.json`** en el directorio de trabajo (`C:\Users\Home\.mcp.json`) — **IMPORTANTE**: apuntar directo a `node.exe` + el `cli.js` del paquete cacheado, NO a `npx.cmd` (en Windows, invocar `.cmd` directo sin pasar por `cmd.exe` falla al spawnear — causa "Connection closed" en el MCP):
   ```json
   {
     "mcpServers": {
       "playwright": {
         "command": "C:\\Users\\Home\\AppData\\Local\\nodejs-portable\\node.exe",
         "args": ["C:\\Users\\Home\\AppData\\Local\\npm-cache\\_npx\\<hash>\\node_modules\\@playwright\\mcp\\cli.js", "--cdp-endpoint=http://localhost:9222"]
       }
     }
   }
   ```
   - **No editar `~/.claude.json` para esto** — es un archivo que la propia app reescribe en segundo plano (cachés de GrowthBook, etc.) y pisa cualquier edición manual en segundos. `.mcp.json` de proyecto es estable.
6. Pedirle al usuario **Reload Window** en VS Code para que la extensión levante el nuevo servidor MCP. Verificar con `ToolSearch` que aparezcan las tools `mcp__playwright__*`.
7. Si el puerto 9222 no responde en una sesión nueva (`Invoke-RestMethod http://localhost:9222/json/version` falla) → repetir el paso 4 (relanzar Chrome), no hace falta rehacer todo lo demás si el resto sigue en disco.

### Receta alternativa más simple — PC con Node/Chrome ya instalados (confirmada 2026-09-13)
En una PC distinta (usuario Windows "USUARIO", no "Home") donde Node, npm y Chrome ya estaban instalados de forma normal (no portátil) y no había ningún `.mcp.json` previo, la receta se simplifica bastante y queda **permanente** (no se resetea entre sesiones, a diferencia de la de arriba):

1. `npm install -g @playwright/mcp@latest` (instalación global, no depender solo de `npx` bajo demanda).
2. No hace falta copiar ningún perfil de Chrome a mano — se usa un perfil nuevo y dedicado (`--user-data-dir`), que Playwright crea solo en el primer lanzamiento y que persiste solo en disco de ahí en adelante. Se descartó copiar el perfil personal real del usuario por seguridad (ver skill `browser-automation` instalada este mismo día, regla A3): un perfil copiado le daría a la sesión acceso a todo lo demás logueado en el Chrome personal, no solo a rmsystemm.
3. `.mcp.json` en la raíz del proyecto, apuntando directo a Chrome real (no Chromium for Testing):
   ```json
   {
     "mcpServers": {
       "playwright": {
         "command": "npx",
         "args": ["-y", "@playwright/mcp@latest", "--browser", "chrome", "--executable-path", "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", "--user-data-dir", "C:\\Users\\USUARIO\\.claude-playwright-profile\\rmsystemm"]
       }
     }
   }
   ```
   Sin `--headless` (ventana visible). Este `.mcp.json` va en `.gitignore` (rutas específicas de esta PC) — no viaja a la otra PC vía git, hay que rearmarlo ahí si hace falta.
4. En este caso `npx` funcionó directo sin el problema de `.cmd` que sí apareció en la otra PC (probablemente porque acá Node está instalado de forma normal en PATH, no de forma portátil/temporal) — no hizo falta el truco de apuntar a `node.exe` + `cli.js` directo. Si en el futuro (acá o en la otra PC) `npx` falla con "Connection closed", ese es el plan de respaldo (ver receta original arriba).
5. Reload Window de VS Code para que la extensión levante el servidor MCP nuevo.
6. **Confirmado funcionando**: login real en `rmsystemm.com.br` con verificación en dos pasos, sesión persistida en el perfil dedicado — el usuario logueó a mano en la ventana (nunca se le pidió ni se manejó la contraseña por chat), confirmado con `browser_snapshot`/captura mostrando el dashboard real ("Bienvenido, User Santi a Fitness Suplementos").
7. Se instaló también la skill de Claude Code `browser-automation` (protocolo de disciplina para este tipo de tareas — perfil dedicado, verificación con dos señales, cadencia humana en acciones masivas, etc.), global y a nivel de este proyecto.

### Segunda herramienta: `@playwright/cli` (2026-09-13) — coexiste con el MCP, no lo reemplaza
Microsoft lanzó (setiembre 2026) un paquete oficial separado, `@playwright/cli`, pensado para agentes de código: en vez de tool calls MCP que vuelcan todo el árbol de accesibilidad en cada interacción, el agente corre comandos de shell puntuales (`playwright-cli open/goto/click/fill/screenshot/close`), más eficiente en tokens. Verificado contra la documentación oficial (`playwright.dev/docs/getting-started-cli`, `playwright.dev/agent-cli/skills`) antes de instalarlo, no solo por un video de terceros que lo recomendaba.

**Diferencia importante con el MCP, según la propia documentación oficial**: el MCP (`@playwright/mcp`, ya instalado) es lo recomendado para **automatización exploratoria** — que es exactamente lo que este proyecto necesita casi siempre (navegar el CRM, mirar qué hay, decidir el siguiente paso según lo que se ve, con el usuario supervisando). El CLI está pensado para **tareas puntuales/repetibles y escritura de tests**. No son intercambiables 1 a 1 — se instalaron los dos para tener ambos disponibles según el caso, no para reemplazar el MCP.

Instalación (misma PC, sin nada especial más allá de lo ya instalado para el MCP):
```
npm install -g @playwright/cli@latest
npx playwright-cli install --skills           # skill a nivel de proyecto (.claude/skills/playwright-cli)
npx playwright-cli install --skills --global  # skill también a nivel global (~/.claude/skills)
```
El propio instalador agrega solo `.playwright-cli/` a `.gitignore` (avisa explícitamente: "may contain credentials" — la carpeta de output/estado del CLI, no debe subirse a GitHub, igual criterio que `.playwright-mcp/`).

### Gotchas de la UI de rmsystemm en Playwright
- Muchos elementos MUI (tabs, botones de tarjetas con drag-and-drop, diálogos) **cuelgan con timeout en `browser_click` normal** ("waiting for element to be visible, enabled and stable"). Solución: `browser_evaluate` con `(el) => el.click()` sobre el ref, o para selects tipo MUI, `dispatchEvent(new MouseEvent('mousedown', ...))`.
- `browser_take_screenshot` a veces cuelga en "waiting for fonts to load..." — reintentar suele funcionar; si no, usar `browser_snapshot` (árbol de accesibilidad) como respaldo.
- Al navegar fuera de una pantalla con cambios sin guardar puede aparecer un diálogo nativo `beforeunload` que bloquea todo — manejarlo con `browser_handle_dialog({accept: true})`.
- El botón de encendido/apagar automatización está pegado al lápiz de editar en las tarjetas de automatización — **fácil clickear el equivocado y desactivar algo real por error** (ya pasó una vez, se corrigió).

## Bugs conocidos de la plataforma (no son culpa de la configuración del usuario)
- **Ruta `/crm` rota**: carga en blanco de forma consistente por un error 500 en `GET https://api.integrador-crm.com/wallet/company/9651` (widget de saldo/cartera) que no está manejado — tira abajo toda la pantalla en vez de solo el widget. Afecta también `/conversations` en algunos momentos. **La ruta correcta y funcional para el pipeline es `/business/funnel`** (accedida haciendo clic en "CRM" del sidebar, no tipeando `/crm`). Confirmado reproducible en dos sesiones separadas (días distintos) — vale la pena reportarlo a soporte de RM System.
- Ruta real de "Productos Comerciales": `/business/commercial-products`. Ruta de "Etiquetas": `/business/tags`.

## Sistema legacy: DS Bot (Typebot)
`Automatizaciones → DS Bot` es en realidad una instancia embebida de **Typebot** (open source, se ve la URL `/pt-BR/typebots` en el iframe). Bots vistos: "Suporte ao Cliente" (el quiz viejo — menú fijo de objetivo → menú fijo de frecuencia de entreno → "un asesor te contactará", sin diagnóstico real ni cierre de venta), "Meu DS Bot" (x2, sin tocar), "FAQ", "Onboarding de Usuário". Es un motor de bot totalmente distinto y desconectado del Agente de IA nuevo (LLM). Cola "DS bot" en Configuración → Colas tiene una integración "Teste 01" — no confirmado si recibe tráfico real hoy.
