import { renderPaciente } from './paciente.js';
import { renderHistoria } from './historia.js';
import { renderSignos } from './signos.js';
import { renderExamenes } from './examenes.js';
import { renderAlergias } from './alergias.js';
import { renderNotas } from './notas.js';
import { renderEducacion } from './educacion.js';
import { renderConfiguracion } from './configuracion.js';
import { renderAdmin } from './admin.js';
import { renderLogin } from './login.js';
import { renderRegistro } from './registro.js';

const mainContent = document.getElementById('main-content');
const menuButtons = document.querySelectorAll('.menu-btn');

menuButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    menuButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    switchTab(btn.dataset.tab);
  });
});

function switchTab(tab){
  switch(tab){
    case 'paciente': renderPaciente(); break;
    case 'historia': renderHistoria(); break;
    case 'signos': renderSignos(); break;
    case 'examenes': renderExamenes(); break;
    case 'alergias': renderAlergias(); break;
    case 'notas': renderNotas(); break;
    case 'educacion': renderEducacion(); break;
    case 'configuracion': renderConfiguracion(); break;
    case 'admin': renderAdmin(); break;
    case 'login': renderLogin(); break;
    case 'registro': renderRegistro(); break;
    default: mainContent.innerHTML='<p>Pestaña no encontrada</p>';
  }
}

// Tema claro/oscuro
const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('click', ()=>{
  document.body.classList.toggle('dark-theme');
});
