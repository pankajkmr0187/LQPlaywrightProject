# GitHub Actions Setup Instructions

## 📧 Email Configuration

To send emails from GitHub Actions, add these secrets to your repository:

### Required Secrets:

1. **MAIL_USERNAME**: Your Gmail address
   - Example: `your-email@gmail.com`

2. **MAIL_PASSWORD**: Gmail App Password (NOT your regular password)
   - How to generate:
     1. Go to Google Account settings
     2. Enable Security → 2-Step Verification
     3. Click on App Passwords
     4. Select "Mail" and generate 16-digit password
     5. Add this password to GitHub secrets

3. **MAIL_TO**: Email recipients (comma separated)
   - Example: `recipient1@gmail.com, recipient2@gmail.com`

### Add Secrets in GitHub:

1. Go to your repository
2. **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret** button
4. Add all 3 secrets mentioned above

## 🚀 Workflow Triggers

### Automatic:
- ✅ On every push (main/master branch)
- ✅ On pull requests
- ✅ Daily at 9 AM IST (scheduled)

### Manual:
- GitHub repository → **Actions** tab → **Playwright Tests** → **Run workflow**

## 📦 Artifacts

Test reports will be automatically uploaded as artifacts:
- Location: Actions tab → Workflow run → **Artifacts** section
- Download to get complete `test-reports/` folder structure
- Retention: 30 days

## 📧 Email Report

MASTER_SUMMARY.html will be automatically sent via email:
- Subject: `Playwright Test Results - [run-number]`
- Attachment: Master summary HTML
- Body: Summary HTML content

## 🏃 First Time Setup

```bash
# 1. Initialize Git repository (if not done)
git init

# 2. Add files
git add .

# 3. Commit
git commit -m "Add Playwright tests with GitHub Actions"

# 4. Create repository on GitHub and push
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

## ✅ Verification

1. Check workflow run in GitHub Actions tab
2. Check email inbox (also check Spam folder)
3. Download artifacts and verify reports

---

**Note**: If email is not received, check GitHub Actions logs for errors and verify secrets are correctly configured.
