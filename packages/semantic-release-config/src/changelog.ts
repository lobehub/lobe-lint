const config = {
  addBackToTop: true,
  customTypeMap: {
    build: {
      emoji: '📦',
    },
    chore: {
      emoji: '🔧',
    },
    ci: {
      emoji: '👷',
    },
  },
  displayTypes: ['feat', 'fix', 'style', 'perf', 'refactor'],
  newlineTimestamp: true,
  reduceHeadingLevel: true,
  scopeDisplayName: {
    '*': 'misc',
  },
  showAuthor: true,
  showSummary: true,
};

export default config;
