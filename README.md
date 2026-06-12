# GitHub Insights Dashboard

A dashboard that loads **live data from the GitHub REST API** and presents profile stats, language breakdown, activity sparkline, and a paginated repository table.

## Tech stack

- React 19 + TypeScript
- Vite
- React Router
- ESLint + Prettier

## Scripts

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

## Architecture

```
src/
  api/           # HTTP client, cache, GitHub endpoints
  hooks/         # useGithubDashboard, useGithubActivity, useGithubRepos
  features/      # dashboard UI
  components/    # shared layout, sparkline, pagination
  types/         # API response types
  utils/         # formatting, activity, rate-limit helpers
api/
  github/        # Vercel serverless proxy (production)
```

### Data flow

1. Browser calls `/api/github/*` (same-origin proxy).
2. Proxy forwards to GitHub with optional `Authorization` header.
3. Hooks consume typed API helpers; responses are cached client-side.
