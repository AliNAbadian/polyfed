import { useRouterState } from '@tanstack/react-router';
import { useState } from 'react';
import { REMOTES, remotePath } from '@react-mfe/mf-config';

function selectedKeyFromPath(pathname: string): string {
  const match = REMOTES.find((remote) => {
    const path = remotePath(remote.name);
    return pathname === path || pathname.startsWith(`${path}/`);
  });
  return match ? remotePath(match.name) : '/';
}

export function useShellNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [collapsed, setCollapsed] = useState(false);

  return {
    selectedKeys: [selectedKeyFromPath(pathname)],
    collapsed,
    setCollapsed,
  };
}
