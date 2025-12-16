import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { ResetProgress } from './settings/ResetProgress';
import { SyncProgress } from './settings/SyncProgress';

export function SettingsModal({ isOpen, onClose, onResetAll, filter, progress, onImportProgress }) {
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            window.addEventListener('keydown', handleEsc);
        }
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div
                className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-slate-800/50 shrink-0">
                    <h2 className="text-xl font-bold text-slate-100">Nastavení</h2>
                    <button
                        onClick={onClose}
                        className="p-1 text-slate-400 hover:text-slate-100 hover:bg-white/10 rounded-lg transition-colors"
                        title="Zavřít"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar">
                    <SyncProgress
                        progress={progress}
                        onImportProgress={onImportProgress}
                    />

                    <ResetProgress
                        onResetAll={onResetAll}
                        filter={filter}
                    />

                    {/* App Info */}
                    <div className="pt-4 border-t border-slate-700/50">
                        <div className="text-center">
                            <p className="text-xs text-slate-500">
                                Autoškola eTesty &bull; Verze 1.1
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
