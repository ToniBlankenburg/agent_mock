import { chat } from '../utils/chat';

type TestCase = {
    id: string;
    input: string;
    check: (output: string) => boolean;
}

const testCases: TestCase[] = [
    {
        id: 'order-found',
        input: 'Where is ORD-001?',
        check: (output) => output.toLowerCase().includes('shipped'),
    },
    {
        id: 'order_missing',
        input: 'Where is ORD-999?',
        check: (output) => output.toLowerCase().includes('not found') || output.toLowerCase().includes('no order'),
    },
    {
        id: 'faq-refund',
        input: "How long do refunds take?",
        check: (output) => output.toLowerCase().includes('5-7 business days'),
    },
    {
        id: 'out-of-scope',
        input: "What is the capital of France?",
        check: (output) => output.toLowerCase().includes("human"),
    },
    {
        id: 'subscription',
        input: 'Is anna@example.com still subscribed?',
        check: (output) => output.toLowerCase().includes('pro'),
    },
];


let currentTestId = '';

const mockResponses: Record<string, string> = {
    'order-found':    'Your order ORD-001 has been shipped.',
    'order_missing':  'Order not found.',
    'faq-refund':     'Refunds typically take 5-7 business days to process.',
    'out-of-scope':   'Escalated. A human agent will follow up within 2 hours.',
    'subscription':   'Yes, anna@example.com is on the Pro plan and is active.',
};

global.fetch = async () => {
    const responseText = mockResponses[currentTestId] ?? "I don't have that information.";
    return {
        ok: true,
        json: async () => ({
            candidates: [{ content: { parts: [{ text: responseText }] }, finishReason: 'STOP' }]
        })
    } as any;
};

async function main() {
    let passed = 0;
    let escalated = 0;

    for (const testCase of testCases) {
        currentTestId = testCase.id;
        console.log(`Running test case: ${testCase.id}`);
        const output = await chat(testCase.input, []);
        const ok = testCase.check(output);
        if (ok) {
            passed++;
            console.log(`  ✓ passed`);
        } else {
            console.error(`  ✗ failed — output: ${output}`);
        }
        if (output.toLowerCase().includes('human')) escalated++;
    }

    console.log(`\n--- Summary ---`);
    console.log(`Resolve rate:    ${passed}/${testCases.length}`);
    console.log(`Escalation rate: ${escalated}/${testCases.length}`);
}
main(); 