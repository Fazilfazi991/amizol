import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mherqrjuoafvkbauvaob.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1oZXJxcmp1b2FmdmtiYXV2YW9iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3NDkyMTAsImV4cCI6MjA5MjMyNTIxMH0.wypisj0nT9iw-PE6NU8FJU6GzeW2AXw7zrxM9BhrpKs';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
