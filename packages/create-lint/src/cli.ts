/* eslint-disable unicorn/no-process-exit */
import { execSync } from 'node:child_process';

import * as p from '@clack/prompts';
import pc from 'picocolors';

import { ALL_TOOLS, CONFIG_META, PRESET_TOOLS } from './constants.js';
import {
  generateConfigs,
  generateGitHooksConfig,
  getDependencies,
  getGitHooksDependencies,
} from './generators/index.js';
import type {
  CliOptions,
  ConfigTool,
  GeneratorContext,
  ReactFramework,
  UserSelections,
} from './types.js';
import {
  detectProject,
  getInstallCommand,
  hasExistingGitHooksConfig,
  installDependencies,
  parseReactFramework,
  updatePackageJson,
  writeFiles,
} from './utils/index.js';

export async function run(options: CliOptions): Promise<void> {
  const cwd = process.cwd();

  p.intro(pc.bgCyan(pc.black(' create-lobe-lint ')));

  if (options.help) {
    printHelp();
    return;
  }

  const projectInfo = detectProject(cwd);

  p.note(
    [
      `${pc.dim('Project:')} ${pc.cyan(projectInfo.name)}`,
      `${pc.dim('Package Manager:')} ${pc.cyan(projectInfo.packageManager)}`,
      `${pc.dim('TypeScript:')} ${pc.cyan(projectInfo.hasTypeScript ? 'Yes' : 'No')}`,
      `${pc.dim('React Framework:')} ${pc.cyan(formatReactFramework(projectInfo.reactFramework))}`,
      projectInfo.existingConfigs.length > 0
        ? `${pc.dim('Existing configs:')} ${pc.yellow(projectInfo.existingConfigs.join(', '))}`
        : null,
    ]
      .filter(Boolean)
      .join('\n'),
    'Detected Project',
  );

  let selections: UserSelections;

  if (hasToolFlags(options)) {
    selections = getSelectionsFromFlags(options, projectInfo.reactFramework);
  } else if (options.preset) {
    selections = await getPresetSelections(options, projectInfo.reactFramework);
  } else if (options.manual) {
    selections = await getManualSelections(options, projectInfo.reactFramework);
  } else {
    const mode = await p.select({
      message: 'How would you like to setup?',
      options: [
        {
          value: 'preset',
          label: 'Preset (Recommended)',
          hint: 'ESLint, Prettier, Stylelint, Commitlint',
        },
        { value: 'manual', label: 'Manual', hint: 'Choose individual tools' },
      ],
    });

    if (p.isCancel(mode)) {
      p.cancel('Operation cancelled.');
      process.exit(0);
    }

    if (mode === 'preset') {
      selections = await getPresetSelections(options, projectInfo.reactFramework);
    } else {
      selections = await getManualSelections(options, projectInfo.reactFramework);
    }
  }

  if (selections.tools.length === 0) {
    p.cancel('No tools selected.');
    process.exit(0);
  }

  // Ask about git hooks configuration
  selections.configureGitHooks = await askGitHooksConfiguration(options, selections);

  const ctx: GeneratorContext = {
    cwd,
    projectInfo,
    selections,
  };

  const files = generateConfigs(ctx);
  const deps = getDependencies(ctx);

  // Add git hooks dependencies if configured
  if (selections.configureGitHooks) {
    deps.push(...getGitHooksDependencies(ctx));
  }

  const existingConfigsToOverwrite = selections.tools.filter((t) =>
    projectInfo.existingConfigs.includes(t),
  );

  if (existingConfigsToOverwrite.length > 0 && !options.yes) {
    const shouldOverwrite = await p.confirm({
      message: `Overwrite existing configs? (${existingConfigsToOverwrite.join(', ')})`,
      initialValue: false,
    });

    if (p.isCancel(shouldOverwrite) || !shouldOverwrite) {
      p.cancel('Operation cancelled.');
      process.exit(0);
    }
  }

  const s = p.spinner();
  s.start('Generating configuration files...');

  writeFiles(cwd, files);

  // Generate git hooks configuration
  let gitHooksConfigured = false;
  if (selections.configureGitHooks) {
    const gitHooksConfig = generateGitHooksConfig(ctx);
    const updated = updatePackageJson(cwd, gitHooksConfig);
    if (updated) {
      gitHooksConfigured = true;
    }
  }

  s.stop(`Generated ${files.length} config files`);

  for (const file of files) {
    p.log.success(`${pc.green('+')} ${file.path}`);
  }

  if (gitHooksConfigured) {
    p.log.success(`${pc.green('+')} package.json (lint-staged, simple-git-hooks)`);
  }

  p.note(deps.map((d) => `${pc.green('+')} ${d}`).join('\n'), 'Dependencies to install');

  let shouldInstall = options.install ?? true;

  if (options.install === undefined && !options.yes) {
    const confirmInstall = await p.confirm({
      message: 'Install dependencies?',
      initialValue: true,
    });

    if (p.isCancel(confirmInstall)) {
      shouldInstall = false;
    } else {
      shouldInstall = confirmInstall;
    }
  }

  if (shouldInstall) {
    // Don't hide the actual install logs behind a spinner.
    // Show the command and stream output to the current terminal.
    const installCommand = getInstallCommand(projectInfo.packageManager, deps);
    p.log.info(`Running: ${pc.cyan(installCommand)}`);

    const result = installDependencies(projectInfo.packageManager, deps, cwd);

    if (result.success) {
      p.log.success('Dependencies installed');

      // Initialize git hooks after dependencies are installed
      if (gitHooksConfigured) {
        try {
          p.log.info(`Running: ${pc.cyan('npx simple-git-hooks')}`);
          execSync('npx simple-git-hooks', { cwd, stdio: 'inherit' });
          p.log.success('Git hooks initialized');
        } catch {
          p.log.warn('Failed to initialize git hooks. Run manually: npx simple-git-hooks');
        }
      }
    } else {
      p.log.error('Failed to install dependencies');
      p.log.error(result.error || 'Unknown error');
      p.log.info(
        `Run manually: ${pc.cyan(getInstallCommandHint(projectInfo.packageManager, deps))}`,
      );
    }
  } else {
    p.log.info(`Run: ${pc.cyan(getInstallCommandHint(projectInfo.packageManager, deps))}`);
    if (gitHooksConfigured) {
      p.log.info(`After installing, run: ${pc.cyan('npx simple-git-hooks')}`);
    }
  }

  p.outro(pc.green('Done! Happy linting!'));
}

function hasToolFlags(options: CliOptions): boolean {
  return Boolean(
    options.eslint ||
    options.prettier ||
    options.stylelint ||
    options.commitlint ||
    options.remarklint ||
    options.semanticRelease,
  );
}

function getSelectionsFromFlags(
  options: CliOptions,
  detectedFramework: ReactFramework,
): UserSelections {
  const tools: ConfigTool[] = [];

  if (options.eslint) tools.push('eslint');
  if (options.prettier) tools.push('prettier');
  if (options.stylelint) tools.push('stylelint');
  if (options.commitlint) tools.push('commitlint');
  if (options.remarklint) tools.push('remarklint');
  if (options.semanticRelease) tools.push('semantic-release');

  const reactFramework =
    options.react !== undefined ? parseReactFramework(options.react) : detectedFramework;

  return {
    configureGitHooks: false,
    installDeps: options.install ?? true,
    reactFramework,
    tools,
  };
}

async function getPresetSelections(
  options: CliOptions,
  detectedFramework: ReactFramework,
): Promise<UserSelections> {
  let reactFramework = detectedFramework;

  if (options.react !== undefined) {
    reactFramework = parseReactFramework(options.react);
  } else if (detectedFramework !== false && !options.yes) {
    const selectedFramework = await selectReactFramework(detectedFramework);
    if (selectedFramework !== null) {
      reactFramework = selectedFramework;
    }
  }

  return {
    configureGitHooks: false,
    installDeps: options.install ?? true,
    reactFramework,
    tools: [...PRESET_TOOLS],
  };
}

async function getManualSelections(
  options: CliOptions,
  detectedFramework: ReactFramework,
): Promise<UserSelections> {
  const selectedTools = await p.multiselect({
    message: 'Select tools to configure:',
    options: ALL_TOOLS.map((tool) => ({
      value: tool,
      label: CONFIG_META[tool].displayName,
      hint: CONFIG_META[tool].package,
    })),
    initialValues: PRESET_TOOLS,
  });

  if (p.isCancel(selectedTools)) {
    p.cancel('Operation cancelled.');
    process.exit(0);
  }

  let reactFramework = detectedFramework;

  if (selectedTools.includes('eslint')) {
    if (options.react !== undefined) {
      reactFramework = parseReactFramework(options.react);
    } else if (!options.yes) {
      const selectedFramework = await selectReactFramework(detectedFramework);
      if (selectedFramework !== null) {
        reactFramework = selectedFramework;
      }
    }
  }

  return {
    configureGitHooks: false,
    installDeps: options.install ?? true,
    reactFramework,
    tools: selectedTools as ConfigTool[],
  };
}

async function selectReactFramework(detected: ReactFramework): Promise<ReactFramework | null> {
  const options = [
    { value: 'next', label: 'Next.js' },
    { value: 'remix', label: 'Remix' },
    { value: 'vite', label: 'Vite' },
    { value: 'expo', label: 'Expo (React Native)' },
    { value: 'true', label: 'Generic React' },
    { value: 'false', label: 'None (No React)' },
  ];

  const detectedValue = detected === true ? 'true' : detected === false ? 'false' : detected;

  const sortedOptions = options.toSorted((a, b) => {
    if (a.value === detectedValue) return -1;
    if (b.value === detectedValue) return 1;
    return 0;
  });

  if (detectedValue !== 'false') {
    sortedOptions[0] = {
      ...sortedOptions[0],
      label: `${sortedOptions[0].label} (Detected)`,
    };
  }

  const selected = await p.select({
    message: 'Select React framework for ESLint:',
    options: sortedOptions,
  });

  if (p.isCancel(selected)) {
    return null;
  }

  return parseReactFramework(selected as string);
}

async function askGitHooksConfiguration(
  options: CliOptions,
  selections: UserSelections,
): Promise<boolean> {
  // Check if --git-hooks or --no-git-hooks was explicitly set
  if (options.gitHooks !== undefined) {
    return options.gitHooks;
  }

  // Check if there are tools that can be linted
  const hasLintableTools = selections.tools.some((t) =>
    ['eslint', 'prettier', 'stylelint', 'remarklint'].includes(t),
  );
  const hasCommitlint = selections.tools.includes('commitlint');

  // Skip if no lintable tools and no commitlint
  if (!hasLintableTools && !hasCommitlint) {
    return false;
  }

  // Skip asking in yes mode, default to true
  if (options.yes) {
    return true;
  }

  // Check for existing configurations
  const cwd = process.cwd();
  const existing = hasExistingGitHooksConfig(cwd);

  if (existing.hasHusky) {
    p.log.warn('Detected existing Husky configuration. Git hooks setup may conflict.');
  }

  if (existing.hasLintStaged || existing.hasSimpleGitHooks) {
    const shouldOverwrite = await p.confirm({
      initialValue: false,
      message: 'Existing lint-staged/simple-git-hooks config detected. Overwrite?',
    });

    if (p.isCancel(shouldOverwrite) || !shouldOverwrite) {
      return false;
    }
    return true;
  }

  const hookQuestion = await p.confirm({
    initialValue: true,
    message: 'Configure lint-staged and git hooks?',
  });

  if (p.isCancel(hookQuestion)) {
    return false;
  }

  return hookQuestion;
}

function formatReactFramework(framework: ReactFramework): string {
  if (framework === true) return 'Generic React';
  if (framework === false) return 'None';
  return framework.charAt(0).toUpperCase() + framework.slice(1);
}

function getInstallCommandHint(pm: string, deps: string[]): string {
  const pkgList = deps.join(' ');
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
    default: {
      return `npm install -D ${pkgList}`;
    }
  }
}

function printHelp(): void {
  console.log(`
${pc.bold('create-lobe-lint')} - Setup LobeHub lint configurations

${pc.bold('Usage:')}
  npx create-lobe-lint [options]

${pc.bold('Options:')}
  -p, --preset          Quick setup with preset tools (ESLint, Prettier, Stylelint, Commitlint)
  -m, --manual          Manually select tools to configure
  --eslint              Include ESLint configuration
  --prettier            Include Prettier configuration
  --stylelint           Include Stylelint configuration
  --commitlint          Include Commitlint configuration
  --remarklint          Include Remarklint configuration
  --semantic-release    Include Semantic Release configuration
  --react <framework>   Set React framework (next/remix/vite/expo/true/false)
  --git-hooks           Configure lint-staged and simple-git-hooks
  --no-git-hooks        Skip git hooks configuration
  --install             Auto-install dependencies (default)
  --no-install          Skip dependency installation
  -y, --yes             Skip confirmations
  -h, --help            Show help

${pc.bold('Examples:')}
  npx create-lobe-lint                    # Interactive mode
  npx create-lobe-lint --preset -y        # Quick setup with defaults
  npx create-lobe-lint --eslint --prettier --react next
  npx create-lobe-lint --manual           # Select tools manually
`);
}
