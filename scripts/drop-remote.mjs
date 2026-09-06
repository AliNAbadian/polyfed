#!/usr/bin/env bun
/**
 * Remove a local remote checkout only (keeps remotes.json).
 *
 * Usage:
 *   bun run drop-remote --name promotions
 */
import { existsSync, rmSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import {
  appDir,
  arg,
  workspaceRoot,
} from './lib/polyrepo.mjs';

const root = workspaceRoot(import.meta.dirname);

function usage(message) {
  if (message) console.error(`Error: ${message}\n`);
  console.error(`Usage:
  bun run drop-remote --name <kebab-name>

Removes apps/<name> only. Registry entry stays; shell can still load
entry.prod / remote URL. Stop Vite first on Windows.
`);
  process.exit(1);
}

const name = arg('--name');
if (!name || !/^[a-z][a-z0-9-]*$/.test(name)) {
  usage('--name required (kebab-case)');
}
if (name === 'shell') usage('cannot drop shell');

const dest = appDir(root, name);
if (!existsSync(dest)) {
  usage(`apps/${name} not found`);
}

try {
  rmSync(dest, {
    recursive: true,
    force: true,
    maxRetries: 10,
    retryDelay: 200,
  });
} catch (error) {
  const code = error?.code;
  if (code === 'EACCES' || code === 'EBUSY' || code === 'EPERM') {
    console.error(`
Failed to delete apps/${name} (${code}): folder locked.
Stop bun run dev / Vite, then retry.
`);
    process.exit(1);
  }
  throw error;
}

const install = spawnSync('bun', ['install'], {
  cwd: root,
  stdio: 'inherit',
  shell: true,
});
if (install.status !== 0) {
  console.error('bun install failed');
  process.exit(install.status ?? 1);
}

console.log(`
Dropped local checkout apps/${name}.
remotes.json unchanged. Pull again: bun run pull-remote --name ${name}
`);
