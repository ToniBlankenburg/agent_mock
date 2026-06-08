
import {readFileSync} from 'fs';
import {resolve} from 'path';

const FAQ_CHUNKS = readFileSync(resolve(__dirname, '../data/faq.md'), 'utf-8')
    .split('##').map((chunk:string) => chunk.trim()).filter((chunk: string) => chunk.length > 0);


export function retrieveChunks(userMessage: string, topN: number = 3): string[] {
    const words = userMessage.toLowerCase().split(/\s+/);
    
    return FAQ_CHUNKS
        .map((chunk: string) => ({
            chunk,
            score: words.filter(word =>chunk.toLowerCase().includes(word)).length
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, topN)
        .map(({ chunk }) => chunk);
}