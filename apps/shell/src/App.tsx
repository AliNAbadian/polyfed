import { RouterProvider } from '@tanstack/react-router';
import { router } from './router';

// The shell is a TanStack Router app. The router's root renders the shell
// chrome (Layout) and each child route renders a federated provider's page.
// Importing from '@react-mfe/ui' anywhere in the tree pulls in the shared theme.
export function App() {
  return <RouterProvider router={router} />;
}

export default App;
