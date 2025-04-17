
import React, { useState } from 'react';
import { 
  BarChart as RechartsBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  Cell
} from 'recharts';
import ChartContainer from './ChartContainer';

interface BarChartProps {
  data: Array<{
    name: string;
    value: number;
    [key: string]: any;
  }>;
  title: string;
  xAxisDataKey?: string;
  barDataKey?: string;
  barColor?: string;
  isHorizontal?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
  className?: string;
  height?: number;
  onClick?: (data: any) => void;
  colorMap?: Record<string, string>;
  description?: string;
}

const BarChart = ({
  data,
  title,
  xAxisDataKey = "name",
  barDataKey = "value",
  barColor = "#8884d8",
  isHorizontal = false,
  showLegend = false,
  showTooltip = true,
  className = "",
  height = 300,
  onClick,
  colorMap,
  description
}: BarChartProps) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const handleClick = (data: any, index: number) => {
    setActiveIndex(index === activeIndex ? null : index);
    if (onClick) {
      onClick(data);
    }
  };

  const getBarFill = (entry: any, index: number) => {
    if (colorMap && entry.name in colorMap) {
      return colorMap[entry.name];
    }
    
    if (activeIndex === index) {
      return "#1e40af"; // Darker variant of the bar color when active
    }
    
    return barColor;
  };

  return (
    <ChartContainer title={title} className={className} description={description}>
      <div className="p-4">
        <ResponsiveContainer width="100%" height={height}>
          <RechartsBarChart
            data={data}
            layout={isHorizontal ? "vertical" : "horizontal"}
            margin={{
              top: 5,
              right: 30,
              left: isHorizontal ? 50 : 20,
              bottom: isHorizontal ? 5 : 30,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            {isHorizontal ? (
              <>
                <XAxis type="number" />
                <YAxis 
                  dataKey={xAxisDataKey} 
                  type="category" 
                  tick={{ fontSize: 12 }} 
                  width={80}
                />
              </>
            ) : (
              <>
                <XAxis 
                  dataKey={xAxisDataKey} 
                  tick={{ fontSize: 12 }}
                  height={40}
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                />
                <YAxis />
              </>
            )}
            {showTooltip && <Tooltip />}
            {showLegend && <Legend />}
            <Bar
              dataKey={barDataKey}
              fill={barColor}
              onClick={handleClick}
              radius={[4, 4, 0, 0]}
              barSize={isHorizontal ? 20 : 30}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={getBarFill(entry, index)} 
                  cursor="pointer"
                />
              ))}
            </Bar>
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    </ChartContainer>
  );
};

export default BarChart;
