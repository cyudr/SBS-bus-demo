import React, { useState, useCallback } from 'react';
import { BUS_STOPS, BusStop } from './data/transitData';
import { Header } from './components/Header';
import { Toast } from './components/Toast';
import { LiveArrivals } from './components/LiveArrivals';
import { RoutePlanner } from './components/RoutePlanner';
import { SavedRoutes } from './components/SavedRoutes';
import { Alerts } from './components/Alerts';
import { StopSelectorModal } from './components/StopSelectorModal';
import { AlarmModal } from './components/AlarmModal';
import { PreferencesModal } from './components/PreferencesModal';
import { Footer } from './components/Footer';

export default function App() {
  const [activeTab, setActiveTab] = useState<
    'live-arrivals' | 'route-planner' | 'saved-routes' | 'service-updates'
  >('live-arrivals');

  const [currentStopCode, setCurrentStopCode] = useState<string>('09023');
  const [activeServiceNo, setActiveServiceNo] = useState<string>('14');

  // Favorites state
  const [savedServices, setSavedServices] = useState<string[]>(['14', '65']);
  const [savedStops, setSavedStops] = useState<string[]>(['09023', '08031']);

  // Modals state
  const [isStopModalOpen, setIsStopModalOpen] = useState<boolean>(false);
  const [isAlarmModalOpen, setIsAlarmModalOpen] = useState<boolean>(false);
  const [isPrefModalOpen, setIsPrefModalOpen] = useState<boolean>(false);

  // Commuter preferences
  const [selectedLanguage, setSelectedLanguage] = useState<'EN' | 'CN' | 'MY' | 'TA'>('EN');
  const [concessionType, setConcessionType] = useState<string>('Adult');
  const [wheelchairOnly, setWheelchairOnly] = useState<boolean>(false);
  const [autoRefreshInterval, setAutoRefreshInterval] = useState<number>(18);
  const [activeAlarmMinutes, setActiveAlarmMinutes] = useState<number | null>(null);

  // Toast feedback state
  const [toast, setToast] = useState<{ message: string; icon: string; show: boolean }>({
    message: '',
    icon: 'check_circle',
    show: false,
  });

  const showToast = useCallback((message: string, icon = 'check_circle') => {
    setToast({ message, icon, show: true });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 2800);
  }, []);

  const currentStop: BusStop = BUS_STOPS[currentStopCode] || BUS_STOPS['09023'];
  const isBookmarked = savedServices.includes(activeServiceNo);

  const toggleBookmark = useCallback(() => {
    if (isBookmarked) {
      setSavedServices((prev) => prev.filter((s) => s !== activeServiceNo));
      showToast(`Removed Bus ${activeServiceNo} from saved favorites`, 'bookmark_remove');
    } else {
      setSavedServices((prev) => [...prev, activeServiceNo]);
      showToast(`Bus ${activeServiceNo} saved to favorites!`, 'star');
    }
  }, [isBookmarked, activeServiceNo, showToast]);

  const handleSetAlarm = useCallback((minutes: number, soundEnabled: boolean) => {
    setActiveAlarmMinutes(minutes);
    if (soundEnabled && typeof window !== 'undefined' && 'AudioContext' in window) {
      try {
        const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        osc.frequency.setValueAtTime(880, ctx.currentTime + 0.12); // A5
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
      } catch {
        // audio fallback
      }
    }
    showToast(
      `Push alarm active: We will alert you ${minutes} mins before Bus ${activeServiceNo} arrives!`,
      'notifications_active'
    );
  }, [activeServiceNo, showToast]);

  const handleCancelAlarm = useCallback(() => {
    setActiveAlarmMinutes(null);
    showToast(`Arrival alarm cancelled for Bus ${activeServiceNo}`, 'notifications_off');
  }, [activeServiceNo, showToast]);

  const handleSelectStop = useCallback((stop: BusStop) => {
    setCurrentStopCode(stop.code);
    if (stop.services.length > 0) {
      // Pick first service of this stop if current service isn't there
      const hasCurrent = stop.services.some((s) => s.serviceNo === activeServiceNo);
      if (!hasCurrent) {
        setActiveServiceNo(stop.services[0].serviceNo);
      }
    }
    showToast(`Current stop updated to ${stop.name} (${stop.code})`, 'near_me');
  }, [activeServiceNo, showToast]);

  const handleTrackBus = useCallback((serviceNo: string) => {
    setActiveServiceNo(serviceNo);
    setActiveTab('live-arrivals');
    showToast(`Now tracking SBS Bus ${serviceNo} live`, 'directions_bus');
  }, [showToast]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0b1c30]">
      {/* Toast Notification */}
      <Toast message={toast.message} icon={toast.icon} show={toast.show} />

      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentStopCode={currentStop.code}
        currentStopName={currentStop.name}
        savedCount={savedServices.length + savedStops.length}
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
        onOpenPreferences={() => setIsPrefModalOpen(true)}
        onOpenStopModal={() => setIsStopModalOpen(true)}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 pt-20 md:pt-20">
        {activeTab === 'live-arrivals' && (
          <LiveArrivals
            currentStop={currentStop}
            activeServiceNo={activeServiceNo}
            setActiveServiceNo={setActiveServiceNo}
            onOpenStopModal={() => setIsStopModalOpen(true)}
            onOpenAlarmModal={() => setIsAlarmModalOpen(true)}
            isBookmarked={isBookmarked}
            onToggleBookmark={toggleBookmark}
            showToast={showToast}
            selectedLanguage={selectedLanguage}
            activeAlarmMinutes={activeAlarmMinutes}
          />
        )}

        {activeTab === 'route-planner' && (
          <RoutePlanner
            onTrackBus={handleTrackBus}
            showToast={showToast}
            concessionType={concessionType}
          />
        )}

        {activeTab === 'saved-routes' && (
          <SavedRoutes
            savedServices={savedServices}
            savedStops={savedStops}
            onSelectService={(srv) => {
              setActiveServiceNo(srv);
              setActiveTab('live-arrivals');
            }}
            onSelectStop={(code) => {
              setCurrentStopCode(code);
              setActiveTab('live-arrivals');
            }}
            onRemoveService={(srv) => {
              setSavedServices((prev) => prev.filter((s) => s !== srv));
              showToast(`Removed Bus ${srv} from saved favorites`, 'bookmark_remove');
            }}
            onRemoveStop={(code) => {
              setSavedStops((prev) => prev.filter((c) => c !== code));
              showToast(`Removed stop from saved list`, 'bookmark_remove');
            }}
            showToast={showToast}
          />
        )}

        {activeTab === 'service-updates' && (
          <Alerts onTrackService={handleTrackBus} />
        )}
      </main>

      {/* Footer */}
      <Footer
        onViewStatusClick={() => setActiveTab('service-updates')}
        onOpenPreferences={() => setIsPrefModalOpen(true)}
      />

      {/* Stop Selector Modal */}
      <StopSelectorModal
        isOpen={isStopModalOpen}
        onClose={() => setIsStopModalOpen(false)}
        currentStopCode={currentStopCode}
        onSelectStop={handleSelectStop}
      />

      {/* Alarm Modal */}
      <AlarmModal
        isOpen={isAlarmModalOpen}
        onClose={() => setIsAlarmModalOpen(false)}
        serviceNo={activeServiceNo}
        stopName={currentStop.name}
        onSetAlarm={handleSetAlarm}
        activeAlarmMinutes={activeAlarmMinutes}
        onCancelAlarm={handleCancelAlarm}
      />

      {/* Preferences Modal */}
      <PreferencesModal
        isOpen={isPrefModalOpen}
        onClose={() => setIsPrefModalOpen(false)}
        concessionType={concessionType}
        setConcessionType={setConcessionType}
        wheelchairOnly={wheelchairOnly}
        setWheelchairOnly={setWheelchairOnly}
        autoRefreshInterval={autoRefreshInterval}
        setAutoRefreshInterval={setAutoRefreshInterval}
        onClearSaved={() => {
          setSavedServices([]);
          setSavedStops([]);
          showToast('Cleared all saved routes and stops', 'delete');
        }}
      />
    </div>
  );
}
