// supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://hiluwfcotgzcmcdlfuxd.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseKey) {
  throw new Error('Missing VITE_SUPABASE_ANON_KEY environment variable')
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
})