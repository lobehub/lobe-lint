import { readFile, writeFile } from 'node:fs/promises';

// Only readFile is used, writeFile should be flagged
export async function read() {
  return readFile('test.txt', 'utf8');
}
