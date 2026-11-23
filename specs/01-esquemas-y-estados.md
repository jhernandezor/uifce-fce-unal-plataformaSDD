# Especificación SDD 01: Esquemas de Datos y Máquina de Estados (FSM)[cite: 1, 9]

## 1. Esquema de `Solicitud`
- `id`: identificador único
- `radicado`: código único de seguimiento (ej. `UIFCE-2026-00001`)[cite: 1]
- `tipo`: `'soporte'` | `'videoproyector'` | `'evento'`[cite: 1]
- `solicitanteEmail`: debe cumplir `^[a-zA-Z0-9._%+-]+@unal\.edu\.co$`[cite: 1]
- `codigoUnal`: solo dígitos, longitud de 6 a 12[cite: 1]
- `nombreCompleto`: solo letras, espacios y tildes[cite: 1]
- `telefonoOExtension`: 7 a 10 dígitos numéricos o extensión de 5 dígitos[cite: 1]
- `descripcion`: texto descriptivo del requerimiento[cite: 1]
- `estado`: estado actual según la FSM[cite: 1, 9]
- `creadoEn` / `actualizadoEn`: marcas de tiempo[cite: 1]

## 2. Esquema de `Equipo` (Inventario)
- `id`: identificador único
- `placaUnal`: alfanumérico en mayúsculas (ej. `UNAL-FCE-2026-XXXX`)[cite: 1]
- `categoria`: `'computo'` | `'videoproyector'` | `'periferico'` | `'red'`[cite: 1]
- `estadoOperativo`: `'disponible'` | `'prestado'` | `'en_mantenimiento'` | `'dado_de_baja'`[cite: 1]

## 3. Máquina de Estados Finita (FSM de Solicitudes)
Transiciones permitidas[cite: 9]:
- `pendiente` -> `en_proceso` | `rechazada`[cite: 9]
- `en_proceso` -> `resuelta` | `en_espera_usuario`[cite: 9]
- `en_espera_usuario` -> `en_proceso`[cite: 9]
- `resuelta` -> `cerrada`[cite: 9]
- `rechazada` y `cerrada`: estados terminales (no mutables directamente sin flujo de reapertura auditado)[cite: 9]