#!/usr/bin/env bun
/**
 * Remove a Module Federation remote from the monorepo registry.
 *
 * Usage:
 *   bun run delete-remote --name promotions
 *   bun run delete-remote --name promotions --keep-files   # registry only
 *   bun run delete-remote --name cart --force              # delete orphan apps/<name>
 *
 * What it does:
 * 1. Removes the entry from packages/mf-config/remotes.json (if present)
 * 2. Deletes apps/<name>/ (unless --keep-files), with Windows lock retries
 * 3. Runs bun install so workspace links refresh
 *
 * If EACCES: stop `bun run dev` / Vite, then re-run with --force.
 */
import {
  existsSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const root = resolve(import.meta.dirname, '..');

function arg(flag) {
  const index = process.argv.indexOf(flag);
  if (index === -1) return undefined;
  return process.argv[index + 1];
}

function hasFlag(flag) {
  return process.argv.includes(flag);
}

function usage(message) {
  if (message) console.error(`Error: ${message}\n`);
  console.error(`Usage:
  bun run delete-remote --name <kebab-name> [--keep-files] [--force]

Options:
  --name         Remote name
  --keep-files   Only unregister; leave apps/<name>/ on disk
  --force        Allow deleting apps/<name> even if already removed from remotes.json
`);
  process.exit(1);
}

function removeAppDir(appDir, name) {
  try {
    rmSync(appDir, {
      recursive: true,
      force: true,
      maxRetries: 10,
      retryDelay: 200,
    });
    return true;
  } catch (error) {
    const code = error?.code;
    if (code === 'EACCES' || code === 'EBUSY' || code === 'EPERM') {
      console.error(`
Failed to delete apps/${name} (${code}): folder locked.

Windows usually locks it while Vite / bun run dev is running.

1. Stop all app terminals (Ctrl+C on bun run dev)
2. Close files under apps/${name} in the editor if open
3. Re-run:
     bun run delete-remote --name ${name} --force
`);
      process.exit(1);
    }
    throw error;
  }
}

const name = arg('--name');
const keepFiles = hasFlag('--keep-files');
const force = hasFlag('--force');

if (!name || !/^[a-z][a-z0-9-]*$/.test(name)) {
  usage('--name required (kebab-case, e.g. promotions)');
}
if (name === 'shell') {
  usage('cannot delete shell — not a remote');
}

const remotesPath = join(root, 'packages/mf-config/remotes.json');
const appDir = join(root, 'apps', name);
const config = JSON.parse(readFileSync(remotesPath, 'utf8'));
const index = config.remotes.findIndex((remote) => remote.name === name);
const inRegistry = index !== -1;
const appExists = existsSync(appDir);

if (!inRegistry && !force) {
  if (appExists) {
    usage(
      `remote "${name}" not in remotes.json, but apps/${name} still exists.\n` +
        `  Stop Vite, then: bun run delete-remote --name ${name} --force`,
    );
  }
  usage(`remote "${name}" not found in remotes.json`);
}

if (!inRegistry && force && !appExists) {
  usage(`nothing to delete: "${name}" not in remotes.json and apps/${name} missing`);
}

let removed = null;
if (inRegistry) {
  [removed] = config.remotes.splice(index, 1);
  writeFileSync(remotesPath, `${JSON.stringify(config, null, 2)}\n`);
}

let deletedApp = false;
if (!keepFiles && appExists) {
  deletedApp = removeAppDir(appDir, name);
} else if (!keepFiles && !appExists && inRegistry) {
  console.warn(`Warning: apps/${name} not found — registry entry removed only`);
}

const install = spawnSync('bun', ['install'], {
  cwd: root,
  stdio: 'inherit',
  shell: true,
});
if (install.status !== 0) {
  console.error('bun install failed — remotes.json may already be updated');
  process.exit(install.status ?? 1);
}

console.log(`
Removed remote @react-mfe/${name}
  ${removed ? `port was ${removed.port}` : 'was already absent from remotes.json'}
  remotes.json ${inRegistry ? 'updated' : 'unchanged (orphan cleanup)'}
  apps/${name}/ ${deletedApp ? 'deleted' : keepFiles ? 'kept (--keep-files)' : 'was already missing'}

Shell / bun run dev now ignore this remote.
`);
