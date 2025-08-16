import { db } from './firebase.js';
import { doc, setDoc, getDoc } from "./firebase-mock.js";
import { showToast } from './toast.js';

export function panelExamenes() {
  return `
  <section class="spa-panel">
    <h2>Exámenes</h2>
    <div class="form-row">
      <label for="examenes_texto">Exámenes realizados</label>
      <textarea id="examenes_texto"></textarea>
    </div>
    <div class="form-actions">
      <button id="examenes_guardar">Guardar</button>
      <button id="examenes_cargar">Cargar</button>
    </div>
  </section>
  `;
}

export function panelExamenesInit() {
  const text = document.getElementById('examenes_texto');
  document.getElementById('examenes_guardar').onclick = async () => {
    await setDoc(doc(db, "examenes", "principal"), {
      texto: text.value,
      updated: new Date().toISOString()
    });
    showToast('Exámenes guardados');
  };
  document.getElementById('examenes_cargar').onclick = async () => {
    const snap = await getDoc(doc(db, "examenes", "principal"));
    text.value = snap.exists() ? snap.data().texto : "";
    showToast('Exámenes cargados');
  };
}

// ✅ Esta función es la que usa main.js
export function renderExamenes(container) {
  container.innerHTML = panelExamenes();
  panelExamenesInit();
}
