import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      <div className="ml-4 text-lg text-gray-600">Loading...</div>
    </div>
  );
};

export default LoadingSpinner;
