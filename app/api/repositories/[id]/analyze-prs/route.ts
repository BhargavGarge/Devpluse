import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { AnalyzePullRequestsUseCase } from '@/lib/application/use-cases/analyzePullRequests';
import { GitHubPRClient } from '@/lib/infrastructure/github/github-pr-client';
import { PRMetricsRepository } from '@/lib/infrastructure/database/pr-metrics-repository';

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

        // Get Repo Info
        const { data: repo, error: repoError } = await supabase
            .from('repositories')
            .select('full_name, name')
            .eq('id', id)
            .single();

        if (repoError || !repo) {
            return NextResponse.json({ error: 'Repository not found' }, { status: 404 });
        }

        // Get GitHub token
        const { data: tokenData, error: tokenError } = await supabase
            .from('user_tokens')
            .select('provider_token')
            .eq('user_id', user.id)
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
