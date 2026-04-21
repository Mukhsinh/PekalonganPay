-- ============================================================
-- PekalonganPay Database Migration
-- Enterprise Fintech E-Money Application
-- ============================================================
-- Run this migration on your Supabase project to create
-- all necessary tables, indexes, and RLS policies.
-- ============================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ══════════════════════════════════════════════════════════════
-- TABLE: users
-- Primary user accounts with KYC verification
-- ══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone VARCHAR(15) UNIQUE NOT NULL,
  full_name VARCHAR(100),
  nik VARCHAR(16) UNIQUE,
  kyc_status VARCHAR(20) DEFAULT 'pending' CHECK (kyc_status IN ('pending','verified','rejected')),
  kyc_verified_at TIMESTAMPTZ,
  device_id VARCHAR(255),
  device_model VARCHAR(100),
  pin_hash VARCHAR(255),
  biometric_enabled BOOLEAN DEFAULT false,
  balance BIGINT DEFAULT 0 CHECK (balance >= 0),
  daily_limit BIGINT DEFAULT 5000000,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_users_phone ON public.users(phone);
CREATE INDEX IF NOT EXISTS idx_users_nik ON public.users(nik);
CREATE INDEX IF NOT EXISTS idx_users_device_id ON public.users(device_id);

-- ══════════════════════════════════════════════════════════════
-- TABLE: merchants_umkm
-- UMKM business directory with geolocation
-- ══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.merchants_umkm (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id),
  business_name VARCHAR(150) NOT NULL,
  category VARCHAR(50) CHECK (category IN ('batik','kuliner','kerajinan','jasa','lainnya')),
  description TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  address TEXT,
  phone VARCHAR(15),
  rating NUMERIC(2,1) DEFAULT 0,
  total_reviews INT DEFAULT 0,
  total_transactions INT DEFAULT 0,
  is_verified BOOLEAN DEFAULT false,
  ad_tier VARCHAR(20) DEFAULT 'free' CHECK (ad_tier IN ('free','basic','premium')),
  ad_expires_at TIMESTAMPTZ,
  photo_urls TEXT[],
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for geolocation queries
CREATE INDEX IF NOT EXISTS idx_merchants_category ON public.merchants_umkm(category);
CREATE INDEX IF NOT EXISTS idx_merchants_location ON public.merchants_umkm(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_merchants_user ON public.merchants_umkm(user_id);

-- ══════════════════════════════════════════════════════════════
-- TABLE: transactions
-- Immutable transaction log with audit trail
-- ══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES public.users(id),
  receiver_id UUID REFERENCES public.users(id),
  type VARCHAR(30) NOT NULL CHECK (type IN ('topup','transfer_bank','transfer_user','qris_pay','ewallet_topup','merchant_pay')),
  amount BIGINT NOT NULL CHECK (amount > 0),
  fee BIGINT DEFAULT 0,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending','processing','success','failed','reversed')),
  reference_id VARCHAR(100) UNIQUE,
  snap_transaction_id VARCHAR(100),
  description TEXT,
  metadata JSONB DEFAULT '{}',
  device_id VARCHAR(255),
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ
);

-- Indexes for transaction queries
CREATE INDEX IF NOT EXISTS idx_txn_sender ON public.transactions(sender_id);
CREATE INDEX IF NOT EXISTS idx_txn_receiver ON public.transactions(receiver_id);
CREATE INDEX IF NOT EXISTS idx_txn_reference ON public.transactions(reference_id);
CREATE INDEX IF NOT EXISTS idx_txn_status ON public.transactions(status);
CREATE INDEX IF NOT EXISTS idx_txn_created ON public.transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_txn_type ON public.transactions(type);

-- ══════════════════════════════════════════════════════════════
-- TABLE: mosques
-- Mosque directory with imam/khatib info
-- ══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.mosques (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(150) NOT NULL,
  address TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  imam_name VARCHAR(100),
  khatib_jumat VARCHAR(100),
  phone VARCHAR(15),
  photo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_mosques_location ON public.mosques(latitude, longitude);

-- ══════════════════════════════════════════════════════════════
-- TABLE: mosque_schedules
-- Prayer schedules and kajian events
-- ══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.mosque_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mosque_id UUID REFERENCES public.mosques(id) ON DELETE CASCADE,
  prayer_name VARCHAR(20) NOT NULL CHECK (prayer_name IN ('subuh','dzuhur','ashar','maghrib','isya','jumat')),
  schedule_date DATE NOT NULL,
  time TIME NOT NULL,
  khatib_name VARCHAR(100),
  kajian_topic TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_schedules_mosque ON public.mosque_schedules(mosque_id);
CREATE INDEX IF NOT EXISTS idx_schedules_date ON public.mosque_schedules(schedule_date);

-- ══════════════════════════════════════════════════════════════
-- TABLE: reviews
-- Transaction-based merchant reviews
-- ══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID REFERENCES public.merchants_umkm(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id),
  transaction_id UUID REFERENCES public.transactions(id),
  rating INT CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(transaction_id) -- One review per transaction
);

CREATE INDEX IF NOT EXISTS idx_reviews_merchant ON public.reviews(merchant_id);

-- ══════════════════════════════════════════════════════════════
-- TABLE: city_events
-- Pekalongan cultural events calendar
-- ══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.city_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200) NOT NULL,
  description TEXT,
  location TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  event_date TIMESTAMPTZ,
  event_end TIMESTAMPTZ,
  category VARCHAR(50),
  image_url TEXT,
  organizer VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_events_date ON public.city_events(event_date);

-- ══════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY POLICIES
-- Banking-grade access control
-- ══════════════════════════════════════════════════════════════

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.merchants_umkm ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mosques ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mosque_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.city_events ENABLE ROW LEVEL SECURITY;

-- === USERS ===
-- Users can only read and update their own record
CREATE POLICY "users_select_own" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "users_update_own" ON public.users
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "users_insert_self" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- === TRANSACTIONS (IMMUTABLE) ===
-- Users can only SELECT their own transactions (sender or receiver)
-- INSERT is allowed for authenticated users (their own transactions)
-- NO UPDATE or DELETE policies = immutable audit trail
CREATE POLICY "txn_select_own" ON public.transactions
  FOR SELECT USING (
    auth.uid() = sender_id OR auth.uid() = receiver_id
  );

CREATE POLICY "txn_insert_own" ON public.transactions
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- === MERCHANTS ===
-- Public read, owner-only write
CREATE POLICY "merchants_select_all" ON public.merchants_umkm
  FOR SELECT USING (true);

CREATE POLICY "merchants_insert_own" ON public.merchants_umkm
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "merchants_update_own" ON public.merchants_umkm
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- === REVIEWS ===
-- Public read, only buyer with matching transaction can insert
CREATE POLICY "reviews_select_all" ON public.reviews
  FOR SELECT USING (true);

CREATE POLICY "reviews_insert_buyer" ON public.reviews
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.transactions
      WHERE id = transaction_id AND sender_id = auth.uid() AND status = 'success'
    )
  );

-- === PUBLIC READ TABLES ===
-- Mosques, schedules, and events are publicly readable
CREATE POLICY "mosques_select_all" ON public.mosques
  FOR SELECT USING (true);

CREATE POLICY "schedules_select_all" ON public.mosque_schedules
  FOR SELECT USING (true);

CREATE POLICY "events_select_all" ON public.city_events
  FOR SELECT USING (true);

-- ══════════════════════════════════════════════════════════════
-- TRIGGER: Auto-update updated_at on users table
-- ══════════════════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ══════════════════════════════════════════════════════════════
-- TRIGGER: Auto-update merchant rating on new review
-- ══════════════════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION update_merchant_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.merchants_umkm
  SET 
    rating = (SELECT AVG(rating)::NUMERIC(2,1) FROM public.reviews WHERE merchant_id = NEW.merchant_id),
    total_reviews = (SELECT COUNT(*) FROM public.reviews WHERE merchant_id = NEW.merchant_id)
  WHERE id = NEW.merchant_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER reviews_update_rating
  AFTER INSERT ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_merchant_rating();
