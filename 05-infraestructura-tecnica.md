# Infraestructura Técnica — acceso al CRM vía navegador + bugs conocidos

## Cómo se ve el CRM (Playwright + Chrome con depuración remota)
Este entorno (Windows, PowerShell, sin Node preinstalado, sin `claude` CLI en PATH) requirió armar acceso a navegador desde cero. **El entorno se resetea entre sesiones** (Node portátil, `.mcp.json`, perfil de Chrome copiado — todo desapareció una vez), así que esto es más una receta a repetir que una config permanente.

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
