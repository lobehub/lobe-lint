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
      '*.{js,jsx,ts,tsx,yml,yaml}': ['eslint --fix'],
      '*': ['prettier --write --ignore-unknown'],
      '*.{css,less,scss}': ['stylelint --fix'],
    });
    expect(pkg['simple-git-hooks']).toEqual({
      'pre-commit': 'pnpm lint-staged',
      'commit-msg': 'npx --no -- commitlint --edit $1',
    });
  });

  it('generates preset configs with vscode settings (--yes includes vscode)', async () => {
    await run({ preset: true, yes: true, install: false });

    const settings = await readJson(path.join(tmpDir, '.vscode', 'settings.json'));

    expect(settings['eslint.codeActionsOnSave.rules']).toContain('*');
    expect(settings['eslint.codeActionsOnSave.rules']).toContain('!perfectionist/sort-enums');
    expect(settings['eslint.codeActionsOnSave.rules']).toContain('!simple-import-sort/imports');
    expect(settings['eslint.codeActionsOnSave.rules']).toContain(
      '!unused-imports/no-unused-imports',
    );
    expect(settings['eslint.codeActionsOnSave.rules']).toContain('!react/jsx-sort-props');

    expect(settings['eslint.rules.customizations']).toEqual(
      expect.arrayContaining([
        { rule: 'perfectionist/sort-enums', severity: 'info' },
        { rule: 'react/jsx-sort-props', severity: 'info' },
      ]),
    );
  });

  it('--vscode generates correct settings.json', async () => {
    await run({ eslint: true, vscode: true, yes: true, install: false });

    const settings = await readJson(path.join(tmpDir, '.vscode', 'settings.json'));

    expect(settings['eslint.codeActionsOnSave.rules']).toBeDefined();
    expect(settings['eslint.codeActionsOnSave.rules'][0]).toBe('*');
    expect(settings['eslint.rules.customizations']).toBeDefined();
    expect(settings['eslint.rules.customizations'].length).toBeGreaterThan(0);
  });

  it('--no-vscode does not generate .vscode/settings.json', async () => {
    await run({ preset: true, yes: true, install: false, vscode: false });

    const settingsExists = await fs
      .access(path.join(tmpDir, '.vscode', 'settings.json'))
      .then(() => true)
      .catch(() => false);

    expect(settingsExists).toBe(false);
  });

  it('merges with existing .vscode/settings.json without losing original settings', async () => {
    await fs.mkdir(path.join(tmpDir, '.vscode'), { recursive: true });
    await fs.writeFile(
      path.join(tmpDir, '.vscode', 'settings.json'),
      JSON.stringify({ 'editor.fontSize': 14, 'editor.tabSize': 2 }, null, 2) + '\n',
      'utf8',
    );

    await run({ eslint: true, vscode: true, yes: true, install: false });

    const settings = await readJson(path.join(tmpDir, '.vscode', 'settings.json'));

    expect(settings['editor.fontSize']).toBe(14);
    expect(settings['editor.tabSize']).toBe(2);
    expect(settings['eslint.codeActionsOnSave.rules']).toBeDefined();
    expect(settings['eslint.rules.customizations']).toBeDefined();
  });

  it('does not include react/jsx-sort-props when react is disabled', async () => {
    await fs.writeFile(
      path.join(tmpDir, 'package.json'),
      JSON.stringify({ name: 'fixture-project', private: true, version: '0.0.0' }, null, 2) + '\n',
      'utf8',
    );

    await run({
      eslint: true,
      react: 'false',
      vscode: true,
      yes: true,
      install: false,
    });

    const settings = await readJson(path.join(tmpDir, '.vscode', 'settings.json'));

    expect(settings['eslint.codeActionsOnSave.rules']).not.toContain('!react/jsx-sort-props');

    const ruleNames = (settings['eslint.rules.customizations'] as Array<{ rule: string }>).map(
      (r) => r.rule,
    );
    expect(ruleNames).not.toContain('react/jsx-sort-props');
  });

  it('overwrites conflicting keys in existing settings when --vscode is explicit', async () => {
    await fs.mkdir(path.join(tmpDir, '.vscode'), { recursive: true });
    await fs.writeFile(
      path.join(tmpDir, '.vscode', 'settings.json'),
      JSON.stringify(
        {
          'editor.fontSize': 14,
          'eslint.codeActionsOnSave.rules': ['old-rule'],
          'eslint.rules.customizations': [{ rule: 'old', severity: 'warn' }],
        },
        null,
        2,
      ) + '\n',
      'utf8',
    );

    await run({ eslint: true, vscode: true, yes: true, install: false });

    const settings = await readJson(path.join(tmpDir, '.vscode', 'settings.json'));

    expect(settings['editor.fontSize']).toBe(14);
    expect(settings['eslint.codeActionsOnSave.rules']).toContain('*');
    expect(settings['eslint.codeActionsOnSave.rules']).not.toContain('old-rule');
  });
});
