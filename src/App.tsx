import { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { Simulator } from './components/Simulator';
import { Settings } from './components/Settings';
import { RiskReports } from './components/RiskReports';

function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'simulator' | 'settings' | 'risk-reports'>('dashboard');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === 'dashboard' && <Dashboard />}
      {activeTab === 'simulator' && <Simulator />}
      {activeTab === 'risk-reports' && <RiskReports />}
      {activeTab === 'settings' && <Settings currentTheme={theme} onThemeChange={toggleTheme} />}
    </Layout>
  );
}

export default App;
