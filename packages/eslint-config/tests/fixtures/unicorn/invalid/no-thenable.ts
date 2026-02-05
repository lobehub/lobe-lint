// Object with then property - should fail unicorn/no-thenable
export const thenable = {
  then() {
    return 42;
  },
};
