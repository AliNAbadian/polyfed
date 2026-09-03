#!/usr/bin/env bun
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import remotes from '../packages/mf-config/remotes.json';

const projects = [
  `@react-mfe/${remotes.shell.name}`,
  ...remotes.remotes.map((remote) => `@react-mfe/${remote.name}`),
];

const result = spawnSync(
  'npx',
  [
    'nx',
    'run-many',
    '-t',
    'dev',
    '-p',
    projects.join(','),
    `--parallel=${projects.length}`,
  ],
  { cwd: resolve(import.meta.dirname, '..'), stdio: 'inherit', shell: true },
);

process.exit(result.status ?? 1);
