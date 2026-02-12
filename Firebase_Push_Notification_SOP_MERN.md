# Firebase Push Notification Implementation SOP (MERN Stack)

## Project Objective

Implement Firebase Cloud Messaging (FCM) push notifications in a MERN
(MongoDB, Express, React, Node.js) web application with production-ready
architecture.

------------------------------------------------------------------------

# 1. Architecture Overview

User → React App → Request Permission → Generate FCM Token →\
Send Token to Backend → Store in MongoDB →\
Backend uses Firebase Admin SDK → Send Push Notification → Browser
Displays Notification

------------------------------------------------------------------------

# 2. Prerequisites

-   MERN stack application ready
-   MongoDB connected
-   HTTPS enabled (required for production)
-   Firebase account

------------------------------------------------------------------------

# 3. Firebase Setup

## 3.1 Create Firebase Project

1.  Go to https://console.firebase.google.com
2.  Click "Create Project"
3.  Name the project
4.  Disable Google Analytics (optional)

------------------------------------------------------------------------

## 3.2 Add Web App

1.  Click "Add App" → Web
2.  Register the app
3.  Copy Firebase configuration

Example:

``` javascript
const firebaseConfig = {
  apiKey: "XXXX",
  authDomain: "XXXX",
  projectId: "XXXX",
  storageBucket: "XXXX",
  messagingSenderId: "XXXX",
  appId: "XXXX"
};
```

------------------------------------------------------------------------

## 3.3 Enable Cloud Messaging

1.  Go to Project Settings → Cloud Messaging
2.  Generate Web Push Certificate
3.  Copy VAPID key

------------------------------------------------------------------------

# 4. React Frontend Implementation

## 4.1 Install Firebase

``` bash
npm install firebase
```

------------------------------------------------------------------------

## 4.2 Create Firebase Config File

`/src/firebase.js`

``` javascript
import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = { /* your config */ };

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);
```

------------------------------------------------------------------------

## 4.3 Create Service Worker

Create file:

`/public/firebase-messaging-sw.js`

``` javascript
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js');

firebase.initializeApp({ /* same config */ });

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/logo192.png"
  });
});
```

------------------------------------------------------------------------

## 4.4 Request Permission & Get Token

`/src/notification.js`

``` javascript
import { getToken } from "firebase/messaging";
import { messaging } from "./firebase";

export const requestPermission = async () => {
  const permission = await Notification.requestPermission();

  if (permission === "granted") {
    const token = await getToken(messaging, {
      vapidKey: "YOUR_VAPID_KEY"
    });

    return token;
  }
};
```

Call after user login:

``` javascript
useEffect(() => {
  const setupNotifications = async () => {
    const token = await requestPermission();

    if (token) {
      await axios.post("/api/notifications/save-token", { token });
    }
  };

  setupNotifications();
}, []);
```

------------------------------------------------------------------------

## 4.5 Foreground Listener

``` javascript
import { onMessage } from "firebase/messaging";
import { messaging } from "./firebase";

useEffect(() => {
  onMessage(messaging, (payload) => {
    alert(payload.notification.title);
  });
}, []);
```

------------------------------------------------------------------------

# 5. Backend Implementation

## 5.1 Install Firebase Admin

``` bash
npm install firebase-admin
```

------------------------------------------------------------------------

## 5.2 Generate Service Account Key

Firebase Console → Project Settings → Service Accounts → Generate New
Private Key

Download JSON file and store securely in backend.

------------------------------------------------------------------------

## 5.3 Initialize Firebase Admin

`/backend/config/firebaseAdmin.js`

``` javascript
import admin from "firebase-admin";
import serviceAccount from "./serviceAccountKey.json" assert { type: "json" };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;
```

------------------------------------------------------------------------

## 5.4 MongoDB Schema

Add to User model:

``` javascript
fcmToken: {
  type: String,
}
```

OR multiple devices:

``` javascript
fcmTokens: [String]
```

------------------------------------------------------------------------

## 5.5 Save Token API

``` javascript
router.post("/save-token", authMiddleware, async (req, res) => {
  const { token } = req.body;

  await User.findByIdAndUpdate(req.user.id, {
    fcmToken: token,
  });

  res.json({ success: true });
});
```

------------------------------------------------------------------------

## 5.6 Send Notification API

``` javascript
router.post("/send", async (req, res) => {
  const { userId, title, body } = req.body;

  const user = await User.findById(userId);

  const message = {
    notification: { title, body },
    token: user.fcmToken,
  };

  await admin.messaging().send(message);

  res.json({ success: true });
});
```

------------------------------------------------------------------------

# 6. Production Checklist

-   Website must be HTTPS
-   Service worker accessible at:
    https://yourdomain.com/firebase-messaging-sw.js
-   Test in Chrome DevTools → Application → Service Workers
-   Store serviceAccount JSON securely
-   Protect send-notification API with admin role
-   Remove invalid tokens automatically

------------------------------------------------------------------------

# 7. Advanced Features

-   Topic-based notifications
-   Scheduled notifications (cron jobs)
-   Rich notifications with images
-   Deep linking on notification click
-   Multi-device token handling

------------------------------------------------------------------------

# 8. Testing Procedure

1.  Open website
2.  Allow notification permission
3.  Confirm token stored in MongoDB
4.  Trigger send API
5.  Confirm notification appears

------------------------------------------------------------------------

# 9. Security Best Practices

-   Never expose serviceAccountKey.json publicly
-   Use environment variables
-   Validate user roles before sending notifications
-   Handle invalid tokens
-   Log notification responses

------------------------------------------------------------------------

# End of SOP
