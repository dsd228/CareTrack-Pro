import { db } from './firebase-mock.js';
// Mock Firebase functions for testing
const collection = (db, name) => ({ name });
const getDocs = async (collection) => ({ docs: [] });
const doc = (db, collection, id) => ({ collection, id });
const getDoc = async (docRef) => ({ exists: () => false, data: () => ({}) });
const setDoc = async (docRef, data) => console.log('Mock setDoc:', docRef, data);
const deleteDoc = async (docRef) => console.log('Mock deleteDoc:', docRef);
const addDoc = async (collection, data) => console.log('Mock addDoc:', collection, data);

import { showToast } from './toast.js';
import { buscarMedicamento, buscarWiki } from './api.js';

export function renderEducacion(container) {
  container.innerHTML = `
    <div class="panel-educacion">
      <div class="panel-header">
        <h2>Panel de Educación</h2>
        <div class="panel-actions">
          <button id="educacion_agregar" class="btn-primary">Agregar</button>
          <button id="educacion_youtube" class="btn-secondary" style="display:none;">YouTube</button>
        </div>
      </div>
      
      <div class="panel-search">
        <div class="search-group">
          <input type="text" id="educacion_busqueda" placeholder="Buscar información médica..." class="search-input">
          <button id="educacion_buscar" class="btn-search">Buscar</button>
        </div>
      </div>

      <div class="panel-tabs">
        <button class="tab-btn active" data-tab="enfermedades">Enfermedades</button>
        <button class="tab-btn" data-tab="medicamentos">Medicamentos</button>
        <button class="tab-btn" data-tab="protocolos">Protocolos</button>
        <button class="tab-btn" data-tab="videos">Videos</button>
      </div>

      <div class="panel-notes">
        <h3>Notas personales</h3>
        <textarea id="educacion_texto" placeholder="Escriba sus notas educativas aquí..." rows="4"></textarea>
        <div class="notes-actions">
          <button id="educacion_guardar" class="btn-save">Guardar notas</button>
          <button id="educacion_cargar" class="btn-load">Cargar notas</button>
        </div>
      </div>

      <div id="educacion-content" class="panel-content">
        <p>Seleccione una pestaña para ver contenido...</p>
      </div>
    </div>

    <!-- Modal para detalles/edición -->
    <div id="edu-modal" class="modal" style="display:none;">
      <div class="modal-content">
        <span id="edu-modal-close" class="modal-close">&times;</span>
        <div id="edu-modal-content"></div>
      </div>
    </div>

    <!-- Modal para YouTube -->
    <div id="youtube-modal" class="modal" style="display:none;">
      <div class="modal-content">
        <span id="youtube-modal-close" class="modal-close">&times;</span>
        <div id="youtube-modal-content"></div>
      </div>
    </div>
  `;
  
  // Inicializar la funcionalidad después de renderizar
  setTimeout(() => panelEducacionInit(), 100);
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
    content.innerHTML = '<p>Buscando...</p>';
    const tabName = activeTab;
    const colName = getColName(tabName);
    if(!colName) return;

    // Firebase local data
    const snapshot = await getDocs(collection(db, colName));
    let items = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}))
                             .filter(i => Object.values(i).some(
                                 v => typeof v === 'string' && v.toLowerCase().includes(term)
                             ));

    let externalItems = [];

    // OpenFDA para medicamentos
    if(tabName === 'medicamentos'){
      const fdaData = await buscarMedicamento(term);
      if(fdaData) {
        const nombre = fdaData.brand_name?.[0] || fdaData.generic_name?.[0] || term;
        const descripcion = fdaData.description?.[0] || fdaData.purpose?.[0] || 'N/D';
        const dosisInfo = fdaData.dosage_and_administration?.[0] || 'N/D';
        const contraindicaciones = fdaData.contraindications?.[0] || 'N/D';
        
        externalItems.push({
          nombre: await traducirAlEspañol(nombre),
          principioActivo: fdaData.active_ingredient?.[0] ? await traducirAlEspañol(fdaData.active_ingredient[0]) : 'N/D',
          dosis: await traducirAlEspañol(dosisInfo),
          efectosSecundarios: fdaData.adverse_reactions?.[0] ? await traducirAlEspañol(fdaData.adverse_reactions[0]) : 'N/D',
          contraindicaciones: await traducirAlEspañol(contraindicaciones),
          fuente: 'OpenFDA'
        });
      }
    }

    // NHS para enfermedades y medicamentos
    if(tabName === 'enfermedades' || tabName === 'medicamentos'){
      const nhsData = await buscarNHS(term);
      if(nhsData) {
        const nombre = await traducirAlEspañol(nhsData.name || term);
        const resumen = await traducirAlEspañol(nhsData.summary || 'N/D');
        
        if(tabName === 'enfermedades') {
          externalItems.push({
            nombre,
            descripcion: resumen,
            sintomas: nhsData.symptoms ? await traducirAlEspañol(nhsData.symptoms) : 'N/D',
            prevencion: nhsData.prevention ? await traducirAlEspañol(nhsData.prevention) : 'N/D',
            tratamiento: nhsData.treatment ? await traducirAlEspañol(nhsData.treatment) : 'N/D',
            fuente: 'NHS'
          });
        } else if(tabName === 'medicamentos') {
          externalItems.push({
            nombre,
            principioActivo: 'N/D',
            dosis: 'N/D',
            efectosSecundarios: nhsData.side_effects ? await traducirAlEspañol(nhsData.side_effects) : 'N/D',
            contraindicaciones: nhsData.warnings ? await traducirAlEspañol(nhsData.warnings) : 'N/D',
            fuente: 'NHS'
          });
        }
      }
    }

    // Wikipedia como fuente adicional para enfermedades
    if(tabName === 'enfermedades'){
      const wikiData = await buscarWiki(term, 'es');
      if(wikiData && wikiData.extract) {
        externalItems.push({
          nombre: wikiData.title,
          descripcion: wikiData.extract,
          sintomas: 'Ver artículo completo',
          prevencion: 'Ver artículo completo',
          tratamiento: 'Ver artículo completo',
          fuente: 'Wikipedia'
        });
      }
    }

    renderTab(tabName, [...items, ...externalItems]);
  }

  // =====================
  // Funciones CRUD + Render
  // =====================
  async function loadTabData(tabName){
    content.innerHTML = '<p>Cargando...</p>';
    const colName = getColName(tabName);
    if(!colName) { content.innerHTML = '<p>Tab no soportada.</p>'; return; }

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
      const sourceTag = item.fuente ? `<span class="source-tag">${item.fuente}</span>` : '';
      const hasId = item.id && !item.fuente; // Solo mostrar botones CRUD para items locales
      
      if(tabName === 'enfermedades'){
        return `<div class="edu-card">
          <div class="card-header">
            <h3>${item.nombre}</h3>
            ${sourceTag}
          </div>
          <p><strong>Descripción:</strong> ${item.descripcion || 'N/D'}</p>
          <p><strong>Síntomas:</strong> ${item.sintomas || 'N/D'}</p>
          <p><strong>Prevención:</strong> ${item.prevencion || 'N/D'}</p>
          <p><strong>Tratamiento:</strong> ${item.tratamiento || 'N/D'}</p>
          <div class="edu-actions">
            ${hasId ? `
              <button onclick="window.eduVerDetalle('${tabName}','${item.id}')">Ver más</button>
              <button onclick="window.eduEditar('${tabName}','${item.id}')">Editar</button>
              <button onclick="window.eduEliminar('${tabName}','${item.id}')">Eliminar</button>
            ` : `
              <button onclick="window.eduGuardarExterno('${tabName}', ${JSON.stringify(item).replace(/"/g, '&quot;')})">Guardar localmente</button>
            `}
          </div>
        </div>`;
      }
      if(tabName === 'medicamentos'){
        return `<div class="edu-card">
          <div class="card-header">
            <h3>${item.nombre}</h3>
            ${sourceTag}
          </div>
          <p><strong>Principio activo:</strong> ${item.principioActivo || 'N/D'}</p>
          <p><strong>Dosis:</strong> ${item.dosis || 'N/D'}</p>
          <p><strong>Efectos secundarios:</strong> ${item.efectosSecundarios || 'N/D'}</p>
          <p><strong>Contraindicaciones:</strong> ${item.contraindicaciones || 'N/D'}</p>
          <div class="edu-actions">
            ${hasId ? `
              <button onclick="window.eduVerDetalle('${tabName}','${item.id}')">Ver más</button>
              <button onclick="window.eduEditar('${tabName}','${item.id}')">Editar</button>
              <button onclick="window.eduEliminar('${tabName}','${item.id}')">Eliminar</button>
            ` : `
              <button onclick="window.eduGuardarExterno('${tabName}', ${JSON.stringify(item).replace(/"/g, '&quot;')})">Guardar localmente</button>
            `}
          </div>
        </div>`;
      }
      if(tabName === 'protocolos'){
        return `<div class="edu-card">
          <div class="card-header">
            <h3>${item.nombre}</h3>
            ${sourceTag}
          </div>
          <p><strong>Objetivo:</strong> ${item.objetivo || 'N/D'}</p>
          <p><strong>Procedimiento:</strong> ${item.procedimiento || 'N/D'}</p>
          <p><strong>Precauciones:</strong> ${item.precauciones || 'N/D'}</p>
          <p><strong>Referencias:</strong> ${item.referencias || 'N/D'}</p>
          <div class="edu-actions">
            ${hasId ? `
              <button onclick="window.eduVerDetalle('${tabName}','${item.id}')">Ver más</button>
              <button onclick="window.eduEditar('${tabName}','${item.id}')">Editar</button>
              <button onclick="window.eduEliminar('${tabName}','${item.id}')">Eliminar</button>
            ` : ''}
          </div>
        </div>`;
      }
      if(tabName === 'videos'){
        return `<div class="edu-card">
          <div class="card-header">
            <h3>${item.titulo}</h3>
            ${sourceTag}
          </div>
          <p><strong>Categoría:</strong> ${item.categoria || 'N/D'}</p>
          <a href="${item.url}" target="_blank" style="color:#1976d2;">Ver video</a>
          <div class="edu-actions">
            ${hasId ? `
              <button onclick="window.eduEditar('${tabName}','${item.id}')">Editar</button>
              <button onclick="window.eduEliminar('${tabName}','${item.id}')">Eliminar</button>
            ` : ''}
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
      const snap = await getDoc(doc(db, colName, id));
      if(!snap.exists()){ modalContent.innerHTML = "<p>No se encontró el documento.</p>"; modal.style.display='flex'; return; }
      const item = snap.data();
      let html = '';
      if(tabName==='enfermedades') html = `<h2>${item.nombre}</h2><p><strong>Descripción:</strong>${item.descripcion||'N/D'}</p><p><strong>Síntomas:</strong>${item.sintomas||'N/D'}</p><p><strong>Prevención:</strong>${item.prevencion||'N/D'}</p><p><strong>Tratamiento:</strong>${item.tratamiento||'N/D'}</p>`;
      if(tabName==='medicamentos') html = `<h2>${item.nombre}</h2><p><strong>Principio activo:</strong>${item.principioActivo||'N/D'}</p><p><strong>Dosis:</strong>${item.dosis||'N/D'}</p><p><strong>Efectos secundarios:</strong>${item.efectosSecundarios||'N/D'}</p><p><strong>Contraindicaciones:</strong>${item.contraindicaciones||'N/D'}</p>`;
      if(tabName==='protocolos') html = `<h2>${item.nombre}</h2><p><strong>Objetivo:</strong>${item.objetivo||'N/D'}</p><p><strong>Procedimiento:</strong>${item.procedimiento||'N/D'}</p><p><strong>Precauciones:</strong>${item.precauciones||'N/D'}</p><p><strong>Referencias:</strong>${item.referencias||'N/D'}</p>`;
      modalContent.innerHTML = html;
      modal.style.display='flex';
    } catch(e){ modalContent.innerHTML="<p>Error cargando detalle.</p>"; modal.style.display='flex'; console.error(e); }
  };

  window.eduEditar = async function(tabName,id){
    const colName = getColName(tabName); if(!colName) return;
    try{
      const snap = await getDoc(doc(db,colName,id));
      if(!snap.exists()){showToast("No existe el documento","error"); return;}
      showFormModal(tabName,{id,...snap.data()});
    }catch(e){showToast("Error cargando","error");}
  };

  window.eduGuardarExterno = async function(tabName, itemData) {
    const colName = getColName(tabName);
    if(!colName) return;
    
    try {
      // Remover campos que no necesitamos guardar localmente
      const { fuente, ...dataToSave } = itemData;
      await addDoc(collection(db, colName), dataToSave);
      showToast('Información guardada localmente');
      await loadTabData(tabName);
    } catch(e) {
      showToast('Error guardando información', 'error');
      console.error(e);
    }
  };

  window.eduEliminar = async function(tabName,id){
    if(!confirm("¿Seguro que deseas eliminar este elemento?")) return;
    const colName = getColName(tabName); if(!colName) return;
    try{await deleteDoc(doc(db,colName,id)); showToast("Eliminado correctamente"); await loadTabData(tabName);}catch(e){showToast("Error al eliminar","error");}
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
      try{if(item?.id){await setDoc(doc(db,colName,item.id),data);showToast("Actualizado correctamente");}else{await addDoc(collection(db,colName),data);showToast("Agregado correctamente");}
      modal.style.display='none'; await loadTabData(tabName);}catch(e){showToast("Error guardando","error");}
    };
  }

  // =====================
  // YouTube
  // =====================
  youtubeBtn.onclick=()=>{showYouTubeModal();};
  ytModalCloseBtn.onclick=()=>{ytModal.style.display='none'; ytModalContent.innerHTML='';};
  modalCloseBtn.onclick=()=>{modal.style.display='none'; modalContent.innerHTML='';};

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
      await addDoc(collection(db,'videos_tutoriales'),{titulo,url,categoria:'Tutorial'});
      showToast("Video agregado"); ytModal.style.display='none';
      await loadTabData('videos');
    }catch(e){showToast("Error agregando video","error");}
  };

  async function buscarVideosYT(query){
    try {
      // YouTube API Key would need to be configured properly
      // For now, return mock data or show appropriate message
      showToast('YouTube API requiere configuración de clave API', 'warning');
      return [
        {
          titulo: `Tutorial: ${query} (Demo)`,
          url: `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`
        }
      ];
    } catch(e) {
      console.error("Error YouTube", e);
      return [];
    }
  }

  // =====================
  // NHS + traducción
  // =====================
  async function buscarNHS(term){
    const apiKey='cb536e23-13a3-478b-ac7e-ce39112447da';
    const url=`https://api.nhs.uk/conditions/${encodeURIComponent(term)}`;
    try{const res=await fetch(url,{headers:{'Content-Type':'application/json','apikey':apiKey}}); if(!res.ok) return null; return await res.json();}catch(e){console.error("Error NHS:",e); return null;}
  }

  async function traducirAlEspañol(texto){
    if (!texto || typeof texto !== 'string') return texto;
    
    try {
      // Try LibreTranslate first (would need proper setup)
      // For now, use MyMemory as the primary translation service
      const res = await fetch('https://api.mymemory.translated.net/get?q=' + encodeURIComponent(texto) + '&langpair=en|es');
      const data = await res.json();
      return data.responseData.translatedText || texto;
    } catch(e) {
      console.error("Error traduciendo:", e);
      return texto;
    }
  }

  // =====================
  // Inicial carga
  // =====================
  loadTabData(activeTab);
}
