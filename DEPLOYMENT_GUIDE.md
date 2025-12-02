# QuickProSite Deployment Guide

## 🎯 Overview

This guide walks you through deploying QuickProSite to production with the new `quickprosite.com` domain.

**Total Time**: ~30 minutes
**Cost**: ~$12/year (domain)

---

## ✅ Pre-Deployment Checklist

Before starting, ensure:
- [ ] You've purchased `quickprosite.com` domain
- [ ] You have access to domain registrar (Namecheap, GoDaddy, etc.)
- [ ] You have access to Vercel dashboard
- [ ] Local testing passed (Tests 1-4)
- [ ] `GOOGLE_PLACES_API_KEY` is in `.env.local`

---

## STEP 1: Purchase Domain (5 minutes)

### Option A: Namecheap (Recommended)

1. Go to: https://www.namecheap.com/domains/registration/results/?domain=quickprosite.com
2. Click "Add to Cart"
3. **IMPORTANT**:
   - **Disable** "WhoisGuard" (not needed, saves $5/year)
   - **Disable** "PremiumDNS" (not needed for now)
4. Proceed to checkout
5. Total should be ~$10-12 for first year

### Option B: GoDaddy

1. Go to: https://www.godaddy.com/domainsearch/find?checkAvail=1&domainToCheck=quickprosite.com
2. Add to cart (around $12-15/year)
3. Checkout

---

## STEP 2: Configure DNS (10 minutes)

### For Namecheap:

1. Log into Namecheap
2. Go to: **Domain List** → **Manage** next to `quickprosite.com`
3. Go to: **Advanced DNS** tab
4. Delete all existing records
5. Add these 3 records:

| Type | Host | Value | TTL |
|------|------|-------|-----|
| **CNAME** | `*` | `cname.vercel-dns.com` | Automatic |
| **CNAME** | `www` | `cname.vercel-dns.com` | Automatic |
| **A** | `@` | `76.76.21.21` | Automatic |

**Note**: The A record IP `76.76.21.21` is Vercel's anycast IP. Vercel will provide the correct IP when you add the domain.

6. Click **Save All Changes**

---

### For GoDaddy:

1. Log into GoDaddy
2. Go to: **My Products** → **Domains** → Click `quickprosite.com`
3. Click **Manage DNS**
4. Delete all existing records except NS records
5. Add these records:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| **CNAME** | `*` | `cname.vercel-dns.com` | 1 hour |
| **CNAME** | `www` | `cname.vercel-dns.com` | 1 hour |
| **A** | `@` | `76.76.21.21` | 1 hour |

6. Save

---

## STEP 3: Add Environment Variable to Vercel (2 minutes)

**CRITICAL**: Do this BEFORE adding the domain to avoid deployment errors.

1. Go to: https://vercel.com/dashboard
2. Select your **QuickProSite** project
3. Go to: **Settings** → **Environment Variables**
4. Click **Add New**
5. Enter:
   - **Key**: `GOOGLE_PLACES_API_KEY`
   - **Value**: `AIzaSyDz6rTOnOfocKqdOznJwIhydclVBCRgaZQ` (your server-side key)
   - **Environments**: Check all boxes:
     - ✅ Production
     - ✅ Preview
     - ✅ Development
6. Click **Save**

---

## STEP 4: Add Domain to Vercel (5 minutes)

### Add Root Domain

1. In Vercel dashboard, select your project
2. Go to: **Settings** → **Domains**
3. Click **Add**
4. Enter: `quickprosite.com`
5. Click **Add**

Vercel will:
- Detect your DNS records
- Show status: "Valid" (if DNS configured correctly) or "Pending" (if DNS propagating)
- Automatically provision SSL certificate (takes 1-2 minutes)

**Expected Result**: ✅ Status shows "Valid" within 5 minutes

---

### Add Wildcard Subdomain

1. Still in **Settings** → **Domains**
2. Click **Add** again
3. Enter: `*.quickprosite.com`
4. Click **Add**

Vercel will:
- Verify wildcard DNS record exists
- Provision wildcard SSL certificate (takes 2-5 minutes)
- Show status: "Valid"

**Expected Result**: ✅ Both `quickprosite.com` AND `*.quickprosite.com` show "Valid"

---

## STEP 5: Deploy to Production (5 minutes)

### Commit and Push Code

```bash
# Navigate to project directory
cd /Users/adeoluwatokuta/tradelaunch

# Stage all changes
git add .

# Commit with descriptive message
git commit -m "Rebrand to QuickProSite + Google Business integration

- Rebrand from TradeLaunch to QuickProSite
- Update domain from tradelaunch.it.com to quickprosite.com
- Add Google Business search with real reviews
- Trade-specific and location-aware AI prompts
- Complete Editor with reviews, service management
- Fix production URLs for new domain

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>"

# Push to main branch (triggers Vercel deployment)
git push origin main
```

### Monitor Deployment

1. Watch terminal for push confirmation
2. Go to Vercel dashboard → **Deployments**
3. You should see a new deployment start immediately
4. Click on it to watch build logs
5. Wait for "✅ Deployment Ready" (~2-3 minutes)

---

## STEP 6: Verify Production (10 minutes)

### Test 1: Main Domain

```bash
# Visit in browser:
https://quickprosite.com

# Expected result:
✅ Home page loads with QuickProSite branding
✅ Google Business search works
✅ Form displays correctly
✅ No SSL errors
✅ No console errors
```

---

### Test 2: WWW Redirect

```bash
# Visit in browser:
https://www.quickprosite.com

# Expected result:
✅ Redirects to https://quickprosite.com (no www)
```

---

### Test 3: Generate Test Site

```bash
1. On https://quickprosite.com
2. Search Google Business: "Plumbing Austin" (or any real business)
3. Select a result
4. Verify form pre-populates
5. Select Trade: "Plumbing"
6. Click "Generate My Site"
7. Should redirect to: https://{subdomain}.quickprosite.com
```

**Expected Result**:
- ✅ Site loads at subdomain URL (e.g., `joes-plumbing.quickprosite.com`)
- ✅ Real Google reviews appear
- ✅ No "Invalid Configuration" error
- ✅ SSL certificate valid for subdomain

---

### Test 4: Editor

```bash
1. Go to: https://quickprosite.com/dashboard
2. Click "Edit" on generated site
3. Make a change (e.g., edit headline)
4. Click "Save Changes"
5. Click "View Live Site"
6. Verify changes appear on live site
```

**Expected Result**:
- ✅ Editor loads correctly
- ✅ Changes save successfully
- ✅ "View Live Site" opens correct subdomain URL
- ✅ Changes reflected immediately

---

## STEP 7: DNS Propagation Check (Optional)

If subdomain doesn't work immediately:

1. Go to: https://dnschecker.org
2. Enter: `test.quickprosite.com`
3. Check if DNS propagated globally

**What to expect**:
- Green checkmarks = DNS propagated (good)
- Red X's = Still propagating (wait 5-30 minutes)
- Mixed = In progress (wait 10-15 minutes)

DNS typically propagates in:
- **5-10 minutes**: Most locations
- **30-60 minutes**: Globally
- **24 hours**: Maximum (rare)

---

## 🚨 Troubleshooting

### Issue: "Invalid Configuration" on Subdomain

**Causes**:
1. DNS not propagated yet → Wait 10-30 minutes
2. Wildcard domain not added to Vercel → Check Settings → Domains
3. DNS CNAME incorrect → Check registrar DNS settings

**Fix**:
```bash
# Check DNS propagation:
dig +short test.quickprosite.com

# Should return: cname.vercel-dns.com (or similar)
# If empty: DNS not propagated yet
```

---

### Issue: "This site can't provide a secure connection" (SSL Error)

**Cause**: SSL certificate provisioning in progress

**Fix**: Wait 5-10 minutes for Vercel to provision wildcard SSL cert

---

### Issue: Google Business Search Returns 403 Error

**Cause**: `GOOGLE_PLACES_API_KEY` not set in Vercel

**Fix**:
1. Vercel → Settings → Environment Variables
2. Add `GOOGLE_PLACES_API_KEY`
3. **Redeploy** (Settings → Deployments → ... → Redeploy)

---

### Issue: Site Loads But Google Business Search Doesn't Work

**Cause**: Environment variable added but deployment not redeployed

**Fix**:
1. Vercel → Deployments
2. Click latest deployment → ... → **Redeploy**
3. Wait for new deployment to complete

---

## ✅ Success Criteria

You're production-ready when:

- [x] `https://quickprosite.com` loads without errors
- [x] `https://test.quickprosite.com` shows "Site Not Found" (expected - no test site created)
- [x] Google Business search returns results
- [x] Site generation works end-to-end
- [x] Generated sites accessible at `{subdomain}.quickprosite.com`
- [x] Editor loads and saves changes
- [x] No SSL certificate errors
- [x] No console errors in browser

---

## 📊 Post-Deployment Checklist

After successful deployment:

- [ ] Test site generation 3-5 times with different businesses
- [ ] Test Editor on different sites
- [ ] Check Vercel function logs for errors
- [ ] Monitor OpenAI usage (https://platform.openai.com/usage)
- [ ] Monitor Google Places API usage (Google Cloud Console)
- [ ] Set up billing alerts (OpenAI: $10/month, Google: $5/month)
- [ ] Bookmark production URLs:
  - Main site: https://quickprosite.com
  - Dashboard: https://quickprosite.com/dashboard
  - Vercel logs: https://vercel.com/dashboard

---

## 🎉 You're Live!

Congratulations! QuickProSite is now live in production.

**Next Steps:**
1. Create your first real customer site
2. Share with friends/beta testers
3. Gather feedback
4. Iterate on features

**Future Enhancements** (post-MVP):
- Payment integration (Stripe)
- Custom domains for customers
- Analytics dashboard
- Multi-page sites
- Template variations
- SEO optimization tools

---

## 📞 Support

If you encounter issues:
1. Check **Troubleshooting** section above
2. Review Vercel deployment logs
3. Check browser console for errors
4. Review GOOGLE_API_SETUP.md for API issues

**Domain/DNS Issues**: Contact domain registrar support (Namecheap, GoDaddy)
**Vercel Issues**: Check https://vercel.com/docs or support
**API Issues**: Check Google Cloud Console or OpenAI dashboard
