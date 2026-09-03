# Nx React Module Federation Template

<a alt="Nx logo" href="https://nx.dev" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="45"></a>

A production-ready monorepo template for building **Vite-powered React Module Federation** apps with Nx - the fastest
way to split a frontend into independently deployable micro-frontends without giving up a great monorepo developer
experience.


🚀 If you haven't connected to Nx Cloud yet, [complete your setup here](https://cloud.nx.app/get-started). Get faster builds with remote caching, distributed task execution, and self-healing CI. [See how your workspace can benefit](#nx-cloud).


## Quick Start

```sh
# Create a new workspace from this template
npx create-nx-workspace@latest my-workspace --template nrwl/react-mfe-template

cd my-workspace

# Serve the shell (host) on its own - loads providers at runtime from localhost
npx nx run @react-mfe/shell:dev

# Serve a provider - the shell comes along automatically (dependsOn shell:dev),
# so you can browse http://localhost:4200 and see the provider federated in,
# or hit the provider's own port to see it standalone.
npx nx run @react-mfe/shop:dev
npx nx run @react-mfe/cart:dev

# Or bring up everything at once (the shared shell:dev starts only once)
npx nx run-many -t dev -p shop cart

# Build all apps in parallel for production
npx nx run-many -t build --parallel=3
```

When everything is running:

- Shell (host): http://localhost:4200 (Home / Shop / Cart routes)
- Shop provider standalone: http://localhost:5101
- Cart provider standalone: http://localhost:5102

The `dev` target on each provider declares `dependsOn: ["shell:dev"]`, so
`nx dev shop`, `nx dev cart`, or `nx run-many -t dev -p shop cart` all boot the
shell too - no need to start it in a separate terminal.

---

## What's Inside

```
apps/
  shell/    - Consumer (host) - TanStack Router app; one route per federated module
  shop/     - Provider (remote) - product catalog with category filter, port 5101
  cart/     - Provider (remote) - order summary with quantities + totals, port 5102
packages/
  ui/       - Shared library (@react-mfe/ui) - theme tokens, sample catalog,
              ProductCard / ProductGrid / StarRating / Badge - imported by every app
```

### Tags

Each project carries module-boundary tags for future `@nx/enforce-module-boundaries` lint rules:

| Project | Tags                       |
| ------- | -------------------------- |
| shell   | scope:shell, type:consumer |
| shop    | scope:shop, type:provider  |
| cart    | scope:cart, type:provider  |
| ui      | scope:shared, type:ui      |

---

## How Module Federation Works Here

This template uses **Vite + @module-federation/vite** (the `@nx/react:consumer` and `@nx/react:provider` generators,
NOT the deprecated `host`/`remote` generators removed in Nx 24).

### Dynamic federation (no build-time remote list)

The shell does not list remotes at build time. Instead `apps/shell/src/mf.ts` calls `registerRemotes()` at runtime
with each provider's URL. This means:

- Providers can be deployed independently - the shell picks them up from their URL, no rebuild needed.
- Adding a new provider = add one entry to `PROVIDERS` in `mf.ts` and deploy.

### Routing: one page per federated module

The shell is a **TanStack Router** app (`apps/shell/src/router.tsx`, code-based -
no codegen or extra vite plugin). The root route renders the shell chrome
(`Layout.tsx` - nav bar + `<Outlet />`); each child route maps a path to a
federated module's page:

| Route   | Renders                                      |
| ------- | -------------------------------------------- |
| `/`     | Home overview with links to each module      |
| `/shop` | `shop` provider's `App`, lazy-loaded over MF |
| `/cart` | `cart` provider's `App`, lazy-loaded over MF |

Add a provider -> add one entry to `PROVIDERS` in `mf.ts` and one `createRoute`
in `router.tsx`.

### How the shell loads a provider

```
1. Browser loads shell -> index.html
2. shell/src/index.ts boots @module-federation/runtime, calls registerRemotes()
3. The /shop route (pages.tsx) calls lazyProvider('shop', 'App')
4. Runtime fetches http://localhost:5101/remoteEntry.js (ESM)
5. Shared react/react-dom singleton negotiation happens automatically
6. <ShopApp /> renders inside a Suspense + ProviderBoundary
   (boundary catches network errors gracefully)
```

### Federation artifacts emitted per build

| App   | Key output files            | Role           |
| ----- | --------------------------- | -------------- |
| shell | `dist/assets/hostInit-*.js` | Consumer init  |
| shop  | `dist/remoteEntry.js`       | Provider entry |
| cart  | `dist/remoteEntry.js`       | Provider entry |

### Shared lib (@react-mfe/ui)

Every app imports from `@react-mfe/ui` (resolved via `vite.resolve.alias` at build time): the providers pull
`ProductCard` / `ProductGrid` / the sample catalog, the shell pulls `Badge`. The lib's `index.ts` also side-effect
imports `theme.css`, so the shared design tokens load in whichever app imports the lib - no per-app stylesheet.
The lib ships its source directly - no separate build step needed since each app bundles it with its chunks.

---

## Adding More Providers

```sh
# Generate a new provider wired to the shell consumer
npx nx g @nx/react:provider apps/checkout --bundler=vite --consumer=shell --port=5103

# Then add it to the shell's runtime registry in apps/shell/src/mf.ts:
# { alias: 'checkout', name: 'checkout', entry: 'http://localhost:5103/remoteEntry.js' }
```

---

## Nx Cloud

Connect this workspace to Nx Cloud to get:

- **Remote cache** - task outputs (builds, tests) are cached and shared across every machine and CI agent.
  A build that takes 60 s locally runs in under 2 s after the first hit.
- **Distributed task execution** - Nx Cloud splits `nx run-many` across multiple agents, running tasks in
  parallel across machines rather than sequentially on one.
- **Self-healing CI** - flaky tasks are detected, automatically retried, and flagged so you fix root causes
  instead of rerunning pipelines.

```sh
npx nx connect
```

Or go directly to: https://cloud.nx.app/get-started

---

## Install Nx Console

Nx Console is an editor extension that enriches your developer experience. It lets you run tasks, generate code, and improves code autocompletion in your IDE. It is available for VSCode and IntelliJ.

[Install Nx Console &raquo;](https://nx.dev/docs/getting-started/editor-setup?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## 🔗 Learn More

- [Nx Documentation](https://nx.dev/docs)
- [Crafting Your Workspace Tutorial](https://nx.dev/docs/getting-started/tutorials/crafting-your-workspace)
- [Module Boundaries](https://nx.dev/docs/features/enforce-module-boundaries)
- [Module Federation Overview](https://nx.dev/docs/technologies/module-federation/concepts/nx-module-federation-technical-overview)
- [Vite](https://nx.dev/docs/technologies/build-tools/vite)
- [Nx Cloud](https://nx.dev/nx-cloud)

## 💬 Community

Join the Nx community:

- [Discord](https://go.nx.dev/community)
- [X (Twitter)](https://twitter.com/nxdevtools)
- [LinkedIn](https://www.linkedin.com/company/nrwl)
- [YouTube](https://www.youtube.com/@nxdevtools)
- [Blog](https://nx.dev/blog)
