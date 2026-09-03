import { lazyProvider } from './mf';
import { ProviderBoundary } from './ProviderBoundary';

/** One page wrapper per remote — generated from remotes.json, not hand-copied. */
export function createRemotePage(remoteName: string) {
  const RemoteApp = lazyProvider(remoteName, 'App');

  return function RemotePage() {
    return (
      <ProviderBoundary name={remoteName}>
        <RemoteApp />
      </ProviderBoundary>
    );
  };
}
