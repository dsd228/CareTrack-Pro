// ================================
// CareTrack-Pro Configuración JS
// ================================

/**
 * Utilidades para localStorage con JSON
 */
function saveLocal(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}
function loadLocal(key, defaultValue) {
  const val = localStorage.getItem(key);
  if (val !== null) {
    try { return JSON.parse(val); } catch { return defaultValue; }
  }
  return defaultValue;
}

// ================================
// Tema Claro/Oscuro
// ================================
const themeToggle = document.getElementById('themeToggle');
const themeSwitch = document.getElementById('themeSwitch');

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  saveLocal('config_theme', theme);
  // actualiza el switch
  if (themeSwitch) themeSwitch.checked = theme === "dark";
  // icono del botón
  themeToggle.innerHTML = theme === "dark"
    ? "🌙"
    : "☀️";
}

// Inicializa tema desde localStorage
const storedTheme = loadLocal('config_theme', 'light');
setTheme(storedTheme);

// Alternar tema por botón header
themeToggle.addEventListener('click', () => {
  const newTheme = document.documentElement.getAttribute('data-theme') === "dark" ? "light" : "dark";
  setTheme(newTheme);
});

// Alternar tema por switch en Preferencias
if (themeSwitch) {
  themeSwitch.addEventListener('change', () => {
    setTheme(themeSwitch.checked ? "dark" : "light");
  });
}

// ================================
// Acordeón Interactivo
// ================================
document.querySelectorAll('.accordion-header').forEach(header => {
  header.addEventListener('click', () => {
    const expanded = header.getAttribute('aria-expanded') === "true";
    // Cierra todas
    document.querySelectorAll('.accordion-header').forEach(h => h.setAttribute('aria-expanded', "false"));
    // Abre la seleccionada si estaba cerrada
    if (!expanded) header.setAttribute('aria-expanded', "true");
  });
});

// ================================
// Perfil de Usuario
// ================================
const userProfileForm = document.getElementById('userProfileForm');
const userNameInput = document.getElementById('userName');
const userEmailInput = document.getElementById('userEmail');
const userPhotoInput = document.getElementById('userPhoto');
const photoPreview = document.getElementById('photoPreview');

// Cargar perfil guardado
function loadProfile() {
  const profile = loadLocal('config_profile', { name: '', email: '', photo: '' });
  userNameInput.value = profile.name;
  userEmailInput.value = profile.email;
  if (profile.photo) showPhoto(profile.photo);
}
function showPhoto(base64) {
  photoPreview.innerHTML = `<img src="${base64}" alt="Foto de perfil">`;
}
userPhotoInput.addEventListener('change', e => {
  const file = e.target.files[0];
  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = function (ev) {
      showPhoto(ev.target.result);
    };
    reader.readAsDataURL(file);
  }
});

// Guardar perfil en localStorage
userProfileForm.addEventListener('submit', e => {
  e.preventDefault();
  let photo = photoPreview.querySelector('img')?.src || '';
  // Si la foto es dataurl, la guardamos
  if (userPhotoInput.files[0]) {
    const reader = new FileReader();
    reader.onload = function (ev) {
      photo = ev.target.result;
      saveLocal('config_profile', {
        name: userNameInput.value,
        email: userEmailInput.value,
        photo,
      });
      alert("Perfil guardado!");
    };
    reader.readAsDataURL(userPhotoInput.files[0]);
  } else {
    saveLocal('config_profile', {
      name: userNameInput.value,
      email: userEmailInput.value,
      photo,
    });
    alert("Perfil guardado!");
  }
});
loadProfile();

// ================================
// Preferencias (Idioma, Tema)
// ================================
const preferencesForm = document.getElementById('preferencesForm');
const languageSwitch = document.getElementById('languageSwitch');
const languageText = document.getElementById('languageText');

function loadPreferences() {
  const prefs = loadLocal('config_prefs', { language: 'es', dark: storedTheme === "dark" });
  languageSwitch.checked = prefs.language === "en";
  languageText.textContent = prefs.language === "en" ? "English" : "Español";
  themeSwitch.checked = prefs.dark;
}
if (preferencesForm) {
  loadPreferences();

  languageSwitch.addEventListener('change', () => {
    languageText.textContent = languageSwitch.checked ? "English" : "Español";
  });

  preferencesForm.addEventListener('submit', e => {
    e.preventDefault();
    saveLocal('config_prefs', {
      language: languageSwitch.checked ? "en" : "es",
      dark: themeSwitch.checked,
    });
    alert("Preferencias guardadas!");
  });
}

// ================================
// Seguridad (Contraseña/2FA)
// ================================
const securityForm = document.getElementById('securityForm');
const newPasswordInput = document.getElementById('newPassword');
const twoFASwitch = document.getElementById('twoFASwitch');

function loadSecurity() {
  const sec = loadLocal('config_security', { twoFA: false });
  twoFASwitch.checked = sec.twoFA;
}
if (securityForm) {
  loadSecurity();
  securityForm.addEventListener('submit', e => {
    e.preventDefault();
    const newPassword = newPasswordInput.value;
    const twoFA = twoFASwitch.checked;
    if (newPassword && newPassword.length < 6) {
      alert("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    saveLocal('config_security', { twoFA, password: newPassword || undefined });
    alert("Seguridad guardada!");
    newPasswordInput.value = '';
  });
}

// ================================
// Notificaciones
// ================================
const notificationsForm = document.getElementById('notificationsForm');
const notifEmail = document.getElementById('notifEmail');
const notifSMS = document.getElementById('notifSMS');
const notifPush = document.getElementById('notifPush');
const notifApp = document.getElementById('notifApp');

function loadNotifications() {
  const notifs = loadLocal('config_notifications', {
    email: false, sms: false, push: false, app: false
  });
  notifEmail.checked = notifs.email;
  notifSMS.checked = notifs.sms;
  notifPush.checked = notifs.push;
  notifApp.checked = notifs.app;
}
if (notificationsForm) {
  loadNotifications();

  notificationsForm.addEventListener('submit', e => {
    e.preventDefault();
    saveLocal('config_notifications', {
      email: notifEmail.checked,
      sms: notifSMS.checked,
      push: notifPush.checked,
      app: notifApp.checked
    });
    alert("Notificaciones guardadas!");
  });
}

// ================================
// FIN
// ================================
