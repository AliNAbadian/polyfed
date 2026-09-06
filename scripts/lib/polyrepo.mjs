#!/usr/bin/env bun
/**
 * Shared helpers for polyrepo remote scripts.
 */
import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

export function workspaceRoot(fromDir = import.meta.dirname) {
  return resolve(fromDir, '..');
}

export function remotesPath(root) {
  return join(root, 'packages/mf-config/remotes.json');
}

export function readRemotesConfig(root) {
  return JSON.parse(readFileSync(remotesPath(root), 'utf8'));
}

export function appDir(root, name) {
  return join(root, 'apps', name);
}

export function isCheckedOut(root, name) {
  return existsSync(appDir(root, name));
}

export function parseRepo(repo) {
  if (!repo) return { kind: 'none' };
  if (repo.startsWith('template:')) {
    return { kind: 'template', id: repo.slice('template:'.length) };
  }
  return { kind: 'git', url: repo };
}

export function arg(flag) {
  const index = process.argv.indexOf(flag);
  if (index === -1) return undefined;
  return process.argv[index + 1];
}

export function hasFlag(flag) {
  return process.argv.includes(flag);
}
