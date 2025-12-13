import { useEffect } from 'react';

interface MediaContent {
    mediaUrl: string;
    mediaFormatCode?: string;
}

interface Answer {
    mediaContent?: MediaContent;
}

interface Question {
    id: number;
    mediaContent?: MediaContent;
    questionAnswers: Answer[];
}

export function useMediaPreloader(selectedQuestion: Question | null, filteredQuestions: Question[]) {
    useEffect(() => {
        if (!selectedQuestion) return;

        const currentIndex = filteredQuestions.findIndex(q => q.id === selectedQuestion.id);
        if (currentIndex === -1) return;

        const questionsToPreload: Question[] = [];
        if (currentIndex > 0) {
            questionsToPreload.push(filteredQuestions[currentIndex - 1]);
        }
        if (currentIndex < filteredQuestions.length - 1) {
            questionsToPreload.push(filteredQuestions[currentIndex + 1]);
        }

        questionsToPreload.forEach(q => {
            if (q.mediaContent) {
                const mediaUrl = `https://etesty.md.gov.cz${q.mediaContent.mediaUrl}`;
                const isVideo = q.mediaContent.mediaFormatCode?.includes('video');

                if (isVideo) {
                    const video = document.createElement('video');
                    video.src = mediaUrl;
                    video.preload = 'auto';
                } else {
                    const img = new Image();
                    img.src = mediaUrl;
                }
            }

            // Preload answer images
            q.questionAnswers.forEach(a => {
                if (a.mediaContent) {
                    const answerMediaUrl = `https://etesty.md.gov.cz${a.mediaContent.mediaUrl}`;
                    const img = new Image();
                    img.src = answerMediaUrl;
                }
            });
        });
    }, [selectedQuestion, filteredQuestions]);
}
