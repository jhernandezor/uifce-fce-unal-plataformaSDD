function escaparHtml(valor) {
  return String(valor ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

export function renderTicketDetailDrawer(
  contenedor,
  { solicitud = null, historial = [], auditoria = [], onCambiarEstado, onCerrar } = {}
) {
  if (!contenedor) return;

  if (!solicitud) {
    contenedor.innerHTML = '';
    return;
  }

  const historialSolicitud = historial.filter((h) => h.solicitudId === solicitud.id);
  const auditoriaSolicitud = auditoria.filter((a) => a.entidadId === solicitud.id);

  const historialHtml = historialSolicitud.length
    ? historialSolicitud
        .map(
          (item) => `
          <li>
            <strong>${escaparHtml(item.estadoAnterior)} → ${escaparHtml(item.estadoNuevo)}</strong>
            <div>Motivo: ${escaparHtml(item.motivo)}</div>
            <small>Actor: ${escaparHtml(item.actorEmail)} (${escaparHtml(item.actorRol)}) · ${escaparHtml(item.registradoEn)}</small>
          </li>
        `
        )
        .join('')
    : '<li>Sin cambios de estado registrados todavía.</li>';

  const auditoriaHtml = auditoriaSolicitud.length
    ? auditoriaSolicitud
        .map(
          (ev) => `
          <li>
            <code>${escaparHtml(ev.tipoEvento)}</code> · <span>${escaparHtml(ev.ocurridoEn)}</span>
            <div>Actor: ${escaparHtml(ev.actorEmail)} · Motivo: ${escaparHtml(ev.payload?.motivo || '')}</div>
          </li>
        `
        )
        .join('')
    : '<li>Sin eventos de auditoría registrados todavía.</li>';

  contenedor.innerHTML = `
    <aside class="panel-detalle" aria-label="Detalle y trazabilidad de solicitud">
      <div class="cabecera-detalle">
        <h3>Detalle de solicitud ${escaparHtml(solicitud.radicado || solicitud.id)}</h3>
        <button type="button" class="btn-cerrar-detalle">Cerrar</button>
      </div>

      <p><strong>Estado actual:</strong> <span class="badge-estado">${escaparHtml(solicitud.estado)}</span></p>
      <p><strong>Solicitante:</strong> ${escaparHtml(solicitud.nombreCompleto)} (${escaparHtml(solicitud.solicitanteEmail)})</p>
      <p><strong>Tipo / Prioridad:</strong> ${escaparHtml(solicitud.tipo)} · ${escaparHtml(solicitud.prioridad || 'media')}</p>
      <p><strong>Descripción:</strong> ${escaparHtml(solicitud.descripcion)}</p>

      <form class="form-transicion-detalle">
        <div class="campo">
          <label for="destino-detalle">Nuevo estado FSM</label>
          <select id="destino-detalle" name="estadoDestino">
            <option value="en_proceso">En proceso</option>
            <option value="en_espera_usuario">En espera usuario</option>
            <option value="resuelta">Resuelta</option>
            <option value="rechazada">Rechazada</option>
            <option value="cerrada">Cerrada</option>
          </select>
        </div>
        <div class="campo">
          <label for="motivo-detalle">Motivo del cambio (mínimo 5 caracteres)</label>
          <input id="motivo-detalle" name="motivo" type="text" required minlength="5" placeholder="Ej. Diagnóstico completado en aula" />
        </div>
        <button type="submit" class="btn-primario">Aplicar transición</button>
      </form>

      <h4>Historial de estados</h4>
      <ul class="lista-historial">${historialHtml}</ul>

      <h4>Auditoría inmutable</h4>
      <ul class="lista-auditoria">${auditoriaHtml}</ul>
    </aside>
  `;

  contenedor.querySelector('.btn-cerrar-detalle')?.addEventListener('click', () => {
    if (typeof onCerrar === 'function') onCerrar();
  });

  contenedor.querySelector('.form-transicion-detalle')?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (typeof onCambiarEstado !== 'function') return;
    const form = e.currentTarget;
    onCambiarEstado({
      solicitudId: solicitud.id,
      estadoDestino: form.estadoDestino.value,
      motivo: form.motivo.value
    });
  });
}