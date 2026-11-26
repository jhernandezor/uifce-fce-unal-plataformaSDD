import { clasificarSolicitudHeuristica } from '../services/ai-categorizer.service.js';

const REGEX_CORREO_UNAL = /^[a-zA-Z0-9._%+-]+@unal\.edu\.co$/;
const REGEX_CODIGO_UNAL = /^\d{6,12}$/;
const REGEX_NOMBRE = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]{3,120}$/;

function evaluarCampo(nombre, valor) {
  const texto = String(valor || '').trim();

  if (nombre === 'solicitanteEmail') {
    if (!REGEX_CORREO_UNAL.test(texto)) {
      return { valido: false, mensaje: 'Debe usar su correo institucional @unal.edu.co' };
    }
    return { valido: true, mensaje: 'Correo institucional válido' };
  }

  if (nombre === 'codigoUnal') {
    if (!REGEX_CODIGO_UNAL.test(texto)) {
      return { valido: false, mensaje: 'El código UNAL debe tener entre 6 y 12 dígitos' };
    }
    return { valido: true, mensaje: 'Código válido' };
  }

  if (nombre === 'nombreCompleto') {
    if (!REGEX_NOMBRE.test(texto)) {
      return { valido: false, mensaje: 'Ingrese solo letras y espacios (mínimo 3 caracteres)' };
    }
    return { valido: true, mensaje: 'Nombre válido' };
  }

  if (nombre === 'descripcion') {
    if (texto.length < 10 || texto.length > 200) {
      return { valido: false, mensaje: 'La descripción debe tener entre 10 y 200 caracteres' };
    }
    return { valido: true, mensaje: `${texto.length}/200 caracteres` };
  }

  return { valido: true, mensaje: '' };
}

export function renderTicketForm(contenedor, { onSubmit } = {}) {
  if (!contenedor) return;

  contenedor.innerHTML = `
    <form class="form-solicitud" novalidate>
      <div class="campo" data-campo="solicitanteEmail">
        <label for="solicitanteEmail">Correo institucional (@unal.edu.co)</label>
        <input id="solicitanteEmail" name="solicitanteEmail" type="email" required placeholder="usuario@unal.edu.co" />
        <div class="mensaje-validacion"></div>
      </div>

      <div class="campo" data-campo="codigoUnal">
        <label for="codigoUnal">Código UNAL</label>
        <input id="codigoUnal" name="codigoUnal" type="text" required placeholder="Ej. 10293847" />
        <div class="mensaje-validacion"></div>
      </div>

      <div class="campo" data-campo="nombreCompleto">
        <label for="nombreCompleto">Nombre completo</label>
        <input id="nombreCompleto" name="nombreCompleto" type="text" required placeholder="Nombre y apellido" />
        <div class="mensaje-validacion"></div>
      </div>

      <div class="campo" data-campo="tipo">
        <label for="tipo">Tipo de solicitud</label>
        <select id="tipo" name="tipo">
          <option value="soporte">Soporte técnico</option>
          <option value="videoproyector">Videoproyector / Aula</option>
          <option value="evento">Apoyo a evento</option>
        </select>
        <div class="mensaje-validacion sugerencia-ia"></div>
      </div>

      <div class="campo" data-campo="descripcion">
        <label for="descripcion">Descripción (10 a 200 caracteres)</label>
        <textarea id="descripcion" name="descripcion" rows="3" maxlength="200" required placeholder="Describa su requerimiento..."></textarea>
        <div class="mensaje-validacion"></div>
      </div>

      <button type="submit" class="btn-primario" disabled>Registrar solicitud</button>
    </form>
  `;

  const form = contenedor.querySelector('.form-solicitud');
  const submitBtn = form.querySelector('button[type="submit"]');
  const selectTipo = form.querySelector('#tipo');
  const sugerenciaEl = form.querySelector('.sugerencia-ia');
  const camposValidables = ['solicitanteEmail', 'codigoUnal', 'nombreCompleto', 'descripcion'];
  const dirtySet = new Set();
  let tipoEditadoManualmente = false;

  selectTipo.addEventListener('change', () => {
    tipoEditadoManualmente = true;
  });

  function actualizarEstadoFormulario() {
    let todoValido = true;

    camposValidables.forEach((nombre) => {
      const wrapper = form.querySelector(`[data-campo="${nombre}"]`);
      const input = form.querySelector(`[name="${nombre}"]`);
      const msgEl = wrapper.querySelector('.mensaje-validacion');
      const res = evaluarCampo(nombre, input.value);

      if (!res.valido) {
        todoValido = false;
      }

      wrapper.classList.remove('dirty', 'valid', 'invalid');
      if (dirtySet.has(nombre)) {
        wrapper.classList.add('dirty', res.valido ? 'valid' : 'invalid');
        msgEl.textContent = res.mensaje;
      } else {
        msgEl.textContent = '';
      }
    });

    submitBtn.disabled = !todoValido;
  }

  camposValidables.forEach((nombre) => {
    const input = form.querySelector(`[name="${nombre}"]`);
    input.addEventListener('input', () => {
      dirtySet.add(nombre);
      if (nombre === 'descripcion') {
        const sugerencia = clasificarSolicitudHeuristica(input.value);
        if (!tipoEditadoManualmente && input.value.trim().length >= 10) {
          selectTipo.value = sugerencia.tipoSugerido;
        }
        sugerenciaEl.textContent =
          input.value.trim().length >= 10
            ? `Sugerencia: ${sugerencia.tipoSugerido} · prioridad ${sugerencia.prioridadSugerida}`
            : '';
      }
      actualizarEstadoFormulario();
    });

    input.addEventListener('blur', () => {
      dirtySet.add(nombre);
      actualizarEstadoFormulario();
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    camposValidables.forEach((n) => dirtySet.add(n));
    actualizarEstadoFormulario();
    if (submitBtn.disabled || typeof onSubmit !== 'function') return;

    const datos = {
      solicitanteEmail: form.solicitanteEmail.value.trim(),
      codigoUnal: form.codigoUnal.value.trim(),
      nombreCompleto: form.nombreCompleto.value.trim(),
      tipo: form.tipo.value,
      descripcion: form.descripcion.value.trim()
    };

    const creada = onSubmit(datos);
    if (creada !== false) {
      form.reset();
      dirtySet.clear();
      tipoEditadoManualmente = false;
      sugerenciaEl.textContent = '';
      actualizarEstadoFormulario();
    }
  });
}