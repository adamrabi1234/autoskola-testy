import { useState, useEffect, useMemo } from 'react';
import questionsData from './data/questions.json';
import './index.css';
import { Header } from './components/Header';
import { QuestionGrid } from './components/QuestionGrid';
import { QuestionModal } from './components/QuestionModal';

import { useMediaPreloader } from './hooks/useMediaPreloader';

const STORAGE_KEY = 'autoskola_progress';

function App() {
  const [questions, setQuestions] = useState([]);
  const [progress, setProgress] = useState({});
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [filter, setFilter] = useState('all');
  const [isShuffled, setIsShuffled] = useState(false);
  const [shuffledIndices, setShuffledIndices] = useState([]);

  useEffect(() => {
    setQuestions(questionsData);
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setProgress(JSON.parse(saved));
    }
  }, []);

  const saveProgress = (newProgress) => {
    setProgress(newProgress);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newProgress));
  };

  const handleAnswer = (questionId, answerId, isCorrect) => {
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
  };

  const handleReset = (questionId) => {
    const newProgress = { ...progress };
    if (newProgress[questionId]) {
      const { status, selectedAnswerId, ...rest } = newProgress[questionId];
      if (Object.keys(rest).length === 0) {
        delete newProgress[questionId];
      } else {
        newProgress[questionId] = rest;
      }
    }
    saveProgress(newProgress);
  };

  const handleResetAll = () => {
    // Confirmation is now handled in Header component
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
          // Keep answer status but remove struggled mark
          newProgress[qId] = { ...p, struggled: false };
          // If nothing else is stored, remove the entry entirely
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
  };

  const toggleShuffle = () => {
    if (!isShuffled) {
      // Create array of indices [0, 1, ... n]
      const indices = Array.from({ length: questions.length }, (_, i) => i);
      // Fisher-Yates shuffle
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

  const toggleStruggle = (questionId) => {
    const current = progress[questionId] || {};
    const newProgress = {
      ...progress,
      [questionId]: {
        ...current,
        struggled: !current.struggled
      }
    };
    saveProgress(newProgress);
  };

  const filteredQuestions = useMemo(() => {
    // If shuffled, use the shuffled indices to map to questions
    const sourceQuestions = isShuffled
      ? shuffledIndices.map(i => questions[i])
      : questions;

    return sourceQuestions.filter(q => {
      if (!q) return false; // Safety check
      const p = progress[q.id] || {};
      if (filter === 'all') return true;
      if (filter === 'struggled') return p.struggled;
      if (filter === 'incorrect') return p.status === 'incorrect';
      if (filter === 'correct') return p.status === 'correct';
      if (filter === 'unanswered') return !p.status;
      return true;
    });
  }, [questions, progress, filter, isShuffled, shuffledIndices]);

  useMediaPreloader(selectedQuestion, filteredQuestions);

  const stats = useMemo(() => {
    const total = questions.length;
    const answered = Object.values(progress).filter(p => p.status).length;
    const correct = Object.values(progress).filter(p => p.status === 'correct').length;
    const incorrect = Object.values(progress).filter(p => p.status === 'incorrect').length;
    const struggled = Object.values(progress).filter(p => p.struggled).length;
    return { total, answered, correct, incorrect, struggled };
  }, [questions, progress]);

  return (
    <div className="max-w-[1200px] mx-auto p-4 md:p-8">
      <Header
        stats={stats}
        isShuffled={isShuffled}
        onToggleShuffle={toggleShuffle}
        onResetAll={handleResetAll}
        filter={filter}
        onFilterChange={setFilter}
      />

      <QuestionGrid
        questions={questions}
        filteredQuestions={filteredQuestions}
        progress={progress}
        onSelectQuestion={setSelectedQuestion}
      />

      {selectedQuestion && (
        <QuestionModal
          question={selectedQuestion}
          progress={progress[selectedQuestion.id] || {}}
          originalIndex={questions.findIndex(orig => orig.id === selectedQuestion.id) + 1}
          onClose={() => setSelectedQuestion(null)}
          onAnswer={handleAnswer}
          onReset={handleReset}
          onToggleStruggle={toggleStruggle}
          onNext={() => {
            const idx = filteredQuestions.findIndex(q => q.id === selectedQuestion.id);
            if (idx < filteredQuestions.length - 1) {
              setSelectedQuestion(filteredQuestions[idx + 1]);
            }
          }}
          onPrev={() => {
            const idx = filteredQuestions.findIndex(q => q.id === selectedQuestion.id);
            if (idx > 0) {
              setSelectedQuestion(filteredQuestions[idx - 1]);
            }
          }}
        />
      )}
    </div>
  );
}

export default App;
