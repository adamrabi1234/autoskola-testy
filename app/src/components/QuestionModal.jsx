import React, { useState, useEffect, useRef } from 'react';
import { AlertCircle, CheckCircle, XCircle, Maximize2, FastForward } from 'lucide-react';
import { Lightbox } from './Lightbox';
import { useSwipe } from '../hooks/useSwipe';

export function QuestionModal({ question, progress, originalIndex, onClose, onAnswer, onReset, onToggleStruggle, onNext, onPrev }) {
    const [selectedAnswer, setSelectedAnswer] = useState(progress.selectedAnswerId || null);
    const [showResult, setShowResult] = useState(!!progress.status);
    const [zoomedImage, setZoomedImage] = useState(null);
    const [autoAdvance, setAutoAdvance] = useState(() => localStorage.getItem('autoskola_autoadvance') === 'true');
    const timeoutRef = useRef(null);

    const swipeHandlers = useSwipe({
        onSwipeLeft: onNext,
        onSwipeRight: onPrev,
        threshold: 70
    });

    // Effect for auto-advance timeout cleanup
    useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    const toggleAutoAdvance = () => {
        const newValue = !autoAdvance;
        setAutoAdvance(newValue);
        localStorage.setItem('autoskola_autoadvance', newValue);
    };

    const handleSelect = (answerId) => {
        if (showResult) return;
        setSelectedAnswer(answerId);

        const isCorrect = question.questionAnswers.find(a => a.id === answerId)?.isCorrect;
        onAnswer(question.id, answerId, isCorrect);
        setShowResult(true);

        if (autoAdvance) {
            timeoutRef.current = setTimeout(() => {
                onNext();
            }, 2000);
        }
    };

    const handleResetClick = () => {
        onReset(question.id);
        setSelectedAnswer(null);
        setShowResult(false);
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                onPrev();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                onNext();
            } else if (e.key === 'Escape') {
                e.preventDefault();
                if (zoomedImage) {
                    setZoomedImage(null);
                } else {
                    onClose();
                }
            } else if (e.key === 'r' || e.key === 'R') {
                if (showResult) {
                    onReset(question.id);
                    setSelectedAnswer(null);
                    setShowResult(false);
                }
            } else if (e.key === 'm' || e.key === 'M') {
                onToggleStruggle(question.id);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onPrev, onNext, onClose, zoomedImage, showResult, question.id, onToggleStruggle, onReset]);

    const mediaUrl = question.mediaContent
        ? `https://etesty.md.gov.cz${question.mediaContent.mediaUrl}`
        : null;

    const isVideo = question.mediaContent?.mediaFormatCode?.includes('video');

    return (
        <>
            <div className="fixed inset-0 bg-black/70 backdrop-blur-[4px] flex items-center justify-center z-[100] p-0 md:p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
                <div
                    className="bg-slate-800 md:rounded-xl w-full max-w-[800px] h-full md:h-auto md:max-h-[90vh] shadow-2xl flex flex-col overflow-hidden animate-[slideUp_0.3s_ease-out]"
                    {...swipeHandlers}
                >
                    <div className="px-4 py-3 md:px-6 md:py-2 border-b border-slate-700 flex justify-between items-center shrink-0">
                        <div className="flex items-center gap-3 md:gap-4">
                            <span className="font-bold text-slate-400 text-sm md:text-base">
                                Otázka {originalIndex}
                            </span>
                            <button
                                className={`flex items-center gap-2 p-1.5 md:p-2 rounded-md transition-all border ${progress.struggled ? 'bg-amber-500/10 text-amber-500 border-amber-500/50' : 'border-transparent text-slate-400 hover:bg-white/5 hover:text-slate-100'}`}
                                onClick={() => onToggleStruggle(question.id)}
                                title="Označit k procvičení"
                            >
                                <AlertCircle size={18} />
                            </button>
                            {showResult && (
                                <button
                                    className="px-2 py-1 text-xs md:text-sm rounded bg-transparent text-slate-400 hover:text-slate-100 hover:bg-white/5 transition-colors"
                                    onClick={handleResetClick}
                                    title="Resetovat otázku"
                                >
                                    Resetovat
                                </button>
                            )}
                        </div>
                        <button className="p-1 md:p-2 text-slate-400 hover:text-slate-100 hover:bg-white/5 rounded transition-colors" onClick={onClose}><XCircle size={24} /></button>
                    </div>

                    <div className="p-4 md:p-6 overflow-y-auto flex-1">
                        <div className="text-lg md:text-xl leading-relaxed mb-4 md:mb-6">{question.questionText}</div>

                        {mediaUrl && (
                            <div className="mb-4 md:mb-6 rounded-lg overflow-hidden bg-black relative shrink-0">
                                {isVideo ? (
                                    <video src={mediaUrl} controls autoPlay loop className="max-w-full block mx-auto max-h-[25vh] md:max-h-[40vh]" />
                                ) : (
                                    <div
                                        className="cursor-zoom-in relative group"
                                        onClick={() => setZoomedImage(mediaUrl)}
                                        title="Kliknutím zvětšíte"
                                    >
                                        <img src={mediaUrl} alt="Question media" className="max-w-full block mx-auto max-h-[25vh] md:max-h-[40vh] object-contain" />
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/60 text-white p-4 rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"><Maximize2 size={20} /></div>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="flex flex-col gap-2 md:gap-3">
                            {question.questionAnswers.map(a => {
                                let baseClasses = "p-3 md:p-4 text-left border rounded-lg transition-all flex items-center gap-3 md:gap-4 min-h-[3rem] md:min-h-[3.5rem] ";
                                const isSelected = selectedAnswer === a.id;
                                const isCorrect = a.isCorrect;

                                if (showResult) {
                                    if (isCorrect) {
                                        baseClasses += "border-green-500 bg-green-500/10 text-slate-100";
                                    } else if (isSelected && !isCorrect) {
                                        baseClasses += "border-red-500 bg-red-500/15 text-slate-100";
                                    } else {
                                        baseClasses += "bg-white/5 border-slate-700 text-slate-100 opacity-50";
                                    }
                                } else {
                                    if (isSelected) {
                                        baseClasses += "border-blue-500 bg-blue-500/10 text-slate-100";
                                    } else {
                                        baseClasses += "bg-white/5 border-slate-700 text-slate-100 hover:bg-white/10";
                                    }
                                }

                                const answerMediaUrl = a.mediaContent
                                    ? `https://etesty.md.gov.cz${a.mediaContent.mediaUrl}`
                                    : null;

                                return (
                                    <button
                                        key={a.id}
                                        className={baseClasses}
                                        onClick={() => handleSelect(a.id)}
                                        disabled={showResult}
                                    >
                                        <div className="font-bold min-w-[20px] md:min-w-[24px] text-sm md:text-base">{String.fromCharCode(64 + a.sortOrderNumber)}</div>
                                        <div className="flex flex-col gap-2 w-full">
                                            {answerMediaUrl && (
                                                <img
                                                    src={answerMediaUrl}
                                                    alt="Answer"
                                                    className="max-h-[100px] md:max-h-[150px] w-auto max-w-full rounded border border-slate-700 cursor-zoom-in hover:opacity-90 self-start object-contain"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setZoomedImage(answerMediaUrl);
                                                    }}
                                                />
                                            )}
                                            {a.answerText?.trim() !== '.' && <div className="text-sm md:text-base">{a.answerText}</div>}
                                        </div>
                                        {showResult && isCorrect && <CheckCircle size={20} className="ml-auto text-green-500 shrink-0" />}
                                        {showResult && isSelected && !isCorrect && <XCircle size={20} className="ml-auto text-red-500 shrink-0" />}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="p-4 md:p-6 border-t border-slate-700 flex justify-between items-center shrink-0 bg-slate-800">
                        <div className="flex items-center gap-4">
                            <button className="px-3 py-2 md:px-4 md:py-2 rounded-md font-semibold text-sm md:text-base text-slate-400 hover:text-slate-100 hover:bg-white/5 transition-colors" onClick={onPrev}>Předchozí</button>
                            <button
                                className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors text-sm ${autoAdvance ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'text-slate-500 hover:text-slate-300'}`}
                                onClick={toggleAutoAdvance}
                                title={autoAdvance ? "Automatický posun: Zapnuto" : "Automatický posun: Vypnuto"}
                            >
                                <FastForward size={18} />
                                <span className="hidden md:inline">{autoAdvance ? 'Auto' : 'Auto'}</span>
                            </button>
                        </div>
                        <button className="px-3 py-2 md:px-4 md:py-2 rounded-md font-semibold text-sm md:text-base bg-blue-500 text-white hover:bg-blue-600 transition-colors" onClick={onNext}>Další</button>
                    </div>
                </div>
            </div>

            <Lightbox image={zoomedImage} onClose={() => setZoomedImage(null)} />
        </>
    );
}
