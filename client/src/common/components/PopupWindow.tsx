import { h, RefCallback, RefObject } from 'preact';
import { renderToString } from 'preact-render-to-string';
import {
  createPortal,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'preact/compat';
import { ServerStyleSheet, ThemeProvider, useTheme } from 'styled-components';
import { usePopup } from '../hooks/usePopup';

export const PopupWindow: React.FC<{
  open: boolean;
  onStateChange?: (target: boolean) => void;
  windowRef?: RefObject<Window> | RefCallback<Window>;
}> = ({ children, windowRef: externalWindowRef, open, onStateChange }) => {
  const { setOpen: togglePopup, body, window } = usePopup({ onStateChange });

  const [html, setHtml] = useState('');
  const [css, setCss] = useState('');

  const windowRef = useRef<Window | undefined>(window);
  windowRef.current = window;

  // Patch window onto the ref
  if (typeof externalWindowRef === 'function') {
    externalWindowRef(window || null);
  } else if (externalWindowRef) {
    externalWindowRef.current = window;
  }

  const theme = useTheme();

  // render html and css only when opening the popup
  // could make this component take in a render-function as prop
  // and render based on it
  // and just have it be memoized via useCallback
  useEffect(() => {
    if (!open) {
      return;
    }

    const sheet = new ServerStyleSheet();
    const html = renderToString(
      <>
        {sheet.collectStyles(
          <ThemeProvider theme={theme}>{children}</ThemeProvider>,
        )}
      </>,
    );
    const styleTags = sheet.getStyleTags();

    setHtml(html);
    setCss(styleTags);
  }, [open]);

  useEffect(() => {
    togglePopup(open);
  }, [open]);

  useEffect(() => {
    return () => {
      windowRef.current?.close();
    };
  }, []);

  if (!body) {
    return null;
  }

  return createPortal(
    <>
      <div dangerouslySetInnerHTML={{ __html: css }}></div>

      <div dangerouslySetInnerHTML={{ __html: html }} />
    </>,
    body,
  );
};
