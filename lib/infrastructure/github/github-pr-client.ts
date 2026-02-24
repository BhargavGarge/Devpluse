import { RawPullRequest } from "@/lib/domain/pr-metrics/entities";

export class GitHubPRClient {
    private baseUrl = "https://api.github.com";

    constructor(private token: string) { }

    private async fetchJson(endpoint: string): Promise<any> {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            headers: {
                Authorization: `Bearer ${this.token}`,
                Accept: "application/vnd.github.v3+json",
                "User-Agent": "Devpluse-App"
            },
        });

        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.statusText} on ${endpoint}`);
        }

        return response.json();
    }

    /**
     * Fetches up to 50 recently closed/merged PRs.
     * Note: The list endpoint doesn't include additions/deletions/review_comments.
     * We have to fetch details for each PR separately, or use a GraphQL query.
     * To keep it simple and REST-based as per requirements MVP, we will fetch standard pulls, 
     * then fetch details concurrently for up to 30 PRs to avoid rate limiting.
     */
    async getRecentPullRequests(owner: string, repo: string, limit: number = 30): Promise<RawPullRequest[]> {
        // 1. Fetch list of closed PRs
        const pullsList = await this.fetchJson(`/repos/${owner}/${repo}/pulls?state=closed&per_page=${limit}&sort=updated&direction=desc`);

        if (!Array.isArray(pullsList) || pullsList.length === 0) {
            return [];
        }

        // 2. Fetch details for each PR concurrently (since the list endpoint omits additions/deletions)
        const detailedPRPromises = pullsList.map(async (pr: any) => {
            try {
                // Fetch PR specific data (this includes additions, deletions, review_comments)
                const details = await this.fetchJson(`/repos/${owner}/${repo}/pulls/${pr.number}`);
                return {
                    number: details.number,
                    state: details.state,
                    title: details.title,
                    additions: details.additions || 0,
                    deletions: details.deletions || 0,
                    changed_files: details.changed_files || 0,
                    created_at: details.created_at,
                    merged_at: details.merged_at, // Could be null if closed without merge
                    comments: details.comments || 0,
                    review_comments: details.review_comments || 0,
                    commits: details.commits || 0,
                    user: { login: details.user?.login || "unknown" },
                    merged_by: details.merged_by ? { login: details.merged_by.login } : null,
                    requested_reviewers: details.requested_reviewers ? details.requested_reviewers.map((r: any) => ({ login: r.login })) : []
                } as RawPullRequest;
            } catch (err) {
                console.warn(`Failed to fetch details for PR #${pr.number}:`, err);
                return null;
            }
        });

        const detailedPRs = await Promise.all(detailedPRPromises);
        return detailedPRs.filter((pr): pr is RawPullRequest => pr !== null && pr.merged_at !== null); // Only consider merged PRs for metric accuracy
    }

    /**
     * Fetches the language distribution for the repository.
     */
    async getLanguageDistribution(owner: string, repo: string): Promise<Record<string, number>> {
        try {
            const languages = await this.fetchJson(`/repos/${owner}/${repo}/languages`);
            return languages;
        } catch (err) {
            console.warn("Failed to fetch language distribution:", err);
            return {};
        }
    }
}
