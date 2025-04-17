
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  PlusIcon,
  FileSpreadsheetIcon
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Employee } from '@/components/EmployeeTable';

interface ActionBarProps {
  employees: Employee[];
  filteredEmployees?: Employee[];
  isAddDialogOpen: boolean;
  setIsAddDialogOpen: (open: boolean) => void;
  pageSize: number;
  setPageSize: (size: number) => void;
  setCurrentPage: (page: number) => void;
  pageSizeOptions: number[];
  inAIMode?: boolean;
  onExport: () => void;
}

const ActionBar = ({ 
  employees,
  filteredEmployees,
  isAddDialogOpen,
  setIsAddDialogOpen,
  pageSize,
  setPageSize,
  setCurrentPage,
  pageSizeOptions,
  inAIMode = false,
  onExport
}: ActionBarProps) => {
  
  const handlePageSizeChange = (size: string) => {
    setPageSize(Number(size));
    setCurrentPage(1); // Reset to first page when changing page size
  };
  
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4">
      <div className="flex items-center gap-2">
        {!inAIMode && (
          <Button 
            variant="outline" 
            className="bg-white"
            onClick={() => setIsAddDialogOpen(true)}
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Employee
          </Button>
        )}
      </div>
      
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Show:</span>
          <Select
            value={pageSize.toString()}
            onValueChange={handlePageSizeChange}
          >
            <SelectTrigger className="h-9 w-[70px] bg-white">
              <SelectValue placeholder={pageSize.toString()} />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map(size => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <Button
          variant="outline"
          className="bg-white"
          onClick={onExport}
        >
          <FileSpreadsheetIcon className="h-4 w-4 mr-2" />
          Export as Excel
        </Button>
      </div>
    </div>
  );
};

export default ActionBar;
