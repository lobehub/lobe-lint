// Using filter()[0] - should fail unicorn/prefer-array-find
const numbers = [1, 2, 3, 4, 5];
export const firstEven = numbers.filter((n) => n % 2 === 0)[0];
