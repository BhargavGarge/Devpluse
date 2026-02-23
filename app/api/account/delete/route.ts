import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
    try {
        // First verify the caller is actually logged in using NextJS cookies client
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
        if (!SUPABASE_SERVICE_ROLE_KEY) {
            return NextResponse.json({
                error: 'Account deletion requires SUPABASE_SERVICE_ROLE_KEY in environment variables.'
            }, { status: 501 });
        }

        // Initialize admin client to perform the auth identity purge
        const supabaseAdmin = createSupabaseClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            SUPABASE_SERVICE_ROLE_KEY,
            {
                auth: { autoRefreshToken: false, persistSession: false }
            }
        );

        // Delete associated public table entries explicitly if cascade isn't fully trusted
        await supabaseAdmin.from('profiles').delete().eq('id', user.id);
        await supabaseAdmin.from('user_tokens').delete().eq('user_id', user.id);
        await supabaseAdmin.from('repositories').delete().eq('user_id', user.id);

        // Final purge identity from Auth system
        const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(user.id);

        if (deleteError) {
            console.error("Failed to delete user identity:", deleteError);
            throw deleteError;
        }

        return NextResponse.json({ success: true, message: 'Account deleted successfully' }, { status: 200 });

    } catch (error: any) {
        console.error('Error deleting account:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
