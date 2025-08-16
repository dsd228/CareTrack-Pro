import { db } from './firebase.js';
import { doc, setDoc, getDoc } from "./firebase-mock.js";
import { showToast } from './toast.js';

export function panelNotas() {
  return `
  <section class="spa-panel">
    <h2>Notas</h2>
    <div class="form-row">
      <label for="notas_texto">Notas adicionales</label>
      <textarea id="notas_texto"></textarea>
    </div>
    <div class="form-actions">
      <button id="notas_guardar">Guardar</button>
      <button id="notas_cargar">Cargar</button>
    </div>
  </section>
  `;
}

export function panelNotasInit() {
  const text = document.getElementById('notas_texto');
  document.getElementById('notas_guardar').onclick = async () => {
    await setDoc(doc(db, "notas", "principal"), {
      texto: text.value,
      updated: new Date().toISOString()
    });
    showToast('Notas guardadas');
  };
  document.getElementById('notas_cargar').onclick = async () => {
    const snap = await getDoc(doc(db, "notas", "principal"));
    text.value = snap.exists() ? snap.data().texto : "";
    showToast('Notas cargadas');
  };
}

// ✅ Esta función es la que usa main.js
export function renderNotas(container) {
  container.innerHTML = panelNotas();
  panelNotasInit();
}
