import { useState, useMemo } from 'react';
import questionsData from '../data/questions.json';

export const useQuestions = (progress) => {
    const [questions] = useState(questionsData);
    const [filter, setFilter] = useState('all');
    const [isShuffled, setIsShuffled] = useState(false);
    const [shuffledIndices, setShuffledIndices] = useState([]);

    const toggleShuffle = () => {
        if (!isShuffled) {
            const indices = Array.from({ length: questions.length }, (_, i) => i);
            for (let i = indices.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [indices[i], indices[j]] = [indices[j], indices[i]];
            }
            setShuffledIndices(indices);
            setIsShuffled(true);
        } else {
            setIsShuffled(false);
            setShuffledIndices([]);
        }
    };

    const filteredQuestions = useMemo(() => {
        const sourceQuestions = isShuffled
            ? shuffledIndices.map(i => questions[i])
            : questions;

        return sourceQuestions.filter(q => {
            if (!q) return false;
            const p = progress[q.id] || {};
            if (filter === 'all') return true;
            if (filter === 'struggled') return p.struggled;
            if (filter === 'incorrect') return p.status === 'incorrect';
            if (filter === 'correct') return p.status === 'correct';
            if (filter === 'unanswered') return !p.status;
            return true;
        });
    }, [questions, progress, filter, isShuffled, shuffledIndices]);

    return {
        questions,
        filter,
        setFilter,
        isShuffled,
        toggleShuffle,
        filteredQuestions
    };
};
