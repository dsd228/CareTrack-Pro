// Import dependencies - using mock implementations
import { db } from './firebase.js';
import { showToast } from './toast.js';

console.log('Loading educacion.js module');

// HTML structure for the education panel
export function panelEducacion() {
  return `
    <section class="spa-panel">
      <h2>Módulo Educacional</h2>
      
      <!-- Tabs -->
      <div class="edu-tabs">
        <button class="tab-btn active" data-tab="enfermedades">Enfermedades</button>
        <button class="tab-btn" data-tab="medicamentos">Medicamentos</button>
        <button class="tab-btn" data-tab="protocolos">Protocolos</button>
        <button class="tab-btn" data-tab="videos">Videos</button>
      </div>

      <!-- Search section -->
      <div class="edu-search">
        <div class="form-row">
          <label for="educacion_busqueda">Buscar contenido educativo:</label>
          <input type="search" id="educacion_busqueda" placeholder="Ej: diabetes, ibuprofeno, protocolo RCP..." />
          <button id="educacion_buscar" type="button">Buscar</button>
        </div>
      </div>

      <!-- Action buttons -->
      <div class="edu-actions-bar">
        <button id="educacion_agregar" type="button">Agregar Nuevo</button>
        <button id="educacion_youtube" type="button" style="display:none;">Buscar en YouTube</button>
      </div>

      <!-- Content area -->
      <div id="educacion-content" class="edu-content">
        <p>Selecciona una categoría para ver el contenido...</p>
      </div>

      <!-- Personal notes section -->
      <div class="edu-notes">
        <h3>Notas Personales</h3>
        <textarea id="educacion_texto" placeholder="Escribe tus notas educativas aquí..."></textarea>
        <div class="form-actions">
          <button id="educacion_guardar" type="button">Guardar Notas</button>
          <button id="educacion_cargar" type="button">Cargar Notas</button>
        </div>
      </div>
    </section>

    <!-- Modal for details -->
    <div id="edu-modal" class="modal" style="display:none;">
      <div class="modal-content">
        <span id="edu-modal-close" class="modal-close">&times;</span>
        <div id="edu-modal-content"></div>
      </div>
    </div>

    <!-- YouTube modal -->
    <div id="youtube-modal" class="modal" style="display:none;">
      <div class="modal-content">
        <span id="youtube-modal-close" class="modal-close">&times;</span>
        <div id="youtube-modal-content"></div>
      </div>
    </div>
  `;
}

// Main render function called by main.js
export function renderEducacion(container) {
  container.innerHTML = panelEducacion();
  panelEducacionInit();
}

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
      await safeSetDoc(safeDoc("educacion", "principal"), {
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
      const snap = await safeGetDoc(safeDoc("educacion", "principal"));
      text.value = snap.exists() ? snap.data().texto : "";
      showToast('Educación cargada');
    } catch(e){
      showToast('Error cargando', 'error');
      console.error(e);
    }
  };

  // Búsqueda combinada Firebase + NHS + traducción
  buscarBtn.onclick = async () => {
    const term = busqueda.value.trim().toLowerCase();
    if(!term){
      content.innerHTML = "<span style='color:#D23'>Ingresa un término a buscar.</span>";
      return;
    }
    await searchTerm(term);
  };

  async function searchTerm(term){
    const tabName = activeTab;
    const colName = getColName(tabName);
    if(!colName) return;

    content.innerHTML = '<p>Buscando...</p>';

    // Firebase/Mock data
    const snapshot = await safeGetDocs(safeCollection(colName));
    let items = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}))
                             .filter(i => Object.values(i).some(
                                 v => typeof v === 'string' && v.toLowerCase().includes(term)
                             ));

    // NHS (would work with real API)
    let nhsItems = [];
    if(tabName === 'enfermedades' || tabName === 'medicamentos'){
      // Simulate NHS search result
      nhsItems.push({
        nombre: `Resultado NHS para: ${term}`,
        descripcion: 'Información médica verificada (simulada)',
        sintomas: 'Síntomas relacionados',
        prevencion: 'Medidas preventivas recomendadas',
        tratamiento: 'Opciones de tratamiento',
        fuente: 'NHS (simulado)'
      });
    }

    renderTab(tabName, [...items, ...nhsItems]);
  }

  // =====================
  // Funciones CRUD + Render
  // =====================
  async function loadTabData(tabName){
    content.innerHTML = '<p>Cargando...</p>';
    const colName = getColName(tabName);
    if(!colName) { content.innerHTML = '<p>Tab no soportada.</p>'; return; }

    try {
      const snapshot = await safeGetDocs(safeCollection(colName));
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

  // =====================
  // CRUD global functions
  // =====================
  window.eduVerDetalle = async function(tabName, id){
    const colName = getColName(tabName);
    if(!colName) return;
    try {
      const snap = await safeGetDoc(safeDoc(colName, id));
      if(!snap.exists()){ modalContent.innerHTML = "<p>No se encontró el documento.</p>"; modal.style.display='flex'; return; }
      const item = snap.data();
      let html = '';
      if(tabName==='enfermedades') html = `<h2>${item.nombre}</h2><p><strong>Descripción:</strong> ${item.descripcion||'N/D'}</p><p><strong>Síntomas:</strong> ${item.sintomas||'N/D'}</p><p><strong>Prevención:</strong> ${item.prevencion||'N/D'}</p><p><strong>Tratamiento:</strong> ${item.tratamiento||'N/D'}</p>`;
      if(tabName==='medicamentos') html = `<h2>${item.nombre}</h2><p><strong>Principio activo:</strong> ${item.principioActivo||'N/D'}</p><p><strong>Dosis:</strong> ${item.dosis||'N/D'}</p><p><strong>Efectos secundarios:</strong> ${item.efectosSecundarios||'N/D'}</p><p><strong>Contraindicaciones:</strong> ${item.contraindicaciones||'N/D'}</p>`;
      if(tabName==='protocolos') html = `<h2>${item.nombre}</h2><p><strong>Objetivo:</strong> ${item.objetivo||'N/D'}</p><p><strong>Procedimiento:</strong> ${item.procedimiento||'N/D'}</p><p><strong>Precauciones:</strong> ${item.precauciones||'N/D'}</p><p><strong>Referencias:</strong> ${item.referencias||'N/D'}</p>`;
      modalContent.innerHTML = html;
      modal.style.display='flex';
    } catch(e){ modalContent.innerHTML="<p>Error cargando detalle.</p>"; modal.style.display='flex'; console.error(e); }
  };

  window.eduEditar = async function(tabName,id){
    const colName = getColName(tabName); if(!colName) return;
    try{
      const snap = await safeGetDoc(safeDoc(colName,id));
      if(!snap.exists()){showToast("No existe el documento","error"); return;}
      showFormModal(tabName,{id,...snap.data()});
    }catch(e){showToast("Error cargando","error");}
  };

  window.eduEliminar = async function(tabName,id){
    if(!confirm("¿Seguro que deseas eliminar este elemento?")) return;
    const colName = getColName(tabName); if(!colName) return;
    try{await safeDeleteDoc(safeDoc(colName,id)); showToast("Eliminado correctamente"); await loadTabData(tabName);}catch(e){showToast("Error al eliminar","error");}
  };

  function getColName(tabName){return tabName==='enfermedades'?'enfermedades':tabName==='medicamentos'?'medicamentos':tabName==='protocolos'?'protocolos_enfermeria':tabName==='videos'?'videos_tutoriales':'';}

  function showFormModal(tabName,item){
    let fields=[];
    if(tabName==='enfermedades') fields=[{name:"nombre",label:"Nombre",type:"text"},{name:"descripcion",label:"Descripción",type:"textarea"},{name:"sintomas",label:"Síntomas",type:"textarea"},{name:"prevencion",label:"Prevención",type:"textarea"},{name:"tratamiento",label:"Tratamiento",type:"textarea"}];
    if(tabName==='medicamentos') fields=[{name:"nombre",label:"Nombre",type:"text"},{name:"principioActivo",label:"Principio Activo",type:"text"},{name:"dosis",label:"Dosis",type:"text"},{name:"efectosSecundarios",label:"Efectos Secundarios",type:"textarea"},{name:"contraindicaciones",label:"Contraindicaciones",type:"textarea"}];
    if(tabName==='protocolos') fields=[{name:"nombre",label:"Nombre",type:"text"},{name:"objetivo",label:"Objetivo",type:"textarea"},{name:"procedimiento",label:"Procedimiento",type:"textarea"},{name:"precauciones",label:"Precauciones",type:"textarea"},{name:"referencias",label:"Referencias",type:"textarea"}];
    if(tabName==='videos') fields=[{name:"titulo",label:"Título",type:"text"},{name:"url",label:"URL",type:"text"},{name:"categoria",label:"Categoría",type:"text"}];

    let html=`<form id="edu-form">${fields.map(f=>`<label>${f.label}</label>${f.type==='textarea'?`<textarea name="${f.name}">${item?.[f.name]||''}</textarea>`:`<input type="${f.type}" name="${f.name}" value="${item?.[f.name]||''}"/>`}`).join('')}<button type="submit">${item?'Guardar cambios':'Agregar'}</button></form>`;
    modalContent.innerHTML=html; modal.style.display='flex';
    document.getElementById('edu-form').onsubmit=async function(e){
      e.preventDefault(); let data={}; fields.forEach(f=>{data[f.name]=this[f.name].value;});
      const colName=getColName(tabName);
      try{if(item?.id){await safeSetDoc(safeDoc(colName,item.id),data);showToast("Actualizado correctamente");}else{await safeAddDoc(safeCollection(colName),data);showToast("Agregado correctamente");}
      modal.style.display='none'; await loadTabData(tabName);}catch(e){showToast("Error guardando","error");}
    };
  }

  // =====================
  // YouTube
  // =====================
  youtubeBtn.onclick=()=>{showYouTubeModal();};
  ytModalCloseBtn.onclick=()=>{ytModal.style.display='none'; ytModalContent.innerHTML='';};
  modalCloseBtn.onclick=()=>{modal.style.display='none'; modalContent.innerHTML='';};

  // Agregar botón functionality
  agregarBtn.onclick = () => {
    showFormModal(activeTab, null);
  };

  function showYouTubeModal(){
    ytModalContent.innerHTML=`<h3>Búsqueda de videos YouTube</h3><div><input type="text" id="youtube_query" placeholder="término de búsqueda" style="width:70%;"/><button id="youtube_buscar">Buscar</button></div><div id="youtube_results"></div>`;
    ytModal.style.display='flex';
    document.getElementById('youtube_buscar').onclick=async()=>{
      const q=document.getElementById('youtube_query').value.trim();
      if(!q) return; document.getElementById('youtube_results').innerHTML="<p>Buscando...</p>";
      const videos=await buscarVideosYT(q);
      if(videos.length===0){document.getElementById('youtube_results').innerHTML="<p>No se encontraron videos.</p>"; return;}
      document.getElementById('youtube_results').innerHTML=videos.map(v=>`<div style="margin:1em 0;padding:1em;border:1px solid #eee;border-radius:5px;"><h4>${v.titulo}</h4><a href="${v.url}" target="_blank">Ver video</a><button onclick="window.eduGuardarVideoYT('${v.titulo}','${v.url}')">Agregar al panel</button></div>`).join('');
    };
  }

  window.eduGuardarVideoYT=async function(titulo,url){
    try{
      await safeAddDoc(safeCollection('videos_tutoriales'),{titulo,url,categoria:'Tutorial'});
      showToast("Video agregado"); ytModal.style.display='none';
      await loadTabData('videos');
    }catch(e){showToast("Error agregando video","error");}
  };

  async function buscarVideosYT(query){
    // Mock YouTube search for demonstration
    return [
      {titulo: `Tutorial: ${query} - Parte 1`, url: `https://youtube.com/watch?v=demo1`},
      {titulo: `Guía práctica: ${query}`, url: `https://youtube.com/watch?v=demo2`},
      {titulo: `${query} - Procedimiento completo`, url: `https://youtube.com/watch?v=demo3`}
    ];
  }

  // =====================
  // NHS + traducción
  // =====================
  async function buscarNHS(term){
    // Mock NHS search for demonstration
    return {
      name: term,
      summary: `Información médica sobre ${term}`,
      symptoms: `Síntomas comunes de ${term}`,
      prevention: `Prevención de ${term}`,
      treatment: `Tratamiento para ${term}`
    };
  }

  async function traducirAlEspañol(texto){
    // Mock translation for demonstration
    return texto; // In real implementation, would use translation API
  }

  // =====================
  // Inicial carga
  // =====================
  loadTabData(activeTab);
}