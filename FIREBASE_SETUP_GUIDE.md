# Firebase Push Notification Setup Guide

## ✅ Implementation Complete!

Firebase push notifications have been successfully implemented following the SOP. All code files are in place.

---

## 🔧 REQUIRED: Manual Firebase Configuration

Before the push notifications will work, you need to:

### 1. Create Firebase Project & Get Credentials

#### Step 1.1: Create Firebase Project
1. Go to https://console.firebase.google.com
2. Click "Create Project" or "Add Project"
3. Enter project name (e.g., "Hire-XO Notifications")
4. Click Continue
5. Disable Google Analytics (optional)
6. Click "Create Project"

#### Step 1.2: Add Web App
1. In Firebase Console, click the Web icon (</>) to add a web app
2. Register app nickname (e.g., "Hire-XO Web")
3. Do NOT check "Firebase Hosting"
4. Click "Register app"
5. **COPY** the firebaseConfig object - you'll need these values!

Example of what you'll see:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",
  authDomain: "hire-xo-xxx.firebaseapp.com",
  projectId: "hire-xo-xxx",
  storageBucket: "hire-xo-xxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc..."
};
```

#### Step 1.3: Enable Cloud Messaging & Get VAPID Key
1. In Firebase Console, go to Project Settings (gear icon)
2. Click on "Cloud Messaging" tab
3. Scroll to "Web configuration" section
4. Click "Generate key pair" button
5. **COPY** the generated key (starts with "B...")

#### Step 1.4: Generate Service Account Key (Backend)
1. In Firebase Console, go to Project Settings
2. Click "Service Accounts" tab
3. Click "Generate new private key" button
4. Click "Generate Key" - a JSON file will download
5. **SAVE** this file securely - you'll add it to backend

---

### 2. Configure Frontend (.env file)

Create or update `frontend/.env` file with your Firebase credentials:

```env
VITE_FIREBASE_API_KEY=YOUR_API_KEY_FROM_STEP_1.2
VITE_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN_FROM_STEP_1.2
VITE_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID_FROM_STEP_1.2
VITE_FIREBASE_STORAGE_BUCKET=YOUR_STORAGE_BUCKET_FROM_STEP_1.2
VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID_FROM_STEP_1.2
VITE_FIREBASE_APP_ID=YOUR_APP_ID_FROM_STEP_1.2
VITE_FIREBASE_VAPID_KEY=YOUR_VAPID_KEY_FROM_STEP_1.3
```

### 3. Configure Service Worker

The system is now configured to pass Firebase credentials to the Service Worker dynamically during registration. This means you **no longer need to hardcode keys** in `frontend/public/firebase-messaging-sw.js`.

The Service Worker will automatically parse the configuration from its registration URL, which is constructed using the environment variables defined in your `frontend/.env` file.

**Note**: Ensure your `frontend/.env` variables (Step 2) are correct, as they are now the single source of truth for both the main app and the background Service Worker.


### 4. Configure Backend

#### 4.1: Add Service Account Key File
1. Copy the JSON file downloaded in Step 1.4
2. Save it as `backend/src/config/serviceAccountKey.json`
3. **IMPORTANT**: Add to `.gitignore` to prevent committing:
   ```
   src/config/serviceAccountKey.json
   ```

#### 4.2: Add to Backend .env (Optional)
If you want to customize the path:
```env
FIREBASE_SERVICE_ACCOUNT_PATH=./src/config/serviceAccountKey.json
```

---

## 🧪 Testing the Implementation

### Test 1: Permission Request
1. Start frontend: `cd frontend && npm run dev`
2. Start backend: `cd backend && npm run dev`
3. Login to the application
4. Browser should prompt for notification permission
5. Click "Allow"
6. Check browser console - should see "FCM Token: ..." logged

### Test 2: Token Stored in Database
1. After allowing notifications, open MongoDB
2. Find your user document
3. Verify `fcmTokens` array contains at least one token

### Test 3: Send Test Notification
Use Postman or curl to send a test notification:

```bash
curl -X POST http://localhost:5000/api/notifications/send \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN" \
  -d '{
    "userId": "USER_ID_FROM_MONGODB",
    "title": "Test Notification",
    "body": "This is a test push notification!"
  }'
```

**Expected**: Notification should appear in browser!

---

## 📁 Files Created/Modified

### Frontend
- ✅ `src/firebase.ts` - Firebase initialization
- ✅ `public/firebase-messaging-sw.js` - Service worker for background notifications
- ✅ `src/lib/notifications.ts` - Notification utilities
- ✅ `src/store/useAuthStore.ts` - Added notification initialization
- ✅ `.env.example` - Environment template

### Backend
- ✅ `src/config/firebaseAdmin.ts` - Firebase Admin SDK setup
- ✅ `src/controllers/notificationController.ts` - Notification endpoints
- ✅ `src/routes/notification.routes.ts` - API routes
- ✅ `src/models/user.model.ts` - Added fcmTokens field
- ✅ `src/config/serviceAccountKey.example.json` - Template file
- ✅ `.gitignore.firebase` - Git ignore rules

---

## 🔒 Security Checklist

- ✅ Service account key NOT committed to git (add to .gitignore!)
- ✅ Send notification API protected with admin role
- ✅ Invalid tokens automatically cleaned up
- ✅ All notification routes require authentication
- ⚠️  **IMPORTANT**: Add `src/config/serviceAccountKey.json` to `.gitignore`

---

## 🚀 Production Deployment

Before deploying to production:

1. ✅ Ensure website is served over HTTPS (required for service workers)
2. ✅ Verify service worker is accessible at: `https://yourdomain.com/firebase-messaging-sw.js`
3. ✅ Test notifications on production URL
4. ✅ Enable CORS for your production domain in backend
5. ✅ Secure service account key file on server
6. ✅ Monitor Firebase console for notification delivery stats

---

## 📚 API Endpoints

### `POST /api/notifications/save-token`
Save FCM token for current user (authenticated)
```json
{
  "token": "fcm_token_here"
}
```

### `DELETE /api/notifications/remove-token`
Remove FCM token (authenticated)
```json
{
  "token": "fcm_token_here"
}
```

### `POST /api/notifications/send`
Send notification to user (admin only)
```json
{
  "userId": "user_id",
  "title": "Notification Title",
  "body": "Notification message",
  "data": { "optional": "data" }
}
```

### `POST /api/notifications/send-bulk`
Send notification to multiple users (admin only)
```json
{
  "userIds": ["user_id_1", "user_id_2"],
  "title": "Bulk Notification",
  "body": "Message for all users"
}
```

---

## ❓ Troubleshooting

**Notifications not appearing?**
- Check browser console for errors
- Verify permission was granted
- Ensure service worker is registered (DevTools → Application → Service Workers)
- Verify FCM token was saved to database
- Check backend console for error messages

**Service account error?**
- Verify `serviceAccountKey.json` exists at correct path
- Ensure JSON file is valid (check for syntax errors)
- Verify file path in environment variable or code

**Token not saving?**
- Check network tab - is the API call succeeding?
- Verify user is authenticated (check JWT token)
- Check backend logs for errors

---

## 🎉 You're Done!

Once you complete the manual configuration steps above, your push notification system will be fully functional!

**Need help?** Check the Firebase Console for detailed logs and debugging information.
