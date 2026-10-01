# Cómo un agente Claude accede al CRM en vivo (Playwright)

**Qué es**: la receta técnica para que una sesión de Claude Code controle un navegador real y opere rmsystemm.com.br directamente, en vez de depender de que el usuario haga cada clic y reporte capturas.
**Fuente primaria**: [[05-infraestructura-tecnica]] (recetas completas para 2 PCs distintas), `17-registro-de-cambios.md` (gotchas encontrados sesión a sesión).

## Receta simple (PC con Node/Chrome ya instalados de forma normal)
```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["-y", "@playwright/mcp@latest", "--browser", "chrome",
        "--executable-path", "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
        "--user-data-dir", "C:\\Users\\<usuario>\\.claude-playwright-profile\\rmsystemm"]
    }
  }
}
```
Perfil **nuevo y dedicado** (nunca copiar el perfil personal real del usuario — le daría a la sesión acceso a todo lo demás logueado ahí, no solo a rmsystemm). El usuario loguea a mano una sola vez; la sesión persiste sola en ese perfil de ahí en adelante. `.mcp.json` va en `.gitignore` (rutas específicas de cada PC).

## Receta alternativa (Node portátil, cuando no hay Node instalado)
Descargar Node LTS portátil, copiar un perfil de Chrome real ya logueado a una carpeta de depuración aparte (excluyendo cachés), lanzar Chrome con `--remote-debugging-port=9222`. **Crítico en Windows**: el `.mcp.json` debe apuntar directo a `node.exe` + el `cli.js` del paquete, nunca a `npx.cmd` directo — invocar un `.cmd` sin pasar por `cmd.exe` rompe el spawn del proceso MCP ("Connection closed"). Detalle completo, incluido cómo encontrar el hash del paquete cacheado, en [[05-infraestructura-tecnica]].

## `@playwright/cli` — coexiste con el MCP, no lo reemplaza
Paquete separado, pensado para tareas puntuales/repetibles y escritura de tests (corre comandos de shell puntuales, más eficiente en tokens que volcar todo el árbol de accesibilidad en cada tool call). El MCP sigue siendo lo recomendado para automatización **exploratoria** — que es la mayoría del trabajo de este proyecto.

## Gotchas de la UI de rmsystemm con Playwright (para no re-descubrirlos)
- Muchos elementos MUI (tabs, drag-and-drop) cuelgan con timeout en `browser_click` normal — usar `browser_evaluate` con `.click()` directo sobre el ref.
- `browser_take_screenshot` a veces cuelga en "waiting for fonts to load..." — reintentar o usar `browser_snapshot` de respaldo.
- El botón de encender/apagar una automatización está pegado al lápiz de editar — fácil clickear el equivocado y desactivar algo real por error (ya pasó, se corrigió al toque).
- `navigator.clipboard.readText()` puede colgar indefinidamente esperando un permiso que nadie va a responder — **nunca llamarlo**; solo `writeText()`, y verificar el resultado del pegado por el estado del DOM, no releyendo el portapapeles.
- Fetch desde `browser_evaluate` a un servidor local (`http://127.0.0.1:PUERTO`) puede ser bloqueado por CORS/Private Network Access de Chrome cuando la página es HTTPS — hace falta que el servidor local responda con headers `Access-Control-Allow-Origin` y `Access-Control-Allow-Private-Network: true`, incluyendo manejo explícito de la preflight `OPTIONS`.

## Bugs de plataforma confirmados (no son culpa de la configuración)
- Ruta `/crm` rota de forma consistente por un error 500 en `wallet/company/9651` que tira abajo toda la pantalla — la ruta correcta y funcional del pipeline es `/business/funnel`.
- El endpoint singular de algunos recursos (`/messages/{id}`, `/tickets/{id}`) puede devolver `400 "Não é possível consultar registros de outra empresa"` en algunas sesiones mientras el endpoint de lista (`/tickets`) sigue andando bien con los mismos headers — causa no confirmada, recargar la página del CRM (refresca el token) antes de asumir que el dato no es accesible.

## Skill instalada: `browser-automation`
Protocolo de 27 reglas de disciplina para automatización de navegador (perfil dedicado nunca el personal, CDP solo localhost, `.gitignore` para el perfil, verificar con dos señales antes de dar una acción por exitosa, dry-run antes de un batch, avisos de ToS antes de scrapear/publicar en masa). Instalada a nivel global y de este proyecto — coincide con las decisiones ya tomadas acá.
