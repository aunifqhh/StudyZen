
import React, { useState } from 'react';
import { useApp } from '../App';
import { THEME_CONFIG } from '../constants';

const TimerPage: React.FC = () => {
  const { 
    theme, 
    timerSeconds, 
    setTimerSeconds, 
    isTimerActive, 
    setIsTimerActive, 
    timerPreset, 
    setTimerPreset, 
    resetTimer,
    finishSession
  } = useApp();
  
  const themeConfig = THEME_CONFIG[theme];
  const [isFinishing, setIsFinishing] = useState(false);

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePresetChange = (mins: number) => {
    setTimerPreset(mins);
    setTimerSeconds(mins * 60);
    setIsTimerActive(false);
  };

  const handleManualFinish = async () => {
    if (!isTimerActive) return;
    setIsFinishing(true);
    try {
      await finishSession();
    } finally {
      setIsFinishing(false);
    }
  };

  const progress = (timerSeconds / (timerPreset * 60)) * 100;

  return (
    <div className="flex flex-col gap-6 py-2 pb-10">
      {/* Timer Card */}
      <div className="bg-white rounded-[40px] p-8 shadow-xl shadow-gray-200/50 border border-gray-50 flex flex-col items-center">
        <h2 className="text-lg font-bold text-gray-800 mb-1">Study Timer</h2>
        <p className="text-gray-500 text-sm mb-8 font-medium">Focus time</p>
        
        {/* Ring */}
        <div className="relative w-56 h-56 flex items-center justify-center mb-10">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="112" cy="112" r="100" stroke="#F3F4F6" strokeWidth="8" fill="transparent" />
            <circle 
              cx="112" cy="112" r="100" 
              stroke={themeConfig.accent} 
              strokeWidth="10" 
              fill="transparent" 
              strokeDasharray="628" 
              strokeDashoffset={628 - (628 * progress) / 100} 
              strokeLinecap="round"
              className="transition-all duration-1000 ease-linear"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <svg className="w-6 h-6 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-5xl font-bold text-gray-800 tracking-tight">{formatTime(timerSeconds)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-3 w-full">
          <div className="flex gap-4 w-full">
            <button 
              onClick={() => setIsTimerActive(!isTimerActive)}
              disabled={isFinishing}
              className={`flex-1 py-4 ${themeConfig.primary} text-white font-bold rounded-2xl shadow-lg flex items-center justify-center gap-2 transform active:scale-95 transition-transform disabled:opacity-50`}
            >
              {isTimerActive ? (
                <><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg> Pause</>
              ) : (
                <><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg> Start</>
              )}
            </button>
            <button 
              onClick={resetTimer}
              disabled={isFinishing}
              className="flex-1 py-4 bg-white border border-gray-100 text-gray-600 font-bold rounded-2xl shadow-sm flex items-center justify-center gap-2 transform active:scale-95 transition-transform hover:bg-gray-50 disabled:opacity-50"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg> Reset
            </button>
          </div>
          
          {isTimerActive && (
            <button 
              onClick={handleManualFinish}
              disabled={isFinishing}
              className={`w-full py-4 bg-gray-50 text-gray-700 font-bold rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center gap-2 transform active:scale-95 transition-all hover:bg-white animate-in fade-in slide-in-from-top-2 duration-300`}
            >
              {isFinishing ? (
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 border-2 border-gray-200 border-t-current rounded-full animate-spin`} style={{ color: themeConfig.accent }} />
                  <span className="text-gray-400">Saving Session...</span>
                </div>
              ) : (
                <><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> Finish Session</>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Durations */}
      <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-50">
        <h3 className="text-gray-800 font-bold mb-4">Duration</h3>
        <div className="grid grid-cols-3 gap-3">
          <DurationOption label="25" sub="Pomodoro" active={timerPreset === 25} onClick={() => handlePresetChange(25)} />
          <DurationOption label="45" sub="Deep work" active={timerPreset === 45} onClick={() => handlePresetChange(45)} />
          <DurationOption label="60" sub="Extended" active={timerPreset === 60} onClick={() => handlePresetChange(60)} />
        </div>
      </div>

      {/* Break Suggestions */}
      <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-50">
        <h3 className="text-gray-800 font-bold mb-4">Break Suggestions</h3>
        <div className="flex flex-col gap-3">
          <SuggestionCard 
            icon="✨" 
            title="Stretch for 5 minutes" 
            desc="Quick body break" 
          />
          <SuggestionCard 
            icon="🍎" 
            title="Grab a snack" 
            desc="Refuel your energy" 
          />
          <SuggestionCard 
            icon="🚶‍♀️" 
            title="Take a walk" 
            desc="Get some fresh air" 
          />
        </div>
      </div>
    </div>
  );
};

const DurationOption: React.FC<{ label: string; sub: string; active: boolean; onClick: () => void }> = ({ label, sub, active, onClick }) => {
  const { theme } = useApp();
  const themeConfig = THEME_CONFIG[theme];
  return (
    <button 
      onClick={onClick}
      className={`p-4 rounded-2xl flex flex-col items-center transition-all ${active ? themeConfig.primary + ' text-white scale-105 shadow-md' : 'bg-white border border-gray-100 text-gray-700'}`}
    >
      <span className="text-xl font-bold">{label}</span>
      <span className="text-[10px] mt-1 opacity-90">min</span>
      <span className="text-[10px] uppercase font-bold mt-2">{sub}</span>
    </button>
  );
};

const SuggestionCard: React.FC<{ icon: string; title: string; desc: string }> = ({ icon, title, desc }) => {
  const { theme } = useApp();
  const themeConfig = THEME_CONFIG[theme];
  return (
    <div className={`flex items-center gap-4 p-4 rounded-2xl border border-gray-50 bg-gray-50/50 hover:bg-gray-50 transition-colors group`}>
      <div className={`w-12 h-12 ${themeConfig.primary} bg-opacity-20 rounded-xl flex items-center justify-center text-xl`}>
        {icon}
      </div>
      <div className="flex-1">
        <h4 className="text-sm font-bold text-gray-800">{title}</h4>
        <p className="text-xs text-gray-500 font-medium">{desc}</p>
      </div>
    </div>
  );
};

export default TimerPage;
