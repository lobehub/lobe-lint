import { createConfig } from 'semantic-release-config-gitmoji/lib/createConfig.js';

import { options } from './index.js';

const config = {
  ...createConfig({ ...options, monorepo: true }),
};

export default config;
