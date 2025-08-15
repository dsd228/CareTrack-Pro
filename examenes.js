export function panelExamenes() {
  return `
  <section class="spa-panel">
    <h2>Exámenes</h2>
    <div class="form-row">
      <label for="examenes_texto">Exámenes realizados</label>
      <textarea id="examenes_texto"></textarea>
    </div>
    <div class="form-actions">
      <button id="examenes_limpiar" type="button">Limpiar</button>
    </div>
  </section>
  `;
}

export function panelExamenesInit() {
  document.getElementById('examenes_limpiar').onclick = () => {
    document.getElementById('examenes_texto').value = '';
  };
}
