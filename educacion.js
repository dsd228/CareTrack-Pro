import { db } from './firebase.js';
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import { showToast } from './toast.js';

// Funciones para consulta externa
async function buscarWiki(term, lang = "es") {
  const url = `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(term)}`;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    return data;
  } catch {
    return null;
  }
}

async function buscarFDA(term) {
  try {
    const res = await fetch(`https://api.fda.gov/drug/label.json?search=${encodeURIComponent(term)}`);
    if (!res.ok) return null;
    const data = await res.json();
    if (data.results && data.results.length) return data.results[0];
    return null;
  } catch {
    return null;
  }
}

export function panelEducacion() {
  return `
  <section class="spa-panel">
    <h2>Educación</h2>
    <div class="form-row">
      <label for="educacion_busqueda">Buscar enfermedad o medicación</label>
      <input type="text" id="educacion_busqueda" placeholder="Ej: diabetes, paracetamol" />
      <button id="educacion_buscar" type="button">Buscar</button>
    </div>
    <div class="form-row">
      <div id="educacion_resultado"></div>
    </div>
    <div class="form-row">
      <label for="educacion_texto">Notas educativas (personalizadas)</label>
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
  const busqueda = document.getElementById('educacion_busqueda');
  const buscarBtn = document.getElementById('educacion_buscar');
  const resultado = document.getElementById('educacion_resultado');
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

  buscarBtn.onclick = async () => {
    resultado.innerHTML = "<em>Buscando...</em>";
    const term = busqueda.value.trim();
    if (!term) {
      resultado.innerHTML = "<span style='color:#D23'>Ingresa un término a buscar.</span>";
      return;
    }
    let wiki = await buscarWiki(term);
    let fda = await buscarFDA(term);

    let html = "";

    if (wiki && wiki.extract) {
      html += `<h3>Wikipedia</h3>
        <div><strong>${wiki.title}</strong></div>
        <div>${wiki.extract}</div>
        ${wiki.content_urls?.desktop?.page ? `<a href="${wiki.content_urls.desktop.page}" target="_blank">Ver más</a>` : ""}
        <hr />`;
    }
    if (fda) {
      html += `<h3>OpenFDA</h3>
        <div><strong>${fda.openfda?.brand_name?.join(", ") || term}</strong></div>
        <div>${fda.description || fda.indications_and_usage || "Sin descripción disponible."}</div>
        ${fda.openfda?.manufacturer_name ? `<div>Fabricante: ${fda.openfda.manufacturer_name.join(", ")}</div>` : ""}
        <hr />`;
    }
    if (!wiki && !fda) {
      html = `<span style='color:#D23'>No se encontró información para '${term}'.</span>`;
    }
    resultado.innerHTML = html;
  };
}
