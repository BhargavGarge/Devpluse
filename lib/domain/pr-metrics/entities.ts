export type RiskLevel = "Low" | "Moderate" | "High";

export interface PRHealthScore {
    score: number;
    riskLevel: RiskLevel;
    breakdown: {
        prSizeScore: number;
        reviewTimeScore: number;
        unreviewedRatioScore: number;
        mergeSpeedScore: number;
        multiReviewerScore: number;
    };
}

export interface ContributorInsights {
    topContributors: Array<{ login: string, prCount: number, linesChanged: number, personaTags: string[] }>;
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

export interface AIRiskNarrative {
    explanation: string;
    severity: RiskLevel | "Excellent";
    severityJustification: string;
    recommendedActions: string[];
}

export interface SmartAlert {
    id: string;
    title: string;
    description: string;
    severity: "critical" | "warning" | "info";
    type: "ownership" | "velocity" | "quality" | "review";
}

export interface PullRequestMetrics {
    id?: string;
    repositoryId: string;
    averagePRSize: number;
    averageReviewTime: number; // in hours
    unreviewedRatio: number;
    largePRRatio: number;
    healthScore: number;
    healthScoreBreakdown?: PRHealthScore['breakdown'];
    riskLevel: RiskLevel;
    analyzedAt?: string;
    contributorInsights?: ContributorInsights;
    languageDistribution?: LanguageDistribution;
    reviewDeepDive?: ReviewDeepDive;
    aiRiskNarrative?: AIRiskNarrative;
    smartAlerts?: SmartAlert[];
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
