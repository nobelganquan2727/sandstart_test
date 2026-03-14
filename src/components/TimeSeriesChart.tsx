import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { generateHistoricalData } from '../data/mockEngine';
import type { HistoricalData } from '../data/mockEngine';
import type { SelectedKPI } from './Dashboard';
import { Skeleton } from 'antd';

interface TimeSeriesChartProps {
  selectedKpi: SelectedKPI;
  dateRange: [string, string];
}

const formatYAxis = (value: number, kpi: SelectedKPI) => {
  if (kpi === 'revenue') return `$${(value / 1000).toFixed(1)}k`;
  if (kpi === 'stockHealth') return `${value}%`;
  return value.toString();
};

const getChartColor = (kpi: SelectedKPI) => {
  switch (kpi) {
    case 'revenue': return '#3f8600';
    case 'activeMachines': return '#1677ff';
    case 'criticalAlerts': return '#ff4d4f';
    case 'stockHealth': return '#faad14';
    default: return '#1677ff';
  }
};

const getKpiTitle = (kpi: SelectedKPI) => {
  switch (kpi) {
    case 'revenue': return 'Revenue Trend';
    case 'activeMachines': return 'Active Machines Trend';
    case 'criticalAlerts': return 'Critical Alerts Trend';
    case 'stockHealth': return 'Average Stock Health Trend';
    default: return 'Trend';
  }
};

const TimeSeriesChart: React.FC<TimeSeriesChartProps> = ({ selectedKpi, dateRange }) => {
  // In a real app, dateRange would trigger a refetch. Here we use mock data.
  const data: HistoricalData[] = useMemo(() => generateHistoricalData(), []);
  const color = getChartColor(selectedKpi);

  if (!data.length) return <Skeleton active />;

  return (
    <div style={{ height: 300, width: '100%' }}>
      <h3 style={{ marginTop: 0, marginBottom: '16px', color: '#555' }}>
        {getKpiTitle(selectedKpi)}
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id={`color-${selectedKpi}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.8}/>
              <stop offset="95%" stopColor={color} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
          <XAxis 
            dataKey="date" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#888', fontSize: 12 }} 
            minTickGap={30}
          />
          <YAxis 
            tickFormatter={(val) => formatYAxis(val, selectedKpi)}
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#888', fontSize: 12 }}
          />
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            labelStyle={{ fontWeight: 'bold', color: '#333' }}
          />
          <Area 
            type="monotone" 
            dataKey={selectedKpi} 
            stroke={color} 
            strokeWidth={3}
            fillOpacity={1} 
            fill={`url(#color-${selectedKpi})`} 
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TimeSeriesChart;
