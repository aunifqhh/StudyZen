
import React from 'react';
import { ThemeColor } from './types';

export const THEME_CONFIG = {
  [ThemeColor.PINK]: {
    bg: 'bg-[#FFF5F7]',
    cardBg: 'bg-white',
    primary: 'bg-[#FFB3C6]',
    primaryHover: 'hover:bg-[#FF8FAB]',
    text: 'text-[#FF4D6D]',
    border: 'border-[#FFE4E9]',
    accent: '#FF4D6D'
  },
  [ThemeColor.BLUE]: {
    bg: 'bg-[#F0F7FF]',
    cardBg: 'bg-white',
    primary: 'bg-[#A2D2FF]',
    primaryHover: 'hover:bg-[#8EC5FC]',
    text: 'text-[#4A90E2]',
    border: 'border-[#E3F2FD]',
    accent: '#4A90E2'
  },
  [ThemeColor.GREEN]: {
    bg: 'bg-[#F2FBF2]',
    cardBg: 'bg-white',
    primary: 'bg-[#B8E0B8]',
    primaryHover: 'hover:bg-[#A3D1A3]',
    text: 'text-[#4CAF50]',
    border: 'border-[#E8F5E9]',
    accent: '#4CAF50'
  }
};

export const Icons = {
  Timer: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Session: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  Social: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  Audio: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
    </svg>
  ),
  Profile: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  Palette: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.828 2.828a2 2 0 010 2.828l-1.657 1.657M7 10a2 2 0 100 4 2 2 0 000-4z" />
    </svg>
  )
};

export const TRACKS = [
  { id: 1, title: "Peaceful Piano", artist: "Focus Studio", duration: "3:45", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", icon: "🎹" },
  { id: 2, title: "Rain on Window", artist: "Nature Sounds", duration: "5:20", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", icon: "🌧️" },
  { id: 3, title: "Forest Ambience", artist: "Deep Green", duration: "4:15", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3", icon: "🌲" },
  { id: 4, title: "Lofi Study Beats", artist: "Zen Beats", duration: "2:50", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3", icon: "🎧" }
];
