/* eslint-disable unicorn/no-process-exit, unicorn/prefer-top-level-await */
import mri from 'mri';

import { run } from './cli.js';
import type { CliOptions } from './types.js';

const argv = mri(process.argv.slice(2), {
  alias: {
    h: 'help',
    m: 'manual',
    p: 'preset',
    y: 'yes',
  },
  boolean: [
    'help',
    'preset',
    'manual',
    'eslint',
    'prettier',
    'stylelint',
    'commitlint',
    'remarklint',
    'semantic-release',
    'yes',
    'install',
    'git-hooks',
  ],
  string: ['react'],
});

const options: CliOptions = {
  commitlint: argv.commitlint,
  eslint: argv.eslint,
  gitHooks: argv['git-hooks'],
  help: argv.help,
  install: argv.install,
  manual: argv.manual,
  preset: argv.preset,
  prettier: argv.prettier,
  react: argv.react,
  remarklint: argv.remarklint,
  semanticRelease: argv['semantic-release'],
  stylelint: argv.stylelint,
  yes: argv.yes,
};

run(options).catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
