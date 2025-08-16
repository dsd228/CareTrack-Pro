import { register } from './auth.js';
import { showToast } from './toast.js';
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
    <div class="form-row">
      <label for="registro_rol">Rol</label>
      <select id="registro_rol">
        <option value="medico">Médico</option>
        <option value="admin">Admin</option>
      </select>
    </div>
    <div class="form-actions">
      <button id="registro_btn" type="button">Registrar</button>
    </div>
    <div>
      <a href="#" id="to_login">¿Ya tienes cuenta? Inicia sesión</a>
    </div>
  </section>
  `;
}
export function panelRegistroInit() {
  document.getElementById('registro_btn').onclick = async () => {
    const name = document.getElementById('registro_nombre').value;
    const email = document.getElementById('registro_email').value;
    const pass = document.getElementById('registro_pass').value;
    const rol = document.getElementById('registro_rol').value;
    try {
      await register(email, pass, name, rol);
      showToast("Registrado correctamente");
      history.pushState({tab:"paciente"}, '', "#paciente");
      window.dispatchEvent(new PopStateEvent('popstate', { state:{tab:"paciente"} }));
    } catch (e) {
      showToast("Error de registro", "info");
    }
  };
  document.getElementById('to_login').onclick = (e) => {
    e.preventDefault();
    history.pushState({tab:"login"}, '', "#login");
    window.dispatchEvent(new PopStateEvent('popstate', { state:{tab:"login"} }));
  };
}

// ✅ Esta función es la que usa main.js
export function renderRegistro(container) {
  container.innerHTML = panelRegistro();
  panelRegistroInit();
}
