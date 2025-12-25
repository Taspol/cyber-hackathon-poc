
import React from 'react';

interface OneUIHeaderProps {
  title: string;
  subtitle?: string;
  scrolled?: boolean;
}

const OneUIHeader: React.FC<OneUIHeaderProps> = ({ title, subtitle, scrolled }) => {
  return (
    <div className={`transition-all duration-300 px-8 ${scrolled ? 'py-4' : 'py-16'} bg-white`}>
      <h1 className={`font-bold text-black transition-all duration-300 ${scrolled ? 'text-xl' : 'text-4xl'}`}>
        {title}
      </h1>
      {!scrolled && subtitle && (
        <p className="text-gray-500 mt-2 text-lg">{subtitle}</p>
      )}
    </div>
  );
};

export default OneUIHeader;
