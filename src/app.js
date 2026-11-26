import { createStore } from './core/store.js';
import { cargarSolicitudes } from './services/storage.service.js';
import { crearSolicitudService } from './services/solicitudes.service.js';
import { renderMetricsBar } from './ui/MetricsBar.js';
import { renderTicketList } from './ui/TicketList.js';
import { renderTicketForm } from './ui/TicketForm.js';

const SEMILLA_SOLICITUDES = [
  {
    id: 'SOL-SEED-001',
    radicado: 'UIFCE-2026-0001',
    solicitanteEmail: 'soporte.prueba@unal.edu.co',
    codigoUnal: '100200300',
    nombreCompleto: 'Laura Gómez',
    telefonoOExtension: '31845',
    tipo: 'soporte',
    prioridad: 'media',
    descripcion: 'Solicitud inicial de ejemplo para verificar el tablero UIFCE.',
    estado: 'pendiente',
    creadoEn: '2026-11-03T10:00:00.000Z',
    actualizadoEn: '2026-11-03T10:00:00.000Z'
  }
];

const store = createStore({
  solicitudes: cargarSolicitudes(SEMILLA_SOLICITUDES),
  historial: [],
  auditoria: [],
  filtros: {
    texto: '',
    estado: 'todos',
    tipo: 'todos'
  }
});

const solicitudesService = crearSolicitudService(store);

const elFormulario = document.querySelector('#contenedor-formulario');
const elMetricas = document.querySelector('#contenedor-metricas');
const elListado = document.querySelector('#contenedor-listado');
const elMensajeOperacion = document.querySelector('#mensaje-operacion');
const elFiltroTexto = document.querySelector('#filtro-texto');
const elFiltroEstado = document.querySelector('#filtro-estado');
const elFiltroTipo = document.querySelector('#filtro-tipo');

function mostrarMensaje(texto, esError = false) {
  if (!elMensajeOperacion) return;
  elMensajeOperacion.textContent = texto;
  elMensajeOperacion.dataset.tipo = esError ? 'error' : 'exito';
}

function manejarTransicion({ solicitudId, estadoDestino }) {
  const resultado = solicitudesService.cambiarEstadoSolicitud({
    solicitudId,
    estadoDestino,
    actorEmail: 'coordinador.uifce@unal.edu.co',
    actorRol: 'tecnico_uifce',
    motivo: `Transición registrada a estado "${estadoDestino}" desde el panel`
  });

  if (!resultado.ok) {
    mostrarMensaje(resultado.mensaje, true);
    return;
  }

  mostrarMensaje(`Solicitud ${resultado.solicitud.radicado} actualizada a "${resultado.solicitud.estado}".`);
}

function renderizarTodo(estado) {
  renderMetricsBar(elMetricas, estado.solicitudes);
  renderTicketList(elListado, {
    solicitudes: estado.solicitudes,
    filtros: estado.filtros,
    onTransicion: manejarTransicion
  });
}

renderTicketForm(elFormulario, {
  onSubmit: (datos) => {
    const resultado = solicitudesService.crearSolicitud(datos);
    if (!resultado.ok) {
      mostrarMensaje(resultado.mensaje, true);
      return false;
    }
    mostrarMensaje(`Solicitud ${resultado.solicitud.radicado} registrada correctamente.`);
    return true;
  }
});

function sincronizarFiltros() {
  store.setState((actual) => ({
    filtros: {
      ...actual.filtros,
      texto: elFiltroTexto ? elFiltroTexto.value : '',
      estado: elFiltroEstado ? elFiltroEstado.value : 'todos',
      tipo: elFiltroTipo ? elFiltroTipo.value : 'todos'
    }
  }));
}

elFiltroTexto?.addEventListener('input', sincronizarFiltros);
elFiltroEstado?.addEventListener('change', sincronizarFiltros);
elFiltroTipo?.addEventListener('change', sincronizarFiltros);

store.subscribe(renderizarTodo);
renderizarTodo(store.getState());