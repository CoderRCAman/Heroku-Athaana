const CACHE_NAME = "version-1";
const urlsToCache = ["index.html", "offline.html"];

const self = this;

// Install SW
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache");

      return cache.addAll(urlsToCache);
    })
  );
});

// Listen for requests
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then(() => {
      return fetch(event.request).catch(() => caches.match("offline.html"));
    })
  );
});

// Activate the SW
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [];
  cacheWhitelist.push(CACHE_NAME);

  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      )
    )
  );
});

//listen for push notifications
self.addEventListener("push", function (event) {
  if (event.data) {
    const promiseChain = self.registration
      .getNotifications()
      .then((notifications) => {
        let notificationCount = 0; //initial notification count
        notifications.forEach((element) => {
          notificationCount = parseInt(element.tag);
          element.close();
        });
        return notificationCount;
      })
      .then((notificationCount) => {
        let notificationTitle;
        const options = {
          icon: "https://res.cloudinary.com/vikrant001/image/upload/v1637346092/test/atha-preview_dh0osz.png",
          tag: (notificationCount+1).toString()
        };
        if (notificationCount > 0) {
          // We have an open notification, let's do something with it.
          options.body = `You have ${notificationCount + 1} new orders!.`;
          notificationTitle = `New Order Recieved!`;
          // Remember to close the old notification.
          //To Do -> bug on clearing previous notification
        } else {
          options.body = `with ID ${event.data.text()}`;
          notificationTitle = "New Order Recieved!";
        }
        return registration.showNotification(notificationTitle, options);
      });
    event.waitUntil(promiseChain); // to keep the browser busy and invoke the promise only when the promises are resolved
  }
});
// triger events on clicking notifications
self.addEventListener("notificationclick", function (event) {
  // check if tab is opened or move to a new tab
  const adminStatus = `https://${self.location.host}/status`;

  const urlToOpen = new URL(adminStatus, self.location.origin).href;
  const promiseChain = clients
    .matchAll({
      type: "window",
      includeUncontrolled: true,
    })
    .then((windowClients) => {
      let matchingClient = null;
      for (let i = 0; i < windowClients.length; i++) {
        const windowClient = windowClients[i];
        if (windowClient.url === urlToOpen) {
          matchingClient = windowClient;
          break;
        }
      }
      if (matchingClient) {
        return matchingClient.focus();
      } else {
        return clients.openWindow(urlToOpen);
      }
    });

  event.waitUntil(promiseChain);
});
