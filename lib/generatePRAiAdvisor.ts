import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generatePRAiAdvisor(metrics: any) {
  const prompt = `
You are an expert engineering leader and AI Tech Advisor. 
Analyze the following pull request metrics for a team and provide a concise, structured "AI Risk Narrative" that highlights risky engineering behaviors or praises excellent discipline.

PR Metrics Data:
- Average PR Size (Lines): ${metrics.averagePRSize}
- Average Review Time (Hours): ${metrics.averageReviewTime}
- Unreviewed PR Ratio: ${metrics.unreviewedRatio}
- Large PR Ratio (>500 lines): ${metrics.largePRRatio}
- Multi-Reviewer PRs Ratio: ${metrics.reviewDeepDive?.multipleReviewersRatio || 0}
- Fast Merge Ratio (< 30 min): ${metrics.reviewDeepDive?.fastMergeRatio || 0}
- Median Review Time (Hours): ${metrics.reviewDeepDive?.medianReviewTime || 0}

Output strictly in the following JSON schema:
{
  "explanation": "<1-2 sentences explaining the core dynamic or risk. For example: 'Your team merges very large PRs quickly with zero review discussion. This increases regression risk and reduces shared ownership.'>",
  "severity": "<Critical | High | Moderate | Low | Excellent>",
  "severityJustification": "<1 sentence justifying the severity rating>",
  "recommendedActions": [
    "<Short, actionable recommendation 1>",
    "<Short, actionable recommendation 2>",
    "<Short, actionable recommendation 3>"
  ]
}

Be direct, insightful, and focus on team behavioral patterns. Use a professional, slightly authoritative tone (like a CTO advising a team lead). 
If the metrics are good (e.g. low sizes, good review participation), praise the team and note the "Excellent" stability.
`;

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        { role: "system", content: "You are an expert engineering leader analyzing team PR behaviors." },
        { role: "user", content: prompt },
      ],
      temperature: 0.3, 
      response_format: { type: "json_object" }
    });

    const content = response.choices[0]?.message?.content || "";
    return JSON.parse(content);
  } catch (error) {
    console.error("OpenAI AI Advisor generation error:", error);
    return null;
  }
}
