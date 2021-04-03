import { h } from 'preact';
import { renderToString } from 'preact-render-to-string';
import { createPortal, useEffect, useMemo, useState } from 'preact/compat';
import { ServerStyleSheet, ThemeProvider, useTheme } from 'styled-components';
import { usePopup } from '../hooks/usePopup';

export const PopupWindow: React.FC<{ open: boolean }> = ({
  children,
  open,
}) => {
  const { setOpen: togglePopup, body } = usePopup();

  const [html, setHtml] = useState('');
  const [css, setCss] = useState('');

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
    console.log(styleTags);

    setHtml(html);
    setCss(styleTags);
  }, [open]);

  useEffect(() => {
    togglePopup(open);
  }, [open]);

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
