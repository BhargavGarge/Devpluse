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
You are a senior software architect and technical due diligence auditor. Analyze the following GitHub repository and provide a detailed, investor-friendly, structured report.

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
${snippetsText}

Instructions:
1. Executive Overview: Provide a concise summary stating what problem the project solves, its stage of development, and high-level risks (e.g., missing tests or inactivity).
2. Metrics Extension: Use the provided metrics but also infer or synthesize elements like "dependencyHealth" based on standard ecosystem realities (e.g., "High dependency count suggests potential audit needs").
3. Architectural Insights: Assess folder structure, scalability, CI/CD readiness, error handling, and tech debt.
4. Code Quality: Break this down into 3 arrays: 'strengths', 'weaknesses', and 'recommendations' based on literal code snippet patterns or repo metadata.
5. Roadmap: Provide a tiered action plan structured by "Immediate", "Short-term", and "Long-term" priorities.
6. Health Score: Provide a numerical score out of 100 representing technical debt and readiness, followed by a qualitative summary.
7. Output strictly in the following JSON schema:
{
  "repoName": "<repo-name>",
  "executiveOverview": "<detailed executive summary>",
  "metrics": {
    "totalFiles": ${metrics.total_files || metrics.totalFiles},
    "primaryLanguage": "${metrics.primary_language || metrics.primaryLanguage}",
    "framework": "${metrics.detected_framework || metrics.framework}",
    "dependencies": ${metrics.dependencies},
    "recentCommits": ${metrics.commitsLast30Days || metrics.recentCommits},
    "contributors": 1, 
    "openIssues": ${metrics.openIssues},
    "hasReadme": ${metrics.hasReadme},
    "hasTests": ${metrics.hasTests},
    "dependencyHealth": "<qualitative assessment of dependency risk>"
  },
  "architecturalInsights": ["<insight 1>", "<insight 2>"],
  "codeQuality": {
    "strengths": ["...", "..."],
    "weaknesses": ["...", "..."],
    "recommendations": ["...", "..."]
  },
  "roadmap": [
    "Immediate: <action>",
    "Short-term: <action>",
    "Long-term: <action>"
  ],
  "healthScore": {
    "score": <number 0-100>,
    "summary": "<investor-friendly health score summary>"
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
