
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface DashboardHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const DashboardHeader = ({ searchTerm, onSearchChange }: DashboardHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-2xl font-bold text-gep-dark sm:text-3xl">
          Employee Dashboard
        </h1>
        <p className="text-gray-600 mt-1">
          Search, filter, and manage employee allocation data
        </p>
      </div>
      <div className="relative w-full sm:w-auto">
        <Input 
          type="text" 
          placeholder="Search by name or GEP ID..." 
          className="pl-9 pr-4 py-2 w-full sm:w-[250px]"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
      </div>
    </div>
  );
};

export default DashboardHeader;
