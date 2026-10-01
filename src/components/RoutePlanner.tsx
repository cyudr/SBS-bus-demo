import React, { useState, useEffect, useCallback } from 'react';
import { TRIP_PLANS } from '../data/transitData';
import { fetchRoutePlan, RoutePlanOption } from '@/api/_client';

interface RoutePlannerProps {
  onTrackBus: (serviceNo: string) => void;
  showToast: (msg: string, icon?: string) => void;
  concessionType: string;
}

export const RoutePlanner: React.FC<RoutePlannerProps> = ({
  onTrackBus,
  showToast,
  concessionType,
}) => {
  const [origin, setOrigin] = useState<string>('Opp Orchard Stn / ION (09023)');
  const [destination, setDestination] = useState<string>('Bedok Temp Int (84009)');
  const [filterTag, setFilterTag] = useState<'All' | 'Direct Bus' | 'Fastest' | 'Fewest Transfers'>('All');
  const [selectedPlanId, setSelectedPlanId] = useState<string>('plan-1');
  const [plans, setPlans] = useState<RoutePlanOption[]>((TRIP_PLANS['default'] || []) as unknown as RoutePlanOption[]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLiveApi, setIsLiveApi] = useState<boolean>(false);

  const loadPlans = useCallback(
    async (orig: string, dest: string, pref: string) => {
      setIsLoading(true);
      try {
        const res = await fetchRoutePlan(orig, dest, pref);
        if (res?.plans && res.plans.length > 0) {
          setPlans(res.plans);
          setIsLiveApi(true);
          setSelectedPlanId(res.plans[0].id);
        }
      } catch (err) {
        console.warn('Could not load dynamic route plans from API:', err);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    loadPlans(origin, destination, filterTag);
  }, [loadPlans, filterTag]);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!origin.trim() || !destination.trim()) {
      showToast('Please specify both origin and destination', 'info');
      return;
    }
    loadPlans(origin, destination, filterTag);
    showToast(`Searching journey options from ${origin.split('(')[0]}...`, 'search');
  };

  const handleSwap = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
    loadPlans(destination, temp, filterTag);
    showToast('Swapped origin and destination', 'swap_vert');
  };

  const calculateConcessionFare = (baseFare: string) => {
    if (concessionType === 'Student') return 'S$ 0.65 (Student)';
    if (concessionType === 'Senior') return 'S$ 0.95 (Senior)';
    if (concessionType === 'Workfare') return 'S$ 1.42 (WTCS)';
    if (concessionType === 'Disabilities') return 'S$ 0.95 (Persons w/ Disabilities)';
    return baseFare;
  };

  const filteredPlans =
    filterTag === 'All' ? plans : plans.filter((p) => p.tag === filterTag);

  const activePlan = plans.find((p) => p.id === selectedPlanId) || plans[0] || filteredPlans[0];

  return (
    <div className="max-w-[1024px] w-full mx-auto px-4 md:px-8 py-6 flex flex-col gap-6">
      {/* Search Header */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#e5eeff] flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#801d78] text-[24px]">alt_route</span>
            <div>
              <h2 className="font-['Plus_Jakarta_Sans'] font-bold text-lg text-[#0b1c30]">
                SBS Transit Route Planner
              </h2>
              <p className="text-xs text-[#52424d]">
                Inter-modal journey optimization with live LTA DataMall v3 bus timings
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isLiveApi && (
              <span className="font-['Inter'] text-[10px] px-2 py-0.5 rounded-full bg-[#DCFCE7] text-[#16A34A] font-bold border border-[#BBF7D0]">
                Live Telemetry Active
              </span>
            )}
            <span className="font-['Inter'] text-[10px] px-2.5 py-1 rounded-full bg-[#eff4ff] text-[#801d78] font-bold">
              Fare Tier: {concessionType}
            </span>
          </div>
        </div>

        {/* Origin / Destination Input Box */}
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3 items-center">
          <div className="flex-1 w-full space-y-2">
            <div className="relative">
              <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A] absolute left-4 top-1/2 -translate-y-1/2"></span>
              <input
                type="text"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                placeholder="Starting bus stop or station (e.g. Opp Orchard Stn / 09023)"
                className="w-full h-11 pl-9 pr-3 rounded-xl bg-[#eff4ff] text-xs sm:text-sm text-[#0b1c30] font-medium border border-transparent focus:border-[#801d78]/40 focus:bg-white focus:outline-none"
              />
            </div>

            <div className="relative">
              <span className="w-2.5 h-2.5 rounded-full bg-[#bb0027] absolute left-4 top-1/2 -translate-y-1/2"></span>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Destination bus stop or station (e.g. Bedok Temp Int / 84009)"
                className="w-full h-11 pl-9 pr-3 rounded-xl bg-[#eff4ff] text-xs sm:text-sm text-[#0b1c30] font-medium border border-transparent focus:border-[#801d78]/40 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 self-stretch md:self-auto">
            <button
              type="button"
              onClick={handleSwap}
              className="w-11 h-11 rounded-xl bg-[#eff4ff] hover:bg-[#e5eeff] text-[#52424d] flex items-center justify-center transition-colors shrink-0"
              title="Swap Origin and Destination"
            >
              <span className="material-symbols-outlined text-[20px]">swap_vert</span>
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 h-11 rounded-xl bg-[#801d78] hover:bg-[#6b1564] text-white font-['Inter'] text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 shrink-0"
            >
              <span className={`material-symbols-outlined text-[16px] ${isLoading ? 'animate-spin' : ''}`}>
                {isLoading ? 'refresh' : 'directions'}
              </span>
              <span>{isLoading ? 'Finding...' : 'Find Route'}</span>
            </button>
          </div>
        </form>

        {/* Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none pt-1">
          <span className="font-['Inter'] text-[10px] text-[#52424d] font-bold uppercase tracking-wider mr-1">
            Preference:
          </span>
          {(['All', 'Direct Bus', 'Fastest', 'Fewest Transfers'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setFilterTag(filter)}
              className={`px-3 py-1 rounded-full font-['Inter'] text-xs font-bold transition-all ${
                filterTag === filter
                  ? 'bg-[#801d78] text-white shadow-xs'
                  : 'bg-[#eff4ff] text-[#0b1c30] hover:bg-[#e5eeff]'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Suggested Itineraries */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Plan Options */}
        <div className="lg:col-span-6 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="font-['Plus_Jakarta_Sans'] font-bold text-sm text-[#0b1c30]">
              Suggested Routes ({filteredPlans.length})
            </span>
            <span className="font-['Inter'] text-[10px] text-[#52424d]">
              Ranked by transit efficiency
            </span>
          </div>

          {filteredPlans.map((plan) => {
            const isSelected = selectedPlanId === plan.id;
            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlanId(plan.id)}
                className={`p-4 rounded-2xl bg-white border transition-all cursor-pointer shadow-sm ${
                  isSelected
                    ? 'border-[#801d78] ring-2 ring-[#801d78]/10'
                    : 'border-[#e5eeff] hover:border-[#801d78]/30'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-['Plus_Jakarta_Sans'] font-bold text-base text-[#0b1c30]">
                        {plan.durationMins} mins
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#eff4ff] text-[#801d78] font-bold">
                        {plan.tag}
                      </span>
                    </div>
                    <span className="font-['Inter'] text-xs text-[#52424d] mt-0.5">
                      {plan.title}
                    </span>
                  </div>

                  <div className="flex flex-col items-end">
                    <span className="text-xs font-bold text-[#16A34A]">
                      {calculateConcessionFare(plan.fare)}
                    </span>
                    <span className="text-[10px] text-[#52424d] mt-0.5">
                      Walk: {plan.walkingMins} mins
                    </span>
                  </div>
                </div>

                {/* Steps Preview Bar */}
                <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-[#e5eeff] overflow-x-auto">
                  {plan.steps.map((st, i) => (
                    <React.Fragment key={i}>
                      {i > 0 && <span className="text-gray-300 text-[10px]">›</span>}
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-bold flex items-center gap-1 whitespace-nowrap ${
                          st.type === 'bus'
                            ? 'bg-[#801d78] text-white'
                            : st.type === 'mrt'
                            ? 'bg-[#D42E12] text-white'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[12px]">
                          {st.type === 'bus'
                            ? 'directions_bus'
                            : st.type === 'mrt'
                            ? 'subway'
                            : 'directions_walk'}
                        </span>
                        {st.serviceNo ? `Bus ${st.serviceNo}` : `${st.durationMins}m`}
                        {st.liveArrival && (
                          <span className="ml-1 px-1 rounded bg-white/20 text-[9px]">
                            {st.liveArrival.etaDisplay}
                          </span>
                        )}
                      </span>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Detailed Itinerary Breakdown */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-5 shadow-sm border border-[#e5eeff] flex flex-col gap-4">
          {activePlan ? (
            <>
              <div className="flex items-start justify-between border-b border-[#e5eeff] pb-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#52424d] tracking-wider">
                    Trip Itinerary Breakdown
                  </span>
                  <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-lg text-[#0b1c30]">
                    {activePlan.title}
                  </h3>
                </div>
                <div className="text-right">
                  <div className="font-['Plus_Jakarta_Sans'] text-xl font-extrabold text-[#801d78]">
                    {activePlan.durationMins} mins
                  </div>
                  <div className="text-xs text-[#16A34A] font-semibold">
                    {calculateConcessionFare(activePlan.fare)}
                  </div>
                </div>
              </div>

              {/* Step Timeline */}
              <div className="space-y-4 pl-2">
                {activePlan.steps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3 relative">
                    {idx < activePlan.steps.length - 1 && (
                      <div className="absolute left-3.5 top-6 bottom-[-16px] w-0.5 bg-[#d6c1ce]"></div>
                    )}
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-white shrink-0 z-10 ${
                        step.type === 'bus'
                          ? 'bg-[#801d78]'
                          : step.type === 'mrt'
                          ? 'bg-[#D42E12]'
                          : 'bg-[#52424d]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[15px]">
                        {step.type === 'bus'
                          ? 'directions_bus'
                          : step.type === 'mrt'
                          ? 'subway'
                          : 'directions_walk'}
                      </span>
                    </div>
                    <div className="flex flex-col min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-['Inter'] text-xs sm:text-sm font-bold text-[#0b1c30]">
                          {step.instruction}
                        </span>
                        <span className="text-[10px] text-[#52424d] font-semibold">
                          {step.durationMins} mins
                        </span>
                      </div>
                      <p className="text-xs text-[#52424d] mt-0.5">{step.detail}</p>

                      {/* Live Telemetry Pill if bus step */}
                      {step.liveArrival && (
                        <div className="mt-2 p-2 rounded-xl bg-[#eff4ff] border border-[#dce9ff] flex items-center justify-between flex-wrap gap-2 text-xs">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-ping"></span>
                            <span className="font-bold text-[#0b1c30]">
                              Next Bus {step.serviceNo}: {step.liveArrival.etaDisplay}
                            </span>
                            <span className="text-[#52424d]">({step.liveArrival.subText})</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px]">
                            <span className="px-2 py-0.5 rounded bg-white text-[#16A34A] font-bold border border-[#dce9ff]">
                              {step.liveArrival.load}
                            </span>
                            <span className="px-1.5 py-0.5 rounded bg-white text-[#52424d] font-semibold border border-[#dce9ff]">
                              {step.liveArrival.type}
                            </span>
                          </div>
                        </div>
                      )}

                      {step.serviceNo && (
                        <div className="mt-2">
                          <button
                            onClick={() => onTrackBus(step.serviceNo!)}
                            className="px-3 py-1 rounded-lg bg-[#801d78]/10 text-[#801d78] hover:bg-[#801d78] hover:text-white font-['Inter'] text-xs font-bold transition-all inline-flex items-center gap-1"
                          >
                            <span className="material-symbols-outlined text-[14px]">radar</span>
                            Track Bus {step.serviceNo} Live
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="p-8 text-center text-[#52424d] text-sm">
              No itinerary plans found for the selected criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
