import type { ReactNode } from 'react';

export const REPO_URL = 'https://github.com/AliNAbadian/polyfed';

export const INSTALL_COMMAND =
  'git clone https://github.com/AliNAbadian/polyfed.git && bun install && bun run dev';

export const META = {
  title: 'Polyfed — Module Federation without the megarepo',
  description:
    'Clone the platform. Pull only the remotes you own. Federate the rest from prod URLs — Nx, Vite, Bun.',
} as const;

export const NAV_LINKS = [
  { href: '#install', label: 'Install' },
  { href: '#problem', label: 'Why' },
  { href: '#model', label: 'How' },
  { href: '#walkthrough', label: 'Try' },
  { href: '#registry', label: 'Registry' },
  { href: '#stack', label: 'CLI' },
] as const;

export const HERO = {
  eyebrow: 'open source · MIT · Nx + Vite Module Federation',
  lead: 'Stop cloning remotes you cannot open.',
  trail:
    'Keep a thin platform repo. Pull the micro-frontends your team owns. Load the rest from prod.',
  body: 'Polyfed is polyrepo Module Federation for React: one shell, shared packages, and remotes that stay their own git repos — with honest entry.dev / entry.prod / null.',
  primaryCta: 'Clone on GitHub',
  secondaryCta: 'See the CLI path',
} as const;

export const INSTALL = {
  index: '1.0 Install →',
  lead: 'One clone gets you running.',
  trail: 'Remotes arrive later — only when you pull them.',
  description:
    'Paste the command. Shell opens on 127.0.0.1:4200. Checked-out remotes join the same Vite graph. No remote source required to start the host.',
  note: 'optional docs site: bun run www → 127.0.0.1:4300',
} as const;

export const PROBLEM = {
  index: '2.0 Why →',
  lead: 'Fat MFE monorepos punish permissions.',
  trail: 'Disk, CI, and access all grow with every remote you add.',
  description:
    'If your team should not see billing source, they should not clone billing. Polyfed keeps federation — drops the forced megarepo.',
} as const;

export const PROBLEM_ROWS = [
  {
    monorepo: 'Everyone clones every remote — including private domains.',
    polyfed: 'Pull only remotes your credentials allow.',
  },
  {
    monorepo: 'One CI graph waits on apps nobody on the PR touched.',
    polyfed: 'Each remote ships on its own pipeline and schedule.',
  },
  {
    monorepo: 'Auth and UI packages get copied or drift per app.',
    polyfed: 'Platform packages stay the shared trunk.',
  },
  {
    monorepo: 'Missing remote folder breaks the whole workspace.',
    polyfed: 'Missing checkout → prod URL or offline UI — not a dead build.',
  },
] as const;

export const MODEL = {
  index: '3.0 How →',
  lead: 'Three contracts. No magic.',
  trail: 'Platform git, remote repos, and an entry that tells the truth.',
  description:
    'The shell always federates. What changes is where the bytes come from: your disk, a deployed remoteEntry.js, or nowhere (offline).',
} as const;

export const MODEL_SNIPPETS = [
  {
    title: 'Platform git',
    body: 'Shell, shared auth/UI, registry, and polyrepo scripts. This is the repo everyone clones.',
    sample: 'apps/shell · packages/* · remotes.json',
  },
  {
    title: 'Remote repos',
    body: 'Each micro-frontend is its own git. Checkout under apps/ only when you work on it.',
    sample: 'bun run pull-remote --name promotions',
  },
  {
    title: 'Honest entries',
    body: 'Local Vite when the folder exists. Else entry.prod. Else null — shell shows offline, not a crash.',
    sample: 'resolveRemoteEntry(remote, root) // string | null',
  },
] as const;

export const WALKTHROUGH = {
  index: '4.0 Try →',
  lead: 'From clone to federated shell.',
  trail: 'Four commands. Same path your team runs on day one.',
  description:
    'Scrub the session. The URL tracks ?step=. Toggle Local / Prod / Offline to see how entries resolve — no live iframe required.',
} as const;

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
    body: 'You get the shell, packages, and registry. Remote apps are not in this git.',
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
    title: 'Pull what you own',
    body: 'Registry holds the git URL. Checkout lands under apps/ — skip remotes you cannot access.',
    command: 'bun run pull-remote --name promotions',
    lines: [
      { kind: 'in', text: 'bun run pull-remote --name promotions' },
      { kind: 'out', text: 'Cloning promotions → apps/promotions' },
      { kind: 'ok', text: 'Checked out. Port 5103 (entry.dev).' },
      {
        kind: 'dim',
        text: '# targeting still missing — entry.prod or offline',
      },
    ] satisfies TerminalLine[],
  },
  {
    id: 'dev',
    title: 'Start the dock',
    body: 'One command: shell on 4200 plus every checked-out remote. Docs site stays optional on 4300.',
    command: 'bun run dev',
    lines: [
      { kind: 'in', text: 'bun run dev' },
      {
        kind: 'out',
        text: 'Polyrepo: shell + 1 local remote(s). Not checked out: targeting',
      },
      { kind: 'ok', text: 'Shell http://127.0.0.1:4200/ — Ctrl+C to stop.' },
      { kind: 'dim', text: 'Starting continuous Vite (does not exit).' },
    ] satisfies TerminalLine[],
  },
  {
    id: 'federate',
    title: 'Federate the rest',
    body: 'Running remotes load from localhost. Missing ones use prod or show offline in the sider — with the pull hint.',
    command: 'open http://127.0.0.1:4200',
    lines: [
      { kind: 'dim', text: '# shell injects __MFE_REMOTE_ENTRIES__' },
      {
        kind: 'out',
        text: 'promotions → http://127.0.0.1:5103/remoteEntry.js',
      },
      { kind: 'out', text: 'targeting  → null' },
      {
        kind: 'err',
        text: 'sider: targeting offline — bun run pull-remote --name targeting',
      },
    ] satisfies TerminalLine[],
  },
] as const;

export type WalkthroughStep = (typeof WALKTHROUGH_STEPS)[number];

export const REGISTRY = {
  index: '5.0 Registry →',
  lead: 'Two files. Two audiences.',
  trail: 'Vite and scripts see git URLs. The browser never does.',
  description:
    'remotes.json is the full contract. nav.json is the shell-safe slice — names and labels only — so source repo URLs stay out of the client bundle.',
} as const;

export const REGISTRY_ROWS = [
  {
    piece: 'remotes.json',
    who: 'Vite + scripts',
    what: 'Ports, repo URLs, entry.dev / entry.prod, shared singletons.',
  },
  {
    piece: 'nav.json',
    who: 'Shell React',
    what: 'Name, title, blurb — nothing a browser should not see.',
  },
  {
    piece: 'pull / drop / delete',
    who: 'Polyrepo CLI',
    what: 'Checkout, remove local folder, or unregister from the registry.',
  },
] as const;

export const STACK = {
  index: '6.0 CLI →',
  lead: 'Commands you will actually run.',
  trail: 'Dev, preview, pull, scaffold — same root package.json.',
  description:
    'Auth and axios stay platform singletons. bun run dev is shell + checkouts only. bun run preview serves the built dock. www never rides along.',
} as const;

export const STACK_COMMANDS = [
  { label: 'Dev — shell + checkouts', command: 'bun run dev' },
  { label: 'Preview — built shell + remotes', command: 'bun run preview' },
  { label: 'Pull one remote', command: 'bun run pull-remote --name <remote>' },
  {
    label: 'Scaffold a remote',
    command: 'bun run create-remote --name=orders --port=5104',
  },
] as const;

export const CASE = {
  index: '7.0 Proof →',
  lead: 'What you can show in a review.',
  trail: 'Claims tied to paths — not adjectives.',
  description:
    'Use these lines in a README, LinkedIn post, or architecture walkthrough. Each point points at code you can open.',
} as const;

export const CASE_POINTS = [
  {
    term: 'Shared host',
    detail:
      'Shell owns auth and chrome. Remotes stay product surfaces — not mini platforms.',
    evidence: 'packages/auth · packages/ui · apps/shell',
  },
  {
    term: 'Selective source',
    detail:
      'Teams clone what they ship. Other domains load from deployed remoteEntry.js.',
    evidence: 'bun run pull-remote --name <remote>',
  },
  {
    term: 'Registry chrome',
    detail:
      'Routes and sider come from the registry. No hand-wired Module Federation map per remote.',
    evidence: 'nav.json → shell routes / sider',
  },
  {
    term: 'Honest offline',
    detail:
      'No checkout and no prod URL? Shell marks the remote offline and tells you how to pull.',
    evidence: 'resolveRemoteEntry → null',
  },
] as const;

export const CTA = {
  lead: 'Clone the platform.',
  trail: 'Pull remotes when you need them.',
  body: 'Live federation runs in the shell on 4200. This page is the story — second terminal for bun run www if you want the docs surface.',
  primaryCta: 'Open the repository',
  secondaryCta: 'Replay the session',
  index: '8.0 Next →',
} as const;

export const FOOTER = {
  blurb: 'Polyfed — Module Federation without the megarepo.',
  meta: 'v0.1.0 · MIT · story site, not an MF remote',
} as const;

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
