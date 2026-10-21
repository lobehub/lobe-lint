import { CONFIG_META } from '../constants.js';
import { type GeneratedFile, type GeneratorContext } from '../types.js';
import { declaresDependency } from '../utils/detect.js';

// typescript-eslint needs the TypeScript JS API, which TypeScript 7.0 does not ship, and a bare
// `add typescript` now resolves 7. Install 6 unless the project already declares a version.
export const TYPESCRIPT_DEPENDENCY = 'typescript@^6';

export function generateEslintConfig(ctx: GeneratorContext): GeneratedFile {
  const { projectInfo, selections } = ctx;
  const { reactFramework } = selections;
  const { hasTypeScript } = projectInfo;

  const options: string[] = [];

  switch (reactFramework) {
    case 'next': {
      options.push(`react: 'next'`, `next: true`);

      break;
    }
    case 'remix': {
      options.push(`react: 'remix'`);

      break;
    }
    case 'vite': {
      options.push(`react: 'vite'`);

      break;
    }
    case 'expo': {
      options.push(`react: 'expo'`, `reactNative: true`);

      break;
    }
    case true: {
      options.push(`react: true`);

      break;
    }
    // No default
  }

  if (hasTypeScript) {
    options.push(`typescript: true`);
  }

  const optionsStr = options.length > 0 ? `{\n  ${options.join(',\n  ')},\n}` : '';

  const content = `import { defineConfig } from '@lobehub/eslint-config';

export default defineConfig(${optionsStr});
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
