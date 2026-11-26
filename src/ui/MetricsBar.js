import { resumirMetricasSolicitudes } from '../core/query-engine.js';

const ETIQUETAS_ESTADO = Object.freeze({
  pendiente: 'Pendientes',
  en_proceso: 'En proceso',
  en_espera_usuario: 'En espera usuario',
  resuelta: 'Resueltas',
  rechazada: 'Rechazadas',
  cerrada: 'Cerradas'
});

export function renderMetricsBar(contenedor, solicitudes = []) {
  if (!contenedor) return;

  const metricas = resumirMetricasSolicitudes(solicitudes);

  const tarjetasEstado = Object.entries(ETIQUETAS_ESTADO)
    .map(
      ([clave, etiqueta]) => `
      <div class="metrica-card" data-estado="${clave}">
        <div>${etiqueta}</div>
        <div class="metrica-valor">${metricas.porEstado[clave] ?? 0}</div>
      </div>
    `
    )
    .join('');

  contenedor.innerHTML = `
    <div class="grid-metricas" aria-label="Indicadores de solicitudes">
      <div class="metrica-card" data-estado="total">
        <div>Total solicitudes</div>
        <div class="metrica-valor">${metricas.total}</div>
      </div>
      ${tarjetasEstado}
    </div>
  `;
}