interface User {
  email: string;
  id: number;
  name: string;
}

function createUser(data: Partial<User>): User {
  return {
    email: data.email ?? '',
    id: data.id ?? 0,
    name: data.name ?? 'Unknown',
  };
}

export type { User };
export { createUser };
