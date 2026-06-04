export type Message = { role: "user" | "model"; text: string };

export async function chat(userMessage: string, history: Message[]): Promise<string> {
    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent`,
        {
        method: "POST",
        headers: { "content-type": "application/json", "X-goog-api-key": `${process.env.GEMINI_API_KEY}` },
        body: JSON.stringify({
            contents: [
                ...history.map((message) => (
                    { role: message.role, parts: [{ text: message.text }] }
                )),
                { role: "user", parts: [{ text: userMessage }] }
            ],
        }),
        }
    );

    const data = await response.json();
    if (!response.ok || !data.candidates) {
        console.error("API error:", JSON.stringify(data, null, 2));
        throw new Error("API error");
    }

    return data.candidates[0].content.parts[0].text as string;
};

