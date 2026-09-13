# Registro de Cambios y Evolución del Proyecto

## Qué es este archivo
Registro cronológico de las sesiones de trabajo sobre este vault y sobre el proyecto "Agente Fit". Sirve para que, al retomar el trabajo desde otra PC, se pueda entender rápido qué se hizo, qué se decidió y qué quedó pendiente, sin tener que reconstruir todo desde el historial de commits. Se actualiza al cierre de cada sesión con cambios relevantes, y se sube a GitHub (`origin/main`) para que quede disponible en cualquier máquina.

## Cómo usarlo
- Cada sesión nueva se agrega **arriba de todo** (orden cronológico inverso), con fecha real en formato `AAAA-MM-DD`.
- Cada entrada resume: qué se pidió, qué se verificó/hizo, qué se decidió, qué queda pendiente.
- Los pendientes de fondo del proyecto (no de este registro) siguen viviendo en [[06-seguridad-y-pendientes]].

## Sesiones

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
