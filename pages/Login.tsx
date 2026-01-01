
import React, { useState } from 'react';
import { useApp, firestoreService } from '../App';
import { THEME_CONFIG } from '../constants';

/**
 * Mocking Firebase Auth structure
 */
const mockFirebaseAuth = {
  signInWithPopup: async (provider: any) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    return {
      user: {
        uid: 'google_uid_123456789',
        displayName: 'Mindful Explorer',
        email: 'explorer@studyzen.app',
      }
    };
  },
  GoogleAuthProvider: class {}
};

enum LoginMode {
  SELECTION = 'SELECTION',
  USERNAME = 'USERNAME',
  GOOGLE = 'GOOGLE',
  LOADING = 'LOADING'
}

const Login: React.FC = () => {
  const { theme, onLoginSuccess } = useApp();
  const themeConfig = THEME_CONFIG[theme];
  
  const [mindfulName, setMindfulName] = useState('');
  const [email, setEmail] = useState('');
  const [mode, setMode] = useState<LoginMode>(LoginMode.SELECTION);
  const [error, setError] = useState<string | null>(null);

  const handleGuestLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mindfulName.trim().length < 2) {
      setError('Please enter a valid username.');
      return;
    }

    setMode(LoginMode.LOADING);
    try {
      // Use the username as a UID for the dummy path
      const uid = `guest_${mindfulName.toLowerCase().replace(/\s/g, '_')}`;
      const existingData = await firestoreService.getUserData(uid);
      
      if (existingData) {
        onLoginSuccess(existingData.profile as any, existingData.history);
      } else {
        const newProfile = {
          uid,
          displayName: mindfulName,
          email: email || `${mindfulName.toLowerCase()}@guest.studyzen`,
          avatar: '',
          totalFocusMinutes: 0,
          totalSessionsCompleted: 0
        };
        await firestoreService.saveUser(newProfile, []);
        onLoginSuccess(newProfile);
      }
    } catch (err) {
      setError('An error occurred during login.');
      setMode(LoginMode.USERNAME);
    }
  };

  const handleGoogleSignIn = async () => {
    setMode(LoginMode.LOADING);
    setError(null);
    try {
      const provider = new mockFirebaseAuth.GoogleAuthProvider();
      const result = await mockFirebaseAuth.signInWithPopup(provider);
      
      const existingData = await firestoreService.getUserData(result.user.uid);
      
      if (existingData) {
        onLoginSuccess(existingData.profile as any, existingData.history);
      } else {
        const newProfile = {
          uid: result.user.uid,
          displayName: result.user.displayName,
          email: result.user.email,
          avatar: '',
          totalFocusMinutes: 0,
          totalSessionsCompleted: 0
        };
        await firestoreService.saveUser(newProfile, []);
        onLoginSuccess(newProfile);
      }
    } catch (err) {
      setError('Failed to authenticate with Google.');
      setMode(LoginMode.SELECTION);
    }
  };

  return (
    <div className={`min-h-screen ${themeConfig.bg} flex flex-col items-center justify-center p-6 transition-all duration-500`}>
      <div className="mb-10 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className={`w-16 h-16 ${themeConfig.primary} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg transform hover:scale-110 transition-transform`}>
          <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-800 tracking-tight">StudyZen</h1>
        <p className="text-gray-500 mt-2 font-medium">Elevate your focus</p>
      </div>

      <div className="bg-white rounded-[32px] p-8 w-full max-w-sm shadow-xl shadow-gray-200/50 border border-gray-50 animate-in fade-in zoom-in duration-500 overflow-hidden min-h-[340px] flex flex-col justify-center">
        
        {mode === LoginMode.SELECTION && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right duration-300">
            <h3 className="text-gray-800 font-bold text-center mb-6">Choose Login Method</h3>
            <button 
              onClick={handleGoogleSignIn}
              className="w-full py-4 bg-white border border-gray-200 text-gray-700 font-bold rounded-2xl flex items-center justify-center gap-3 hover:bg-gray-50 transition-all active:scale-95 shadow-sm group"
            >
              <img src="https://www.google.com/favicon.ico" className="w-5 h-5 group-hover:scale-110 transition-transform" alt="Google" />
              Sign in with Google
            </button>
            <div className="flex items-center gap-4 py-2">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">or</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>
            <button 
              onClick={() => setMode(LoginMode.USERNAME)}
              className={`w-full py-4 ${themeConfig.primary} text-white font-bold rounded-2xl shadow-md ${themeConfig.primaryHover} transition-all active:scale-95 flex items-center justify-center gap-2`}
            >
              Mindful Guest Login
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </button>
          </div>
        )}

        {mode === LoginMode.USERNAME && (
          <form onSubmit={handleGuestLogin} className="space-y-4 animate-in slide-in-from-right duration-300">
            <div>
              <label className="block text-gray-400 text-[10px] font-bold mb-2 ml-1 uppercase tracking-widest">Username</label>
              <input 
                type="text" 
                value={mindfulName}
                onChange={(e) => setMindfulName(e.target.value)}
                placeholder="e.g. yaya"
                className="w-full px-4 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all font-bold text-gray-700 placeholder:font-normal"
                style={{ '--tw-ring-color': themeConfig.accent } as React.CSSProperties}
              />
            </div>
            <div>
              <label className="block text-gray-400 text-[10px] font-bold mb-2 ml-1 uppercase tracking-widest">Email (Optional)</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="explorer@mindful.ly"
                className="w-full px-4 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all font-bold text-gray-700 placeholder:font-normal"
                style={{ '--tw-ring-color': themeConfig.accent } as React.CSSProperties}
              />
            </div>
            {error && <p className="text-red-400 text-[10px] mt-1 ml-1 font-bold">{error}</p>}

            <div className="pt-2 flex flex-col gap-2">
              <button 
                type="submit"
                className={`w-full py-4 ${themeConfig.primary} text-white font-bold rounded-2xl shadow-md ${themeConfig.primaryHover} transition-all active:scale-95`}
              >
                Log In
              </button>
              <button 
                type="button"
                onClick={() => setMode(LoginMode.SELECTION)}
                className="w-full py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-gray-600 transition-colors"
              >
                Back to Selection
              </button>
            </div>
          </form>
        )}

        {mode === LoginMode.LOADING && (
          <div className="flex flex-col items-center justify-center py-10 animate-pulse">
            <div className="relative w-16 h-16 mb-6">
               <div className="absolute inset-0 rounded-full border-4 border-gray-100"></div>
               <div className={`absolute inset-0 rounded-full border-4 ${themeConfig.text} border-t-transparent animate-spin`}></div>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Syncing Mind...</h3>
            <p className="text-gray-500 text-sm font-medium">Retrieving your focus journey</p>
          </div>
        )}
      </div>
      
      <p className="mt-8 text-[10px] text-gray-400 uppercase tracking-widest font-bold">Persistence Powered by StudyZen</p>
    </div>
  );
};

export default Login;
