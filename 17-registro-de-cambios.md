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

## Convención hacia adelante
- Al cierre de cada sesión de trabajo con cambios relevantes (no por cada mensaje suelto), agregar una entrada nueva acá y hacer commit + push a `origin/main` antes de cerrar.
