
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Filter, X } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface TextFilterProps {
  field: string;
  isActive: boolean;
  openFilter: string | null;
  setOpenFilter: (field: string | null) => void;
  activeSearch: string;
  handleSearchInputChange: (value: string, field: string) => void;
  handleSearchSubmit: (field: string) => void;
  clearFilter: (field: string) => void;
}

const TextFilter: React.FC<TextFilterProps> = ({
  field,
  isActive,
  openFilter,
  setOpenFilter,
  activeSearch,
  handleSearchInputChange,
  handleSearchSubmit,
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
          <span>
            <Filter className="mr-2 h-4 w-4 inline" />
            {isActive ? 'Filter active' : 'Search'}
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
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <h4 className="font-medium">Search {field}</h4>
          <div className="flex items-center space-x-2">
            <Input 
              placeholder={`Enter ${field}...`} 
              value={activeSearch}
              onChange={(e) => handleSearchInputChange(e.target.value, field)}
              className="flex-1"
            />
          </div>
          <div className="flex justify-between">
            <Button variant="outline" size="sm" onClick={() => setOpenFilter(null)}>
              Cancel
            </Button>
            <Button size="sm" onClick={() => handleSearchSubmit(field)}>
              Apply
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default TextFilter;
