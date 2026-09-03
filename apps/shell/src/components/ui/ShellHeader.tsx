import { Layout, Typography } from 'antd';

const { Header } = Layout;

export interface ShellHeaderProps {
  title: string;
}

export function ShellHeader({ title }: ShellHeaderProps) {
  return (
    <Header
      style={{
        paddingInline: 24,
        background: '#fff',
        borderBottom: '1px solid rgba(5, 5, 5, 0.06)',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Typography.Title level={4} style={{ margin: 0 }}>
        {title}
      </Typography.Title>
    </Header>
  );
}
