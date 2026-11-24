# Contrato de API — Solicitudes UIFCE (FCE - UNAL)

## Autenticación y Cabeceras Obligatorias
- Todas las rutas requieren token institucional válido asociado a un correo `@unal.edu.co`[cite: 4, 5].
- Si el correo no cumple `^[a-zA-Z0-9._%+-]+@unal\.edu\.co$`, responder `403 Forbidden` con el mensaje: `"Acceso restringido: Debe utilizar su correo institucional @unal.edu.co"`[cite: 4].

## Endpoints Principales

### 1. Crear Solicitud
- **Método y Ruta:** `POST /api/v1/solicitudes`
- **Roles permitidos:** `solicitante`, `tecnico_uifce`, `admin_uifce`[cite: 4]
- **Payload Entrada:** Cumple `specs/schemas/solicitud.schema.json` (sin `id`, `radicado`, `estado`, `creadoEn`, `actualizadoEn`, que son generados por el servidor).
- **Respuesta Exitosa (`201 Created`):** Objeto completo validado contra `specs/schemas/solicitud.schema.json` en estado inicial `pendiente`[cite: 4].
- **Error de Validación (`422 Unprocessable Entity`):** Lista de objetos conforme a `specs/schemas/error-validacion.schema.json`.

### 2. Listar Solicitudes
- **Método y Ruta:** `GET /api/v1/solicitudes`
- **Roles permitidos:**
  - `solicitante`: solo visualiza solicitudes propias (`solicitanteEmail == usuario.email`)[cite: 4].
  - `tecnico_uifce` y `admin_uifce`: visualizan todas las solicitudes con filtros opcionales (`estado`, `tipo`, `q`)[cite: 4].
- **Respuesta Exitosa (`200 OK`):** Arreglo de objetos conforme a `specs/schemas/solicitud.schema.json`.

### 3. Cambiar Estado de Solicitud (FSM)
- **Método y Ruta:** `POST /api/v1/solicitudes/{id}/transiciones`
- **Roles permitidos:** `tecnico_uifce`, `admin_uifce`[cite: 4]
- **Payload Entrada:** Cumple `specs/schemas/transicion-estado.schema.json`.
- **Respuesta Exitosa (`200 OK`):** Objeto conforme a `specs/schemas/resultado-transicion.schema.json` con `valida: true` y registro inmutable en historial.
- **Transición Prohibida (`409 Conflict`):** Objeto conforme a `specs/schemas/resultado-transicion.schema.json` con `valida: false` y `codigoError: "TRANSICION_FSM_INVALIDA"`.