// paciente.js
// Control de eventos, validaciones y guardado automático para el formulario de paciente

import { savePacienteField, loadPacienteData, clearPacienteData } from './storage.js';
import { showToast } from './toast.js';

window.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('pacienteForm');
  const nombre = document.getElementById('paciente_nombre');
  const email = document.getElementById('paciente_email');
  const edad = document.getElementById('paciente_edad');
  const otros = document.getElementById('paciente_otros');
  const limpiarBtn = document.getElementById('paciente_limpiar');

  // Debounce para guardado automático
  let debounceTimer = null;
  function debounceSave(field, value) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      savePacienteField(field, value);
      showToast('Datos guardados');
    }, 400);
  }

  // Validaciones en tiempo real
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

  // Eventos input
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

  // Recuperar datos al recargar la página
  const data = loadPacienteData();
  nombre.value = data.nombre;
  email.value = data.email;
  edad.value = data.edad;
  otros.value = data.otros;
  validateNombre();
  validateEmail();
  validateEdad();

  // Botón Limpiar formulario
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
});
