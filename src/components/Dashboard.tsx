import React, { useState } from 'react';
import { Layout, Menu, theme, Button, Space, Typography, Badge, Avatar, Switch, Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import {
  AppstoreOutlined,
  BarChartOutlined,
  GlobalOutlined,
  SettingOutlined,
  BellOutlined,
  UserOutlined,
  BulbOutlined,
  BulbFilled,
  LogoutOutlined,
  ProfileOutlined
} from '@ant-design/icons';
import GlobalFilters from './GlobalFilters';
import KPIGrid from './KPIGrid';
import TimeSeriesChart from './TimeSeriesChart';
import DataExplorer from './DataExplorer';
import MachinesView from './MachinesView';
import LogisticsView from './LogisticsView';
import SettingsView from './SettingsView';

const { Header, Content, Footer, Sider } = Layout;
const { Title } = Typography;

export type SelectedKPI = 'revenue' | 'activeMachines' | 'criticalAlerts' | 'stockHealth';

interface DashboardProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ isDarkMode, toggleTheme }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('1'); // 1=Dashboard, 2=Machines, 4=Logistics
  const [selectedKpi, setSelectedKpi] = useState<SelectedKPI>('revenue');
  const [dateRange, setDateRange] = useState<[string, string]>(['', '']);

  // Custom dark theme tokens can be applied via ConfigProvider in App.tsx
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const userMenuItems: MenuProps['items'] = [
    {
      key: '1',
      label: 'Profile',
      icon: <ProfileOutlined />,
    },
    {
      key: '2',
      label: 'Personal Settings',
      icon: <SettingOutlined />,
    },
    {
      type: 'divider',
    },
    {
      key: '3',
      label: 'Logout',
      icon: <LogoutOutlined />,
      danger: true,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        collapsible 
        collapsed={collapsed} 
        onCollapse={(value) => setCollapsed(value)}
        theme="dark"
      >
        <div style={{ padding: '16px', textAlign: 'center' }}>
          <Title level={4} style={{ color: '#fff', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden' }}>
            {collapsed ? 'VM' : 'VendCommand'}
          </Title>
        </div>
        <Menu theme="dark" selectedKeys={[activeTab]} onSelect={({ key }) => setActiveTab(key)} mode="inline">
          <Menu.Item key="1" icon={<BarChartOutlined />}>Dashboard</Menu.Item>
          <Menu.Item key="2" icon={<AppstoreOutlined />}>Machines</Menu.Item>
          <Menu.Item key="4" icon={<GlobalOutlined />}>Logistics</Menu.Item>
          <Menu.Item key="5" icon={<SettingOutlined />}>Settings</Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header style={{ 
          padding: '0 24px', 
          background: colorBgContainer, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          borderBottom: '1px solid #f0f0f0' 
        }}>
          <div>
            <Title level={5} style={{ margin: 0 }}>Global Fleet Status</Title>
          </div>
          <Space size="large" align="center">
            {/* Global Date Range Picker */}
            <GlobalFilters onRangeChange={setDateRange} />
            
            {/* Theme Toggle */}
            <Switch 
              checkedChildren={<BulbOutlined />} 
              unCheckedChildren={<BulbFilled />} 
              checked={!isDarkMode} 
              onChange={toggleTheme} 
            />
            
            <Badge count={5}>
              <Button type="text" icon={<BellOutlined style={{ fontSize: '18px' }} />} />
            </Badge>
            <Dropdown menu={{ items: userMenuItems }} trigger={['click']} placement="bottomRight">
              <Avatar style={{ backgroundColor: '#1677ff', cursor: 'pointer' }} icon={<UserOutlined />} />
            </Dropdown>
          </Space>
        </Header>
        
        <Content style={{ margin: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {activeTab === '1' && (
              <>
                {/* Level 1: KPIs */}
                <section>
                  <Title level={5}>Key Performance Indicators</Title>
                  <KPIGrid 
                    onSelectKpi={setSelectedKpi} 
                    selectedKpi={selectedKpi} 
                  />
                </section>

                {/* Level 1.5: KPI Drill-down Chart */}
                <section style={{ 
                  background: colorBgContainer, 
                  padding: '24px', 
                  borderRadius: borderRadiusLG,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                }}>
                  <TimeSeriesChart selectedKpi={selectedKpi} dateRange={dateRange} />
                </section>

                {/* Level 2: Split View Data Explorer */}
                <section>
                  <Title level={5}>Fleet Explorer</Title>
                  <DataExplorer />
                </section>
              </>
            )}

            {activeTab === '2' && <MachinesView />}
            {activeTab === '4' && <LogisticsView />}
            {activeTab === '5' && <SettingsView />}

          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          VendCommand ©{new Date().getFullYear()} - Modern Vending Operations
        </Footer>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
