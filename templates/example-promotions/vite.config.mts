import { createRemoteViteConfig, findRemote } from '@react-mfe/mf-config/vite';

const remote = findRemote('promotions');
if (!remote) throw new Error('Remote "promotions" missing from remotes.json');

export default createRemoteViteConfig({
  appDir: import.meta.dirname,
  name: remote.name,
  port: remote.port,
});
