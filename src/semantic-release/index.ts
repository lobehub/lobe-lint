const { createConfig } = require('semantic-release-config-gitmoji/lib/createConfig');

export default createConfig({
  changelogTitle: `<a name="readme-top"></a>

# Changelog`,
  releaseRules: [
    {
      subject: 'feat*',
      release: 'minor',
    },
    {
      subject: 'fix*',
      release: 'patch',
    },
    {
      subject: 'perf*',
      release: 'patch',
    },
    {
      subject: 'style*',
      release: 'patch',
    },
    {
      subject: 'refactor*',
      release: 'patch',
    },
    {
      subject: 'build*',
      release: 'patch',
    },
    {
      subject: 'BREAKING CHANGE*',
      release: 'major',
    },
  ],
});
