# CampuShare — Student Reuse Marketplace 🎓

> **Core Principle:** *Buy less. Reuse more. Spend less.*  
> A campus-first marketplace for buying, selling, exchanging, renting, and giving away reusable student academic essentials.

Built with **Next.js (App Router)**, **Tailwind CSS**, and **Supabase (PostgreSQL + RLS)** — deployed live on **Vercel**.

🌐 **Live Application:** [https://student-reuse-marketplace.vercel.app](https://student-reuse-marketplace.vercel.app)  
📦 **GitHub Repository:** [https://github.com/arhalok/Student-reuse-marketplace](https://github.com/arhalok/Student-reuse-marketplace)

---

## 🚀 3-Minute Vercel & Supabase Deployment

This project was built intentionally as a **modular monolith** with zero unnecessary microservices, making it painless to deploy:

### Step 1: Set Up Supabase Database
1. Go to [database.new](https://database.new) and create a free Supabase project.
2. In your Supabase Dashboard, navigate to the **SQL Editor** in the left sidebar.
3. Open the [`supabase/schema.sql`](./supabase/schema.sql) file from this repository, copy its contents, and click **Run**.
   - This sets up all tables (`campuses`, `profiles`, `listings`, `need_requests`, `offers`, `messages`, `exchange_spots`), Row Level Security (RLS) policies, and seed data.
4. Go to **Project Settings** → **API** and copy:
   - **Project URL**
   - **anon / public key**

### Step 2: Deploy to Vercel
1. Push this project to GitHub (or import directly into [Vercel](https://vercel.com)).
2. Click **New Project** on Vercel and import the repository.
3. In **Environment Variables**, add:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   NEXT_PUBLIC_STORAGE_BUCKET=listing-images
   ```
4. Click **Deploy**! Your production campus marketplace is live with automatic SSL and global CDN.

---

## 💻 Local Development

```bash
# 1. Install dependencies
npm install

# 2. (Optional) Configure Supabase environment variables in .env.local
cp .env.example .env.local

# 3. Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

> **Zero-Friction Local Testing:** The application contains a built-in reactive local store seeded with IIT Delhi and BITS Pilani student listings, offers, and requests. You can test and demo every flow even before linking your Supabase keys!

---

## 🌟 Key Differentiators Implemented

Unlike generic classifieds (OLX) or book-only apps (Bookchor), CampuShare solves the student reuse problem through **workflow and campus intelligence**:

### 1. Semester-Aware Marketplace ("What Do I Need For My Semester?")
- Maps academic requirements directly to `Course → Semester → Subject → Item`.
- **Side-by-side procurement comparison:**
  - *Buy New:* ₹4,274
  - *Buy Used on Campus:* ₹1,610
  - *Student Savings:* **₹2,664 (62% OFF)**
- 1-click filter for all active listings relevant to Semester 1, 2, 3, etc.

### 2. Demand Before Supply ("Need Board")
- Students post requests before items exist: *"Need Casio FX-991CW under ₹850"*.
- **Proactive Matching Engine:**
  - When a seller posts an item, it automatically matches open Need Requests and alerts both parties.
  - When a buyer posts a need, it immediately scans existing campus supply.

### 3. Smart Listing Creator (< 1 Minute)
- 1-click presets for common campus gear (Casio calculators, Kreyszig math books, drawing kits, lab coats).
- **Fair Price Assistance:** Calculates empirical resale range (e.g. ₹650–₹850, suggested ₹750) based on condition and original retail price.
- **Standardized Condition System:** `Like New`, `Excellent`, `Good`, `Fair`, `For Parts`.
- **Textbook Inspection Checklist:** Tracks highlighting, writing, missing pages, and edition to eliminate disputes.

### 4. 4 Core Transaction Modes
- **BUY:** Standard second-hand purchase.
- **EXCHANGE:** Book/item swaps (e.g. *"Physics book + ₹100 for your Math book"*).
- **RENT:** Temporary semester rentals for expensive components (e.g. Arduino kits @ ₹80/week).
- **GIVE AWAY:** Free campus gifting for lab coats, notes, and records.

### 5. Explicit Transaction Lifecycle & Offer Engine
```text
DRAFT → ACTIVE → OFFER_RECEIVED → RESERVED → MEETING_SCHEDULED → SOLD
```
- Buyers make offers with custom amounts.
- Sellers can **Accept**, **Counter-Offer**, or **Decline**.
- Scheduled meetups at designated safe campus spots: *Central Library Foyer*, *SAC Cafe*, *Gate 2 Guard Desk*.
- Direct **UPI payment verification** on physical inspection (QR code & UPI ID).

### 6. Senior → Junior Loop & "Passed Semester?" Prompt
- Seniors completing a semester or graduating can bundle their entire term's items (*"Semester Starter Pack Bundle"*) in 1 click for incoming juniors.

### 7. Campus Trust & Verified Student Badges
- Verified college email badges (`rahul.cs21@iitd.ac.in`).
- Public student trust metrics: successful reuse count, response rate (96%), avg response time (14 min).

---

## 📁 Project Structure

```text
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── listings/route.ts       # Supabase REST route with fallback
│   │   ├── globals.css                 # Tailwind v4 styling
│   │   ├── layout.tsx                  # Root layout with MarketplaceProvider
│   │   └── page.tsx                    # Main campus marketplace view
│   ├── components/
│   │   ├── Navbar.tsx                  # Campus & student persona switchers
│   │   ├── CampusBanner.tsx            # Campus impact metrics & semester tabs
│   │   ├── ListingCard.tsx             # Standardized card with price savings
│   │   ├── CreateListingModal.tsx      # < 1 min listing flow with fair price engine
│   │   ├── NeedBoardModal.tsx          # Reverse marketplace demand engine
│   │   ├── SemesterPackModal.tsx       # Semester procurement & starter pack view
│   │   ├── SellSemesterModal.tsx       # "Passed Semester" bundle generator
│   │   ├── OfferModal.tsx              # Negotiation, meetup scheduler & UPI flow
│   │   ├── ActiveOffersModal.tsx       # Negotiation tracking center
│   │   └── ListingDetailsModal.tsx     # Full condition inspection & trust profile
│   └── lib/
│       ├── types.ts                    # Domain TypeScript types
│       ├── mock-data.ts                # Initial campus seed dataset
│       ├── store.tsx                   # Reactive marketplace state & matching engine
│       └── supabase/
│           ├── client.ts               # Browser Supabase client
│           ├── server.ts               # Server Supabase client
│           └── database.types.ts       # Typed Supabase PostgreSQL schema
├── supabase/
│   └── schema.sql                      # Production Supabase PostgreSQL DDL & RLS
├── .env.example                        # Template for Vercel/local credentials
└── package.json
```

---

## 🧪 Testing the MVP Demo Story

1. Open the app in your browser.
2. In the top-right persona switcher, ensure you are **Rahul Sharma (Senior Seller)**.
3. Click **"List Item"**, choose the **Casio FX-991CW** preset. Notice the auto-calculated fair price of **₹750** and hit **"Publish Listing"**.
4. Observe the Smart Match alert: A junior on campus (**Amit**) is waiting for this calculator on the **Need Board**!
5. Switch persona to **Amit Verma (Freshman Buyer)**.
6. Open the Casio calculator listing, click **"Offer"**, and send an offer of **₹700**.
7. Switch back to **Rahul**: Open **"Negotiations"**, review the offer, accept it, schedule meeting at **Central Library Ground Floor Foyer**, and confirm UPI payment!
8. Item moves to **SOLD**, seller reputation score increments, and the campus circular reuse counter updates.
