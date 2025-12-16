import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';

export function ResetProgress({ onResetAll, filter }) {
    const [confirmReset, setConfirmReset] = useState(false);

    return (
        <div className="space-y-3">
            <h3 className="text-sm uppercase tracking-wider text-slate-500 font-semibold mb-2">Správa dat</h3>
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700 hover:border-slate-600 transition-colors">
                <div className="flex justify-between items-center gap-4">
                    <div>
                        <h4 className="font-medium text-slate-200 mb-1">Resetovat průběh</h4>
                        <p className="text-sm text-slate-400">
                            {filter === 'all'
                                ? "Vymaže kompletně celou historii odpovědí."
                                : "Vymaže historii pouze pro aktuálně vyfiltrované otázky."}
                        </p>
                    </div>

                    {confirmReset ? (
                        <div className="flex flex-col gap-2 min-w-[100px]">
                            <button
                                className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-md transition-colors flex items-center justify-center gap-2"
                                onClick={() => {
                                    onResetAll();
                                    setConfirmReset(false);
                                }}
                            >
                                <Trash2 size={14} />
                                Potvrdit
                            </button>
                            <button
                                className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm font-medium rounded-md transition-colors"
                                onClick={() => setConfirmReset(false)}
                            >
                                Zrušit
                            </button>
                        </div>
                    ) : (
                        <button
                            className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                            onClick={() => setConfirmReset(true)}
                            title="Resetovat průběh"
                        >
                            <Trash2 size={20} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
