import React, { useState, useEffect } from 'react';
import { Wifi, Signal, Battery, Smartphone, Maximize2, Minimize2 } from 'lucide-react';

interface AndroidFrameProps {
  children: React.ReactNode;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({ children }) => {
  const [currentTime, setCurrentTime] = useState('09:41');
  const [isFramed, setIsFramed] = useState(true);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const h = now.getHours().toString().padStart(2, '0');
      const m = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${h}:${m}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-0 md:p-4 select-none">
      {/* Top Floating Device Controller for Desktop / Laptop Preview */}
      <div className="hidden md:flex items-center gap-3 mb-3 bg-slate-900/90 border border-slate-800 px-4 py-2 rounded-full shadow-lg text-xs backdrop-blur-md">
        <div className="flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-emerald-400" />
          <span className="font-semibold text-slate-300">Mode Tampilan Android:</span>
        </div>
        <button
          onClick={() => setIsFramed(!isFramed)}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
            isFramed
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
              : 'bg-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          {isFramed ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          <span>{isFramed ? 'Bingkai Android (Device Frame)' : 'Layar Penuh (Full Width)'}</span>
        </button>
        <span className="text-[11px] text-slate-400 border-l border-slate-700 pl-3 font-mono flex items-center gap-1.5">
          <img
            src="/master-kicau-logo.jpg"
            alt="Logo"
            className="w-4 h-4 rounded-full object-cover border border-amber-500/50"
            referrerPolicy="no-referrer"
          />
          Master Kicau v1.0 • Android Edition
        </span>
      </div>

      {/* Main Container */}
      <div
        className={`w-full transition-all duration-300 flex flex-col ${
          isFramed
            ? 'max-w-[440px] h-[920px] max-h-[96vh] rounded-[48px] border-[10px] border-slate-800/90 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] relative overflow-hidden bg-slate-950 ring-1 ring-emerald-500/20'
            : 'max-w-xl min-h-screen border-x border-slate-800 bg-slate-950 relative'
        }`}
      >
        {/* Android Punch Hole Camera & Speaker */}
        {isFramed && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 z-50 flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-black border-2 border-slate-800/80 shadow-inner flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-900" />
            </div>
          </div>
        )}

        {/* Android Status Bar */}
        <div className="w-full h-8 px-6 flex items-center justify-between text-xs font-medium text-slate-300 bg-slate-950/90 backdrop-blur-md z-40 shrink-0 select-none">
          <span className="font-semibold text-[13px] tracking-tight text-slate-200">{currentTime}</span>

          <div className="flex items-center gap-2 text-slate-300">
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-1.5 py-0.2 rounded border border-emerald-800/40">5G</span>
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <div className="flex items-center gap-0.5">
              <span className="text-[10px] font-mono">89%</span>
              <Battery className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col relative">
          {children}
        </div>

        {/* Android Bottom Gesture Navigation Pill */}
        <div className="w-full h-6 bg-slate-950 flex items-center justify-center shrink-0 z-40">
          <div className="w-32 h-1 bg-slate-700 rounded-full" />
        </div>
      </div>
    </div>
  );
};
