const fs = require('fs');
const questions = JSON.parse(fs.readFileSync('questions.json', 'utf8'));
const qIndex149 = questions[149];

let output = '';
output += `Question ID: ${qIndex149.id}\n`;
qIndex149.questionAnswers.forEach((a, i) => {
    output += `Answer ${i + 1} text: '${a.answerText}'\n`;
    output += `Answer ${i + 1} char codes: ${a.answerText.split('').map(c => c.charCodeAt(0)).join(', ')}\n`;
});

fs.writeFileSync('debug_output.txt', output);
