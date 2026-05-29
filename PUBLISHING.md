# Publishing Guide — Egypt Prayer Times

## Overview

This extension is published to the **Chrome Web Store**. Updates are automatic via GitHub Actions when you push a `v*` tag.

---

## One-Time Setup (You Do This Once)

### 1. Create Developer Account ($5)

Go to: **https://chrome.google.com/webstore/devconsole**

- Sign in with your Google account
- Pay the one-time **$5** developer registration fee
- Click **"New Item"**
- Upload `releases/egypt-prayer-times.zip` manually for the first version
- Fill in:
  - Description
  - Screenshots (1280×800 or 640×400)
  - Privacy policy URL: `https://github.com/AhmedGamal172000/egypt-prayer-times/blob/main/PRIVACY.md`
- Submit for review (1-3 days)

Once approved, note your **Extension ID** (looks like `abc123def456ghi`).

---

### 2. Enable Chrome Web Store API

Go to: **https://console.cloud.google.com/**

1. Create a new project
2. Go to **APIs & Services → Library**
3. Search **"Chrome Web Store API"** → click **Enable**
4. Go to **Credentials → Create Credentials → OAuth client ID**
5. Application type: **Desktop app**
6. Name it anything → click **Create**
7. Save the **Client ID** and **Client Secret**

---

### 3. Get Refresh Token

Install the helper tool:

```bash
npm install -g chrome-webstore-upload-cli
```

Run it:

```bash
npx chrome-webstore-upload-cli refresh-token \
  --client-id YOUR_CLIENT_ID \
  --client-secret YOUR_CLIENT_SECRET
```

A browser window opens. Authorize it. Copy the **Refresh Token**.

---

### 4. Add GitHub Secrets

Go to your repo: **Settings → Secrets and variables → Actions → New repository secret**

Add these 4 secrets:

| Secret Name | Value |
|-------------|-------|
| `CHROME_EXTENSION_ID` | Your Extension ID from step 1 |
| `CHROME_CLIENT_ID` | Your Client ID from step 2 |
| `CHROME_CLIENT_SECRET` | Your Client Secret from step 2 |
| `CHROME_REFRESH_TOKEN` | Your Refresh Token from step 3 |

---

## Automatic Publishing (Happens Forever)

After setup, every release is automatic:

```bash
git tag -a v1.1.0 -m "Release v1.1.0"
git push origin v1.1.0
```

GitHub Actions will:
1. Run tests
2. Build the extension
3. Create a GitHub Release with the ZIP
4. **Publish to Chrome Web Store automatically**

Users who installed from the store will receive the update within a few hours (Chrome checks for updates periodically).

---

## Manual Publishing (Fallback)

If auto-publish fails, you can always upload manually:

1. Go to **https://chrome.google.com/webstore/devconsole**
2. Find your extension
3. Click **"Package"** → **"Upload new package"**
4. Select `releases/egypt-prayer-times.zip`
5. Submit for review

---

## FAQ

**Q: Do I need Node.js to publish?**  
A: No. After the one-time setup, publishing is fully automatic from GitHub.

**Q: Do users get updates automatically?**  
A: Yes. Chrome checks for updates every few hours. Users don't need to do anything.

**Q: How long does review take?**  
A: First submission: 1-3 days. Updates: usually a few hours.

**Q: Can I publish to Edge Add-ons too?**  
A: Yes, the same ZIP works. Edge Add-ons is free (no $5 fee). Go to **https://partner.microsoft.com/dashboard/microsoftedge/**
