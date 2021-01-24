import { render, h, Fragment as JSXFragment } from 'preact';
import App from './app';

// eslint-disable-next-line no-var
(window as any).Fragment = JSXFragment;

render(<App />, document.getElementById('app')!);
