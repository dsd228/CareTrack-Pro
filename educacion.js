import { db } from './firebase.js';
import { collection, getDocs, doc, getDoc, setDoc, addDoc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import { showToast } from './toast.js';

// APIs externas
async function translateToSpanish(text) {
  try {
    const res = await fetch('https://libretranslate.com/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ q: text, source: 'auto', target: 'es', format: 'text' })
    });
    const data = await res.json();
    return data.translatedText;
  } catch {
    return text;
  }
}

async function fetchMedlinePlus(term) {
  try {
    const url = `https://wsearch.nlm.nih.gov/ws/query?db=healthTopics&term=${encodeURIComponent(term)}&retmode=json`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    return data.Result?.[0] || null;
  } catch {
    return null;
  }
}

async function fetchOpenFDA(term) {
  try {
    const res = await fetch(`https://api.fda.gov/drug/label.json?search=openfda.generic_name:"${encodeURIComponent(term)}"&limit=1`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.results?.[0] || null;
  } catch {
    return null;
  }
}

async function fetchNHS(term) {
  const apiKey = 'TU_API_KEY_NHS'; // Reemplaza con tu clave
  try {
    const res = await fetch(`https://api.nhs.uk/content/conditions/${encodeURIComponent(term)}`, {
      method: 'GET',
      headers: {
        'subscription-key': apiKey,
        'Accept': 'application/json'
      }
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

// =====================
// Panel HTML (sin cambios)
export function panelEducacion() {
  return `
    <!-- ... mismo HTML que ya tenías ... -->
  `;
}

// =====================
// Inicialización JS (con mejoras integradas)
export function panelEducacionInit() {
  // ... todas tus referencias a elementos, modales, CRUD, tabs ...
  
  // Búsqueda
  buscarBtn.onclick = async () => {
    const term = busqueda.value.trim();
    if (!term) {
      content.innerHTML = "<span style='color:#D23'>Ingresa un término a buscar.</span>";
      return;
    }
    content.innerHTML = "<em>Buscando información…</em>";
    let html = "";

    if (activeTab === "enfermedades") {
      const mp = await fetchMedlinePlus(term);
      if (mp?.Title) {
        html += `<h3>${mp.Title}</h3><p>${mp.FullSummary || mp.Summary || ''}</p>`;
      }
      const nhs = await fetchNHS(term);
      if (nhs?.mainContent && nhs.mainContent.body) {
        const tr = await translateToSpanish(nhs.mainContent.body);
        html += `<h4>Protocolo recomendado (NHS):</h4><p>${tr}</p>`;
      }
    }

    if (activeTab === "medicamentos") {
      const fda = await fetchOpenFDA(term);
      if (fda) {
        html += `<h3>${fda.openfda?.generic_name?.join(', ') || term}</h3>
          <p><strong>Indicaciones:</strong> ${fda.indications_and_usage || 'N/D'}</p>
          <p><strong>Dosis:</strong> ${fda.dosage_and_administration || 'N/D'}</p>
          <p><strong>Efectos secundarios:</strong> ${fda.adverse_reactions || 'N/D'}</p>
          <p><strong>Contraindicaciones:</strong> ${fda.warnings || 'N/D'}</p>`;
      }
    }

    if (activeTab === "protocolos") {
      const nhs = await fetchNHS(term);
      if (nhs?.mainContent && nhs.mainContent.body) {
        const tr = await translateToSpanish(nhs.mainContent.body);
        html += `<p>${tr}</p>`;
      }
    }

    content.innerHTML = html || `<span style='color:#D23'>No se encontró información.</span>`;
  };
  // =====================
// Integración APIs médicas
// =====================
async function buscarAPIsMedicas(term) {
  const results = [];

  // ===== OpenFDA: Medicamentos =====
  try {
    const fdaUrl = `https://api.fda.gov/drug/label.json?search=${encodeURIComponent(term)}&limit=3`;
    const fdaRes = await fetch(fdaUrl);
    const fdaData = await fdaRes.json();
    if (fdaData.results) {
      fdaData.results.forEach(item => {
        const name = item.openfda?.brand_name?.[0] || term;
        const purpose = item.purpose?.[0] || '';
        const indications = item.indications_and_usage?.[0] || '';
        results.push({
          fuente: 'OpenFDA',
          tipo: 'medicamento',
          nombre: name,
          descripcion: `${purpose} - ${indications}`
        });
      });
    }
  } catch(e){
    console.error("Error OpenFDA:", e);
  }

  // ===== NHS: Enfermedades y Protocolos =====
  try {
    const nhsUrl = `https://api.nhs.uk/service-search/search?q=${encodeURIComponent(term)}&limit=3`;
    const nhsRes = await fetch(nhsUrl, {
      headers: { 'subscription-key': 'TU_API_KEY_NHS' }
    });
    const nhsData = await nhsRes.json();
    if(nhsData.results){
      nhsData.results.forEach(item => {
        results.push({
          fuente: 'NHS',
          tipo: item.type || 'info',
          nombre: item.name || term,
          descripcion: item.description || ''
        });
      });
    }
  } catch(e){
    console.error("Error NHS:", e);
  }

  // ===== Traducir al español =====
  for(let i=0;i<results.length;i++){
    if(results[i].descripcion){
      try{
        const res = await fetch('https://libretranslate.de/translate', {
          method:'POST',
          headers:{'Content-Type':'application/json'},
          body: JSON.stringify({q: results[i].descripcion, source:'en', target:'es'})
        });
        const data = await res.json();
        results[i].descripcion = data.translatedText;
      }catch(e){
        console.error("Error traducción:", e);
      }
    }
  }

  return results;
}

// ===== Mostrar resultados en tab de educación =====
async function mostrarResultadosAPIs(term){
  const content = document.getElementById('educacion-content');
  content.innerHTML = "<p>Buscando en APIs médicas...</p>";
  const items = await buscarAPIsMedicas(term);
  if(items.length === 0){
    content.innerHTML = "<p>No se encontraron resultados en las APIs médicas.</p>";
    return;
  }
  const html = items.map(i => `
    <div class="edu-card">
      <h3>${i.nombre} (${i.fuente})</h3>
      <p>${i.descripcion}</p>
    </div>
  `).join('');
  content.innerHTML = html;
}

// ===== Integración con el botón de búsqueda =====
document.getElementById('educacion_buscar').onclick = async () => {
  const term = document.getElementById('educacion_busqueda').value.trim();
  if(!term){
    showToast("Ingresa un término para buscar", "error");
    return;
  }
  await mostrarResultadosAPIs(term);
};

  // ... resto de tu código intacto (CRUD, modales, etc.) ...
}
