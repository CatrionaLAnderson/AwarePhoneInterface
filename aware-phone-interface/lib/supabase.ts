import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Supabase project credentials (keep these secure)
const SUPABASE_URL: string = "https://agofivqpqfngdmlbmhpi.supabase.co";
const SUPABASE_ANON_KEY: string =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFnb2ZpdnFwcWZuZ2RtbGJtaHBpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgzNDEyOTcsImV4cCI6MjA1MzkxNzI5N30.IHSNAwTCn5xv4i0omp6sD88k_8cdOE5IouZv9ozimcU";

/**
 * Create a Supabase client instance with strict type annotations.
 */
export const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);