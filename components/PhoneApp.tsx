
import React, { useState, useEffect } from 'react';
import OneUIHeader from './OneUIHeader';
import { Icons, COLORS } from '../constants';
import { PhoneTab } from '../types';

interface IncomingCallProps {
  name: string;
  number: string;
  onAccept: () => void;
  onDecline: () => void;
}

const IncomingCallScreen: React.FC<IncomingCallProps> = ({ name, number, onAccept, onDecline }) => {
  return (
    <div className="absolute inset-0 bg-[#0a0a0a] z-[150] flex flex-col items-center justify-between pt-20 pb-16 transition-all duration-500 overflow-hidden">
      {/* Caller Info */}
      <div className="flex flex-col items-center animate-in fade-in zoom-in-95 duration-500">
        <div className="w-32 h-32 bg-gray-600 rounded-full mb-6 overflow-hidden border-4 border-white/20 shadow-2xl">
          <img src={`https://i.pravatar.cc/150?u=${number}`} alt="" className="w-full h-full object-cover" />
        </div>
        <h2 className="text-4xl font-bold text-white mb-2">{name}</h2>
        <p className="text-gray-400 font-medium text-lg">{number}</p>
        <p className="text-white/80 font-semibold mt-4 text-sm tracking-wider uppercase animate-pulse">
          Incoming Call...
        </p>
      </div>

      {/* Answer/Decline Buttons */}
      <div className="flex items-center justify-center gap-20 px-8">
        {/* Decline Button */}
        <button 
          onClick={onDecline}
          className="flex flex-col items-center space-y-3 active:scale-90 transition-transform"
        >
          <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center shadow-2xl">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-9 h-9 text-white">
              <path d="M12 9c-1.6 0-3.15.25-4.6.72v3.1c0 .39-.23.74-.56.9-.98.49-1.87 1.12-2.66 1.85-.18.18-.43.28-.7.28-.28 0-.53-.11-.71-.29L.29 13.08c-.18-.17-.29-.42-.29-.7 0-.28.11-.53.29-.71C3.34 8.78 7.46 7 12 7s8.66 1.78 11.71 4.67c.18.18.29.43.29.71 0 .28-.11.53-.29.71l-2.48 2.48c-.18.18-.43.29-.71.29-.27 0-.52-.11-.7-.28-.79-.74-1.69-1.36-2.67-1.85-.33-.16-.56-.5-.56-.9v-3.1C15.15 9.25 13.6 9 12 9z"/>
            </svg>
          </div>
          <span className="text-white text-sm font-semibold">Decline</span>
        </button>

        {/* Accept Button */}
        <button 
          onClick={onAccept}
          className="flex flex-col items-center space-y-3 active:scale-90 transition-transform"
        >
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center shadow-2xl">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-9 h-9 text-white">
              <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/>
            </svg>
          </div>
          <span className="text-white text-sm font-semibold">Accept</span>
        </button>
      </div>
    </div>
  );
};

interface CallingProps {
  name: string;
  number: string;
  onEndCall: () => void;
  scamDetectEnabled: boolean;
  onScamDetectToggle: (enabled: boolean) => void;
  isIncoming?: boolean;
}

type CallState = 'dialing' | 'warning' | 'connected' | 'video';

const CallingScreen: React.FC<CallingProps> = ({ name, number, onEndCall, scamDetectEnabled, onScamDetectToggle, isIncoming = false }) => {
  const [callState, setCallState] = useState<CallState>(isIncoming ? 'connected' : 'dialing');
  const [timer, setTimer] = useState(0);
  const [hasShownWarning, setHasShownWarning] = useState(false);
  const [showWarningOverlay, setShowWarningOverlay] = useState(false);

  useEffect(() => {
    let timeout: any;
    if (callState === 'dialing' && scamDetectEnabled) {
      // Simulate the network delay before "detecting" a scam (3 seconds delay when scam detect is enabled)
      timeout = setTimeout(() => {
        setCallState('warning');
        setHasShownWarning(true);
      }, 3000);
    } else if (callState === 'dialing' && !scamDetectEnabled) {
      // No scam detection, go straight to connected after a brief moment
      timeout = setTimeout(() => {
        setCallState('connected');
      }, 1000);
    }
    return () => clearTimeout(timeout);
  }, [callState, scamDetectEnabled]);

  // Handle scam detect toggle during ongoing call
  useEffect(() => {
    if (callState === 'connected' && scamDetectEnabled && !hasShownWarning) {
      const timeout = setTimeout(() => {
        setCallState('warning');
        setHasShownWarning(true);
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [callState, scamDetectEnabled, hasShownWarning]);

  // Handle scam detect toggle during video call
  useEffect(() => {
    if (callState === 'video' && scamDetectEnabled && !hasShownWarning) {
      const timeout = setTimeout(() => {
        setShowWarningOverlay(true);
        setHasShownWarning(true);
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [callState, scamDetectEnabled, hasShownWarning]);

  useEffect(() => {
    let interval: any;
    if (callState === 'connected') {
      interval = setInterval(() => setTimer(t => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [callState]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec < 10 ? '0' : ''}${sec}`;
  };

  const handleContinue = () => {
    setCallState('connected');
  };

  // Video call view
  if (callState === 'video') {
    return (
      <div className="absolute inset-0 bg-black z-[150] flex flex-col transition-all duration-500 overflow-hidden">
        {/* Video Feed - Full Screen */}
        <div className="absolute inset-0">
          <video 
            src="/videocall/videocallMocktwo.mov" 
            autoPlay 
            loop 
            muted
            playsInline
            className="w-full h-full object-contain"
          />
        </div>
        
        {/* Self video (picture-in-picture) */}
        <div className="absolute top-6 right-6 w-24 h-32 bg-gray-900 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/30 z-10">
          <div className="w-full h-full bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center">
            <div className="text-white text-4xl">👤</div>
          </div>
        </div>

        {/* Call info overlay */}
        <div className="absolute top-6 left-6 flex flex-col z-10">
          <span className="text-white text-xl font-semibold drop-shadow-lg">{name}</span>
          <span className="text-white/80 text-sm drop-shadow-lg">{formatTime(timer)}</span>
        </div>

        {/* Scam Warning Modal Overlay for Video Call */}
        {showWarningOverlay && (
          <div className="absolute inset-0 z-[160] flex items-center justify-center p-6 bg-black/50 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl w-full max-w-sm flex flex-col items-center text-center animate-in zoom-in-95 duration-300">
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-1 6h2v2h-2V7zm0 4h2v6h-2v-6z"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Attention: Possible Scam</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-8">
                Our AI system has detected patterns commonly associated with fraudulent calls. For your safety, we recommend ending this call.
              </p>
              <div className="flex flex-col w-full space-y-3">
                <button 
                  onClick={onEndCall}
                  className="w-full py-4 bg-red-500 text-white font-bold rounded-3xl shadow-lg active:scale-95 transition-transform"
                >
                  End Call
                </button>
                <button 
                  onClick={() => setShowWarningOverlay(false)}
                  className="w-full py-4 bg-gray-100 text-gray-700 font-bold rounded-3xl active:bg-gray-200 transition-colors"
                >
                  Continue Call
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Video call controls */}
        <div className="absolute bottom-0 left-0 right-0 p-8 pb-20 bg-gradient-to-t from-black/80 to-transparent z-10">
          <div className="flex justify-center items-center space-x-6">
            <button className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white active:scale-90 transition-all">
              <Icons.Mic className="w-6 h-6" />
            </button>
            <button 
              onClick={() => setCallState('connected')}
              className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white active:scale-90 transition-all"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
              </svg>
            </button>
            <button className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white active:scale-90 transition-all">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M20 4h-3.17L15 2H9L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-8 11c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/>
              </svg>
            </button>
            <button 
              onClick={onEndCall}
              className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center shadow-xl active:scale-95 transition-transform"
            >
              <div className="w-8 h-8 text-white">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 9c-1.6 0-3.15.25-4.6.72v3.1c0 .39-.23.74-.56.9-.98.49-1.87 1.12-2.66 1.85-.18.18-.43.28-.7.28-.28 0-.53-.11-.71-.29L.29 13.08c-.18-.17-.29-.42-.29-.7 0-.28.11-.53.29-.71C3.34 8.78 7.46 7 12 7s8.66 1.78 11.71 4.67c.18.18.29.43.29.71 0 .28-.11.53-.29.71l-2.48 2.48c-.18.18-.43.29-.71.29-.27 0-.52-.11-.7-.28-.79-.74-1.69-1.36-2.67-1.85-.33-.16-.56-.5-.56-.9v-3.1C15.15 9.25 13.6 9 12 9z"/>
                </svg>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 bg-[#f4f4f7] z-[150] flex flex-col items-center pt-24 transition-all duration-500 overflow-hidden">
      {/* Caller Info */}
      <div className={`flex flex-col items-center mb-12 transition-all duration-500 ${callState === 'warning' ? 'blur-sm scale-95 opacity-50' : 'blur-0 scale-100 opacity-100'}`}>
        <div className="w-32 h-32 bg-gray-200 rounded-full mb-6 overflow-hidden border-4 border-white shadow-lg">
           <img src={`https://i.pravatar.cc/150?u=${number}`} alt="" className="w-full h-full object-cover" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900">{name}</h2>
        <p className="text-gray-500 font-medium mt-1">{number}</p>
        <p className="text-[#0377ff] font-bold mt-3 text-sm tracking-widest uppercase">
          {callState === 'dialing' ? 'Calling...' : callState === 'warning' ? 'Checking security...' : `Ongoing Call • ${formatTime(timer)}`}
        </p>
      </div>

      {/* Scam Warning Modal Overlay */}
      {callState === 'warning' && (
        <div className="absolute inset-0 z-[160] flex items-center justify-center p-6 bg-black/5 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl w-full max-w-sm flex flex-col items-center text-center animate-in zoom-in-95 duration-300">
             <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-1 6h2v2h-2V7zm0 4h2v6h-2v-6z"/>
              </svg>
             </div>
             <h3 className="text-2xl font-bold text-gray-900 mb-3">Attention: Possible Scam</h3>
             <p className="text-gray-500 text-sm leading-relaxed mb-8">
               Our AI system has detected patterns commonly associated with fraudulent calls. For your safety, we recommend ending this call.
             </p>
             <div className="flex flex-col w-full space-y-3">
                <button 
                  onClick={onEndCall}
                  className="w-full py-4 bg-red-500 text-white font-bold rounded-3xl shadow-lg active:scale-95 transition-transform"
                >
                  End Call
                </button>
                <button 
                  onClick={handleContinue}
                  className="w-full py-4 bg-gray-100 text-gray-700 font-bold rounded-3xl active:bg-gray-200 transition-colors"
                >
                  Continue Call
                </button>
             </div>
          </div>
        </div>
      )}

      {/* Call Controls Grid */}
      <div className={`grid grid-cols-3 gap-y-10 gap-x-8 px-12 mt-auto pb-5 mb-3 transition-opacity duration-500 ${callState === 'warning' ? 'opacity-0' : 'opacity-100'}`}>
        {[
          { icon: <Icons.Mic className="w-6 h-6" />, label: 'Mute' },
          { icon: <Icons.Keypad className="w-6 h-6" />, label: 'Keypad' },
          { icon: <Icons.Volume className="w-6 h-6" />, label: 'Speaker' },
          { icon: <Icons.Search className="w-6 h-6" />, label: 'Add call' },
          { icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
            </svg>
          ), label: 'Video call', onClick: () => setCallState('video') },
          { id: 'scamDetect', icon: (
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-1 6h2v2h-2V7zm0 4h2v6h-2v-6z"/>
              </svg>
            ), label: 'Scam Detect', 
            specialColor: true,
            onClick: () => onScamDetectToggle(!scamDetectEnabled),
            active: scamDetectEnabled 
          },

        ].map((btn, i) => (
          <button 
            key={i} 
            onClick={btn.onClick}
            disabled={callState !== 'connected'}
            className="flex flex-col items-center space-y-2 group"
          >
            <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all active:scale-90 ${btn.active ? 'bg-[#6200ee] text-white shadow-lg' : 'bg-white text-gray-700 shadow-sm border border-gray-100 hover:bg-gray-50'}`}>
              {btn.icon}
            </div>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">{btn.label}</span>
          </button>
        ))}
      </div>

      {/* End Call Button */}
      <div className={`pb-20 transition-opacity duration-500 ${callState === 'warning' ? 'opacity-0' : 'opacity-100'}`}>
        <button 
          onClick={onEndCall}
          className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center shadow-xl active:scale-95 transition-transform"
        >
          <div className="w-8 h-8 text-white">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 9c-1.6 0-3.15.25-4.6.72v3.1c0 .39-.23.74-.56.9-.98.49-1.87 1.12-2.66 1.85-.18.18-.43.28-.7.28-.28 0-.53-.11-.71-.29L.29 13.08c-.18-.17-.29-.42-.29-.7 0-.28.11-.53.29-.71C3.34 8.78 7.46 7 12 7s8.66 1.78 11.71 4.67c.18.18.29.43.29.71 0 .28-.11.53-.29.71l-2.48 2.48c-.18.18-.43.29-.71.29-.27 0-.52-.11-.7-.28-.79-.74-1.69-1.36-2.67-1.85-.33-.16-.56-.5-.56-.9v-3.1C15.15 9.25 13.6 9 12 9z"/>
            </svg>
          </div>
        </button>
      </div>
    </div>
  );
};

const PhoneApp: React.FC<{ scrolled: boolean; scamDetectEnabled: boolean; onScamDetectToggle: (enabled: boolean) => void; triggerIncomingCall: boolean; onCallTriggered: () => void; onNavigateBack?: () => void }> = ({ scrolled, scamDetectEnabled, onScamDetectToggle, triggerIncomingCall, onCallTriggered, onNavigateBack }) => {
  const [activeTab, setActiveTab] = useState<PhoneTab>('Keypad');
  const [number, setNumber] = useState('');
  const [isCalling, setIsCalling] = useState(false);
  const [isIncomingCall, setIsIncomingCall] = useState(false);
  const [wasIncomingCall, setWasIncomingCall] = useState(false);

  useEffect(() => {
    if (triggerIncomingCall) {
      setNumber('+1 555 123 4567');
      setIsIncomingCall(true);
      onCallTriggered();
    }
  }, [triggerIncomingCall, onCallTriggered]);

  const handleAcceptCall = () => {
    setIsIncomingCall(false);
    setWasIncomingCall(true);
    setIsCalling(true);
  };

  const handleDeclineCall = () => {
    setIsIncomingCall(false);
    setNumber('');
    if (onNavigateBack) {
      onNavigateBack();
    }
  };

  const dial = (val: string) => {
    if (number.length < 15) setNumber(prev => prev + val);
  };

  const backspace = () => {
    setNumber(prev => prev.slice(0, -1));
  };

  const startCall = () => {
    if (number.length > 0) {
      setIsCalling(true);
    }
  };

  const renderKeypad = () => (
    <div className="flex flex-col h-full pb-4">
      {/* Number Display */}
      <div className="flex flex-col items-center justify-center pt-2 pb-1">
        <div className="text-[2rem] font-light text-gray-900 tracking-wider leading-tight">
          {number || " "}
        </div>
        {number && (
           <button onClick={() => setNumber('')} className="mt-1 text-[#0377ff] text-[11px] font-semibold tracking-wide">
             Add to contacts
           </button>
        )}
      </div>

      {/* Keypad Grid - Samsung Style */}
      <div className="flex flex-col items-center flex-1 justify-center">
        <div className="grid grid-cols-3 gap-x-5 gap-y-2 mb-8">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map(key => (
            <button 
              key={key} 
              onClick={() => dial(key)}
              className="w-[75px] h-[58px] rounded-2xl flex flex-col items-center justify-center hover:bg-gray-50 active:bg-gray-100 transition-colors"
            >
              <span className="text-[1.6rem] font-light text-gray-900 leading-none mb-0.5">{key}</span>
              {key === '1' && <span className="text-[8px] text-gray-400 font-medium tracking-wide">⌗ ✱</span>}
              {key === '2' && <span className="text-[8px] text-gray-400 font-medium tracking-wide">ABC</span>}
              {key === '3' && <span className="text-[8px] text-gray-400 font-medium tracking-wide">DEF</span>}
              {key === '4' && <span className="text-[8px] text-gray-400 font-medium tracking-wide">GHI</span>}
              {key === '5' && <span className="text-[8px] text-gray-400 font-medium tracking-wide">JKL</span>}
              {key === '6' && <span className="text-[8px] text-gray-400 font-medium tracking-wide">MNO</span>}
              {key === '7' && <span className="text-[8px] text-gray-400 font-medium tracking-wide">PQRS</span>}
              {key === '8' && <span className="text-[8px] text-gray-400 font-medium tracking-wide">TUV</span>}
              {key === '9' && <span className="text-[8px] text-gray-400 font-medium tracking-wide">WXYZ</span>}
              {key === '*' && <span className="text-[8px] text-gray-400 font-medium tracking-wide"> </span>}
              {key === '0' && <span className="text-[8px] text-gray-400 font-medium tracking-wide">+</span>}
              {key === '#' && <span className="text-[8px] text-gray-400 font-medium tracking-wide"> </span>}
            </button>
          ))}
        </div>

        {/* Call Actions Row */}
        <div className="flex items-center justify-center gap-6 mt-2 mb-12">
          <button 
            onClick={startCall}
            disabled={!number}
            className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-all ${number ? 'bg-[#00c853] text-white' : 'bg-gray-100 text-gray-300'}`}
          >
            <Icons.Phone className="w-8 h-8" />
          </button>
          <button 
            onClick={backspace}
            disabled={!number}
            className={`w-12 h-12 flex items-center justify-center rounded-full transition-all active:bg-gray-100 ${number ? 'text-gray-600' : 'text-gray-300'}`}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );

  const renderRecents = () => (
    <div className="px-6 space-y-1">
      {[
        { name: 'Home', time: '10:45 AM', type: 'incoming', status: 'missed', number: '02-1234-5678' },
        { name: 'Sarah Wilson', time: 'Yesterday', type: 'outgoing', status: 'connected', number: '010-9876-5432' },
        { name: '+1 234 567 8900', time: 'Wednesday', type: 'incoming', status: 'connected', number: '+1 234 567 8900' },
      ].map((call, i) => (
        <div key={i} className="flex items-center space-x-4 p-4 rounded-3xl active:bg-gray-100 transition-colors" onClick={() => { setNumber(call.number); setIsCalling(true); }}>
          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white ${call.status === 'missed' ? 'bg-red-400' : 'bg-gray-300'}`}>
             <Icons.Phone className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h4 className={`font-semibold ${call.status === 'missed' ? 'text-red-500' : 'text-gray-900'}`}>{call.name}</h4>
            <div className="flex items-center space-x-1 text-xs text-gray-400">
               <span>{call.type === 'incoming' ? '↙' : '↗'}</span>
               <span>Mobile</span>
            </div>
          </div>
          <div className="text-xs text-gray-400">{call.time}</div>
        </div>
      ))}
    </div>
  );

  const renderContacts = () => (
    <div className="px-6 space-y-2">
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-50 mb-6 flex items-center space-x-3">
        <Icons.Search className="w-4 h-4 text-gray-400" />
        <span className="text-sm text-gray-400">Search contacts</span>
      </div>
      {['Alex', 'Bailey', 'Catherine', 'Daniel', 'Emilio'].map((name, i) => (
        <div key={i} className="flex items-center space-x-4 p-4 rounded-3xl active:bg-gray-100 transition-colors" onClick={() => { setNumber(name); setIsCalling(true); }}>
          <div className="w-12 h-12 bg-gradient-to-tr from-gray-200 to-gray-300 rounded-full flex items-center justify-center font-bold text-gray-600">
            {name[0]}
          </div>
          <span className="font-semibold text-gray-900">{name}</span>
        </div>
      ))}
    </div>
  );

  if (isIncomingCall) {
    return <IncomingCallScreen name="Unknown Caller" number={number} onAccept={handleAcceptCall} onDecline={handleDeclineCall} />;
  }

  if (isCalling) {
    return <CallingScreen name={number || "Unknown"} number={number} onEndCall={() => { setIsCalling(false); setWasIncomingCall(false); }} scamDetectEnabled={scamDetectEnabled} onScamDetectToggle={onScamDetectToggle} isIncoming={wasIncomingCall} />;
  }

  return (
    <div className="flex flex-col h-full bg-white relative">
      <div className="flex-1 overflow-hidden">
        <OneUIHeader 
          title={activeTab === 'Keypad' ? "Phone" : activeTab} 
          scrolled={scrolled} 
        />
        
        {activeTab === 'Keypad' && renderKeypad()}
        {activeTab === 'Recents' && renderRecents()}
        {activeTab === 'Contacts' && renderContacts()}
      </div>

      {/* Internal App Navigation */}
      <div className="flex justify-around items-center h-16 border-t border-gray-100 bg-white/80 backdrop-blur-lg">
        {[
          { id: 'Keypad', icon: <Icons.Search className="w-5 h-5" />, label: 'Keypad' },
          { id: 'Recents', icon: <Icons.Home className="w-5 h-5" />, label: 'Recents' },
          { id: 'Contacts', icon: <Icons.Settings className="w-5 h-5" />, label: 'Contacts' },
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as PhoneTab)}
            className={`flex flex-col items-center space-y-1 transition-colors active:scale-95 ${activeTab === tab.id ? 'text-[#0377ff]' : 'text-gray-400'}`}
          >
            <span className="text-xs font-bold uppercase tracking-wider">{tab.label}</span>
            {activeTab === tab.id && <div className="w-1 h-1 bg-current rounded-full"></div>}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PhoneApp;
