# 🚀 QUICK MONGODB SETUP GUIDE

## FASTEST OPTION: Download MongoDB Installer

### Step 1: Download MongoDB
**Direct Download Link:**
https://fastdl.mongodb.org/windows/mongodb-windows-x86_64-7.0.5-signed.msi

OR visit: https://www.mongodb.com/try/download/community
- Select: Windows
- Version: 7.0.x (Current)
- Package: MSI

### Step 2: Install
1. Run the downloaded MSI file
2. Choose "Complete" installation
3. **IMPORTANT**: Check "Install MongoDB as a Service" ✅
4. Click "Next" through the wizard
5. Finish installation

### Step 3: Verify MongoDB is Running
```powershell
# Check if MongoDB service is running
Get-Service -Name MongoDB

# If not running, start it
net start MongoDB
```

### Step 4: Backend Will Auto-Connect
Once MongoDB is running, your backend will automatically:
- Detect the connection
- Connect to MongoDB
- Start accepting requests on port 5000

---

## ALTERNATIVE: MongoDB Atlas (Cloud - No Install)

If you prefer not to install locally:

1. **Sign up**: https://www.mongodb.com/cloud/atlas/register
2. **Create free cluster** (M0 tier - free forever)
3. **Get connection string**
4. **Update** `backend/.env`:
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/hire-xo
   ```
5. **Backend auto-restarts** and connects

---

## 📊 Current Status

✅ Frontend: http://localhost:5173 (RUNNING)
⏳ Backend: Waiting for MongoDB
❌ MongoDB: Not running yet

---

## ⚡ What Happens Next

1. Install MongoDB (5 minutes)
2. MongoDB starts automatically
3. Backend connects (you'll see "MongoDB Connected")
4. Full stack is ready!
5. Test at http://localhost:5173

---

**Choose one option and let me know when MongoDB is ready!**
