import { db } from './firebase.js';
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import { showToast } from './toast.js';

export function panelSignos() {
  return `
  <section class="spa-panel">
    <h2>Signos Vitales</h2>
    <div class="form-row">
      <label for="signos_presion">Presión arterial</label>
      <input type="text" id="signos_presion" />
    </div>
    <div class="form-row">
      <label for="signos_temp">Temperatura</label>
      <input type="text" id="signos_temp" />
    </div>
    <div class="form-actions">
      <button id="signos_guardar">Guardar</button>
      <button id="signos_cargar">Cargar</button>
    </div>
  </section>
  `;
}

export function panelSignosInit() {
  const presion = document.getElementById('signos_presion');
  const temp = document.getElementById('signos_temp');
  document.getElementById('signos_guardar').onclick = async () => {
    await setDoc(doc(db, "signos", "principal"), {
      presion: presion.value,
      temperatura: temp.value,
      updated: new Date().toISOString()
    });
    showToast('Signos guardados');
  };
  document.getElementById('signos_cargar').onclick = async () => {
    const snap = await getDoc(doc(db, "signos", "principal"));
    presion.value = snap.exists() ? snap.data().presion : "";
    temp.value = snap.exists() ? snap.data().temperatura : "";
    showToast('Signos cargados');
  };
}
