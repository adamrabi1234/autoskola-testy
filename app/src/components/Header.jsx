import React, { useState } from 'react';
import { Shuffle, Settings } from 'lucide-react';
import { SettingsModal } from './SettingsModal';

export function Header({ stats, isShuffled, onToggleShuffle, onResetAll, filter, onFilterChange, progress, onImportProgress }) {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    return (
        <>
            <header className="flex flex-col md:flex-row justify-between items-center mb-6 md:mb-8 pb-4 border-b border-slate-700 gap-4 md:gap-0">
                <div className="text-center md:text-left">
                    <h1 className="m-0 text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                        Autoškola eTesty
                    </h1>
                    <div className="flex flex-wrap justify-center md:justify-start gap-3 md:gap-4 text-xs md:text-sm text-slate-400 mt-2 md:mt-0">
                        <span>Celkem: {stats.total}</span>
                        <span className="text-green-500">Správně: {stats.correct}</span>
                        <span className="text-red-500">Chybné: {stats.incorrect}</span>
                        <span className="text-amber-500">K procvičení: {stats.struggled}</span>
                    </div>
                </div>

                <div className="flex flex-wrap justify-center gap-2 md:gap-4 items-center w-full md:w-auto">
                    <button
                        className={`flex items-center gap-2 px-3 py-2 md:px-4 rounded-md font-semibold transition-all text-sm md:text-base ${isShuffled
                            ? 'bg-blue-500 text-white hover:bg-blue-600'
                            : 'bg-transparent text-slate-400 hover:text-slate-100 hover:bg-white/5'
                            }`}
                        onClick={onToggleShuffle}
                        title={isShuffled ? "Vypnout náhodné pořadí" : "Zapnout náhodné pořadí"}
                    >
                        <Shuffle size={18} className="md:w-5 md:h-5" />
                        {isShuffled ? 'Náhodně' : 'Seřazeno'}
                    </button>

                    <select
                        value={filter}
                        onChange={(e) => onFilterChange(e.target.value)}
                        className="p-2 rounded-md bg-slate-800 text-slate-100 border border-slate-700 focus:outline-none focus:border-blue-500 text-sm md:text-base flex-1 md:flex-none max-w-[200px]"
                    >
                        <option value="all">Všechny</option>
                        <option value="unanswered">Nezodpovězené</option>
                        <option value="correct">Správné</option>
                        <option value="incorrect">Chybné</option>
                        <option value="struggled">K procvičení</option>
                    </select>

                    <button
                        className="flex items-center gap-2 px-3 py-2 md:px-4 rounded-md font-semibold bg-transparent text-slate-400 hover:text-slate-100 hover:bg-white/5 transition-all"
                        onClick={() => setIsSettingsOpen(true)}
                        title="Nastavení"
                    >
                        <Settings size={18} className="md:w-5 md:h-5" />
                    </button>
                </div>
            </header>

            <SettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                onResetAll={onResetAll}
                filter={filter}
                stats={stats}
                progress={progress}
                onImportProgress={onImportProgress}
            />
        </>
    );
}
