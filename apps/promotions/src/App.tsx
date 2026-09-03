import { getApiClient } from '@react-mfe/auth';
import { Button } from 'antd';

export function App() {
  const api = getApiClient();

  api.get('');
  return (
    <section className="p-6" data-testid="promotions">
      <h1 className="text-2xl font-bold">Promotions</h1>
      <p className="mt-2 text-neutral-600!">asdasd</p>
    </section>
  );
}

export default App;
