# Student Reuse Marketplace (CampuShare)
## Master Deployment, Codespaces & Handover Guide

> **Project Reference Card**  
> This guide contains complete documentation, deployment instructions, Codespace setup, and database operational procedures so you can continue building and maintaining the platform outside Antigravity.
>
> *(Note: Raw private tokens are securely stored in your local `.env.local` and `CREDENTIALS_VAULT.local.md`, which are excluded from Git to comply with GitHub Push Protection).*

---

## 1. Quick Access Summary

| Resource | Value / Link |
| :--- | :--- |
| **Live Production Web App** | [https://student-reuse-marketplace.vercel.app](https://student-reuse-marketplace.vercel.app) |
| **GitHub Repository** | [https://github.com/arhalok/Student-reuse-marketplace](https://github.com/arhalok/Student-reuse-marketplace) |
| **1-Click GitHub Codespace** | [Launch in Codespaces](https://github.com/codespaces/new?repo=arhalok/Student-reuse-marketplace) |
| **Supabase Project Dashboard** | [https://supabase.com/dashboard/project/rcuoznqhdzqmkgzrkzmw](https://supabase.com/dashboard/project/rcuoznqhdzqmkgzrkzmw) |
| **Vercel Project Dashboard** | [https://vercel.com/arhalok-3780s-projects/student-reuse-marketplace](https://vercel.com/arhalok-3780s-projects/student-reuse-marketplace) |

---

## 2. Infrastructure & Configuration Overview

### A. GitHub Repository
- **Repository:** `https://github.com/arhalok/Student-reuse-marketplace.git`
- **Default Branch:** `main`
- **Authentication:** Use your GitHub Personal Access Token (PAT) as the password when cloning or pushing via HTTPS:
  ```bash
  git remote set-url origin https://x-access-token:<YOUR_GITHUB_PAT>@github.com/arhalok/Student-reuse-marketplace.git
  ```

---

### B. Vercel Production Hosting
- **Project Name:** `student-reuse-marketplace`
- **Project ID:** `prj_39x9PLne6uF6cw4s5Wv8gS5KmKCZ`
- **Team ID:** `team_KtYCNsde9EcI8ohQGMHR0dos`
- **Live Production URL:** [https://student-reuse-marketplace.vercel.app](https://student-reuse-marketplace.vercel.app)
- **Active Environment Variables on Vercel:**
  - `NEXT_PUBLIC_SUPABASE_URL` = `https://rcuoznqhdzqmkgzrkzmw.supabase.co`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `sb_publishable_bL6RYNigegvVDMcowwo1Iw_TL-PvFYT`
  - `NEXT_PUBLIC_STORAGE_BUCKET` = `listing-images`

---

### C. Supabase Backend
- **Project Reference ID:** `rcuoznqhdzqmkgzrkzmw`
- **Project URL:** `https://rcuoznqhdzqmkgzrkzmw.supabase.co`
- **Publishable / Anon API Key:** `sb_publishable_bL6RYNigegvVDMcowwo1Iw_TL-PvFYT`
- **PostgreSQL Pooler Host:** `aws-0-ap-southeast-1.pooler.supabase.com:5432`
- **Database Name:** `postgres`
- **User:** `postgres.rcuoznqhdzqmkgzrkzmw`

---

## 3. How to Run & Work on the Project Outside Antigravity

### Option 1: 1-Click in GitHub Codespaces (Zero Setup)
The repository includes an automated `.devcontainer/devcontainer.json` configuration:
1. Open the repository on GitHub: [https://github.com/arhalok/Student-reuse-marketplace](https://github.com/arhalok/Student-reuse-marketplace)
2. Click **Code** → **Codespaces** → **Create codespace on main**.
3. Codespaces automatically:
   - Provisions a Node.js 20 Linux container.
   - Runs `npm install` in the background.
   - Forwards port `3000` with preview.
4. Once loaded, simply start the dev server:
   ```bash
   npm run dev
   ```
5. Click **Open in Browser** to test!

---

### Option 2: Run Locally on Your Machine (Mac, Windows, Linux)

#### 1. Clone the repository
```bash
git clone https://github.com/arhalok/Student-reuse-marketplace.git
cd Student-reuse-marketplace
```

#### 2. Install dependencies
```bash
npm install
```

#### 3. Setup environment variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

#### 4. Run the development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

#### 5. Verify production build
```bash
npm run build
```

---

## 4. How Database Migrations Work

The database schema is written, tested, and idempotent.

### Running Migrations Automatically
To apply schema updates to your live Supabase database at any time, run:
```bash
npm run db:migrate
```
*(This runs `node scripts/apply-schema.js`, which connects to your Supabase PostgreSQL database and applies `supabase/schema.sql`).*

### Using the Supabase CLI (Optional)
```bash
# 1. Login to Supabase CLI
npx supabase login

# 2. Link your local directory to your remote project
npx supabase link --project-ref rcuoznqhdzqmkgzrkzmw

# 3. Push schema migrations
npx supabase db push
```

### Direct via Supabase Web Dashboard
1. Go to [https://supabase.com/dashboard/project/rcuoznqhdzqmkgzrkzmw](https://supabase.com/dashboard/project/rcuoznqhdzqmkgzrkzmw)
2. Click **SQL Editor** in the left sidebar.
3. Open `supabase/schema.sql`, copy the contents, paste into the editor, and click **Run**.

---

## 5. How Deployments Work (Automated CI/CD)

The GitHub repository is linked directly to Vercel:

```text
Edit Code (Local or Codespaces)
         ↓
git commit -m "feat: new feature"
         ↓
git push origin main
         ↓
GitHub Webhook triggers Vercel
         ↓
Vercel builds with Next.js Turbopack
         ↓
Live automatically at https://student-reuse-marketplace.vercel.app
```

---

## 6. Key Features Implemented in the Codebase

1. **Semester Procurement Engine (`SemesterPackModal.tsx`)**:
   - Compares buying new (₹4,274) vs. campus reuse bundle (₹1,610) — saving 62% for incoming semester students.
2. **Reverse Demand Engine ("Need Board" - `NeedBoardModal.tsx`)**:
   - Students post requests (budget, condition, required-by date).
   - Proactive match notifications when relevant items get listed.
3. **Standardized Condition & Category Inspection Checklist**:
   - Calculators: Keypad wear, battery condition, LCD scratches/dead pixels, cover test.
   - Textbooks: Edition verification, page markings, binding integrity, missing pages.
4. **Offer Negotiation & Handoff Lifecycle (`OfferModal.tsx`)**:
   - `ACTIVE` → `OFFER_RECEIVED` → `RESERVED` → `MEETING_SCHEDULED` → `SOLD`.
   - Campus safe meetup spot selector (Library Foyer, SAC Cafe, Security Gate).
   - Direct peer-to-peer UPI QR code payment simulation.
5. **Safety, Moderation & Campus Telemetry (`ReportModal.tsx` & `CampusHealthDashboardModal.tsx`)**:
   - 1-click reporting for counterfeit/prohibited items.
   - Real-time campus reuse savings metrics (CO2 avoided, student rupees saved).

---

## 7. Summary of Useful Commands

| Task | Command |
| :--- | :--- |
| Start Dev Server | `npm run dev` |
| Build for Production | `npm run build` |
| Run Lint Check | `npm run lint` |
| Apply Database Migrations | `npm run db:migrate` |
| Push to GitHub | `git push origin main` |
