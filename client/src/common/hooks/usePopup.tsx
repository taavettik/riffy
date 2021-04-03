import { useEffect, useState } from 'preact/hooks';

interface UsePopupOptions {
  name?: string;
}

export function usePopup({ name }: UsePopupOptions = {}) {
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
      w?.addEventListener('close', () => setWindow(undefined));
    }

    if (!target && isOpen) {
      window?.close();
    }
  };

  return {
    setOpen,
    body: window?.document.body,
  };
}
