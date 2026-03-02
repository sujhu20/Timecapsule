# Timecapsul — Deployment Guide

Deploy in ~20 minutes using **Supabase** (free PostgreSQL) + **Vercel** (free hosting) + **Resend** (free transactional email).

---

## 1. Database — Supabase

1. Create a free account at [supabase.com](https://supabase.com)
2. New project → give it a name → save the **database password**
3. Go to **Settings → Database → Connection String → URI**
4. Copy the URI — it looks like:  
   `postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres`

Keep this — you'll paste it as `DATABASE_URL` in step 4.

---

## 2. Email — Resend

1. Create a free account at [resend.com](https://resend.com)
2. Add an **API key** (Sending → API Keys → Create)
3. Add and verify a **sending domain** (or use their sandbox domain for testing)
4. Note your API key and from-address

Set these env vars:
```
EMAIL_SERVER_HOST=smtp.resend.com
EMAIL_SERVER_PORT=465
EMAIL_SERVER_SECURE=true
EMAIL_SERVER_USER=resend
EMAIL_SERVER_PASSWORD=re_YOUR_API_KEY
EMAIL_FROM=noreply@yourdomain.com
```

---

## 3. Deploy to Vercel

1. Push your code to GitHub (if not already)
2. Go to [vercel.com](https://vercel.com) → **New Project** → Import your GitHub repo
3. Vercel auto-detects Next.js — click **Deploy** (it will fail on first deploy — that's OK, we need env vars next)

---

## 4. Set Environment Variables in Vercel

Go to your project → **Settings → Environment Variables** and add:

| Variable | Value | Notes |
|---|---|---|
| `DATABASE_URL` | `postgresql://...` | From Supabase step 1 |
| `NEXTAUTH_URL` | `https://your-app.vercel.app` | Your actual Vercel URL |
| `NEXTAUTH_SECRET` | _(generate below)_ | Run: `openssl rand -base64 32` |
| `ENCRYPTION_KEY` | _(generate below)_ | Run: `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"` |
| `CRON_SECRET` | _(generate below)_ | Run: `openssl rand -base64 32` |
| `NEXT_PUBLIC_SENTRY_DSN` | _(from sentry.io)_ | Optional but recommended |
| `EMAIL_SERVER_HOST` | `smtp.resend.com` | |
| `EMAIL_SERVER_PORT` | `465` | |
| `EMAIL_SERVER_SECURE` | `true` | |
| `EMAIL_SERVER_USER` | `resend` | |
| `EMAIL_SERVER_PASSWORD` | `re_...` | Your Resend API key |
| `EMAIL_FROM` | `noreply@yourdomain.com` | |
| `GOOGLE_CLIENT_ID` | _(optional)_ | From Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | _(optional)_ | |
| `GITHUB_CLIENT_ID` | _(optional)_ | From GitHub Settings → OAuth Apps |
| `GITHUB_CLIENT_SECRET` | _(optional)_ | |

---

## 5. Run Database Migration

After setting env vars, open a **terminal** on your local machine:

```bash
# Make sure your local DATABASE_URL points to Supabase (not local SQLite)
export DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres"

cd /Users/surajdahal/Desktop/Timecapsul

# Apply migrations to production database
npx prisma migrate deploy

# Verify the schema was applied
npx prisma studio
```

---

## 6. Redeploy on Vercel

After setting all env vars and running migration:

1. Go to your Vercel project → **Deployments**
2. Click **Redeploy** on the latest deployment (or push a new commit)
3. Watch the build log — should succeed in ~2 minutes

---

## 7. Set Up Cron Job Auth

The unlock-capsules cron job uses `CRON_SECRET` for security. On Vercel, cron jobs are configured in `vercel.json` (already done — runs every 15 minutes). Vercel automatically passes the `CRON_SECRET` header.

---

## 8. Verify Everything Works

After deployment:

- [ ] Visit `https://your-app.vercel.app` — app loads
- [ ] Sign up with email — verification email arrives
- [ ] Click verification link — email confirmed, can sign in
- [ ] Create a capsule — appears on dashboard
- [ ] Visit `https://your-app.vercel.app/api/debug` — returns **403** (good!)
- [ ] Check Vercel logs for any errors

---

## Optional: Redis (Rate Limiting)

Rate limiting gracefully degrades without Redis, but for production use:

1. Create a free Redis instance at [upstash.com](https://upstash.com)
2. Copy the **REST URL** and **REST Token**
3. Add to Vercel env vars:
   ```
   REDIS_URL=https://...upstash.io
   REDIS_TOKEN=...
   ```

---

## Troubleshooting

| Symptom | Fix |
|---|---|
| Build fails | Check all env vars are set in Vercel |
| Email not received | Check Resend API key, verify sender domain |
| Sign-in fails | Check `NEXTAUTH_URL` matches your actual Vercel URL exactly |
| Capsules not unlocking | Check Vercel cron logs, verify `CRON_SECRET` is set |
| Database errors | Re-run `npx prisma migrate deploy` with correct `DATABASE_URL` |
