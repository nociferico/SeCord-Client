import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import ts from "typescript";

const root = join(process.cwd(), "src", "plugins");
const strings = new Set();

function visitFile(path) {
    const source = ts.createSourceFile(path, readFileSync(path, "utf8"), ts.ScriptTarget.Latest, true);
    const visit = node => {
        if (ts.isPropertyAssignment(node)) {
            const key = node.name.getText(source).replaceAll(/["']/g, "");
            if (["description", "displayName", "label", "placeholder"].includes(key) && ts.isStringLiteral(node.initializer)) {
                const value = node.initializer.text.trim();
                if (value.length > 3 && /[a-z]/i.test(value) && !value.includes("$")) strings.add(value);
            }
        }
        ts.forEachChild(node, visit);
    };
    visit(source);
}

function walk(path) {
    for (const entry of readdirSync(path, { withFileTypes: true })) {
        const full = join(path, entry.name);
        if (entry.isDirectory()) walk(full);
        else if (/\.[jt]sx?$/.test(entry.name)) visitFile(full);
    }
}

walk(root);
const sorted = [...strings].sort((a, b) => a.localeCompare(b));
const output = join(process.cwd(), "scripts", "build", "nocicord-strings.json");
writeFileSync(output, JSON.stringify(sorted, null, 2) + "\n");
console.log(`${sorted.length} plugin strings extracted to ${relative(process.cwd(), output)}`);
