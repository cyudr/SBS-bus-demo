import React from 'react';

interface ToastProps {
  message: string;
  icon?: string;
  show: boolean;
}

export const Toast: React.FC<ToastProps> = ({ message, icon = 'check_circle', show }) => {
  return (
    <div
      className={`fixed bottom-6 right-6 z-50 transition-all duration-300 pointer-events-none flex items-center gap-2 px-4 py-3 rounded-xl bg-[#213145] text-[#eaf1ff] shadow-2xl ${
        show ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-12 opacity-0 scale-95'
      }`}
      role="alert"
      aria-live="polite"
    >
      <span className="material-symbols-outlined text-[20px] text-[#16A34A]">{icon}</span>
      <span className="font-medium text-xs sm:text-sm font-['Inter']">{message}</span>
    </div>
  );
};
