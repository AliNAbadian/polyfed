#!/usr/bin/env bun
/**
 * Remove a local remote checkout only (keeps remotes.json).
 *
 * Usage:
 *   bun run drop-remote --name promotions
 */
import {
  arg,
  assertRemoteName,
  bunInstall,
  failUsage,
  isCheckedOut,
  removeAppDir,
  workspaceRoot,
} from './lib/polyrepo.mjs';

const root = workspaceRoot(import.meta.dirname);
const USAGE = `Usage:
  bun run drop-remote --name <kebab-name>

Removes apps/<name> only. Registry entry stays; shell can still load
entry.prod / remote URL. Stop Vite first on Windows.
`;

const name = arg('--name');
const nameErr = assertRemoteName(name);
if (nameErr) failUsage(USAGE, nameErr);
if (!isCheckedOut(root, name)) failUsage(USAGE, `apps/${name} not found`);

removeAppDir(root, name, { hintCommand: 'drop-remote' });
bunInstall(root);

console.log(`
Dropped local checkout apps/${name}.
remotes.json unchanged. Pull again: bun run pull-remote --name ${name}
`);
