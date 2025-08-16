import { db } from './firebase.js';
import { collection, getDocs, doc, getDoc, setDoc, deleteDoc, addDoc } from "./firebase-mock.js";
import { showToast } from './toast.js';

export function panelSignos() {
  return `
  <section class="spa-panel">
    <h2>Signos Vitales</h2>
    
    <!-- Controles de acción -->
    <div class="form-row">
      <button id="signos_agregar" class="btn-primary">Agregar Registro</button>
      <button id="signos_buscar" class="btn-secondary">Buscar</button>
      <input type="search" id="signos_busqueda" placeholder="Buscar por fecha o valores..." />
    </div>
    
    <!-- Lista de registros -->
    <div id="signos-content">
      <p>Cargando registros...</p>
    </div>
    
    <!-- Modal para agregar/editar -->
    <div id="signos-modal" class="modal" style="display:none;">
      <div class="modal-content">
        <span id="signos-modal-close" class="close">&times;</span>
        <div id="signos-modal-content">
          <h3 id="signos-modal-title">Nuevo Registro de Signos Vitales</h3>
          <form id="signos-form">
            <div class="form-row">
              <label for="signos_fecha">Fecha y Hora</label>
              <input type="datetime-local" id="signos_fecha" required />
            </div>
            <div class="form-row">
              <label for="signos_temp">
                Temperatura corporal (°C)<br>
                <small>Mide el equilibrio entre la producción y pérdida de calor del cuerpo.</small>
              </label>
              <input type="number" step="0.1" id="signos_temp" placeholder="36.5" />
            </div>
            <div class="form-row">
              <label for="signos_fc">
                Frecuencia cardíaca (latidos/min)<br>
                <small>Número de latidos por minuto.</small>
              </label>
              <input type="number" id="signos_fc" placeholder="72" />
            </div>
            <div class="form-row">
              <label for="signos_fr">
                Frecuencia respiratoria (resp/min)<br>
                <small>Número de respiraciones por minuto.</small>
              </label>
              <input type="number" id="signos_fr" placeholder="16" />
            </div>
            <div class="form-row">
              <label for="signos_presion">
                Presión arterial (mmHg)<br>
                <small>Fuerza que ejerce la sangre contra las paredes de las arterias.</small>
              </label>
              <input type="text" id="signos_presion" placeholder="120/80" />
            </div>
            <div class="form-row">
              <label for="signos_spo2">
                Saturación de oxígeno (%)<br>
                <small>Porcentaje de oxígeno en la sangre.</small>
              </label>
              <input type="number" step="0.1" min="0" max="100" id="signos_spo2" placeholder="98" />
            </div>
            <div class="form-row">
              <label for="signos_dolor">
                Dolor (escala 0-10)<br>
                <small>Escala de dolor subjetiva del paciente.</small>
              </label>
              <input type="number" min="0" max="10" id="signos_dolor" placeholder="0" />
            </div>
            <div class="form-row">
              <label for="signos_observaciones">
                Observaciones clínicas<br>
                <small>Notas adicionales sobre el estado del paciente.</small>
              </label>
              <textarea id="signos_observaciones" placeholder="Observaciones adicionales..."></textarea>
            </div>
            <div class="form-actions">
              <button type="submit" id="signos_guardar_modal">Guardar</button>
              <button type="button" id="signos_cancelar">Cancelar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
  `;
}

export function panelSignosInit() {
  const content = document.getElementById('signos-content');
  const agregarBtn = document.getElementById('signos_agregar');
  const buscarBtn = document.getElementById('signos_buscar');
  const busqueda = document.getElementById('signos_busqueda');
  const modal = document.getElementById('signos-modal');
  const modalContent = document.getElementById('signos-modal-content');
  const modalCloseBtn = document.getElementById('signos-modal-close');
  const modalTitle = document.getElementById('signos-modal-title');
  const form = document.getElementById('signos-form');
  
  let editingId = null;

  // Cargar datos iniciales
  loadSignosData();

  // Event listeners
  agregarBtn.onclick = () => showSignosModal();
  buscarBtn.onclick = () => searchSignos();
  modalCloseBtn.onclick = () => closeModal();
  form.onsubmit = (e) => {
    e.preventDefault();
    saveSignos();
  };
  document.getElementById('signos_cancelar').onclick = () => closeModal();

  // Funciones CRUD
  async function loadSignosData() {
    content.innerHTML = '<p>Cargando...</p>';
    try {
      const snapshot = await getDocs(collection(db, 'signos_registros'));
      const registros = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
      renderSignosList(registros);
    } catch(e) {
      content.innerHTML = '<p>Error cargando datos.</p>';
      console.error(e);
    }
  }

  function renderSignosList(registros) {
    if (registros.length === 0) {
      content.innerHTML = '<p>No hay registros de signos vitales. <button onclick="document.getElementById(\'signos_agregar\').click()">Agregar el primero</button></p>';
      return;
    }

    // Ordenar por fecha (más reciente primero)
    registros.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

    const html = registros.map(registro => `
      <div class="signos-card">
        <div class="card-header">
          <h3>${new Date(registro.fecha).toLocaleString()}</h3>
          <div class="card-actions">
            <button onclick="window.signosVerDetalle('${registro.id}')" class="btn-view">Ver</button>
            <button onclick="window.signosEditar('${registro.id}')" class="btn-edit">Editar</button>
            <button onclick="window.signosEliminar('${registro.id}')" class="btn-delete">Eliminar</button>
          </div>
        </div>
        <div class="card-content">
          <div class="vitals-summary">
            ${registro.temperatura ? `<span class="vital-item">T: ${registro.temperatura}°C</span>` : ''}
            ${registro.fc ? `<span class="vital-item">FC: ${registro.fc} lpm</span>` : ''}
            ${registro.fr ? `<span class="vital-item">FR: ${registro.fr} rpm</span>` : ''}
            ${registro.presion ? `<span class="vital-item">PA: ${registro.presion}</span>` : ''}
            ${registro.spo2 ? `<span class="vital-item">SpO₂: ${registro.spo2}%</span>` : ''}
            ${registro.dolor ? `<span class="vital-item">Dolor: ${registro.dolor}/10</span>` : ''}
          </div>
          ${registro.observaciones ? `<p class="observaciones"><strong>Obs:</strong> ${registro.observaciones}</p>` : ''}
        </div>
      </div>
    `).join('');

    content.innerHTML = html;
  }

  function showSignosModal(registro = null) {
    editingId = registro ? registro.id : null;
    modalTitle.textContent = editingId ? 'Editar Registro' : 'Nuevo Registro de Signos Vitales';
    
    // Limpiar o llenar formulario
    if (registro) {
      document.getElementById('signos_fecha').value = registro.fecha || '';
      document.getElementById('signos_temp').value = registro.temperatura || '';
      document.getElementById('signos_fc').value = registro.fc || '';
      document.getElementById('signos_fr').value = registro.fr || '';
      document.getElementById('signos_presion').value = registro.presion || '';
      document.getElementById('signos_spo2').value = registro.spo2 || '';
      document.getElementById('signos_dolor').value = registro.dolor || '';
      document.getElementById('signos_observaciones').value = registro.observaciones || '';
    } else {
      form.reset();
      // Establecer fecha actual por defecto
      const now = new Date();
      now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
      document.getElementById('signos_fecha').value = now.toISOString().slice(0, 16);
    }
    
    modal.style.display = 'flex';
  }

  function closeModal() {
    modal.style.display = 'none';
    editingId = null;
  }

  async function saveSignos() {
    const data = {
      fecha: document.getElementById('signos_fecha').value,
      temperatura: document.getElementById('signos_temp').value,
      fc: document.getElementById('signos_fc').value,
      fr: document.getElementById('signos_fr').value,
      presion: document.getElementById('signos_presion').value,
      spo2: document.getElementById('signos_spo2').value,
      dolor: document.getElementById('signos_dolor').value,
      observaciones: document.getElementById('signos_observaciones').value,
      updated: new Date().toISOString()
    };

    try {
      if (editingId) {
        await setDoc(doc(db, 'signos_registros', editingId), data);
        showToast('Registro actualizado');
      } else {
        await addDoc(collection(db, 'signos_registros'), data);
        showToast('Registro guardado');
      }
      closeModal();
      await loadSignosData();
    } catch(e) {
      showToast('Error al guardar', 'error');
      console.error(e);
    }
  }

  async function searchSignos() {
    const term = busqueda.value.trim().toLowerCase();
    if (!term) {
      await loadSignosData();
      return;
    }

    try {
      const snapshot = await getDocs(collection(db, 'signos_registros'));
      const registros = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}))
        .filter(registro => 
          registro.fecha?.toLowerCase().includes(term) ||
          registro.observaciones?.toLowerCase().includes(term) ||
          registro.presion?.toLowerCase().includes(term)
        );
      renderSignosList(registros);
    } catch(e) {
      console.error(e);
    }
  }

  // Funciones globales para los botones
  window.signosVerDetalle = async function(id) {
    try {
      const snap = await getDoc(doc(db, 'signos_registros', id));
      if (snap.exists()) {
        const registro = snap.data();
        const fecha = new Date(registro.fecha).toLocaleString();
        const html = `
          <h3>Registro del ${fecha}</h3>
          <div class="detalle-signos">
            <p><strong>Temperatura:</strong> ${registro.temperatura || 'N/D'}°C</p>
            <p><strong>Frecuencia Cardíaca:</strong> ${registro.fc || 'N/D'} lpm</p>
            <p><strong>Frecuencia Respiratoria:</strong> ${registro.fr || 'N/D'} rpm</p>
            <p><strong>Presión Arterial:</strong> ${registro.presion || 'N/D'} mmHg</p>
            <p><strong>Saturación de Oxígeno:</strong> ${registro.spo2 || 'N/D'}%</p>
            <p><strong>Dolor:</strong> ${registro.dolor || 'N/D'}/10</p>
            <p><strong>Observaciones:</strong> ${registro.observaciones || 'Ninguna'}</p>
          </div>
        `;
        modalTitle.textContent = 'Detalle del Registro';
        modalContent.innerHTML = html + '<button onclick="document.getElementById(\'signos-modal-close\').click()">Cerrar</button>';
        modal.style.display = 'flex';
      }
    } catch(e) {
      showToast('Error cargando detalle', 'error');
      console.error(e);
    }
  };

  window.signosEditar = async function(id) {
    try {
      const snap = await getDoc(doc(db, 'signos_registros', id));
      if (snap.exists()) {
        showSignosModal({id, ...snap.data()});
      }
    } catch(e) {
      showToast('Error cargando registro', 'error');
      console.error(e);
    }
  };

  window.signosEliminar = async function(id) {
    if (!confirm('¿Seguro que deseas eliminar este registro?')) return;
    try {
      await deleteDoc(doc(db, 'signos_registros', id));
      showToast('Registro eliminado');
      await loadSignosData();
    } catch(e) {
      showToast('Error al eliminar', 'error');
      console.error(e);
    }
  };
}

// ✅ Esta función es la que usa main.js
export function renderSignos(container) {
  container.innerHTML = panelSignos();
  panelSignosInit();
}