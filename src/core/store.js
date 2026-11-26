export function createStore(estadoInicial = {}) {
  let estado = { ...estadoInicial };
  const suscriptores = new Set();

  function getState() {
    return estado;
  }

  function setState(actualizador) {
    const siguiente = typeof actualizador === 'function' ? actualizador(estado) : actualizador;
    if (!siguiente || typeof siguiente !== 'object') {
      return estado;
    }
    estado = { ...estado, ...siguiente };
    suscriptores.forEach((fn) => fn(estado));
    return estado;
  }

  function subscribe(listener) {
    if (typeof listener !== 'function') {
      return () => {};
    }
    suscriptores.add(listener);
    return () => {
      suscriptores.delete(listener);
    };
  }

  return {
    getState,
    setState,
    subscribe
  };
}