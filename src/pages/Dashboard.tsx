import React, { useState, useEffect } from 'react';
import { mockEmployeeData } from '@/data/mockEmployeeData';
import EmployeeTable from '@/components/EmployeeTable';
import AISearch from '@/components/AISearch';
import PageHeader from '@/components/dashboard/PageHeader';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import ActionBar from '@/components/dashboard/ActionBar';
import TableSummary from '@/components/dashboard/TableSummary';
import PageFooter from '@/components/dashboard/PageFooter';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { exportToExcel } from '@/utils/exportUtils';
import { Employee } from '@/components/EmployeeTable';
import { toast } from '@/components/ui/use-toast';
import AddEmployeeDialog from '@/components/AddEmployeeDialog';

// Page size options for the data table
const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

// Get the 50 employee records with only one skillset per employee
const normalizeEmployeeData = () => {
  return mockEmployeeData.map(employee => {
    // Ensure each employee has only one skillset (take the first one if multiple exist)
    const singleSkillset = Array.isArray(employee.skillset) && employee.skillset.length > 0 
      ? [employee.skillset[0]] 
      : ['Power BI']; // Default fallback
      
    return {
      ...employee,
      skillset: singleSkillset
    };
  });
};

const Dashboard = () => {
  const [employees, setEmployees] = useState(normalizeEmployeeData());
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const [error, setError] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [activeTab, setActiveTab] = useState<string>("manual-filter");
  const [aiSearchResults, setAiSearchResults] = useState<Employee[]>([]);
  
  // Reset to first page when filters or search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, searchTerm]);
  
  // Validate location data to ensure only Mumbai, Hyderabad, Coimbatore are used
  useEffect(() => {
    const validLocations = ['India – Mumbai', 'India – Hyderabad', 'India – Coimbatore'];
    const hasInvalidLocations = employees.some(emp => !validLocations.includes(emp.location));
    
    if (hasInvalidLocations) {
      console.warn('Some employees have invalid locations. Only Mumbai, Hyderabad, and Coimbatore are valid.');
    }
  }, [employees]);
  
  // Get filtered employees to calculate total for pagination
  const getFilteredEmployees = () => {
    let filteredData = [...employees];
    
    // Apply filters
    Object.entries(filters).forEach(([key, values]) => {
      if (values && values.length > 0) {
        filteredData = filteredData.filter(employee => {
          const employeeValue = employee[key as keyof typeof employee];
          
          // Handle array values (like skillset)
          if (Array.isArray(employeeValue)) {
            return values.some(value => employeeValue.includes(value));
          }
          
          // Handle string values
          return values.includes(String(employeeValue));
        });
      }
    });
    
    // Apply search filter
    if (searchTerm) {
      filteredData = filteredData.filter(employee => 
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        employee.gepId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filteredData;
  };
  
  const filteredEmployees = getFilteredEmployees();
  const totalEmployees = filteredEmployees.length;

  // Handle export based on current active tab
  const handleExport = () => {
    let dataToExport: Employee[] = [];
    let filename = 'employee-dashboard';
    
    if (activeTab === 'manual-filter') {
      dataToExport = filteredEmployees;
      filename = 'employee-filtered-results';
    } else if (activeTab === 'ai-smart-search') {
      dataToExport = aiSearchResults;
      filename = 'employee-ai-search-results';
    }
    
    const success = exportToExcel(dataToExport, filename);
    
    if (success) {
      toast({
        title: "Export Successful",
        description: `Successfully exported ${dataToExport.length} employees to Excel`,
      });
      console.log(`Successfully exported ${dataToExport.length} employees to Excel`);
    } else {
      toast({
        title: "Export Failed",
        description: "Failed to export employees to Excel",
        variant: "destructive",
      });
      console.error('Failed to export employees to Excel');
    }
  };

  // Callback function to receive AI search results from AISearch component
  const handleAISearchResults = (results: Employee[]) => {
    // Ensure AI search results also have only one skillset per employee
    const normalizedResults = results.map(employee => ({
      ...employee,
      skillset: Array.isArray(employee.skillset) && employee.skillset.length > 0 
        ? [employee.skillset[0]] 
        : ['Power BI'] // Default fallback
    }));
    
    setAiSearchResults(normalizedResults);
  };

  // Handle adding a new employee
  const handleAddEmployee = (newEmployee: Employee) => {
    setEmployees(prevEmployees => [newEmployee, ...prevEmployees]);
    
    toast({
      title: "Employee Added",
      description: `${newEmployee.name} was added successfully`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex flex-col">
      <PageHeader />
      
      <main className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8">
        <div className="w-full space-y-6">
          <DashboardHeader 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
          
          <Tabs defaultValue="manual-filter" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="manual-filter" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Manual Filter Table</TabsTrigger>
              <TabsTrigger value="ai-smart-search" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">AI Smart Search</TabsTrigger>
            </TabsList>
            
            <TabsContent value="manual-filter">
              <ActionBar 
                employees={normalizeEmployeeData()}
                filteredEmployees={filteredEmployees}
                isAddDialogOpen={isAddDialogOpen}
                setIsAddDialogOpen={setIsAddDialogOpen}
                pageSize={pageSize}
                setPageSize={setPageSize}
                setCurrentPage={setCurrentPage}
                pageSizeOptions={PAGE_SIZE_OPTIONS}
                onExport={handleExport}
              />
              
              <div className="bg-white rounded-lg shadow-sm border overflow-hidden transition duration-300 hover:shadow-md">
                <EmployeeTable 
                  employees={employees} 
                  searchTerm={searchTerm}
                  filters={filters}
                  page={currentPage}
                  pageSize={pageSize}
                  onPageChange={setCurrentPage}
                  totalEmployees={totalEmployees}
                  onFilterChange={setFilters}
                  onSearchChange={setSearchTerm}
                />
              </div>
              
              <TableSummary 
                currentPage={currentPage}
                pageSize={pageSize}
                totalEmployees={totalEmployees}
                totalRecords={employees.length}
              />
            </TabsContent>
            
            <TabsContent value="ai-smart-search">
              <ActionBar 
                employees={normalizeEmployeeData()}
                isAddDialogOpen={isAddDialogOpen}
                setIsAddDialogOpen={setIsAddDialogOpen}
                pageSize={pageSize}
                setPageSize={setPageSize}
                setCurrentPage={setCurrentPage}
                pageSizeOptions={PAGE_SIZE_OPTIONS}
                inAIMode={true}
                onExport={handleExport}
              />
              <AISearch 
                employees={employees} 
                onResultsChange={handleAISearchResults} 
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <PageFooter />
      
      <AddEmployeeDialog 
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSubmit={handleAddEmployee}
        employees={employees}
      />
    </div>
  );
};

export default Dashboard;
