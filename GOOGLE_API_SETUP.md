# Google Maps & Places API Setup Guide

## Problem Overview

TradeLaunch uses Google APIs in **two different contexts**:
1. **Client-side**: Google Maps autocomplete (runs in the browser)
2. **Server-side**: Google Places API data fetching (runs on Next.js server)

Each context requires a different API key security configuration.

---

## Why We Need Two API Keys

| Context | Key Type | Security Method | Why? |
|---------|----------|-----------------|------|
| **Client-side** (Autocomplete) | `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | HTTP Referrer Restrictions | Protects key from being stolen and used on other domains |
| **Server-side** (Data Fetch) | `GOOGLE_PLACES_API_KEY` | IP Address Restrictions | Server requests have no referrer header, need IP-based protection |

**Important**: Server-side requests from Next.js Server Actions **cannot** send HTTP referrer headers, so referrer-restricted keys will be blocked with error `API_KEY_HTTP_REFERRER_BLOCKED`.

---

## Setup Instructions

### **Part 1: Client-Side API Key (Already Configured)**

✅ You already have this: `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`

**Current Configuration**:
- Used for: Google Maps autocomplete in `GoogleBusinessSearch` component
- Security: HTTP Referrer restrictions
- Allowed referrers (example):
  - `localhost:3000/*`
  - `*.tradelaunch.it.com/*`
  - `*.vercel.app/*`

**APIs Enabled**:
- Places API (for autocomplete)
- Maps JavaScript API (if using maps in future)

**No changes needed** - this is already set up correctly.

---

### **Part 2: Server-Side API Key (NEW - Action Required)**

#### **Step 1: Create New API Key**

1. Go to [Google Cloud Console - Credentials](https://console.cloud.google.com/apis/credentials)
2. Select your project (same one as existing key)
3. Click **"Create Credentials"** → **"API Key"**
4. A new key will be generated - copy it immediately
5. Click **"Edit API key"** (or the key name)

---

#### **Step 2: Configure API Restrictions**

1. Under **"API restrictions"**:
   - Select: **"Restrict key"**
   - Check: **"Places API (New)"** ONLY
   - Uncheck all other APIs
   - Click **"Save"**

**Why restrict?** If your key is compromised, attackers can only use Places API, not other expensive services.

---

#### **Step 3: Configure Application Restrictions**

**For Development (Localhost)**:
1. Under **"Application restrictions"**:
   - Select: **"None"** (temporarily)
   - This allows requests from your local machine

**Important**: This is **temporarily insecure** but needed for local development. We'll add IP restrictions for production.

---

#### **Step 4: Add to Environment Variables**

1. Open `.env.local`
2. Replace `YOUR_NEW_SERVER_SIDE_API_KEY_HERE` with your new key:

```bash
# Server-side key (with IP restrictions) - used for Places API data fetching
GOOGLE_PLACES_API_KEY=AIzaSy...your_actual_key_here
```

3. **DO NOT** prefix with `NEXT_PUBLIC_` - this keeps it server-side only
4. Restart your dev server:
   ```bash
   # Stop current server (Ctrl+C)
   npm run dev
   ```

---

#### **Step 5: Test Locally**

```bash
1. Run: npm run dev
2. Visit: http://localhost:3000
3. Click Google Business search
4. Type: "Plumbing Austin"
5. Select a result
6. Check console - should see data, not 403 error
```

**Expected Success**: Form pre-populates, green confirmation box appears.

---

### **Part 3: Production Configuration (After Local Testing Works)**

#### **Step 6: Get Vercel Outbound IPs**

Vercel provides static outbound IP addresses for Pro plans. For Hobby plans, IPs are dynamic.

**Option A: Vercel Pro Plan (Has Static IPs)**
1. Go to Vercel dashboard → Project Settings → General
2. Find "Outbound IP Addresses"
3. Copy all IPs

**Option B: Vercel Hobby Plan (No Static IPs)**
- Keep "None" restriction (less secure but necessary)
- OR upgrade to Pro for static IPs
- OR use API request limits in Google Cloud Console

---

#### **Step 7: Add IP Restrictions (Pro Plan Only)**

1. Return to Google Cloud Console → API Key
2. Under **"Application restrictions"**:
   - Select: **"IP addresses"**
   - Add each Vercel outbound IP:
     ```
     35.x.x.x
     34.x.x.x
     (paste all IPs from Vercel)
     ```
   - Click **"Done"** → **"Save"**

---

#### **Step 8: Add to Vercel Environment Variables**

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add new variable:
   - **Key**: `GOOGLE_PLACES_API_KEY`
   - **Value**: Your server-side API key
   - **Environments**: Check all (Production, Preview, Development)
5. Click **"Save"**
6. **Redeploy** your app for changes to take effect

---

## Verification Checklist

### ✅ Local Development Works:
- [ ] `.env.local` has both keys
- [ ] `GOOGLE_PLACES_API_KEY` is set (no `NEXT_PUBLIC_` prefix)
- [ ] `npm run dev` restarts successfully
- [ ] Google Business search returns data (no 403 error)
- [ ] Form pre-populates when business selected

### ✅ Production Works:
- [ ] Server-side key added to Vercel environment variables
- [ ] Vercel redeployed after adding env var
- [ ] Google Business search works in production
- [ ] No 403 errors in Vercel function logs

---

## Cost Control

Both API keys should have the same billing project, so costs are centralized.

### **Field Mask Optimization**

The code already uses field masks to reduce costs:

```typescript
'X-Goog-FieldMask': [
  'displayName',
  'formattedAddress',
  'nationalPhoneNumber',
  'rating',
  'userRatingCount',
  'reviews',
  // ... only fields we need
].join(','),
```

**Result**: ~$0.024 per request instead of $0.05+ for all fields.

---

## Troubleshooting

### Error: `API_KEY_HTTP_REFERRER_BLOCKED`
**Cause**: Using client-side key (`NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`) for server-side requests

**Fix**:
1. Create separate server-side key
2. Use `GOOGLE_PLACES_API_KEY` in server actions
3. No `NEXT_PUBLIC_` prefix

---

### Error: `API key not valid. Please pass a valid API key.`
**Cause**: Environment variable not loaded

**Fix**:
1. Check `.env.local` has `GOOGLE_PLACES_API_KEY=...`
2. Restart dev server: `npm run dev`
3. Verify no typos in variable name

---

### Error: `This API key is not authorized to use this service or API`
**Cause**: API not enabled for this key

**Fix**:
1. Go to Google Cloud Console → API Key
2. Under "API restrictions", check "Places API (New)"
3. Save and wait 1-2 minutes for propagation

---

### Error: Works locally but not in production
**Cause**: Vercel environment variable not set

**Fix**:
1. Vercel Dashboard → Settings → Environment Variables
2. Add `GOOGLE_PLACES_API_KEY`
3. **Redeploy** (just adding var doesn't auto-deploy)

---

## Security Best Practices

### ✅ DO:
- Use separate keys for client/server
- Enable API restrictions (only enable what you need)
- Use IP restrictions for server keys (if on Vercel Pro)
- Use HTTP referrer restrictions for client keys
- Monitor usage in Google Cloud Console

### ❌ DON'T:
- Share API keys in public repos (use `.env.local`, not `.env`)
- Use `NEXT_PUBLIC_` prefix for server-side keys
- Grant access to all APIs (only enable what you need)
- Leave keys unrestricted in production

---

## API Usage Monitoring

Track costs in [Google Cloud Console](https://console.cloud.google.com/billing):

1. Go to **Billing** → **Reports**
2. Filter by: **Places API (New)**
3. Check monthly costs

**Expected Costs** (per site generation):
- Google Business autocomplete: $0.00283 per session
- Google Places API data fetch: $0.024 per request
- **Total**: ~$0.027 per site with Google Business search

**Budget Alert** (recommended):
1. Go to **Billing** → **Budgets & alerts**
2. Create budget: $10/month
3. Set alert at 50%, 75%, 100%

---

## Summary

| Task | Status | Action |
|------|--------|--------|
| Client-side key configured | ✅ Done | No action needed |
| Server-side key created | ⏳ Pending | **You must do this** |
| `.env.local` updated | ✅ Done | Replace placeholder with real key |
| Local testing | ⏳ Pending | Test after adding real key |
| Vercel env var added | ⏳ Pending | Add after local testing works |
| Production testing | ⏳ Pending | Test after Vercel deployment |

**Next Step**: Follow **Step 1-5** above to create and configure the server-side API key.
