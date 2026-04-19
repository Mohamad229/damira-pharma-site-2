# Deployment Troubleshooting Guide

## Common Issues & Solutions

---

## 🔴 Build Issues

### Issue: "DATABASE_URL is not defined"

**Error message:**
```
Error: DATABASE_URL is not defined
  at Object.<anonymous> (lib/db.ts:...)
```

**Causes:**
- Missing DATABASE_URL in Vercel environment variables
- Variable not set for Production environment

**Solutions:**
1. Go to Vercel Dashboard → Your Project → Settings
2. Click **Environment Variables**
3. Verify `DATABASE_URL` exists
4. Check it's set for **Production** scope
5. Redeploy:
   ```bash
   git commit --allow-empty -m "Redeploy"
   git push origin main
   ```

---

### Issue: "Prisma Client not found"

**Error message:**
```
Cannot find module '@prisma/client'
or
Found `@prisma/client` in node_modules but module is not installed
```

**Causes:**
- Prisma Client not generated
- node_modules corrupted
- Lockfile mismatch

**Solutions:**
```bash
# Locally
rm -rf node_modules .next prisma/generated
npm install
npm run build

# Commit
git add package-lock.json
git commit -m "Rebuild Prisma Client"
git push origin main
```

---

### Issue: Build Timeout (>15 minutes)

**Causes:**
- Large node_modules
- Network issues
- Slow Prisma Client generation

**Solutions:**

1. **Check .vercelignore** (add to repo root):
   ```
   node_modules
   .next
   .turbo
   ```

2. **Upgrade Vercel plan** for faster builds

3. **Split large dependencies:**
   ```bash
   npm list | grep -E "(size|large)" # Find big packages
   ```

4. **Restart build:**
   - Dashboard → Deployments → Redeploy

---

### Issue: "Type errors in TypeScript"

**Error message:**
```
Type error: Property 'X' does not exist on type 'Y'
```

**Causes:**
- Outdated Prisma Client
- Schema changes not synced
- Type mismatches in code

**Solutions:**
```bash
# Locally
npm run prisma generate
npm run build

# Check for errors
npm run lint

# Fix issues then
git add .
git commit -m "Fix type errors"
git push origin main
```

---

## 🔴 Database Connection Issues

### Issue: "Connection refused" or "ECONNREFUSED"

**Error message:**
```
Error: getaddrinfo ECONNREFUSED db.example.com:5432
```

**Causes:**
- Database not running
- Wrong connection string
- Wrong credentials
- Database IP blocked
- Database down

**Solutions:**

1. **Test connection locally:**
   ```bash
   psql "$DATABASE_URL"
   # If fails, check connection string
   ```

2. **Verify connection string format:**
   ```
   postgresql://user:password@host:5432/database?sslmode=require
   ```

3. **Check database dashboard:**
   - Is database running? (Status should be "Active")
   - Correct credentials?
   - IP whitelisted?

4. **If using Neon, Railway, etc:**
   - Visit their dashboard
   - Check database status
   - Try copying connection string again

5. **In Vercel, view logs:**
   ```bash
   npm i -g vercel
   vercel logs --prod
   # Look for connection errors
   ```

---

### Issue: "too many connections"

**Error message:**
```
Error: remaining connection slots are reserved for non-replication superuser connections
```

**Causes:**
- Too many serverless functions running
- Connection pool exhausted
- Long-running queries blocking connections

**Solutions:**

1. **For Neon, enable connection pooling:**
   - Dashboard → Connection Pool → Enable
   - Use pool URL for serverless

2. **Update Prisma schema** (for pooling):
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")        # Pool URL
     directUrl = env("DATABASE_DIRECT_URL")  # Direct URL
   }
   ```

3. **Add to Vercel environment:**
   ```
   DATABASE_URL=postgresql://...?sslmode=require
   DATABASE_DIRECT_URL=postgresql://direct...
   ```

4. **Reduce connections** in prisma/schema.prisma:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

---

### Issue: "SSL connection error" or "CERTIFICATE_VERIFY_FAILED"

**Causes:**
- Database requires SSL
- Wrong SSL mode in connection string
- Certificate issues

**Solutions:**

1. **Add `?sslmode=require` to connection string:**
   ```
   postgresql://user:pass@host/db?sslmode=require
   ```

2. **Verify in DATABASE_URL:**
   ```bash
   # Check Vercel env var
   # Should end with: ?sslmode=require
   ```

3. **For local testing:**
   ```bash
   PGSSLMODE=require psql "$DATABASE_URL"
   ```

---

## 🔴 Runtime Issues

### Issue: 500 Error on Admin Page

**Causes:**
- Database query failed
- Prisma Client not initialized
- Missing environment variable
- Auth token invalid

**Solutions:**

1. **Check Vercel logs:**
   ```bash
   vercel logs --prod
   # Look for red error messages
   ```

2. **Check browser console:**
   - Press F12 → Console tab
   - Look for JavaScript errors

3. **Verify authentication:**
   - Check `AUTH_SECRET` is set
   - Check cookies in browser (F12 → Application → Cookies)
   - Try logging out and back in

4. **Test database:**
   ```bash
   # Create test API route at app/api/test/route.ts
   import { prisma } from '@/lib/db';
   
   export async function GET() {
     try {
       const count = await prisma.user.count();
       return Response.json({ success: true, count });
     } catch (error) {
       return Response.json({ error: String(error) }, { status: 500 });
     }
   }
   
   # Visit https://yourdomain.com/api/test
   ```

---

### Issue: Images Not Loading

**Error message:**
```
404 Not Found: /uploads/image-name.jpg
```

**Causes:**
- Upload directory doesn't exist
- Wrong `LOCAL_BASE_URL` configured
- STORAGE_PROVIDER not set to "local"

**Solutions:**

1. **Verify environment variables:**
   - `STORAGE_PROVIDER=local`
   - `LOCAL_UPLOAD_DIR=public/uploads`
   - `LOCAL_BASE_URL=/uploads`

2. **Create upload directory:**
   ```bash
   mkdir -p public/uploads
   git add public/uploads/.gitkeep
   git commit -m "Create uploads directory"
   git push
   ```

3. **Check Vercel logs for upload errors:**
   ```bash
   vercel logs --prod | grep -i upload
   ```

---

### Issue: Login Not Working

**Causes:**
- AUTH_SECRET not set
- AUTH_URL incorrect
- Database queries failing
- Session storage issue

**Solutions:**

1. **Verify environment variables:**
   - `AUTH_SECRET` is set
   - `AUTH_URL=https://yourdomain.com` (not localhost)
   - No typos in credentials

2. **Check credentials:**
   - Is user in database?
   - Is password correct?
   - Test locally first: `npm run start`

3. **Clear browser data:**
   - F12 → Application → Clear Site Data
   - Refresh page
   - Try again

4. **Check Vercel logs:**
   ```bash
   vercel logs --prod | grep -i auth
   ```

---

### Issue: CORS Errors

**Error message:**
```
Access to XMLHttpRequest blocked by CORS policy
```

**Causes:**
- API routes not handling CORS
- Wrong domain in CORS headers
- Browser security restriction

**Solutions:**

1. **For API routes, add CORS headers:**
   ```typescript
   export async function GET(request: Request) {
     const response = new Response(data);
     response.headers.set('Access-Control-Allow-Origin', '*');
     return response;
   }
   ```

2. **Or use proxy in next.config.ts:**
   ```typescript
   async rewrites() {
     return {
       beforeFiles: [
         {
           source: '/api/:path*',
           destination: 'https://your-api.com/:path*',
         },
       ],
     };
   }
   ```

---

## 🔴 Performance Issues

### Issue: Slow Page Load (>3 seconds)

**Causes:**
- Cold start (normal first request)
- Slow database queries
- Large JavaScript bundle
- Network latency

**Solutions:**

1. **Check cold starts (normal):**
   - First request after deployment: 2-5 seconds
   - Normal on Vercel free tier
   - Use Vercel Pro for faster cold starts

2. **Optimize database queries:**
   ```bash
   # Find slow queries
   vercel logs --prod | grep -i "slow"
   
   # Add indexes to schema
   ```

3. **Reduce bundle size:**
   ```bash
   ANALYZE=true npm run build
   # Opens bundle analysis
   ```

4. **Monitor in Vercel Analytics:**
   - Dashboard → Analytics
   - Check response times, core web vitals

---

### Issue: Database Queries Are Slow

**Causes:**
- Missing indexes
- N+1 query problem
- Large dataset queries
- Network latency

**Solutions:**

1. **Add indexes to schema:**
   ```prisma
   model Product {
     id        String   @id @default(cuid())
     slug      String   @unique
     status    String
     
     @@index([status])  # Add this
   }
   ```

2. **Run migrations:**
   ```bash
   npm run prisma migrate dev
   ```

3. **Use select to limit fields:**
   ```typescript
   // Bad - loads all fields
   const products = await prisma.product.findMany();
   
   // Good - loads only needed fields
   const products = await prisma.product.findMany({
     select: { id: true, name: true, slug: true }
   });
   ```

4. **Use Prisma studio to test queries:**
   ```bash
   npm run prisma studio
   ```

---

## 🔴 Deployment Issues

### Issue: Deployment Stuck (Not Progressing)

**Causes:**
- Build process hanging
- Waiting for user input
- Network issue

**Solutions:**

1. **Cancel and redeploy:**
   - Vercel Dashboard → Deployments → Click stuck deployment
   - Click **Cancel**
   - Click **Redeploy**

2. **Check for prompts:**
   - Prisma migrations might ask for confirmation
   - Use `--force` flag in next.config.ts build command

3. **Check Vercel status:**
   - Visit https://status.vercel.com
   - Are there any incidents?

---

### Issue: Rollback Needed

**Causes:**
- New deployment has bugs
- Database migration failed
- Feature not working as expected

**Solutions:**

1. **Rollback in Vercel:**
   - Deployments tab
   - Click on previous working deployment
   - Click **Promote to Production**

2. **Or use Git:**
   ```bash
   git revert HEAD
   git push origin main
   ```

3. **Verify deployment:**
   - Check Vercel logs
   - Test functionality
   - Monitor error rates

---

## 🔴 Domain Issues

### Issue: Custom Domain Not Working

**Causes:**
- DNS not propagated yet
- Wrong nameservers
- CNAME record incorrect

**Solutions:**

1. **Wait for DNS propagation:**
   - Can take 15-45 minutes
   - Use https://dnschecker.org to check propagation

2. **Verify Vercel DNS configuration:**
   - Settings → Domains
   - Check nameservers match Vercel's
   - Or check CNAME points to Vercel

3. **Check SSL certificate:**
   - Vercel auto-generates
   - Check "Verified" status in Settings → Domains

4. **Test domain:**
   ```bash
   dig yourdomain.com
   nslookup yourdomain.com
   ```

---

### Issue: Mixed Content Warning (HTTPS/HTTP)

**Error:**
```
Mixed Content: The page was loaded over HTTPS, but requested an insecure resource
```

**Causes:**
- Resources loading over HTTP instead of HTTPS
- External CDN not supporting HTTPS

**Solutions:**

1. **Update external resources:**
   - Change `http://` to `https://`
   - In images, stylesheets, scripts

2. **Configure next.config.ts:**
   ```typescript
   const nextConfig = {
     images: {
       remotePatterns: [
         {
           protocol: 'https',  // Only HTTPS
           hostname: '**',
         },
       ],
     },
   };
   ```

---

## ✅ Validation Checklist

After fixing issues, verify:

```bash
# Local checks
npm run build          # Should succeed
npm run start          # Should start
npm run lint           # Should have no errors
npm run prisma studio  # Should connect to DB

# Push to GitHub
git push origin main

# Vercel checks
# Visit https://vercel.com/dashboard
# - Build status: ✅ Green
# - Deployment logs: No red errors
# - Production URL: Loads without errors
# - Test login: Works
# - Test database: Queries succeed
```

---

## 📞 Advanced Debugging

### View Real-Time Logs
```bash
npm i -g vercel
vercel login
vercel logs --prod --follow
```

### Download Database Backup
```bash
# For Vercel Postgres
psql $DATABASE_URL -c "SELECT * FROM information_schema.tables;"

# For manual backup
pg_dump $DATABASE_URL > backup.sql
```

### Test Database Directly
```bash
# Connect to production database
psql "$DATABASE_URL"

# Run SQL queries
SELECT COUNT(*) FROM "User";
SELECT COUNT(*) FROM "Product";
```

### Check Vercel Account Limits
- Deployments: 1000/day
- Build minutes: Depends on plan
- Functions: 12 concurrent
- Database connections: Depends on DB plan

---

## 📚 Additional Resources

- [Vercel Docs](https://vercel.com/docs)
- [Next.js Troubleshooting](https://nextjs.org/docs/getting-started/troubleshooting)
- [Prisma Troubleshooting](https://www.prisma.io/docs/reference/api-reference/error-reference)
- [PostgreSQL Errors](https://www.postgresql.org/docs/current/errcodes-appendix.html)

---

**Last Updated:** April 2026
