#!/usr/bin/env bun
/**
 * Scaffold a new Module Federation remote.
 *
 * Usage:
 *   bun run create-remote --name orders --port 5103
 *   bun run create-remote --name checkout --port 5104 --title "Checkout"
 *
 * What it does:
 * 1. Appends the remote to packages/mf-config/remotes.json
 * 2. Creates apps/<name>/ with thin vite config + App stub
 * 3. Installs workspace deps
 *
 * Shell routes, sider, home cards, MF remotes, and `bun run dev` pick it up
 * from remotes.json automatically — no hand-editing vite/router/pages.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const root = resolve(import.meta.dirname, '..');

function arg(flag) {
  const index = process.argv.indexOf(flag);
  if (index === -1) return undefined;
  return process.argv[index + 1];
}

function usage(message) {
  if (message) console.error(`Error: ${message}\n`);
  console.error(`Usage:
  bun run create-remote --name <kebab-name> --port <number> [--title "Title"] [--blurb "..."]
`);
  process.exit(1);
}

const name = arg('--name');
const portRaw = arg('--port');
const title = arg('--title') ?? (name ? titleCase(name) : undefined);
const blurb =
  arg('--blurb') ?? (name ? `${title} micro-frontend remote.` : undefined);

if (!name || !/^[a-z][a-z0-9-]*$/.test(name)) {
  usage('--name required (kebab-case, e.g. orders)');
}
if (!portRaw || Number.isNaN(Number(portRaw))) {
  usage('--port required (e.g. 5103)');
}

const port = Number(portRaw);
const remotesPath = join(root, 'packages/mf-config/remotes.json');
const appDir = join(root, 'apps', name);

if (existsSync(appDir)) {
  usage(`apps/${name} already exists`);
}

const config = JSON.parse(readFileSync(remotesPath, 'utf8'));

if (config.remotes.some((remote) => remote.name === name)) {
  usage(`remote "${name}" already in remotes.json`);
}
if (config.remotes.some((remote) => remote.port === port) || config.shell.port === port) {
  usage(`port ${port} already in use in remotes.json`);
}

config.remotes.push({ name, port, title, blurb });
writeFileSync(remotesPath, `${JSON.stringify(config, null, 2)}\n`);

mkdirSync(join(appDir, 'src'), { recursive: true });

writeFileSync(
  join(appDir, 'package.json'),
  `${JSON.stringify(
    {
      name: `@react-mfe/${name}`,
      version: '0.0.0',
      private: true,
      type: 'module',
      scripts: {
        dev: `vite --port ${port} --strictPort`,
        build: 'vite build',
        preview: `vite preview --port ${port} --strictPort`,
      },
      dependencies: {
        '@ant-design/cssinjs': '^2.1.2',
        '@react-mfe/auth': 'workspace:*',
        '@react-mfe/mf-config': 'workspace:*',
        '@react-mfe/ui': 'workspace:*',
        antd: '^6.6.2',
        axios: '^1.13.2',
        react: '^19.0.0',
        'react-dom': '^19.0.0',
      },
      devDependencies: {
        '@module-federation/vite': '^1.15.5',
        '@tailwindcss/vite': '^4.3.3',
        '@types/react': '^19.0.0',
        '@types/react-dom': '^19.0.0',
        '@vitejs/plugin-react': '^6.0.2',
        tailwindcss: '^4.3.3',
        typescript: '~6.0.3',
        vite: '^8.0.13',
      },
      nx: {
        projectType: 'application',
        sourceRoot: `apps/${name}/src`,
        tags: [`scope:${name}`, 'type:provider'],
        targets: {
          dev: {
            executor: 'nx:run-commands',
            continuous: true,
            options: { command: 'vite', cwd: `apps/${name}` },
            dependsOn: ['@react-mfe/shell:dev'],
          },
          build: {
            executor: 'nx:run-commands',
            options: { command: 'vite build', cwd: `apps/${name}` },
          },
        },
      },
    },
    null,
    2,
  )}\n`,
);

writeFileSync(
  join(appDir, 'vite.config.mts'),
  `import { createRemoteViteConfig, findRemote } from '@react-mfe/mf-config/vite';

const remote = findRemote('${name}');
if (!remote) throw new Error('Remote "${name}" missing from remotes.json');

export default createRemoteViteConfig({
  appDir: import.meta.dirname,
  name: remote.name,
  port: remote.port,
});
`,
);

writeFileSync(
  join(appDir, 'tsconfig.json'),
  `${JSON.stringify(
    {
      compilerOptions: {
        target: 'ES2022',
        lib: ['DOM', 'DOM.Iterable', 'ES2022'],
        module: 'ESNext',
        moduleResolution: 'Bundler',
        jsx: 'react-jsx',
        strict: true,
        skipLibCheck: true,
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
        resolveJsonModule: true,
        isolatedModules: true,
        noEmit: true,
        rootDir: '../../',
        paths: {
          '@react-mfe/ui': ['../../packages/ui/src/index.ts'],
          '@react-mfe/mf-config': ['../../packages/mf-config/src/index.ts'],
          '@react-mfe/mf-config/vite': [
            '../../packages/mf-config/vite/index.d.ts',
          ],
          '@react-mfe/auth': ['../../packages/auth/src/index.ts'],
        },
        noUncheckedSideEffectImports: false,
        types: ['*'],
      },
      include: ['src', 'vite.config.mts'],
    },
    null,
    2,
  )}\n`,
);

writeFileSync(
  join(appDir, 'index.html'),
  `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>${title} · MFE</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/index.ts"></script>
  </body>
</html>
`,
);

writeFileSync(
  join(appDir, 'src/index.ts'),
  `import('./bootstrap');
`,
);

writeFileSync(
  join(appDir, 'src/bootstrap.tsx'),
  `import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import '@react-mfe/ui/styles/tailwind.css';

const container = document.getElementById('root');
if (!container) throw new Error('#root element not found');

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
`,
);

writeFileSync(
  join(appDir, 'src/App.tsx'),
  `export function App() {
  return (
    <section className="p-6" data-testid="${name}">
      <h1 className="text-2xl font-bold">${title}</h1>
      <p className="mt-2 text-neutral-600">
        New remote <code>${name}</code> on port ${port}. Edit{' '}
        <code>apps/${name}/src/App.tsx</code>.
      </p>
    </section>
  );
}

export default App;
`,
);

const install = spawnSync(
  'bun',
  ['install'],
  { cwd: root, stdio: 'inherit', shell: true },
);
if (install.status !== 0) {
  console.error('bun install failed — fix deps then re-run install');
  process.exit(install.status ?? 1);
}

console.log(`
Created remote @react-mfe/${name}
  apps/${name}/
  remotes.json entry (port ${port})

Shell route /${name}, sider, home card, MF remotes, and bun run dev
all read remotes.json — no extra shell edits.

Start everything:
  bun run dev
`);

function titleCase(value) {
  return value
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}
