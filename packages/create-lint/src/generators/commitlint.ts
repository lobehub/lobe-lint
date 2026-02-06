import { CONFIG_META } from '../constants.js';
import { type GeneratedFile } from '../types.js';

export function generateCommitlintConfig(): GeneratedFile {
  const content = `import config from '@lobehub/commitlint-config';

export default config;
`;

  return {
    path: CONFIG_META.commitlint.configFile,
    content,
  };
}

export function getCommitlintDependencies(): string[] {
  return [CONFIG_META.commitlint.package, ...CONFIG_META.commitlint.peerDependencies];
}
