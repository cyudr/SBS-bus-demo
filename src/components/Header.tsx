import React, { useState, useEffect } from 'react';

interface HeaderProps {
  activeTab: 'live-arrivals' | 'route-planner' | 'saved-routes' | 'service-updates';
  setActiveTab: (tab: 'live-arrivals' | 'route-planner' | 'saved-routes' | 'service-updates') => void;
  currentStopCode: string;
  currentStopName: string;
  savedCount: number;
  selectedLanguage: 'EN' | 'CN' | 'MY' | 'TA';
  setSelectedLanguage: (lang: 'EN' | 'CN' | 'MY' | 'TA') => void;
  onOpenPreferences: () => void;
  onOpenStopModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  currentStopCode,
  currentStopName,
  savedCount,
  selectedLanguage,
  setSelectedLanguage,
  onOpenPreferences,
  onOpenStopModal,
}) => {
  const [timeString, setTimeString] = useState<string>('14:28:05');

  useEffect(() => {
    const updateTime = () => {
      // Singapore Time is UTC+8
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Singapore',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      };
      setTimeString(new Intl.DateTimeFormat('en-GB', options).format(now));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { id: 'live-arrivals' as const, label: selectedLanguage === 'CN' ? '实时到站' : selectedLanguage === 'MY' ? 'Ketibaan' : selectedLanguage === 'TA' ? 'நேரலை' : 'Live Arrivals' },
    { id: 'route-planner' as const, label: selectedLanguage === 'CN' ? '路线规划' : selectedLanguage === 'MY' ? 'Perancang' : selectedLanguage === 'TA' ? 'வழித்தடம்' : 'Route Planner' },
    { id: 'saved-routes' as const, label: selectedLanguage === 'CN' ? '我的收藏' : selectedLanguage === 'MY' ? 'Disimpan' : selectedLanguage === 'TA' ? 'சேமிக்கப்பட்ட' : 'Saved', count: savedCount },
    { id: 'service-updates' as const, label: selectedLanguage === 'CN' ? '服务通告' : selectedLanguage === 'MY' ? 'Makluman' : selectedLanguage === 'TA' ? 'எச்சரிக்கைகள்' : 'Alerts', hasAlert: true },
  ];

  return (
    <header className="fixed top-0 w-full z-50 bg-[#f8f9ff]/95 backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-[#e5eeff]">
      <div className="h-20 max-w-[1024px] mx-auto px-4 md:px-8 flex items-center justify-between gap-3">
        {/* Brand Lockup */}
        <div 
          className="flex items-center gap-3 min-w-0 flex-shrink-0 cursor-pointer select-none"
          onClick={() => setActiveTab('live-arrivals')}
        >
          <img
            alt="SBS Transit Bus Tracker Logo"
            className="h-8 w-auto object-contain"
            src="https://lh3.googleusercontent.com/aida/AEtjO1Xw32_9i3y7Pdmw-Ldm3cnCwunulGPThMvDAni2QmS6oD0dolyLOHl8RggKwaTPACbVArBYmRtoXbIE-XZQinA94oRimx0zCO0jXq6KL7tAN63W6uGDAntDPRth6Kaz_fWOlf4Ai-7ukEdtuVrz0TcKD28g5H0YtYzQomxUF50UreSvkHaGRPiZG4wRadlxqhM3OYE_y0d3g_bUcmuO3K4BshBo7xjfd1-PQMtKoprMoVafmhPq0sw"
            referrerPolicy="no-referrer"
          />
          <div className="flex flex-col justify-center leading-none">
            <span className="font-['Plus_Jakarta_Sans'] text-[18px] text-[#62005c] tracking-tight font-bold">
              SBS Transit
            </span>
            <span className="font-['Inter'] text-[10px] text-[#52424d] font-semibold tracking-wider uppercase">
              Bus Tracker Live
            </span>
          </div>
        </div>

        {/* Current Nearby Stop Geolocation Pill */}
        <button
          onClick={onOpenStopModal}
          className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-[#eff4ff] hover:bg-[#e5eeff] rounded-full transition-colors border border-[#dce9ff]/60"
          title="Click to change current stop"
        >
          <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse"></span>
          <span className="material-symbols-outlined text-[#D85C27] text-[16px]">near_me</span>
          <span className="font-['Inter'] text-[12px] text-[#0b1c30] font-semibold truncate max-w-[280px]">
            {currentStopName} ({currentStopCode}) • 120m
          </span>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 font-['Inter'] text-[14px]">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3 py-2 rounded-lg font-semibold transition-all relative ${
                  isActive
                    ? 'bg-[#801d78] text-white shadow-sm'
                    : 'text-[#52424d] hover:bg-[#e5eeff] hover:text-[#0b1c30]'
                }`}
              >
                <span>{item.label}</span>
                {item.count !== undefined && item.count > 0 && (
                  <span
                    className={`ml-1.5 text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive ? 'bg-white text-[#801d78]' : 'bg-[#801d78] text-white'
                    }`}
                  >
                    {item.count}
                  </span>
                )}
                {item.hasAlert && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#d85c27] absolute top-2 right-2 animate-ping"></span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Actions Zone: Live Clock, Language, Profile */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {/* SGT Live Clock */}
          <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 bg-[#e5eeff] rounded-lg text-[#0b1c30]">
            <span className="material-symbols-outlined text-[15px] text-[#52424d]">schedule</span>
            <span className="font-['Inter'] text-[12px] font-bold text-[#0b1c30] tracking-tight tabular-nums">
              {timeString}
            </span>
            <span className="font-['Inter'] text-[10px] text-[#52424d] font-semibold">SGT</span>
          </div>

          {/* Language Switcher */}
          <div className="flex items-center bg-[#eff4ff] rounded-lg p-0.5 border border-[#dce9ff]">
            {(['EN', 'CN', 'MY', 'TA'] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setSelectedLanguage(lang)}
                className={`px-1.5 py-0.5 rounded font-['Inter'] text-[10px] font-bold transition-all ${
                  selectedLanguage === lang
                    ? 'bg-[#62005c] text-white shadow-sm'
                    : 'text-[#52424d] hover:text-[#0b1c30]'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>

          {/* Commuter Profile / Settings */}
          <button
            onClick={onOpenPreferences}
            className="w-8 h-8 rounded-full bg-[#62005c] text-white flex items-center justify-center hover:bg-[#801d78] transition-colors focus:ring-2 focus:ring-[#801d78]/40"
            title="Commuter Preferences & Concessions"
            aria-label="Commuter Preferences"
          >
            <span className="material-symbols-outlined text-[18px]">person</span>
          </button>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="md:hidden flex items-center justify-around px-2 py-1.5 bg-[#f8f9ff] border-t border-[#e5eeff]/80">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-2.5 py-1 rounded-md text-[12px] font-semibold transition-all ${
                isActive ? 'bg-[#801d78] text-white' : 'text-[#52424d]'
              }`}
            >
              {item.label}
              {item.count !== undefined && item.count > 0 && ` (${item.count})`}
            </button>
          );
        })}
      </div>
    </header>
  );
};
