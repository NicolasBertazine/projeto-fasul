self.addEventListener("install", event => self.skipWaiting());
self.addEventListener("activate", event => event.waitUntil(self.clients.claim()));

self.addEventListener("notificationclick", event => {
  event.notification.close();
  event.waitUntil(clients.openWindow("/"));
});

// Escuta mensagens vindas da página
self.addEventListener("message", event => {
  if (event.data && event.data.type === "SCHEDULE_TASK") {
    const { text, desc, timestamp, tag } = event.data;
    const delay = timestamp - Date.now();

    if (delay > 0) {
      setTimeout(() => {
        self.registration.showNotification(text, {
          body: desc,
          tag,
          data: { timestamp }
        });
      }, delay);
    }
  }
});

