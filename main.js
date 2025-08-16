// Importar todos los módulos al inicio
import * as pacienteModule from './paciente.js';
import * as historiaModule from './historia.js';
import * as signosModule from './signos.js';
import * as examenesModule from './examenes.js';
import * as alergiasModule from './alergias.js';
import * as notasModule from './notas.js';
import * as educacionModule from './educacion.js';
import * as configuracionModule from './configuracion.js';
import * as adminModule from './admin.js';
import * as loginModule from './login.js';
import * as registroModule from './registro.js';

import { showToast } from './toast.js';
import { checkAuthState } from './auth.js';

// Selección de elementos
const sidebarBtns = document.querySelectorAll('.menu-btn');
const mainContent = document.getElementById('main-content');
const doctorNameEl = document.getElementById('doctorName');
const logoutBtn = document.getElementById('logoutBtn');

// Función para cargar contenido
function loadTab(tab) {
  mainContent.innerHTML = ''; // limpiar contenido
  switch (tab) {
    case 'paciente': pacienteModule.renderPaciente(mainContent); break;
    case 'historia': historiaModule.renderHistoria(mainContent); break;
    case 'signos': signosModule.renderSignos(mainContent); break;
    case 'examenes': examenesModule.renderExamenes(mainContent); break;
    case 'alergias': alergiasModule.renderAlergias(mainContent); break;
    case 'notas': notasModule.renderNotas(mainContent); break;
    case 'educacion': educacionModule.renderEducacion(mainContent); break;
    case 'configuracion': configuracionModule.renderConfiguracion(mainContent); break;
    case 'admin': adminModule.renderAdmin(mainContent); break;
    case 'login': loginModule.renderLogin(mainContent); break;
    case 'registro': registroModule.renderRegistro(mainContent); break;
    default:
      mainContent.innerHTML = '<p>Sección no encontrada</p>';
  }
}

// Manejar clics en la barra lateral
sidebarBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    sidebarBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    loadTab(btn.dataset.tab);
  });
});

// Tema
document.getElementById('themeToggle').addEventListener('click', () => {
  document.body.classList.toggle('dark-theme');
  showToast('Tema cambiado', 'info');
});

// Idioma
document.getElementById('langToggle').addEventListener('click', () => {
  const current = document.getElementById('langToggle').textContent;
  document.getElementById('langToggle').textContent = current === 'ES' ? 'EN' : 'ES';
  showToast(`Idioma cambiado a ${document.getElementById('langToggle').textContent}`, 'info');
});

// Logout
logoutBtn.addEventListener('click', async () => {
  try {
    await checkAuthState('logout');
    showToast('Sesión cerrada', 'info');
    loadTab('login');
  } catch (err) {
    showToast('Error al cerrar sesión', 'error');
    console.error(err);
  }
});

// Inicialización
function init() {
  loadTab('paciente'); // pestaña por defecto
  checkAuthState('check').then(user => {
    if (user) {
      doctorNameEl.textContent = user.displayName || 'Doctor';
      logoutBtn.style.display = 'inline-block';
    } else {
      loadTab('login');
    }
  });
}

window.addEventListener('DOMContentLoaded', init);
