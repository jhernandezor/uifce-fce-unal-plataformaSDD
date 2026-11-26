const REGLAS_PALABRAS = [
  { categoria: 'soporte', prioridad: 'alta', palabras: ['caido', 'caída', 'no enciende', 'error', 'urgente', 'red', 'internet', 'correo', 'clave', 'contraseña'] },
  { categoria: 'videoproyector', prioridad: 'media', palabras: ['proyector', 'videobeam', 'hdmi', 'auditorio', 'salon', 'salón', 'pantalla'] },
  { categoria: 'evento', prioridad: 'media', palabras: ['evento', 'conferencia', 'transmision', 'transmisión', 'sonido', 'microfono', 'micrófono', 'seminario'] }
];

export function clasificarSolicitudHeuristica(descripcion = '') {
  const texto = String(descripcion || '').toLowerCase().trim();

  for (const regla of REGLAS_PALABRAS) {
    if (regla.palabras.some((p) => texto.includes(p))) {
      return {
        tipoSugerido: regla.categoria,
        prioridadSugerida: regla.prioridad,
        fuente: 'heuristica-local'
      };
    }
  }

  return {
    tipoSugerido: 'soporte',
    prioridadSugerida: 'baja',
    fuente: 'heuristica-local'
  };
}

export async function sugerirClasificacionSolicitud(descripcion = '', { endpoint = '', apiKey = '', fetchImpl = globalThis.fetch } = {}) {
  const textoLimpio = String(descripcion || '').trim();
  if (!textoLimpio) {
    return clasificarSolicitudHeuristica('');
  }

  if (!endpoint || !apiKey || typeof fetchImpl !== 'function') {
    return clasificarSolicitudHeuristica(textoLimpio);
  }

  try {
    const respuesta = await fetchImpl(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({ descripcion: textoLimpio })
    });

    if (!respuesta || !respuesta.ok) {
      return clasificarSolicitudHeuristica(textoLimpio);
    }

    const datos = await respuesta.json();
    if (datos && datos.tipoSugerido && datos.prioridadSugerida) {
      return {
        tipoSugerido: datos.tipoSugerido,
        prioridadSugerida: datos.prioridadSugerida,
        fuente: 'api-externa'
      };
    }

    return clasificarSolicitudHeuristica(textoLimpio);
  } catch (_) {
    return clasificarSolicitudHeuristica(textoLimpio);
  }
}