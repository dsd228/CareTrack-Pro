import { db } from './firebase.js';
import { getRole } from './auth.js';
import { doc, setDoc, getDoc } from "./firebase-mock.js";
import { showToast } from './toast.js';

export function panelHistoria() {
  return `
  <section class="spa-panel">
    <h2>Historia Clínica</h2>
    <div class="form-row">
      <label for="historia_texto">Resumen historia clínica</label>
      <textarea id="historia_texto"></textarea>
    </div>
    <div class="form-actions">
      <button id="historia_guardar">Guardar</button>
      <button id="historia_cargar">Cargar</button>
    </div>
  </section>
  `;
}

export function panelHistoriaInit() {
  const text = document.getElementById('historia_texto');
  document.getElementById('historia_guardar').onclick = async () => {
    await setDoc(doc(db, "historias", "principal"), {
      resumen: text.value,
      updated: new Date().toISOString()
    });
    showToast('Historia guardada en Firebase');
  };
  document.getElementById('historia_cargar').onclick = async () => {
    const snap = await getDoc(doc(db, "historias", "principal"));
    text.value = snap.exists() ? snap.data().resumen : "";
    showToast('Historia cargada');
  };
}

// ✅ Esta función es la que usa main.js
export function renderHistoria(container) {
  container.innerHTML = panelHistoria();
  panelHistoriaInit();
}
