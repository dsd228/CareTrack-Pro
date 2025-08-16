// main.js
import { showToast } from './toast.js'; // Para notificaciones
import { checkAuthState } from './auth.js'; // Control de sesión

// Selección de elementos
const sidebarBtns = document.querySelectorAll('.menu-btn');
const mainContent = document.getElementById('main-content');
const doctorNameEl = document.getElementById('doctorName');
const logoutBtn = document.getElementById('logoutBtn');

// Función para cargar contenido según tab
function loadTab(tab) {
  mainContent.innerHTML = ''; // Limpiar contenido

  switch (tab) {
    case 'paciente':
      import('./paciente.js').then(module => module.renderPaciente(mainContent));
      break;
    case 'historia':
      import('./historia.js').then(module => module.renderHistoria(mainContent));
      break;
    case 'signos':
      import('./signos.js').then(module => module.renderSignos(mainContent));
      break;
    case 'examenes':
      import('./examenes.js').then(module => module.renderExamenes(mainContent));
      break;
    case 'alergias':
      import('./alergias.js').then(module => module.renderAlergias(mainContent));
      break;
    case 'notas':
      import('./notas.js').then(module => module.renderNotas(mainContent));
      break;
    case 'educacion':
      import('./educacion.js').then(module => module.renderEducacion(mainContent));
      break;
    case 'configuracion':
      import('./configuracion.js').then(module => module.renderConfiguracion(mainContent));
      break;
    case 'admin':
      import('./admin.js').then(module => module.renderAdmin(mainContent));
      break;
    case 'login':
      import('./login.js').then(module => module.renderLogin(mainContent));
      break;
    case 'registro':
      import('./registro.js').then(module => module.renderRegistro(mainContent));
      break;
    default:
      mainContent.innerHTML = `<p>Sección no encontrada.</p>`;
  }
}

// Manejar clic en la barra lateral
sidebarBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    sidebarBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    loadTab(btn.dataset.tab);
  });
});

// Cambiar tema
const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-theme');
  showToast('Tema cambiado', 'info');
});

// Cambiar idioma (solo ejemplo)
const langToggle = document.getElementById('langToggle');
langToggle.addEventListener('click', () => {
  const current = langToggle.textContent;
  langToggle.textContent = current === 'ES' ? 'EN' : 'ES';
  showToast(`Idioma cambiado a ${langToggle.textContent}`, 'info');
});

// Logout
logoutBtn.addEventListener('click', async () => {
  try {
    await checkAuthState('logout'); // Función en auth.js
    showToast('Sesión cerrada', 'info');
    loadTab('login');
  } catch (err) {
    showToast('Error al cerrar sesión', 'error');
    console.error(err);
  }
});

// Inicialización
function init() {
  loadTab('paciente'); // Abrir tab por defecto
  checkAuthState('check').then(user => {
    if (user) {
      doctorNameEl.textContent = user.displayName || 'Doctor';
      logoutBtn.style.display = 'inline-block';
    } else {
      loadTab('login');
    }
  });
}

// Ejecutar init al cargar
window.addEventListener('DOMContentLoaded', init);
