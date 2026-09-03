import { Link } from '@tanstack/react-router';
import { AppstoreOutlined, HomeOutlined } from '@ant-design/icons';
import { Layout, Menu, Typography } from 'antd';
import type { MenuProps } from 'antd';
import { REMOTES, remotePath } from '@react-mfe/mf-config';

const { Sider } = Layout;

function buildMenuItems(): MenuProps['items'] {
  return [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: (
        <Link className="font-black!" to="/">
          صفحه اصلی
        </Link>
      ),
    },
    ...REMOTES.map((remote) => ({
      key: remotePath(remote.name),
      icon: <AppstoreOutlined />,
      label: <Link to={remotePath(remote.name)}>{remote.title}</Link>,
    })),
  ];
}

export interface ShellSiderProps {
  collapsed: boolean;
  selectedKeys: string[];
  onCollapse: (collapsed: boolean) => void;
}

export function ShellSider({
  collapsed,
  selectedKeys,
  onCollapse,
}: ShellSiderProps) {
  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
      breakpoint="lg"
      width={220}
      theme="light"
      style={{ minHeight: '100vh' }}
    >
      <div
        style={{
          height: 56,
          margin: 12,
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-start',
          gap: 8,
          paddingInline: collapsed ? 0 : 12,
          color: '#000',
          fontWeight: 700,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
        }}
      >
        <span aria-hidden>◆</span>
        {!collapsed && (
          <Typography.Text style={{ color: '#000' }}>MFE Store</Typography.Text>
        )}
      </div>
      <Menu
        theme="light"
        mode="inline"
        selectedKeys={selectedKeys}
        items={buildMenuItems()}
      />
    </Sider>
  );
}
