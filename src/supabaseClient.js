import { createClient } from "@supabase/supabase-js";

// ==========================================
// 1. Supabase Project URL
// Can be set via VITE_SUPABASE_URL in .env or configured below:
// ==========================================
const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL ||
  "https://zwaamprxbuzdoqjhhkwc.supabase.co/rest/v1/";

// ==========================================
// 2. Supabase Public Anon Key (publishable key)
// Can be set via VITE_SUPABASE_ANON_KEY in .env or configured below:
// ==========================================
const SUPABASE_PUBLIC_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "sb_publishable_ufv3QGosjwi2jIFzGrVcQA_mZi_w6Gp";

// Normalize URL to project root so auth endpoints work properly
const rootUrl = SUPABASE_URL.replace(/\/rest\/v1\/?$/, "");

// Initialize and export the Supabase client
export const supabase = createClient(rootUrl || SUPABASE_URL, SUPABASE_PUBLIC_KEY);
