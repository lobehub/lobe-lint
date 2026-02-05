import { useEffect, useState } from 'react';

export function BadComponent({ show }: { show: boolean }) {
  if (show) {
    const [count, setCount] = useState(0);
    useEffect(() => {
      console.log(count);
    }, [count]);
    return <div onClick={() => setCount(count + 1)}>{count}</div>;
  }
  return null;
}
