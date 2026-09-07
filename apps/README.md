# apps/

**Polyrepo layout**

| Path | In platform git? | Role |
| ---- | ---------------- | ---- |
| `shell/` | yes | Host / consumer |
| `<remote>/` | no | Separate git repo, optional local checkout |

## Workflow

```sh
# Clone remotes you have permission for (from remotes.json "repo")
bun run pull-remote --name promotions
bun run pull-remote --all

# Dev: shell + only folders that exist under apps/
bun run dev

# Remove local checkout only (registry stays)
bun run drop-remote --name promotions

# Scaffold new remote locally, then push its own repo
bun run create-remote --name=orders --port=5104
```

Registry: `packages/mf-config/remotes.json` (`repo`, `entry.dev`, `entry.prod`).

Platform `.gitignore` hides remotes from git. `.nxignore` re-includes them for the Nx project graph only.
