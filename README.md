# DignityLink

**Track:** Housing Dignity
**One-line pitch:** DignityLink is an AI-powered housing resource navigator that helps people experiencing housing insecurity find realistic next steps by matching them to nearby resources, explaining why each option fits, and generating a dignity-centered action plan that can be shared with outreach workers.

## Problem

People experiencing housing insecurity don't just need a list of shelters. They need to know which resources actually fit their situation right now. A shelter may be nearby but closed, require ID, not allow pets, not serve families, not support their language, or be unreachable without a car. DignityLink solves the "last-mile navigation" problem.

## Solution

DignityLink is a personalized navigation layer between fragmented housing resources and the person who urgently needs help. It asks a few simple questions, ranks resources based on real constraints, explains *why* each option fits, and generates a personalized action plan: who to call, what to bring, what to say, and a backup option.

## Features

- **Mobile-first intake** — large buttons, minimal typing, calm and nonjudgmental language, with a "Use Maria demo persona" shortcut for smooth judging.
- **Explainable, ranked results** — every recommendation shows a match score, the reasons it matched, and possible concerns.
- **AI action plans with fallback** — a deterministic template always produces a usable plan; when an API key is present, Claude rewrites it into warmer, more specific language (including a Spanish call script).
- **Outreach dashboard** — case list, recommended + backup resource, follow-up status, copyable warm-handoff summaries, and an AI/keyword outreach-note parser that turns messy notes into structured intake.
- **Resource admin** — partner organizations can toggle open-tonight, walk-ins, pets, ID requirements, hours, and reliability; changes immediately affect recommendations.
- **Privacy-first** — no account required, demo-data banners throughout, and copy/share is always manual.

## Tech Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS
- Deployed on Vercel
- Optional Anthropic Claude API for language generation (graceful fallback without it)
- Local TypeScript data; intake and admin overrides stored in `localStorage`

## How Vercel was used

DignityLink is built with Next.js and deployed on Vercel, making it fast to access from phones, shelter kiosks, libraries, and outreach-worker devices without requiring installation. API routes run as serverless functions.

## How AI was used

AI is used for **language generation only** — turning deterministic recommendations into clear, respectful action plans and parsing free-text outreach notes into structured intake. AI is **never** used as a black-box eligibility decision maker. This keeps matching transparent and reduces hallucination risk. Both AI features degrade gracefully to deterministic logic when no API key is configured, so the demo always works.

## Matching algorithm

Recommendations use **deterministic scoring** (`lib/matching.ts`) across urgency, transportation, ID requirements, pets, family needs, accessibility, language, distance, and resource reliability. Each resource accumulates a score and a list of human-readable reasons and warnings, then results are sorted by score. This is fully transparent and reproducible.

## Responsible AI & privacy

- No account required. Sensitive details are used only to create a plan and can be cleared anytime.
- We do not claim live shelter availability — every screen reminds users to call to confirm.
- No legal or medical advice; if someone may be in immediate danger, the plan advises contacting emergency services or a crisis hotline.
- Only the information needed to build a plan is collected.

## Demo persona

**Maria** is in Santa Clara. She needs shelter tonight, has a dog, does not have ID, does not have a car, and prefers Spanish. DignityLink recommends **SafeStay Santa Clara** because it accepts walk-ins, does not require ID, supports Spanish, allows pets, and is reachable by public transit — then builds a plan with who to call, what to bring, what to say, and a backup option.

## Getting started

```bash
npm install
cp .env.example .env.local   # optional: add ANTHROPIC_API_KEY for richer plans
npm run dev
```

Open http://localhost:3000.

To deploy: push to a Git repo and import into Vercel. Set `ANTHROPIC_API_KEY` in the Vercel project settings (optional). The app works fully without it via deterministic fallbacks.

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Landing page |
| `/intake` | Mobile-first guided intake |
| `/results` | Ranked, explainable resource cards |
| `/plan` | AI/template action plan |
| `/outreach` | Outreach worker dashboard + note parser |
| `/admin` | Resource management (demo mode) |
| `/api/generate-plan` | Action plan generation (AI + fallback) |
| `/api/extract-intake` | Outreach note parsing (AI + fallback) |

## Future roadmap

Verified nonprofit resource database, real-time shelter capacity integrations, SMS mode, voice intake for outreach workers, full multilingual support, consent-based sharing with case workers, integration with local coordinated entry workflows, and analytics for nonprofits to identify resource gaps.

---

*All resource data in this project is fictional demo data for Santa Clara, CA. Availability is not guaranteed. Always call to confirm before traveling.*
