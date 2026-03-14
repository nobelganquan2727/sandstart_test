import React, { useState, useMemo } from 'react';
import { Card, Col, Row, Tree, Table, Button, Tag, notification } from 'antd';
import { PlayCircleOutlined, FolderOutlined, FileOutlined } from '@ant-design/icons';
import type { DataNode } from 'antd/es/tree';

interface TestCase {
  id: string;
  name: string;
  path: string;
  description: string;
  status: 'idle' | 'running' | 'passed' | 'failed';
}

const mockTreeData: DataNode[] = [
  {
    title: 'e2e-tests',
    key: '/e2e-tests',
    icon: <FolderOutlined />,
    children: [
      {
        title: 'login.spec.ts',
        key: '/e2e-tests/login.spec.ts',
        icon: <FileOutlined />,
        isLeaf: true,
      },
      {
        title: 'payment',
        key: '/e2e-tests/payment',
        icon: <FolderOutlined />,
        children: [
          {
            title: 'credit-card.spec.ts',
            key: '/e2e-tests/payment/credit-card.spec.ts',
            icon: <FileOutlined />,
            isLeaf: true,
          },
          {
            title: 'paypal.spec.ts',
            key: '/e2e-tests/payment/paypal.spec.ts',
            icon: <FileOutlined />,
            isLeaf: true,
          }
        ]
      }
    ],
  },
  {
    title: 'integration-tests',
    key: '/integration-tests',
    icon: <FolderOutlined />,
    children: [
      {
        title: 'api-sync.spec.ts',
        key: '/integration-tests/api-sync.spec.ts',
        icon: <FileOutlined />,
        isLeaf: true,
      }
    ]
  }
];

const initialTestCases: TestCase[] = [
  { id: '1', name: 'Valid Login', path: '/e2e-tests/login.spec.ts', description: 'Test successful login flow', status: 'idle' },
  { id: '2', name: 'Invalid Password', path: '/e2e-tests/login.spec.ts', description: 'Test failed login with wrong password', status: 'passed' },
  { id: '3', name: 'Visa Processing', path: '/e2e-tests/payment/credit-card.spec.ts', description: 'Test Visa transaction', status: 'idle' },
  { id: '4', name: 'Mastercard Processing', path: '/e2e-tests/payment/credit-card.spec.ts', description: 'Test Mastercard transaction', status: 'failed' },
  { id: '5', name: 'Paypal Checkout', path: '/e2e-tests/payment/paypal.spec.ts', description: 'Test Paypal redirection', status: 'idle' },
  { id: '6', name: 'Inventory Sync', path: '/integration-tests/api-sync.spec.ts', description: 'Test backend inventory sync', status: 'passed' },
];

const TestCasesView: React.FC = () => {
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [testCases, setTestCases] = useState<TestCase[]>(initialTestCases);

  const selectedPath = selectedKeys.length > 0 ? (selectedKeys[0] as string) : null;

  const filteredTests = useMemo(() => {
    if (!selectedPath) return testCases;
    // Match exact file path or any test case whose path starts with the folder prefix
    return testCases.filter(t => t.path === selectedPath || t.path.startsWith(`${selectedPath}/`));
  }, [testCases, selectedPath]);

  const handleStartTest = (testId: string) => {
    // Optimistically set to running
    setTestCases(current => current.map(t => t.id === testId ? { ...t, status: 'running' } : t));
    
    // Simulate test finishing after 2 seconds
    setTimeout(() => {
      setTestCases(current => current.map(t => {
        if (t.id === testId) {
          const isSuccess = Math.random() > 0.3;
          return { ...t, status: isSuccess ? 'passed' : 'failed' };
        }
        return t;
      }));
      
      notification.info({
        message: 'Test Execution Complete',
        description: `Test ID ${testId} finished running.`,
        placement: 'bottomRight'
      });
    }, 2000);
  };

  const columns = [
    { title: 'Test Name', dataIndex: 'name', key: 'name' },
    { title: 'Path', dataIndex: 'path', key: 'path' },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    { 
      title: 'Status', 
      dataIndex: 'status', 
      key: 'status',
      render: (status: string) => {
        let color = 'default';
        if (status === 'passed') color = 'success';
        if (status === 'failed') color = 'error';
        if (status === 'running') color = 'processing';
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      }
    },
    { 
      title: 'Action', 
      key: 'action',
      render: (_: any, record: TestCase) => (
        <Button 
          type="primary" 
          size="small" 
          icon={<PlayCircleOutlined />} 
          loading={record.status === 'running'}
          onClick={() => handleStartTest(record.id)}
        >
          {record.status === 'running' ? 'Running...' : 'Start'}
        </Button>
      )
    }
  ];

  return (
    <Card bordered={false} style={{ margin: 16 }}>
      <h2>Test Suite Manager</h2>
      <Row gutter={[24, 24]}>
        
        {/* Left Pane: Folder Tree */}
        <Col xs={24} md={8} lg={6}>
          <div style={{ border: '1px solid #f0f0f0', borderRadius: '8px', padding: '16px', minHeight: '400px' }}>
            <h4 style={{ marginTop: 0 }}>Test Directory</h4>
            <Tree
              showIcon
              defaultExpandAll
              treeData={mockTreeData}
              onSelect={setSelectedKeys}
            />
          </div>
        </Col>

        {/* Right Pane: Test Cases Table */}
        <Col xs={24} md={16} lg={18}>
          <div style={{ padding: '0 8px' }}>
            <div style={{ marginBottom: 16 }}>
              <span style={{ fontWeight: 'bold' }}>Showing tests for: </span> 
              <Tag>{selectedPath || 'All Files'}</Tag>
            </div>
            <Table
              dataSource={filteredTests}
              columns={columns}
              rowKey="id"
              pagination={{ pageSize: 10 }}
              size="small"
            />
          </div>
        </Col>

      </Row>
    </Card>
  );
};

export default TestCasesView;
