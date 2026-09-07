# Sale platform (polyrepo MFE)

Nx + Bun + Vite **Module Federation** platform.

- **This repo (platform):** `apps/shell`, `packages/*`, `tools/*`, registry
- **Remotes:** each its **own git repo**, optional checkout under `apps/<name>`

Developers clone platform only, then pull remotes they have permission for — not 50 remote folders by default.

## Quick start

```sh
bun install

# Optional: pull remotes listed in remotes.json
bun run pull-remote --name promotions
# or: bun run pull-remote --all

# Shell + only checked-out remotes
bun run dev
```

- Shell: http://127.0.0.1:4200
- Each local remote: `http://127.0.0.1:<port>` from `packages/mf-config/remotes.json` (port owned by Vite config / registry — not npm scripts)

## Polyrepo commands

| Command | Effect |
| ------- | ------ |
| `bun run pull-remote --name <n>` | Clone / copy remote into `apps/<n>` |
| `bun run pull-remote --all` | Pull every registry remote |
| `bun run drop-remote --name <n>` | Delete local `apps/<n>` only |
| `bun run create-remote --name=…` | Scaffold + register (then push own git repo) |
| `bun run delete-remote --name <n>` | Unregister + delete local folder |

`repo` in remotes.json:

- Git URL → `git clone`
- `template:<folder>` → copy from `templates/<folder>` (seed for demos)

`entry.dev` / `entry.prod`: shell uses local URL when `apps/<name>` exists; otherwise `entry.prod` if set.

## Layout

```
apps/
  shell/                 # host (in platform git)
  README.md
  <remote>/              # gitignored — pull-remote / create-remote
packages/
  mf-config/             # remotes.json + vite factories
  ui/  auth/
tools/workspace-plugin/  # nx g …:remote
templates/               # template:* seeds for pull-remote
```

## Auth

Shell gates with `@react-mfe/auth` (OIDC). See `apps/shell/.env.example`.

## Nx Cloud / Console

```sh
npx nx connect
```

[Nx Console](https://nx.dev/docs/getting-started/editor-setup) for IDE tasks.

## Learn more

- [Nx](https://nx.dev/docs)
- [Module Federation](https://nx.dev/docs/technologies/module-federation/concepts/nx-module-federation-technical-overview)
- [Vite](https://nx.dev/docs/technologies/build-tools/vite)
