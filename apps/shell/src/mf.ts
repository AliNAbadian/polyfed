import { lazy, type ComponentType } from 'react';
import { loadRemote } from '@module-federation/runtime';

// Remotes are declared once in apps/shell/vite.config.mts (federation.remotes).
// That registers them with the federation runtime at host init and enables
// cross-remote HMR. Do NOT call registerRemotes() here — re-registering the
// same alias throws:
//   "alias shop … is not allowed to be the prefix of __mfe_internal__…shop"
//
// loadRemote keys still use `<alias>/<expose>` matching those remotes
// (e.g. 'shop/App', 'cart/App').

export function lazyProvider<Props = unknown>(
  alias: string,
  exposeName: string,
) {
  return lazy(async () => {
    const mod = await loadRemote<{ default: ComponentType<Props> }>(
      `${alias}/${exposeName}`,
    );
    return { default: mod!.default };
  });
}
