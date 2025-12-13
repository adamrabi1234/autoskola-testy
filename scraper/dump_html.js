const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    try {
        const browser = await puppeteer.launch({ headless: "new" });
        const page = await browser.newPage();
        console.log("Navigating...");
        await page.goto('https://etesty.md.gov.cz/ro/DLArea/Index');

        console.log("Waiting for sort button...");
        // Find link with text
        const sortButton = await page.evaluateHandle(() => {
            const links = Array.from(document.querySelectorAll('a, button'));
            return links.find(el => el.textContent.includes('Seřadit otázky podle kódu'));
        });

        if (sortButton) {
            console.log("Clicking sort...");
            await sortButton.click();
            // Wait for some content update. The URL doesn't change, so waitForNavigation might timeout if it's just AJAX.
            // We'll wait for the "Otázka č. 1" text to appear.
            await page.waitForFunction(() => document.body.innerText.includes('Otázka č. 1'), { timeout: 10000 });
            console.log("Sorted.");
        } else {
            console.error("Sort button not found");
        }

        const content = await page.content();
        fs.writeFileSync('page_dump.html', content);
        console.log("Dumped.");

        await browser.close();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
})();
