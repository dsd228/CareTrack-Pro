// CareTrack-Pro SPA avanzado JS

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

// --------- SPA Navegación Paneles ---------
const menuBtns = document.querySelectorAll('.menu-btn');
const mainContent = document.getElementById('main-content');
let currentTab = "paciente";
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
  setTimeout(() => { panelInit[tab]?.(); }, 30);
}
showPanel(currentTab);

// --------- Paneles HTML ---------
function renderPacientePanel() {
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
function renderNotasPanel() {
  return `
    <h2>Notas Médicas</h2>
    <form id="formNota" class="panel-form">
      <div id="notaEditor">
        <button type="button" class="nota-bt" data-cmd="bold"><b>B</b></button>
        <button type="button" class="nota-bt" data-cmd="italic"><i>I</i></button>
        <button type="button" class="nota-bt" data-cmd="insertUnorderedList">&#8226; Lista</button>
        <button type="button" class="nota-bt" id="imgInsertBtn">&#128247; Imagen</button>
      </div>
      <div contenteditable="true" id="notaContent" class="nota-content"></div>
      <button type="submit">Guardar Nota</button>
    </form>
    <div id="notasList"></div>
  `;
}
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

// --------- Pacientes ---------
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
  document.getElementById('searchPaciente').oninput = function() {
    renderPacientes(this.value);
  };
}

// --------- Historia Clínica ---------
function initHistoriaPanel() {
  const form = document.getElementById('formHistoria');
  form.onsubmit = e => {
    e.preventDefault();
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
  };
  renderHistorias();
  function renderHistorias() {
    const historias = JSON.parse(localStorage.getItem('ctp_historia') || "[]");
    let html = '<ul class="historia-list">';
    historias.forEach((h, i) => {
      html += `<li>
        <strong>${h.fecha}</strong>: ${h.texto}
        ${h.url ? ` <a href="${h.url}" target="_blank">[Ver documento]</a>` : ""}
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
    });
  }
}

// --------- Signos Vitales ---------
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
    ctx.font = "12px Segoe UI";
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

// --------- Exámenes ---------
function initExamenesPanel() {
  const form = document.getElementById('formExamen');
  form.onsubmit = e => {
    e.preventDefault();
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
  };
  renderExamenes();
  function renderExamenes() {
    const examenes = JSON.parse(localStorage.getItem('ctp_examenes') || "[]");
    let html = '<ul class="examen-list">';
    examenes.forEach((e, i) => {
      html += `<li>
        <strong>${e.fecha}</strong> [${e.tipo}] - ${e.resultado}
        ${e.url ? ` <a href="${e.url}" target="_blank">[Ver resultado]</a>` : ""}
        <button class="delete-examen" data-idx="${i}">&times;</button>
      </li>`;
    });
    html += '</ul>';
    document.getElementById('examenList').innerHTML = html;
    document.querySelectorAll('.delete-examen').forEach(btn => btn.onclick = () => {
      examenes.splice(btn.dataset.idx,1);
      localStorage.setItem('ctp_examenes', JSON.stringify(examenes));
      renderExamenes();
    });
  }
}

// --------- Alergias ---------
function initAlergiasPanel() {
  const form = document.getElementById('formAlergia');
  form.onsubmit = e => {
    e.preventDefault();
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
    });
  }
}

// --------- Notas enriquecidas ---------
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
    const nota = {
      html: editor.innerHTML,
      fecha: new Date().toLocaleString()
    };
    const notas = JSON.parse(localStorage.getItem('ctp_notas') || "[]");
    notas.push(nota);
    localStorage.setItem('ctp_notas', JSON.stringify(notas));
    renderNotas();
    editor.innerHTML = '';
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
    });
  }
}

// --------- Educación ---------
function initEducacionPanel() {
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

// --------- Configuración ---------
function initConfigPanel() {
  const form = document.getElementById('formConfig');
  const idiomaSel = document.getElementById('cfgIdioma');
  const fuenteGrande = document.getElementById('cfgFuenteGrande');
  const altoContraste = document.getElementById('cfgAltoContraste');
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
    root.setAttribute('data-accessibility', fuenteGrande.checked ? 'large-font' : '');
    root.setAttribute('data-accessibility', altoContraste.checked ? 'high-contrast' : '');
    alert("Configuración guardada.");
  };
  root.setAttribute('data-accessibility', fuenteGrande.checked ? 'large-font' : '');
  root.setAttribute('data-accessibility', altoContraste.checked ? 'high-contrast' : '');
}
