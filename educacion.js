import { db } from './firebase.js';
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import { showToast } from './toast.js';

export function panelEducacion() {
  return `
  <section class="spa-panel">
    <h2>Educación</h2>
    <div class="form-row">
      <label for="educacion_texto">Información educativa</label>
      <textarea id="educacion_texto"></textarea>
    </div>
    <div class="form-actions">
      <button id="educacion_guardar">Guardar</button>
      <button id="educacion_cargar">Cargar</button>
    </div>
  </section>
  `;
}

export function panelEducacionInit() {
  const text = document.getElementById('educacion_texto');
  document.getElementById('educacion_guardar').onclick = async () => {
    await setDoc(doc(db, "educacion", "principal"), {
      texto: text.value,
      updated: new Date().toISOString()
    });
    showToast('Educación guardada');
  };
  document.getElementById('educacion_cargar').onclick = async () => {
    const snap = await getDoc(doc(db, "educacion", "principal"));
    text.value = snap.exists() ? snap.data().texto : "";
    showToast('Educación cargada');
  };
}
