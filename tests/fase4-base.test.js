import test from 'node:test';
import assert from 'node:assert/strict';
import { createStore } from '../src/core/store.js';
import { crearSolicitudService } from '../src/services/solicitudes.service.js';
import { applyCross, resumirMetricasSolicitudes } from '../src/core/query-engine.js';
import { puedeTransicionar } from '../src/core/fsm.js';

function crearContextoPrueba() {
  const store = createStore({
    solicitudes: [],
    historial: [],
    auditoria: [],
    filtros: { texto: '', estado: 'todos', tipo: 'todos' }
  });
  const service = crearSolicitudService(store);
  return { store, service };
}

test('rechaza transicion cuando el correo no es @unal.edu.co', () => {
  const { service } = crearContextoPrueba();
  const creada = service.crearSolicitud({
    solicitanteEmail: 'estudiante@gmail.com',
    codigoUnal: '100200301',
    nombreCompleto: 'Carlos Pérez',
    telefonoOExtension: '3165550101',
    tipo: 'soporte',
    descripcion: 'No puedo ingresar al correo institucional desde el aula.'
  });

  assert.equal(creada.ok, false);
  assert.match(creada.mensaje, /@unal\.edu\.co/);
});

test('permite transicion valida y genera registro de auditoria inmutable', () => {
  const { store, service } = crearContextoPrueba();
  const creada = service.crearSolicitud({
    solicitanteEmail: 'docente@unal.edu.co',
    codigoUnal: '100200302',
    nombreCompleto: 'María Rodríguez',
    telefonoOExtension: '31840',
    tipo: 'videoproyector',
    descripcion: 'Solicito videoproyector para clase de economía en el edificio 311.'
  });

  assert.equal(creada.ok, true);

  const transicion = service.cambiarEstadoSolicitud({
    solicitudId: creada.solicitud.id,
    estadoDestino: 'en_proceso',
    actorEmail: 'tecnico.uifce@unal.edu.co',
    actorRol: 'tecnico_uifce',
    motivo: 'Equipo asignado y verificado'
  });

  assert.equal(transicion.ok, true);
  assert.equal(transicion.solicitud.estado, 'en_proceso');
  assert.equal(store.getState().historial.length, 1);
  assert.equal(store.getState().auditoria.length, 2);
});

test('bloquea transiciones invalidas y estados terminales en la FSM', () => {
  assert.equal(puedeTransicionar('pendiente', 'resuelta'), false);
  assert.equal(puedeTransicionar('cerrada', 'en_proceso'), false);
  assert.equal(puedeTransicionar('rechazada', 'pendiente'), false);
  assert.equal(puedeTransicionar('en_proceso', 'resuelta'), true);
});

test('applyCross y resumirMetricasSolicitudes calculan resultados esperados', () => {
  const filas = [
    { id: '1', estado: 'pendiente', tipo: 'soporte' },
    { id: '2', estado: 'en_proceso', tipo: 'evento' },
    { id: '3', estado: 'resuelta', tipo: 'videoproyector' }
  ];

  const enriquecidas = applyCross(filas, (fila) => ({
    etiqueta: `${fila.tipo}:${fila.estado}`
  }));

  assert.equal(enriquecidas[0].etiqueta, 'soporte:pendiente');

  const metricas = resumirMetricasSolicitudes(filas);
  assert.equal(metricas.total, 3);
  assert.equal(metricas.pendientes, 1);
  assert.equal(metricas.enProceso, 1);
  assert.equal(metricas.resueltas, 1);
});