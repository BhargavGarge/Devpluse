const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
    const { data: invites } = await supabase.from('team_invitations').select('*');
    console.log("Invites:", invites);

    const { data: members } = await supabase.from('team_members').select('*');
    console.log("Members:", members);
}
check();
