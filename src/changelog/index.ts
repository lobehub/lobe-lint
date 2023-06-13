export default {
  displayTypes: ['feat', 'fix', 'style', 'pref', 'refactor'],
  newlineTimestamp: true,
  reduceHeadingLevel: true,
  addBackToTop: true,
  showSummary: true,
  scopeDisplayName: {
    '*': 'misc',
  },
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
};
