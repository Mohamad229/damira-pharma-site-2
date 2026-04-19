# Production Deployment Guide

This guide documents a safe baseline for deploying Damira Pharma in production without exposing secrets.

## 1) Environment setup

1. Copy `.env.production.example` to your platform secret manager values.
2. Set `NEXT_PUBLIC_APP_URL` and `AUTH_URL` to the exact public domain.
3. Set `DATABASE_URL` to a managed PostgreSQL instance with SSL enabled.
4. Set `AUTH_SECRET` to a high-entropy random string.
5. Use `STORAGE_PROVIDER=s3` in production and configure the S3/R2 credentials.

## 2) Database rollout

Run Prisma migrations during deploy before enabling traffic:

```bash
npx prisma migrate deploy
```

Optionally generate seed data in staging only:

```bash
npx prisma db seed
```

## 3) Build and runtime checks

Use the same gates locally and in CI:

```bash
npm ci
npm run lint
npm run build
```

## 4) Deployment pipeline template

A GitHub Actions template is included at `.github/workflows/deploy.template.yml`.

To activate:

1. Copy it to `.github/workflows/deploy.yml`.
2. Add repository secrets:
   - `PROD_DATABASE_URL`
   - `PROD_AUTH_SECRET`
   - `PROD_AUTH_URL`
   - `PROD_NEXT_PUBLIC_APP_URL`
   - `PROD_STORAGE_PROVIDER`
   - `PROD_S3_BUCKET`
   - `PROD_S3_REGION`
   - `PROD_S3_ACCESS_KEY`
   - `PROD_S3_SECRET_KEY`
   - `PROD_S3_ENDPOINT`
3. Replace the final deploy step with your hosting provider command (Vercel, Docker, or VPS).

## 5) Security and operational checklist

- Never commit `.env` files with live credentials.
- Keep `/admin` protected by Auth.js middleware as currently implemented.
- Restrict production DB/network access to deployment/runtime workloads only.
- Enable HTTPS, security headers, and regular backup strategy.
- Monitor application logs, error boundaries, and form submission throughput after release.

## 6) Post-deploy smoke test

Validate these routes in both locales:

- `/` and `/ar`
- `/products` and `/ar/products`
- `/contact` and `/ar/contact`
- `/partnerships` and `/ar/partnerships`
- Any published product detail route in EN/AR

Also verify:

- `https://<domain>/sitemap.xml`
- `https://<domain>/robots.txt`
- OG card previews from route metadata
