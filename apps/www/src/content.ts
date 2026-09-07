import type { ReactNode } from 'react';

export const REPO_URL =
  'https://github.com/AliNAbadian/polyfed';

export const INSTALL_COMMAND =
  'git clone https://github.com/AliNAbadian/polyfed.git && bun install && bun run dev';

export const NAV_LINKS = [
  { href: '#install', label: 'Install' },
  { href: '#problem', label: 'Diff' },
  { href: '#model', label: 'API' },
  { href: '#walkthrough', label: 'Session' },
  { href: '#registry', label: 'Registry' },
  { href: '#stack', label: 'CLI' },
] as const;

export const PROBLEM_ROWS = [
  {
    monorepo: 'Every team clones every remote.',
    polyfed: 'Pull only remotes you own.',
  },
  {
    monorepo: 'One CI graph for unrelated apps.',
    polyfed: 'Remote repos ship on their own cadence.',
  },
  {
    monorepo: 'Auth and shared UI copied per app.',
    polyfed: 'Platform packages stay the shared trunk.',
  },
  {
    monorepo: 'Missing remote = broken build.',
    polyfed: 'Missing checkout → offline / prod entry.',
  },
] as const;

export const MODEL_SNIPPETS = [
  {
    title: 'Platform git',
    body: 'Shell host, shared packages, MF registry, polyrepo scripts.',
    sample: 'apps/shell  packages/*  remotes.json',
  },
  {
    title: 'Remote repos',
    body: 'Each federated app is its own git. Checkout is optional.',
    sample: 'bun run pull-remote --name promotions',
  },
  {
    title: 'Honest entries',
    body: 'Local Vite only when the folder exists. Else prod or null.',
    sample: 'resolveRemoteEntry(remote, root) // string | null',
  },
] as const;

export type TerminalLine =
  | { kind: 'in'; text: string }
  | { kind: 'out'; text: string }
  | { kind: 'ok'; text: string }
  | { kind: 'err'; text: string }
  | { kind: 'dim'; text: string };

export const WALKTHROUGH_STEPS = [
  {
    id: 'clone',
    title: 'Clone the platform',
    body: 'Get shell, packages, and the registry. Remotes are not in this git.',
    command: 'git clone https://github.com/AliNAbadian/polyfed.git',
    lines: [
      { kind: 'in', text: 'git clone https://github.com/AliNAbadian/polyfed.git' },
      { kind: 'out', text: 'Cloning into polyfed...' },
      { kind: 'ok', text: 'done.' },
      { kind: 'in', text: 'cd polyfed && bun install' },
      { kind: 'out', text: 'Resolved, downloaded and extracted' },
      { kind: 'ok', text: 'Saved lockfile' },
    ] satisfies TerminalLine[],
  },
  {
    id: 'pull',
    title: 'Pull remotes you own',
    body: 'Registry lists git URLs. Checkout only what you need under apps/.',
    command: 'bun run pull-remote --name promotions',
    lines: [
      { kind: 'in', text: 'bun run pull-remote --name promotions' },
      { kind: 'out', text: 'Cloning promotions → apps/promotions' },
      { kind: 'ok', text: 'Checked out. Port 5103 (entry.dev).' },
      { kind: 'dim', text: '# targeting still missing — will use entry.prod or offline' },
    ] satisfies TerminalLine[],
  },
  {
    id: 'dev',
    title: 'Run the dock',
    body: 'Shell on 4200 plus every checked-out remote. www stays optional on 4300.',
    command: 'bun run dev',
    lines: [
      { kind: 'in', text: 'bun run dev' },
      { kind: 'out', text: 'Polyrepo: shell + 1 local remote(s). Not checked out: targeting' },
      { kind: 'ok', text: 'Shell http://127.0.0.1:4200/ — Ctrl+C to stop.' },
      { kind: 'dim', text: 'Starting continuous Vite (does not exit).' },
    ] satisfies TerminalLine[],
  },
  {
    id: 'federate',
    title: 'Federate the rest',
    body: 'Shell loads local remotes when running. Missing checkout uses prod entry or shows offline.',
    command: 'open http://127.0.0.1:4200',
    lines: [
      { kind: 'dim', text: '# shell injects __MFE_REMOTE_ENTRIES__' },
      { kind: 'out', text: 'promotions → http://127.0.0.1:5103/remoteEntry.js' },
      { kind: 'out', text: 'targeting  → null' },
      { kind: 'err', text: 'sider: targeting offline — bun run pull-remote --name targeting' },
    ] satisfies TerminalLine[],
  },
] as const;

export type WalkthroughStep = (typeof WALKTHROUGH_STEPS)[number];

export const REGISTRY_ROWS = [
  {
    piece: 'remotes.json',
    who: 'Vite + scripts',
    what: 'Ports, repo URLs, entry.dev / entry.prod, shared singletons.',
  },
  {
    piece: 'nav.json',
    who: 'Shell React only',
    what: 'Name, title, blurb — no git URLs in the browser bundle.',
  },
  {
    piece: 'pull / drop / delete',
    who: 'Polyrepo toolkit',
    what: 'Checkout, remove local folder, or unregister entirely.',
  },
] as const;

export const STACK_COMMANDS = [
  { label: 'Dev (shell + checkouts)', command: 'bun run dev' },
  { label: 'Presentation site', command: 'bun run www' },
  { label: 'Pull one remote', command: 'bun run pull-remote --name <remote>' },
  { label: 'Scaffold remote', command: 'bun run create-remote --name=orders --port=5104' },
] as const;

export const CASE_POINTS = [
  {
    term: 'Host ownership',
    detail:
      'Platform owns the host and shared auth/UI — remotes stay thin product surfaces.',
    evidence: 'packages/auth · packages/ui · apps/shell',
  },
  {
    term: 'Selective clone',
    detail: 'Teams clone what they ship; everyone else federates from prod entries.',
    evidence: 'bun run pull-remote --name <remote>',
  },
  {
    term: 'Registry-driven chrome',
    detail: 'Sider and routes stay registry-driven — no hand-wired MF chrome.',
    evidence: 'nav.json → shell routes / sider',
  },
  {
    term: 'Honest offline',
    detail:
      'Offline-aware UI when a remote is not checked out and has no prod URL.',
    evidence: 'resolveRemoteEntry → null',
  },
] as const;

export type CodeLine = {
  n: number;
  highlight?: boolean;
  nodes: ReactNode;
};

/** Real resolveRemoteEntry API from packages/mf-config/vite/shared.mjs */
export const HERO_FILENAME = 'packages/mf-config/vite/shared.mjs';
export const HERO_LANG = 'JavaScript';
export const HERO_COPY = `export function resolveRemoteEntry(remote, workspaceRoot) {
  const checkedOut = isRemoteCheckedOut(remote.name, workspaceRoot);
  if (checkedOut) {
    return remote.entry?.dev || remoteEntryUrl(remote.port);
  }
  const prod =
    typeof remote.entry?.prod === 'string' ? remote.entry.prod.trim() : '';
  if (prod) return prod;
  return null; // shell shows offline UI
}`;
