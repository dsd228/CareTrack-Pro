import { db } from './firebase.js';
import { collection, getDocs, doc, getDoc, setDoc, deleteDoc, addDoc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import { showToast } from './toast.js';
import { buscarMedicamento, buscarNHS, traducirAlEspañol } from './api.js';

/**
 * Renderiza la interfaz del módulo de educación
 * @param {HTMLElement} mainContent - Contenedor principal donde se renderiza
 */
export function renderEducacion(mainContent) {
  mainContent.innerHTML = `
    <div class="spa-panel">
      <h2>🎓 Educación y Búsqueda de Información Médica</h2>
      
      <!-- Búsqueda -->
      <div class="form-row">
        <label>Buscar enfermedad o medicamento:
          <input type="search" id="educacion_busqueda" placeholder="Ej: diabetes, ibuprofeno, hipertensión..." />
        </label>
        <button type="button" id="educacion_buscar" style="padding: 0.8rem 1.5rem; background: var(--color-primary); color: #fff; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">🔍 Buscar</button>
      </div>

      <!-- Tabs de contenido -->
      <div style="display: flex; gap: 1rem; margin: 1.5rem 0; border-bottom: 2px solid var(--color-border);">
        <button class="tab-btn active" data-tab="enfermedades" style="padding: 0.8rem 1.2rem; border: none; background: none; border-bottom: 3px solid var(--color-primary); color: var(--color-primary); font-weight: 600; cursor: pointer;">🏥 Enfermedades</button>
        <button class="tab-btn" data-tab="medicamentos" style="padding: 0.8rem 1.2rem; border: none; background: none; border-bottom: 3px solid transparent; color: var(--color-text); font-weight: 600; cursor: pointer;">💊 Medicamentos</button>
        <button class="tab-btn" data-tab="protocolos" style="padding: 0.8rem 1.2rem; border: none; background: none; border-bottom: 3px solid transparent; color: var(--color-text); font-weight: 600; cursor: pointer;">📋 Protocolos</button>
        <button class="tab-btn" data-tab="videos" style="padding: 0.8rem 1.2rem; border: none; background: none; border-bottom: 3px solid transparent; color: var(--color-text); font-weight: 600; cursor: pointer;">🎥 Videos</button>
      </div>

      <!-- Botones de acción -->
      <div style="display: flex; gap: 1rem; margin: 1rem 0;">
        <button id="educacion_agregar" style="padding: 0.6rem 1.2rem; background: var(--color-accent); color: #fff; border: none; border-radius: 6px; font-weight: 500; cursor: pointer;">➕ Agregar</button>
        <button id="educacion_youtube" style="padding: 0.6rem 1.2rem; background: #ff0000; color: #fff; border: none; border-radius: 6px; font-weight: 500; cursor: pointer; display: none;">📺 YouTube</button>
      </div>

      <!-- Contenido de tabs -->
      <div id="educacion-content">
        <p>Selecciona una categoría y busca información médica. Los resultados incluirán datos de OpenFDA, NHS y fuentes locales.</p>
      </div>

      <!-- Notas personalizadas -->
      <div style="margin-top: 2rem; padding: 1.5rem; background: var(--color-gray); border-radius: 10px; border: 1px solid var(--color-border);">
        <h3>📝 Notas Personalizadas de Educación</h3>
        <textarea id="educacion_texto" rows="4" style="width: 100%; padding: 0.8rem; border: 1px solid var(--color-border); border-radius: 6px; resize: vertical;" placeholder="Agrega tus notas y observaciones sobre educación médica..."></textarea>
        <div style="display: flex; gap: 1rem; margin-top: 1rem;">
          <button id="educacion_guardar" style="padding: 0.6rem 1.2rem; background: var(--color-primary); color: #fff; border: none; border-radius: 6px; font-weight: 500; cursor: pointer;">💾 Guardar</button>
          <button id="educacion_cargar" style="padding: 0.6rem 1.2rem; background: var(--color-accent); color: #fff; border: none; border-radius: 6px; font-weight: 500; cursor: pointer;">📂 Cargar</button>
        </div>
      </div>
    </div>

    <!-- Modal para agregar/editar -->
    <div id="edu-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); align-items: center; justify-content: center; z-index: 1000;">
      <div style="background: #fff; padding: 2rem; border-radius: 10px; max-width: 600px; width: 90%; max-height: 80%; overflow-y: auto;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
          <h3>Agregar/Editar Contenido</h3>
          <button id="edu-modal-close" style="background: none; border: none; font-size: 1.5rem; cursor: pointer;">&times;</button>
        </div>
        <div id="edu-modal-content"></div>
      </div>
    </div>

    <!-- Modal para YouTube -->
    <div id="youtube-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); align-items: center; justify-content: center; z-index: 1000;">
      <div style="background: #fff; padding: 2rem; border-radius: 10px; max-width: 800px; width: 90%; max-height: 80%; overflow-y: auto;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
          <h3>Buscar Videos Educativos</h3>
          <button id="youtube-modal-close" style="background: none; border: none; font-size: 1.5rem; cursor: pointer;">&times;</button>
        </div>
        <div id="youtube-modal-content"></div>
      </div>
    </div>
  `;
  
  // Inicializar funcionalidad después de renderizar
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
    const tabName = activeTab;
    const colName = getColName(tabName);
    if(!colName) return;

    content.innerHTML = '<p>Buscando en múltiples fuentes...</p>';

    // Firebase - datos locales
    const snapshot = await getDocs(collection(db, colName));
    let items = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}))
                             .filter(i => Object.values(i).some(
                                 v => typeof v === 'string' && v.toLowerCase().includes(term)
                             ));

    // Búsqueda en APIs externas y combinación de resultados
    let externalItems = [];
    
    if(tabName === 'enfermedades') {
      // Buscar en NHS para enfermedades
      const nhsData = await buscarNHS(term);
      if(nhsData) {
        const nombre = await traducirAlEspañol(nhsData.name || term);
        const resumen = await traducirAlEspañol(nhsData.summary || 'N/D');
        externalItems.push({
          id: `nhs_${term}`,
          nombre,
          descripcion: resumen,
          sintomas: nhsData.symptoms ? await traducirAlEspañol(nhsData.symptoms) : 'N/D',
          prevencion: nhsData.prevention ? await traducirAlEspañol(nhsData.prevention) : 'N/D',
          tratamiento: nhsData.treatment ? await traducirAlEspañol(nhsData.treatment) : 'N/D',
          fuente: 'NHS API',
          esExterno: true
        });
      }
    }
    
    if(tabName === 'medicamentos') {
      // Buscar en OpenFDA para medicamentos
      const fdaData = await buscarMedicamento(term);
      if(fdaData) {
        const nombre = fdaData.openfda?.brand_name?.[0] || fdaData.openfda?.generic_name?.[0] || term;
        const principioActivo = fdaData.openfda?.substance_name?.join(', ') || 'N/D';
        const fabricante = fdaData.openfda?.manufacturer_name?.[0] || 'N/D';
        
        externalItems.push({
          id: `fda_${term}`,
          nombre: await traducirAlEspañol(nombre),
          principioActivo: await traducirAlEspañol(principioActivo),
          dosis: fdaData.dosage_and_administration ? await traducirAlEspañol(fdaData.dosage_and_administration[0]) : 'N/D',
          efectosSecundarios: fdaData.adverse_reactions ? await traducirAlEspañol(fdaData.adverse_reactions[0]) : 'N/D',
          contraindicaciones: fdaData.contraindications ? await traducirAlEspañol(fdaData.contraindications[0]) : 'N/D',
          fabricante: await traducirAlEspañol(fabricante),
          fuente: 'OpenFDA',
          esExterno: true
        });
      }

      // También buscar en NHS para medicamentos (información adicional)
      const nhsData = await buscarNHS(term);
      if(nhsData) {
        const nombre = await traducirAlEspañol(nhsData.name || term);
        externalItems.push({
          id: `nhs_med_${term}`,
          nombre,
          principioActivo: 'Ver descripción',
          dosis: 'Consultar con profesional de salud',
          efectosSecundarios: nhsData.symptoms ? await traducirAlEspañol(nhsData.symptoms) : 'N/D',
          contraindicaciones: 'Consultar información médica',
          descripcion: nhsData.summary ? await traducirAlEspañol(nhsData.summary) : 'N/D',
          fuente: 'NHS API',
          esExterno: true
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
      content.innerHTML = '<p>No hay información disponible. Intenta con otro término de búsqueda.</p>';
      return;
    }
    const html = items.map(item => {
      // Identificar si es resultado externo para mostrar fuente
      const fuenteIndicator = item.esExterno ? `<div class="fuente-externa">📡 ${item.fuente}</div>` : '';
      const actionButtons = item.esExterno ? '' : `
        <div class="edu-actions">
          <button onclick="window.eduVerDetalle('${tabName}','${item.id}')">Ver más</button>
          <button onclick="window.eduEditar('${tabName}','${item.id}')">Editar</button>
          <button onclick="window.eduEliminar('${tabName}','${item.id}')">Eliminar</button>
        </div>`;

      if(tabName === 'enfermedades'){
        return `<div class="edu-card ${item.esExterno ? 'externa' : ''}">
          ${fuenteIndicator}
          <h3>${item.nombre}</h3>
          <p><strong>Descripción:</strong> ${item.descripcion || 'N/D'}</p>
          <p><strong>Síntomas:</strong> ${item.sintomas || 'N/D'}</p>
          <p><strong>Prevención:</strong> ${item.prevencion || 'N/D'}</p>
          <p><strong>Tratamiento:</strong> ${item.tratamiento || 'N/D'}</p>
          ${actionButtons}
        </div>`;
      }
      if(tabName === 'medicamentos'){
        return `<div class="edu-card ${item.esExterno ? 'externa' : ''}">
          ${fuenteIndicator}
          <h3>${item.nombre}</h3>
          <p><strong>Principio activo:</strong> ${item.principioActivo || 'N/D'}</p>
          <p><strong>Dosis:</strong> ${item.dosis || 'N/D'}</p>
          <p><strong>Efectos secundarios:</strong> ${item.efectosSecundarios || 'N/D'}</p>
          <p><strong>Contraindicaciones:</strong> ${item.contraindicaciones || 'N/D'}</p>
          ${item.fabricante ? `<p><strong>Fabricante:</strong> ${item.fabricante}</p>` : ''}
          ${item.descripcion ? `<p><strong>Información adicional:</strong> ${item.descripcion}</p>` : ''}
          ${actionButtons}
        </div>`;
      }
      if(tabName === 'protocolos'){
        return `<div class="edu-card ${item.esExterno ? 'externa' : ''}">
          ${fuenteIndicator}
          <h3>${item.nombre}</h3>
          <p><strong>Objetivo:</strong> ${item.objetivo || 'N/D'}</p>
          <p><strong>Procedimiento:</strong> ${item.procedimiento || 'N/D'}</p>
          <p><strong>Precauciones:</strong> ${item.precauciones || 'N/D'}</p>
          <p><strong>Referencias:</strong> ${item.referencias || 'N/D'}</p>
          ${actionButtons}
        </div>`;
      }
      if(tabName === 'videos'){
        return `<div class="edu-card ${item.esExterno ? 'externa' : ''}">
          ${fuenteIndicator}
          <h3>${item.titulo}</h3>
          <p><strong>Categoría:</strong> ${item.categoria || 'N/D'}</p>
          <a href="${item.url}" target="_blank" style="color:#1976d2;">Ver video</a>
          ${actionButtons}
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
    try{
      const apiKey="TU_API_KEY_YOUTUBE";
      const res=await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&key=${apiKey}&type=video&maxResults=5`);
      const data=await res.json();
      return data.items.map(i=>({titulo:i.snippet.title,url:`https://www.youtube.com/watch?v=${i.id.videoId}`}));
    }catch(e){console.error("Error YouTube",e); return [];}
  }

  // =====================
  // API Configuration and Extensions Documentation
  // =====================
  
  /*
   * CONFIGURACIÓN DE APIs Y EXTENSIBILIDAD
   * 
   * Para agregar nuevas APIs o modificar las existentes:
   * 
   * 1. CLAVES API:
   *    - OpenFDA: Modificar OPENFDA_API_KEY en api.js
   *    - NHS: Modificar NHS_API_KEY en api.js
   *    - LibreTranslate: Puede requerir instancia propia para producción
   * 
   * 2. AGREGAR NUEVA API:
   *    - Crear función en api.js siguiendo el patrón existente
   *    - Importar función en este archivo
   *    - Agregar lógica de búsqueda en searchTerm()
   *    - Actualizar renderTab() para mostrar nuevos campos
   * 
   * 3. EXTENDER FUNCIONALIDAD:
   *    - Para nuevos tipos de contenido: agregar en getColName()
   *    - Para nuevos campos: actualizar showFormModal()
   *    - Para nueva traducción: modificar traducirAlEspañol() en api.js
   * 
   * 4. EJEMPLOS DE EXTENSIÓN:
   *    - PubMed API para artículos científicos
   *    - DrugBank para información detallada de medicamentos
   *    - ICD-10 API para códigos de diagnóstico
   */

  // =====================
  // Inicial carga
  // =====================
  loadTabData(activeTab);
}
