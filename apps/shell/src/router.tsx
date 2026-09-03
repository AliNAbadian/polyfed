import {
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router';
import { REMOTES, remotePath } from '@react-mfe/mf-config';
import { Layout } from './Layout';
import { HomePage, remotePages } from './pages';
import { AuthCallbackPage } from './pages/auth-callback-page';

const rootRoute = createRootRoute({ component: Layout });

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const authCallbackRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/auth/callback',
  component: AuthCallbackPage,
});

const remoteRoutes = REMOTES.map((remote) =>
  createRoute({
    getParentRoute: () => rootRoute,
    path: remotePath(remote.name),
    component: remotePages[remote.name],
  }),
);

const routeTree = rootRoute.addChildren([
  indexRoute,
  authCallbackRoute,
  ...remoteRoutes,
]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
