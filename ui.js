import { t } from './lang.js';
import { buscarMedicamento, buscarWiki } from './api.js';

export const panels = {
  paciente: () => `<div>Panel Paciente ...</div>`,
  historia: () => `<div>Panel Historia Clínica ...</div>`,
  signos: () => `<div>Panel Signos Vitales ...</div>`,
  examenes: () => `<div>Panel Exámenes ...</div>`,
  alergias: () => `<div>Panel Alergias ...</div>`,
  notas: () => `<div>Panel Notas ...</div>`,
  educacion: () => `<div><input type="search" id="eduInput" placeholder="Buscar medicamento..."><div id="eduResult"></div></div>`,
  configuracion: () => `<div>Configuración ...</div>`,
  admin: () => `<div>Panel Admin (solo admin)</div>`
};
export const panelInit = {
  educacion: () => {
    document.getElementById('eduInput').oninput = async function() {
      const term = this.value.trim();
      let html = "";
      if (term.length > 2) {
        html += "<h3>OpenFDA:</h3>";
        const med = await buscarMedicamento(term);
        html += med ? `<div>${med.brand_name || ""} - ${med.description || ""}</div>` : "<div>No encontrado</div>";
        html += "<h3>Wikipedia:</h3>";
        const wiki = await buscarWiki(term);
        html += wiki?.extract ? `<div>${wiki.extract}</div>` : "<div>No encontrado</div>";
      }
      document.getElementById('eduResult').innerHTML = html;
    };
  }
  // Añade lógica para cada panel...
};
