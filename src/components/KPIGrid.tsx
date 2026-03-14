import React from 'react';
import { Card, Col, Row, Statistic, Progress } from 'antd';
import { ArrowUpOutlined, AlertOutlined, ShopOutlined, ControlOutlined, DatabaseOutlined } from '@ant-design/icons';
import type { SelectedKPI } from './Dashboard';

interface KPIGridProps {
  onSelectKpi: (kpi: SelectedKPI) => void;
  selectedKpi: SelectedKPI;
}

const KPIGrid: React.FC<KPIGridProps> = ({ onSelectKpi, selectedKpi }) => {
  const getCardStyle = (key: SelectedKPI) => ({
    cursor: 'pointer',
    border: selectedKpi === key ? '2px solid #1677ff' : '1px solid transparent',
    boxShadow: selectedKpi === key ? '0 0 10px rgba(22, 119, 255, 0.2)' : undefined,
    height: '100%',
    transition: 'all 0.3s ease',
  });

  return (
    <Row gutter={[16, 16]}>
      {/* Revenue */}
      <Col xs={24} sm={12} md={6}>
        <Card 
          hoverable 
          style={getCardStyle('revenue')} 
          onClick={() => onSelectKpi('revenue')}
        >
          <Statistic
            title={<><ShopOutlined /> Total Revenue</>}
            value={142358}
            precision={2}
            valueStyle={{ color: '#3f8600', fontWeight: 'bold' }}
            prefix="$"
            suffix={<ArrowUpOutlined style={{ fontSize: '16px' }} />}
          />
          <div style={{ marginTop: 8, fontSize: '12px', color: '#888' }}>
            +8.4% vs previous period
          </div>
        </Card>
      </Col>
      
      {/* Active Machines */}
      <Col xs={24} sm={12} md={6}>
        <Card 
          hoverable 
          style={getCardStyle('activeMachines')} 
          onClick={() => onSelectKpi('activeMachines')}
        >
          <Statistic
            title={<><ControlOutlined /> Active Machines</>}
            value={189}
            suffix="/ 200"
            valueStyle={{ fontWeight: 'bold' }}
          />
          <Progress percent={94.5} size="small" strokeColor="#52c41a" />
          <div style={{ marginTop: 4, fontSize: '12px', color: '#888' }}>
            11 offline currently
          </div>
        </Card>
      </Col>

      {/* Critical Alerts */}
      <Col xs={24} sm={12} md={6}>
        <Card 
          hoverable 
          style={getCardStyle('criticalAlerts')} 
          onClick={() => onSelectKpi('criticalAlerts')}
        >
          <Statistic
            title={<><AlertOutlined style={{ color: '#ff4d4f' }} /> Critical Alerts</>}
            value={7}
            valueStyle={{ color: '#ff4d4f', fontWeight: 'bold' }}
            suffix={<ArrowUpOutlined style={{ fontSize: '16px' }} />}
          />
          <div style={{ marginTop: 8, fontSize: '12px', color: '#ff4d4f' }}>
            3 require immediate attention
          </div>
        </Card>
      </Col>

      {/* Stock Health */}
      <Col xs={24} sm={12} md={6}>
        <Card 
          hoverable 
          style={getCardStyle('stockHealth')} 
          onClick={() => onSelectKpi('stockHealth')}
        >
          <Statistic
            title={<><DatabaseOutlined /> Avg Stock Health</>}
            value={82}
            suffix="%"
            valueStyle={{ fontWeight: 'bold', color: '#faad14' }}
          />
          <Progress percent={82} strokeColor="#faad14" showInfo={false} />
          <div style={{ marginTop: 4, fontSize: '12px', color: '#888' }}>
            45 machines below 50%
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default KPIGrid;
