import { type ConfigTool, type GeneratorContext, type PackageManager } from '../types.js';

export interface GitHooksConfig {
  lintStaged: Record<string, string[]>;
  simpleGitHooks: Record<string, string>;
}

const LINT_STAGED_RULES: Record<ConfigTool, { pattern: string; commands: string[] } | null> = {
  'commitlint': null,
  'eslint': { pattern: '*.{js,jsx,ts,tsx,yml,yaml}', commands: ['eslint --fix'] },
  'prettier': { pattern: '*', commands: ['prettier --write --ignore-unknown'] },
  'remarklint': { pattern: '*.md', commands: ['remark --quiet --output --'] },
  'semantic-release': null,
  'stylelint': { pattern: '*.{css,less,scss}', commands: ['stylelint --fix'] },
};

function getLintStagedRunner(pm: PackageManager): string {
  const runners: Record<PackageManager, string> = {
    bun: 'bun run lint-staged',
    npm: 'npx lint-staged',
    pnpm: 'pnpm lint-staged',
    yarn: 'yarn lint-staged',
  };
  return runners[pm];
}

export function generateGitHooksConfig(ctx: GeneratorContext): GitHooksConfig {
  const { projectInfo, selections } = ctx;
  const lintStaged: Record<string, string[]> = {};

  for (const tool of selections.tools) {
    const rule = LINT_STAGED_RULES[tool];
    if (rule) {
      if (!lintStaged[rule.pattern]) {
        lintStaged[rule.pattern] = [];
      }
      lintStaged[rule.pattern].push(...rule.commands);
    }
  }

  const simpleGitHooks: Record<string, string> = {};

  if (Object.keys(lintStaged).length > 0) {
    simpleGitHooks['pre-commit'] = getLintStagedRunner(projectInfo.packageManager);
  }

  if (selections.tools.includes('commitlint')) {
    simpleGitHooks['commit-msg'] = 'npx --no -- commitlint --edit $1';
  }

  return { lintStaged, simpleGitHooks };
}

export function getGitHooksDependencies(ctx: GeneratorContext): string[] {
  const deps: string[] = [];
  const config = generateGitHooksConfig(ctx);

  if (Object.keys(config.lintStaged).length > 0) deps.push('lint-staged');
  if (Object.keys(config.simpleGitHooks).length > 0) deps.push('simple-git-hooks');

  return deps;
}
