import { db } from './firebase.js';
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
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
  const text = document.getElementById('educacion_texto');
  const tabs = document.querySelectorAll('.tab-btn');
  let activeTab = "enfermedades";

  // Cambio de pestañas
  tabs.forEach(tab => {
    tab.addEventListener('click', async () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeTab = tab.dataset.tab;
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

  // Búsqueda
  buscarBtn.onclick = async () => {
    const term = busqueda.value.trim().toLowerCase();
    if(!term){
      content.innerHTML = "<span style='color:#D23'>Ingresa un término a buscar.</span>";
      return;
    }
    await searchTerm(term);
  };

  // Cargar tab inicial
  loadTabData(activeTab);

  // =====================
  // Funciones internas
  // =====================
  async function loadTabData(tabName){
    content.innerHTML = '<p>Cargando...</p>';
    let colName = (tabName === 'enfermedades') ? 'enfermedades' :
                  (tabName === 'medicamentos') ? 'medicamentos' :
                  'protocolos_enfermeria';

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
          <p><strong>Síntomas:</strong> ${item.sintomas || 'N/D'}</p>
          <p><strong>Prevención:</strong> ${item.prevencion || 'N/D'}</p>
          <p><strong>Tratamiento:</strong> ${item.tratamiento || 'N/D'}</p>
        </div>`;
      }
      if(tabName === 'medicamentos'){
        return `<div class="edu-card">
          <h3>${item.nombre}</h3>
          <p><strong>Principio activo:</strong> ${item.principioActivo || 'N/D'}</p>
          <p><strong>Dosis:</strong> ${item.dosis || 'N/D'}</p>
          <p><strong>Efectos secundarios:</strong> ${item.efectosSecundarios || 'N/D'}</p>
          <p><strong>Contraindicaciones:</strong> ${item.contraindicaciones || 'N/D'}</p>
        </div>`;
      }
      if(tabName === 'protocolos'){
        return `<div class="edu-card">
          <h3>${item.nombre}</h3>
          <p><strong>Objetivo:</strong> ${item.objetivo || 'N/D'}</p>
          <p><strong>Procedimiento:</strong> ${item.procedimiento || 'N/D'}</p>
          <p><strong>Precauciones:</strong> ${item.precauciones || 'N/D'}</p>
        </div>`;
      }
    }).join('');
    content.innerHTML = html;
  }

  async function searchTerm(term){
    const tabName = activeTab;
    const colName = (tabName === 'enfermedades') ? 'enfermedades' :
                    (tabName === 'medicamentos') ? 'medicamentos' :
                    'protocolos_enfermeria';
    const snapshot = await getDocs(collection(db, colName));
    const items = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}))
                              .filter(i => Object.values(i).some(v => typeof v === 'string' && v.toLowerCase().includes(term)));
    renderTab(tabName, items);
  }
}
