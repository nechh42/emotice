import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface Profile {
  id: string;
  full_name?: string;
  username?: string;
  avatar_url?: string;
  role: 'admin' | 'editor' | 'annotator' | 'viewer';
  created_at: string;
  baseline: Record<string, any>;
  consents: Record<string, any>;
}

export interface MoodEntry {
  id: string;
  user_id: string;
  mood: string;
  emoji: string;
  intensity: number;
  note?: string;
  activities?: string[];
  tags?: string[];
  location?: string;
  weather?: string;
  date_part: string;
  created_at: string;
  updated_at: string;
}

export interface Consent {
  id: string;
  user_id: string;
  policy_key: string;
  policy_version: string;
  granted: boolean;
  locale: string;
  ip?: string;
  user_agent?: string;
  created_at: string;
}