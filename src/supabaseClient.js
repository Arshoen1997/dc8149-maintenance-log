import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://dhkkmbeapveehobetizu.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRoa2ttYmVhcHZlZWhvYmV0aXp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NTA2MjksImV4cCI6MjA3MzAyNjYyOX0.0HPGIGiv48VIR2e_bxDW1x2q2biticc_9rFDlg2S4_g"

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
