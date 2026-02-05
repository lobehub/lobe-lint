// Throwing without new - should fail unicorn/throw-new-error
export function throwError() {
  // eslint-disable-next-line @typescript-eslint/only-throw-error
  throw Error('error');
}
