# 🔧 HOW TO FIX: Update MongoDB Connection String

## Current Error:
```
connect ECONNREFUSED 127.0.0.1:27017
```

This means the backend is trying to connect to **local MongoDB** which isn't running.

---

## ✅ SOLUTION: Use MongoDB Atlas Connection String

### Step 1: Get Your Connection String from Atlas

1. Go to your MongoDB Atlas dashboard
2. Click **"Connect"** on your cluster
3. Click **"Drivers"**
4. Copy the connection string (looks like):
   ```
   mongodb+srv://username:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

### Step 2: Update backend/.env

Open `backend/.env` and replace line 10 with your connection string:

**BEFORE:**
```
MONGO_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/hire-xo?retryWrites=true&w=majority
```

**AFTER** (example):
```
MONGO_URI=mongodb+srv://hirexo_admin:HireXO2024!@cluster0.ab1cd.mongodb.net/hire-xo?retryWrites=true&w=majority
```

**IMPORTANT:**
- Replace `YOUR_USERNAME` with your Atlas username
- Replace `YOUR_PASSWORD` with your Atlas password
- Replace `YOUR_CLUSTER` with your actual cluster address
- Keep `/hire-xo` before the `?` (this is the database name)

### Step 3: Save the File

Once you save `.env`, nodemon will automatically:
1. Detect the change
2. Restart the backend
3. Connect to MongoDB Atlas
4. Show: `✅ MongoDB Connected`

---

## 📋 Example Connection Strings

### Format:
```
mongodb+srv://[username]:[password]@[cluster-address]/[database]?retryWrites=true&w=majority
```

### Example 1:
```
MONGO_URI=mongodb+srv://hirexo_admin:MyPass123@cluster0.abcde.mongodb.net/hire-xo?retryWrites=true&w=majority
```

### Example 2:
```
MONGO_URI=mongodb+srv://priyank:SecurePass456@hirexo-cluster.xyz12.mongodb.net/hire-xo?retryWrites=true&w=majority
```

---

## ⚠️ Common Mistakes

1. **Forgot to replace placeholders** - Make sure to replace ALL CAPS parts
2. **Missing `/hire-xo`** - Database name must be before `?retryWrites`
3. **Special characters in password** - URL encode them:
   - `@` becomes `%40`
   - `#` becomes `%23`
   - `$` becomes `%24`
4. **Spaces in connection string** - Remove all spaces

---

## ✅ After Updating

1. Save `backend/.env`
2. Check backend terminal - should see:
   ```
   ✅ MongoDB Connected
   ✅ Server running on port 5000
   ```
3. Try signup again in frontend
4. User will be created in MongoDB Atlas!

---

## 🆘 Still Not Working?

### Check:
1. Username/password are correct
2. IP whitelist includes your IP (or "Allow from Anywhere")
3. Cluster is fully created (not still deploying)
4. No typos in connection string
5. Password doesn't have special characters (or they're URL encoded)

---

**Update your `.env` file now with your MongoDB Atlas connection string!**
