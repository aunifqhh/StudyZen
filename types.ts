
export enum ThemeColor {
  PINK = 'PINK',
  BLUE = 'BLUE',
  GREEN = 'GREEN'
}

export enum AppTab {
  TIMER = 'TIMER',
  SESSION = 'SESSION',
  SOCIAL = 'SOCIAL',
  AUDIO = 'AUDIO'
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  avatar: string;
  totalFocusMinutes: number;
  totalSessionsCompleted: number;
}

export interface SessionRecord {
  subject: string;
  duration: string;
  timeAgo: string;
  color: string;
  icon: string;
  tag: string;
}

export interface Friend {
  name: string;
  status: string;
  time: string;
  avatar: string;
}

export interface Song {
  title: string;
  artist: string;
  duration: string;
  active?: boolean;
}
