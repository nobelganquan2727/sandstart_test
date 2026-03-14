import React, { useMemo } from 'react';
import { Table, Card, Tag } from 'antd';
import dayjs from 'dayjs';

interface LogEntry {
  id: string;
  time: string;
  user: string;
  machineId: string;
  action: string;
  status: 'success' | 'alert' | 'error';
}

const generateFakeLogs = (): LogEntry[] => {
  const users = ['system', 'alice_ops', 'bob_tech', 'admin'];
  const actions = ['Restart Initiated', 'Firmware Update', 'Temperature Alert', 'Stock Low Warning', 'Diagnostics Run', 'Cash Collected'];
  const logs: LogEntry[] = [];
  
  for (let i = 0; i < 45; i++) {
    const isAlert = Math.random() > 0.8;
    const isError = Math.random() > 0.95;
    logs.push({
      id: `L-${1000 + i}`,
      time: dayjs().subtract(Math.floor(Math.random() * 2880), 'minute').toISOString(),
      user: users[Math.floor(Math.random() * users.length)],
      machineId: `VM-${Math.floor(Math.random() * 900) + 100}`,
      action: actions[Math.floor(Math.random() * actions.length)],
      status: isError ? 'error' : isAlert ? 'alert' : 'success'
    });
  }
  
  return logs.sort((a, b) => dayjs(b.time).valueOf() - dayjs(a.time).valueOf());
};

const LogisticsView: React.FC = () => {
  const logs = useMemo(() => generateFakeLogs(), []);

  const columns = [
    { 
      title: 'Time', 
      dataIndex: 'time', 
      key: 'time', 
      render: (t: string) => dayjs(t).format('YYYY-MM-DD HH:mm:ss') 
    },
    { 
      title: 'User/System', 
      dataIndex: 'user', 
      key: 'user' 
    },
    { 
      title: 'Machine ID', 
      dataIndex: 'machineId', 
      key: 'machineId' 
    },
    { 
      title: 'Action', 
      dataIndex: 'action', 
      key: 'action' 
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        if (status === 'error') return <Tag color="red">ERROR</Tag>;
        if (status === 'alert') return <Tag color="warning">ALERT</Tag>;
        return <Tag color="green">SUCCESS</Tag>;
      }
    }
  ];

  return (
    <Card title="Activity & Logistics Logs" bordered={false} style={{ margin: 16 }}>
      <Table 
        dataSource={logs} 
        columns={columns} 
        rowKey="id" 
        pagination={{ pageSize: 12 }} 
        size="small" 
      />
    </Card>
  );
};

export default LogisticsView;
