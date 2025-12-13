const fs = require('fs');
const questions = JSON.parse(fs.readFileSync('questions.json', 'utf8'));
const q150 = questions.find(q => q.id === 223); // Wait, I need to find the question the user was talking about. 
// The user said "question number 150". In the previous turn I assumed it was index 149.
// Let's check index 149 again and print the answerText character codes.

const qIndex149 = questions[149];
console.log("Question at index 149 ID:", qIndex149.id);
console.log("Question Text:", qIndex149.questionText);
qIndex149.questionAnswers.forEach((a, i) => {
    console.log(`Answer ${i + 1} text: '${a.answerText}'`);
    console.log(`Answer ${i + 1} char codes:`, a.answerText.split('').map(c => c.charCodeAt(0)));
});
