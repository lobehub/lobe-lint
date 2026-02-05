// Useless spread - should fail unicorn/no-useless-spread
const arr = [1, 2, 3];
export const copy = [...[...arr]];
