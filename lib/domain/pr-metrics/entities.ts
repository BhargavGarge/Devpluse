export type RiskLevel = "Low" | "Moderate" | "High";

export interface PRHealthScore {
    score: number;
    riskLevel: RiskLevel;
    breakdown: {
        averagePRSize: number;
        averageReviewTime: number; // in hours
        unreviewedPRRatio: number;
        largePRRatio: number;
    };
}

export interface ContributorInsights {
    topContributors: Array<{ login: string, prCount: number, linesChanged: number }>;
    singleContributorRatio: number;
    reviewParticipationRate: number; // Ratio of contributors who actually gave reviews
}

export interface LanguageDistribution {
    languages: Record<string, number>; // bytes per language
    primaryLanguage: string;
    fragmentationScore: number; // 0-1, higher means more fragmented
}

export interface ReviewDeepDive {
    multipleReviewersRatio: number; // % of PRs with >= 2 reviewers
    averageComments: number;
    medianReviewTime: number; // in hours
    fastMergeRatio: number; // < 30 mins
}

export interface PullRequestMetrics {
    id?: string;
    repositoryId: string;
    averagePRSize: number;
    averageReviewTime: number; // in hours
    unreviewedRatio: number;
    largePRRatio: number;
    healthScore: number;
    riskLevel: RiskLevel;
    analyzedAt?: string;
    contributorInsights?: ContributorInsights;
    languageDistribution?: LanguageDistribution;
    reviewDeepDive?: ReviewDeepDive;
}

export interface RawPullRequest {
    number: number;
    state: string;
    title: string;
    additions: number;
    deletions: number;
    changed_files: number;
    created_at: string;
    merged_at: string | null;
    comments: number;
    review_comments: number;
    commits: number;
    user: { login: string };
    merged_by?: { login: string } | null;
    requested_reviewers?: Array<{ login: string }>;
}
