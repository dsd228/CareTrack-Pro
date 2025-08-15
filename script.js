// CareTrack-Pro SPA avanzado JS
// Mejora de UI/UX, SPA, validaciones, multilenguaje, notificaciones, exportación

// ------------- SPA y layout -------------
const themeToggle = document.getElementById('themeToggle');
const langToggle = document.getElementById('langToggle');
const root = document.documentElement;
const sidebar = document.querySelector('.sidebar');
const hamburger = document.querySelector('.hamburger');
let currentTab = "paciente";

// ----- Multilenguaje -----
const LANG = {
  es: {
    guardar: "Guardar",
    buscar: "Buscar paciente...",
    registro: "Registrar",
    nombre: "Nombre",
    edad: "Edad",
    genero: "Género",
    contacto: "Contacto",
    direccion: "Dirección",
    foto: "Foto",
    paciente: "Paciente",
    historia: "Historia Clínica",
    signos: "Signos Vitales",
    examenes: "Exámenes",
    alergias: "Alergias",
    notas: "Notas",
    educacion: "Educación",
    configuracion: "Configuración",
    agregar: "Agregar",
    eliminar: "Eliminar",
    exportar: "Exportar",
    pdf: "PDF",
    csv: "CSV",
    idioma: "Idioma",
    fuenteGrande: "Fuente grande",
    altoContraste: "Alto contraste",
    datosGuardados: "Datos guardados",
    pacienteActualizado: "Paciente actualizado",
    error: "Error",
    exportacionExitosa: "Exportación exitosa",
    toastGuardado: "Datos guardados exitosamente",
    toastEliminado: "Elemento eliminado",
    toastActualizado: "Elemento actualizado",
  },
  en: {
    guardar: "Save",
    buscar: "Search patient...",
    registro: "Register",
    nombre: "Name",
    edad: "Age",
    genero: "Gender",
    contacto: "Contact",
    direccion: "Address",
    foto: "Photo",
    paciente: "Patient",
    historia: "Clinical History",
    signos: "Vitals",
    examenes: "Tests",
    alergias: "Allergies",
    notas: "Notes",
    educacion: "Education",
    configuracion: "Settings",
    agregar: "Add",
    eliminar: "Delete",
    exportar: "Export",
    pdf: "PDF",
    csv: "CSV",
    idioma: "Language",
    fuenteGrande: "Large font",
    altoContraste: "High contrast",
    datosGuardados: "Data saved",
    pacienteActualizado: "Patient updated",
    error: "Error",
    exportacionExitosa: "Export successful",
    toastGuardado: "Data saved successfully",
    toastEliminado: "Item deleted",
    toastActualizado: "Item updated",
  }
};
let idioma = localStorage.getItem('ctp_idioma') || 'es';
function t(key) { return LANG[idioma][key] || key; }
langToggle.textContent = idioma.toUpperCase();
langToggle.onclick = () => {
  idioma = idioma === 'es' ? 'en' : 'es';
  localStorage.setItem('ctp_idioma', idioma);
  langToggle.textContent = idioma.toUpperCase();
  showPanel(currentTab);
  showToast(t("datosGuardados"));
};

// ----- Tema con transición -----
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

// ----- Sidebar menu responsive -----
hamburger.addEventListener('click', () => {
  sidebar.classList.toggle('collapsed');
});
sidebar.addEventListener('mouseenter', () => {
  if(window.innerWidth < 700) sidebar.classList.remove('collapsed');
});
sidebar.addEventListener('mouseleave', () => {
  if(window.innerWidth < 700) sidebar.classList.add('collapsed');
});
window.addEventListener('resize', () => {
  if(window.innerWidth < 700) sidebar.classList.add('collapsed');
  else sidebar.classList.remove('collapsed');
});
if(window.innerWidth < 700) sidebar.classList.add('collapsed');

// SPA navigation
const menuBtns = document.querySelectorAll('.menu-btn');
const mainContent = document.getElementById('main-content');
menuBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    menuBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    showPanel(btn.dataset.tab);
    currentTab = btn.dataset.tab;
  });
});
window.onpopstate = (e) => {
  if(e.state?.tab) showPanel(e.state.tab);
};

// ------------- Toast notifications -------------
function showToast(msg, isError=false) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.className = "toast" + (isError ? " error":"") + " show";
  setTimeout(() => toast.classList.remove('show'), 2300);
}

// ------------- Atajos de teclado -------------
document.addEventListener('keydown', e => {
  if(e.ctrlKey && e.key === 'f') {
    document.getElementById('searchPaciente').focus();
    e.preventDefault();
  }
  if(e.altKey && e.key === '1') showPanel('historia');
});

// ------------- Paneles SPA -------------
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
function showPanel(tab) {
  currentTab = tab;
  mainContent.innerHTML = `<div class="spa-panel active">${panels[tab]()}</div>`;
  setTimeout(() => { panelInit[tab]?.(); }, 30);
  history.pushState({tab}, '', `#${tab}`);
}
showPanel(currentTab);

// ------------- Paneles HTML -------------
function renderPacientePanel() {
  return `
    <div class="card">
    <h2>${t("paciente")}</h2>
    <form id="formPaciente" class="panel-form" autocomplete="off">
      <div class="form-row">
        <label>${t("nombre")}: <input type="text" id="pNombre" required /></label>
        <label>${t("edad")}: <input type="number" id="pEdad" min="0" max="120" required /></label>
        <label>${t("genero")}:
          <select id="pGenero">
            <option value="">${t("genero")}</option>
            <option value="Femenino">${idioma==='es'?"Femenino":"Female"}</option>
            <option value="Masculino">${idioma==='es'?"Masculino":"Male"}</option>
            <option value="Otro">${idioma==='es'?"Otro":"Other"}</option>
          </select>
        </label>
      </div>
      <div class="form-row">
        <label>${t("contacto")}: <input type="text" id="pContacto" /></label>
        <label>${t("direccion")}: <input type="text" id="pDireccion" /></label>
        <label>${t("foto")}: <input type="file" id="pFoto" accept="image/*" /></label>
      </div>
      <button type="submit">${t("registro")}</button>
      <button type="button" id="exportCSV">${t("exportar")} ${t("csv")}</button>
      <button type="button" id="exportPDF">${t("exportar")} ${t("pdf")}</button>
    </form>
    <div id="pacientesList"></div>
    </div>
  `;
}
function renderPacienteItem(paciente, idx) {
  return `
    <div class="paciente-card neumorph" data-idx="${idx}">
      <img src="${paciente.foto || 'assets/user.svg'}" alt="Foto" class="paciente-foto" />
      <div class="paciente-info">
        <strong>${paciente.nombre}</strong> (${paciente.edad} ${idioma==='es'?'años':'years'}, ${paciente.genero})<br>
        ${paciente.contacto ? `<span>${t("contacto")}: ${paciente.contacto}</span><br>` : ""}
        ${paciente.direccion ? `<span>${t("direccion")}: ${paciente.direccion}</span><br>` : ""}
      </div>
      <div class="paciente-actions">
        <button class="edit-paciente" title="Editar">&#9998;</button>
        <button class="delete-paciente" title="Eliminar">&times;</button>
      </div>
    </div>
  `;
}
function renderHistoriaPanel() {
  return `
    <div class="card">
    <h2>${t("historia")}</h2>
    <form id="formHistoria" class="panel-form" autocomplete="off">
      <label>${idioma==='es'?"Fecha":"Date"}: <input type="date" id="hFecha" required /></label>
      <label>${idioma==='es'?"Antecedentes / Diagnóstico":"Medical history / Diagnosis"}:
        <textarea id="hTexto" rows="3" required></textarea>
      </label>
      <label>${idioma==='es'?"Documento/Imagen (URL)":"Document/Image (URL)"}: <input type="url" id="hURL" placeholder="https://..." /></label>
      <button type="submit">${t("agregar")}</button>
    </form>
    <div id="historiaList"></div>
    </div>
  `;
}
function renderSignosPanel() {
  return `
    <div class="card">
    <h2>${t("signos")}</h2>
    <form id="formSignos" class="panel-form" autocomplete="off">
      <div class="form-row">
        <label>${idioma==='es'?"Temperatura (°C)":"Temperature (°C)"}: <input type="number" id="sTemp" step="0.1" min="30" max="45" required /></label>
        <label>${idioma==='es'?"Presión Arterial":"Blood Pressure"}: <input type="text" id="sPresion" placeholder="Ej: 120/80" required /></label>
        <label>${idioma==='es'?"Frecuencia Cardíaca":"Heart Rate"}: <input type="number" id="sFC" min="30" max="220" required /></label>
      </div>
      <div class="form-row">
        <label>${idioma==='es'?"Saturación O₂ (%)":"O₂ Saturation (%)"}: <input type="number" id="sSatO2" min="50" max="100" required /></label>
        <label>${idioma==='es'?"Peso (kg)":"Weight (kg)"}: <input type="number" id="sPeso" step="0.1" min="2" max="300" required /></label>
        <label>${idioma==='es'?"Altura (cm)":"Height (cm)"}: <input type="number" id="sAltura" min="30" max="250" required /></label>
      </div>
      <button type="submit">${t("agregar")}</button>
    </form>
    <canvas id="chartSignos" width="400" height="180" aria-label="Gráfico de signos vitales"></canvas>
    <div id="signosList"></div>
    </div>
  `;
}
function renderExamenesPanel() {
  return `
    <div class="card">
    <h2>${t("examenes")}</h2>
    <form id="formExamen" class="panel-form" autocomplete="off">
      <label>${idioma==='es'?"Fecha":"Date"}: <input type="date" id="eFecha" required /></label>
      <label>${idioma==='es'?"Tipo":"Type"}: <input type="text" id="eTipo" required /></label>
      <label>${idioma==='es'?"Resultado":"Result"}: <input type="text" id="eResultado" /></label>
      <label>${idioma==='es'?"Enlace a Resultados":"Results Link"}: <input type="url" id="eURL" placeholder="https://..." /></label>
      <button type="submit">${t("agregar")}</button>
    </form>
    <div id="examenList"></div>
    </div>
  `;
}
function renderAlergiasPanel() {
  return `
    <div class="card">
    <h2>${t("alergias")}</h2>
    <form id="formAlergia" class="panel-form" autocomplete="off">
      <label>${idioma==='es'?"Tipo":"Type"}: <input type="text" id="aTipo" required /></label>
      <label>${idioma==='es'?"Gravedad":"Severity"}:
        <select id="aGravedad" required>
          <option value="">${idioma==='es'?"Seleccione":"Select"}</option>
          <option value="Leve">${idioma==='es'?"Leve":"Mild"}</option>
          <option value="Moderada">${idioma==='es'?"Moderada":"Moderate"}</option>
          <option value="Grave">${idioma==='es'?"Grave":"Severe"}</option>
        </select>
      </label>
      <label>${idioma==='es'?"Reacción":"Reaction"}: <input type="text" id="aReaccion" /></label>
      <button type="submit">${t("agregar")}</button>
    </form>
    <div id="alergiaList"></div>
    </div>
  `;
}
function renderNotasPanel() {
  return `
    <div class="card">
    <h2>${t("notas")}</h2>
    <form id="formNota" class="panel-form" autocomplete="off">
      <div id="notaEditor">
        <button type="button" class="nota-bt" data-cmd="bold"><b>B</b></button>
        <button type="button" class="nota-bt" data-cmd="italic"><i>I</i></button>
        <button type="button" class="nota-bt" data-cmd="insertUnorderedList">&#8226; Lista</button>
        <button type="button" class="nota-bt" id="imgInsertBtn">&#128247; Imagen</button>
      </div>
      <div contenteditable="true" id="notaContent" class="nota-content" aria-label="Editor enriquecido"></div>
      <button type="submit">${t("guardar")}</button>
    </form>
    <div id="notasList"></div>
    </div>
  `;
}
function renderEducacionPanel() {
  return `
    <div class="card">
    <h2>${t("educacion")}</h2>
    <form id="formEducacion" class="panel-form" autocomplete="off">
      <label>${idioma==='es'?"Búsqueda web":"Web search"}:
        <input type="search" id="eduQuery" placeholder="${idioma==='es'?"Ej: fiebre, ibuprofeno...":"Ex: fever, ibuprofen..."}" />
      </label>
      <button type="submit">${t("buscar")}</button>
    </form>
    <div id="eduResultado"></div>
    </div>
  `;
}
function renderConfigPanel() {
  return `
    <div class="card">
    <h2>${t("configuracion")}</h2>
    <form id="formConfig" class="panel-form" autocomplete="off">
      <label>${t("idioma")}: 
        <select id="cfgIdioma">
          <option value="es">Español</option>
          <option value="en">English</option>
        </select>
      </label>
      <label><input type="checkbox" id="cfgFuenteGrande" /> ${t("fuenteGrande")}</label>
      <label><input type="checkbox" id="cfgAltoContraste" /> ${t("altoContraste")}</label>
      <button type="submit">${t("guardar")}</button>
    </form>
    </div>
  `;
}

// ------------- Paneles lógicos y validaciones -------------
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

// ---- Pacientes ----
function getPacientes() {
  return JSON.parse(localStorage.getItem('ctp_pacientes') || "[]");
}
function setPacientes(arr) {
  localStorage.setItem('ctp_pacientes', JSON.stringify(arr));
}
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
    if(form.pNombre.value.length < 2) return showToast("Nombre requerido",true);
    const paciente = {
      nombre: form.pNombre.value,
      edad: form.pEdad.value,
      genero: form.pGenero.value,
      contacto: form.pContacto.value,
      direccion: form.pDireccion.value,
      foto: fotoBase64
    };
    const pacientes = getPacientes();
    pacientes.push(paciente);
    setPacientes(pacientes);
    renderPacientes();
    form.reset();
    fotoBase64 = "";
    showToast(t("toastGuardado"));
  };
  document.getElementById('exportCSV').onclick = () => exportCSV(getPacientes());
  document.getElementById('exportPDF').onclick = () => exportPDF(getPacientes());
  renderPacientes();

  function renderPacientes(filter = "") {
    const pacientes = getPacientes();
    // Autocomplete datalist
    const datalist = document.getElementById('autocomplete-list');
    datalist.innerHTML = "";
    pacientes.forEach(p => {
      const option = document.createElement('option');
      option.value = p.nombre;
      datalist.appendChild(option);
    });
    let html = '<div class="pacientes-list">';
    pacientes
      .map((p, i) => ({p, i}))
      .filter(({p}) => !filter || p.nombre.toLowerCase().includes(filter.toLowerCase()))
      .forEach(({p, i}) => {
        html += renderPacienteItem(p, i);
      });
    html += '</div>';
    document.getElementById('pacientesList').innerHTML = html;
    document.querySelectorAll('.edit-paciente').forEach(btn => btn.onclick = () => editPaciente(btn));
    document.querySelectorAll('.delete-paciente').forEach(btn => btn.onclick = () => deletePaciente(btn));
  }
  function editPaciente(btn) {
    const idx = btn.closest('.paciente-card').dataset.idx;
    const pacientes = getPacientes();
    const p = pacientes[idx];
    form.pNombre.value = p.nombre;
    form.pEdad.value = p.edad;
    form.pGenero.value = p.genero;
    form.pContacto.value = p.contacto;
    form.pDireccion.value = p.direccion;
    fotoBase64 = p.foto || "";
    pacientes.splice(idx,1);
    setPacientes(pacientes);
    renderPacientes();
    showToast(t("pacienteActualizado"));
  }
  function deletePaciente(btn) {
    const idx = btn.closest('.paciente-card').dataset.idx;
    const pacientes = getPacientes();
    if (confirm(t("eliminar")+"?")) {
      pacientes.splice(idx,1);
      setPacientes(pacientes);
      renderPacientes();
      showToast(t("toastEliminado"));
    }
  }
  document.getElementById('searchPaciente').oninput = function() {
    renderPacientes(this.value);
  };
}

// ---- Exportación CSV/PDF ----
function exportCSV(arr) {
  let csv = "Nombre,Edad,Género,Contacto,Dirección\n";
  arr.forEach(p => {
    csv += `${p.nombre},${p.edad},${p.genero},${p.contacto},${p.direccion}\n`;
  });
  const blob = new Blob([csv], {type:"text/csv"});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = "pacientes.csv";
  a.click();
  showToast(t("exportacionExitosa"));
}
function exportPDF(arr) {
  const doc = new window.jspdf.jsPDF();
  doc.text("Listado de Pacientes",10,10);
  let y = 18;
  arr.forEach(p => {
    doc.text(`${p.nombre} | ${p.edad} | ${p.genero} | ${p.contacto} | ${p.direccion}`,10,y);
    y += 8;
  });
  doc.save("pacientes.pdf");
  showToast(t("exportacionExitosa"));
}

// ---- Historia clínica ----
function initHistoriaPanel() {
  const form = document.getElementById('formHistoria');
  form.onsubmit = e => {
    e.preventDefault();
    if(form.hTexto.value.length < 3) return showToast("Campo requerido",true);
    const historia = {
      fecha: form.hFecha.value,
      texto: form.hTexto.value,
      url: form.hURL.value
    };
    const historias = JSON.parse(localStorage.getItem('ctp_historia') || "[]");
    historias.push(historia);
    localStorage.setItem('ctp_historia', JSON.stringify(historias));
    renderHistorias();
    form.reset();
    showToast(t("toastGuardado"));
  };
  renderHistorias();
  function renderHistorias() {
    const historias = JSON.parse(localStorage.getItem('ctp_historia') || "[]");
    let html = '<ul class="historia-list">';
    historias.forEach((h, i) => {
      html += `<li>
        <strong>${h.fecha}</strong>: ${h.texto}
        ${h.url ? ` <a href="${h.url}" target="_blank">[${idioma==='es'?"Ver documento":"See document"}]</a>` : ""}
        <button class="delete-historia" data-idx="${i}">&times;</button>
      </li>`;
    });
    html += '</ul>';
    document.getElementById('historiaList').innerHTML = html;
    document.querySelectorAll('.delete-historia').forEach(btn => btn.onclick = () => {
      const idx = btn.dataset.idx;
      historias.splice(idx,1);
      localStorage.setItem('ctp_historia', JSON.stringify(historias));
      renderHistorias();
      showToast(t("toastEliminado"));
    });
  }
}

// ---- Signos vitales ----
function initSignosPanel() {
  const form = document.getElementById('formSignos');
  form.onsubmit = e => {
    e.preventDefault();
    const signo = {
      fecha: new Date().toISOString().substring(0,10),
      temp: form.sTemp.value,
      presion: form.sPresion.value,
      fc: form.sFC.value,
      satO2: form.sSatO2.value,
      peso: form.sPeso.value,
      altura: form.sAltura.value
    };
    const signos = JSON.parse(localStorage.getItem('ctp_signos') || "[]");
    signos.push(signo);
    localStorage.setItem('ctp_signos', JSON.stringify(signos));
    renderSignos();
    form.reset();
    showToast(t("toastGuardado"));
  };
  renderSignos();
  function renderSignos() {
    const signos = JSON.parse(localStorage.getItem('ctp_signos') || "[]");
    let html = '<table class="signos-table"><thead><tr><th>Fecha</th><th>Temp</th><th>Presión</th><th>FC</th><th>O₂</th><th>Peso</th><th>Altura</th><th></th></tr></thead><tbody>';
    signos.forEach((s, i) => {
      html += `<tr>
        <td>${s.fecha}</td>
        <td>${s.temp}</td>
        <td>${s.presion}</td>
        <td>${s.fc}</td>
        <td>${s.satO2}</td>
        <td>${s.peso}</td>
        <td>${s.altura}</td>
        <td><button class="delete-signo" data-idx="${i}">&times;</button></td>
      </tr>`;
    });
    html += '</tbody></table>';
    document.getElementById('signosList').innerHTML = html;
    document.querySelectorAll('.delete-signo').forEach(btn => btn.onclick = () => {
      signos.splice(btn.dataset.idx,1);
      localStorage.setItem('ctp_signos', JSON.stringify(signos));
      renderSignos();
      drawChart();
      showToast(t("toastEliminado"));
    });
    drawChart();
  }
  // Gráfico dinámico con canvas nativo
  function drawChart() {
    const signos = JSON.parse(localStorage.getItem('ctp_signos') || "[]");
    const canvas = document.getElementById('chartSignos');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0,0,canvas.width,canvas.height);
    const tempVals = signos.map(s => parseFloat(s.temp)).filter(Number.isFinite);
    const fcVals = signos.map(s => parseFloat(s.fc)).filter(Number.isFinite);
    const fechas = signos.map(s => s.fecha);
    ctx.font = "12px Inter";
    ctx.strokeStyle = "#ccc";
    ctx.beginPath();
    ctx.moveTo(40,20); ctx.lineTo(40,160); ctx.lineTo(380,160); ctx.stroke();
    ctx.strokeStyle = "#1976d2";
    ctx.beginPath();
    tempVals.forEach((v,i) => {
      const x = 40 + i*(340/(tempVals.length-1||1));
      const y = 160 - ((v-35)*16);
      if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
      ctx.arc(x,y,2,0,2*Math.PI);
    });
    ctx.stroke();
    ctx.fillStyle="#1976d2"; ctx.fillText("Temp",10,30);
    ctx.strokeStyle="#ffb74d";
    ctx.beginPath();
    fcVals.forEach((v,i) => {
      const x = 40 + i*(340/(fcVals.length-1||1));
      const y = 160 - ((v-50)*1.1);
      if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
      ctx.arc(x,y,2,0,2*Math.PI);
    });
    ctx.stroke();
    ctx.fillStyle="#ffb74d"; ctx.fillText("FC",10,50);
    ctx.fillStyle="#222";
    fechas.forEach((f,i) => {
      const x = 40 + i*(340/(fechas.length-1||1));
      ctx.fillText(f, x-15,170);
    });
  }
}

// ---- Exámenes ----
function initExamenesPanel() {
  const form = document.getElementById('formExamen');
  form.onsubmit = e => {
    e.preventDefault();
    if(form.eTipo.value.length < 2) return showToast("Campo requerido",true);
    const examen = {
      fecha: form.eFecha.value,
      tipo: form.eTipo.value,
      resultado: form.eResultado.value,
      url: form.eURL.value
    };
    const examenes = JSON.parse(localStorage.getItem('ctp_examenes') || "[]");
    examenes.push(examen);
    localStorage.setItem('ctp_examenes', JSON.stringify(examenes));
    renderExamenes();
    form.reset();
    showToast(t("toastGuardado"));
  };
  renderExamenes();
  function renderExamenes() {
    const examenes = JSON.parse(localStorage.getItem('ctp_examenes') || "[]");
    let html = '<ul class="examen-list">';
    examenes.forEach((e, i) => {
      html += `<li>
        <strong>${e.fecha}</strong> [${e.tipo}] - ${e.resultado}
        ${e.url ? ` <a href="${e.url}" target="_blank">[${idioma==='es'?"Ver resultado":"See result"}]</a>` : ""}
        <button class="delete-examen" data-idx="${i}">&times;</button>
      </li>`;
    });
    html += '</ul>';
    document.getElementById('examenList').innerHTML = html;
    document.querySelectorAll('.delete-examen').forEach(btn => btn.onclick = () => {
      examenes.splice(btn.dataset.idx,1);
      localStorage.setItem('ctp_examenes', JSON.stringify(examenes));
      renderExamenes();
      showToast(t("toastEliminado"));
    });
  }
}

// ---- Alergias ----
function initAlergiasPanel() {
  const form = document.getElementById('formAlergia');
  form.onsubmit = e => {
    e.preventDefault();
    if(form.aTipo.value.length < 2 || !form.aGravedad.value) return showToast("Campo requerido",true);
    const alergia = {
      tipo: form.aTipo.value,
      gravedad: form.aGravedad.value,
      reaccion: form.aReaccion.value
    };
    const alergias = JSON.parse(localStorage.getItem('ctp_alergias') || "[]");
    alergias.push(alergia);
    localStorage.setItem('ctp_alergias', JSON.stringify(alergias));
    renderAlergias();
    form.reset();
    showToast(t("toastGuardado"));
  };
  renderAlergias();
  function renderAlergias() {
    const alergias = JSON.parse(localStorage.getItem('ctp_alergias') || "[]");
    let html = '<ul class="alergia-list">';
    alergias.forEach((a, i) => {
      html += `<li>
        <strong>${a.tipo}</strong> (${a.gravedad}) ${a.reaccion ? "- "+a.reaccion : ""}
        <button class="delete-alergia" data-idx="${i}">&times;</button>
      </li>`;
    });
    html += '</ul>';
    document.getElementById('alergiaList').innerHTML = html;
    document.querySelectorAll('.delete-alergia').forEach(btn => btn.onclick = () => {
      alergias.splice(btn.dataset.idx,1);
      localStorage.setItem('ctp_alergias', JSON.stringify(alergias));
      renderAlergias();
      showToast(t("toastEliminado"));
    });
  }
}

// ---- Notas enriquecidas ----
function initNotasPanel() {
  const form = document.getElementById('formNota');
  const editor = document.getElementById('notaContent');
  document.querySelectorAll('.nota-bt').forEach(bt => {
    if(bt.id === 'imgInsertBtn') {
      bt.onclick = () => {
        const url = prompt("URL de la imagen:");
        if(url) document.execCommand('insertImage', false, url);
      };
    } else {
      bt.onclick = () => document.execCommand(bt.dataset.cmd, false, null);
    }
  });
  form.onsubmit = e => {
    e.preventDefault();
    if(editor.innerText.length < 2) return showToast("Campo requerido",true);
    const nota = {
      html: editor.innerHTML,
      fecha: new Date().toLocaleString()
    };
    const notas = JSON.parse(localStorage.getItem('ctp_notas') || "[]");
    notas.push(nota);
    localStorage.setItem('ctp_notas', JSON.stringify(notas));
    renderNotas();
    editor.innerHTML = '';
    showToast(t("toastGuardado"));
  };
  renderNotas();
  function renderNotas() {
    const notas = JSON.parse(localStorage.getItem('ctp_notas') || "[]");
    let html = '<ul class="notas-list">';
    notas.forEach((n, i) => {
      html += `<li>
        <span class="nota-fecha">${n.fecha}</span>
        <div class="nota-html">${n.html}</div>
        <button class="delete-nota" data-idx="${i}">&times;</button>
      </li>`;
    });
    html += '</ul>';
    document.getElementById('notasList').innerHTML = html;
    document.querySelectorAll('.delete-nota').forEach(btn => btn.onclick = () => {
      notas.splice(btn.dataset.idx,1);
      localStorage.setItem('ctp_notas', JSON.stringify(notas));
      renderNotas();
      showToast(t("toastEliminado"));
    });
  }
}

// ---- Educación: búsqueda web ----
function initEducacionPanel() {
  const form = document.getElementById('formEducacion');
  const queryInput = document.getElementById('eduQuery');
  const resultado = document.getElementById('eduResultado');
  form.onsubmit = async e => {
    e.preventDefault();
    const term = queryInput.value.trim();
    resultado.innerHTML = (idioma==='es'?"Buscando...":"Searching...");
    try {
      const res = await fetch(`https://es.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(term)}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      if (data.title && data.extract) {
        resultado.innerHTML = `
          <h3>${data.title}</h3>
          <p>${data.extract}</p>
          ${data.thumbnail ? `<img src="${data.thumbnail.source}" alt="Ilustración" style="max-width:120px" />` : ""}
          <p><a href="${data.content_urls?.desktop?.page}" target="_blank">${idioma==='es'?"Ver más en Wikipedia":"See on Wikipedia"}</a></p>
        `;
      } else {
        resultado.innerHTML = (idioma==='es'?"No se encontraron resultados.":"No results found.");
      }
    } catch {
      resultado.innerHTML = (idioma==='es'?"Error de conexión o no hay resultados.":"Connection error or no results.");
      showToast(t("error"),true);
    }
  };
}

// ---- Configuración y accesibilidad ----
function initConfigPanel() {
  const form = document.getElementById('formConfig');
  const idiomaSel = document.getElementById('cfgIdioma');
  const fuenteGrande = document.getElementById('cfgFuenteGrande');
  const altoContraste = document.getElementById('cfgAltoContraste');
  const config = JSON.parse(localStorage.getItem('ctp_config') || '{}');
  idiomaSel.value = config.idioma || idioma;
  fuenteGrande.checked = !!config.fuenteGrande;
  altoContraste.checked = !!config.altoContraste;
  form.onsubmit = e => {
    e.preventDefault();
    localStorage.setItem('ctp_config', JSON.stringify({
      idioma: idiomaSel.value,
      fuenteGrande: fuenteGrande.checked,
      altoContraste: altoContraste.checked
    }));
    idioma = idiomaSel.value;
    langToggle.textContent = idioma.toUpperCase();
    showPanel(currentTab);
    root.setAttribute('data-accessibility', fuenteGrande.checked ? 'large-font' : '');
    root.setAttribute('data-accessibility', altoContraste.checked ? 'high-contrast' : '');
    showToast(t("toastGuardado"));
  };
  root.setAttribute('data-accessibility', fuenteGrande.checked ? 'large-font' : '');
  root.setAttribute('data-accessibility', altoContraste.checked ? 'high-contrast' : '');
}
