
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  TableHead,
  TableRow,
  TableHeader as TableHeaderUI
} from '@/components/ui/table';
import { 
  ChevronDown, 
  ArrowUp, 
  ArrowDown
} from 'lucide-react';
import { Employee } from '@/components/EmployeeTable';

interface TableHeaderProps {
  columns: {key: keyof Employee, label: string}[];
  sortConfig: {
    key: keyof Employee | '';
    direction: 'asc' | 'desc';
  };
  onSort: (key: keyof Employee) => void;
  renderFilterComponent: (field: keyof Employee) => React.ReactNode;
  isFilterActive: (field: string) => boolean;
}

const TableHeader: React.FC<TableHeaderProps> = ({ 
  columns, 
  sortConfig, 
  onSort, 
  renderFilterComponent,
  isFilterActive 
}) => {
  const getSortIcon = (key: keyof Employee) => {
    if (sortConfig.key !== key) {
      return <ChevronDown className="ml-1 h-4 w-4 opacity-50" />;
    }
    return sortConfig.direction === 'asc' 
      ? <ArrowUp className="ml-1 h-4 w-4" /> 
      : <ArrowDown className="ml-1 h-4 w-4" />;
  };

  return (
    <TableHeaderUI className="bg-gray-100 sticky top-0 z-10">
      <TableRow>
        {columns.map((column) => (
          <TableHead 
            key={column.key}
            className="font-bold text-gep-dark whitespace-nowrap px-4 py-3"
            filterContent={renderFilterComponent(column.key)}
            isFilterActive={isFilterActive(column.key)}
          >
            <div className="flex items-center space-x-1">
              <span>{column.label}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 p-0 hover:bg-transparent"
                onClick={() => onSort(column.key)}
              >
                {getSortIcon(column.key)}
              </Button>
            </div>
          </TableHead>
        ))}
      </TableRow>
    </TableHeaderUI>
  );
};

export default TableHeader;
