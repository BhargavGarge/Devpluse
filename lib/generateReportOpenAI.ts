import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateRepoReport(metrics: any, repoUrl: string, codeSnippets: { path: string, content: string }[] = []) {

  // Format the code snippets block
  const snippetsText = codeSnippets.length > 0
    ? `\n\n=== DEEP CODE SCANNING SNIPPETS ===\nThe following are actual raw source code snippets fetched directly from the repository. You must analyze these specific files for literal code smells, bad practices, bugs, or brilliant architectural decisions.\n\n` +
    codeSnippets.map(snippet => `--- File: ${snippet.path} ---\n\`\`\`\n${snippet.content.substring(0, 3000)}\n\`\`\`\n`).join('\n')
    : `\n\nNo specific code snippets were available for deep scanning. Rely on generic architectural metadata.`;

  const prompt = `
You are a senior software architect, technical due diligence auditor, and risk analyst. Analyze the following GitHub repository and provide a detailed, investor-friendly, structured risk engine report.

Repository URL: ${repoUrl}

Repo Metrics:
- Total Files: ${metrics.total_files || metrics.totalFiles}
- Primary Language: ${metrics.primary_language || metrics.primaryLanguage}
- Framework (Inferred): ${metrics.detected_framework || metrics.framework}
- Dependencies count: ${metrics.dependencies}
- Has README: ${metrics.hasReadme}
- Has Tests: ${metrics.hasTests}
- Recent Commits (last 30 days): ${metrics.commitsLast30Days || metrics.recentCommits}
- Open Issues: ${metrics.openIssues}
${metrics.prMetrics ? `
PR Review Health Metrics:
- Average PR Size (Lines): ${metrics.prMetrics.averagePRSize}
- Average Review Time (Hours): ${metrics.prMetrics.averageReviewTime}
- Unreviewed PR Ratio: ${metrics.prMetrics.unreviewedRatio}
- Large PR Ratio (>500 lines): ${metrics.prMetrics.largePRRatio}
- PR Health Score (0-100): ${metrics.prMetrics.healthScore}
` : ''}
${snippetsText}

Instructions:
1. Executive Snapshot: Provide a concise summary for investors. Determine if it's "Production Ready" (boolean equivalent), rate Maintenance Risk, Scaling Readiness, Security Risk, and provide a 1-sentence Investment Recommendation.
2. Health Breakdown: Distribute a total score of 100 across 6 categories (Code Quality 20%, Testing 20%, Documentation 10%, Dependency Risk 15%, Activity & Maintenance 15%, Architecture & Modularity 20%). For each, provide the score out of its weight, a risk level (e.g., "Critical", "High", "Moderate", "Low"), and impact (e.g., "High", "Medium", "Low").
3. Risk Board: Identify 3 to 5 specific, actionable risks instead of vague paragraphs. For each risk, provide a title, severity (Critical, High, Moderate, Low), impact description, business risk, estimated fix effort (e.g., "1-2 days"), confidence level (percentage), and a brief description.
4. Technical Debt Meter: Calculate or infer metric ratios. For example, dependency-to-file ratio, test-to-file ratio (estimate based on files), commit velocity, contributor bus factor, an overall Technical Debt Index (0-100, where higher is worse), and a Risk Trend (Increasing, Decreasing, Stable).
5. PR Insights: If PR Metrics are provided, explain the PR process maturity, highlight risks (e.g., slow reviews, no reviews, bloated PRs), and give actionable improvement suggestions.
6. Output strictly in the following JSON schema:
{
  "repoName": "<repo-name>",
  "executiveSnapshot": {
    "productionReady": <boolean>,
    "maintenanceRisk": "<High | Medium | Low>",
    "scalingReadiness": "<High | Medium | Low>",
    "securityRisk": "<High | Medium | Low>",
    "investmentRecommendation": "<1 sentence recommendation>"
  },
  "healthBreakdown": {
    "codeQuality": { "score": <num 0-20>, "risk": "<level>", "impact": "<level>" },
    "testing": { "score": <num 0-20>, "risk": "<level>", "impact": "<level>" },
    "documentation": { "score": <num 0-10>, "risk": "<level>", "impact": "<level>" },
    "dependencyRisk": { "score": <num 0-15>, "risk": "<level>", "impact": "<level>" },
    "activityMaintenance": { "score": <num 0-15>, "risk": "<level>", "impact": "<level>" },
    "architectureModularity": { "score": <num 0-20>, "risk": "<level>", "impact": "<level>" },
    "totalScore": <total sum 0-100>
  },
  "riskBoard": [
    {
      "title": "<Short actionable title>",
      "severity": "<Critical | High | Moderate | Low>",
      "impact": "<High | Medium | Low>",
      "businessRisk": "<e.g., Production instability>",
      "fixEffort": "<e.g., 6-8 hours>",
      "confidence": <num 0-100>,
      "description": "<1-2 sentences explaining>"
    }
  ],
  "technicalDebtMeter": {
    "dependencyToFileRatio": "<ratio e.g. 0.5>",
    "testToFileRatio": "<ratio e.g. 0.1>",
    "commitVelocity": "<High | Medium | Low>",
    "contributorBusFactor": "<High | Medium | Low>",
    "technicalDebtIndex": <num 0-100>,
    "riskTrend": "<Increasing | Decreasing | Stable>"
  },
  "prInsights": {
    "prInsightsSummary": "<1-2 sentences explaining PR process maturity>",
    "topRisk": "<The biggest risk in their PR/review process>",
    "recommendation": "<Actionable improvement suggestion>"
  },
  "metrics": {
    "totalFiles": ${metrics.total_files || metrics.totalFiles},
    "primaryLanguage": "${metrics.primary_language || metrics.primaryLanguage}",
    "framework": "${metrics.detected_framework || metrics.framework}",
    "dependencies": ${metrics.dependencies},
    "recentCommits": ${metrics.commitsLast30Days || metrics.recentCommits},
    "contributors": 1, 
    "openIssues": ${metrics.openIssues},
    "hasReadme": ${metrics.hasReadme},
    "hasTests": ${metrics.hasTests}
  }
}

Be precise, avoid fluff, evaluate the snippets deeply, and give actionable advice.
`;

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        { role: "system", content: "You are an expert software architect and AI analyst, specialized in deep code scanning of GitHub repositories. You produce precise, structured reports for startup founders, investors, and engineering teams." },
        { role: "user", content: prompt },
      ],
      temperature: 0.2, // deterministic output
      response_format: { type: "json_object" }
    });

    const content = response.choices[0]?.message?.content || "";
    return JSON.parse(content); // structured JSON
  } catch (error) {
    console.error("OpenAI API error:", error);
    return null;
  }
}
