import { execSync } from 'node:child_process';

import type { PackageManager } from '../types.js';

export function getInstallCommand(pm: PackageManager, packages: string[]): string {
  const pkgList = packages.join(' ');
  switch (pm) {
    case 'npm': {
      return `npm install -D ${pkgList}`;
    }
    case 'yarn': {
      return `yarn add -D ${pkgList}`;
    }
    case 'pnpm': {
      return `pnpm add -D ${pkgList}`;
    }
    case 'bun': {
      return `bun add -D ${pkgList}`;
    }
  }
}

export function installDependencies(
  pm: PackageManager,
  packages: string[],
  cwd: string,
): { success: boolean; error?: string } {
  const command = getInstallCommand(pm, packages);
  try {
    execSync(command, {
      cwd,
      // Let the user see install progress in real time
      stdio: 'inherit',
    });
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { success: false, error: message };
  }
}
