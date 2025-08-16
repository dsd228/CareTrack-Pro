// main.js - Controlador principal de CareTrack-Pro
import { checkAuthState } from './auth.js';
import { showToast } from './toast.js';

// Módulos (se cargarán cuando sea necesario)
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

// Elementos del DOM (se asignarán cuando el DOM esté listo)
let sidebarBtns, mainContent, doctorNameEl, logoutBtn;

// Función para cargar una pestaña
function loadTab(tab) {
  if (!mainContent) return;
  mainContent.innerHTML = ''; // Limpiar contenido

  try {
    switch (tab) {
      case 'paciente':     pacienteModule.renderPaciente(mainContent); break;
      case 'historia':     historiaModule.renderHistoria(mainContent); break;
      case 'signos':       signosModule.renderSignos(mainContent); break;
      case 'examenes':     examenesModule.renderExamenes(mainContent); break;
      case 'alergias':     alergiasModule.renderAlergias(mainContent); break;
      case 'notas':        notasModule.renderNotas(mainContent); break;
      case 'educacion':    educacionModule.renderEducacion(mainContent); break;
      case 'configuracion': configuracionModule.renderConfiguracion(mainContent); break;
      case 'admin':        adminModule.renderAdmin(mainContent); break;
      case 'login':        loginModule.renderLogin(mainContent); break;
      case 'registro':     registroModule.renderRegistro(mainContent); break;
      default:
        mainContent.innerHTML = '<p>Sección no encontrada. Revisa los módulos.</p>';
    }
  } catch (error) {
    console.error('Error al cargar la pestaña:', tab, error);
    mainContent.innerHTML = `<p>Error al cargar: ${tab}</p>`;
  }
}

// Inicialización de la app
function init() {
  // Seleccionar elementos después de que el DOM esté listo
  sidebarBtns = document.querySelectorAll('.menu-btn');
  mainContent = document.getElementById('main-content');
  doctorNameEl = document.getElementById('doctorName');
  logoutBtn = document.getElementById('logoutBtn');

  // Verificar autenticación
  checkAuthState('check')
    .then(user => {
      if (user) {
        doctorNameEl.textContent = user.displayName || 'Doctor';
        logoutBtn.style.display = 'inline-block';
        loadTab('paciente'); // Pestaña inicial si hay sesión
      } else {
        loadTab('login'); // Si no hay sesión, mostrar login
      }
    })
    .catch(() => {
      loadTab('login');
    });

  // Eventos de navegación
  sidebarBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      sidebarBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      loadTab(btn.dataset.tab);
    });
  });

  // Tema oscuro
  document.getElementById('themeToggle')?.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    showToast('Tema cambiado', 'info');
  });

  // Cambio de idioma
  document.getElementById('langToggle')?.addEventListener('click', () => {
    const btn = document.getElementById('langToggle');
    const es = btn.textContent.trim() === 'ES';
    btn.textContent = es ? 'EN' : 'ES';
    showToast(`Idioma: ${es ? 'English' : 'Español'}`, 'info');
  });

  // Cerrar sesión
  logoutBtn?.addEventListener('click', async () => {
    try {
      await checkAuthState('logout');
      doctorNameEl.textContent = '';
      logoutBtn.style.display = 'none';
      loadTab('login');
      showToast('Sesión cerrada', 'info');
    } catch (err) {
      showToast('Error al cerrar sesión', 'error');
      console.error(err);
    }
  });
}

// Esperar a que el DOM esté listo
document.addEventListener('DOMContentLoaded', init);

// Manejo de errores no capturados
window.addEventListener('error', e => console.error('Error:', e.error));
window.addEventListener('unhandledrejection', e => console.error('Promesa rechazada:', e.reason));
