const CLAVE_SOLICITUDES = 'uifce_fce_unal_solicitudes_v1';

const memoriaRespaldo = new Map();

function obtenerAlmacen() {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage;
    }
  } catch (_) {
    // Fallback en memoria si localStorage no está disponible
  }
  return null;
}

export function cargarSolicitudes(semillaInicial = []) {
  const almacen = obtenerAlmacen();
  try {
    const raw = almacen ? almacen.getItem(CLAVE_SOLICITUDES) : memoriaRespaldo.get(CLAVE_SOLICITUDES);
    if (!raw) {
      const copiaSemilla = Array.isArray(semillaInicial) ? [...semillaInicial] : [];
      guardarSolicitudes(copiaSemilla);
      return copiaSemilla;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (_) {
    return Array.isArray(semillaInicial) ? [...semillaInicial] : [];
  }
}

export function guardarSolicitudes(solicitudes = []) {
  const lista = Array.isArray(solicitudes) ? solicitudes : [];
  const serializado = JSON.stringify(lista);
  const almacen = obtenerAlmacen();
  if (almacen) {
    almacen.setItem(CLAVE_SOLICITUDES, serializado);
  } else {
    memoriaRespaldo.set(CLAVE_SOLICITUDES, serializado);
  }
  return lista;
}

export function restablecerSolicitudes(semillaInicial = []) {
  const copiaSemilla = Array.isArray(semillaInicial) ? [...semillaInicial] : [];
  return guardarSolicitudes(copiaSemilla);
}