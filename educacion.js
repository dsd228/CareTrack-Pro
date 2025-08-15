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

  // Búsqueda
  buscarBtn.onclick = async () => {
    const term = busqueda.value.trim().toLowerCase();
    if(!term){
      content.innerHTML = "<span style='color:#D23'>Ingresa un término a buscar.</span>";
      return;
    }
    await searchTerm(term);
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

  async function searchTerm(term){
    const tabName = activeTab;
    const colName = (tabName === 'enfermedades') ? 'enfermedades' :
                    (tabName === 'medicamentos') ? 'medicamentos' :
                    (tabName === 'protocolos') ? 'protocolos_enfermeria' :
                    (tabName === 'videos') ? 'videos_tutoriales' : '';
    if(!colName) return;
    const snapshot = await getDocs(collection(db, colName));
    const items = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}))
                              .filter(i => Object.values(i).some(
                                  v => typeof v === 'string' && v.toLowerCase().includes(term)
                              ));
    renderTab(tabName, items);
  }

  // ========== MODAL: Detalle ==========
  window.eduVerDetalle = async function(tabName, id){
    let colName = (tabName === 'enfermedades') ? 'enfermedades' :
                  (tabName === 'medicamentos') ? 'medicamentos' :
                  (tabName === 'protocolos') ? 'protocolos_enfermeria' : '';
    if(!colName) return;
    try {
      const snap = await getDoc(doc(db, colName, id));
      if(!snap.exists()){
        modalContent.innerHTML = "<p>No se encontró el documento.</p>";
        modal.style.display = 'flex';
        return;
      }
      const item = snap.data();
      let html = "";
      if(tabName === 'enfermedades'){
        html = `<h2>${item.nombre}</h2>
        <p><strong>Descripción:</strong> ${item.descripcion || 'N/D'}</p>
        <p><strong>Síntomas:</strong> ${item.sintomas || 'N/D'}</p>
        <p><strong>Prevención:</strong> ${item.prevencion || 'N/D'}</p>
        <p><strong>Tratamiento:</strong> ${item.tratamiento || 'N/D'}</p>`;
      }
      if(tabName === 'medicamentos'){
        html = `<h2>${item.nombre}</h2>
        <p><strong>Principio activo:</strong> ${item.principioActivo || 'N/D'}</p>
        <p><strong>Dosis:</strong> ${item.dosis || 'N/D'}</p>
        <p><strong>Efectos secundarios:</strong> ${item.efectosSecundarios || 'N/D'}</p>
        <p><strong>Contraindicaciones:</strong> ${item.contraindicaciones || 'N/D'}</p>`;
      }
      if(tabName === 'protocolos'){
        html = `<h2>${item.nombre}</h2>
        <p><strong>Objetivo:</strong> ${item.objetivo || 'N/D'}</p>
        <p><strong>Procedimiento:</strong> ${item.procedimiento || 'N/D'}</p>
        <p><strong>Precauciones:</strong> ${item.precauciones || 'N/D'}</p>
        <p><strong>Referencias:</strong> ${item.referencias || 'N/D'}</p>`;
      }
      modalContent.innerHTML = html;
      modal.style.display = 'flex';
    } catch(e){
      modalContent.innerHTML = "<p>Error cargando detalle.</p>";
      modal.style.display = 'flex';
      console.error(e);
    }
  }

  // ========== MODAL: Formulario Agregar/Editar ==========
  window.eduEditar = async function(tabName, id){
    let colName = getColName(tabName);
    if(!colName) return;
    try {
      const snap = await getDoc(doc(db, colName, id));
      if(!snap.exists()){ showToast("No existe el documento", "error"); return; }
      showFormModal(tabName, {id, ...snap.data()});
    } catch(e){ showToast("Error cargando", "error"); }
  };

  window.eduEliminar = async function(tabName, id){
    if(!confirm("¿Seguro que deseas eliminar este elemento?")) return;
    let colName = getColName(tabName);
    if(!colName) return;
    try {
      await deleteDoc(doc(db, colName, id));
      showToast("Eliminado correctamente");
      await loadTabData(tabName);
    } catch(e){
      showToast("Error al eliminar", "error");
    }
  };

  function getColName(tabName){
    return (tabName === 'enfermedades') ? 'enfermedades' :
           (tabName === 'medicamentos') ? 'medicamentos' :
           (tabName === 'protocolos') ? 'protocolos_enfermeria' :
           (tabName === 'videos') ? 'videos_tutoriales' : '';
  }

  function showFormModal(tabName, item){
    let fields = [];
    if(tabName === 'enfermedades'){
      fields = [
        {name:"nombre", label:"Nombre", type:"text"},
        {name:"descripcion", label:"Descripción", type:"textarea"},
        {name:"sintomas", label:"Síntomas", type:"textarea"},
        {name:"prevencion", label:"Prevención", type:"textarea"},
        {name:"tratamiento", label:"Tratamiento", type:"textarea"},
      ];
    }
    if(tabName === 'medicamentos'){
      fields = [
        {name:"nombre", label:"Nombre", type:"text"},
        {name:"principioActivo", label:"Principio Activo", type:"text"},
        {name:"dosis", label:"Dosis", type:"text"},
        {name:"efectosSecundarios", label:"Efectos Secundarios", type:"textarea"},
        {name:"contraindicaciones", label:"Contraindicaciones", type:"textarea"},
      ];
    }
    if(tabName === 'protocolos'){
      fields = [
        {name:"nombre", label:"Nombre", type:"text"},
        {name:"objetivo", label:"Objetivo", type:"textarea"},
        {name:"procedimiento", label:"Procedimiento", type:"textarea"},
        {name:"precauciones", label:"Precauciones", type:"textarea"},
        {name:"referencias", label:"Referencias", type:"textarea"},
      ];
    }
    if(tabName === 'videos'){
      fields = [
        {name:"titulo", label:"Título", type:"text"},
        {name:"url", label:"URL", type:"text"},
        {name:"categoria", label:"Categoría", type:"text"},
      ];
    }
    let html = `<form id="edu-form">
      ${fields.map(f => `
        <label>${f.label}</label>
        ${f.type === 'textarea' ? `<textarea name="${f.name}">${item?.[f.name] || ''}</textarea>` : `<input type="${f.type}" name="${f.name}" value="${item?.[f.name] || ''}" />`}
      `).join('')}
      <button type="submit">${item ? 'Guardar cambios' : 'Agregar'}</button>
    </form>`;
    modalContent.innerHTML = html;
    modal.style.display = 'flex';
    document.getElementById('edu-form').onsubmit = async function(e){
      e.preventDefault();
      let data = {};
      fields.forEach(f => {
        data[f.name] = this[f.name].value;
      });
      let colName = getColName(tabName);
      try {
        if(item?.id){
          await setDoc(doc(db, colName, item.id), data);
          showToast("Actualizado correctamente");
        }else{
          await addDoc(collection(db, colName), data);
          showToast("Agregado correctamente");
        }
        modal.style.display = 'none';
        await loadTabData(tabName);
      } catch(e){
        showToast("Error guardando", "error");
      }
    };
  }

  // ========== MODAL: Buscar videos YouTube ==========
  function showYouTubeModal(){
    ytModalContent.innerHTML = `
      <h3>Búsqueda de videos YouTube</h3>
      <div>
        <input type="text" id="youtube_query" placeholder="término de búsqueda" style="width:70%;"/>
        <button id="youtube_buscar">Buscar</button>
      </div>
      <div id="youtube_results"></div>
    `;
    ytModal.style.display = 'flex';

    document.getElementById('youtube_buscar').onclick = async () => {
      const q = document.getElementById('youtube_query').value.trim();
      if(!q) return;
      document.getElementById('youtube_results').innerHTML = "<p>Buscando...</p>";
      const videos = await buscarVideosYT(q);
      if(videos.length === 0){
        document.getElementById('youtube_results').innerHTML = "<p>No se encontraron videos.</p>";
        return;
      }
      document.getElementById('youtube_results').innerHTML = videos.map(v =>
        `<div style="margin:1em 0;padding:1em;border:1px solid #eee;border-radius:5px;">
          <h4>${v.titulo}</h4>
          <a href="${v.url}" target="_blank">Ver en YouTube</a><br>
          <input type="text" placeholder="Categoría" value="${v.categoria}" id="cat_${v.id}">
          <button onclick="window.eduGuardarVideoYT('${v.titulo}', '${v.url}', document.getElementById('cat_${v.id}').value)">Guardar en tutoriales</button>
        </div>`
      ).join('');
    };
  }

  // ========== YouTube API ==========
  async function buscarVideosYT(query){
    const apiKey = 'TU_API_KEY_YOUTUBE'; // <<-- PON AQUÍ TU API KEY YOUTUBE!
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=5&key=${apiKey}`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      if(!data.items) return [];
      return data.items.map(item => ({
        id: item.id.videoId,
        titulo: item.snippet.title,
        url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
        categoria: query
      }));
    } catch(e){
      return [];
    }
  }

  window.eduGuardarVideoYT = async function(titulo, url, categoria){
    try {
      await addDoc(collection(db, "videos_tutoriales"), { titulo, url, categoria });
      showToast("Video guardado en tutoriales");
      ytModal.style.display = 'none';
      await loadTabData("videos");
    } catch(e){
      showToast("Error guardando video", "error");
    }
  };
}
