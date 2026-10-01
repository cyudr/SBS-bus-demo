import React, { useState } from 'react';

interface AlarmModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceNo: string;
  stopName: string;
  onSetAlarm: (minutes: number, soundEnabled: boolean) => void;
  activeAlarmMinutes: number | null;
  onCancelAlarm: () => void;
}

export const AlarmModal: React.FC<AlarmModalProps> = ({
  isOpen,
  onClose,
  serviceNo,
  stopName,
  onSetAlarm,
  activeAlarmMinutes,
  onCancelAlarm,
}) => {
  const [selectedMinutes, setSelectedMinutes] = useState<number>(activeAlarmMinutes || 2);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-[#e5eeff]">
        {/* Header */}
        <div className="p-5 border-b border-[#e5eeff] flex items-center justify-between bg-[#eff4ff]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#801d78]/10 text-[#801d78] flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">alarm</span>
            </div>
            <div>
              <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-base text-[#0b1c30]">
                Bus Arrival Reminder
              </h3>
              <p className="text-xs text-[#52424d]">
                Service {serviceNo} at {stopName}
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

        {/* Content */}
        <div className="p-5 space-y-4">
          <p className="text-sm text-[#0b1c30]">
            Receive an alert before SBS Bus <strong>{serviceNo}</strong> pulls into the stop, allowing you sufficient walking time:
          </p>

          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 5].map((mins) => (
              <button
                key={mins}
                onClick={() => setSelectedMinutes(mins)}
                className={`py-3 px-2 rounded-xl text-center font-bold text-sm transition-all border ${
                  selectedMinutes === mins
                    ? 'bg-[#801d78] text-white border-[#801d78] shadow-sm'
                    : 'bg-[#eff4ff] text-[#0b1c30] border-[#dce9ff] hover:bg-[#e5eeff]'
                }`}
              >
                <div>{mins} min</div>
                <div className={`text-[10px] font-normal ${selectedMinutes === mins ? 'text-white/80' : 'text-[#52424d]'}`}>
                  {mins === 1 ? 'Quick sprint' : mins === 2 ? 'Recommended' : 'Relaxed walk'}
                </div>
              </button>
            ))}
          </div>

          <label className="flex items-center justify-between p-3 rounded-xl bg-[#f8fafc] border border-[#e5eeff] cursor-pointer">
            <span className="text-xs font-semibold text-[#0b1c30] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px] text-[#801d78]">volume_up</span>
              Audible Chime Alert
            </span>
            <input
              type="checkbox"
              checked={soundEnabled}
              onChange={(e) => setSoundEnabled(e.target.checked)}
              className="w-4 h-4 text-[#801d78] rounded focus:ring-[#801d78]"
            />
          </label>

          {activeAlarmMinutes !== null && (
            <div className="p-3 bg-[#DCFCE7] text-[#16A34A] rounded-xl text-xs flex items-center justify-between font-semibold">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">notifications_active</span>
                Alarm currently active ({activeAlarmMinutes}m before arrival)
              </span>
              <button
                onClick={() => {
                  onCancelAlarm();
                  onClose();
                }}
                className="underline hover:opacity-80"
              >
                Disable
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#f8fafc] border-t border-[#e5eeff] flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-semibold text-[#52424d] hover:bg-[#e5eeff] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSetAlarm(selectedMinutes, soundEnabled);
              onClose();
            }}
            className="px-5 py-2 rounded-xl text-sm font-bold bg-[#801d78] text-white hover:bg-[#6a1b78] shadow-sm transition-all"
          >
            Set Reminder
          </button>
        </div>
      </div>
    </div>
  );
};
