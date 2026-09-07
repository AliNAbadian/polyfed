import * as path from 'node:path';
import {
  formatFiles,
  generateFiles,
  logger,
  type Tree,
} from '@nx/devkit';
import type { RemoteGeneratorSchema } from './schema';

type RemotesFile = {
  shell: { name: string; port: number };
  remotes: Array<{
    name: string;
    port: number;
    title: string;
    blurb: string;
    repo?: string;
    entry?: { dev?: string; prod?: string };
  }>;
  shared: Record<string, unknown>;
};

const REMOTES_PATH = 'packages/mf-config/remotes.json';

function titleCase(value: string): string {
  return value
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function readRemotes(tree: Tree): RemotesFile {
  const raw = tree.read(REMOTES_PATH, 'utf-8');
  if (!raw) {
    throw new Error(`Missing ${REMOTES_PATH}`);
  }
  return JSON.parse(raw) as RemotesFile;
}

function nextPort(config: RemotesFile): number {
  const used = [config.shell.port, ...config.remotes.map((r) => r.port)];
  return Math.max(...used) + 1;
}

export async function remoteGenerator(
  tree: Tree,
  options: RemoteGeneratorSchema,
) {
  const name = options.name;
  if (!/^[a-z][a-z0-9-]*$/.test(name)) {
    throw new Error(`Invalid name "${name}". Use kebab-case (e.g. orders).`);
  }
  if (name === 'shell') {
    throw new Error('Cannot create a remote named "shell".');
  }

  const projectRoot = `apps/${name}`;
  if (tree.exists(projectRoot)) {
    throw new Error(`${projectRoot} already exists`);
  }

  const config = readRemotes(tree);
  if (config.remotes.some((remote) => remote.name === name)) {
    throw new Error(`Remote "${name}" already in remotes.json`);
  }

  const port = options.port ?? nextPort(config);
  if (
    config.shell.port === port ||
    config.remotes.some((remote) => remote.port === port)
  ) {
    throw new Error(`Port ${port} already used in remotes.json`);
  }

  const title = options.title ?? titleCase(name);
  const blurb = options.blurb ?? `${title} micro-frontend remote.`;
  const entryDev = `http://127.0.0.1:${port}/remoteEntry.js`;

  config.remotes.push({
    name,
    port,
    title,
    blurb,
    ...(options.repo ? { repo: options.repo } : {}),
    entry: {
      dev: entryDev,
      prod: options.prodEntry ?? '',
    },
  });
  tree.write(REMOTES_PATH, `${JSON.stringify(config, null, 2)}\n`);

  generateFiles(tree, path.join(__dirname, 'files'), projectRoot, {
    name,
    port,
    title,
    blurb,
    tmpl: '',
  });

  await formatFiles(tree);

  return () => {
    logger.info(`Created remote @react-mfe/${name} on port ${port}`);
    logger.info(`  ${projectRoot}/  (gitignored by platform — own git repo)`);
    logger.info('  remotes.json updated');
    logger.info('');
    logger.info('Polyrepo next steps:');
    logger.info(`  1. bun install && bun run dev`);
    logger.info(`  2. cd apps/${name} && git init && git add . && git commit -m "chore: scaffold remote"`);
    logger.info('  3. Create empty remote repo → git remote add origin <url> && git push -u origin main');
    if (options.repo) {
      logger.info(`  4. repo already set: ${options.repo}`);
    } else {
      logger.info(
        `  4. Set "repo": "<git-url>" on ${name} in packages/mf-config/remotes.json`,
      );
    }
    logger.info('  5. Teammates: bun run pull-remote --name ' + name);
  };
}

export default remoteGenerator;
