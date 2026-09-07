import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const appDir = import.meta.dirname;
const workspaceRoot = resolve(appDir, '../..');

// Local default `/`. CI / Pages: VITE_BASE=/polyfed/
const base = process.env.VITE_BASE ?? '/';

export default defineConfig({
  base,
  server: {
    port: 4300,
    strictPort: true,
    host: '127.0.0.1',
    fs: { allow: [workspaceRoot] },
  },
  preview: {
    port: 4300,
    strictPort: true,
    host: '127.0.0.1',
  },
  resolve: {
    alias: [
      {
        find: '@react-mfe/ui/styles/tailwind.css',
        replacement: resolve(
          appDir,
          '../../packages/ui/src/styles/tailwind.css',
        ),
      },
      {
        find: /^@react-mfe\/ui$/,
        replacement: resolve(appDir, '../../packages/ui/src/index.ts'),
      },
    ],
  },
  plugins: [react(), tailwindcss()],
});
