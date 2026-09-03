import remotesJson from '../remotes.json' with { type: 'json' };

export type RemoteDefinition = {
  name: string;
  port: number;
  title: string;
  blurb: string;
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

export function remoteEntryUrl(port: number): string {
  return `http://localhost:${port}/remoteEntry.js`;
}

export function findRemote(name: string): RemoteDefinition | undefined {
  return REMOTES.find((remote) => remote.name === name);
}

export function allDevProjectNames(): string[] {
  return [
    `@react-mfe/${SHELL.name}`,
    ...REMOTES.map((remote) => `@react-mfe/${remote.name}`),
  ];
}
