
import React from 'react';
import { useApp } from '../App';
import { THEME_CONFIG } from '../constants';
import { BarChart, Bar, XAxis, ResponsiveContainer, Cell, Tooltip } from 'recharts';

const SessionPage: React.FC = () => {
  const { theme, weeklyData, sessionHistory, totalFocusMinutes, totalSessionsCompleted } = useApp();
  const themeConfig = THEME_CONFIG[theme];

  const totalFocusHours = totalFocusMinutes / 60;
  const currentDayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date().getDay()];

  return (
    <div className="flex flex-col gap-6 py-2 pb-10">
      {/* Overview Stats */}
      <div className="grid grid-cols-3 gap-4">
        <StatItem icon="📅" value={totalSessionsCompleted.toString()} label="Sessions" />
        <StatItem icon="🕒" value={`${totalFocusHours.toFixed(1)}h`} label="Total Focus" />
        <StatItem icon="📈" value={`${Math.min(100, (totalFocusHours / 40) * 100).toFixed(0)}%`} label="Goal Met" />
      </div>

      {/* Weekly Chart */}
      <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-50">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-gray-800 font-bold">Activity</h3>
          <span className="text-[10px] font-bold text-gray-500 bg-gray-50 px-2 py-1 rounded-full">THIS WEEK</span>
        </div>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <Tooltip 
                cursor={{fill: '#F9FAFB'}}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(value: number) => [`${value.toFixed(1)} hrs`, 'Focus Time']}
              />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: '#6B7280', fontWeight: 'bold' }}
                dy={10}
              />
              <Bar dataKey="hours" radius={[6, 6, 6, 6]} barSize={32}>
                {weeklyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.name === currentDayName ? themeConfig.accent : '#F3F4F6'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Sessions */}
      <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-50">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-gray-800 font-bold">Session History</h3>
          <button className={`text-xs font-bold ${themeConfig.text}`}>View All</button>
        </div>
        <div className="flex flex-col gap-3">
          {sessionHistory.length > 0 ? (
            sessionHistory.slice(0, 5).map((session, idx) => (
              <SessionListTile 
                key={idx}
                title={session.subject} 
                time={session.duration} 
                date={session.timeAgo} 
                color={session.color} 
                icon={session.icon} 
                tag={session.tag} 
              />
            ))
          ) : (
            <div className="py-8 text-center text-gray-400 text-sm font-medium">No sessions yet today. Start the timer!</div>
          )}
        </div>
      </div>

      {/* Friends Activity Feed */}
      <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-50">
        <h3 className="text-gray-800 font-bold mb-4">Friend Activity</h3>
        <div className="space-y-4">
          <ActivityFeedItem 
            user="Alex Chen" 
            action="just finished a" 
            item="45m Physics Session" 
            time="2m ago" 
            avatar="https://picsum.photos/seed/alex/100" 
          />
          <ActivityFeedItem 
            user="Sam Rodriguez" 
            action="is currently" 
            item="Studying Lofi" 
            time="Now" 
            avatar="https://picsum.photos/seed/sam/100" 
            isLive 
          />
          <ActivityFeedItem 
            user="Jordan Lee" 
            action="reached a" 
            item="10 Day Streak!" 
            time="1h ago" 
            avatar="https://picsum.photos/seed/jordan/100" 
          />
        </div>
      </div>
    </div>
  );
};

const StatItem: React.FC<{ icon: string; value: string; label: string }> = ({ icon, value, label }) => (
  <div className="bg-white p-4 rounded-2xl flex flex-col items-center shadow-sm border border-gray-50">
    <div className="text-xl mb-1">{icon}</div>
    <span className="text-lg font-bold text-gray-800">{value}</span>
    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider text-center">{label}</span>
  </div>
);

const SessionListTile: React.FC<{ title: string; time: string; date: string; color: string; icon: string; tag: string }> = ({ title, time, date, color, icon, tag }) => (
  <div className="flex items-center gap-4 p-3 rounded-2xl bg-gray-50/50 border border-transparent hover:border-gray-100 transition-all cursor-pointer group">
    <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center text-xl shadow-sm text-white transform group-hover:scale-110 transition-transform`}>
      {icon}
    </div>
    <div className="flex-1">
      <div className="flex items-center gap-2 mb-0.5">
        <h4 className="text-sm font-bold text-gray-800">{title}</h4>
        <span className="text-[9px] px-1.5 py-0.5 bg-white border border-gray-100 rounded-md text-gray-500 font-bold uppercase">{tag}</span>
      </div>
      <p className="text-[11px] text-gray-500 font-medium">{date}</p>
    </div>
    <div className="text-right">
      <p className="text-sm font-bold text-gray-700">{time}</p>
    </div>
  </div>
);

const ActivityFeedItem: React.FC<{ user: string; action: string; item: string; time: string; avatar: string; isLive?: boolean }> = ({ user, action, item, time, avatar, isLive }) => {
  const { theme } = useApp();
  const themeConfig = THEME_CONFIG[theme];
  return (
    <div className="flex gap-3 items-start">
      <div className="relative">
        <img src={avatar} className="w-8 h-8 rounded-full border border-gray-100" alt={user} />
        {isLive && <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 ${themeConfig.primary} rounded-full border-2 border-white animate-pulse`} />}
      </div>
      <div className="flex-1">
        <p className="text-xs text-gray-700">
          <span className="font-bold text-gray-800">{user}</span> {action} <span className={`font-bold ${themeConfig.text}`}>{item}</span>
        </p>
        <span className="text-[10px] text-gray-500 font-bold">{time}</span>
      </div>
    </div>
  );
};

export default SessionPage;
