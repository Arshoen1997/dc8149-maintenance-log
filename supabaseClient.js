// supabaseClient.js
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://dhkkmbeapveehobetizu.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRoa2ttYmVhcHZlZWhvYmV0aXp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTYyMTY0MDYsImV4cCI6MTkxMTc3MjQwNn0.3gkLh8fU1aHjvYHk3rX1K7Uu4tXo5mX3m8b8H4Hf4mU";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
