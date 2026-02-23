import { OpenRouter } from "@openrouter/sdk";

const client = new OpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY,
});

export async function generateRepoReport(prompt: string): Promise<string> {
    // properly typed request
    const result = await client.chat.send({
        chatGenerationParams: {
            model: "meta-llama/llama-3.3-70b-instruct:free",
            messages: [
                {
                    role: "system",
                    content: "You are a senior software architect analyzing code repositories to provide accurate, structured reports."
                },
                { role: "user", content: prompt }
            ],
            stream: false,
        },
    });

    const content = result.choices?.[0]?.message?.content;
    if (typeof content === "string") return content;
    return "AI did not return a response.";
}