import { useEffect, useState } from 'preact/hooks';
import { noop } from '../utils';

interface UsePopupOptions {
  name?: string;
  onStateChange?: (target: boolean) => void;
}

export function usePopup({ name, onStateChange = noop }: UsePopupOptions = {}) {
  const [window, setWindow] = useState<Window | undefined>(undefined);

  const setOpen = (target: boolean) => {
    const isOpen = window && !window.closed;

    if (target && !isOpen) {
      const w =
        open(
          'about:blank',
          name,
          'width=1000,height=1000,location=no,toolbar=no,menubar=no,status=no',
        ) ?? undefined;
      setWindow(w);
      w?.addEventListener('beforeunload', () => {
        setWindow(undefined);
      });
    }

    if (!target && isOpen) {
      window?.close();
    }
  };

  const isOpen = Boolean(window);

  useEffect(() => {
    onStateChange(isOpen);
  }, [isOpen]);

  return {
    setOpen,
    body: window?.document.body,
  };
}
