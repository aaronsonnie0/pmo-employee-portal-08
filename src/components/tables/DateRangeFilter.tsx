
import React from 'react';
import { format } from "date-fns";
import { Button } from '@/components/ui/button';
import { CalendarIcon, X } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

interface DateRangeFilterProps {
  field: string;
  isActive: boolean;
  openFilter: string | null;
  setOpenFilter: (field: string | null) => void;
  dateRange: {
    field: string;
    from: Date | undefined;
    to: Date | undefined;
  };
  setDateRange: (range: {
    field: string;
    from: Date | undefined;
    to: Date | undefined;
  }) => void;
  clearFilter: (field: string) => void;
  handleDateFilter: (field: string) => void;
}

const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
  field,
  isActive,
  openFilter,
  setOpenFilter,
  dateRange,
  setDateRange,
  clearFilter,
  handleDateFilter
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
            <CalendarIcon className="mr-2 h-4 w-4" />
            {isActive ? 'Filter active' : 'Filter dates'}
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
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          selected={{
            from: dateRange.from,
            to: dateRange.to,
          }}
          onSelect={(range) => 
            setDateRange({
              field: field as string,
              from: range?.from,
              to: range?.to
            })
          }
          initialFocus
        />
        <div className="p-3 border-t flex justify-between">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              setDateRange({ field: '', from: undefined, to: undefined });
              setOpenFilter(null);
            }}
          >
            Cancel
          </Button>
          <Button 
            size="sm"
            onClick={() => handleDateFilter(field as string)}
            disabled={!dateRange.from || !dateRange.to}
          >
            Apply
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DateRangeFilter;
