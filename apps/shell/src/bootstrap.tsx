import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ConfigProvider } from 'antd';
import { AuthGate, initAuth } from '@react-mfe/auth';
import { App } from './App';
import '@react-mfe/ui/styles/tailwind.css';

initAuth({
  authority: import.meta.env.VITE_OIDC_AUTHORITY,
  clientId: import.meta.env.VITE_OIDC_CLIENT_ID,
  scope: import.meta.env.VITE_OIDC_SCOPE,
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
  redirectUri: `${window.location.origin}/auth/callback`,
  silentRedirectUri: `${window.location.origin}/silent-renew.html`,
  postLogoutRedirectUri: `${window.location.origin}/`,
});

const container = document.getElementById('root');
if (!container) throw new Error('#root element not found');

createRoot(container).render(
  <StrictMode>
    <ConfigProvider
      direction="rtl"
      theme={{
        token: {
          colorPrimary: '#722ed1',
          colorInfo: '#722ed1',
          fontFamily: 'IRANSansX, ui-sans-serif, system-ui, sans-serif',
        },
      }}
    >
      <AuthGate>
        <App />
      </AuthGate>
    </ConfigProvider>
  </StrictMode>,
);
