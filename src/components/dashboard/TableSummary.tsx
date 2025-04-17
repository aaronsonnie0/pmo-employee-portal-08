
import React from 'react';

interface TableSummaryProps {
  currentPage: number;
  pageSize: number;
  totalEmployees: number;
  totalRecords: number;
}

const TableSummary = ({ 
  currentPage, 
  pageSize, 
  totalEmployees, 
  totalRecords 
}: TableSummaryProps) => {
  return (
    <div className="text-center text-sm text-gray-500">
      Showing {Math.min(pageSize, totalEmployees - (currentPage - 1) * pageSize)} of {totalEmployees} employees
      {totalEmployees !== totalRecords && (
        <span> (filtered from {totalRecords} total)</span>
      )}
    </div>
  );
};

export default TableSummary;
