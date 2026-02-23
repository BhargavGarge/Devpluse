import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateRepoReport } from '@/lib/generateReportOpenAI';

// Helper to calculate the health score based on extracted metrics
function calculateHealthScore(metrics: any) {
    let score = 100;
    const breakdown: Record<string, number> = {};

    if (!metrics.hasReadme) {
        score -= 10;
        breakdown.missing_readme = -10;
    }

    if (!metrics.hasTests) {
        score -= 15;
        breakdown.missing_tests = -15;
    }

    if (metrics.dependencies > 40) {
        score -= 8;
        breakdown.too_many_dependencies = -8;
    }

    if (metrics.commitsLast30Days < 3) {
        score -= 5;
        breakdown.low_recent_activity = -5;
    }

    // Additional synthetic logic could go here:
    // e.g., if (metrics.openIssues > 20) score -= 10;

    return {
        score: Math.max(score, 0),
        breakdown
    };
}

// Generate fallback summary if AI is unavailable or fails
function generateFallbackSummary(repoName: string, score: number, breakdown: any, metrics: any) {
    const issues = Object.keys(breakdown).map(k => k.replace(/_/g, ' '));
    const isPerfect = score === 100;

    const fallbackObj = {
        repoName: repoName,
        summary: isPerfect
            ? `Analysis complete for ${repoName}. The repository is exceptionally well-maintained with solid activity, testing, and documentation.`
            : `Analysis complete for ${repoName}. The repository scored ${score}/100 based on structural signals.`,
        metrics: {
            totalFiles: metrics.total_files || 0,
            primaryLanguage: metrics.primary_language || "Unknown",
            framework: metrics.detected_framework || "Unknown",
            dependencies: metrics.dependencies || 0,
            hasReadme: metrics.hasReadme || false,
            hasTests: metrics.hasTests || false,
            recentCommits: metrics.commitsLast30Days || 0,
            openIssues: metrics.openIssues || 0
        },
        insights: issues.length > 0 ? issues : ["None detected by static analysis"],
        roadmap: issues.length > 0 ? issues.map((i: string) => `Address ${i}`) : ["Continue current best practices"],
        codeQuality: "Standard fallback evaluation - sufficient structural components found matching standard ecosystem patterns."
    };

    return fallbackObj; // Return object, will be inserted to DB
}

export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { repository_id } = body;

        if (!repository_id) {
            return NextResponse.json({ error: 'repository_id is required' }, { status: 400 });
        }

        // 1. Get the repository details
        const { data: repoInfo, error: repoError } = await supabase
            .from('repositories')
            .select('full_name, name')
            .eq('id', repository_id)
            .single();

        if (repoError || !repoInfo) {
            return NextResponse.json({ error: 'Repository not found' }, { status: 404 });
        }

        const fullName = repoInfo.full_name;

        // 2. Get the GitHub provider token
        const { data: tokenData, error: tokenError } = await supabase
            .from('user_tokens')
            .select('provider_token')
            .eq('user_id', user.id)
            .single();

        if (tokenError || !tokenData?.provider_token) {
            return NextResponse.json({ error: 'GitHub provider token not found. Please reconnect your account.' }, { status: 403 });
        }

        const token = tokenData.provider_token;

        // Helper for GitHub API calls
        const fetchGitHub = async (endpoint: string) => {
            const res = await fetch(`https://api.github.com/repos/${fullName}${endpoint}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/vnd.github.v3+json',
                },
            });
            if (!res.ok) {
                if (res.status === 404 || res.status === 409) return null; // 409 is empty repo
                throw new Error(`GitHub API error: ${res.statusText} on ${endpoint}`);
            }
            return res.json();
        };

        // 3. Collect Repository Signals
        console.log(`[Generate Report] Starting analysis for ${fullName}...`);

        // A. Basic Metadata
        const metadata = await fetchGitHub('') || {};

        // B. Root Tree (Check for README, tests, package.json)
        // Note: fetchGitHub('/git/trees/HEAD') might fail if repo is empty
        const defaultBranch = metadata.default_branch || 'main';
        const treeData = await fetchGitHub(`/git/trees/${defaultBranch}?recursive=1`) || { tree: [] };
        const rootFiles = treeData.tree.map((file: any) => file.path.toLowerCase());

        const hasReadme = rootFiles.some((f: string) => f.includes('readme'));
        const hasTests = rootFiles.some((f: string) => f === 'test' || f === 'tests' || f === '__tests__' || f.includes('test.'));
        const hasPackageJson = rootFiles.includes('package.json');
        const hasRequirementsTxt = rootFiles.includes('requirements.txt');

        // C. Dependency Count (If JS/TS repo)
        let dependencyCount = 0;
        if (hasPackageJson) {
            try {
                const pkgData = await fetchGitHub('/contents/package.json');
                if (pkgData && pkgData.content) {
                    const decoded = Buffer.from(pkgData.content, 'base64').toString('utf-8');
                    const pkgJson = JSON.parse(decoded);
                    const deps = Object.keys(pkgJson.dependencies || {}).length;
                    const devDeps = Object.keys(pkgJson.devDependencies || {}).length;
                    dependencyCount = deps + devDeps;
                }
            } catch (e) {
                console.warn("Could not parse package.json for dependencies", e);
            }
        }

        // D. Commits in last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const sinceIso = thirtyDaysAgo.toISOString();
        let commitsLast30Days = 0;

        try {
            const commitsData = await fetchGitHub(`/commits?since=${sinceIso}`);
            if (commitsData && Array.isArray(commitsData)) {
                commitsLast30Days = commitsData.length;
            }
        } catch (e) {
            console.warn("Failed to fetch recent commits", e);
        }

        // E. Compile Metrics Snapshot
        const metricsSnapshot = {
            total_files: treeData.tree.length, // approximation of root/top-level size
            primary_language: metadata.language || "Unknown",
            hasReadme,
            hasTests,
            detected_framework: hasPackageJson ? "Node ecosystem" : (hasRequirementsTxt ? "Python ecosystem" : "Other"),
            dependencies: dependencyCount,
            commitsLast30Days,
            openIssues: metadata.open_issues_count || 0,
            watcherCount: metadata.subscribers_count || 0
        };

        console.log(`[Generate Report] Metrics Snapshot collected for ${fullName}`, metricsSnapshot);

        // F. Deep Code Scanning (Select interesting files to fetch)
        console.log(`[Generate Report] Selecting files for deep code scanning...`);
        const interestingPatterns = [
            /package\.json$/,
            /requirements\.txt$/,
            /dockerfile$/i,
            /(src|app|pages|lib)\/.*(index|main|app|layout|page|route)\.(tsx|ts|jsx|js|go|py|rs|java)$/i,
            /\/api\/.*\.(ts|js|go|py)$/i,
            /.*\.(mod|sum)$/,
            /middleware\.(ts|js)$/,
            /(config|setup)\.(ts|js|json|yml|yaml)$/
        ];

        // Filter out obviously non-code files and try to match interesting patterns
        const potentialFiles = treeData.tree.filter((node: any) =>
            node.type === 'blob' &&
            !node.path.includes('node_modules') &&
            !node.path.includes('.git') &&
            !node.path.includes('dist') &&
            !node.path.includes('build') &&
            !node.path.includes('vendor') &&
            node.size < 50000 // Skip files larger than 50KB to avoid massive token usage
        );

        // Sort by how many interesting patterns they match, or prioritize root files
        const selectedNodes = potentialFiles.filter((node: any) =>
            interestingPatterns.some(pattern => pattern.test(node.path))
        ).slice(0, 4); // Take top 4 most structurally significant files

        // If we didn't find enough, grab some generic TS/JS/PY files
        if (selectedNodes.length < 3) {
            const genericSourceFiles = potentialFiles.filter((node: any) =>
                !selectedNodes.includes(node) &&
                /\.(ts|tsx|js|jsx|py|go|rs|java|cpp|c)$/i.test(node.path)
            ).slice(0, 4 - selectedNodes.length);
            selectedNodes.push(...genericSourceFiles);
        }

        console.log(`[Generate Report] Fetching snippets for ${selectedNodes.length} files:`, selectedNodes.map((n: any) => n.path));

        const codeSnippets: { path: string, content: string }[] = [];

        // Fetch the raw content for these files
        for (const node of selectedNodes) {
            try {
                const fileData = await fetchGitHub(`/contents/${node.path}`);
                if (fileData && fileData.content) {
                    const decodedContent = Buffer.from(fileData.content, 'base64').toString('utf-8');
                    codeSnippets.push({
                        path: node.path,
                        content: decodedContent
                    });
                }
            } catch (e) {
                console.warn(`Failed to fetch content for snippet: ${node.path}`);
            }
        }

        // 4. Calculate health score
        const { score, breakdown: scoreBreakdown } = calculateHealthScore(metricsSnapshot);

        // // 5. Generate AI Summary
        let aiSummary: any = null;

        try {
            console.log(`[Generate Report] Calling OpenAI for ${fullName}...`);
            const repoUrl = `https://github.com/${fullName}`;

            aiSummary = await generateRepoReport(metricsSnapshot, repoUrl);

            if (!aiSummary) {
                throw new Error("AI returned null or invalid JSON");
            }

            // Ensure repoName is set if missing from AI generation
            if (!aiSummary.repoName) {
                aiSummary.repoName = fullName;
            }

        } catch (aiError) {
            console.warn("[Generate Report] Deepseek generation failed, falling back to local generator", aiError);
            aiSummary = generateFallbackSummary(repoInfo.name, score, scoreBreakdown, metricsSnapshot);
        }

        // 6. Insert into reports table
        console.log(`[Generate Report] Saving report for ${fullName}...`);
        const { data: newReport, error: insertError } = await supabase
            .from('reports')
            .insert({
                user_id: user.id,
                repository_id: repository_id,
                score: score,
                score_breakdown: scoreBreakdown,
                metrics_snapshot: metricsSnapshot,
                ai_summary: aiSummary
            })
            .select()
            .single();

        if (insertError) {
            console.error("Supabase insert error:", insertError);
            throw insertError;
        }

        return NextResponse.json({ report: newReport });
    } catch (error: any) {
        console.error('[Generate Report] CRITICAL ERROR:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
