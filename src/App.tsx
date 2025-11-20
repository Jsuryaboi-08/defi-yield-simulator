import { useState } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { Simulator } from './components/Simulator';

function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'simulator'>('dashboard');

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === 'dashboard' ? <Dashboard /> : <Simulator />}
    </Layout>
  );
}

export default App;
