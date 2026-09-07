import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const remotesJsonPath = resolve(here, '../remotes.json');

export function loadRemotesConfig() {
  return JSON.parse(readFileSync(remotesJsonPath, 'utf8'));
}

export function workspaceRootFromApp(appDirname) {
  return resolve(appDirname, '../..');
}

export function isRemoteCheckedOut(name, workspaceRoot) {
  return existsSync(resolve(workspaceRoot, 'apps', name));
}

/** Single host for Vite + MF entry URLs (match server.host). */
export const DEV_HOST = '127.0.0.1';

export function getDevOrigin(port) {
  return `http://${DEV_HOST}:${port}`;
}

/** Dev remoteEntry URL from port. */
export function remoteEntryUrl(port) {
  return `${getDevOrigin(port)}/remoteEntry.js`;
}

/**
 * Shell MF entry URL, or null when remote cannot load.
 * local checkout → entry.dev / getDevOrigin
 * else entry.prod if non-empty
 * else null (do not fall back to dead localhost)
 */
export function resolveRemoteEntry(remote, workspaceRoot) {
  const checkedOut = isRemoteCheckedOut(remote.name, workspaceRoot);
  if (checkedOut) {
    return remote.entry?.dev || remoteEntryUrl(remote.port);
  }
  const prod =
    typeof remote.entry?.prod === 'string' ? remote.entry.prod.trim() : '';
  if (prod) return prod;
  return null;
}

/** Map of remote name → entry URL or null (for Vite define → shell UI). */
export function remoteEntryMap(workspaceRoot) {
  const { remotes } = loadRemotesConfig();
  return Object.fromEntries(
    remotes.map((remote) => [
      remote.name,
      resolveRemoteEntry(remote, workspaceRoot),
    ]),
  );
}

export function uiPackageAliases(appDirname) {
  return [
    {
      find: '@react-mfe/ui/styles/tailwind.css',
      replacement: resolve(
        appDirname,
        '../../packages/ui/src/styles/tailwind.css',
      ),
    },
    {
      find: /^@react-mfe\/ui$/,
      replacement: resolve(appDirname, '../../packages/ui/src/index.ts'),
    },
    {
      find: /^@react-mfe\/auth$/,
      replacement: resolve(appDirname, '../../packages/auth/src/index.ts'),
    },
  ];
}

export function federationShared() {
  return loadRemotesConfig().shared;
}

export function findRemote(name) {
  return loadRemotesConfig().remotes.find((remote) => remote.name === name);
}
