
import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Employee } from './EmployeeTable';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

interface EmployeeFormProps {
  onSubmit: (data: Employee) => void;
  employees: Employee[];
  editEmployee?: Employee;
}

const EmployeeForm = ({ onSubmit, employees, editEmployee }: EmployeeFormProps) => {
  // Extract unique options from employees data
  const getUniqueOptions = (key: keyof Employee): string[] => {
    if (key === 'skillset') {
      const allSkills = employees.flatMap(emp => emp.skillset);
      return [...new Set(allSkills)].filter(Boolean).sort();
    }
    
    const options = employees.map(emp => emp[key] as string);
    return [...new Set(options)].filter(Boolean).sort();
  };

  const statusOptions = getUniqueOptions('status');
  const skillsetOptions = getUniqueOptions('skillset');
  const functionOptions = getUniqueOptions('function');
  const locationOptions = getUniqueOptions('location');
  const employmentStatusOptions = getUniqueOptions('employmentStatus');
  const functionGroupOptions = getUniqueOptions('functionGroup');
  const subFunctionOptions = getUniqueOptions('subFunction');
  const regionOptions = getUniqueOptions('region');
  const jobTitleOptions = getUniqueOptions('jobTitle');
  const primaryAccountOptions = getUniqueOptions('primaryAccount');
  const billabilityStatusOptions = getUniqueOptions('billabilityStatus');
  const tagStatusOptions = getUniqueOptions('tagStatus');
  const smeCategoryOptions = getUniqueOptions('smeCategory');

  const today = new Date().toISOString().split('T')[0];

  // Define form schema with Zod
  const formSchema = z.object({
    gepId: z.string().min(1, "GEP ID is required"),
    name: z.string().min(2, "Name must be at least 2 characters"),
    skillset: z.array(z.string()).min(1, "At least one skill is required"),
    function: z.string().min(1, "Function is required"),
    location: z.string().min(1, "Location is required"),
    status: z.string().min(1, "Status is required"),
    employmentStatus: z.string().min(1, "Employment status is required"),
    functionGroup: z.string().min(1, "Function group is required"),
    subFunction: z.string().min(1, "Sub-function is required"),
    region: z.string().min(1, "Region is required"),
    jobTitle: z.string().min(1, "Job title is required"),
    currentAvailability: z.coerce.number().min(0).max(100),
    availability30Days: z.coerce.number().min(0).max(100),
    availability60Days: z.coerce.number().min(0).max(100),
    availability90Days: z.coerce.number().min(0).max(100),
    availability120Days: z.coerce.number().min(0).max(100),
    primaryAccount: z.string().optional(),
    sowName: z.string().optional(),
    billabilityStatus: z.string().min(1, "Billability status is required"),
    earliestAllocationStartDate: z.string().optional(),
    earliestStartDate: z.string().optional(),
    latestEndDate: z.string().optional(),
    expectedStartDate: z.string().optional(),
    dateOfJoining: z.string().min(1, "Date of joining is required"),
    tagStatus: z.string().min(1, "Tag status is required"),
    taggedForProject: z.string().optional(),
    smeCategory: z.string().optional(),
    comments: z.string().optional(),
  });

  type FormValues = z.infer<typeof formSchema>;

  // Initialize form with react-hook-form and zod resolver
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: editEmployee ? {
      gepId: editEmployee.gepId,
      name: editEmployee.name,
      skillset: editEmployee.skillset,
      function: editEmployee.function,
      location: editEmployee.location,
      status: editEmployee.status,
      employmentStatus: editEmployee.employmentStatus,
      functionGroup: editEmployee.functionGroup,
      subFunction: editEmployee.subFunction,
      region: editEmployee.region,
      jobTitle: editEmployee.jobTitle,
      currentAvailability: editEmployee.currentAvailability,
      availability30Days: editEmployee.availability30Days,
      availability60Days: editEmployee.availability60Days,
      availability90Days: editEmployee.availability90Days,
      availability120Days: editEmployee.availability120Days,
      primaryAccount: editEmployee.primaryAccount,
      sowName: editEmployee.sowName,
      billabilityStatus: editEmployee.billabilityStatus,
      earliestAllocationStartDate: editEmployee.earliestAllocationStartDate,
      earliestStartDate: editEmployee.earliestStartDate,
      latestEndDate: editEmployee.latestEndDate || '',
      expectedStartDate: editEmployee.expectedStartDate,
      dateOfJoining: editEmployee.dateOfJoining,
      tagStatus: editEmployee.tagStatus,
      taggedForProject: editEmployee.taggedForProject,
      smeCategory: editEmployee.smeCategory,
      comments: editEmployee.comments,
    } : {
      gepId: '',
      name: '',
      skillset: [],
      function: '',
      location: '',
      status: '',
      employmentStatus: 'Active',
      functionGroup: '',
      subFunction: '',
      region: 'APAC',
      jobTitle: '',
      currentAvailability: 0,
      availability30Days: 0,
      availability60Days: 0,
      availability90Days: 0,
      availability120Days: 0,
      primaryAccount: '',
      sowName: '',
      billabilityStatus: 'Allocated',
      earliestAllocationStartDate: today,
      earliestStartDate: today,
      latestEndDate: '',
      expectedStartDate: today,
      dateOfJoining: today,
      tagStatus: 'Not Confirmed',
      taggedForProject: '',
      smeCategory: '',
      comments: '',
    },
  });

  // Form submission handler
  const handleSubmit = (values: FormValues) => {
    // Check if the values match the required type constraints
    const validateStatus = (status: string): Employee['status'] => {
      const validStatuses: Employee['status'][] = ['Allocated', 'Billable', 'Bench-shadow', 'Bench-support', 'Bench-unassigned'];
      return validStatuses.includes(status as any) 
        ? (status as Employee['status']) 
        : 'Bench-unassigned'; // Default fallback
    };

    const validateBillabilityStatus = (status: string): Employee['billabilityStatus'] => {
      const validStatuses: Employee['billabilityStatus'][] = ['Allocated', 'Billable', 'Bench-assigned', 'Investment'];
      return validStatuses.includes(status as any) 
        ? (status as Employee['billabilityStatus']) 
        : 'Allocated'; // Default fallback
    };

    const validateTagStatus = (status: string): Employee['tagStatus'] => {
      const validStatuses: Employee['tagStatus'][] = ['Confirmed', 'Not Confirmed'];
      return validStatuses.includes(status as any) 
        ? (status as Employee['tagStatus']) 
        : 'Not Confirmed'; // Default fallback
    };

    // Creating a complete employee with all required fields
    const employeeData: Employee = {
      id: editEmployee?.id || uuidv4(),
      gepId: values.gepId,
      name: values.name,
      skillset: values.skillset,
      function: values.function,
      location: values.location,
      status: validateStatus(values.status),
      employmentStatus: values.employmentStatus,
      functionGroup: values.functionGroup,
      subFunction: values.subFunction,
      region: values.region,
      jobTitle: values.jobTitle,
      currentAvailability: values.currentAvailability,
      availability30Days: values.availability30Days,
      availability60Days: values.availability60Days,
      availability90Days: values.availability90Days,
      availability120Days: values.availability120Days,
      primaryAccount: values.primaryAccount || "Not Assigned",
      sowName: values.sowName || "N/A",
      billabilityStatus: validateBillabilityStatus(values.billabilityStatus),
      earliestAllocationStartDate: values.earliestAllocationStartDate || today,
      earliestStartDate: values.earliestStartDate || today,
      latestEndDate: values.latestEndDate || "",
      expectedStartDate: values.expectedStartDate || today,
      dateOfJoining: values.dateOfJoining,
      tagStatus: validateTagStatus(values.tagStatus),
      taggedForProject: values.taggedForProject || "None",
      smeCategory: values.smeCategory || "None",
      comments: values.comments || "",
    };
    
    onSubmit(employeeData);
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="text-lg font-medium mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="gepId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GEP ID*</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., GEP001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name*</FormLabel>
                    <FormControl>
                      <Input placeholder="Employee name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="employmentStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employment Status*</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {employmentStatusOptions.length > 0 ? (
                          employmentStatusOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem key="active" value="Active">
                            Active
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="text-lg font-medium mb-4">Function & Location</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="function"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Function*</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select function" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {functionOptions.length > 0 ? (
                          functionOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem key="default-function" value="IT">
                            IT
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="functionGroup"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Function Group*</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select function group" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {functionGroupOptions.length > 0 ? (
                          functionGroupOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem key="default-function-group" value="Development">
                            Development
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="subFunction"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sub-Function*</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select sub-function" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {subFunctionOptions.length > 0 ? (
                          subFunctionOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem key="default-sub-function" value="Web Development">
                            Web Development
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location*</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {locationOptions.length > 0 ? (
                          locationOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))
                        ) : (
                          [
                            <SelectItem key="mumbai" value="India – Mumbai">
                              India – Mumbai
                            </SelectItem>,
                            <SelectItem key="hyderabad" value="India – Hyderabad">
                              India – Hyderabad
                            </SelectItem>,
                            <SelectItem key="coimbatore" value="India – Coimbatore">
                              India – Coimbatore
                            </SelectItem>
                          ]
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="region"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Region*</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select region" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {regionOptions.length > 0 ? (
                          regionOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem key="apac" value="APAC">
                            APAC
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="jobTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Title/Level*</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select job title" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {jobTitleOptions.length > 0 ? (
                          jobTitleOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))
                        ) : (
                          [
                            <SelectItem key="developer" value="Developer">
                              Developer
                            </SelectItem>,
                            <SelectItem key="senior-developer" value="Senior Developer">
                              Senior Developer
                            </SelectItem>
                          ]
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="text-lg font-medium mb-4">Availability & Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status*</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {statusOptions.length > 0 ? (
                          statusOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))
                        ) : (
                          [
                            <SelectItem key="available" value="Available">
                              Available
                            </SelectItem>,
                            <SelectItem key="on-project" value="On Project">
                              On Project
                            </SelectItem>
                          ]
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="billabilityStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Billability Status*</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select billability status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {billabilityStatusOptions.length > 0 ? (
                          billabilityStatusOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))
                        ) : (
                          [
                            <SelectItem key="allocated" value="Allocated">
                              Allocated
                            </SelectItem>,
                            <SelectItem key="unallocated" value="Unallocated">
                              Unallocated
                            </SelectItem>
                          ]
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="currentAvailability"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Availability (%)*</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" max="100" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="availability30Days"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Availability in 30 Days (%)*</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" max="100" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="availability60Days"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Availability in 60 Days (%)*</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" max="100" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="availability90Days"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Availability in 90 Days (%)*</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" max="100" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="availability120Days"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Availability in 120 Days (%)*</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" max="100" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="text-lg font-medium mb-4">Account & Project</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="primaryAccount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primary Account</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select account" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {/* Replace empty string with a placeholder value */}
                        <SelectItem key="none" value="none">None</SelectItem>
                        {primaryAccountOptions.filter(Boolean).map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="sowName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SOW Name</FormLabel>
                    <FormControl>
                      <Input placeholder="SOW name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="tagStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tag Status*</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select tag status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {tagStatusOptions.length > 0 ? (
                          tagStatusOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))
                        ) : (
                          [
                            <SelectItem key="confirmed" value="Confirmed">
                              Confirmed
                            </SelectItem>,
                            <SelectItem key="not-confirmed" value="Not Confirmed">
                              Not Confirmed
                            </SelectItem>
                          ]
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="taggedForProject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tagged For Project</FormLabel>
                    <FormControl>
                      <Input placeholder="Project name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="text-lg font-medium mb-4">Dates</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="dateOfJoining"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date of Joining*</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(new Date(field.value), "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value ? new Date(field.value) : undefined}
                          onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : "")}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="earliestStartDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Earliest Start Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(new Date(field.value), "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value ? new Date(field.value) : undefined}
                          onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : "")}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="latestEndDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Latest End Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(new Date(field.value), "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value ? new Date(field.value) : undefined}
                          onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : "")}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="earliestAllocationStartDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Earliest Allocation Start Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(new Date(field.value), "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value ? new Date(field.value) : undefined}
                          onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : "")}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="expectedStartDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Expected Start Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(new Date(field.value), "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value ? new Date(field.value) : undefined}
                          onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : "")}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="text-lg font-medium mb-4">Skills & Other Information</h3>
            <div className="grid grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="skillset"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Skillset*</FormLabel>
                    <div className="border rounded-md p-3 space-y-2">
                      <FormDescription>Select at least one skill</FormDescription>
                      <div className="flex flex-wrap gap-2">
                        {skillsetOptions.length > 0 ? (
                          skillsetOptions.map((skill) => (
                            <label 
                              key={skill} 
                              className={`px-3 py-1 rounded-full text-sm font-medium cursor-pointer transition-colors ${
                                field.value.includes(skill) 
                                  ? 'bg-primary text-primary-foreground' 
                                  : 'bg-secondary hover:bg-secondary/80'
                              }`}
                            >
                              <input
                                type="checkbox"
                                value={skill}
                                checked={field.value.includes(skill)}
                                onChange={(e) => {
                                  const updatedSkills = e.target.checked
                                    ? [...field.value, skill]
                                    : field.value.filter(s => s !== skill);
                                  field.onChange(updatedSkills);
                                }}
                                className="sr-only"
                              />
                              {skill}
                            </label>
                          ))
                        ) : (
                          <label 
                            className={`px-3 py-1 rounded-full text-sm font-medium cursor-pointer transition-colors bg-secondary hover:bg-secondary/80`}
                          >
                            <input
                              type="checkbox"
                              value="Power BI"
                              checked={field.value.includes("Power BI")}
                              onChange={(e) => {
                                const updatedSkills = e.target.checked
                                  ? [...field.value, "Power BI"]
                                  : field.value.filter(s => s !== "Power BI");
                                field.onChange(updatedSkills);
                              }}
                              className="sr-only"
                            />
                            Power BI
                          </label>
                        )}
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="smeCategory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SME Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select SME category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {/* Replace empty string with a placeholder value */}
                        <SelectItem key="none" value="none">None</SelectItem>
                        {smeCategoryOptions.filter(Boolean).map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="comments"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Comments</FormLabel>
                    <FormControl>
                      <Input placeholder="Additional comments" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button type="submit" className="w-full md:w-auto">
            {editEmployee ? 'Update Employee' : 'Add Employee'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EmployeeForm;

