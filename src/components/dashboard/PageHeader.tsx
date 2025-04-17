
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const PageHeader = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <header className="w-full px-4 py-4 sm:px-6 lg:px-8 border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <img
            src="/lovable-uploads/53234e3c-e924-4351-83bd-993a49003124.png"
            alt="GEP Logo"
            className="h-10"
          />
          <h1 className="text-xl font-semibold text-gep-dark hidden sm:block">
            PMO Employee Portal
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <nav className="flex items-center space-x-1">
            <Link to="/dashboard">
              <Button 
                variant={currentPath === '/dashboard' ? "default" : "ghost"} 
                className="flex items-center gap-1"
              >
                Dashboard
              </Button>
            </Link>
            <Link to="/reports">
              <Button 
                variant={currentPath === '/reports' ? "default" : "ghost"} 
                className="flex items-center gap-1"
              >
                Reports
              </Button>
            </Link>
          </nav>
          
          <Link to="/">
            <Button variant="ghost" className="flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default PageHeader;
