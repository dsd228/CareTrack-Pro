// main.js - Controlador principal de CareTrack-Pro
console.log('Loading main.js');

// We'll dynamically import modules to handle failures gracefully
let checkAuthState, showToast;
let educacionModule;

// Load toast module
import('./toast.js').then(module => {
  showToast = module.showToast;
}).catch(() => {
  showToast = function(message, type) {
    console.log(`Toast ${type || 'info'}: ${message}`);
    alert(message);
  };
});

// Load auth module
import('./auth.js').then(module => {
  checkAuthState = module.checkAuthState;
}).catch(() => {
  checkAuthState = function() { return Promise.resolve(null); };
});

// Load education module
import('./educacion.js').then(module => {
  educacionModule = module;
}).catch(err => {
  console.error('Failed to load educacion module:', err);
});

// Elementos del DOM (se asignarán cuando el DOM esté listo)
let sidebarBtns, mainContent, doctorNameEl, logoutBtn;

// Función para cargar una pestaña
function loadTab(tab) {
  console.log('loadTab called with:', tab);
  if (!mainContent) return;
  mainContent.innerHTML = ''; // Limpiar contenido

  try {
    switch (tab) {
      case 'educacion':
        if (educacionModule && educacionModule.renderEducacion) {
          educacionModule.renderEducacion(mainContent);
        } else {
          mainContent.innerHTML = '<p>Cargando módulo educacional...</p>';
          // Try to load it again if it failed the first time
          import('./educacion.js').then(module => {
            module.renderEducacion(mainContent);
          }).catch(err => {
            mainContent.innerHTML = '<p>Error al cargar el módulo educacional.</p>';
            console.error(err);
          });
        }
        break;
      case 'login':
        mainContent.innerHTML = `
          <section class="spa-panel">
            <h2>Iniciar Sesión</h2>
            <form class="panel-form">
              <div class="form-row">
                <label>Email:</label>
                <input type="email" placeholder="tu@email.com" />
              </div>
              <div class="form-row">
                <label>Contraseña:</label>
                <input type="password" placeholder="********" />
              </div>
              <div class="form-actions">
                <button type="submit">Iniciar Sesión</button>
              </div>
            </form>
          </section>
        `;
        break;
      default:
        mainContent.innerHTML = `<section class="spa-panel"><h2>Módulo: ${tab}</h2><p>Contenido del módulo <strong>${tab}</strong> no implementado aún.</p></section>`;
    }
  } catch (error) {
    console.error('Error al cargar la pestaña:', tab, error);
    mainContent.innerHTML = `<p>Error al cargar: ${tab}</p>`;
  }
}

// Inicialización de la app
function init() {
  console.log('Initializing app');
  
  // Seleccionar elementos después de que el DOM esté listo
  sidebarBtns = document.querySelectorAll('.menu-btn');
  mainContent = document.getElementById('main-content');
  doctorNameEl = document.getElementById('doctorName');
  logoutBtn = document.getElementById('logoutBtn');

  console.log('DOM elements found:', {
    sidebarBtns: sidebarBtns.length,
    mainContent: !!mainContent,
    doctorNameEl: !!doctorNameEl,
    logoutBtn: !!logoutBtn
  });

  // Verificar autenticación (con fallback)
  if (checkAuthState) {
    checkAuthState('check')
      .then(user => {
        if (user) {
          if (doctorNameEl) doctorNameEl.textContent = user.displayName || 'Doctor';
          if (logoutBtn) logoutBtn.style.display = 'inline-block';
          loadTab('educacion'); // Cargar educación por defecto para pruebas
        } else {
          loadTab('login');
        }
      })
      .catch(() => {
        loadTab('login');
      });
  } else {
    // Sin autenticación, cargar educación directamente
    loadTab('educacion');
  }

  // Eventos de navegación
  sidebarBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      console.log('Menu button clicked:', btn.dataset.tab);
      sidebarBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      loadTab(btn.dataset.tab);
    });
  });

  // Tema oscuro
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      console.log('Theme toggle clicked');
      document.body.classList.toggle('dark-theme');
      const isDark = document.body.classList.contains('dark-theme');
      console.log('Dark theme is now:', isDark);
      showToast(`Tema ${isDark ? 'oscuro' : 'claro'} activado`, 'info');
    });
  }

  // Cambio de idioma
  const langToggle = document.getElementById('langToggle');
  if (langToggle) {
    langToggle.addEventListener('click', () => {
      const btn = langToggle;
      const es = btn.textContent.trim() === 'ES';
      btn.textContent = es ? 'EN' : 'ES';
      showToast(`Idioma: ${es ? 'English' : 'Español'}`, 'info');
    });
  }

  // Cerrar sesión
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      try {
        if (checkAuthState) {
          await checkAuthState('logout');
        }
        if (doctorNameEl) doctorNameEl.textContent = '';
        logoutBtn.style.display = 'none';
        loadTab('login');
        showToast('Sesión cerrada', 'info');
      } catch (err) {
        showToast('Error al cerrar sesión', 'error');
        console.error(err);
      }
    });
  }

  console.log('App initialization complete');
}

// Esperar a que el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Manejo de errores no capturados
window.addEventListener('error', e => console.error('Error:', e.error));
window.addEventListener('unhandledrejection', e => console.error('Promesa rechazada:', e.reason));

console.log('main.js loaded successfully');