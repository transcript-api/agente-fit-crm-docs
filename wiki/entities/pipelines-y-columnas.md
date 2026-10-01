# Pipelines y columnas del CRM

**Qué es**: mapa de todas las pipelines (Kanban) reales del workspace "Fitness Suplementos", cuáles son de producción real y cuáles de práctica/test.
**Fuente primaria**: [[02-pipeline-comercial-real]], [[03-funil-de-ventas-nuevo]], [[08-funil-remarketing-nuevo]], [[14-funil-recompra]], [[33-pipeline-masivo-y-api-negocios-2026-09-19]].

## `CL | COMERCIAL` — la pipeline REAL en producción

~2000-2500 negocios reales (sube en vivo). Ruta correcta: `/business/funnel` (NO `/crm`, ver [[editor-slate-instrucciones]] y bugs de plataforma). 7 columnas:

| Columna | Automatización | Qué hace |
|---|---|---|
| `CL \| LEAD NUEVO` | Ninguna | Entrada |
| `CL \| EN CONVERSACION` | Solo etiqueta | Acá vincula el Flujo `CL\|Asignar Recepcionista` (id 6052) al agente [[agente-recepcionista-comercial-10005]] |
| `CL \| SEGUIMIENTO` (~208 leads) | **Ninguna** | Hueco: nadie recibe seguimiento automático acá |
| `CL \| PAGO PENDIENTE` | Solo etiqueta | — |
| `CL \| VENTA GANADA` | Solo etiqueta | — |
| `CL \| DERIVAR A REMARKETING` | Solo etiqueta | — |
| `CL \| CERRAR SIN VENTA` | Ninguna | — |

**Conclusión clave**: el motor de automatización de columna existe y funciona en la cuenta real, pero **solo se usa para etiquetar**, nunca para mensajes — ese hueco es lo que el resto de las pipelines de práctica venía llenando, y lo que ahora atiende el Recepcionista Comercial en la columna `EN CONVERSACION`.

Fila (cola) real: `comercial`, con 4 vendedoras/vendedores reales (Lucia, Kalime, Valentina, Santiago-humano) — el reparto rota entre ellos vía `transfer_ticket`, ver Q24 en `PENDIENTES.md`.

## `FV| FUNIL DE VENTAS ` (con espacio al final, así en el CRM) — pipeline de PRÁCTICA, id 23843

8 columnas, atendidas por los 3 agentes de [[agentes-legado-9882-9883-9884]]:
```
FV | ENTRADA DE LEAD → FV | CUALIFICACION → FV | PROPUESTA ENVIADA → FV | SEGUIMIENTO
→ FV | PAGO PENDIENTE → FV | DERIVAR A REMARKETING → FV | CERRAR SIN VENTA / FV| VENTA GANADA
```
Automatizaciones de tiempo con excepción "Intercambio de Mensajes" (2h) para no reactivar a alguien que ya respondió. Al 2026-09-15 las 7 automatizaciones de esta pipeline estaban **Inactivas** a propósito (pipeline de práctica).

**Ojo con los espacios**: el prompt a veces dice `FV\|CUALIFICACION` (sin espacios) y la columna real es `FV \| CUALIFICACION` (con espacios, a veces doble) — si el match del CRM es exacto, la transferencia falla en silencio (N13).

## `FV| RMKG - REMARKETING` — pipeline de práctica de remarketing

6 columnas: `REMARKETING - POR CONTACTAR` → `SEGUIMIENTOS - 1/2/3 CONTACTOS` → `LEAD REACTIVADO` / `PAGO PENDIENTE` / `VENTA GANADA` / `CERRAR SIN VENTA`. Solo las últimas 4 etiquetan al entrar; las dos primeras no tienen automatización — nadie mueve leads ahí solo, hace falta empuje manual o el mecanismo de [[remarketing-masivo]].

## `FV|RECOMPRA` — pipeline de práctica de posventa

3 columnas, una "sala de espera" por duración estimada del producto: `RECOMPRA - 30 DIAS`, `RECOMPRA - 60 DIAS`, `RECOMPRA - 90 DIAS`. Cuando el cliente responde desde cualquiera de las 3, se lo saca de ahí y se lo devuelve a `FV|PROPUESTA ENVIADA` (si va a decidir) o `FV|PAGO PENDIENTE` (si confirma repetir). Ver el Flujo `FV|Recompra - Reactivación` en [[flujos-de-automatizacion]].

**Dato importante para no reinventar la rueda acá**: ya existe un sistema de recompra real, pero es **100% manual** — 5 vendedores tagean a mano a sus clientes (`RE COMPRA - [nombre]`, 1422 contactos en total) y cargan tareas de recordatorio uno por uno (6033 actividades en el Centro de Actividades). No hay ninguna automatización real detrás. Esto no cambia el diseño de esta pipeline — lo valida y lo hace más urgente (reemplaza trabajo manual real).

## `PIPELINE MASIVO` (id 24326) — la cola de remarketing a los ~2400 leads viejos

Ver [[remarketing-masivo]] para el detalle completo del mecanismo. Columnas: `LEAD MASIVOS` (2396-2408 negocios acumulados, pulmón) + `CAMPAÑA TESTO DILATED/HIPERCALORICO/ISOLADO/WOMAN/CREATINA` (vacías, destino por producto).

## Otras pipelines existentes, no tocadas por el proyecto
`Pipeline RMKG - REMARKETING` (la real, 547 negocios, solo mirada como referencia para copiar el patrón), `Pipeline Recompra` (real, atendida a mano hoy), `Pipeline Follow-Up`, `BASE FRIA`, `RE MARKETING - SPRINT AGOSTO`.

## Pendientes relacionados
N13 (unificar nombres de columna con y sin espacios), N15 (poner destino a la automatización "Enviar a Remarketing" que quedó sin columna), A30 (mismo defecto posible en Cierre/Conversión).
