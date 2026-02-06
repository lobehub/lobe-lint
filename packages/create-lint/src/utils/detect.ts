import fs from 'node:fs';
import path from 'node:path';

import { LOCKS } from 'package-manager-detector';

import { EXISTING_CONFIG_PATTERNS, REACT_FRAMEWORKS } from '../constants.js';
import {
  type ConfigTool,
  type PackageManager,
  type ProjectInfo,
  type ReactFramework,
} from '../types.js';

export function detectPackageManager(cwd: string): PackageManager {
  for (const [lockfile, agent] of Object.entries(LOCKS)) {
    if (fs.existsSync(path.join(cwd, lockfile))) {
      return agent as PackageManager;
    }
  }
  return 'npm';
}

export function detectTypeScript(cwd: string): boolean {
  return (
    fs.existsSync(path.join(cwd, 'tsconfig.json')) ||
    fs.existsSync(path.join(cwd, 'tsconfig.base.json'))
  );
}

export function detectReactFramework(cwd: string): ReactFramework {
  const pkgPath = path.join(cwd, 'package.json');
  if (!fs.existsSync(pkgPath)) {
    return false;
  }

  try {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    const allDeps = {
      ...pkg.dependencies,
      ...pkg.devDependencies,
    };

    if (allDeps['next']) {
      return 'next';
    }
    if (allDeps['@remix-run/react'] || allDeps['remix']) {
      return 'remix';
    }
    if (allDeps['expo']) {
      return 'expo';
    }
    if (allDeps['vite'] && allDeps['react']) {
      return 'vite';
    }
    if (allDeps['react']) {
      return true;
    }
  } catch {
    // ignore parse errors
  }

  return false;
}

export function detectExistingConfigs(cwd: string): ConfigTool[] {
  const existing: ConfigTool[] = [];

  for (const [tool, patterns] of Object.entries(EXISTING_CONFIG_PATTERNS)) {
    for (const pattern of patterns) {
      if (fs.existsSync(path.join(cwd, pattern))) {
        existing.push(tool as ConfigTool);
        break;
      }
    }
  }

  return existing;
}

export function getProjectName(cwd: string): string {
  const pkgPath = path.join(cwd, 'package.json');
  if (fs.existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
      if (pkg.name) {
        return pkg.name;
      }
    } catch {
      // ignore
    }
  }
  return path.basename(cwd);
}

export function detectProject(cwd: string): ProjectInfo {
  const reactFramework = detectReactFramework(cwd);
  return {
    name: getProjectName(cwd),
    packageManager: detectPackageManager(cwd),
    hasTypeScript: detectTypeScript(cwd),
    hasReact: reactFramework !== false,
    reactFramework,
    existingConfigs: detectExistingConfigs(cwd),
  };
}

export function parseReactFramework(value: string | undefined): ReactFramework {
  if (!value || value === 'false') {
    return false;
  }
  if (value === 'true') {
    return true;
  }
  if (REACT_FRAMEWORKS.includes(value as (typeof REACT_FRAMEWORKS)[number])) {
    return value as ReactFramework;
  }
  return true;
}
