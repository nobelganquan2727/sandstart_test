import React, { useState, useEffect } from 'react';
import { Row, Col, Select, Table, Button, Badge, Space, Drawer, Descriptions, notification, Popconfirm } from 'antd';
import { generateInitialData } from '../data/mockEngine';
import type { MachineData } from '../data/mockEngine';
import { PoweroffOutlined, ReloadOutlined, ToolOutlined, ClearOutlined } from '@ant-design/icons';

const { Option } = Select;

type DimensionType = 'location' | 'osVersion' | 'hardwareModel' | 'supplySource' | 'connectionType';

const DataExplorer: React.FC = () => {
  const [machines, setMachines] = useState<MachineData[]>([]);
  const [selectedDimension, setSelectedDimension] = useState<DimensionType>('location');
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedMachine, setSelectedMachine] = useState<MachineData | null>(null);

  // Initialize data
  useEffect(() => {
    setMachines(generateInitialData(200));
    
    // Simulate real-time updates every 5 seconds
    const interval = setInterval(() => {
      setMachines(current => 
        current.map(m => {
          // Slight chance of changing revenue/dispenses
          if (Math.random() > 0.8 && m.status === 'online') {
            return {
              ...m,
              totalRevenue: m.totalRevenue + Math.floor(Math.random() * 50),
              totalDispenses: m.totalDispenses + 1,
              inventoryLevel: Math.max(0, m.inventoryLevel - Math.floor(Math.random() * 3))
            };
          }
          return m;
        })
      );
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  // Compute aggregated data for the Left Pane based on selected dimension
  const aggregatedData = React.useMemo(() => {
    const groups: Record<string, { count: number; online: number; revenue: number }> = {};
    
    machines.forEach(m => {
      const key = String(m[selectedDimension]);
      if (!groups[key]) groups[key] = { count: 0, online: 0, revenue: 0 };
      
      groups[key].count++;
      if (m.status === 'online') groups[key].online++;
      groups[key].revenue += m.totalRevenue;
    });

    return Object.entries(groups).map(([name, data]) => ({
      name,
      ...data,
      health: Math.round((data.online / data.count) * 100)
    }));
  }, [machines, selectedDimension]);

  // Filtered machines for Right Pane
  const filteredMachines = React.useMemo(() => {
    if (!selectedGroup) return [];
    return machines.filter(m => String(m[selectedDimension]) === selectedGroup);
  }, [machines, selectedDimension, selectedGroup]);

  // Handle Operations
  const handleOperation = (machine: MachineData, action: string) => {
    setMachines(current => 
      current.map(m => {
        if (m.id === machine.id) {
          if (action === 'restart') return { ...m, status: 'maintenance', alerts: [] };
          if (action === 'clear') return { ...m, alerts: [], status: 'online' };
        }
        return m;
      })
    );
    
    notification.success({
      message: 'Operation Scheduled',
      description: `Action [${action}] scheduled for ${machine.name} (${machine.id}).`,
      placement: 'bottomRight',
    });
  };

  // Columns for Aggregated Table (Left Pane)
  const leftColumns = [
    { title: 'Group', dataIndex: 'name', key: 'name' },
    { title: 'Machines', dataIndex: 'count', key: 'count' },
    { 
      title: 'Health', 
      dataIndex: 'health', 
      key: 'health',
      render: (val: number) => (
        <Badge status={val > 90 ? 'success' : val > 75 ? 'warning' : 'error'} text={`${val}%`} />
      )
    },
  ];

  // Columns for Detailed Machine List (Right Pane)
  const rightColumns = [
    { 
      title: 'Name', 
      dataIndex: 'name', 
      key: 'name',
      render: (text: string, record: MachineData) => (
        <a onClick={() => { setSelectedMachine(record); setDrawerVisible(true); }}>{text}</a>
      )
    },
    { title: 'IP Address', dataIndex: 'ip', key: 'ip' },
    { 
      title: 'Status', 
      dataIndex: 'status', 
      key: 'status',
      render: (status: string) => {
        let color = 'green';
        if (status === 'offline') color = 'red';
        if (status === 'error') color = 'orange';
        if (status === 'maintenance') color = 'blue';
        return <Badge color={color} text={status.toUpperCase()} />;
      }
    },
    {
      title: 'Stock (Lvl)',
      dataIndex: 'inventoryLevel',
      key: 'inventoryLevel',
      render: (val: number) => <span style={{ color: val < 20 ? 'red' : 'inherit' }}>{val}%</span>
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: MachineData) => (
        <Space size="middle">
          <Popconfirm title="Restart machine?" onConfirm={() => handleOperation(record, 'restart')}>
            <Button type="text" size="small" icon={<ReloadOutlined />} />
          </Popconfirm>
          {record.alerts.length > 0 && (
            <Popconfirm title="Clear errors?" onConfirm={() => handleOperation(record, 'clear')}>
              <Button type="text" size="small" danger icon={<ClearOutlined />} />
            </Popconfirm>
          )}
        </Space>
      )
    }
  ];

  return (
    <>
      <Row gutter={[24, 24]}>
        {/* Left Pane: Aggregated View */}
        <Col xs={24} lg={8}>
          <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>Group By:</span>
            <Select 
              value={selectedDimension} 
              onChange={(val) => { setSelectedDimension(val); setSelectedGroup(null); }}
              style={{ width: 160 }}
            >
              <Option value="location">Location</Option>
              <Option value="osVersion">OS Version</Option>
              <Option value="hardwareModel">Hardware Model</Option>
              <Option value="supplySource">Supply Source</Option>
              <Option value="connectionType">Connection Type</Option>
            </Select>
          </div>
          
          <Table 
            dataSource={aggregatedData} 
            columns={leftColumns} 
            rowKey="name"
            pagination={{ pageSize: 8 }}
            size="small"
            onRow={(record) => ({
              onClick: () => setSelectedGroup(record.name),
              style: { 
                cursor: 'pointer',
                background: selectedGroup === record.name ? '#e6f4ff' : 'transparent' 
              }
            })}
          />
        </Col>

        {/* Right Pane: Machine List */}
        <Col xs={24} lg={16}>
          {selectedGroup ? (
            <div>
              <h4 style={{ marginTop: 0 }}>Machines in {selectedGroup} ({filteredMachines.length})</h4>
              <Table 
                dataSource={filteredMachines} 
                columns={rightColumns} 
                rowKey="id"
                pagination={{ pageSize: 8 }}
                size="small"
              />
            </div>
          ) : (
            <div style={{ 
              height: '100%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: '#999',
              border: '1px dashed #d9d9d9',
              borderRadius: '8px',
              minHeight: '300px'
            }}>
              Select a group from the left to view detailed machines.
            </div>
          )}
        </Col>
      </Row>

      {/* Detailed Machine Drawer */}
      <Drawer
        title={selectedMachine ? `Machine Details - ${selectedMachine.name}` : 'Details'}
        placement="right"
        width={500}
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        extra={
          <Space>
            <Button icon={<ToolOutlined />} onClick={() => {
              if (selectedMachine) {
                handleOperation(selectedMachine, 'diagnostics');
                setDrawerVisible(false);
              }
            }}>Run Diagnostics</Button>
            <Button type="primary" danger icon={<PoweroffOutlined />} onClick={() => {
              if (selectedMachine) {
                handleOperation(selectedMachine, 'off');
                setDrawerVisible(false);
              }
            }}>Power Off</Button>
          </Space>
        }
      >
        {selectedMachine && (
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="Machine ID">{selectedMachine.id}</Descriptions.Item>
            <Descriptions.Item label="Status">
              <Badge 
                status={selectedMachine.status === 'online' ? 'success' : 'error'} 
                text={selectedMachine.status.toUpperCase()} 
              />
            </Descriptions.Item>
            <Descriptions.Item label="Location">{selectedMachine.location}</Descriptions.Item>
            <Descriptions.Item label="IP Address">{selectedMachine.ip}</Descriptions.Item>
            <Descriptions.Item label="Connection">{selectedMachine.connectionType}</Descriptions.Item>
            <Descriptions.Item label="Hardware">{selectedMachine.hardwareModel}</Descriptions.Item>
            <Descriptions.Item label="OS Version">{selectedMachine.osVersion}</Descriptions.Item>
            <Descriptions.Item label="Internal Temp">{selectedMachine.internalTemperature}°C</Descriptions.Item>
            <Descriptions.Item label="Inventory Level">
              <span style={{ color: selectedMachine.inventoryLevel < 20 ? 'red' : 'inherit' }}>
                {selectedMachine.inventoryLevel}%
              </span>
            </Descriptions.Item>
            <Descriptions.Item label="Total Revenue">${selectedMachine.totalRevenue.toLocaleString()}</Descriptions.Item>
            <Descriptions.Item label="Cash Box Status">{selectedMachine.cashBoxStatus}% Full</Descriptions.Item>
            <Descriptions.Item label="Active Alerts">
              {selectedMachine.alerts.length > 0 ? (
                <Space direction="vertical">
                  {selectedMachine.alerts.map(a => <Badge key={a} status="error" text={a} />)}
                  <Button size="small" onClick={() => handleOperation(selectedMachine, 'clear')}>Clear All</Button>
                </Space>
              ) : 'None'}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Drawer>
    </>
  );
};

export default DataExplorer;
