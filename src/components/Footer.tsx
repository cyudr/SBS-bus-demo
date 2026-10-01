import React from 'react';

interface FooterProps {
  onViewStatusClick: () => void;
  onOpenPreferences: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onViewStatusClick,
  onOpenPreferences,
}) => {
  return (
    <footer className="w-full bg-[#eff4ff] mt-10 border-t border-[#e5eeff]">
      {/* Network Status Sub-bar */}
      <div className="bg-[#dce9ff] py-2 px-4 md:px-8 border-b border-[#dce9ff]">
        <div className="max-w-[1024px] mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A] flex-shrink-0 animate-pulse"></span>
            <span className="font-['Inter'] text-xs text-[#0b1c30] font-semibold truncate">
              All SBS Transit trunk and feeder networks operate on regular headway.
            </span>
          </div>
          <button
            onClick={onViewStatusClick}
            className="font-['Inter'] text-[10px] text-[#62005c] font-bold hover:underline flex-shrink-0"
          >
            View Status
          </button>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-[1024px] mx-auto px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Brand Info */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <span className="font-['Plus_Jakarta_Sans'] text-base text-[#62005c] font-bold">
                SBS Transit
              </span>
            </div>
            <p className="font-['Inter'] text-xs text-[#52424d] leading-relaxed">
              Delivering comfortable, safe, and punctual bus transport connectivity across Singapore since 1973.
            </p>
          </div>

          {/* Passenger Tools */}
          <div>
            <div className="font-['Inter'] text-xs font-bold text-[#0b1c30] mb-2 uppercase tracking-wider">
              Passenger Tools
            </div>
            <ul className="space-y-1.5 font-['Inter'] text-xs">
              <li
                onClick={onOpenPreferences}
                className="text-[#52424d] hover:text-[#0b1c30] transition-colors cursor-pointer"
              >
                Fare Calculator & Concessions
              </li>
              <li
                onClick={onOpenPreferences}
                className="text-[#52424d] hover:text-[#0b1c30] transition-colors cursor-pointer"
              >
                Wheelchair Accessible Buses
              </li>
              <li
                onClick={onViewStatusClick}
                className="text-[#52424d] hover:text-[#0b1c30] transition-colors cursor-pointer"
              >
                First & Last Bus Schedules
              </li>
              <li className="text-[#52424d] hover:text-[#0b1c30] transition-colors cursor-pointer">
                Lost & Found Inquiries
              </li>
            </ul>
          </div>

          {/* Corporate & Network */}
          <div>
            <div className="font-['Inter'] text-xs font-bold text-[#0b1c30] mb-2 uppercase tracking-wider">
              Corporate & Network
            </div>
            <ul className="space-y-1.5 font-['Inter'] text-xs">
              <li className="text-[#52424d] hover:text-[#0b1c30] transition-colors cursor-pointer">
                About SBS Transit Ltd
              </li>
              <li className="text-[#52424d] hover:text-[#0b1c30] transition-colors cursor-pointer">
                Sustainability Initiatives
              </li>
              <li className="text-[#52424d] hover:text-[#0b1c30] transition-colors cursor-pointer">
                Careers & Bus Captain Roles
              </li>
              <li className="text-[#52424d] hover:text-[#0b1c30] transition-colors cursor-pointer">
                Press Releases
              </li>
            </ul>
          </div>

          {/* Compliance & Data */}
          <div>
            <div className="font-['Inter'] text-xs font-bold text-[#0b1c30] mb-2 uppercase tracking-wider">
              Compliance & Data
            </div>
            <div className="p-3 bg-white rounded-xl border border-[#e5eeff] space-y-1">
              <span className="font-['Inter'] text-[10px] text-[#52424d] uppercase font-bold tracking-wider">
                Official Data Provider
              </span>
              <p className="font-['Inter'] text-xs text-[#52424d] leading-relaxed">
                Real-time bus arrival estimations and route telemetry powered by Land Transport Authority (LTA) DataMall API.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Rights Bar */}
        <div className="pt-4 border-t border-[#dce9ff] flex flex-col md:flex-row items-center justify-between gap-3 font-['Inter'] text-xs text-[#52424d]">
          <div className="flex items-center gap-3 flex-wrap">
            <span>© 2026 SBS Transit Ltd. All rights reserved.</span>
            <span>•</span>
            <span className="hover:text-[#0b1c30] cursor-pointer">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-[#0b1c30] cursor-pointer">Privacy Policy</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse"></span>
            <span className="text-[11px] font-medium">LTA Telemetry Live • SGT (UTC+08:00)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
