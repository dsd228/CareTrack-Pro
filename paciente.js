// paciente.js
import { savePacienteField, loadPacienteData, clearPacienteData } from './storage.js';
import { showToast } from './toast.js';

export function panelPaciente() {
  return `
  <section class="paciente-panel">
    <form id="pacienteForm" novalidate>
      <h2>
        <svg width="24" height="24" fill="currentColor" aria-hidden="true"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/><path d="M12 14c-3 0-5 1.5-5 3v2h10v-2c0-1.5-2-3-5-3zm0-2a2 2 0 100-4 2 2 0 000 4z" fill="currentColor"/></svg>
        Datos personales
      </h2>
      <div class="form-row">
        <label for="paciente_nombre">Nombre <span>*</span></label>
        <input type="text" id="paciente_nombre" required autocomplete="off" />
      </div>
      <div class="form-row">
        <label for="paciente_edad">Edad</label>
        <input type="number" id="paciente_edad" min="0" />
      </div>
      <h2>
        <svg width="24" height="24" aria-hidden="true"><path d="M6 8v10h12V8l-6-5-6 5zm6-3.5L17 8h-2v2H9V8H7l5-3.5z" fill="currentColor"/></svg>
        Contacto
      </h2>
      <div class="form-row">
        <label for="paciente_email">Email</label>
        <input type="email" id="paciente_email" autocomplete="off" />
      </div>
      <h2>
        <svg width="24" height="24" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="#ddd"/><text x="50%" y="55%" text-anchor="middle" font-size="10" fill="#444">+</text></svg>
        Otros
      </h2>
      <div class="form-row">
        <label for="paciente_otros">Notas / observaciones</label>
        <textarea id="paciente_otros"></textarea>
      </div>
      <div class="form-actions">
        <button id="paciente_limpiar" type="button">Limpiar formulario</button>
      </div>
    </form>
  </section>
  `;
}

export function panelPacienteInit() {
  const nombre = document.getElementById('paciente_nombre');
  const email = document.getElementById('paciente_email');
  const edad = document.getElementById('paciente_edad');
  const otros = document.getElementById('paciente_otros');
  const limpiarBtn = document.getElementById('paciente_limpiar');

  let debounceTimer = null;
  function debounceSave(field, value) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      savePacienteField(field, value);
      showToast('Datos guardados');
    }, 400);
  }
  function validateNombre() {
    if (!nombre.value.trim()) {
      nombre.classList.add('invalid');
      return false;
    } else {
      nombre.classList.remove('invalid');
      return true;
    }
  }
  function validateEmail() {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(email.value.trim())) {
      email.classList.add('invalid');
      return false;
    } else {
      email.classList.remove('invalid');
      return true;
    }
  }
  function validateEdad() {
    if (!/^\d+$/.test(edad.value.trim())) {
      edad.classList.add('invalid');
      return false;
    } else {
      edad.classList.remove('invalid');
      return true;
    }
  }
  nombre.addEventListener('input', e => {
    validateNombre();
    debounceSave('nombre', nombre.value);
  });
  email.addEventListener('input', e => {
    validateEmail();
    debounceSave('email', email.value);
  });
  edad.addEventListener('input', e => {
    validateEdad();
    debounceSave('edad', edad.value);
  });
  otros.addEventListener('input', e => {
    debounceSave('otros', otros.value);
  });

  const data = loadPacienteData();
  nombre.value = data.nombre;
  email.value = data.email;
  edad.value = data.edad;
  otros.value = data.otros;
  validateNombre();
  validateEmail();
  validateEdad();

  limpiarBtn.addEventListener('click', e => {
    e.preventDefault();
    nombre.value = '';
    email.value = '';
    edad.value = '';
    otros.value = '';
    clearPacienteData();
    showToast('Formulario limpiado', 'info');
    validateNombre();
    validateEmail();
    validateEdad();
  });
}
