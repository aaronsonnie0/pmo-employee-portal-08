
import React from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Filter, X } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface CheckboxFilterProps {
  field: string;
  options: string[];
  selectedValues: string[];
  isActive: boolean;
  openFilter: string | null;
  setOpenFilter: (field: string | null) => void;
  handleFilterChange: (field: string, values: string[]) => void;
  clearFilter: (field: string) => void;
}

const CheckboxFilter: React.FC<CheckboxFilterProps> = ({
  field,
  options,
  selectedValues,
  isActive,
  openFilter,
  setOpenFilter,
  handleFilterChange,
  clearFilter
}) => {
  return (
    <Popover open={openFilter === field} onOpenChange={(open) => open ? setOpenFilter(field) : setOpenFilter(null)}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className={`w-full justify-between ${isActive ? 'text-primary' : ''}`}
        >
          <span className="flex items-center">
            <Filter className="mr-2 h-4 w-4" />
            {isActive ? `${selectedValues.length} selected` : 'Filter'}
          </span>
          {isActive && (
            <X 
              className="h-4 w-4 ml-1 hover:text-destructive" 
              onClick={(e) => {
                e.stopPropagation();
                clearFilter(field);
              }}
            />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-60" align="start">
        <div className="space-y-4">
          <h4 className="font-medium">Filter by {field}</h4>
          <div className="max-h-[300px] overflow-auto space-y-2">
            {options.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox 
                  id={`${field}-${option}`}
                  checked={selectedValues?.includes(option) || false}
                  onCheckedChange={(checked) => {
                    const currentValues = selectedValues || [];
                    const newValues = checked 
                      ? [...currentValues, option]
                      : currentValues.filter(v => v !== option);
                    
                    handleFilterChange(field as string, newValues);
                  }}
                />
                <label 
                  htmlFor={`${field}-${option}`}
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {option}
                </label>
              </div>
            ))}
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full" 
            onClick={() => setOpenFilter(null)}
          >
            Close
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default CheckboxFilter;
