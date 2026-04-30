import type { Options as SemanticReleaseOptions } from 'semantic-release';
import { createConfig } from 'semantic-release-config-gitmoji/lib/createConfig.js';

import { options } from './index.js';

const config: SemanticReleaseOptions = {
  ...createConfig({ ...options, monorepo: true }),
};

export default config;
