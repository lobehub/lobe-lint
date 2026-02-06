import { CONFIG_META } from '../constants.js';
import { type GeneratedFile } from '../types.js';

export function generateRemarklintConfig(): GeneratedFile {
  const content = `import config from '@lobehub/remarklint-config';

export default config;
`;

  return {
    path: CONFIG_META.remarklint.configFile,
    content,
  };
}

export function getRemarklintDependencies(): string[] {
  return [CONFIG_META.remarklint.package, ...CONFIG_META.remarklint.peerDependencies];
}
