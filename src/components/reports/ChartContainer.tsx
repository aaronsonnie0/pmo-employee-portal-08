
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ChartContainerProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  description?: string;
  action?: React.ReactNode;
}

const ChartContainer = ({ 
  title, 
  children, 
  className = "",
  description,
  action
}: ChartContainerProps) => {
  return (
    <Card className={`overflow-hidden shadow-sm ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 px-4 pt-4">
        <div>
          <CardTitle className="text-sm font-medium text-gray-700">{title}</CardTitle>
          {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
        </div>
        {action && <div>{action}</div>}
      </CardHeader>
      <CardContent className="p-0">
        {children}
      </CardContent>
    </Card>
  );
};

export default ChartContainer;
