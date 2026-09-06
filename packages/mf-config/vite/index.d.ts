import type { AliasOptions, UserConfig } from 'vite';

export type RemoteEntryUrls = {
  dev?: string;
  prod?: string;
};

export type RemoteDefinition = {
  name: string;
  port: number;
  title: string;
  blurb: string;
  repo?: string;
  entry?: RemoteEntryUrls;
};

export type CreateRemoteViteConfigOptions = {
  appDir: string;
  name: string;
  port: number;
  exposes?: Record<string, string>;
};

export type CreateShellViteConfigOptions = {
  appDir: string;
};

export function createRemoteViteConfig(
  options: CreateRemoteViteConfigOptions,
): UserConfig;

export function createShellViteConfig(
  options: CreateShellViteConfigOptions,
): UserConfig;

export function federationShared(): Record<
  string,
  { singleton?: boolean; [key: string]: unknown }
>;

export function findRemote(name: string): RemoteDefinition | undefined;

export function loadRemotesConfig(): {
  shell: { name: string; port: number };
  remotes: RemoteDefinition[];
  shared: Record<string, { singleton?: boolean; [key: string]: unknown }>;
};

export function uiPackageAliases(appDirname: string): AliasOptions;

export function workspaceRootFromApp(appDirname: string): string;

export function remoteEntryUrl(port: number): string;

export function isRemoteCheckedOut(
  name: string,
  workspaceRoot: string,
): boolean;

export function resolveRemoteEntry(
  remote: RemoteDefinition,
  workspaceRoot: string,
): string;
