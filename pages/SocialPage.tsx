
import React, { useState } from 'react';
import { useApp } from '../App';
import { THEME_CONFIG } from '../constants';

const SocialPage: React.FC = () => {
  const { theme } = useApp();
  const themeConfig = THEME_CONFIG[theme];
  const [activeSegment, setActiveSegment] = useState<'FRIENDS' | 'CHAT'>('FRIENDS');

  return (
    <div className="flex flex-col gap-6 py-2 pb-10">
      {/* Toggle Segment */}
      <div className="bg-gray-100/50 p-1.5 rounded-2xl flex items-center shadow-inner">
        <button 
          onClick={() => setActiveSegment('FRIENDS')}
          className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${activeSegment === 'FRIENDS' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-400'}`}
        >
          Friends
        </button>
        <button 
          onClick={() => setActiveSegment('CHAT')}
          className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${activeSegment === 'CHAT' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-400'}`}
        >
          Chat
        </button>
      </div>

      {activeSegment === 'FRIENDS' ? (
        <>
          <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-50">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-gray-800 font-bold">Friends</h3>
              <button className={`flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-100 text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors`}>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
                Add Friend
              </button>
            </div>
            
            <div className="flex flex-col gap-4">
              <FriendItem name="Alex Chen" status="Studying Math" time="25 min" avatar="https://picsum.photos/seed/alex/100" />
              <FriendItem name="Sam Rodriguez" status="On break" time="5 min" avatar="https://picsum.photos/seed/sam/100" online />
              <FriendItem name="Jordan Lee" status="Last seen 2h ago" time="" avatar="https://picsum.photos/seed/jordan/100" />
              <FriendItem name="Taylor Kim" status="Studying Physics" time="45 min" avatar="https://picsum.photos/seed/taylor/100" />
            </div>
          </div>

          <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-50">
            <h3 className="text-gray-800 font-bold mb-2">Study Together</h3>
            <p className="text-xs text-gray-400 mb-6 leading-relaxed">Connect with friends and study in virtual rooms</p>
            <div className="grid grid-cols-2 gap-4">
              <button className={`p-6 rounded-3xl border border-gray-100 flex flex-col items-center gap-3 hover:bg-gray-50 transition-all group`}>
                <div className={`w-12 h-12 ${themeConfig.primary} bg-opacity-10 rounded-2xl flex items-center justify-center transition-colors group-hover:bg-opacity-20`}>
                  <svg className={`w-6 h-6 ${themeConfig.text}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                </div>
                <span className="text-xs font-bold text-gray-700">Create a Room</span>
              </button>
              <button className="p-6 rounded-3xl border border-gray-100 flex flex-col items-center gap-3 hover:bg-gray-50 transition-all group">
                <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center transition-colors group-hover:bg-gray-200">
                  <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                </div>
                <span className="text-xs font-bold text-gray-700">Join Room</span>
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-50 h-[500px] flex flex-col">
          <h3 className="text-gray-800 font-bold mb-6">Messages</h3>
          <div className="flex-1 overflow-y-auto space-y-4">
             <MessagePreview name="Alex Chen" msg="Want to join a study room?" time="2m ago" unreadCount={2} avatar="https://picsum.photos/seed/alex/100" />
             <MessagePreview name="Study Group" msg="Meeting at 3pm today" time="15m ago" avatar="https://picsum.photos/seed/group/100" />
             <MessagePreview name="Sam Rodriguez" msg="Thanks for the notes!" time="1h ago" avatar="https://picsum.photos/seed/sam/100" />
          </div>
          <div className="mt-6 flex gap-2">
            <input 
              type="text" 
              placeholder="Type a message..."
              className="flex-1 bg-gray-50 border border-gray-100 rounded-2xl px-4 text-sm focus:outline-none"
            />
            <button className={`p-4 ${themeConfig.primary} text-white rounded-2xl shadow-md`}>
              <svg className="w-5 h-5 transform rotate-90" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const FriendItem: React.FC<{ name: string; status: string; time: string; avatar: string; online?: boolean }> = ({ name, status, time, avatar, online }) => {
  const { theme } = useApp();
  const themeConfig = THEME_CONFIG[theme];
  return (
    <div className="flex items-center gap-4 p-4 rounded-[24px] border border-gray-50 bg-gray-50/30 hover:bg-gray-50 transition-colors">
      <div className="relative">
        <img src={avatar} className="w-12 h-12 rounded-full border-2 border-white shadow-sm" alt={name} />
        {online && <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 ${themeConfig.primary} rounded-full border-2 border-white`} />}
      </div>
      <div className="flex-1">
        <h4 className="text-sm font-bold text-gray-800">{name}</h4>
        <p className="text-xs text-gray-400">{status}</p>
      </div>
      {time && <span className="text-xs font-medium text-gray-400">{time}</span>}
    </div>
  );
};

const MessagePreview: React.FC<{ name: string; msg: string; time: string; avatar: string; unreadCount?: number }> = ({ name, msg, time, avatar, unreadCount }) => {
  const { theme } = useApp();
  const themeConfig = THEME_CONFIG[theme];
  return (
    <div className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-2xl cursor-pointer border border-transparent hover:border-gray-50 transition-all">
      <img src={avatar} className="w-12 h-12 rounded-full border border-gray-100" alt={name} />
      <div className="flex-1 overflow-hidden">
        <div className="flex justify-between items-center mb-0.5">
          <h4 className="text-sm font-bold text-gray-800">{name}</h4>
          <span className="text-[10px] text-gray-400">{time}</span>
        </div>
        <p className="text-xs text-gray-400 truncate">{msg}</p>
      </div>
      {unreadCount && (
        <div className={`w-5 h-5 ${themeConfig.primary} rounded-full flex items-center justify-center text-[10px] font-bold text-white`}>
          {unreadCount}
        </div>
      )}
    </div>
  );
};

export default SocialPage;
