
import React, { useState, useEffect } from 'react';
import { Icons } from '../constants';

interface LockScreenProps {
  onUnlock: () => void;
}

const LockScreen: React.FC<LockScreenProps> = ({ onUnlock }) => {
  const [time, setTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      className="absolute inset-0 z-[80] bg-gradient-to-b from-[#1a1a2e] via-[#16213e] to-[#0f3460] flex flex-col items-center pt-20"
      onClick={onUnlock}
    >
      <div className="text-white mb-2">
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
        </svg>
      </div>
      <h1 className="text-7xl font-light text-white mb-1">{time}</h1>
      <p className="text-white text-sm font-medium mb-12">Thu, November 19</p>

      {/* Media Widget */}
      <div className="bg-white/20 backdrop-blur-md rounded-[2.5rem] p-5 w-[90%] flex flex-col items-center">
        <div className="flex items-center self-start space-x-2 mb-3 px-2">
           <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
             <div className="w-2 h-2 bg-white rounded-full"></div>
           </div>
           <span className="text-[10px] text-white/80 font-bold uppercase tracking-wider">Samsung music</span>
        </div>
        <div className="flex items-center space-x-4 w-full">
           <img src="https://picsum.photos/80/80?random=111" className="w-14 h-14 rounded-xl object-cover" alt="Album Art" />
           <div className="flex-1">
             <h4 className="text-white font-bold text-sm">Over the horizon</h4>
             <p className="text-white/60 text-xs">Samsung</p>
           </div>
        </div>
        <div className="flex justify-center items-center space-x-10 mt-5 text-white">
           <Icons.Back className="w-5 h-5" />
           <div className="w-3 h-4 border-l-2 border-r-2 border-white"></div>
           <Icons.Back className="w-5 h-5 rotate-180" />
        </div>
      </div>

      {/* Notification Icons */}
      <div className="flex space-x-4 mt-8 opacity-80">
        <Icons.Messages className="w-5 h-5 text-white" />
        <Icons.Phone className="w-5 h-5 text-white" />
        <Icons.Settings className="w-5 h-5 text-white" />
        <div className="text-white text-xs font-bold bg-white/30 rounded-full px-2 py-0.5">+3</div>
      </div>

      <div className="mt-auto pb-12">
        <p className="text-white/60 text-sm animate-pulse">Swipe to unlock</p>
      </div>

      {/* Lockscreen Shortcuts */}
      <div className="absolute bottom-10 left-8">
         <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white">
           <Icons.Phone className="w-6 h-6" />
         </div>
      </div>
      <div className="absolute bottom-10 right-8">
         <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
         </div>
      </div>
    </div>
  );
};

export default LockScreen;
