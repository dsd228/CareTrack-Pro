export function panelRegistro() {
  return `
  <section class="spa-panel">
    <h2>Registro de usuario</h2>
    <div class="form-row">
      <label for="registro_nombre">Nombre</label>
      <input type="text" id="registro_nombre" />
    </div>
    <div class="form-row">
      <label for="registro_email">Email</label>
      <input type="email" id="registro_email" />
    </div>
    <div class="form-row">
      <label for="registro_pass">Contraseña</label>
      <input type="password" id="registro_pass" />
    </div>
    <div class="form-actions">
      <button id="registro_btn" type="button">Registrar</button>
    </div>
  </section>
  `;
}
export function panelRegistroInit() {
  document.getElementById('registro_btn').onclick = () => {
    // Lógica de registro
    alert("Registro no implementado");
  };
}
