// Valid error prevention patterns

// better-regex: Using optimized regex
const optimizedRegex = /\d/;

// error-message: Error with message
const errorWithMessage = new Error('Something went wrong');
const typeError = new TypeError('Invalid type');

// new-for-builtins: Using new for builtins
const map = new Map<string, number>();
const set = new Set<string>();
const weakMap = new WeakMap();
const promise = new Promise<void>((resolve) => resolve());

// no-await-in-promise-methods: Correct Promise.all usage
async function correctPromiseAll() {
  const p1 = Promise.resolve(1);
  const p2 = Promise.resolve(2);
  return Promise.all([p1, p2]);
}

// no-instanceof-builtins: Using proper type checks
const isArray = Array.isArray([1, 2, 3]);
const isError = (e: unknown): e is Error => e instanceof Error;

// no-invalid-fetch-options: Valid fetch options
async function validFetch() {
  return fetch('https://example.com', {
    method: 'POST',
    body: JSON.stringify({ data: 1 }),
  });
}

// no-negation-in-equality-check: Correct equality check
const a = 1 as number;
const b = 2 as number;
const notEqual = a !== b;

// no-single-promise-in-promise-methods: Multiple promises
async function multiplePromises() {
  const promises = [Promise.resolve(1), Promise.resolve(2)];
  return Promise.all(promises);
}

// no-thenable: Object without then property
const normalObject = {
  value: 42,
  getValue() {
    return this.value;
  },
};

// throw-new-error: Throwing with new
function throwError() {
  throw new Error('error');
}

export {
  correctPromiseAll,
  errorWithMessage,
  isArray,
  isError,
  map,
  multiplePromises,
  normalObject,
  notEqual,
  optimizedRegex,
  promise,
  set,
  throwError,
  typeError,
  validFetch,
  weakMap,
};
