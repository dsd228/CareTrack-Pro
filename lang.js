// Diccionario y cambio de idioma
export const LANG = {
  es: { guardar:"Guardar", buscar:"Buscar paciente...", /* ... */ },
  en: { guardar:"Save", buscar:"Search patient...", /* ... */ }
};
let idioma = localStorage.getItem('ctp_idioma') || 'es';
export function t(key) { return LANG[idioma][key] || key; }
export function setLang() {
  idioma = idioma === 'es' ? 'en' : 'es';
  localStorage.setItem('ctp_idioma', idioma);
  document.getElementById('langToggle').textContent = idioma.toUpperCase();
}
