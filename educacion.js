export function panelEducacion() {
  return `
  <section class="spa-panel">
    <h2>Educación</h2>
    <div class="form-row">
      <label for="educacion_texto">Información educativa</label>
      <textarea id="educacion_texto"></textarea>
    </div>
    <div class="form-actions">
      <button id="educacion_limpiar" type="button">Limpiar</button>
    </div>
  </section>
  `;
}

export function panelEducacionInit() {
  document.getElementById('educacion_limpiar').onclick = () => {
    document.getElementById('educacion_texto').value = '';
  };
}
