import { ConfigProvider, Space, theme } from 'antd';
import './App.css';
import { LeadsPage } from 'features/leads';

function App() {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
      }}
    >
      <Space>
        <LeadsPage />
      </Space>
    </ConfigProvider>
  );
}

export default App;
