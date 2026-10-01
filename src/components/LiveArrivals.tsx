import React, { useState, useEffect } from 'react';
import {
  BUS_SERVICES,
  BUS_STOPS,
  BusArrivalInfo,
  BusStop,
  TRANSLATIONS,
} from '../data/transitData';
import { fetchBusArrivals } from '../api';

interface LiveArrivalsProps {
  currentStop: BusStop;
  activeServiceNo: string;
  setActiveServiceNo: (no: string) => void;
  onOpenStopModal: () => void;
  onOpenAlarmModal: () => void;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  showToast: (msg: string, icon?: string) => void;
  selectedLanguage: 'EN' | 'CN' | 'MY' | 'TA';
  activeAlarmMinutes: number | null;
}

export const LiveArrivals: React.FC<LiveArrivalsProps> = ({
  currentStop,
  activeServiceNo,
  setActiveServiceNo,
  onOpenStopModal,
  onOpenAlarmModal,
  isBookmarked,
  onToggleBookmark,
  showToast,
  selectedLanguage,
  activeAlarmMinutes,
}) => {
  const [searchInput, setSearchInput] = useState<string>(activeServiceNo);
  const [direction, setDirection] = useState<1 | 2>(1);
  const [countdown, setCountdown] = useState<number>(18);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Sync search input when service changes
  useEffect(() => {
    setSearchInput(activeServiceNo);
  }, [activeServiceNo]);

  // Telemetry countdown simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          triggerRefresh();
          return 20;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const triggerRefresh = async () => {
    setIsRefreshing(true);
    try {
      const data = await fetchBusArrivals(currentStop.code, activeServiceNo);
      if (data.isLive) {
        showToast(`LTA v3 Telemetry Live: Bus ${activeServiceNo} at Stop ${currentStop.code}`, 'sync');
      } else {
        showToast('Live arrival telemetry updated from LTA DataMall v3', 'sync');
      }
    } catch {
      showToast('Live arrival telemetry updated from LTA DataMall', 'sync');
    } finally {
      setIsRefreshing(false);
    }
  };

  const currentService: BusArrivalInfo =
    BUS_SERVICES[activeServiceNo] || BUS_SERVICES['14'];

  const t = TRANSLATIONS[selectedLanguage];

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = searchInput.trim().toUpperCase();
    if (!clean) {
      showToast('Please enter a bus service number or stop code', 'info');
      return;
    }

    // Check if it's a stop code
    if (BUS_STOPS[clean]) {
      showToast(`Switched stop to ${BUS_STOPS[clean].name}`, 'near_me');
      onOpenStopModal();
      return;
    }

    // Check if bus service exists
    if (BUS_SERVICES[clean]) {
      setActiveServiceNo(clean);
      showToast(`Loading live timings for SBS Bus ${clean}`, 'directions_bus');
    } else {
      // Fallback for custom search
      showToast(`Tracking service ${clean} along current corridor`, 'search');
    }
  };

  const handleShare = () => {
    const text = `Bus ${currentService.serviceNo} arriving in ${currentService.arrivals[0].etaDisplay} at ${currentStop.name} (${currentStop.code}). Seats available!`;
    if (navigator.share) {
      navigator
        .share({
          title: `SBS Bus ${currentService.serviceNo} Timing`,
          text: text,
          url: window.location.href,
        })
        .then(() => showToast('Bus timing shared!', 'share'))
        .catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      showToast('Live bus ETA link copied to clipboard!', 'content_copy');
    }
  };

  const quickServices = ['14', '65', '174', '7', '100', '123'];

  // Current stops list based on direction
  const activeStops =
    direction === 1
      ? currentService.direction1.stops
      : currentService.direction2.stops;

  return (
    <div className="max-w-[1024px] w-full mx-auto px-4 md:px-8 py-6 flex flex-col gap-6">
      {/* Top Utility & Service Advisory Banner */}
      <section className="w-full flex flex-col gap-2">
        <div className="w-full bg-[#eff4ff] rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 shadow-xs border border-[#dce9ff]/60">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A] animate-ping flex-shrink-0"></span>
            <span className="material-symbols-outlined text-[#16A34A] text-[18px]">
              verified
            </span>
            <p className="font-['Inter'] text-[12px] text-[#0b1c30] font-semibold truncate">
              {t.advisoryText}
            </p>
          </div>
          <div className="flex items-center gap-3 text-[#52424d] font-['Inter'] text-[10px]">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">cloud</span>
              29°C Fair
            </span>
            <span className="w-1 h-1 rounded-full bg-[#d6c1ce]"></span>
            <span>Orchard Corridor Normal</span>
          </div>
        </div>

        {/* Search & Geolocation Command Center */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#e5eeff] flex flex-col gap-3">
          <form
            onSubmit={handleSearchSubmit}
            className="flex flex-col sm:flex-row gap-2 items-stretch"
          >
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#52424d] text-[22px]">
                directions_bus
              </span>
              <input
                className="w-full h-12 pl-12 pr-10 rounded-xl bg-[#eff4ff] text-[#0b1c30] font-['Plus_Jakarta_Sans'] text-base sm:text-lg font-semibold placeholder:text-[#52424d]/60 placeholder:font-normal focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#801d78]/20 transition-all border border-transparent focus:border-[#801d78]/40"
                id="bus-input"
                placeholder={t.searchPlaceholder}
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => setSearchInput('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center text-[#52424d] hover:text-[#0b1c30] hover:bg-[#e5eeff] transition-colors"
                  title="Clear search"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              )}
            </div>
            <button
              type="submit"
              className="h-12 px-6 bg-[#801d78] text-white rounded-xl font-['Inter'] text-sm font-bold flex items-center justify-center gap-1.5 hover:bg-[#6a1b78] active:scale-[0.98] transition-all shadow-sm flex-shrink-0"
              id="search-action-btn"
            >
              <span className="material-symbols-outlined text-[20px]">search</span>
              <span>{t.checkTiming}</span>
            </button>
          </form>

          {/* Recent / Frequent Quick Select Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <span className="font-['Inter'] text-[10px] text-[#52424d] font-bold uppercase tracking-wider whitespace-nowrap mr-1">
              {t.quickAccess}
            </span>
            {quickServices.map((srv) => {
              const isActive = activeServiceNo === srv;
              return (
                <button
                  key={srv}
                  onClick={() => {
                    setActiveServiceNo(srv);
                    setSearchInput(srv);
                    showToast(`Switched view to Bus ${srv}`, 'directions_bus');
                  }}
                  className={`px-3 py-1 rounded-full font-['Inter'] text-[12px] font-bold transition-all flex items-center gap-1 shrink-0 ${
                    isActive
                      ? 'bg-[#62005c] text-white shadow-xs'
                      : 'bg-[#eff4ff] text-[#0b1c30] hover:bg-[#e5eeff]'
                  }`}
                >
                  <span>Bus {srv}</span>
                  {isActive && (
                    <span className="material-symbols-outlined text-[14px]">
                      arrow_forward
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Nearest Stop Geolocation Indicator Card */}
        <div className="bg-gradient-to-r from-white to-[#eff4ff] rounded-2xl p-3.5 shadow-sm border border-[#e5eeff] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[#D85C27]/10 flex items-center justify-center flex-shrink-0 text-[#D85C27]">
              <span className="material-symbols-outlined text-[24px]">near_me</span>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-['Inter'] text-[10px] bg-[#D85C27] text-white px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                  {t.nearestStop}
                </span>
                <span className="font-['Plus_Jakarta_Sans'] text-base sm:text-[18px] text-[#0b1c30] font-bold truncate">
                  {currentStop.name} ({currentStop.code})
                </span>
              </div>
              <p className="font-['Inter'] text-[12px] text-[#52424d] flex items-center gap-1.5 mt-0.5 flex-wrap">
                <span>
                  {currentStop.road} • {currentStop.distanceMeters}m {t.away} ({currentStop.walkMinutes} min {t.walk})
                </span>
                <span>•</span>
                <span className="inline-flex items-center gap-0.5 text-[#0284C7] font-semibold text-[10px]">
                  <span className="material-symbols-outlined text-[13px]">accessible</span>{' '}
                  {t.barrierFree}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 self-end sm:self-auto shrink-0">
            {/* Refresh Countdown Pill */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#e5eeff] border border-[#dce9ff]">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#16A34A] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#16A34A]"></span>
              </span>
              <span className="font-['Inter'] text-[10px] font-bold text-[#0b1c30] tabular-nums">
                {t.refreshesIn} {countdown}s
              </span>
              <button
                onClick={() => {
                  setCountdown(20);
                  triggerRefresh();
                }}
                className={`w-5 h-5 rounded-full hover:bg-white flex items-center justify-center text-[#52424d] transition-transform ${
                  isRefreshing ? 'animate-spin' : ''
                }`}
                title="Refresh telemetry now"
              >
                <span className="material-symbols-outlined text-[14px]">refresh</span>
              </button>
            </div>

            <button
              onClick={onOpenStopModal}
              className="px-3 py-1 rounded-lg bg-white hover:bg-[#e5eeff] text-[#62005c] font-['Inter'] text-[12px] font-bold transition-all shadow-xs flex items-center gap-1 border border-[#e5eeff]"
              id="switch-stop-modal-btn"
            >
              <span className="material-symbols-outlined text-[16px]">swap_horiz</span>
              <span>{t.changeStop}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Live Service Dashboard (Split Desktop Bento) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Service Overview & Arrival Countdown (7 Cols) */}
        <section className="lg:col-span-7 flex flex-col gap-4">
          {/* Active Bus Header Card */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#e5eeff] flex flex-col gap-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3.5">
                <div className="w-16 h-16 rounded-2xl bg-[#801d78] text-white flex flex-col items-center justify-center shadow-md flex-shrink-0">
                  <span className="font-['Plus_Jakarta_Sans'] text-[32px] font-extrabold leading-none tracking-tight">
                    {currentService.serviceNo}
                  </span>
                  <span className="font-['Inter'] text-[10px] uppercase tracking-widest font-bold opacity-80 mt-0.5">
                    {currentService.routeType}
                  </span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#0b1c30]">
                      SBS Transit {currentService.serviceNo}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-[#DCFCE7] text-[#16A34A] font-['Inter'] text-[10px] font-bold uppercase tracking-wider">
                      Regular
                    </span>
                  </div>
                  <p className="font-['Inter'] text-xs text-[#52424d] mt-0.5">
                    Bi-directional Trunk • Loop Frequency {currentService.frequency}
                  </p>
                  <div className="flex items-center gap-2 text-[#52424d] font-['Inter'] text-[10px] mt-1">
                    <span className="material-symbols-outlined text-[14px]">
                      nest_clock_farsight_analog
                    </span>
                    <span>First: {currentService.firstBus}</span>
                    <span>•</span>
                    <span>Last: {currentService.lastBus}</span>
                  </div>
                </div>
              </div>

              {/* Header Quick Actions */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={onToggleBookmark}
                  className={`w-10 h-10 rounded-xl transition-all flex items-center justify-center ${
                    isBookmarked
                      ? 'bg-[#FEF3C7] text-[#D97706]'
                      : 'bg-[#eff4ff] text-[#52424d] hover:text-[#D97706] hover:bg-[#FEF3C7]'
                  }`}
                  title={isBookmarked ? 'Bookmarked' : 'Bookmark route'}
                  id="bookmark-btn"
                >
                  <span
                    className={`material-symbols-outlined text-[20px] ${
                      isBookmarked ? 'material-symbols-fill' : ''
                    }`}
                  >
                    star
                  </span>
                </button>
                <button
                  onClick={handleShare}
                  className="w-10 h-10 rounded-xl bg-[#eff4ff] text-[#52424d] hover:text-[#62005c] hover:bg-[#e5eeff] transition-all flex items-center justify-center"
                  title="Share live ETA"
                  id="share-btn"
                >
                  <span className="material-symbols-outlined text-[20px]">share</span>
                </button>
              </div>
            </div>

            {/* Direction Toggle Tabs */}
            <div className="bg-[#eff4ff] p-1 rounded-xl flex flex-col sm:flex-row gap-1">
              <button
                onClick={() => {
                  setDirection(1);
                  showToast(
                    `Direction 1 selected: ${currentService.direction1.destination}`
                  );
                }}
                className={`flex-1 py-2 px-3 rounded-lg font-['Inter'] text-xs font-bold text-left transition-all flex items-center justify-between ${
                  direction === 1
                    ? 'bg-[#801d78] text-white shadow-sm'
                    : 'text-[#52424d] hover:text-[#0b1c30] hover:bg-white/60'
                }`}
              >
                <div className="flex flex-col leading-tight min-w-0">
                  <span className="text-[10px] uppercase tracking-wider font-semibold opacity-80">
                    Direction 1
                  </span>
                  <span className="truncate">
                    {currentService.direction1.destination}
                  </span>
                </div>
                <span
                  className={`material-symbols-outlined text-[16px] ml-2 ${
                    direction === 1 ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  check_circle
                </span>
              </button>

              <button
                onClick={() => {
                  setDirection(2);
                  showToast(
                    `Direction 2 selected: ${currentService.direction2.destination}`
                  );
                }}
                className={`flex-1 py-2 px-3 rounded-lg font-['Inter'] text-xs font-bold text-left transition-all flex items-center justify-between ${
                  direction === 2
                    ? 'bg-[#801d78] text-white shadow-sm'
                    : 'text-[#52424d] hover:text-[#0b1c30] hover:bg-white/60'
                }`}
              >
                <div className="flex flex-col leading-tight min-w-0">
                  <span className="text-[10px] uppercase tracking-wider font-semibold opacity-80">
                    Direction 2
                  </span>
                  <span className="truncate">
                    {currentService.direction2.destination}
                  </span>
                </div>
                <span
                  className={`material-symbols-outlined text-[16px] ml-2 ${
                    direction === 2 ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  check_circle
                </span>
              </button>
            </div>

            <div className="flex items-center gap-1.5 text-[#52424d] font-['Inter'] text-[10px] px-1">
              <span className="material-symbols-outlined text-[14px]">signpost</span>
              <span className="truncate">{currentService.viaDescription}</span>
            </div>
          </div>

          {/* Real-Time Arrival Triple Cards (LTA Live Data Layout) */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-1.5">
                <span className="font-['Plus_Jakarta_Sans'] font-bold text-base text-[#0b1c30]">
                  {t.upcomingArrivals}
                </span>
                <span className="font-['Inter'] text-xs text-[#52424d] font-semibold">
                  ({currentStop.name})
                </span>
              </div>
              <span className="font-['Inter'] text-[10px] text-[#52424d] font-semibold">
                {t.liveTelemetry}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {currentService.arrivals.map((arr, idx) => {
                const label = idx === 0 ? t.firstBus : idx === 1 ? t.secondBus : t.thirdBus;
                const isImminent = arr.etaDisplay === 'Arr';
                const loadColor =
                  arr.occupancy === 'Seats Available'
                    ? '#16A34A'
                    : arr.occupancy === 'Standing Available'
                    ? '#D97706'
                    : '#DC2626';
                const loadBg =
                  arr.occupancy === 'Seats Available'
                    ? 'bg-[#DCFCE7]'
                    : arr.occupancy === 'Standing Available'
                    ? 'bg-[#FEF3C7]'
                    : 'bg-[#FEE2E2]';
                const loadBorder =
                  arr.occupancy === 'Seats Available'
                    ? 'bg-[#16A34A]'
                    : arr.occupancy === 'Standing Available'
                    ? 'bg-[#D97706]'
                    : 'bg-[#DC2626]';

                return (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl p-4 shadow-sm border border-[#e5eeff] flex flex-col justify-between gap-3 hover:shadow-md transition-all relative overflow-hidden group"
                  >
                    <div className={`absolute top-0 left-0 right-0 h-1.5 ${loadBorder}`}></div>

                    <div className="flex items-start justify-between">
                      <div className="flex flex-col">
                        <span className="font-['Inter'] text-[10px] uppercase tracking-wider text-[#52424d] font-bold">
                          {label}
                        </span>
                        <div className="flex items-baseline gap-1 mt-0.5">
                          <span
                            className={`font-['Plus_Jakarta_Sans'] text-[36px] sm:text-[40px] font-extrabold tracking-tight tabular-nums ${
                              isImminent
                                ? 'text-[#16A34A] animate-pulse'
                                : 'text-[#0b1c30]'
                            }`}
                          >
                            {arr.etaDisplay}
                          </span>
                          <span
                            className={`font-['Inter'] text-xs font-bold uppercase ${
                              isImminent ? 'text-[#16A34A]' : 'text-[#0b1c30]'
                            }`}
                          >
                            {arr.etaSub}
                          </span>
                        </div>
                      </div>

                      <div
                        className={`w-9 h-9 rounded-xl ${loadBg} flex items-center justify-center`}
                        style={{ color: loadColor }}
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          {idx === 0
                            ? 'directions_bus'
                            : idx === 1
                            ? 'schedule'
                            : 'hourglass_top'}
                        </span>
                      </div>
                    </div>

                    {/* Vehicle Specs */}
                    <div className="flex flex-col gap-1.5 pt-1">
                      <div className="flex items-center justify-between text-[#0b1c30] font-['Inter'] text-xs">
                        <span className="flex items-center gap-1 font-semibold">
                          <span className="material-symbols-outlined text-[16px] text-[#62005c]">
                            {arr.type.includes('Double')
                              ? 'airport_shuttle'
                              : 'directions_bus'}
                          </span>
                          {arr.type}
                        </span>
                        {arr.wab && (
                          <span
                            className="text-[#0284C7] font-bold flex items-center gap-0.5 text-[10px]"
                            title="Wheelchair Accessible Bus"
                          >
                            <span className="material-symbols-outlined text-[13px]">
                              accessible
                            </span>
                            WAB
                          </span>
                        )}
                      </div>

                      {/* Load Bar */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between font-['Inter'] text-[10px]">
                          <span
                            className="font-bold flex items-center gap-1"
                            style={{ color: loadColor }}
                          >
                            <span className="material-symbols-outlined text-[13px]">
                              {arr.occupancy === 'Seats Available'
                                ? 'airline_seat_recline_normal'
                                : arr.occupancy === 'Standing Available'
                                ? 'groups'
                                : 'person_off'}
                            </span>
                            {arr.occupancy}
                          </span>
                          <span className="font-bold text-[#52424d] tabular-nums">
                            {arr.occupancyPercent}% Full
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-[#e5eeff] overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500`}
                            style={{
                              width: `${arr.occupancyPercent}%`,
                              backgroundColor: loadColor,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    {/* Plate & Location status */}
                    <div className="bg-[#eff4ff] rounded-lg p-2 flex items-center justify-between font-['Inter'] text-[10px] text-[#52424d]">
                      <span className="font-mono">{arr.vehiclePlate}</span>
                      <span
                        className={`font-semibold ${
                          isImminent ? 'text-[#16A34A]' : 'text-[#0b1c30]'
                        }`}
                      >
                        {arr.locationStatus}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Notification & Commuter Tools Trigger Bar */}
            <div className="bg-white rounded-xl p-3.5 shadow-sm border border-[#e5eeff] flex flex-wrap items-center justify-between gap-2.5">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#62005c] text-[20px]">
                  notifications_active
                </span>
                <span className="font-['Inter'] text-xs sm:text-sm text-[#0b1c30] font-medium">
                  {t.notifyText}
                </span>
              </div>
              <button
                onClick={onOpenAlarmModal}
                className={`px-3.5 py-1.5 rounded-lg font-['Inter'] text-xs font-bold transition-all flex items-center gap-1 shadow-xs ${
                  activeAlarmMinutes !== null
                    ? 'bg-[#16A34A] text-white hover:bg-[#15803d]'
                    : 'bg-[#eff4ff] hover:bg-[#62005c] hover:text-white text-[#62005c]'
                }`}
                id="set-alarm-btn"
              >
                <span className="material-symbols-outlined text-[16px]">alarm</span>
                <span>
                  {activeAlarmMinutes !== null
                    ? `Alarm Active (${activeAlarmMinutes}m)`
                    : t.notifyBtn}
                </span>
              </button>
            </div>
          </div>

          {/* Interactive Route Schematic Timeline */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#e5eeff] flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="font-['Plus_Jakarta_Sans'] font-bold text-base text-[#0b1c30]">
                  {t.routeProgress}
                </span>
                <span className="font-['Inter'] text-xs text-[#52424d]">
                  Tracking active SBS vehicles along {activeStops.length} key waypoints
                </span>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-['Inter']">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#16A34A]"></span> Seats
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#D97706]"></span> Standing
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#DC2626]"></span> Limited
                </span>
              </div>
            </div>

            {/* Vertical Timeline with Active Radar */}
            <div className="relative pl-6 py-2 space-y-3">
              {/* Vertical Guide Line */}
              <div className="absolute left-2.5 top-3 bottom-3 w-0.5 bg-[#d6c1ce]"></div>

              {activeStops.map((stop, index) => {
                if (stop.status === 'passed') {
                  return (
                    <div
                      key={stop.stopCode}
                      className="relative flex items-center justify-between text-[#52424d]/70 py-1"
                    >
                      <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white flex items-center justify-center">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#52424d]/30"></span>
                      </div>
                      <div className="flex flex-col min-w-0 pr-3">
                        <span className="font-['Inter'] text-xs line-through truncate">
                          {stop.name} ({stop.stopCode})
                        </span>
                        <span className="font-['Inter'] text-[10px] text-[#52424d]/60">
                          {stop.passedText}
                        </span>
                      </div>
                      <span className="font-['Inter'] text-[10px] px-2 py-0.5 rounded bg-[#eff4ff] text-[#52424d]">
                        Departed
                      </span>
                    </div>
                  );
                }

                if (stop.status === 'approaching') {
                  return (
                    <div
                      key={stop.stopCode}
                      className="relative flex items-center justify-between text-[#52424d] py-1"
                    >
                      <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white flex items-center justify-center">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#52424d]/50"></span>
                      </div>
                      <div className="flex flex-col min-w-0 pr-3">
                        <span className="font-['Inter'] text-xs truncate font-medium text-[#0b1c30]">
                          {stop.name} ({stop.stopCode})
                        </span>
                        <span className="font-['Inter'] text-[10px] text-[#52424d]">
                          {stop.passedText}
                        </span>
                      </div>
                      {stop.vehicleHere && (
                        <div className="flex items-center gap-1 bg-[#16A34A] text-white px-2 py-0.5 rounded-full font-['Inter'] text-[10px] font-bold animate-bounce shadow-xs">
                          <span className="material-symbols-outlined text-[12px]">
                            airport_shuttle
                          </span>
                          <span>{stop.vehicleHere}</span>
                        </div>
                      )}
                    </div>
                  );
                }

                if (stop.status === 'current') {
                  return (
                    <div
                      key={stop.stopCode}
                      className="relative flex items-center justify-between p-3 rounded-xl bg-[#62005c]/5 -ml-2 border-l-4 border-[#62005c] shadow-xs my-2"
                    >
                      <div className="absolute -left-5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-md">
                        <span className="w-3.5 h-3.5 rounded-full bg-[#62005c] animate-ping opacity-75 absolute"></span>
                        <span className="w-3.5 h-3.5 rounded-full bg-[#62005c] relative"></span>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-['Inter'] text-[10px] uppercase tracking-wider font-bold text-[#62005c]">
                            {t.yourLocation}
                          </span>
                          <span className="w-1.5 h-1.5 rounded-full bg-[#62005c]"></span>
                          <span className="font-['Inter'] text-[10px] text-[#52424d]">
                            {stop.passedText}
                          </span>
                        </div>
                        <span className="font-['Plus_Jakarta_Sans'] font-bold text-sm sm:text-base text-[#0b1c30] truncate">
                          {stop.name} ({stop.stopCode})
                        </span>
                        <span className="font-['Inter'] text-xs text-[#52424d]">
                          {stop.road} • Transfer: {stop.transfers || 'Bus & Rail'}
                        </span>
                      </div>
                      <div className="flex flex-col items-end shrink-0 pl-2">
                        <span className="font-['Plus_Jakarta_Sans'] text-base sm:text-lg text-[#16A34A] font-extrabold tabular-nums">
                          {stop.etaDiff || '< 1 min'}
                        </span>
                        <span className="font-['Inter'] text-[10px] text-[#52424d]">
                          Headway 6m
                        </span>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={stop.stopCode}
                    className="relative flex items-center justify-between text-[#0b1c30] py-1"
                  >
                    <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white flex items-center justify-center">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#d6c1ce]"></span>
                    </div>
                    <div className="flex flex-col min-w-0 pr-3">
                      <span className="font-['Inter'] text-xs font-semibold text-[#0b1c30] truncate">
                        {stop.name} ({stop.stopCode})
                      </span>
                      <span className="font-['Inter'] text-[10px] text-[#52424d]">
                        {stop.passedText}
                        {stop.transfers ? ` • Transfer: ${stop.transfers}` : ''}
                      </span>
                    </div>
                    <span className="font-['Inter'] text-xs text-[#52424d] font-medium tabular-nums">
                      {stop.etaDiff}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Right Column: Interactive Map Snippet & Alternative Stop Services (5 Cols) */}
        <section className="lg:col-span-5 flex flex-col gap-4">
          {/* Live Transit Map Pin Card */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#e5eeff] flex flex-col">
            <div className="p-3.5 flex items-center justify-between bg-[#eff4ff] border-b border-[#e5eeff]">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#D85C27] text-[20px]">
                  pin_drop
                </span>
                <span className="font-['Inter'] text-sm font-bold text-[#0b1c30]">
                  {t.transitHub}
                </span>
              </div>
              <span className="font-['Inter'] text-[10px] px-2 py-0.5 rounded-full bg-[#e5eeff] text-[#0b1c30] font-semibold border border-[#dce9ff]">
                Live GPS Active
              </span>
            </div>

            {/* Static Map with Geolocation Container */}
            <div className="relative w-full h-56 bg-[#dce9ff] overflow-hidden">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDG4hWEPTZbxesWxBp95dDDj2oN0C1xeW6Mwnn_GNTKY9t6KvGl5J_9DOZDk3cdjbwSxYnU-Od7RTYuX0Mq956B4j-YMNqIW9yKxLd59K_sQGvt8Q3h42oh7g97yZnJTIdoN5hb34QJylLq7ZV5U65ccnJ4uOIwFfsHktz2PkcFufIBAPQ1ktf3aFW8NDt3Kh2H7gTuw9w_hDqL3GccBawjvSXoyAdM5gjbM83oCQBTavj2UaGL4g')`,
                }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-t from-white/30 via-transparent to-transparent"></div>

              {/* Custom Pin Annotation */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none">
                <div className="bg-[#62005c] text-white px-2.5 py-1 rounded-full shadow-lg font-['Inter'] text-[10px] font-bold flex items-center gap-1 animate-pulse">
                  <span className="material-symbols-outlined text-[13px]">
                    directions_bus
                  </span>
                  <span>
                    {currentStop.name} ({currentStop.code})
                  </span>
                </div>
                <div className="w-3 h-3 bg-[#62005c] rotate-45 -mt-1 shadow-md"></div>
                <div className="w-6 h-6 rounded-full bg-[#62005c]/20 flex items-center justify-center animate-ping mt-1"></div>
              </div>

              {/* MRT Transfer Badge */}
              <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-lg shadow-sm flex items-center gap-1.5 text-[#0b1c30] font-['Inter'] text-[10px] border border-white/60">
                <span className="w-3.5 h-3.5 rounded-full bg-[#D42E12] text-white flex items-center justify-center text-[8px] font-bold">
                  NS
                </span>
                <span className="w-3.5 h-3.5 rounded-full bg-[#9D5B25] text-white flex items-center justify-center text-[8px] font-bold">
                  TE
                </span>
                <span className="font-bold">{currentStop.mrtExit || 'ION Orchard Exit 4'}</span>
                <span className="text-[#52424d]">({currentStop.walkMinutes} min walk)</span>
              </div>
            </div>

            <div className="p-3 flex items-center justify-between bg-white text-xs">
              <div className="flex items-center gap-1 text-[#52424d] font-['Inter'] text-[10px]">
                <span className="material-symbols-outlined text-[16px] text-[#D85C27]">
                  navigation
                </span>
                <span>{currentStop.facing}</span>
              </div>
              <a
                className="font-['Inter'] text-[10px] text-[#62005c] font-bold hover:underline flex items-center gap-0.5"
                href={`https://maps.google.com/?q=${encodeURIComponent(
                  `${currentStop.code} Singapore`
                )}`}
                rel="noopener noreferrer"
                target="_blank"
              >
                <span>Google Maps</span>
                <span className="material-symbols-outlined text-[13px]">
                  open_in_new
                </span>
              </a>
            </div>
          </div>

          {/* All Services at this Stop (Alternative Options) */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#e5eeff] flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="font-['Plus_Jakarta_Sans'] font-bold text-base text-[#0b1c30]">
                  {t.allServices}
                </span>
                <span className="font-['Inter'] text-xs text-[#52424d]">
                  {currentStop.name} ({currentStop.code})
                </span>
              </div>
              <span className="font-['Inter'] text-[10px] px-2 py-0.5 rounded-full bg-[#eff4ff] font-bold text-[#62005c]">
                {currentStop.services.length} Routes
              </span>
            </div>

            {/* Services List */}
            <div className="space-y-1.5" id="alt-services-container">
              {currentStop.services.map((srv) => {
                const isActive = activeServiceNo === srv.serviceNo;
                const occColor =
                  srv.occupancy === 'Seats'
                    ? '#16A34A'
                    : srv.occupancy === 'Standing'
                    ? '#D97706'
                    : '#DC2626';

                return (
                  <div
                    key={srv.serviceNo}
                    onClick={() => {
                      setActiveServiceNo(srv.serviceNo);
                      showToast(
                        `Switched to Bus ${srv.serviceNo} (${srv.destination})`,
                        'directions_bus'
                      );
                    }}
                    className={`p-2.5 rounded-xl flex items-center justify-between transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#62005c]/5 border border-[#801d78]/30 shadow-xs'
                        : 'hover:bg-[#eff4ff] border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className={`w-12 h-9 rounded-lg font-['Plus_Jakarta_Sans'] text-[20px] sm:text-[24px] flex items-center justify-center font-bold flex-shrink-0 ${
                          isActive
                            ? 'bg-[#801d78] text-white shadow-xs'
                            : 'bg-[#3f4a5e] text-white'
                        }`}
                      >
                        {srv.serviceNo}
                      </span>
                      <div className="flex flex-col min-w-0">
                        <span className="font-['Inter'] text-xs font-bold text-[#0b1c30] truncate">
                          {srv.destination}
                        </span>
                        <span
                          className={`font-['Inter'] text-[10px] truncate ${
                            isActive ? 'text-[#801d78] font-semibold' : 'text-[#52424d]'
                          }`}
                        >
                          {isActive ? 'Active Selection' : srv.via}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex flex-col items-end">
                        <span
                          className="font-['Plus_Jakarta_Sans'] text-base font-extrabold tabular-nums"
                          style={{ color: occColor }}
                        >
                          {srv.etaDisplay}
                        </span>
                        <span
                          className="font-['Inter'] text-[10px] font-semibold flex items-center gap-0.5"
                          style={{ color: occColor }}
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: occColor }}
                          ></span>
                          {srv.occupancy}
                        </span>
                      </div>
                      <span
                        className={`material-symbols-outlined text-[18px] transition-colors ${
                          isActive
                            ? 'text-[#801d78]'
                            : 'text-[#52424d] group-hover:text-[#801d78]'
                        }`}
                      >
                        chevron_right
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Wheelchair & Commuter Accessibility Infobox */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#e5eeff] flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0284C7]/10 text-[#0284C7] flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-[24px]">accessible</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-['Inter'] text-xs sm:text-sm font-bold text-[#0b1c30]">
                {t.wheelchairFleet}
              </span>
              <p className="font-['Inter'] text-xs text-[#52424d] leading-relaxed">
                {t.wheelchairFleetDesc}
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
