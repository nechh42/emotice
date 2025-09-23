// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'your-project-url'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

if (supabaseUrl === 'your-project-url' || supabaseAnonKey === 'your-anon-key') {
  console.warn('⚠️ Supabase konfigürasyonu eksik! .env dosyasını kontrol edin:');
  console.warn('VITE_SUPABASE_URL=your_supabase_project_url');
  console.warn('VITE_SUPABASE_ANON_KEY=your_supabase_anon_key');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})