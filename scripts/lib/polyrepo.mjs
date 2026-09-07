#!/usr/bin/env bun
/**
 * Remote toolkit — registry + disk helpers for polyrepo scripts.
 * # ponytail: no doctor/checkout UI here; add when pull failures need one message
 */
import { existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

export function workspaceRoot(fromDir = import.meta.dirname) {
  return resolve(fromDir, '..');
}

export function remotesPath(root) {
  return join(root, 'packages/mf-config/remotes.json');
}

export function readRemotesConfig(root) {
  return JSON.parse(readFileSync(remotesPath(root), 'utf8'));
}

export function writeRemotesConfig(root, config) {
  writeFileSync(remotesPath(root), `${JSON.stringify(config, null, 2)}\n`);
}

export function appDir(root, name) {
  return join(root, 'apps', name);
}

export function isCheckedOut(root, name) {
  return existsSync(appDir(root, name));
}

export function findRemote(config, name) {
  return config.remotes.find((remote) => remote.name === name);
}

export function parseRepo(repo) {
  if (!repo) return { kind: 'none' };
  if (repo.startsWith('template:')) {
    return { kind: 'template', id: repo.slice('template:'.length) };
  }
  return { kind: 'git', url: repo };
}

export function isValidRemoteName(name) {
  return Boolean(name && /^[a-z][a-z0-9-]*$/.test(name));
}

/** @returns {string|undefined} error message */
export function assertRemoteName(name) {
  if (!isValidRemoteName(name)) return 'name must be kebab-case (e.g. promotions)';
  if (name === 'shell') return 'cannot use shell — not a remote';
  return undefined;
}

/**
 * Delete apps/<name>. Exits process on Windows lock.
 * @returns {boolean} true if deleted
 */
export function removeAppDir(root, name, { hintCommand = 'drop-remote' } = {}) {
  const dest = appDir(root, name);
  if (!existsSync(dest)) return false;
  try {
    rmSync(dest, {
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

Stop bun run dev / Vite, close files under apps/${name}, then:
  bun run ${hintCommand} --name ${name}${hintCommand === 'delete-remote' ? ' --force' : ''}
`);
      process.exit(1);
    }
    throw error;
  }
}

export function bunInstall(root) {
  const install = spawnSync('bun', ['install'], {
    cwd: root,
    stdio: 'inherit',
    shell: true,
  });
  if (install.status !== 0) {
    console.error('bun install failed');
    process.exit(install.status ?? 1);
  }
}

export function arg(flag) {
  const index = process.argv.indexOf(flag);
  if (index === -1) return undefined;
  return process.argv[index + 1];
}

export function hasFlag(flag) {
  return process.argv.includes(flag);
}

export function failUsage(usageText, message) {
  if (message) console.error(`Error: ${message}\n`);
  console.error(usageText);
  process.exit(1);
}
