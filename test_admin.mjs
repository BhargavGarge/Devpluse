import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY, // Use service role to bypass RLS for checking
    { auth: { persistSession: false } }
);

async function checkServer() {
    const { data, error } = await supabaseAdmin.from('team_invitations').select('*');
    console.log("ALL INVITATIONS IN DB:", data);
}
checkServer();
