import { db } from './firebase.js';
import { collection, getDocs, doc, getDoc, setDoc, deleteDoc, addDoc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import { showToast } from './toast.js';

// =====================
// Panel HTML
// =====================
export function panelEducacion() {
  return `
  <section class="spa-panel" id="educacion-panel">
    <h2>Educación</h2>
    <div class="form-row">
      <label for="educacion_busqueda">Buscar término</label>
      <input type="text" id="educacion_busqueda" placeholder="Ej: hipertensión, metformina, curación de herida"/>
      <button id="educacion_buscar" type="button">Buscar</button>
    </div>

    <div class="tabs">
      <button class="tab-btn active" data-tab="enfermedades">Enfermedades</button>
      <button class="tab-btn" data-tab="medicamentos">Medicamentos</button>
      <button class="tab-btn" data-tab="protocolos">Protocolos de Enfermería</button>
      <button class="tab-btn" data-tab="videos">Videos Tutoriales</button>
    </div>

    <div class="form-actions">
      <button id="educacion_agregar" type="button">Agregar nuevo</button>
      <button id="educacion_youtube" type="button" style="display:none;">Buscar en YouTube</button>
    </div>

    <div class="tab-content" id="educacion-content"></div>

    <div class="form-row">
      <label for="educacion_texto">Notas educativas (personalizadas)</label>
      <textarea id="educacion_texto"></textarea>
    </div>
    <div class="form-actions">
      <button id="educacion_guardar">Guardar</button>
      <button id="educacion_cargar">Cargar</button>
    </div>

    <!-- Modal General -->
    <div id="edu-modal" class="edu-modal" style="display:none;">
      <div class="edu-modal-content" id="edu-modal-content"></div>
      <button id="edu-modal-close" class="edu-modal-close">Cerrar</button>
    </div>
    <!-- Modal YouTube -->
    <div id="youtube-modal" class="edu-modal" style="display:none;">
      <div class="edu-modal-content" id="youtube-modal-content"></div>
      <button id="youtube-modal-close" class="edu-modal-close">Cerrar</button>
    </div>

    <style>
      .tabs { margin: 1em 0; }
      .tab-btn { padding: 0.5em 1em; margin-right: 0.5em; border-radius: 5px; border: none; background: #eee; cursor:pointer;}
      .tab-btn.active { background: #1976d2; color: white; }
      .edu-card { background: #f8f9fa; border-radius: 8px; box-shadow: 0 2px 6px #0001; padding: 1em; margin: 1em 0; position:relative;}
      .edu-card h3 { margin-top:0; }
      .edu-card .edu-actions { margin-top:0.5em; }
      .edu-card button { margin-right:0.5em; background:#1976d2; color:#fff; border:none; border-radius:4px; padding:0.3em 0.8em; cursor:pointer;}
      .edu-modal { position:fixed; left:0; top:0; width:100vw; height:100vh; z-index: 9999; background:rgba(0,0,0,0.3); display:flex; align-items:center; justify-content:center;}
      .edu-modal-content { background:#fff; padding:2em; border-radius:10px; min-width:300px; max-width:500px; box-shadow:0 4px 20px #0003;}
      .edu-modal-close { margin-top:1em; background:#1976d2; color:#fff; border:none; border-radius:4px; padding:0.3em 1em; cursor:pointer;}
      @media(max-width:600px){
        .edu-modal-content { min-width:90vw; }
      }
    </style>
  </section>
  `;
}

// =====================
// Inicialización JS
// =====================
export function panelEducacionInit() {
  const busqueda = document.getElementById('educacion_busqueda');
  const buscarBtn = document.getElementById('educacion_buscar');
  const content = document.getElementById('educacion-content');
  const agregarBtn = document.getElementById('educacion_agregar');
  const youtubeBtn = document.getElementById('educacion_youtube');
  const text = document.getElementById('educacion_texto');
  const tabs = document.querySelectorAll('.tab-btn');
  const modal = document.getElementById('edu-modal');
  const modalContent = document.getElementById('edu-modal-content');
  const modalCloseBtn = document.getElementById('edu-modal-close');
  const ytModal = document.getElementById('youtube-modal');
  const ytModalContent = document.getElementById('youtube-modal-content');
  const ytModalCloseBtn = document.getElementById('youtube-modal-close');
  let activeTab = "enfermedades";

  // Tabs
  tabs.forEach(tab => {
    tab.addEventListener('click', async () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeTab = tab.dataset.tab;
      agregarBtn.style.display = 'inline-block';
      youtubeBtn.style.display = (activeTab === 'videos') ? 'inline-block' : 'none';
      await loadTabData(activeTab);
    });
  });

  // Guardar / Cargar notas personalizadas
  document.getElementById('educacion_guardar').onclick = async () => {
    try {
      await setDoc(doc(db, "educacion", "principal"), {
        texto: text.value,
        updated: new Date().toISOString()
      });
      showToast('Educación guardada');
    } catch(e){
      showToast('Error guardando', 'error');
      console.error(e);
    }
  };

  document.getElementById('educacion_cargar').onclick = async () => {
    try {
      const snap = await getDoc(doc(db, "educacion", "principal"));
      text.value = snap.exists() ? snap.data().texto : "";
      showToast('Educación cargada');
    } catch(e){
      showToast('Error cargando', 'error');
      console.error(e);
    }
  };

  // Modal cerrar
  modalCloseBtn.onclick = () => {
    modal.style.display = 'none';
    modalContent.innerHTML = '';
  };

  // YouTube Modal cerrar
  ytModalCloseBtn.onclick = () => {
    ytModal.style.display = 'none';
    ytModalContent.innerHTML = '';
  };

  // ========== CRUD: Agregar ==========
  agregarBtn.onclick = () => {
    showFormModal(activeTab, null);
  };

  // ========== YouTube ==========
  youtubeBtn.onclick = () => {
    showYouTubeModal();
  };

  // Cargar tab inicial
  agregarBtn.style.display = 'inline-block';
  youtubeBtn.style.display = (activeTab === 'videos') ? 'inline-block' : 'none';
  loadTabData(activeTab);

  // =====================
  // Funciones internas
  // =====================
  async function loadTabData(tabName){
    content.innerHTML = '<p>Cargando...</p>';
    let colName = (tabName === 'enfermedades') ? 'enfermedades' :
                  (tabName === 'medicamentos') ? 'medicamentos' :
                  (tabName === 'protocolos') ? 'protocolos_enfermeria' :
                  (tabName === 'videos') ? 'videos_tutoriales' : '';
    if(!colName){
      content.innerHTML = '<p>Tab no soportada.</p>';
      return;
    }
    try {
      const snapshot = await getDocs(collection(db, colName));
      const items = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
      renderTab(tabName, items);
    } catch(e){
      content.innerHTML = '<p>Error cargando datos.</p>';
      console.error(e);
    }
  }

  function renderTab(tabName, items){
    if(items.length === 0){
      content.innerHTML = '<p>No hay información disponible.</p>';
      return;
    }

    const html = items.map(item => {
      if(tabName === 'enfermedades'){
        return `<div class="edu-card">
          <h3>${item.nombre}</h3>
          <p><strong>Descripción:</strong> ${item.descripcion || 'N/D'}</p>
          <p><strong>Síntomas:</strong> ${item.sintomas || 'N/D'}</p>
          <p><strong>Prevención:</strong> ${item.prevencion || 'N/D'}</p>
          <p><strong>Tratamiento:</strong> ${item.tratamiento || 'N/D'}</p>
          <div class="edu-actions">
            <button onclick="window.eduVerDetalle('${tabName}','${item.id}')">Ver más</button>
            <button onclick="window.eduEditar('${tabName}','${item.id}')">Editar</button>
            <button onclick="window.eduEliminar('${tabName}','${item.id}')">Eliminar</button>
          </div>
        </div>`;
      }
      if(tabName === 'medicamentos'){
        return `<div class="edu-card">
          <h3>${item.nombre}</h3>
          <p><strong>Principio activo:</strong> ${item.principioActivo || 'N/D'}</p>
          <p><strong>Dosis:</strong> ${item.dosis || 'N/D'}</p>
          <p><strong>Efectos secundarios:</strong> ${item.efectosSecundarios || 'N/D'}</p>
          <p><strong>Contraindicaciones:</strong> ${item.contraindicaciones || 'N/D'}</p>
          <div class="edu-actions">
            <button onclick="window.eduVerDetalle('${tabName}','${item.id}')">Ver más</button>
            <button onclick="window.eduEditar('${tabName}','${item.id}')">Editar</button>
            <button onclick="window.eduEliminar('${tabName}','${item.id}')">Eliminar</button>
          </div>
        </div>`;
      }
      if(tabName === 'protocolos'){
        return `<div class="edu-card">
          <h3>${item.nombre}</h3>
          <p><strong>Objetivo:</strong> ${item.objetivo || 'N/D'}</p>
          <p><strong>Procedimiento:</strong> ${item.procedimiento || 'N/D'}</p>
          <p><strong>Precauciones:</strong> ${item.precauciones || 'N/D'}</p>
          <p><strong>Referencias:</strong> ${item.referencias || 'N/D'}</p>
          <div class="edu-actions">
            <button onclick="window.eduVerDetalle('${tabName}','${item.id}')">Ver más</button>
            <button onclick="window.eduEditar('${tabName}','${item.id}')">Editar</button>
            <button onclick="window.eduEliminar('${tabName}','${item.id}')">Eliminar</button>
          </div>
        </div>`;
      }
      if(tabName === 'videos'){
        return `<div class="edu-card">
          <h3>${item.titulo}</h3>
          <p><strong>Categoría:</strong> ${item.categoria || 'N/D'}</p>
          <a href="${item.url}" target="_blank" style="color:#1976d2;">Ver video</a>
          <div class="edu-actions">
            <button onclick="window.eduEditar('${tabName}','${item.id}')">Editar</button>
            <button onclick="window.eduEliminar('${tabName}','${item.id}')">Eliminar</button>
          </div>
        </div>`;
      }
    }).join('');
    content.innerHTML = html;
  }

  // ========== MODAL: Detalle, Formulario, YouTube ==========
  // ... (Aquí va todo el código que ya tenías de eduVerDetalle, eduEditar, eduEliminar, showFormModal, showYouTubeModal, buscarVideosYT, eduGuardarVideoYT)
  // =====================

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
    } catch(e){ console.error("Error OpenFDA:", e); }

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
    } catch(e){ console.error("Error NHS:", e); }

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
        }catch(e){ console.error("Error traducción:", e); }
      }
    }

    return results;
  }

  async function mostrarResultadosAPIs(term){
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

  // ===== Integración con botón de búsqueda =====
  buscarBtn.onclick = async () => {
    const term = busqueda.value.trim();
    if(!term){
      showToast("Ingresa un término para buscar", "error");
      return;
    }
    await mostrarResultadosAPIs(term);
  };
}
