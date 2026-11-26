import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluarTransicion } from '../src/core/fsm.js';
import { applyCross, resumirMetricasSolicitudes } from '../src/core/query-engine.js';
import { createStore } from '../src/core/store.js';
import { crearSolicitudService } from '../src/services/solicitudes.service.js';

test('rechaza transicion cuando el correo no es @unal.edu.co', () => {
  const res = evaluarTransicion({
    estadoActual: 'pendiente',
    estadoDestino: 'en_proceso',
    actorEmail: 'usuario@gmail.com',
    actorRol: 'tecnico_uifce',
    motivo: 'Iniciando atencion'
  });

  assert.equal(res.valida, false);
  assert.equal(res.codigoError, 'CORREO_INSTITUCIONAL_INVALIDO');
});

test('permite transicion valida y genera registro de auditoria inmutable', () => {
  const store = createStore({ solicitudes: [], historial: [], auditoria: [] });
  const service = crearSolicitudService(store);

  const creada = service.crearSolicitud({
    solicitanteEmail: 'estudiante@unal.edu.co',
    codigoUnal: '10203040',
    nombreCompleto: 'Ana Perez',
    tipo: 'soporte',
    descripcion: 'El equipo del laboratorio no enciende al presionar el boton.'
  });

  assert.equal(creada.ok, true);
  assert.equal(creada.solicitud.estado, 'pendiente');

  const cambio = service.cambiarEstadoSolicitud({
    solicitudId: creada.solicitud.id,
    estadoDestino: 'en_proceso',
    actorEmail: 'soporte.uifce@unal.edu.co',
    actorRol: 'tecnico_uifce',
    motivo: 'Revision de fuente de poder en laboratorio'
  });

  assert.equal(cambio.ok, true);
  assert.equal(cambio.solicitud.estado, 'en_proceso');
  assert.equal(Object.isFrozen(cambio.historialEntry), true);
  assert.equal(Object.isFrozen(cambio.eventoAuditoria), true);
  assert.equal(store.getState().auditoria.length, 1);
});

test('applyCross y resumirMetricasSolicitudes calculan resultados esperados', () => {
  const aplicados = applyCross([{ id: 1 }, { id: 2 }], (x) => x.id * 10);
  assert.deepEqual(aplicados, [
    { item: { id: 1 }, aplicado: 10 },
    { item: { id: 2 }, aplicado: 20 }
  ]);

  const metricas = resumirMetricasSolicitudes([
    { estado: 'pendiente' },
    { estado: 'en_proceso' },
    { estado: 'pendiente' }
  ]);

  assert.equal(metricas.total, 3);
  assert.equal(metricas.porEstado.pendiente, 2);
  assert.equal(metricas.porEstado.en_proceso, 1);
});