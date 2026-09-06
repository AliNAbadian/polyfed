import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { federation } from '@module-federation/vite';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'node:path';
import {
  federationShared,
  loadRemotesConfig,
  resolveRemoteEntry,
  uiPackageAliases,
  workspaceRootFromApp,
} from './shared.mjs';

/**
 * Shell Vite config. Remotes come from remotes.json — add there, not here.
 * Entry URLs prefer local checkout; otherwise entry.prod when set.
 */
export function createShellViteConfig(options) {
  const { appDir } = options;
  const workspaceRoot = workspaceRootFromApp(appDir);
  const { shell, remotes: remoteList } = loadRemotesConfig();
  const port = shell.port;

  const remotes = Object.fromEntries(
    remoteList.map((remote) => [
      remote.name,
      {
        type: 'module',
        name: remote.name,
        entry: resolveRemoteEntry(remote, workspaceRoot),
      },
    ]),
  );

  return defineConfig({
    server: {
      port,
      strictPort: true,
      host: '127.0.0.1',
      fs: { allow: [workspaceRoot] },
    },
    preview: { port, strictPort: true },
    build: {
      target: 'chrome89',
      rollupOptions: {
        input: {
          main: resolve(appDir, 'index.html'),
          silentRenew: resolve(appDir, 'silent-renew.html'),
        },
      },
    },
    optimizeDeps: { exclude: ['@react-mfe/ui', '@react-mfe/auth'] },
    resolve: { alias: uiPackageAliases(appDir) },
    plugins: [
      federation({
        name: shell.name,
        remotes,
        shared: federationShared(),
        dev: {
          remoteHmr: true,
          disableDynamicRemoteTypeHints: true,
        },
      }),
      react(),
      tailwindcss(),
    ],
  });
}
