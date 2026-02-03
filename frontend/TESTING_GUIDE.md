# 🚀 Quick Start Guide - Testing the Integration

## Prerequisites Check

✅ Backend running on `http://localhost:5000`  
✅ Frontend running on `http://localhost:5173`  
✅ MongoDB running (check backend connection)

---

## 🧪 Test Scenarios

### Test 1: Signup & Login (Job Seeker)

1. **Open**: `http://localhost:5173`
2. **Click**: "Job Seeker" card
3. **Fill form**:
   - Name: Test User
   - Username: testuser
   - Email: test@example.com
   - Phone: 1234567890
   - Education: B.Tech
   - Age: 25
   - Experience: 2
   - Password: password123
4. **Submit** → Should create account and auto-login
5. **Check**: Should redirect to `/jobs` page
6. **Verify**: Jobs should load from backend (not mock data)

### Test 2: Browse & Apply to Jobs

1. **On Jobs page**: Should see real jobs from backend
2. **Click** on a job → Should open job details
3. **Click** "Apply Now"
4. **Fill** application form
5. **Submit** → Should create application in backend
6. **Go to** "My Applications" → Should see your application

### Test 3: Save Jobs (Bookmarks)

1. **On Jobs page**: Click bookmark icon on any job
2. **Go to** "Saved Jobs" → Should see bookmarked job
3. **Click** bookmark again → Should remove from saved

### Test 4: Upload Certificate

1. **Go to** "Certificates" page
2. **Click** "Upload Certificate"
3. **Fill** certificate details and upload file
4. **Submit** → Should upload to backend
5. **Verify**: Certificate appears in list

### Test 5: Recruiter Flow

1. **Logout** (if logged in)
2. **Select** "Recruiter" role
3. **Signup** with recruiter details
4. **Should redirect** to `/recruiter` dashboard
5. **Click** "Post Job"
6. **Fill** job details
7. **Submit** → Should create job in backend
8. **Go to** "My Jobs" → Should see posted job

### Test 6: Resource Provider Flow

1. **Logout**
2. **Select** "Resource Provider"
3. **Choose** category (e.g., "Equipment")
4. **Choose** sub-type (e.g., "Rent Out Equipment")
5. **Signup** with details
6. **Should redirect** to equipment provider dashboard
7. **Post** an equipment listing
8. **Verify**: Listing appears in "My Equipment"

### Test 7: Protected Routes

1. **Logout**
2. **Try** accessing `http://localhost:5173/jobs` directly
3. **Should redirect** to `/` (login page)
4. **Login** as job-seeker
5. **Try** accessing `http://localhost:5173/recruiter`
6. **Should redirect** to `/jobs` (not authorized)

### Test 8: Token Expiration

1. **Login** successfully
2. **Open** browser DevTools → Application → Local Storage
3. **Delete** `hire_xo_auth_token`
4. **Refresh** page
5. **Should redirect** to login page

---

## 🔍 Debugging Tools

### Check API Calls
1. Open **DevTools** → **Network** tab
2. Filter by **Fetch/XHR**
3. Look for calls to `localhost:5000/api/*`
4. Check **Headers** → Should see `Authorization: Bearer <token>`

### Check Token
```javascript
// In browser console
localStorage.getItem('hire_xo_auth_token')
```

### Check User Data
```javascript
// In browser console
JSON.parse(localStorage.getItem('auth-storage'))
```

### Clear All Data
```javascript
// In browser console
localStorage.clear()
location.reload()
```

---

## ⚠️ Common Issues & Fixes

### Issue: "Network Error"
**Cause**: Backend not running  
**Fix**: 
```bash
cd backend
npm run dev
```

### Issue: "CORS Error"
**Cause**: Backend CORS not configured for frontend URL  
**Fix**: Check `backend/src/app.ts` has:
```javascript
app.use(cors({
  origin: 'http://localhost:5173'
}));
```

### Issue: "401 Unauthorized" on every request
**Cause**: Token not being sent or invalid  
**Fix**: 
1. Check token exists in localStorage
2. Check axios interceptor is adding token
3. Try logout and login again

### Issue: "Cannot read property 'data' of undefined"
**Cause**: API response format mismatch  
**Fix**: Check backend response matches expected format

### Issue: Frontend shows old mock data
**Cause**: Store not calling API  
**Fix**: 
1. Check store is imported from updated file
2. Hard refresh browser (Ctrl+Shift+R)
3. Clear browser cache

---

## 📊 Expected Behavior

### On Successful Login:
- ✅ JWT token stored in localStorage
- ✅ User data stored in Zustand state
- ✅ Redirect to role-appropriate dashboard
- ✅ All subsequent API calls include token

### On API Call:
- ✅ Loading spinner shows
- ✅ Request sent with Authorization header
- ✅ Response data updates UI
- ✅ Error messages show if request fails

### On Logout:
- ✅ Token removed from localStorage
- ✅ User data cleared from state
- ✅ Redirect to login page
- ✅ Protected routes inaccessible

---

## ✅ Success Criteria

Your integration is working if:

1. ✅ Signup creates user in MongoDB
2. ✅ Login returns JWT token
3. ✅ Token is stored and used in requests
4. ✅ Jobs load from backend (not mock data)
5. ✅ Applications are created in backend
6. ✅ Protected routes redirect when not authenticated
7. ✅ Role-based access control works
8. ✅ Logout clears token and redirects

---

## 🎯 Next Steps

Once basic flow works:
1. Test all resource types (8 categories × 2 sub-types = 16 flows)
2. Test admin features
3. Test wallet & subscription features
4. Test file uploads (profile photos, certificates, company logos)
5. Test error scenarios (network errors, validation errors)

---

## 📞 Need Help?

Check these files for reference:
- `INTEGRATION_COMPLETE.md` - Full integration summary
- `api_reference.md` - All API endpoints
- `implementation_plan.md` - Original plan

**Happy Testing! 🚀**
