import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    const next = searchParams.get('next') ?? '/dashboard'

    if (code) {
        const supabase = await createClient()
        const { data, error } = await supabase.auth.exchangeCodeForSession(code)

        if (!error && data.session) {
            const session = data.session;
            const user = session.user;

            console.log("Session obtained in callback:", {
                hasProviderToken: !!session.provider_token,
                providerTokenPrefix: session.provider_token ? session.provider_token.substring(0, 4) : null,
                userId: user.id
            });

            // 1. Securely store the provider token for backend GitHub API calls
            if (session.provider_token) {
                const { error: tokenError } = await supabase.from('user_tokens').upsert({
                    user_id: user.id,
                    provider_token: session.provider_token,
                    updated_at: new Date().toISOString()
                });
                if (tokenError) {
                    console.error("Failed to upsert user_tokens:", tokenError);
                } else {
                    console.log("Successfully upserted provider token.");
                }
            } else {
                console.log("Provider token was MISSING from session object.");
            }

            // 2. Optionally upsert a basic profile so it shows up in Supabase
            // Note: Make sure a `profiles` table exists in Supabase if you query it later!
            const { error: profileError } = await supabase.from('profiles').upsert({
                id: user.id,
                email: user.email,
                username: user.user_metadata.user_name || user.user_metadata.preferred_username || "github_user",
                avatar_url: user.user_metadata.avatar_url,
                updated_at: new Date().toISOString()
            });

            if (profileError) {
                console.error("Profiles upsert failed:", profileError.message);
            } else {
                console.log("Successfully upserted profile data.");
            }

            return NextResponse.redirect(`${origin}${next}`)
        }
    }

    // return the user to an error layout or fallback to login
    return NextResponse.redirect(`${origin}/login?error=true`)
}
