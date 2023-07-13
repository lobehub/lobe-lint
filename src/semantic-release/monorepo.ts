import { createConfig } from 'semantic-release-config-gitmoji/lib/createConfig';

import { options } from './index';

export default {
  $schema: 'https://json.schemastore.org/semantic-release',
  ...createConfig({ ...options, monorepo: true }),
};
