import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Validate repo ownership
        const { data: repo, error: repoError } = await supabase
            .from('repositories')
            .select('id')
            .eq('id', id)
            .single();

        if (repoError || !repo) {
            return NextResponse.json({ error: 'Repository not found or access denied' }, { status: 404 });
        }

        // Get range from URL (e.g. ?range=3m)
        const { searchParams } = new URL(request.url);
        const range = searchParams.get('range') || '1m';

        const startDate = new Date();
        if (range === '6m') {
            startDate.setDate(startDate.getDate() - 180);
        } else if (range === '3m') {
            startDate.setDate(startDate.getDate() - 90);
        } else {
            // Default 1m / 4 weeks
            startDate.setDate(startDate.getDate() - 28);
        }

        const { data: snapshots, error: snapshotsError } = await supabase
            .from('repository_metrics_snapshots')
            .select('health_score, avg_pr_size, review_time, unreviewed_ratio, created_at')
            .eq('repository_id', id)
            .gte('created_at', startDate.toISOString())
            .order('created_at', { ascending: true });

        if (snapshotsError) {
            return NextResponse.json({ error: 'Failed to fetch trends' }, { status: 500 });
        }

        return NextResponse.json({ trends: snapshots });

    } catch (error: any) {
        console.error('[Trend API] Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
