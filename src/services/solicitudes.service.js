import { evaluarTransicion } from '../core/fsm.js';
import { registrarAuditoriaTransicion } from './auditoria.service.js';
import { clasificarSolicitudHeuristica } from './ai-categorizer.service.js';
import { guardarSolicitudes } from './storage.service.js';

const REGEX_CORREO_UNAL = /^[a-zA-Z0-9._%+-]+@unal\.edu\.co$/;

export function crearSolicitudService(store) {
  function crearSolicitud({ solicitanteEmail, codigoUnal, nombreCompleto, telefonoOExtension, tipo, descripcion }) {
    const emailLimpio = String(solicitanteEmail || '').trim().toLowerCase();
    if (!REGEX_CORREO_UNAL.test(emailLimpio)) {
      return {
        ok: false,
        codigoError: 'CORREO_INSTITUCIONAL_INVALIDO',
        mensaje: 'Acceso restringido: Debe utilizar su correo institucional @unal.edu.co'
      };
    }

    const clasificacion = clasificarSolicitudHeuristica(descripcion);
    const ahora = new Date().toISOString();
    const estadoActual = store.getState();
    const listaActual = Array.isArray(estadoActual.solicitudes) ? estadoActual.solicitudes : [];

    const nuevaSolicitud = {
      id: `SOL-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
      radicado: `UIFCE-${new Date().getFullYear()}-${String(listaActual.length + 1).padStart(4, '0')}`,
      solicitanteEmail: emailLimpio,
      codigoUnal: String(codigoUnal || '').trim(),
      nombreCompleto: String(nombreCompleto || '').trim(),
      telefonoOExtension: String(telefonoOExtension || '').trim(),
      tipo: tipo || clasificacion.tipoSugerido,
      prioridad: clasificacion.prioridadSugerida,
      descripcion: String(descripcion || '').trim(),
      estado: 'pendiente',
      creadoEn: ahora,
      actualizadoEn: ahora
    };

    const siguientesSolicitudes = [nuevaSolicitud, ...listaActual];
    guardarSolicitudes(siguientesSolicitudes);
    store.setState({ solicitudes: siguientesSolicitudes });

    return { ok: true, solicitud: nuevaSolicitud };
  }

  function cambiarEstadoSolicitud({ solicitudId, estadoDestino, actorEmail, actorRol, motivo }) {
    const estadoActual = store.getState();
    const listaActual = Array.isArray(estadoActual.solicitudes) ? estadoActual.solicitudes : [];
    const indice = listaActual.findIndex((s) => s.id === solicitudId);

    if (indice === -1) {
      return {
        ok: false,
        codigoError: 'SOLICITUD_NO_ENCONTRADA',
        mensaje: `No se encontró la solicitud con id "${solicitudId}"`
      };
    }

    const solicitudActual = listaActual[indice];
    const evaluacion = evaluarTransicion({
      estadoActual: solicitudActual.estado,
      estadoDestino,
      actorEmail,
      actorRol,
      motivo
    });

    if (!evaluacion.valida) {
      return {
        ok: false,
        codigoError: evaluacion.codigoError,
        mensaje: evaluacion.mensaje
      };
    }

    const registro = registrarAuditoriaTransicion({
      solicitudId: solicitudActual.id,
      resultadoTransicion: evaluacion
    });

    const solicitudActualizada = {
      ...solicitudActual,
      estado: evaluacion.estadoNuevo,
      actualizadoEn: registro.historialEntry.registradoEn
    };

    const siguientesSolicitudes = listaActual.map((item, idx) =>
      idx === indice ? solicitudActualizada : item
    );

    const historialActual = Array.isArray(estadoActual.historial) ? estadoActual.historial : [];
    const auditoriaActual = Array.isArray(estadoActual.auditoria) ? estadoActual.auditoria : [];

    guardarSolicitudes(siguientesSolicitudes);
    store.setState({
      solicitudes: siguientesSolicitudes,
      historial: [registro.historialEntry, ...historialActual],
      auditoria: [registro.eventoAuditoria, ...auditoriaActual]
    });

    return {
      ok: true,
      solicitud: solicitudActualizada,
      historialEntry: registro.historialEntry,
      eventoAuditoria: registro.eventoAuditoria
    };
  }

  return {
    crearSolicitud,
    cambiarEstadoSolicitud
  };
}