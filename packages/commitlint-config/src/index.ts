const config = {
  extends: ['gitmoji'],
  rules: {
    'footer-leading-blank': [0, 'never'] as const,
    'header-max-length': [0, 'never'] as const,
  },
};

export default config;
