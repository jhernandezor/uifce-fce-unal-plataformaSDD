# Especificaciones SDD — UIFCE (FCE - UNAL)[cite: 1, 9]

## Documentos de Dominio y Contratos
- `00-dominio-y-reglas.md`: Restricción `@unal.edu.co`, roles RBAC (`solicitante`, `tecnico_uifce`, `admin_uifce`) y reglas base de validación[cite: 1].
- `01-esquemas-y-estados.md`: Entidades `Solicitud` y `Equipo`, y máquina de estados finita (FSM) de solicitudes[cite: 1, 9].
- `02-contratos-ui-y-validacion.md`: Regex, estados cromáticos de campos (`pristine`, `invalid && dirty`, `valid && dirty`) y tokens visuales FCE - UNAL[cite: 1].

## Esquemas Formales (`specs/schemas/`)
- `solicitud.schema.json`: Contrato de datos para solicitudes de soporte, videoproyector y evento[cite: 1, 9].
- `equipo.schema.json`: Contrato de datos para inventario de equipos UNAL[cite: 1, 9].
- `transicion-estado.schema.json`: Contrato de entrada para transiciones de estado en la FSM[cite: 1, 9].
- `resultado-transicion.schema.json`: Contrato de salida al evaluar/aplicar una transición de estado[cite: 1, 9].
- `error-validacion.schema.json`: Catálogo tipificado de errores de validación del dominio[cite: 1, 9].
- `auditoria-evento.schema.json`: Estructura de eventos de auditoría por entidad y rol[cite: 1, 9].
- `historial-estado.schema.json`: Estructura de registros del historial de cambios de estado[cite: 1, 9].