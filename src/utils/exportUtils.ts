
import * as XLSX from 'xlsx';
import { format } from 'date-fns';
import { Employee } from '@/components/EmployeeTable';

/**
 * Export data to Excel file
 * @param data Array of objects to export
 * @param filename Filename without extension
 */
export const exportToExcel = (data: Employee[], filename: string = 'employee-data') => {
  try {
    if (!data || data.length === 0) {
      console.warn('No data to export');
      return false;
    }
    
    // Create a worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);
    
    // Create a workbook
    const workbook = XLSX.utils.book_new();
    
    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Employees');
    
    // Generate Excel file with current date in filename
    const currentDate = format(new Date(), 'yyyy-MM-dd');
    XLSX.writeFile(workbook, `${filename}-${currentDate}.xlsx`);
    
    return true;
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    return false;
  }
};
