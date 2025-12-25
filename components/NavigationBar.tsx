
import React from 'react';

interface NavigationBarProps {
  onNavigateHome?: () => void;
  onBack?: () => void;
}

const NavigationBar: React.FC<NavigationBarProps> = ({ onNavigateHome, onBack }) => {
  const handleRecents = () => {
    // Show recent apps or task switcher
    console.log('Recents button clicked');
  };

  const handleHome = () => {
    if (onNavigateHome) {
      onNavigateHome();
    } else {
      window.location.reload();
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      window.history.back();
    }
  };

  return (
    <div className="h-14 w-full flex justify-around items-center bg-transparent px-12 absolute bottom-0 left-0 right-0 z-[110] text-gray-400">
      {/* Recents Button: ||| */}
      <button 
        onClick={handleRecents}
        className="flex-1 flex justify-center items-center py-2 hover:text-gray-300 transition-colors active:scale-90"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round">
          <line x1="7" y1="6" x2="7" y2="18" />
          <line x1="12" y1="6" x2="12" y2="18" />
          <line x1="17" y1="6" x2="17" y2="18" />
        </svg>
      </button>

      {/* Home Button: Rounded Square */}
      <button 
        onClick={handleHome}
        className="flex-1 flex justify-center items-center py-2 hover:text-gray-300 transition-colors active:scale-90"
      >
        <div className="w-[18px] h-[18px] border-[2.8px] border-current rounded-[6px]"></div>
      </button>

      {/* Back Button: Chevron */}
      <button 
        onClick={handleBack}
        className="flex-1 flex justify-center items-center py-2 hover:text-gray-300 transition-colors active:scale-90"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
    </div>
  );
};

export default NavigationBar;
