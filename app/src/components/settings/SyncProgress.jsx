import React, { useState } from 'react';
import { Copy, Download, Upload, Check } from 'lucide-react';

export function SyncProgress({ progress, onImportProgress }) {
    const [importCode, setImportCode] = useState('');
    const [showImportOptions, setShowImportOptions] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);
    const [importError, setImportError] = useState('');

    const handleCopyCode = () => {
        try {
            const code = btoa(JSON.stringify(progress));
            navigator.clipboard.writeText(code);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        } catch {
            console.error('Failed to generate code');
        }
    };

    const handleReadCode = () => {
        setImportError('');
        try {
            const decoded = atob(importCode);
            const json = JSON.parse(decoded);

            // Basic validation
            if (typeof json !== 'object' || json === null) {
                throw new Error('Invalid format');
            }

            setShowImportOptions(true);
        } catch {
            setImportError('Neplatný kód. Zkontrolujte prosím zadaný řetězec.');
            setShowImportOptions(false);
        }
    };

    const executeImport = (mode) => {
        try {
            const decoded = atob(importCode);
            const json = JSON.parse(decoded);
            onImportProgress(json, mode);
            setImportCode('');
            setShowImportOptions(false);
            setImportError('');
            // Maybe show success toast?
        } catch {
            setImportError('Chyba při importu.');
        }
    };

    return (
        <div className="space-y-4">
            <h3 className="text-sm uppercase tracking-wider text-slate-500 font-semibold mb-2">Synchronizace</h3>

            {/* Export Section */}
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700 hover:border-slate-600 transition-colors">
                <div className="flex justify-between items-center gap-4">
                    <div>
                        <h4 className="font-medium text-slate-200 mb-1">Exportovat průběh</h4>
                        <p className="text-sm text-slate-400">
                            Vygeneruje kód pro přenos postupu na jiné zařízení.
                        </p>
                    </div>
                    <button
                        className={`px-3 py-1.5 ${copySuccess ? 'bg-green-500/20 text-green-500' : 'bg-blue-500 hover:bg-blue-600 text-white'} text-sm font-medium rounded-md transition-colors flex items-center gap-2 min-w-[140px] justify-center`}
                        onClick={handleCopyCode}
                    >
                        {copySuccess ? <Check size={16} /> : <Copy size={16} />}
                        {copySuccess ? 'Zkopírováno' : 'Kopírovat kód'}
                    </button>
                </div>
            </div>

            {/* Import Section */}
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700 hover:border-slate-600 transition-colors">
                <div className="space-y-4">
                    <div>
                        <h4 className="font-medium text-slate-200 mb-1">Importovat průběh</h4>
                        <p className="text-sm text-slate-400 mb-3">
                            Vložte kód vygenerovaný na jiném zařízení.
                        </p>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={importCode}
                                onChange={(e) => {
                                    setImportCode(e.target.value);
                                    setShowImportOptions(false);
                                    setImportError('');
                                }}
                                placeholder="Vložte kód sem..."
                                className="flex-1 bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                            />
                            <button
                                className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm font-medium rounded-md transition-colors whitespace-nowrap"
                                onClick={handleReadCode}
                                disabled={!importCode}
                            >
                                Načíst
                            </button>
                        </div>
                        {importError && (
                            <p className="text-red-500 text-xs mt-2">{importError}</p>
                        )}
                    </div>

                    {showImportOptions && (
                        <div className="bg-slate-900/50 rounded-md p-3 border border-slate-700/50 animate-in fade-in slide-in-from-top-2 duration-200">
                            <p className="text-sm text-slate-300 mb-3">
                                Kód je platný. Jak chcete postupovat?
                            </p>
                            <div className="flex gap-3">
                                <button
                                    className="flex-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-xs md:text-sm font-medium rounded-md transition-colors flex items-center justify-center gap-2"
                                    onClick={() => executeImport('merge')}
                                    title="Doplní pouze chybějící odpovědi"
                                >
                                    <Download size={16} />
                                    Sloučit (bezpečné)
                                </button>
                                <button
                                    className="flex-1 px-3 py-2 bg-slate-700 hover:bg-red-500/20 hover:text-red-500 text-slate-300 text-xs md:text-sm font-medium rounded-md transition-colors flex items-center justify-center gap-2"
                                    onClick={() => executeImport('overwrite')}
                                    title="Kompletně přepíše současný postup"
                                >
                                    <Upload size={16} />
                                    Přepsat vše
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
