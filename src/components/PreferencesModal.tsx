import React from 'react';

interface PreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  concessionType: string;
  setConcessionType: (val: string) => void;
  wheelchairOnly: boolean;
  setWheelchairOnly: (val: boolean) => void;
  autoRefreshInterval: number;
  setAutoRefreshInterval: (val: number) => void;
  onClearSaved: () => void;
}

export const PreferencesModal: React.FC<PreferencesModalProps> = ({
  isOpen,
  onClose,
  concessionType,
  setConcessionType,
  wheelchairOnly,
  setWheelchairOnly,
  autoRefreshInterval,
  setAutoRefreshInterval,
  onClearSaved,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-[#e5eeff]">
        {/* Header */}
        <div className="p-5 border-b border-[#e5eeff] flex items-center justify-between bg-[#eff4ff]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#62005c] text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">tune</span>
            </div>
            <div>
              <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-base text-[#0b1c30]">
                Commuter Preferences
              </h3>
              <p className="text-xs text-[#52424d]">
                Fares, accessibility & telemetry settings
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

        {/* Body */}
        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Concession Fare Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#52424d]">
              Concession Fare Category
            </label>
            <select
              value={concessionType}
              onChange={(e) => setConcessionType(e.target.value)}
              className="w-full h-11 px-3 rounded-xl bg-[#eff4ff] text-sm text-[#0b1c30] border border-[#dce9ff] focus:outline-none focus:ring-2 focus:ring-[#801d78]/30"
            >
              <option value="Adult">Adult (Standard CEPAS / SimplyGo)</option>
              <option value="Student">Primary / Secondary / Tertiary Student</option>
              <option value="Senior">Senior Citizen Concession (60+ yrs)</option>
              <option value="Workfare">Workfare Transport Concession (WTCS)</option>
              <option value="Disabilities">Persons with Disabilities (PWD)</option>
            </select>
          </div>

          {/* Wheelchair Accessible Filter */}
          <div className="p-3.5 rounded-xl bg-[#eff4ff] border border-[#dce9ff] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[#0284C7] text-[22px]">accessible</span>
              <div>
                <div className="text-xs font-bold text-[#0b1c30]">Wheelchair Priority Mode</div>
                <div className="text-[11px] text-[#52424d]">Highlight WAB low-floor ramp deployments</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={wheelchairOnly}
              onChange={(e) => setWheelchairOnly(e.target.checked)}
              className="w-4 h-4 text-[#0284C7] rounded focus:ring-[#0284C7]"
            />
          </div>

          {/* Telemetry Refresh Rate */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#52424d]">
              Live GPS Telemetry Polling Rate
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[15, 30, 60].map((sec) => (
                <button
                  key={sec}
                  onClick={() => setAutoRefreshInterval(sec)}
                  className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                    autoRefreshInterval === sec
                      ? 'bg-[#801d78] text-white border-[#801d78]'
                      : 'bg-[#eff4ff] text-[#0b1c30] border-[#dce9ff] hover:bg-[#e5eeff]'
                  }`}
                >
                  {sec}s interval
                </button>
              ))}
            </div>
          </div>

          {/* Reset Saved Items */}
          <div className="pt-2 border-t border-[#e5eeff]">
            <button
              onClick={() => {
                if (window.confirm('Clear all saved bus services and stops?')) {
                  onClearSaved();
                }
              }}
              className="w-full py-2.5 px-3 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">delete_sweep</span>
              Reset Saved Routes & Stops
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#f8fafc] border-t border-[#e5eeff] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-sm font-bold bg-[#62005c] text-white hover:bg-[#801d78] transition-all"
          >
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
};
