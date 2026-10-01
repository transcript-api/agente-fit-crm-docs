# Seguridad — hallazgos e incidentes (consolidado)

**Qué es**: todos los hallazgos de seguridad del proyecto en un solo lugar. Ninguno tiene el valor real guardado en el vault ni en esta wiki, a propósito.
**Fuente primaria**: [[06-seguridad-y-pendientes]], `PENDIENTES.md` (A27, Q23).

## Patrón confirmado: cualquier Clave API de agente se expone en el árbol de accesibilidad
El campo "Clave API" se ve enmascarado en pantalla, pero el snapshot de accesibilidad de Playwright (y probablemente cualquier herramienta de automatización) lee el valor completo sin enmascarar — confirmado en **3 agentes distintos** (Assistente Fitness 9347, Recepcionista de test 9882, Recepcionista Comercial 10005). Con 3 casos independientes, es razonable asumir que es un comportamiento de la plataforma, no un bug puntual de un agente. **Recomendación pendiente confirmar (A27)**: rotar la clave de OpenAI antes de exponer cualquier agente a tráfico real de producción.

## El token de Meta viaja en texto claro en cada mensaje (Q23, sin resolver)
`GET /messages/{ticketId}` devuelve en `dataJson` la configuración completa de la conexión de WhatsApp, **incluido el `metaToken`** (token de acceso de Meta), en cada mensaje del ticket, no solo una vez. Decidir si se rota el token de la conexión "Fitness Suplementos" y preguntarle a soporte si el payload puede omitirlo.

## Incidentes históricos con claves/tokens (resueltos o mitigados, dejados como aprendizaje)
- **`usersanti001` en el campo Clave API de "Agente fit" (9816)**: no era un valor inválido al azar — era la contraseña real de la cuenta de Google `usersantifitness@gmail.com`, cargada ahí por error (probablemente autocompletado del navegador). El usuario decidió explícitamente dejarlo para después.
- **`refresh_token` de Bling expuesto una vez por `sessionStorage.getItem(...)` en consola**, compartido por captura de pantalla del usuario sin querer. Mitigación: el `access_token` asociado venció solo (6h).
- **Client Secret de Bling expuesto en texto plano** al usar el botón "Testar" (simulación) de un Flujo con el secret ya escrito en el body. El usuario decidió no rotarlo. Regla que queda: nunca usar "Testar" con un secret ya cargado, vaciarlo antes de cualquier simulación.

## Regla operativa que sale de todo esto
Nunca guardar un valor real de API key, client secret, access token o refresh token en ningún archivo de este vault (ni en `wiki/`). Si un valor real quedó expuesto en una sesión, documentar el incidente (como arriba) y la mitigación, nunca el valor. Esta regla ya está en `CLAUDE.md` del proyecto — esta página solo la repite en el contexto de seguridad porque es donde alguien la busca primero.

## Pendientes relacionados
A27 (rotar clave OpenAI antes del piloto real), Q23 (token de Meta en texto claro), B1 (tokens de Bling sin persistir).
