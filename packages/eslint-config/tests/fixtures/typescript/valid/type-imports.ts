import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  title: string;
}

export function Component({ children, title }: Props) {
  return { children, title };
}

export type { Props };
