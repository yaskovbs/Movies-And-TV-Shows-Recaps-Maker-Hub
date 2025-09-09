import React from 'react';

interface SpinnerProps {
  message: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ message }) => {
  return (
    <div className="text-center">
      <div
        className="animate-spin inline-block w-12 h-12 border-4 border-t-cyan-400 border-r-cyan-400 border-b-cyan-400 border-l-transparent rounded-full"
        role="status"
      >
        <span className="sr-only">Loading...</span>
      </div>
      <p className="mt-4 text-lg text-cyan-300">{message || 'Processing...'}</p>
      <p className="text-sm text-gray-400">This may take a moment.</p>
    </div>
  );
};