import { Outlet } from '@tanstack/react-router';
import { Layout as AntLayout } from 'antd';
import { REMOTES, remotePath } from '@react-mfe/mf-config';
import { ShellHeader } from './components/ui/ShellHeader';
import { ShellSider } from './components/ui/ShellSider';
import { useShellNav } from './hooks/useShellNav';

const { Content } = AntLayout;

function titleForPath(path: string): string {
  if (path === '/') return 'Home';
  const remote = REMOTES.find((item) => remotePath(item.name) === path);
  return remote?.title ?? 'MFE Store';
}

// Persistent chrome for the shell. <Outlet /> renders the active route — the
// home overview or a federated provider page.
export function Layout() {
  const { selectedKeys, collapsed, setCollapsed } = useShellNav();
  const title = titleForPath(selectedKeys[0] ?? '/');

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <ShellSider
        collapsed={collapsed}
        selectedKeys={selectedKeys}
        onCollapse={setCollapsed}
      />
      <AntLayout>
        <ShellHeader title={title} />
        <Content style={{ margin: 24, minHeight: 280 }}>
          <Outlet />
        </Content>
      </AntLayout>
    </AntLayout>
  );
}

export default Layout;
