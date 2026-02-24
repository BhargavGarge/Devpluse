import { PullRequestMetrics, RiskLevel } from "@/lib/domain/pr-metrics/entities";
import { GitHubPRClient } from "@/lib/infrastructure/github/github-pr-client";
import { PRMetricsRepository } from "@/lib/infrastructure/database/pr-metrics-repository";

export class AnalyzePullRequestsUseCase {
    constructor(
        private githubClient: GitHubPRClient,
        private metricsRepo: PRMetricsRepository
    ) { }

    async execute(repositoryId: string, owner: string, repo: string): Promise<PullRequestMetrics> {
        // 1. Fetch recent PRs and Language Distribution
        const [prs, languages] = await Promise.all([
            this.githubClient.getRecentPullRequests(owner, repo, 50),
            this.githubClient.getLanguageDistribution(owner, repo)
        ]);

        if (prs.length === 0) {
            // Handle 0 PRs edge case
            const zeroMetrics: PullRequestMetrics = {
                repositoryId,
                averagePRSize: 0,
                averageReviewTime: 0,
                unreviewedRatio: 0,
                largePRRatio: 0,
                healthScore: 50, // Neutral score for new/empty repos
                riskLevel: "Moderate"
            };
            return await this.metricsRepo.saveMetrics(zeroMetrics);
        }

        // 2. Compute Base Metrics & Base Deep Dive Data
        const totalPRs = prs.length;
        let totalSize = 0;
        let totalReviewTimeHours = 0;
        let unreviewedCount = 0;
        let largePRCount = 0;

        // Deep Dive Metric Accumulators
        let multipleReviewersCount = 0;
        let totalComments = 0;
        let fastMergeCount = 0;
        const reviewTimes: number[] = [];

        // Contributor Metric Accumulators
        const authorPRCounts: Record<string, number> = {};
        const authorLinesChanged: Record<string, number> = {};
        const uniqueReviewers = new Set<string>();

        for (const pr of prs) {
            const size = pr.additions + pr.deletions;
            totalSize += size;
            totalComments += pr.comments + pr.review_comments;

            if (size > 500) {
                largePRCount++;
            }

            if (pr.review_comments === 0) {
                unreviewedCount++;
            }

            // Deep Dive: >= 2 Reviewers
            if (pr.requested_reviewers && pr.requested_reviewers.length >= 2) {
                multipleReviewersCount++;
            }
            // Add reviewers to set
            pr.requested_reviewers?.forEach(r => uniqueReviewers.add(r.login));

            // Contributor Stats
            const author = pr.user.login;
            authorPRCounts[author] = (authorPRCounts[author] || 0) + 1;
            authorLinesChanged[author] = (authorLinesChanged[author] || 0) + size;

            if (pr.merged_at && pr.created_at) {
                const created = new Date(pr.created_at).getTime();
                const merged = new Date(pr.merged_at).getTime();
                const diffHours = (merged - created) / (1000 * 60 * 60);

                if (diffHours >= 0) {
                    totalReviewTimeHours += diffHours;
                    reviewTimes.push(diffHours);

                    if (diffHours < 0.5) { // < 30 mins
                        fastMergeCount++;
                    }
                }
            }
        }

        // Calculate Medians
        reviewTimes.sort((a, b) => a - b);
        let medianReviewTime = 0;
        if (reviewTimes.length > 0) {
            const mid = Math.floor(reviewTimes.length / 2);
            medianReviewTime = reviewTimes.length % 2 !== 0 ? reviewTimes[mid] : (reviewTimes[mid - 1] + reviewTimes[mid]) / 2;
        }

        // Base Averages
        const averagePRSize = totalSize / totalPRs;
        const averageReviewTime = reviewTimes.length > 0 ? totalReviewTimeHours / reviewTimes.length : 0;
        const unreviewedRatio = unreviewedCount / totalPRs;
        const largePRRatio = largePRCount / totalPRs;

        // MVP 2: Review Deep Dive
        const reviewDeepDive = {
            multipleReviewersRatio: multipleReviewersCount / totalPRs,
            averageComments: totalComments / totalPRs,
            medianReviewTime: Number(medianReviewTime.toFixed(1)),
            fastMergeRatio: fastMergeCount / totalPRs
        };

        // MVP 2: Contributor Insights
        const authorsList = Object.keys(authorPRCounts);
        const topContributors = authorsList.map(login => ({
            login,
            prCount: authorPRCounts[login],
            linesChanged: authorLinesChanged[login]
        })).sort((a, b) => b.prCount - a.prCount);

        const maxPRCount = topContributors.length > 0 ? topContributors[0].prCount : 0;
        const singleContributorRatio = totalPRs > 0 ? maxPRCount / totalPRs : 0;

        const reviewParticipationRate = authorsList.length > 0 ? uniqueReviewers.size / authorsList.length : 0;

        const contributorInsights = {
            topContributors: topContributors.slice(0, 5), // Top 5
            singleContributorRatio: Number(singleContributorRatio.toFixed(2)),
            reviewParticipationRate: Number(reviewParticipationRate.toFixed(2))
        };

        // MVP 2: Language Distribution
        const langEntries = Object.entries(languages);
        let totalBytes = 0;
        let primaryLanguage = "Unknown";
        let maxBytes = 0;

        langEntries.forEach(([lang, bytes]) => {
            totalBytes += bytes;
            if (bytes > maxBytes) {
                maxBytes = bytes;
                primaryLanguage = lang;
            }
        });

        // Fragmentation = 1 - (primary_lang_bytes / total_bytes). If primary represents 100%, fragmentation is 0. 
        // If primary represents 40%, fragmentation is 0.6.
        const fragmentationScore = totalBytes > 0 ? 1 - (maxBytes / totalBytes) : 0;

        const languageDistribution = {
            languages,
            primaryLanguage,
            fragmentationScore: Number(fragmentationScore.toFixed(2))
        };

        // 3. Compute Deterministic Health Score
        let score = 100;

        if (averagePRSize > 600) score -= 20;
        if (unreviewedRatio > 0.4) score -= 20;
        if (averageReviewTime < 1 && totalPRs > 0) score -= 10; // Suspect rubber stamping
        if (largePRRatio > 0.3) score -= 15;

        // Ownership risk penalty
        if (singleContributorRatio > 0.7 && totalPRs > 5) score -= 15;
        // Complexity penalty
        if (fragmentationScore > 0.5) score -= 10;

        score = Math.max(0, Math.min(100, score));

        let riskLevel: RiskLevel = "High";
        if (score >= 80) riskLevel = "Low";
        else if (score >= 50) riskLevel = "Moderate";

        const metrics: PullRequestMetrics = {
            repositoryId,
            averagePRSize: Math.round(averagePRSize),
            averageReviewTime: Number(averageReviewTime.toFixed(1)),
            unreviewedRatio: Number(unreviewedRatio.toFixed(2)),
            largePRRatio: Number(largePRRatio.toFixed(2)),
            healthScore: Math.round(score),
            riskLevel,
            contributorInsights,
            languageDistribution,
            reviewDeepDive
        };

        // 4. Store Results in DB
        return await this.metricsRepo.saveMetrics(metrics);
    }
}
