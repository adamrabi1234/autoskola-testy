import React from 'react';

export function QuestionGrid({ questions, filteredQuestions, progress, onSelectQuestion }) {
    return (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(60px,1fr))] gap-2">
            {filteredQuestions.map((q) => {
                const p = progress[q.id] || {};

                let baseClasses = "aspect-square flex items-center justify-center bg-slate-800 rounded-lg text-sm font-semibold text-slate-400 transition-all border border-transparent hover:-translate-y-0.5 hover:border-blue-500 hover:text-slate-100";

                if (p.status === 'correct') {
                    baseClasses = "aspect-square flex items-center justify-center rounded-lg text-sm font-semibold transition-all hover:-translate-y-0.5 border bg-green-500/10 text-green-500 border-green-500/20";
                } else if (p.status === 'incorrect') {
                    baseClasses = "aspect-square flex items-center justify-center rounded-lg text-sm font-semibold transition-all hover:-translate-y-0.5 border bg-red-500/10 text-red-500 border-red-500/20";
                }

                if (p.struggled) {
                    baseClasses += " !border-amber-500";
                }

                const originalIndex = questions.findIndex(orig => orig.id === q.id) + 1;

                return (
                    <button
                        key={q.id}
                        className={baseClasses}
                        onClick={() => onSelectQuestion(q)}
                    >
                        {originalIndex}
                    </button>
                );
            })}
        </div>
    );
}
