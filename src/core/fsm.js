const TRANSICIONES_PERMITIDAS = Object.freeze({
  pendiente: ['en_proceso', 'rechazada'],
  en_proceso: ['resuelta', 'en_espera_usuario'],
  en_espera_usuario: ['en_proceso'],
  resuelta: ['cerrada'],
  rechazada: [],
  cerrada: []
});

const ROLES_TRANSICION_VALIDOS = new Set(['tecnico_uifce', 'admin_uifce']);
const REGEX_CORREO_UNAL = /^[a-zA-Z0-9._%+-]+@unal\.edu\.co$/;

export function evaluarTransicion({ estadoActual, estadoDestino, actorEmail, actorRol, motivo }) {
  if (!REGEX_CORREO_UNAL.test(String(actorEmail || ''))) {
    return {
      valida: false,
      codigoError: 'CORREO_INSTITUCIONAL_INVALIDO',
      mensaje: 'Acceso restringido: Debe utilizar su correo institucional @unal.edu.co'
    };
  }

  if (!ROLES_TRANSICION_VALIDOS.has(actorRol)) {
    return {
      valida: false,
      codigoError: 'ROL_NO_AUTORIZADO',
      mensaje: 'El rol indicado no tiene permisos para cambiar el estado de la solicitud'
    };
  }

  if (typeof motivo !== 'string' || motivo.trim().length < 5) {
    return {
      valida: false,
      codigoError: 'MOTIVO_INSUFICIENTE',
      mensaje: 'El motivo es obligatorio y debe tener al menos 5 caracteres'
    };
  }

  const destinosPermitidos = TRANSICIONES_PERMITIDAS[estadoActual] || [];
  if (!destinosPermitidos.includes(estadoDestino)) {
    return {
      valida: false,
      codigoError: 'TRANSICION_FSM_INVALIDA',
      mensaje: `Transición no permitida de "${estadoActual}" a "${estadoDestino}"`
    };
  }

  return {
    valida: true,
    estadoAnterior: estadoActual,
    estadoNuevo: estadoDestino,
    actorEmail,
    actorRol,
    motivo: motivo.trim()
  };
}