import { type GeneratorContext } from '../types.js';

export function buildDefineConfigOptions(ctx: GeneratorContext): string {
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

  return options.length > 0 ? `{\n  ${options.join(',\n  ')},\n}` : '';
}
