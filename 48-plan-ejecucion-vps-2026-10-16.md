# Informe de ejecución cuando haya VPS

Volver a [Empezá por acá](44-empeza-por-aca-hermes-crm-vps-2026-10-16.md). **PLAN PROPUESTO, NO DESPLEGADO.** El objetivo es llegar a una liberación con evidencia y rollback; no se garantiza 100 % de disponibilidad ni preparación por pasar pruebas offline.

## Inventario real y verificaciones previas

| Pieza observada en FIT-BRAIN | Evidencia / trabajo requerido en VPS |
|---|---|
| Hermes/r12 con autor/revisor, estado y SessionDB en worker aislado | Fijar commit, imagen por digest y dependencias; repetir límites de herramientas, archivos, red y separación de stores |
| Docker: worker y brokers restringidos por Unix sockets; controles 13 kernel/15 native registrados | Validar Linux/kernel/arquitectura y mecanismos de aislamiento equivalentes en servidor real; no reutilizar attestation de Windows |
| Host Python: receptor continuo, API CRM autenticada, ledger SQLite/checkpoint | Inventariar versiones, bibliotecas y esquema; medir concurrencia/backup/volúmenes; no asumir que escala por multiplicar procesos |
| Sesión CRM y DPAPI CurrentUser ligada al boot | Diseñar almacenamiento de secretos Linux con mínimos permisos y renovación aprobada; no copiar el ciphertext como configuración portable |
| Relay host-only Codex con sesión existente y grants finitos | Validar método de autenticación autorizado en servidor, renovación, capacidad, límites y compatibilidad; no suponer que una suscripción habilita cualquier uso/carga |
| Helper externo al repo, rutas WORK/audit-deps y validación `GetTickCount64` | Convertir dependencias en artefactos reproducibles y adaptar boot/supervisión; traslado directo no funciona |
| Polling de un ticket propio | Separar de integración entrante por sector/webhooks. Decidir una fuente principal y deduplicar recuperación; no activar ambas sin diseño |

No se midieron CPU/RAM/disco ni carga sostenida. Antes de comprar o dimensionar: registrar volumen de conversaciones, mensajes/ráfagas, latencia de turnos, tamaño de medios, retención, espacio de ledger/cola/backups y concurrencia permitida. Definir capacidad y presupuesto con mediciones del piloto, no con números inventados.

## Instalación reproducible propuesta

1. Revisar inventario, contrato CRM, política comercial y permisos; obtener aprobaciones de infraestructura/prueba por separado. Conservar snapshot de estado del CRM y automaciones afectadas, sin secretos en Git.
2. Preparar manifiesto de versiones: commit FIT-BRAIN, digest de imágenes, lockfiles, schema de almacenamiento, versión de prompts/reglas/catálogo y lista de dependencias externas. Construir en ambiente limpio y verificar hashes.
3. Preparar usuario de servicio y separación host/brokers/worker; worker sin credenciales de CRM/modelo ni acceso libre a red. Volúmenes persistentes fuera del ciclo de imagen. Cambios de seguridad (TLS, firewall, usuarios y accesos) quedan para ejecución aprobada; ninguno se hizo aquí.
4. Configurar conexiones por separado: **API de acciones CRM**, **entrada de mensajes**, **eventos CRM**, **modelo**, **catálogo/pedidos**. Cada una con healthcheck, permisos y rotación propios; una conexión sana no habilita las demás.
5. Si se elige push: destino HTTPS público con validación de origen según contrato, ACK acotado tras persistencia y protección contra replay. Si se mantiene polling: no fingir que el webhook de eventos lleva mensajes. Definir recuperación por historial para ambas rutas.
6. Supervisión propuesta: servicios con healthchecks y reinicio acotado/backoff. Liveness distingue vivo de ready: readiness exige binding, fuentes, persistencia y dependencias válidas. Un reinicio no debe enviar historial ni reanudar grants de otra instancia. Autostart nuevo requiere diseño/aprobación; el piloto Windows actual intencionalmente no lo tiene.
7. Probar restore desde backup en instancia aislada y conciliación con CRM antes de abrir salida; ejecutar shadow, contacto propio aprobado y liberación gradual en ese orden.

Variables propuestas, **solo nombres de contrato** (no variables ya soportadas ni valores reales):

```text
APP_ENV, TENANT_SCOPE_REF, CRM_ACTIONS_BASE_URL, CRM_AUTH_SECRET_REF
CRM_MESSAGE_INGRESS_MODE, CRM_EVENT_INGRESS_PATH, PUBLIC_HTTPS_BASE_URL
MODEL_ROUTE, MODEL_AUTH_SECRET_REF, CATALOG_SOURCE_REF, ORDER_SOURCE_REF
STATE_VOLUME, QUEUE_VOLUME, LEDGER_PATH, CHECKPOINT_PATH
ACTION_RATE_POLICY_REF, DAILY_SPEND_LIMIT, ALERT_DESTINATION_REF
BACKUP_POLICY_REF, RELEASE_VERSION, OUTBOUND_ENABLED
```

Guardar secretos fuera de prompts/repositorio/logs; las referencias deben resolverse en el almacén elegido, no por el LLM. Separar empresas y ambientes. Nada de esta lista crea credenciales ni configura el servidor.

## Persistencia, recuperación y operación

Persistir cola, dedup, estado de conversación, tareas/seguimientos, outbox/ledger y checkpoints. Para SQLite usar backup consistente, no copia arbitraria durante escritura. Definir retención, cifrado y acceso; guardar backups fuera del host y comprobar restauración, integridad, ownership y versión. No restaurar una base antigua y reenviar sin reconciliar salidas recientes del CRM.

Objetivos propuestos para acordar: **RPO ≤5 minutos de almacenamiento propio** y **RTO ≤30 minutos**, medidos en ensayo. Recuperación de avisos no entregados depende del contrato/retención CRM y de H3; no prometer cobertura antes de medirla. Verificar mensajes entrantes y salientes durante el hueco y no responder a lo ya atendido.

Presupuestos de 60/min por tipo de acción según soporte, con margen operativo; leer remanente/reset reales. Alertas propuestas: receptor no listo, cola envejecida, checkpoint estancado, auth caída, errores por acción, límites próximos, modelo indisponible, entrega incierta, doble emisor y costo próximo/al tope. Alertar no significa escribir a personas automáticamente sin destino/autorización definidos.

## Secuencia de liberación y criterios concretos

Todos los umbrales de esta sección son **criterios propuestos para aprobación**, no resultados alcanzados.

| Puerta | Criterio de aceptación verificable |
|---|---|
| Build y aislamiento | Instalación limpia reproducible; versiones/hashes fijados; controles equivalentes a los de la instancia original y pruebas de denegación sin fuga entre empresas |
| Conexiones | Healthchecks independientes CRM acciones/mensajes/eventos/modelo/fuentes; expiración/renovación y permisos incorrectos fallan con diagnóstico seguro |
| Shadow | Al menos 24 h y 30 entradas de prueba representativas, sin salida; sin pérdida de entradas persistidas; cada caso explica qué haría y por qué; fuentes no verificadas bloqueadas |
| Prueba propia aprobada | Canario actual según mecanismo de admisión; luego al menos 10 turnos nuevos y 3 ráfagas, una salida verificada por lote, cero doble emisor, cero scope cruzado y cero hecho comercial inventado |
| Fallos y recuperación | Cortes antes/después de persistir, generar, enviar y verificar; reinicio y restauración ensayados. Cero reenvío ciego; resultados inciertos quedan bloqueados hasta conciliación; historial atendido no genera respuesta |
| Handoff y agenda | Prueba de vendedor asumiendo durante generación y al vencer seguimiento; ninguna salida del emisor anterior sin ownership válido. Si proveedor no aclara la carrera, esa capacidad queda deshabilitada |
| Calidad | Casos de seguridad, ambigüedad, stock desconocido, pedido directo, multimedia ilegible e instrucciones maliciosas pasan contratos de texto y acciones. Regresión histórica y multiturno Codex pendientes deben cerrarse |
| Observabilidad y gastos | Cada frontera tiene correlación y métricas sin secretos; pausa por tope probada; latencia p95 dentro del SLA que el equipo acuerde antes del piloto |
| Liberación gradual | Primero contacto propio; luego cohorte pequeña de leads expresamente aprobada, con operador disponible. Ampliar solo tras revisión diaria de errores, entregas y costos |

Una suite offline PASS permite avanzar de puerta técnica; no permite saltar shadow, prueba de entrega ni aceptación comercial.

## Stop y rollback

Detener salidas inmediatamente ante cruce de empresa, dos emisores, compra/precio inventados, incumplimiento de seguridad, entrega incierta sin conciliación o gasto al tope. Preservar entradas, cola, ledger y evidencias; desactivar consumidor de salida y revocar autoridad de la instancia afectada según el procedimiento aprobado.

Rollback propuesto: fijar la última versión aprobada, validar compatibilidad de schema y backup, conciliar CRM desde último checkpoint y revalidar binding/ownership. No restaurar secretos/grants de una instancia anterior ni hacer downgrade de base a ciegas. Volver a humano como emisor requiere handoff explícito para no duplicar con nativos; no encender todos los agentes como mecanismo de recuperación.

**PENDIENTE:** H5 — operador + constructor deben elegir servidor, medir capacidad, adaptar Windows/secretos, aprobar objetivos, ensayo de backup/restore y plan de despliegue. H2/H3/H4/H6/H7 son puertas relacionadas, no tareas resueltas por disponer de VPS.
