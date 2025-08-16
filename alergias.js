import { db } from './firebase.js';
import { doc, setDoc, getDoc } from "./firebase-mock.js";
import { showToast } from './toast.js';

export function panelAlergias() {
  return `
  <section class="spa-panel">
    <h2>Alergias</h2>
    <div class="form-row">
      <label for="alergias_texto">Alergias registradas</label>
      <textarea id="alergias_texto"></textarea>
    </div>
    <div class="form-actions">
      <button id="alergias_guardar">Guardar</button>
      <button id="alergias_cargar">Cargar</button>
    </div>
  </section>
  `;
}

export function panelAlergiasInit() {
  const text = document.getElementById('alergias_texto');
  document.getElementById('alergias_guardar').onclick = async () => {
    await setDoc(doc(db, "alergias", "principal"), {
      texto: text.value,
      updated: new Date().toISOString()
    });
    showToast('Alergias guardadas');
  };
  document.getElementById('alergias_cargar').onclick = async () => {
    const snap = await getDoc(doc(db, "alergias", "principal"));
    text.value = snap.exists() ? snap.data().texto : "";
    showToast('Alergias cargadas');
  };
}

// ✅ Esta función es la que usa main.js
export function renderAlergias(container) {
  container.innerHTML = panelAlergias();
  panelAlergiasInit();
}
