import fs from 'node:fs';

fs.rmSync(new URL('../dist', import.meta.url), { force: true, recursive: true });
await import('./generate-typescript-stub.mjs');
