# Contrato de UI y Validación — Solicitudes UIFCE (FCE - UNAL)

## Identidad Visual y Estructura Base
- Tipografía principal: `Ancizar Sans`, con respaldo `Open Sans`, `Roboto`, `sans-serif`.
- Paleta institucional: degradado superior (`#4b6b50` -> `#1e4d6b` -> `#4b1e5a`), azules institucionales (`#1a528a`, `#134375`, CTA `#1b365d` con `border-radius: 12px`), lienzo claro (`#dcdcdc` / `#e6e6e6`), tarjetas blancas, pestaña `#94b83d` y panel de accesibilidad (`#0066cc`).

## Reglas de Campos y Estados Visuales
- **Correo institucional:** debe cumplir `^[a-zA-Z0-9._%+-]+@unal\.edu\.co$`.
- **Código UNAL:** 6 a 12 dígitos (`^[0-9]{6,12}$`).
- **Nombre completo:** 2 a 150 caracteres alfabéticos con espacios y tildes (`^[A-Za-zÁÉÍÓÚáéíóúÑñÜü ]{2,150}$`).
- **Teléfono o extensión:** 5 dígitos (extensión) o 7 a 10 dígitos (`^([0-9]{5}|[0-9]{7,10})$`).
- **Estados del campo:**
  - Sin interacción (`pristine`): borde `#cccccc`.
  - Inválido y tocado (`invalid && dirty`): borde `#d32f2f`, fondo `#fff8f8` y mensaje de error claro.
  - Válido y tocado (`valid && dirty`): borde `#2e7d32` e indicador válido.
- El botón de envío permanece deshabilitado (`opacity: 0.6`, `cursor: not-allowed`) hasta que todos los campos obligatorios cumplan su contrato.