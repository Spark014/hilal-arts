# Supabase vs Firebase vs Appwrite — For HILAL Arts

## Your Context
- 13 products, boutique Islamic calligraphy e-commerce
- Low-to-moderate traffic (hundreds of visitors/day, not thousands)
- Next.js 16 + React 19 frontend
- Stripe for payments
- Need: database, auth, storage, serverless functions

---

## Traffic Handling — All Three Handle You Easily

| Platform | Free Tier Rough Capacity | Your Expected Load |
|---|---|---|
| **Supabase** | ~2,000 full page loads/day (2GB bandwidth) | ~50-200/day at launch |
| **Firebase** | ~50K Firestore reads/day | Same |
| **Appwrite** | 10GB bandwidth/month (~3,000 loads/day) | Same |

**Verdict:** All three laugh at your traffic. A single viral Instagram post won't break any of them.

---

## Free Tier Deep Dive — What You Actually Get

### Supabase (Free "Starter" Plan)

| Feature | Limit | Enough? |
|---|---|---|
| PostgreSQL storage | 500MB | ✅ Yes — your data is tiny |
| Bandwidth | 2GB/month | ✅ Yes — ~2,000 page loads |
| Auth users | 50K/month | ✅ You'll have <100 in year 1 |
| Edge Functions | 500K calls/month | ✅ Checkout + webhooks = ~1K/month |
| Storage | 1GB | ⚠️ Fine if you keep images in `/public` |
| Real-time connections | 200 concurrent | ✅ Overkill |
| Backups | Daily for 7 days | ✅ Included |
| Custom domains | ❌ Not on free | ❌ You'd use `xxx.supabase.co` |

**The catch:** No custom domain on free tier. Your DB URL will be `abcdef123.supabase.co`. Fine for MVP, looks unprofessional if you hand it to a client later.

**Pricing cliff:** Pro is $25/month. That's when you get custom domains, more storage, and priority support.

---

### Firebase (Spark Plan — Free)

| Feature | Limit | Enough? |
|---|---|---|
| Firestore reads | 50K/day | ✅ Yes |
| Firestore writes | 20K/day | ✅ Yes |
| Firestore storage | 1GB | ✅ Yes |
| Auth verifications | 10K/month | ✅ Yes |
| Cloud Functions | 2M invocations/month | ✅ Yes |
| Hosting | 10GB storage + 10GB/month transfer | ✅ Yes |
| Cloud Storage | 5GB stored + 1GB/day download | ✅ Yes |
| Real-time Database (legacy) | 100 concurrent connections | ✅ Yes |

**The catches:**
- **Firestore is document-based** — orders with line items, product variants, and cart items get messy. You denormalize (duplicate data) or deal with client-side joins. It's doable but feels wrong for e-commerce.
- **Pricing surprises** — Firestore charges per document read. If you write a sloppy product listing query that reads 100 docs per page load, you burn through 50K fast. You have to be careful.
- **Vendor lock-in** — Migrating off Firestore is painful. The data model doesn't translate to SQL.

**Pricing cliff:** Blaze plan is pay-as-you-go. A small project might cost $5-15/month. But a bad query or traffic spike can surprise you.

---

### Appwrite (Free Cloud Tier)

| Feature | Limit | Enough? |
|---|---|---|
| Database | 10GB | ✅ Yes |
| Bandwidth | 10GB/month | ✅ Yes — more than Supabase |
| Auth users | 75K/month | ✅ Yes |
| Functions | 1.5M executions/month | ✅ Yes |
| Storage | 2GB | ✅ Yes |
| Teams/collaborators | 1 (just you) | ✅ Fine for solo |
| Projects | 1 | ⚠️ Only 1 project on free |
| Custom domains | ✅ Yes, even on free | ✅ Big plus |

**The catches:**
- **Newer, smaller ecosystem** — Fewer Stack Overflow answers, fewer tutorials, smaller community
- **Next.js integration** — Appwrite has a JS SDK, but Supabase's Next.js integration is more mature (Server Actions, middleware, SSR auth)
- **Database is MariaDB (MySQL fork)** — Good for relational data, but PostgreSQL has richer features (JSONB, better full-text search, PostGIS if you ever need it)
- **One project only** — If you want a separate staging project, you need to upgrade ($15/month)

**Pricing cliff:** Starter is $15/month for 3 projects + more resources.

---

## Head-to-Head for Your Specific Stack

| Question | Supabase | Firebase | Appwrite |
|---|---|---|---|
| **Best for relational e-commerce data?** | ✅ PostgreSQL — natural fits | ❌ Firestore — you fight it | ⚠️ MariaDB — fine, less mature |
| **Next.js integration?** | ✅ Excellent (SSR auth, middleware) | ⚠️ Okay (client-heavy) | ⚠️ Newer, less docs |
| **Stripe webhook handling?** | ✅ Edge Functions + full Node runtime | ✅ Cloud Functions | ⚠️ Functions exist, less tested |
| **Real-time cart sync?** | ✅ Built-in subscriptions | ✅ Realtime listeners | ✅ Realtime, newer |
| **Image hosting for products?** | ⚠️ 1GB limit (keep in `/public`) | ✅ 5GB Storage generous | ✅ 2GB, custom domain on free |
| **Auth (email + social)?** | ✅ Excellent, social included | ✅ Excellent, social included | ✅ Good, social included |
| **Custom domain on free?** | ❌ No | ✅ Yes (Firebase Hosting) | ✅ Yes |
| **Self-host later?** | ✅ Open source, Docker | ❌ No (Google-only) | ✅ Open source, Docker |
| **Migration if you grow?** | ✅ Export PostgreSQL, run anywhere | ❌ Painful | ✅ Export MariaDB |
| **Community/docs maturity?** | ✅ Large, growing fast | ✅ Massive, battle-tested | ⚠️ Smaller, newer |
| **Vercel native feel?** | ✅ Yes (same DNA — edge, serverless) | ⚠️ Okay | ⚠️ Okay |

---

## Firebase — Should You Consider It?

**Firebase is better than Supabase if:**
- You want to stay 100% in the Google ecosystem (Firebase Auth + Google Sign-In dominance)
- You deeply need Firestore's real-time sync (live collaborative carts, which you don't)
- You want Firebase Hosting + CDN + Analytics as a one-stop shop
- You're building a mobile app later (Firebase's mobile SDKs are excellent)

**Firebase is worse than Supabase if:**
- You want clean relational data (orders → order_items → products → collections)
- You want to self-host or migrate later
- You want predictable pricing (Firestore's per-read billing can surprise you)
- You want to write SQL directly for reporting/admin queries

**For HILAL Arts:** The relational data model (products in collections, orders with line items, commissions with statuses) fits SQL naturally. Firestore makes you think in documents and duplications. Not worth it unless you have a specific Firebase reason.

---

## Appwrite — Should You Consider It?

**Appwrite is better than Supabase if:**
- You want a **custom domain on the free tier** (Supabase doesn't offer this)
- You want **more free bandwidth** (10GB vs 2GB)
- You want **more free database storage** (10GB vs 500MB)
- You prefer a **self-hosted BaaS** later (Appwrite's Docker setup is smooth)
- You want a **single dashboard** for everything (Appwrite's UI is clean and unified)

**Appwrite is worse than Supabase if:**
- You need **mature Next.js patterns** (SSR auth, middleware, Server Actions — Supabase has more examples)
- You want **PostgreSQL specifically** (JSONB, advanced queries, PostGIS — MariaDB is simpler)
- You need **extensive community answers** (Supabase has more Stack Overflow / Reddit threads)
- You want **Vercel-native deployment** (Supabase and Vercel share a lot of DNA and integration docs)

**For HILAL Arts:** Appwrite is genuinely competitive. The free tier is more generous. But you're trailblazing — fewer tutorials for "Appwrite + Next.js 16 + Stripe" specifically. If you're comfortable reading source code and experimenting, it's a strong dark horse.

---

## The Real Decision Matrix

| Priority | Winner |
|---|---|
| **Data model fits e-commerce naturally** | Supabase |
| **Free tier won't surprise me** | Supabase or Appwrite |
| **I want to self-host later** | Supabase or Appwrite |
| **I want the most docs + tutorials** | Supabase |
| **I want custom domain without paying** | Appwrite or Firebase |
| **I want maximum free bandwidth** | Appwrite |
| **I'm already in Google ecosystem** | Firebase |
| **I'm building a mobile app next** | Firebase |
| **I want Vercel-native feel** | Supabase |

---

## My Recommendation for HILAL Arts

**Use Supabase.** Here's why it's the right call for *your* project:

1. **Your data is relational** — Products belong to collections. Orders have line items. Commissions have statuses and histories. SQL is the natural language for this. Firestore forces you to unlearn relational thinking.

2. **You're already on Vercel** — Supabase and Vercel are built for the same world (edge functions, serverless, Next.js App Router). The integration is buttery.

3. **Stripe webhooks + Edge Functions** — Supabase Edge Functions run Deno/Node, have full runtime, and the webhook handling pattern is well-documented. Appwrite's functions work but have less community validation for this exact pattern.

4. **Future-proofing** — When you add an admin dashboard, run sales reports, or query "show me all orders from Dubai in March," you'll write SQL. With Firestore, you'd write complex client-side code or Cloud Functions.

5. **The free tier limits are real but fine** — 2GB bandwidth is your only constraint. Keep product images in Next.js `/public` (hosted on Vercel's CDN, free) instead of Supabase Storage. Use Supabase Storage only for user uploads (commission reference photos). Then 2GB is more than enough.

**If the no-custom-domain thing bugs you:** You can add a custom domain to Supabase for $25/month (Pro plan). Or just use the free tier for now and upgrade when you launch — it's a trivial cost for a business making sales.

**If you want to be contrarian:** Appwrite is genuinely good. The free tier is more generous. But you're trading some maturity and Next.js-specific docs for that. Only pick it if you're excited to figure things out with less hand-holding.

---

## Quick Cost Projection (Year 1)

| Platform | Free Tier | Expected Paid Usage | Year 1 Cost |
|---|---|---|---|
| **Supabase** | Handles everything | Probably nothing | **$0** |
| **Firebase** | Handles everything | Maybe $5-15/mo if traffic surprises | **$0–$180** |
| **Appwrite** | Handles everything | Probably nothing | **$0** |

All three are effectively free for your scale. The decision is about developer experience and data model fit, not cost.

---

## What About Using Firebase + Supabase Together?

Some people use Firebase Auth (better social login) + Supabase DB (better relational data). This is overkill for a 13-product boutique. Pick one backend. Adding two BaaS services means two SDKs, two dashboards, two sets of environment variables, and two potential failure points. Not worth the complexity.

**Exception:** If you already have Firebase Auth users from a previous project, migrating them to Supabase Auth is annoying. In that case, keep Firebase Auth and use Supabase for the database. But you're starting fresh, so pick one.

---

## Final Verdict

| Rank | Platform | Why |
|---|---|---|
| **1st** | **Supabase** | PostgreSQL fits your data. Best Next.js integration. Safe long-term bet. |
| **2nd** | **Appwrite** | More generous free tier. Custom domain on free. Good if you like experimenting. |
| **3rd** | **Firebase** | Excellent but wrong data model for this project. Pick only if you're all-in Google. |

Go with Supabase. The data model alone wins it.
