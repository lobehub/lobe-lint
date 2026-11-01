import { CONFIG_META } from '../constants.js';
import { type GeneratedFile, type GeneratorContext } from '../types.js';
import { declaresDependency } from '../utils/detect.js';
import { buildDefineConfigOptions } from './define-config-options.js';

// typescript-eslint needs the TypeScript JS API, which TypeScript 7.0 does not ship, and a bare
// `add typescript` now resolves 7. Install 6 unless the project already declares a version.
export const TYPESCRIPT_DEPENDENCY = 'typescript@^6';

export function generateEslintConfig(ctx: GeneratorContext): GeneratedFile {
  const content = `import { defineConfig } from '@lobehub/eslint-config';

export default defineConfig(${buildDefineConfigOptions(ctx)});
`;

  return {
    path: CONFIG_META.eslint.configFile,
    content,
  };
}

export function getEslintDependencies(ctx: GeneratorContext): string[] {
  const deps = [CONFIG_META.eslint.package, ...CONFIG_META.eslint.peerDependencies];

  if (ctx.projectInfo.hasTypeScript && !declaresDependency(ctx.cwd, 'typescript')) {
    deps.push(TYPESCRIPT_DEPENDENCY);
  }

  return deps;
}
