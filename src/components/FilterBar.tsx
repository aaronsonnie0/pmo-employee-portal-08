
import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Employee } from './EmployeeTable';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox";

interface FilterBarProps {
  employees: Employee[];
  filters: Record<string, string[]>;
  setFilters: React.Dispatch<React.SetStateAction<Record<string, string[]>>>;
}

const FilterBar = ({ employees, filters, setFilters }: FilterBarProps) => {
  // Extract unique filter options from employees
  const getUniqueOptions = (key: keyof Employee): string[] => {
    if (key === 'skillset') {
      const allSkills = employees.flatMap(emp => Array.isArray(emp.skillset) ? emp.skillset : []);
      return [...new Set(allSkills)].sort();
    }
    
    // For numeric fields, we'll create buckets
    if (
      key === 'currentAvailability' || 
      key === 'availability30Days' || 
      key === 'availability60Days' || 
      key === 'availability90Days' || 
      key === 'availability120Days'
    ) {
      return ['0%', '25%', '50%', '75%', '100%'];
    }
    
    const options = employees
      .map(emp => {
        const value = emp[key];
        return value !== undefined && value !== null ? String(value) : '';
      })
      .filter(value => value !== '');
    
    return [...new Set(options)].sort();
  };

  // Filter configuration with display names and keys
  const filterConfigs = [
    { key: 'employmentStatus', label: 'Employment Status' },
    { key: 'functionGroup', label: 'Function Group' },
    { key: 'subFunction', label: 'Sub-Function' },
    { key: 'location', label: 'Location' },
    { key: 'jobTitle', label: 'Job Title' },
    { key: 'currentAvailability', label: 'Current Availability' },
    { key: 'availability30Days', label: 'Availability (30 Days)' },
    { key: 'availability60Days', label: 'Availability (60 Days)' },
    { key: 'availability90Days', label: 'Availability (90 Days)' },
    { key: 'availability120Days', label: 'Availability (120 Days)' },
    { key: 'primaryAccount', label: 'Primary Account' },
    { key: 'sowName', label: 'SOW Name' },
    { key: 'billabilityStatus', label: 'Billability Status' },
    { key: 'tagStatus', label: 'Tag Status' },
    { key: 'taggedForProject', label: 'Tagged For Project' },
    { key: 'smeCategory', label: 'SME Category' },
    { key: 'location', label: 'Location' },
    { key: 'skillset', label: 'Skillset' },
    // Backward compatibility
    { key: 'status', label: 'Status' }
  ];

  const handleToggleFilter = (filterType: string, value: string) => {
    setFilters(prev => {
      // Handle availability filters specially - convert percentage strings to numbers
      if (
        filterType === 'currentAvailability' ||
        filterType === 'availability30Days' ||
        filterType === 'availability60Days' ||
        filterType === 'availability90Days' ||
        filterType === 'availability120Days'
      ) {
        const numericValue = parseInt(value, 10);
        if (!isNaN(numericValue)) {
          value = numericValue.toString();
        }
      }
      
      if (prev[filterType]?.includes(value)) {
        return {
          ...prev,
          [filterType]: prev[filterType].filter(item => item !== value)
        };
      } else {
        return {
          ...prev,
          [filterType]: [...(prev[filterType] || []), value]
        };
      }
    });
  };

  const handleRemoveFilter = (filterType: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType].filter(item => item !== value)
    }));
  };

  const handleClearFilters = (filterType?: string) => {
    if (filterType) {
      setFilters(prev => ({
        ...prev,
        [filterType]: []
      }));
    } else {
      // Clear all filters
      const emptyFilters: Record<string, string[]> = {};
      filterConfigs.forEach(config => {
        emptyFilters[config.key] = [];
      });
      setFilters(emptyFilters);
    }
  };

  const renderFilterSelect = (
    config: { key: string; label: string }
  ) => {
    const { key, label } = config;
    const options = getUniqueOptions(key as keyof Employee);
    
    if (options.length === 0) return null;
    
    return (
      <div className="min-w-[180px]" key={key}>
        <Select>
          <SelectTrigger className="h-10 border-dashed">
            <SelectValue placeholder={filters[key]?.length > 0 
              ? `${label}: ${filters[key].length} selected`
              : `Filter by ${label}`} />
          </SelectTrigger>
          <SelectContent>
            <div className="max-h-[300px] overflow-auto p-1">
              {options.map((option) => (
                <div
                  key={option}
                  className="flex items-center space-x-2 rounded-md p-2 hover:bg-muted cursor-pointer"
                  onClick={() => handleToggleFilter(key, option)}
                >
                  <Checkbox 
                    id={`${key}-${option}`}
                    checked={filters[key]?.includes(option) || false}
                    onCheckedChange={() => handleToggleFilter(key, option)}
                  />
                  <label
                    htmlFor={`${key}-${option}`}
                    className="text-sm cursor-pointer flex-grow"
                  >
                    {option}
                  </label>
                </div>
              ))}
            </div>
            <div className="border-t p-1 mt-1">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-xs"
                onClick={() => handleClearFilters(key)}
              >
                Clear filters
              </Button>
            </div>
          </SelectContent>
        </Select>
      </div>
    );
  };

  // Count total active filters
  const activeFilterCount = Object.values(filters).reduce(
    (count, values) => count + (values?.length || 0), 
    0
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 sm:gap-4">
        {filterConfigs.map(config => renderFilterSelect(config))}
      </div>
      
      {/* Selected filters */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <span className="text-sm text-gray-500">Active filters:</span>
          {Object.entries(filters).map(([filterType, values]) => 
            (values || []).map(value => {
              // Find the display label for this filter type
              const filterConfig = filterConfigs.find(config => config.key === filterType);
              const filterLabel = filterConfig ? filterConfig.label : filterType;
              
              return (
                <Badge 
                  key={`${filterType}-${value}`} 
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {`${filterLabel}: ${value}`}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => handleRemoveFilter(filterType, value)} 
                  />
                </Badge>
              );
            })
          )}
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs"
            onClick={() => handleClearFilters()}
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
};

export default FilterBar;
