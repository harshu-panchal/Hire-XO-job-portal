# 🚀 MONGODB INSTALLATION - STEP BY STEP

## ✅ VERIFIED: MongoDB is NOT installed on your system

I've checked your system and confirmed MongoDB is not installed. Here are your options:

---

## 🎯 OPTION 1: Quick Install (Recommended - 5 minutes)

### Step 1: Download MongoDB
**Click this link to download:**
https://fastdl.mongodb.org/windows/mongodb-windows-x86_64-7.0.5-signed.msi

### Step 2: Run the Installer
1. Double-click the downloaded `.msi` file
2. Click "Next" on the welcome screen
3. Accept the license agreement
4. Choose "Complete" installation type

### Step 3: IMPORTANT - Service Configuration
**On the "Service Configuration" screen:**
- ✅ CHECK "Install MongoDB as a Service"
- ✅ Service Name: MongoDB
- ✅ Data Directory: C:\Program Files\MongoDB\Server\7.0\data
- ✅ Log Directory: C:\Program Files\MongoDB\Server\7.0\log
- Click "Next"

### Step 4: Complete Installation
- Uncheck "Install MongoDB Compass" (optional, you can skip this)
- Click "Install"
- Wait for installation to complete (2-3 minutes)
- Click "Finish"

### Step 5: Verify MongoDB is Running
Open PowerShell and run:
```powershell
Get-Service -Name MongoDB
```

You should see:
```
Status: Running
Name: MongoDB
```

### Step 6: Backend Will Auto-Connect!
Once MongoDB is running, check your backend terminal.
You should see:
```
✅ MongoDB Connected
✅ Server running on port 5000
```

---

## 🎯 OPTION 2: MongoDB Atlas (Cloud - No Installation)

### Step 1: Sign Up
Go to: https://www.mongodb.com/cloud/atlas/register
- Sign up with email or Google
- Verify your email

### Step 2: Create Free Cluster
- Choose "M0 FREE" tier
- Select a cloud provider (AWS/Google/Azure)
- Choose a region close to you
- Click "Create Cluster" (takes 3-5 minutes)

### Step 3: Create Database User
- Click "Database Access" in left menu
- Click "Add New Database User"
- Choose "Password" authentication
- Username: `admin`
- Password: Create a strong password (save it!)
- Database User Privileges: "Atlas admin"
- Click "Add User"

### Step 4: Whitelist IP Address
- Click "Network Access" in left menu
- Click "Add IP Address"
- Click "Allow Access from Anywhere" (for development)
- Click "Confirm"

### Step 5: Get Connection String
- Click "Database" in left menu
- Click "Connect" on your cluster
- Click "Connect your application"
- Copy the connection string (looks like):
  ```
  mongodb+srv://admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
  ```
- Replace `<password>` with your actual password

### Step 6: Update Backend .env
Open `backend/.env` and update:
```
MONGO_URI=mongodb+srv://admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/hire-xo?retryWrites=true&w=majority
```

### Step 7: Backend Auto-Restarts
Nodemon will detect the .env change and restart.
You'll see: `✅ MongoDB Connected`

---

## ⚡ WHICH OPTION SHOULD YOU CHOOSE?

### Choose Option 1 (Local) if:
- ✅ You want faster development
- ✅ You don't want to depend on internet
- ✅ You're comfortable installing software

### Choose Option 2 (Atlas) if:
- ✅ You don't want to install anything
- ✅ You want cloud backup
- ✅ You want to access from multiple devices

---

## 🎯 AFTER MONGODB IS READY

### Your Full Stack Will Be:
- ✅ Frontend: http://localhost:5173 (RUNNING)
- ✅ Backend: http://localhost:5000 (WILL CONNECT)
- ✅ Database: MongoDB (LOCAL or CLOUD)

### Test It:
1. Open http://localhost:5173
2. Click "Job Seeker"
3. Fill signup form
4. Submit → User created in MongoDB!
5. Auto-login → Jobs page loads!

---

## 📞 NEED HELP?

If you get stuck:
1. Check backend terminal for error messages
2. Verify MongoDB service is running: `Get-Service -Name MongoDB`
3. Check connection string in backend/.env

---

**Choose one option and follow the steps. Your application will be fully operational in 5 minutes!**
