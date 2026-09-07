import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { federation } from '@module-federation/vite';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'node:path';
import {
  DEV_HOST,
  federationShared,
  loadRemotesConfig,
  remoteEntryMap,
  resolveRemoteEntry,
  uiPackageAliases,
  workspaceRootFromApp,
} from './shared.mjs';

/**
 * Shell Vite config. Remotes come from remotes.json — add there, not here.
 * Only remotes with a resolvable entry (checkout or entry.prod) are registered.
 */
export function createShellViteConfig(options) {
  const { appDir } = options;
  const workspaceRoot = workspaceRootFromApp(appDir);
  const { shell, remotes: remoteList } = loadRemotesConfig();
  const port = shell.port;
  const entries = remoteEntryMap(workspaceRoot);

  const remotes = Object.fromEntries(
    remoteList
      .map((remote) => {
        const entry = resolveRemoteEntry(remote, workspaceRoot);
        if (!entry) return null;
        return [
          remote.name,
          {
            type: 'module',
            name: remote.name,
            entry,
          },
        ];
      })
      .filter(Boolean),
  );

  return defineConfig({
    define: {
      // Injected for shell UI — which remotes can loadRemote
      __MFE_REMOTE_ENTRIES__: JSON.stringify(entries),
    },
    server: {
      port,
      strictPort: true,
      host: DEV_HOST,
      fs: { allow: [workspaceRoot] },
    },
    preview: { port, strictPort: true, host: DEV_HOST },
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
