
import React from 'react';
import { 
  TableCell, 
  TableRow, 
  TableBody as TableBodyUI 
} from '@/components/ui/table';
import { Employee } from '@/components/EmployeeTable';

interface TableBodyProps {
  columns: {key: keyof Employee, label: string}[];
  employees: Employee[];
  searchTerm: string;
  formatValue: (value: any, key: keyof Employee) => React.ReactNode;
  getStatusColor: (status: string, field: string) => string;
  highlightText: (text: string) => React.ReactNode;
}

const TableBody: React.FC<TableBodyProps> = ({ 
  columns, 
  employees, 
  searchTerm,
  formatValue,
  getStatusColor,
  highlightText
}) => {
  return (
    <TableBodyUI>
      {employees.map((employee, index) => (
        <TableRow 
          key={employee.id}
          className={index % 2 === 0 ? 'bg-white hover:bg-gray-100 transition-colors duration-150' : 'bg-gray-50 hover:bg-gray-100 transition-colors duration-150'}
        >
          {columns.map((column) => {
            const value = employee[column.key];
            
            if (column.key === 'employmentStatus' || column.key === 'billabilityStatus' || column.key === 'tagStatus') {
              return (
                <TableCell key={column.key} className="px-4 py-3 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(String(value), column.key)}`}>
                    {value}
                  </span>
                </TableCell>
              );
            }
            
            if (column.key === 'gepId' || column.key === 'name') {
              return (
                <TableCell key={column.key} className={column.key === 'gepId' ? 'font-medium px-4 py-3 whitespace-nowrap' : 'px-4 py-3 whitespace-nowrap'}>
                  {highlightText(String(value))}
                </TableCell>
              );
            }
            
            if (column.key === 'skillset') {
              return (
                <TableCell key={column.key} className="px-4 py-3">
                  {Array.isArray(value) && value.length > 0 ? (
                    <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                      {value[0]} {/* Display only the first skill */}
                    </span>
                  ) : (
                    '-'
                  )}
                </TableCell>
              );
            }
            
            return (
              <TableCell key={column.key} className="px-4 py-3 whitespace-nowrap">
                {formatValue(value, column.key)}
              </TableCell>
            );
          })}
        </TableRow>
      ))}
    </TableBodyUI>
  );
};

export default TableBody;
