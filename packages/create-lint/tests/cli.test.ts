import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { run } from '../src/cli.js';

const readJson = async (filePath: string) =>
  JSON.parse(await fs.readFile(filePath, 'utf8')) as Record<string, any>;

describe('create-lobe-lint CLI', () => {
  let tmpDir: string;
  let originalCwd: string;

  beforeEach(async () => {
    originalCwd = process.cwd();
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'create-lobe-lint-'));

    await fs.writeFile(
      path.join(tmpDir, 'package.json'),
      JSON.stringify(
        {
          name: 'fixture-project',
          private: true,
          version: '0.0.0',
          dependencies: { react: '^18.0.0' },
        },
        null,
        2,
      ) + '\n',
      'utf8',
    );
    await fs.writeFile(path.join(tmpDir, 'pnpm-lock.yaml'), '', 'utf8');
    await fs.writeFile(path.join(tmpDir, 'tsconfig.json'), '{}\n', 'utf8');

    process.chdir(tmpDir);
  });

  afterEach(async () => {
    process.chdir(originalCwd);
    await fs.rm(tmpDir, { recursive: true, force: true });
  });

  it('generates preset configs and git hooks (no install)', async () => {
    await run({ preset: true, yes: true, install: false });

    const eslintConfig = await fs.readFile(path.join(tmpDir, 'eslint.config.mjs'), 'utf8');
    expect(eslintConfig).toContain("import { defineConfig } from '@lobehub/eslint-config';");
    expect(eslintConfig).toContain('react: true');
    expect(eslintConfig).toContain('typescript: true');

    const prettierConfig = await fs.readFile(path.join(tmpDir, 'prettier.config.mjs'), 'utf8');
    expect(prettierConfig).toContain("import config from '@lobehub/prettier-config';");

    const stylelintConfig = await fs.readFile(path.join(tmpDir, 'stylelint.config.mjs'), 'utf8');
    expect(stylelintConfig).toContain("import config from '@lobehub/stylelint-config';");

    const commitlintConfig = await fs.readFile(path.join(tmpDir, 'commitlint.config.mjs'), 'utf8');
    expect(commitlintConfig).toContain("import config from '@lobehub/commitlint-config';");

    const pkg = await readJson(path.join(tmpDir, 'package.json'));

    expect(pkg['lint-staged']).toEqual({
      '*.{js,jsx,ts,tsx}': ['eslint --fix'],
      '*': ['prettier --write --ignore-unknown'],
      '*.{css,less,scss}': ['stylelint --fix'],
    });
    expect(pkg['simple-git-hooks']).toEqual({
      'pre-commit': 'pnpm lint-staged',
      'commit-msg': 'npx --no -- commitlint --edit $1',
    });
  });
});
