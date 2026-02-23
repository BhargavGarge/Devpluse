import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
    try {
        const supabase = await createClient();

        // Ensure user is authenticated
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 1. We must read the session to extract the provider_token
        // Supabase stores OAuth provider tokens in the session ONLY IF 
        // they were granted during the *current* active session sign-in.
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError || !session) {
            return NextResponse.json({ error: 'Session not found. Please log in again.' }, { status: 401 });
        }

        const providerToken = session.provider_token;

        if (!providerToken) {
            // Note: If this happens, it usually means the user logged in with email/pass,
            // or the OAuth token expired/wasn't requested. 
            // In a production app, you'd want to securely store this token on first login 
            // in a `user_tokens` table. For this SaaS MVP, as requested by the user, we pull it from session.
            return NextResponse.json(
                { error: 'GitHub access token not found. Please log out and sign in with GitHub again.' },
                { status: 400 }
            );
        }

        // 2. Fetch repositories from GitHub API
        const githubResponse = await fetch('https://api.github.com/user/repos?sort=updated&per_page=100', {
            headers: {
                Authorization: `Bearer ${providerToken}`,
                Accept: 'application/vnd.github.v3+json',
            }
        });

        if (!githubResponse.ok) {
            console.error('GitHub API error:', await githubResponse.text());
            return NextResponse.json(
                { error: 'Failed to fetch repositories from GitHub.' },
                { status: githubResponse.status }
            );
        }

        const repos = await githubResponse.json();

        return NextResponse.json({ repos });

    } catch (error: any) {
        console.error('Error fetching GitHub repos:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
