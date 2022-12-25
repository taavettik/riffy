import { defineConfig } from 'vite';
import legacy from '@vitejs/plugin-legacy';

export default defineConfig({
  resolve: {
    alias: {
      react: 'preact/compat',
      'react-dom': 'preact/compat',
    },
  },
  plugins: [
    legacy({
      targets: ['defaults', 'and_chr 40'],
    }),
  ],
  server: {
    port: 8080,
    host: '0.0.0.0',
  },
});
