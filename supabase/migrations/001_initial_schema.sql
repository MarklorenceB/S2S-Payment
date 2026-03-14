-- ============================================
-- S2S Payment - Database Schema
-- Run this in your Supabase SQL Editor
-- ============================================

-- 1. Profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  account_number TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  contact_number TEXT NOT NULL,
  email TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Top-up requests table
CREATE TABLE IF NOT EXISTS public.topup_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  account_number TEXT NOT NULL,
  contact_number TEXT NOT NULL,
  screenshot_url TEXT NOT NULL,
  amount NUMERIC(10,2),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Issue reports table
CREATE TABLE IF NOT EXISTS public.issue_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  modem_status TEXT NOT NULL CHECK (modem_status IN ('online', 'offline')),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved')),
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- Row Level Security Policies
-- ============================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topup_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.issue_reports ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read their own, admins can read all
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Top-up requests: Users CRUD own, admins can read/update all
CREATE POLICY "Users can view own topups"
  ON public.topup_requests FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can create topups"
  ON public.topup_requests FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can view all topups"
  ON public.topup_requests FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update topups"
  ON public.topup_requests FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Issue reports: Users CRUD own, admins can read/update all
CREATE POLICY "Users can view own issues"
  ON public.issue_reports FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can create issues"
  ON public.issue_reports FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can view all issues"
  ON public.issue_reports FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update issues"
  ON public.issue_reports FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================
-- Storage Bucket for Payment Screenshots
-- ============================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('payment-screenshots', 'payment-screenshots', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Authenticated users can upload screenshots"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'payment-screenshots'
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Anyone can view screenshots"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'payment-screenshots');

-- ============================================
-- Indexes for performance
-- ============================================

CREATE INDEX IF NOT EXISTS idx_profiles_account ON public.profiles(account_number);
CREATE INDEX IF NOT EXISTS idx_topup_user ON public.topup_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_topup_status ON public.topup_requests(status);
CREATE INDEX IF NOT EXISTS idx_issues_user ON public.issue_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_issues_status ON public.issue_reports(status);
