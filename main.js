// main.js - Archivo principal corregido
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

// Variables globales (se asignarán cuando el DOM esté listo)
let sidebarBtns, mainContent, doctorNameEl, logoutBtn;

// Función para cargar contenido dinámico
function loadTab(tab) {
  if (!mainContent) return;
  mainContent.innerHTML = ''; // Limpiar contenido previo

  try {
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
  } catch (error) {
    console.error(`Error al cargar la pestaña "${tab}":`, error);
    mainContent.innerHTML = '<p>Error al cargar la sección.</p>';
  }
}

// Inicialización completa de la app
function init() {
  // Selección de elementos (ahora segura, después del DOM)
  sidebarBtns = document.querySelectorAll('.menu-btn');
  mainContent = document.getElementById('main-content');
  doctorNameEl = document.getElementById('doctorName');
  logoutBtn = document.getElementById('logoutBtn');

  // Verificar estado de autenticación
  checkAuthState('check')
    .then(user => {
      if (user) {
        doctorNameEl.textContent = user.displayName || 'Doctor';
        logoutBtn.style.display = 'inline-block';
        loadTab('paciente'); // Cargar pestaña inicial
      } else {
        loadTab('login');
      }
    })
    .catch(err => {
      console.error('Error en autenticación:', err);
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
    const langBtn = document.getElementById('langToggle');
    const current = langBtn.textContent.trim();
    langBtn.textContent = current === 'ES' ? 'EN' : 'ES';
    const langText = langBtn.textContent === 'ES' ? 'Español' : 'English';
    showToast(`Idioma cambiado a ${langText}`, 'info');
  });

  // Cerrar sesión
  logoutBtn?.addEventListener('click', async () => {
    try {
      await checkAuthState('logout');
      doctorNameEl.textContent = '';
      logoutBtn.style.display = 'none';
      loadTab('login');
      showToast('Sesión cerrada correctamente', 'info');
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
      showToast('No se pudo cerrar la sesión', 'error');
    }
  });
}

// Esperar a que el DOM esté completamente cargado
window.addEventListener('DOMContentLoaded', init);

// Manejo básico de errores globales
window.addEventListener('error', (e) => {
  console.error('Error no capturado:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
  console.error('Promesa rechazada:', e.reason);
});
