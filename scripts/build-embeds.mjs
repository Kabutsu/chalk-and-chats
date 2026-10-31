import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';

const srcDir = new URL('../embeds/css/', import.meta.url);
const outDir = new URL('../embeds/dist/', import.meta.url);

const files = (await readdir(srcDir)).filter((f) => f.endsWith('.css')).sort();
const parts = await Promise.all(files.map((f) => readFile(new URL(f, srcDir), 'utf8')));

await mkdir(outDir, { recursive: true });
await writeFile(new URL('global.css', outDir), parts.join('\n'));
console.log(`Built embeds/dist/global.css from ${files.length} file(s)`);
