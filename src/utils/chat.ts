import { lookup_order, lookup_subscription } from "./tools";

function executeTool(name: string, args: any): string {
    switch (name) {
        case "lookup_order":
            const order = lookup_order(args.order_id);
            return order ? JSON.stringify(order) : "Order not found.";
        case "lookup_subscription":
            const subscription = lookup_subscription(args.email);
            return subscription ? JSON.stringify(subscription) : "Subscription not found.";
        default:
            return "Unknown tool";
    }
}
export type Message = { role: "user" | "model"; text: string };

export async function chat(userMessage: string, history: Message[]): Promise<string> {
    const messages: any[] = [
        ...history.map((m) => ({ role: m.role, parts: [{ text: m.text }] })),
        { role: "user", parts: [{ text: userMessage }] }
    ];

    while (true) {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent`,
            {
                method: "POST",
                headers: { "content-type": "application/json", "X-goog-api-key": `${process.env.GEMINI_API_KEY}` },
                body: JSON.stringify({
                    contents: messages,
                    tools: [{
                        functionDeclarations: [
                            { 
                                name: "lookup_order", 
                                description: "Look up an order by its ID" ,
                                parameters: {
                                    type: "object",
                                    properties: {
                                        order_id: { type: "string", description: "The ID of the order to look up" }
                                    },
                                    required: ["order_id"]
                                }
                            },
                            { 
                                name: "lookup_subscription", 
                                description: "Look up a subscription by its email",
                                parameters: {
                                    type: "object",
                                    properties: {
                                        email: { type: "string", description: "The email of the subscription to look up" }
                                    },
                                    required: ["email"]
                                }
                            }
                        ]
                    }]
                }),
            }
        );

        const data = await response.json();
        if (!response.ok || !data.candidates) {
            console.error("API error:", JSON.stringify(data, null, 2));
            throw new Error("API error");
        }

        const candidate = data.candidates[0];
        const parts = candidate.content.parts;
        const toolCall = parts.find((p: any) => p.functionCall);

        if (!toolCall) {
            return parts.map((p: any) => p.text).join("");
        }

        const { name, args } = toolCall.functionCall;
        const toolResult = executeTool(name, args);

        messages.push({ role: "model", parts });
        messages.push({ role: "user", parts: [{ functionResponse: { name, response: { result: toolResult } } }] });
    }
};

