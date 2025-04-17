import React, { useState } from 'react';
import PageHeader from '@/components/dashboard/PageHeader';
import PageFooter from '@/components/dashboard/PageFooter';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BarChart from '@/components/reports/BarChart';
import PieChart from '@/components/reports/PieChart';
import StackedBarChart from '@/components/reports/StackedBarChart';
import TagCloud from '@/components/reports/TagCloud';
import SummaryCard from '@/components/reports/SummaryCard';
import { 
  BarChart as BarChartIcon, 
  PieChart as PieChartIcon,
  LineChart,
  ListChecks,
  Users as UsersIcon,
  DollarSign,
  Briefcase,
  Building
} from 'lucide-react';

import {
  accountData,
  functionGroupData,
  staffingLevelData,
  billabilityData,
  monthsActiveData,
  gepExperienceData,
  locationData,
  skillDistributionData,
  tagStatusData,
  sowNameData,
  skillTagCloudData,
  benchTotalData,
  benchLocationData,
  benchFunctionData,
  benchMonthsData,
  benchBillabilityData,
  benchAccountData,
  benchStaffingData,
  benchExperienceData,
  benchSkillData,
  benchTaggedProjectsData
} from '@/data/mockReportData';

const Reports = () => {
  const [activeTab, setActiveTab] = useState("account");
  
  const colorMap = {
    "Billable": "#3b82f6",
    "Allocated": "#10b981",
    "Investment": "#f59e0b",
    "Bench-assigned": "#ef4444",
    "Junior": "#60a5fa", 
    "Mid-Level": "#4ade80",
    "Management": "#fcd34d",
    "Leadership": "#f87171",
    "Confirmed": "#10b981",
    "Not Confirmed": "#f87171",
    "0-6 months": "#60a5fa",
    "6-12 months": "#4ade80",
    "12-18 months": "#fcd34d",
    "18+ months": "#f87171",
    "1-6 months": "#60a5fa",
    "1 month or less": "#60a5fa",
    "2-3 months": "#fcd34d",
    "3+ months": "#f87171",
    "Unassigned": "#ef4444",
    "Shadow": "#f59e0b",
    "Support": "#10b981",
    "Bench-Unassigned": "#ef4444"
  };
  
  const accountColors = {
    'Consulting': '#3b82f6',
    'KS': '#10b981',
    'P-ops': '#f59e0b'
  };
  
  const accountFunctionKeys = Object.keys(accountColors).map(key => ({
    key,
    color: accountColors[key as keyof typeof accountColors],
    stackId: "a"
  }));
  
  const benchAccountKeys = [
    { key: 'Bench-Unassigned', color: '#ef4444', stackId: "a" },
    { key: 'Shadow', color: '#f59e0b', stackId: "a" },
    { key: 'Support', color: '#10b981', stackId: "a" }
  ];
  
  const totalBillableEmployees = billabilityData.find(item => item.name === 'Billable')?.value || 0;
  
  const totalAllocatedEmployees = billabilityData.find(item => item.name === 'Allocated')?.value || 0;
  
  const mostStaffedAccount = accountData.reduce((prev, current) => {
    const prevTotal = prev.Consulting + prev.KS + prev['P-ops'];
    const currentTotal = current.Consulting + current.KS + current['P-ops'];
    return prevTotal > currentTotal ? prev : current;
  });
  
  const mostStaffedAccountTotal = 
    mostStaffedAccount.Consulting + 
    mostStaffedAccount.KS + 
    mostStaffedAccount['P-ops'];
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <PageHeader />
      
      <main className="flex-1 w-full px-4 py-8 max-w-7xl mx-auto">
        <div className="space-y-6">
          <section>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Reports</h1>
            </div>
            
            <Tabs defaultValue="account" className="w-full" onValueChange={(value) => setActiveTab(value)}>
              <TabsList className="mb-6">
                <TabsTrigger value="account" className="flex items-center gap-2">
                  <BarChartIcon size={16} />
                  <span>Account Tenure</span>
                </TabsTrigger>
                <TabsTrigger value="bench" className="flex items-center gap-2">
                  <PieChartIcon size={16} />
                  <span>Bench Tenure</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="account" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <SummaryCard
                    title="Total Billable Employees"
                    value={totalBillableEmployees}
                    description="Employees currently billable to clients"
                    icon={<DollarSign />}
                    color="bg-blue-500"
                  />
                  <SummaryCard
                    title="Employees Allocated to Projects"
                    value={totalAllocatedEmployees}
                    description="Employees assigned to active projects"
                    icon={<Briefcase />}
                    color="bg-green-500"
                  />
                  <SummaryCard
                    title="Most Staffed Client"
                    value={`${mostStaffedAccount.name} – ${mostStaffedAccountTotal}`}
                    description="Top account by employee count"
                    icon={<Building />}
                    color="bg-purple-500"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <StackedBarChart
                    data={accountData}
                    title="FTE Count by Account"
                    keys={accountFunctionKeys}
                    xAxisDataKey="name"
                    showLegend={true}
                    className="col-span-1"
                    description="Employee count by primary account, stacked by function group"
                  />
                  
                  <BarChart
                    data={functionGroupData}
                    title="FTE Count by Function Group"
                    isHorizontal={true}
                    barColor="#3b82f6"
                    className="col-span-1"
                    description="Number of employees in each function group"
                  />
                  
                  <PieChart
                    data={staffingLevelData}
                    title="% FTE by Staffing Level"
                    colorMap={colorMap}
                    innerRadius={60}
                    outerRadius={90}
                    className="col-span-1"
                    description="Employee distribution by staffing level"
                  />
                  
                  <BarChart
                    data={billabilityData}
                    title="FTE by Billability Type"
                    colorMap={colorMap}
                    className="col-span-1"
                    description="Employee count by billability category"
                  />
                  
                  <BarChart
                    data={monthsActiveData}
                    title="Months Active on Account"
                    colorMap={colorMap}
                    className="col-span-1"
                    description="Employee tenure based on allocation start date"
                  />
                  
                  <BarChart
                    data={gepExperienceData}
                    title="GEP Experience"
                    colorMap={colorMap}
                    className="col-span-1"
                    description="Employee tenure based on date of joining"
                  />
                  
                  <PieChart
                    data={locationData}
                    title="Employee Count by Location"
                    className="col-span-1"
                    description="Employee distribution by location"
                  />
                  
                  <BarChart
                    data={skillDistributionData}
                    title="Skill Distribution"
                    isHorizontal={true}
                    barColor="#8b5cf6"
                    className="col-span-1"
                    description="Employee skills frequency"
                  />
                  
                  <PieChart
                    data={tagStatusData}
                    title="Tag Status Count"
                    colorMap={colorMap}
                    innerRadius={60}
                    outerRadius={90}
                    className="col-span-1"
                    description="Confirmed vs Not Confirmed tag status"
                  />
                  
                  <BarChart
                    data={sowNameData}
                    title="SOW Name Frequency"
                    barColor="#8b5cf6"
                    className="col-span-1"
                    description="Most frequent SOW names"
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="bench" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <SummaryCard
                    title="Unassigned Bench"
                    value={benchTotalData.find(item => item.name === 'Unassigned')?.value || 0}
                    description="Employees currently unassigned"
                    icon={<UsersIcon />}
                    color="bg-red-500"
                  />
                  <SummaryCard
                    title="Shadow Bench"
                    value={benchTotalData.find(item => item.name === 'Shadow')?.value || 0}
                    description="Employees on shadowing assignments"
                    icon={<UsersIcon />}
                    color="bg-amber-500"
                  />
                  <SummaryCard
                    title="Support Bench"
                    value={benchTotalData.find(item => item.name === 'Support')?.value || 0}
                    description="Employees on support assignments"
                    icon={<UsersIcon />}
                    color="bg-green-500"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <BarChart
                    title="Bench by Location"
                    data={benchLocationData}
                    description="Bench employees distribution by location"
                    height={300}
                    barColor="#3b82f6"
                  />
                  
                  <BarChart
                    title="Bench Count by Function Group"
                    data={benchFunctionData}
                    description="Distribution of bench employees by function"
                    height={300}
                    barColor="#8b5cf6"
                  />
                  
                  <BarChart
                    title="Months on Bench"
                    data={benchMonthsData}
                    description="Employee tenure on bench"
                    colorMap={colorMap}
                    className="col-span-1"
                    height={300}
                  />
                  
                  <BarChart
                    title="Bench by Billability Type"
                    data={benchBillabilityData}
                    description="Bench employees by type"
                    colorMap={colorMap}
                    className="col-span-1"
                  />
                  
                  <StackedBarChart
                    data={benchAccountData}
                    title="Bench by Account"
                    keys={benchAccountKeys}
                    xAxisDataKey="name"
                    showLegend={true}
                    className="col-span-1"
                    description="Bench employee count by primary account"
                  />
                  
                  <PieChart
                    data={benchStaffingData}
                    title="% Bench by Staffing Level"
                    colorMap={colorMap}
                    innerRadius={60}
                    outerRadius={90}
                    className="col-span-1"
                    description="Bench employee distribution by staffing level"
                  />
                  
                  <BarChart
                    data={benchExperienceData}
                    title="GEP Experience (Bench Only)"
                    colorMap={colorMap}
                    className="col-span-1"
                    description="Bench employee tenure based on date of joining"
                    height={300}
                  />
                  
                  <BarChart
                    data={benchSkillData}
                    title="Skill Distribution (Bench Only)"
                    isHorizontal={true}
                    barColor="#8b5cf6"
                    className="col-span-1"
                    description="Skills frequency of bench employees"
                  />
                </div>
              </TabsContent>
            </Tabs>
          </section>
        </div>
      </main>
      
      <PageFooter />
    </div>
  );
};

export default Reports;
