import React from 'react';
import { Smartphone, Monitor, Wifi, Battery, Signal } from 'lucide-react';

interface MobileFrameWrapperProps {
  children: React.ReactNode;
  isMobileFrameActive: boolean;
  onToggleFrame: () => void;
  title?: string;
}

export const MobileFrameWrapper: React.FC<MobileFrameWrapperProps> = ({
  children,
  isMobileFrameActive,
  onToggleFrame,
  title = 'AbsenKu Mobile'
}) => {
  if (!isMobileFrameActive) {
    return <div className="w-full">{children}</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center py-4 px-2 sm:px-4">
      
      {/* Smartphone Chassis Container */}
      <div className="w-full max-w-[412px] bg-slate-900 rounded-[48px] p-3 shadow-2xl border-4 border-slate-700/80 relative">
        
        {/* Smartphone Speaker & Camera Notch */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 w-36 h-5 bg-black rounded-full z-40 flex items-center justify-center gap-2">
          <div className="w-3 h-3 rounded-full bg-slate-800 border border-slate-700" />
          <div className="w-12 h-1 bg-slate-800 rounded-full" />
        </div>

        {/* Inner Phone Screen */}
        <div className="w-full bg-slate-50 rounded-[38px] overflow-hidden flex flex-col min-h-[720px] max-h-[820px] border border-slate-800 relative">
          
          {/* Mobile Status Bar */}
          <div className="bg-slate-900 text-white px-7 pt-2.5 pb-2 flex items-center justify-between text-[11px] font-semibold shrink-0 z-30 select-none">
            <span>08:45</span>
            <div className="flex items-center gap-1.5">
              <Signal className="w-3 h-3" />
              <Wifi className="w-3 h-3" />
              <Battery className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Screen Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-4">
            {children}
          </div>

          {/* Bottom Home Indicator Bar */}
          <div className="py-2 flex items-center justify-center bg-white/90 backdrop-blur-xs border-t border-slate-100 shrink-0">
            <div className="w-32 h-1 bg-slate-400 rounded-full" />
          </div>

        </div>

        {/* Outer Volume & Power Buttons aesthetics */}
        <div className="absolute -left-1 top-24 w-1 h-8 bg-slate-700 rounded-l" />
        <div className="absolute -left-1 top-36 w-1 h-12 bg-slate-700 rounded-l" />
        <div className="absolute -right-1 top-28 w-1 h-14 bg-slate-700 rounded-r" />

      </div>

      {/* Simulator Caption */}
      <p className="text-xs text-slate-400 mt-3 text-center">
        Mode Simulasi Layar Handphone (HP) • Resolusi Standar Layar Smartphone 390x844 px
      </p>

    </div>
  );
};
