import { login } from './auth.js';
import { showToast } from './toast.js';
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
    <div>
      <a href="#" id="to_registro">¿No tienes cuenta? Regístrate</a>
    </div>
  </section>
  `;
}
export function panelLoginInit() {
  document.getElementById('login_btn').onclick = async () => {
    const email = document.getElementById('login_email').value;
    const pass = document.getElementById('login_pass').value;
    try {
      await login(email, pass);
      showToast("Bienvenido");
    } catch (e) {
      showToast("Error de login", "info");
    }
  };
  document.getElementById('to_registro').onclick = (e) => {
    e.preventDefault();
    history.pushState({tab:"registro"}, '', "#registro");
    window.dispatchEvent(new PopStateEvent('popstate', { state:{tab:"registro"} }));
  };
}

// ✅ Esta función es la que usa main.js
export function renderLogin(container) {
  container.innerHTML = panelLogin();
  panelLoginInit();
}
