// Import Firebase Scripts for Service Worker
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js');

// Initialize Firebase in Service Worker
const urlParams = new URL(self.location).searchParams;
let messaging;

if (urlParams.get('apiKey')) {
    firebase.initializeApp({
        apiKey: urlParams.get('apiKey'),
        authDomain: urlParams.get('authDomain'),
        projectId: urlParams.get('projectId'),
        storageBucket: urlParams.get('storageBucket'),
        messagingSenderId: urlParams.get('messagingSenderId'),
        appId: urlParams.get('appId')
    });
    messaging = firebase.messaging();
}

// Handle background messages
if (messaging) {
    messaging.onBackgroundMessage(function (payload) {
        console.log('[firebase-messaging-sw.js] Received background message ', payload);

        const notificationTitle = payload.notification?.title || 'New Notification';
        const notificationOptions = {
            body: payload.notification?.body || 'You have a new notification',
            icon: '/logo.png',
            badge: '/logo.png',
            data: payload.data
        };

        return self.registration.showNotification(notificationTitle, notificationOptions);
    });
}

// Handle notification click
self.addEventListener('notificationclick', function (event) {
    console.log('[firebase-messaging-sw.js] Notification click received.');

    event.notification.close();

    // Open the app when notification is clicked
    event.waitUntil(
        clients.openWindow('/')
    );
});
