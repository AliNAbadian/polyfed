import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import remotesJson from '../remotes.json' with { type: 'json' };

export type RemoteEntryUrls = {
  dev?: string;
  prod?: string;
};

export type RemoteDefinition = {
  name: string;
  port: number;
  title: string;
  blurb: string;
  /** Git clone URL, or `template:<folder>` under templates/ */
  repo?: string;
  entry?: RemoteEntryUrls;
};

export type ShellDefinition = {
  name: string;
  port: number;
};

export const SHELL: ShellDefinition = remotesJson.shell;

export const REMOTES: RemoteDefinition[] = remotesJson.remotes;

export const MF_SHARED = remotesJson.shared;

export function remotePath(name: string): string {
  return `/${name}`;
}

/** Default localhost entry from port. Prefer resolveRemoteEntry for shell. */
export function remoteEntryUrl(port: number): string {
  return `http://localhost:${port}/remoteEntry.js`;
}

export function findRemote(name: string): RemoteDefinition | undefined {
  return REMOTES.find((remote) => remote.name === name);
}

/** True when apps/<name> exists on disk (local polyrepo checkout). */
export function isRemoteCheckedOut(
  name: string,
  workspaceRoot = process.cwd(),
): boolean {
  return existsSync(resolve(workspaceRoot, 'apps', name));
}

/**
 * Shell MF entry URL: local checkout → entry.dev / localhost;
 * otherwise entry.prod if set, else still entry.dev / localhost.
 */
export function resolveRemoteEntry(
  remote: RemoteDefinition,
  workspaceRoot = process.cwd(),
): string {
  const checkedOut = isRemoteCheckedOut(remote.name, workspaceRoot);
  if (checkedOut) {
    return remote.entry?.dev ?? remoteEntryUrl(remote.port);
  }
  if (remote.entry?.prod) {
    return remote.entry.prod;
  }
  return remote.entry?.dev ?? remoteEntryUrl(remote.port);
}

export function allDevProjectNames(workspaceRoot = process.cwd()): string[] {
  return [
    `@react-mfe/${SHELL.name}`,
    ...REMOTES.filter((remote) =>
      isRemoteCheckedOut(remote.name, workspaceRoot),
    ).map((remote) => `@react-mfe/${remote.name}`),
  ];
}
