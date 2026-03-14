import React, { useState } from 'react';
import { ConfigProvider, theme } from 'antd';
import Dashboard from './components/Dashboard';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: isDarkMode ? {
          colorPrimary: '#1677ff',
          colorBgBase: '#000000',
          colorBgContainer: '#141414',
          colorInfo: '#1677ff',
          borderRadius: 8,
        } : {
          colorPrimary: '#1677ff',
          borderRadius: 8,
        },
      }}
    >
      <div style={{ background: isDarkMode ? '#000' : '#f0f2f5', minHeight: '100vh' }}>
        <Dashboard isDarkMode={isDarkMode} toggleTheme={() => setIsDarkMode(!isDarkMode)} />
      </div>
    </ConfigProvider>
  );
}

export default App;
