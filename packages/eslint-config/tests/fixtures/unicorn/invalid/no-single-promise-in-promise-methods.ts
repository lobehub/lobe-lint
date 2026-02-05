// Single promise in Promise.all - should fail unicorn/no-single-promise-in-promise-methods
export async function singlePromise() {
  const p = Promise.resolve(1);
  return Promise.all([p]);
}
