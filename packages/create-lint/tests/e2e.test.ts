import { execSync, spawnSync } from 'node:child_process';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const packageRoot = path.resolve(__dirname, '..');
const distEntry = path.join(packageRoot, 'dist', 'index.js');

describe('create-lobe-lint E2E', () => {
  let tmpDir: string;

  beforeAll(() => {
    execSync('pnpm build', {
      cwd: packageRoot,
      stdio: 'pipe',
    });
  });

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'create-lobe-lint-e2e-'));
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
  });

  afterEach(async () => {
    await fs.rm(tmpDir, { recursive: true, force: true });
  });

  it('runs preset in a temp project and generates files', async () => {
    const res = spawnSync(process.execPath, [distEntry, '--preset', '-y', '--no-install'], {
      cwd: tmpDir,
      encoding: 'utf8',
      env: { ...process.env, CI: '1', NO_COLOR: '1' },
    });

    expect(res.status).toBe(0);

    const eslintConfig = await fs.readFile(path.join(tmpDir, 'eslint.config.mjs'), 'utf8');
    expect(eslintConfig).toContain("import { defineConfig } from '@lobehub/eslint-config';");
  });

  it('respects --no-git-hooks (does not modify package.json)', async () => {
    const res = spawnSync(
      process.execPath,
      [distEntry, '--preset', '-y', '--no-install', '--no-git-hooks'],
      {
        cwd: tmpDir,
        encoding: 'utf8',
        env: { ...process.env, CI: '1', NO_COLOR: '1' },
      },
    );

    expect(res.status).toBe(0);

    const pkg = JSON.parse(await fs.readFile(path.join(tmpDir, 'package.json'), 'utf8')) as Record<
      string,
      any
    >;

    expect(pkg['lint-staged']).toBeUndefined();
    expect(pkg['simple-git-hooks']).toBeUndefined();
  });
});
