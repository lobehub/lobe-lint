import type { ConfigTool, GeneratedFile, GeneratorContext } from '../types.js';
import { generateCommitlintConfig, getCommitlintDependencies } from './commitlint.js';
import { generateEslintConfig, getEslintDependencies } from './eslint.js';
import { generatePrettierConfig, getPrettierDependencies } from './prettier.js';
import { generateRemarklintConfig, getRemarklintDependencies } from './remarklint.js';
import {
  generateSemanticReleaseConfig,
  getSemanticReleaseDependencies,
} from './semantic-release.js';
import { generateStylelintConfig, getStylelintDependencies } from './stylelint.js';

export function generateConfigs(ctx: GeneratorContext): GeneratedFile[] {
  const files: GeneratedFile[] = [];

  for (const tool of ctx.selections.tools) {
    const file = generateConfig(tool, ctx);
    if (file) {
      files.push(file);
    }
  }

  return files;
}

function generateConfig(tool: ConfigTool, ctx: GeneratorContext): GeneratedFile | null {
  switch (tool) {
    case 'eslint': {
      return generateEslintConfig(ctx);
    }
    case 'prettier': {
      return generatePrettierConfig();
    }
    case 'stylelint': {
      return generateStylelintConfig();
    }
    case 'commitlint': {
      return generateCommitlintConfig();
    }
    case 'remarklint': {
      return generateRemarklintConfig();
    }
    case 'semantic-release': {
      return generateSemanticReleaseConfig();
    }
    default: {
      return null;
    }
  }
}

export function getDependencies(ctx: GeneratorContext): string[] {
  const deps = new Set<string>();

  for (const tool of ctx.selections.tools) {
    const toolDeps = getToolDependencies(tool, ctx);
    for (const dep of toolDeps) {
      deps.add(dep);
    }
  }

  return Array.from(deps);
}

function getToolDependencies(tool: ConfigTool, ctx: GeneratorContext): string[] {
  switch (tool) {
    case 'eslint': {
      return getEslintDependencies(ctx);
    }
    case 'prettier': {
      return getPrettierDependencies();
    }
    case 'stylelint': {
      return getStylelintDependencies();
    }
    case 'commitlint': {
      return getCommitlintDependencies();
    }
    case 'remarklint': {
      return getRemarklintDependencies();
    }
    case 'semantic-release': {
      return getSemanticReleaseDependencies();
    }
    default: {
      return [];
    }
  }
}

export { generateCommitlintConfig, getCommitlintDependencies } from './commitlint.js';
export { generateEslintConfig, getEslintDependencies } from './eslint.js';
export { generatePrettierConfig, getPrettierDependencies } from './prettier.js';
export { generateRemarklintConfig, getRemarklintDependencies } from './remarklint.js';
export {
  generateSemanticReleaseConfig,
  getSemanticReleaseDependencies,
} from './semantic-release.js';
export { generateStylelintConfig, getStylelintDependencies } from './stylelint.js';
