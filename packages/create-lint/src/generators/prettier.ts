import { CONFIG_META } from '../constants.js';
import { type GeneratedFile } from '../types.js';

export function generatePrettierConfig(): GeneratedFile {
  const content = `import config from '@lobehub/prettier-config';

export default config;
`;

  return {
    path: CONFIG_META.prettier.configFile,
    content,
  };
}

export function getPrettierDependencies(): string[] {
  return [CONFIG_META.prettier.package, ...CONFIG_META.prettier.peerDependencies];
}
