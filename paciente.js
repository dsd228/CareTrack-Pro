// paciente.js
import { db } from './firebase.js';
import { getRole } from './auth.js';
import { savePacienteField, loadPacienteData, clearPacienteData } from './storage.js';
import { showToast } from './toast.js';
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

export function panelPaciente() {
  return `
  <section class="paciente-panel">
    <form id="pacienteForm" novalidate>
      <h2>Datos personales</h2>
      <div class="form-row">
        <label for="paciente_nombre">Nombre <span>*</span></label>
        <input type="text" id="paciente_nombre" required autocomplete="off" />
      </div>
      <div class="form-row">
        <label for="paciente_edad">Edad</label>
        <input type="number" id="paciente_edad" min="0" />
      </div>
      <h2>Contacto</h2>
      <div class="form-row">
        <label for="paciente_email">Email</label>
        <input type="email" id="paciente_email" autocomplete="off" />
      </div>
      <h2>Otros</h2>
      <div class="form-row">
        <label for="paciente_otros">Notas / observaciones</label>
        <textarea id="paciente_otros"></textarea>
      </div>
      <div class="form-actions">
        <button id="paciente_guardar" type="button">Guardar en Firebase</button>
        <button id="paciente_cargar" type="button">Cargar de Firebase</button>
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
  const guardarBtn = document.getElementById('paciente_guardar');
  const cargarBtn = document.getElementById('paciente_cargar');
  const limpiarBtn = document.getElementById('paciente_limpiar');

  if (!nombre || !email || !edad || !otros || !guardarBtn || !cargarBtn || !limpiarBtn) {
    console.warn("Formulario de paciente no encontrado en el DOM");
    return;
  }

  let debounceTimer = null;
  function debounceSave(field, value) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      savePacienteField(field, value);
      showToast('Datos guardados local');
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
    if (edad.value.trim() && !/^\d+$/.test(edad.value.trim())) {
      edad.classList.add('invalid');
      return false;
    } else {
      edad.classList.remove('invalid');
      return true;
    }
  }

  nombre.addEventListener('input', () => {
    validateNombre();
    debounceSave('nombre', nombre.value);
  });
  email.addEventListener('input', () => {
    validateEmail();
    debounceSave('email', email.value);
  });
  edad.addEventListener('input', () => {
    validateEdad();
    debounceSave('edad', edad.value);
  });
  otros.addEventListener('input', () => {
    debounceSave('otros', otros.value);
  });

  const data = loadPacienteData();
  nombre.value = data.nombre || '';
  email.value = data.email || '';
  edad.value = data.edad || '';
  otros.value = data.otros || '';
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

  guardarBtn.onclick = async () => {
    if (!validateNombre() || !validateEmail() || !validateEdad()) {
      showToast('Corrige los campos', 'info');
      return;
    }
    try {
      await setDoc(doc(db, "pacientes", email.value), {
        nombre: nombre.value,
        edad: edad.value,
        email: email.value,
        otros: otros.value,
        updated: new Date().toISOString()
      });
      showToast('Guardado en Firebase');
    } catch (err) {
      console.error("Error al guardar en Firebase:", err);
      showToast('Error al guardar', 'error');
    }
  };

  cargarBtn.onclick = async () => {
    try {
      const docSnap = await getDoc(doc(db, "pacientes", email.value));
      if (docSnap.exists()) {
        const d = docSnap.data();
        nombre.value = d.nombre || "";
        edad.value = d.edad || "";
        otros.value = d.otros || "";
        showToast('Datos cargados de Firebase');
      } else {
        showToast('No se encontró en Firebase', 'info');
      }
    } catch (err) {
      console.error("Error al cargar de Firebase:", err);
      showToast('Error al cargar', 'error');
    }
  };
}

// ✅ Esta función es la que usa main.js
export function renderPaciente(container) {
  container.innerHTML = panelPaciente();
  panelPacienteInit();
}
