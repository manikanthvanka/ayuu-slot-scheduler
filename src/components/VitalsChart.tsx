
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface VitalsChartProps {
  data: Array<{
    date: string;
    systolic?: number;
    diastolic?: number;
    pulse?: number;
    temperature?: number;
    spo2?: number;
  }>;
  type: 'bp' | 'pulse' | 'temperature' | 'spo2';
  title: string;
}

const VitalsChart: React.FC<VitalsChartProps> = ({ data, type, title }) => {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getChartLines = () => {
    switch (type) {
      case 'bp':
        return (
          <>
            <Line type="monotone" dataKey="systolic" stroke="#ef4444" strokeWidth={2} name="Systolic" />
            <Line type="monotone" dataKey="diastolic" stroke="#3b82f6" strokeWidth={2} name="Diastolic" />
          </>
        );
      case 'pulse':
        return <Line type="monotone" dataKey="pulse" stroke="#10b981" strokeWidth={2} name="Pulse" />;
      case 'temperature':
        return <Line type="monotone" dataKey="temperature" stroke="#f59e0b" strokeWidth={2} name="Temperature" />;
      case 'spo2':
        return <Line type="monotone" dataKey="spo2" stroke="#8b5cf6" strokeWidth={2} name="SpO2" />;
      default:
        return null;
    }
  };

  const getYAxisDomain = () => {
    switch (type) {
      case 'bp':
        return [60, 200];
      case 'pulse':
        return [50, 120];
      case 'temperature':
        return [96, 104];
      case 'spo2':
        return [85, 100];
      default:
        return ['auto', 'auto'];
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg border">
      <h4 className="text-sm font-semibold text-gray-700 mb-3">{title}</h4>
      <ResponsiveContainer width="100%" height={150}>
        <LineChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="date" 
            tickFormatter={formatDate}
            tick={{ fontSize: 10 }}
            stroke="#666"
          />
          <YAxis 
            domain={getYAxisDomain()}
            tick={{ fontSize: 10 }}
            stroke="#666"
          />
          <Tooltip 
            labelFormatter={(value) => `Date: ${formatDate(value)}`}
            contentStyle={{ 
              backgroundColor: '#fff', 
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '12px'
            }}
          />
          {getChartLines()}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default VitalsChart;
