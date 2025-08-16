// Simple test version without Firebase dependencies
import { showToast } from './toast.js';

export function panelSignos() {
  return `
  <section class="spa-panel">
    <h2>Signos Vitales</h2>
    <div class="form-row">
      <label for="signos_temp">
        Temperatura corporal<br>
        <small>Mide el equilibrio entre la producción y pérdida de calor del cuerpo.</small>
      </label>
      <input type="number" step="0.1" id="signos_temp" placeholder="°C" />
    </div>
    <div class="form-row">
      <label for="signos_fc">
        Frecuencia cardíaca o pulso<br>
        <small>Número de latidos por minuto.</small>
      </label>
      <input type="number" id="signos_fc" placeholder="Latidos/min" />
    </div>
    <div class="form-row">
      <label for="signos_fr">
        Frecuencia respiratoria<br>
        <small>Número de respiraciones por minuto.</small>
      </label>
      <input type="number" id="signos_fr" placeholder="Respiraciones/min" />
    </div>
    <div class="form-row">
      <label for="signos_presion">
        Presión arterial<br>
        <small>Fuerza que ejerce la sangre contra las paredes de las arterias.</small>
      </label>
      <input type="text" id="signos_presion" placeholder="Ej: 120/80 mmHg" />
    </div>
    <h3>Signos vitales ampliados o complementarios</h3>
    <div class="form-row">
      <label for="signos_spo2">
        Saturación de oxígeno (SpO₂)<br>
        <small>Porcentaje de oxígeno en la sangre, medido con pulsioxímetro.</small>
      </label>
      <input type="number" step="0.1" id="signos_spo2" placeholder="%" />
    </div>
    <div class="form-row">
      <label for="signos_dolor">
        Dolor<br>
        <small>Se usa como "quinto signo vital" en evaluaciones clínicas. Escala 0-10.</small>
      </label>
      <input type="number" min="0" max="10" id="signos_dolor" placeholder="Escala 0-10" />
    </div>
    <div class="form-row">
      <label for="signos_conciencia">
        Nivel de conciencia<br>
        <small>Escala de Glasgow u observación clínica.</small>
      </label>
      <input type="text" id="signos_conciencia" placeholder="Ej: Glasgow 15, alerta, etc." />
    </div>
    <div class="form-row">
      <label for="signos_peso">
        Peso corporal<br>
        <small>Útil para calcular IMC y estado nutricional.</small>
      </label>
      <input type="number" step="0.1" id="signos_peso" placeholder="kg" />
    </div>
    <div class="form-row">
      <label for="signos_talla">
        Talla<br>
        <small>Útil para calcular IMC y estado nutricional.</small>
      </label>
      <input type="number" step="0.01" id="signos_talla" placeholder="m" />
    </div>
    <div class="form-row">
      <label for="signos_perfusion">
        Perfusión periférica<br>
        <small>Valorada por el llenado capilar y temperatura de extremidades.</small>
      </label>
      <input type="text" id="signos_perfusion" placeholder="Ej: normal, enlentecido, frío, etc." />
    </div>
    <div class="form-actions">
      <button id="signos_guardar">Guardar</button>
      <button id="signos_cargar">Cargar</button>
    </div>
  </section>
  `;
}

export function panelSignosInit() {
  const temp = document.getElementById('signos_temp');
  const fc = document.getElementById('signos_fc');
  const fr = document.getElementById('signos_fr');
  const presion = document.getElementById('signos_presion');
  const spo2 = document.getElementById('signos_spo2');
  const dolor = document.getElementById('signos_dolor');
  const conciencia = document.getElementById('signos_conciencia');
  const peso = document.getElementById('signos_peso');
  const talla = document.getElementById('signos_talla');
  const perfusion = document.getElementById('signos_perfusion');

  document.getElementById('signos_guardar').onclick = async () => {
    // Simple local storage for testing
    const data = {
      temperatura: temp.value,
      fc: fc.value,
      fr: fr.value,
      presion: presion.value,
      spo2: spo2.value,
      dolor: dolor.value,
      conciencia: conciencia.value,
      peso: peso.value,
      talla: talla.value,
      perfusion: perfusion.value,
      updated: new Date().toISOString()
    };
    localStorage.setItem('signos_data', JSON.stringify(data));
    if (typeof showToast === 'function') {
      showToast('Signos vitales guardados');
    } else {
      alert('Signos vitales guardados');
    }
  };

  document.getElementById('signos_cargar').onclick = async () => {
    const data = localStorage.getItem('signos_data');
    if (data) {
      const d = JSON.parse(data);
      temp.value = d.temperatura || "";
      fc.value = d.fc || "";
      fr.value = d.fr || "";
      presion.value = d.presion || "";
      spo2.value = d.spo2 || "";
      dolor.value = d.dolor || "";
      conciencia.value = d.conciencia || "";
      peso.value = d.peso || "";
      talla.value = d.talla || "";
      perfusion.value = d.perfusion || "";
      if (typeof showToast === 'function') {
        showToast('Signos vitales cargados');
      } else {
        alert('Signos vitales cargados');
      }
    } else {
      if (typeof showToast === 'function') {
        showToast('No hay datos guardados', 'info');
      } else {
        alert('No hay datos guardados');
      }
    }
  };
}

// ✅ Esta función es la que usa main.js
export function renderSignos(container) {
  container.innerHTML = panelSignos();
  panelSignosInit();
}