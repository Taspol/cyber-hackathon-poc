
import React, { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';
import PhoneFrame from './components/PhoneFrame';
import StatusBar from './components/StatusBar';
import NavigationBar from './components/NavigationBar';
import QuickPanel from './components/QuickPanel';
import PhoneApp from './components/PhoneApp';
import LockScreen from './components/LockScreen';
import SettingsScreen from './components/SettingsScreen';
import ScamProtectApp from './components/ScamProtectApp';
import { Icons, COLORS } from './constants';
import { generateMockupMessages } from './services/geminiService';
import { Message, ScreenType } from './types';

const App: React.FC = () => {
  const [activeScreen, setActiveScreen] = useState<ScreenType>('Home');
  const [previousScreen, setPreviousScreen] = useState<ScreenType>('Home');
  const [isLocked, setIsLocked] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [isQuickPanelOpen, setQuickPanelOpen] = useState(false);
  const [scamDetectEnabled, setScamDetectEnabled] = useState(false);
  const [triggerIncomingCall, setTriggerIncomingCall] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const screenContentRef = useRef<HTMLDivElement>(null);
  const phoneFrameRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const msgs = await generateMockupMessages();
        setMessages(msgs);
      } catch (e) {
        console.error("Gemini service failed", e);
      }
      setLoading(false);
    };
    loadData();
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchEndY - touchStartY.current;

    if (diff > 50 && touchStartY.current < 200 && !isLocked) {
      setQuickPanelOpen(true);
    }
    if (diff < -50 && isQuickPanelOpen) {
      setQuickPanelOpen(false);
    }
  };

  const startRecording = async () => {
    try {
      // Use browser's native screen capture for accurate recording
      const stream = await navigator.mediaDevices.getDisplayMedia({ 
        video: { 
          displaySurface: 'browser',
          width: { ideal: 3840 },
          height: { ideal: 2160 },
          frameRate: { ideal: 60 }
        },
        audio: false,
        preferCurrentTab: true
      } as any);

      const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9') 
        ? 'video/webm;codecs=vp9' 
        : 'video/webm';

      const recorder = new MediaRecorder(stream, {
        mimeType,
        videoBitsPerSecond: 20000000
      });

      const chunks: Blob[] = [];
      
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `phone-screen-recording-${Date.now()}.webm`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      };

      // Handle if user stops sharing
      stream.getVideoTracks()[0].onended = () => {
        if (recorder.state === 'recording') {
          stopRecording();
        }
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);

    } catch (error) {
      console.error('Error starting recording:', error);
      if (error instanceof Error && error.name === 'NotAllowedError') {
        alert('Screen recording permission denied. Please allow screen sharing.');
      } else {
        alert('Screen recording failed. When the picker appears, select "Chrome Tab" (or your browser tab) to record.');
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      setMediaRecorder(null);
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (e.currentTarget.scrollTop > 50) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  };

  const renderHomeScreen = () => (
    <div className="relative flex flex-col h-full bg-gradient-to-br from-[#1a1f2e] via-[#2d3748] to-[#1a2332] overflow-hidden">
      <div className="p-6 pt-16 space-y-6 flex-1 z-10 overflow-y-auto hide-scrollbar mt-5">
        {/* Modern Clock & Date Widget */}
        <div className="text-white mb-4 flex flex-col items-center drop-shadow-lg">
            <h2 className="text-[5rem] font-extralight tracking-tight leading-none">{currentTime}</h2>
            <p className="text-sm font-medium opacity-90">Thursday, Nov 19</p>
        </div>

        {/* Weather Widget - One UI Style */}
        <div className="bg-white/10 backdrop-blur-xl rounded-[2.5rem] p-4 shadow-xl border border-white/10 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-white text-sm font-medium">San Francisco</span>
            <div className="flex items-baseline space-x-1">
              <span className="text-4xl font-bold text-white">72°</span>
              <span className="text-white/80 text-xs font-semibold">Sunny</span>
            </div>
            <span className="text-white/60 text-[10px] mt-1">H:75° L:61°</span>
          </div>
          <div className="text-5xl drop-shadow-md">☀️</div>
        </div>

        {/* Google Search Bar - Classic One UI Pill */}
        <div className="bg-[#2a2f3d]/80 backdrop-blur-md rounded-full px-5 py-3 shadow-lg flex items-center space-x-3 active:scale-[0.98] transition-transform border border-white/10">
          <div className="w-5 h-5 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-full h-full">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
          </div>
          <span className="text-gray-400 text-sm flex-1">Search</span>

        </div>

        {/* Commonly Used Apps Grid - Using Image Icons from public/apps/ */}
        <div className="grid grid-cols-4 gap-y-6 gap-x-2 px-2 pb-10">
          {[
            { label: 'Camera', image: '/apps/camera.png' },
            { label: 'Google', image: '/apps/google.webp' },
            { label: 'Facebook', image: '/apps/facebook.webp' },
            { label: 'K PLUS', image: '/apps/kplus.png' },
            { label: 'ScamProtect', image: '/apps/scam-protect.png', screen: 'ScamProtect' },
          ].map((app, i) => (
            <div 
              key={i} 
              onClick={() => app.screen && setActiveScreen(app.screen as ScreenType)}
              className="flex flex-col items-center space-y-1 active:scale-90 transition-transform cursor-pointer"
            >
               <div className="w-14 h-14 rounded-[1.3rem] shadow-md overflow-hidden bg-white/5 flex items-center justify-center border border-white/10">
                 <img 
                    src={app.image} 
                    alt={app.label} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback if image doesn't exist
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${app.label}&background=random&color=fff&rounded=false&size=128`;
                    }}
                 />
               </div>
               <span className="text-[10px] text-white font-medium drop-shadow-sm text-center truncate w-16">{app.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Dock Area */}
      <div className="px-6 py-6 pb-16 grid grid-cols-4 gap-4 z-10 bg-gradient-to-t from-black/40 to-transparent">
        {[
          { icon: <Icons.Phone className="w-7 h-7 text-white"/>, color: 'bg-[#4caf50]', label: 'Phone', screen: 'Phone' },
          { icon: <Icons.Messages className="w-7 h-7 text-white"/>, color: 'bg-[#ff9800]', label: 'Messages', screen: 'Messages' },
          { icon: <Icons.Search className="w-7 h-7 text-white"/>, color: 'bg-[#2196f3]', label: 'Search', screen: 'Search' },
          { icon: <Icons.Settings className="w-7 h-7 text-white"/>, color: 'bg-[#9e9e9e]', label: 'Settings', screen: 'Settings' },
        ].map((app, idx) => (
          <button 
            key={idx} 
            onClick={() => app.screen && setActiveScreen(app.screen as ScreenType)}
            className="flex flex-col items-center space-y-1 group"
          >
            <div className={`${app.color} w-[55px] h-[55px] rounded-[1.7rem] flex items-center justify-center shadow-xl transition-all active:scale-90`}>
              {app.icon}
            </div>
            <span className="text-[10px] font-semibold text-white drop-shadow-md">{app.label}</span>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="w-full h-full flex items-start justify-center overflow-auto py-4 px-2 gap-6">
      {/* Side Control Panel */}
      <div className="flex flex-col space-y-4 pt-4 sticky top-4">
        {/* Record Button */}
        <button 
          onClick={isRecording ? stopRecording : startRecording}
          className={`flex items-center space-x-2 px-4 py-3 rounded-full font-bold transition-all shadow-lg active:scale-95 text-sm ${
            isRecording 
              ? 'bg-red-600 text-white hover:bg-red-700 animate-pulse' 
              : 'bg-purple-600 text-white hover:bg-purple-700'
          }`}
        >
          {isRecording ? (
            <>
              <div className="w-3 h-3 rounded-sm bg-white"></div>
              <span className="hidden lg:inline">Stop</span>
            </>
          ) : (
            <>
              <div className="w-3 h-3 rounded-full bg-white border-2 border-white"></div>
              <span className="hidden lg:inline">Record</span>
            </>
          )}
        </button>
        
        <button 
          onClick={() => { setIsLocked(true); setActiveScreen('Home'); }} 
          className="flex items-center justify-center space-x-2 px-4 py-3 rounded-full font-bold bg-gray-900 text-white hover:bg-black transition-all shadow-lg active:scale-95 text-sm"
        >
          <Icons.Power className="w-4 h-4" />
          <span className="hidden lg:inline">Lock</span>
        </button>
        
        <button 
          onClick={() => { setIsLocked(false); setActiveScreen('Home'); setQuickPanelOpen(false); }} 
          className="flex items-center justify-center space-x-2 px-4 py-3 rounded-full font-bold bg-blue-600 text-white transition-all shadow-lg hover:bg-blue-700 active:scale-95 text-sm"
        >
          <Icons.Home className="w-4 h-4" />
          <span className="hidden lg:inline">Home</span>
        </button>
        
        <button 
          onClick={() => { setIsLocked(false); setPreviousScreen(activeScreen); setActiveScreen('Phone'); setQuickPanelOpen(false); setTriggerIncomingCall(true); }} 
          className="flex items-center justify-center space-x-2 px-4 py-3 rounded-full font-bold bg-green-600 text-white transition-all shadow-lg hover:bg-green-700 active:scale-95 text-sm"
        >
          <Icons.Phone className="w-4 h-4" />
          <span className="hidden lg:inline">Call</span>
        </button>
      </div>

      {/* Phone Frame */}
      <div ref={phoneFrameRef} className="flex-shrink-0" style={{
        maxWidth: '100%',
        maxHeight: 'calc(100vh - 40px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start'
      }}>
        <PhoneFrame>
          <div 
            ref={screenContentRef}
            className={`flex flex-col h-full relative transition-all duration-700 ${isLocked ? 'bg-black' : activeScreen === 'Home' ? 'bg-transparent' : 'bg-[#f4f4f7]'}`}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
          
          {/* Status Bar */}
          <div 
            onClick={() => !isLocked && setQuickPanelOpen(true)} 
            className={`cursor-pointer absolute top-0 left-0 right-0 z-[210] transition-colors duration-500 ${isLocked || activeScreen === 'Home' || isQuickPanelOpen ? 'text-white' : 'text-gray-800'}`}
          >
            <StatusBar />
          </div>

          {/* Quick Panel Overlay */}
          <QuickPanel isOpen={isQuickPanelOpen} onClose={() => setQuickPanelOpen(false)} scamDetectEnabled={scamDetectEnabled} onScamDetectToggle={setScamDetectEnabled} />

          {/* Lock Screen */}
          {isLocked && <LockScreen onUnlock={() => setIsLocked(false)} />}

          {/* Content Wrapper */}
          <div 
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className={`flex-1 overflow-y-auto overflow-x-hidden scroll-smooth transition-all duration-500 ease-out ${isQuickPanelOpen ? 'scale-[0.98] blur-2xl grayscale-[0.3] brightness-[0.4]' : 'scale-100'}`}
          >
            {!isLocked && (
              <div className="h-full w-full">
                {activeScreen === 'Home' && renderHomeScreen()}
                {activeScreen === 'Messages' && (
                  <div className="pb-24 pt-16 px-6 bg-[#f4f4f7] min-h-full">
                     <h1 className="text-4xl font-bold text-gray-900 mb-8 px-2">Messages</h1>
                     <div className="space-y-1">
                        {messages.map((msg) => (
                          <div key={msg.id} className="flex items-center space-x-4 p-5 bg-white rounded-[2rem] shadow-sm mb-2 active:bg-gray-50 transition-colors border border-black/5">
                            <img src={msg.avatar} className="w-14 h-14 rounded-full object-cover shadow-inner" alt="" />
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-gray-900">{msg.sender}</h3>
                              <p className="text-sm text-gray-500 truncate">{msg.preview}</p>
                            </div>
                            <span className="text-[10px] text-gray-400 font-bold whitespace-nowrap">{msg.time}</span>
                          </div>
                        ))}
                     </div>
                  </div>
                )}
                {activeScreen === 'Settings' && <SettingsScreen scrolled={scrolled} />}
                {activeScreen === 'ScamProtect' && <ScamProtectApp scrolled={scrolled} />}
                {activeScreen === 'Phone' && <PhoneApp scrolled={scrolled} scamDetectEnabled={scamDetectEnabled} onScamDetectToggle={setScamDetectEnabled} triggerIncomingCall={triggerIncomingCall} onCallTriggered={() => setTriggerIncomingCall(false)} onNavigateBack={() => setActiveScreen(previousScreen)} />}
              </div>
            )}
          </div>

          {/* Floating Back Button - Contextual */}
          {/* {!isLocked && activeScreen !== 'Home' && !isQuickPanelOpen && (
            <button 
              onClick={() => setActiveScreen('Home')}
              className="absolute bottom-20 left-1/2 -translate-x-1/2 w-14 h-14 bg-white/95 backdrop-blur-md rounded-full shadow-2xl border border-white/50 flex items-center justify-center active:scale-90 transition-all z-[120]"
            >
              <Icons.Back className="w-6 h-6 text-gray-700" />
            </button>
          )} */}
          
          {/* 3-button Nav Bar */}
          {!isLocked && activeScreen !== 'Phone' && <NavigationBar onNavigateHome={() => setActiveScreen('Home')} onBack={() => setActiveScreen('Home')} />}
        </div>
      </PhoneFrame>
      </div>
    </div>
  );
};

export default App;
