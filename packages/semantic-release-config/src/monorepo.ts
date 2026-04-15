import type { Options as SemanticReleaseOptions } from 'semantic-release';
import { createConfig } from 'semantic-release-config-gitmoji/lib/createConfig.js';

import { options } from './index.js';

const config: SemanticReleaseOptions = {
  ...createConfig({ ...options, monorepo: true }),
};

// eslint-disable-next-line no-restricted-syntax -- shareable semantic-release config entry
export default config;
