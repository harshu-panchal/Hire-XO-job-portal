# Hire XO Job Portal - Vercel Deployment Guide

## Quick Deploy to Vercel

### Option 1: Deploy via Vercel CLI (Recommended)

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm install -g vercel
   ```

2. **Navigate to project root**:
   ```bash
   cd "d:\AppZeto\Hire XO Job portal"
   ```

3. **Deploy**:
   ```bash
   vercel
   ```
   
   Follow the prompts:
   - Set up and deploy? **Y**
   - Which scope? Select your account
   - Link to existing project? **N** (first time)
   - Project name? **hire-xo-job-portal** (or your preferred name)
   - In which directory is your code located? **.**
   - Want to override settings? **N**

4. **IMPORTANT: Project Settings**:
   - Go to Vercel Dashboard -> Settings -> General
   - **Root Directory**: Edit and select `frontend`
   - Click "Save"

5. **Production Deployment**:
   ```bash
   vercel --prod
   ```

### Option 2: Deploy via Vercel Dashboard

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Fix deployment config"
   git push
   ```

2. **Import to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - **IMPORTANT**: In "Framework Preset", verify it says "Vite"
   - **IMPORTANT**: In "Root Directory", click Edit and select `frontend` folder
   - Click "Deploy"

### Build Settings (Auto-configured)

- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Environment Variables

No environment variables are required for the current setup (using mock data).

When you integrate with a backend API, add:
- `VITE_API_URL` - Your backend API URL

### Post-Deployment

After deployment, Vercel will provide:
- **Production URL**: `https://hire-xo-job-portal.vercel.app` (or similar)
- **Preview URLs**: For each git push/PR

### Automatic Deployments

Once connected to GitHub:
- **Production**: Deploys automatically on push to `main` branch
- **Preview**: Deploys automatically for pull requests

### Custom Domain (Optional)

1. Go to your project in Vercel Dashboard
2. Settings → Domains
3. Add your custom domain
4. Follow DNS configuration instructions

### Troubleshooting

**Build fails?**
- Check that all dependencies are in `package.json`
- Ensure TypeScript compiles without errors: `npm run build` locally

**404 on routes?**
- Vercel automatically handles SPA routing for Vite projects
- If issues persist, the `vercel.json` includes proper rewrites

**Slow build times?**
- Vercel caches dependencies automatically
- Typical build time: 1-2 minutes

### Monitoring

- **Analytics**: Enable in Vercel Dashboard → Analytics
- **Logs**: View build and function logs in Dashboard → Deployments

---

## Local Testing Before Deploy

```bash
# Build locally
cd frontend
npm run build

# Preview production build
npm run preview
```

Visit `http://localhost:4173` to test the production build locally.

---

## Deployment Checklist

- [ ] All features tested locally
- [ ] `npm run build` succeeds without errors
- [ ] `npm run preview` works correctly
- [ ] Git repository initialized (if using GitHub method)
- [ ] Vercel account created
- [ ] Project deployed successfully
- [ ] Production URL tested
- [ ] All routes working (Jobs, Resources, Profile, etc.)
- [ ] Mobile responsiveness verified
- [ ] Dark mode working

---

## Support

For Vercel-specific issues, check:
- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
