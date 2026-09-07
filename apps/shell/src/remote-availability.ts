/** Injected by createShellViteConfig from disk + remotes.json. */
declare const __MFE_REMOTE_ENTRIES__: Record<string, string | null>;

/** True when Vite registered an entry (local checkout or entry.prod). */
export function isRemoteLoadable(name: string): boolean {
  if (typeof __MFE_REMOTE_ENTRIES__ === 'undefined') return true;
  return Boolean(__MFE_REMOTE_ENTRIES__[name]);
}
