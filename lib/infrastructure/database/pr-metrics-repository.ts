import { PullRequestMetrics } from "@/lib/domain/pr-metrics/entities";
import { SupabaseClient } from "@supabase/supabase-js";

export class PRMetricsRepository {
    constructor(private supabase: SupabaseClient) { }

    async saveMetrics(metrics: PullRequestMetrics): Promise<PullRequestMetrics> {
        const { data, error } = await this.supabase
            .from("pull_request_metrics")
            .upsert({
                repository_id: metrics.repositoryId,
                average_pr_size: metrics.averagePRSize,
                average_review_time: metrics.averageReviewTime,
                unreviewed_ratio: metrics.unreviewedRatio,
                large_pr_ratio: metrics.largePRRatio,
                health_score: metrics.healthScore,
                risk_level: metrics.riskLevel,
                analyzed_at: new Date().toISOString(),
                contributor_insights: metrics.contributorInsights,
                language_distribution: metrics.languageDistribution,
                review_deep_dive: metrics.reviewDeepDive
            }, { onConflict: 'repository_id' })
            .select()
            .single();

        if (error) {
            throw new Error(`Failed to save PR metrics: ${error.message}`);
        }

        return {
            id: data.id,
            repositoryId: data.repository_id,
            averagePRSize: data.average_pr_size,
            averageReviewTime: data.average_review_time,
            unreviewedRatio: data.unreviewed_ratio,
            largePRRatio: data.large_pr_ratio,
            healthScore: data.health_score,
            riskLevel: data.risk_level as any,
            analyzedAt: data.analyzed_at,
            contributorInsights: data.contributor_insights,
            languageDistribution: data.language_distribution,
            reviewDeepDive: data.review_deep_dive
        };
    }

    async getMetrics(repositoryId: string): Promise<PullRequestMetrics | null> {
        const { data, error } = await this.supabase
            .from("pull_request_metrics")
            .select('*')
            .eq("repository_id", repositoryId)
            .single();

        if (error || !data) {
            return null;
        }

        return {
            id: data.id,
            repositoryId: data.repository_id,
            averagePRSize: data.average_pr_size,
            averageReviewTime: data.average_review_time,
            unreviewedRatio: data.unreviewed_ratio,
            largePRRatio: data.large_pr_ratio,
            healthScore: data.health_score,
            riskLevel: data.risk_level as any,
            analyzedAt: data.analyzed_at,
            contributorInsights: data.contributor_insights,
            languageDistribution: data.language_distribution,
            reviewDeepDive: data.review_deep_dive
        };
    }
}
