import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const strings = JSON.parse(readFileSync(join(root, "scripts/build/nocicord-strings.json"), "utf8"));
const output = join(root, "src/nocicord/ptBRTranslations.json");
const translated = existsSync(output) ? JSON.parse(readFileSync(output, "utf8")) : {};
const pending = strings.filter(value => !translated[value]);
let current = 0;
let completed = 0;

async function translate(value) {
    const url = new URL("https://translate.googleapis.com/translate_a/single");
    url.search = new URLSearchParams({ client: "gtx", sl: "en", tl: "pt-BR", dt: "t", q: value }).toString();
    for (let attempt = 0; attempt < 3; attempt++) {
        try {
            const response = await fetch(url, { signal: AbortSignal.timeout(15000) });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const data = await response.json();
            const result = data[0].map(item => item[0]).join("").trim();
            if (result) return result;
        } catch (error) {
            if (attempt === 2) console.error(`Could not translate: ${value.slice(0, 60)}: ${error}`);
        }
    }
    return null;
}

async function worker() {
    while (current < pending.length) {
        const value = pending[current++];
        const result = await translate(value);
        if (result) translated[value] = result;
        completed++;
        if (completed % 25 === 0 || completed === pending.length) {
            writeFileSync(output, JSON.stringify(translated, null, 2) + "\n");
            console.log(`${completed}/${pending.length} translated`);
        }
    }
}

await Promise.all(Array.from({ length: 8 }, worker));
writeFileSync(output, JSON.stringify(translated, null, 2) + "\n");
console.log(`${Object.keys(translated).length}/${strings.length} strings available in Portuguese`);
