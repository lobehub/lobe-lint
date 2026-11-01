import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { type OxlintConfig } from 'oxlint';

export const PACKAGE_ROOT = path.resolve(__dirname, '..');
export const FIXTURES = path.resolve(PACKAGE_ROOT, '../eslint-config/tests/fixtures');
const OXLINT = path.join(PACKAGE_ROOT, 'node_modules/.bin/oxlint');
const BLOCK_DEPS = path.join(__dirname, 'block-deps.mjs');

export interface Diagnostic {
  code?: string;
  filename: string;
  message: string;
  severity: 'error' | 'warning';
}

export function lint(
  config: OxlintConfig,
  files: string[],
  { blockDeps = true, sources }: { blockDeps?: boolean; sources?: Record<string, string> } = {},
) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'oxlint-config-test-'));
  try {
    if (sources) {
      for (const [file, content] of Object.entries(sources)) {
        fs.mkdirSync(path.dirname(path.join(dir, 'fixtures', file)), { recursive: true });
        fs.writeFileSync(path.join(dir, 'fixtures', file), content);
      }
    } else {
      fs.symlinkSync(FIXTURES, path.join(dir, 'fixtures'));
    }
    fs.writeFileSync(path.join(dir, '.oxlintrc.json'), JSON.stringify(config));

    const result = spawnSync(
      OXLINT,
      ['-c', '.oxlintrc.json', '-f', 'json', ...files.map((file) => path.join('fixtures', file))],
      {
        cwd: dir,
        encoding: 'utf8',
        env: blockDeps ? { ...process.env, NODE_OPTIONS: `--import ${BLOCK_DEPS}` } : process.env,
        maxBuffer: 1 << 28,
      },
    );
    if (!result.stdout.startsWith('{')) {
      throw new Error(`oxlint failed:\n${result.stdout}${result.stderr}`);
    }
    const output = JSON.parse(result.stdout) as {
      diagnostics: Diagnostic[];
      number_of_files: number;
    };
    return {
      diagnostics: output.diagnostics.map((d) => ({
        ...d,
        filename: d.filename.replace(/^fixtures\//, ''),
      })),
      files: output.number_of_files,
    };
  } finally {
    fs.rmSync(dir, { force: true, recursive: true });
  }
}

export const pluginErrors = (diagnostics: Diagnostic[]) =>
  diagnostics.filter((d) => /Error running JS plugin|@lobehub\/oxlint-config\]/.test(d.message));
