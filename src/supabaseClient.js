import { createClient } from "@supabase/supabase-js";

// ==========================================
// 1. Paste your Supabase Project URL here:
// ==========================================
const SUPABASE_URL = "https://zwaamprxbuzdoqjhhkwc.supabase.co/rest/v1/";

// ==========================================
// 2. Paste your Supabase Public Key (anon key) here:
// ==========================================
const SUPABASE_PUBLIC_KEY = "sb_publishable_ufv3QGosjwi2jIFzGrVcQA_mZi_w6Gp";

// Normalize URL to project root so auth endpoints work properly
const rootUrl = SUPABASE_URL.replace(/\/rest\/v1\/?$/, "");

// Initialize and export the Supabase client
export const supabase = createClient(rootUrl || SUPABASE_URL, SUPABASE_PUBLIC_KEY);
