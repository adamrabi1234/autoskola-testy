# Autoškola eTesty Practice App

This is a React application to practice driving school test questions scraped from [etesty.md.gov.cz](https://etesty.md.gov.cz).

## Features
- **All 1151 Questions**: Scraped directly from the official source.
- **Practice Mode**: Select any question to practice.
- **Progress Tracking**: Tracks correct/incorrect answers and saves to local storage.
- **Struggle Marking**: Mark questions you struggle with to review later.
- **Filtering**: Filter by "Struggled", "Incorrect", or "Unanswered".
- **Media Support**: Displays images and videos for questions that have them.

## Setup

1. Navigate to the `app` directory:
   ```bash
   cd app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Data Update

To update the questions, run the scraper in the root directory:
```bash
node fetch_questions.js
```
Then copy `questions.json` to `app/src/data/questions.json`.
