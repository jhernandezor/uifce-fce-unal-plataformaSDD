# Arquitectura del Sistema — UIFCE (FCE - UNAL)

## Diagrama de Comunicación HTTP/REST, CORS y JWT

```mermaid
flowchart TB
    subgraph Cliente["Cliente Web - Angular v17+ (localhost:4200)"]
        UI["UI Institucional FCE - UNAL\nHeader 4 Niveles + Sidebar + Accesibilidad"]
        Forms["Reactive Forms\nValidación Cromática + Regex @unal.edu.co"]
        Inter["HttpInterceptor\nBearer JWT + Manejo Errores (401/403/422/500)"]
        Guards["AuthGuard & RoleGuard\n(Solicitante, Técnico UIFCE, Admin UIFCE)"]
    end

    subgraph LaravelAPI["Backend Core - Laravel / PHP 8.2+ (localhost:8000)"]
        CORS1["Middleware CORS\nOrigen: http://localhost:4200"]
        AuthMW["Auth & RBAC Middleware\nValidación JWT / Sanctum + Roles"]
        DomainRule["Regla Dominio @unal.edu.co\nBloqueo correos externos"]
        CoreCtrl["Controladores RESTful\nUsuarios, Tickets Soporte, Videoproyectores, Eventos"]
    end

    subgraph DjangoMS["Microservicio Inventario y Analítica - Django + DRF (localhost:8001)"]
        CORS2["django-cors-headers\nOrigen: http://localhost:4200"]
        JWTVal["Autenticación / Validación JWT\nVerificación de Token Emitido por Laravel"]
        InvCtrl["ViewSets Inventario y Mantenimientos\nPlacas UNAL-FCE-2026-XXXX, Filtros, Paginación"]
        RepCtrl["Analítica y Exportación\nMétricas Dashboard + CSV / Excel / PDF"]
    end

    subgraph DB["Persistencia - PostgreSQL (3FN)"]
        Tables["Tablas Normalizadas en 3FN\nUsuarios, Roles/Permisos, Tickets, Préstamos,\nEventos, Equipos/Videoproyectores, Mantenimientos, Auditoría"]
    end

    UI --> Forms --> Inter --> Guards
    Inter -- "HTTPS/REST + Bearer JWT\n(JSON: {status, message, data, errors})" --> CORS1
    Inter -- "HTTPS/REST + Bearer JWT\n(Paginación, Filtros, Exportación)" --> CORS2

    CORS1 --> AuthMW --> DomainRule --> CoreCtrl
    CORS2 --> JWTVal --> InvCtrl
    JWTVal --> RepCtrl

    CoreCtrl -- "Eloquent ORM / SQL" --> Tables
    InvCtrl -- "Django ORM / SQL" --> Tables
    RepCtrl -- "Consultas Agregadas / SQL" --> Tables
```

## Reglas Clave de Integración
- **CORS:** Tanto Laravel (`localhost:8000`) como Django (`localhost:8001`) deben habilitar CORS para `http://localhost:4200`, permitiendo `Authorization` y `Content-Type`[cite: 1].
- **JWT compartido:** Laravel autentica cuentas `@unal.edu.co` y emite el token JWT; Angular lo envía en `Authorization: Bearer <token>` a Laravel y a Django, y Django valida el token y el rol del usuario[cite: 1].