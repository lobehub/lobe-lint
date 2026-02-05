import { createConfig } from 'semantic-release-config-gitmoji/lib/createConfig';

import { options } from './index';

const config = {
  ...createConfig({ ...options, monorepo: true }),
};

export default config;
