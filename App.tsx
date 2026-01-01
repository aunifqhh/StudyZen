
import React, { useState, createContext, useContext, useEffect, useRef } from 'react';
import { ThemeColor, AppTab, SessionRecord, UserProfile } from './types';
import Login from './pages/Login';
import TimerPage from './pages/TimerPage';
import SessionPage from './pages/SessionPage';
import SocialPage from './pages/SocialPage';
import AudioPage from './pages/AudioPage';
import ProfilePage from './pages/ProfilePage';
import { THEME_CONFIG, Icons, TRACKS } from './constants';

interface DayData {
  name: string;
  hours: number;
}

interface AppContextType {
  theme: ThemeColor;
  setTheme: (t: ThemeColor) => void;
  isAuthenticated: boolean;
  setAuthenticated: (v: boolean) => void;
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  showProfile: boolean;
  setShowProfile: (v: boolean) => void;
  userName: string;
  setUserName: (name: string) => void;
  userEmail: string;
  setUserEmail: (email: string) => void;
  userId: string;
  // Audio Global State
  isPlaying: boolean;
  setIsPlaying: (v: boolean) => void;
  currentTrackIndex: number;
  setCurrentTrackIndex: (i: number) => void;
  volume: number;
  setVolume: (v: number) => void;
  currentTime: number;
  duration: number;
  handleNext: () => void;
  handlePrev: () => void;
  // Timer Global State
  timerSeconds: number;
  setTimerSeconds: (s: number) => void;
  isTimerActive: boolean;
  setIsTimerActive: (v: boolean) => void;
  timerPreset: number;
  setTimerPreset: (mins: number) => void;
  resetTimer: () => void;
  finishSession: () => Promise<void>;
  // Activity Data
  weeklyData: DayData[];
  sessionHistory: SessionRecord[];
  // Global Stats
  totalFocusMinutes: number;
  totalSessionsCompleted: number;
  // Auth Success helper
  onLoginSuccess: (profile: UserProfile, history?: SessionRecord[]) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};

/**
 * Mock Firestore Service with LocalStorage Persistence
 */
export const firestoreService = {
  // Key for our simulated database
  DB_KEY: 'studyzen_mock_db',

  _getDB: () => {
    const data = localStorage.getItem(firestoreService.DB_KEY);
    return data ? JSON.parse(data) : {};
  },

  _saveDB: (db: any) => {
    localStorage.setItem(firestoreService.DB_KEY, JSON.stringify(db));
  },

  getUserData: async (uid: string): Promise<{profile: Partial<UserProfile>, history: SessionRecord[]} | null> => {
    console.log(`[Firestore] Fetching data for UID: ${uid}`);
    await new Promise(resolve => setTimeout(resolve, 800));
    const db = firestoreService._getDB();
    return db[uid] || null;
  },

  saveUser: async (profile: UserProfile, history: SessionRecord[] = []) => {
    console.log('[Firestore] Saving User Profile:', profile);
    await new Promise((resolve) => setTimeout(resolve, 500));
    const db = firestoreService._getDB();
    db[profile.uid] = { profile, history };
    firestoreService._saveDB(db);
  },

  updateUserStats: async (userId: string, stats: { totalMinutes: number; sessionsCount: number }, newHistory: SessionRecord[]) => {
    console.log(`[Firestore] Updating stats for user ${userId}`);
    await new Promise((resolve) => setTimeout(resolve, 600));
    const db = firestoreService._getDB();
    if (db[userId]) {
      db[userId].profile.totalFocusMinutes = stats.totalMinutes;
      db[userId].profile.totalSessionsCompleted = stats.sessionsCount;
      db[userId].history = newHistory;
      firestoreService._saveDB(db);
    }
  }
};

const INITIAL_WEEKLY_DATA: DayData[] = [
  { name: 'Sun', hours: 0 },
  { name: 'Mon', hours: 0 },
  { name: 'Tue', hours: 0 },
  { name: 'Wed', hours: 0 },
  { name: 'Thu', hours: 0 },
  { name: 'Fri', hours: 0 },
  { name: 'Sat', hours: 0 },
];

const App: React.FC = () => {
  const [theme, setTheme] = useState<ThemeColor>(ThemeColor.PINK);
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.TIMER);
  const [showProfile, setShowProfile] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userId, setUserId] = useState('');

  // Audio State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [volume, setVolume] = useState(70);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Timer State
  const [timerSeconds, setTimerSeconds] = useState(1500); 
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [timerPreset, setTimerPreset] = useState(25);
  const timerIntervalRef = useRef<number | null>(null);

  // Activity & Stats Data
  const [weeklyData, setWeeklyData] = useState<DayData[]>(INITIAL_WEEKLY_DATA);
  const [sessionHistory, setSessionHistory] = useState<SessionRecord[]>([]);
  const [totalFocusMinutes, setTotalFocusMinutes] = useState(0);
  const [totalSessionsCompleted, setTotalSessionsCompleted] = useState(0);

  const onLoginSuccess = (profile: UserProfile, history: SessionRecord[] = []) => {
    setUserId(profile.uid);
    setUserName(profile.displayName);
    setUserEmail(profile.email);
    setTotalFocusMinutes(profile.totalFocusMinutes);
    setTotalSessionsCompleted(profile.totalSessionsCompleted);
    setSessionHistory(history);
    setAuthenticated(true);
    
    // Recalculate weekly data from history if needed, 
    // for this mock we just keep it simple
    if (history.length > 0) {
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const currentDayName = days[new Date().getDay()];
      setWeeklyData(prev => prev.map(d => d.name === currentDayName ? {...d, hours: profile.totalFocusMinutes / 60} : d));
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log("Playback error", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const handleSessionCompletion = async (durationMinutes: number) => {
    if (durationMinutes <= 0) return;

    const newTotalFocusMinutes = totalFocusMinutes + durationMinutes;
    const newSessionsCount = totalSessionsCompleted + 1;

    setTotalSessionsCompleted(newSessionsCount);
    setTotalFocusMinutes(newTotalFocusMinutes);
    
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const currentDayName = days[new Date().getDay()];
    setWeeklyData(prevData => prevData.map(day => {
      if (day.name === currentDayName) {
        return { ...day, hours: day.hours + (durationMinutes / 60) };
      }
      return day;
    }));

    const newRecord: SessionRecord = {
      subject: 'Focus Session',
      duration: `${durationMinutes} min`,
      timeAgo: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      color: theme === ThemeColor.PINK ? 'bg-pink-400' : theme === ThemeColor.BLUE ? 'bg-blue-400' : 'bg-green-400',
      icon: '✨',
      tag: 'Productivity'
    };
    
    const updatedHistory = [newRecord, ...sessionHistory];
    setSessionHistory(updatedHistory);

    try {
      await firestoreService.updateUserStats(userId, {
        totalMinutes: newTotalFocusMinutes,
        sessionsCount: newSessionsCount
      }, updatedHistory);
    } catch (err) {
      console.error('Failed to sync with Mock Firestore:', err);
    }
  };

  const finishSession = async () => {
    if (!isTimerActive) return;
    setIsTimerActive(false);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

    const elapsedSeconds = (timerPreset * 60) - timerSeconds;
    const elapsedMinutes = Math.floor(elapsedSeconds / 60);
    
    if (elapsedMinutes > 0) {
      await handleSessionCompletion(elapsedMinutes);
    }
    resetTimer();
  };

  const handleTimerComplete = async () => {
    if (!isTimerActive) return;
    setIsTimerActive(false);
    await handleSessionCompletion(timerPreset);
    resetTimer();
  };

  useEffect(() => {
    if (isTimerActive && timerSeconds > 0) {
      timerIntervalRef.current = window.setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && isTimerActive) {
      handleTimerComplete();
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    } else {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }
    return () => { if (timerIntervalRef.current) clearInterval(timerIntervalRef.current); };
  }, [isTimerActive, timerSeconds]);

  const resetTimer = () => {
    setIsTimerActive(false);
    setTimerSeconds(timerPreset * 60);
  };

  const onTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
  };

  const formatTimerDisplay = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isAuthenticated) {
    return (
      <AppContext.Provider value={{ 
        theme, setTheme, isAuthenticated, setAuthenticated, activeTab, setActiveTab, showProfile, setShowProfile, 
        userName, setUserName, userEmail, setUserEmail, userId,
        isPlaying, setIsPlaying, currentTrackIndex, setCurrentTrackIndex, volume, setVolume, currentTime, duration, handleNext, handlePrev,
        timerSeconds, setTimerSeconds, isTimerActive, setIsTimerActive, timerPreset, setTimerPreset, resetTimer, finishSession,
        weeklyData, sessionHistory, totalFocusMinutes, totalSessionsCompleted,
        onLoginSuccess
      }}>
        <Login />
      </AppContext.Provider>
    );
  }

  const themeConfig = THEME_CONFIG[theme];

  const renderContent = () => {
    if (showProfile) return <ProfilePage />;
    switch (activeTab) {
      case AppTab.TIMER: return <TimerPage />;
      case AppTab.SESSION: return <SessionPage />;
      case AppTab.SOCIAL: return <SocialPage />;
      case AppTab.AUDIO: return <AudioPage />;
      default: return <TimerPage />;
    }
  };

  return (
    <AppContext.Provider value={{ 
      theme, setTheme, isAuthenticated, setAuthenticated, activeTab, setActiveTab, showProfile, setShowProfile, 
      userName, setUserName, userEmail, setUserEmail, userId,
      isPlaying, setIsPlaying, currentTrackIndex, setCurrentTrackIndex, volume, setVolume, currentTime, duration, handleNext, handlePrev,
      timerSeconds, setTimerSeconds, isTimerActive, setIsTimerActive, timerPreset, setTimerPreset, resetTimer, finishSession,
      weeklyData, sessionHistory, totalFocusMinutes, totalSessionsCompleted,
      onLoginSuccess
    }}>
      <div className={`min-h-screen ${themeConfig.bg} flex flex-col transition-colors duration-300`}>
        <audio 
          ref={audioRef} 
          src={TRACKS[currentTrackIndex].url} 
          onTimeUpdate={onTimeUpdate}
          onEnded={handleNext}
        />

        {/* Header */}
        <header className="px-6 py-4 flex justify-between items-center max-w-lg mx-auto w-full">
          <div>
            <h1 className="text-xl font-bold text-gray-800">StudyZen</h1>
            {!showProfile && activeTab === AppTab.TIMER && (
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Welcome back, {userName}</p>
            )}
            {!showProfile && activeTab !== AppTab.TIMER && isTimerActive && (
              <p className={`text-[10px] font-bold uppercase tracking-wider ${themeConfig.text}`}>Timer: {formatTimerDisplay(timerSeconds)}</p>
            )}
          </div>
          <div className="flex gap-3 relative">
            {isPlaying && activeTab !== AppTab.AUDIO && (
              <div className="flex gap-0.5 items-end h-4 mr-2 mb-1">
                <div className={`w-0.5 h-full animate-pulse-fast`} style={{ backgroundColor: themeConfig.accent }} />
                <div className={`w-0.5 h-2/3 animate-pulse-slow`} style={{ backgroundColor: themeConfig.accent }} />
                <div className={`w-0.5 h-1/2 animate-pulse-fast`} style={{ backgroundColor: themeConfig.accent }} />
              </div>
            )}
            <button 
              onClick={() => setShowThemeMenu(!showThemeMenu)}
              className={`p-2 rounded-full ${themeConfig.primary} text-white shadow-sm transition-transform active:scale-90`}
            >
              <Icons.Palette />
            </button>
            <button 
              onClick={() => {
                setShowProfile(!showProfile);
                setShowThemeMenu(false);
              }}
              className={`w-9 h-9 rounded-full bg-white text-gray-400 border border-gray-100 shadow-sm transition-transform active:scale-90 flex items-center justify-center overflow-hidden`}
              style={{ color: themeConfig.accent }}
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </button>

            {showThemeMenu && (
              <div className="absolute top-12 right-12 bg-white rounded-2xl shadow-2xl p-2 z-50 border border-gray-100 w-48 animate-in fade-in zoom-in duration-200">
                <p className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50 mb-1">Select Theme</p>
                {(Object.keys(ThemeColor) as Array<keyof typeof ThemeColor>).map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      setTheme(ThemeColor[t]);
                      setShowThemeMenu(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 text-sm font-bold transition-colors ${theme === ThemeColor[t] ? 'bg-gray-50 text-gray-900' : 'text-gray-700'}`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 border-white shadow-sm ${THEME_CONFIG[ThemeColor[t]].primary}`} />
                    Pastel {t.charAt(0) + t.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto pb-24 px-4 max-w-lg mx-auto w-full">
          {renderContent()}
        </main>

        {!showProfile && (
          <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-100 px-6 py-3 flex justify-between items-center max-w-lg mx-auto w-full z-40">
            <TabButton icon={<Icons.Timer />} label="Timer" active={activeTab === AppTab.TIMER} onClick={() => setActiveTab(AppTab.TIMER)} />
            <TabButton icon={<Icons.Session />} label="Session" active={activeTab === AppTab.SESSION} onClick={() => setActiveTab(AppTab.SESSION)} />
            <TabButton icon={<Icons.Social />} label="Social" active={activeTab === AppTab.SOCIAL} onClick={() => setActiveTab(AppTab.SOCIAL)} />
            <TabButton icon={<Icons.Audio />} label="Audio" active={activeTab === AppTab.AUDIO} onClick={() => setActiveTab(AppTab.AUDIO)} />
          </nav>
        )}
      </div>
    </AppContext.Provider>
  );
};

const TabButton: React.FC<{ icon: React.ReactNode; label: string; active: boolean; onClick: () => void }> = ({ icon, label, active, onClick }) => {
  const { theme } = useApp();
  const themeConfig = THEME_CONFIG[theme];
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center gap-1 transition-colors ${active ? themeConfig.text : 'text-gray-400'}`}
    >
      <div className={`${active ? 'scale-110' : 'scale-100'} transition-transform`}>
        {icon}
      </div>
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );
};

export default App;
