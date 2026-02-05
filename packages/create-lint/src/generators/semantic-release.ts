import { CONFIG_META } from '../constants.js';
import type { GeneratedFile } from '../types.js';

export function generateSemanticReleaseConfig(): GeneratedFile {
  const content = `import config from '@lobehub/semantic-release-config';

export default config;
`;

  return {
    path: CONFIG_META['semantic-release'].configFile,
    content,
  };
}

export function getSemanticReleaseDependencies(): string[] {
  return [
    CONFIG_META['semantic-release'].package,
    ...CONFIG_META['semantic-release'].peerDependencies,
  ];
}
