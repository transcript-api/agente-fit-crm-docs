# Hermes local no responde: diagnóstico estático y traza propuesta

Volver a [Empezá por acá](44-empeza-por-aca-hermes-crm-vps-2026-10-16.md).

**Corte de evidencia:** FIT-BRAIN `ca31ca73e34fb7d2b9ac1b12398e69c82f63884c`, igual a `origin/main` al consultar el 16/10. Revisión desde checkout montado, sin acceso al proceso Windows actual ni llamadas a CRM/modelo. No se inspeccionaron credenciales ni se ejecutó el servicio. El último checkpoint publicado es de las 03:53:17 UTC; no certifica su estado horas después.

## Hallazgo principal

**La ruta Codex fue verificada técnicamente, pero el último receptor todavía no había autorizado respuestas.** El handoff más reciente registra `WAITING_FOR_FRESH_CANARY`; el canario previo llegó antes del arranque y quedó excluido. El código exige un canario posterior al primer snapshot, con texto exacto `Canario Codex 16`, entrada del cliente y estado esperado, más tres observaciones estables separadas al menos 30 segundos y abarcando al menos 60 segundos. Después necesita revalidación final, activación y **otro mensaje nuevo** para el turno comercial. Es una compuerta deliberada, no evidencia de fallo del modelo.

También consta una conversación eliminada por el usuario y reemplazada por otra, y un receptor anterior detenido por DNS del CRM durante admisión. El reemplazo requirió verificación explícita: el código no sigue automáticamente tickets nuevos. Son hechos históricos observados; sin estado fresco no podemos afirmar cuál de ellos explica un mensaje enviado después del último checkpoint.

## Separación de capas y evidencia

| Capa | Evidencia concreta | Qué demuestra | Qué falta |
|---|---|---|---|
| Modelo | `ea60e6d` y `ca31ca7`: Hermes `openai-codex/gpt-6.1-sol`, respuesta SSE completada correlacionada y smoke, sin fallback | La ruta respondió en esas instancias | Disponibilidad actual, compatibilidad/capacidad sostenida, calidad comercial multiturno |
| Entrada al CRM | Handoff último: canario recibido antes de nuevo arranque en ticket reemplazado | Ese mensaje sí llegó al CRM | Mensaje posterior y ticket/owner actuales |
| Receptor/admisión | `current_own_admission.py`: primera foto excluida, fuente nueva inequívoca y 3 muestras/60s; `continuous_own_reception.py`: estados receive-only y recuperación | Un proceso vivo esperando puede no llamar al modelo por diseño | PID vivo, heartbeat fresco, estado/samples/error actual |
| Enrutamiento | Binding acotado y reemplazo explícito; integración nativa excluida en prueba propia | Piloto de un ticket, no escucha general | Binding real y origen de cualquier mensaje que hoy no responde |
| Ejecución Hermes | Mismo Hermes/r12 autor/revisor/estado; aislamiento técnico registrado | Motor preparado técnicamente en esa instancia | Turno comercial con correlación autor/revisor sobre nuevo input |
| Salida CRM | Launcher reply-only, ledger/checkpoints y readback | Contrato de control existe en código | Entrega actual correlacionada; no alcanza con texto generado ni HTTP 200 |

El **NVIDIA 502** de intentos anteriores es histórico. El usuario eligió Codex y los commits posteriores calificaron esa ruta. No corresponde atribuirle el fallo actual a NVIDIA ni volver a ese proveedor por defecto.

El polling actual usa sesión autenticada del CRM. La configuración de otra integración de mensajes en el sector y los webhooks de eventos de soporte son vías distintas: no concluir que falta una URL pública como causa del polling local. `localhost` sí sería inaccesible para una llamada iniciada desde servidores CRM en el diseño HTTP alternativo, documentado históricamente en A41.

## Cambios recientes relevantes

- `31414c4`: compatibilidad de cookie `Partitioned` para renovación de sesión; readback vivo registrado. No prueba expiración automática posterior ni causa definitiva del incidente anterior.
- `5fff775`: exclusión de historial estable previo al arranque; no convierte salidas históricas en autoría Hermes.
- `9b1f6d7`: espera ante errores transitorios de lectura antes de consumir input. No autoriza repetir POST ni ignorar permisos.
- `abd5ada`: registra bloqueo histórico por proveedor, luego superado para la ruta Codex.
- `ea60e6d` / `587bc67`: califican Codex y servicio esperando nuevo canario.
- `ca31ca7`: recuperación también durante admisión, reemplazo explícito del ticket y espera receive-only hasta apagado del mismo boot. Suites registradas: 333 CRM y 258 runner PASS **offline**, más controles técnicos de instancia; ninguna de esas cifras es aprobación E2E comercial.

## Qué se repetiría en un VPS

| Hallazgo/riesgo | ¿Lo resuelve mudar de máquina? |
|---|---|
| Historial/canario excluido, admisión pendiente, ticket equivocado, ownership/handoff | No: misma lógica/contrato exige evidencia nueva y trazabilidad |
| DNS/conectividad hacia CRM o modelo, sesión expirada, permisos/schema | Puede ocurrir también en VPS; requiere recuperación acotada y alertas |
| Mensajes sin entrega, salidas inciertas, duplicados, catálogo no vigente, batching ausente | No: son problemas de aplicación/contrato |
| PC apagada/suspendida y ausencia intencional de autostart tras reboot | Un servicio VPS diseñado y validado puede reducir ese riesgo |
| DPAPI CurrentUser, `ctypes.windll.kernel32`, rutas/ayudante externo al repo y setup ligado al boot Windows | Incompatibles con traslado directo a Linux; requieren adaptación explícita |
| Endpoint `localhost` en alternativa de push desde CRM | Necesita destino alcanzable/HTTPS; no explica por sí solo la ruta polling actual |
| Relay con sesión de suscripción local | Necesita verificar acceso, renovación, compatibilidad y límites en servidor; no copiar tokens ni garantizar capacidad |

## Traza segura propuesta, no ejecutada

**PENDIENTE:** H1/H2 — operador + constructor deben obtener estado fresco y localizar el primer corte. En esta tarea no se solicita ni envía el canario, no se activa nada.

1. En la máquina propietaria, comprobar PID y `updated_at_utc` del status, boot, versión/hashes y estado del relay/contenedores. Un checkpoint antiguo no prueba proceso vivo. Si está sano en espera, preservarlo; no reiniciar ni editar archivos fijados a ciegas.
2. Si estado es `WAITING_CRM_CONNECTION`, leer solo fase, clase de error, HTTP status seguro y backoff. Demostrar recuperación con binding fresco y reinicio de muestras. Sin consumir input, inferencia ni envío durante espera.
3. Si estado es `WAITING_FOR_FRESH_CANARY`, el operador debe autorizar una nueva prueba propia después de verificar receptor/binding. Un canario previo o varias coincidencias no sirven. Confirmar 3 muestras/60s y `ACTIVE_OWN_CONTACT` con proceso vivo; preservar canario como excluido.
4. Solo con autorización de prueba, usar un **input distinto y nuevo** del contacto propio. Seguir `CRM recibido → lectura → admisión/enrutamiento → input reservado en ledger → Hermes autor/revisor → decisión de salida → ownership vigente → envío → readback del mismo ticket → checkpoint verificado`.
5. En cada frontera registrar hora UTC, correlation ID opaco, versión, fase, duración, estado/error seguro y referencia privada al ID de mensaje; sin cuerpo, teléfono, tokens ni payload. Para soporte externo, correlaciones anonimizadas. Una fase sin evidencia queda UNKNOWN, no PASS.
6. Si no aparece en CRM: canal/entrada; si está en CRM pero no leído: polling/paginación/binding; si leído sin turno: estado de admisión/gates; si turno sin modelo: broker/grant/relay; si modelo completó sin salida: revisor/seguridad/ownership; si POST incierto: ledger/readback, nunca reenviar hasta conciliar.
7. Aceptar un único turno solo si hay una salida atribuida al autor/revisor Hermes, correspondiente al input, mismo ticket y readback de entrega. Parar ante doble emisor, scope distinto o resultado incierto. Repetir después escenarios de ráfaga, reinicio y handoff únicamente bajo plan aprobado.

## Fuentes reproducibles

FIT-BRAIN es **privado**. Los siguientes enlaces requieren acceso autorizado y fijan el commit inspeccionado; no se publican recibos crudos, identidades de clientes ni credenciales:

- [Último handoff: admisión y reemplazo](https://github.com/transcript-api/FIT-BRAIN/blob/ca31ca73e34fb7d2b9ac1b12398e69c82f63884c/13-HANDOFFS/2026-10-16-WORK-replacement-ticket-continuous-admission.md).
- [Contrato de transporte Codex](https://github.com/transcript-api/FIT-BRAIN/blob/ca31ca73e34fb7d2b9ac1b12398e69c82f63884c/07-OPERATIONS/crm-sandbox/CODEX-SUBSCRIPTION.md).
- [Admisión de canario y binding](https://github.com/transcript-api/FIT-BRAIN/blob/ca31ca73e34fb7d2b9ac1b12398e69c82f63884c/07-OPERATIONS/crm-sandbox/current_own_admission.py).
- [Servicio continuo y dependencias Windows](https://github.com/transcript-api/FIT-BRAIN/blob/ca31ca73e34fb7d2b9ac1b12398e69c82f63884c/07-OPERATIONS/crm-sandbox/continuous_own_reception.py).
- [Ledger/checkpoint y restauración](https://github.com/transcript-api/FIT-BRAIN/blob/ca31ca73e34fb7d2b9ac1b12398e69c82f63884c/07-OPERATIONS/crm-sandbox/durable_reception.py).

Estos enlaces respaldan una revisión estática y checkpoints históricos; no se abrieron sesiones vivas ni se ejecutaron sus comandos.
