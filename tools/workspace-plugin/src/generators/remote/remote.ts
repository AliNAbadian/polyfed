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

  config.remotes.push({ name, port, title, blurb });
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
    logger.info(`  ${projectRoot}/`);
    logger.info('  remotes.json updated (shell / bun run dev pick it up)');
    logger.info('Next: bun install && bun run dev');
  };
}

export default remoteGenerator;
