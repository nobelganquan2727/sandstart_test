import React, { useState, useEffect } from 'react';
import { Table, Select, Input, Space, Card, Badge } from 'antd';
import { generateInitialData } from '../data/mockEngine';
import type { MachineData } from '../data/mockEngine';

const { Option } = Select;

const MachinesView: React.FC = () => {
  const [machines, setMachines] = useState<MachineData[]>([]);
  const [filtered, setFiltered] = useState<MachineData[]>([]);
  
  // Filters
  const [location, setLocation] = useState<string>('');
  const [os, setOs] = useState<string>('');
  const [ipStr, setIpStr] = useState<string>('');

  useEffect(() => {
    const data = generateInitialData(150);
    setMachines(data);
    setFiltered(data);
  }, []);

  useEffect(() => {
    let result = machines;
    if (location) result = result.filter(m => m.location === location);
    if (os) result = result.filter(m => m.osVersion === os);
    if (ipStr) result = result.filter(m => m.ip.includes(ipStr));
    setFiltered(result);
  }, [location, os, ipStr, machines]);

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'IP', dataIndex: 'ip', key: 'ip' },
    { title: 'Location', dataIndex: 'location', key: 'location' },
    { title: 'OS Version', dataIndex: 'osVersion', key: 'osVersion' },
    { title: 'Connection', dataIndex: 'connectionType', key: 'connectionType' },
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
    }
  ];

  return (
    <Card title="Machine Fleet" bordered={false} style={{ margin: 16 }}>
      <Space style={{ marginBottom: 16 }} size="large" wrap>
        <div>
          <span style={{ marginRight: 8 }}>Location:</span>
          <Select 
            allowClear 
            style={{ width: 160 }} 
            placeholder="Any" 
            value={location} 
            onChange={setLocation}
          >
            <Option value="North America">North America</Option>
            <Option value="Europe">Europe</Option>
            <Option value="Asia-Pacific">Asia-Pacific</Option>
          </Select>
        </div>
        <div>
          <span style={{ marginRight: 8 }}>OS Version:</span>
          <Select 
            allowClear 
            style={{ width: 140 }} 
            placeholder="Any" 
            value={os} 
            onChange={setOs}
          >
            <Option value="v2.1.0">v2.1.0</Option>
            <Option value="v2.2.4">v2.2.4</Option>
            <Option value="v3.0.1">v3.0.1</Option>
            <Option value="v3.1.5">v3.1.5</Option>
          </Select>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ marginRight: 8, whiteSpace: 'nowrap' }}>IP Address:</span>
          <Input 
            allowClear 
            placeholder="Search IP" 
            value={ipStr} 
            onChange={(e) => setIpStr(e.target.value)} 
          />
        </div>
      </Space>
      
      <Table 
        dataSource={filtered} 
        columns={columns} 
        rowKey="id" 
        pagination={{ pageSize: 15 }} 
        size="small"
      />
    </Card>
  );
};

export default MachinesView;
