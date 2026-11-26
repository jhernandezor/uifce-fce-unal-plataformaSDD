export function applyCross(items, resolverFn) {
  if (!Array.isArray(items)) {
    throw new TypeError('applyCross espera un arreglo como colección base');
  }
  if (typeof resolverFn !== 'function') {
    throw new TypeError('applyCross espera una función evaluadora');
  }

  return items.map((item, index) => ({
    item,
    aplicado: resolverFn(item, index)
  }));
}

export function filtrarSolicitudes(solicitudes = [], { estado, tipo, texto } = {}) {
  const normalizar = (v) => String(v || '').trim().toLowerCase();
  const filtroTexto = normalizar(texto);

  return solicitudes.filter((sol) => {
    if (estado && estado !== 'todos' && sol.estado !== estado) return false;
    if (tipo && tipo !== 'todos' && sol.tipo !== tipo) return false;
    if (filtroTexto) {
      const enRadicado = normalizar(sol.radicado).includes(filtroTexto);
      const enDescripcion = normalizar(sol.descripcion).includes(filtroTexto);
      const enSolicitante = normalizar(sol.solicitanteEmail).includes(filtroTexto);
      if (!enRadicado && !enDescripcion && !enSolicitante) return false;
    }
    return true;
  });
}

export function resumirMetricasSolicitudes(solicitudes = []) {
  return solicitudes.reduce(
    (acc, sol) => {
      acc.total += 1;
      if (acc.porEstado[sol.estado] !== undefined) {
        acc.porEstado[sol.estado] += 1;
      }
      return acc;
    },
    {
      total: 0,
      porEstado: {
        pendiente: 0,
        en_proceso: 0,
        en_espera_usuario: 0,
        resuelta: 0,
        rechazada: 0,
        cerrada: 0
      }
    }
  );
}