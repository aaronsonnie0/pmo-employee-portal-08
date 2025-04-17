
import React, { useState } from 'react';
import { 
  PieChart as RechartsPieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Sector
} from 'recharts';
import ChartContainer from './ChartContainer';

interface PieChartProps {
  data: Array<{
    name: string;
    value: number;
    [key: string]: any;
  }>;
  title: string;
  colorMap?: Record<string, string>;
  className?: string;
  height?: number;
  dataKey?: string;
  nameKey?: string;
  innerRadius?: number;
  outerRadius?: number;
  showLegend?: boolean;
  showTooltip?: boolean;
  onClick?: (data: any) => void;
  description?: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1', '#a4de6c', '#d0ed57'];

const renderActiveShape = (props: any) => {
  const { 
    cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle,
    fill, payload, percent, value
  } = props;
  
  const sin = Math.sin(-midAngle * Math.PI / 180);
  const cos = Math.cos(-midAngle * Math.PI / 180);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 5}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
    </g>
  );
};

const PieChart = ({
  data,
  title,
  colorMap,
  className = "",
  height = 300,
  dataKey = "value",
  nameKey = "name",
  innerRadius = 0,
  outerRadius = 80,
  showLegend = true,
  showTooltip = true,
  onClick,
  description
}: PieChartProps) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const handleClick = (data: any, index: number) => {
    setActiveIndex(index === activeIndex ? null : index);
    if (onClick) {
      onClick(data);
    }
  };

  const getColor = (entry: any, index: number) => {
    if (colorMap && entry.name in colorMap) {
      return colorMap[entry.name];
    }
    return COLORS[index % COLORS.length];
  };

  return (
    <ChartContainer title={title} className={className} description={description}>
      <div className="p-4">
        <ResponsiveContainer width="100%" height={height}>
          <RechartsPieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              fill="#8884d8"
              dataKey={dataKey}
              nameKey={nameKey}
              paddingAngle={2}
              activeIndex={activeIndex !== null ? activeIndex : undefined}
              activeShape={renderActiveShape}
              onClick={handleClick}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={getColor(entry, index)} 
                  cursor="pointer"
                />
              ))}
            </Pie>
            {showLegend && <Legend />}
            {showTooltip && <Tooltip />}
          </RechartsPieChart>
        </ResponsiveContainer>
      </div>
    </ChartContainer>
  );
};

export default PieChart;
