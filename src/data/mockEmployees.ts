
import { Employee } from '@/components/EmployeeTable';

// Create a function to provide default values for missing properties
const createEmployeeWithDefaults = (employee: Partial<Employee>): Employee => {
  const defaults: Partial<Employee> = {
    employmentStatus: 'Active',
    functionGroup: employee.function || 'Consulting',
    subFunction: 'Global Delivery',
    region: 'APAC',
    jobTitle: 'Consultant',
    currentAvailability: 0,
    availability30Days: 0,
    availability60Days: 50,
    availability90Days: 100,
    availability120Days: 100,
    primaryAccount: '',
    sowName: '',
    billabilityStatus: 'Allocated',
    earliestAllocationStartDate: '2023-10-15',
    earliestStartDate: '2023-10-15',
    latestEndDate: '',
    expectedStartDate: '2023-10-15',
    dateOfJoining: '2019-06-12',
    tagStatus: 'Not Confirmed',
    taggedForProject: '',
    smeCategory: '',
    comments: '',
  };

  return { ...defaults, ...employee } as Employee;
};

// Define the available skills
const skills = [
  'Power BI',
  'Strategic Sourcing',
  'Contract Management',
  'SAP',
  'Project Management',
  'Spend Analysis'
];

// Use a basic template for all employees
const employeeTemplate: Partial<Employee>[] = [
  {
    id: '1',
    gepId: 'GEP001',
    name: 'Aditya Sharma',
    skillset: ['Power BI'],
    function: 'Consulting',
    location: 'India – Mumbai',
    status: 'Allocated'
  },
  {
    id: '2',
    gepId: 'GEP002',
    name: 'Priya Patel',
    skillset: ['SAP'],
    function: 'KS',
    location: 'India – Hyderabad',
    status: 'Bench-shadow'
  },
  {
    id: '3',
    gepId: 'GEP003',
    name: 'Rajesh Kumar',
    skillset: ['Strategic Sourcing'],
    function: 'P-ops',
    location: 'India – Coimbatore',
    status: 'Billable'
  },
  {
    id: '4',
    gepId: 'GEP004',
    name: 'Sneha Gupta',
    skillset: ['Spend Analysis'],
    function: 'Consulting',
    location: 'India – Mumbai',
    status: 'Bench-unassigned'
  },
  {
    id: '5',
    gepId: 'GEP005',
    name: 'Vikram Singh',
    skillset: ['Contract Management'],
    function: 'KS',
    location: 'India – Hyderabad',
    status: 'Bench-support'
  },
  {
    id: '6',
    gepId: 'GEP006',
    name: 'Neha Reddy',
    skillset: ['Project Management'],
    function: 'P-ops',
    location: 'India – Coimbatore',
    status: 'Allocated'
  },
  {
    id: '7',
    gepId: 'GEP007',
    name: 'Arjun Nair',
    skillset: ['Power BI'],
    function: 'Consulting',
    location: 'India – Mumbai',
    status: 'Billable'
  },
  {
    id: '8',
    gepId: 'GEP008',
    name: 'Divya Krishnan',
    skillset: ['Contract Management'],
    function: 'KS',
    location: 'India – Hyderabad',
    status: 'Bench-shadow'
  },
  {
    id: '9',
    gepId: 'GEP009',
    name: 'Karthik Menon',
    skillset: ['SAP'],
    function: 'P-ops',
    location: 'India – Coimbatore',
    status: 'Bench-support'
  },
  {
    id: '10',
    gepId: 'GEP010',
    name: 'Ananya Desai',
    skillset: ['Spend Analysis'],
    function: 'Consulting',
    location: 'India – Mumbai',
    status: 'Bench-unassigned'
  },
  {
    id: '11',
    gepId: 'GEP011',
    name: 'Ravi Verma',
    skillset: ['Power BI'],
    function: 'KS',
    location: 'India – Hyderabad',
    status: 'Allocated'
  },
  {
    id: '12',
    gepId: 'GEP012',
    name: 'Meera Iyer',
    skillset: ['Strategic Sourcing'],
    function: 'P-ops',
    location: 'India – Coimbatore',
    status: 'Billable'
  },
  {
    id: '13',
    gepId: 'GEP013',
    name: 'Suresh Rao',
    skillset: ['Project Management'],
    function: 'Consulting',
    location: 'India – Mumbai',
    status: 'Bench-shadow'
  },
  {
    id: '14',
    gepId: 'GEP014',
    name: 'Kavita Mehta',
    skillset: ['SAP'],
    function: 'KS',
    location: 'India – Hyderabad',
    status: 'Bench-support'
  },
  {
    id: '15',
    gepId: 'GEP015',
    name: 'Prakash Joshi',
    skillset: ['Spend Analysis'],
    function: 'P-ops',
    location: 'India – Coimbatore',
    status: 'Bench-unassigned'
  },
  {
    id: '16',
    gepId: 'GEP016',
    name: 'Lakshmi Narayan',
    skillset: ['Contract Management'],
    function: 'Consulting',
    location: 'India – Mumbai',
    status: 'Allocated'
  },
  {
    id: '17',
    gepId: 'GEP017',
    name: 'Venkat Raman',
    skillset: ['Power BI'],
    function: 'KS',
    location: 'India – Hyderabad',
    status: 'Billable'
  },
  {
    id: '18',
    gepId: 'GEP018',
    name: 'Deepa Pillai',
    skillset: ['Strategic Sourcing'],
    function: 'P-ops',
    location: 'India – Coimbatore',
    status: 'Bench-shadow'
  },
  {
    id: '19',
    gepId: 'GEP019',
    name: 'Rahul Malhotra',
    skillset: ['Project Management'],
    function: 'Consulting',
    location: 'India – Mumbai',
    status: 'Bench-support'
  },
  {
    id: '20',
    gepId: 'GEP020',
    name: 'Jyoti Saxena',
    skillset: ['SAP'],
    function: 'KS',
    location: 'India – Hyderabad',
    status: 'Bench-unassigned'
  },
  {
    id: '21',
    gepId: 'GEP021',
    name: 'Manoj Kumar',
    skillset: ['Spend Analysis'],
    function: 'P-ops',
    location: 'India – Coimbatore',
    status: 'Allocated'
  },
  {
    id: '22',
    gepId: 'GEP022',
    name: 'Shalini Chopra',
    skillset: ['Contract Management'],
    function: 'Consulting',
    location: 'India – Mumbai',
    status: 'Billable'
  },
  {
    id: '23',
    gepId: 'GEP023',
    name: 'Gopal Iyengar',
    skillset: ['Power BI'],
    function: 'KS',
    location: 'India – Hyderabad',
    status: 'Bench-shadow'
  },
  {
    id: '24',
    gepId: 'GEP024',
    name: 'Nandini Sharma',
    skillset: ['Strategic Sourcing'],
    function: 'P-ops',
    location: 'India – Coimbatore',
    status: 'Bench-support'
  },
  {
    id: '25',
    gepId: 'GEP025',
    name: 'Amit Kapoor',
    skillset: ['Project Management'],
    function: 'Consulting',
    location: 'India – Mumbai',
    status: 'Bench-unassigned'
  },
  {
    id: '26',
    gepId: 'GEP026',
    name: 'Sunita Bose',
    skillset: ['SAP'],
    function: 'KS',
    location: 'India – Hyderabad',
    status: 'Allocated'
  },
  {
    id: '27',
    gepId: 'GEP027',
    name: 'Vijay Menon',
    skillset: ['Spend Analysis'],
    function: 'P-ops',
    location: 'India – Coimbatore',
    status: 'Billable'
  },
  {
    id: '28',
    gepId: 'GEP028',
    name: 'Pooja Rathore',
    skillset: ['Contract Management'],
    function: 'Consulting',
    location: 'India – Mumbai',
    status: 'Bench-shadow'
  },
  {
    id: '29',
    gepId: 'GEP029',
    name: 'Sanjay Khanna',
    skillset: ['Power BI'],
    function: 'KS',
    location: 'India – Hyderabad',
    status: 'Bench-support'
  },
  {
    id: '30',
    gepId: 'GEP030',
    name: 'Anjali Mathur',
    skillset: ['Strategic Sourcing'],
    function: 'P-ops',
    location: 'India – Coimbatore',
    status: 'Bench-unassigned'
  },
  {
    id: '31',
    gepId: 'GEP031',
    name: 'Girish Agarwal',
    skillset: ['Project Management'],
    function: 'Consulting',
    location: 'India – Mumbai',
    status: 'Allocated'
  },
  {
    id: '32',
    gepId: 'GEP032',
    name: 'Radha Krishnan',
    skillset: ['SAP'],
    function: 'KS',
    location: 'India – Hyderabad',
    status: 'Billable'
  },
  {
    id: '33',
    gepId: 'GEP033',
    name: 'Mohan Das',
    skillset: ['Spend Analysis'],
    function: 'P-ops',
    location: 'India – Coimbatore',
    status: 'Bench-shadow'
  },
  {
    id: '34',
    gepId: 'GEP034',
    name: 'Leela Chandra',
    skillset: ['Contract Management'],
    function: 'Consulting',
    location: 'India – Mumbai',
    status: 'Bench-support'
  },
  {
    id: '35',
    gepId: 'GEP035',
    name: 'Dinesh Prabhu',
    skillset: ['Power BI'],
    function: 'KS',
    location: 'India – Hyderabad',
    status: 'Bench-unassigned'
  },
  {
    id: '36',
    gepId: 'GEP036',
    name: 'Usha Rani',
    skillset: ['Strategic Sourcing'],
    function: 'P-ops',
    location: 'India – Coimbatore',
    status: 'Allocated'
  },
  {
    id: '37',
    gepId: 'GEP037',
    name: 'Ashok Mishra',
    skillset: ['Project Management'],
    function: 'Consulting',
    location: 'India – Mumbai',
    status: 'Billable'
  },
  {
    id: '38',
    gepId: 'GEP038',
    name: 'Sangeetha Nair',
    skillset: ['SAP'],
    function: 'KS',
    location: 'India – Hyderabad',
    status: 'Bench-shadow'
  },
  {
    id: '39',
    gepId: 'GEP039',
    name: 'Rakesh Tiwari',
    skillset: ['Spend Analysis'],
    function: 'P-ops',
    location: 'India – Coimbatore',
    status: 'Bench-support'
  },
  {
    id: '40',
    gepId: 'GEP040',
    name: 'Geeta Banerjee',
    skillset: ['Contract Management'],
    function: 'Consulting',
    location: 'India – Mumbai',
    status: 'Bench-unassigned'
  },
  {
    id: '41',
    gepId: 'GEP041',
    name: 'Rajiv Chadha',
    skillset: ['Power BI'],
    function: 'KS',
    location: 'India – Hyderabad',
    status: 'Allocated'
  },
  {
    id: '42',
    gepId: 'GEP042',
    name: 'Shobha Rao',
    skillset: ['Strategic Sourcing'],
    function: 'P-ops',
    location: 'India – Coimbatore',
    status: 'Billable'
  },
  {
    id: '43',
    gepId: 'GEP043',
    name: 'Naveen Reddy',
    skillset: ['Project Management'],
    function: 'Consulting',
    location: 'India – Mumbai',
    status: 'Bench-shadow'
  },
  {
    id: '44',
    gepId: 'GEP044',
    name: 'Asha Mirza',
    skillset: ['SAP'],
    function: 'KS',
    location: 'India – Hyderabad',
    status: 'Bench-support'
  },
  {
    id: '45',
    gepId: 'GEP045',
    name: 'Kishore Nayak',
    skillset: ['Spend Analysis'],
    function: 'P-ops',
    location: 'India – Coimbatore',
    status: 'Bench-unassigned'
  },
  {
    id: '46',
    gepId: 'GEP046',
    name: 'Vimala Krishnan',
    skillset: ['Contract Management'],
    function: 'Consulting',
    location: 'India – Mumbai',
    status: 'Allocated'
  },
  {
    id: '47',
    gepId: 'GEP047',
    name: 'Harish Pillai',
    skillset: ['Power BI'],
    function: 'KS',
    location: 'India – Hyderabad',
    status: 'Billable'
  },
  {
    id: '48',
    gepId: 'GEP048',
    name: 'Sarika Jain',
    skillset: ['Strategic Sourcing'],
    function: 'P-ops',
    location: 'India – Coimbatore',
    status: 'Bench-shadow'
  },
  {
    id: '49',
    gepId: 'GEP049',
    name: 'Nitin Saxena',
    skillset: ['Project Management'],
    function: 'Consulting',
    location: 'India – Mumbai',
    status: 'Bench-support'
  },
  {
    id: '50',
    gepId: 'GEP050',
    name: 'Latha Subramaniam',
    skillset: ['SAP'],
    function: 'KS',
    location: 'India – Hyderabad',
    status: 'Bench-unassigned'
  }
];

// Map the template to fully-populated Employee objects
export const mockEmployees: Employee[] = employeeTemplate.map(createEmployeeWithDefaults);
