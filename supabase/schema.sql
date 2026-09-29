-- PermitGrid Database Schema
-- Run this in your Supabase SQL Editor

-- Enable pgvector for AI semantic search
CREATE EXTENSION IF NOT EXISTS vector;

-- 1. Core Users (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'ENTREPRENEUR' CHECK (role IN ('ENTREPRENEUR', 'COMPLIANCE_OFFICER', 'CONSULTANT', 'DEPARTMENT_OFFICER', 'ADMIN')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Business Profiles
CREATE TABLE public.business_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  industry TEXT NOT NULL,
  business_activity TEXT NOT NULL,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('manufacturing', 'service', 'trading')),
  investment_amount DECIMAL(15, 2),
  employee_count INTEGER,
  project_stage TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Business Locations
CREATE TABLE public.business_locations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID REFERENCES public.business_profiles(id) ON DELETE CASCADE,
  state TEXT NOT NULL,
  district TEXT NOT NULL,
  city TEXT NOT NULL,
  pin_code TEXT NOT NULL,
  industrial_area TEXT,
  local_authority TEXT
);

-- 4. Special Operations / Conditions
CREATE TABLE public.business_operations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID REFERENCES public.business_profiles(id) ON DELETE CASCADE,
  is_food_business BOOLEAN DEFAULT FALSE,
  has_hazardous_materials BOOLEAN DEFAULT FALSE,
  is_import_export BOOLEAN DEFAULT FALSE,
  requires_boiler BOOLEAN DEFAULT FALSE,
  water_consumption_kld DECIMAL(10, 2),
  electricity_kw DECIMAL(10, 2)
);

-- 5. Approvals Dictionary (The Regulatory Knowledge Base)
CREATE TABLE public.approvals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  level TEXT NOT NULL CHECK (level IN ('central', 'state', 'local')),
  state TEXT, -- Null means central
  authority TEXT NOT NULL,
  stage TEXT NOT NULL CHECK (stage IN ('pre-establishment', 'pre-operation', 'operations', 'renewal')),
  description TEXT,
  verification_status TEXT NOT NULL DEFAULT 'DRAFT' CHECK (verification_status IN ('VERIFIED', 'NEEDS_REVIEW', 'DRAFT')),
  last_verified TIMESTAMPTZ,
  source_url TEXT,
  source_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Approval Dependencies (e.g. FSSAI needs Factory Licence)
CREATE TABLE public.approval_dependencies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  approval_id UUID REFERENCES public.approvals(id) ON DELETE CASCADE,
  depends_on_approval_id UUID REFERENCES public.approvals(id) ON DELETE CASCADE,
  description TEXT,
  UNIQUE(approval_id, depends_on_approval_id)
);

-- 7. Required Documents per Approval
CREATE TABLE public.approval_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  approval_id UUID REFERENCES public.approvals(id) ON DELETE CASCADE,
  document_name TEXT NOT NULL,
  document_type TEXT NOT NULL,
  is_mandatory BOOLEAN DEFAULT TRUE,
  description TEXT
);

-- 8. Document Center (User uploaded files via Supabase Storage)
CREATE TABLE public.uploaded_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id),
  business_id UUID REFERENCES public.business_profiles(id),
  document_name TEXT NOT NULL,
  document_type TEXT NOT NULL,
  storage_path TEXT NOT NULL, -- Supabase storage path
  verification_status TEXT DEFAULT 'pending',
  expiry_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Active Applications (The Workflow Tracker)
CREATE TABLE public.applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID REFERENCES public.business_profiles(id) ON DELETE CASCADE,
  approval_id UUID REFERENCES public.approvals(id),
  status TEXT NOT NULL DEFAULT 'NOT_STARTED' CHECK (status IN ('NOT_STARTED', 'PREPARING', 'READY', 'SUBMITTED', 'UNDER_REVIEW', 'QUERY_RAISED', 'INSPECTION', 'APPROVED', 'REJECTED')),
  submitted_at TIMESTAMPTZ,
  expected_approval_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. AI Document Pre-validation
CREATE TABLE public.document_validations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id UUID REFERENCES public.uploaded_documents(id) ON DELETE CASCADE,
  application_id UUID REFERENCES public.applications(id),
  ai_score DECIMAL(5,2),
  feedback TEXT,
  is_valid BOOLEAN,
  checked_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Regulatory RAG Chunks
CREATE TABLE public.regulatory_chunks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  source_name TEXT NOT NULL,
  source_url TEXT,
  content TEXT NOT NULL,
  embedding VECTOR(1536), -- Adjust dimensions based on embedding model (OpenAI is 1536, some local are 768 or 384)
  metadata JSONB
);

-- 12. Setup basic RLS (Row Level Security)
ALTER TABLE public.business_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.uploaded_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own business profiles" 
  ON public.business_profiles FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own business profiles" 
  ON public.business_profiles FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own business profiles" 
  ON public.business_profiles FOR UPDATE 
  USING (auth.uid() = user_id);

-- Add simple policies for documents and applications
CREATE POLICY "Users can access their documents" ON public.uploaded_documents FOR ALL USING (auth.uid() = user_id);
