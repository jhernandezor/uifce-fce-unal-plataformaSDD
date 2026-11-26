# Contrato de Máquina de Estados (FSM) y Auditoría — UIFCE (FCE - UNAL)

## Tabla de Transiciones Permitidas
- `pendiente` -> `en_proceso` | `rechazada`
- `en_proceso` -> `resuelta` | `en_espera_usuario`
- `en_espera_usuario` -> `en_proceso`
- `resuelta` -> `cerrada`
- `rechazada` y `cerrada`: estados terminales (no mutables mediante transición directa).

## Reglas de Validación de Transición
- Toda transición debe validarse contra `specs/schemas/transicion-estado.schema.json` y producir una salida conforme a `specs/schemas/resultado-transicion.schema.json`.
- El `actorEmail` debe pertenecer al dominio `@unal.edu.co` y tener rol `tecnico_uifce` o `admin_uifce`.
- El campo `motivo` es obligatorio (mínimo 5 caracteres) para justificar cualquier cambio de estado o rechazo.

## Registro Inmutable de Historial y Auditoría
- Cada transición válida genera un registro en historial (`specs/schemas/historial-estado.schema.json`) y un evento de auditoría (`specs/schemas/auditoria-evento.schema.json`).
- Los registros históricos no se editan ni se eliminan; cualquier corrección posterior se registra como un nuevo evento con su marca de tiempo y actor responsable.