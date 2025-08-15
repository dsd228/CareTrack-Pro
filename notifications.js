// notifications.js

export function showNotification(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg.text || msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

export function setupRealtimeNotifications(userId, cb) {
  // Implementación pendiente
  // cb({ text: "Notificaciones en tiempo real no implementadas aún." });
}
