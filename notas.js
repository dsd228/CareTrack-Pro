import { db } from './firebase.js';
import { collection, getDocs, doc, getDoc, setDoc, deleteDoc, addDoc } from "./firebase-mock.js";
import { showToast } from './toast.js';

export function panelNotas() {
  return `
  <section class="spa-panel">
    <h2>Notas Clínicas</h2>
    
    <!-- Controles de acción -->
    <div class="form-row">
      <button id="notas_agregar" class="btn-primary">Agregar Nota</button>
      <button id="notas_buscar" class="btn-secondary">Buscar</button>
      <input type="search" id="notas_busqueda" placeholder="Buscar por título o contenido..." />
    </div>
    
    <!-- Lista de notas -->
    <div id="notas-content">
      <p>Cargando notas...</p>
    </div>
    
    <!-- Modal para agregar/editar -->
    <div id="notas-modal" class="modal" style="display:none;">
      <div class="modal-content">
        <span id="notas-modal-close" class="close">&times;</span>
        <div id="notas-modal-content">
          <h3 id="notas-modal-title">Nueva Nota Clínica</h3>
          <form id="notas-form">
            <div class="form-row">
              <label for="notas_titulo">
                Título <span style="color: red;">*</span><br>
                <small>Título descriptivo de la nota</small>
              </label>
              <input type="text" id="notas_titulo" required placeholder="Ej: Consulta inicial, Seguimiento, etc." />
            </div>
            <div class="form-row">
              <label for="notas_categoria">
                Categoría<br>
                <small>Tipo de nota clínica</small>
              </label>
              <select id="notas_categoria">
                <option value="">Seleccionar categoría</option>
                <option value="consulta">Consulta médica</option>
                <option value="seguimiento">Seguimiento</option>
                <option value="diagnostico">Diagnóstico</option>
                <option value="tratamiento">Tratamiento</option>
                <option value="procedimiento">Procedimiento</option>
                <option value="observacion">Observación</option>
                <option value="urgencia">Urgencia</option>
                <option value="alta">Alta médica</option>
                <option value="interconsulta">Interconsulta</option>
                <option value="educacion">Educación al paciente</option>
                <option value="administrativa">Administrativa</option>
                <option value="otra">Otra</option>
              </select>
            </div>
            <div class="form-row">
              <label for="notas_fecha">
                Fecha y Hora<br>
                <small>Momento de la nota clínica</small>
              </label>
              <input type="datetime-local" id="notas_fecha" required />
            </div>
            <div class="form-row">
              <label for="notas_prioridad">
                Prioridad<br>
                <small>Importancia de la nota</small>
              </label>
              <select id="notas_prioridad">
                <option value="baja">Baja</option>
                <option value="normal" selected>Normal</option>
                <option value="alta">Alta</option>
                <option value="urgente">Urgente</option>
              </select>
            </div>
            <div class="form-row">
              <label for="notas_contenido">
                Contenido de la Nota <span style="color: red;">*</span><br>
                <small>Descripción detallada de la observación clínica</small>
              </label>
              <textarea id="notas_contenido" required rows="6" placeholder="Describa la observación clínica, síntomas, hallazgos, plan de tratamiento, etc."></textarea>
            </div>
            <div class="form-row">
              <label for="notas_profesional">
                Profesional<br>
                <small>Médico o profesional que genera la nota</small>
              </label>
              <input type="text" id="notas_profesional" placeholder="Nombre del profesional" />
            </div>
            <div class="form-row">
              <label for="notas_tags">
                Etiquetas<br>
                <small>Palabras clave separadas por comas</small>
              </label>
              <input type="text" id="notas_tags" placeholder="Ej: diabetes, hipertensión, control" />
            </div>
            <div class="form-actions">
              <button type="submit" id="notas_guardar_modal">Guardar</button>
              <button type="button" id="notas_cancelar">Cancelar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
  `;
}

export function panelNotasInit() {
  const content = document.getElementById('notas-content');
  const agregarBtn = document.getElementById('notas_agregar');
  const buscarBtn = document.getElementById('notas_buscar');
  const busqueda = document.getElementById('notas_busqueda');
  const modal = document.getElementById('notas-modal');
  const modalContent = document.getElementById('notas-modal-content');
  const modalCloseBtn = document.getElementById('notas-modal-close');
  const modalTitle = document.getElementById('notas-modal-title');
  const form = document.getElementById('notas-form');
  
  let editingId = null;

  // Cargar datos iniciales
  loadNotasData();

  // Event listeners
  agregarBtn.onclick = () => showNotasModal();
  buscarBtn.onclick = () => searchNotas();
  modalCloseBtn.onclick = () => closeModal();
  form.onsubmit = (e) => {
    e.preventDefault();
    saveNota();
  };
  document.getElementById('notas_cancelar').onclick = () => closeModal();

  // Funciones CRUD
  async function loadNotasData() {
    content.innerHTML = '<p>Cargando...</p>';
    try {
      const snapshot = await getDocs(collection(db, 'notas_registros'));
      const notas = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
      renderNotasList(notas);
    } catch(e) {
      content.innerHTML = '<p>Error cargando datos.</p>';
      console.error(e);
    }
  }

  function renderNotasList(notas) {
    if (notas.length === 0) {
      content.innerHTML = '<p>No hay notas clínicas registradas. <button onclick="document.getElementById(\'notas_agregar\').click()">Agregar la primera</button></p>';
      return;
    }

    // Ordenar por fecha (más reciente primero) y luego por prioridad
    notas.sort((a, b) => {
      const prioridades = { 'urgente': 4, 'alta': 3, 'normal': 2, 'baja': 1 };
      const prioridadA = prioridades[a.prioridad] || 2;
      const prioridadB = prioridades[b.prioridad] || 2;
      
      if (prioridadA !== prioridadB) return prioridadB - prioridadA;
      return new Date(b.fecha) - new Date(a.fecha);
    });

    const html = notas.map(nota => {
      const prioridadClass = {
        'urgente': 'priority-urgent',
        'alta': 'priority-high', 
        'normal': 'priority-normal',
        'baja': 'priority-low'
      }[nota.prioridad] || 'priority-normal';

      const categoriaIcon = {
        'consulta': '🩺', 'seguimiento': '📊', 'diagnostico': '🔍',
        'tratamiento': '💊', 'procedimiento': '⚕️', 'observacion': '👁️',
        'urgencia': '🚨', 'alta': '🏠', 'interconsulta': '👥',
        'educacion': '📚', 'administrativa': '📋'
      }[nota.categoria] || '📝';

      return `
      <div class="notas-card ${prioridadClass}">
        <div class="card-header">
          <h3>${categoriaIcon} ${nota.titulo}</h3>
          <div class="card-actions">
            <button onclick="window.notasVerDetalle('${nota.id}')" class="btn-view">Ver</button>
            <button onclick="window.notasEditar('${nota.id}')" class="btn-edit">Editar</button>
            <button onclick="window.notasEliminar('${nota.id}')" class="btn-delete">Eliminar</button>
          </div>
        </div>
        <div class="card-content">
          <div class="nota-meta">
            ${nota.categoria ? `<span class="nota-categoria">${nota.categoria}</span>` : ''}
            <span class="nota-prioridad ${prioridadClass}">${nota.prioridad?.toUpperCase() || 'NORMAL'}</span>
            <span class="nota-fecha">${new Date(nota.fecha).toLocaleString()}</span>
          </div>
          <p class="nota-contenido">${nota.contenido?.slice(0, 150)}${nota.contenido?.length > 150 ? '...' : ''}</p>
          ${nota.profesional ? `<p class="nota-profesional"><strong>Por:</strong> ${nota.profesional}</p>` : ''}
          ${nota.tags ? `<div class="nota-tags">${nota.tags.split(',').map(tag => `<span class="tag">${tag.trim()}</span>`).join('')}</div>` : ''}
        </div>
      </div>
    `;
    }).join('');

    content.innerHTML = html;
  }

  function showNotasModal(nota = null) {
    editingId = nota ? nota.id : null;
    modalTitle.textContent = editingId ? 'Editar Nota' : 'Nueva Nota Clínica';
    
    // Limpiar o llenar formulario
    if (nota) {
      document.getElementById('notas_titulo').value = nota.titulo || '';
      document.getElementById('notas_categoria').value = nota.categoria || '';
      document.getElementById('notas_fecha').value = nota.fecha || '';
      document.getElementById('notas_prioridad').value = nota.prioridad || 'normal';
      document.getElementById('notas_contenido').value = nota.contenido || '';
      document.getElementById('notas_profesional').value = nota.profesional || '';
      document.getElementById('notas_tags').value = nota.tags || '';
    } else {
      form.reset();
      // Establecer fecha actual por defecto
      const now = new Date();
      now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
      document.getElementById('notas_fecha').value = now.toISOString().slice(0, 16);
      document.getElementById('notas_prioridad').value = 'normal';
    }
    
    modal.style.display = 'flex';
  }

  function closeModal() {
    modal.style.display = 'none';
    editingId = null;
  }

  async function saveNota() {
    const titulo = document.getElementById('notas_titulo').value.trim();
    const contenido = document.getElementById('notas_contenido').value.trim();
    
    if (!titulo || !contenido) {
      showToast('El título y contenido son obligatorios', 'error');
      return;
    }

    const data = {
      titulo: titulo,
      categoria: document.getElementById('notas_categoria').value,
      fecha: document.getElementById('notas_fecha').value,
      prioridad: document.getElementById('notas_prioridad').value,
      contenido: contenido,
      profesional: document.getElementById('notas_profesional').value,
      tags: document.getElementById('notas_tags').value,
      updated: new Date().toISOString()
    };

    try {
      if (editingId) {
        await setDoc(doc(db, 'notas_registros', editingId), data);
        showToast('Nota actualizada');
      } else {
        await addDoc(collection(db, 'notas_registros'), data);
        showToast('Nota guardada');
      }
      closeModal();
      await loadNotasData();
    } catch(e) {
      showToast('Error al guardar', 'error');
      console.error(e);
    }
  }

  async function searchNotas() {
    const term = busqueda.value.trim().toLowerCase();
    if (!term) {
      await loadNotasData();
      return;
    }

    try {
      const snapshot = await getDocs(collection(db, 'notas_registros'));
      const notas = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}))
        .filter(nota => 
          nota.titulo?.toLowerCase().includes(term) ||
          nota.contenido?.toLowerCase().includes(term) ||
          nota.categoria?.toLowerCase().includes(term) ||
          nota.profesional?.toLowerCase().includes(term) ||
          nota.tags?.toLowerCase().includes(term)
        );
      renderNotasList(notas);
    } catch(e) {
      console.error(e);
    }
  }

  // Funciones globales para los botones
  window.notasVerDetalle = async function(id) {
    try {
      const snap = await getDoc(doc(db, 'notas_registros', id));
      if (snap.exists()) {
        const nota = snap.data();
        const html = `
          <h3>${nota.titulo}</h3>
          <div class="detalle-nota">
            <p><strong>Categoría:</strong> ${nota.categoria || 'N/D'}</p>
            <p><strong>Fecha:</strong> ${new Date(nota.fecha).toLocaleString()}</p>
            <p><strong>Prioridad:</strong> ${nota.prioridad || 'N/D'}</p>
            <p><strong>Profesional:</strong> ${nota.profesional || 'N/D'}</p>
            <div class="nota-contenido-completo">
              <strong>Contenido:</strong>
              <div style="margin-top: 10px; padding: 10px; background: #f5f5f5; border-radius: 4px;">
                ${nota.contenido?.replace(/\n/g, '<br>') || 'Sin contenido'}
              </div>
            </div>
            ${nota.tags ? `<p><strong>Etiquetas:</strong> ${nota.tags}</p>` : ''}
          </div>
        `;
        modalTitle.textContent = 'Detalle de la Nota';
        modalContent.innerHTML = html + '<button onclick="document.getElementById(\'notas-modal-close\').click()">Cerrar</button>';
        modal.style.display = 'flex';
      }
    } catch(e) {
      showToast('Error cargando detalle', 'error');
      console.error(e);
    }
  };

  window.notasEditar = async function(id) {
    try {
      const snap = await getDoc(doc(db, 'notas_registros', id));
      if (snap.exists()) {
        showNotasModal({id, ...snap.data()});
      }
    } catch(e) {
      showToast('Error cargando nota', 'error');
      console.error(e);
    }
  };

  window.notasEliminar = async function(id) {
    if (!confirm('¿Seguro que deseas eliminar esta nota?')) return;
    try {
      await deleteDoc(doc(db, 'notas_registros', id));
      showToast('Nota eliminada');
      await loadNotasData();
    } catch(e) {
      showToast('Error al eliminar', 'error');
      console.error(e);
    }
  };
}

// ✅ Esta función es la que usa main.js
export function renderNotas(container) {
  container.innerHTML = panelNotas();
  panelNotasInit();
}