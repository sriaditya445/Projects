import React from 'react';
import { Loader2 } from 'lucide-react';

const Loader = ({ size = 48, className = '' }) => {
  return (
    <div className={`flex justify-center items-center min-h-[50vh] ${className}`}>
      <Loader2 size={size} className="animate-spin text-accent" />
    </div>
  );
};

export default Loader;
