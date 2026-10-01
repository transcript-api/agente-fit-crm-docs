# Integración con Bling (ERP real de la empresa)

**Qué es**: Bling (bling.com.br) es donde vive el catálogo REAL de la empresa — 1094 productos con nombre, código, precio y stock. El CRM (rmsystemm) no tiene esto nativamente ("Productos Comerciales" solo tiene 2 campos: Nombre y Valor). La integración conecta al agente/Flujos con Bling vía su API REST + OAuth2.
**Estado real (2026-09-13)**: app creada y autorizada, mecanismo de renovación automática construido y activado, pero con dos bugs reales sin resolver que limitan su utilidad hoy.
**Fuente primaria**: [[18-integracion-bling]] (punto de entrada único para todo lo de Bling), [[06-seguridad-y-pendientes]], [[15-flujos-automatizacion-avanzados]].

## Cómo repetir la autorización OAuth2 (si hace falta reconectar)

App activa: **"Fitness Suplementos - Agente IA v2"**, id 398861, cuenta Santiago (`usersantifitness@gmail.com`), escopos Produtos + Controle de Estoque. Client ID `5c4cdb73dc5148b34ee2a83a50c24d3273e2290b` (no es secreto). El `code` de autorización expira en **menos de lo que tarda un round-trip entre dos tool calls** — la receta que funciona es hacer todo (pedir el `code` + canjearlo) dentro de un único script, siguiendo la redirección automáticamente (`fetch(authUrl, {redirect:'follow'})`, nunca `'manual'`) y extrayendo el `code` de `res.url` tras seguirla, todo en el mismo origen (`bling.com.br`) y la misma llamada. Detalle completo, incluida la app vieja abandonada (id 398769, cuenta de Facundo — cuenta distinta porque "Cadastro de aplicativos" es privado por usuario, no por empresa), en [[18-integracion-bling]].

**Nunca pedirle al usuario que pegue el Client Secret o un token en el chat.** Todo el intercambio se hace con `browser_evaluate` dentro del navegador, devolviendo solo resultados no sensibles.

## Mecanismo de renovación automática
Flujo `FV|Bling - Renovacion de Token` (id 5117), Agendado cada 5h: Contato fijo "Sistema - Bling Token" (find-or-create confirmado, no duplica) → Requisição HTTP a `POST /Api/v3/oauth/token` con `grant_type=refresh_token` → guarda el nuevo `access_token`/`refresh_token` en 2 Campos de Contacto personalizados. Ver [[flujos-de-automatizacion]] para más flujos relacionados.

## Los 2 bugs reales que limitan todo lo demás (sin resolver)

1. **B1 — el `refresh_token` sembrado a mano no sobrevivió a la primera corrida real.** La primera ejecución real del flujo de renovación falló con `invalid_grant` — el refresh_token tiene una vida útil corta en términos absolutos, no solo "se invalida al usarse". Los tokens nuevos quedaron solo en memoria del navegador (`window.__blingTokens2`), nunca se persistieron en el contacto. **Bloquea todo lo demás de Bling hasta que alguien los pegue a mano.**
2. **B2 — `GET /produtos` y `/contatos` ignoran TODOS los parámetros de filtro/paginado** (`nome`, `codigo`, `pagina`, `limite`). Toda consulta devuelve exactamente los mismos 100 productos, siempre empezando por el mismo ID. Solo `GET /produtos/{id}` por ID exacto funciona bien. Hipótesis no confirmada: una factura de setiembre/2026 impaga (B3) podría estar degradando el acceso de la API a un modo "vista fija", en vez de bloquear todo con un error.

**Impacto concreto**: el flujo de alerta de stock revisa el mismo subconjunto de 100 productos 15 veces (no el catálogo completo), y no hay forma de resolver "nombre del producto que dijo el cliente" → ID de Bling sin ya tener un mapeo hecho a mano.

## Límites reales de la API (confirmados contra la documentación oficial)
3 requisições/segundo, 120.000/día. Bloqueo de 10 min si 300 errores en 10s o 600 req en 10s. Bloqueo de **60 minutos** si 20 requisições a `/oauth/token` en 60 segundos — cuidado al debuggear reintentos de token.

## Alternativa parcial que apareció después: Shopify
El conector nativo de Shopify (Hub de Integraciones, ver [[hub-de-integraciones]]) promete sincronizar productos/pedidos/clientes y detectar carrito abandonado — resolvería el catálogo sin depender de Bling. **Precaución**: el stock que muestra Shopify viene sincronizado DE Bling, así que hereda el mismo problema de stock (no lo resuelve, resuelve catálogo/precio/link/pedidos). Sigue sin conectar (N8).

## Pendientes relacionados
B1 (🔴 pegar los tokens nuevos, sin esto todo lo de Bling falla en silencio), B2 (🔴 causa desconocida del bug de filtros), B3 (factura impaga, hipótesis sin confirmar), B4 (decidir sobre la app vieja abandonada), N8 (conectar Shopify).
