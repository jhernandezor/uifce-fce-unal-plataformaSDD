import { filtrarSolicitudes } from '../core/query-engine.js';

const ACCIONES_POR_ESTADO = Object.freeze({
  pendiente: [
    { destino: 'en_proceso', etiqueta: 'Iniciar proceso' },
    { destino: 'rechazada', etiqueta: 'Rechazar' }
  ],
  en_proceso: [
    { destino: 'en_espera_usuario', etiqueta: 'Esperar usuario' },
    { destino: 'resuelta', etiqueta: 'Marcar resuelta' }
  ],
  en_espera_usuario: [
    { destino: 'en_proceso', etiqueta: 'Retomar proceso' }
  ],
  resuelta: [
    { destino: 'cerrada', etiqueta: 'Cerrar solicitud' }
  ],
  rechazada: [],
  cerrada: []
});

function escaparHtml(valor) {
  return String(valor ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

export function renderTicketList(contenedor, { solicitudes = [], filtros = {}, onTransicion } = {}) {
  if (!contenedor) return;

  const filtradas = filtrarSolicitudes(solicitudes, filtros);

  if (!filtradas.length) {
    contenedor.innerHTML = `
      <p class="mensaje-vacio" role="status">
        No hay solicitudes que coincidan con los filtros seleccionados.
      </p>
    `;
    return;
  }

  const itemsHtml = filtradas
    .map((sol) => {
      const acciones = ACCIONES_POR_ESTADO[sol.estado] || [];
      const botonesHtml = acciones
        .map(
          (acc) => `
          <button
            type="button"
            class="btn-accion-estado"
            data-solicitud-id="${escaparHtml(sol.id)}"
            data-estado-destino="${escaparHtml(acc.destino)}"
          >
            ${escaparHtml(acc.etiqueta)}
          </button>
        `
        )
        .join('');

      return `
        <article class="tarjeta-solicitud" data-id="${escaparHtml(sol.id)}">
          <div class="cabecera-solicitud">
            <strong>${escaparHtml(sol.radicado || sol.id)}</strong>
            <span class="badge-estado">${escaparHtml(sol.estado)}</span>
          </div>
          <p class="meta-solicitud">
            Tipo: <strong>${escaparHtml(sol.tipo)}</strong> ·
            Prioridad: <strong>${escaparHtml(sol.prioridad || 'media')}</strong> ·
            Solicitante: <span>${escaparHtml(sol.solicitanteEmail)}</span>
          </p>
          <p class="descripcion-solicitud">${escaparHtml(sol.descripcion)}</p>
          ${botonesHtml ? `<div class="acciones-solicitud">${botonesHtml}</div>` : ''}
        </article>
      `;
    })
    .join('');

  contenedor.innerHTML = `<div class="lista-solicitudes">${itemsHtml}</div>`;

  if (typeof onTransicion === 'function') {
    contenedor.querySelectorAll('.btn-accion-estado').forEach((btn) => {
      btn.addEventListener('click', () => {
        onTransicion({
          solicitudId: btn.dataset.solicitudId,
          estadoDestino: btn.dataset.estadoDestino
        });
      });
    });
  }
}