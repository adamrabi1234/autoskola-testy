const fs = require('fs');
const path = require('path');

(async () => {
    try {
        // Read the dump file
        const html = fs.readFileSync('page_dump.html', 'utf8');

        // Extract questionList
        const match = html.match(/const questionList=\[([\d,]+)\];/);
        if (!match) {
            console.error("Could not find questionList in dump.");
            process.exit(1);
        }

        const ids = match[1].split(',').map(Number);
        console.log(`Found ${ids.length} questions.`);

        const questions = [];
        const batchSize = 10;

        for (let i = 0; i < ids.length; i += batchSize) {
            const batch = ids.slice(i, i + batchSize);
            const promises = batch.map(async (id) => {
                try {
                    const res = await fetch(`https://etesty.md.gov.cz/api/v1/PublicWeb/Question/${id}`);
                    if (!res.ok) throw new Error(`Failed to fetch ${id}: ${res.status}`);
                    return await res.json();
                } catch (e) {
                    console.error(`Error fetching ${id}:`, e.message);
                    return null;
                }
            });

            const results = await Promise.all(promises);
            results.forEach(r => {
                if (r) questions.push(r);
            });

            process.stdout.write(`\rFetched ${questions.length}/${ids.length}`);
            // Small delay to be nice
            await new Promise(r => setTimeout(r, 200));
        }

        console.log("\nDone fetching.");
        fs.writeFileSync('questions.json', JSON.stringify(questions, null, 2));
        console.log("Saved to questions.json");

    } catch (e) {
        console.error(e);
    }
})();
