self.addEventListener("install", event => self.skipWaiting());
self.addEventListener("activate", event => event.waitUntil(self.clients.claim()));

self.addEventListener("notificationclick", event => {
  event.notification.close();
  event.waitUntil(clients.openWindow("/"));
});

// Escuta mensagens vindas da página
self.addEventListener("message", event => {
  if (event.data && event.data.type === "SCHEDULE_TASK") {
    const { text, desc, time, date, tag } = event.data;
    const timestamp = new Date(date + "T" + time).getTime();
    self.registration.showNotification(text, {
      body: desc,
      tag,
      data: { timestamp }
    });
  }
});
