import { readFileSync } from 'node:fs';
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

export function remoteEntryUrl(port) {
  return `http://localhost:${port}/remoteEntry.js`;
}

export function findRemote(name) {
  return loadRemotesConfig().remotes.find((remote) => remote.name === name);
}
