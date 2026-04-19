# Complete Vercel Deployment Guide for Damira Pharma

## Project Stack Overview
- **Frontend**: Next.js 16 + React 19
- **Backend**: Next.js API Routes + Server Components
- **Database**: PostgreSQL + Prisma ORM
- **Authentication**: NextAuth v5
- **Internationalization**: next-intl (EN/AR with RTL)
- **Hosting Target**: Vercel

---

## Phase 1: Pre-Deployment Preparation

### 1.1 GitHub Repository Verification
```bash
# Verify your repo is pushed to GitHub
git remote -v
# Should output:
# origin  https://github.com/yourusername/repo-name.git (fetch)
# origin  https://github.com/yourusername/repo-name.git (push)

# Verify all code is committed
git status
# Should show: "nothing to commit, working tree clean"

# Check recent commits
git log --oneline -5
```

### 1.2 Environment Variables Documentation
**Current `.env` structure (you'll need similar on Vercel):**
```
DATABASE_URL          # PostgreSQL connection string
AUTH_SECRET           # NextAuth secret (generate secure key)
AUTH_URL              # Production URL
NEXT_PUBLIC_APP_URL   # Public app URL
STORAGE_PROVIDER      # "local" for dev, adjust for production
LOCAL_UPLOAD_DIR      # Upload directory
LOCAL_BASE_URL        # Upload base URL
```

### 1.3 Verify Local Build Works
```bash
# Stop your dev server
# Delete old build artifacts
rm -r .next

# Create production build
npm run build

# Test production build locally
npm run start
# Visit http://localhost:3000 to verify it works
```

---

## Phase 2: Choose & Set Up Database

### Option A: Vercel Postgres (⭐ RECOMMENDED - Simplest)

**Pros:**
- Serverless PostgreSQL managed by Vercel
- Automatic backups
- Simple integration
- Pay per query
- Free tier available

**Steps:**
1. Go to https://vercel.com/dashboard
2. Select your project (or create new one)
3. Go to **Storage** tab → **Create Database** → **Postgres**
4. Name: `damira-pharma-postgres`
5. Region: Choose nearest to your users
6. Click **Create** and wait for setup

**Get Connection String:**
- In Vercel dashboard, go to Storage → Postgres
- Click on database name
- Copy **"Prisma"** connection string
- This will be your `DATABASE_URL`

---

### Option B: Railway (Alternative)

**Pros:**
- Good free tier ($5/month credit)
- Simple UI
- Good performance

**Steps:**
1. Sign up: https://railway.app
2. New Project → PostgreSQL
3. Wait for deployment
4. Click on PostgreSQL instance
5. Go to **Connect** tab
6. Copy "Postgres Connection URL"

---

### Option C: Neon (Alternative)

**Pros:**
- Free tier with generous limits
- Auto-scaling
- Good for development + production

**Steps:**
1. Sign up: https://neon.tech
2. Create new project
3. Choose Region
4. Copy connection string from dashboard
5. Verify string format: `postgresql://user:password@host/database?sslmode=require`

---

### Option D: Self-Hosted PostgreSQL

**Not recommended for Vercel** (causes cold starts), but if needed:
- Digital Ocean App Platform
- AWS RDS
- Azure Database

---

## Phase 3: Set Up Vercel Project

### 3.1 Create/Connect Vercel Project

**If new to Vercel:**
1. Go to https://vercel.com/signup
2. Sign up with GitHub
3. Select GitHub organization (your account)
4. Click "Import" on your GitHub repo
5. Select `damira-pharma-site` repository

**If Vercel project already exists:**
1. Go to https://vercel.com/dashboard
2. Select your project

### 3.2 Configure Environment Variables

**Go to Vercel Dashboard → Your Project → Settings → Environment Variables**

**Add ALL these variables:**

```
# Database
DATABASE_URL=postgresql://[user]:[password]@[host]/[database]?sslmode=require

# Authentication
AUTH_SECRET=your-secure-random-string-change-this
AUTH_URL=https://yourdomain.com

# App Config
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NEXT_PUBLIC_APP_NAME=Damira Pharma

# Storage (keep as local unless using S3)
STORAGE_PROVIDER=local
LOCAL_UPLOAD_DIR=public/uploads
LOCAL_BASE_URL=/uploads

# Optional: S3 for file uploads (production)
# S3_BUCKET=your-bucket
# S3_REGION=us-east-1
# S3_ACCESS_KEY=key
# S3_SECRET_KEY=secret
```

**Generate AUTH_SECRET:**
```bash
# Run this command to generate a secure secret
openssl rand -base64 32

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Copy this output and paste as `AUTH_SECRET` in Vercel**

### 3.3 Set Environment for Build and Runtime
For each variable:
1. Select variable
2. Check ✓ **Production**
3. Check ✓ **Preview** 
4. Check ✓ **Development** (optional, for local via Vercel CLI)

---

## Phase 4: Prepare Database for Deployment

### 4.1 Update Prisma Schema (if needed)

Check `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
  engineType = "binary"
}
```

**Ensure URL uses env variable** ✓ (already done in your project)

### 4.2 Create & Test Migration Locally

```bash
# First, ensure your Docker PostgreSQL is running
docker-compose up -d  # if using docker-compose.yml

# Create a new migration with a name
npm run prisma migrate dev --name "initial-migration"
# Or if just syncing schema:
npm run prisma db push

# This will:
# 1. Create migration files in prisma/migrations/
# 2. Apply to local database
# 3. Regenerate Prisma Client
```

**Commit migrations to GitHub:**
```bash
git add prisma/migrations/
git commit -m "Add Prisma migrations"
git push origin main
```

### 4.3 Prepare Seed Data (if needed)

Check `prisma/seed.ts` - if it exists and has data:
```bash
# Test seed locally
npm run prisma db seed
```

**Note:** Seeding runs automatically in Vercel if `postbuild` script exists:
```json
{
  "scripts": {
    "build": "next build",
    "postbuild": "prisma db seed",
    "prisma": "prisma"
  }
}
```

---

## Phase 5: Deploy to Vercel

### 5.1 Trigger Deployment

**Option 1: Automatic (Recommended)**
1. Push to main branch:
```bash
git push origin main
```
2. Vercel automatically deploys
3. Watch build in dashboard

**Option 2: Manual via Vercel Dashboard**
1. Go to Vercel Dashboard → Your Project
2. Click **Deploy** button
3. Select branch to deploy

**Option 3: Via Vercel CLI**
```bash
# Install Vercel CLI (first time)
npm i -g vercel

# Deploy
vercel

# Or deploy to production
vercel --prod
```

### 5.2 Monitor Build Process

In Vercel Dashboard → Deployments:
1. **Build starts** - Vercel runs `npm run build`
2. **Build completes** - Check for ✓ green checkmark
3. **Prisma Client generated** - Should show in logs
4. **Deployment succeeds** - Get production URL

**If build fails:**
1. Click on failed deployment
2. Go to **Build Logs**
3. Look for error (usually red text)
4. Common issues:
   - Missing `DATABASE_URL` env var
   - Incorrect Prisma schema
   - Type errors in TypeScript

---

## Phase 6: Run Prisma Migrations on Production

### 6.1 Using Vercel Edge Functions or API Route

**Option 1: Create Deployment API Route** (Recommended)

Create `app/api/admin/migrations/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Only allow POST from admin or localhost
export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const expectedToken = process.env.MIGRATION_TOKEN;
  
  if (authHeader !== `Bearer ${expectedToken}`) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const { stdout, stderr } = await execAsync('npx prisma migrate deploy');
    return NextResponse.json({
      success: true,
      output: stdout,
      errors: stderr,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: String(error),
      },
      { status: 500 }
    );
  }
}
```

Add to `.env` in Vercel:
```
MIGRATION_TOKEN=your-secure-migration-token
```

Run migration:
```bash
curl -X POST https://yourdomain.com/api/admin/migrations \
  -H "Authorization: Bearer your-secure-migration-token"
```

**Option 2: Manual Prisma Deploy**

If build succeeds, migrations automatically deploy. To verify:
```bash
# Connect to Vercel via CLI
vercel env pull

# Run migrations manually (careful!)
npx prisma migrate deploy

# Check deployment status
npx prisma migrate status
```

**Option 3: Use Vercel-Prisma Integration**

If using Vercel Postgres:
1. Vercel handles migrations automatically on `next build`
2. Migrations in `prisma/migrations/` folder apply automatically
3. No manual intervention needed

---

## Phase 7: Verify Deployment

### 7.1 Check Production URL

1. Vercel dashboard shows URL like: `https://damira-pharma-site.vercel.app`
2. Visit homepage - should load without errors
3. Check browser console for errors (F12 → Console tab)

### 7.2 Test Key Features

**Test Authentication:**
```bash
1. Go to /admin/login
2. Try login with test credentials
3. Should redirect to /admin dashboard
4. Check browser cookies (F12 → Application → Cookies)
```

**Test Database Connection:**
1. Login to admin panel
2. Try creating/editing content
3. Refresh page - data should persist
4. Check Vercel logs for database errors

**Test Internationalization:**
1. Switch language EN/AR in header
2. Page should update without reload
3. Check URL for locale prefix

**Test Image Upload:**
1. Try uploading an image in admin
2. Image should appear
3. Check Vercel logs for storage errors

### 7.3 Monitor Performance

In Vercel Dashboard:
- **Deployments** - Check build time and size
- **Analytics** - View real user performance
- **Logs** - Check for errors and warnings
- **Monitoring** - CPU, memory, cold start metrics

---

## Phase 8: Domain Setup

### 8.1 Connect Custom Domain

In Vercel Dashboard → Settings → Domains:

1. Click **Add Domain**
2. Enter your domain (e.g., `pharma.com`)
3. Choose:
   - **Nameservers** (Vercel manages DNS) - Recommended
   - **CNAME** (your DNS provider) - If you want to use existing DNS

4. Follow instructions to update DNS

### 8.2 Update Environment Variables

Change `AUTH_URL` and `NEXT_PUBLIC_APP_URL`:
```
AUTH_URL=https://pharma.com
NEXT_PUBLIC_APP_URL=https://pharma.com
```

Re-deploy to apply changes:
```bash
git commit --allow-empty -m "Update domain env vars"
git push origin main
```

---

## Phase 9: Database Backups & Maintenance

### 9.1 Backups

**Vercel Postgres:**
- Automatic daily backups (14-day retention)
- Manual backups via dashboard

**Railway/Neon:**
- Check their backup policy in dashboard
- Usually automatic daily backups

**Manual Backup:**
```bash
# Connect with DATABASE_URL
pg_dump $DATABASE_URL > backup.sql

# Restore if needed
psql $DATABASE_URL < backup.sql
```

### 9.2 Monitoring Database

**View Database Metrics:**
1. Vercel Dashboard → Storage → Your DB
2. Check:
   - Query performance
   - Connection count
   - Data size
   - Read/Write operations

### 9.3 Database Scaling

If you hit limits:
1. Upgrade plan in database provider
2. Optimize queries (add indexes)
3. Archive old data
4. Consider data sharding

---

## Phase 10: Troubleshooting

### Issue: Build Fails with "DATABASE_URL not found"

**Solution:**
```bash
1. Go to Vercel Dashboard → Settings → Environment Variables
2. Ensure DATABASE_URL is set
3. Set for all environments (Production, Preview, Development)
4. Redeploy: git push origin main
```

### Issue: 500 Error in Admin Panel

**Solution:**
```bash
1. Check Vercel Logs: Dashboard → Deployments → Click latest → Logs
2. Common causes:
   - Database connection timeout
   - Prisma Client mismatch
   - Missing environment variable

# If Prisma Client issue:
git pull origin main
npm install
npm run build
git commit -am "Rebuild Prisma Client"
git push origin main
```

### Issue: Images Not Loading

**Solution:**
```bash
1. Vercel serves /public/uploads by default
2. Check Vercel deployment includes files:
   - vercel.json should have: "public": ["public/**/*"]
3. Or use S3 bucket for storage
```

### Issue: Database Connection Pooling

**Solution for connection issues:**
```
1. Use connection pooling via PgBouncer (Railway has this)
2. Reduce NODE_ENV max connections in Prisma:

prisma/schema.prisma:
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  // Add for pooling issues:
  // directUrl = env("DATABASE_DIRECT_URL")
}

2. In Vercel add:
DATABASE_DIRECT_URL=direct-postgres-url
DATABASE_URL=pooling-postgres-url
```

### Issue: Long Build Times

**Causes & Solutions:**
```
1. Large node_modules:
   - Check .vercelignore exists
   - Add: node_modules

2. Prisma Client generation:
   - Normal on first build (2-5 min)
   - Cache speeds it up

3. Docker images in build:
   - Remove docker-compose.yml from git
   - Add to .gitignore
```

### Issue: Cold Starts

**For Vercel Serverless Functions:**
```
1. Normal on first request (2-5 sec)
2. Use Vercel Pro for faster cold starts
3. Split functions to keep bundle small

vercel.json:
{
  "functions": {
    "app/api/**/*": {
      "memory": 3008,
      "maxDuration": 60
    }
  }
}
```

---

## Phase 11: Performance Optimization

### 11.1 Bundle Size Analysis

```bash
# Install analyzer
npm install -D @next/bundle-analyzer

# Update next.config.ts:
import withBundleAnalyzer from '@next/bundle-analyzer'

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

export default withBundleAnalyzer(nextConfig)

# Run analysis
ANALYZE=true npm run build
```

### 11.2 Image Optimization

Already configured in your `next.config.ts`:
```typescript
images: {
  formats: ['image/avif', 'image/webp'],
  deviceSizes: [640, 750, 828, 1080, 1200, 1920],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
}
```

✓ Already optimized!

### 11.3 Database Query Optimization

Monitor in Vercel Postgres dashboard:
1. Slow queries
2. High connection count
3. Add indexes if needed:

```prisma
model Product {
  id      String   @id @default(cuid())
  slug    String   @unique
  status  String   @db.VarChar(50)
  
  @@index([status])  // Add if querying by status often
}
```

---

## Deployment Checklist

Use this checklist before going live:

```
PRE-DEPLOYMENT
☐ All code committed to GitHub
☐ Local build succeeds: npm run build
☐ Local prod test works: npm run start
☐ Prisma migrations created and tested
☐ All environment variables documented

DATABASE SETUP
☐ Database created (Vercel/Railway/Neon)
☐ DATABASE_URL obtained
☐ Connection string tested locally
☐ Migrations reviewed for production

VERCEL SETUP
☐ Vercel project created
☐ GitHub connected
☐ All env variables added
☐ Build settings verified

DEPLOYMENT
☐ First deployment succeeded
☐ Migrations applied
☐ No errors in build logs
☐ Homepage loads at production URL
☐ Admin login works
☐ Database queries work
☐ Images load correctly

POST-DEPLOYMENT
☐ Custom domain configured
☐ SSL certificate installed (automatic)
☐ Auth URLs updated
☐ Analytics configured
☐ Error monitoring set up
☐ Performance monitored
☐ Database backups enabled
```

---

## Quick Commands Reference

```bash
# Local testing
npm run dev                          # Start dev server
npm run build                        # Create production build
npm run start                        # Run production build

# Prisma
npm run prisma generate              # Generate Prisma Client
npm run prisma migrate dev           # Create & apply migration
npm run prisma migrate deploy        # Apply existing migrations
npm run prisma db seed               # Run seed script
npm run prisma studio               # GUI database browser

# Git
git status                          # Check uncommitted changes
git add .                           # Stage all changes
git commit -m "message"             # Commit changes
git push origin main                # Push to GitHub

# Vercel CLI
npm i -g vercel                     # Install Vercel CLI
vercel login                        # Login to Vercel
vercel env pull                     # Pull env vars
vercel logs                         # View deployment logs
vercel --prod                       # Deploy to production
```

---

## Final Notes

1. **First deployment takes 5-10 minutes** - Prisma Client builds from scratch
2. **Subsequent deployments ~1-2 minutes** - Cached layers used
3. **Cold starts on first request** - Normal, usually 2-5 seconds
4. **Monitor closely first 48 hours** - Watch error logs and metrics
5. **Database backups** - Enable automatic backups immediately
6. **Performance baseline** - Record initial metrics to track growth

---

## Getting Help

If issues occur:

1. Check Vercel Logs: Dashboard → Deployments → Latest → Logs
2. View Next.js Error: Browser console (F12)
3. Database status: Dashboard → Storage → Your DB
4. Contact support:
   - Vercel: https://vercel.com/help
   - Prisma: https://www.prisma.io/docs
   - NextAuth: https://next-auth.js.org

---

**Last Updated:** April 2026
**Next.js Version:** 16.2.2
**Prisma Version:** 7.6.0
**React Version:** 19.2.4
