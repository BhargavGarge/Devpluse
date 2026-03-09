import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testInsert() {
    const { data: teams } = await supabase.from('teams').select('*').limit(1);
    if (!teams || teams.length === 0) return console.log("No teams found");

    const teamId = teams[0].id;
    const user_id = teams[0].workspace_id;

    console.log("Trying to insert invite for team:", teamId);
    const { data, error } = await supabase.from('team_invitations').insert({
        team_id: teamId,
        email: 'test@example.com',
        role: 'Viewer',
        invited_by: user_id
    }).select().single();

    console.log("Insert result:", data);
    console.log("Insert error:", error);
}
testInsert();
