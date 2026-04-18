# Frontend (Next.js)

Frontend of the City Center project on Next.js App Router.

## Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create env file:
   ```bash
   cp .env.example .env.local
   ```
3. Start dev server:
   ```bash
   npm run dev
   ```

## Environment Variables

- `NEXT_PUBLIC_API_URL` - public backend API URL (must include `/api` or it will be appended automatically).

Example:

```env
NEXT_PUBLIC_API_URL=https://your-backend-domain.com/api
```

## Build and Deployment Check

Run local deploy checks before publishing:

```bash
npm run deploy:check
```

This runs:
- `npm run lint`
- `npm run build`

## Deployment (Vercel)

1. Import repository in Vercel.
2. Set **Root Directory** to `frontend`.
3. Add environment variable:
   - `NEXT_PUBLIC_API_URL=https://your-backend-domain.com/api`
4. Build command: `npm run build`
5. Start command: `npm run start`

`next.config.mjs` is configured with `output: "standalone"` for easier container/non-Vercel deployments too.
