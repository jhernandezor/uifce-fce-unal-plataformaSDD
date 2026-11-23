# Especificación SDD 00: Dominio, Roles (RBAC) y Reglas Institucionales — UIFCE (FCE - UNAL)[cite: 1, 9]

## 1. Restricción de Correo Institucional[cite: 1]
- Dominio permitido: `@unal.edu.co` (`^[a-zA-Z0-9._%+-]+@unal\.edu\.co$`)[cite: 1].
- Cualquier otro dominio debe ser bloqueado con el mensaje exacto: *"Acceso restringido: Debe utilizar su correo institucional @unal.edu.co"*[cite: 1].

## 2. Roles y Alcance (RBAC)[cite: 1]
- **`solicitante`** (Estudiante / Docente / Administrativo / Egresado): crea solicitudes de soporte, reserva videoproyectores, solicita apoyo a eventos y consulta el estado de sus solicitudes[cite: 1].
- **`tecnico_uifce`**: toma tickets asignados, actualiza diagnósticos, registra mantenimientos preventivos/correctivos y consulta inventario[cite: 1].
- **`admin_uifce`**: gestiona usuarios, roles, inventario general (`UNAL-FCE-2026-XXXX`), analítica/exportación de reportes y auditoría[cite: 1].

## 3. Reglas de Validación en Formularios[cite: 1]
- Código / Documento UNAL: solo dígitos, longitud de 6 a 12 caracteres[cite: 1].
- Nombre completo: solo letras, espacios y tildes[cite: 1].
- Teléfono / Extensión UNAL: 7 a 10 dígitos numéricos o extensión interna de 5 dígitos[cite: 1].
- Serial / Placa UNAL: alfanumérico en mayúsculas automáticas (ej. `UNAL-FCE-2026-XXXX`)[cite: 1].
- Botón `Submit` deshabilitado hasta que el 100% del formulario sea válido[cite: 1].