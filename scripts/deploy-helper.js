#!/usr/bin/env node

/**
 * Vercel Deployment Helper Script
 * Generates required secrets and validates configuration
 * 
 * Usage:
 *   node scripts/deploy-helper.js
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(level, message) {
  const timestamp = new Date().toLocaleTimeString();
  const prefix = `[${timestamp}]`;
  
  switch (level) {
    case 'info':
      console.log(`${colors.blue}${prefix}${colors.reset} ${message}`);
      break;
    case 'success':
      console.log(`${colors.green}${prefix}${colors.reset} ✓ ${message}`);
      break;
    case 'warn':
      console.log(`${colors.yellow}${prefix}${colors.reset} ⚠️  ${message}`);
      break;
    case 'error':
      console.log(`${colors.red}${prefix}${colors.reset} ✗ ${message}`);
      break;
    default:
      console.log(message);
  }
}

function generateSecret(length = 32) {
  return crypto.randomBytes(length).toString('hex');
}

function validateEnv() {
  const requiredFiles = [
    'package.json',
    'prisma/schema.prisma',
    'next.config.ts',
    '.env',
  ];

  log('info', 'Validating project structure...');

  for (const file of requiredFiles) {
    if (!fs.existsSync(file)) {
      log('error', `Missing required file: ${file}`);
      return false;
    }
  }

  log('success', 'Project structure valid');
  return true;
}

function main() {
  console.log(`\n${colors.cyan}${colors.bright}🚀 Damira Pharma - Vercel Deployment Helper${colors.reset}\n`);

  // 1. Validate project
  if (!validateEnv()) {
    process.exit(1);
  }

  // 2. Generate secrets
  console.log(`\n${colors.bright}📋 Generating Required Secrets${colors.reset}\n`);

  const secrets = {
    AUTH_SECRET: generateSecret(32),
    MIGRATION_TOKEN: generateSecret(32),
  };

  console.log('Copy these values to Vercel Settings → Environment Variables:\n');

  console.log(`${colors.bright}AUTH_SECRET:${colors.reset}`);
  console.log(`${colors.cyan}${secrets.AUTH_SECRET}${colors.reset}\n`);

  console.log(`${colors.bright}MIGRATION_TOKEN (optional, for manual migrations):${colors.reset}`);
  console.log(`${colors.cyan}${secrets.MIGRATION_TOKEN}${colors.reset}\n`);

  // 3. Environment variables template
  console.log(`${colors.bright}📝 Environment Variables Template${colors.reset}\n`);
  console.log('Add to Vercel Settings → Environment Variables:');
  console.log(`
DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require
AUTH_SECRET=${secrets.AUTH_SECRET}
AUTH_URL=https://yourdomain.com
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NEXT_PUBLIC_APP_NAME=Damira Pharma
STORAGE_PROVIDER=local
LOCAL_UPLOAD_DIR=public/uploads
LOCAL_BASE_URL=/uploads
`);

  // 4. Database options
  console.log(`${colors.bright}🗄️  Database Setup Options${colors.reset}\n`);
  
  const dbOptions = [
    {
      name: 'Vercel Postgres (Recommended)',
      url: 'https://vercel.com/storage/postgres',
      description: 'Serverless PostgreSQL, automatic backups, simple setup',
      pros: ['Best integration', 'Automatic scaling', 'No setup needed'],
      cons: ['Slightly more expensive'],
    },
    {
      name: 'Railway',
      url: 'https://railway.app',
      description: 'Simple UI, good free tier ($5/month credit)',
      pros: ['Free tier available', 'Easy setup', 'Good performance'],
      cons: ['Requires account management'],
    },
    {
      name: 'Neon',
      url: 'https://neon.tech',
      description: 'Free tier with generous limits, auto-scaling',
      pros: ['Free tier', 'Auto-scaling', 'Good for dev+prod'],
      cons: ['EU-based (may have latency if US-based)'],
    },
  ];

  dbOptions.forEach((option, index) => {
    console.log(`${colors.yellow}${index + 1}.${colors.reset} ${colors.bright}${option.name}${colors.reset}`);
    console.log(`   ${option.description}`);
    console.log(`   🔗 ${option.url}`);
    console.log();
  });

  // 5. Pre-deployment checklist
  console.log(`${colors.bright}✅ Pre-Deployment Checklist${colors.reset}\n`);

  const checklist = [
    'All code committed to GitHub',
    'Local production build works (npm run build)',
    'DATABASE_URL obtained from database provider',
    'AUTH_SECRET generated (see above)',
    'All environment variables added to Vercel',
    'Prisma migrations created and committed',
    'Vercel project created and GitHub connected',
  ];

  checklist.forEach((item, index) => {
    console.log(`  ☐ ${item}`);
  });

  // 6. Next steps
  console.log(`\n${colors.bright}📋 Next Steps${colors.reset}\n`);

  const steps = [
    '1. Choose database provider (see options above)',
    '2. Get DATABASE_URL from your database provider',
    '3. Go to https://vercel.com/dashboard',
    '4. Import your GitHub repository',
    '5. Add all environment variables (see template above)',
    '6. Click "Deploy"',
    '7. Wait 5-10 minutes for build to complete',
    '8. Test deployment at provided URL',
    '9. Configure custom domain (if needed)',
  ];

  steps.forEach(step => {
    console.log(`  ${step}`);
  });

  // 7. Useful commands
  console.log(`\n${colors.bright}🛠️  Useful Commands${colors.reset}\n`);

  const commands = [
    { cmd: 'npm run build', desc: 'Test production build locally' },
    { cmd: 'npm run start', desc: 'Run production build locally' },
    { cmd: 'npm run prisma migrate status', desc: 'Check migration status' },
    { cmd: 'npm run prisma db push', desc: 'Sync schema with database' },
    { cmd: 'npm i -g vercel && vercel logs', desc: 'View Vercel logs' },
    { cmd: 'vercel env pull', desc: 'Pull Vercel environment variables' },
  ];

  commands.forEach(({ cmd, desc }) => {
    console.log(`  ${colors.cyan}${cmd}${colors.reset}`);
    console.log(`    └─ ${desc}`);
  });

  console.log(`\n${colors.green}${colors.bright}Ready for deployment! 🎉${colors.reset}\n`);
  console.log(`Full guide: ${colors.cyan}docs/VERCEL_DEPLOYMENT_GUIDE.md${colors.reset}\n`);
}

main();
