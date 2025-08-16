export function panelConfiguracion() {
  return `
  <section class="spa-panel">
    <h2>Configuración</h2>
    <div class="form-row">
      <label for="configuracion_tema">Tema</label>
      <select id="configuracion_tema">
        <option value="claro">Claro</option>
        <option value="oscuro">Oscuro</option>
      </select>
    </div>
    <div class="form-actions">
      <button id="configuracion_limpiar" type="button">Restaurar</button>
    </div>
  </section>
  `;
}
export function panelConfiguracionInit() {
  document.getElementById('configuracion_limpiar').onclick = () => {
    document.getElementById('configuracion_tema').value = 'claro';
  };
}

// ✅ Esta función es la que usa main.js
export function renderConfiguracion(container) {
  container.innerHTML = panelConfiguracion();
  panelConfiguracionInit();
}
