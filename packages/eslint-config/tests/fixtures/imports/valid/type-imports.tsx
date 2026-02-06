import { type FC, type ReactNode } from 'react';
import { useState } from 'react';

interface Props {
  children: ReactNode;
}

export const Component: FC<Props> = ({ children }) => {
  const [count, setCount] = useState(0);
  return (
    <div onClick={() => setCount(count + 1)}>
      {children} {count}
    </div>
  );
};
