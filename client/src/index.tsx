import { render, h, Fragment as JSXFragment } from 'preact';
import App from './app';

// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
(window as any).Fragment = JSXFragment;

if (process.env.NODE_ENV === 'development') {
  // Enable preact devtools
  // require('preact/debug');
}

const root = document.getElementById('app')!;

render(<App />, root);
