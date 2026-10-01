import React from 'react';
import { BUS_SERVICES, BUS_STOPS } from '../data/transitData';

interface SavedRoutesProps {
  savedServices: string[];
  savedStops: string[];
  onSelectService: (serviceNo: string) => void;
  onSelectStop: (stopCode: string) => void;
  onRemoveService: (serviceNo: string) => void;
  onRemoveStop: (stopCode: string) => void;
  showToast: (msg: string, icon?: string) => void;
}

export const SavedRoutes: React.FC<SavedRoutesProps> = ({
  savedServices,
  savedStops,
  onSelectService,
  onSelectStop,
  onRemoveService,
  onRemoveStop,
  showToast,
}) => {
  return (
    <div className="max-w-[1024px] w-full mx-auto px-4 md:px-8 py-6 flex flex-col gap-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#e5eeff] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center">
            <span className="material-symbols-outlined text-[24px]">star</span>
          </div>
          <div>
            <h2 className="font-['Plus_Jakarta_Sans'] font-bold text-lg text-[#0b1c30]">
              My Saved Bus Routes & Stops
            </h2>
            <p className="text-xs text-[#52424d]">
              Fast one-tap access to your daily commute timings
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-[#52424d]">
          <span>{savedServices.length} Services</span>
          <span>•</span>
          <span>{savedStops.length} Stops</span>
        </div>
      </div>

      {/* Bookmarked Services */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-sm text-[#0b1c30]">
            Favorite Bus Services
          </h3>
          <span className="text-[10px] text-[#52424d]">Live ETA at current nearby stop</span>
        </div>

        {savedServices.length === 0 ? (
          <div className="p-8 bg-white rounded-2xl border border-dashed border-[#e5eeff] text-center text-sm text-[#52424d]">
            No saved bus services yet. Star any bus in the Live Arrivals screen to pin it here.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {savedServices.map((srv) => {
              const info = BUS_SERVICES[srv] || BUS_SERVICES['14'];
              const nextBus = info.arrivals[0];
              return (
                <div
                  key={srv}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-[#e5eeff] hover:shadow-md transition-all flex items-center justify-between group"
                >
                  <div
                    className="flex items-center gap-3 cursor-pointer min-w-0 flex-1"
                    onClick={() => {
                      onSelectService(srv);
                      showToast(`Opened live view for Bus ${srv}`, 'directions_bus');
                    }}
                  >
                    <div className="w-12 h-12 rounded-xl bg-[#801d78] text-white flex flex-col items-center justify-center font-['Plus_Jakarta_Sans'] text-xl font-bold shrink-0">
                      <span>{srv}</span>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-['Plus_Jakarta_Sans'] font-bold text-sm text-[#0b1c30]">
                          SBS Transit {srv}
                        </span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#DCFCE7] text-[#16A34A] font-bold">
                          {info.routeType}
                        </span>
                      </div>
                      <span className="font-['Inter'] text-xs text-[#52424d] truncate">
                        {info.destination}
                      </span>
                      <span className="text-[10px] text-[#801d78] font-semibold mt-0.5">
                        Freq: {info.frequency}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pl-3">
                    <div className="flex flex-col items-end">
                      <span className="font-['Plus_Jakarta_Sans'] text-base font-extrabold text-[#16A34A] tabular-nums">
                        {nextBus.etaDisplay} {nextBus.etaSub}
                      </span>
                      <span className="text-[10px] text-[#52424d]">
                        {nextBus.occupancy === 'Seats Available' ? 'Seats' : 'Standing'}
                      </span>
                    </div>
                    <button
                      onClick={() => onRemoveService(srv)}
                      className="w-8 h-8 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 flex items-center justify-center transition-colors"
                      title="Remove from favorites"
                    >
                      <span className="material-symbols-outlined text-[18px]">close</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bookmarked Stops */}
      <div className="space-y-3">
        <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-sm text-[#0b1c30]">
          Pinned Bus Stops
        </h3>

        {savedStops.length === 0 ? (
          <div className="p-8 bg-white rounded-2xl border border-dashed border-[#e5eeff] text-center text-sm text-[#52424d]">
            No pinned bus stops yet. Use Change Stop to pin your home or workplace bus stops.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {savedStops.map((stopCode) => {
              const stop = BUS_STOPS[stopCode];
              if (!stop) return null;
              return (
                <div
                  key={stopCode}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-[#e5eeff] hover:shadow-md transition-all flex items-center justify-between"
                >
                  <div
                    className="flex items-center gap-3 cursor-pointer min-w-0 flex-1"
                    onClick={() => {
                      onSelectStop(stopCode);
                      showToast(`Loaded arrivals for ${stop.name}`, 'near_me');
                    }}
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#eff4ff] text-[#801d78] flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[20px]">directions_bus</span>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-['Plus_Jakarta_Sans'] font-bold text-sm text-[#0b1c30] truncate">
                          {stop.name}
                        </span>
                        <span className="text-[10px] font-mono text-[#52424d] font-bold">
                          {stop.code}
                        </span>
                      </div>
                      <span className="text-xs text-[#52424d] truncate">
                        {stop.road} • {stop.services.length} services
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pl-2">
                    <button
                      onClick={() => onSelectStop(stopCode)}
                      className="px-2.5 py-1 rounded-lg bg-[#801d78] text-white text-xs font-bold hover:bg-[#6a1b78] transition-colors"
                    >
                      View
                    </button>
                    <button
                      onClick={() => onRemoveStop(stopCode)}
                      className="w-7 h-7 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 flex items-center justify-center transition-colors"
                      title="Remove stop"
                    >
                      <span className="material-symbols-outlined text-[16px]">close</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
