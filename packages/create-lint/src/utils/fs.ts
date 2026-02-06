import fs from 'node:fs';
import path from 'node:path';

import { type GeneratedFile } from '../types.js';

export function writeFiles(cwd: string, files: GeneratedFile[]): void {
  for (const file of files) {
    const filePath = path.join(cwd, file.path);
    fs.writeFileSync(filePath, file.content, 'utf8');
  }
}

export function fileExists(cwd: string, filename: string): boolean {
  return fs.existsSync(path.join(cwd, filename));
}
