import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Users can easily delete their own scoped data since RLS allows it.
        // The cascading deletes on the server side would have worked, but explicitly removing them via API is safe too.

        // 1. Delete GitHub provider token
        await supabase
            .from('user_tokens')
            .delete()
            .eq('user_id', user.id);

        // 2. Delete Connected Repositories (this will automatically cascade-delete reports from Supabase)
        await supabase
            .from('repositories')
            .delete()
            .eq('user_id', user.id);

        return NextResponse.json({ success: true, message: 'GitHub account disconnected successfully.' }, { status: 200 });

    } catch (error: any) {
        console.error('Error disconnecting GitHub account:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
