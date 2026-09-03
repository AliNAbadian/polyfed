import { Link } from '@tanstack/react-router';
import { Badge } from '@react-mfe/ui';
import { REMOTES, remotePath } from '@react-mfe/mf-config';
import { createRemotePage } from './remote-page';
import styles from './app.module.css';

export const remotePages = Object.fromEntries(
  REMOTES.map((remote) => [remote.name, createRemotePage(remote.name)]),
);

export function HomePage() {
  return (
    <div className={styles.home}>
      <section className={styles.intro}>
        <Badge label="shell · consumer" />
        <h1>One shell, many micro-frontends.</h1>
        <p>
          Remotes come from <code>packages/mf-config/remotes.json</code>. Add one
          with <code>bun run create-remote --name orders --port 5103</code>.
        </p>
      </section>

      <div className={styles.moduleGrid}>
        {REMOTES.map((remote) => (
          <Link
            key={remote.name}
            to={remotePath(remote.name)}
            className={styles.moduleCard}
          >
            <div className={styles.moduleHead}>
              <h2>{remote.title}</h2>
              <Badge label="provider" />
            </div>
            <p>{remote.blurb}</p>
            <span className={styles.moduleCta}>Open {remote.title} →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
