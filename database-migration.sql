-- EMOTICE Production Database Setup
-- Run this in Supabase SQL Editor

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE mood_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE legal_consents ENABLE ROW LEVEL SECURITY;

-- Profiles RLS Policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Mood Entries RLS Policies  
CREATE POLICY "Users can view own mood entries" ON mood_entries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own mood entries" ON mood_entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own mood entries" ON mood_entries
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own mood entries" ON mood_entries
  FOR DELETE USING (auth.uid() = user_id);

-- Legal Consents RLS Policies
CREATE POLICY "Users can view own consents" ON legal_consents
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own consents" ON legal_consents
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_mood_entries_user_created 
  ON mood_entries(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_mood_entries_user_date 
  ON mood_entries(user_id, date);

CREATE INDEX IF NOT EXISTS idx_profiles_email 
  ON profiles(email);

-- Functions for Analytics
CREATE OR REPLACE FUNCTION get_user_mood_stats(user_uuid UUID, days_back INTEGER DEFAULT 30)
RETURNS JSON AS # EMOTICE Production Environment
VITE_APP_NAME="Emotice"
VITE_APP_URL="https://emotice.surge.sh"
VITE_APP_VERSION="1.0.0"
VITE_NODE_ENV="production"

# Supabase Production (use your real credentials)
VITE_SUPABASE_URL="https://mwxrmcpoubgqvrjkoyei.supabase.co"
VITE_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13eHJtY3BvdWJncXZyamtveWVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0ODExNDUsImV4cCI6MjA3NDA1NzE0NX0.axlU8-tYCHB8ryXUtEXXWaWHAWVMUnmt_mcEYWaC6UA"

# Analytics & Monitoring
VITE_GOOGLE_ANALYTICS_ID=""
VITE_SENTRY_DSN=""
VITE_HOTJAR_ID=""

# Feature Flags
VITE_ENABLE_PWA="true"
VITE_ENABLE_ANALYTICS="true"
VITE_ENABLE_ERROR_TRACKING="true"
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'total_entries', COUNT(*),
    'avg_mood', ROUND(AVG(mood_score), 2),
    'max_mood', MAX(mood_score),
    'min_mood', MIN(mood_score)
  ) INTO result
  FROM mood_entries 
  WHERE user_id = user_uuid 
    AND created_at >= NOW() - INTERVAL '%s days' % days_back;
  
  RETURN result;
END;
# EMOTICE Production Environment
VITE_APP_NAME="Emotice"
VITE_APP_URL="https://emotice.surge.sh"
VITE_APP_VERSION="1.0.0"
VITE_NODE_ENV="production"

# Supabase Production (use your real credentials)
VITE_SUPABASE_URL="https://mwxrmcpoubgqvrjkoyei.supabase.co"
VITE_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13eHJtY3BvdWJncXZyamtveWVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0ODExNDUsImV4cCI6MjA3NDA1NzE0NX0.axlU8-tYCHB8ryXUtEXXWaWHAWVMUnmt_mcEYWaC6UA"

# Analytics & Monitoring
VITE_GOOGLE_ANALYTICS_ID=""
VITE_SENTRY_DSN=""
VITE_HOTJAR_ID=""

# Feature Flags
VITE_ENABLE_PWA="true"
VITE_ENABLE_ANALYTICS="true"
VITE_ENABLE_ERROR_TRACKING="true" LANGUAGE plpgsql SECURITY DEFINER;
