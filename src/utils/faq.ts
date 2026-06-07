import Faq from '../data/faq.md';

function loadFaqChunks(): string[] {
    return Faq.split('##').map((chunk:string) => chunk.trim()).filter((chunk: string) => chunk.length > 0);
}

export function retrieveChunks(userMessage: string, topN: number = 3): string[] {
    const words = userMessage.toLowerCase().split(/\s+/);
    
    return loadFaqChunks()
        .map((chunk: string) => ({
            chunk,
            score: words.filter(word =>chunk.toLowerCase().includes(word)).length
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, topN)
        .map(({ chunk }) => chunk);
}