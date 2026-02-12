// Import Firebase Scripts for Service Worker
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js');

// Initialize Firebase in Service Worker
firebase.initializeApp({
    apiKey: "AIzaSyAvfyF1Pa-SWZoXOlgx4d70260PzIaphco",
    authDomain: "hirexo-b9be4.firebaseapp.com",
    projectId: "hirexo-b9be4",
    storageBucket: "hirexo-b9be4.firebasestorage.app",
    messagingSenderId: "305997281360",
    appId: "1:305997281360:web:7ab1b1593bee5d6312b955"
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage(function (payload) {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);

    const notificationTitle = payload.notification?.title || 'New Notification';
    const notificationOptions = {
        body: payload.notification?.body || 'You have a new notification',
        icon: '/logo pngg.png',
        badge: '/logo pngg.png',
        data: payload.data
    };

    return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', function (event) {
    console.log('[firebase-messaging-sw.js] Notification click received.');

    event.notification.close();

    // Open the app when notification is clicked
    event.waitUntil(
        clients.openWindow('/')
    );
});
