# Quick Environment Variables Reference for Vercel Deployment

## Vercel Environment Variables Setup

When deploying to Vercel, add these environment variables:

### Required Variables

```env
# Database Connection (Required - Get from Vercel/Railway/Neon dashboard)
DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require

# Authentication Secret (Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
AUTH_SECRET=your-generated-secret-here

# Authentication URL (Your production domain)
AUTH_URL=https://yourdomain.com

# Public App URL (Your production domain)
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### Optional Variables

```env
# App branding
NEXT_PUBLIC_APP_NAME=Damira Pharma

# File Storage (optional, default to local)
STORAGE_PROVIDER=local
LOCAL_UPLOAD_DIR=public/uploads
LOCAL_BASE_URL=/uploads

# S3 Storage (only if using AWS S3 for files)
# S3_BUCKET=your-bucket-name
# S3_REGION=us-east-1
# S3_ACCESS_KEY=your-access-key
# S3_SECRET_KEY=your-secret-key
# S3_ENDPOINT=https://s3.amazonaws.com (or Cloudflare R2 endpoint)
```

## Step-by-Step Setup in Vercel Dashboard

### 1. Go to Environment Variables
- Dashboard → Your Project → Settings → Environment Variables

### 2. Add Variables

For each variable above:

1. **Click "Add New"**
2. **Enter the variable name** (e.g., `DATABASE_URL`)
3. **Enter the value**
4. **Select scopes:**
   - ✓ Production
   - ✓ Preview
   - ✓ Development (optional, for local Vercel CLI)
5. **Click "Save"**

### 3. After Adding All Variables

- Trigger a redeployment:
  ```bash
  git commit --allow-empty -m "Update environment variables"
  git push origin main
  ```

- Or manually redeploy in Vercel dashboard

## Getting DATABASE_URL

### From Vercel Postgres (Recommended)

1. Dashboard → Storage → Your PostgreSQL Database
2. Click on database name
3. Go to **Connect** tab
4. Copy the **Prisma** connection string
5. Should look like: `postgresql://user:password@ep-*.postgres.vercel-storage.com/database?sslmode=require`

### From Railway

1. Go to https://railway.app
2. Select your PostgreSQL database
3. Click **Connect** tab
4. Copy the connection string from "Postgres Connection URL"

### From Neon

1. Go to https://neon.tech/app/projects
2. Select your project
3. Click on database name
4. Copy connection string from dashboard
5. Should look like: `postgresql://user:password@host.neon.tech/database?sslmode=require`

## Generating AUTH_SECRET

Run this command locally:

```bash
# Using OpenSSL (macOS/Linux)
openssl rand -base64 32

# Using Node.js (Windows/all platforms)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and paste as `AUTH_SECRET` in Vercel.

## Verifying Variables After Setup

After adding all variables, redeploy and check:

```bash
# View deployment logs
vercel logs

# Should NOT show any:
# - "DATABASE_URL is not defined"
# - "AUTH_SECRET is missing"
# - "Unknown provider" errors
```

## Troubleshooting

### Error: "DATABASE_URL is not defined"

**Solution:**
1. Go to Vercel Settings → Environment Variables
2. Verify `DATABASE_URL` exists
3. Check it's set for Production scope
4. Redeploy: `git push origin main`

### Error: "Connection refused"

**Solution:**
1. Verify DATABASE_URL format is correct
2. Check database is actually running (not stopped)
3. Test locally: `psql "your-database-url"`
4. Check IP whitelist if on managed database

### Error: "AUTH_SECRET is missing"

**Solution:**
1. Ensure `AUTH_SECRET` is set
2. Regenerate if needed (see above)
3. Restart deployment

## Reference

- Vercel Docs: https://vercel.com/docs/projects/environment-variables
- NextAuth Docs: https://next-auth.js.org/configuration/pages
- Prisma Connection Strings: https://www.prisma.io/docs/reference/database-reference/connection-urls/postgresql
