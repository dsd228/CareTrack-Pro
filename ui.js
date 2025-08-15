import { t } from './lang.js';
import { buscarMedicamento, buscarWiki } from './api.js';

// --- Paneles HTML ---
// ... (import y paneles anteriores)
export const panels = {
  // ...otros paneles
  login: renderLoginPanel,
  registro: renderRegistroPanel,
  // ...
};

export const panelInit = {
  // ...otros paneles
  login: initLoginPanel,
  registro: initRegistroPanel,
  // ...
};

// ---- Login Panel ----
function renderLoginPanel() {
  return `
    <div class="card">
      <h2>Iniciar sesión</h2>
      <form id="formLogin" class="panel-form" autocomplete="off">
        <label>Email: <input type="email" id="loginEmail" required /></label>
        <label>Contraseña: <input type="password" id="loginPass" required /></label>
        <button type="submit">Entrar</button>
      </form>
      <p>¿No tienes cuenta? <button type="button" id="goRegistro">Regístrate</button></p>
      <div id="loginError" style="color:#f44336"></div>
    </div>
  `;
}
function initLoginPanel() {
  import('./auth.js').then(({ login }) => {
    document.getElementById('formLogin').onsubmit = async e => {
      e.preventDefault();
      const email = e.target.loginEmail.value;
      const pass = e.target.loginPass.value;
      try {
        await login(email, pass);
        location.reload(); // recarga para mostrar paneles del usuario
      } catch (err) {
        document.getElementById('loginError').textContent = "Error: " + (err.message || "Credenciales incorrectas");
      }
    };
  });
  document.getElementById('goRegistro').onclick = () => {
    window.location.hash = "#registro";
    // Si usas SPA, llama a showPanel("registro")
  };
}

// ---- Registro Panel ----
function renderRegistroPanel() {
  return `
    <div class="card">
      <h2>Registro de usuario</h2>
      <form id="formRegistro" class="panel-form" autocomplete="off">
        <label>Email: <input type="email" id="regEmail" required /></label>
        <label>Contraseña: <input type="password" id="regPass" required minlength="6" /></label>
        <label>Nombre completo: <input type="text" id="regName" required /></label>
        <label>Rol:
          <select id="regRole" required>
            <option value="medico">Médico</option>
            <option value="paciente">Paciente</option>
            <option value="admin">Admin</option>
          </select>
        </label>
        <button type="submit">Crear cuenta</button>
      </form>
      <p>¿Ya tienes cuenta? <button type="button" id="goLogin">Entrar</button></p>
      <div id="regError" style="color:#f44336"></div>
    </div>
  `;
}
function initRegistroPanel() {
  import('./auth.js').then(({ register }) => {
    document.getElementById('formRegistro').onsubmit = async e => {
      e.preventDefault();
      const email = e.target.regEmail.value;
      const pass = e.target.regPass.value;
      const name = e.target.regName.value;
      const role = e.target.regRole.value;
      try {
        await register(email, pass, name, role);
        location.reload(); // recarga para mostrar paneles del usuario
      } catch (err) {
        document.getElementById('regError').textContent = "Error: " + (err.message || "No se pudo registrar");
      }
    };
  });
  document.getElementById('goLogin').onclick = () => {
    window.location.hash = "#login";
    // Si usas SPA, llama a showPanel("login")
  };
}
export const panels = {
  paciente: renderPacientePanel,
  historia: renderHistoriaPanel,
  signos: renderSignosPanel,
  examenes: renderExamenesPanel,
  alergias: renderAlergiasPanel,
  notas: renderNotasPanel,
  educacion: renderEducacionPanel,
  configuracion: renderConfigPanel,
  admin: renderAdminPanel
};

export const panelInit = {
  paciente: initPacientePanel,
  historia: initHistoriaPanel,
  signos: initSignosPanel,
  examenes: initExamenesPanel,
  alergias: initAlergiasPanel,
  notas: initNotasPanel,
  educacion: initEducacionPanel,
  configuracion: initConfigPanel,
  admin: initAdminPanel
};

// ---- Paciente Panel ----
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
            <option value="Femenino">${t("Femenino")||"Femenino"}</option>
            <option value="Masculino">${t("Masculino")||"Masculino"}</option>
            <option value="Otro">${t("Otro")||"Otro"}</option>
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
function initPacientePanel() {
  // Implementación igual a la del main.js, reutilizable
  // Puedes importar funciones si lo prefieres. Aquí es ejemplo base.
  // ... (igual al ejemplo anterior, ver main.js)
}

// ---- Historia Clínica Panel ----
function renderHistoriaPanel() {
  return `
    <div class="card">
    <h2>${t("historia")}</h2>
    <form id="formHistoria" class="panel-form" autocomplete="off">
      <label>${t("Fecha")||"Fecha"}: <input type="date" id="hFecha" required /></label>
      <label>${t("Antecedentes / Diagnóstico")||"Antecedentes / Diagnóstico"}:
        <textarea id="hTexto" rows="3" required></textarea>
      </label>
      <label>${t("Documento/Imagen (URL)")||"Documento/Imagen (URL)"}: <input type="url" id="hURL" placeholder="https://..." /></label>
      <button type="submit">${t("agregar")}</button>
    </form>
    <div id="historiaList"></div>
    </div>
  `;
}
function initHistoriaPanel() {
  // Similar a main.js, implementa validación y renderizado
}

// ---- Signos Vitales Panel ----
function renderSignosPanel() {
  return `
    <div class="card">
    <h2>${t("signos")}</h2>
    <form id="formSignos" class="panel-form" autocomplete="off">
      <div class="form-row">
        <label>${t("Temperatura (°C)")||"Temperatura (°C)"}: <input type="number" id="sTemp" step="0.1" min="30" max="45" required /></label>
        <label>${t("Presión Arterial")||"Presión Arterial"}: <input type="text" id="sPresion" placeholder="Ej: 120/80" required /></label>
        <label>${t("Frecuencia Cardíaca")||"Frecuencia Cardíaca"}: <input type="number" id="sFC" min="30" max="220" required /></label>
      </div>
      <div class="form-row">
        <label>${t("Saturación O₂ (%)")||"Saturación O₂ (%)"}: <input type="number" id="sSatO2" min="50" max="100" required /></label>
        <label>${t("Peso (kg)")||"Peso (kg)"}: <input type="number" id="sPeso" step="0.1" min="2" max="300" required /></label>
        <label>${t("Altura (cm)")||"Altura (cm)"}: <input type="number" id="sAltura" min="30" max="250" required /></label>
      </div>
      <button type="submit">${t("agregar")}</button>
    </form>
    <canvas id="chartSignos" width="400" height="180" aria-label="Gráfico de signos vitales"></canvas>
    <div id="signosList"></div>
    </div>
  `;
}
function initSignosPanel() {
  // Validación y render igual que ejemplo anterior
}

// ---- Exámenes Panel ----
function renderExamenesPanel() {
  return `
    <div class="card">
    <h2>${t("examenes")}</h2>
    <form id="formExamen" class="panel-form" autocomplete="off">
      <label>${t("Fecha")||"Fecha"}: <input type="date" id="eFecha" required /></label>
      <label>${t("Tipo")||"Tipo"}: <input type="text" id="eTipo" required /></label>
      <label>${t("Resultado")||"Resultado"}: <input type="text" id="eResultado" /></label>
      <label>${t("Enlace a Resultados")||"Enlace a Resultados"}: <input type="url" id="eURL" placeholder="https://..." /></label>
      <button type="submit">${t("agregar")}</button>
    </form>
    <div id="examenList"></div>
    </div>
  `;
}
function initExamenesPanel() {
  // Igual que main.js
}

// ---- Alergias Panel ----
function renderAlergiasPanel() {
  return `
    <div class="card">
    <h2>${t("alergias")}</h2>
    <form id="formAlergia" class="panel-form" autocomplete="off">
      <label>${t("Tipo")||"Tipo"}: <input type="text" id="aTipo" required /></label>
      <label>${t("Gravedad")||"Gravedad"}:
        <select id="aGravedad" required>
          <option value="">${t("Seleccione")||"Seleccione"}</option>
          <option value="Leve">${t("Leve")||"Leve"}</option>
          <option value="Moderada">${t("Moderada")||"Moderada"}</option>
          <option value="Grave">${t("Grave")||"Grave"}</option>
        </select>
      </label>
      <label>${t("Reacción")||"Reacción"}: <input type="text" id="aReaccion" /></label>
      <button type="submit">${t("agregar")}</button>
    </form>
    <div id="alergiaList"></div>
    </div>
  `;
}
function initAlergiasPanel() {
  // Igual que main.js
}

// ---- Notas Panel ----
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
function initNotasPanel() {
  // Igual que main.js con execCommand y renderizado
}

// ---- Educación Panel ----
function renderEducacionPanel() {
  return `
    <div class="card">
    <h2>${t("educacion")}</h2>
    <form id="formEducacion" class="panel-form" autocomplete="off">
      <label>${t("Búsqueda web")||"Búsqueda web"}:
        <input type="search" id="eduInput" placeholder="${t("buscar")||"Buscar medicamento..."}" />
      </label>
    </form>
    <div id="eduResult"></div>
    </div>
  `;
}
function initEducacionPanel() {
  document.getElementById('eduInput').oninput = async function() {
    const term = this.value.trim();
    let html = "";
    if (term.length > 2) {
      html += "<h3>OpenFDA:</h3>";
      const med = await buscarMedicamento(term);
      html += med ? `<div>${med.brand_name || ""} - ${med.description || ""}</div>` : "<div>No encontrado</div>";
      html += "<h3>Wikipedia:</h3>";
      const wiki = await buscarWiki(term);
      html += wiki?.extract ? `<div>${wiki.extract}</div>` : "<div>No encontrado</div>";
    }
    document.getElementById('eduResult').innerHTML = html;
  };
}

// ---- Configuración Panel ----
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
function initConfigPanel() {
  // Igual a main.js
}

// ---- Admin Panel (solo admin) ----
function renderAdminPanel() {
  return `
    <div class="card">
      <h2>Panel de administrador</h2>
      <p>Aquí puedes gestionar usuarios, roles y revisar logs del sistema.</p>
      <!-- Puedes expandir con gestión real -->
    </div>
  `;
}
function initAdminPanel() {
  // Lógica adicional: mostrar usuarios, cambiar roles, etc.
}
