import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { federation } from '@module-federation/vite';
import tailwindcss from '@tailwindcss/vite';
import {
  DEV_HOST,
  federationShared,
  getDevOrigin,
  uiPackageAliases,
  workspaceRootFromApp,
} from './shared.mjs';

/**
 * Shared Vite config for every MF remote.
 * New remotes only pass name + port (+ appDir). Port comes from remotes.json via caller.
 */
export function createRemoteViteConfig(options) {
  const {
    appDir,
    name,
    port,
    exposes = { './App': './src/App.tsx' },
  } = options;
  const workspaceRoot = workspaceRootFromApp(appDir);

  return defineConfig({
    server: {
      port,
      strictPort: true,
      origin: getDevOrigin(port),
      host: DEV_HOST,
      cors: true,
      fs: { allow: [workspaceRoot] },
    },
    preview: { port, strictPort: true, host: DEV_HOST, cors: true },
    build: { target: 'chrome89' },
    optimizeDeps: { exclude: ['@react-mfe/ui', '@react-mfe/auth'] },
    resolve: { alias: uiPackageAliases(appDir) },
    plugins: [
      federation({
        name,
        filename: 'remoteEntry.js',
        exposes,
        shared: federationShared(),
        dev: { remoteHmr: true },
        dts: false,
      }),
      react(),
      tailwindcss(),
    ],
  });
}
