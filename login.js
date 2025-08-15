export function panelLogin() {
  return `
  <section class="spa-panel">
    <h2>Iniciar sesión</h2>
    <div class="form-row">
      <label for="login_email">Email</label>
      <input type="email" id="login_email" />
    </div>
    <div class="form-row">
      <label for="login_pass">Contraseña</label>
      <input type="password" id="login_pass" />
    </div>
    <div class="form-actions">
      <button id="login_btn" type="button">Entrar</button>
    </div>
  </section>
  `;
}
export function panelLoginInit() {
  document.getElementById('login_btn').onclick = () => {
    // Lógica de login
    alert("Login no implementado");
  };
}
