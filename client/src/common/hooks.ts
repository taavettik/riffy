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

// also used in theme.ts, todo: refactor
const MOBILE_SCREEN_WIDTH = 600;

function getDimensions() {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
}

/**
 * Hook for subscribing to window dimensions
 *
 * @example
 *
 * const { width, height } = useDimensions();
 */
export function useDimensions() {
  const [dimensions, setDimensions] = useState(getDimensions());

  useEffect(() => {
    const onResize = () => {
      setDimensions(getDimensions());
    };

    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return { ...dimensions, isMobile: dimensions.width <= MOBILE_SCREEN_WIDTH };
}
