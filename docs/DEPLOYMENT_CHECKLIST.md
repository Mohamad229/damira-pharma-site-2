# 🚀 Damira Pharma - Vercel Deployment Checklist

## Step-by-Step Deployment Guide (Estimated time: 30-45 minutes)

---

## ✅ PHASE 1: Pre-Deployment (5 minutes)

### 1.1 Verify GitHub Repository
- [ ] Go to https://github.com/yourusername
- [ ] Verify `damira-pharma-site` repository exists
- [ ] All code is pushed to main branch
  ```bash
  git log --oneline -3  # Should show recent commits
  git status            # Should show "nothing to commit"
  ```

### 1.2 Verify Local Build
```bash
# Clean old build
rm -rf .next

# Create production build
npm run build

# Should complete with no errors
# Takes 2-5 minutes first time (builds Prisma Client)
```

### 1.3 Test Production Build Locally
```bash
npm run start
# Visit http://localhost:3000
# - Should see homepage
# - No errors in console
# - Press Ctrl+C to stop
```

**Status: ✅ Ready for Vercel**

---

## ✅ PHASE 2: Choose Database (5-10 minutes)

### 2.1 Select Database Provider

Choose ONE option:

#### 🌟 Option A: Vercel Postgres (RECOMMENDED)
- Simplest setup
- Integrated with Vercel
- Visit: https://vercel.com/storage/postgres
- **Action:** Skip to Phase 3, we'll set up in Vercel dashboard

#### Option B: Railway
- Visit: https://railway.app
- Sign up with GitHub
- Create PostgreSQL database
- Copy connection string
- **Action:** Save connection string for Phase 3

#### Option C: Neon
- Visit: https://neon.tech
- Sign up
- Create database
- Copy connection string
- **Action:** Save connection string for Phase 3

### 2.2 Save Connection String
```
DATABASE_URL=postgresql://...
```
**Keep this safe - you'll need it in Phase 3**

**Status: ✅ Database provider selected**

---

## ✅ PHASE 3: Generate Required Secrets (2 minutes)

### 3.1 Generate AUTH_SECRET

Choose method:

**On macOS/Linux:**
```bash
openssl rand -base64 32
```

**On Windows (PowerShell):**
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object {[byte](Get-Random -Max 256)}))
```

**Using Node.js (all platforms):**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3.2 Copy Output
Example output:
```
a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1
```

**Keep this secret safe!**

### 3.3 Prepare Environment Variables List

Create a text file with these values:
```
Database Connection:
DATABASE_URL=postgresql://user:password@host/database?sslmode=require

Authentication:
AUTH_SECRET=your-generated-secret-here
AUTH_URL=https://yourdomain.com (or vercel auto-domain)

Application:
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NEXT_PUBLIC_APP_NAME=Damira Pharma

Storage:
STORAGE_PROVIDER=local
LOCAL_UPLOAD_DIR=public/uploads
LOCAL_BASE_URL=/uploads
```

**Status: ✅ Secrets generated and documented**

---

## ✅ PHASE 4: Create Vercel Project (3 minutes)

### 4.1 Go to Vercel Dashboard
- Visit: https://vercel.com/dashboard
- Sign up/Sign in with GitHub

### 4.2 Import GitHub Repository

**Option 1: Fresh Import**
1. Click **Add New**
2. Select **Project**
3. Click **Continue with GitHub**
4. Select your GitHub account
5. Search for `damira-pharma-site`
6. Click **Import**

**Option 2: Already Connected**
1. Select existing project from list
2. Go to **Settings**

### 4.3 Configure Project
- **Framework Preset:** Next.js (auto-detected)
- **Build Command:** `npm run build`
- **Output Directory:** `.next`
- **Node Version:** 20.x

**Status: ✅ Vercel project created**

---

## ✅ PHASE 5: Add Environment Variables (5 minutes)

### 5.1 Go to Environment Variables
```
Your Project → Settings → Environment Variables
```

### 5.2 Add Each Variable

For each variable below:
1. Click **Add New**
2. Name: (variable name, e.g., `DATABASE_URL`)
3. Value: (your value)
4. Environments: Check ✓ **Production**, ✓ **Preview**, ✓ **Development**
5. Click **Save**

#### Required Variables:

**1. DATABASE_URL**
- Paste your PostgreSQL connection string
- Example: `postgresql://user:pass@host/db?sslmode=require`

**2. AUTH_SECRET**
- Paste your generated secret
- Example: `a1b2c3d4e5f6a7b8...`

**3. AUTH_URL**
- Your production domain
- For now: `https://yourdomain.vercel.app` (Vercel auto-generates)
- Later: Your custom domain (e.g., `https://pharma.com`)

**4. NEXT_PUBLIC_APP_URL**
- Same as AUTH_URL
- Example: `https://yourdomain.vercel.app`

**5. NEXT_PUBLIC_APP_NAME**
- `Damira Pharma`

**6. STORAGE_PROVIDER**
- `local`

**7. LOCAL_UPLOAD_DIR**
- `public/uploads`

**8. LOCAL_BASE_URL**
- `/uploads`

### 5.3 Verify All Variables Added
```
✓ DATABASE_URL
✓ AUTH_SECRET
✓ AUTH_URL
✓ NEXT_PUBLIC_APP_URL
✓ NEXT_PUBLIC_APP_NAME
✓ STORAGE_PROVIDER
✓ LOCAL_UPLOAD_DIR
✓ LOCAL_BASE_URL
```

**Status: ✅ All environment variables configured**

---

## ✅ PHASE 6: Deploy (5-10 minutes)

### 6.1 Trigger Deployment

**Option 1: Automatic (Recommended)**
```bash
git push origin main
# Vercel automatically deploys
```

**Option 2: Manual via Dashboard**
1. Go to Vercel Dashboard
2. Click **Deployments** tab
3. Click **Deploy** button
4. Select branch: `main`
5. Click **Deploy**

### 6.2 Monitor Build
1. Click on deployment
2. Watch **Build Logs** in real-time
3. Should see:
   ```
   ✓ Downloaded dependencies
   ✓ Building Next.js
   ✓ Prisma Client generated
   ✓ Build succeeded
   ```

### 6.3 Wait for Completion
- First build: 5-10 minutes
- Subsequent builds: 1-2 minutes
- Look for ✅ green checkmark

**If build fails:**
1. Check build logs (look for red errors)
2. Common issues:
   - Missing `DATABASE_URL` env var
   - Connection error to database
   - Type errors
3. Fix issue locally
4. Commit and push again

**Status: ✅ Deployment complete**

---

## ✅ PHASE 7: Verify Deployment (5 minutes)

### 7.1 Get Deployment URL
1. Go to Vercel Dashboard
2. Click on deployment
3. Copy **Production URL** (e.g., `https://damira-pharma-site-six.vercel.app`)
4. Note: This may change if you add custom domain

### 7.2 Test Homepage
1. Visit deployment URL
2. Should see your homepage
3. Check browser console for errors (F12 → Console)

### 7.3 Test Admin Login
1. Go to `/admin/login`
2. Try login with test credentials (from your seed data)
3. Should redirect to `/admin` dashboard
4. Check browser cookies (F12 → Application → Cookies)

### 7.4 Test Database
1. In admin dashboard, try creating/editing content
2. Refresh page - data should persist
3. Check Vercel logs for database errors

### 7.5 Check Logs
1. Vercel Dashboard → Deployments → Select latest
2. Click **Logs** tab
3. Look for any errors (red text)
4. Common messages:
   - `Prisma Client connected` ✓
   - `NextAuth initialized` ✓

**Status: ✅ Deployment verified**

---

## ✅ PHASE 8: Custom Domain (Optional, 5 minutes)

### 8.1 Add Domain
1. Vercel Dashboard → Your Project → Settings → Domains
2. Click **Add Domain**
3. Enter your domain (e.g., `pharma.com`)
4. Choose setup method:
   - **Nameservers** (Vercel manages DNS) - Recommended
   - **CNAME** (you manage DNS) - If using existing DNS

### 8.2 Update Environment Variables
1. Settings → Environment Variables
2. Edit `AUTH_URL`: Change to your domain
3. Edit `NEXT_PUBLIC_APP_URL`: Change to your domain
4. Example:
   ```
   AUTH_URL=https://pharma.com
   NEXT_PUBLIC_APP_URL=https://pharma.com
   ```

### 8.3 Redeploy
```bash
git commit --allow-empty -m "Update domain environment variables"
git push origin main
```

### 8.4 Wait for DNS Propagation
- SSL certificate auto-generates (1-2 minutes)
- DNS propagates (15-45 minutes)
- Visit your domain

**Status: ✅ Custom domain configured**

---

## ✅ PHASE 9: Post-Deployment Setup (5 minutes)

### 9.1 Enable Database Backups

**If using Vercel Postgres:**
1. Vercel Dashboard → Storage → Your Database
2. Automatic backups enabled by default
3. 14-day retention
4. Check **Backups** tab

**If using Railway/Neon:**
- Check their dashboard for backup settings
- Usually automatic daily backups

### 9.2 Monitor Performance
1. Vercel Dashboard → Analytics
2. Check:
   - Response times
   - Error rate (should be 0%)
   - CPU usage
   - Memory usage

### 9.3 Set Up Error Notifications (Optional)
1. Vercel Dashboard → Settings → Notifications
2. Configure Slack/email alerts for:
   - Build failures
   - Production errors
   - Performance issues

**Status: ✅ Post-deployment setup complete**

---

## ✅ PHASE 10: Database Management (Ongoing)

### 10.1 Monitor Database

**Weekly:**
- [ ] Check database size (Vercel Storage dashboard)
- [ ] Review error logs in Vercel
- [ ] Check connection count

**Monthly:**
- [ ] Review performance metrics
- [ ] Check for slow queries
- [ ] Verify backups are running

### 10.2 Scaling

If you hit limits:
- [ ] Upgrade database plan
- [ ] Add indexes to slow queries
- [ ] Archive old data
- [ ] Consider caching layer

### 10.3 Maintenance

**Regular tasks:**
```bash
# Run migrations
npm run prisma migrate deploy

# Update schema
npm run prisma db push

# Reset (if needed)
npm run prisma db push --force-reset
```

**Status: ✅ Ongoing management plan**

---

## 📋 Verification Checklist

After deployment, verify:

```
✅ Production URL works
✅ Homepage loads
✅ No console errors
✅ Admin login works
✅ Database queries work
✅ Images load correctly
✅ Language switcher works
✅ Form submissions work
✅ No 5xx errors in logs
✅ Vercel Analytics show data
✅ Database connection stable
✅ Backups enabled
```

---

## 🆘 Troubleshooting Quick Guide

| Issue | Solution |
|-------|----------|
| 500 Error | Check Vercel logs for database/auth errors |
| Database Connection Refused | Verify DATABASE_URL in environment variables |
| Build Fails | Check build logs for type/dependency errors |
| Slow Requests | Check database query performance, add indexes |
| Images Not Loading | Verify /public/uploads directory exists |
| Login Not Working | Check AUTH_SECRET and AUTH_URL are set correctly |
| Cold Starts | Normal on first request (2-5s), use Vercel Pro for faster |

---

## 📚 Reference Documents

- [Full Deployment Guide](./VERCEL_DEPLOYMENT_GUIDE.md) - Comprehensive guide
- [Database Setup Guide](./DATABASE_SETUP_GUIDE.md) - Database options and setup
- [Environment Variables Reference](./ENV_VARS_REFERENCE.md) - Env var documentation
- [AGENTS.md](../AGENTS.md) - Project architecture and conventions

---

## 🎯 Success Indicators

✅ You're done when:

1. ✅ Deployment shows green checkmark
2. ✅ Homepage loads at Vercel URL
3. ✅ Admin login works
4. ✅ Database queries succeed
5. ✅ No errors in Vercel logs
6. ✅ Custom domain works (if configured)
7. ✅ Backups enabled
8. ✅ Team has access credentials

---

## 📞 Getting Help

If issues occur:

**Vercel Issues:**
- Docs: https://vercel.com/docs
- Support: https://vercel.com/help

**Next.js Issues:**
- Docs: https://nextjs.org/docs
- GitHub: https://github.com/vercel/next.js

**Prisma Issues:**
- Docs: https://www.prisma.io/docs
- Discord: https://discord.gg/prisma

**NextAuth Issues:**
- Docs: https://next-auth.js.org
- GitHub: https://github.com/nextauthjs/next-auth

---

## 📝 Notes

```
Date Deployed: _______________
Deployment URL: _______________
Custom Domain: _______________
Database Provider: _______________
Deployed By: _______________
```

---

**Last Updated:** April 2026
**Status:** Ready to Deploy ✅
