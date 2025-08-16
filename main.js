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
import { subscribeAuth } from './auth.js';

// App state
let isInitialized = false;

// Selección de elementos
const sidebarBtns = document.querySelectorAll('.menu-btn');
const mainContent = document.getElementById('main-content');
const doctorNameEl = document.getElementById('doctorName');
const logoutBtn = document.getElementById('logoutBtn');
const themeToggle = document.getElementById('themeToggle');
const langToggle = document.getElementById('langToggle');

// Preferences management
const preferences = {
  get theme() {
    return localStorage.getItem('caretrack-theme') || 'light';
  },
  set theme(value) {
    localStorage.setItem('caretrack-theme', value);
  },
  get language() {
    return localStorage.getItem('caretrack-language') || 'ES';
  },
  set language(value) {
    localStorage.setItem('caretrack-language', value);
  }
};

// Initialize theme from localStorage
function initializeTheme() {
  const savedTheme = preferences.theme;
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
  }
}

// Initialize language from localStorage  
function initializeLanguage() {
  const savedLang = preferences.language;
  if (langToggle) {
    langToggle.textContent = savedLang;
  }
}

// Función para cargar contenido
function loadTab(tab) {
  if (!mainContent) return;
  
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

// Initialize event listeners with guards
function initializeEventListeners() {
  // Guard against multiple initialization
  if (isInitialized) return;

  // Manejar clics en la barra lateral
  sidebarBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      sidebarBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      loadTab(btn.dataset.tab);
    });
  });

  // Tema with persistence
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isDark = document.body.classList.toggle('dark-theme');
      preferences.theme = isDark ? 'dark' : 'light';
      showToast(`Tema cambiado a ${isDark ? 'oscuro' : 'claro'}`, 'info');
    });
  }

  // Idioma with persistence
  if (langToggle) {
    langToggle.addEventListener('click', () => {
      const current = langToggle.textContent;
      const newLang = current === 'ES' ? 'EN' : 'ES';
      langToggle.textContent = newLang;
      preferences.language = newLang;
      showToast(`Idioma cambiado a ${newLang}`, 'info');
    });
  }

  // Logout
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      try {
        const { logout } = await import('./auth.js');
        await logout();
        showToast('Sesión cerrada', 'info');
        loadTab('login');
      } catch (err) {
        showToast('Error al cerrar sesión', 'error');
        console.error(err);
      }
    });
  }

  isInitialized = true;
}

// Inicialización
function init() {
  // Initialize preferences from localStorage
  initializeTheme();
  initializeLanguage();
  
  // Initialize event listeners
  initializeEventListeners();
  
  // Load default tab
  loadTab('paciente');
  
  // Setup auth state listener
  subscribeAuth((user, role) => {
    if (user && doctorNameEl) {
      doctorNameEl.textContent = user.displayName || 'Doctor';
      if (logoutBtn) {
        logoutBtn.style.display = 'inline-block';
      }
    } else {
      loadTab('login');
      if (logoutBtn) {
        logoutBtn.style.display = 'none';
      }
    }
  });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
