import React, { useState } from 'react';
import { SERVICE_ALERTS, ServiceAlert } from '../data/transitData';

interface AlertsProps {
  onTrackService?: (serviceNo: string) => void;
}

export const Alerts: React.FC<AlertsProps> = ({ onTrackService }) => {
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'Trunk' | 'Diversion' | 'Downtown Line' | 'General'>('All');

  const filteredAlerts = selectedFilter === 'All'
    ? SERVICE_ALERTS
    : SERVICE_ALERTS.filter((a) => a.category === selectedFilter);

  return (
    <div className="max-w-[1024px] w-full mx-auto px-4 md:px-8 py-6 flex flex-col gap-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#e5eeff] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[24px]">verified</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-['Plus_Jakarta_Sans'] font-bold text-lg text-[#0b1c30]">
                SBS Transit Service Advisories & Alerts
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#DCFCE7] text-[#16A34A] font-bold uppercase">
                Normal Operations
              </span>
            </div>
            <p className="text-xs text-[#52424d] mt-0.5">
              Live updates on route diversions, scheduled maintenance, and rail transfers
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {(['All', 'Trunk', 'Diversion', 'Downtown Line', 'General'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedFilter(cat)}
              className={`px-3 py-1 rounded-full font-['Inter'] text-xs font-bold transition-all shrink-0 ${
                selectedFilter === cat
                  ? 'bg-[#801d78] text-white shadow-xs'
                  : 'bg-[#eff4ff] text-[#0b1c30] hover:bg-[#e5eeff]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts Feed */}
      <div className="space-y-4">
        {filteredAlerts.map((alert) => {
          const isDiversion = alert.severity === 'Diversion';
          const isAdvisory = alert.severity === 'Advisory';

          const badgeBg = isDiversion
            ? 'bg-[#FEE2E2] text-[#DC2626]'
            : isAdvisory
            ? 'bg-[#FEF3C7] text-[#D97706]'
            : 'bg-[#DCFCE7] text-[#16A34A]';

          return (
            <div
              key={alert.id}
              className={`bg-white rounded-2xl p-5 shadow-sm border transition-all ${
                isDiversion ? 'border-red-200' : 'border-[#e5eeff]'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${badgeBg}`}>
                    {alert.severity}
                  </span>
                  <span className="text-xs font-mono text-[#52424d] font-semibold">
                    {alert.id}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#eff4ff] text-[#801d78] font-bold">
                    {alert.category}
                  </span>
                </div>
                <span className="text-[10px] text-[#52424d] flex items-center gap-1">
                  <span className="material-symbols-outlined text-[12px]">schedule</span>
                  {alert.updatedTime}
                </span>
              </div>

              <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-base text-[#0b1c30] mb-1">
                {alert.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#52424d] leading-relaxed mb-3">
                {alert.description}
              </p>

              {/* Affected Services */}
              <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-[#e5eeff]">
                <span className="text-[10px] uppercase font-bold text-[#52424d] tracking-wider">
                  Affected Services:
                </span>
                {alert.affectedServices.map((srv) => (
                  <span
                    key={srv}
                    onClick={() => {
                      if (onTrackService && srv !== 'All SBS Transit Services' && srv !== 'DTL') {
                        onTrackService(srv);
                      }
                    }}
                    className={`text-[11px] px-2 py-0.5 rounded font-bold ${
                      srv === 'All SBS Transit Services' || srv === 'DTL'
                        ? 'bg-[#eff4ff] text-[#0b1c30]'
                        : 'bg-[#801d78] text-white hover:bg-[#6a1b78] cursor-pointer'
                    }`}
                  >
                    {srv}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
