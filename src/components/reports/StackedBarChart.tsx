
import React, { useState } from 'react';
import { 
  BarChart, 
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

interface StackedBarChartProps {
  data: Array<{
    name: string;
    [key: string]: any;
  }>;
  title: string;
  keys: Array<{
    key: string;
    color: string;
    stackId?: string;
  }>;
  xAxisDataKey?: string;
  isHorizontal?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
  className?: string;
  height?: number;
  onClick?: (data: any) => void;
  description?: string;
}

const StackedBarChart = ({
  data,
  title,
  keys,
  xAxisDataKey = "name",
  isHorizontal = false,
  showLegend = true,
  showTooltip = true,
  className = "",
  height = 300,
  onClick,
  description
}: StackedBarChartProps) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const handleClick = (data: any, index: number) => {
    setActiveIndex(index === activeIndex ? null : index);
    if (onClick) {
      onClick(data);
    }
  };

  return (
    <ChartContainer title={title} className={className} description={description}>
      <div className="p-4">
        <ResponsiveContainer width="100%" height={height}>
          <BarChart
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
            
            {keys.map((item, index) => (
              <Bar
                key={item.key}
                dataKey={item.key}
                stackId={item.stackId || "a"}
                fill={item.color}
                onClick={handleClick}
                radius={[index === 0 ? 4 : 0, index === keys.length - 1 ? 4 : 0, index === keys.length - 1 ? 4 : 0, index === 0 ? 4 : 0]}
                barSize={isHorizontal ? 20 : 30}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartContainer>
  );
};

export default StackedBarChart;
