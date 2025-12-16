import { useState } from 'react';
import './index.css';
import { Header } from './components/Header';
import { QuestionGrid } from './components/QuestionGrid';
import { QuestionModal } from './components/QuestionModal';

import { useMediaPreloader } from './hooks/useMediaPreloader';
import { useProgress } from './hooks/useProgress';
import { useQuestions } from './hooks/useQuestions';
import { useStats } from './hooks/useStats';

function App() {
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  const {
    progress,
    updateAnswer,
    resetQuestion,
    resetAll,
    importProgress,
    toggleStruggle
  } = useProgress();

  const {
    questions,
    filter,
    setFilter,
    isShuffled,
    toggleShuffle,
    filteredQuestions
  } = useQuestions(progress);

  const stats = useStats(questions, progress);

  useMediaPreloader(selectedQuestion, filteredQuestions);

  return (
    <div className="max-w-[1200px] mx-auto p-4 md:p-8">
      <Header
        stats={stats}
        isShuffled={isShuffled}
        onToggleShuffle={toggleShuffle}
        onResetAll={() => resetAll(filter)}
        filter={filter}
        onFilterChange={setFilter}
        progress={progress}
        onImportProgress={importProgress}
      />

      <QuestionGrid
        questions={questions}
        filteredQuestions={filteredQuestions}
        progress={progress}
        onSelectQuestion={setSelectedQuestion}
      />

      {selectedQuestion && (
        <QuestionModal
          key={selectedQuestion.id}
          question={selectedQuestion}
          progress={progress[selectedQuestion.id] || {}}
          originalIndex={questions.findIndex(orig => orig.id === selectedQuestion.id) + 1}
          onClose={() => setSelectedQuestion(null)}
          onAnswer={updateAnswer}
          onReset={resetQuestion}
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
