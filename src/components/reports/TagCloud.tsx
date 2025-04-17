
import React from 'react';
import ChartContainer from './ChartContainer';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

interface TagCloudProps {
  title: string;
  data: Array<{
    value: string;
    count: number;
  }>;
  className?: string;
  height?: number;
  description?: string;
}

const TagCloud = ({ 
  title, 
  data, 
  className = "", 
  height = 300,
  description 
}: TagCloudProps) => {
  // Handle empty data case
  if (!data || data.length === 0) {
    return (
      <ChartContainer title={title} className={className} description={description}>
        <div className="flex justify-center items-center h-full text-gray-400 p-4" style={{ height: `${height}px` }}>
          No data available
        </div>
      </ChartContainer>
    );
  }
  
  // Sort data by count in descending order for better visualization
  const sortedData = [...data].sort((a, b) => b.count - a.count);
  
  // Format data for horizontal bar chart
  const chartData = sortedData.map(item => ({
    name: item.value,
    value: item.count
  }));
  
  return (
    <ChartContainer title={title} className={className} description={description}>
      <div className="p-4">
        <ResponsiveContainer width="100%" height={height}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis type="number" />
            <YAxis 
              dataKey="name" 
              type="category" 
              tick={{ fontSize: 12 }} 
              width={100}
            />
            <Tooltip />
            <Bar 
              dataKey="value" 
              fill="#8884d8" 
              radius={[0, 4, 4, 0]}
              barSize={20}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartContainer>
  );
};

export default TagCloud;
