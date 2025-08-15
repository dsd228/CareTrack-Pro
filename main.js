import { subscribeAuth, getRole, logout } from './auth.js';

import { panelPaciente, panelPacienteInit } from './paciente.js';
import { panelHistoria, panelHistoriaInit } from './historia.js';
import { panelSignos, panelSignosInit } from './signos.js';
import { panelExamenes, panelExamenesInit } from './examenes.js';
import { panelAlergias, panelAlergiasInit } from './alergias.js';
import { panelNotas, panelNotasInit } from './notas.js';
import { panelEducacion, panelEducacionInit } from './educacion.js';
import { panelConfiguracion, panelConfiguracionInit } from './configuracion.js';
import { panelAdmin, panelAdminInit } from './admin.js';
import { panelLogin, panelLoginInit } from './login.js';
import { panelRegistro, panelRegistroInit } from './registro.js';

const panels = {
  paciente: { render: panelPaciente, init: panelPacienteInit, roles: ["medico","admin"] },
  historia: { render: panelHistoria, init: panelHistoriaInit, roles: ["medico","admin"] },
  signos: { render: panelSignos, init: panelSignosInit, roles: ["medico","admin"] },
  examenes: { render: panelExamenes, init: panelExamenesInit, roles: ["medico","admin"] },
  alergias: { render: panelAlergias, init: panelAlergiasInit, roles: ["medico","admin"] },
  notas: { render: panelNotas, init: panelNotasInit, roles: ["medico","admin"] },
  educacion: { render: panelEducacion, init: panelEducacionInit, roles: ["medico","admin","public"] },
  configuracion: { render: panelConfiguracion, init: panelConfiguracionInit, roles: ["medico","admin","public"] },
  admin: { render: panelAdmin, init: panelAdminInit, roles: ["admin"] },
  login: { render: panelLogin, init: panelLoginInit, roles: ["public"] },
  registro: { render: panelRegistro, init: panelRegistroInit, roles: ["public"] }
};

const mainContent = document.getElementById('main-content');
const menuBtns = document.querySelectorAll('.menu-btn');
const doctorName = document.getElementById('doctorName');
const logoutBtn = document.getElementById('logoutBtn');

let currentTab = 'login'; // Empieza en login si no hay usuario

function showPanel(tab, role) {
  if (!panels[tab] || !panels[tab].roles.includes(role)) {
    mainContent.innerHTML = `<section class="spa-panel"><h2>No autorizado</h2><p>No tienes acceso a este panel.</p></section>`;
    return;
  }
  mainContent.innerHTML = panels[tab].render();
  setTimeout(() => {
    if (typeof panels[tab].init === 'function') panels[tab].init();
  }, 10);
}

function setSidebar(role) {
  menuBtns.forEach(btn => {
    const tab = btn.dataset.tab;
    if (!panels[tab] || !panels[tab].roles.includes(role)) {
      btn.style.display = "none";
    } else {
      btn.style.display = "block";
    }
  });
}

menuBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    menuBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    showPanel(btn.dataset.tab, getRole());
    history.pushState({tab:btn.dataset.tab}, '', `#${btn.dataset.tab}`);
  });
});

window.onpopstate = (e) => {
  if(e.state?.tab) showPanel(e.state.tab, getRole());
};

logoutBtn.onclick = async () => {
  await logout();
};

subscribeAuth((user, role) => {
  doctorName.textContent = user ? (user.displayName || user.email) : "";
  logoutBtn.style.display = user ? "inline-block" : "none";
  setSidebar(role);
  let startTab = user ? "paciente" : "login";
  showPanel(startTab, role);
  menuBtns.forEach(b => b.classList.remove('active'));
  document.querySelector(`.menu-btn[data-tab="${startTab}"]`).classList.add('active');
});
