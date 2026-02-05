import fs from 'node:fs';
import path from 'node:path';

export function readPackageJson(cwd: string): Record<string, unknown> | null {
  const pkgPath = path.join(cwd, 'package.json');
  if (!fs.existsSync(pkgPath)) return null;
  try {
    return JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  } catch {
    return null;
  }
}

export function updatePackageJson(
  cwd: string,
  modifications: {
    lintStaged?: Record<string, string[]>;
    simpleGitHooks?: Record<string, string>;
  },
): boolean {
  const pkg = readPackageJson(cwd);
  if (!pkg) return false;

  if (modifications.lintStaged && Object.keys(modifications.lintStaged).length > 0) {
    pkg['lint-staged'] = modifications.lintStaged;
  }
  if (modifications.simpleGitHooks && Object.keys(modifications.simpleGitHooks).length > 0) {
    pkg['simple-git-hooks'] = modifications.simpleGitHooks;
  }

  fs.writeFileSync(path.join(cwd, 'package.json'), JSON.stringify(pkg, null, 2) + '\n', 'utf8');
  return true;
}

export function hasExistingGitHooksConfig(cwd: string): {
  hasHusky: boolean;
  hasLintStaged: boolean;
  hasSimpleGitHooks: boolean;
} {
  const pkg = readPackageJson(cwd);
  return {
    hasHusky: fs.existsSync(path.join(cwd, '.husky')),
    hasLintStaged: pkg ? 'lint-staged' in pkg : false,
    hasSimpleGitHooks: pkg ? 'simple-git-hooks' in pkg : false,
  };
}
