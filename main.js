// main.js
// SPA principal: navegación y paneles

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
  paciente: { render: panelPaciente, init: panelPacienteInit },
  historia: { render: panelHistoria, init: panelHistoriaInit },
  signos: { render: panelSignos, init: panelSignosInit },
  examenes: { render: panelExamenes, init: panelExamenesInit },
  alergias: { render: panelAlergias, init: panelAlergiasInit },
  notas: { render: panelNotas, init: panelNotasInit },
  educacion: { render: panelEducacion, init: panelEducacionInit },
  configuracion: { render: panelConfiguracion, init: panelConfiguracionInit },
  admin: { render: panelAdmin, init: panelAdminInit },
  login: { render: panelLogin, init: panelLoginInit },
  registro: { render: panelRegistro, init: panelRegistroInit }
};

const mainContent = document.getElementById('main-content');
const menuBtns = document.querySelectorAll('.menu-btn');
let currentTab = 'paciente';

function showPanel(tab) {
  currentTab = tab;
  if (!panels[tab]) {
    mainContent.innerHTML = "<div class='spa-panel'>Panel no disponible</div>";
    return;
  }
  mainContent.innerHTML = panels[tab].render();
  setTimeout(() => {
    if (typeof panels[tab].init === 'function') panels[tab].init();
  }, 10);
}

menuBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    menuBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    showPanel(btn.dataset.tab);
    history.pushState({tab:btn.dataset.tab}, '', `#${btn.dataset.tab}`);
  });
});

window.onpopstate = (e) => {
  if(e.state?.tab) showPanel(e.state.tab);
};

showPanel(currentTab); // Panel inicial
