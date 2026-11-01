import { registerHooks } from 'node:module';

const BLOCKED = /^(?:typescript|eslint)(?:\/|$)/;

registerHooks({
  resolve(specifier, context, next) {
    if (BLOCKED.test(specifier)) {
      const error = new Error(`Cannot find module '${specifier}' (blocked in tests)`);
      error.code = 'MODULE_NOT_FOUND';
      throw error;
    }
    return next(specifier, context);
  },
});
