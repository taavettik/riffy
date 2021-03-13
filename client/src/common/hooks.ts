import { DocumentNode, QueryHookOptions, useQuery } from '@apollo/client';
import {
  EffectCallback,
  Inputs,
  useEffect,
  useRef,
  useState,
} from 'preact/hooks';

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

/**
 * Wrapper for `useEffect` that makes sure the callback is fired
 * in the current closure
 */
export function useSafeEffect(callback: EffectCallback, inputs?: Inputs) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    return callbackRef.current();
  }, inputs);
}

/**
 * Like Apollo's `useQuery` but refetches the query through the network
 * on component mount. Useful for e.g. refetching cached data
 * when arriving on a page
 */
export function useMountQuery<Query = any, Variables = any>(
  query: DocumentNode,
  options: QueryHookOptions<Query, Variables>,
) {
  const queryData = useQuery<Query, Variables>(query, options);

  useSafeEffect(() => {
    queryData.refetch();
  }, []);

  return queryData;
}
