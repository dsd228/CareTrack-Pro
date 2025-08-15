import { initAuth, getRole, onUserChange, logout } from './auth.js';
import { showNotification, setupRealtimeNotifications } from './notifications.js';
import { panels, panelInit } from './ui.js';
import { setLang, t } from './lang.js';

let currentTab = "paciente";

const mainContent = document.getElementById('main-content');
const menuBtns = document.querySelectorAll('.menu-btn');

menuBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    menuBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    showPanel(btn.dataset.tab);
    currentTab = btn.dataset.tab;
    history.pushState({tab:currentTab}, '', `#${currentTab}`);
  });
});

window.onpopstate = (e) => {
  if(e.state?.tab) showPanel(e.state.tab);
};

function showPanel(tab) {
  currentTab = tab;
  if (!panels[tab]) {
    mainContent.innerHTML = "<div class='spa-panel'>Panel no disponible</div>";
    return;
  }
  mainContent.innerHTML = `<div class="spa-panel active">${panels[tab]()}</div>`;
  setTimeout(() => { panelInit[tab]?.(); }, 30);
}

document.getElementById('themeToggle').onclick = () => {
  document.documentElement.classList.toggle('dark');
};

document.getElementById('langToggle').onclick = () => {
  setLang();
  showPanel(currentTab);
};

document.getElementById('logoutBtn').onclick = () => logout();

document.querySelector('.hamburger').onclick = function() {
  document.querySelector('.sidebar').classList.toggle('collapsed');
};

onUserChange(user => {
  if (user) {
    document.getElementById('logoutBtn').style.display = "inline-block";
    document.getElementById('doctorName').textContent = user.displayName || user.email;
    document.querySelector('.user-state .doctor-photo').src = user.photoURL || 'assets/doctor.jpg';
    const role = getRole(user);
    if (role === 'admin') document.querySelector('[data-tab="admin"]').style.display = "block";
    setupRealtimeNotifications(user.uid, msg => showNotification(msg));
  } else {
    document.getElementById('logoutBtn').style.display = "none";
    document.getElementById('doctorName').textContent = "";
    document.querySelector('[data-tab="admin"]').style.display = "none";
  }
});

initAuth().then(() => {
  showPanel(currentTab);
});
