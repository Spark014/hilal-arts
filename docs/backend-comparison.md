# Backend Comparison for HILAL Arts

## The Use Case

HILAL Arts is a boutique Islamic calligraphy e-commerce site. Current expectations:
- **Traffic**: Low to moderate (boutique niche, not mass market)
- **Data**: Relational (products → collections → orders → users → commissions)
- **Real-time needs**: Minimal (cart sync is nice, not critical)
- **Scaling**: Unlikely to exceed free tier limits in the foreseeable future
- **Budget**: Zero for infrastructure — free tier only for now

---

## Option 1: Firebase (Google Firebase) — *Good, but not ideal*

### What you get on the free Spark plan
| Service | Free Limit |
|---|---|
| Firestore (NoSQL DB) | 50K reads/day, 20K writes/day, 1GB stored |
| Authentication | 10K verifications/month |
| Cloud Functions | 2M invocations/month |
| Hosting | 10GB bandwidth, 10GB storage |
| Cloud Storage | 5GB stored, 1GB/day download |

### Pros
- Mature ecosystem, excellent documentation
- Real-time listeners built-in (cart sync across tabs/devices)
- Authentication with Google/Apple/email out of the box
- Good Next.js integration via `firebase-admin` (server-side) and `firebase` (client-side)
- Google’s infrastructure (reliable, global CDN)

### Cons
- **Firestore is a document database** — relational data (orders with line items, products in collections) requires denormalization or awkward subcollection patterns
- **Pricing cliff** — free tier is generous, but exceeding it even once can be expensive (Firestore charges per document read; a poorly written product listing query could burn through 50K reads fast)
- **Vendor lock-in** — migrating away from Firestore is painful
- **Cloud Functions cold starts** — serverless functions can have 2–5s latency on first invocation
- **Query limitations** — no native joins, limited sorting/filtering combinations

### Verdict for HILAL Arts
**Acceptable, but overkill and potentially awkward** for a relational e-commerce schema. Fine if you love Google and want real-time cart sync.

---

## Option 2: Supabase — *Recommended*

### What you get on the free tier
| Service | Free Limit |
|---|---|
| PostgreSQL | 500MB database, unlimited rows |
| Storage | 1GB |
| Bandwidth | 2GB/month |
| Edge Functions | 500K invocations/month |
| Real-time | Unlimited connections (fair use) |
| Auth | 50K users/month |

### Pros
- **PostgreSQL** — proper relational database. Products, collections, orders, users, commissions — all naturally modeled with foreign keys, joins, and transactions
- **Row-Level Security (RLS)** — users can only read/write their own cart/orders at the database level, no backend code needed for basic auth gating
- **No vendor lock-in** — it’s open-source PostgreSQL. Export and run on AWS RDS, self-hosted, anywhere
- **Real-time subscriptions** — subscribe to database changes (e.g., cart updates, order status) via WebSocket
- **Auth built-in** — email/password, OAuth (Google, Apple, etc.), magic links
- **Edge Functions** — serverless TypeScript functions for Stripe webhooks, order confirmation emails
- **Better pricing clarity** — hard limits on free tier, no surprise per-document billing

### Cons
- Smaller community than Firebase (but growing fast)
- Real-time subscriptions have some complexity at scale
- Edge Functions are newer than Firebase Cloud Functions

### Verdict for HILAL Arts
**Best fit.** PostgreSQL naturally models e-commerce data. The free tier is more than sufficient for a boutique. RLS means less backend security code. Can self-host later if you grow.

---

## Option 3: Appwrite — *Viable alternative*

- Open-source BaaS, self-hostable
- Free cloud tier: 10GB bandwidth, 2GB storage, 750K function executions
- Smaller ecosystem, less documentation
- Good if you want to self-host later, but Supabase has more momentum

**Verdict:** Good, but Supabase is more mature for this use case.

---

## Option 4: Convex — *Overkill*

- Real-time database with reactive queries
- Free tier: 1M function calls, 1GB storage
- Excellent for collaborative real-time apps (Google Docs clones, multiplayer games)
- For a standard e-commerce site, the reactivity model adds complexity you don’t need

**Verdict:** Not worth it for this project.

---

## Option 5: PlanetScale (Serverless MySQL) + Vercel — *More manual work*

- Free tier: 5GB storage, 1B rows read/month
- You’d need to build your own API layer (Next.js API routes or a separate backend)
- No auth, no storage, no functions included — just the database

**Verdict:** Too much scaffolding. You want a BaaS, not just a database.

---

## Recommendation

**Use Supabase.**

For a boutique e-commerce site with relational data, PostgreSQL is the right foundation. Supabase gives you that plus auth, storage, serverless functions, and real-time — all on a generous free tier with clear limits. If you outgrow it, you own your data and can migrate anywhere.

Firebase is a close second if you specifically want Google SSO dominance or deeply need Firestore’s real-time sync, but the document-database model will fight you when building order management, inventory tracking, and commission workflows.

---

## Migration Path (if you grow)

| Stage | Setup |
|---|---|
| **Now (free)** | Supabase free tier + Vercel free tier |
| **Growth ($0–20/mo)** | Supabase Pro ($25/mo) for backups + more bandwidth |
| **Serious scale ($50+/mo)** | Self-host Supabase on AWS/DigitalOcean or migrate PostgreSQL to RDS |

You’ll likely stay on the free tier for a long time with boutique traffic.
