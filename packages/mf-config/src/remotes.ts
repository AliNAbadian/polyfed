import navJson from '../nav.json' with { type: 'json' };

/** Browser-safe remote — no repo / entry / shared. */
export type RemoteNav = {
  name: string;
  title: string;
  blurb: string;
};

export type ShellDefinition = {
  name: string;
  port: number;
};

export const SHELL: ShellDefinition = navJson.shell;

export const REMOTES: RemoteNav[] = navJson.remotes;

export function remotePath(name: string): string {
  return `/${name}`;
}

export function findRemote(name: string): RemoteNav | undefined {
  return REMOTES.find((remote) => remote.name === name);
}
