import React from 'react';
import { Card, Tabs, Form, Switch, Input, Button, Divider, List, Select } from 'antd';
import { 
  BellOutlined, 
  SafetyOutlined, 
  ApiOutlined, 
  TeamOutlined 
} from '@ant-design/icons';

const { Option } = Select;

const SettingsView: React.FC = () => {
  return (
    <Card bordered={false} style={{ margin: 16 }}>
      <h2>System Settings</h2>
      <Tabs defaultActiveKey="1" tabPosition="left" style={{ minHeight: 400 }}>
        
        {/* Notifications & Alerts */}
        <Tabs.TabPane tab={<span><BellOutlined /> Alert Priorities</span>} key="1">
          <div style={{ maxWidth: 600 }}>
            <h3>Notification Subscriptions</h3>
            <p style={{ color: '#888', marginBottom: 24 }}>Configure which machine events trigger external notifications.</p>
            <List
              itemLayout="horizontal"
              dataSource={[
                { title: 'Critical Temperature Drop', desc: 'Notify when internal temp deviates > 5°C from setpoint.', default: true },
                { title: 'Stock Depletion (Below 10%)', desc: 'Alert regional restock team.', default: true },
                { title: 'Cash Box Full', desc: 'Secure cash collection ping.', default: false },
                { title: 'Payment Gateway Offline', desc: 'Credit card reader connection failure.', default: true },
              ]}
              renderItem={item => (
                <List.Item actions={[<Switch defaultChecked={item.default} />]}>
                  <List.Item.Meta title={item.title} description={item.desc} />
                </List.Item>
              )}
            />
          </div>
        </Tabs.TabPane>

        {/* Roles and Access */}
        <Tabs.TabPane tab={<span><TeamOutlined /> Role Based Access</span>} key="2">
          <div style={{ maxWidth: 600 }}>
            <h3>Operator Access Control</h3>
            <Form layout="vertical">
              <Form.Item label="Default New User Role">
                <Select defaultValue="viewer">
                  <Option value="viewer">Viewer (Read Only)</Option>
                  <Option value="technician">Technician (Maintenance & Restarts)</Option>
                  <Option value="admin">Administrator (Full Access)</Option>
                </Select>
              </Form.Item>
              <Form.Item label="Enforce 2FA for Technicians">
                <Switch defaultChecked />
              </Form.Item>
            </Form>
            <Divider />
            <Button type="primary">Manage Team Members</Button>
          </div>
        </Tabs.TabPane>

        {/* Integrations */}
        <Tabs.TabPane tab={<span><ApiOutlined /> Integrations (Webhooks)</span>} key="3">
          <div style={{ maxWidth: 600 }}>
            <h3>Third-party Sync</h3>
            <Form layout="vertical">
              <Form.Item label="ServiceNow Incident Endpoint URL">
                <Input placeholder="https://your-instance.service-now.com/api/..." />
              </Form.Item>
              <Form.Item label="Salesforce Inventory Sync Key">
                <Input.Password placeholder="Enter API Key" />
              </Form.Item>
              <Button type="primary" style={{ marginTop: 8 }}>Save Webhook Settings</Button>
            </Form>
          </div>
        </Tabs.TabPane>

        {/* Firmware / Security */}
        <Tabs.TabPane tab={<span><SafetyOutlined /> Fleet Security</span>} key="4">
          <div style={{ maxWidth: 600 }}>
            <h3>Firmware Over-The-Air (OTA) policies</h3>
            <Form layout="vertical">
              <Form.Item label="Auto-Update Window">
                <Select defaultValue="night">
                  <Option value="night">02:00 AM - 05:00 AM (Local Time)</Option>
                  <Option value="weekend">Weekends Only</Option>
                  <Option value="manual">Manual Execution Only</Option>
                </Select>
              </Form.Item>
            </Form>
            <p style={{ color: '#888', marginTop: 16 }}>* Last global firmware push: 22 days ago.</p>
            <Button danger>Force Restart Fleet Array</Button>
          </div>
        </Tabs.TabPane>

      </Tabs>
    </Card>
  );
};

export default SettingsView;
