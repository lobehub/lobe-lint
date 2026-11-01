import { CONFIG_META } from '../constants.js';
import { type GeneratedFile, type GeneratorContext } from '../types.js';
import { buildDefineConfigOptions } from './define-config-options.js';

export function generateOxlintConfig(ctx: GeneratorContext): GeneratedFile {
  const content = `import { defineConfig } from '@lobehub/oxlint-config';

export default defineConfig(${buildDefineConfigOptions(ctx)});
`;

  return {
    path: CONFIG_META.oxlint.configFile,
    content,
  };
}

export function getOxlintDependencies(): string[] {
  return [CONFIG_META.oxlint.package, ...CONFIG_META.oxlint.peerDependencies];
}
