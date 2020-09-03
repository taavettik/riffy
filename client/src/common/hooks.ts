import { useEffect, useRef } from 'preact/hooks';

export function useTimer(interval: number, callback: () => void) {
  const handleRef = useRef<number>();
  useEffect(() => {
    if (handleRef.current) clearInterval(handleRef.current);
    handleRef.current = setInterval(callback, interval);
    return () => clearInterval(handleRef.current);
  }, [callback]);
}
