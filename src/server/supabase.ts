import { createClient } from '@supabase/supabase-js';

// This module must only be imported by server entry points/adapters.
export function getSupabaseAdmin() {
  const url = import.meta.env.SUPABASE_URL as string;
  const key = import.meta.env.SUPABASE_SERVICE_ROLE_KEY as string;
  if (!url || !key) throw new Error('Missing Supabase server env vars');
  return createClient(url, key, { auth: { persistSession: false } });
}
