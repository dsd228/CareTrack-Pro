// historia.js
export function panelHistoria() {
  return `
  <section class="spa-panel">
    <h2>Historia Clínica</h2>
    <div class="form-row">
      <label for="historia_texto">Resumen historia clínica</label>
      <textarea id="historia_texto"></textarea>
    </div>
    <div class="form-actions">
      <button id="historia_limpiar" type="button">Limpiar</button>
    </div>
  </section>
  `;
}

export function panelHistoriaInit() {
  const historia = document.getElementById('historia_texto');
  const limpiarBtn = document.getElementById('historia_limpiar');
  limpiarBtn.addEventListener('click', () => {
    historia.value = '';
  });
}
