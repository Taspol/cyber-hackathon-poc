
import React, { useState } from 'react';
import { Icons, COLORS } from '../constants';

interface QuickPanelProps {
  isOpen: boolean;
  onClose: () => void;
  scamDetectEnabled: boolean;
  onScamDetectToggle: (enabled: boolean) => void;
}

const QuickPanel: React.FC<QuickPanelProps> = ({ isOpen, onClose, scamDetectEnabled, onScamDetectToggle }) => {
  const [brightness, setBrightness] = useState(70);
  const [activeTab, setActiveTab] = useState<'device' | 'media'>('device');
  const [toggles, setToggles] = useState({
    wifi: true,
    vibrate: false,
    bluetooth: true,
    autoRotate: true,
    airplane: false,
    flashlight: false,
    data: true,
    hotspot: false,
    powerSaving: false,
    location: true,
    linkWindows: false,
    screenRecorder: false,
  });

  const toggle = (key: keyof typeof toggles) => {
    if (key === 'scamDetect') {
      onScamDetectToggle(!scamDetectEnabled);
    } else {
      setToggles(prev => ({ ...prev, [key]: !prev[key] }));
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className={`absolute inset-0 bg-[#1a1a1a] z-[200] transition-all duration-300 ease-in-out ${isOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}
    >
      <div className="flex flex-col h-full pt-10 px-5">
        {/* Top Header Section - Hidden for cleaner look */}
        
        {/* Device control & Media output Buttons */}
        <div className="flex space-x-3 mb-8">
          <button 
            onClick={() => setActiveTab('device')}
            className={`flex-1 py-3.5 rounded-[2rem] text-sm font-semibold transition-all ${activeTab === 'device' ? 'bg-[#2a2a2a] text-white' : 'bg-transparent text-gray-400'}`}
          >
            Device control
          </button>
          <button 
            onClick={() => setActiveTab('media')}
            className={`flex-1 py-3.5 rounded-[2rem] text-sm font-semibold transition-all ${activeTab === 'media' ? 'bg-[#2a2a2a] text-white' : 'bg-transparent text-gray-400'}`}
          >
            Media output
          </button>
        </div>

        {/* Grid Toggles */}
        <div className="grid grid-cols-4 gap-y-6 gap-x-3 mb-10 overflow-y-auto max-h-[500px]">
          {[
            { id: 'wifi', icon: <Icons.Wifi className="w-6 h-6"/>, label: 'Wi-Fi', subLabel: 'AndroidWifi' },
            { id: 'vibrate', icon: <Icons.Volume className="w-6 h-6"/>, label: 'Vibrate' },
            { id: 'bluetooth', icon: <Icons.Bluetooth className="w-6 h-6"/>, label: 'Bluetooth' },
            { id: 'autoRotate', icon: (
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M16.48 2.52c3.27 1.55 5.61 4.72 5.97 8.48h1.5C23.44 4.84 18.29 0 12 0l-.66.03 3.81 3.81 1.33-1.32zm-6.25-.77c-.59-.59-1.54-.59-2.12 0L1.75 8.11c-.59.59-.59 1.54 0 2.12l12.02 12.02c.59.59 1.54.59 2.12 0l6.36-6.36c.59-.59.59-1.54 0-2.12L10.23 1.75zm4.6 19.44L2.81 9.17l6.36-6.36 12.02 12.02-6.36 6.36zm-7.31.29C4.25 19.94 1.91 16.76 1.55 13H.05C.56 19.16 5.71 24 12 24l.66-.03-3.81-3.81-1.33 1.32z"/>
              </svg>
            ), label: 'Auto rotate' },
            { id: 'airplane', icon: <Icons.Airplane className="w-6 h-6"/>, label: 'Flight mode' },
            { id: 'flashlight', icon: <Icons.Flashlight className="w-6 h-6"/>, label: 'Torch' },
            { id: 'data', icon: (
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M16 17.01V10h-2v7.01h-3L15 21l4-3.99h-3zM9 3L5 6.99h3V14h2V6.99h3L9 3z"/>
              </svg>
            ), label: 'Mobile data' },
            { id: 'hotspot', icon: <Icons.Hotspot className="w-6 h-6"/>, label: 'Mobile Hotspot' },
            { id: 'powerSaving', icon: <Icons.Battery className="w-6 h-6"/>, label: 'Power saving' },
            { id: 'location', icon: (
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
            ), label: 'Location' },
            { id: 'linkWindows', icon: (
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M4 6h18V4H4c-1.1 0-2 .9-2 2v11H0v3h14v-3H4V6zm19 2h-6c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h6c.55 0 1-.45 1-1V9c0-.55-.45-1-1-1zm-1 9h-4v-7h4v7z"/>
              </svg>
            ), label: 'Link to Windows' },
            { id: 'screenRecorder', icon: (
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
              </svg>
            ), label: 'Screen recorder' },
            { id: 'scamDetect', icon: (
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-1 6h2v2h-2V7zm0 4h2v6h-2v-6z"/>
              </svg>
            ), label: 'Scam Detect', specialColor: true },
          ].map((item) => (
            <div key={item.id} className="flex flex-col items-center space-y-2">
              <button 
                onClick={() => item.id === 'scamDetect' ? onScamDetectToggle(!scamDetectEnabled) : toggle(item.id as keyof typeof toggles)}
                className={`w-[60px] h-[60px] rounded-full flex items-center justify-center transition-all active:scale-90 ${
                  item.id === 'scamDetect' 
                    ? (scamDetectEnabled ? 'bg-[#6200ee] text-white' : 'bg-[#3a3a3a] text-gray-400')
                    : (toggles[item.id as keyof typeof toggles] ? ((item as any).specialColor ? 'bg-[#6200ee] text-white' : 'bg-[#0b57d0] text-white') : 'bg-[#3a3a3a] text-gray-400')
                }`}
              >
                {item.icon}
              </button>
              <div className="flex flex-col items-center">
                <span className="text-[11px] text-white font-normal text-center leading-tight">{item.label}</span>
                {item.subLabel && (item.id === 'scamDetect' ? scamDetectEnabled : toggles[item.id as keyof typeof toggles]) && (
                  <span className="text-[9px] text-gray-400 font-normal text-center leading-tight">{item.subLabel}</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Brightness Slider Section */}
        <div className="mt-auto pb-10">
          <div className="flex items-center space-x-4 px-2">
            <Icons.Brightness className="w-5 h-5 text-gray-400" />
            <div className="flex-1 h-1.5 bg-[#3a3a3a] rounded-full relative overflow-hidden">
               <div className="absolute top-0 left-0 h-full bg-[#0b57d0]" style={{ width: `${brightness}%` }}></div>
               <input 
                type="range" 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                value={brightness}
                onChange={(e) => setBrightness(Number(e.target.value))}
               />
               <div 
                 className="absolute w-5 h-5 bg-white rounded-full top-1/2 -translate-y-1/2 shadow-md border-2 border-[#0b57d0]"
                 style={{ left: `calc(${brightness}% - 10px)` }}
               ></div>
            </div>
          </div>
          <div className="flex justify-center mt-8">
            <button onClick={onClose} className="p-2 active:scale-95 transition-transform">
              <div className="w-12 h-1 bg-gray-500 rounded-full"></div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickPanel;
