export function panelSignos() {
  return `
  <section class="spa-panel">
    <h2>Signos Vitales</h2>
    <div class="form-row">
      <label for="signos_presion">Presión arterial</label>
      <input type="text" id="signos_presion" />
    </div>
    <div class="form-row">
      <label for="signos_temp">Temperatura</label>
      <input type="text" id="signos_temp" />
    </div>
    <div class="form-actions">
      <button id="signos_limpiar" type="button">Limpiar</button>
    </div>
  </section>
  `;
}

export function panelSignosInit() {
  document.getElementById('signos_limpiar').onclick = () => {
    document.getElementById('signos_presion').value = '';
    document.getElementById('signos_temp').value = '';
  };
}
