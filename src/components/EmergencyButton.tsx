import { AlertTriangle } from 'lucide-react';

interface EmergencyButtonProps {
  onClick: () => void;
  position?: 'fixed' | 'relative';
}

export function EmergencyButton({ onClick, position = 'fixed' }: EmergencyButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`${position === 'fixed' ? 'fixed bottom-6 right-6' : ''} bg-red-500 hover:bg-red-600 text-white rounded-2xl px-8 py-6 shadow-2xl transition-all hover:scale-105 flex items-center gap-3 z-50`}
      aria-label="緊急求助"
    >
      <AlertTriangle className="w-8 h-8" />
      <span>緊急求助</span>
    </button>
  );
}
