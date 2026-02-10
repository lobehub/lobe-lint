import fs from 'node:fs/promises';
import path from 'node:path';

const distDir = path.resolve('dist');
const srcTypegen = path.resolve('src/eslint-typegen.d.ts');
const distTypegen = path.resolve('dist/eslint-typegen.d.ts');

const referenceLine = '/// <reference path="./eslint-typegen.d.ts" />\n';

async function prependReferenceIfNeeded(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    if (content.startsWith(referenceLine)) return;
    await fs.writeFile(filePath, referenceLine + content, 'utf8');
  } catch {
    // ignore missing files
  }
}

await fs.mkdir(distDir, { recursive: true });
await fs.copyFile(srcTypegen, distTypegen);

await prependReferenceIfNeeded(path.resolve('dist/index.d.ts'));
await prependReferenceIfNeeded(path.resolve('dist/index.d.cts'));
