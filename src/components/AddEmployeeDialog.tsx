
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import EmployeeForm from '@/components/EmployeeForm';
import { Employee } from '@/components/EmployeeTable';

interface AddEmployeeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (employee: Employee) => void;
  employees: Employee[];
}

const AddEmployeeDialog = ({ isOpen, onClose, onSubmit, employees }: AddEmployeeDialogProps) => {
  const handleEmployeeSubmit = (employee: Employee) => {
    onSubmit(employee);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Add New Employee</DialogTitle>
        </DialogHeader>
        <EmployeeForm 
          onSubmit={handleEmployeeSubmit}
          employees={employees}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddEmployeeDialog;
