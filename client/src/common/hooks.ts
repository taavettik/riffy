import { useEffect, useRef, useState } from 'preact/hooks';

export function useTimer(interval: number, callback: () => void) {
  const handleRef = useRef<number>();
  useEffect(() => {
    if (handleRef.current) clearInterval(handleRef.current);
    handleRef.current = setInterval(callback, interval);
    return () => clearInterval(handleRef.current);
  }, [callback]);
}

export function useDebounce<T>(delay: number, value: T) {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const handle = setTimeout(() => {
      setDebounced(value);
    }, delay);
    return () => clearTimeout(handle);
  }, [value, delay]);
  return debounced;
}
