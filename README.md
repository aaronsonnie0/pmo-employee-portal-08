
# PMO Employee Dashboard

## Overview

The PMO Employee Dashboard is a comprehensive web application designed for Project Management Office teams to efficiently manage employee allocation data. This tool allows users to search, filter, and analyze employee information in real-time, facilitating better resource management and project staffing decisions.

## Features

### Dashboard
- **Manual Filter Table**: Filter and search through employee data using multiple criteria
- **AI Smart Search**: Natural language search to find employees based on specific needs
- **Data Export**: Export filtered employee data to Excel for further analysis
- **Add Employee**: Add new employees to the system with comprehensive details

### Reports
- **Account Tenure Reports**: Visualize employee distribution across accounts
  - FTE Count by Account
  - FTE Count by Function Group
  - Employee distribution by staffing level
  - Billability analysis
  - Location distribution
  - And more

- **Bench Tenure Reports**: Track and analyze bench resources
  - Bench by Location
  - Bench by Function Group
  - Bench tenure analysis
  - Skill distribution for bench employees

## Tech Stack

- **Frontend Framework**: React with TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui component library
- **Data Visualization**: Recharts
- **Routing**: React Router
- **Form Handling**: React Hook Form with Zod validation
- **Data Export**: XLSX

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── dashboard/        # Dashboard-specific components
│   ├── reports/          # Reporting components
│   ├── tables/           # Table-related components
│   └── ui/               # Base UI components from shadcn/ui
├── data/                 # Mock data sources
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
├── pages/                # Main application pages
└── utils/                # Helper utilities
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Navigate to the project directory
cd pmo-employee-dashboard

# Install dependencies
npm install

# Start the development server
npm run dev
```

## Usage

### Dashboard Navigation

1. **Home Screen**: Displays the welcome page with navigation to the dashboard
2. **Dashboard**: Main employee management interface
   - Use filters to narrow down employee results
   - Use search bar for quick lookups
   - Click "Add Employee" to add new team members
   - Export data as needed

### Reports

1. Navigate to the Reports section
2. Toggle between Account Tenure and Bench Tenure views
3. Analyze visualizations for resource allocation insights

## Adding an Employee

1. Click the "Add Employee" button on the Dashboard
2. Complete all required fields in the form:
   - Personal information (Name, GEP ID)
   - Professional details (Function, Location, Skills)
   - Allocation information (Status, Billability)
   - Project assignment details
3. Submit the form to add the employee to the database

## Data Export

1. Apply desired filters to narrow down employee data
2. Click the "Export to Excel" button
3. Download the generated Excel file

## AI Smart Search

1. Navigate to the AI Smart Search tab
2. Enter natural language queries like:
   - "Find all Power BI experts in Mumbai"
   - "Show me bench resources with procurement experience"
3. View matching results instantly

## Customization

The dashboard can be extended with additional features:

- Add new report types
- Integrate with backend services
- Implement user authentication
- Create additional data visualization components

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Acknowledgments

- GEP for project inspiration
- shadcn/ui for the component library
- Recharts for data visualization capabilities
