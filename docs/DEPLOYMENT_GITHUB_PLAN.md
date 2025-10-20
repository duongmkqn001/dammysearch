# 🚀 GitHub Deployment Plan - BL Novels App

## 📋 Overview

Complete deployment plan for BL Novels App using GitHub, with CI/CD pipeline and production deployment.

---

## 🎯 Phase 1: GitHub Repository Setup

### Step 1: Create GitHub Repository
```bash
# Initialize git (if not already done)
cd g:\App
git init

# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/bl-novels-app.git

# Create initial commit
git add .
git commit -m "Initial commit: BL Novels App with tags feature"

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 2: Repository Structure
```
bl-novels-app/
├── .github/
│   ├── workflows/
│   │   ├── deploy.yml          # Deployment workflow
│   │   ├── test.yml            # Testing workflow
│   │   └── lint.yml            # Linting workflow
│   └── ISSUE_TEMPLATE/
├── bl-novels-app/              # React frontend
├── docs/                        # Documentation
├── supabase_schema_safe.sql    # Database schema
├── .gitignore                  # Git ignore rules
├── .env.example                # Environment variables template
├── README.md                   # Project README
└── package.json                # Dependencies
```

---

## 🔐 Phase 2: Environment Configuration

### Step 1: Create `.env.example`
```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Admin Configuration
VITE_ADMIN_EMAIL=admin@example.com
VITE_ADMIN_PASSWORD=your-secure-password

# App Configuration
VITE_APP_NAME=Kho lưu trữ Đam Mỹ
VITE_APP_URL=https://your-domain.com
```

### Step 2: GitHub Secrets Setup
1. Go to GitHub Repository → Settings → Secrets and variables → Actions
2. Add secrets:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `ADMIN_EMAIL`
   - `ADMIN_PASSWORD`

---

## 🔄 Phase 3: CI/CD Pipeline

### GitHub Actions Workflow Files

#### `.github/workflows/test.yml`
```yaml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: cd bl-novels-app && npm install
      - run: cd bl-novels-app && npm run build
```

#### `.github/workflows/deploy.yml`
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: cd bl-novels-app && npm install
      - run: cd bl-novels-app && npm run build
      - name: Deploy to Vercel
        uses: vercel/action@master
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

---

## 🌐 Phase 4: Deployment Options

### Option A: Vercel (Recommended)
**Pros:** Free tier, automatic deployments, serverless
**Steps:**
1. Sign up at vercel.com
2. Connect GitHub repository
3. Set environment variables
4. Deploy automatically on push

### Option B: Netlify
**Pros:** Free tier, easy setup, good for static sites
**Steps:**
1. Sign up at netlify.com
2. Connect GitHub repository
3. Set build command: `npm run build`
4. Set publish directory: `dist`

### Option C: Self-hosted (VPS)
**Pros:** Full control, custom domain
**Steps:**
1. Rent VPS (DigitalOcean, Linode, etc.)
2. Install Node.js and npm
3. Clone repository
4. Setup PM2 for process management
5. Configure Nginx reverse proxy

---

## 📦 Phase 5: Database Deployment

### Supabase Setup
1. Create Supabase project at supabase.com
2. Get project URL and API keys
3. Run `supabase_schema_safe.sql` in SQL editor
4. Add secrets to GitHub

### Database Backup
```bash
# Backup database
pg_dump -h your-host -U your-user -d your-db > backup.sql

# Restore database
psql -h your-host -U your-user -d your-db < backup.sql
```

---

## 🚀 Phase 6: Production Deployment

### Step 1: Pre-deployment Checklist
- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Database schema deployed
- [ ] Admin account created
- [ ] SSL certificate configured
- [ ] Domain configured

### Step 2: Deploy to Production
```bash
# Using Vercel
vercel --prod

# Using Netlify
netlify deploy --prod

# Using VPS
git clone https://github.com/YOUR_USERNAME/bl-novels-app.git
cd bl-novels-app/bl-novels-app
npm install
npm run build
pm2 start "npm run preview" --name "bl-novels-app"
```

### Step 3: Post-deployment
- [ ] Test all features
- [ ] Verify database connection
- [ ] Check admin dashboard
- [ ] Monitor error logs
- [ ] Setup monitoring/alerts

---

## 📊 Phase 7: Monitoring & Maintenance

### Setup Monitoring
- GitHub Actions for CI/CD status
- Vercel/Netlify dashboard for deployment status
- Supabase dashboard for database health
- Error tracking (Sentry, LogRocket)

### Regular Maintenance
- Weekly: Check error logs
- Monthly: Review performance metrics
- Quarterly: Security audit
- Annually: Update dependencies

---

## 🔗 Useful Links

| Service | URL | Purpose |
|---------|-----|---------|
| GitHub | https://github.com | Version control |
| Vercel | https://vercel.com | Deployment |
| Netlify | https://netlify.com | Deployment |
| Supabase | https://supabase.com | Database |
| DigitalOcean | https://digitalocean.com | VPS hosting |

---

## 📝 Deployment Checklist

- [ ] GitHub repository created
- [ ] `.gitignore` configured
- [ ] `.env.example` created
- [ ] GitHub Secrets added
- [ ] CI/CD workflows created
- [ ] Deployment platform selected
- [ ] Database deployed
- [ ] Domain configured
- [ ] SSL certificate installed
- [ ] Admin account created
- [ ] Monitoring setup
- [ ] Documentation updated

---

## 🎯 Next Steps

1. Create GitHub repository
2. Push code to GitHub
3. Setup GitHub Secrets
4. Create CI/CD workflows
5. Deploy to production
6. Monitor and maintain

---

**Status:** ✅ Deployment Plan Ready

**Date:** 2025-10-19

