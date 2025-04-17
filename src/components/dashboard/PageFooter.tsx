
import React from 'react';

const PageFooter = () => {
  return (
    <footer className="w-full py-4 border-t border-gray-100 bg-white/80 backdrop-blur-sm">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} GEP. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default PageFooter;
