import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
    const out = {};
    const { data: orgs, error: orgsError } = await supabase.from('organizations').select('*').limit(5);
    out.orgs = { orgs, orgsError };

    const { data: members, error: membersError } = await supabase.from('organization_members').select('*').limit(5);
    out.members = { members, membersError };

    const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
    out.users = {
        users: users?.users?.map(u => ({ id: u.id, email: u.email })),
        usersError
    };

    fs.writeFileSync('db-out.utf8.json', JSON.stringify(out, null, 2));
    console.log("Done. Written to db-out.utf8.json");
}

main().catch(console.error);
