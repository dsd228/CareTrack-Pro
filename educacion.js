Sí, David, se cortó antes de terminar el código. Te paso el educacion.js completo ya finalizado, incluyendo pestañas, tarjetas, búsqueda y fallback local:

import { db } from './firebase.js';
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import { showToast } from './toast.js';

// =====================
// Fallbacks locales
// =====================
const fallbackEnfermedades = [
  {
    nombre: "Hipertensión arterial",
    descripcion: "Aumento persistente de la presión arterial por encima de valores normales.",
    tratamientosFarm: ["IECA/ARA-II", "Diuréticos tiazídicos"],
    tratamientosNoFarm: ["Dieta DASH", "Ejercicio regular", "Reducción de sal"],
    cuidados: ["Monitorear presión arterial", "Educar sobre adherencia al tratamiento", "Detectar signos de alarma"]
  },
  {
    nombre: "Diabetes tipo 2",
    descripcion: "Alteración metabólica caracterizada por resistencia a la insulina y/o secreción insuficiente.",
    tratamientosFarm: ["Metformina", "Sulfonilureas", "Insulina en casos avanzados"],
    tratamientosNoFarm: ["Control de peso", "Alimentación saludable", "Actividad física"],
    cuidados: ["Monitorear glucemias", "Revisar pies", "Educar sobre hipoglucemia"]
  }
];

const fallbackMedicamentos = [
  {
    generico: "Metformina",
    comercial: "Glucophage",
    indicaciones: "Tratamiento de la diabetes mellitus tipo 2",
    dosis: "Adultos: 500–850 mg 2-3 veces/día. Pediátrico: 10–15 mg/kg/día.",
    efectos: "Molestias gastrointestinales, náuseas",
    contra: "Insuficiencia renal grave, acidosis láctica"
  },
  {
    generico: "Losartán",
    comercial: "Cozaar",
    indicaciones: "Tratamiento de la hipertensión arterial",
    dosis: "Adultos: 50–100 mg/día. No recomendado en pediatría sin supervisión.",
    efectos: "Mareos, hiperkalemia",
    contra: "Embarazo, hipersensibilidad al fármaco"
  }
];

const fallbackProtocolos = [
  {
    nombre: "Curación de herida simple",
    pasos: ["Lavado de manos", "Limpieza con suero fisiológico", "Aplicar antiséptico", "Cubrir con apósito estéril"]
  },
  {
    nombre: "Toma de presión arterial",
    pasos: ["Paciente en reposo 5 minutos", "Manguito adecuado", "Colocar a nivel del corazón", "Registrar resultado"]
  }
];

// =====================
// Funciones externas
// =====================
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

// =====================
// Panel HTML
// =====================
export function panelEducacion() {
  return `
  <section class="spa-panel">
    <h2>Educación</h2>
    <div class="form-row">
      <label for="educacion_busqueda">Buscar enfermedad o medicamento</label>
      <input type="text" id="educacion_busqueda" placeholder="Ej: diabetes, paracetamol" />
      <button id="educacion_buscar" type="button">Buscar</button>
    </div>

    <div class="tabs">
      <button class="tab-btn active" data-tab="enfermedades">Enfermedades</button>
      <button class="tab-btn" data-tab="medicamentos">Medicamentos</button>
      <button class="tab-btn" data-tab="protocolos">Protocolos de Enfermería</button>
    </div>

    <div id="educacion_resultado"></div>

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

// =====================
// Inicialización JS
// =====================
export function panelEducacionInit() {
  // Inject CSS responsivo
  const style = document.createElement("style");
  style.textContent = `
  .tabs { display:flex; gap:10px; margin:10px 0; flex-wrap: wrap; }
  .tab-btn { padding:5px 10px; cursor:pointer; border:none; background:#1976d2; color:white; border-radius:5px; }
  .tab-btn.active { background:#0d47a1; }
  #educacion_resultado .card { border:1px solid #1976d2; padding:10px; border-radius:5px; margin:5px 0; background:#f5f5f5; }
  #educacion_resultado ul, #educacion_resultado ol { margin:5px 0 10px 20px; }
  @media (max-width:600px) { .tabs { flex-direction: column; } }
  `;
  document.head.appendChild(style);

  const busqueda = document.getElementById('educacion_busqueda');
  const buscarBtn = document.getElementById('educacion_buscar');
  const resultado = document.getElementById('educacion_resultado');
  const text = document.getElementById('educacion_texto');
  let activeTab = "enfermedades";

  // Cambio de pestañas
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeTab = btn.dataset.tab;
      resultado.innerHTML = "";
    };
  });

  // Guardar / Cargar notas personalizadas
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

  // Búsqueda
  buscarBtn.onclick = async () => {
    resultado.innerHTML = "<em>Buscando...</em>";
    const term = busqueda.value.trim();
    if (!term) {
      resultado.innerHTML = "<span style='color:#D23'>Ingresa un término a buscar.</span>";
      return;
    }

    if (activeTab === "enfermedades") {
      let wiki = await buscarWiki(term);
      if (wiki && wiki.extract) {
        resultado.innerHTML = `
          <div class="card">
            <h3>${wiki.title}</h3>
            <p>${wiki.extract}</p>
            ${wiki.content_urls?.desktop?.page ? `<a href="${wiki.content_urls.desktop.page}" target="_blank">Ver más</a>` : ""}
          </div>`;
      } else {
        let local = fallbackEnfermedades.find(e => e.nombre.toLowerCase().includes(term.toLowerCase()));
        if (local) {
          resultado.innerHTML = `
            <div class="card">
              <h3>${local.nombre}</h3>
              <p>${local.descripcion}</p>
              <strong>Tratamientos farmacológicos:</strong>
              <ul>${local.tratamientosFarm.map(t => `<li>${t}</li>`).join("")}</ul>
              <strong>Tratamientos no farmacológicos:</strong>
              <ul>${local.tratamientosNoFarm.map(t => `<li>${t}</li>`).join("")}</ul>
              <strong>Cuidados de enfermería:</strong>
              <ul>${local.cuidados.map(c => `<li>${c}</li>`).join("")}</ul>
            </div>`;
        } else {
          resultado.innerHTML = `<span style='color:#D23'>No se encontró información.</span>`;
        }
      }
    }

    if (activeTab === "medicamentos") {
      let fda = await buscarFDA(term);
      if (fda) {
        resultado.innerHTML = `
          <div class="card">
            <h3>${fda.openfda?.generic_name?.join(", ") || term}</h3>
            <p><strong>Comercial:</strong> ${fda.openfda?.brand_name?.join(", ") || "N/D"}</p>
            <p><strong>Indicaciones:</strong> ${fda.indications_and_usage || "N/D"}</p>
            <p><strong>Dosis:</strong> ${fda.dosage_and_administration || "N/D"}</p>
            <p><strong>Efectos secundarios:</strong> ${fda.adverse_reactions || "N/D"}</p>
            <p><strong>Contraindicaciones:</strong> ${fda.warnings || "N/D"}</p>
          </div>`;
      } else {
        let local = fallbackMedicamentos.find(m => m.generico.toLowerCase().includes(term.toLowerCase()));
        if (local) {
          resultado.innerHTML = `
            <div class="card">
              <h3>${local.generico} (${local.comercial})</h3>
              <p><strong>Indicaciones:</strong> ${local.indicaciones}</p>
              <p><strong>Dosis:</strong> ${local.dosis}</p>
              <p><strong>Efectos secundarios:</strong> ${local.efectos}</p>
              <p><strong>Contraindicaciones:</strong> ${local.contra}</p>
            </div>`;
        } else {
          resultado.innerHTML = `<span style='color:#D23'>No se encontró información.</span>`;
        }
      }
    }

    if (activeTab === "protocolos") {
      let local = fallbackProtocolos.filter(p => p.nombre.toLowerCase().includes(term.toLowerCase()));
      if    if (activeTab === "protocolos") {
      let local = fallbackProtocolos.filter(p => p.nombre.toLowerCase().includes(term.toLowerCase()));
      if (local.length) {
        resultado.innerHTML = local.map(p => `
          <div class="card">
            <h3>${p.nombre}</h3>
            <ol>
              ${p.pasos.map(paso => `<li>${paso}</li>`).join("")}
            </ol>
          </div>
        `).join("");
      } else {
        resultado.innerHTML = `<span style='color:#D23'>No se encontró información de protocolos.</span>`;
      }
    }
  };
}
