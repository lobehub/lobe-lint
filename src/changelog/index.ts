export default {
  displayTypes: ['feat', 'fix', 'styles', 'pref', 'refactor'],
  newlineTimestamp: true,
  reduceHeadingLevel: true,
  addBackToTop: true,
  showSummary: true,
  scopeDisplayName: {
    '*': 'misc',
  },
  customTypeMap: {
    build: {
      emojj: '📦',
    },
    chore: {
      emojj: '🔧',
    },
    ci: {
      emojj: '👷',
    },
  },
};
