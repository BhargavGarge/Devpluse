import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Fetch user profile
        const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        // Fetch GitHub token data
        const { data: githubToken } = await supabase
            .from('user_tokens')
            .select('provider_token, updated_at')
            .eq('user_id', user.id)
            .single();

        let githubData = null;
        if (githubToken?.provider_token) {
            try {
                const ghRes = await fetch('https://api.github.com/user', {
                    headers: {
                        Authorization: `Bearer ${githubToken.provider_token}`,
                        Accept: 'application/vnd.github.v3+json'
                    }
                });
                if (ghRes.ok) {
                    githubData = await ghRes.json();
                }
            } catch (err) {
                console.error("Failed to fetch from GitHub API:", err);
            }
        }

        return NextResponse.json({
            profile,
            github: githubToken ? {
                connected: true,
                last_synced_at: githubToken.updated_at,
                data: githubData
            } : { connected: false }
        }, { status: 200 });

    } catch (error: any) {
        console.error('Error fetching profile:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
