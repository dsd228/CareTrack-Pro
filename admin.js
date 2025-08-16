export function panelAdmin() {
  return `
  <section class="spa-panel">
    <h2>Panel de Administración</h2>
    <p>Solo visible para usuarios administradores.</p>
  </section>
  `;
}

export function panelAdminInit() { }

// ✅ Esta función es la que usa main.js
export function renderAdmin(container) {
  container.innerHTML = panelAdmin();
  panelAdminInit();
}
