import { useMemo } from 'react';

export const useStats = (questions, progress) => {
    return useMemo(() => {
        const total = questions.length;
        const answered = Object.values(progress).filter(p => p.status).length;
        const correct = Object.values(progress).filter(p => p.status === 'correct').length;
        const incorrect = Object.values(progress).filter(p => p.status === 'incorrect').length;
        const struggled = Object.values(progress).filter(p => p.struggled).length;
        return { total, answered, correct, incorrect, struggled };
    }, [questions, progress]);
};
