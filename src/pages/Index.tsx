
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const Index = () => {
  const logoRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Sequential animation effect
    const timer1 = setTimeout(() => {
      if (logoRef.current) {
        logoRef.current.classList.add('opacity-100');
        logoRef.current.classList.remove('opacity-0', 'translate-y-4');
      }
    }, 300);

    const timer2 = setTimeout(() => {
      if (contentRef.current) {
        contentRef.current.classList.add('opacity-100');
        contentRef.current.classList.remove('opacity-0', 'translate-y-4');
      }
    }, 600);

    const timer3 = setTimeout(() => {
      if (buttonRef.current) {
        buttonRef.current.classList.add('opacity-100');
        buttonRef.current.classList.remove('opacity-0', 'translate-y-4');
      }
    }, 900);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-pattern">
      <div className="absolute inset-0 bg-gradient-to-b from-white via-white to-gray-50 z-0"></div>
      
      <div className="relative z-10 flex-1 flex flex-col">
        {/* Header */}
        <header className="w-full py-6 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div 
              ref={logoRef} 
              className="transition-all duration-700 ease-out opacity-0 translate-y-4"
            >
              <img
                src="/lovable-uploads/53234e3c-e924-4351-83bd-993a49003124.png"
                alt="GEP Logo"
                className="h-12 sm:h-14"
              />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-12">
          <div className="max-w-4xl w-full text-center space-y-8">
            <div 
              ref={contentRef} 
              className="transition-all duration-700 ease-out opacity-0 translate-y-4 space-y-6"
            >
              <div className="inline-block bg-blue-50 rounded-full px-3 py-1 mb-3">
                <span className="text-gep-blue text-sm font-medium">PMO Portal</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gep-dark tracking-tight">
                PMO Employee Search & Management
              </h1>
              
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Easily search, filter, and manage employee allocation data in real-time.
              </p>
            </div>
            
            <div 
              ref={buttonRef} 
              className="transition-all duration-700 ease-out opacity-0 translate-y-4 pt-6"
            >
              <Link to="/dashboard">
                <Button 
                  size="lg" 
                  className="px-8 py-6 rounded-lg text-lg bg-gep-blue hover:bg-gep-blue/90 transition-all shadow-md hover:shadow-lg group"
                >
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 ease-in-out group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="w-full py-6 px-4 sm:px-6 lg:px-8 border-t border-gray-100">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center">
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} GEP. All rights reserved.
            </p>
            <div className="mt-4 sm:mt-0">
              <nav className="flex space-x-6">
                <a href="#" className="text-sm text-gray-500 hover:text-gep-blue transition-colors">Privacy</a>
                <a href="#" className="text-sm text-gray-500 hover:text-gep-blue transition-colors">Terms</a>
                <a href="#" className="text-sm text-gray-500 hover:text-gep-blue transition-colors">Contact</a>
              </nav>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
