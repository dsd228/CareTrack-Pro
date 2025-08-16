import { db } from './firebase.js';
import { collection, getDocs, doc, getDoc, setDoc, deleteDoc, addDoc } from "./firebase-mock.js";
import { showToast } from './toast.js';

export function panelAlergias() {
  return `
  <section class="spa-panel">
    <h2>Alergias</h2>
    
    <!-- Controles de acción -->
    <div class="form-row">
      <button id="alergias_agregar" class="btn-primary">Agregar Alergia</button>
      <button id="alergias_buscar" class="btn-secondary">Buscar</button>
      <input type="search" id="alergias_busqueda" placeholder="Buscar por alérgeno o síntomas..." />
    </div>
    
    <!-- Lista de alergias -->
    <div id="alergias-content">
      <p>Cargando alergias...</p>
    </div>
    
    <!-- Modal para agregar/editar -->
    <div id="alergias-modal" class="modal" style="display:none;">
      <div class="modal-content">
        <span id="alergias-modal-close" class="close">&times;</span>
        <div id="alergias-modal-content">
          <h3 id="alergias-modal-title">Nueva Alergia</h3>
          <form id="alergias-form">
            <div class="form-row">
              <label for="alergias_alergeno">
                Alérgeno <span style="color: red;">*</span><br>
                <small>Sustancia que causa la reacción alérgica</small>
              </label>
              <input type="text" id="alergias_alergeno" required placeholder="Ej: Polen, Penicilina, Mariscos..." />
            </div>
            <div class="form-row">
              <label for="alergias_tipo">
                Tipo de Alergia<br>
                <small>Clasificación de la alergia</small>
              </label>
              <select id="alergias_tipo">
                <option value="">Seleccionar tipo</option>
                <option value="alimentaria">Alimentaria</option>
                <option value="medicamentosa">Medicamentosa</option>
                <option value="ambiental">Ambiental</option>
                <option value="contacto">Por contacto</option>
                <option value="insectos">Picaduras de insectos</option>
                <option value="latex">Látex</option>
                <option value="otra">Otra</option>
              </select>
            </div>
            <div class="form-row">
              <label for="alergias_severidad">
                Severidad<br>
                <small>Gravedad de la reacción alérgica</small>
              </label>
              <select id="alergias_severidad">
                <option value="">Seleccionar severidad</option>
                <option value="leve">Leve</option>
                <option value="moderada">Moderada</option>
                <option value="grave">Grave</option>
                <option value="anafilaxia">Anafilaxia</option>
              </select>
            </div>
            <div class="form-row">
              <label for="alergias_sintomas">
                Síntomas/Reacciones<br>
                <small>Describe los síntomas que presenta el paciente</small>
              </label>
              <textarea id="alergias_sintomas" placeholder="Ej: Urticaria, dificultad respiratoria, hinchazón..."></textarea>
            </div>
            <div class="form-row">
              <label for="alergias_fecha_descubrimiento">
                Fecha de Descubrimiento<br>
                <small>Cuando se identificó esta alergia</small>
              </label>
              <input type="date" id="alergias_fecha_descubrimiento" />
            </div>
            <div class="form-row">
              <label for="alergias_tratamiento">
                Tratamiento/Manejo<br>
                <small>Medicamentos o medidas para tratar la reacción</small>
              </label>
              <textarea id="alergias_tratamiento" placeholder="Ej: Antihistamínicos, EpiPen, evitar exposición..."></textarea>
            </div>
            <div class="form-row">
              <label for="alergias_notas">
                Notas Adicionales<br>
                <small>Información adicional relevante</small>
              </label>
              <textarea id="alergias_notas" placeholder="Otras observaciones importantes..."></textarea>
            </div>
            <div class="form-actions">
              <button type="submit" id="alergias_guardar_modal">Guardar</button>
              <button type="button" id="alergias_cancelar">Cancelar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
  `;
}

export function panelAlergiasInit() {
  const content = document.getElementById('alergias-content');
  const agregarBtn = document.getElementById('alergias_agregar');
  const buscarBtn = document.getElementById('alergias_buscar');
  const busqueda = document.getElementById('alergias_busqueda');
  const modal = document.getElementById('alergias-modal');
  const modalContent = document.getElementById('alergias-modal-content');
  const modalCloseBtn = document.getElementById('alergias-modal-close');
  const modalTitle = document.getElementById('alergias-modal-title');
  const form = document.getElementById('alergias-form');
  
  let editingId = null;

  // Cargar datos iniciales
  loadAlergiasData();

  // Event listeners
  agregarBtn.onclick = () => showAlergiasModal();
  buscarBtn.onclick = () => searchAlergias();
  modalCloseBtn.onclick = () => closeModal();
  form.onsubmit = (e) => {
    e.preventDefault();
    saveAlergia();
  };
  document.getElementById('alergias_cancelar').onclick = () => closeModal();

  // Funciones CRUD
  async function loadAlergiasData() {
    content.innerHTML = '<p>Cargando...</p>';
    try {
      const snapshot = await getDocs(collection(db, 'alergias_registros'));
      const alergias = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
      renderAlergiasList(alergias);
    } catch(e) {
      content.innerHTML = '<p>Error cargando datos.</p>';
      console.error(e);
    }
  }

  function renderAlergiasList(alergias) {
    if (alergias.length === 0) {
      content.innerHTML = '<p>No hay alergias registradas. <button onclick="document.getElementById(\'alergias_agregar\').click()">Agregar la primera</button></p>';
      return;
    }

    // Ordenar por severidad y fecha
    alergias.sort((a, b) => {
      const severidades = { 'anafilaxia': 4, 'grave': 3, 'moderada': 2, 'leve': 1, '': 0 };
      const severidadA = severidades[a.severidad] || 0;
      const severidadB = severidades[b.severidad] || 0;
      if (severidadA !== severidadB) return severidadB - severidadA;
      return new Date(b.fecha_descubrimiento || 0) - new Date(a.fecha_descubrimiento || 0);
    });

    const html = alergias.map(alergia => {
      const severidadClass = {
        'anafilaxia': 'severity-critical',
        'grave': 'severity-high', 
        'moderada': 'severity-medium',
        'leve': 'severity-low'
      }[alergia.severidad] || '';

      return `
      <div class="alergias-card ${severidadClass}">
        <div class="card-header">
          <h3>${alergia.alergeno}</h3>
          <div class="card-actions">
            <button onclick="window.alergiasVerDetalle('${alergia.id}')" class="btn-view">Ver</button>
            <button onclick="window.alergiasEditar('${alergia.id}')" class="btn-edit">Editar</button>
            <button onclick="window.alergiasEliminar('${alergia.id}')" class="btn-delete">Eliminar</button>
          </div>
        </div>
        <div class="card-content">
          <div class="alergia-summary">
            ${alergia.tipo ? `<span class="alergia-tipo">${alergia.tipo}</span>` : ''}
            ${alergia.severidad ? `<span class="alergia-severidad ${severidadClass}">${alergia.severidad.toUpperCase()}</span>` : ''}
          </div>
          ${alergia.sintomas ? `<p class="sintomas"><strong>Síntomas:</strong> ${alergia.sintomas.slice(0, 100)}${alergia.sintomas.length > 100 ? '...' : ''}</p>` : ''}
          ${alergia.fecha_descubrimiento ? `<p class="fecha"><strong>Descubierta:</strong> ${new Date(alergia.fecha_descubrimiento).toLocaleDateString()}</p>` : ''}
        </div>
      </div>
    `;
    }).join('');

    content.innerHTML = html;
  }

  function showAlergiasModal(alergia = null) {
    editingId = alergia ? alergia.id : null;
    modalTitle.textContent = editingId ? 'Editar Alergia' : 'Nueva Alergia';
    
    // Limpiar o llenar formulario
    if (alergia) {
      document.getElementById('alergias_alergeno').value = alergia.alergeno || '';
      document.getElementById('alergias_tipo').value = alergia.tipo || '';
      document.getElementById('alergias_severidad').value = alergia.severidad || '';
      document.getElementById('alergias_sintomas').value = alergia.sintomas || '';
      document.getElementById('alergias_fecha_descubrimiento').value = alergia.fecha_descubrimiento || '';
      document.getElementById('alergias_tratamiento').value = alergia.tratamiento || '';
      document.getElementById('alergias_notas').value = alergia.notas || '';
    } else {
      form.reset();
    }
    
    modal.style.display = 'flex';
  }

  function closeModal() {
    modal.style.display = 'none';
    editingId = null;
  }

  async function saveAlergia() {
    const alergeno = document.getElementById('alergias_alergeno').value.trim();
    if (!alergeno) {
      showToast('El alérgeno es obligatorio', 'error');
      return;
    }

    const data = {
      alergeno: alergeno,
      tipo: document.getElementById('alergias_tipo').value,
      severidad: document.getElementById('alergias_severidad').value,
      sintomas: document.getElementById('alergias_sintomas').value,
      fecha_descubrimiento: document.getElementById('alergias_fecha_descubrimiento').value,
      tratamiento: document.getElementById('alergias_tratamiento').value,
      notas: document.getElementById('alergias_notas').value,
      updated: new Date().toISOString()
    };

    try {
      if (editingId) {
        await setDoc(doc(db, 'alergias_registros', editingId), data);
        showToast('Alergia actualizada');
      } else {
        await addDoc(collection(db, 'alergias_registros'), data);
        showToast('Alergia guardada');
      }
      closeModal();
      await loadAlergiasData();
    } catch(e) {
      showToast('Error al guardar', 'error');
      console.error(e);
    }
  }

  async function searchAlergias() {
    const term = busqueda.value.trim().toLowerCase();
    if (!term) {
      await loadAlergiasData();
      return;
    }

    try {
      const snapshot = await getDocs(collection(db, 'alergias_registros'));
      const alergias = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}))
        .filter(alergia => 
          alergia.alergeno?.toLowerCase().includes(term) ||
          alergia.sintomas?.toLowerCase().includes(term) ||
          alergia.tipo?.toLowerCase().includes(term) ||
          alergia.tratamiento?.toLowerCase().includes(term)
        );
      renderAlergiasList(alergias);
    } catch(e) {
      console.error(e);
    }
  }

  // Funciones globales para los botones
  window.alergiasVerDetalle = async function(id) {
    try {
      const snap = await getDoc(doc(db, 'alergias_registros', id));
      if (snap.exists()) {
        const alergia = snap.data();
        const html = `
          <h3>Alergia: ${alergia.alergeno}</h3>
          <div class="detalle-alergia">
            <p><strong>Tipo:</strong> ${alergia.tipo || 'N/D'}</p>
            <p><strong>Severidad:</strong> ${alergia.severidad || 'N/D'}</p>
            <p><strong>Síntomas:</strong> ${alergia.sintomas || 'N/D'}</p>
            <p><strong>Fecha de Descubrimiento:</strong> ${alergia.fecha_descubrimiento ? new Date(alergia.fecha_descubrimiento).toLocaleDateString() : 'N/D'}</p>
            <p><strong>Tratamiento:</strong> ${alergia.tratamiento || 'N/D'}</p>
            <p><strong>Notas:</strong> ${alergia.notas || 'Ninguna'}</p>
          </div>
        `;
        modalTitle.textContent = 'Detalle de la Alergia';
        modalContent.innerHTML = html + '<button onclick="document.getElementById(\'alergias-modal-close\').click()">Cerrar</button>';
        modal.style.display = 'flex';
      }
    } catch(e) {
      showToast('Error cargando detalle', 'error');
      console.error(e);
    }
  };

  window.alergiasEditar = async function(id) {
    try {
      const snap = await getDoc(doc(db, 'alergias_registros', id));
      if (snap.exists()) {
        showAlergiasModal({id, ...snap.data()});
      }
    } catch(e) {
      showToast('Error cargando alergia', 'error');
      console.error(e);
    }
  };

  window.alergiasEliminar = async function(id) {
    if (!confirm('¿Seguro que deseas eliminar esta alergia?')) return;
    try {
      await deleteDoc(doc(db, 'alergias_registros', id));
      showToast('Alergia eliminada');
      await loadAlergiasData();
    } catch(e) {
      showToast('Error al eliminar', 'error');
      console.error(e);
    }
  };
}

// ✅ Esta función es la que usa main.js
export function renderAlergias(container) {
  container.innerHTML = panelAlergias();
  panelAlergiasInit();
}