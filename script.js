// CareTrack-Pro SPA avanzado JS
// ===============================
// Estructura modular por panel, persistencia local y búsqueda web.
// Código altamente comentado para fácil mantenimiento.

// --------- Gestión de Tema ---------
const themeToggle = document.getElementById('themeToggle');
const root = document.documentElement;
function setTheme(theme) {
  root.setAttribute('data-theme', theme);
  localStorage.setItem('ctp_theme', theme);
  themeToggle.innerHTML = theme === "dark" ? "🌙" : "☀️";
}
const storedTheme = localStorage.getItem('ctp_theme') || "light";
setTheme(storedTheme);
themeToggle.addEventListener('click', () => {
  setTheme(root.getAttribute('data-theme') === "dark" ? "light" : "dark");
});

// --------- SPA Navegación de Paneles ---------
const menuBtns = document.querySelectorAll('.menu-btn');
const mainContent = document.getElementById('main-content');
let currentTab = "paciente";

// Plantillas HTML por panel (simulación SPA)
const panels = {
  paciente: renderPacientePanel,
  historia: renderHistoriaPanel,
  signos: renderSignosPanel,
  examenes: renderExamenesPanel,
  alergias: renderAlergiasPanel,
  notas: renderNotasPanel,
  educacion: renderEducacionPanel,
  configuracion: renderConfigPanel
};

// Cambio de pestaña SPA
menuBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    menuBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    showPanel(btn.dataset.tab);
  });
});
function showPanel(tab) {
  currentTab = tab;
  mainContent.innerHTML = `<div class="spa-panel active">${panels[tab]()}</div>`;
  // Inicializar lógica del panel respectivo
  setTimeout(() => { panelInit[tab]?.(); }, 30);
}
showPanel(currentTab);

// --------- Paciente Panel ---------
function renderPacientePanel() {
  // Formulario y lista de pacientes
  return `
    <h2>Pacientes</h2>
    <form id="formPaciente" class="panel-form">
      <div class="form-row">
        <label>Nombre: <input type="text" id="pNombre" required /></label>
        <label>Edad: <input type="number" id="pEdad" min="0" max="120" required /></label>
        <label>Género:
          <select id="pGenero">
            <option value="">Seleccione</option>
            <option value="Femenino">Femenino</option>
            <option value="Masculino">Masculino</option>
            <option value="Otro">Otro</option>
          </select>
        </label>
      </div>
      <div class="form-row">
        <label>Contacto: <input type="text" id="pContacto" /></label>
        <label>Dirección: <input type="text" id="pDireccion" /></label>
        <label>Foto: <input type="file" id="pFoto" accept="image/*" /></label>
      </div>
      <button type="submit">Registrar</button>
    </form>
    <div id="pacientesList"></div>
  `;
}
function renderPacienteItem(paciente, idx) {
  return `
    <div class="paciente-card" data-idx="${idx}">
      <img src="${paciente.foto || 'assets/user.svg'}" alt="Foto" class="paciente-foto" />
      <div class="paciente-info">
        <strong>${paciente.nombre}</strong> (${paciente.edad} años, ${paciente.genero})<br>
        ${paciente.contacto ? `<span>Contacto: ${paciente.contacto}</span><br>` : ""}
        ${paciente.direccion ? `<span>Dirección: ${paciente.direccion}</span><br>` : ""}
      </div>
      <div class="paciente-actions">
        <button class="edit-paciente" title="Editar">&#9998;</button>
        <button class="delete-paciente" title="Eliminar">&times;</button>
      </div>
    </div>
  `;
}

// --------- Historia Clínica Panel ---------
function renderHistoriaPanel() {
  return `
    <h2>Historia Clínica</h2>
    <form id="formHistoria" class="panel-form">
      <label>Fecha: <input type="date" id="hFecha" required /></label>
      <label>Antecedentes / Diagnóstico:
        <textarea id="hTexto" rows="3"></textarea>
      </label>
      <label>Documento/Imagen (URL): <input type="url" id="hURL" placeholder="https://..." /></label>
      <button type="submit">Agregar</button>
    </form>
    <div id="historiaList"></div>
  `;
}

// --------- Signos Vitales Panel ---------
function renderSignosPanel() {
  return `
    <h2>Signos Vitales</h2>
    <form id="formSignos" class="panel-form">
      <div class="form-row">
        <label>Temperatura (°C): <input type="number" id="sTemp" step="0.1" min="30" max="45" /></label>
        <label>Presión Arterial: <input type="text" id="sPresion" placeholder="Ej: 120/80" /></label>
        <label>Frecuencia Cardíaca: <input type="number" id="sFC" min="30" max="220" /></label>
      </div>
      <div class="form-row">
        <label>Saturación O₂ (%): <input type="number" id="sSatO2" min="50" max="100" /></label>
        <label>Peso (kg): <input type="number" id="sPeso" step="0.1" min="2" max="300" /></label>
        <label>Altura (cm): <input type="number" id="sAltura" min="30" max="250" /></label>
      </div>
      <button type="submit">Registrar</button>
    </form>
    <canvas id="chartSignos" width="400" height="180"></canvas>
    <div id="signosList"></div>
  `;
}

// --------- Exámenes Panel ---------
function renderExamenesPanel() {
  return `
    <h2>Exámenes</h2>
    <form id="formExamen" class="panel-form">
      <label>Fecha: <input type="date" id="eFecha" required /></label>
      <label>Tipo: <input type="text" id="eTipo" required /></label>
      <label>Resultado: <input type="text" id="eResultado" /></label>
      <label>Enlace a Resultados: <input type="url" id="eURL" placeholder="https://..." /></label>
      <button type="submit">Agregar</button>
    </form>
    <div id="examenList"></div>
  `;
}

// --------- Alergias Panel ---------
function renderAlergiasPanel() {
  return `
    <h2>Alergias</h2>
    <form id="formAlergia" class="panel-form">
      <label>Tipo: <input type="text" id="aTipo" required /></label>
      <label>Gravedad:
        <select id="aGravedad">
          <option value="">Seleccione</option>
          <option value="Leve">Leve</option>
          <option value="Moderada">Moderada</option>
          <option value="Grave">Grave</option>
        </select>
      </label>
      <label>Reacción: <input type="text" id="aReaccion" /></label>
      <button type="submit">Agregar</button>
    </form>
    <div id="alergiaList"></div>
  `;
}

// --------- Notas Panel ---------
function renderNotasPanel() {
  return `
    <h2>Notas Médicas</h2>
    <form id="formNota" class="panel-form">
      <div id="notaEditor">
        <button type="button" class="nota-bt" data-cmd="bold"><b>B</b></button>
        <button type="button" class="nota-bt" data-cmd="italic"><i>I</i></button>
        <button type="button" class="nota-bt" data-cmd="insertUnorderedList">&#8226; Lista</button>
      </div>
      <div contenteditable="true" id="notaContent" class="nota-content"></div>
      <button type="submit">Guardar Nota</button>
    </form>
    <div id="notasList"></div>
  `;
}

// --------- Educación Panel ---------
function renderEducacionPanel() {
  return `
    <h2>Educación</h2>
    <form id="formEducacion" class="panel-form">
      <label>Búsqueda web:
        <input type="search" id="eduQuery" placeholder="Ej: fiebre, ibuprofeno..." />
      </label>
      <button type="submit">Buscar</button>
    </form>
    <div id="eduResultado"></div>
  `;
}

// --------- Configuración Panel ---------
function renderConfigPanel() {
  return `
    <h2>Configuración</h2>
    <form id="formConfig" class="panel-form">
      <label>Cambio de idioma:
        <select id="cfgIdioma">
          <option value="es">Español</option>
          <option value="en">English</option>
        </select>
      </label>
      <label><input type="checkbox" id="cfgFuenteGrande" /> Fuente grande</label>
      <label><input type="checkbox" id="cfgAltoContraste" /> Alto contraste</label>
      <button type="submit">Guardar Configuración</button>
    </form>
  `;
}

// --------- Inicialización lógica por panel ---------
const panelInit = {
  paciente: initPacientePanel,
  historia: initHistoriaPanel,
  signos: initSignosPanel,
  examenes: initExamenesPanel,
  alergias: initAlergiasPanel,
  notas: initNotasPanel,
  educacion: initEducacionPanel,
  configuracion: initConfigPanel
};

// ------ Paneles (lógica modular, persistencia en localStorage) ------
// ---- Ejemplo: PACIENTES ----
function initPacientePanel() {
  const form = document.getElementById('formPaciente');
  const fotoInput = document.getElementById('pFoto');
  let fotoBase64 = "";
  fotoInput?.addEventListener('change', e => {
    const file = fotoInput.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = ev => { fotoBase64 = ev.target.result; };
      reader.readAsDataURL(file);
    }
  });
  form.onsubmit = e => {
    e.preventDefault();
    const paciente = {
      nombre: form.pNombre.value,
      edad: form.pEdad.value,
      genero: form.pGenero.value,
      contacto: form.pContacto.value,
      direccion: form.pDireccion.value,
      foto: fotoBase64
    };
    const pacientes = JSON.parse(localStorage.getItem('ctp_pacientes') || "[]");
    pacientes.push(paciente);
    localStorage.setItem('ctp_pacientes', JSON.stringify(pacientes));
    renderPacientes();
    form.reset();
    fotoBase64 = "";
  };
  renderPacientes();
  function renderPacientes(filter = "") {
    const pacientes = JSON.parse(localStorage.getItem('ctp_pacientes') || "[]");
    let html = '<div class="pacientes-list">';
    pacientes
      .map((p, i) => ({p, i}))
      .filter(({p}) => !filter || p.nombre.toLowerCase().includes(filter.toLowerCase()))
      .forEach(({p, i}) => {
        html += renderPacienteItem(p, i);
      });
    html += '</div>';
    document.getElementById('pacientesList').innerHTML = html;

    // Acciones editar/eliminar
    document.querySelectorAll('.edit-paciente').forEach(btn => btn.onclick = () => editPaciente(btn));
    document.querySelectorAll('.delete-paciente').forEach(btn => btn.onclick = () => deletePaciente(btn));
  }
  function editPaciente(btn) {
    const idx = btn.closest('.paciente-card').dataset.idx;
    const pacientes = JSON.parse(localStorage.getItem('ctp_pacientes') || "[]");
    const p = pacientes[idx];
    form.pNombre.value = p.nombre;
    form.pEdad.value = p.edad;
    form.pGenero.value = p.genero;
    form.pContacto.value = p.contacto;
    form.pDireccion.value = p.direccion;
    fotoBase64 = p.foto || "";
    pacientes.splice(idx,1);
    localStorage.setItem('ctp_pacientes', JSON.stringify(pacientes));
    renderPacientes();
  }
  function deletePaciente(btn) {
    const idx = btn.closest('.paciente-card').dataset.idx;
    const pacientes = JSON.parse(localStorage.getItem('ctp_pacientes') || "[]");
    if (confirm("¿Eliminar paciente?")) {
      pacientes.splice(idx,1);
      localStorage.setItem('ctp_pacientes', JSON.stringify(pacientes));
      renderPacientes();
    }
  }
  // Búsqueda rápida desde barra superior
  document.getElementById('searchPaciente').oninput = function() {
    renderPacientes(this.value);
  };
}
// ---- Paneles restantes: lógica similar (guardar, listar, editar, eliminar, persistencia) ----
function initHistoriaPanel() {/* ... */}
function initSignosPanel() {/* ... */}
function initExamenesPanel() {/* ... */}
function initAlergiasPanel() {/* ... */}
function initNotasPanel() {/* ... */}
function initEducacionPanel() {
  // Búsqueda web en Wikipedia API
  const form = document.getElementById('formEducacion');
  const queryInput = document.getElementById('eduQuery');
  const resultado = document.getElementById('eduResultado');
  form.onsubmit = async e => {
    e.preventDefault();
    const term = queryInput.value.trim();
    resultado.innerHTML = "Buscando...";
    try {
      const res = await fetch(`https://es.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(term)}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      if (data.title && data.extract) {
        resultado.innerHTML = `
          <h3>${data.title}</h3>
          <p>${data.extract}</p>
          ${data.thumbnail ? `<img src="${data.thumbnail.source}" alt="Ilustración" style="max-width:120px" />` : ""}
          <p><a href="${data.content_urls?.desktop?.page}" target="_blank">Ver más en Wikipedia</a></p>
        `;
      } else {
        resultado.innerHTML = "No se encontraron resultados.";
      }
    } catch {
      resultado.innerHTML = "Error de conexión o no hay resultados.";
    }
  };
}
function initConfigPanel() {
  const form = document.getElementById('formConfig');
  const idiomaSel = document.getElementById('cfgIdioma');
  const fuenteGrande = document.getElementById('cfgFuenteGrande');
  const altoContraste = document.getElementById('cfgAltoContraste');
  // Cargar config actual
  const config = JSON.parse(localStorage.getItem('ctp_config') || '{}');
  idiomaSel.value = config.idioma || 'es';
  fuenteGrande.checked = !!config.fuenteGrande;
  altoContraste.checked = !!config.altoContraste;
  form.onsubmit = e => {
    e.preventDefault();
    localStorage.setItem('ctp_config', JSON.stringify({
      idioma: idiomaSel.value,
      fuenteGrande: fuenteGrande.checked,
      altoContraste: altoContraste.checked
    }));
    // Aplicar accesibilidad
    root.setAttribute('data-accessibility', fuenteGrande.checked ? 'large-font' : '');
    root.setAttribute('data-accessibility', altoContraste.checked ? 'high-contrast' : '');
    alert("Configuración guardada.");
  };
  // Aplicar accesibilidad en carga
  root.setAttribute('data-accessibility', fuenteGrande.checked ? 'large-font' : '');
  root.setAttribute('data-accessibility', altoContraste.checked ? 'high-contrast' : '');
}

// --------- Fin JS ---------
