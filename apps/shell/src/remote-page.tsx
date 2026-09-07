import { lazyProvider } from './mf';
import { ProviderBoundary } from './ProviderBoundary';
import { isRemoteLoadable } from './remote-availability';
import styles from './app.module.css';

/** One page wrapper per remote — generated from remotes.json, not hand-copied. */
export function createRemotePage(remoteName: string) {
  if (!isRemoteLoadable(remoteName)) {
    return function RemoteUnavailablePage() {
      return (
        <div role="status" className={styles.boundaryError}>
          <strong>Remote &quot;{remoteName}&quot; not available locally.</strong>
          <p>No checkout under apps/{remoteName} and no entry.prod in remotes.json.</p>
          <p className={styles.boundaryHint}>
            Pull it: <code>bun run pull-remote --name {remoteName}</code>
            <br />
            Or set <code>entry.prod</code> to a deployed remoteEntry.js URL.
          </p>
        </div>
      );
    };
  }

  const RemoteApp = lazyProvider(remoteName, 'App');

  return function RemotePage() {
    return (
      <ProviderBoundary name={remoteName}>
        <RemoteApp />
      </ProviderBoundary>
    );
  };
}
