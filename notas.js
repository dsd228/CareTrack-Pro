export function panelNotas() {
  return `
  <section class="spa-panel">
    <h2>Notas</h2>
    <div class="form-row">
      <label for="notas_texto">Notas adicionales</label>
      <textarea id="notas_texto"></textarea>
    </div>
    <div class="form-actions">
      <button id="notas_limpiar" type="button">Limpiar</button>
    </div>
  </section>
  `;
}

export function panelNotasInit() {
  document.getElementById('notas_limpiar').onclick = () => {
    document.getElementById('notas_texto').value = '';
  };
}
