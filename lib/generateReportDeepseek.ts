export async function generateRepoReportDeepseek(prompt: string): Promise<string> {
    const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${DEEPSEEK_API_KEY}`,
        },
        body: JSON.stringify({
            model: "deepseek-chat",
            messages: [
                {
                    role: "system",
                    content: "You are a senior software architect analyzing code repositories. Provide a detailed and structured report. Be precise and concise."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            max_tokens: 1500,
            temperature: 0.2,
        }),
    });

    if (!response.ok) {
        const errorBody = await response.text();
        console.error("Deepseek API error:", response.status, errorBody);
        return "Failed to generate report from Deepseek.";
    }

    const data = await response.json();
    return data?.choices?.[0]?.message?.content ?? "Deepseek returned no content.";
}
