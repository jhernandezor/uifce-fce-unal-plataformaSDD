export function registrarAuditoriaTransicion({
  solicitudId,
  resultadoTransicion,
  timestamp = new Date().toISOString(),
  generarId = () => `AUD-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`
}) {
  if (!resultadoTransicion || resultadoTransicion.valida !== true) {
    throw new Error('No se puede registrar auditoría o historial para una transición inválida');
  }

  const historialEntry = Object.freeze({
    id: generarId(),
    solicitudId,
    estadoAnterior: resultadoTransicion.estadoAnterior,
    estadoNuevo: resultadoTransicion.estadoNuevo,
    actorEmail: resultadoTransicion.actorEmail,
    actorRol: resultadoTransicion.actorRol,
    motivo: resultadoTransicion.motivo,
    registradoEn: timestamp
  });

  const eventoAuditoria = Object.freeze({
    id: generarId(),
    tipoEvento: 'SOLICITUD_ESTADO_CAMBIADO',
    entidad: 'Solicitud',
    entidadId: solicitudId,
    actorEmail: resultadoTransicion.actorEmail,
    actorRol: resultadoTransicion.actorRol,
    payload: Object.freeze({
      estadoAnterior: resultadoTransicion.estadoAnterior,
      estadoNuevo: resultadoTransicion.estadoNuevo,
      motivo: resultadoTransicion.motivo
    }),
    ocurridoEn: timestamp
  });

  return Object.freeze({
    historialEntry,
    eventoAuditoria
  });
}