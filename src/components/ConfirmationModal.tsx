import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-[#05231c] border border-[#d9b56d]/30 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
        <div className="flex items-center gap-3 mb-4 text-[#d9b56d]">
          <AlertTriangle className="w-8 h-8 shrink-0" />
          <h3 className="text-xl font-serif">{title}</h3>
        </div>
        <p className="text-stone-300 text-sm mb-6 font-sans">{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg bg-stone-800 text-stone-200 hover:bg-stone-700 transition-colors text-sm font-bold"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-red-900 text-red-100 hover:bg-red-800 transition-colors text-sm font-bold"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
