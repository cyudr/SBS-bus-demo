import React, { useState } from 'react';
import { BUS_STOPS, BusStop } from '../data/transitData';

interface StopSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStopCode: string;
  onSelectStop: (stop: BusStop) => void;
}

export const StopSelectorModal: React.FC<StopSelectorModalProps> = ({
  isOpen,
  onClose,
  currentStopCode,
  onSelectStop,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const stopsList = Object.values(BUS_STOPS);
  const filteredStops = stopsList.filter((stop) => {
    const q = searchQuery.toLowerCase();
    return (
      stop.name.toLowerCase().includes(q) ||
      stop.code.includes(q) ||
      stop.road.toLowerCase().includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[85vh] shadow-2xl flex flex-col overflow-hidden border border-[#e5eeff]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#e5eeff] flex items-center justify-between bg-[#eff4ff]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#801d78] text-[22px]">swap_horiz</span>
            <div>
              <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-base text-[#0b1c30]">
                Select Transit Bus Stop
              </h3>
              <p className="text-xs text-[#52424d]">
                Choose from nearby stops or search 5-digit bus stop codes
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#52424d] hover:bg-[#e5eeff] transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="p-4 border-b border-[#e5eeff]">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#52424d] text-[20px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by stop name, road or code (e.g. Orchard, 09023)"
              className="w-full h-11 pl-10 pr-4 rounded-xl bg-[#eff4ff] text-sm text-[#0b1c30] placeholder:text-[#52424d]/60 focus:outline-none focus:ring-2 focus:ring-[#801d78]/30 focus:bg-white transition-all"
              autoFocus
            />
          </div>
        </div>

        {/* Stops List */}
        <div className="p-4 overflow-y-auto space-y-2 flex-1">
          {filteredStops.length === 0 ? (
            <div className="text-center py-8 text-sm text-[#52424d]">
              No stops matching "{searchQuery}" found.
            </div>
          ) : (
            filteredStops.map((stop) => {
              const isSelected = stop.code === currentStopCode;
              return (
                <div
                  key={stop.code}
                  onClick={() => {
                    onSelectStop(stop);
                    onClose();
                  }}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'border-[#801d78] bg-[#801d78]/5 shadow-xs'
                      : 'border-[#e5eeff] hover:border-[#801d78]/40 hover:bg-[#eff4ff]'
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center font-mono text-xs font-bold shrink-0 ${
                        isSelected
                          ? 'bg-[#801d78] text-white'
                          : 'bg-[#e5eeff] text-[#0b1c30]'
                      }`}
                    >
                      {stop.code}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-['Plus_Jakarta_Sans'] font-bold text-sm text-[#0b1c30] truncate">
                          {stop.name}
                        </span>
                        {isSelected && (
                          <span className="text-[10px] bg-[#801d78] text-white px-1.5 py-0.2 rounded font-bold uppercase tracking-wider">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#52424d] truncate mt-0.5">
                        {stop.road} • {stop.distanceMeters < 1000 ? `${stop.distanceMeters}m away` : `${(stop.distanceMeters / 1000).toFixed(1)}km`}
                      </p>
                      <div className="flex items-center gap-1 mt-1 flex-wrap">
                        {stop.mrtTransfers.map((mrt) => (
                          <span
                            key={mrt}
                            className={`text-[9px] px-1.5 py-0.5 rounded font-bold text-white ${
                              mrt === 'NS' ? 'bg-[#D42E12]' :
                              mrt === 'TE' ? 'bg-[#9D5B25]' :
                              mrt === 'EW' ? 'bg-[#009640]' :
                              mrt === 'NE' ? 'bg-[#9016B2]' :
                              mrt === 'CC' ? 'bg-[#FA9E0D]' :
                              mrt === 'DT' ? 'bg-[#005EC4]' : 'bg-slate-700'
                            }`}
                          >
                            {mrt}
                          </span>
                        ))}
                        <span className="text-[11px] text-[#52424d]">
                          {stop.services.length} services ({stop.services.map(s => s.serviceNo).join(', ')})
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-[20px] text-[#801d78]">
                    {isSelected ? 'check_circle' : 'chevron_right'}
                  </span>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#f8fafc] border-t border-[#e5eeff] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-semibold text-[#52424d] hover:bg-[#e5eeff] transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
