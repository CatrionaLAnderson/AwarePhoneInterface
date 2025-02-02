import { createClient } from '@supabase/supabase-js';

// Get these from Supabase Dashboard → Project Settings → API
const SUPABASE_URL = 'https://agofivqpqfngdmlbmhpi.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFnb2ZpdnFwcWZuZ2RtbGJtaHBpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgzNDEyOTcsImV4cCI6MjA1MzkxNzI5N30.IHSNAwTCn5xv4i0omp6sD88k_8cdOE5IouZv9ozimcU';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);