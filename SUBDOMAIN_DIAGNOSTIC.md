# Subdomain Routing Diagnostic Guide

## Problem Statement
Wildcard subdomain `*.quickprosite.com` shows "Invalid Configuration" on Vercel after proper DNS/domain setup.

## Potential Root Causes
1. DNS propagation incomplete
2. Vercel project configuration missing wildcard domain
3. SSL certificate provisioning failed for wildcard
4. Domain registrar DNS settings incorrect

---

## STEP 1: Verify Vercel Domain Configuration

### Action:
1. Log into Vercel dashboard
2. Navigate to your project → Settings → Domains
3. Check if `*.tradelaunch.it.com` appears in the domain list

### Expected Results:
✅ **GOOD**: `*.tradelaunch.it.com` is listed with status "Valid"
❌ **BAD**: Domain not listed, or shows "Invalid Configuration"

### If BAD:
- Try removing and re-adding the wildcard domain
- Check if Vercel requires the base domain (`tradelaunch.it.com`) to be added FIRST before wildcard
- Screenshot any error messages

---

## STEP 2: Verify DNS Records

### Action:
Run these commands in your terminal:

```bash
# Check if wildcard CNAME exists
dig +short test.tradelaunch.it.com

# Check if it points to Vercel
dig +short tradelaunch.it.com

# Check DNS propagation globally
# Visit: https://dnschecker.org
# Enter: test.tradelaunch.it.com
```

### Expected Results:
✅ **GOOD**:
- `test.tradelaunch.it.com` → `cname.vercel-dns.com` or similar
- DNS propagated globally (green checkmarks on dnschecker.org)

❌ **BAD**:
- No DNS response
- Points to wrong server
- Not propagated (red X's on dnschecker.org)

### If BAD:
Check your domain registrar (Namecheap, GoDaddy, etc.) DNS settings:
- Ensure CNAME record exists: `*.tradelaunch.it` → `cname.vercel-dns.com`
- Note: For `.it.com` domains, you may need TWO records:
  - `*` (wildcard for subdomains)
  - `@` (root domain)

---

## STEP 3: Test Vercel's Wildcard Recognition

### Action:
1. Deploy current code to Vercel
2. Check Vercel deployment logs for middleware execution
3. Visit `https://test.tradelaunch.it.com` in browser
4. Open browser DevTools → Network tab
5. Check request headers

### Expected Results:
✅ **GOOD**:
- Request shows `host: test.tradelaunch.it.com`
- Vercel recognizes subdomain
- Middleware log shows: "Subdomain detected: test"

❌ **BAD**:
- 404 or "Invalid Configuration" page
- No middleware execution in logs
- Host header missing or incorrect

---

## STEP 4: Check SSL Certificate Status

### Action:
```bash
# Check SSL certificate
curl -vI https://test.tradelaunch.it.com 2>&1 | grep -i "SSL\|certificate"

# Or visit in browser and click padlock icon → Certificate
```

### Expected Results:
✅ **GOOD**: Valid SSL cert issued by Let's Encrypt/Vercel for `*.tradelaunch.it.com`
❌ **BAD**: SSL error, cert only covers `tradelaunch.it.com` (not wildcard)

### If BAD:
- Vercel may not have provisioned wildcard SSL yet (can take 24-48 hours)
- `.it.com` domains might have special SSL requirements

---

## STEP 5: Test with Alternative TLD (Diagnostic Only)

### Action:
**Temporarily** test if Vercel supports YOUR wildcard setup by trying a standard TLD:

1. Register a cheap `.com` domain (e.g., `tradelaunch-test.com`) on Namecheap
2. Add `*.tradelaunch-test.com` to Vercel
3. Configure DNS wildcard CNAME
4. Test `test.tradelaunch-test.com`

### Expected Results:
✅ **GOOD**: Works perfectly → Confirms `.it.com` is the issue
❌ **BAD**: Still fails → Middleware or Vercel config issue

---

## STEP 6: Check Vercel Function Logs

### Action:
1. In Vercel dashboard → Deployments → Select latest
2. Click "Functions" tab
3. Find `middleware` function
4. Check logs for subdomain detection

### Expected Logs:
```
[middleware] hostname: test.tradelaunch.it.com
[middleware] subdomain detected: test
[middleware] rewriting to: /site/test
```

### If Missing:
- Middleware not executing (Vercel issue)
- Hostname not passed correctly
- Add debug logging (see Step 7)

---

## STEP 7: Add Debug Logging to Middleware

### Action:
Add this to `middleware.ts` after line 15:

```typescript
export default clerkMiddleware(async (auth, req) => {
  const url = req.nextUrl;
  const hostname = req.headers.get("host");

  // DEBUG LOGGING
  console.log("🔍 [MIDDLEWARE DEBUG]");
  console.log("  hostname:", hostname);
  console.log("  pathname:", url.pathname);
  console.log("  full URL:", req.url);

  // ... rest of middleware
```

Then:
1. Deploy to Vercel
2. Visit `test.tradelaunch.it.com`
3. Check Vercel function logs
4. Share output with me

---

## KNOWN ISSUE: .it.com TLD Limitations

### Research Findings:
`.it.com` is a **third-level domain** under Italy's ccTLD (`.it`). Some platforms treat it differently than standard TLDs.

**Potential Issues**:
- Wildcard DNS may require special configuration at `.it` registry level
- Some CDNs (including Vercel) may not recognize `.it.com` as a valid wildcard root
- SSL provisioning might fail for third-level wildcard domains

### Workarounds:

**Option A: Use Standard TLD**
- Switch to `tradelaunch.com`, `tradelaunch.io`, or `tradelaunch.app`
- Pros: Guaranteed Vercel support
- Cons: Need to buy new domain

**Option B: Use Subdomain Instead of Wildcard**
- Instead of `*.tradelaunch.it.com` → `sites.tradelaunch.it.com/business-name`
- Pros: Works with any TLD
- Cons: Longer URLs, need to rewrite middleware

**Option C: Cloudflare Workers Proxy**
- Keep `.it.com` domain, proxy through Cloudflare
- Cloudflare handles wildcard subdomain routing
- Proxy to Vercel backend
- Pros: Keep existing domain
- Cons: Added complexity, Cloudflare Workers cost

**Option D: Contact Vercel Support**
- Open ticket: "Wildcard subdomain for .it.com domain not working"
- Share domain, project ID, DNS config
- Ask if `.it.com` is supported
- Pros: Official answer
- Cons: Support response time (24-72 hours)

---

## RESULTS REPORTING

After running steps 1-6, please report:

1. **Vercel Domain Status**: Valid / Invalid / Not Listed
2. **DNS Propagation**: Complete / Incomplete / Failed
3. **SSL Certificate**: Valid Wildcard / Only Root / Missing
4. **Middleware Logs**: Subdomain detected / Not detected / No logs
5. **Browser Behavior**: What error appears when visiting `test.tradelaunch.it.com`?

Share these results and I'll provide the exact fix.

---

## IMMEDIATE WORKAROUND (While We Diagnose)

To continue development and testing while subdomain issue is being resolved:

### Use localhost subdomain routing:
```bash
# Edit your /etc/hosts file (Mac/Linux)
sudo nano /etc/hosts

# Add these lines:
127.0.0.1  test.localhost
127.0.0.1  demo.localhost
127.0.0.1  joes-plumbing.localhost

# Save and exit
```

Then:
- Run `npm run dev`
- Visit `http://test.localhost:3000`
- Middleware will detect subdomain and route correctly
- You can test all features locally while production subdomain is fixed

This lets you continue building without waiting for production subdomain fix.
