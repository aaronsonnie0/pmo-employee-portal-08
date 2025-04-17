import React, { useMemo, useState } from 'react';
import { 
  Table,
} from '@/components/ui/table';
import { format } from "date-fns";
import TableHeader from './tables/TableHeader';
import TableBody from './tables/TableBody';
import TablePagination from './tables/TablePagination';
import DateRangeFilter from './tables/DateRangeFilter';
import TextFilter from './tables/TextFilter';
import CheckboxFilter from './tables/CheckboxFilter';

export type Employee = {
  id: string;
  gepId: string;
  name: string;
  employmentStatus: string;
  functionGroup: string;
  subFunction: string;
  region: string;
  jobTitle: string;
  currentAvailability: number;
  availability30Days: number;
  availability60Days: number;
  availability90Days: number;
  availability120Days: number;
  primaryAccount: string;
  sowName: string;
  billabilityStatus: 'Allocated' | 'Billable' | 'Bench-assigned' | 'Investment';
  earliestAllocationStartDate: string;
  earliestStartDate: string;
  latestEndDate: string;
  expectedStartDate: string;
  dateOfJoining: string;
  tagStatus: 'Confirmed' | 'Not Confirmed';
  taggedForProject: string;
  smeCategory: string;
  comments: string;
  location: string;
  skillset: string[]; // Keeping this for backward compatibility
  function: string;   // Keeping this for backward compatibility
  status: 'Allocated' | 'Billable' | 'Bench-shadow' | 'Bench-support' | 'Bench-unassigned';
};

interface EmployeeTableProps {
  employees: Employee[];
  isLoading?: boolean;
  searchTerm?: string;
  filters?: Record<string, string[]>;
  page?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  totalEmployees?: number;
  onFilterChange?: (filters: Record<string, string[]>) => void;
  onSearchChange?: (searchTerm: string) => void;
}

type SortConfig = {
  key: keyof Employee | '';
  direction: 'asc' | 'desc';
};

const EmployeeTable = ({ 
  employees, 
  isLoading = false, 
  searchTerm = '', 
  filters = {},
  page = 1,
  pageSize = 10,
  onPageChange,
  totalEmployees,
  onFilterChange,
  onSearchChange
}: EmployeeTableProps) => {
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: '', direction: 'asc' });
  const [columnFilters, setColumnFilters] = useState<Record<string, string[]>>(filters);
  const [openFilter, setOpenFilter] = useState<string | null>(null);
  const [activeSearch, setActiveSearch] = useState<string>('');
  
  const [dateRange, setDateRange] = useState<{
    field: string;
    from: Date | undefined;
    to: Date | undefined;
  }>({ field: '', from: undefined, to: undefined });
  
  const handleFilterChange = (field: string, values: string[]) => {
    const newFilters = {
      ...columnFilters,
      [field]: values
    };
    
    setColumnFilters(newFilters);
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };
  
  const getUniqueFieldValues = (field: keyof Employee): string[] => {
    if (field === 'skillset') {
      const allSkills = employees
        .flatMap(e => Array.isArray(e.skillset) ? e.skillset : [])
        .filter(v => v !== undefined && v !== null && v !== '');
      return [...new Set(allSkills)].sort();
    }
    
    const values = employees.map(e => {
      const value = e[field];
      if (Array.isArray(value)) {
        return value.join(', ');
      }
      return String(value);
    }).filter(v => v !== undefined && v !== null && v !== '');
    
    return [...new Set(values)].sort();
  };
  
  const handleSearchInputChange = (value: string, field: string) => {
    setActiveSearch(value);
  };
  
  const handleSearchSubmit = (field: string) => {
    const newFilters = {
      ...columnFilters,
      [field]: activeSearch ? [activeSearch] : []
    };
    
    setColumnFilters(newFilters);
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
    setActiveSearch('');
    setOpenFilter(null);
  };
  
  const clearFilter = (field: string) => {
    const newFilters = { ...columnFilters };
    delete newFilters[field];
    setColumnFilters(newFilters);
    
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };
  
  const handleDateFilter = (field: string) => {
    if (!dateRange.from || !dateRange.to) return;
    
    const fromStr = format(dateRange.from, 'yyyy-MM-dd');
    const toStr = format(dateRange.to, 'yyyy-MM-dd');
    
    const newFilters = {
      ...columnFilters,
      [field]: [`${fromStr} to ${toStr}`]
    };
    
    setColumnFilters(newFilters);
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
    
    setDateRange({ field: '', from: undefined, to: undefined });
    setOpenFilter(null);
  };
  
  const requestSort = (key: keyof Employee) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const formatValue = (value: any, key: keyof Employee) => {
    if (value === undefined || value === null || value === '') {
      return '–';
    }
    
    if (key.includes('Availability')) {
      return `${value}%`;
    }
    
    if (key.includes('Date') && typeof value === 'string') {
      return value;
    }
    
    if (key === 'skillset' && Array.isArray(value)) {
      return (
        <div className="flex flex-wrap gap-1">
          {value.map((skill, i) => (
            <span 
              key={i} 
              className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
            >
              {skill}
            </span>
          ))}
        </div>
      );
    }
    
    return value;
  };

  const getStatusColor = (status: string, field: string) => {
    if (field === 'employmentStatus') {
      switch (status) {
        case 'Active': return 'bg-green-50 text-green-700';
        case 'Offer Accepted': return 'bg-blue-50 text-blue-700';
        case 'Resigned': return 'bg-red-50 text-red-700';
        case 'Offer Extended': return 'bg-purple-50 text-purple-700';
        case 'Background Check Initiated': return 'bg-amber-50 text-amber-700';
        default: return 'bg-gray-50 text-gray-700';
      }
    }
    
    if (field === 'billabilityStatus') {
      switch (status) {
        case 'Allocated': return 'bg-blue-50 text-blue-700';
        case 'Billable': return 'bg-green-50 text-green-700';
        case 'Bench-assigned': return 'bg-purple-50 text-purple-700';
        case 'Investment': return 'bg-amber-50 text-amber-700';
        default: return 'bg-gray-50 text-gray-700';
      }
    }
    
    if (field === 'tagStatus') {
      switch (status) {
        case 'Confirmed': return 'bg-green-50 text-green-700';
        case 'Not Confirmed': return 'bg-amber-50 text-amber-700';
        default: return 'bg-gray-50 text-gray-700';
      }
    }
    
    if (field === 'status') {
      switch (status) {
        case 'Allocated': return 'bg-blue-50 text-blue-700';
        case 'Bench-shadow': return 'bg-purple-50 text-purple-700';
        case 'Bench-support': return 'bg-amber-50 text-amber-700';
        case 'Bench-unassigned': return 'bg-gray-50 text-gray-700';
        case 'Billable': return 'bg-green-50 text-green-700';
        default: return 'bg-gray-50 text-gray-700';
      }
    }
    
    return 'bg-gray-50 text-gray-700';
  };

  const highlightText = (text: string) => {
    if (!searchTerm || typeof text !== 'string') return text;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, i) => {
      if (part.toLowerCase() === searchTerm.toLowerCase()) {
        return <span key={i} className="bg-yellow-200">{part}</span>;
      }
      return part;
    });
  };

  const isFilterActive = (field: string): boolean => {
    return columnFilters[field] !== undefined && columnFilters[field].length > 0;
  };

  const renderFilterComponent = (field: keyof Employee) => {
    const isActive = isFilterActive(field);
    
    if (field.includes('Date')) {
      return (
        <DateRangeFilter
          field={field as string}
          isActive={isActive}
          openFilter={openFilter}
          setOpenFilter={setOpenFilter}
          dateRange={dateRange}
          setDateRange={setDateRange}
          clearFilter={clearFilter}
          handleDateFilter={handleDateFilter}
        />
      );
    }
    
    if (field === 'comments' || field === 'name' || field === 'taggedForProject' || field === 'sowName') {
      return (
        <TextFilter
          field={field as string}
          isActive={isActive}
          openFilter={openFilter}
          setOpenFilter={setOpenFilter}
          activeSearch={activeSearch}
          handleSearchInputChange={handleSearchInputChange}
          handleSearchSubmit={handleSearchSubmit}
          clearFilter={clearFilter}
        />
      );
    }
    
    const options = getUniqueFieldValues(field);
    
    return (
      <CheckboxFilter
        field={field as string}
        options={options}
        selectedValues={columnFilters[field as string] || []}
        isActive={isActive}
        openFilter={openFilter}
        setOpenFilter={setOpenFilter}
        handleFilterChange={handleFilterChange}
        clearFilter={clearFilter}
      />
    );
  };

  const sortedAndFilteredEmployees = useMemo(() => {
    let filteredData = [...employees];
    
    Object.entries(columnFilters).forEach(([key, values]) => {
      if (values && values.length > 0) {
        filteredData = filteredData.filter(employee => {
          if (key.includes('Date') && values[0].includes(' to ')) {
            const [fromDate, toDate] = values[0].split(' to ');
            const employeeDate = employee[key as keyof Employee] as string;
            
            if (!employeeDate) return false;
            
            return employeeDate >= fromDate && employeeDate <= toDate;
          }
          
          const employeeValue = employee[key as keyof Employee];
          
          if (Array.isArray(employeeValue)) {
            return values.some(value => employeeValue.includes(value));
          }
          
          if (typeof employeeValue === 'string' && !key.includes('Date')) {
            return values.some(value => 
              employeeValue.toLowerCase().includes(value.toLowerCase())
            );
          }
          
          return values.includes(String(employeeValue));
        });
      }
    });
    
    if (searchTerm) {
      filteredData = filteredData.filter(employee => 
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        employee.gepId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (sortConfig.key) {
      filteredData.sort((a, b) => {
        const aValue = a[sortConfig.key as keyof Employee];
        const bValue = b[sortConfig.key as keyof Employee];
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortConfig.direction === 'asc' 
            ? aValue.localeCompare(bValue) 
            : bValue.localeCompare(aValue);
        }
        
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortConfig.direction === 'asc' 
            ? aValue - bValue 
            : bValue - aValue;
        }
        
        return 0;
      });
    }
    
    return filteredData;
  }, [employees, searchTerm, sortConfig, columnFilters]);

  const totalFilteredEmployees = sortedAndFilteredEmployees.length;
  const totalPages = totalEmployees ? Math.ceil(totalEmployees / pageSize) : Math.ceil(totalFilteredEmployees / pageSize);
  
  const columns: {key: keyof Employee, label: string}[] = [
    { key: 'gepId', label: 'Employee ID' },
    { key: 'name', label: 'Employee Name' },
    { key: 'employmentStatus', label: 'Employment Status' },
    { key: 'functionGroup', label: 'Function Group' },
    { key: 'subFunction', label: 'Sub-Function' },
    { key: 'location', label: 'Location' },
    { key: 'jobTitle', label: 'Job Title / Level' },
    { key: 'currentAvailability', label: 'Current Availability' },
    { key: 'availability30Days', label: 'Availability in 30 Days' },
    { key: 'availability60Days', label: 'Availability in 60 Days' },
    { key: 'availability90Days', label: 'Availability in 90 Days' },
    { key: 'availability120Days', label: 'Availability in 120 Days' },
    { key: 'primaryAccount', label: 'Primary Account' },
    { key: 'sowName', label: 'SOW Name' },
    { key: 'billabilityStatus', label: 'Billability Status' },
    { key: 'earliestAllocationStartDate', label: 'Earliest Allocation Start Date' },
    { key: 'earliestStartDate', label: 'Earliest Start Date' },
    { key: 'latestEndDate', label: 'Latest End Date' },
    { key: 'expectedStartDate', label: 'Expected Start Date' },
    { key: 'dateOfJoining', label: 'Date of Joining (DOJ)' },
    { key: 'tagStatus', label: 'Tag Status' },
    { key: 'taggedForProject', label: 'Tagged For Project' },
    { key: 'smeCategory', label: 'SME Category' },
    { key: 'comments', label: 'Comments' },
    { key: 'skillset', label: 'Skillset' },
  ];
  
  const paginatedEmployees = sortedAndFilteredEmployees.slice((page - 1) * pageSize, page * pageSize);

  if (isLoading) {
    return <div className="flex justify-center py-8">Loading employee data...</div>;
  }

  if (employees.length === 0) {
    return <div className="flex justify-center py-8">No employee data available</div>;
  }
  
  return (
    <div className="w-full overflow-hidden">
      <div className="w-full overflow-x-auto">
        <Table className="w-full">
          <TableHeader 
            columns={columns}
            sortConfig={sortConfig}
            onSort={requestSort}
            renderFilterComponent={renderFilterComponent}
            isFilterActive={isFilterActive}
          />
          <TableBody 
            columns={columns}
            employees={paginatedEmployees}
            searchTerm={searchTerm}
            formatValue={formatValue}
            getStatusColor={getStatusColor}
            highlightText={highlightText}
          />
        </Table>
      </div>
      
      <TablePagination 
        currentPage={page}
        totalPages={totalPages}
        onPageChange={(pageNum) => onPageChange && onPageChange(pageNum)}
      />
    </div>
  );
};

export default EmployeeTable;
