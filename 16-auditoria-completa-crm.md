# Auditoría completa del CRM real — "hasta el extremo" (2026-09-11)

Recorrido exhaustivo de todas las secciones no revisadas todavía, a pedido del usuario ("mires todo lo que faltó ver, hasta el extremo"). Se encontraron varios hallazgos importantes — algunos son mejoras de diseño, otros son **problemas reales activos** en la cuenta que conviene resolver pronto. No se guardó ningún cambio real durante esta auditoría (se canceló todo lo que se abrió).

## 🚨 Hallazgos críticos (accionables, requieren decisión del usuario)

### 1. La cola "Atencion IA" NO está vinculada a ningún Agente de IA
En `Configuración → Colas`, la tabla muestra columna "Agente de IA" y las 3 colas existentes (`DS bot`, `comercial`, `Atencion IA`) dicen **"Ninguno"**. Se confirmó abriendo el editor de la cola "Atencion IA": el campo "Agente de IA" está vacío (placeholder, sin selección). **Esto contradice lo documentado antes** en [[01-agente-de-ia]] (que decía que ya estaba vinculada, visto desde la pestaña Canales del propio agente). Hay que verificar de nuevo desde el agente y, si corresponde, vincularlo acá también — sin esto, aunque el agente esté configurado, no va a recibir mensajes por esta cola.

### 2. "Respeitar horário de expediente" está DESACTIVADO a nivel de toda la empresa
En `Configuración → Horario de Atención`, el toggle maestro está en **Desabilitado**. Esto **corrige algo que dije antes**: había asumido que existía un "safety net automático" que evita mandar mensajes de madrugada, basado en un aviso de texto que aparece en las automatizaciones ("Esta automatización respeta el horario laboral..."). Con el toggle maestro apagado, ese aviso probablemente no tiene efecto real — los mensajes automáticos pueden salir a cualquier hora. Si se quiere ese control, hay que activarlo acá y configurar el horario.

### 3. El "Funil de Campanhas" de Marketing no está configurado — las ventas no se atribuyen a los anuncios
En `Marketing → Visión General`, el dashboard de anuncios muestra Vendas: R$0, 0% Conversão, -100% ROAS — a pesar de que sabemos que hay ventas reales todos los días (por las conversaciones leídas). La causa: en "Configurar Funil de Campanhas" (ícono de engranaje), los campos "Pipeline" y "Colunas do CRM" (obligatorio) están vacíos. Sin esto, la empresa no puede saber qué anuncios realmente generan ventas — un problema real para escalar el gasto en publicidad de forma inteligente. Requiere decidir con el usuario qué pipeline/columnas corresponden a "venta confirmada" antes de configurarlo.

### 4. API Keys "Claude Code" — todas Revocadas
En `Configuración → General → API Keys`: hay 3 claves llamadas "Claude Code"/"Claude" (permisos: contacts:read, tickets:read, crm:read, webhooks:manage), **todas en estado Revocada**. Sugiere que en algún momento se intentó dar acceso API directo (no solo vía navegador/Playwright) a Claude, y luego se revocó. No se investigó por qué — anotado para preguntarle al usuario si fue intencional.

## 📌 Hallazgo enorme para el diseño de Recompra: el sistema YA EXISTE, corriendo manualmente

### Centro de Actividades (`/business/activity-center`)
**1494 Próximas, 53 Hoy, 58 Atrasadas, 6033 Todas.** Una parte gigante de estas son actividades con Asunto **"recompra actividad"**, Categoría "Mensagem", Status "Abierta", asignadas a un Responsable (ej. Valentina), con fecha/hora exacta (ej. 12/09/2026 08:00). **Esto es, literalmente, el sistema de seguimiento de recompra que estábamos diseñando desde cero en [[14-funil-recompra]] — pero ya existe y está corriendo hoy, de forma manual**, generando miles de tareas para que el equipo humano contacte clientes en el momento estimado de reposición. Coincide con los eventos "Atividade criada: recompra" que ya habíamos visto en las conversaciones reales (ver [[04-patrones-reales-de-venta]]).

**Implicación para el proyecto**: antes de construir un mecanismo nuevo de reactivación de Recompra (Flujos de Automatización, Follow Up Generativo, etc.), vale la pena entender CÓMO se generan estas 6033 actividades hoy (¿automatización? ¿manual? ¿un flujo?) — probablemente ya resuelve el problema de "duración variable por producto" de alguna forma que no hemos visto todavía. Pendiente investigar el origen de estas actividades antes de reinventar la rueda.

### ✅ RESUELTO (2026-09-11): el origen es 100% MANUAL, no hay automatización oculta
Investigación completa hecha desde `Centro de Actividades`:

1. **El filtro "Tipo" (Origen) del Centro de Actividades tiene solo 3 valores: Todos / Cadencia de tareas / Actividades de lead.** Al filtrar por "Cadencia de tareas" (que sería el motor de secuencias automáticas de tareas de este CRM) → **0 resultados**. Al filtrar por "Actividades de lead" → los 6051 de siempre. **Conclusión: NINGUNA actividad del CRM, incluidas las de recompra, se generó por un motor de cadencias automático — ese motor existe en la plataforma pero la empresa nunca lo usó.**
2. Se abrió el detalle de una actividad "recompra" real (cliente Gaston Esteves) vía "Editar": es una tarjeta de tarea simple — Tipo "Mensagem", Responsável (una persona real, ej. Valentina), Assunto "recompra", fecha/hora exacta, duración 30 min, sin descripción ni automatización asociada. Es indistinguible de cualquier tarea creada a mano.
3. **Se encontraron las etiquetas que explican todo el sistema**, en `CRM → Etiquetas`, buscando "compra": existe una tag **"RE COMPRA - [nombre]" por cada vendedor**: `RE COMPRA - FACUNDO` (150 contactos), `RE COMPRA - KALIME` (260), `RE COMPRA - LAURA` (107), `RE COMPRA - LUCÍA` (325 — **"Lucía" es un miembro del equipo no documentado antes, agregar al roster de [[02-pipeline-comercial-real]]**), `RE COMPRA - SANTIAGO` (580). Total: **1422 contactos** repartidos entre 5 vendedores.

**Conclusión definitiva**: el sistema de recompra actual es un proceso 100% manual y humano — cada vendedor tagea a mano a sus propios clientes con "RE COMPRA - [su nombre]" como lista personal de seguimiento, y crea a mano una tarea con fecha/hora estimada de recompra para acordarse de escribirle. No hay ningún flujo, cadencia ni automatización real detrás de las 6033 actividades — son 6033 recordatorios cargados uno por uno. **Esto no reshapea el diseño del Flujo de Recompra planeado en [[15-flujos-automatizacion-avanzados]] — lo valida y lo hace más urgente**: hoy 5 personas gastan tiempo real tageando y agendando manualmente más de 1400 clientes: es exactamente el trabajo que el Flujo de Automatización (Data & Hora + Delay + Agente de IA) puede eliminar.

### Programación (`/business/schedules`, calendario)
Sistema de calendario con eventos programados y **mensajes agendados que se envían automáticamente** (se ven marcados "ENVIADA" con hora exacta, ej. "Hola Mati 14:27 - ENVIADA"). Hay "Contas vinculadas: 1" (cuenta de Google/calendario conectada). Esto es probablemente lo que usa la función `Enviar horários disponíveis` / Agendamentos del agente, y también podría explicar cómo se generan mensajes de recompra programados individualmente. Pendiente de investigar más a fondo.

## Otros hallazgos (menores o de contexto)

### Recursos → Criativos (`/resources/creatives`)
Confirmado que existe el equivalente real de "DS Voice" en esta cuenta bajo el nombre "Recursos": tiene sub-secciones con íconos para Chats/Áudio/Imagens/Documentos (misma estructura que DS Voice documentado en [[10-ds-agente-ds-voice-manual]]). Ya no está vacío como se documentó en la primera auditoría — hay una carpeta "XTR" con contenido. No se pudo entrar a ver el contenido exacto (click no abrió la carpeta) — pendiente de revisar con más tiempo.

### Configuración → Campos de Contacto
Se pueden crear **campos personalizados** en la ficha de contacto (botón "+ Novo Campo"). Actualmente solo existe uno: "Endereço" (tipo Texto). **Esto es relevante para la pregunta pendiente del total gastado por cliente** (ver [[07-estrategias-pendientes-agente]]) — se podría crear un campo tipo "Total Gastado" acá, y que el agente lo actualice vía función de guardar variable/campo, aunque seguiría dependiendo de que el agente sume bien (mismo riesgo de precisión ya discutido).

### Configuración → General → Comisiones, Acciones Masivas, Permisos, Cargos, Financiero, Plan, Telefonía
Vistos solo de pasada en el menú lateral, no explorados en profundidad — son de administración general del negocio (comisiones de vendedores, permisos de usuarios, plan de suscripción, telefonía), no directamente relevantes al proyecto del Agente de IA. Quedan pendientes si en algún momento hace falta.

### Marketing — resto de secciones
`Visitantes`, `Leads`, `Conversiones`, `Campañas`, `Mensajes`, `Integración` — se vio solo la pantalla principal ("Visión General"). No se exploró cada una en detalle — pendiente si se retoma el tema de atribución de campañas.

## Metodología seguida
Se navegó sección por sección sin guardar ningún cambio real (todo lo que se abrió para inspeccionar se cerró con "Cancelar"). Se investigó de forma más profunda donde se encontró algo directamente relevante al proyecto (Colas, Horario de Atención, Funil de Campanhas, Centro de Actividades) y de forma más superficial en secciones puramente administrativas.

## Pendiente / próximos pasos sugeridos
1. **Decidir y resolver** los 4 hallazgos críticos de arriba con el usuario (vínculo de cola, horario de atención, funil de campañas, API keys revocadas) — quedaron para el final, a pedido del usuario.
2. ~~Investigar el origen real de las 6033 actividades de "recompra actividad"~~ — **RESUELTO, ver sección arriba: es 100% manual, tageado por vendedor.**
3. Entrar a la carpeta "XTR" en Recursos/Criativos para ver qué contenido ya existe.
4. Revisar la sección "Programación" con más profundidad — parece tener mensajes ya funcionando de forma automática/programada.
