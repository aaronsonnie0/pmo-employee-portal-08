
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SearchIcon, Loader, ChevronRightIcon, ChevronLeftIcon } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Employee } from './EmployeeTable';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

interface AISearchProps {
  employees: Employee[];
  onResultsChange?: (results: Employee[]) => void;
}

const allColumns = [
  { key: 'gepId', label: 'Employee ID' },
  { key: 'name', label: 'Employee Name' },
  { key: 'employmentStatus', label: 'Employment Status' },
  { key: 'functionGroup', label: 'Function Group' },
  { key: 'subFunction', label: 'Sub-Function' },
  { key: 'region', label: 'Region' },
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
  { key: 'location', label: 'Location' },
  { key: 'skillset', label: 'Skillset' }
];

const AISearch = ({ employees, onResultsChange }: AISearchProps) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<Employee[] | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
  
  const API_KEY = 'AIzaSyD55ijNQYc58WCeChvC24b4MpUEgMHJBVg';

  const handleSearch = async () => {
    if (!query.trim()) {
      toast({
        title: "Empty Query",
        description: "Please enter a search query",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      setResults(null);
      setErrorMessage(null);
      setCurrentPage(1);

      const metaPrompt = `You are an AI assistant that helps filter employee data based on user queries.

YOUR TASK: Search within the dataset provided below and return employees that match this query: "${query}"

Here is the complete employee dataset to search within:
${JSON.stringify(employees, null, 2)}

IMPORTANT INSTRUCTIONS:
1. ONLY return employees from the provided dataset that match the query criteria
2. Return results as a valid JSON array that can be parsed with JSON.parse()
3. Each result MUST include ALL fields for each matching employee record, exactly as they appear in the dataset
4. Pay SPECIAL ATTENTION to the 'skillset' field which contains skills like 'Power BI', 'SAP', 'Strategic Sourcing', etc.
5. For skillset queries (e.g., "find employees with SAP skills"), check the 'skillset' array for matches
6. Do not add any explanation, markdown, or text outside of the JSON array
7. If no employees match the criteria, return an empty array []
8. Make your response ONLY the JSON array, nothing else
9. Only include employees from Mumbai, Hyderabad, or Coimbatore locations

Your response must be structured exactly like this:
[
  {
    "id": "...",
    "gepId": "...",
    "name": "...",
    "skillset": ["..."],
    ... include all fields ...
  },
  ... more matching employees ...
]`;

      console.log("Sending search request to Gemini API...");
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: metaPrompt
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.1,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 8192,
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API Error details:', errorData);
        throw new Error(`API request failed: ${response.status} - ${errorData?.error?.message || response.statusText}`);
      }

      const data = await response.json();
      
      let responseText = '';
      if (data.candidates && data.candidates[0]?.content?.parts) {
        responseText = data.candidates[0].content.parts[0].text;
      } else {
        throw new Error('Unexpected API response format');
      }

      console.log("Raw API response text:", responseText);

      let cleanedText = responseText.replace(/```json\s*([\s\S]*?)\s*```/g, '$1');
      cleanedText = cleanedText.replace(/```\s*([\s\S]*?)\s*```/g, '$1');
      
      cleanedText = cleanedText.trim();
      
      let jsonMatch = cleanedText.match(/\[\s*\{[\s\S]*\}\s*\]/);
      if (!jsonMatch) {
        jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
      }

      const jsonText = jsonMatch ? jsonMatch[0] : cleanedText;
      
      let parsedResults;
      
      try {
        parsedResults = JSON.parse(jsonText);
        
        if (!Array.isArray(parsedResults)) {
          if (typeof parsedResults === 'object' && parsedResults !== null) {
            parsedResults = [parsedResults];
          } else {
            throw new Error('Response is not an object or array');
          }
        }

        const validResults = parsedResults.filter(item => 
          item && item.gepId && item.name && 
          (item.employmentStatus !== undefined) && 
          (item.functionGroup !== undefined) && 
          (item.subFunction !== undefined)
        );

        if (validResults.length === 0 && parsedResults.length > 0) {
          throw new Error('Response missing required fields');
        }

        setResults(validResults);
        if (onResultsChange) {
          onResultsChange(validResults);
        }

        if (validResults.length === 0) {
          toast({
            title: "No matching results",
            description: "Try a different search query",
          });
        } else {
          toast({
            title: "Search complete",
            description: `Found ${validResults.length} matching employees`,
          });
        }
      } catch (error) {
        console.error("JSON parsing error:", error);
        console.log("Text being parsed:", jsonText);
        
        try {
          const fixedJson = jsonText
            .replace(/(\w+)(?=:)/g, '"$1"')
            .replace(/'/g, '"');
            
          parsedResults = JSON.parse(fixedJson);
          
          if (!Array.isArray(parsedResults)) {
            if (typeof parsedResults === 'object' && parsedResults !== null) {
              parsedResults = [parsedResults];
            }
          }
          
          const validResults = parsedResults.filter(item => 
            item && item.gepId && item.name
          );
          
          setResults(validResults);
          
          if (validResults.length === 0) {
            toast({
              title: "No matching results",
              description: "Try a different search query",
            });
          } else {
            toast({
              title: "Search recovered",
              description: `Found ${validResults.length} matching employees after fixing JSON`,
            });
          }
        } catch (recoveryError) {
          setErrorMessage("Could not parse results from the AI response. Try simplifying your query or be more specific.");
          throw new Error('Failed to parse JSON from API response');
        }
      }

    } catch (error) {
      console.error('AI Search Error:', error);
      setErrorMessage(error instanceof Error ? error.message : "Unknown error occurred");
      toast({
        title: "Search failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const totalPages = results ? Math.ceil(results.length / pageSize) : 0;
  const paginatedResults = results ? 
    results.slice((currentPage - 1) * pageSize, currentPage * pageSize) 
    : [];

  const formatCellValue = (value: any, key: string) => {
    if (value === undefined || value === null || value === '') {
      return '-';
    }

    if (key.includes('Date') && typeof value === 'string') {
      return value;
    }

    if (Array.isArray(value)) {
      return (
        <div className="flex flex-wrap gap-1">
          {value.map((item, i) => (
            <span key={i} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
              {item}
            </span>
          ))}
        </div>
      );
    }

    if (key.includes('vailability') && typeof value === 'number') {
      return `${value}%`;
    }

    if (key === 'billabilityStatus' || key === 'employmentStatus' || 
        key === 'tagStatus' || key === 'status') {
      return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 'Allocated' ? 'bg-green-50 text-green-700' :
          value === 'Billable' ? 'bg-blue-50 text-blue-700' :
          value === 'Bench-support' || value === 'Bench-shadow' ? 'bg-orange-50 text-orange-700' :
          value === 'Active' ? 'bg-green-50 text-green-700' :
          value === 'Confirmed' ? 'bg-blue-50 text-blue-700' :
          'bg-purple-50 text-purple-700'
        }`}>
          {value}
        </span>
      );
    }

    return value;
  };

  return (
    <div className="space-y-6 bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-all duration-300">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-blue-700">AI-Powered Smart Search</h2>
        <p className="text-sm text-gray-500">
          Search using natural language like "Find employees in Mumbai with Power BI skills" or "Show Senior Managers with 100% current availability"
        </p>
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="e.g., Find employees in Hyderabad skilled in SAP who are unassigned"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1"
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Button 
          onClick={handleSearch}
          disabled={isLoading}
          className="flex items-center gap-2 whitespace-nowrap bg-blue-600 hover:bg-blue-700"
        >
          {isLoading ? <Loader className="h-4 w-4 animate-spin" /> : <SearchIcon className="h-4 w-4" />}
          {isLoading ? "Searching..." : "Search with AI"}
        </Button>
      </div>

      {errorMessage && (
        <Alert variant="destructive" className="mt-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {errorMessage}
            <div className="mt-2 text-sm">
              Try simplifying your query or using more specific terms.
            </div>
          </AlertDescription>
        </Alert>
      )}

      {isLoading && (
        <div className="flex justify-center py-6">
          <div className="flex flex-col items-center gap-2">
            <Loader className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-gray-500">Processing your query with AI...</p>
          </div>
        </div>
      )}

      {results && results.length > 0 && (
        <>
          {/* Updated table container with proper horizontal scrolling */}
          <div className="border rounded-md">
            <div className="w-full overflow-x-auto" style={{ scrollbarWidth: 'auto' }}>
              <div className="min-w-max">
                <Table>
                  <TableHeader className="bg-gray-100 sticky top-0 z-10">
                    <TableRow>
                      {allColumns.map((column) => (
                        <TableHead key={column.key} className="font-bold text-gep-dark whitespace-nowrap py-3 px-4">
                          {column.label}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedResults.map((employee, index) => (
                      <TableRow key={employee.id || index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50 hover:bg-gray-100'}>
                        {allColumns.map((column) => (
                          <TableCell key={`${employee.id}-${column.key}`} className="py-3 px-4 whitespace-nowrap">
                            {formatCellValue(employee[column.key as keyof Employee], column.key)}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-500">
              Showing {((currentPage - 1) * pageSize) + 1}-{Math.min(currentPage * pageSize, results.length)} of {results.length} results
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              >
                <ChevronLeftIcon className="h-4 w-4" />
              </Button>
              <span className="text-sm">{currentPage} / {totalPages}</span>
              <Button 
                variant="outline" 
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              >
                <ChevronRightIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}

      {results && results.length === 0 && (
        <div className="text-center py-6 text-gray-500">
          No employees found matching your query. Try a different search term.
        </div>
      )}
    </div>
  );
};

export default AISearch;
