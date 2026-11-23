# Especificación SDD 02: Contratos de UI, Validación y Identidad FCE - UNAL

## 1. Expresiones Regulares y Reglas de Validación
- **Correo institucional:** `^[a-zA-Z0-9._%+-]+@unal\.edu\.co$` (mensaje ante dominio externo: *"Acceso restringido: Debe utilizar su correo institucional @unal.edu.co"*)[cite: 1].
- **Código / Documento UNAL:** solo dígitos, longitud entre 6 y 12[cite: 1].
- **Nombre completo:** solo letras, espacios y tildes (alerta inmediata ante números o símbolos)[cite: 1].
- **Teléfono / Extensión UNAL:** 7 a 10 dígitos numéricos o extensión interna de 5 dígitos[cite: 1].
- **Serial / Placa UNAL:** alfanumérico en mayúsculas automáticas (ej. `UNAL-FCE-2026-XXXX`)[cite: 1].
- **Contraseña:** mínimo 8 caracteres, mayúscula, minúscula, número y carácter especial, con medidor visual (rojo → amarillo → verde)[cite: 1].
- **Botón Submit:** deshabilitado (`opacity: 0.6`, `cursor: not-allowed`) con tooltip informativo hasta que el 100% del formulario sea válido[cite: 1].

## 2. Estados Cromáticos de Campos (`input` / `dirty`)
- **Neutro (`pristine`):** borde `#cccccc`[cite: 1].
- **Inválido (`invalid && dirty`):** borde `#d32f2f`, fondo `#fff8f8`, icono `!` y mensaje descriptivo[cite: 1].
- **Válido (`valid && dirty`):** borde `#2e7d32` e icono `✓`[cite: 1].

## 3. Tokens de Identidad Visual FCE - UNAL
- **Tipografía:** `'Ancizar Sans', 'Open Sans', 'Roboto', sans-serif` (pesos `400`, `600`, `700`)[cite: 1].
- **Header superior / barra institucional:** `#333333` y `#4d4d4d`, texto `#FFFFFF`[cite: 1].
- **Banner principal FCE:** degradado horizontal `#4b6b50` → `#1e4d6b` → `#4b1e5a`[cite: 1].
- **Fondos:** `#dcdcdc` / `#e6e6e6` en lienzo exterior; `#FFFFFF` en tarjetas, contenedores y menú lateral[cite: 1].
- **Botones y acordeones:** `#1a528a` / `#134375`, `:hover` `#0d2f52`, botón principal redondeado `border-radius: 12px` con fondo `#1b365d`[cite: 1].
- **Flotantes y accesibilidad:** barra lateral izquierda `#2c3e50`, pestaña lateral de servicios `#94b83d`, panel de accesibilidad `#0066cc`[cite: 1].