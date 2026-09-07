# Polyfed

**Polyrepo Module Federation for React** — Nx · Vite · Bun · Ant Design

> Clone the **platform**. Pull only the remotes you have permission for. Run the shell against local checkouts or deployed `remoteEntry.js` URLs.

[![Nx](https://img.shields.io/badge/Nx-23-143055?logo=nx)](https://nx.dev)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite)](https://vite.dev)
[![Module Federation](https://img.shields.io/badge/Module%20Federation-Vite-blue)](https://module-federation.io)
[![Bun](https://img.shields.io/badge/Bun-workspaces-fbf0df?logo=bun)](https://bun.sh)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)

---

## Why this exists

Classic MFE monorepos force every developer to clone **every** remote. With dozens of teams and private repos, that breaks:

- **Permission model** — not everyone should have source for every domain
- **Clone time / disk** — megarepos that nobody wants to sync
- **Ownership** — remotes should ship and version on their own release cadence

**Polyfed** keeps a thin **platform** git repo (shell + shared packages + tooling) and treats each micro-frontend as its **own git repository**. Developers pull remotes on demand. The shell still federates them at runtime.

| Approach | Pain |
| -------- | ---- |
| One giant monorepo | Everyone clones everything |
| Git submodules | Awkward DX, easy to desync |
| **Polyfed** | Platform + optional local remotes + URL registry |

---

## Suggested public names

| Use | Name |
| --- | ---- |
| **GitHub repo** | `polyfed` |
| **LinkedIn / talk title** | Polyfed: Polyrepo Module Federation for React |
| **Tagline** | Pull the remotes you own. Federate the rest. |

Alternatives if `polyfed` is taken: `polyrepo-mfe`, `on-demand-federation`, `nx-vite-polyfed`.

---

## Architecture at a glance

```
┌─────────────────────────────────────────────────────────────┐
│  PLATFORM REPO (this git)                                   │
│  apps/shell · packages/{mf-config,ui,auth} · tools · scripts│
└────────────────────────────┬────────────────────────────────┘
                             │ remotes.json registry
         ┌───────────────────┼───────────────────┐
         ▼                   ▼                   ▼
   git clone A         git clone B          entry.prod URL
   apps/orders/        apps/billing/        (no local folder)
         │                   │                   │
         └───────── Module Federation ───────────┘
                             │
                      apps/shell (host)
```

**Single registry:** `packages/mf-config/remotes.json`  
**Browser-safe slice:** `packages/mf-config/nav.json` (name / title / blurb only — no git URLs in the client bundle)

Shell routes, sider, home cards, and Vite `federation.remotes` all derive from the registry. You do **not** hand-edit the router for each new remote.

---

## Stack

| Layer | Choice |
| ----- | ------ |
| Workspace | [Nx](https://nx.dev) + [Bun](https://bun.sh) workspaces |
| Bundler / MF | [Vite](https://vite.dev) + [@module-federation/vite](https://module-federation.io) |
| UI | React 19, Ant Design, Tailwind CSS v4 (shared package) |
| Routing | TanStack Router (shell) |
| Auth | OIDC (`oidc-client`) + shared Axios client (`@react-mfe/auth`) |
| Remote scaffold | Local Nx generator `@react-mfe/workspace-plugin:remote` |

---

## Quick start

```sh
git clone https://github.com/<you>/polyfed.git
cd polyfed
bun install

# Optional: pull remotes you can access
bun run pull-remote --name promotions
# bun run pull-remote --all

cp apps/shell/.env.example apps/shell/.env   # OIDC can stay "disabled" locally

bun run dev
```

| App | URL |
| --- | --- |
| Shell (host) | http://127.0.0.1:4200 |
| Each checked-out remote | http://127.0.0.1:&lt;port&gt; from `remotes.json` |

Wait until Vite prints ready for **shell and every checked-out remote**. Opening a federated route before that remote’s port is up causes `RUNTIME-008` (missing `remoteEntry.js`).

Dev host is standardized on **`127.0.0.1`** (not `localhost`) so Vite, MF entry URLs, and OIDC redirect URIs stay aligned.

---

## Polyrepo commands

| Command | What it does |
| ------- | ------------ |
| `bun run pull-remote --name <n>` | Clone (or copy `template:…`) into `apps/<n>` |
| `bun run pull-remote --all` | Pull every remote listed in the registry |
| `bun run pull-remote --name <n> --force` | Replace existing checkout |
| `bun run drop-remote --name <n>` | Delete local folder only — registry stays |
| `bun run create-remote --name=… --port=…` | Scaffold app + update registry (Nx generator) |
| `bun run delete-remote --name <n>` | Unregister + delete local folder |
| `bun run dev` | Shell + **only checked-out** remotes |

Shared helpers live in `scripts/lib/polyrepo.mjs` (registry IO, Windows-safe deletes, `bun install`).

### `repo` field

```json
"repo": "https://github.com/org/my-remote.git"
"repo": "template:example-promotions"
```

- Git URL → `git clone` into `apps/<name>`
- `template:<folder>` → copy from `templates/<folder>` (demo seeds without a remote git repo yet)

### `entry.dev` / `entry.prod`

| Situation | Shell behavior |
| --------- | -------------- |
| `apps/<name>` exists | Load `entry.dev` (local Vite) |
| No checkout, `entry.prod` set | Load deployed `remoteEntry.js` |
| No checkout, empty prod | Remote marked **offline** — hint to `pull-remote` |

---

## Repository layout

```
polyfed/
├── apps/
│   ├── shell/              # Host — committed to platform git
│   ├── README.md
│   └── <remote>/           # Gitignored — pull / create only
├── packages/
│   ├── mf-config/          # remotes.json, nav.json, Vite factories
│   ├── ui/                 # Shared UI + Tailwind entry
│   └── auth/               # OIDC gate + getApiClient()
├── tools/workspace-plugin/ # nx g …:remote
├── templates/              # template:* seeds for pull-remote
└── scripts/                # pull / drop / delete / dev-all
```

Platform `.gitignore` ignores `/apps/*` except `shell`.  
`.nxignore` re-includes those folders so Nx still sees checked-out remotes on the project graph.

---

## Adding a remote (happy path)

```sh
# 1. Scaffold into apps/<name> + remotes.json + nav.json
bun run create-remote --name=orders --port=5105

# 2. Own git repo for the remote
cd apps/orders
git init && git add . && git commit -m "chore: scaffold orders remote"
git remote add origin https://github.com/org/orders-remote.git
git push -u origin main
cd ../..

# 3. Point platform registry at it
#    packages/mf-config/remotes.json → "repo": "https://github.com/org/orders-remote.git"

# 4. Teammates with access
bun run pull-remote --name orders
bun run dev
```

Exposed module is always `./App`. Import shared CSS on that file (shell loads the expose, not `bootstrap.tsx`):

```ts
import '@react-mfe/ui/styles/tailwind.css';
```

---

## Auth & API

Shell only:

```ts
initAuth({ ... });
<AuthGate>...</AuthGate>
```

Remotes:

```ts
import { getApiClient } from '@react-mfe/auth';

const api = getApiClient();
await api.get('/orders');
```

Session is shared via `localStorage` + `globalThis.__MFE_AUTH__`.  
`oidc-client` and `axios` are MF **singletons** in `remotes.json` → `shared`.

Env (Vite cwd = shell):

```sh
cp apps/shell/.env.example apps/shell/.env
```

| Variable | Purpose |
| -------- | ------- |
| `VITE_OIDC_AUTHORITY` | IdP issuer, or `disabled` to skip the gate |
| `VITE_OIDC_CLIENT_ID` | SPA client id, or `disabled` |
| `VITE_OIDC_SCOPE` | Optional scopes |
| `VITE_API_BASE_URL` | Axios `baseURL` |

Register at the IdP:

- `http://127.0.0.1:4200/auth/callback`
- `http://127.0.0.1:4200/silent-renew.html`

---

## Registry split (nav vs remotes)

| File | Consumed by | Contains |
| ---- | ----------- | -------- |
| `remotes.json` | Vite (Node), scripts, generator | ports, `repo`, `entry`, `shared` |
| `nav.json` | Shell React (browser) | `name`, `title`, `blurb` (+ shell name/port) |

Create/delete flows rewrite **both**. Prefer not to hand-edit `nav.json` alone.

---

## Design principles

1. **Platform is thin** — shell, shared UI/auth/config, generators, scripts  
2. **Remotes are products** — own git history, own deploy of `remoteEntry.js`  
3. **Registry is the contract** — one JSON drives MF + navigation  
4. **Checkout is optional** — local Vite or `entry.prod`  
5. **Permissions follow git** — no pull access, no source on disk  

---

## Use this as a case study

**Problem:** multi-team MFE with private remotes and a shared host.  
**Constraint:** developers must not clone every remote.  
**Solution:** polyrepo remotes + registry-driven Module Federation + on-demand `pull-remote`.

Talking points for LinkedIn / portfolio:

- Separated **platform ownership** from **domain remotes**
- Kept DX close to a monorepo (`bun run dev`, shared packages) without the clone tax
- Made unavailable remotes explicit (offline UI + honest entry resolution) instead of opaque MF fetch failures

---

## Scripts reference

| npm script | Implementation |
| ---------- | -------------- |
| `dev` | `scripts/dev-all.mjs` — `nx run-many -t dev` for shell + checkouts |
| `create-remote` | `nx g @react-mfe/workspace-plugin:remote` |
| `pull-remote` | `scripts/pull-remote.mjs` |
| `drop-remote` | `scripts/drop-remote.mjs` |
| `delete-remote` | `scripts/delete-remote.mjs` |

---

## Learn more

- [Nx](https://nx.dev/docs)
- [Module Federation](https://module-federation.io)
- [Vite](https://vite.dev)
- [TanStack Router](https://tanstack.com/router)

---

## License

MIT — use, fork, and adapt for your platform.
