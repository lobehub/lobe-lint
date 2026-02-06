import { CONFIG_META } from '../constants.js';
import { type GeneratedFile } from '../types.js';

export function generateStylelintConfig(): GeneratedFile {
  const content = `import config from '@lobehub/stylelint-config';

export default config;
`;

  return {
    path: CONFIG_META.stylelint.configFile,
    content,
  };
}

export function getStylelintDependencies(): string[] {
  return [CONFIG_META.stylelint.package, ...CONFIG_META.stylelint.peerDependencies];
}
