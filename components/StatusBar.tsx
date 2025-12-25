
import React, { useState, useEffect } from 'react';
import { Icons } from '../constants';

const StatusBar: React.FC = () => {
  const [time, setTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex justify-between items-center px-8 py-3.5 w-full bg-transparent z-[130] text-[11px] font-bold tracking-tight">
      <div className="flex items-center">
        <span>{time}</span>
      </div>
      <div className="flex items-center space-x-1.5">
        <Icons.Signal className="w-[14px] h-[14px] opacity-90" />
        <Icons.Wifi className="w-[15px] h-[15px] opacity-90" />
        <div className="flex items-center space-x-0.5 ml-1">
          <span className="text-[9px] font-bold mr-0.5">100%</span>
          <div className="relative w-[18px] h-[9px] border-[1.5px] border-current rounded-[2px] opacity-90">
             <div className="absolute inset-[0.5px] bg-current rounded-[1px]"></div>
             <div className="absolute -right-[2.5px] top-1/2 -translate-y-1/2 w-[1.5px] h-[3px] bg-current rounded-r-sm"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusBar;
