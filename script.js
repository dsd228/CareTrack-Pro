// CareTrack-Pro JS
// ===========================

/**
 * Utilidades para localStorage y manejo de datos
 */
function saveLocal(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}
function loadLocal(key, def) {
  const val = localStorage.getItem(key);
  if (val !== null) { try { return JSON.parse(val); } catch { return def; } }
  return def;
}

// ===========================
// Tema Claro/Oscuro
// ===========================
const themeToggle = document.getElementById('themeToggle');
function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  saveLocal('caretrack_theme', theme);
  themeToggle.innerHTML = theme === "dark" ? "🌙" : "☀️";
}
const storedTheme = loadLocal('caretrack_theme', 'light');
setTheme(storedTheme);
themeToggle.addEventListener('click', () => {
  setTheme(document.documentElement.getAttribute('data-theme') === "dark" ? "light" : "dark");
});

// ===========================
// Tabs Navegación
// ===========================
const tabs = document.querySelectorAll('.tab-btn');
const panels = document.querySelectorAll('.tab-panel');
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    panels.forEach(p => {
      if (p.id === 'tab-' + tab.dataset.tab) {
        p.classList.add('active');
      } else {
        p.classList.remove('active');
      }
    });
  });
});

// ===========================
// Formulario Paciente
// ===========================
const pacienteForm = document.getElementById('pacienteForm');
const pacienteNombre = document.getElementById('pacienteNombre');
const pacienteEdad = document.getElementById('pacienteEdad');
const pacienteSexo = document.getElementById('pacienteSexo');
const pacienteContacto = document.getElementById('pacienteContacto');
function loadPaciente() {
  const p = loadLocal('caretrack_paciente', {nombre:"",edad:"",sexo:"",contacto:""});
  pacienteNombre.value = p.nombre;
  pacienteEdad.value = p.edad;
  pacienteSexo.value = p.sexo;
  pacienteContacto.value = p.contacto;
}
pacienteForm.addEventListener('submit', e => {
  e.preventDefault();
  saveLocal('caretrack_paciente', {
    nombre: pacienteNombre.value,
    edad: pacienteEdad.value,
    sexo: pacienteSexo.value,
    contacto: pacienteContacto.value
  });
  alert("Datos del paciente guardados.");
});
loadPaciente();

// ===========================
// Historia Clínica
// ===========================
const historiaForm = document.getElementById('historiaForm');
const antecedentes = document.getElementById('antecedentes');
function loadHistoria() {
  antecedentes.value = loadLocal('caretrack_historia', "");
}
historiaForm.addEventListener('submit', e => {
  e.preventDefault();
  saveLocal('caretrack_historia', antecedentes.value);
  alert("Historia clínica guardada.");
});
loadHistoria();

// ===========================
// Signos Vitales
// ===========================
const signosForm = document.getElementById('signosForm');
const temperatura = document.getElementById('temperatura');
const presion = document.getElementById('presion');
const fc = document.getElementById('fc');
const peso = document.getElementById('peso');
function loadSignos() {
  const s = loadLocal('caretrack_signos', {});
  temperatura.value = s.temperatura || "";
  presion.value = s.presion || "";
  fc.value = s.fc || "";
  peso.value = s.peso || "";
}
signosForm.addEventListener('submit', e => {
  e.preventDefault();
  saveLocal('caretrack_signos', {
    temperatura: temperatura.value,
    presion: presion.value,
    fc: fc.value,
    peso: peso.value
  });
  alert("Signos vitales guardados.");
});
loadSignos();

// ===========================
// Exámenes
// ===========================
const examenForm = document.getElementById('examenForm');
const examenNombre = document.getElementById('examenNombre');
const examenResultado = document.getElementById('examenResultado');
const agregarExamen = document.getElementById('agregarExamen');
const examenesLista = document.getElementById('examenesLista');
function renderExamenes() {
  examenesLista.innerHTML = "";
  const examenes = loadLocal('caretrack_examenes', []);
  examenes.forEach((examen, i) => {
    const li = document.createElement('li');
    li.innerHTML = `<span><strong>${examen.nombre}</strong>: ${examen.resultado}</span>
      <button class="remove-btn" title="Eliminar" data-idx="${i}">&times;</button>`;
    examenesLista.appendChild(li);
  });
}
agregarExamen.addEventListener('click', () => {
  if (!examenNombre.value) return;
  const examenes = loadLocal('caretrack_examenes', []);
  examenes.push({nombre: examenNombre.value, resultado: examenResultado.value});
  saveLocal('caretrack_examenes', examenes);
  examenNombre.value = "";
  examenResultado.value = "";
  renderExamenes();
});
examenesLista.addEventListener('click', e => {
  if (e.target.classList.contains('remove-btn')) {
    const idx = parseInt(e.target.dataset.idx);
    const examenes = loadLocal('caretrack_examenes', []);
    examenes.splice(idx,1);
    saveLocal('caretrack_examenes', examenes);
    renderExamenes();
  }
});
renderExamenes();

// ===========================
// Alergias
// ===========================
const alergiaForm = document.getElementById('alergiaForm');
const alergiaInput = document.getElementById('alergiaInput');
const agregarAlergia = document.getElementById('agregarAlergia');
const alergiasLista = document.getElementById('alergiasLista');
function renderAlergias() {
  alergiasLista.innerHTML = "";
  const alergias = loadLocal('caretrack_alergias', []);
  alergias.forEach((alergia, i) => {
    const li = document.createElement('li');
    li.innerHTML = `<span>${alergia}</span>
      <button class="remove-btn" title="Eliminar" data-idx="${i}">&times;</button>`;
    alergiasLista.appendChild(li);
  });
}
agregarAlergia.addEventListener('click', () => {
  if (!alergiaInput.value) return;
  const alergias = loadLocal('caretrack_alergias', []);
  alergias.push(alergiaInput.value);
  saveLocal('caretrack_alergias', alergias);
  alergiaInput.value = "";
  renderAlergias();
});
alergiasLista.addEventListener('click', e => {
  if (e.target.classList.contains('remove-btn')) {
    const idx = parseInt(e.target.dataset.idx);
    const alergias = loadLocal('caretrack_alergias', []);
    alergias.splice(idx,1);
    saveLocal('caretrack_alergias', alergias);
    renderAlergias();
  }
});
renderAlergias();

// ===========================
// Notas Médicas
// ===========================
const notasForm = document.getElementById('notasForm');
const notasText = document.getElementById('notasText');
function loadNotas() {
  notasText.value = loadLocal('caretrack_notas', "");
}
notasForm.addEventListener('submit', e => {
  e.preventDefault();
  saveLocal('caretrack_notas', notasText.value);
  alert("Nota guardada.");
});
loadNotas();

// ===========================
// Educación para el paciente
// ===========================
const busquedaForm = document.getElementById('busquedaForm');
const busquedaInput = document.getElementById('busquedaInput');
const busquedaResultado = document.getElementById('busquedaResultado');
let educacionData = [];
function cargarEducacion() {
  fetch('educacion.json')
    .then(r => r.json())
    .then(data => educacionData = data)
    .catch(_ => {
      busquedaResultado.innerHTML = "No se pudo cargar la base educativa.";
      educacionData = [];
    });
}
// Busca en educacionData por nombre o término
function buscarEducacion(term) {
  term = term.trim().toLowerCase();
  if (!term || educacionData.length === 0) {
    busquedaResultado.innerHTML = "Ingrese un término para buscar.";
    return;
  }
  const resultados = educacionData.filter(item =>
    (item.nombre && item.nombre.toLowerCase().includes(term)) ||
    (item.tipo && item.tipo.toLowerCase().includes(term)) ||
    (item.descripcion && item.descripcion.toLowerCase().includes(term))
  );
  if (resultados.length === 0) {
    busquedaResultado.innerHTML = "No se encontraron resultados.";
    return;
  }
  busquedaResultado.innerHTML = resultados.map(item =>
    `<div>
      <strong>${item.nombre}</strong> <em>(${item.tipo})</em><br>
      <span>${item.descripcion}</span>
    </div><hr>`
  ).join('');
}
busquedaForm.addEventListener('submit', e => {
  e.preventDefault();
  buscarEducacion(busquedaInput.value);
});
cargarEducacion();

/* ============================
   Fin del JS
============================ */
