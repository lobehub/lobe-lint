import fs from 'node:fs';
import path from 'node:path';

import { type GeneratorContext } from '../types.js';

const BASE_EXCLUSION_RULES = [
  'perfectionist/sort-enums',
  'perfectionist/sort-interfaces',
  'simple-import-sort/imports',
  'simple-import-sort/exports',
];

const REACT_EXCLUSION_RULES = ['react/jsx-sort-props'];

const OPTIONAL_UNUSED_IMPORTS_RULE = 'unused-imports/no-unused-imports';

export function getExclusionRules(ctx: GeneratorContext): string[] {
  const rules = [...BASE_EXCLUSION_RULES];

  if (ctx.selections.excludeUnusedImportsAutofix) {
    rules.push(OPTIONAL_UNUSED_IMPORTS_RULE);
  }

  if (ctx.selections.reactFramework !== false) {
    rules.push(...REACT_EXCLUSION_RULES);
  }

  return rules;
}

export function generateVscodeSettings(ctx: GeneratorContext): Record<string, unknown> {
  const rules = getExclusionRules(ctx);

  return {
    'eslint.codeActionsOnSave.rules': ['*', ...rules.map((r) => `!${r}`)],
    'eslint.rules.customizations': rules.map((rule) => ({ rule, severity: 'info' })),
  };
}

export interface VscodeWriteResult {
  conflict: boolean;
  written: boolean;
}

export function readExistingVscodeSettings(cwd: string): Record<string, unknown> | null {
  const settingsPath = path.join(cwd, '.vscode', 'settings.json');
  if (!fs.existsSync(settingsPath)) {
    return null;
  }
  try {
    return JSON.parse(fs.readFileSync(settingsPath, 'utf8')) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function hasConflictingKeys(existing: Record<string, unknown>): boolean {
  return 'eslint.codeActionsOnSave.rules' in existing || 'eslint.rules.customizations' in existing;
}

export function writeVscodeSettings(
  cwd: string,
  ctx: GeneratorContext,
  overwrite = false,
): VscodeWriteResult {
  const existing = readExistingVscodeSettings(cwd);
  const newSettings = generateVscodeSettings(ctx);

  if (existing !== null && hasConflictingKeys(existing) && !overwrite) {
    return { written: false, conflict: true };
  }

  const merged = { ...existing, ...newSettings };

  const vscodeDirPath = path.join(cwd, '.vscode');
  if (!fs.existsSync(vscodeDirPath)) {
    fs.mkdirSync(vscodeDirPath, { recursive: true });
  }

  const settingsPath = path.join(vscodeDirPath, 'settings.json');
  fs.writeFileSync(settingsPath, JSON.stringify(merged, null, 2) + '\n', 'utf8');

  return { written: true, conflict: false };
}
