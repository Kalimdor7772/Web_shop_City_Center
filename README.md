# Agent Antigravity

Monorepo with separate frontend and backend apps.

## Project Structure

```text
.
├─ backend/    # Express + Prisma API
├─ frontend/   # Next.js app
└─ package.json
```

## Root Scripts

- `npm run dev` - run backend and frontend together
- `npm run dev:backend` - run only backend
- `npm run dev:frontend` - run only frontend
- `npm run lint:frontend` - lint frontend
- `npm run build:frontend` - build frontend
- `npm run start:frontend` - start frontend production server
- `npm run deploy:frontend:check` - lint + build frontend

## Deployment Notes

- Frontend deployment guide: `frontend/README.md`
- For Vercel, set project root to `frontend`
