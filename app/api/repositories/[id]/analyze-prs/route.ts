import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { AnalyzePullRequestsUseCase } from '@/lib/application/use-cases/analyzePullRequests';
import { GitHubPRClient } from '@/lib/infrastructure/github/github-pr-client';
import { PRMetricsRepository } from '@/lib/infrastructure/database/pr-metrics-repository';
import { getAccessibleRepoIds, getRepoRole } from '@/lib/supabase/queries';

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params; // repositoryId

        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Validate access through Team Repo Access Layer
        const githubUsername = user.user_metadata?.user_name || user.user_metadata?.preferred_username || user.email?.split('@')[0] || "User";
        const accessibleRepoIds = await getAccessibleRepoIds(supabase, user.id, githubUsername);

        if (!accessibleRepoIds.includes(id)) {
            return NextResponse.json({ error: 'Repository not found or access denied' }, { status: 404 });
        }

        // Validate Role (Owner or Reviewer required to analyze PRs)
        const role = await getRepoRole(supabase, user.id, githubUsername, id);
        if (role === 'Viewer' || role === 'None') {
            return NextResponse.json({ error: 'Unauthorized: Viewers cannot trigger PR analysis' }, { status: 403 });
        }

        // Get Repo Info
        const { data: repo, error: repoError } = await supabase
            .from('repositories')
            .select('full_name, name, user_id')
            .eq('id', id)
            .single();

        if (repoError || !repo) {
            return NextResponse.json({ error: 'Repository not found' }, { status: 404 });
        }

        // Get GitHub token from the OWNER of the repo, not necessarily the current user
        // so that a team member can trigger analysis using the connection established by the repo admin
        const { data: tokenData, error: tokenError } = await supabase
            .from('user_tokens')
            .select('provider_token')
            .eq('user_id', repo.user_id)
            .single();

        if (tokenError || !tokenData?.provider_token) {
            return NextResponse.json({ error: 'GitHub provider token not found. Please reconnect.' }, { status: 403 });
        }

        const [owner, repoName] = repo.full_name.split('/');

        // Initialize dependencies (Clean architecture wiring)
        const githubClient = new GitHubPRClient(tokenData.provider_token);
        const metricsRepo = new PRMetricsRepository(supabase);
        const analyzeUseCase = new AnalyzePullRequestsUseCase(githubClient, metricsRepo);

        // Execute Use Case
        const metrics = await analyzeUseCase.execute(id, owner, repoName);

        return NextResponse.json({ metrics });

    } catch (error: any) {
        console.error('[Analyze PRs] Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
