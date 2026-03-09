import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false } }
);

async function checkMembers() {
    const { data, error } = await supabaseAdmin.from('team_members').select('*');
    console.log("TEAM MEMBERS:");
    console.dir(data, { depth: null });
}
checkMembers();
