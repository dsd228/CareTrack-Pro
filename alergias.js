export function panelAlergias() {
  return `
  <section class="spa-panel">
    <h2>Alergias</h2>
    <div class="form-row">
      <label for="alergias_texto">Alergias registradas</label>
      <textarea id="alergias_texto"></textarea>
    </div>
    <div class="form-actions">
      <button id="alergias_limpiar" type="button">Limpiar</button>
    </div>
  </section>
  `;
}

export function panelAlergiasInit() {
  document.getElementById('alergias_limpiar').onclick = () => {
    document.getElementById('alergias_texto').value = '';
  };
}
