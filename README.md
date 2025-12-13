# Autoškola eTesty Practice App

This is a React application to practice driving school test questions scraped from [etesty.md.gov.cz](https://etesty.md.gov.cz).

## Features

- **All 1151 Questions**: Scraped directly from the official source.
- **Practice Mode**: Browse questions in a grid or view them one-by-one in a focused modal.
- **Progress Tracking**: 
  - Tracks correct and incorrect answers.
  - Automatically saves progress to your browser's local storage.
- **Struggle Marking**: Mark questions you find difficult ("Struggle") to review them later.
- **Smart Filtering**: Filter questions by:
  - **All Questions**
  - **Struggled** (Marked for review)
  - **Incorrect** (Questions you got wrong)
  - **Correct** (Questions you got right)
  - **Unanswered** (New questions)
- **Shuffle Mode**: Randomize the order of questions to test your knowledge without relying on memory of the sequence.
- **Zoomable Media**: View high-resolution images and videos with zoom and pan capabilities for detailed inspection.
- **Bulk Actions**: Reset progress for specific categories (e.g., clear only "Incorrect" answers to retry them).

## Tech Stack

- **React 19**: Utilizing the latest React features.
- **Tailwind CSS 4**: Modern, utility-first styling.
- **Vite**: Fast development build tool.
- **React Zoom Pan Pinch**: Smooth image interaction.

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

To update the questions with the latest data from the official site:

1. Run the scraper in the root directory:
   ```bash
   node fetch_questions.js
   ```
2. Copy the generated `questions.json` to the app's data directory:
   ```bash
   cp questions.json app/src/data/questions.json
   ```
