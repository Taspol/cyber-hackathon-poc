
import React from 'react';

interface PhoneFrameProps {
  children: React.ReactNode;
}

const PhoneFrame: React.FC<PhoneFrameProps> = ({ children }) => {
  return (
    <div className="relative mx-auto border-gray-900 bg-gray-900 border-[10px] rounded-[3rem] h-[780px] w-[360px] shadow-2xl overflow-hidden ring-4 ring-gray-800/20">
      {/* Screen Content Container */}
      <div className="h-full w-full bg-white rounded-[2.2rem] overflow-hidden relative">
        {/* Front Camera (Hole Punch) - Centered minimal design */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-3 h-3 bg-black rounded-full border border-gray-800/20 z-[120]"></div>
        
        {children}
      </div>

      {/* Side Buttons - Volume */}
      <div className="absolute top-36 -left-[12px] w-[2.5px] h-20 bg-gray-800 rounded-l-md shadow-inner"></div>
      {/* Side Buttons - Power */}
      <div className="absolute top-64 -right-[12px] w-[2.5px] h-14 bg-gray-800 rounded-r-md shadow-inner"></div>
    </div>
  );
};

export default PhoneFrame;
