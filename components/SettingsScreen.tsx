
import React from 'react';
import { Icons } from '../constants';

const SettingsScreen: React.FC<{ scrolled: boolean }> = ({ scrolled }) => {
  return (
    <div className="bg-[#f2f4f7] min-h-full">
      {/* Search Header */}
      <div className={`fixed top-12 left-0 right-0 h-14 flex items-center justify-end px-8 z-40 transition-opacity ${scrolled ? 'opacity-100' : 'opacity-100'}`}>
         <Icons.Search className="w-5 h-5 text-gray-800" />
      </div>

      {/* Title */}
      <div className={`px-8 transition-all duration-300 ${scrolled ? 'pt-24 pb-4' : 'pt-32 pb-8'}`}>
        <h1 className={`font-bold text-gray-900 transition-all ${scrolled ? 'text-xl' : 'text-4xl'}`}>Settings</h1>
      </div>

      <div className="px-5 space-y-4 pb-20">
        {/* Profile Card */}
        <div className="bg-white rounded-[2rem] p-6 shadow-sm flex items-center space-x-5 active:bg-gray-50 transition-colors">
          <img src="https://i.pravatar.cc/150?u=christina" className="w-16 h-16 rounded-full border-2 border-white shadow-sm" alt="Profile" />
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900">Christina Adams</h3>
            <p className="text-sm text-gray-400">adams@gmail.com</p>
          </div>
          <span className="text-gray-300">›</span>
        </div>

        {/* Setting Groups */}
        <div className="bg-white rounded-[2rem] overflow-hidden shadow-sm">
           {[
             { label: 'Connections', sub: 'Wi-Fi, Bluetooth, Airplane mode', icon: '📡', color: 'bg-blue-400' },
             { label: 'Sounds and vibration', sub: 'Sound mode, Ringtone', icon: '🔊', color: 'bg-purple-400' },
             { label: 'Notifications', sub: 'Status bar, Do not disturb', icon: '🔔', color: 'bg-orange-400' },
             { label: 'Display', sub: 'Brightness, Blue light filter', icon: '🔆', color: 'bg-green-400' },
           ].map((item, i) => (
             <div key={i} className="flex items-center space-x-4 p-5 active:bg-gray-50 transition-colors border-b border-gray-50 last:border-0">
               <div className={`w-10 h-10 flex items-center justify-center text-lg ${item.color} text-white rounded-2xl`}>
                 {item.icon}
               </div>
               <div className="flex-1">
                 <h4 className="font-semibold text-gray-900 text-sm">{item.label}</h4>
                 <p className="text-[10px] text-gray-400">{item.sub}</p>
               </div>
               <span className="text-gray-300 text-lg">›</span>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default SettingsScreen;
