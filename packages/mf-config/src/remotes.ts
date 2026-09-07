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

/** Default entry from port — must match Vite DEV_HOST (127.0.0.1). */
export function remoteEntryUrl(port: number): string {
  return `http://127.0.0.1:${port}/remoteEntry.js`;
}

export function findRemote(name: string): RemoteDefinition | undefined {
  return REMOTES.find((remote) => remote.name === name);
}

/** Prefer entry.dev, else port-based URL (browser-safe; no fs). */
export function browserRemoteEntry(remote: RemoteDefinition): string {
  return remote.entry?.dev ?? remoteEntryUrl(remote.port);
}
