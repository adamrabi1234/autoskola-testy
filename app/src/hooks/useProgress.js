import { useState, useCallback } from 'react';

const STORAGE_KEY = 'autoskola_progress';

export const useProgress = () => {
    const [progress, setProgress] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : {};
    });

    const saveProgress = useCallback((newProgress) => {
        setProgress(newProgress);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newProgress));
    }, []);

    const updateAnswer = useCallback((questionId, answerId, isCorrect) => {
        // We rely on 'progress' being fresh due to dependency array
        const current = progress[questionId] || {};
        const newProgress = {
            ...progress,
            [questionId]: {
                ...current,
                status: isCorrect ? 'correct' : 'incorrect',
                selectedAnswerId: answerId
            }
        };
        saveProgress(newProgress);
    }, [progress, saveProgress]);

    const resetQuestion = useCallback((questionId) => {
        const newProgress = { ...progress };
        if (newProgress[questionId]) {
            // Remove specific properties by destroying and rebuilding or delete
            // To avoid unused vars from destructuring, we modify a copy
            const item = { ...newProgress[questionId] };
            delete item.status;
            delete item.selectedAnswerId;

            if (Object.keys(item).length === 0) {
                delete newProgress[questionId];
            } else {
                newProgress[questionId] = item;
            }
        }
        saveProgress(newProgress);
    }, [progress, saveProgress]);

    const resetAll = useCallback((filter) => {
        if (filter === 'all') {
            setProgress({});
            localStorage.removeItem(STORAGE_KEY);
        } else {
            const newProgress = { ...progress };
            let changed = false;

            Object.keys(newProgress).forEach(qId => {
                const p = newProgress[qId];

                if (filter === 'incorrect' && p.status === 'incorrect') {
                    delete newProgress[qId];
                    changed = true;
                } else if (filter === 'correct' && p.status === 'correct') {
                    delete newProgress[qId];
                    changed = true;
                } else if (filter === 'struggled' && p.struggled) {
                    newProgress[qId] = { ...p, struggled: false };
                    if (!newProgress[qId].status && !newProgress[qId].selectedAnswerId) {
                        delete newProgress[qId];
                    }
                    changed = true;
                }
            });

            if (changed) {
                saveProgress(newProgress);
            }
        }
    }, [progress, saveProgress]);

    const importProgress = useCallback((importedProgress, mode) => {
        if (mode === 'overwrite') {
            saveProgress(importedProgress);
        } else if (mode === 'merge') {
            const mergedProgress = { ...progress };

            Object.entries(importedProgress).forEach(([qId, data]) => {
                if (!mergedProgress[qId]) {
                    mergedProgress[qId] = data;
                } else {
                    const current = mergedProgress[qId];
                    mergedProgress[qId] = {
                        ...current,
                        ...((!current.status && data.status) ? data : {}),
                        struggled: current.struggled || data.struggled
                    };
                }
            });
            saveProgress(mergedProgress);
        }
    }, [progress, saveProgress]);

    const toggleStruggle = useCallback((questionId) => {
        const current = progress[questionId] || {};
        const newProgress = {
            ...progress,
            [questionId]: {
                ...current,
                struggled: !current.struggled
            }
        };
        saveProgress(newProgress);
    }, [progress, saveProgress]);

    return {
        progress,
        updateAnswer,
        resetQuestion,
        resetAll,
        importProgress,
        toggleStruggle
    };
};
