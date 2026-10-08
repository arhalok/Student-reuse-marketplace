-- ==============================================================================
-- STUDENT REUSE MARKETPLACE — SUPABASE DATABASE SCHEMA
-- Campus-first marketplace for buying, selling, exchanging, renting, and giving away
-- Deploy to: Supabase SQL Editor
-- Compatible with: Vercel + Next.js App Router
-- ==============================================================================

-- 1. Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Custom Enumerated Types
CREATE TYPE transaction_mode AS ENUM ('BUY', 'EXCHANGE', 'RENT', 'GIVE_AWAY');
CREATE TYPE item_condition AS ENUM ('LIKE_NEW', 'EXCELLENT', 'GOOD', 'FAIR', 'FOR_PARTS');
CREATE TYPE listing_status AS ENUM ('DRAFT', 'ACTIVE', 'OFFER_RECEIVED', 'RESERVED', 'MEETING_SCHEDULED', 'SOLD', 'EXPIRED', 'CANCELLED', 'REPORTED');
CREATE TYPE offer_status AS ENUM ('PENDING', 'ACCEPTED', 'COUNTERED', 'REJECTED', 'CANCELLED', 'COMPLETED');
CREATE TYPE request_status AS ENUM ('OPEN', 'MATCHED', 'FULFILLED', 'EXPIRED', 'CANCELLED');

-- 3. Campuses Table
CREATE TABLE IF NOT EXISTS campuses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  short_code TEXT NOT NULL UNIQUE,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  domain_suffix TEXT, -- e.g. 'iitd.ac.in'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. User Profiles (Extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  campus_id UUID REFERENCES campuses(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  college_email TEXT,
  is_student_verified BOOLEAN DEFAULT FALSE,
  degree_program TEXT, -- e.g. 'B.Tech Computer Science'
  current_year INT DEFAULT 1,
  current_semester INT DEFAULT 1,
  phone_number TEXT,
  upi_id TEXT,
  
  -- Trust Metrics
  total_transactions INT DEFAULT 0,
  successful_transactions INT DEFAULT 0,
  response_rate_percent INT DEFAULT 95,
  avg_response_minutes INT DEFAULT 15,
  trust_rating NUMERIC(2, 1) DEFAULT 5.0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Safe Campus Exchange Spots
CREATE TABLE IF NOT EXISTS campus_exchange_spots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campus_id UUID NOT NULL REFERENCES campuses(id) ON DELETE CASCADE,
  name TEXT NOT NULL, -- e.g. 'Central Library Foyer'
  description TEXT, -- 'CCTV monitored, open 8 AM - 10 PM'
  is_recommended BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  icon TEXT,
  description TEXT,
  display_order INT DEFAULT 0
);

-- 7. Listings Table (Core Marketplace Entity)
CREATE TABLE IF NOT EXISTS listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  campus_id UUID NOT NULL REFERENCES campuses(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  
  title TEXT NOT NULL,
  description TEXT,
  images TEXT[] DEFAULT '{}',
  
  -- Commercials & Mode
  mode transaction_mode NOT NULL DEFAULT 'BUY',
  price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  original_new_price NUMERIC(10, 2),
  exchange_details TEXT, -- e.g. 'Looking for Semester 3 Math Book + ₹100'
  rental_rate_per_week NUMERIC(10, 2),
  
  -- Standardized Condition & Book-specific inspection
  condition item_condition NOT NULL DEFAULT 'GOOD',
  book_has_highlighting BOOLEAN DEFAULT FALSE,
  book_has_writing BOOLEAN DEFAULT FALSE,
  book_missing_pages BOOLEAN DEFAULT FALSE,
  book_cover_wear BOOLEAN DEFAULT FALSE,
  book_edition TEXT,
  book_isbn TEXT,
  
  -- Semester Graph Metadata
  target_course TEXT, -- e.g. 'Engineering'
  relevant_semesters INT[] DEFAULT '{}', -- e.g. '{1, 2}'
  is_bundle BOOLEAN DEFAULT FALSE,
  bundle_items TEXT[] DEFAULT '{}',
  
  -- Lifecycle & Safety
  status listing_status NOT NULL DEFAULT 'ACTIVE',
  preferred_spot_id UUID REFERENCES campus_exchange_spots(id) ON DELETE SET NULL,
  views_count INT DEFAULT 0,
  saves_count INT DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Need Requests (Demand Engine: "Need Board")
CREATE TABLE IF NOT EXISTS need_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  campus_id UUID NOT NULL REFERENCES campuses(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  
  item_title TEXT NOT NULL,
  max_budget NUMERIC(10, 2) NOT NULL,
  preferred_condition item_condition DEFAULT 'GOOD',
  required_by_date DATE,
  notes TEXT,
  target_semester INT,
  
  status request_status NOT NULL DEFAULT 'OPEN',
  matched_listing_id UUID REFERENCES listings(id) ON DELETE SET NULL,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Offers & Negotiations
CREATE TABLE IF NOT EXISTS offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  offered_amount NUMERIC(10, 2) NOT NULL,
  counter_amount NUMERIC(10, 2),
  status offer_status NOT NULL DEFAULT 'PENDING',
  
  meeting_spot_id UUID REFERENCES campus_exchange_spots(id) ON DELETE SET NULL,
  meeting_time TIMESTAMPTZ,
  notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Messages (Controlled In-App Negotiation Chat)
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Transaction Reviews
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reviewee_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Marketplace Event Analytics (Telemetry for intelligence layer)
CREATE TABLE IF NOT EXISTS marketplace_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL, -- 'listing_created', 'request_created', 'offer_sent', 'offer_accepted', 'transaction_completed'
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  campus_id UUID REFERENCES campuses(id) ON DELETE SET NULL,
  listing_id UUID REFERENCES listings(id) ON DELETE SET NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- INDEXES FOR ULTRA-FAST SEMESTER & DEMAND SEARCH
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_listings_campus_status ON listings(campus_id, status);
CREATE INDEX IF NOT EXISTS idx_listings_category ON listings(category_id);
CREATE INDEX IF NOT EXISTS idx_listings_semesters ON listings USING GIN(relevant_semesters);
CREATE INDEX IF NOT EXISTS idx_need_requests_campus_status ON need_requests(campus_id, status);
CREATE INDEX IF NOT EXISTS idx_offers_listing ON offers(listing_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(listing_id, created_at);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE campuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE campus_exchange_spots ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE need_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_events ENABLE ROW LEVEL SECURITY;

-- Campuses & Categories & Spots: Viewable by anyone authenticated
CREATE POLICY "Public read campuses" ON campuses FOR SELECT USING (true);
CREATE POLICY "Public read spots" ON campus_exchange_spots FOR SELECT USING (true);
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);

-- Profiles: Anyone can view, only owner can update
CREATE POLICY "Profiles viewable by authenticated users" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Listings: Everyone in same campus can view active; sellers can manage own
CREATE POLICY "Listings viewable by all" ON listings FOR SELECT USING (true);
CREATE POLICY "Users can insert own listings" ON listings FOR INSERT WITH CHECK (auth.uid() = seller_id);
CREATE POLICY "Users can update own listings" ON listings FOR UPDATE USING (auth.uid() = seller_id);

-- Need Requests: Viewable by all; owners can insert/update
CREATE POLICY "Needs viewable by all" ON need_requests FOR SELECT USING (true);
CREATE POLICY "Users can insert own needs" ON need_requests FOR INSERT WITH CHECK (auth.uid() = buyer_id);
CREATE POLICY "Users can update own needs" ON need_requests FOR UPDATE USING (auth.uid() = buyer_id);

-- Offers: Viewable by buyer and seller only
CREATE POLICY "Offers viewable by buyer or seller" ON offers FOR SELECT USING (
  auth.uid() = buyer_id OR auth.uid() = seller_id
);
CREATE POLICY "Buyers can insert offers" ON offers FOR INSERT WITH CHECK (auth.uid() = buyer_id);
CREATE POLICY "Parties can update offers" ON offers FOR UPDATE USING (
  auth.uid() = buyer_id OR auth.uid() = seller_id
);

-- Messages: Sender and receiver can view and insert
CREATE POLICY "Messages viewable by sender or receiver" ON messages FOR SELECT USING (
  auth.uid() = sender_id OR auth.uid() = receiver_id
);
CREATE POLICY "Users can send messages" ON messages FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Analytics events: insert by anyone
CREATE POLICY "Insert events" ON marketplace_events FOR INSERT WITH CHECK (true);

-- ==============================================================================
-- SEED DATA (For Immediate Campus Readiness & Demo Verification)
-- ==============================================================================

-- Campuses
INSERT INTO campuses (id, name, short_code, city, state, domain_suffix) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Indian Institute of Technology Delhi', 'IITD', 'New Delhi', 'Delhi', 'iitd.ac.in'),
  ('22222222-2222-2222-2222-222222222222', 'BITS Pilani', 'BITS', 'Pilani', 'Rajasthan', 'pilani.bits-pilani.ac.in'),
  ('33333333-3333-3333-3333-333333333333', 'National Institute of Technology Trichy', 'NITT', 'Tiruchirappalli', 'Tamil Nadu', 'nitt.edu')
ON CONFLICT (short_code) DO NOTHING;

-- Exchange Spots
INSERT INTO campus_exchange_spots (id, campus_id, name, description, is_recommended) VALUES
  ('s1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Central Library Ground Floor Foyer', 'CCTV monitored, safe & active until 9 PM', TRUE),
  ('s2222222-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Student Activity Center (SAC) Cafe', 'Busy student hub, ideal for day exchange', TRUE),
  ('s3333333-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Main Academic Gate Security Desk', 'Open 24/7 with campus guard supervision', TRUE)
ON CONFLICT DO NOTHING;

-- Categories
INSERT INTO categories (id, slug, name, icon, description, display_order) VALUES
  ('c1111111-1111-1111-1111-111111111111', 'calculators', 'Scientific Calculators', 'calculator', 'FX-991CW, FX-991EX, Graphic & Financial calculators', 1),
  ('c2222222-1111-1111-1111-111111111111', 'drawing-kits', 'Engineering Drawing Kits', 'compass', 'Mini drafters, compass sets, T-squares, sheet holders', 2),
  ('c3333333-1111-1111-1111-111111111111', 'textbooks', 'Course Textbooks', 'book-open', 'Engineering, Math, Medical, Management & Competitive', 3),
  ('c4444444-1111-1111-1111-111111111111', 'lab-coats', 'Lab Coats & Practical Kits', 'flask-conical', 'Lab coats, dissection kits, breadboards, safety goggles', 4),
  ('c5555555-1111-1111-1111-111111111111', 'electronics', 'Electronics & Peripherals', 'cpu', 'Arduino kits, sensors, monitors, adapters, headphones', 5),
  ('c6666666-1111-1111-1111-111111111111', 'bundles', 'Semester Starter Packs', 'package', 'All-in-one curated course kits from passing seniors', 6)
ON CONFLICT (slug) DO NOTHING;
