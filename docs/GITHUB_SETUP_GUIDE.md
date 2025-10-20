# 🐙 GitHub Setup & Deployment Guide

## 📋 Overview

Complete guide to setup GitHub repository and deploy BL Novels App to production.

---

## 🚀 Step 1: Create GitHub Repository

### 1.1 Create Repository on GitHub
1. Go to https://github.com/new
2. Repository name: `bl-novels-app`
3. Description: `BL Novels Archive - Story Upload & Translation Platform`
4. Choose: **Public** (for open source) or **Private** (for private use)
5. Click **Create repository**

### 1.2 Initialize Local Repository
```bash
cd g:\App

# Initialize git
git init

# Add remote
git remote add origin https://github.com/YOUR_USERNAME/bl-novels-app.git

# Verify remote
git remote -v
```

---

## 📝 Step 2: Create .gitignore

Create `.gitignore` file in root directory:

```
# Dependencies
node_modules/
package-lock.json
yarn.lock
pnpm-lock.yaml

# Environment variables
.env
.env.local
.env.*.local

# Build output
dist/
build/
.next/
out/

# IDE
.vscode/
.idea/
*.swp
*.swo
*~
.DS_Store

# Logs
logs/
*.log
npm-debug.log*
yarn-debug.log*

# Temporary files
tmp/
temp/
*.tmp

# OS
Thumbs.db
.DS_Store
```

---

## 🔐 Step 3: Setup Environment Variables

### 3.1 Create .env.example
```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Admin Configuration
VITE_ADMIN_EMAIL=admin@example.com
VITE_ADMIN_PASSWORD=your-secure-password

# App Configuration
VITE_APP_NAME=Kho lưu trữ Đam Mỹ
VITE_APP_URL=https://your-domain.com
```

### 3.2 Create .env (Local Only - Don't Commit)
```env
VITE_SUPABASE_URL=https://your-actual-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-actual-anon-key
VITE_ADMIN_EMAIL=admin@example.com
VITE_ADMIN_PASSWORD=your-actual-password
VITE_APP_NAME=Kho lưu trữ Đam Mỹ
VITE_APP_URL=http://localhost:5173
```

---

## 📤 Step 4: Initial Commit & Push

```bash
# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: BL Novels App with tags feature

- React + Vite frontend
- Supabase backend
- Story upload with tags
- Admin dashboard
- Vietnamese localization"

# Push to GitHub
git branch -M main
git push -u origin main
```

---

## 🔑 Step 5: GitHub Secrets Setup

### 5.1 Add Secrets to GitHub
1. Go to GitHub repository
2. Settings → Secrets and variables → Actions
3. Click **New repository secret**
4. Add these secrets:

| Secret Name | Value |
|------------|-------|
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_ANON_KEY` | Your Supabase anon key |
| `ADMIN_EMAIL` | Admin email |
| `ADMIN_PASSWORD` | Admin password |
| `VERCEL_TOKEN` | Vercel API token (if using Vercel) |
| `VERCEL_ORG_ID` | Vercel organization ID |
| `VERCEL_PROJECT_ID` | Vercel project ID |

---

## 🔄 Step 6: Setup CI/CD Workflows

### 6.1 Create Workflow Directory
```bash
mkdir -p .github/workflows
```

### 6.2 Create test.yml
Create `.github/workflows/test.yml`:

```yaml
name: Test & Build

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  build:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [18.x]
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
      
      - name: Install dependencies
        run: cd bl-novels-app && npm install
      
      - name: Build
        run: cd bl-novels-app && npm run build
      
      - name: Check build output
        run: ls -la bl-novels-app/dist/
```

### 6.3 Create deploy.yml
Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Use Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: cd bl-novels-app && npm install
      
      - name: Build
        run: cd bl-novels-app && npm run build
      
      - name: Deploy to Vercel
        uses: vercel/action@master
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

---

## 🌐 Step 7: Deploy to Vercel

### 7.1 Create Vercel Account
1. Go to https://vercel.com
2. Sign up with GitHub
3. Authorize Vercel

### 7.2 Import Project
1. Click **Add New** → **Project**
2. Select `bl-novels-app` repository
3. Click **Import**

### 7.3 Configure Environment Variables
1. Go to project settings
2. Environment Variables
3. Add all secrets from GitHub

### 7.4 Deploy
1. Click **Deploy**
2. Wait for deployment to complete
3. Get production URL

---

## 📊 Step 8: Setup Database

### 8.1 Create Supabase Project
1. Go to https://supabase.com
2. Create new project
3. Get project URL and API key

### 8.2 Run Database Schema
1. Go to Supabase SQL Editor
2. Copy content from `supabase_schema_safe.sql`
3. Paste into SQL Editor
4. Click Run

### 8.3 Verify Database
```sql
-- Check tables
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';

-- Should show all tables created
```

---

## 🔗 Step 9: Configure Domain

### 9.1 Add Custom Domain (Vercel)
1. Go to Vercel project settings
2. Domains
3. Add your domain
4. Follow DNS configuration

### 9.2 Update DNS Records
```
Type: CNAME
Name: www
Value: cname.vercel.com

Type: A
Name: @
Value: 76.76.19.21
```

---

## ✅ Step 10: Verification Checklist

- [ ] GitHub repository created
- [ ] .gitignore configured
- [ ] .env.example created
- [ ] Initial commit pushed
- [ ] GitHub Secrets added
- [ ] CI/CD workflows created
- [ ] Vercel project created
- [ ] Environment variables configured
- [ ] Database schema deployed
- [ ] Domain configured
- [ ] SSL certificate installed
- [ ] Admin account created
- [ ] Test deployment successful

---

## 🚀 Production Deployment

### Final Steps
```bash
# 1. Verify everything locally
cd bl-novels-app
npm run dev

# 2. Test all features
# - Login/Register
# - Upload story
# - Search
# - Admin dashboard

# 3. Push to GitHub
git add .
git commit -m "Production ready"
git push origin main

# 4. Monitor deployment
# - Check GitHub Actions
# - Check Vercel deployment
# - Check application logs

# 5. Verify production
# - Test all features
# - Check database
# - Monitor performance
```

---

## 📊 Useful Links

| Service | URL | Purpose |
|---------|-----|---------|
| GitHub | https://github.com | Version control |
| Vercel | https://vercel.com | Deployment |
| Supabase | https://supabase.com | Database |
| Domain | https://namecheap.com | Domain registration |

---

## 🎯 Next Steps

1. ✅ Create GitHub repository
2. ✅ Push code to GitHub
3. ✅ Setup GitHub Secrets
4. ✅ Create CI/CD workflows
5. ✅ Deploy to Vercel
6. ✅ Configure domain
7. ✅ Monitor production

---

**Status:** ✅ GitHub Setup Complete

**Date:** 2025-10-19

