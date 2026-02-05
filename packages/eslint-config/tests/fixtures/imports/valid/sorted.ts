import { readFile } from 'node:fs/promises';
import path from 'node:path';

import lodash from 'lodash';

const filePath = path.join(__dirname, 'test.txt');

export async function readTestFile() {
  const content = await readFile(filePath, 'utf8');
  return lodash.trim(content);
}
