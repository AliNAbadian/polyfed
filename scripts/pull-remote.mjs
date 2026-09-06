#!/usr/bin/env bun
/**
 * Clone (or copy template) a remote into apps/<name>.
 *
 * Usage:
 *   bun run pull-remote --name promotions
 *   bun run pull-remote --all
 *   bun run pull-remote --name orders --force
 *
 * remotes.json "repo":
 *   - git URL → git clone
 *   - template:<folder> → copy templates/<folder> → apps/<name>
 */
import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import {
  appDir,
  arg,
  hasFlag,
  isCheckedOut,
  parseRepo,
  readRemotesConfig,
  workspaceRoot,
} from './lib/polyrepo.mjs';

const root = workspaceRoot(import.meta.dirname);

function usage(message) {
  if (message) console.error(`Error: ${message}\n`);
  console.error(`Usage:
  bun run pull-remote --name <kebab-name> [--force]
  bun run pull-remote --all [--force]

Options:
  --name    Remote in remotes.json
  --all     Pull every remote listed in remotes.json
  --force   Replace existing apps/<name>
`);
  process.exit(1);
}

function copyTemplate(templateId, dest, remote) {
  const src = join(root, 'templates', templateId);
  if (!existsSync(src)) {
    throw new Error(`Template missing: templates/${templateId}`);
  }
  mkdirSync(resolve(dest, '..'), { recursive: true });
  cpSync(src, dest, { recursive: true });

  const pkgPath = join(dest, 'package.json');
  if (existsSync(pkgPath)) {
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
    pkg.name = `@react-mfe/${remote.name}`;
    if (pkg.scripts) {
      pkg.scripts.dev = `vite --port ${remote.port} --strictPort`;
      pkg.scripts.preview = `vite preview --port ${remote.port} --strictPort`;
    }
    if (pkg.nx) {
      pkg.nx.sourceRoot = `apps/${remote.name}/src`;
      pkg.nx.tags = [`scope:${remote.name}`, 'type:provider'];
      if (pkg.nx.targets?.dev?.options) {
        pkg.nx.targets.dev.options.cwd = `apps/${remote.name}`;
      }
      if (pkg.nx.targets?.build?.options) {
        pkg.nx.targets.build.options.cwd = `apps/${remote.name}`;
      }
    }
    writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);
  }

  writeFileSync(
    join(dest, 'vite.config.mts'),
    `import { createRemoteViteConfig, findRemote } from '@react-mfe/mf-config/vite';

const remote = findRemote('${remote.name}');
if (!remote) throw new Error('Remote "${remote.name}" missing from remotes.json');

export default createRemoteViteConfig({
  appDir: import.meta.dirname,
  name: remote.name,
  port: remote.port,
});
`,
  );

  const appTsx = join(dest, 'src', 'App.tsx');
  if (existsSync(appTsx)) {
    let text = readFileSync(appTsx, 'utf8');
    text = text
      .replaceAll('promotions', remote.name)
      .replaceAll('Promotions', remote.title);
    writeFileSync(appTsx, text);
  }

  const html = join(dest, 'index.html');
  if (existsSync(html)) {
    let text = readFileSync(html, 'utf8');
    text = text.replaceAll('Promotions', remote.title);
    writeFileSync(html, text);
  }
}

function pullOne(remote, force) {
  const name = remote.name;
  const dest = appDir(root, name);
  const parsed = parseRepo(remote.repo);

  if (isCheckedOut(root, name)) {
    if (!force) {
      console.log(`skip ${name} — apps/${name} already exists (use --force)`);
      return 'skipped';
    }
    rmSync(dest, {
      recursive: true,
      force: true,
      maxRetries: 10,
      retryDelay: 200,
    });
  }

  if (parsed.kind === 'none') {
    throw new Error(
      `Remote "${name}" has no "repo" in remotes.json. Set a git URL or template:<id>.`,
    );
  }

  if (parsed.kind === 'template') {
    copyTemplate(parsed.id, dest, remote);
    console.log(`copied template:${parsed.id} → apps/${name}`);
    return 'template';
  }

  const result = spawnSync('git', ['clone', parsed.url, dest], {
    cwd: root,
    stdio: 'inherit',
    shell: true,
  });
  if (result.status !== 0) {
    throw new Error(`git clone failed for ${name}`);
  }
  console.log(`cloned ${parsed.url} → apps/${name}`);
  return 'git';
}

const name = arg('--name');
const all = hasFlag('--all');
const force = hasFlag('--force');

if (!name && !all) usage('pass --name <remote> or --all');
if (name && all) usage('use either --name or --all, not both');
if (name && !/^[a-z][a-z0-9-]*$/.test(name)) {
  usage('--name must be kebab-case');
}

const config = readRemotesConfig(root);
const targets = all
  ? config.remotes
  : [config.remotes.find((r) => r.name === name)].filter(Boolean);

if (!all && targets.length === 0) {
  usage(`remote "${name}" not in remotes.json`);
}

let pulled = 0;
for (const remote of targets) {
  try {
    const result = pullOne(remote, force);
    if (result !== 'skipped') pulled += 1;
  } catch (error) {
    console.error(error.message ?? error);
    process.exit(1);
  }
}

if (pulled > 0) {
  const install = spawnSync('bun', ['install'], {
    cwd: root,
    stdio: 'inherit',
    shell: true,
  });
  if (install.status !== 0) {
    console.error('bun install failed');
    process.exit(install.status ?? 1);
  }
}

console.log(`
Done. Checked-out remotes join \`bun run dev\` automatically.
Shell still loads every remotes.json entry (local URL or entry.prod).
`);
