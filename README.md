# Harbor

**Track:** Housing Dignity
**One-line pitch:** Harbor is an AI-powered housing resource navigator that helps people experiencing housing insecurity find realistic next steps by matching them to nearby resources, explaining why each option fits, and generating a dignity-centered action plan that can be shared with outreach workers.

## Problem

People experiencing housing insecurity don't just need a list of shelters. They need to know which resources actually fit their situation right now. A shelter may be nearby but closed, require ID, not allow pets, not serve families, not support their language, or be unreachable without a car. Harbor solves the "last-mile navigation" problem.

## Solution

Harbor is a personalized navigation layer between fragmented housing resources and the person who urgently needs help. It asks a few simple questions, ranks resources based on real constraints, explains *why* each option fits, and generates a personalized action plan: who to call, what to bring, what to say, and a backup option.

## Features

- **Mobile-first intake** — large buttons, minimal typing, calm and nonjudgmental language, with a "Use Maria demo persona" shortcut for smooth judging.
- **Explainable, ranked results** — every recommendation shows a match score, the reasons it matched, and possible concerns.
- **AI action plans with fallback** — a deterministic template always produces a usable plan; when an API key is present, Claude rewrites it into warmer, more specific language (including a Spanish call script).
- **Authenticated outreach dashboard** — outreach workers create an account or log in before viewing cases, recommendations, warm-handoff summaries, and the AI/keyword outreach-note parser.
- **Authenticated resource admin** — signed-in partner staff can toggle open-tonight, walk-ins, pets, ID requirements, hours, and reliability; changes immediately affect recommendations.
- **Privacy-first** — no account required, demo-data banners throughout, and copy/share is always manual.

## Tech Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS
- Deployed on Vercel
- Optional Anthropic Claude API for language generation (graceful fallback without it)
- Local TypeScript data; intake and admin overrides stored in `localStorage`

## How Vercel was used

Harbor is built with Next.js and deployed on Vercel, making it fast to access from phones, shelter kiosks, libraries, and outreach-worker devices without requiring installation. API routes run as serverless functions.

## How AI was used

AI is used for **language generation only** — turning deterministic recommendations into clear, respectful action plans and parsing free-text outreach notes into structured intake. AI is **never** used as a black-box eligibility decision maker. This keeps matching transparent and reduces hallucination risk. Both AI features degrade gracefully to deterministic logic when no API key is configured, so the demo always works.

## Matching algorithm

Recommendations use **deterministic scoring** (`lib/matching.ts`) across urgency, transportation, ID requirements, pets, family needs, accessibility, language, distance, and resource reliability. Each resource accumulates a score and a list of human-readable reasons and warnings, then results are sorted by score. This is fully transparent and reproducible.

## Responsible AI & privacy

- No account is required for people seeking help. Outreach and admin tools require a worker account through Supabase Auth.
- We do not claim live shelter availability — every screen reminds users to call to confirm.
- No legal or medical advice; if someone may be in immediate danger, the plan advises contacting emergency services or a crisis hotline.
- Only the information needed to build a plan is collected.

## Demo persona

**Maria** is in Santa Clara. She needs shelter tonight, has a dog, does not have ID, does not have a car, and prefers Spanish. Harbor recommends **SafeStay Santa Clara** because it accepts walk-ins, does not require ID, supports Spanish, allows pets, and is reachable by public transit — then builds a plan with who to call, what to bring, what to say, and a backup option.

## Getting started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000.

Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` from your Supabase project before using `/outreach` or `/admin`. `ANTHROPIC_API_KEY` is optional; the app works without it via deterministic fallbacks.

In Supabase Auth settings, add this redirect URL for local development:

```text
http://localhost:3000/auth/callback
```

For Vercel, add the deployed callback URL too:

```text
https://your-domain.vercel.app/auth/callback
```

To deploy: push to a Git repo and import into Vercel. Set the Supabase env vars, plus `ANTHROPIC_API_KEY` if you want richer AI-generated plans.

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Landing page |
| `/intake` | Mobile-first guided intake |
| `/results` | Ranked, explainable resource cards |
| `/plan` | AI/template action plan |
| `/login` | Outreach worker account creation and login |
| `/outreach` | Protected outreach worker dashboard + note parser |
| `/admin` | Protected resource management |
| `/api/generate-plan` | Action plan generation (AI + fallback) |
| `/api/extract-intake` | Outreach note parsing (AI + fallback) |

## Future roadmap

Verified nonprofit resource database, real-time shelter capacity integrations, SMS mode, voice intake for outreach workers, full multilingual support, consent-based sharing with case workers, integration with local coordinated entry workflows, and analytics for nonprofits to identify resource gaps.

---

*Resource data in this project is seeded from publicly listed Santa Clara County programs. Hours, bed availability, and intake rules can change quickly. Always call to confirm before traveling.*
