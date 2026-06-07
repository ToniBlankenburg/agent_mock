
import {readFileSync} from 'fs';

function loadFaqChunks(): string[] {
    return Faq.split('##').map((chunk:string) => chunk.trim()).filter((chunk: string) => chunk.length > 0);
}

function loadFaq(): string {
    return readFileSync('./src/data/faq.md', 'utf-8');
}

const Faq = loadFaq();

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