#!/usr/bin/env bun
/**
 * Remove a Module Federation remote from the platform registry.
 *
 * Usage:
 *   bun run delete-remote --name promotions
 *   bun run delete-remote --name promotions --keep-files
 *   bun run delete-remote --name cart --force
 *
 * Local checkout only: bun run drop-remote --name <n>
 */
import {
  arg,
  assertRemoteName,
  bunInstall,
  failUsage,
  hasFlag,
  isCheckedOut,
  readRemotesConfig,
  removeAppDir,
  writeRemotesConfig,
  workspaceRoot,
} from './lib/polyrepo.mjs';

const root = workspaceRoot(import.meta.dirname);
const USAGE = `Usage:
  bun run delete-remote --name <kebab-name> [--keep-files] [--force]

Options:
  --name         Remote name
  --keep-files   Only unregister; leave apps/<name>/ on disk
  --force        Allow deleting apps/<name> even if already removed from remotes.json
`;

const name = arg('--name');
const keepFiles = hasFlag('--keep-files');
const force = hasFlag('--force');

const nameErr = assertRemoteName(name);
if (nameErr) failUsage(USAGE, nameErr);

const config = readRemotesConfig(root);
const index = config.remotes.findIndex((remote) => remote.name === name);
const inRegistry = index !== -1;
const appExists = isCheckedOut(root, name);

if (!inRegistry && !force) {
  if (appExists) {
    failUsage(
      USAGE,
      `remote "${name}" not in remotes.json, but apps/${name} still exists.\n` +
        `  Stop Vite, then: bun run delete-remote --name ${name} --force`,
    );
  }
  failUsage(USAGE, `remote "${name}" not found in remotes.json`);
}

if (!inRegistry && force && !appExists) {
  failUsage(
    USAGE,
    `nothing to delete: "${name}" not in remotes.json and apps/${name} missing`,
  );
}

let removed = null;
if (inRegistry) {
  [removed] = config.remotes.splice(index, 1);
  writeRemotesConfig(root, config);
}

let deletedApp = false;
if (!keepFiles && appExists) {
  deletedApp = removeAppDir(root, name, { hintCommand: 'delete-remote' });
} else if (!keepFiles && !appExists && inRegistry) {
  console.warn(`Warning: apps/${name} not found — registry entry removed only`);
}

bunInstall(root);

console.log(`
Removed remote @react-mfe/${name}
  ${removed ? `port was ${removed.port}` : 'was already absent from remotes.json'}
  remotes.json ${inRegistry ? 'updated' : 'unchanged (orphan cleanup)'}
  apps/${name}/ ${deletedApp ? 'deleted' : keepFiles ? 'kept (--keep-files)' : 'was already missing'}

Shell / bun run dev now ignore this remote.
`);
