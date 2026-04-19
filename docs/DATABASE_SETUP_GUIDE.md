# Database Setup Guide for Vercel Deployment

This guide explains how to set up your PostgreSQL database for Vercel deployment.

## Quick Comparison

| Provider | Free Tier | Setup Time | Best For | URL |
|----------|-----------|-----------|----------|-----|
| **Vercel Postgres** | $5/month | 2 min | Production, integrated | https://vercel.com/storage/postgres |
| **Railway** | $5/month credit | 5 min | Dev/Production | https://railway.app |
| **Neon** | Generous free | 5 min | Dev/Production | https://neon.tech |
| **Digital Ocean** | $5/month | 10 min | Production | https://digitalocean.com |

**Recommendation:** Use **Vercel Postgres** for simplicity, or **Railway** if you want more flexibility.

---

## Option 1: Vercel Postgres (⭐ RECOMMENDED)

### Pros
- Integrated with Vercel
- Automatic backups
- Easy scaling
- Direct Prisma integration

### Steps

1. **In Vercel Dashboard:**
   ```
   Your Project → Storage → Create Database → Postgres
   ```

2. **Configure:**
   - Database name: `damira-pharma-postgres`
   - Region: Choose closest to your users
   - Click **Create**

3. **Wait for setup** (~1-2 minutes)

4. **Get connection string:**
   - Click on database name
   - Go to **Connect** tab
   - Copy **Prisma** connection string
   - Example: `postgresql://user:password@ep-*.postgres.vercel-storage.com/database?sslmode=require`

5. **Add to environment variables:**
   ```
   DATABASE_URL=postgresql://user:password@ep-*.postgres.vercel-storage.com/database?sslmode=require
   ```

### Testing Connection
```bash
# After adding DATABASE_URL to .env locally
psql "$DATABASE_URL"

# Should connect successfully
postgres=#
```

### Backups
- Automatic daily backups
- View in Vercel Storage dashboard
- Restore via support ticket

---

## Option 2: Railway (Good Alternative)

### Pros
- $5/month free credit (usually covers database)
- Simple UI
- Good documentation
- Easy to scale

### Steps

1. **Sign up:**
   - Go to https://railway.app
   - Sign up with GitHub

2. **Create PostgreSQL:**
   ```
   Dashboard → New Project → PostgreSQL
   ```

3. **Wait for deployment** (~1-2 minutes)

4. **Get connection string:**
   - Click on PostgreSQL instance
   - Go to **Connect** tab
   - Copy **Postgres Connection URL**
   - Example: `postgresql://postgres:password@host:5432/database`

5. **Add to environment variables:**
   ```
   DATABASE_URL=postgresql://postgres:password@host:5432/database
   ```

### Testing Connection
```bash
psql "$DATABASE_URL"
```

### Backups
- Check Railway documentation
- Database snapshots available
- Export SQL available

### Cost Monitoring
- Railway shows usage in dashboard
- Usually free tier ($5/month) covers small app
- Scales automatically

---

## Option 3: Neon (Free Tier Option)

### Pros
- Generous free tier
- Auto-scaling
- Good EU availability
- PostgreSQL fully compatible

### Steps

1. **Sign up:**
   - Go to https://neon.tech
   - Sign up with GitHub or email

2. **Create project:**
   ```
   Dashboard → Create Project
   ```

3. **Choose region:**
   - Select closest to your users
   - US East (recommended for Vercel)

4. **Get connection string:**
   - Go to dashboard
   - Click database name
   - Copy connection string from "Connection string" section
   - Example: `postgresql://user:password@host.neon.tech/database?sslmode=require`

5. **Add to environment variables:**
   ```
   DATABASE_URL=postgresql://user:password@host.neon.tech/database?sslmode=require
   ```

### Testing Connection
```bash
psql "$DATABASE_URL"
```

### Connection Pooling (Important for Serverless)
Neon includes connection pooling via PgBouncer:
- Dashboard → Connection Pool
- Enable "Pool Mode"
- Use pool URL for serverless functions
- Use direct URL for long connections

If connection errors occur:
```env
DATABASE_URL=postgresql://...?sslmode=require
DATABASE_DIRECT_URL=postgresql://...?sslmode=require
```

Then in `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  directUrl = env("DATABASE_DIRECT_URL")
}
```

---

## Option 4: Digital Ocean (Self-Managed)

### Pros
- Full control
- Predictable pricing
- Good for enterprise

### Cons
- More setup required
- Requires maintenance

### Steps

1. **Create App Platform Database:**
   - DigitalOcean Dashboard → Databases → Create
   - Choose PostgreSQL
   - Region: nearest to Vercel
   - Sizing: Development (cheapest)

2. **Get connection string:**
   - Click database
   - Connection details section
   - Copy "Connection string"

3. **Whitelist Vercel IPs:**
   - Settings → Trusted Sources
   - Add all Vercel IPs (or allow all)

4. **Add to Vercel environment:**
   ```
   DATABASE_URL=postgresql://...
   ```

---

## Connection String Format

All PostgreSQL databases use this format:
```
postgresql://[user]:[password]@[host]:[port]/[database]?sslmode=require
```

- `[user]`: Database user (often `postgres` or `default`)
- `[password]`: Database password
- `[host]`: Database host (often `.postgres.vercel-storage.com` or `host.neon.tech`)
- `[port]`: Database port (usually 5432, often omitted)
- `[database]`: Database name (often `verceldb` or `postgres`)
- `?sslmode=require`: Enable SSL (required for remote databases)

### Examples
```
# Vercel Postgres
postgresql://user:password@ep-random.postgres.vercel-storage.com/database?sslmode=require

# Railway
postgresql://postgres:password@containers-us-west-123.railway.app:5432/railway

# Neon
postgresql://user:password@host.neon.tech/database?sslmode=require
```

---

## Setting Up Prisma Migrations

After choosing database:

### 1. Create local migration
```bash
npm run prisma migrate dev --name "initial-schema"
```

### 2. This creates:
```
prisma/migrations/[timestamp]_initial_schema/
  ├─ migration.sql
  └─ migration_lock.toml
```

### 3. Commit to GitHub
```bash
git add prisma/migrations/
git commit -m "Add initial Prisma migrations"
git push origin main
```

### 4. Vercel automatically applies
- On deployment, Vercel runs `npx prisma migrate deploy`
- Migrations apply automatically
- If migration fails, build fails (safe!)

---

## Testing Database Connection

### Local Test
```bash
# Export DATABASE_URL locally
export DATABASE_URL="postgresql://user:password@host/database?sslmode=require"

# Test connection
psql "$DATABASE_URL"
```

### Using Prisma Studio
```bash
# Open visual database browser
npm run prisma studio
# Opens at http://localhost:5555
```

### Using Vercel CLI
```bash
# Pull production variables
vercel env pull

# Check if DATABASE_URL is set
echo $DATABASE_URL

# Test Prisma Client can connect
npm run prisma db seed
```

---

## Troubleshooting

### Error: "Connection refused"
- Database not running (start it)
- Wrong host/port
- Firewall blocking connection
- Check database dashboard if it's active

### Error: "FATAL: password authentication failed"
- Wrong username/password
- Copy connection string carefully
- Reset password in database dashboard

### Error: "database does not exist"
- Typo in database name
- Database not created yet
- Check exact database name in provider dashboard

### Error: "too many connections"
- Too many simultaneous connections
- Connection pool exhausted
- Solution: Reduce max connections or add pooling
- For Neon: Enable connection pooling

### Slow queries
- Add database indexes
- Check query performance in dashboard
- Verify connection isn't in different region

### Data not persisting
- Check commits to GitHub
- Verify DATABASE_URL is set in Vercel
- Check Prisma migration applied (vercel logs)

---

## Cost Estimates

### Vercel Postgres
- Database: $5/month or pay per query
- Backups included
- Good for small-medium apps

### Railway
- $5/month free credit usually covers database
- Then ~$0.0007/GB/day for storage
- ~$0.12/million reads

### Neon
- Free: 3 projects, 512MB storage, unlimited queries
- Pro: $13/month, 10GB storage
- Enterprise: custom pricing

### Digital Ocean
- $5/month minimum (shared CPU)
- $25/month (dedicated resources)
- Standalone database (not serverless)

---

## Migration Path

If switching databases later:

```bash
# Export from old database
pg_dump $OLD_DATABASE_URL > backup.sql

# Restore to new database
psql $NEW_DATABASE_URL < backup.sql

# Update DATABASE_URL in Vercel
# Redeploy
```

---

## Next Steps

1. Choose database provider
2. Create database
3. Get connection string
4. Add to Vercel environment variables
5. Run migrations: `npm run prisma migrate dev`
6. Test locally: `npm run start`
7. Deploy to Vercel
8. Verify in Vercel logs

See main guide: [VERCEL_DEPLOYMENT_GUIDE.md](./VERCEL_DEPLOYMENT_GUIDE.md)
