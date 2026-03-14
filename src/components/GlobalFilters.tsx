import React from 'react';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';

const { RangePicker } = DatePicker;

interface GlobalFiltersProps {
  onRangeChange: (range: [string, string]) => void;
}

const presets = [
  { label: 'Last 1 Day', value: [dayjs().subtract(1, 'day'), dayjs()] as [Dayjs, Dayjs] },
  { label: 'Last 7 Days', value: [dayjs().subtract(7, 'day'), dayjs()] as [Dayjs, Dayjs] },
  { label: 'Last 30 Days', value: [dayjs().subtract(30, 'day'), dayjs()] as [Dayjs, Dayjs] },
  { label: 'Last Week', value: [dayjs().subtract(1, 'week').startOf('week'), dayjs().subtract(1, 'week').endOf('week')] as [Dayjs, Dayjs] },
  { label: 'Last Month', value: [dayjs().subtract(1, 'month').startOf('month'), dayjs().subtract(1, 'month').endOf('month')] as [Dayjs, Dayjs] },
  { label: 'Last 90 Days', value: [dayjs().subtract(90, 'day'), dayjs()] as [Dayjs, Dayjs] },
];

const GlobalFilters: React.FC<GlobalFiltersProps> = ({ onRangeChange }) => {
  return (
    <RangePicker 
      presets={presets} 
      onChange={(dates) => {
        if (dates && dates[0] && dates[1]) {
          onRangeChange([dates[0].toISOString(), dates[1].toISOString()]);
        } else {
          onRangeChange(['', '']);
        }
      }} 
    />
  );
};

export default GlobalFilters;
