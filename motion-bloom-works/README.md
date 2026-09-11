# Recovery Path — Frontend

A calm, evidence-informed, interactive web application helping users understand potentially addictive habits, track recovery signals, and navigate lived-experience stories.

## Features
- **17 Curated Addiction Domains**: Clinical 5-question self-assessments with calibrated scoring bands (`Low`, `Moderate`, `High`).
- **🚨 4-7-8 SOS Urge De-escalator**: Interactive parasympathetic breathing circle, 3-minute Alan Marlatt Urge Surfing timer, and 5-4-3-2-1 somatic grounding checklist.
- **Private On-Device Dashboard**: Log daily mood and urge signals, select active emotional triggers, track daily micro-goals, and visualize 14-day recovery trends.
- **100% Client-Side Privacy**: Zero external user tracking, zero accounts needed; data is stored securely in local browser storage with one-click JSON backup export.
- **Community Story Library**: Filter and search recovery stories by category, keyword, or author with quick bookmarking.

## Tech Stack
- **Framework**: React 19, TypeScript
- **Routing & SSR**: TanStack Start, TanStack Router, Nitro
- **Styling**: Tailwind CSS v4, OKLCH color spaces, Industrial dark ink theme
- **Animations**: Motion (`motion/react`) spring physics & micro-interactions
- **Icons**: Lucide React

## Development

```bash
# Install dependencies
npm install

# Start development server (Default: http://localhost:8080)
npm run dev

# Build production bundle
npm run build

# Preview production build
npm run preview
```
