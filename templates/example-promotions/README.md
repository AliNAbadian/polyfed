# Remote app (polyrepo)

This folder is a **Module Federation remote**. It is not part of the platform
git history — developers clone it into `apps/<name>` with:

```sh
bun run pull-remote --name <name>
```

When you own this remote:

1. `git init` here (if scaffolded via `bun run create-remote`)
2. Push to a private repo your team can access
3. Set `"repo": "<git-url>"` on the remote entry in platform `packages/mf-config/remotes.json`
4. Optionally set `"entry": { "prod": "https://…/remoteEntry.js" }` for teammates who do not check out this app

Depends on platform workspace packages (`@react-mfe/ui`, `@react-mfe/auth`, `@react-mfe/mf-config`) via Bun workspaces when checked out under the platform root.
