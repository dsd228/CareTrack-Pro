// storage.js
const PREFIX = 'paciente_';

export function savePacienteField(field, value) {
  localStorage.setItem(PREFIX + field, value);
}
export function loadPacienteData() {
  return {
    nombre: localStorage.getItem(PREFIX + 'nombre') || '',
    email: localStorage.getItem(PREFIX + 'email') || '',
    edad: localStorage.getItem(PREFIX + 'edad') || '',
    otros: localStorage.getItem(PREFIX + 'otros') || ''
  };
}
export function clearPacienteData() {
  Object.keys(localStorage)
    .filter(key => key.startsWith(PREFIX))
    .forEach(key => localStorage.removeItem(key));
}
