# Pipeline Real en Producción — "CL | COMERCIAL"

Ruta real: `/business/funnel` (NO `/crm`, esa ruta tiene un bug — ver [[05-infraestructura-tecnica]]).

Este es el pipeline que usa la empresa de verdad, con datos reales de clientes. **~2000-2014 negocios** (el número sube en vivo, vi 2007 → 2008 → 2014 en distintos momentos).

## Columnas (7) y sus automatizaciones
| Columna | Automatización | Qué hace |
|---|---|---|
| CL \| LEAD NUEVO | Ninguna | — |
| CL \| EN CONVERSACION | "Ad. [Tag Proposta Enviada]" (Ativa) | Disparador "Entrada en la Tarjeta" → acción "Añadir Etiqueta". Solo etiqueta, no manda mensajes. |
| CL \| SEGUIMIENTO (~208 leads) | **Ninguna** | Hueco crítico: nadie recibe seguimiento automático acá. |
| CL \| PAGO PENDIENTE | "AD. [TAG VENTAS]" (Ativa) | Igual patrón, solo etiqueta. |
| CL \| VENTA GANADA | "CL \| VENTA GANADA" (Ativa) | Igual patrón. |
| CL \| DERIVAR A REMARKETING | "CL \| REMARKETING" (Ativa) | Igual patrón. |
| CL \| CERRAR SIN VENTA | Ninguna | — |

**Conclusión clave**: el motor de automatización por columna existe y funciona, pero en la cuenta real **solo se usa para etiquetar**, nunca para enviar mensajes de seguimiento. Es exactamente el hueco que se está llenando en [[03-funil-de-ventas-nuevo]] como plan piloto.

## Cómo se edita una automatización de columna (UI confirmada)
1. Modo edición (ícono engranaje/lápiz arriba a la derecha del pipeline).
2. En la columna, click en el bloque "Automatizaciones y webhooks".
3. Si ya hay una: aparecen 4 íconos por automatización — **[0] lápiz=Editar, [1] rayo/power=Activar-Desactivar, [2] duplicar, [3] basura=Eliminar**. CUIDADO: el ícono de power está al lado del lápiz, es fácil clickear el equivocado (ya pasó).
4. Si no hay ninguna: botón "+ Crear Primera Automatización" abre "Configuración de la columna" → pestaña Automatizaciones → "+ Nueva Automatización".
5. Modal "Nueva/Editar Automatización": Nombre, Descripción, toggles (Ejecutar Retroactivamente, Intervalo entre Ejecuciones, Respetar Horario de Atención), sección DISPARADORES (+ Añadir Disparador), sección ACCIONES (+ Añadir Acción).
6. **Ojo con duplicados**: al añadir un disparador o una acción a veces queda uno vacío/default además del que configurás — siempre revisar que quede UNO solo antes de Guardar.

### Tipos de Disparador confirmados
- **"Entrada en la Tarjeta"** — dispara apenas el negocio entra a la columna (inmediato).
- **"Tiempo en la Columna"** — campos: Tiempo (numérico) + Unidad (segundos/minutos/horas). Nota literal del sistema: *"Ejecuta solo una vez cuando la tarjeta alcanza el tiempo configurado en la columna"*. **Importante**: mide tiempo desde que la tarjeta ENTRÓ a la columna, no desde el último mensaje del cliente. No tiene excepción automática tipo "cancelar si el cliente ya respondió" (al menos no la encontramos en la UI). Mitigación real: mover la tarjeta de columna cuando el cliente responde.
- Aviso que aparece con triggers de tiempo: *"Esta automatización respeta el horario laboral configurado para el envío de mensajes"* — o sea, aunque el tiempo se cumpla de noche, no manda el mensaje hasta que abra el horario de atención. Bien, es un safety net automático.

### Tipos de Acción confirmados (lista completa del dropdown)
Enviar Mensaje · Enviar Plantilla de Mensaje · Enviar Embudo · Enviar Creativo · **Cambiar de Columna** · Asignar Etiqueta · Eliminar Etiqueta · Agregar Agente · Remover Agente · (posiblemente más, scrolleado parcial)

- **"Enviar Mensaje"** — textarea de texto plano, placeholder de nombre tipo `{Nombre}` (sin autocompletado ni ayuda visual — hay que escribirlo a mano, no hay lista de variables disponibles en la UI). El nombre sale del campo "Nombre" ya guardado en la ficha del contacto (mail-merge simple), NO de que el sistema "entienda" quién es — si el contacto no tiene nombre cargado, probablemente sale vacío o con el teléfono.
- **"Cambiar de Columna"** — mueve la tarjeta/negocio a otra etapa (u otro pipeline) automáticamente. Es probablemente lo que usan las automatizaciones reales "CL|REMARKETING" y "CL|VENTA GANADA" para derivar leads. Útil para: si un lead no responde después de mucho tiempo, moverlo solo a "Cerrar Sin Venta" o a remarketing, en vez de dejarlo colgado para siempre.
- Una automatización puede tener **más de una acción** (ej. Asignar Etiqueta + Cambiar de Columna juntas en el mismo disparador).
- Selector "Tipo de Conexión": "Conexión predeterminada" (y probablemente "Última conversa" / conexión específica / rotativa, según lo documentado del video de referencia, no confirmado 100% en esta plataforma).
- Aviso visto: *"Los mensajes tienen un retraso de 30 segundos entre ellos para evitar bloqueos por spam."*

No se confirmó la existencia de una sección de "Excepciones" (tipo "cancelar si hubo intercambio de mensajes") en esta plataforma — se buscó y no apareció en lo revisado.

## Etiquetas reales (número de contactos, vistas en `/business/tags`)
Confirma que es una cuenta real en producción, escala grande:
- PROPUESTA ENVIADA: 4915
- PAGO PENDIENTE: 3454
- CL | PAGO PENDIENTE: 198
- CL | VENTA GANADA: 184
- NO SE ENCONTRO EN IG: 131
- RE COMPRA - LUCÍA: 325, RE COMPRA - KALIME: 260, RE COMPRA - FACUNDO: 150, RE COMPRA - LAURA: 106 (tags de recompra por vendedor/atribución)
- CL|D2-SEGUIMIENTO: 33, CL|D3-SEGUIMIENTO: 7
- DUPLICADO: 40, Live: 62, CL|DERIVADO A REMARKETING: 14

## Otros pipelines existentes (menú "Pipelines")
Pipeline CL | COMERCIAL (el real, arriba) · Pipeline RMKG - REMARKETING · Pipeline Recompra · Pipeline Follow-Up · BASE FRIA · RE MARKETING - SPRINT AGOSTO · **Funil De Ventas** (el nuevo, ver [[03-funil-de-ventas-nuevo]]) · opción para crear nueva.

## Otras secciones del sidebar CRM
- **Contactos**, **Centro de Actividades**, **Programación**, **Grupos de Contactos** — no auditadas en profundidad todavía.
- **Productos Comerciales** (`/business/commercial-products`): tabla Nombre/Valor — **completamente vacía** ("Nenhum dado encontrado"), pese a vender activamente muchos productos reales. Pendiente cargar catálogo acá para que el futuro agente tenga precios/stock de donde tomar datos (ver [[06-seguridad-y-pendientes]] sobre por qué esto no debería ser solo RAG).
- **Recursos** (`/business/... resources`, sidebar principal): Criativos/Llamadas/Chats/Modelos de Mensajes/Enlaces de Redirección — vacío también ("Nenhuma mensagem").

## Equipo (Configuración → Usuarios)
7 usuarios, todos perfil "admin" (sin diferenciación de roles/permisos):
- User Santi, Laura, Facundo, Santiago → **Pausado: Conversas e Ligações** (4 de 7 pausados)
- Kalime, Valentina, "Fitness Suplementos" (cuenta de gestión) → Activos

Cola "comercial" (Configuración → Colas) tenía solo 1 usuario asignado en la primera auditoría.
