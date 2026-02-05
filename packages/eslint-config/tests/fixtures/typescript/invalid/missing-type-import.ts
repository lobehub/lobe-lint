// Should fail: ReactNode is only used as a type
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export type { Props };
