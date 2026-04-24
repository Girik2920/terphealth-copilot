# TerpHealth Copilot

AI-powered healthcare navigation MVP for University of Maryland students.

TerpHealth Copilot helps students understand SHIP-like insurance benefits, choose the right level of care, estimate costs, find campus and nearby low-cost resources, and uncover hidden benefits.

## Features

- Home dashboard with Insurance Decoder, Smart Care Navigator, Mental Health & Wellness Hub, and Nearby Low-Cost Care.
- AI-style care recommendations in a fixed judge-friendly format.
- Claude API support through `ANTHROPIC_API_KEY`.
- Realistic mock fallback when no API key is present, so the demo still works.
- Pasted insurance text decoder with optional PDF upload UI.
- Cost estimator for UMD Health Center, urgent care, ER, and community/free clinic options.
- Hidden Benefits Finder for preventive care, vaccines, telehealth, prescriptions, counseling, screenings, and wellness programs.
- Demo scenario buttons for quick judging.

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

Open the Vite URL shown in the terminal, usually:

```bash
http://localhost:5173
```

The Express API runs at:

```bash
http://localhost:3001
```

## Anthropic Claude API

The app works without an API key by using mock navigator responses.

To use live Claude responses:

1. Copy `.env.example` to `.env`.
2. Add your key:

```bash
ANTHROPIC_API_KEY=your_key_here
```

3. Restart `npm run dev`.

The Claude integration lives in `server/index.js`. If the API call fails, the backend automatically falls back to mock responses.

## Important Disclaimer

This app is not medical advice. For emergencies call 911 or go to the ER.

## Scripts

```bash
npm run dev      # Runs Vite frontend and Express backend together
npm run client   # Runs only the Vite frontend
npm run server   # Runs only the Express backend
npm run build    # Builds the frontend
npm run lint     # Runs ESLint
```
