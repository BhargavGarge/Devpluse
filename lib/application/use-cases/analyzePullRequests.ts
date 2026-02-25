import { PullRequestMetrics, RiskLevel, ContributorInsights, LanguageDistribution, ReviewDeepDive, SmartAlert } from "@/lib/domain/pr-metrics/entities";
import { GitHubPRClient } from "@/lib/infrastructure/github/github-pr-client";
import { PRMetricsRepository } from "@/lib/infrastructure/database/pr-metrics-repository";
import { generatePRAiAdvisor } from "@/lib/generatePRAiAdvisor";

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
        const authorFastMerges: Record<string, number> = {};
        const authorUnreviewed: Record<string, number> = {};
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
                        authorFastMerges[author] = (authorFastMerges[author] || 0) + 1;
                    }
                }
            }

            if (pr.review_comments === 0) {
                authorUnreviewed[author] = (authorUnreviewed[author] || 0) + 1;
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
        const topContributors = authorsList.map(login => {
            const prCount = authorPRCounts[login];
            const linesChanged = authorLinesChanged[login];
            const avgSize = prCount > 0 ? linesChanged / prCount : 0;
            const fastMergeRatio = prCount > 0 ? (authorFastMerges[login] || 0) / prCount : 0;
            const unreviewedRatio = prCount > 0 ? (authorUnreviewed[login] || 0) / prCount : 0;

            const personaTags: string[] = [];

            if (fastMergeRatio > 0.5 && unreviewedRatio > 0.5) {
                personaTags.push("High Velocity, Low Review");
            } else if (fastMergeRatio < 0.2 && unreviewedRatio < 0.2) {
                personaTags.push("Careful Reviewer");
            }

            if (avgSize > 600) {
                personaTags.push("Large PR Specialist");
            } else if (prCount <= 2 && totalPRs > 10) {
                personaTags.push("Drive-by Contributor");
            }

            return {
                login,
                prCount,
                linesChanged,
                personaTags
            };
        }).sort((a, b) => b.prCount - a.prCount);

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

        // 3. Compute Deterministic Health Score (Transparent Weighted Breakdown)
        // Max Score: 100
        // PR Size: 25% (0-25)
        // Review Time: 20% (0-20)
        // Unreviewed Ratio: 25% (0-25)
        // Merge Speed (Fast Merges): 15% (0-15)
        // Multi-Reviewer 15% (0-15)

        let prSizeScore = 25;
        if (averagePRSize > 800) prSizeScore = 0;
        else if (averagePRSize > 500) prSizeScore = 10;
        else if (averagePRSize > 300) prSizeScore = 15;
        else if (averagePRSize > 100) prSizeScore = 20;

        let reviewTimeScore = 20;
        if (averageReviewTime < 0.5 || averageReviewTime > 72) reviewTimeScore = 0; // Rubber stamp or abandoned
        else if (averageReviewTime > 48) reviewTimeScore = 5;
        else if (averageReviewTime > 24) reviewTimeScore = 10;
        else if (averageReviewTime > 12) reviewTimeScore = 15;

        let unreviewedRatioScore = 25;
        if (unreviewedRatio > 0.6) unreviewedRatioScore = 0;
        else if (unreviewedRatio > 0.4) unreviewedRatioScore = 5;
        else if (unreviewedRatio > 0.2) unreviewedRatioScore = 15;
        else if (unreviewedRatio > 0.1) unreviewedRatioScore = 20;

        // < 30 mins fast merges are bad for quality if too high
        let mergeSpeedScore = 15;
        if (reviewDeepDive.fastMergeRatio > 0.5) mergeSpeedScore = 0;
        else if (reviewDeepDive.fastMergeRatio > 0.3) mergeSpeedScore = 5;
        else if (reviewDeepDive.fastMergeRatio > 0.1) mergeSpeedScore = 10;

        let multiReviewerScore = 15;
        if (reviewDeepDive.multipleReviewersRatio < 0.05) multiReviewerScore = 0;
        else if (reviewDeepDive.multipleReviewersRatio < 0.1) multiReviewerScore = 5;
        else if (reviewDeepDive.multipleReviewersRatio < 0.2) multiReviewerScore = 10;

        let score = prSizeScore + reviewTimeScore + unreviewedRatioScore + mergeSpeedScore + multiReviewerScore;

        // Severe ownership or complexity penalties (can reduce score below the sum)
        if (singleContributorRatio > 0.7 && totalPRs > 5) score -= 15;
        if (fragmentationScore > 0.5) score -= 10;

        score = Math.max(0, Math.min(100, score));

        let riskLevel: RiskLevel = "High";
        if (score >= 80) riskLevel = "Low";
        else if (score >= 50) riskLevel = "Moderate";

        const healthScoreBreakdown = {
            prSizeScore,
            reviewTimeScore,
            unreviewedRatioScore,
            mergeSpeedScore,
            multiReviewerScore
        };

        const metrics: PullRequestMetrics = {
            repositoryId,
            averagePRSize: Math.round(averagePRSize),
            averageReviewTime: Number(averageReviewTime.toFixed(1)),
            unreviewedRatio: Number(unreviewedRatio.toFixed(2)),
            largePRRatio: Number(largePRRatio.toFixed(2)),
            healthScore: Math.round(score),
            healthScoreBreakdown,
            riskLevel,
            contributorInsights,
            languageDistribution,
            reviewDeepDive,
            smartAlerts: [] // Will populate below
        };

        // 4. Generate Smart Alerts
        const alerts: SmartAlert[] = [];

        if (metrics.unreviewedRatio > 0.4) {
            alerts.push({
                id: 'high-unreviewed',
                title: 'High Unreviewed Ratio',
                description: `${(metrics.unreviewedRatio * 100).toFixed(0)}% of PRs are merged without any review comments. This significantly increases regression risk.`,
                severity: 'critical',
                type: 'quality'
            });
        }

        if (metrics.reviewDeepDive?.fastMergeRatio && metrics.reviewDeepDive.fastMergeRatio > 0.4) {
            alerts.push({
                id: 'high-fast-merges',
                title: 'Suspiciously Fast Merges',
                description: `${(metrics.reviewDeepDive.fastMergeRatio * 100).toFixed(0)}% of PRs are merged in under 30 minutes, suggesting potential rubber-stamping.`,
                severity: 'warning',
                type: 'review'
            });
        }

        if (metrics.averagePRSize > 600) {
            alerts.push({
                id: 'large-pr-size',
                title: 'Massive PR Sizes',
                description: `Average PR is ${metrics.averagePRSize} lines. PRs this large are notoriously difficult to review thoroughly and cause merge conflicts.`,
                severity: 'warning',
                type: 'velocity'
            });
        }

        if (metrics.contributorInsights && metrics.contributorInsights.singleContributorRatio > 0.6 && totalPRs > 10) {
            alerts.push({
                id: 'ownership-risk',
                title: 'High Key-Person Dependency',
                description: `A single developer merged ${(metrics.contributorInsights.singleContributorRatio * 100).toFixed(0)}% of recent PRs. High bus-factor risk.`,
                severity: 'critical',
                type: 'ownership'
            });
        }

        if (metrics.contributorInsights && metrics.contributorInsights.reviewParticipationRate < 0.3 && totalPRs > 5) {
            alerts.push({
                id: 'low-review-participation',
                title: 'Siloed Code Reviews',
                description: `Only ${(metrics.contributorInsights.reviewParticipationRate * 100).toFixed(0)}% of contributors are participating in reviews. Knowledge is not being shared.`,
                severity: 'warning',
                type: 'review'
            });
        }

        metrics.smartAlerts = alerts;

        // 5. Generate AI Risk Narrative
        const aiRiskNarrative = await generatePRAiAdvisor(metrics);
        if (aiRiskNarrative) {
            metrics.aiRiskNarrative = aiRiskNarrative;
        }

        // 6. Store Results in DB
        return await this.metricsRepo.saveMetrics(metrics);
    }
}
