import { CONFIG_META } from '../constants.js';
import { type GeneratedFile, type GeneratorContext } from '../types.js';

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

  if (ctx.projectInfo.hasTypeScript) {
    deps.push('typescript');
  }

  return deps;
}
