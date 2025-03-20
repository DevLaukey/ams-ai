import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const secretKey = process.env.NEXT_PUBLIC_SUPABASE_SECRET_KEY;

const supabase = createClient(supabaseUrl, secretKey);

export default supabase;