#!/usr/bin/env bun
import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import {
  isCheckedOut,
  readRemotesConfig,
  workspaceRoot,
} from './lib/polyrepo.mjs';

const root = workspaceRoot(import.meta.dirname);
const remotes = readRemotesConfig(root);

if (!existsSync(resolve(root, 'apps', remotes.shell.name))) {
  console.error('apps/shell missing — platform checkout broken');
  process.exit(1);
}

const projects = [
  `@react-mfe/${remotes.shell.name}`,
  ...remotes.remotes
    .filter((remote) => isCheckedOut(root, remote.name))
    .map((remote) => `@react-mfe/${remote.name}`),
];

const missing = remotes.remotes
  .filter((remote) => !isCheckedOut(root, remote.name))
  .map((remote) => remote.name);

if (missing.length) {
  console.log(
    `Preview: shell + ${projects.length - 1} remote(s). Not checked out: ${missing.join(', ')}`,
  );
  console.log('  pull: bun run pull-remote --name <remote>  (or --all)\n');
}

console.log(
  `Previewing built apps (does not exit). Shell http://127.0.0.1:${remotes.shell.port}/ — Ctrl+C to stop.\n`,
);
console.log('  Need dist first? bun run build\n');

const result = spawnSync(
  'npx',
  [
    'nx',
    'run-many',
    '-t',
    'preview',
    '-p',
    projects.join(','),
    `--parallel=${projects.length}`,
    '--output-style=stream',
  ],
  { cwd: root, stdio: 'inherit', shell: true },
);

process.exit(result.status ?? 1);
