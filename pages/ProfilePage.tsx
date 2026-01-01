
import React, { useState } from 'react';
import { useApp } from '../App';
import { THEME_CONFIG } from '../constants';

const ProfilePage: React.FC = () => {
  const { 
    theme, 
    setShowProfile, 
    setAuthenticated, 
    userName, 
    setUserName, 
    userEmail, 
    totalFocusMinutes,
    totalSessionsCompleted
  } = useApp();
  
  const themeConfig = THEME_CONFIG[theme];
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(userName);

  const handleSave = () => {
    setUserName(tempName);
    setIsEditing(false);
  };

  const totalFocusHours = (totalFocusMinutes / 60).toFixed(1);
  const avgDailyMinutes = (totalFocusMinutes / 7).toFixed(0);
  const avgSessionMinutes = totalSessionsCompleted > 0 
    ? (totalFocusMinutes / totalSessionsCompleted).toFixed(0) 
    : "0";

  return (
    <div className="flex flex-col gap-6 py-2 pb-24">
      {/* User Header */}
      <div className="bg-white rounded-[40px] p-8 shadow-xl shadow-gray-200/50 border border-gray-50 flex flex-col items-center">
        <div className="relative mb-4">
          <div className={`w-24 h-24 rounded-full flex items-center justify-center shadow-lg transform transition-transform hover:scale-105 overflow-hidden border-4 ${themeConfig.border} bg-white`} style={{ color: themeConfig.accent }}>
            <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
          <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md border border-gray-50 active:scale-90 transition-all">
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          </button>
        </div>

        {isEditing ? (
          <div className="w-full max-w-xs flex flex-col items-center gap-3">
            <input 
              type="text" 
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              className="w-full text-center text-xl font-bold text-gray-800 border-b-2 focus:outline-none transition-colors px-4 py-1"
              style={{ borderBottomColor: themeConfig.accent }}
              autoFocus
            />
            <div className="flex gap-2 w-full">
              <button 
                onClick={handleSave}
                className={`flex-1 py-2 ${themeConfig.primary} text-white text-sm font-bold rounded-xl shadow-md`}
              >
                Save
              </button>
              <button 
                onClick={() => { setIsEditing(false); setTempName(userName); }}
                className="flex-1 py-2 bg-gray-100 text-gray-500 text-sm font-bold rounded-xl"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-bold text-gray-800">{userName}</h2>
            <p className="text-gray-400 text-sm mb-6">{userEmail}</p>
            <button 
              onClick={() => setIsEditing(true)}
              className="px-8 py-2.5 rounded-full border border-gray-100 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors active:scale-95"
            >
              Edit Name
            </button>
          </>
        )}
      </div>

      {/* Stats Summary */}
      <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-50">
        <h3 className="text-gray-800 font-bold mb-4">Study Summary</h3>
        <div className="grid grid-cols-2 gap-4">
          <StatBox icon="📅" label="Sessions" value={totalSessionsCompleted.toString()} />
          <StatBox icon="⏱️" label="Hours" value={`${totalFocusHours}h`} />
          <StatBox icon="⚡" label="Avg Daily" value={`${avgDailyMinutes}m`} />
          <StatBox icon="⌛" label="Avg Session" value={`${avgSessionMinutes}m`} />
        </div>
      </div>

      {/* Preferences & Settings */}
      <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-50">
        <h3 className="text-gray-800 font-bold mb-4">Account Settings</h3>
        <div className="space-y-1">
          <SettingRow icon="✉️" label="Email" value={userEmail} />
          <SettingRow icon="🔐" label="Password" value="••••••••" />
          <SettingRow icon="🌍" label="Language" value="English (US)" />
        </div>
      </div>

      <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-50">
        <h3 className="text-gray-800 font-bold mb-4">Preferences</h3>
        <div className="space-y-2">
          <PreferenceToggle icon="🔔" label="Notifications" active />
          <PreferenceToggle icon="⏰" label="Break Reminders" active />
          <PreferenceToggle icon="🔊" label="Sound Effects" />
        </div>
      </div>

      {/* Logout */}
      <button 
        onClick={() => setAuthenticated(false)}
        className="w-full py-4 bg-white border border-gray-100 text-red-400 font-bold rounded-2xl shadow-sm flex items-center justify-center gap-2 mb-8 hover:bg-red-50 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
        Sign Out
      </button>

      {/* Back to Home Button */}
      <button 
        onClick={() => setShowProfile(false)}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white text-gray-600 border border-gray-100 px-6 py-3 rounded-full shadow-2xl font-bold text-sm flex items-center gap-2 hover:bg-gray-50 transition-all z-50 animate-bounce-subtle"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        Back to Focus
      </button>

      <style>{`
        @keyframes bounce-subtle {
          0%, 100% { transform: translate(-50%, 0); }
          50% { transform: translate(-50%, -4px); }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

const StatBox: React.FC<{ icon: string; label: string; value: string }> = ({ icon, label, value }) => (
  <div className="p-4 bg-gray-50/50 rounded-2xl border border-gray-50 text-center group hover:bg-white hover:shadow-md transition-all">
    <div className="text-xl mb-1">{icon}</div>
    <p className="text-2xl font-bold text-gray-800">{value}</p>
    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">{label}</p>
  </div>
);

const SettingRow: React.FC<{ icon: string; label: string; value: string }> = ({ icon, label, value }) => (
  <div className="flex items-center gap-4 py-3 border-b border-gray-50 last:border-0">
    <span className="text-lg">{icon}</span>
    <span className="text-sm font-medium text-gray-400 flex-1">{label}</span>
    <span className="text-sm font-bold text-gray-800">{value}</span>
  </div>
);

const PreferenceToggle: React.FC<{ icon: string; label: string; active?: boolean }> = ({ icon, label, active: initialActive }) => {
  const [active, setActive] = useState(initialActive);
  const { theme } = useApp();
  const themeConfig = THEME_CONFIG[theme];
  return (
    <div className="flex items-center gap-4 p-3 rounded-2xl bg-gray-50/30">
      <div className={`w-10 h-10 ${themeConfig.primary} bg-opacity-10 rounded-xl flex items-center justify-center text-xl`}>
        {icon}
      </div>
      <span className="text-sm font-bold text-gray-700 flex-1">{label}</span>
      <div 
        onClick={() => setActive(!active)}
        className={`w-12 h-6 rounded-full relative transition-colors cursor-pointer ${active ? themeConfig.primary : 'bg-gray-200'}`}
      >
        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${active ? 'left-7' : 'left-1'}`} />
      </div>
    </div>
  );
};

export default ProfilePage;
