
import React from 'react';
import { useApp } from '../App';
import { THEME_CONFIG, TRACKS } from '../constants';

const AudioPage: React.FC = () => {
  const { 
    theme, 
    isPlaying, 
    setIsPlaying, 
    currentTrackIndex, 
    setCurrentTrackIndex, 
    volume, 
    setVolume, 
    currentTime, 
    duration,
    handleNext,
    handlePrev
  } = useApp();
  
  const themeConfig = THEME_CONFIG[theme];
  const currentTrack = TRACKS[currentTrackIndex];

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col gap-6 py-2 pb-10">
      {/* Current Player */}
      <div className="bg-white rounded-[40px] p-8 shadow-xl shadow-gray-200/50 border border-gray-50 flex flex-col items-center">
        <div className={`w-36 h-36 ${themeConfig.primary} bg-opacity-10 rounded-3xl flex items-center justify-center mb-6 shadow-inner relative group`}>
          <div className="text-5xl group-hover:scale-110 transition-transform">{currentTrack.icon}</div>
          {isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
              <div className="w-full h-full border-4 border-dashed rounded-3xl animate-spin-slow" />
            </div>
          )}
        </div>
        <h2 className="text-xl font-bold text-gray-800">{currentTrack.title}</h2>
        <p className="text-gray-400 text-sm mb-6">{currentTrack.artist}</p>

        {/* Progress Bar */}
        <div className="w-full mb-6">
          <div className="flex justify-between text-[10px] font-bold text-gray-400 mb-2">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
          <div className="w-full h-1.5 bg-gray-100 rounded-full relative overflow-hidden cursor-pointer">
            <div 
              className={`absolute top-0 left-0 h-full ${themeConfig.primary} transition-all`} 
              style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-8 mb-8">
          <button onClick={handlePrev} className="text-gray-300 hover:text-gray-500 transition-colors transform active:scale-90">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z" /></svg>
          </button>
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className={`w-20 h-20 ${themeConfig.primary} text-white rounded-full flex items-center justify-center shadow-lg transform hover:scale-105 transition-all active:scale-95`}
          >
            {isPlaying ? (
              <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
            ) : (
              <svg className="w-10 h-10 ml-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
            )}
          </button>
          <button onClick={handleNext} className="text-gray-300 hover:text-gray-500 transition-colors transform active:scale-90">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798L4.555 5.168z" /></svg>
          </button>
        </div>

        {/* Volume */}
        <div className="flex items-center gap-4 w-full px-4">
          <svg className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.983 5.983 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.984 3.984 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" /></svg>
          <input 
            type="range" 
            min="0" max="100" 
            value={volume} 
            onChange={(e) => setVolume(parseInt(e.target.value))}
            className="flex-1 h-1.5 bg-gray-100 rounded-full appearance-none cursor-pointer"
            style={{ accentColor: themeConfig.accent }}
          />
          <span className="text-[10px] font-bold text-gray-400 w-6">{volume}%</span>
        </div>
      </div>

      {/* Up Next / Library */}
      <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-50">
        <h3 className="text-gray-800 font-bold mb-4">Library</h3>
        <div className="flex flex-col gap-3">
          {TRACKS.map((track, index) => (
            <TrackItem 
              key={track.id} 
              track={track} 
              active={currentTrackIndex === index} 
              onClick={() => {
                setCurrentTrackIndex(index);
                setIsPlaying(true);
              }}
              isPlaying={currentTrackIndex === index && isPlaying}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const TrackItem: React.FC<{ track: any; active?: boolean; onClick: () => void; isPlaying: boolean }> = ({ track, active, onClick, isPlaying }) => {
  const { theme } = useApp();
  const themeConfig = THEME_CONFIG[theme];
  return (
    <div 
      onClick={onClick}
      className={`flex items-center gap-4 p-3 rounded-2xl transition-all cursor-pointer ${active ? themeConfig.primary + ' bg-opacity-10 border border-' + themeConfig.accent + '/10 scale-[1.02]' : 'bg-gray-50/50 hover:bg-gray-100'}`}
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${active ? 'bg-white shadow-sm' : 'bg-gray-100 text-gray-400'}`}>
        {track.icon}
      </div>
      <div className="flex-1">
        <h4 className={`text-sm font-bold ${active ? themeConfig.text : 'text-gray-700'}`}>{track.title}</h4>
        <p className="text-[10px] text-gray-400 font-medium uppercase">{track.artist}</p>
      </div>
      <div className="text-right flex items-center gap-2">
        <span className="text-[10px] font-bold text-gray-400">{track.duration}</span>
        {isPlaying && (
          <div className="flex gap-0.5 items-end h-3">
            <div className={`w-0.5 bg-current animate-pulse-fast h-full`} style={{ color: themeConfig.accent }} />
            <div className={`w-0.5 bg-current animate-pulse-slow h-2/3`} style={{ color: themeConfig.accent }} />
            <div className={`w-0.5 bg-current animate-pulse-fast h-1/2`} style={{ color: themeConfig.accent }} />
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioPage;
