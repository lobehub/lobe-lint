const unavailable = (name) =>
  class {
    constructor() {
      throw new Error(
        `[@lobehub/oxlint-config] a bundled plugin used eslint.${name}, which is not available under oxlint`,
      );
    }
  };

module.exports = new Proxy(
  {},
  {
    get(target, key) {
      if (typeof key === 'symbol' || key === '__esModule' || key === 'then' || key === 'default') {
        return undefined;
      }
      // eslint-plugin-react compares eslint/package.json's version to pick its report format.
      if (key === 'version') return '10.4.0';
      return (target[key] ??= unavailable(String(key)));
    },
  },
);
