import React, { useState, useEffect, useCallback } from 'react';
import { SERVICE_ALERTS, ServiceAlert } from '../data/transitData';
import {
  checkApiHealth,
  fetchTrafficIncidents,
  fetchTrainAlerts,
  fetchCarparkAvailability,
  LtaTrafficIncidentItem,
  LtaTrainAlertData,
  LtaCarparkLot,
  LtaApiHealthResponse,
} from '@/api/_client';

interface AlertsProps {
  onTrackService?: (serviceNo: string) => void;
}

export const Alerts: React.FC<AlertsProps> = ({ onTrackService }) => {
  const [activeTab, setActiveTab] = useState<'train' | 'traffic' | 'carpark' | 'bus'>('train');
  const [trafficIncidents, setTrafficIncidents] = useState<LtaTrafficIncidentItem[]>([]);
  const [trainAlerts, setTrainAlerts] = useState<LtaTrainAlertData | null>(null);
  const [carparks, setCarparks] = useState<LtaCarparkLot[]>([]);
  const [carparkAreaFilter, setCarparkAreaFilter] = useState<string>('All');
  const [carparkLotType, setCarparkLotType] = useState<'All' | 'C' | 'Y' | 'H'>('All');
  const [carparkAgency, setCarparkAgency] = useState<'All' | 'LTA' | 'HDB' | 'URA'>('All');
  const [isLiveTraffic, setIsLiveTraffic] = useState<boolean>(false);
  const [isLiveTrain, setIsLiveTrain] = useState<boolean>(false);
  const [isLiveCarparks, setIsLiveCarparks] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasApiKey, setHasApiKey] = useState<boolean>(false);
  const [healthInfo, setHealthInfo] = useState<LtaApiHealthResponse | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<string>('Just now');
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'Trunk' | 'Diversion' | 'Downtown Line' | 'General'>('All');

  const fetchLtaData = useCallback(async () => {
    setIsLoading(true);
    try {
      // 1. Connection check via api/healthApi
      try {
        const health = await checkApiHealth();
        setHasApiKey(health.apiKeyConfigured === true);
        setHealthInfo(health);
      } catch (e) {
        console.warn('API health check error:', e);
      }

      // 2. Fetch Traffic Incidents via api/trafficApi
      try {
        const traffic = await fetchTrafficIncidents();
        setTrafficIncidents(traffic.value || []);
        setIsLiveTraffic(traffic.isLive === true);
      } catch (e) {
        console.warn('API traffic incidents error:', e);
      }

      // 3. Fetch Train Service Alerts via api/trainApi
      try {
        const train = await fetchTrainAlerts();
        setTrainAlerts(train.value || null);
        setIsLiveTrain(train.isLive === true);
      } catch (e) {
        console.warn('API train alerts error:', e);
      }

      // 4. Fetch Carpark Availability via api/carparkApi
      try {
        const cp = await fetchCarparkAvailability();
        setCarparks(cp.value || []);
        setIsLiveCarparks(cp.isLive === true);
      } catch (e) {
        console.warn('API carpark availability error:', e);
      }

      setLastRefreshed(new Date().toLocaleTimeString('en-SG', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }) + ' SGT');
    } catch (err) {
      console.error('Error fetching LTA DataMall alerts:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLtaData();
  }, [fetchLtaData]);

  const filteredBusAlerts = selectedFilter === 'All'
    ? SERVICE_ALERTS
    : SERVICE_ALERTS.filter((a) => a.category === selectedFilter);

  return (
    <div className="max-w-[1024px] w-full mx-auto px-4 md:px-8 py-6 flex flex-col gap-6">
      {/* Top Advisory Banner with DataMall Source Status */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#e5eeff] flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[24px]">verified</span>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-['Plus_Jakarta_Sans'] font-bold text-lg text-[#0b1c30]">
                  Transit & Network Operations Center
                </h2>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                  healthInfo?.ltaDataMallConnected
                    ? 'bg-[#DCFCE7] text-[#16A34A]'
                    : hasApiKey
                    ? 'bg-[#eff4ff] text-[#801d78]'
                    : 'bg-[#e5eeff] text-[#62005c]'
                }`}>
                  {healthInfo?.ltaDataMallConnected
                    ? 'LTA DataMall: Live Telemetry Active'
                    : hasApiKey
                    ? 'LTA DataMall: Key Configured'
                    : 'LTA DataMall: High-Fidelity Sandbox'}
                </span>
              </div>
              <p className="text-xs text-[#52424d] mt-0.5">
                Live telemetry via Land Transport Authority (LTA) TrafficIncidents & TrainServiceAlerts feeds
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={fetchLtaData}
              disabled={isLoading}
              className="px-3.5 py-1.5 rounded-xl bg-[#eff4ff] hover:bg-[#801d78] hover:text-white text-[#801d78] font-['Inter'] text-xs font-bold transition-all flex items-center gap-1.5 border border-[#dce9ff]"
            >
              <span className={`material-symbols-outlined text-[16px] ${isLoading ? 'animate-spin' : ''}`}>
                refresh
              </span>
              <span>{isLoading ? 'Updating...' : 'Check API Connection'}</span>
            </button>
          </div>
        </div>

        {/* API Health & Header Diagnostic Metadata */}
        <div className="pt-2 border-t border-[#e5eeff] flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#52424d]">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-[#0b1c30]">Health Check:</span>
            <span className="font-mono bg-[#eff4ff] px-2 py-0.5 rounded text-[10px] text-[#801d78]">
              GET /api/health
            </span>
            <span className="text-[#52424d]">|</span>
            <span className="font-mono bg-[#eff4ff] px-2 py-0.5 rounded text-[10px] text-[#16A34A] font-bold">
              AccountKey: LTA_DATAMALL_API_KEY
            </span>
          </div>
          <span className="text-[10px] text-[#52424d]">
            {healthInfo?.ltaStatusMessage || 'Health verified'} • Refreshed: {lastRefreshed}
          </span>
        </div>
      </div>

      {/* Main Alert Category Navigation Tabs */}
      <div className="flex items-center gap-2 bg-[#eff4ff] p-1.5 rounded-2xl border border-[#dce9ff] overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('train')}
          className={`flex-1 min-w-[180px] py-2.5 px-4 rounded-xl font-['Inter'] text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'train'
              ? 'bg-[#801d78] text-white shadow-sm'
              : 'text-[#52424d] hover:text-[#0b1c30] hover:bg-white/60'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">subway</span>
          <span>Train Status (MRT/LRT)</span>
          {isLiveTrain && <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-ping"></span>}
        </button>

        <button
          onClick={() => setActiveTab('traffic')}
          className={`flex-1 min-w-[180px] py-2.5 px-4 rounded-xl font-['Inter'] text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'traffic'
              ? 'bg-[#801d78] text-white shadow-sm'
              : 'text-[#52424d] hover:text-[#0b1c30] hover:bg-white/60'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">traffic</span>
          <span>Traffic Incidents & Roads</span>
          {trafficIncidents.length > 0 && (
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
              activeTab === 'traffic' ? 'bg-white text-[#801d78]' : 'bg-[#801d78] text-white'
            }`}>
              {trafficIncidents.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('carpark')}
          className={`flex-1 min-w-[180px] py-2.5 px-4 rounded-xl font-['Inter'] text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'carpark'
              ? 'bg-[#801d78] text-white shadow-sm'
              : 'text-[#52424d] hover:text-[#0b1c30] hover:bg-white/60'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">local_parking</span>
          <span>Live Carparks (HDB+LTA)</span>
          {carparks.length > 0 && (
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
              activeTab === 'carpark' ? 'bg-white text-[#801d78]' : 'bg-[#801d78] text-white'
            }`}>
              {carparks.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('bus')}
          className={`flex-1 min-w-[180px] py-2.5 px-4 rounded-xl font-['Inter'] text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'bus'
              ? 'bg-[#801d78] text-white shadow-sm'
              : 'text-[#52424d] hover:text-[#0b1c30] hover:bg-white/60'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">directions_bus</span>
          <span>SBS Bus Advisories</span>
        </button>
      </div>

      {/* Tab 1: Train Service Alerts (MRT/LRT Status) */}
      {activeTab === 'train' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#e5eeff]">
            <div className="flex items-center justify-between pb-3 border-b border-[#e5eeff]">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#16A34A] animate-pulse"></span>
                <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-base text-[#0b1c30]">
                  Singapore Rail Network Status (LTA TrainServiceAlerts)
                </h3>
              </div>
              <span className="text-[10px] text-[#52424d]">
                Updated: {lastRefreshed}
              </span>
            </div>

            {/* Overall Status Banner (Annex C Specification) */}
            {trainAlerts?.Status === 2 || (trainAlerts?.AffectedSegments && trainAlerts.AffectedSegments.length > 0) ? (
              <div className="mt-4 p-4 rounded-xl bg-[#FEE2E2] border border-[#fca5a5] flex flex-col gap-3">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-[#DC2626] text-[24px] shrink-0 mt-0.5 animate-pulse">
                    error
                  </span>
                  <div>
                    <div className="font-['Plus_Jakarta_Sans'] font-bold text-sm text-[#991B1B]">
                      Train Disruption in Progress (LTA Contingency Mode Active)
                    </div>
                    {trainAlerts?.Message && trainAlerts.Message.length > 0 && (
                      <p className="text-xs text-[#991B1B] mt-1 leading-relaxed">
                        {trainAlerts.Message[0].Content}
                      </p>
                    )}
                  </div>
                </div>

                {/* Affected Segments per Annex C */}
                {trainAlerts?.AffectedSegments && trainAlerts.AffectedSegments.length > 0 && (
                  <div className="mt-2 space-y-2 border-t border-[#f87171]/30 pt-2">
                    <span className="font-['Inter'] text-[11px] font-bold text-[#991B1B] uppercase tracking-wider">
                      Affected Segments & Bridging Bus
                    </span>
                    {trainAlerts.AffectedSegments.map((seg, idx) => (
                      <div key={idx} className="bg-white/80 rounded-lg p-2.5 text-xs text-[#0b1c30] space-y-1">
                        <div className="flex items-center gap-2 font-bold text-[#801d78]">
                          <span className="bg-[#801d78] text-white px-1.5 py-0.5 rounded text-[10px]">
                            {seg.Line}
                          </span>
                          <span>Direction: {seg.Direction}</span>
                        </div>
                        <div>
                          <span className="font-semibold text-[#52424d]">Affected Stations: </span>
                          <span className="font-mono text-[#DC2626] font-bold">{seg.Stations}</span>
                        </div>
                        {seg.FreePublicBus && (
                          <div className="text-[11px] text-[#166534] font-medium bg-[#DCFCE7] px-2 py-0.5 rounded">
                            🚌 Free Regular Bus Boarding: {seg.FreePublicBus}
                          </div>
                        )}
                        {seg.FreeMRTShuttle && (
                          <div className="text-[11px] text-[#1E40AF] font-medium bg-[#DBEAFE] px-2 py-0.5 rounded">
                            🚆 Free MRT Shuttle ({seg.MRTShuttleDirection || seg.Direction}): {seg.FreeMRTShuttle}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="mt-4 p-4 rounded-xl bg-[#DCFCE7] border border-[#bbf7d0] flex items-start gap-3">
                <span className="material-symbols-outlined text-[#16A34A] text-[22px] shrink-0 mt-0.5">
                  check_circle
                </span>
                <div>
                  <div className="font-['Plus_Jakarta_Sans'] font-bold text-sm text-[#166534]">
                    Regular Train Service Across All Lines
                  </div>
                  <p className="text-xs text-[#166534] mt-0.5">
                    {trainAlerts?.Message && trainAlerts.Message.length > 0
                      ? trainAlerts.Message[0].Content
                      : 'All SBS Transit Downtown Line (DTL), North East Line (NEL), and SMRT lines operating without delay.'}
                  </p>
                </div>
              </div>
            )}

            {/* Individual MRT Lines Matrix */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {(trainAlerts?.LinesStatus || [
                { line: 'North South Line (NSL)', code: 'NS', status: 'Normal', headway: '2-4 mins' },
                { line: 'East West Line (EWL)', code: 'EW', status: 'Normal', headway: '2-4 mins' },
                { line: 'North East Line (NEL)', code: 'NE', status: 'Normal', headway: '3-5 mins' },
                { line: 'Circle Line (CCL)', code: 'CC', status: 'Normal', headway: '4-6 mins' },
                { line: 'Downtown Line (DTL)', code: 'DT', status: 'Normal', headway: '3-4 mins' },
                { line: 'Thomson-East Coast Line (TEL)', code: 'TE', status: 'Normal', headway: '4-5 mins' },
              ]).map((l) => (
                <div
                  key={l.code}
                  className="p-3 rounded-xl bg-[#eff4ff] border border-[#dce9ff] flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`w-7 h-7 rounded-lg text-white font-bold text-xs flex items-center justify-center shrink-0 ${
                        l.code === 'NS' ? 'bg-[#D42E12]' :
                        l.code === 'EW' ? 'bg-[#009640]' :
                        l.code === 'NE' ? 'bg-[#9016B2]' :
                        l.code === 'CC' ? 'bg-[#FA9E0D]' :
                        l.code === 'DT' ? 'bg-[#005EC4]' : 'bg-[#9D5B25]'
                      }`}
                    >
                      {l.code}
                    </span>
                    <div>
                      <div className="font-['Plus_Jakarta_Sans'] font-bold text-xs text-[#0b1c30]">
                        {l.line}
                      </div>
                      <div className="text-[10px] text-[#52424d]">
                        Headway: {l.headway}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#DCFCE7] text-[#16A34A] font-bold">
                    {l.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Traffic Incidents & Road Closures */}
      {activeTab === 'traffic' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-['Plus_Jakarta_Sans'] font-bold text-sm text-[#0b1c30]">
              LTA Live Road Incidents & Diversions ({trafficIncidents.length})
            </span>
            <span className="text-[10px] text-[#52424d]">
              Source: https://datamall2.mytransport.sg/ltaodataservice/TrafficIncidents
            </span>
          </div>

          {trafficIncidents.length === 0 ? (
            <div className="p-8 bg-white rounded-2xl border border-dashed border-[#e5eeff] text-center text-sm text-[#52424d]">
              No active traffic incidents reported at this time. All major expressway and arterial corridors clear.
            </div>
          ) : (
            trafficIncidents.map((incident, idx) => {
              const isAccident = incident.Type.toLowerCase().includes('accident');
              const isRoadwork = incident.Type.toLowerCase().includes('roadwork');
              const isHeavy = incident.Type.toLowerCase().includes('heavy');

              const icon = isAccident ? 'car_crash' : isRoadwork ? 'construction' : isHeavy ? 'traffic' : 'warning';
              const badgeBg = isAccident
                ? 'bg-[#FEE2E2] text-[#DC2626]'
                : isRoadwork
                ? 'bg-[#FEF3C7] text-[#D97706]'
                : 'bg-[#eff4ff] text-[#801d78]';

              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-[#e5eeff] flex items-start gap-3.5 hover:shadow-md transition-all"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${badgeBg}`}>
                    <span className="material-symbols-outlined text-[20px]">{icon}</span>
                  </div>

                  <div className="flex flex-col min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${badgeBg}`}>
                          {incident.Type}
                        </span>
                        {incident.Location && (
                          <span className="font-['Plus_Jakarta_Sans'] font-bold text-xs text-[#0b1c30]">
                            {incident.Location}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-[#52424d]">
                        {incident.Updated || 'Live Feed'}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-[#0b1c30] mt-1 leading-relaxed">
                      {incident.Message}
                    </p>

                    {incident.Latitude && incident.Longitude && (
                      <div className="flex items-center gap-3 mt-2 pt-2 border-t border-[#e5eeff] text-[10px] text-[#52424d]">
                        <span className="font-mono">
                          GPS: {incident.Latitude.toFixed(4)}, {incident.Longitude.toFixed(4)}
                        </span>
                        <span>•</span>
                        <a
                          href={`https://maps.google.com/?q=${incident.Latitude},${incident.Longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#801d78] hover:underline font-semibold flex items-center gap-0.5"
                        >
                          View Map Pin
                          <span className="material-symbols-outlined text-[11px]">open_in_new</span>
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Tab: Live Carpark Lots (HDB + LTA + URA) */}
      {activeTab === 'carpark' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="font-['Plus_Jakarta_Sans'] font-bold text-sm text-[#0b1c30]">
                Live Carpark Lots ({carparks.length} Hubs Monitored)
              </span>
              <p className="text-xs text-[#52424d]">
                Source: https://datamall2.mytransport.sg/ltaodataservice/CarParkAvailabilityv2
              </p>
            </div>

            {/* Multi-attribute Filters: Area, Lot Type, Agency (Section 2.12, Page 34) */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Quick Area Filters */}
              <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
                {(['All', 'Orchard', 'Somerset', 'Dhoby Ghaut', 'Bedok', 'Clementi'] as const).map((area) => (
                  <button
                    key={area}
                    onClick={() => setCarparkAreaFilter(area)}
                    className={`px-2.5 py-1 rounded-full font-['Inter'] text-[11px] font-bold transition-all shrink-0 ${
                      carparkAreaFilter === area
                        ? 'bg-[#801d78] text-white shadow-xs'
                        : 'bg-[#eff4ff] text-[#0b1c30] hover:bg-[#e5eeff]'
                    }`}
                  >
                    {area}
                  </button>
                ))}
              </div>

              {/* Lot Type Filter */}
              <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-[#e5eeff] text-[11px]">
                <span className="text-[#52424d] font-bold px-1.5">Type:</span>
                {[
                  { id: 'All', label: 'All' },
                  { id: 'C', label: 'Cars' },
                  { id: 'Y', label: 'Motorcycles' },
                  { id: 'H', label: 'Heavy' },
                ].map((lt) => (
                  <button
                    key={lt.id}
                    onClick={() => setCarparkLotType(lt.id as any)}
                    className={`px-2 py-0.5 rounded font-bold transition-all ${
                      carparkLotType === lt.id
                        ? 'bg-[#801d78] text-white'
                        : 'text-[#52424d] hover:text-[#0b1c30]'
                    }`}
                  >
                    {lt.label}
                  </button>
                ))}
              </div>

              {/* Agency Filter */}
              <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-[#e5eeff] text-[11px]">
                <span className="text-[#52424d] font-bold px-1.5">Agency:</span>
                {(['All', 'LTA', 'HDB', 'URA'] as const).map((ag) => (
                  <button
                    key={ag}
                    onClick={() => setCarparkAgency(ag)}
                    className={`px-2 py-0.5 rounded font-bold transition-all ${
                      carparkAgency === ag
                        ? 'bg-[#801d78] text-white'
                        : 'text-[#52424d] hover:text-[#0b1c30]'
                    }`}
                  >
                    {ag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {carparks
              .filter((cp) => {
                const matchesArea =
                  carparkAreaFilter === 'All' ||
                  cp.Area?.toLowerCase().includes(carparkAreaFilter.toLowerCase()) ||
                  cp.Development.toLowerCase().includes(carparkAreaFilter.toLowerCase());
                const matchesType =
                  carparkLotType === 'All' || cp.LotType === carparkLotType;
                const matchesAgency =
                  carparkAgency === 'All' || cp.Agency === carparkAgency;
                return matchesArea && matchesType && matchesAgency;
              })
              .map((cp) => {
                const lots = cp.AvailableLots ?? 0;
                const lotColor = lots > 150 ? 'text-[#16A34A]' : lots > 50 ? 'text-[#D97706]' : 'text-[#DC2626]';
                const lotBg = lots > 150 ? 'bg-[#DCFCE7]' : lots > 50 ? 'bg-[#FEF3C7]' : 'bg-[#FEE2E2]';
                const vehicleIcon =
                  cp.LotType === 'Y'
                    ? 'two_wheeler'
                    : cp.LotType === 'H'
                    ? 'local_shipping'
                    : 'directions_car';
                const typeLabel =
                  cp.LotType === 'Y' ? 'Motorcycle' : cp.LotType === 'H' ? 'Heavy Vehicle' : 'Car';

                return (
                  <div
                    key={cp.CarParkID}
                    className="bg-white rounded-2xl p-4 shadow-sm border border-[#e5eeff] flex items-center justify-between hover:shadow-md transition-all"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-[#eff4ff] text-[#801d78] flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[20px]">{vehicleIcon}</span>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-['Plus_Jakarta_Sans'] font-bold text-sm text-[#0b1c30] truncate">
                            {cp.Development}
                          </span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded font-bold bg-[#eff4ff] text-[#801d78] uppercase">
                            {cp.Agency || 'LTA'}
                          </span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded font-bold bg-slate-100 text-slate-700">
                            {typeLabel}
                          </span>
                        </div>
                        <span className="text-xs text-[#52424d] truncate mt-0.5">
                          {cp.Area ? `Area: ${cp.Area} • ` : ''}ID: {cp.CarParkID}
                        </span>
                        {cp.Location && (
                          <a
                            href={`https://maps.google.com/?q=${cp.Location.replace(' ', ',')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] text-[#801d78] hover:underline font-semibold flex items-center gap-0.5 mt-1"
                          >
                            <span>Navigate via GPS ({cp.Location})</span>
                            <span className="material-symbols-outlined text-[11px]">open_in_new</span>
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-end shrink-0 pl-3">
                      <div className={`px-2.5 py-1 rounded-xl font-['Plus_Jakarta_Sans'] font-extrabold text-base ${lotBg} ${lotColor} tabular-nums`}>
                        {lots}
                      </div>
                      <span className="text-[10px] text-[#52424d] mt-0.5 font-medium">
                        Lots Available
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Tab 3: SBS Transit Route Advisories */}
      {activeTab === 'bus' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-['Plus_Jakarta_Sans'] font-bold text-sm text-[#0b1c30]">
              SBS Transit Service Bulletins
            </span>
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
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

          <div className="space-y-3">
            {filteredBusAlerts.map((alert) => {
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
      )}
    </div>
  );
};
